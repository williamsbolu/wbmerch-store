export default function CheckoutSkeleton() {
  return (
    <section className="max-w-xl mx-auto grid lg:grid-cols-[1.5fr_1.2fr] lg:max-w-[1100px] lg:h-full">
      <div className="px-4 bg-stone-100/70 border-b border-solid border-gray-200 flex justify-between items-center py-5 mb-6 lg:hidden">
        <div className="h-4 bg-zinc-300 w-28 rounded-md animate-pulse"></div>
        <div className="h-5 bg-zinc-300 w-24 rounded-md animate-pulse"></div>
      </div>
      <div className="px-4 border-solid border-gray-300 lg:py-[38px] lg:pr-[38px] lg:border-r">
        <div className="space-y-5 border-b border-solid border-stone-300 pb-9">
          <div className="w-40 h-[18px] bg-zinc-300 rounded-md animate-pulse mx-auto"></div>
          <div className="grid grid-rows-[45px_45px] grid-cols-2 gap-3 lg:gap-4 lg:grid-cols-3 lg:grid-rows-[45px]">
            <div className="bg-zinc-300 rounded-md animate-pulse col-span-full lg:col-span-1"></div>
            <div className="bg-zinc-300 rounded-md animate-pulse"></div>
            <div className="bg-zinc-300 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-5 pt-8 pb-6 border-b border-solid border-stone-300">
          <div className="h-5 bg-zinc-300 w-24 rounded-md animate-pulse"></div>
          <div className="grid gap-3">
            <div className="h-4 bg-zinc-300 w-full rounded-md animate-pulse"></div>
            <div className="h-4 bg-zinc-300 w-full rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-5 pt-8 pb-6">
          <div className="h-5 bg-zinc-300 w-32 rounded-md animate-pulse"></div>
          <div className="grid gap-3">
            <div className="h-4 bg-zinc-300 w-full rounded-md animate-pulse"></div>
            <div className="h-4 bg-zinc-300 w-full rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="hidden bg-stone-100/70 pl-[38px] pr-5 py-[38px] border-r border-solid border-gray-100 lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-zinc-300 animate-pulse rounded-[5px]"></div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-zinc-300 w-28 rounded-[5px] animate-pulse"></div>
              <div className="h-3 bg-zinc-300 w-14 rounded-[5px] animate-pulse"></div>
            </div>
          </div>
          <div className="h-3 bg-zinc-300 w-14 rounded-[5px] animate-pulse"></div>
        </div>
        <div className="mt-8 grid gap-3">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-zinc-300 w-16 rounded-[5px] animate-pulse"></div>
            <div className="h-3 bg-zinc-300 w-16 rounded-[5px] animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-zinc-300 w-16 rounded-[5px] animate-pulse"></div>
            <div className="h-3 bg-zinc-300 w-16 rounded-[5px] animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-zinc-300 w-16 rounded-[5px] animate-pulse"></div>
            <div className="h-3 bg-zinc-300 w-16 rounded-[5px] animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="h-5 bg-zinc-300 w-24 rounded-[5px] animate-pulse"></div>
            <div className="h-5 bg-zinc-300 w-24 rounded-[5px] animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
