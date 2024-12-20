import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, getCurrencySymbol } from "@/utils/helpers";
import { Settings } from "@prisma/client";

export default function ShippingMethod({
  selectedShippingMethod,
  onHandleShippingMethod,
  settings,
}: {
  selectedShippingMethod: "standard" | "express";
  onHandleShippingMethod: (method: "standard" | "express") => void;
  settings: Settings;
}) {
  const { currency, convertPrice } = useCurrency();
  const convertedShipping = convertPrice(settings.standardShipping);
  const convertedExpressShipping = convertPrice(settings.expressShipping);

  return (
    <div className="mb-1">
      <h2 className="text-base mb-3">Shipping method</h2>
      <div>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 rounded-t-[5px] border ${
            selectedShippingMethod === "standard"
              ? "border-primary bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedShippingMethod === "standard"
                  ? "border-black bg-black"
                  : "border-gray-300"
              }`}
            >
              {selectedShippingMethod === "standard" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Standard (1-3 Days)</span>
          </div>
          <span className="text-sm">
            {getCurrencySymbol(currency)}
            {formatCurrency(convertedShipping, currency === "NGN" ? 0 : 2)}
          </span>
          <input
            type="radio"
            value="standard"
            checked={selectedShippingMethod === "standard"}
            onChange={() => onHandleShippingMethod("standard")}
            className="sr-only"
          />
        </label>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 rounded-b-[5px] border ${
            selectedShippingMethod === "express"
              ? "border-primary bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedShippingMethod === "express"
                  ? "border-black bg-black"
                  : "border-gray-300"
              }`}
            >
              {selectedShippingMethod === "express" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Business express (3-7 Days)</span>
          </div>
          <span className="text-sm">
            {getCurrencySymbol(currency)}
            {formatCurrency(
              convertedExpressShipping,
              currency === "NGN" ? 0 : 2
            )}
          </span>
          <input
            type="radio"
            value="express"
            checked={selectedShippingMethod === "express"}
            onChange={() => onHandleShippingMethod("express")}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
