import { db } from "@/lib/db";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import slugify from "slugify";
import uniqid from "uniqid";

export async function GET(request: Request) {
  try {
    const products = await db.products.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ data: products });
  } catch (error) {
    throw new Error("Failed to get products");
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data: any = {};

    if (formData.has("name")) {
      data.name = formData.get("name") as string;
    }
    if (formData.has("category")) {
      data.category = formData.get("category") as string;
    }
    if (formData.has("collection")) {
      data.collection = formData.get("collection") as string;
    }
    if (formData.has("gender")) {
      data.gender = formData.get("gender") as string;
    }
    if (formData.has("price")) {
      data.price = Number(formData.get("price") as string);
    }
    if (formData.has("stock")) {
      data.stock = Number(formData.get("stock") as string);
    }

    const coverImage = formData.get("coverImage") as File;
    const images: File[] = formData.getAll("images") as File[];

    if (formData.has("size")) {
      const sizes = formData.getAll("size") as string[];

      // Formatting the sizes: (only for postman)
      const receivedSizes: { [key: string]: number } = {};
      sizes.forEach((size) => {
        const [key, value] = size.split("-");
        receivedSizes[key] = Number(value);
      });
      const sizesList = {
        s: receivedSizes.s || 0,
        m: receivedSizes.m || 0,
        l: receivedSizes.l || 0,
        xl: receivedSizes.xl || 0,
        xxl: receivedSizes.xxl || 0,
        xxxl: receivedSizes.xxxl || 0,
      };

      data.sizes = sizesList;
    }

    // convert the image file to buffer
    const imageBuffer = Buffer.from(await coverImage.arrayBuffer());

    // unique name
    const fileName = uniqid(
      `${slugify(data.name, { lower: true })}-`,
      `${Date.now().toString()}.jpg`
    );

    // resize the image to the app specific size
    const buffer = await sharp(imageBuffer)
      .resize(700, 700, {
        fit: "contain",
        background: { r: 228, g: 229, b: 233 },
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
    data.coverImage = process.env.CLOUD_FRONT_URL + fileName;

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
              background: { r: 228, g: 229, b: 233 },
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

      // Add the link to the data object
      data.images = imagesLinksArray;
    }

    const doc = await db.products.create({
      data: {
        ...data,
        slug: slugify(data.name, { lower: true }),
      },
    });

    return Response.json({
      data: doc,
    });
  } catch (err: any) {
    return Response.json({ error: err.toString() });
  }
}

// WB Oversized Faded T-shirt (faded-bone)
