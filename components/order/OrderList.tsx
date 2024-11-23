import OrderItem from "@/components/order/OrderItem";
import Pagination from "@/components/ui/Pagination";
import { getOrdersByStatus } from "@/data/order";

export default async function OrderList({
  query,
}: {
  query: {
    page: number;
    status: string;
  };
}) {
  const { count, data } = await getOrdersByStatus(query);

  if (!data || data.length === 0)
    return (
      <p className="text-accent-400 text-[15px] my-10 mx-3 tracking-wide">
        No orders to show at the moment.
      </p>
    );

  return (
    <div className="grid gap-4">
      <ul className="grid gap-4">
        {data.map((order) => (
          <OrderItem order={order} key={order.orderId} />
        ))}
      </ul>

      <Pagination size={10} count={count} />
    </div>
  );
}
