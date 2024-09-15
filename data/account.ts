import { db } from "@/lib/db";

export async function getAccountById(userId: string) {
  try {
    const account = await db.account.findFirst({
      where: {
        userId,
      },
    });

    return account;
  } catch {
    return null;
  }
}
