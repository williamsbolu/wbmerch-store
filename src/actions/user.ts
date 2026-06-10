"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { changePasswordSchema, RegisterSchema, userSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/lib/s3";
import cloudFront from "@/lib/cloudFront";
import { currentUser } from "@/lib/auth";

export const removeApplicationUser = async (id: string) => {
  const user = await currentUser();

  if (!user || user?.role !== "ADMIN") {
    return { error: "You are not authorized to perform this action" };
  }

  await db.user.update({
    where: {
      id,
    },
    data: {
      role: "USER",
    },
  });

  revalidatePath("/admin/users");
  return { success: "User removed successfully" };
};

export const deleteUser = async (id: string) => {
  const user = await currentUser();

  if (!user || user?.role !== "ADMIN") {
    return { error: "You are not authorized to perform this action" };
  }

  // Delete user's image for our storage
  const userToDelete = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      image: true,
    },
  });

  if (
    userToDelete?.image &&
    userToDelete?.image?.startsWith("https://dwirvaqvo77ym.cloudfront.net/")
  ) {
    const imageName = userToDelete.image.split(".net/").pop();

    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
    });
    await s3.send(command);
  }

  await db.user.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/users");
  return { success: "User deleted successfully" };
};

export const createApplicationUsers = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const user = await currentUser();

  if (!user || user?.role !== "ADMIN") {
    return { error: "You are not authorized to perform this action" };
  }

  // 1. Server side validation
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // 2. Get the data and hash the user password
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. check for if that user exist already
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 4. Create the user
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "GUEST",
    },
  });

  revalidatePath("/admin/users");
  return {
    success:
      "Account successfully created! User should verify the account from his/her email address.",
  };
};

export const changePassword = async (
  values: z.infer<typeof changePasswordSchema>
) => {
  const session = await auth();

  if (!session || session?.user.isOAuth) {
    return { error: "Cannot change password for OAuth users" };
  }

  const validatedFields = changePasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const { password, newPassword } = validatedFields.data;

  const dbUser = await getUserById(session.user.id as string);
  const passwordMatch = await bcrypt.compare(password, dbUser?.password!);

  if (!passwordMatch) return { error: "Incorrect password" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // remove the newPassword field for update from the values object
  values.password = hashedPassword;
  values.newPassword = undefined!;

  const updatedUser = await db.user.update({
    where: {
      id: dbUser?.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "Password Updated" };
};

export const updateUserInformation = async (
  values: z.infer<typeof userSchema>
) => {
  const session = await auth();

  const validatedFields = userSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields" };

  values.email = undefined!;

  await db.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "Profile information updated" };
};

export const updateAdminInformation = async (formData: FormData) => {
  const session = await auth();

  const doc = await db.user.findUnique({ where: { id: session?.user.id } });

  if (!doc) return { error: "User not found" };

  const name = formData.get("name") as string;
  const imageInput = formData.get("image") as File;

  if (name.length <= 1 || name.length >= 30) {
    return { error: "Name must be between 2 and 30 characters" };
  }

  let userFileName: string | undefined;
  const hasImage = doc?.image?.startsWith(
    "https://dwirvaqvo77ym.cloudfront.net/"
  );
  if (doc?.image && hasImage) {
    // If an uploaded image exist already
    userFileName = doc.image.split(".net/").pop();
  } else {
    userFileName = `user-${doc?.id}-${Date.now()}.jpg`;
  }

  if (imageInput) {
    const imageBuffer = Buffer.from(await imageInput.arrayBuffer());
    const buffer = await sharp(imageBuffer)
      .resize(500, 500)
      .toFormat("jpg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: userFileName,
      Body: buffer,
      ContentType: "image/jpeg",
    });
    await s3.send(command);

    // We only invalidate when we're updating and image not creating to avoid errors
    if (hasImage) {
      const invalidationParams = {
        DistributionId: process.env.DUSTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `${userFileName}-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/" + userFileName],
          },
        },
      };
      const invalidationCommand = new CreateInvalidationCommand(
        invalidationParams
      );
      await cloudFront.send(invalidationCommand);
    }
  }

  await db.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      name,
      ...(imageInput && { image: process.env.CLOUD_FRONT_URL + userFileName! }),
    },
  });

  return { success: "Profile information updated" };
};
