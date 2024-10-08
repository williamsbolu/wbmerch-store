import { db } from "@/lib/db";
import { log } from "util";

export async function getAllProducts({
  page,
  sort,
  status,
}: {
  page: number;
  sort: string;
  status: string | undefined;
}) {
  // the filter functionality is implemented to handle just a field in our database that is the "status" which is the stock of products in our db

  try {
    const [field, order] = sort.split("-");
    const orderBy = {
      [field]: order.toLowerCase() === "desc" ? "desc" : "asc",
    };

    let where = {};
    if (status) {
      switch (status) {
        case "out-of-stock":
          where = { totalStock: 0 };
          break;
        case "low-stock":
          where = { totalStock: { gt: 0, lte: 15 } };
          break;
        case "active":
          where = { totalStock: { gt: 15 } };
          break;
      }
    }

    const count = await db.products.count({ where: where });
    const products = await db.products.findMany({
      take: 5,
      skip: (page - 1) * 5,
      orderBy: orderBy,
      where: where,
    });

    return {
      data: products,
      count,
    };
  } catch (error) {
    console.log(error);

    throw new Error("Failed to get products");
  }
}
