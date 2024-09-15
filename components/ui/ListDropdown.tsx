"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type DropdownProps = {
  text: string;
  path: string;
};

type ListDropdownProps = {
  text: string;
  path: string;
  dropDown: DropdownProps[];
};

export default function ListDropdown({
  text,
  path,
  dropDown,
}: ListDropdownProps) {
  const [dropdownEnabled, setDropdownEnabled] = useState<boolean>(false);

  return (
    <li className="">
      <span className="flex items-center justify-between border-b border-primary border-solid py-3 px-[10px]">
        <Link href={path} className="basis-9/12">
          {text}
        </Link>
        <button onClick={() => setDropdownEnabled((prev) => !prev)}>
          <MdKeyboardArrowDown
            className={`w-[22px] h-[22px] text-primary transition-all duration-300 ${
              dropdownEnabled && "rotate-180"
            }`}
          />
        </button>
      </span>

      {dropdownEnabled && (
        <ul className="px-[10px] mt-3">
          {dropDown.map((link) => (
            <li
              key={link.path}
              className="border-b border-primary border-solid py-3 px-[10px]"
            >
              <Link href={link.path} className="block">
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
