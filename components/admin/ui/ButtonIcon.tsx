"use client";

import Link from "next/link";

export default function ButtonIcon({
  type,
  to,
  children,
  onClick,
}: {
  type: "link" | "button";
  to?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (type === "link") {
    return (
      <Link
        href={to!}
        className="block bg-transparent border-none p-[6px] rounded-[5px] transition-all duration-200 hover:bg-gray-100"
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="bg-transparent border-none p-[6px] rounded-[5px] transition-all duration-200 hover:bg-gray-100"
    >
      {children}
    </button>
  );
}
