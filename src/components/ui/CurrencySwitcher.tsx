"use client";

import { Currency, useCurrency } from "@/context/CurrencyContext";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as Currency);
  };

  return (
    <form>
      <label className="block text-[13px] text-[#121212BF] mb-2">
        Country/region
      </label>

      <select
        value={currency}
        className="bg-white text-primary border space-y-3 border-primary rounded-[5px] text-[13px] px-4 h-11 focus:outline-none"
        onChange={handleCurrencyChange}
      >
        <option value="CAD">Canada (CAD &#36;)</option>
        <option value="EUR">Germany (EUR &euro;)</option>
        <option value="GHS">Ghana (GHS &#8373;)</option>
        <option value="NGN">Nigeria (NGN &#8358;)</option>
        <option value="GBP">United Kindom (GBP &#163;)</option>
        <option value="USD">United States (USD &#36;)</option>
      </select>
    </form>
  );
}
