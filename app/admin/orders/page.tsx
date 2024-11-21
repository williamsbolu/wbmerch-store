import { Suspense } from "react";
import Loader from "@/components/admin/ui/Loader";
import OrderTableOperations from "@/components/admin/orders/OrderTableOperations";
import OrderTableBody from "@/components/admin/orders/OrderTableBody";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status = (searchParams?.status as string) || "all";

  const page = !searchParams?.page ? 1 : Number(searchParams.page);
  const sort = (searchParams?.sortBy as string) || "createdAt-desc";

  const query = { page, sort, status };
  const suspenseKey = `${page}${sort}${status}`;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All orders</h1>
        <OrderTableOperations />
      </div>

      <div className="flex flex-col gap-4">
        <div
          className="border border-solid border-gray-200 text-sm bg-white rounded-[7px]"
          role="table"
        >
          <div
            className="grid grid-cols-[1fr_1.2fr_0.5fr_0.7fr_0.7fr_0.2fr] gap-5 items-center py-4 pl-5 pr-3 bg-gray-50 border-b border-solid border-gray-100 uppercase tracking-wide font-semibold text-gray-600"
            role="row"
          >
            <div>Order Id</div>
            <div>Customer Info</div>
            <div>Qty</div>
            <div>status</div>
            <div>Amount</div>
            <div></div>
          </div>

          <Suspense fallback={<Loader />} key={suspenseKey}>
            <OrderTableBody query={query} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
