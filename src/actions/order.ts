"use server";

import uniqid from "uniqid";
import {
  initiatePayment as createFlutterwavePayment,
  verifyTransactionById,
  verifyByReference,
} from "@/lib/flutterwave";
import { db } from "@/lib/db";
import { generateOrderId } from "@/utils/helpers";
import { OrderData } from "@/utils/types";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PaymentMethod, Status } from "@prisma/client";
import { clearUsersCart } from "@/data/cart";
import { redirect } from "next/navigation";

export async function initiatePayment(
  data: OrderData,
  sessionId: string | undefined
) {
  const user = await currentUser();

  const transactionRef = uniqid("txn_", `${Date.now().toString()}`);
  const orderId = generateOrderId();

  await db.order.create({
    data: {
      referenceId: transactionRef,
      orderId: orderId,
      ...(data.contactEmail && { contactEmail: data.contactEmail }),
      ...(data.userId && { userId: data.userId }),
      currency: data.currency,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      quantity: data.quantity,
      shippingFee: data.shippingFee,
      totalAmount: data.totalAmount,
      rateToUsd: data.rateToUsd,
      shippingAddress: {
        firstName: data.shippingAddress.firstName,
        lastName: data.shippingAddress.lastName,
        address: data.shippingAddress.address,
        ...(data.shippingAddress.optional && {
          optional: data.shippingAddress.optional,
        }),
        country: data.shippingAddress.country,
        state: data.shippingAddress.state,
        city: data.shippingAddress.city,
        postalCode: data.shippingAddress.postalCode,
        phone: data.shippingAddress.phone,
      },
      billingAddress: {
        firstName: data.billingAddress.firstName,
        lastName: data.billingAddress.lastName,
        address: data.billingAddress.address,
        ...(data.billingAddress.optional && {
          optional: data.billingAddress.optional,
        }),
        country: data.billingAddress.country,
        state: data.billingAddress.state,
        city: data.billingAddress.city,
        postalCode: data.billingAddress.postalCode,
        phone: data.billingAddress.phone,
      },
      // Create the orderItems
      items: {
        create: data.items.map((item) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
        })),
      },
    },
  });

  const customerEmail = user ? user.email : data.contactEmail;
  const customerName = user
    ? user.name
    : `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`;
  const domain = process.env.Next_PUBLIC_APP_URL;

  const flwResponse = await createFlutterwavePayment({
    tx_ref: transactionRef,
    amount: data.totalAmount,
    currency: data.currency,
    redirect_url: `${domain}/payment-confirmation`,
    customer: {
      email: customerEmail,
      name: customerName,
    },
    customizations: {
      title: "Wb merch",
      logo: "https://dwirvaqvo77ym.cloudfront.net/logo.jpg",
    },
  });

  // Delete the users cart based on the sessionId or the userId
  await clearUsersCart(user!, sessionId);

  return flwResponse;
}

export async function verifyTransaction(
  transactionRef: string,
  transactionId: string
) {
  try {
    const order = await db.order.findFirst({
      where: {
        referenceId: transactionRef,
      },
      include: {
        items: true,
      },
    });

    // If order not found, return error
    if (!order) {
      return { error: "Order not found" };
    }

    if (order.isPaid) {
      return { success: "Your payment was successful" };
    }

    const transaction = await verifyTransactionById(transactionId);

    if (
      transaction.status === "successful" &&
      Number(transaction.amount) === Number(order.totalAmount) &&
      transaction.currency === order.currency
    ) {
      return { success: "Your payment was successful" };
    } else {
      return { error: "Your payment was unsuccessful" };
    }
  } catch (err) {
    console.log({ verifyError: err });
    throw new Error("Failed to verify user's payment.");
  }
}

export async function createOrder(
  data: OrderData,
  sessionId: string | undefined
) {
  const user = await currentUser();
  const orderId = generateOrderId();

  await db.order.create({
    data: {
      orderId: orderId,
      ...(data.contactEmail && { contactEmail: data.contactEmail }),
      ...(data.userId && { userId: data.userId }),
      currency: data.currency,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      quantity: data.quantity,
      shippingFee: data.shippingFee,
      totalAmount: data.totalAmount,
      rateToUsd: data.rateToUsd,
      shippingAddress: {
        firstName: data.shippingAddress.firstName,
        lastName: data.shippingAddress.lastName,
        address: data.shippingAddress.address,
        ...(data.shippingAddress.optional && {
          optional: data.shippingAddress.optional,
        }),
        country: data.shippingAddress.country,
        state: data.shippingAddress.state,
        city: data.shippingAddress.city,
        postalCode: data.shippingAddress.postalCode,
        phone: data.shippingAddress.phone,
      },
      billingAddress: {
        firstName: data.billingAddress.firstName,
        lastName: data.billingAddress.lastName,
        address: data.billingAddress.address,
        ...(data.billingAddress.optional && {
          optional: data.billingAddress.optional,
        }),
        country: data.billingAddress.country,
        state: data.billingAddress.state,
        city: data.billingAddress.city,
        postalCode: data.billingAddress.postalCode,
        phone: data.billingAddress.phone,
      },
      // Create the orderItems
      items: {
        create: data.items.map((item) => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
        })),
      },
    },
  });

  // Delete the users cart based on the sessionId or the userId
  await clearUsersCart(user!, sessionId);

  redirect("/orders/thankyou");
}

export async function confirmOrder(
  id: string,
  paymentMethod: PaymentMethod,
  referenceId: string | null
) {
  // The logic here is that if the user used the pay_on_delivery method of payment, we confirm the isPaid on delivery: that is on the "confirmDelivery" method. not here on the
  // confirm Order. We only confirm the isPaid here whenever flutterwave and bank transfer payment method is used.
  const data = {
    isPaid: false,
    status: "confirmed" as Status,
    confirmedAt: new Date(),
  };

  if (paymentMethod === "pay_on_delivery") {
    data.isPaid = false;
  }

  if (paymentMethod === "bank_transfer") {
    data.isPaid = true;
  }

  // Prevents confirming unpaid orders of customers that made use of the card payment method (referenceId would be available on card purchase)
  if (paymentMethod === "card") {
    try {
      const transaction = await verifyByReference(referenceId!);

      if (transaction.status === "successful") {
        data.isPaid = true;
      }
    } catch (err) {
      return {
        error: "User's payment hasn't been verified. Please check back later",
      };
    }
  }

  const order = await db.order.update({
    where: {
      id,
    },
    data,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              sizes: true,
            },
          },
        },
      },
    },
  });

  // Only runs when the user pays with either pay_on_delivery or bank_transfer, we update the stock of the products ordered
  if (
    paymentMethod === "pay_on_delivery" ||
    paymentMethod === "bank_transfer"
  ) {
    await Promise.all(
      order.items.map(async (item) => {
        try {
          if (item.size && item.product.sizes) {
            await db.products.update({
              where: { id: item.productId },
              data: {
                sizes: {
                  ...item.product.sizes,
                  [item.size]: item.product.sizes![item.size] - item.quantity,
                },
                sold: { increment: item.quantity },
                totalStock: { decrement: item.quantity },
              },
            });
          } else {
            await db.products.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
                sold: { increment: item.quantity },
                totalStock: { decrement: item.quantity },
              },
            });
          }
        } catch (error) {
          console.error(`Error updating product ${item.productId}:`, error);
        }
      })
    );
  }

  // TODO: Send confirmation email to the customer

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${order.orderId}`);
  return { success: "Order confirmed successfully" };
}

export async function confirmDelivery(id: string) {
  const order = await db.order.update({
    where: {
      id,
    },
    data: {
      isPaid: true,
      status: "delivered",
      deliveredAt: new Date(),
    },
  });

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${order.orderId}`);
}

export async function cancelOrder(id: string) {
  const order = await db.order.update({
    where: {
      id,
    },
    data: {
      status: "cancelled",
      cancelledAt: new Date(),
    },
  });

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${order.orderId}`);
}
