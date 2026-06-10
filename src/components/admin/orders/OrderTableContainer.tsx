import OrderRow from "@/components/admin/orders/OrderRow";
import { OrderListType } from "@/utils/types";

export default async function OrderTableContainer({
  orders,
}: {
  orders: OrderListType[];
}) {
  return (
    <>
      <section className="my-2">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </section>
    </>
  );
}
