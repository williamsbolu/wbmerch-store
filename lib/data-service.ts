import { db } from "@/lib/db";
import { Prisma, Gender, Category, Collection } from "@prisma/client";
import { notFound } from "next/navigation";

interface ExchangeRateResponse {
  data: Record<string, number>;
}

// We use this incase we want to fetch the rates directly from the rates api
// export async function getExchangeRates() {
//   const response = await fetch("/api/exchange-rates");
//   const rates: ExchangeRateResponse = await response.json();

//   const targetCurrencies = ["USD", "NGN", "GBP", "EUR", "CAD", "GHS"];

//   const filteredRates = Object.entries(rates.data)
//     .filter(([currency]) => targetCurrencies.includes(currency))
//     .reduce<Record<string, number>>((acc, [currency, rate]) => {
//       acc[currency] = rate;
//       return acc;
//     }, {});

//   return filteredRates;
// }

export async function getExchangeRates() {
  const response = await fetch("/api/exchange-rates", { cache: "no-store" });
  const rates: ExchangeRateResponse = await response.json();

  return rates.data;
}

export async function getRecentProducts() {
  try {
    const products = await db.products.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        coverImage: true,
        slug: true,
      },
      take: 6,
    });

    return products;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get recent products");
  }
}

export async function getAllProducts({
  page,
  sort,
}: {
  page: number;
  sort?: string;
}) {
  try {
    const count = await db.products.count();
    const products = await db.products.findMany({
      where: {
        isActive: true,
      },
      take: 16,
      skip: (page - 1) * 16,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        coverImage: true,
        slug: true,
      },
    });

    return {
      data: products,
      count,
    };
  } catch (error) {
    throw new Error("Failed to get products");
  }
}

export async function getProduct(slug: string) {
  const product = await db.products.findFirst({
    where: {
      slug: slug,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      coverImage: true,
      images: true,
      description: true,
      sizes: true,
      stock: true,
      slug: true,
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export async function getSearchedProducts(queryObj: {
  q: string;
  page: number;
  sort: string;
}) {
  const query = queryObj.q;
  const [sortField, sortOrder] = queryObj.sort.split("-");
  const page = Number(queryObj.page);
  const pageSize = 16;
  const skip = (page - 1) * pageSize;
  // console.log(sortField, sortOrder);

  // Split the query into individual terms
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.trim() !== "");

  const whereCondition: Prisma.productsWhereInput = {
    AND: terms.map((term) => ({
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        {
          category: {
            in: Object.values(Category).filter((cat) =>
              cat.toLowerCase().includes(term)
            ),
          },
        },
        {
          gender: {
            in: Object.values(Gender).filter((gen) =>
              gen.toLowerCase().includes(term)
            ),
          },
        },
        {
          collection: {
            in: Object.values(Collection).filter((col) =>
              col.toLowerCase().includes(term)
            ),
          },
        },
      ],
    })),
  };

  try {
    const [totalCount, data] = await db.$transaction([
      db.products.count({ where: { ...whereCondition, isActive: true } }),
      db.products.findMany({
        where: { ...whereCondition, isActive: true },
        orderBy:
          sortField && sortOrder ? { [sortField]: sortOrder } : undefined,

        take: pageSize,
        skip: skip,
        select: {
          id: true,
          name: true,
          coverImage: true,
          price: true,
          slug: true,
        },
      }),
    ]);

    return {
      count: totalCount,
      data,
    };
  } catch (error: any) {
    console.log("Failed to get products:", error);
    throw new Error("Failed to get products");
  }
}
