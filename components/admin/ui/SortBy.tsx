"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type filterOption = {
  value: string;
  label: string;
};

export default function SortBy({ options }: { options: filterOption[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", e.target.value);
    router.push(`${pathName}?${params.toString()}`);
  }

  return (
    <select
      className="text-sm py-2 px-3 border border-solid border-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white font-medium shadow-sm rounded-[5px]"
      value={sortBy}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
