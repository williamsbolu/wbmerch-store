import { auth } from "@/auth";
import VerifyPayment from "@/components/ui/VerifyPayment";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await auth();
  const { status, tx_ref, transaction_id } = searchParams;

  return (
    <VerifyPayment
      session={session}
      status={status}
      transactionId={transaction_id}
      transactionRef={tx_ref}
    />
  );
}
