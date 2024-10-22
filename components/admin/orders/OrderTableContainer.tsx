import Pagination from "../ui/Pagination";
import OrderRow from "@/components/admin/orders/OrderRow";

export default async function OrderTableContainer() {
  return (
    <>
      <section className="my-2">
        <OrderRow />
        <OrderRow />
        <OrderRow />
        <OrderRow />
        <OrderRow />
        <OrderRow />
      </section>
      <Pagination count={10} size={5} />
    </>
  );
}
