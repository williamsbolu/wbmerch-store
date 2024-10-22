"use client";

import OrderTag from "@/components/admin/ui/OrderTag";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold">ORD-231015-x4Gh9z</h1>
          <OrderTag type="sky">unconfirmed</OrderTag>
        </div>

        <button
          className="text-indigo-600 font-medium text-center border-none bg-none rounded-md transition-all duration-300 hover:text-indigo-700 active:text-indigo-700"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
      </div>

      <div className="bg-white border border-solid border-gray-200 rounded-[7px] py-5">
        {" "}
      </div>
    </>
  );
}
