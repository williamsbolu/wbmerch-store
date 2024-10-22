"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { Address } from "@prisma/client";
import { MdKeyboardArrowDown } from "react-icons/md";
import AddressForm from "../ui/AddressForm";
// import DeliveryMethod from "@/components/checkout/DeliveryMethod";
import ShippingMethod from "@/components/checkout/ShippingMethod";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import Button from "@/components/ui/Button";
import CheckoutAddressList from "@/components/checkout/CheckoutAddressList";
import BillingAddress from "@/components/checkout/BillingAddress";
import { signOut } from "next-auth/react";
import { OrderAddressType } from "@/utils/types";

export default function Checkout({
  addresses,
  session,
  contactEmail,
  isCheckingOut,
  shippingMethod,
  paymentMethod,
  billingAddressType,
  billingAddress,
  onSetContactEmail,
  onHandleShippingMethod,
  onHandlePaymentMethod,
  onHandleBillingAddressType,
  onHandleBillingAddress,
  onCheckout,
}: {
  addresses: Address[];
  session: Session;
  contactEmail: string;
  isCheckingOut: boolean;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "pay_on_delivery" | "bank_transfer";
  billingAddressType: "same" | "different";
  billingAddress: OrderAddressType | null;
  onSetContactEmail: (email: string) => void;
  onHandleShippingMethod: (method: "standard" | "express") => void;
  onHandlePaymentMethod: (
    method: "card" | "pay_on_delivery" | "bank_transfer"
  ) => void;
  onHandleBillingAddressType: (type: "different" | "same") => void;
  onHandleBillingAddress: (data: OrderAddressType) => void;
  onCheckout: () => void;
}) {
  const [open, setOpen] = useState(false);

  const input =
    "w-full border border-gray-400 text-sm rounded-[5px] font-normal bg-white focus:outline-none focus:border-primary placeholder:text-[#0000008F] placeholder:text-[13px] placeholder:tracking-wide py-[10px] px-3";

  return (
    <div className="grid gap-6">
      {!session?.user ? (
        <div className="">
          <h2 className="text-xl mb-3">Contact</h2>
          <input
            type="email"
            id="email"
            className={`${input}`}
            value={contactEmail}
            onChange={(e) => onSetContactEmail(e.target.value)}
            placeholder="Enter email to get order info"
          />
        </div>
      ) : (
        <div className="border-b border-solid border-stone-300 pb-4">
          <div
            className="flex justify-between items-center mb-1"
            role="button"
            onClick={() => setOpen((prevState) => !prevState)}
          >
            <h2 className="text-sm">Account</h2>
            <button className="p-1 bg-[#0000000D] rounded-md">
              <MdKeyboardArrowDown
                className={`w-5 h-5 transition-all duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>
          <div className="rounded-lg cursor-pointer">
            <p className="text-sm">{session.user.email}</p>
          </div>
          {open && (
            <div className="mt-[10px]">
              <button
                className="text-sm text-[#000000CC] flex items-center gap-3 underline font-medium"
                onClick={() => signOut({ callbackUrl: "/checkout" })}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* <DeliveryMethod /> */}

      <div>
        {addresses.length === 0 && (
          <>
            <h2 className="text-lg mb-3">Shipping Address</h2>
            <AddressForm type="page" method="add" session={session} />
          </>
        )}
        {addresses.length > 0 && (
          <CheckoutAddressList session={session} addresses={addresses} />
        )}
      </div>

      <ShippingMethod
        selectedShippingMethod={shippingMethod}
        onHandleShippingMethod={onHandleShippingMethod}
      />
      <PaymentMethod
        selectedPaymentOption={paymentMethod}
        onHandlePaymentMethod={onHandlePaymentMethod}
      />
      <BillingAddress
        billingAddress={billingAddress}
        billingAddressType={billingAddressType}
        onHandleBillingAddressType={onHandleBillingAddressType}
        onHandleBillingAddress={onHandleBillingAddress}
      />

      <Button
        variation="primary"
        type="button"
        classes={["hidden font-medium lg:flex justify-center items-center"]}
        ring={false}
        onClick={onCheckout}
        disabled={isCheckingOut}
      >
        {paymentMethod === "card" ? "Pay now" : "Complete order"}
      </Button>
    </div>
  );
}
