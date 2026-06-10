import { db } from "@/lib/db";
import { Category, Collection, Gender, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") as string;

  if (!query) {
    return NextResponse.json(
      { message: "Query parameter is missing" },
      { status: 400 }
    );
  }

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
        orderBy: { name: "desc" },
        take: 10,
        select: {
          name: true,
          coverImage: true,
          price: true,
          slug: true,
        },
      }),
    ]);

    return NextResponse.json({
      status: "success",
      count: totalCount,
      data,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred while searching products",
      },
      { status: 500 }
    );
  }
}

// This search query here also helps to bring out search result based on different search terms. eg: results for bags, caps, hats at the same time

// const whereCondition: Prisma.productsWhereInput = {
//   isActive: true, // for the active state,
//   OR: [
//     {
//       AND: terms.map((term) => ({
//         OR: [
//           { name: { contains: term, mode: "insensitive" } },
//           { description: { contains: term, mode: "insensitive" } },
//         ],
//       })),
//     },
//     {
//       category: {
//         in: Object.values(Category).filter((cat) =>
//           terms.some((term) => cat.toLowerCase().includes(term))
//         ),
//       },
//     },
//     {
//       gender: {
//         in: Object.values(Gender).filter((gen) =>
//           terms.some((term) => gen.toLowerCase().includes(term))
//         ),
//       },
//     },
//     {
//       collection: {
//         in: Object.values(Collection).filter((col) =>
//           terms.some((term) => col.toLowerCase().includes(term))
//         ),
//       },
//     },
//   ],
// };
