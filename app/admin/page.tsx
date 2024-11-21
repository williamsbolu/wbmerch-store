import { Suspense } from "react";
import DashboardFilter from "@/components/admin/dashboard/DashboardFilter";
import DashboardLayout from "@/components/admin/dashboard/DashboardLayout";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const numDays = !searchParams.last ? 7 : Number(searchParams.last);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <DashboardFilter />
      </div>

      <Suspense key={numDays} fallback={<p>Loading...</p>}>
        <DashboardLayout numDays={numDays} />
      </Suspense>
    </>
  );
}
