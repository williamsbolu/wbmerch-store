"use client";

import { Session } from "next-auth";
import { useSelector } from "react-redux";
import cookies from "js-cookie";
import { useEffect, useState, useTransition } from "react";
import { CartItem } from "@/utils/types";
import { getOrCreateCart } from "@/actions/cart";
import CheckoutSkeleton from "@/components/checkout/CheckoutSkeleton";
import CartEmpty from "@/components/cart/CartEmpty";
import CheckoutOverviewWrapper from "@/components/checkout/CheckoutOverviewWrapper";

export default function CheckoutNoAuth({ session }: { session: Session }) {
  const address = useSelector((state: any) => state.address.data);
  const [isPending, startTransition] = useTransition();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let sessionId = cookies.get("sessionId");

    startTransition(() => {
      getOrCreateCart({ sessionId })
        .then(({ cartItems }) => {
          setCartItems(cartItems);
        })
        .catch(() => setError("Failed to get cart item"));
    });
  }, []);

  return (
    <>
      {!isPending && !error && cartItems.length > 0 && (
        <CheckoutOverviewWrapper
          addresses={address}
          cartItems={cartItems}
          session={session}
        />
      )}
      {isPending && <CheckoutSkeleton />}
      {!isPending && !error && cartItems.length === 0 && (
        <CartEmpty page="checkout" />
      )}
      {/* Add the error logic also for if there is an error also if(error) <Component /> */}
      {error && <p>{error}</p>}
    </>
  );
}
