"use client";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/admin/ui/Button";
import { createApplicationUsers } from "@/actions/user";
import toast from "react-hot-toast";

export default function CreateUsersForm() {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState } = useForm<
    z.infer<typeof RegisterSchema>
  >({
    resolver: zodResolver(RegisterSchema),
  });
  const { errors } = formState;

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    startTransition(() => {
      createApplicationUsers(values)
        .then((data) => {
          if (data?.success) {
            toast.success(data.success, {
              position: "top-center",
            });
            reset();
          }

          if (data?.error) {
            toast.error(data.error, {
              position: "top-center",
            });
          }
        })
        .catch(() => toast.error("Something went wrong"));
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
        <label htmlFor="name" className="font-medium">
          Full name
        </label>
        <input
          type="text"
          id="name"
          className={inputStyles}
          {...register("name")}
          disabled={isPending}
        />
        {errors.name?.message && (
          <span className="text-sm text-red-700">{errors.name.message}</span>
        )}
      </div>
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center py-3 border-b border-solid border-gray-100">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          className={inputStyles}
          {...register("email")}
          disabled={isPending}
        />
        {errors.email?.message && (
          <span className="text-sm text-red-700">{errors.email.message}</span>
        )}
      </div>
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center py-3 border-b border-solid border-gray-100">
        <label htmlFor="password" className="font-medium">
          Password (min 6 characters)
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
