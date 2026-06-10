import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getAccountById } from "@/data/account";

declare module "next-auth" {
  export interface Session {
    user: {
      role: "ADMIN" | "USER" | "GUEST";
      isOAuth: boolean;
      phone: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER" | "GUEST";
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow Oauth to proceed without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // if the user email is not verified, we block them from logging in
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      // token.sub is the id of the user
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        // if the user is not an oauth user
        if (!token.isOAuth) {
          session.user.image = token.image as string | null;
        }
      }

      return session;
    },
    async jwt({ token }) {
      // if im not logged in
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountById(existingUser.id);

      token.isOAuth = !!existingAccount; // this field will help us identify what method the user used to register his/her account

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.phone = existingUser.phone;
      // if the user is not an oauth user
      if (!existingAccount) {
        token.image = existingUser.image;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
