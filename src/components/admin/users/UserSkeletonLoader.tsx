import React from "react";

export default function UserSkeletonLoader() {
  return (
    <>
      <div
        className="grid grid-cols-[2fr_2fr_0.6fr_0.7fr_1fr_0.5fr] gap-6 items-center p-6 border-b border-solid border-gray-100 last:border-b-0"
        role="row"
      >
        <div className="skeleton-loader h-4 w-1/2 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-4 w-4/5 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-2 w-8 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-4 w-16 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-4 w-9/12 bg-zinc-200 rounded-md animate-pulse"></div>
      </div>
      <div
        className="grid grid-cols-[2fr_2fr_0.6fr_0.7fr_1fr_0.5fr] gap-6 items-center p-6 border-b border-solid border-gray-100 last:border-b-0"
        role="row"
      >
        <div className="skeleton-loader h-4 w-1/2 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-4 w-4/5 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-2 w-8 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-4 w-16 bg-zinc-200 rounded-md animate-pulse"></div>
        <div className="skeleton-loader h-4 w-9/12 bg-zinc-200 rounded-md animate-pulse"></div>
      </div>
    </>
  );
}
