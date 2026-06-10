import { getAllOrders } from "@/data/order";
import OrderTableContainer from "@/components/admin/orders/OrderTableContainer";
import Pagination from "@/components/admin/ui/Pagination";

export default async function OrderTableBody({
  query,
}: {
  query: {
    page: number;
    sort: string;
    status: string;
  };
}) {
  const { count, data } = await getAllOrders(query);

  return (
    <>
      <OrderTableContainer orders={data} />
      <Pagination count={count} size={10} />
    </>
  );
}
