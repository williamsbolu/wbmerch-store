import AllProductLists from "@/components/products/AllProductLists";
import SkeletonProductPage from "@/components/ui/SkeletonProductPage";
import { Suspense } from "react";

export const metadata = {
  title: "All Collections",
};

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = !searchParams?.page ? 1 : Number(searchParams.page);

  // const query = { page, limit: 16 }; // no need for limit, a default of 16 is set in the query data
  const query = { page };
  const suspenseKey = `${page}`;

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-5 min-[1140px]:px-0">
      <h1 className="text-3xl md:text-[40px] tracking-wide my-6">Products</h1>

      <Suspense fallback={<SkeletonProductPage />} key={suspenseKey}>
        <AllProductLists query={query} />
      </Suspense>
    </section>
  );
}
