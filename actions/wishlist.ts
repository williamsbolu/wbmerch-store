"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Used for fetching the wishlist data on page render
export async function getUserWishlist() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found!");
  }

  const wishlist = await db.wishlist.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          price: true,
          slug: true,
        },
      },
    },
  });

  return wishlist;
}

export async function addToWishlist(productId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found!");
  }

  const existingWishlist = await db.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: user.id!,
        productId: productId,
      },
    },
  });

  if (existingWishlist) {
    throw new Error("Product already in wishlist");
  }

  const wishlist = await db.wishlist.create({
    data: {
      userId: user.id!,
      productId: productId,
    },
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          price: true,
          slug: true,
        },
      },
    },
  });

  return wishlist;
}

export async function removeFromWishlist(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User account not found!");
  }

  await db.wishlist.delete({
    where: { id },
  });

  revalidatePath("/account/wishlist");
}
