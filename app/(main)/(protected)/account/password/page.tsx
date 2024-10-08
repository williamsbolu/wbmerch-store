"use client";

import * as z from "zod";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schemas";
import Button from "@/components/ui/Button";
import { changePassword } from "@/actions/user";

export default function Page() {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState } = useForm<
    z.infer<typeof changePasswordSchema>
  >({
    resolver: zodResolver(changePasswordSchema),
  });

  const { errors } = formState;

  function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    startTransition(() => {
      changePassword(values)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            reset();
          }
          if (data.error) toast.error(data.error);
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  }

  return (
    <div className="py-6 max-w-[600px] mx-auto grid gap-5">
      <h1 className="text-lg tracking-wider text-center md:text-start">
        Change Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-5">
        <div className="space-y-1">
          <label htmlFor="" className="text-sm tracking-wide">
            Password
          </label>
          <input
            type="password"
            className={`border border-solid ${
              errors?.password?.message
                ? "border-[#EF4444] focus:border-[#EF4444]"
                : "border-primary/40 focus:border-primary"
            } py-[10px] px-3 text-sm rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm`}
            {...register("password")}
            disabled={isPending}
            placeholder="Current Password"
          />
          {errors?.password?.message && (
            <p className="text-[13px] text-[#EF4444]">
              {errors?.password?.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="" className="text-sm tracking-wide">
            New Password
          </label>
          <input
            type="password"
            className={`border border-solid ${
              errors?.newPassword?.message
                ? "border-[#EF4444] focus:border-[#EF4444]"
                : "border-primary/40 focus:border-primary"
            } py-[10px] px-3 text-sm rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm`}
            {...register("newPassword")}
            disabled={isPending}
            placeholder="New Password"
          />
          {errors?.newPassword?.message && (
            <p className="text-[13px] text-[#EF4444]">
              {errors?.newPassword?.message}
            </p>
          )}
        </div>

        <Button
          type="button"
          variation="primary"
          classes={["mt-1 h-[45px] flex justify-center items-center"]}
          ring={false}
          disabled={isPending}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
