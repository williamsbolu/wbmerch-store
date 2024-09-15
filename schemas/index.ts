import email from "next-auth/providers/email";
import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  phone: z.optional(z.string()),
});

export const changePasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimun 6 characters required",
  }),
  newPassword: z.string().min(6, {
    message: "Minimun 6 characters required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimun 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimun 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

// for doing the validation on the frontend and also on the backend by easiy importing the schema from this folder
