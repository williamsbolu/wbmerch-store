"use server";

import { addToCart } from "@/data/cart";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Size } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function getOrCreateCart({
  userId,
  sessionId,
}: {
  userId?: string | undefined;
  sessionId?: string | undefined;
}) {
  if (userId) {
    // For authenticated users
    let cart = await db.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        items: {
          where: {
            product: {
              isActive: true, // only get active products
            },
          },
          select: {
            id: true,
            cartId: true,
            productId: true,
            size: true,
            quantity: true,
            product: {
              select: {
                name: true,
                coverImage: true,
                price: true,
                sizes: true,
                stock: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // If authenticated user doesn't have a cart, create one
      cart = await db.cart.create({
        data: { userId },
        include: {
          items: {
            select: {
              id: true,
              cartId: true,
              productId: true,
              size: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  coverImage: true,
                  price: true,
                  sizes: true,
                  stock: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    }

    // If there was a session cart, merge it with the user's cart
    if (sessionId) {
      const sessionCart = await db.cart.findFirst({
        where: { sessionId },
        include: { items: true },
      });

      // if there is a cart for this session id in the database, we add those cart to the userId cart session
      if (sessionCart) {
        if (sessionCart.items.length > 0) {
          for (const item of sessionCart.items) {
            await addToCart(
              userId,
              item.productId,
              item?.size || null, // null is required because of camparison
              item.quantity
            );
          }
        }

        // delete the session cart
        await db.cart.delete({ where: { id: sessionCart.id } });

        // delete all previous session cart items (had to implement this because cascade don't work on mongodb)
        await db.cartItem.deleteMany({ where: { cartId: sessionCart.id } });
      }
    }

    return { cart, cartItems: cart.items };
  } else {
    // For unauthenticated users
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // in case there is a sessionId
    let cart = await db.cart.findFirst({
      where: { sessionId },
      include: {
        items: {
          where: {
            product: {
              isActive: true, // only get active products
            },
          },
          select: {
            id: true,
            cartId: true,
            productId: true,
            size: true,
            quantity: true,
            product: {
              select: {
                name: true,
                coverImage: true,
                price: true,
                sizes: true,
                stock: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { sessionId },
        include: {
          items: {
            select: {
              id: true,
              cartId: true,
              productId: true,
              size: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                  coverImage: true,
                  price: true,
                  sizes: true,
                  stock: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    }

    return { cart, cartItems: cart.items, sessionId };
  }
}

interface addToCartProps {
  sessionId: string | undefined;
  productId: string;
  quantity: number;
  size: string | null;
}

export async function addOrUpdateCart({
  sessionId,
  productId,
  quantity,
  size,
}: addToCartProps) {
  const user = await currentUser();

  const { cartItems, cart } = await getOrCreateCart({
    userId: user?.id,
    sessionId,
  });

  const existingCart = cartItems.find(
    (item) => item.productId === productId && item.size === size
  );

  // Ensure that the size is converted to the enum, if there is no size we set it to undefined to remove if from being pushed to the database
  let enumSize;
  if (size) {
    enumSize = size.toLowerCase() as Size; // Convert the string to lower case and cast it to 'Size'
  } else {
    enumSize = undefined;
  }

  if (existingCart) {
    await db.cartItem.update({
      where: { id: existingCart.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size: enumSize,
      },
    });
  }

  // Note: this code below is not important, it just for fighting against cases where the user manually messes with the sessionId cookie

  // i could also implement this functionality on all cart actions, incase the user manually deletes the sessionId from the cookie
  // this is a fallback to replace the sessionId with a new one, incase the user deletes the sessionId from the cookie, so the user can be in-sync with the session cart
  return { sessionId: cart.sessionId };
}

export async function deleteCartQuantity(
  sessionId: string | undefined,
  productId: string,
  size: string
) {
  const user = await currentUser();

  const { cartItems } = await getOrCreateCart({
    userId: user?.id,
    sessionId,
  });

  const existingCart = cartItems.find(
    (item) => item.productId === productId && item.size === size
  );

  // decrease the cart if it exist
  if (existingCart) {
    await db.cartItem.update({
      where: { id: existingCart.id },
      data: { quantity: { decrement: 1 } },
    });
  }
}

export async function deleteCartItem(
  sessionId: string | undefined,
  productId: string,
  size: string // its can be also null
) {
  const user = await currentUser();

  const { cartItems } = await getOrCreateCart({ userId: user?.id, sessionId });

  const existingCart = cartItems.find(
    (item) => item.productId === productId && item.size === size
  );

  if (existingCart) {
    await db.cartItem.delete({ where: { id: existingCart.id } });
  }
}
