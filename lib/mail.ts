import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import UserVerificationEmail from "@/emails/UserVerificationEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.Next_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  userName: string
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "WbMerch <support@wbmerch.store>",
    to: email,
    subject: "Reset your password",
    // html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    react: ResetPasswordEmail({
      resetPasswordLink: resetLink,
      userFirstname: userName,
    }),
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  userName: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "WbMerch <support@wbmerch.store>",
    to: email,
    replyTo: "noreply@wbmerch.store",
    subject: "Verify your email",
    // html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email address.</p>`,
    react: UserVerificationEmail({
      userFirstname: userName,
      confirmationLink: confirmLink,
    }),
  });
};
