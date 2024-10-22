"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  slug: string;
};

type ProductProps = {
  product: Product;
};

export default function Product({ product }: ProductProps) {
  const { currency, convertPrice } = useCurrency();
  const price = convertPrice(product.price);

  return (
    <li className="relative group flex flex-col gap-4">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square rounded-2xl overflow-hidden"
      >
        <Image
          src={product.coverImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
          alt={product.name}
        />
      </Link>

      <div className="space-y-1 px-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm tracking-wide font-normal pb-[1px] group-hover:border-b group-hover:border-[#333]"
        >
          {product.name}
        </Link>
        <p className="text-base tracking-wider">
          {getCurrencySymbol(currency)}
          {formatCurrency(price, currency === "NGN" ? 0 : 2)} {currency}
        </p>
      </div>
    </li>
  );
}
