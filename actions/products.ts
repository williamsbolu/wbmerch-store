"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import uniqid from "uniqid";
import slugify from "slugify";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import s3 from "@/lib/s3";
import sharp from "sharp";
import { Category, Collection, Gender } from "@prisma/client";
import cloudFront from "@/lib/cloudFront";

// Define a schema for server-side validation
const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  collection: z.string().min(1).optional(),
  gender: z.string().min(1).optional(),
  price: z.number().positive(),
  totalStock: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative().optional(),
  sizes: z.record(z.string(), z.number().int().nonnegative()).optional(),
});

export async function createProduct(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === "USER") {
    return { error: "You are not authorized to perform this action" };
  }

  const coverImage = formData.get("coverImage") as File;
  const images = formData.getAll("images") as File[];

  const data = {
    name: formData.get("name") as string,
    category: formData.get("category") as Category,
    collection: (formData.get("collection") as Collection) || undefined,
    gender: (formData.get("gender") as Gender) || undefined,
    price: Number(formData.get("price")),
    totalStock: Number(formData.get("totalStock")),
    sizes: formData.get("sizes")
      ? JSON.parse(formData.get("sizes") as string)
      : undefined,
    stock: formData.get("stock") ? Number(formData.get("stock")) : undefined,
  };

  // Server-side validation
  const validatedData = productSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Pls enter the correct input details" };
  }

  const existingProductName = await db.products.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingProductName) {
    return { error: "Product with this name already exists" };
  }

  // convert the coverImage to buffer
  const coverImageBuffer = Buffer.from(await coverImage.arrayBuffer());
  const fileName = uniqid(
    `${slugify(data.name, { lower: true })}-`,
    `${Date.now().toString()}.jpg`
  );
  const buffer = await sharp(coverImageBuffer)
    .resize(700, 700, {
      fit: "contain",
      background: { r: 243, g: 243, b: 243 },
    })
    .flatten({ background: "#f3f3f3" })
    .toFormat("jpg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: "image/jpg",
  });

  await s3.send(command);

  // If we're adding the images
  let imagesLinksArray: string[] = [];
  if (images?.length > 0) {
    await Promise.all(
      images.map(async (image, i) => {
        const curBuffer = Buffer.from(await image.arrayBuffer());

        const curFileName = uniqid(
          `${slugify(data.name, { lower: true })}-slides-${i + 1}-`,
          `${Date.now().toString()}.jpg`
        );

        // resize the image to the app specific size
        const buffer = await sharp(curBuffer)
          .resize(700, 700, {
            fit: "contain",
            background: { r: 243, g: 243, b: 243 },
          })
          .flatten({ background: "#f3f3f3" })
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toBuffer();

        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: curFileName,
          Body: buffer,
          ContentType: "image/jpg",
        });
        await s3.send(command);
        imagesLinksArray.push(process.env.CLOUD_FRONT_URL + curFileName);
      })
    );
  }

  const doc = await db.products.create({
    data: {
      ...data,
      coverImage: process.env.CLOUD_FRONT_URL + fileName,
      images: imagesLinksArray,
      slug: slugify(data.name, { lower: true }),
    },
  });

  revalidatePath("/admin/products");
  return { success: "Product created", data: doc };
}

export async function deleteProduct(productId: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === "USER") {
    return { error: "You are not authorized to perform this action" };
  }

  const doc = await db.products.findUnique({
    where: { id: productId },
    select: { coverImage: true, images: true },
  });

  if (!doc) return { error: "Product not found" };

  // Delete cover image from s3 storage
  const imageName = doc.coverImage.split(".net/").pop();

  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: imageName,
  });
  await s3.send(command);

  // Delete the other images if they are also available in the bucket
  if (doc.images.length > 0) {
    await Promise.all(
      doc.images.map(async (image: string) => {
        const imageName = image.split(".net/").pop();

        const curCommand = new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: imageName,
        });
        await s3.send(curCommand);
      })
    );
  }

  // delete the product from the database
  await db.products.delete({ where: { id: productId } });

  revalidatePath("/admin/products");
  return { success: "Product deleted" };
}

export async function updateProduct(formData: FormData, productId: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === "USER") {
    return { error: "You are not authorized to perform this action" };
  }

  const coverImage = formData.get("coverImage") as File;
  const images = formData.getAll("images") as File[];

  const data = {
    name: formData.get("name") as string,
    category: formData.get("category") as Category,
    collection: (formData.get("collection") as Collection) || undefined,
    gender: (formData.get("gender") as Gender) || undefined,
    price: Number(formData.get("price")),
    totalStock: Number(formData.get("totalStock")),
    sizes: formData.get("sizes")
      ? JSON.parse(formData.get("sizes") as string)
      : undefined,
    stock: formData.get("stock") ? Number(formData.get("stock")) : undefined,
  };

  // Server-side validation
  const validatedData = productSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Pls enter the correct input details" };
  }

  const doc = await db.products.findUnique({
    where: { id: productId },
    select: { coverImage: true, images: true },
  });

  if (!doc) {
    return { error: "Product not found" };
  }

  if (coverImage) {
    const coverImageFileName = doc.coverImage.split(".net/").pop();
    const coverImageBuffer = Buffer.from(await coverImage.arrayBuffer());
    const buffer = await sharp(coverImageBuffer)
      .resize(700, 700, {
        fit: "contain",
        background: { r: 243, g: 243, b: 243 },
      })
      .flatten({ background: "#f3f3f3" })
      .toFormat("jpg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: coverImageFileName,
      Body: buffer,
      ContentType: "image/jpg",
    });
    await s3.send(command);

    const invalidationParams = {
      DistributionId: process.env.DUSTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `${coverImageFileName}-${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ["/" + coverImageFileName],
        },
      },
    };
    const invalidationCommand = new CreateInvalidationCommand(
      invalidationParams
    );
    await cloudFront.send(invalidationCommand);
  }

  // if we're Updating the images
  let imagesLinksArray: string[] = [];

  if (images.length > 0) {
    // 1. upload the new images
    await Promise.all(
      images.map(async (image, i) => {
        // use the newly updated name or the previous name
        const curFileName = uniqid(
          `${slugify(data.name, { lower: true })}-slides-${i + 1}-`,
          `${Date.now().toString()}.jpg`
        );

        const imageBuffer = Buffer.from(await image.arrayBuffer());

        const buffer = await sharp(imageBuffer)
          .resize(700, 700, {
            fit: "contain",
            background: { r: 243, g: 243, b: 243 },
          })
          .flatten({ background: "#f3f3f3" })
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toBuffer();

        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: curFileName,
          Body: buffer,
          ContentType: "image/jpg",
        });
        await s3.send(command);
        imagesLinksArray.push(process.env.CLOUD_FRONT_URL + curFileName);
      })
    );

    //   2. Delete previous products images if there are previous images
    if (doc.images.length > 0) {
      await Promise.all(
        doc.images.map(async (image) => {
          const imageName = image.split(".net/").pop();

          const curCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: imageName,
          });
          await s3.send(curCommand);
        })
      );
    }
  }

  const modifiedData = await db.products.update({
    where: { id: productId },
    data: {
      ...data,
      ...(imagesLinksArray.length > 0 && { images: imagesLinksArray }),
    },
  });

  revalidatePath("/admin/products");
  return { success: "Product created", data: modifiedData };
}
