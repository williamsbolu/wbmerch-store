import { Suspense } from "react";

import CheckoutLayout from "@/components/checkout/CheckoutLayout";
import CheckoutSkeleton from "@/components/checkout/CheckoutSkeleton";
import CheckoutHeader from "@/components/ui/CheckoutHeader";
import { auth } from "@/auth";

export const metadata = {
  title: "Checkout",
};

export default async function Page() {
  const session = await auth();

  return (
    <>
      <CheckoutHeader session={session!} />

      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutLayout />
      </Suspense>
    </>
  );
}
