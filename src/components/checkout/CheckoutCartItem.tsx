import Image from "next/image";
import { CartItem } from "@/utils/types";
import {
  formatCurrency,
  formatSizeText,
  getCurrencySymbol,
} from "@/utils/helpers";
import { useCurrency } from "@/context/CurrencyContext";

export default function CheckoutCartItem({
  cartItem: {
    size,
    quantity,
    product: { name, coverImage, price },
  },
}: {
  cartItem: CartItem;
}) {
  const { currency, convertPrice } = useCurrency();

  const formattedPrice = convertPrice(price);

  return (
    <li className="flex gap-5 lg:gap-0">
      <div className="mr-auto flex gap-4">
        <div className="relative w-fit h-fit border border-solid border-gray-300 rounded-md">
          <Image
            src={coverImage}
            height={64}
            width={64}
            alt={name}
            className="rounded-md"
          />
          <span className="absolute -top-[10px] -right-[5px] bg-red-500 flex items-center justify-center text-xs text-white h-[22px] w-[22px] rounded-full">
            {quantity}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="text-primary text-[13px] tracking-wide">
            Wb unisex sleeve raglan shirt (navy)
          </p>
          {size && (
            <p className="text-[#0000008F] text-xs tracking-wide font-medium">
              Size: {formatSizeText(size)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-primary text-sm">
          {getCurrencySymbol(currency)}
          {formatCurrency(formattedPrice, currency === "NGN" ? 0 : 2)}
        </span>
      </div>
    </li>
  );
}
