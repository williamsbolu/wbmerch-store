import ProductList from "./ProductList";
import { getAllProducts } from "@/lib/data-service";

export default async function AllProductLists({
  query,
}: {
  query: { page: number; sort?: string };
}) {
  const { data, count } = await getAllProducts(query);

  return (
    <div className="my-10">
      <ProductList products={data} gridType="page" count={count} />
    </div>
  );
}
