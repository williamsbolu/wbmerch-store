import { db } from "@/lib/db";
import { Prisma, Gender, Category, Collection } from "@prisma/client";

export async function getRecentProducts() {
  try {
    const products = await db.products.findMany({
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
  try {
    const product = await db.products.findFirst({
      where: {
        slug: slug,
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
    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get product");
  }
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
          collections: {
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
      db.products.count({ where: whereCondition }),
      db.products.findMany({
        where: whereCondition,
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
