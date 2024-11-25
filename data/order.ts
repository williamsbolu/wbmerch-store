import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { notFound } from "next/navigation";

export async function getAllOrders({
  page,
  sort,
  status,
}: {
  page: number;
  sort: string;
  status: string;
}) {
  try {
    const [field, order] = sort.split("-");
    const orderBy = {
      [field]: order.toLowerCase() === "desc" ? "desc" : "asc",
    };

    let where = {};

    if (status !== "all") {
      where = {
        status: status as Status,
      };
    }

    const count = await db.order.count({
      where: where,
    });
    const orders = await db.order.findMany({
      where: where,
      orderBy,
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: true,
        referenceId: true,
        orderId: true,
        quantity: true,
        createdAt: true,
        contactEmail: true,
        status: true,
        paymentMethod: true,
        currency: true,
        totalAmount: true,
        deliveredAt: true,
        cancelledAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      data: orders,
      count,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get orders");
  }
}

export async function getOrderById(orderId: string) {
  try {
    const order = await db.order.findFirst({
      where: {
        orderId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            size: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                coverImage: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      notFound();
    }

    return order;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get order");
  }
}
export async function getOrderWithinDays(days: number) {
  const queryDate = subDays(new Date(), days);

  try {
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: queryDate,
        },
      },
      select: {
        status: true,
        currency: true,
        rateToUsd: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  } catch (err) {
    throw new Error("Failed to get orders");
  }
}

export async function getTodaysOrder() {
  try {
    const orders = await db.order.findMany({
      where: {
        status: { equals: "pending" },
        createdAt: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
      },
      select: {
        id: true,
        orderId: true,
        totalAmount: true,
        currency: true,
        items: {
          select: {
            product: {
              select: {
                name: true,
                coverImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    });

    return orders;
  } catch (err) {
    throw new Error("Failed to get orders");
  }
}

export async function getOrdersByStatus({
  page,
  status,
}: {
  page: number;
  status: string;
}) {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized");

  try {
    let where = {};
    if (status) {
      switch (status) {
        case "ongoing-delivered":
          where = {
            status: { in: ["pending", "confirmed", "delivered"] },
          };
          break;
        case "cancelled":
          where = {
            status: "cancelled",
          };
          break;
        default:
          where = {
            status: "pending",
          };
      }
    }

    const count = await db.order.count({
      where: { ...where, userId: user.id },
    });
    const orders = await db.order.findMany({
      where: { ...where, userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (page - 1) * 10,
      select: {
        orderId: true,
        status: true,
        createdAt: true,
        items: {
          select: {
            size: true,
            product: {
              select: {
                name: true,
                coverImage: true,
              },
            },
          },
        },
      },
    });

    return {
      data: orders,
      count,
    };
  } catch (err) {
    throw new Error("Failed to get orders");
  }
}
