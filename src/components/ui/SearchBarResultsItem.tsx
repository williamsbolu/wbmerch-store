import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";

type ItemProps = {
  coverImage: string;
  name: string;
  price: number;
  slug: string;
};

export default function SearchBarResultsItem({
  item: { coverImage, name, price, slug },
}: {
  item: ItemProps;
}) {
  const { currency, convertPrice } = useCurrency();

  const convertedPrice = convertPrice(price);

  return (
    <li className="group rounded-md px-4 hover:bg-[#1212120a] transition-all duration-200 sm:px-5">
      <Link href={`/products/${slug}`} className="flex py-3 gap-4">
        <Image
          src={coverImage}
          width={65}
          height={65}
          className="rounded-md"
          alt={name}
        />
        <div className="space-y-3 py-1">
          <h3 className="text-xs mb-[1px] tracking-wider">{name}</h3>
          <span className="text-[13px] text-primary tracking-wider">
            {getCurrencySymbol(currency)}
            {formatCurrency(convertedPrice, currency === "NGN" ? 0 : 2)}
          </span>
        </div>
      </Link>
    </li>
  );
}
