import { db } from "@/lib/db";

export async function getSettings() {
  try {
    const settings = await db.settings.findFirst();

    return settings;
  } catch (err) {
    throw new Error("Failed to fetch settings");
  }
}
