export default function SkeletonHome() {
  return (
    <section className="max-w-7xl mx-auto gap-x-3 grid grid-cols-2 gap-y-8 sm:gap-x-4 md:grid-cols-3 mb-10">
      <div className="grid gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[28vw] xl:h-[300px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[28vw] xl:h-[300px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
        </div>
      </div>
      <div className="grid gap-3">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[28vw] xl:h-[300px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
        </div>
      </div>
      <div className="grid gap-3 md:hidden">
        <div className="h-[40vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-[28vw] xl:h-[300px]"></div>
        <div className="space-y-2 px-1">
          <div className="h-4 w-[75%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
          <div className="h-4 w-[40%] animate-pulse rounded-sm bg-zinc-300 md:h-5"></div>
        </div>
      </div>
    </section>
  );
}
