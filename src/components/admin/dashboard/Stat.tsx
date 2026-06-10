import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import React from "react";

export default function Stat({
  icon,
  title,
  value,
  color,
  amount,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  amount?: number;
  value?: number;
}) {
  const { currency, convertPrice: convertAmount } = useCurrency();

  return (
    <div className="bg-white border border-gray-200 border-solid rounded-lg p-4 grid grid-cols-[64px_1fr] gap-x-4 gap-y-1">
      <div
        className={`bg-${color}-100 row-span-2 aspect-[1] rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
      <h4 className="self-end text-xs uppercase tracking-wide font-semibold text-gray-500">
        {title}
      </h4>
      {value && <p className="text-xl leading-none font-medium">{value}</p>}
      {amount && (
        <p className="text-xl leading-none font-medium">
          {getCurrencySymbol(currency)}
          {formatCurrency(convertAmount(amount), currency === "NGN" ? 0 : 2)}
        </p>
      )}
    </div>
  );
}
