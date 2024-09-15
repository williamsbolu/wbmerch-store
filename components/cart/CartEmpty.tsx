import Link from "next/link";
import React from "react";
import Button from "../ui/Button";

export default function CartEmpty() {
  return (
    <section className="max-w-[1100px] mx-auto pt-16 pb-4 px-4 md:px-5 min-[1140px]:px-0">
      <div className="pb-[10px] text-center">
        <h1 className="text-[40px] tracking-wide mb-6 font-normal">
          Your cart is empty
        </h1>

        <Button
          type="link"
          href="/collections/all"
          variation="primary"
          classes={["px-8"]}
        >
          Continue shopping
        </Button>
      </div>
    </section>
  );
}
