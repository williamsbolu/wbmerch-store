"use client";

import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { userSchema } from "@/schemas";
import Button from "@/components/ui/Button";
import { updateUserInformation } from "@/actions/user";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function Page() {
  const { update } = useSession();
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof userSchema>
  >({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || undefined, // or fields must be undefined so they're are not updated if there is no value
      name: user?.name || undefined,
      phone: user?.phone || undefined,
    },
  });

  const { errors } = formState;

  function onSubmit(values: z.infer<typeof userSchema>) {
    startTransition(() => {
      updateUserInformation(values)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            update();
          }
          if (data.error) toast.error(data.error);
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  }

  return (
    <div className="py-6 max-w-[600px] mx-auto grid gap-5">
      <h1 className="text-lg tracking-wider text-center md:text-start">
        Personal Information
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-5">
        <div className="space-y-1">
          <label htmlFor="" className=" text-sm tracking-wide">
            Full Name
          </label>
          <input
            type="text"
            className={`border border-solid ${
              errors?.name?.message
                ? "border-[#EF4444] focus:border-[#EF4444]"
                : "border-primary/40 focus:border-primary"
            } py-[10px] px-3 text-sm rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm`}
            {...register("name")}
            disabled={isPending}
            placeholder="Enter Name"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="" className=" text-sm tracking-wide">
            Email
          </label>
          <input
            type="text"
            className="border border-solid border-primary/40 bg-[#EFEFEF4D] text-gray-600 focus:border-primary py-[10px] px-3 text-sm rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm disabled:cursor-not-allowed"
            {...register("email")}
            disabled
          />
          {errors?.phone?.message && (
            <p className="text-[13px] text-[#EF4444]">
              {errors?.phone?.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="" className=" text-sm tracking-wide">
            Phone Number
          </label>
          <input
            type="text"
            className={`border border-solid ${
              errors?.phone?.message
                ? "border-[#EF4444] focus:border-[#EF4444]"
                : "border-primary/40 focus:border-primary"
            } py-[10px] px-3 text-sm rounded-[4px] w-full focus:outline-none shadow-sm placeholder:text-sm`}
            {...register("phone")}
            disabled={isPending}
            placeholder="Enter Tel No."
          />
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
