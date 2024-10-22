import OrderTableContainer from "@/components/admin/orders/OrderTableContainer";
import OrderTableOperations from "@/components/admin/orders/OrderTableOperations";
import Loader from "@/components/admin/ui/Loader";
import { Suspense } from "react";

export default async function Page() {
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
            className="grid grid-cols-[1.3fr_1fr_1.2fr_0.7fr_0.7fr_0.2fr] gap-5 items-center py-4 px-3 bg-gray-50 border-b border-solid border-gray-100 uppercase tracking-wide font-semibold text-gray-600"
            role="row"
          >
            <div>Items</div>
            <div>Order Id</div>
            <div>Customer Info</div>
            <div>status</div>
            <div>Amount</div>
            <div></div>
          </div>

          <Suspense fallback={<Loader />} key={"Addkey"}>
            <OrderTableContainer />
          </Suspense>
        </div>
      </div>
    </>
  );
}
