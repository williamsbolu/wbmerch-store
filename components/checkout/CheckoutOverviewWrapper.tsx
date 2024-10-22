"use client";

import { useState, useTransition } from "react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import cookies from "js-cookie";
import { Address } from "@prisma/client";
import CheckoutCartTotals from "@/components/checkout/CheckoutCartTotals";
import Checkout from "@/components/checkout/Checkout";
import { OrderAddressType, CartItem } from "@/utils/types";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import { useCurrency } from "@/context/CurrencyContext";
import { initiatePayment } from "@/actions/order";

export default function CheckoutOverviewWrapper({
  addresses,
  cartItems,
  session,
}: {
  addresses: Address[];
  cartItems: CartItem[];
  session: Session;
}) {
  const { currency, convertPrice, rates } = useCurrency();
  const [isPending, startTransition] = useTransition();

  const [contactEmail, setContactEmail] = useState<string>(
    session?.user.email || ""
  );
  const emailIsValid = contactEmail.length > 0 && contactEmail.includes("@");

  const [shippingFee, setShippingFee] = useState<number>(10);

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );

  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "pay_on_delivery" | "bank_transfer"
  >("card");

  const shippingAddress = addresses.find(
    (address) => address.isDefault
  ) as OrderAddressType;

  // Billing address states
  const [billingAddressType, setBillingAddressType] = useState<
    "different" | "same"
  >("same");

  const [billingAddress, setBillingAddress] = useState<OrderAddressType | null>(
    null
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
    method: "card" | "pay_on_delivery" | "bank_transfer"
  ) => {
    setPaymentMethod(method);
  };

  const handleBillingAddress = (address: OrderAddressType) => {
    setBillingAddress(address);
  };

  const handleBillingAddressType = (type: "different" | "same") => {
    if (type === "same") {
      // So when the users switches back to the "same" billing address, The state is formatted to null so the shipping address can be selected as billing address
      setBillingAddress(null);
    }

    setBillingAddressType(type);
  };

  const caculateTotal = () => {
    return cartTotal + shippingFee;
  };

  async function handleCheckout() {
    // console.log({ billingAddressType });
    // console.log({ shippingAddress });
    // console.log({ billingAddress: selectedBillingAddress });

    if (!emailIsValid) {
      toast.error("Pls add a valid contact email");
      return;
    }
    if (!shippingAddress) {
      toast.error("Pls add a shipping address");
      return;
    }
    if (!selectedBillingAddress) {
      toast.error("Pls add a billing address");
      return;
    }

    if (!rates[currency]) {
      toast.error("Failed to load exchange rates");
      return;
    }

    // Format the totals and the shipping fee for each currencies
    const shippingAmount = convertPrice(shippingFee).toFixed(
      currency === "NGN" ? 0 : 2
    );

    const totalAmount = convertPrice(caculateTotal()).toFixed(
      currency === "NGN" ? 0 : 2
    );

    const data = {
      ...(contactEmail && { contactEmail }),
      ...(session?.user?.id && { userId: session.user.id }),
      currency,
      shippingMethod,
      paymentMethod,
      shippingAddress,
      billingAddress: selectedBillingAddress,
      items: cartItems,
      quantity: totalQuantity,
      shippingFee: shippingAmount,
      totalAmount: totalAmount,
    };

    if (paymentMethod === "pay_on_delivery") {
      toast.error("This payment method is not available");
    }

    if (paymentMethod === "card") {
      const sessionId = cookies.get("sessionId");

      startTransition(() => {
        initiatePayment(data, sessionId)
          .then((resData) => {
            if (resData.status === "success") {
              window.location.href = resData.data.link;
            } else {
              toast.error("Failed to initiate payment");
            }
          })
          .catch((err) => {
            console.error(err);
            // console.error(err.code);
            // console.error(err.response.data);
            toast.error("Failed to initiate payment");
          });
      });
    }

    if (paymentMethod === "bank_transfer") {
      toast.error("This payment method is not available");
    }
  }

  return (
    <section className="max-w-xl mx-auto min-h-screen grid lg:grid-cols-[1.5fr_1.2fr] lg:max-w-[1100px]">
      <div className="px-4 bg-stone-100/70 border-b border-solid border-gray-200 flex justify-between items-center py-4 mb-3 lg:hidden">
        <p className="text-sm tracking-wide">Cart Totals:</p>
        <span className="text-lg">
          {getCurrencySymbol(currency)}
          {formatCurrency(cartTotal)}
        </span>
      </div>
      <div className="px-4 mb-8 lg:py-[38px] lg:pr-[38px] lg:border-r lg:border-solid lg:border-gray-300 lg:mb-0">
        <Checkout
          addresses={addresses}
          session={session}
          contactEmail={contactEmail}
          isCheckingOut={isPending}
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
        isCheckingOut={isPending}
        paymentMethod={paymentMethod}
        shippingMethod={shippingMethod}
        onCheckout={handleCheckout}
      />
    </section>
  );
}
