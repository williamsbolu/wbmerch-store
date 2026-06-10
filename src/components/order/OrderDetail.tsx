"use client";

import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import { OrderDetailType } from "@/utils/types";
import OrderDetailItem from "@/components/order/OrderDetailItem";
import { addDays, format, isToday } from "date-fns";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";

export default function OrderDetail({
  order: {
    orderId,
    paymentMethod,
    status,
    currency,
    rateToUsd,
    items,
    shippingAddress,
    totalAmount,
    shippingFee,
    createdAt,
    confirmedAt,
    deliveredAt,
    cancelledAt,
  },
}: {
  order: OrderDetailType;
}) {
  const router = useRouter();

  const deliveryDate = addDays(new Date(createdAt), 3);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col">
        <div className="flex gap-5">
          <button onClick={() => router.back()}>
            <GoArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h2 className="text-xl py-2">Order Details</h2>
        </div>

        <div className="text-sm text-gray-600 pt-4 flex flex-col justify-between items-center md:flex-row">
          <h2 className="text-base text-primary mb-[6px] font-medium tracking-wider">
            {orderId}
          </h2>
          <p className="text-green-500 font-medium flex gap-1 items-center">
            <TbTruckDelivery className="w-5 h-5" />
            Estimated delivery: {format(new Date(deliveryDate), "MMM dd, yyyy")}
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3 text-center md:text-left md:mt-0">
          Order date:{" "}
          <span className="text-gray-700">
            {isToday(new Date(createdAt))
              ? "Today"
              : format(new Date(createdAt), "MMM dd, yyyy")}
          </span>
        </p>
      </div>

      <div className="mt-4">
        <h2 className="uppercase text-sm mb-2">Items in your order</h2>

        <ul className="grid gap-4">
          {items.map((item) => (
            <OrderDetailItem
              key={item.id}
              item={item}
              currency={currency}
              currencyRate={rateToUsd}
              status={status}
              createdAt={createdAt}
              confirmedAt={confirmedAt}
              deliveredAt={deliveredAt}
              cancelledAt={cancelledAt}
            />
          ))}
        </ul>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="border border-solid rounded-md border-gray-300">
          <div className="border-b border-solid border-gray-300 py-2 px-4">
            <h2 className="capitalize text-[15px]">Payment Information</h2>
          </div>
          <div className="px-4 py-5 space-y-4">
            <div className="text-[15px] space-y-[2px]">
              <h3 className="">Payment method</h3>
              <p className="text-gray-500 text-sm">
                {paymentMethod === "card"
                  ? "Flutterwave"
                  : paymentMethod.split("_").join(" ")}
              </p>
            </div>
            <div className="text-[15px] space-y-[5px]">
              <h3 className="">Payment details</h3>
              <p className="text-gray-500 text-sm">Currency: {currency}</p>
              <p className="text-gray-500 text-sm">
                Items total: {getCurrencySymbol(currency)}
                {formatCurrency(
                  Number(totalAmount) - Number(shippingFee),
                  currency === "NGN" ? 0 : 2
                )}
              </p>
              <p className="text-gray-500 text-sm">
                Delivery Fees: {getCurrencySymbol(currency)}
                {formatCurrency(
                  Number(shippingFee),
                  currency === "NGN" ? 0 : 2
                )}
              </p>
              <p className="text-gray-700 text-sm">
                Total: {getCurrencySymbol(currency)}
                {formatCurrency(
                  Number(totalAmount),
                  currency === "NGN" ? 0 : 2
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="border border-solid rounded-md border-gray-300">
          <div className="border-b border-solid border-gray-300 py-2 px-4">
            <h2 className="capitalize text-[15px]">Delivery Information</h2>
          </div>
          <div className="px-4 py-5 space-y-4">
            <div className="text-sm space-y-[2px]">
              <h3 className="text-[15px]">Delivery Method</h3>
              <p className="text-gray-500 text-sm">Door Delivery</p>
            </div>
            <div className="text-sm space-y-[2px]">
              <h3 className="text-[15px] mb-1">Shipping Address</h3>
              <p className="text-gray-500 text-sm">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-gray-500 text-sm">{shippingAddress.address}</p>
              <p className="text-gray-500 text-sm">
                {shippingAddress.state} - {shippingAddress.postalCode}
              </p>
              <p className="text-gray-500 text-sm">{shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
