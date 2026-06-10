"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { Settings } from "@prisma/client";
import { updateSettings } from "@/actions/settings";
import { Currency, useCurrency } from "@/context/CurrencyContext";

export default function UserSettingsForm({ settings }: { settings: Settings }) {
  const { currency, setCurrency } = useCurrency();
  const [isPending, startTransition] = useTransition();

  function handleUpdate(e: React.FocusEvent<HTMLInputElement>, field: string) {
    const value = Number(e.target.value);
    if (!value) return;

    if (confirm("Are you sure you want to update this fleld?"))
      startTransition(() => {
        updateSettings({ [field]: value }, settings.id)
          .then((data) => {
            if (data?.error) {
              toast.error(data.error, {
                position: "top-center",
              });
            }

            if (data.success) {
              toast.success(data.success, {
                position: "top-center",
              });
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as Currency);
  };

  const inputStyles =
    "border border-solid border-gray-300 bg-white rounded-[5px] shadow-sm py-2 px-3 focus:outline-2 outline-indigo-600 disabled:bg-gray-200";

  return (
    <form className="py-6 px-10 bg-white border border-gray-200 rounded-lg text-sm space-y-6">
      <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
        <label className="font-medium">Shipping/Standard (USD)</label>
        <input
          type="number"
          defaultValue={settings.standardShipping}
          className={inputStyles}
          onBlur={(e) => handleUpdate(e, "standardShipping")}
          disabled={isPending}
        />
      </div>
      <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
        <label className="font-medium">Shipping/Express (USD)</label>
        <input
          type="number"
          defaultValue={settings.expressShipping}
          className={inputStyles}
          onBlur={(e) => handleUpdate(e, "expressShipping")}
          disabled={isPending}
        />
      </div>
      <div className="grid grid-cols-[200px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="currency" className="font-medium">
          Selected Currency
        </label>
        <select
          id="currency"
          value={currency}
          className={inputStyles}
          onChange={handleCurrencyChange}
        >
          <option value="NGN">Nigeria (&#8358;)</option>
          <option value="GBP">United Kindom (&#163;)</option>
          <option value="CAD">Canada (&#36;)</option>
          <option value="EUR">Germany (&euro;)</option>
          <option value="GHS">Ghana (&#8373;)</option>
          <option value="USD">United States (&#36;)</option>
        </select>
      </div>
    </form>
  );
}
