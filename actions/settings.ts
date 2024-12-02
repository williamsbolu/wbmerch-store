"use server";

import * as z from "zod";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResetSchema } from "@/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      acc[currency] = Number(rate.toFixed(currency === "NGN" ? 2 : 4));
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

export async function subscribe(data: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(data);
  if (!validatedFields.success) return { error: "Invalid field!" };

  const { email } = validatedFields.data;

  try {
    const { data, error } = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });

    if (!data || error) throw new Error("Failed to Subscribe");

    // TODO: Send a welcome email

    return { success: true };
  } catch (err) {
    return { error: err };
  }
}
