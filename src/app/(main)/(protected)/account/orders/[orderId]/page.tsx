import OrderDetail from "@/components/order/OrderDetail";
import { getOrderById } from "@/data/order";

export default async function Page(
  props: {
    params: Promise<{ orderId: string }>;
  }
) {
  const params = await props.params;
  const order = await getOrderById(params.orderId);

  return <OrderDetail order={order} />;
}
