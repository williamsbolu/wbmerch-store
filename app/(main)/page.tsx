import { Tilt_Prism } from "next/font/google";
import RecentProductList from "@/components/products/RecentProductList";
import { Suspense } from "react";
import SkeletonHome from "@/components/ui/SkeletonHome";
import Button from "@/components/ui/Button";

const tilt = Tilt_Prism({ subsets: ["latin"], display: "swap" });

export default async function Home() {
  return (
    <>
      <section className="bg-primary">
        <div className="px-5 mx-auto flex flex-col gap-5 py-12 text-white items-center md:max-w-7xl">
          <h1
            className={`${tilt.className} text-3xl md:text-[40px] text-center tracking-normal`}
          >
            The World is Yours
          </h1>
          <p className="text-[#FFFFFfBF] text-[15px] italic text-center tracking-wide md:text-base">
            More than just a wear, it is a movement!
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-5 mt-5 mb-12">
        <Suspense fallback={<SkeletonHome />}>
          <RecentProductList />
        </Suspense>

        <div className="flex justify-center">
          <Button
            type="link"
            href="/collections/all"
            variation="transparent"
            classes={["px-8 text-center"]}
          >
            View all
          </Button>
        </div>
      </section>
    </>
  );
}
