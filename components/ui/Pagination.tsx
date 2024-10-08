"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";

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

  // Pagecount is the total number of pages that will be returned (replace 16 with original page size)
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
    <div className="flex justify-center gap-3">
      <button
        className={`${
          prevPageIsDisabled && "invisible"
        } w-11 h-11 flex items-center justify-center`}
        onClick={prevPage}
      >
        <SlArrowLeft className="w-[11px] h-[11px] text-primary" />
      </button>

      <div className="space-x-3">
        {!prevPageIsDisabled && (
          <button className="h-11 w-11 text-sm" onClick={prevPage}>
            {currentPage - 1}
          </button>
        )}
        <button
          className="h-8 w-5 text-base text-[#121212Bf] border-b-[1.5px] border-[#121212Bf] disabled:cursor-not-allowed"
          disabled
        >
          {currentPage}
        </button>
        {!nextPageIsDisabled && (
          <button className="h-11 w-11 text-sm" onClick={nextPage}>
            {currentPage + 1}
          </button>
        )}
      </div>

      <button
        className={`${
          nextPageIsDisabled && "invisible"
        } w-11 h-11 flex items-center justify-center`}
        onClick={nextPage}
      >
        <SlArrowRight className="w-[11px] h-[11px] text-primary" />
      </button>
    </div>
  );
}
