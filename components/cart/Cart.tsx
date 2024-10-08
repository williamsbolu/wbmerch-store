"use client";

import Link from "next/link";
import Button from "../ui/Button";
import CartItem from "./CartItem";
import CartTableHead from "./CartTableHead";
import { useSelector } from "react-redux";
import CartEmpty from "./CartEmpty";
import { cartItemObject } from "./cartSlice";
import { useRouter } from "next/navigation";

export default function Cart() {
  const products = useSelector((state: any) => state.cart.items);
  const router = useRouter();

  if (!products || products.length === 0) {
    return <CartEmpty />;
  }

  return (
    <section className="max-w-[1100px] mt-[132px] mb-20 mx-auto px-4 md:px-5 min-[1140px]:px-0">
      <div className="flex justify-between items-center mt-11 mb-9">
        <h1 className="text-3xl md:text-[40px] tracking-wide">Your cart</h1>
        <Link
          href="/collections/all"
          className="underline underline-offset-[3px] tracking-wide text-[15px] text-base"
        >
          Continue shopping
        </Link>
      </div>

      <div>
        <table className="w-full">
          <CartTableHead />

          <tbody className="border-y border-[#12121218]">
            {products.map((item: cartItemObject) => (
              <CartItem key={item.id} {...item} />
            ))}
          </tbody>
        </table>

        <div className="text-[#121212BF] mt-16 mb-12 grid gap-3 justify-items-center md:justify-items-end">
          <div className="flex items-center gap-5 justify-center">
            <h2 className="text-base text-primary tracking-wider">Subtotal</h2>
            <p className="text-lg font-normal tracking-wider">$1,000.00 USD</p>
          </div>

          <p className="text-[13px] tracking-wide md:justify-self-end mb-1">
            Taxes and shipping calculated at checkout
          </p>

          <Button
            type="button"
            variation="primary"
            classes={["w-[90%] -[420px]:w-[348px] sm:w-[348px]"]}
            onClick={() => router.push("/checkout")}
          >
            Check out
          </Button>
        </div>
      </div>
    </section>
  );
}
