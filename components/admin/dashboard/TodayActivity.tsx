import { TodaysOrderProp } from "@/utils/types";
import TodayItem from "@/components/admin/dashboard/TodayItem";

export default function TodayActivity({
  orders,
}: {
  orders: TodaysOrderProp[];
}) {
  return (
    <div className="col-span-2 bg-white border border-solid border-gray-200 rounded-lg py-5 px-5">
      <h2 className="text-xl font-semibold leading-snug mb-4">Recent orders</h2>

      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <TodayItem key={order.id} order={order} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-base font-medium mt-2">
          No activity today...
        </p>
      )}
    </div>
  );
}
