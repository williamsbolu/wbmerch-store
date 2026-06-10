import Link from "next/link";
import { Session } from "next-auth";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

export default function PaymentSuccess({
  session,
}: {
  session: Session | null;
}) {
  return (
    <section className="max-w-[1100px] mt-[90px] py-40 mx-auto flex flex-col justify-center items-center gap-5 px-4 md:py-32">
      <h1 className="text-2xl tracking-wide text-center md:text-3xl">
        Thank you for your order!
      </h1>
      {session?.user ? (
        <Link
          href="/account"
          className="underline flex items-center tracking-wide"
        >
          Manage your orders <HiOutlineArrowLongRight className="h-5 w-5" />
        </Link>
      ) : (
        <p className="tracking-wide text-center text-sm md:text-base">
          You would receive an email with your order details and status.
        </p>
      )}
    </section>
  );
}
