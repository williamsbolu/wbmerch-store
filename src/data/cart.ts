import { db } from "@/lib/db";
import { Size } from "@prisma/client";
import { User } from "next-auth";

export async function addToCart(
  userId: string | undefined,
  productId: string,
  size: Size | null,
  quantity: number
) {
  const cart = await db.cart.findFirst({
    where: {
      userId,
    },
    include: { items: true },
  });

  const existingItem = cart?.items.find(
    (item) => item.productId === productId && item.size === size
  );

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart?.id as string,
        productId,
        size,
        quantity,
      },
    });
  }
}

export async function clearUsersCart(
  user: User,
  sessionId: string | undefined
) {
  if (user) {
    await db.cart.deleteMany({
      where: { userId: user.id },
    });
  } else {
    await db.cart.deleteMany({
      where: { sessionId },
    });
  }
}
