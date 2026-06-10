import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import flutterwave from "flutterwave-node-v3";

const flw = new flutterwave(
  process.env.FLW_PUBLIC_KEY!,
  process.env.FLW_SECRET_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging purposes
    const clientIP =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";

    // Get the webhook payload
    const payload = await request.json();

    // Verify webhook signature if secret hash is configured
    const secretHash = process.env.FLW_WEBHOOK_SECRET_HASH;
    const signature = request.headers.get("verif-hash");

    if (secretHash && (!signature || signature !== secretHash)) {
      console.log(`Webhook signature verification failed for IP: ${clientIP}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract event type and data
    const { event, data } = payload;

    // Validate payload structure
    if (!event || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Handle different webhook events
    switch (event) {
      case "charge.completed":
        return await handleChargeCompleted(data, clientIP);

      case "charge.failed":
        return await handleChargeFailed(data, clientIP);

      case "charge.expired":
        return await handleChargeExpired(data, clientIP);

      default:
        console.log(`Unhandled webhook event: ${event} from IP: ${clientIP}`);
        return NextResponse.json({ status: "ignored" }, { status: 200 });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleChargeCompleted(data: any, clientIP: string) {
  try {
    const { id, tx_ref, status, amount, currency } = data;

    // Validate required fields
    if (!id || !tx_ref) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the order by reference ID
    const order = await db.order.findFirst({
      where: { referenceId: tx_ref },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return NextResponse.json(
        { status: "already_processed" },
        { status: 200 }
      );
    }

    // Verify the transaction with Flutterwave API for additional security
    try {
      const verificationResponse = await flw.Transaction.verify({ id });

      if (
        verificationResponse.data.status === "successful" &&
        Number(verificationResponse.data.amount) ===
          Number(order.totalAmount) &&
        verificationResponse.data.currency === order.currency
      ) {
        // Update order with payment confirmation
        const updatedOrder = await db.order.update({
          where: { id: order.id },
          data: {
            isPaid: true,
            transactionId: id.toString(),
            status: "confirmed",
            confirmedAt: new Date(),
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

        // Update product inventory
        await Promise.all(
          updatedOrder.items.map(async (item) => {
            try {
              if (item.size && item.product.sizes) {
                await db.products.update({
                  where: { id: item.productId },
                  data: {
                    sizes: {
                      ...item.product.sizes,
                      [item.size]:
                        item.product.sizes![item.size] - item.quantity,
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

        console.log(
          `Order ${order.id} payment confirmed successfully via webhook from IP: ${clientIP}`
        );

        return NextResponse.json({ status: "success" }, { status: 200 });
      } else {
        console.log(
          `Transaction verification failed for order ${order.id} from IP: ${clientIP}`
        );
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 400 }
        );
      }
    } catch (verificationError) {
      console.error(
        `Transaction verification error from IP ${clientIP}:`,
        verificationError
      );
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      `Error handling charge.completed from IP ${clientIP}:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleChargeFailed(data: any, clientIP: string) {
  try {
    const { tx_ref, status } = data;

    console.log(`Payment failed for reference: ${tx_ref} from IP: ${clientIP}`);

    // Find the order by reference ID
    const order = await db.order.findFirst({
      where: { referenceId: tx_ref },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is already cancelled
    if (order.status === "cancelled") {
      return NextResponse.json(
        { status: "already_cancelled" },
        { status: 200 }
      );
    }

    // Update order status to cancelled
    await db.order.update({
      where: { id: order.id },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });

    console.log(
      `Order ${order.id} cancelled due to failed payment from IP: ${clientIP}`
    );

    // add additional logic here:
    // - Send notification emails to customer
    // - Send notification to admin
    // - Log the failure for analytics
    // - Restore product inventory if needed

    return NextResponse.json(
      { status: "failed_payment_processed", orderCancelled: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error handling charge.failed from IP ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleChargeExpired(data: any, clientIP: string) {
  try {
    const { tx_ref, status } = data;

    console.log(
      `Payment expired for reference: ${tx_ref} from IP: ${clientIP}`
    );

    // Find the order by reference ID
    const order = await db.order.findFirst({
      where: { referenceId: tx_ref },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is already cancelled
    if (order.status === "cancelled") {
      return NextResponse.json(
        { status: "already_cancelled" },
        { status: 200 }
      );
    }

    // Update order status to cancelled for expired payments
    await db.order.update({
      where: { id: order.id },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });

    console.log(
      `Order ${order.id} cancelled due to expired payment from IP: ${clientIP}`
    );

    return NextResponse.json(
      { status: "expired_payment_processed", orderCancelled: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error handling charge.expired from IP ${clientIP}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
