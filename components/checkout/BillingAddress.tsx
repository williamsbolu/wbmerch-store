import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";
import { AddressFormSchema } from "@/schemas";
import { OrderAddressType } from "@/utils/types";

export default function BillingAddress({
  billingAddress,
  billingAddressType,
  onHandleBillingAddressType,
  onHandleBillingAddress,
}: {
  billingAddressType: "same" | "different";
  billingAddress: OrderAddressType | null;
  onHandleBillingAddressType: (type: "different" | "same") => void;
  onHandleBillingAddress: (data: OrderAddressType) => void;
}) {
  const [displayButton, setDisplayButton] = useState(true);
  const [country, setCountry] = useState<string>(
    billingAddress?.country! || "United States"
  );

  const { register, handleSubmit, reset, formState } = useForm<
    z.infer<typeof AddressFormSchema>
  >({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      firstName: billingAddress?.firstName || "",
      lastName: billingAddress?.lastName || "",
      address: billingAddress?.address || "",
      optional: billingAddress?.optional || "",
      city: billingAddress?.city || "",
      state: billingAddress?.state || "",
      postalCode: billingAddress?.postalCode || "",
      phone: billingAddress?.phone || "",
    },
  });

  const { errors } = formState;

  const setDisplayTrue = () => {
    // if the state is true return, if the button is displaying
    if (displayButton) return;

    setDisplayButton(true);
  };

  const setDisplayFalse = () => setDisplayButton(false);

  function handleFormSubmit(values: z.infer<typeof AddressFormSchema>) {
    setDisplayFalse();
    const data = {
      ...values,
      country,
    };

    onHandleBillingAddress(data);
  }
  const input =
    "w-full border text-sm rounded-[5px] font-normal bg-white focus:outline-none placeholder:text-[#0000008F] placeholder:text-[13px] placeholder:tracking-wide py-[10px] px-3";

  return (
    <div>
      <h2 className="text-lg mb-3">Billing address</h2>

      <div>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 rounded-t-[5px] border ${
            billingAddressType === "same"
              ? "border-black bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer transition-all duration-200 ease-in-out`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                billingAddressType === "same"
                  ? "border-black bg-black"
                  : "border-gray-300"
              } transition-all duration-200 ease-in-out`}
            >
              {billingAddressType === "same" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Same as shipping address</span>
          </div>
          <input
            type="radio"
            name="billingOption"
            value="same"
            checked={billingAddressType === "same"}
            onChange={() => {
              onHandleBillingAddressType("same");
            }}
            className="sr-only"
          />
        </label>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 border ${
            billingAddressType === "different"
              ? "border-black bg-stone-100/70"
              : "border-gray-300 rounded-b-[5px]"
          } cursor-pointer transition-all duration-200 ease-in-out`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                billingAddressType === "different"
                  ? "border-black bg-black"
                  : "border-gray-300"
              } transition-all duration-200 ease-in-out`}
            >
              {billingAddressType === "different" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Use a different billing address</span>
          </div>
          <input
            type="radio"
            name="billingOption"
            value="different"
            checked={billingAddressType === "different"}
            onChange={() => onHandleBillingAddressType("different")}
            className="sr-only"
          />
        </label>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            billingAddressType === "different" ? "max-h-[420px]" : "max-h-0"
          }`}
        >
          <div className="p-4 bg-stone-100/70 rounded-b-[5px] border border-solid border-gray-300 transition-all duration-300 ease-in-out">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="grid gap-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className={`${input} ${
                    errors?.firstName?.message
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : "border-gray-400 focus:border-primary"
                  }`}
                  {...register("firstName", {
                    onChange() {
                      setDisplayTrue();
                    },
                  })}
                  placeholder="First name"
                />
                <input
                  type="text"
                  className={`${input} ${
                    errors?.lastName?.message
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : "border-gray-400 focus:border-primary"
                  }`}
                  {...register("lastName", {
                    onChange() {
                      setDisplayTrue();
                    },
                  })}
                  placeholder="Last name"
                />
              </div>
              <input
                type="text"
                className={`${input} ${
                  errors?.address?.message
                    ? "border-[#EF4444] focus:border-[#EF4444]"
                    : "border-gray-400 focus:border-primary"
                }`}
                {...register("address", {
                  onChange() {
                    setDisplayTrue();
                  },
                })}
                placeholder="Detailed delivery address"
              />
              <input
                type="text"
                className={`${input} ${
                  errors?.optional?.message
                    ? "border-[#EF4444] focus:border-[#EF4444]"
                    : "border-gray-400 focus:border-primary"
                }`}
                {...register("optional", {
                  onChange() {
                    setDisplayTrue();
                  },
                })}
                placeholder="Apartment, suite, etc. (optional)"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="bg-white border border-gray-300 shadow-sm text-sm rounded-[5px] focus:outline-none py-[10px] px-3"
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setDisplayTrue();
                  }}
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
                  {...register("state", {
                    onChange() {
                      setDisplayTrue();
                    },
                  })}
                  placeholder="State"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className={`${input} ${
                    errors?.city?.message
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : "border-gray-400 focus:border-primary"
                  }`}
                  {...register("city", {
                    onChange() {
                      setDisplayTrue();
                    },
                  })}
                  placeholder="City"
                />
                <input
                  type="text"
                  className={`${input} ${
                    errors?.postalCode?.message
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : "border-gray-400 focus:border-primary"
                  }`}
                  {...register("postalCode", {
                    onChange() {
                      setDisplayTrue();
                    },
                  })}
                  placeholder="Zip/postal code"
                />
              </div>
              <input
                type="text"
                className={`${input} ${
                  errors?.phone?.message
                    ? "border-[#EF4444] focus:border-[#EF4444]"
                    : "border-gray-400 focus:border-primary"
                }`}
                {...register("phone", {
                  onChange() {
                    setDisplayTrue();
                  },
                })}
                placeholder="Telephone"
              />
              {displayButton && (
                <Button
                  type="button"
                  variation="transparent"
                  classes={["!bg-stone-100/70"]}
                >
                  {!billingAddress ? "Add" : "Save"}
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
