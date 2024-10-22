"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const showFooter =
    pathName !== "/checkout" &&
    !pathName.startsWith("/account") &&
    !pathName.startsWith("/cart") &&
    !pathName.startsWith("/payment-confirmation");

  return (
    <div
      className={`relative ${inter.className} grid min-h-screen grid-rows-[auto_1fr_auto]`}
    >
      {pathName !== "/checkout" && <Header />}
      <main
        className={`text-primary overflow-x-hidden ${
          showFooter ? "mt-[90px]" : ""
        }`}
      >
        {children}
      </main>
      {showFooter && <Footer />}
      {showFooter && <WhatsAppButton />}
    </div>
  );
}
