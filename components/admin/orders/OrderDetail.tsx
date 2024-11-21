"use client";

import { useTransition } from "react";
import { IoMailOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import OrderTag from "@/components/admin/ui/OrderTag";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { OrderDetailType } from "@/utils/types";
import { TagEnum } from "@/components/admin/orders/OrderRow";
import OrderAddress from "@/components/admin/orders/OrderAddress";
import OrderItem from "./OrderItem";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import Button from "../ui/Button";
import OrderStatus from "./OrderStatus";
import Modal from "@/components/ui/ModalContainer";
import ConfirmOrder from "@/components/admin/ui/ConfirmOrder";
import { cancelOrder, confirmDelivery, confirmOrder } from "@/actions/order";
import toast from "react-hot-toast";

export default function OrderDetail({
  order: {
    id,
    referenceId,
    orderId,
    contactEmail,
    items,
    currency,
    status,
    isPaid,
    shippingMethod,
    paymentMethod,
    quantity,
    shippingFee,
    totalAmount,
    rateToUsd,
    shippingAddress,
    billingAddress,
    createdAt,
    confirmedAt,
    deliveredAt,
    cancelledAt,
    user,
  },
}: {
  order: OrderDetailType;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const paymentType = {
    pending: "yellow",
    confirmed: "sky",
    delivered: "green",
    cancelled: "red",
  };

  const paymentText = isPaid ? "paid" : "unpaid";

  const paid = {
    paid: "sky",
    unpaid: "red",
  };

  const confirmUserOrder = () => {
    startTransition(() => {
      confirmOrder(id, paymentMethod)
        .then(() => {
          toast.success("Order confirmed successfully", {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error("Failed to confirm user order", {
            position: "top-center",
          });
        });
    });
  };

  const confirmUserDelivery = () => {
    startTransition(() => {
      confirmDelivery(id)
        .then(() => {
          toast.success("Order delivery confirmed", {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error("Failed to confirm user delivery", {
            position: "top-center",
          });
        });
    });
  };

  const cancelUserOrder = () => {
    startTransition(() => {
      cancelOrder(id)
        .then(() => {
          toast.success("Order cancelled", {
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error("Failed to cancel order", {
            position: "top-center",
          });
        });
    });
  };

  return (
    <>
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold">{orderId}</h1>

          <div className="flex gap-2 ">
            <OrderTag type={paid[paymentText] as TagEnum}>
              {paymentText}
            </OrderTag>
            <OrderTag type={paymentType[status] as TagEnum}>{status}</OrderTag>
          </div>
        </div>

        <button
          className="text-indigo-600 font-medium text-center border-none bg-none rounded-md transition-all duration-300 hover:text-indigo-700 active:text-indigo-700"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
      </section>

      <section className="flex gap-8">
        <div className="basis-[68%] self-start grid gap-8">
          <div className="bg-white border border-solid border-gray-200 rounded-[7px]">
            <div className="px-5 py-4 border-b border-solid border-gray-200">
              <h2 className="font-medium text-base flex gap-2">
                Order details{" "}
                <span className="text-xs bg-gray-200 font-semibold rounded-full h-6 w-6 flex justify-center items-center">
                  {quantity}
                </span>
              </h2>
            </div>

            <ul className="px-5">
              {items.map((item) => (
                <OrderItem
                  key={item.id}
                  item={item}
                  currency={currency}
                  currencyRate={rateToUsd}
                />
              ))}
            </ul>

            <div className="grid grid-cols-[1fr_1.2fr] px-5 py-7">
              <div className="col-start-2 space-y-3 text-sm">
                <div className="grid grid-cols-2">
                  <span className="justify-self-end">Subtotal:</span>
                  <span className="justify-self-end">
                    {getCurrencySymbol(currency)}
                    {formatCurrency(
                      Number(totalAmount) - Number(shippingFee),
                      currency === "NGN" ? 0 : 2
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="justify-self-end">Shipping fee:</span>
                  <span className="justify-self-end">
                    {getCurrencySymbol(currency)}
                    {formatCurrency(
                      Number(shippingFee),
                      currency === "NGN" ? 0 : 2
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="justify-self-end">Tax:</span>
                  <span className="justify-self-end">-</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="justify-self-end font-medium">
                    Total {`(${currency})`}:
                  </span>
                  <span className="justify-self-end font-medium">
                    {getCurrencySymbol(currency)}
                    {formatCurrency(
                      Number(totalAmount),
                      currency === "NGN" ? 0 : 2
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-solid border-gray-200 rounded-[7px]">
            <div className="px-5 py-4 flex justify-between items-center border-b border-solid border-gray-200">
              <h2 className="font-medium text-base">Shipping activity</h2>

              <Modal>
                <div className="flex gap-2">
                  {status === "pending" &&
                    !cancelledAt &&
                    !confirmedAt &&
                    !deliveredAt && (
                      <Modal.Open opens="confirm-order">
                        <Button size="small">Confirm Order</Button>
                      </Modal.Open>
                    )}
                  {status === "confirmed" &&
                    !cancelledAt &&
                    confirmedAt &&
                    !deliveredAt && (
                      <Modal.Open opens="confirm-delivery">
                        <Button size="small" variation="success">
                          Confirm Delivery
                        </Button>
                      </Modal.Open>
                    )}
                  {status !== "cancelled" && !cancelledAt && !deliveredAt && (
                    <Modal.Open opens="cancel-order">
                      <Button size="small" variation="danger">
                        Cancel Order
                      </Button>
                    </Modal.Open>
                  )}
                </div>

                <Modal.Window name="confirm-order">
                  <ConfirmOrder
                    type="Confirm"
                    heading="Confirm Order"
                    confirmationText={`Are you sure you want to confirm this order with id #${orderId}. Please note that this action cannot be undone.`}
                    onConfirm={confirmUserOrder}
                    disabled={isPending}
                  />
                </Modal.Window>
                <Modal.Window name="confirm-delivery">
                  <ConfirmOrder
                    type="Confirm"
                    heading="Confirm Order Delivery"
                    confirmationText={`Are you sure you want to confirm the delivery of this order. Please note that this action cannot be undone.`}
                    onConfirm={confirmUserDelivery}
                    disabled={isPending}
                    variation="success"
                  />
                </Modal.Window>
                <Modal.Window name="cancel-order">
                  <ConfirmOrder
                    type="Cancel"
                    heading="Cancel Order"
                    confirmationText={`Are you sure you want to cancel this order?. Please note that this action cannot be undone.`}
                    onConfirm={cancelUserOrder}
                    disabled={isPending}
                    variation="danger"
                  />
                </Modal.Window>
              </Modal>
            </div>

            <OrderStatus
              status={status}
              createdAt={createdAt}
              confirmedAt={confirmedAt}
              deliveredAt={deliveredAt}
              cancelledAt={cancelledAt}
            />
          </div>
        </div>

        <div className="basis-[32%] flex flex-col gap-6">
          <div className="bg-white border border-solid border-gray-200 rounded-[7px]">
            <div className="px-5 py-4 border-b border-solid border-gray-200">
              <h2 className="font-medium text-base">Payment details</h2>
            </div>
            <div className="py-4 px-5 space-y-2 text-sm">
              <p className="text-gray-500">
                Reference ID:
                <span className="text-gray-700 ml-[10px]">#{referenceId}</span>
              </p>
              <p className="text-gray-500">
                Currency:
                <span className="text-gray-700 ml-[10px] tracking-wide capitalize">
                  {currency}
                </span>
              </p>
              <p className="text-gray-500">
                Shipping Method:
                <span className="text-gray-700 ml-[10px] tracking-wide capitalize">
                  {shippingMethod}
                </span>
              </p>
              <p className="text-gray-500">
                Payment Method:
                <span className="text-gray-700 ml-[10px] tracking-wide capitalize">
                  {paymentMethod === "card"
                    ? "flutterwave"
                    : paymentMethod.split("_").join("-")}
                </span>
              </p>
              <p className="text-gray-500">
                {isPaid ? "Amount Paid" : "Amount to be Paid"}:
                <span className="text-gray-700 ml-[10px] tracking-wide capitalize">
                  {getCurrencySymbol(currency)}
                  {formatCurrency(
                    Number(totalAmount),
                    currency === "NGN" ? 0 : 2
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white border border-solid border-gray-200 rounded-[7px]">
            <div className="px-5 py-4 border-b border-solid border-gray-200">
              <h2 className="font-medium text-base">Customer details</h2>
            </div>
            <div className="py-4 px-5 space-y-3 text-sm">
              <div className="flex gap-3 items-center text-sm">
                <img
                  src={user?.image ? user.image : "/default-user.jpg"}
                  className="rounded-full h-7 w-7"
                  alt={user?.name ? user.name : contactEmail?.split("@")[0]}
                  referrerPolicy="no-referrer"
                />
                <span className="tracking-wide">
                  {user?.name ? user.name : contactEmail}
                </span>
              </div>
              <div className="flex gap-3 items-center text-sm px-1">
                <IoMailOutline className="text-gray-500 w-4 h-4" />
                <span className="text-[13px]">
                  {user?.email ? user.email : contactEmail}
                </span>
              </div>
              {user?.phone && (
                <div className="flex gap-3 items-center text-sm px-1">
                  <IoPhonePortraitOutline className="text-gray-500 w-4 h-4" />
                  <span className="text-[13px]">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          <OrderAddress heading="Shipping address" address={shippingAddress} />
          <OrderAddress heading="Billing address" address={billingAddress} />
        </div>
      </section>
    </>
  );
}
