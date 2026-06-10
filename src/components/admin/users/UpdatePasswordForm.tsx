"use client";

import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schemas";
import Button from "@/components/admin/ui/Button";
import { changePassword } from "@/actions/user";
import toast from "react-hot-toast";

export default function UpdatePasswordForm() {
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
            toast.success(data.success, {
              position: "top-center",
            });
            reset();
          }
          if (data.error)
            toast.error(data.error, {
              position: "top-center",
            });
        })
        .catch(() =>
          toast.error("Something went wrong!", {
            position: "top-center",
          })
        );
    });
  }

  const inputStyles =
    "border border-solid border-gray-300 bg-white rounded-[5px] shadow-sm py-2 px-3 focus:outline-2 outline-indigo-600 disabled:bg-gray-200";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-6 px-10 bg-white border border-gray-200 rounded-lg text-sm"
    >
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center pb-3 border-b border-solid border-gray-100">
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          className={inputStyles}
          {...register("password")}
          disabled={isPending}
        />
        {errors.password?.message && (
          <span className="text-sm text-red-700">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center py-3 border-b border-solid border-gray-100">
        <label htmlFor="newPassword" className="font-medium">
          New password
        </label>
        <input
          type="password"
          id="newPassword"
          className={inputStyles}
          {...register("newPassword")}
          disabled={isPending}
        />
        {errors.newPassword?.message && (
          <span className="text-sm text-red-700">
            {errors.newPassword.message}
          </span>
        )}
      </div>

      <div className="flex gap-3 pt-3 justify-end">
        <button
          type="reset"
          className="rounded-[5px] shadow-sm text-sm py-3 px-4 font-medium text-gray-600 bg-white border border-solid border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>
        <Button disabled={isPending}>Create new user</Button>
      </div>
    </form>
  );
}
