"use client";

import { useState } from "react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { Address } from "@prisma/client";
import CheckoutCartTotals from "@/components/checkout/CheckoutCartTotals";
import Checkout from "@/components/checkout/Checkout";
import { BillingAddressType, CartItem } from "@/utils/types";

export default function CheckoutOverviewWrapper({
  addresses,
  cartItems,
  session,
}: {
  addresses: Address[];
  cartItems: CartItem[];
  session: Session;
}) {
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const [contactEmail, setContactEmail] = useState<string>(
    session?.user.email || ""
  );
  const emailIsValid = contactEmail.length > 0 && contactEmail.includes("@");
  const [shippingFee, setShippingFee] = useState<number>(10);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "paystack" | "pay-on-delivery" | "bank-transfer"
  >("paystack");
  const shippingAddress = addresses.find((address) => address.isDefault);

  // Billing address states
  const [billingAddressType, setBillingAddressType] = useState<
    "different" | "same"
  >("same");
  const [billingAddress, setBillingAddress] =
    useState<BillingAddressType | null>(null);

  const selectedBillingAddress =
    billingAddressType === "same" ? shippingAddress : billingAddress;

  // HANDLERS FOR UPADATING THE CHECKOUT STATE
  const setContactEmailChange = (email: string) => {
    setContactEmail(email);
  };

  const handleShippingMethodChange = (method: "standard" | "express") => {
    setShippingMethod(method);
    setShippingFee(method === "standard" ? 10 : 20);
  };

  const handlePaymentMethodChange = (
    method: "paystack" | "pay-on-delivery" | "bank-transfer"
  ) => {
    setPaymentMethod(method);
  };

  const handleBillingAddress = (address: BillingAddressType) => {
    setBillingAddress(address);
  };

  const handleBillingAddressType = (type: "different" | "same") => {
    if (type === "same") {
      // So when the users switches back to the "same" billing address, The state is formatted to null so the shipping address can be selected as billing address
      setBillingAddress(null);
    }

    setBillingAddressType(type);
  };

  async function handleCheckout() {
    console.log({ billingAddressType });
    console.log({ shippingAddress });
    console.log({ billingAddress: selectedBillingAddress });

    if (!emailIsValid) {
      toast.error("Pls add a valid contact email");
      return;
    }
    if (!shippingAddress) {
      toast.error("Pls add a shipping address");
      return;
    }
    if (!selectedBillingAddress) {
      toast.error("Pls add  a billing address");
      return;
    }

    const data = {
      contactEmail,
      shippingMethod,
      paymentMethod,
      shippingAddress,
      billingAddress: selectedBillingAddress,
      cartItems,
    };

    console.log(data);
  }

  return (
    <section className="max-w-xl mx-auto min-h-screen grid lg:grid-cols-[1.5fr_1.2fr] lg:max-w-[1100px]">
      <div className="px-4 bg-stone-100/70 border-b border-solid border-gray-200 flex justify-between items-center py-4 mb-3 lg:hidden">
        <p className="text-sm tracking-wide">Cart Totals:</p>
        <span className="text-lg">${cartTotal}.00</span>
      </div>
      <div className="px-4 mb-8 lg:py-[38px] lg:pr-[38px] lg:border-r lg:border-solid lg:border-gray-300 lg:mb-0">
        <Checkout
          addresses={addresses}
          session={session}
          contactEmail={contactEmail}
          shippingMethod={shippingMethod}
          paymentMethod={paymentMethod}
          billingAddressType={billingAddressType}
          billingAddress={billingAddress}
          onSetContactEmail={setContactEmailChange}
          onHandleShippingMethod={handleShippingMethodChange}
          onHandlePaymentMethod={handlePaymentMethodChange}
          onHandleBillingAddressType={handleBillingAddressType}
          onHandleBillingAddress={handleBillingAddress}
          onCheckout={handleCheckout}
        />
      </div>
      <CheckoutCartTotals
        cartItems={cartItems}
        shipping={shippingFee}
        paymentMethod={paymentMethod}
        shippingMethod={shippingMethod}
        onCheckout={handleCheckout}
      />
    </section>
  );
}
