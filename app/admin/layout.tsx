import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import { auth } from "@/auth";
import Layout from "@/components/admin/ui/Layout";
import { SessionProvider } from "next-auth/react";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Dashboard / WB Merch",
  description: "Admin Dashboard for WB Merch",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    notFound();
  }

  return (
    <SessionProvider session={session}>
      <div
        className={`${poppins.className} min-h-screen grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] text-gray-700`}
      >
        <Layout>{children}</Layout>
      </div>
    </SessionProvider>
  );
}
