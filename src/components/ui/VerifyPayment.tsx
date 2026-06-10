"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import PaymentSuccess from "@/components/ui/PaymentSuccess";
import PaymentFailed from "@/components/ui/PaymentFailed";
import { verifyTransaction } from "@/actions/order";
import toast from "react-hot-toast";
import ButtonSpinner from "@/components/ui/ButtonSpinner";

export default function VerifyPayment({
  transactionId,
  transactionRef,
  session,
}: {
  session: Session | null;
  status: string | undefined;
  transactionId: string | undefined;
  transactionRef: string | undefined;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    verifyTransaction(transactionRef!, transactionId!)
      .then((data) => {
        setIsLoading(false);
        if (data?.success) {
          setSuccess(data.success);
        }

        if (data?.error) {
          toast.error("Payment unsuccessful");
          setError(data.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        setError("Failed to verify user's payment");
      });
  }, [transactionId, transactionRef]);

  return (
    <>
      {isLoading && (
        <section className="h-screen flex flex-col items-center justify-center gap-[10px]">
          <ButtonSpinner variation="transparent" />
          <p className="text-sm tracking-wide">verifying transaction...</p>
        </section>
      )}
      {success && <PaymentSuccess session={session} />}
      {error && <PaymentFailed />}
    </>
  );
}
