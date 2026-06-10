import { getAllProducts } from "@/data/products";
import Pagination from "@/components/admin/ui/Pagination";
import ProductTableContainer from "./ProductTableContainer";

export default async function ProductTableBody({
  query,
}: {
  query: {
    page: number;
    sort: string;
    status: string | undefined;
  };
}) {
  const { count, data } = await getAllProducts(query);

  return (
    <>
      <ProductTableContainer products={data} />
      <Pagination count={count} size={10} />
    </>
  );
}
