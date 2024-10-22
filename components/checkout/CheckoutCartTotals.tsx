"use client";

import { useState } from "react";
import { CartItem } from "@/utils/types";
import { RiArrowDownSLine } from "react-icons/ri";
import CheckoutCartItem from "./CheckoutCartItem";
import Button from "../ui/Button";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import { useCurrency } from "@/context/CurrencyContext";

export default function CheckoutCartTotals({
  cartItems,
  shipping,
  isCheckingOut,
  shippingMethod,
  paymentMethod,
  onCheckout,
}: {
  cartItems: CartItem[];
  shipping: number;
  isCheckingOut: boolean;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "pay_on_delivery" | "bank_transfer";
  onCheckout: () => void;
}) {
  const { currency, convertPrice } = useCurrency();
  const [displayCart, setDisplayCart] = useState(false);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const convertedShipping = convertPrice(shipping);

  const cartTotal = convertPrice(
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  // const cartTotalWithShipping = cartTotal + shipping;
  const cartTotalWithShipping = cartTotal + convertedShipping;

  return (
    <div className="px-4 grid gap-10 mb-20 border-r border-solid border-gray-100 lg:mb-0 lg:pl-[38px] lg:py-[38px] lg:pr-5 lg:bg-stone-100/70">
      <div>
        <div>
          <div
            className="flex justify-between items-center py-3 mb-2 lg:hidden"
            role="button"
            onClick={() => setDisplayCart((prevState) => !prevState)}
          >
            <h2 className="text-xl">Order summary</h2>
            <button className="flex items-center text-sm">
              {!displayCart ? "Show" : "Hide"}{" "}
              <span>
                <RiArrowDownSLine
                  className={`w-5 h-5 ${
                    !displayCart ? "rotate-0" : "rotate-180"
                  }`}
                />
              </span>
            </button>
          </div>
          <ul
            className={`space-y-[14px] mb-5 ${
              !displayCart ? "hidden" : "block"
            } lg:hidden`}
          >
            {cartItems.map((item) => (
              <CheckoutCartItem key={item.id} cartItem={item} />
            ))}
          </ul>
        </div>
        <ul className="hidden space-y-[14px] mb-5 lg:block">
          {cartItems.map((item) => (
            <CheckoutCartItem key={item.id} cartItem={item} />
          ))}
        </ul>
        <div className="grid gap-5">
          <form
            className="w-full grid grid-cols-[1fr_min-content] gap-[14px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              className="border border-gray-300 rounded-[5px] text-gray-600 bg-white text-sm font-normal placeholder:text-[#0000008F] placeholder:text-[13px] placeholder:tracking-wide focus:outline-none py-3 px-3"
              placeholder="Discount code or gift card"
            />
            <button className="bg-stone-300/40 text-sm capitalize text-stone-500 px-4 border border-solid rounded-[5px] border-gray-300">
              Apply
            </button>
          </form>
          <div className="grid gap-3 text-sm mt-1">
            <div className="flex justify-between items-center">
              <p>
                Subtotal <span>({totalQuantity} items)</span>
              </p>
              <span>
                {getCurrencySymbol(currency)}
                {formatCurrency(cartTotal, currency === "NGN" ? 0 : 2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>
                Shipping{" "}
                {shippingMethod === "standard" ? "(Standard)" : "(Express)"}
              </span>
              <span>
                {getCurrencySymbol(currency)}
                {formatCurrency(convertedShipping, currency === "NGN" ? 0 : 2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <h2 className="text-[19px]">Total</h2>
              <p className="text-[19px]">
                <span className="text-[#0000008F] text-xs">{currency}</span>{" "}
                {getCurrencySymbol(currency)}
                {formatCurrency(
                  cartTotalWithShipping,
                  currency === "NGN" ? 0 : 2
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Button
        variation="primary"
        type="button"
        classes={["font-medium flex justify-center items-center lg:hidden"]}
        ring={false}
        onClick={onCheckout}
        disabled={isCheckingOut}
      >
        {paymentMethod === "card" ? "Pay now" : "Complete order"}
      </Button>
    </div>
  );
}
