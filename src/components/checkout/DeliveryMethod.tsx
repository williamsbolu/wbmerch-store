import { useState } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import { TbTruck } from "react-icons/tb";

export default function DeliveryMethod() {
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<
    "ship" | "pay-on-delivery"
  >("ship");

  return (
    <div className="mb-1">
      <h2 className="text-lg mb-3">Delivery</h2>
      <div>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 rounded-t-[5px] border ${
            selectedDeliveryOption === "ship"
              ? "border-primary bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedDeliveryOption === "ship"
                  ? "border-black bg-black"
                  : "border-gray-300"
              }`}
            >
              {selectedDeliveryOption === "ship" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Ship</span>
          </div>
          <span className="text-sm">
            <TbTruck className="w-5 h-5 text-primary" />
          </span>{" "}
          <input
            type="radio"
            value="ship"
            checked={selectedDeliveryOption === "ship"}
            onChange={() => setSelectedDeliveryOption("ship")}
            className="sr-only"
          />
        </label>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 rounded-b-[5px] border ${
            selectedDeliveryOption === "pay-on-delivery"
              ? "border-primary bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedDeliveryOption === "pay-on-delivery"
                  ? "border-black bg-black"
                  : "border-gray-300"
              }`}
            >
              {selectedDeliveryOption === "pay-on-delivery" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Pay-on-delivery</span>
          </div>
          <span className="text-sm">
            <GiTakeMyMoney className="w-5 h-5 text-primary" />
          </span>
          <input
            type="radio"
            value="pay-on-delivery"
            checked={selectedDeliveryOption === "pay-on-delivery"}
            onChange={() => setSelectedDeliveryOption("pay-on-delivery")}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
