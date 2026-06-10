"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function OrderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const currentFilter = searchParams.get("status") || "ongoing-delivered";

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("status", value);

    // whenever we set a new filter we reset the page to one to avoid errors.
    if (searchParams.get("page")) params.set("page", "1");

    router.push(`${pathName}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center border-t border-b border-solid border-gray-200 w-full pt-1 overflow-x-auto md:justify-start">
      <button
        className={`capitalize text-sm font-medium h-12 px-1 ${
          currentFilter === "ongoing-delivered"
            ? "border-b-2 border-solid border-red-500 text-red-500"
            : "text-gray-500"
        } sm:px-4 sm:text-[15px]`}
        onClick={() => handleClick("ongoing-delivered")}
      >
        Ongoing/Delivered
      </button>
      <button
        className={`capitalize text-sm font-medium h-12 px-4 ${
          currentFilter === "cancelled"
            ? "border-b-2 border-solid border-red-500 text-red-500"
            : "text-gray-500"
        } sm:px-4 sm:text-[15px]`}
        onClick={() => handleClick("cancelled")}
      >
        Cancelled/Returned
      </button>
    </div>
  );
}
