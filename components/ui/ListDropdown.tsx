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
  dropDown: DropdownProps[];
  onCloseModal: () => void;
};

export default function ListDropdown({
  text,
  dropDown,
  onCloseModal,
}: ListDropdownProps) {
  const [dropdownEnabled, setDropdownEnabled] = useState<boolean>(false);

  return (
    <li className="">
      <div
        className="flex items-center justify-between border-b border-primary border-solid py-3 px-[10px]"
        role="button"
        onClick={() => setDropdownEnabled((prev) => !prev)}
      >
        <span className="basis-9/12 tracking-wider">{text}</span>
        <button>
          <MdKeyboardArrowDown
            className={`w-[22px] h-[22px] text-primary transition-all duration-300 ${
              dropdownEnabled && "rotate-180"
            }`}
          />
        </button>
      </div>

      {dropdownEnabled && (
        <ul className="px-[10px] mt-[10px]">
          {dropDown.map((link) => (
            <li
              key={link.path}
              className="border-b border-primary border-solid py-3 px-[10px]"
            >
              <Link href={link.path} onClick={onCloseModal} className="block">
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
