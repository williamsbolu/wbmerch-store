"use client";

import * as z from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import Button from "./Button";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";
import { newPassword } from "@/actions/auth";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState, reset } = useForm<
    z.infer<typeof NewPasswordSchema>
  >({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const { errors } = formState;

  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            reset();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  }

  return (
    <section className="my-12 px-5">
      <h1 className="text-2xl text-center tracking-wide py-5">
        Enter a new password
      </h1>

      <div className="mx-auto grid gap-4 max-w-[400px]">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label htmlFor="" className=" text-sm tracking-wide">
              Password
            </label>
            <input
              type="password"
              className={`border border-solid ${
                errors?.password?.message
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-primary/40 focus:border-primary"
              } py-[10px] px-3 text-base rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm md:text-sm`}
              {...register("password")}
              disabled={isPending}
              placeholder="Enter Password"
            />
            {errors?.password?.message && (
              <p className="text-sm text-[#EF4444]">
                {errors?.password?.message}
              </p>
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
            Reset password
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
