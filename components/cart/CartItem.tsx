"use client";

import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiOutlinePlus } from "react-icons/hi";
import { TfiMinus } from "react-icons/tfi";
import {
  addItem,
  cartItemObject,
  removeItem,
  removeItemQuantity,
} from "./cartSlice";
import {
  addOrUpdateCart,
  deleteCartItem,
  deleteCartQuantity,
} from "@/actions/cart";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useTransition } from "react";
import ButtonSpinner from "../ui/ButtonSpinner";

export default function CartItem({
  productId,
  product,
  quantity,
  size,
}: cartItemObject) {
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  const deleteCart = () => {
    const sessionId = cookies.get("sessionId");

    startTransition(() => {
      deleteCartItem(sessionId, productId, size)
        .then(() => {
          dispatch(removeItem({ id: productId, size }));
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  function decreaseQuantityHandler() {
    if (quantity === 1) {
      deleteCart();
      return;
    }

    const sessionId = cookies.get("sessionId");

    startTransition(() => {
      deleteCartQuantity(sessionId, productId, size)
        .then((data) => {
          dispatch(
            removeItemQuantity({
              id: productId,
              size,
            })
          );

          toast.success("Quantity modified");
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  }

  function increaseQuantityHandler() {
    const sessionId = cookies.get("sessionId");

    startTransition(() => {
      addOrUpdateCart({ sessionId, productId, quantity: 1, size })
        .then(() => {
          dispatch(
            addItem({
              id: uuidv4(), // not useful here, only when creating
              productId,
              product,
              quantity: 1,
              size,
            })
          );

          toast.success("Quantity modified");
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  }

  return (
    <tr className="relative last:mb-20">
      <td className="py-5">
        <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
          <div className="relative h-28 w-28 rounded-xl overflow-hidden">
            <Image
              src={product.coverImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid gap-6">
            <div className="space-y-1">
              <Link href={`/products/${product.slug}`} className="text-[15px]">
                {product.name}
              </Link>
              <span className="block text-[#121212BF] text-[13px] tracking-wide mb-4">
                ${product.price}.00
              </span>
              <span className="block text-[#121212BF] text-[13px] tracking-wide">
                Size: {size}
              </span>
            </div>

            <div className="flex items-center gap-4 md:hidden">
              <div className="grid grid-cols-[45px_50px_45px] h-[47px] border-[1px] border-solid border-primary rounded-[5px] w-max">
                <button
                  className="flex items-center justify-center"
                  onClick={decreaseQuantityHandler}
                >
                  <TfiMinus className="w-3 h-auto" />
                </button>
                <span className="flex items-center justify-center font-normal text-sm">
                  {quantity}
                </span>
                <button
                  className="flex items-center justify-center"
                  onClick={increaseQuantityHandler}
                >
                  <HiOutlinePlus className="w-3 h-3 text-[#121212BF]" />
                </button>
              </div>

              <button className="p-1" onClick={decreaseQuantityHandler}>
                <RiDeleteBinLine className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </td>

      <td className="hidden py-5 md:pl-10 md:table-cell">
        <div className="flex items-center gap-4 justify-center">
          <div className="grid grid-cols-[45px_50px_45px] h-[47px] border-[1px] border-solid border-primary rounded-[5px] w-max">
            <button
              className="flex items-center justify-center"
              onClick={decreaseQuantityHandler}
            >
              <TfiMinus className="w-3 h-auto" />
            </button>
            <span className="flex items-center justify-center font-normal text-sm">
              {quantity}
            </span>
            <button
              className="flex items-center justify-center"
              onClick={increaseQuantityHandler}
            >
              <HiOutlinePlus className="w-3 h-3 text-[#121212BF]" />
            </button>
          </div>

          <button className="p-1" onClick={deleteCart}>
            <RiDeleteBinLine className="w-4 h-4 text-primary" />
          </button>
        </div>
      </td>

      <td className="pl-3 md:pl-10 grid py-5 md:table-cell">
        <div className="text-right">
          <span className="inline-block tracking-wider">
            ${product.price}.00
          </span>
        </div>
      </td>

      {isPending && (
        <td className="absolute left-0 top-0 h-full w-full cursor-not-allowed bg-[#fff] opacity-60">
          <span className="absolute left-1/2 top-1/2 inline-block -translate-x-2/4 -translate-y-1/2">
            <ButtonSpinner variation="transparent" />
          </span>
        </td>
      )}
    </tr>
  );
}
