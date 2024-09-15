import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import "@/app/_styles/globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ReduxProvider from "@/components/ReduxProvider";

export const metadata = {
  title: {
    default: "WB Merch",
    template: "%s / WB Merch",
  },
  description:
    "Discover the best in styles and lifestyle clothing, accessories, and equipment at WB Merch store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ReduxProvider>
        <div
          className={`${inter.className} grid h-screen grid-rows-[auto_1fr_auto]`}
        >
          <Header />
          <main className="text-primary mt-[90px]">{children}</main>
          <Footer />
        </div>
      </ReduxProvider>
    </SessionProvider>
  );
}

// In some cases, if server components rely on session data, you may want to fetch the session server-side first using auth() and then pass it down as props to avoid hydration mismatches. This prevents cases where the server-rendered HTML differs from what the client renders.
