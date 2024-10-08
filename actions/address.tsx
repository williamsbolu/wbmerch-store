"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddressType } from "@/utils/types";

export async function createAddress(data: AddressType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found!");
  }

  // Checks if the user already has a default address
  const existingDefaultAddress = await db.address.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
  });

  // If there is no existing default adddress, we add the new address as a default
  if (!existingDefaultAddress) {
    data.isDefault = true;
  }

  // Add the user Id to the Address data
  data.userId = user?.id!;

  const address = await db.address.create({
    data: {
      ...data,
    },
  });

  // Update the previous default address if it exists
  if (existingDefaultAddress && data.isDefault) {
    await db.address.update({
      where: { id: existingDefaultAddress.id },
      data: { isDefault: false },
    });
  }

  revalidatePath("/account/address");
  revalidatePath("/checkout");

  return address;
}

export async function editAddress(data: AddressType, id: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found!");
  }

  // if the user is updating the address default state, we remove the prev default address
  if (data.isDefault) {
    const existingDefaultAddress = await db.address.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
        NOT: {
          id,
        },
      },
    });

    if (existingDefaultAddress) {
      await db.address.update({
        where: { id: existingDefaultAddress.id },
        data: { isDefault: false },
      });
    }
  }

  data.userId = undefined!;
  const address = await db.address.update({
    where: { id },
    data: {
      ...data,
    },
  });

  revalidatePath("/account/address");
  revalidatePath("/checkout");

  return address;
}

export async function deleteAddress(id: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found!");
  }

  await db.address.delete({
    where: { id },
  });

  revalidatePath("/account/address");
  revalidatePath("/checkout");
}
