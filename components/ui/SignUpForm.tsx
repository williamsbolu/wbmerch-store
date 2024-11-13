"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import { RegisterSchema } from "@/schemas";
import { signUp } from "@/actions/auth";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";
import Socials from "@/components/ui/Socials";

export default function SignUpForm() {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState } = useForm<
    z.infer<typeof RegisterSchema>
  >({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors } = formState;

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      signUp(values)
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
    <section className="mt-12 mb-16 px-5">
      <h1 className="text-3xl text-center tracking-wide py-4">
        Create Account
      </h1>

      <div className="mx-auto grid gap-4 max-w-[400px]">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label htmlFor="" className=" text-[15px] tracking-wide">
              Name
            </label>
            <input
              type="text"
              className={`border border-solid ${
                errors?.name?.message
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-primary/40 focus:border-primary"
              } py-[10px] px-3 text-base rounded-[4px] w-full focus:outline-none shadow-sm sm:text-sm`}
              {...register("name")}
              placeholder="Enter Name"
              disabled={isPending}
            />
            {errors?.email?.message && (
              <p className="text-sm text-[#EF4444]">{errors?.name?.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="" className=" text-[15px] tracking-wide">
              Email
            </label>
            <input
              type="email"
              className={`border border-solid ${
                errors?.email?.message
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-primary/40 focus:border-primary"
              } py-[10px] px-3 text-base rounded-[4px] w-full focus:outline-none shadow-sm sm:text-sm`}
              {...register("email")}
              placeholder="Enter Email"
              disabled={isPending}
            />
            {errors?.email?.message && (
              <p className="text-sm text-[#EF4444]">{errors?.email?.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="" className=" text-[15px] tracking-wide">
              Password
            </label>

            <input
              type="password"
              className={`border border-solid ${
                errors?.password?.message
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-primary/40 focus:border-primary"
              } py-[10px] px-3 text-base rounded-[4px] w-full focus:outline-none shadow-sm sm:text-sm`}
              {...register("password")}
              placeholder="Enter Password"
              disabled={isPending}
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
            ring={false}
            disabled={isPending}
          >
            Sign up
          </Button>
        </form>

        <div className="grid grid-cols-[1fr_min-content_1fr] items-center py-1">
          <div className="h-[1px] bg-[#12121230] inline-block"></div>
          <p className="px-3 text-[#12121230]">or</p>
          <div className="h-[1px] bg-[#12121230] inline-block"></div>
        </div>

        <Socials />

        <Link
          href="/login"
          className="text-[#121212BF] text-sm text-center mt-5 underline"
        >
          Have an account? Login
        </Link>
      </div>
    </section>
  );
}
