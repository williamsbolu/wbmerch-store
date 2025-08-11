import Stats from "@/components/admin/dashboard/Stats";
import {
  getOrderWithinDays,
  getTodaysOrder,
  getAllOrdersForDashboard,
} from "@/data/order";
import { getAllUsersCount } from "@/data/user";
import SalesChart from "@/components/admin/dashboard/SalesChart";
import CurrencyChart from "@/components/admin/dashboard/CurrencyChart";
import TodayActivity from "@/components/admin/dashboard/TodayActivity";

export default async function DashboardLayout({
  numDays,
}: {
  numDays: number | undefined;
}) {
  const [orders, userCount, todaysOrder] = await Promise.all([
    numDays ? getOrderWithinDays(numDays) : getAllOrdersForDashboard(),
    getAllUsersCount(),
    getTodaysOrder(),
  ]);

  return (
    <div className="grid grid-cols-4 grid-rows-[auto_340px_auto] gap-6">
      <Stats orders={orders} userCount={userCount} />
      <TodayActivity orders={todaysOrder} />
      <CurrencyChart orders={orders} />
      <SalesChart orders={orders} numDays={numDays || 0} />
    </div>
  );
}
