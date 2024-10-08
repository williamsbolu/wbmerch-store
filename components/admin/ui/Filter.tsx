"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type filterOption = {
  value: string;
  label: string;
};

export default function Filter({
  filterField,
  options,
}: {
  filterField: string;
  options: filterOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const currentFilter = searchParams.get(filterField) || options[0].value;

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(filterField, value);

    // whenever we set a new filter we reset the page to one to avoid errors.
    if (searchParams.get("page")) params.set("page", "1");

    router.push(`${pathName}?${params.toString()}`);
  }

  return (
    <div className="border border-solid border-gray-100 shadow-sm p-1 rounded-[5px] flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option.value)}
          className={`${
            option.value === currentFilter
              ? "bg-indigo-600 text-white"
              : "bg-white"
          } border-none rounded-[5px] font-medium text-sm py-[0.275rem] px-2 transition-all duration-300`}
          disabled={currentFilter === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
