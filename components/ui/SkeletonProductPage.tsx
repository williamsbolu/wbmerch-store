import React from "react";

export default function SkeletonProductPage() {
  return (
    <section className="max-w-7xl mx-auto gap-x-3 my-5 grid grid-cols-2 gap-y-8 sm:gap-x-4 md:grid-cols-4 mb-10">
      <div className="grid gap-2">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="hidden md:grid md:gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="hidden md:grid md:gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="hidden md:grid md:gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
      <div className="hidden md:grid md:gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[20vw] xl:h-[200px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300"></div>
        </div>
      </div>
    </section>
  );
}
