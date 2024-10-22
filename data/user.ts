import { db } from "@/lib/db";

export const getApplicationUsers = async () => {
  try {
    const users = await db.user.findMany({
      where: {
        role: { not: "USER" },
      },
    });

    return {
      data: users,
    };
  } catch (err) {
    throw new Error("Failed to get users");
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch {
    return null;
  }
};
