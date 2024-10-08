"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { HiEllipsisVertical, HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import { Sono } from "next/font/google";
import ModalContainer from "@/components/ui/ModalContainer";
import ProductTag from "@/components/admin/ui/ProductTag";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import ProductForm from "@/components/admin/products/ProductForm";
import ConfirmDelete from "@/components/admin/ui/ConfirmDelete";
import { products } from "@prisma/client";
import { caculateProductStock } from "@/utils/helpers";

const sono = Sono({ subsets: ["latin"], display: "swap" });

export default function ProductRow({
  product,
  onDelete,
}: {
  product: products;
  onDelete: (productId: string) => void;
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOptionsToggle = () => {
    setOptionsOpen((state) => !state);
  };

  const stock = caculateProductStock(product.stock, product.sizes);

  const ref = useOutsideClick(handleOptionsToggle, false);

  const handleDeleteProduct = async () => {
    startTransition(() => onDelete(product.id));
  };

  return (
    <div
      className="grid grid-cols-[3fr_1.5fr_1.3fr_1fr_1fr_0.5fr] gap-6 items-center pl-3 pr-6 py-1 border-b border-solid border-gray-100 last:border-b-0"
      role="row"
    >
      <div className="flex gap-4 items-center">
        <Image
          src={product.coverImage}
          alt={product.name}
          width={60}
          height={60}
          className="rounded-md"
        />
        <h3 className={"tracking-wide"}>{product.name}</h3>
      </div>
      <p className="capitalize">{product.category.split("_").join("-")}</p>
      <ProductTag stock={stock} />
      <p className={`${sono.className} text-base font-semibold text-gray-600`}>
        ${product.price}.00
      </p>
      <p
        className={`justify-self-center ${sono.className} text-base font-semibold text-gray-600 textind`}
      >
        {stock}
      </p>
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
                  onClick={handleOptionsToggle}
                >
                  <HiEye className="w-4 h-4 text-gray-400 transition-all duration-300" />
                  <span className="whitespace-nowrap">See details</span>
                </button>
              </li>
              <li>
                <ModalContainer.Open opens="edit-product">
                  <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                    <HiPencil className="w-4 h-4 text-gray-400 transition-all duration-300" />
                    <span className="whitespace-nowrap">Edit</span>
                  </button>
                </ModalContainer.Open>
              </li>
              <li>
                <ModalContainer.Open opens="delete-product">
                  <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                    <HiTrash className="w-4 h-4 text-gray-400 transition-all duration-300" />
                    <span className="whitespace-nowrap">Delete</span>
                  </button>
                </ModalContainer.Open>
              </li>
            </ul>
          )}
          <ModalContainer.Window name="edit-product">
            <ProductForm productToEdit={product} />
          </ModalContainer.Window>
          <ModalContainer.Window name="delete-product">
            <ConfirmDelete
              resourceName="product"
              onConfirm={handleDeleteProduct}
              disabled={isPending}
            />
          </ModalContainer.Window>
        </div>
      </ModalContainer>
    </div>
  );
}
//
