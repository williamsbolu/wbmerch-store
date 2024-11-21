"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Sono } from "next/font/google";
import { FcCancel } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { format, isToday } from "date-fns";
import toast from "react-hot-toast";
import { HiEllipsisVertical, HiEye } from "react-icons/hi2";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiSolidTruck } from "react-icons/bi";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import ModalContainer from "@/components/ui/ModalContainer";
import OrderTag from "@/components/admin/ui/OrderTag";
import { OrderListType } from "@/utils/types";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import { cancelOrder, confirmDelivery, confirmOrder } from "@/actions/order";
import ConfirmOrder from "@/components/admin/ui/ConfirmOrder";

const sono = Sono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

export type TagEnum = "yellow" | "sky" | "green" | "red";

export default function OrderRow({
  order: {
    id,
    contactEmail: customerEmail,
    orderId,
    quantity,
    status,
    paymentMethod,
    currency,
    totalAmount,
    createdAt,
    deliveredAt,
    cancelledAt,
    user,
  },
}: {
  order: OrderListType;
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleOptionsToggle = () => {
    setOptionsOpen((state) => !state);
  };

  const ref = useOutsideClick(handleOptionsToggle, false);

  const type = {
    pending: "yellow",
    confirmed: "sky",
    delivered: "green",
    cancelled: "red",
  };

  const confirmUserOrder = () => {
    startTransition(() => {
      confirmOrder(id, paymentMethod)
        .then(() => {
          toast.success(`${orderId} confirmed successfully`, {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error(`Failed to confirm order with id ${orderId}`, {
            position: "top-center",
          });
        });
    });
  };

  const confirmUserDelivery = () => {
    startTransition(() => {
      confirmDelivery(id)
        .then(() => {
          toast.success(`${orderId} delivery confirmed`, {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error(`Failed to confirm delivery for ${orderId}`, {
            position: "top-center",
          });
        });
    });
  };

  const cancelUserOrder = () => {
    startTransition(() => {
      cancelOrder(id)
        .then(() => {
          toast.success(`${orderId} cancelled`, {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error(`Failed to cancel ${orderId}`, {
            position: "top-center",
          });
        });
    });
  };

  return (
    <div
      className="grid grid-cols-[1fr_1.2fr_0.5fr_0.7fr_0.7fr_0.2fr] gap-5 items-center pr-3 pl-5 py-4 border-b border-solid border-gray-100 last:border-b-0"
      role="row"
    >
      <div className="flex flex-col gap-2">
        <span className="font-medium">{orderId}</span>
        <span className="text-xs text-gray-500">
          {isToday(new Date(createdAt))
            ? "Ordered Today"
            : format(new Date(createdAt), "MMM dd yyyy")}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {user ? (
          <span className="font-medium">{user.name}</span>
        ) : (
          <span className="font-medium">{customerEmail?.split("@")[0]}</span>
        )}
        <span className="text-xs text-gray-500">{customerEmail}</span>
      </div>

      <span className="text-orange-500">
        {quantity} {quantity > 1 ? "items" : "item"}
      </span>

      <OrderTag type={type[status] as TagEnum}>{status}</OrderTag>

      <div className={`${sono.className} font-medium`}>
        {getCurrencySymbol(currency)}
        {formatCurrency(Number(totalAmount), currency === "NGN" ? 0 : 2)}{" "}
        {currency}
      </div>

      <ModalContainer>
        <div className="relative flex items-center justify-end">
          <button
            className="bg-none border-none p-1 rounded-md transition-all duration-200 hover:bg-gray-100"
            onClick={handleOptionsToggle}
          >
            <HiEllipsisVertical className="w-6 h-6 text-gray-700" />
          </button>

          {optionsOpen && (
            <ul
              ref={ref}
              className="absolute w-fit z-10 right-[10%] top-[90%] bg-white shadow-md rounded-lg"
            >
              <li>
                <button
                  className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50"
                  onClick={() => router.push(`/admin/orders/${orderId}`)}
                >
                  <HiEye className="w-5 h-5 text-gray-400 transition-all duration-300" />
                  <span className="whitespace-nowrap">See details</span>
                </button>
              </li>
              {status === "pending" && !cancelledAt && (
                <li>
                  <ModalContainer.Open opens="confirm-order">
                    <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                      <RiVerifiedBadgeFill className="w-5 h-5 text-gray-400 transition-all duration-300" />
                      <span className="whitespace-nowrap">Confirm order</span>
                    </button>
                  </ModalContainer.Open>
                </li>
              )}
              {status === "confirmed" && !cancelledAt && (
                <li>
                  <ModalContainer.Open opens="confirm-delivery">
                    <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                      <BiSolidTruck className="w-5 h-5 text-gray-400 transition-all duration-300" />
                      <span className="whitespace-nowrap">
                        Confirm delivery
                      </span>
                    </button>
                  </ModalContainer.Open>
                </li>
              )}
              {status !== "cancelled" && !cancelledAt && !deliveredAt && (
                <li>
                  <ModalContainer.Open opens="cancel-order">
                    <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                      <FcCancel className="w-5 h-5 text-gray-400 transition-all duration-300" />
                      <span className="whitespace-nowrap">Cancel order</span>
                    </button>
                  </ModalContainer.Open>
                </li>
              )}
            </ul>
          )}
        </div>

        <ModalContainer.Window name="confirm-order">
          <ConfirmOrder
            type="Confirm"
            heading="Confirm Order"
            confirmationText={`Are you sure you want to confirm #${orderId}. Please note that this action cannot be undone.`}
            onConfirm={confirmUserOrder}
            disabled={isPending}
          />
        </ModalContainer.Window>
        <ModalContainer.Window name="confirm-delivery">
          <ConfirmOrder
            type="Confirm"
            heading="Confirm Order Delivery"
            confirmationText={`Are you sure you want to confirm the delivery of ${orderId}. Please note that this action cannot be undone.`}
            onConfirm={confirmUserDelivery}
            disabled={isPending}
            variation="success"
          />
        </ModalContainer.Window>
        <ModalContainer.Window name="cancel-order">
          <ConfirmOrder
            type="Cancel"
            heading="Cancel Order"
            confirmationText={`Are you sure you want to cancel ${orderId}?. Please note that this action cannot be undone.`}
            onConfirm={cancelUserOrder}
            disabled={isPending}
            variation="danger"
          />
        </ModalContainer.Window>
      </ModalContainer>
    </div>
  );
}
