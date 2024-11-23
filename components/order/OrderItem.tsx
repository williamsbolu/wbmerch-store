import Image from "next/image";
import OrderStatus from "./OrderStatus";
import { Size, Status } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

type StatusType = "yellow" | "sky" | "gray" | "green";

type OrderItemProp = {
  items: {
    size: Size | null;
    product: {
      name: string;
      coverImage: string;
    };
  }[];
  status: Status;
  orderId: string;
  createdAt: Date;
};

export default function OrderItem({ order }: { order: OrderItemProp }) {
  const statusColor = {
    pending: "yellow",
    confirmed: "sky",
    delivered: "green",
    cancelled: "red",
  };

  return (
    <li className="relative group flex flex-col gap-4 border border-solid border-gray-300 p-4 rounded-md shadow-sm md:flex-row">
      <div className="flex gap-4 mr-auto">
        <Image
          src={order.items[0].product.coverImage}
          height={104}
          width={104}
          alt={order.items[0].product.name}
          className="block self-start rounded-md overflow-hidden"
        />

        <div className="flex flex-col gap-4">
          <div className="space-y-[5px]">
            <p className="text-sm tracking-wider font-normal">
              {order.items[0].product.name}
            </p>
            <p className="text-[13px] text-gray-500">{order.orderId}</p>
          </div>

          <div className="space-y-[6px]">
            <OrderStatus type={statusColor[order.status] as StatusType}>
              {order.status}
            </OrderStatus>
            <p className="text-sm font-medium pl-1">
              On {format(new Date(order.createdAt), "dd-MM-yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="self-stretch flex justify-end items-start">
        <Link
          href={`/account/orders/${order.orderId}`}
          className="text-red-500 gap-2 items-center py-[5px] px-2 uppercase text-[13px] font-medium rounded-[3px] hover:bg-red-100 transition-all duration-150 inline-block"
        >
          See Details
        </Link>
      </div>
    </li>
  );
}
