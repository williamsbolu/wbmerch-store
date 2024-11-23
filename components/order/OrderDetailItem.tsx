import OrderStatus from "@/components/order/OrderStatus";
import image1 from "@/public/unisex-eco-raglan-hoodie-black-front-3.jpg";
import { convertAmountWithRate, getCurrencySymbol } from "@/utils/helpers";
import { Category, Size, Status } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";

type StatusType = "yellow" | "sky" | "gray" | "green";

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

export default function OrderDetailItem({
  item: { price, quantity, size, product },
  currency,
  currencyRate,
  status,
  createdAt,
  confirmedAt,
  deliveredAt,
  cancelledAt,
}: {
  item: itemPtops;
  currency: string;
  currencyRate: number;
  status: Status;
  createdAt: Date;
  confirmedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
}) {
  const statusColor = {
    pending: "yellow",
    confirmed: "sky",
    delivered: "green",
    cancelled: "red",
  };

  const statusTimeStamp = {
    pending: createdAt,
    confirmed: confirmedAt,
    delivered: deliveredAt,
    cancelled: cancelledAt,
  };

  return (
    <li className="border border-solid rounded-md border-gray-300 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="sm:space-y-[6px]">
          <OrderStatus type={statusColor[status] as StatusType}>
            Delivered
          </OrderStatus>
          <p className="text-sm">
            On {format(new Date(statusTimeStamp[status]!), "dd-MM-yyyy")}
          </p>
        </div>
        <button className="text-red-500 uppercase text-xs font-medium flex gap-2 items-center py-[5px] px-2 rounded-[3px] hover:bg-red-100 transition-all duration-150 sm:text-[13px]">
          See status history
        </button>
      </div>

      <div className="flex gap-4 mr-auto">
        <Image
          src={product.coverImage}
          height={104}
          width={104}
          alt={product.name}
          className="block self-start rounded-md overflow-hidden"
        />

        <div className="flex flex-col gap-[4px]">
          <p className="text-sm tracking-wider">{product.name}</p>
          <div className="space-y-[2px]">
            {size && (
              <p className="text-sm text-gray-600 mt-[2px]">
                size:{" "}
                <span className="text-xs text-primary uppercase">{size}</span>
              </p>
            )}
            <p className="text-[13px] text-gray-600">
              QTY: <span className="text-primary">{quantity}</span>
            </p>
          </div>
          <p className="text-sm pl-1">
            {getCurrencySymbol(currency)}
            {convertAmountWithRate(price, currencyRate, currency)}
          </p>
        </div>
      </div>
    </li>
  );
}
