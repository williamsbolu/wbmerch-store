export default function Loading() {
  return (
    <section className="max-w-[1100px] mt-5 mb-12 mx-auto px-4 grid grid-cols-1 gap-10 md:grid-cols-2 md:mb-10 md:gap-8 lg:gap-12 md:px-5 min-[1140px]:px-0">
      <div className="h-[65vw] w-full animate-pulse rounded-lg bg-zinc-300 md:h-full"></div>

      <div className="grid gap-4 md:gap-5">
        <div className="h-8 w-[90%] animate-pulse rounded-sm bg-zinc-300 md:h-[42px]"></div>
        <div className="h-5 w-40 animate-pulse rounded-sm bg-zinc-300"></div>

        <div className="space-y-[7px]">
          <div className="h-4 w-14 animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-6 w-64 animate-pulse rounded-sm bg-zinc-300 md:h-8"></div>
        </div>

        <div className="space-y-[7px]">
          <div className="h-4 w-14 animate-pulse rounded-sm bg-zinc-300"></div>
          <div className="h-6 w-36 animate-pulse rounded-sm bg-zinc-300 md:h-8"></div>
        </div>

        <div className="space-y-[10px] md:space-y-[7px]">
          <div className="h-8 animate-pulse rounded-sm bg-zinc-300 w-full lg:w-4/5 md:h-10"></div>
          <div className="h-8 animate-pulse rounded-sm bg-zinc-300 w-full lg:w-4/5 md:h-10"></div>
        </div>
      </div>
    </section>
  );
}
