"use client";

import Button from "@/components/admin/ui/Button";
import { Sono } from "next/font/google";

const sono = Sono({ subsets: ["latin"], display: "swap" });

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-gray-50 flex items-center justify-center p-12">
      <div className="bg-white border border-solid border-gray-100 rounded-[7px] p-12 flex-grow-0 flex-shrink text-center">
        <h1 className="mb-3 text-2xl font-semibold">Something went wrong 😪</h1>
        <p className={`${sono.className} mb-6 text-gray-500`}>
          {error.message}
        </p>

        <Button size="medium" onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
