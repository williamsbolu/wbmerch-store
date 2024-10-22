import { db } from "@/lib/db";

// export async function GET(request: Request) {
//   const response = await fetch(
//     "https://v6.exchangerate-api.com/v6/3a3ca50a63e86c489315983e/latest/USD"
//   );
//   const data = await response.json();

//   return Response.json({ data: data.conversion_rates });
// }

export async function GET(request: Request) {
  const rates = await db.settings.findFirst({
    select: {
      NGN: true,
      CAD: true,
      EUR: true,
      GBP: true,
      GHS: true,
    },
  });

  return Response.json({ data: rates });
}
