"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DotLoader from "./DotLoader";
import { newVerification } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";

export default function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  });

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
