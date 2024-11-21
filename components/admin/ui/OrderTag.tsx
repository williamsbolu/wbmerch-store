import React from "react";

export default function OrderTag({
  type,
  children,
}: {
  type: "yellow" | "sky" | "green" | "red";
  children: React.ReactNode;
}) {
  if (type === "red") {
    return (
      <span className="w-fit uppercase text-[11px] rounded-[100px] tracking-wider font-semibold py-1 px-3 bg-red-100 text-red-700">
        {children}
      </span>
    );
  }

  return (
    <span
      className={`w-fit uppercase text-[11px] rounded-[100px] tracking-wider font-semibold py-1 px-3 bg-${type}-100 text-${type}-700`}
    >
      {children}
    </span>
  );
}
