"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

type SettingsUpdate = {
  [key: string]: string | number | boolean; // Define the types for 'value'
};

type ExchangeRateResponse = {
  base_code: string;
  conversion_rates: Record<string, number>;
};

export async function updateSettings(settings: SettingsUpdate, id: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === "USER") {
    return { error: "You are not authorized to perform this action" };
  }

  await db.settings.update({
    where: {
      id: id,
    },
    data: {
      ...settings,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Settings updated" };
}

export async function getLiveUpdates(id: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === "USER") {
    return { error: "You are not authorized to perform this action" };
  }

  const res = await fetch(
    "https://v6.exchangerate-api.com/v6/3a3ca50a63e86c489315983e/latest/USD"
  );

  const exchanges: ExchangeRateResponse = await res.json();

  const targetCurrencies = ["NGN", "GBP", "EUR", "CAD", "GHS"];

  const filteredRates = Object.entries(exchanges.conversion_rates)
    .filter(([currency]) => targetCurrencies.includes(currency))
    .reduce<Record<string, number>>((acc, [currency, rate]) => {
      acc[currency] = Number(rate.toFixed(2));
      return acc;
    }, {});

  await db.settings.update({
    where: {
      id,
    },
    data: {
      ...filteredRates,
    },
  });

  revalidatePath("/admin/settings");
  return { success: "Settings updated" };
}
