import { Suspense } from "react";
import OrderFilter from "@/components/order/OrderFilter";
import Spinner from "@/components/ui/AccountPageSpinner";
import OrderList from "@/components/order/OrderList";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status = (searchParams?.status as string) || "ongoing-delivered";
  const page = !searchParams?.page ? 1 : Number(searchParams.page);

  const query = { page, status };
  const suspenseKey = `${page}${status}`;

  return (
    <>
      <div className="flex flex-col gap-3 mb-4">
        <h2 className="text-xl py-2 text-center md:text-left">Orders</h2>
        <OrderFilter />
      </div>

      <Suspense key={suspenseKey} fallback={<Spinner />}>
        <OrderList query={query} />
      </Suspense>
    </>
  );
}
