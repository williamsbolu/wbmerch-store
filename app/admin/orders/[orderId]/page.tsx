import { notFound } from "next/navigation";
import { auth } from "@/auth";
import OrderDetail from "@/components/admin/orders/OrderDetail";
import { getOrderById } from "@/data/order";

export default async function Page({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    return notFound();
  }

  const order = await getOrderById(params.orderId);

  return <OrderDetail order={order!} />;
}
