import { Session } from "next-auth";
import { getOrCreateCart } from "@/actions/cart";
import { getUserAddress } from "@/data/address";
import CheckoutOverviewWrapper from "@/components/checkout/CheckoutOverviewWrapper";
import CartEmpty from "@/components/cart/CartEmpty";

export default async function CheckoutAuth({ session }: { session: Session }) {
  const [userCartData, userAddress] = await Promise.all([
    getOrCreateCart({ userId: session.user.id }),
    getUserAddress(session.user.id!),
  ]);

  if (userCartData.cartItems.length === 0) {
    return <CartEmpty page="checkout" />;
  }

  return (
    <CheckoutOverviewWrapper
      addresses={userAddress}
      cartItems={userCartData.cartItems}
      session={session}
    />
  );
}
