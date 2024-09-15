import Link from "next/link";
import { BsExclamationTriangle } from "react-icons/bs";

export default function Page() {
  return (
    <section className="pt-20 pb-16 px-4">
      <div className="max-w-[400px] mx-auto rounded-2xl border border-primary/20 shadow-md flex flex-col items-center gap-4 py-5">
        <h1 className="text-[26px] text-center tracking-wide mb-[2px]">
          Login
        </h1>
        <p className="">Oops! Something went wrong!</p>
        <BsExclamationTriangle className="w-7 h-7 text-[#EF4444]" />
        <Link href="/login" className="text-sm underline underline-offset-2">
          Back to login
        </Link>
      </div>
    </section>
  );
}
