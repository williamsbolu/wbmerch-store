import { getSearchedProducts } from "@/lib/data-service";
import ProductList from "./ProductList";

export default async function SearchedProductList({
  query,
}: {
  query: { q: string; page: number; sort: string };
}) {
  const { data, count } = await getSearchedProducts(query);

  return (
    <>
      <p className="text-sm text-[#121212BF] tracking-wider md:text-base">
        {count} results found for &quot;{query.q}&quot;
      </p>
      <div className="my-10">
        <ProductList products={data} gridType="page" count={count} />
      </div>
    </>
  );
}
