import { Suspense } from "react";
import AddProducts from "@/components/admin/products/AddProducts";
import ProductTableBody from "@/components/admin/products/ProductTableBody";
import ProductTableOperations from "@/components/admin/products/ProductTableOperations";
import Loader from "@/components/admin/ui/Loader";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status = (searchParams?.status as string) || undefined;

  const page = !searchParams?.page ? 1 : Number(searchParams.page);
  const sort = (searchParams?.sortBy as string) || "createdAt-desc";

  const query = { page, sort, status };
  const suspenseKey = `${page}${sort}${status}`;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All products</h1>
        <ProductTableOperations />
      </div>

      <div className="flex flex-col gap-4">
        <div
          className="border border-solid border-gray-200 text-sm bg-white rounded-[7px]"
          role="table"
        >
          <div
            className="grid grid-cols-[3fr_1.3fr_1.3fr_1.3fr_0.7fr_0.7fr_0.5fr] gap-6 items-center py-4 pl-3 pr-6 bg-gray-50 border-b border-solid border-gray-100 uppercase tracking-wide font-semibold text-gray-600"
            role="row"
          >
            <div className="justify-self-center">Product Name</div>
            <div>Category</div>
            <div>Status</div>
            <div>Price</div>
            <div className="justify-self-center">Sold</div>
            <div className="justify-self-center">Stock</div>
          </div>

          <Suspense fallback={<Loader />} key={suspenseKey}>
            <ProductTableBody query={query} />
          </Suspense>
        </div>

        <AddProducts />
      </div>
    </>
  );
}
