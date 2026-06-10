import { db } from "@/lib/db";

export async function getUserWishlist({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  try {
    const count = await db.wishlist.count({
      where: {
        userId,
      },
    });
    const data = await db.wishlist.findMany({
      where: {
        userId,
      },
      take: 6,
      skip: (page - 1) * 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
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

    return {
      count,
      data,
    };
  } catch (error) {
    throw new Error("Failed to get users wishlists");
  }
}
