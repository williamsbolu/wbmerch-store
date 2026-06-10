"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TfiClose, TfiSearch } from "react-icons/tfi";
import SearchBarResultsItem from "./SearchBarResultsItem";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useRouter } from "next/navigation";
import { PiArrowRightThin } from "react-icons/pi";
import SearchBarLoader from "@/components/ui/SearchBarLoader";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

type SearchedItems = {
  _id: string;
  name: string;
  coverImage: string;
  price: number;
  slug: string;
};

export default function SearchBar({
  onCloseModal,
}: {
  onCloseModal?: () => void;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<String | null>(null);
  const [products, setProducts] = useState<SearchedItems[] | null>([]);

  const ref = useOutsideClick(() => setSearchTerm(""), false); // we had to use false here so the modal closes with the search results

  const getSearchItemsHandler = useCallback(async () => {
    setProducts(null);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/search?q=${searchTerm}`);

      if (!res.ok) throw new Error("Error getting search item");
      const products = await res.json();
      setProducts(products.data);
    } catch (error) {
      console.error((error as Error)?.message || (error as Error).toString());
      setError("Falied to get searched items. Pls try again later");
    }

    setIsLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.length <= 2) return;
    // initial search
    if (searchTerm.length === 3) {
      getSearchItemsHandler();
      return;
    }

    const debounce = setTimeout(() => getSearchItemsHandler(), 700);

    return () => clearTimeout(debounce);
  }, [searchTerm, getSearchItemsHandler]);

  function handleSubmit(e: React.MouseEvent | React.FormEvent) {
    e.preventDefault();
    if (searchTerm.length <= 2) return;

    setSearchTerm("");
    router.push(`/search?q=${searchTerm}`);
    onCloseModal?.();
  }

  return (
    <section
      className={`${inter.className} max-w-7xl mx-auto px-3 h-full flex items-center justify-start md:px-0 md:justify-center text-primary`}
    >
      <div
        ref={ref}
        className="flex items-center w-11/12 gap-5 md:w-[85%] lg:w-[62%]"
      >
        <form className="grow relative" onSubmit={handleSubmit}>
          <div className="flex h-[45px] w-full border border-primary rounded-[5px] text-[13px] focus:outline-none hover:ring-1 hover:ring-primary">
            <input
              type="text"
              className="grow focus:outline-none rounded-l-[5px] text-base text-primary px-5 placeholder:text-base placeholder:font-light placeholder:text-primary placeholder:tracking-wider md:text-sm"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <button className="group pl-[12px] pr-4">
              <TfiSearch className="h-[18px] w-[18px] text-primary group-hover:scale-110 transition-[scale] duration-150" />
            </button>
          </div>
          {searchTerm.length > 2 && (
            <div className="absolute left-0 w-full bg-white rounded-[5px] mt-[2px] max-h-[450px] overflow-y-auto pt-3 min-[450px]:w-11/12 sm:w-full sm:max-h-96">
              {isLoading && <SearchBarLoader />}
              {!isLoading && products?.length! > 0 && (
                <ul className="grid sm:grid-cols-2">
                  {products?.map((product) => (
                    <SearchBarResultsItem key={product._id} item={product} />
                  ))}

                  <button
                    onClick={handleSubmit}
                    className="group col-span-full flex items-center justify-between px-4 text-sm tracking-wider mt-2 py-3 border-t border-solid border-[#1212121a] hover:bg-[#1212120a] sm:px-5"
                  >
                    View all results for {`"${searchTerm}"`}
                    <PiArrowRightThin className="w-4 h-4 text-primary group-hover:scale-125 transition-all duration-300" />
                  </button>
                </ul>
              )}
              {!isLoading && products?.length! === 0 && (
                <p className="text-sm px-4 sm:px-5 pb-3 tracking-wider">
                  No results was found for {`"${searchTerm}"`}
                </p>
              )}
              {error && products?.length! === 0 && (
                <p className="text-sm px-4 sm:px-5 pb-3 tracking-wider">
                  {error}
                </p>
              )}
            </div>
          )}
        </form>
        <button
          onClick={() => {
            setSearchTerm("");
            onCloseModal?.();
          }}
        >
          <TfiClose className="w-5 h-5 text-primary" />
        </button>
      </div>
    </section>
  );
}

// sort
// const sortString = `&sort=-name`;
// // pagination

// const pageString = `&page=1&limit=8`;

// const res = await fetch(
//   `/api/products/search?q=${searchTerm}${pageString}${sortString}`
// );

// if (!res.ok) throw new Error("Error getting search item");
// const data = await res.json();
