import { db } from "@/lib/db";

export async function getUserAddress(id: string) {
  try {
    const data = await db.address.findMany({
      where: {
        userId: id,
      },
    });

    return data;
  } catch (error) {
    throw new Error("Failed to get users address");
  }
}
