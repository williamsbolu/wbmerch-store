import { db } from "@/lib/db";
import { Size } from "@prisma/client";

export async function addToCart(
  userId: string | undefined,
  productId: string,
  size: Size,
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
