import Image from "next/image";
import { CartItem } from "@/utils/types";
import { formatSizeText } from "@/utils/helpers";

export default function CheckoutCartItem({
  cartItem: {
    size,
    quantity,
    product: { name, coverImage, price },
  },
}: {
  cartItem: CartItem;
}) {
  return (
    <li className="flex gap-5 lg:gap-0">
      <div className="mr-auto flex gap-4">
        <div className="relative w-16 h-16 border border-solid border-gray-300 rounded-md">
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
        <span className="text-primary text-sm">${price}.00</span>
      </div>
    </li>
  );
}
