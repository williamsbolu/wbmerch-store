import OrderDetail from "@/components/order/OrderDetail";
import { getOrderById } from "@/data/order";

export default async function Page({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await getOrderById(params.orderId);

  return <OrderDetail order={order} />;
}
