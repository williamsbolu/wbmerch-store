"use server";

import axios from "axios";
import uniqid from "uniqid";
import flutterwave from "flutterwave-node-v3";
import { db } from "@/lib/db";
import { generateOrderId } from "@/utils/helpers";
import { OrderData } from "@/utils/types";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PaymentMethod, Status } from "@prisma/client";

const flw = new flutterwave(
  process.env.FLW_PUBLIC_KEY!,
  process.env.FLW_SECRET_KEY!
);

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

  const response = await axios.post(
    "https://api.flutterwave.com/v3/payments",
    {
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
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Delete the users cart based on the sessionId or the userId
  if (user) {
    await db.cart.deleteMany({
      where: { userId: user.id },
    });
  } else {
    await db.cart.deleteMany({
      where: { sessionId },
    });
  }

  return response.data;
}

export async function verifyTransaction(
  transactionRef: string,
  transactionId: string
) {
  try {
    const order = await db.order.findUnique({
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

    const response = await flw.Transaction.verify({
      id: transactionId,
    });

    console.log({ verifyResponse: response });

    if (
      response.data.status === "successful" &&
      Number(response.data.amount) === Number(order.totalAmount) &&
      response.data.currency === order.currency
    ) {
      // Confirm the custormer's payment
      const updatedOrder = await db.order.update({
        where: {
          referenceId: transactionRef,
        },
        data: {
          isPaid: true,
        },
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

      // we loop through the products ordered to get the productId and quantity then use it to update that particular product document to reflect the sold and the total stock
      await Promise.all(
        updatedOrder.items.map(async (item) => {
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

      return { success: "Your payment was successful" };
    } else {
      return { error: "Your payment was unsuccessful" };
    }
  } catch (err) {
    console.log({ verifyError: err });
    throw new Error("Failed to verify user's payment.");
  }
}

export async function confirmOrder(id: string, paymentMethod: PaymentMethod) {
  // The logic here is that if the user used the pay_on_delivery method of payment, we confirm the isPaid on delivery: that is on the "confirmDelivery" method. not here on the
  // confirm Order. We only confirm the isPaid here whenever flutterwave and bank transfer payment method is used.
  const data = {
    isPaid: true,
    status: "confirmed" as Status,
    confirmedAt: new Date(),
  };

  if (paymentMethod === "pay_on_delivery") {
    data.isPaid = false;
  }

  const order = await db.order.update({
    where: {
      id,
    },
    data,
  });

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${order.orderId}`);
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
