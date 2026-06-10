"use client";

import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { PiArrowRightThin } from "react-icons/pi";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { subscribe } from "@/actions/settings";
import ButtonSpinner from "./ButtonSpinner";

export default function SubscriptionForm() {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState, reset } = useForm<
    z.infer<typeof ResetSchema>
  >({
    resolver: zodResolver(ResetSchema),
  });

  const { errors } = formState;

  function handleFormSubmit(values: z.infer<typeof ResetSchema>) {
    console.log(values);
    startTransition(() => {
      subscribe(values).then((result) => {
        if (result.error) {
          toast.error("An error occurred! Please try again.");
          return;
        }

        toast.success("Subscribed successfully!");
        reset();
      });
    });
  }

  return (
    <form className="flex-1" onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-lg text-primary mb-3 tracking-wide">
        Subscribe to our emails
      </h1>

      <div className="relative max-w-[360px] flex items-center">
        <input
          type="email"
          placeholder="Enter"
          {...register("email")}
          className="border border-primary text-base rounded-[5px] px-5 h-11 w-full transition-all placeholder:text-[#121212BF] hover:ring-1 hover:ring-primary focus:outline-none md:text-sm"
          required
        />
        <button className="absolute right-2 py-1 px-[2px]">
          {isPending ? (
            <ButtonSpinner variation="transparent" type="small" />
          ) : (
            <PiArrowRightThin className="w-6 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}
