import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import DashboardFilter from "@/components/admin/dashboard/DashboardFilter";
import DashboardLayout from "@/components/admin/dashboard/DashboardLayout";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    return notFound();
  }

  const lastParam = searchParams.last;
  const numDays =
    lastParam === "all" ? undefined : !lastParam ? 7 : Number(lastParam);

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
