"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiEllipsisVertical, HiEye } from "react-icons/hi2";
import image1 from "@/public/unisex-eco-raglan-hoodie-black-front-3.jpg";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { TodaysOrderProp } from "@/utils/types";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";

export default function TodayItem({ order }: { order: TodaysOrderProp }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const router = useRouter();

  const handleOptionsToggle = () => {
    setOptionsOpen((state) => !state);
  };

  const ref = useOutsideClick(handleOptionsToggle, false);

  return (
    <li className="grid grid-cols-[2fr_1fr_0.2fr] items-center gap-3 py-3 text-sm border-b border-gray-100 first-of-type:border-t first-of-type:border-gray-100">
      <div className="flex gap-2 items-center">
        <Image
          src={order.items[0].product.coverImage}
          width={40}
          height={40}
          className="rounded-full"
          alt={order.items[0].product.name}
        />
        <div className="">
          <h3 className="text-[13px] mt-1">
            {order.items[0].product.name}{" "}
            {order.items.length > 1 && (
              <span className="text-gray-500 text-xs">
                +{order.items.length - 1}
              </span>
            )}
          </h3>
        </div>
      </div>

      <p className="justify-self-end">
        {getCurrencySymbol(order.currency)}
        {formatCurrency(
          Number(order.totalAmount),
          order.currency === "NGN" ? 0 : 2
        )}
      </p>

      <div className="relative flex items-center justify-end">
        <button
          className="bg-none border-none p-[2px] rounded-md transition-all duration-200 hover:bg-gray-100"
          onClick={handleOptionsToggle}
        >
          <HiEllipsisVertical className="w-6 h-6 text-gray-700" />
        </button>

        {optionsOpen && (
          <ul
            ref={ref}
            className="absolute w-fit z-10 right-[10%] top-[90%] bg-white shadow-md rounded-lg"
          >
            <li>
              <button
                className="text-left w-full bg-none border-none py-[10px] px-2 text-[13px] transition-all duration-200 flex items-center gap-2 hover:bg-gray-50"
                onClick={() => router.push(`/admin/orders/${order.orderId}`)}
              >
                <HiEye className="w-5 h-5 text-gray-400 transition-all duration-300" />
                <span className="whitespace-nowrap">See details</span>
              </button>
            </li>
            <li>
              <button
                className="text-left w-full bg-none border-none py-[10px] px-2 text-[13px] transition-all duration-200 flex items-center gap-2 hover:bg-gray-50"
                onClick={() => router.push(`/admin/orders/${order.orderId}`)}
              >
                <RiVerifiedBadgeFill className="w-5 h-5 text-green-400 transition-all duration-300" />
                <span className="whitespace-nowrap">Confirm order</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
}
