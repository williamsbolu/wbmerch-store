"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DotLoader from "./DotLoader";
import { newVerification } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [result, setResult] = useState<{
    success?: string;
    error?: string;
  }>({});

  useEffect(() => {
    // Only the async verification call lives in the effect — its setState runs
    // after the await, so it isn't a synchronous setState-in-effect. The
    // "missing token" case is derived during render below (no effect needed).
    if (!token) return;

    newVerification(token)
      .then((data) => setResult({ success: data.success, error: data.error }))
      .catch(() => setResult({ error: "Something went wrong!" }));
  }, [token]);

  const error = token ? result.error : "Missing token!";
  const success = result.success;

  return (
    <section className="pt-20 pb-16 px-4">
      <div className="max-w-[400px] mx-auto rounded-2xl border border-primary/20 shadow-md flex flex-col items-center gap-4 py-5">
        <h1 className="text-[26px] text-center tracking-wide mb-[2px]">
          Login
        </h1>
        <p className="">Confirming your verification</p>
        <div className="py-2">
          {!success && !error && <DotLoader />}
          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
        <Link href="/login" className="text-sm underline underline-offset-2">
          Back to login
        </Link>
      </div>
    </section>
  );
}
