"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
} from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // 1. Server side validation
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, password } = validatedFields.data;

  // 2. the existingUser.password check is required so we dont login an oauth user
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // 3. If the user exist but does not have his email verified
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw err; // important for redirecting
  }
};

export const signUp = async (values: z.infer<typeof LoginSchema>) => {
  // 1. Server side validation
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // 2. Get the data and hash the user password
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. check for if that user exist already
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 4. Create the user
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: AFTER CREATING, LOG IN THE USER

  return { success: "User created!" };
};

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid email!" };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email not found!" };

  // Generate token and send email
  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Password reset link sent!" };
};

export const newPassword = async (
  valuse: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: "Missing token!" };

  const validatedFields = NewPasswordSchema.safeParse(valuse);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { password } = validatedFields.data;

  // Check if the token exist
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Invalid token!" };

  // Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  // Check if the user exist
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User not found!" };

  // Update the user password
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // delete the password resetToken
  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Password updated!" };
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // Check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // Checks the email/user exist
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // verifiy the user email and update the email address
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // delete the verification token
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified!" };
};
