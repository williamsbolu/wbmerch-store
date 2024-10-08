import { auth } from "@/auth";
import CheckoutAuth from "@/components/checkout/CheckoutAuth";
import CheckoutNoAuth from "@/components/checkout/CheckoutNoAuth";

export default async function CheckoutLayout() {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <CheckoutAuth session={session} />
      ) : (
        <CheckoutNoAuth session={session!} />
      )}
    </>
  );
}
