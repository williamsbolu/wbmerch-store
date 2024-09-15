"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { changePasswordSchema, userSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserById } from "@/data/user";

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
