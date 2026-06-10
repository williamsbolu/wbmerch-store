import Image from "next/image";
import { Category, Size } from "@prisma/client";
import { convertAmountWithRate, getCurrencySymbol } from "@/utils/helpers";

type itemPtops = {
  id: string;
  quantity: number;
  size: Size | null;
  price: number;
  product: {
    id: string;
    name: string;
    coverImage: string;
    category: Category;
  };
};

export default function OrderItem({
  item: { price, quantity, size, product },
  currency,
  currencyRate,
}: {
  item: itemPtops;
  currency: string;
  currencyRate: number;
}) {
  return (
    <li className="grid grid-cols-[2fr_0.6fr_0.3fr_0.6fr] gap-3 py-5 text-sm border-b border-solid border-gray-200">
      <div className="flex gap-3">
        <Image
          src={product.coverImage}
          width={70}
          height={70}
          className="rounded-md self-start"
          alt="product"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-sm">{product.name}</h3>

          <div className="text-[13px] space-y-1 text-gray-500">
            <p>Category: {product.category.split("_").join("-")}</p>
            {size && <p>Size: {size}</p>}
          </div>
        </div>
      </div>
      <div className="pt-4">
        {getCurrencySymbol(currency)}
        {convertAmountWithRate(price, currencyRate, currency)}
      </div>
      <div className="pt-4 justify-self-center">{quantity}</div>
      <div className="pt-4 justify-self-end font-medium">
        {getCurrencySymbol(currency)}
        {convertAmountWithRate(price * quantity, currencyRate, currency)}
      </div>
    </li>
  );
}
