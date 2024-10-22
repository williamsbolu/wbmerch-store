import React from "react";

export default function OrderTag({
  type,
  children,
}: {
  type: "gray" | "sky" | "green" | "red";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`w-fit uppercase text-[11px] rounded-[100px] font-semibold py-1 px-3 ${
        type === "gray" ? `bg-gray-200` : `bg-${type}-100`
      } text-${type}-700`}
    >
      {children}
    </span>
  );
}
