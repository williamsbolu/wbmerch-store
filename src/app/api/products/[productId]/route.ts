import slugify from "slugify";
import sharp from "sharp";
import uniqid from "uniqid";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import s3 from "@/lib/s3";
import cloudFront from "@/lib/cloudFront";

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const categories = formData.get("categories") as string;
  const gender = formData.get("gender") as string;
  const price = formData.get("price") as string;
  // const size = formData.getAll("size") as string[];
  const coverImage = formData.get("coverImage") as File;
  const images: File[] = formData.getAll("images") as File[];

  try {
    const doc = await db.products.findUnique({
      where: {
        id: productId,
      },
    });
    if (!doc) return Response.json({ message: "Product not found" });

    // if we're Updating the coverImage
    if (coverImage) {
      const fileName = doc.coverImage.split(".net/").pop();

      // convert the image file to buffer
      const imageBuffer = Buffer.from(await coverImage.arrayBuffer());

      // resize the image to the app specific size
      const buffer = await sharp(imageBuffer)
        .resize(700, 700, {
          fit: "contain",
          background: { r: 228, g: 229, b: 233 },
        })
        .flatten({ background: "#e4e5e9" })
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

      const invalidationParams = {
        DistributionId: process.env.DUSTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `${fileName}-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ["/" + fileName],
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

    if (images?.length > 0) {
      // 1. upload the new images
      await Promise.all(
        images.map(async (image, i) => {
          // use the newly updated name or the previous name
          const curFileName = uniqid(
            `${slugify(doc.name, { lower: true })}-slides-${i + 1}-`,
            `${Date.now().toString()}.jpg`
          );

          const imageBuffer = Buffer.from(await image.arrayBuffer());

          const buffer = await sharp(imageBuffer)
            .resize(700, 700, {
              fit: "contain",
              background: { r: 228, g: 229, b: 233 },
            })
            .flatten({ background: "#e4e5e9" })
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

      //   2. Delete previous client images
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
    }

    const data = {
      ...(name && { name }),
      ...(categories && { categories }),
      ...(gender && { gender }),
      ...(price && { price }),
      ...(imagesLinksArray.length > 0 && { images: imagesLinksArray }),
    };

    const modifiedData = await db.products.update({
      where: {
        id: productId,
      },
      data: {
        name: name,
      },
    });

    return Response.json({
      data: modifiedData,
    });
  } catch (error: any) {
    return Response.json({ error: error.toString() });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  const productId = params.productId;

  try {
    const doc = await db.products.findUnique({
      where: {
        id: productId,
      },
      select: {
        coverImage: true,
        images: true,
      },
    });

    if (!doc)
      return Response.json({ message: "Product not found" }, { status: 404 });

    // delete Cover Image
    const imageName = doc.coverImage.split(".net/").pop();
    console.log(imageName);

    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
    });
    await s3.send(command);

    // delete all the client images in the images in the bucket
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

    await db.products.delete({
      where: {
        id: productId,
      },
    });

    return Response.json({
      status: "success",
      data: null,
    });
  } catch (error: any) {
    return Response.json({ error: error.toString() });
  }
}
