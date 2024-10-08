"use client";

import { current } from "@reduxjs/toolkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function Pagination({
  count,
  size,
}: {
  count: number;
  size: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(count / size);

  function nextPage() {
    // if we are on the last page
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    const params = new URLSearchParams(searchParams);
    params.set("page", next.toString());
    router.push(`${pathName}?${params.toString()}`);
  }

  function prevPage() {
    // if we're on the first page
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    const params = new URLSearchParams(searchParams);
    params.set("page", prev.toString());
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  }

  const prevPageIsDisabled = currentPage === 1;
  const nextPageIsDisabled = currentPage === pageCount;

  if (pageCount <= 1) return null;

  return (
    <div className="p-3 bg-gray-50 flex justify-center" role="row">
      <div className="w-full flex items-center justify-between">
        <p className="text-sm ml-2">
          Showing{" "}
          <span className="font-semibold">{(currentPage - 1) * size + 1}</span>{" "}
          to{" "}
          <span className="font-semibold">
            {currentPage === pageCount ? count : currentPage * size}
          </span>{" "}
          of <span className="font-semibold">{count}</span> results
        </p>

        <div className="flex gap-[6px]">
          <button
            className="border-none rounded-md bg-gray-50 font-medium text-sm flex items-center justify-center gap-1 py-1 px-2 transition-all duration-300 hover:disabled:bg-gray-50 hover:disabled:text-gray-700 hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed"
            onClick={prevPage}
            disabled={prevPageIsDisabled}
          >
            <HiChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            className="border-none rounded-md bg-gray-50 font-medium text-sm flex items-center justify-center gap-1 py-[5px] px-2 transition-all duration-300 hover:disabled:bg-gray-50 hover:disabled:text-gray-700 hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed"
            onClick={nextPage}
            disabled={nextPageIsDisabled}
          >
            <span>Next</span>
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
