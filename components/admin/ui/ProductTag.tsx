import React from "react";

export default function ProductTag({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="justify-self-start bg-[#e5e7eb] text-[#374151] w-fit uppercase text-[11px] font-semibold py-1 px-3 rounded-[100px]">
        Out of stock
      </span>
    );
  }

  if (stock <= 15) {
    return (
      <span className="justify-self-start bg-yellow-100 text-yellow-700 w-fit uppercase text-[11px] font-semibold py-1 px-3 rounded-[100px]">
        Low stock
      </span>
    );
  }

  return (
    <span className="justify-self-start bg-green-100 text-green-700 w-fit uppercase text-[11px] font-semibold py-1 px-3 rounded-[100px]">
      Active
    </span>
  );
}
