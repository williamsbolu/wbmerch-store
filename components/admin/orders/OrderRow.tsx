"use client";

import Image from "next/image";
import { useState } from "react";
import { Sono } from "next/font/google";
import { FcCancel } from "react-icons/fc";
import { HiEllipsisVertical, HiEye } from "react-icons/hi2";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import ModalContainer from "@/components/ui/ModalContainer";
import OrderTag from "@/components/admin/ui/OrderTag";
import img from "@/public/unisex-eco-raglan-hoodie-black-front-3.jpg";
import { useRouter } from "next/navigation";

const sono = Sono({ subsets: ["latin"], display: "swap" });

export default function OrderRow() {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const router = useRouter();

  const handleOptionsToggle = () => {
    setOptionsOpen((state) => !state);
  };

  const ref = useOutsideClick(handleOptionsToggle, false);

  return (
    <div
      className="grid grid-cols-[1.3fr_1fr_1.2fr_0.7fr_0.7fr_0.2fr] gap-5 items-center px-3 py-4 border-b border-solid border-gray-100 last:border-b-0"
      role="row"
    >
      <div className="flex gap-2">
        <Image
          src={img}
          alt={"text"}
          width={40}
          height={40}
          className="rounded-md"
        />

        <h3 className="tracking-wide text-xs">
          WB Oversized Faded T-Shirt (faded-black){" "}
          <span className="text-gray-500">+3</span>
        </h3>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-medium">ORD-231015-x4Gh9z</span>
        <span className="text-xs text-gray-500">Nov 29 2024</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-medium">Jonatan Johansson</span>
        <span className="text-xs text-gray-500">jonatan@example.com</span>
      </div>

      <OrderTag type="red">cancelled</OrderTag>

      <div className={`${sono.className} font-medium`}>$6,050.000</div>

      <ModalContainer>
        <div className="relative flex items-center justify-end">
          <button
            className="bg-none border-none p-1 rounded-md transition-all duration-200 hover:bg-gray-100"
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
                  className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50"
                  onClick={() => router.push("/admin/orders/1555")}
                >
                  <HiEye className="w-5 h-5 text-gray-400 transition-all duration-300" />
                  <span className="whitespace-nowrap">See details</span>
                </button>
              </li>
              <li>
                <ModalContainer.Open opens="edit-product">
                  <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                    <RiVerifiedBadgeFill className="w-5 h-5 text-gray-400 transition-all duration-300" />
                    <span className="whitespace-nowrap">Confirm order</span>
                  </button>
                </ModalContainer.Open>
              </li>
              <li>
                <ModalContainer.Open opens="delete-product">
                  <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                    <FcCancel className="w-5 h-5 text-gray-400 transition-all duration-300" />
                    <span className="whitespace-nowrap">Cancel order</span>
                  </button>
                </ModalContainer.Open>
              </li>
            </ul>
          )}
        </div>
      </ModalContainer>
    </div>
  );
}
