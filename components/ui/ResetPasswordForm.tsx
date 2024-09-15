"use client";

import * as z from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import Button from "./Button";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";
import { reset } from "@/actions/auth";

export default function ResetPasswordForm() {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof ResetSchema>
  >({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const { errors } = formState;

  function onSubmit(values: z.infer<typeof ResetSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  }

  return (
    <section className="my-12 px-5">
      <h1 className="text-2xl text-center tracking-wide py-4">
        Forgot your password
      </h1>

      <div className="mx-auto grid gap-4 md:max-w-[400px]">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label htmlFor="" className=" text-sm tracking-wide">
              Email
            </label>
            <input
              type="email"
              className={`border border-solid ${
                errors?.email?.message
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-primary/40 focus:border-primary"
              } py-[10px] px-3 text-sm rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm`}
              {...register("email")}
              disabled={isPending}
              placeholder="Enter Email"
            />
            {errors?.email?.message && (
              <p className="text-sm text-[#EF4444]">{errors?.email?.message}</p>
            )}
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="button"
            variation="primary"
            classes={["mt-1 h-[45px] flex justify-center items-center"]}
            disabled={isPending}
          >
            Send reset email
          </Button>
        </form>

        <Link
          href="/login"
          className="text-[#121212BF] text-sm text-center mt-5 underline"
        >
          Back to login
        </Link>
      </div>
    </section>
  );
}
