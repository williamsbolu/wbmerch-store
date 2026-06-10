"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import * as z from "zod";
import { useDispatch } from "react-redux";
import { useState, useTransition } from "react";
import { Address } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import Button from "@/components/ui/Button";
import { AddressFormSchema } from "@/schemas";
import { createAddress, editAddress } from "@/actions/address";
import {
  addAddress,
  updateUserAddress,
} from "@/components/address/addressSlice";
import { saveAddressToLocalStorage } from "@/utils/helpers";

export default function AddressForm({
  type,
  method,
  addressToEdit,
  session,
  onCloseModal,
}: {
  type: "modal" | "page";
  method: "add" | "edit";
  addressToEdit?: Address;
  session: Session | null;
  onCloseModal?: () => void;
}) {
  const dispatch = useDispatch();
  const [isDefaultValue, setIsDefaultValue] = useState<boolean>(
    type === "page" || addressToEdit?.isDefault ? true : false
  );
  const [country, setCountry] = useState<string>(
    method === "edit" ? addressToEdit?.country! : "United States"
  );
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState } = useForm<
    z.infer<typeof AddressFormSchema>
  >({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      firstName: addressToEdit?.firstName || "",
      lastName: addressToEdit?.lastName || "",
      address: addressToEdit?.address || "",
      optional: addressToEdit?.optional || "",
      city: addressToEdit?.city || "",
      state: addressToEdit?.state || "",
      postalCode: addressToEdit?.postalCode || "",
      phone: addressToEdit?.phone || "",
    },
  });

  const { errors } = formState;

  function onSubmit(values: z.infer<typeof AddressFormSchema>) {
    if (method === "add") {
      const data = {
        ...values,
        country,
        isDefault: isDefaultValue,
        userId: "", // not useful: User id was added because of typescript validation, would be edited in the server action for the expected value
      };

      startTransition(() => {
        createAddress(data)
          .then(() => {
            onCloseModal?.();
          })
          .catch(() => toast.error("Something went wrong."));
      });
    } else {
      const data = {
        ...values,
        country,
        isDefault: isDefaultValue,
        userId: "", // not useful: User id was added because of typescript validation, would be edited in the server action for the expected value
      };

      startTransition(() => {
        editAddress(data, addressToEdit?.id!)
          .then(() => {
            onCloseModal?.();
          })
          .catch(() => {
            toast.error("Something went wrong.");
          });
      });
    }
  }

  function onSubmitNoAuth(values: z.infer<typeof AddressFormSchema>) {
    if (method === "add") {
      const data = {
        ...values,
        id: uuidv4(),
        country,
        isDefault: true,
        optional: values.optional || null,
      };

      dispatch(addAddress(data));
      saveAddressToLocalStorage("checkout_address", data);
    } else {
      const data = {
        ...values,
        id: addressToEdit?.id!,
        country,
        isDefault: true,
        optional: values.optional || null,
      };

      dispatch(updateUserAddress(data));
      saveAddressToLocalStorage("checkout_address", data);
      onCloseModal?.();
    }
  }

  const handleFormSubmit = (values: z.infer<typeof AddressFormSchema>) => {
    if (session?.user) {
      onSubmit(values);
    } else {
      onSubmitNoAuth(values);
    }
  };

  const input =
    "w-full border text-base rounded-[5px] font-normal bg-white focus:outline-none placeholder:text-[#0000008F] placeholder:text-[13px] placeholder:tracking-wide py-[10px] px-3 md:text-sm";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`${inter.className} grid items-center ${
        type === "modal"
          ? "p-5 pt-4 gap-4 w-[95vw] h-[70vh] overflow-y-auto sm:w-[600px] sm:h-fit"
          : "gap-4 lg:gap-3"
      }`}
    >
      {type === "modal" && (
        <h1 className="mb-1 text-lg">
          {method === "add" ? "Add new Address" : "Edit your Address"}
        </h1>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
        <input
          type="text"
          className={`${input} ${
            errors?.firstName?.message
              ? "border-[#EF4444] focus:border-[#EF4444]"
              : "border-gray-400 focus:border-primary"
          }`}
          {...register("firstName")}
          placeholder="First name"
          disabled={isPending}
        />
        <input
          type="text"
          className={`${input} ${
            errors?.lastName?.message
              ? "border-[#EF4444] focus:border-[#EF4444]"
              : "border-gray-400 focus:border-primary"
          }`}
          {...register("lastName")}
          placeholder="Last name"
          disabled={isPending}
        />
      </div>
      <input
        type="text"
        className={`${input} ${
          errors?.address?.message
            ? "border-[#EF4444] focus:border-[#EF4444]"
            : "border-gray-400 focus:border-primary"
        }`}
        {...register("address")}
        placeholder="Detailed delivery address"
        disabled={isPending}
      />
      <input
        type="text"
        className={`${input} ${
          errors?.optional?.message
            ? "border-[#EF4444] focus:border-[#EF4444]"
            : "border-gray-400 focus:border-primary"
        }`}
        {...register("optional")}
        placeholder="Apartment, suite, etc. (optional)"
        disabled={isPending}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
        <select
          className="bg-white border border-gray-400 text-sm rounded-[5px] focus:outline-none py-[10px] h-10 px-3"
          onChange={(e) => setCountry(e.target.value)}
          defaultValue={country}
        >
          <option value="United States">United States</option>
          <option value="United Kindom">United Kindom</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Ghana">Ghana</option>
        </select>
        <input
          type="text"
          className={`${input} ${
            errors?.state?.message
              ? "border-[#EF4444] focus:border-[#EF4444]"
              : "border-gray-400 focus:border-primary"
          }`}
          {...register("state")}
          placeholder="State"
          disabled={isPending}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
        <input
          type="text"
          className={`${input} ${
            errors?.city?.message
              ? "border-[#EF4444] focus:border-[#EF4444]"
              : "border-gray-400 focus:border-primary"
          }`}
          {...register("city")}
          placeholder="City"
          disabled={isPending}
        />
        <input
          type="text"
          className={`${input} ${
            errors?.postalCode?.message
              ? "border-[#EF4444] focus:border-[#EF4444]"
              : "border-gray-400 focus:border-primary"
          }`}
          {...register("postalCode")}
          placeholder="Zip/postal code"
          disabled={isPending}
        />
      </div>
      <input
        type="text"
        className={`${input} ${
          errors?.phone?.message
            ? "border-[#EF4444] focus:border-[#EF4444]"
            : "border-gray-400 focus:border-primary"
        }`}
        {...register("phone")}
        placeholder="Telephone"
        disabled={isPending}
      />

      {session?.user && (
        <div className="flex items-center gap-2 px-1">
          <input
            type="checkbox"
            id="default"
            className="h-4 w-4 accent-stone-700"
            onChange={() => setIsDefaultValue((prevState) => !prevState)}
            disabled={isPending}
            defaultChecked={addressToEdit?.isDefault}
          />
          <label htmlFor="default" className="text-sm text-[#666666]">
            Set as default
          </label>
        </div>
      )}

      <Button
        type="button"
        variation={`${type === "modal" ? "primary" : "transparent"}`}
        classes={[
          `flex justify-center ${type === "modal" ? "" : "!bg-stone-100/70"}`,
        ]}
        ring={type === "modal" ? false : true}
        disabled={isPending}
      >
        Save
      </Button>
    </form>
  );
}
