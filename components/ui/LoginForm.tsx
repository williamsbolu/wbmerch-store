"use client";

import * as z from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import Button from "./Button";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";
import { login } from "@/actions/auth";
import Socials from "@/components/ui/Socials";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState } = useForm<
    z.infer<typeof LoginSchema>
  >({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors } = formState;

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            update();
            reset();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  }

  return (
    <section className="mt-12 mb-16 px-5">
      <h1 className="text-3xl text-center tracking-wide py-4">Login</h1>

      <div className="mx-auto grid gap-4 max-w-[400px]">
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
              } py-[10px] px-3 text-base rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm sm:text-sm`}
              {...register("email")}
              disabled={isPending}
            />
            {errors?.email?.message && (
              <p className="text-sm text-[#EF4444]">{errors?.email?.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="" className="text-sm tracking-wide">
                Password
              </label>
              <Link
                href="/auth/reset"
                className="underline text-[13px] text-[#121212BF]"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              className={`border border-solid ${
                errors?.password?.message
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-primary/40 focus:border-primary"
              } py-[10px] px-3 text-base rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm sm:text-sm`}
              {...register("password")}
              disabled={isPending}
            />
            {errors?.password?.message && (
              <p className="text-sm text-[#EF4444]">
                {errors?.password?.message}
              </p>
            )}
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button
            type="button"
            variation="primary"
            classes={["mt-1 h-[45px] flex justify-center items-center"]}
            ring={false}
            disabled={isPending}
          >
            Sign In
          </Button>
        </form>
        <div className="grid grid-cols-[1fr_min-content_1fr] items-center py-1">
          <div className="h-[1px] bg-[#12121252] inline-block"></div>
          <p className="px-3 text-[#12121252]">or</p>
          <div className="h-[1px] bg-[#12121252] inline-block"></div>
        </div>

        <Socials />

        <Link
          href="/signup"
          className="text-[#121212BF] text-sm text-center mt-5 underline"
        >
          Don&apos;t have an account? Register
        </Link>
      </div>
    </section>
  );
}
