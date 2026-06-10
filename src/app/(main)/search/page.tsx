import React, { Suspense } from "react";
import SkeletonProductPage from "../../../components/ui/SkeletonProductPage";
import SearchedProductList from "../../../components/products/SearchedProductList";
import { getSearchedProducts } from "../../../lib/data-service";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props) {
  const searchKey = (searchParams.q as string) || "";

  // Not really needed here, but just kept it
  const sort = (searchParams?.sort as string) || "name-desc";

  const page = !searchParams?.page ? 1 : Number(searchParams.page);

  const query = { page, q: searchKey, sort };
  const { count } = await getSearchedProducts(query);

  return {
    title: `Search: ${count} results found for "${searchKey}"`,
  };
}

export default function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchKey = (searchParams.q as string) || "";

  // sort
  const sort = (searchParams?.sort as string) || "name-desc";

  // pagination
  const page = !searchParams?.page ? 1 : Number(searchParams.page);

  // const query = { page, limit: 16 }; // no need for limit, a default of 16 is set in the apiFeatures
  const query = { page, q: searchKey, sort };
  const suspenseKey = `${page}${sort}`;

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-5 min-[1140px]:px-0">
      {searchKey && (
        <h1 className="text-2xl tracking-wide mt-6 mb-5 md:text-3xl">
          {searchKey}
        </h1>
      )}

      <Suspense fallback={<SkeletonProductPage />} key={suspenseKey}>
        <SearchedProductList query={query} />
      </Suspense>
    </section>
  );
}
