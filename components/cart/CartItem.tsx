"use client";

import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useTransition } from "react";
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
import ButtonSpinner from "../ui/ButtonSpinner";
import {
  formatCurrency,
  formatSizeText,
  getCurrencySymbol,
} from "@/utils/helpers";
import { Size } from "@prisma/client";
import Modal from "@/components/ui/ModalContainer";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { useCurrency } from "@/context/CurrencyContext";

export default function CartItem({
  productId,
  product,
  quantity,
  productQuantityInStock,
  size,
}: cartItemObject) {
  const { currency, convertPrice } = useCurrency();
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  const getUnitQuantity = () => {
    // Any of this three code comparison will take effect effectively
    if (productQuantityInStock) {
      return productQuantityInStock;
    }

    if (size && product?.sizes) {
      return product.sizes[size as keyof typeof Size];
    }

    return product.stock;
  };

  // The total stock quantity is either the productQuantityInStock for incase the cart was added directly by the redux reducer "addItem",
  // or by getting the stock quantity directly from stock or the sizes stock in case the cart was replaced by the user during refresh. reducer "replaceCart"
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
    if (quantity >= getUnitQuantity()!) {
      toast.error("Maximum quantity reached");
      return;
    }

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

  const price = convertPrice(product.price);

  return (
    <tr className="relative last:mb-20">
      <td className="py-5">
        <div className="flex gap-3 items-start sm:items-center sm:gap-8 md:gap-10">
          <div className="relative h-20 w-20 rounded-xl overflow-hidden sm:h-28 sm:w-28">
            <Image
              src={product.coverImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid gap-4 sm:gap-6">
            <div className="space-y-[6px]">
              <Link
                href={`/products/${product.slug}`}
                className="text-sm sm:text-[15px]"
              >
                {product.name}
              </Link>
              <span className="block text-[#121212BF] text-[13px]  tracking-wide mb-4 sm:text-sm">
                {getCurrencySymbol(currency)}
                {formatCurrency(price, currency === "NGN" ? 0 : 2)}
              </span>
              {size && (
                <span className="block text-[#121212BF] text-xs tracking-wide capitalize sm:text-[13px]">
                  Size: {formatSizeText(size)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:hidden">
              <div className="grid grid-cols-[35px_40px_35px] h-[37px] border-[1px] border-solid border-primary rounded-[5px] w-max sm:h-[47px] sm:grid-cols-[45px_50px_45px]">
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

              <Modal>
                <Modal.Open opens="delete-cart-mobile">
                  <button className="p-1" onClick={decreaseQuantityHandler}>
                    <RiDeleteBinLine className="w-4 h-4 text-primary" />
                  </button>
                </Modal.Open>
                <Modal.Window name="delete-cart-mobile">
                  <ConfirmDelete
                    disabled={isPending}
                    onConfirm={deleteCart}
                    resourceName="item"
                  />
                </Modal.Window>
              </Modal>
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

          <Modal>
            <Modal.Open opens="delete-cart">
              <button className="p-1" onClick={deleteCart}>
                <RiDeleteBinLine className="w-4 h-4 text-primary" />
              </button>
            </Modal.Open>
            <Modal.Window name="delete-cart">
              <ConfirmDelete
                disabled={isPending}
                onConfirm={deleteCart}
                resourceName="item"
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>

      <td className="pl-3 md:pl-10 grid py-5 md:table-cell">
        <div className="text-right">
          <span className="inline-block tracking-wider">
            {getCurrencySymbol(currency)}
            {formatCurrency(price * quantity, currency === "NGN" ? 0 : 2)}
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
