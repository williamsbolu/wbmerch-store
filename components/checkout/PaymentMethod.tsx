import { useState } from "react";
import Image from "next/image";
import visaLogo from "@/public/visa-logo.png";
import verveLogo from "@/public/verve-logo.png";
import mastercardLogo from "@/public/mastercard-logo.png";
import { PiCreditCardThin } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";

export default function PaymentMethod({
  selectedPaymentOption,
  onHandlePaymentMethod,
}: {
  selectedPaymentOption: "paystack" | "bank-transfer" | "pay-on-delivery";
  onHandlePaymentMethod: (
    method: "paystack" | "pay-on-delivery" | "bank-transfer"
  ) => void;
}) {
  const changePaymentMethod = (
    method: "paystack" | "bank-transfer" | "pay-on-delivery"
  ) => {
    onHandlePaymentMethod(method);
  };

  const renderPaystackContent = () => (
    <div className="flex flex-col items-center px-4 pb-4 border border-solid border-gray-300 bg-stone-100/70 transition-all duration-300 ease-in-out">
      <PiCreditCardThin className="w-24 h-24" />
      <p className="w-9/12 text-[13px] text-center text-primary">
        After clicking &quot;Pay now&quot;, you will be redirected to Paystack
        to complete your purchase securely.
      </p>
    </div>
  );

  const renderBankTransferContent = () => (
    <div className="p-4 bg-stone-100/70 rounded-b-[5px] border border-solid border-gray-300 transition-all duration-300 ease-in-out">
      <p className="text-[13px] text-primary">
        Please note that our conversion rate is 1,670 NGN to $1, and we will
        confirm all payments before processing your order.
        <br />
        <br />
        <br />
        Make a bank transfer in Nigerian Naira (NGN) of the required amount to
        the following account:
        <br />
        <br />
        <br />
        Name: WB MERCH PROJECTS LTD - 2
        <br />
        Account Number: 0026482452
        <br />
        Bank Name: TEST BANK
        <br />
        <br />
        <br />
        Kindly reach out to +234(0) 708 507 2330 with your detailed proof of
        payment for confirmation. Please note that we confirm all payments
        before processing orders.
        <br />
        <br />
        <br />
        Thank you for your cooperation.
      </p>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg mb-1">Payment</h2>
      <p className="text-[13px] text-[#0000008F] mb-4">
        All transactions are secure and encrypted.
      </p>
      <div>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 rounded-t-[5px] border ${
            selectedPaymentOption === "pay-on-delivery"
              ? "border-primary bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedPaymentOption === "pay-on-delivery"
                  ? "border-black bg-black"
                  : "border-gray-300"
              }`}
            >
              {selectedPaymentOption === "pay-on-delivery" && (
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
            checked={selectedPaymentOption === "pay-on-delivery"}
            onChange={() => changePaymentMethod("pay-on-delivery")}
            className="sr-only"
          />
        </label>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 border ${
            selectedPaymentOption === "paystack"
              ? "border-black bg-stone-100/70"
              : "border-gray-300"
          } cursor-pointer transition-all duration-200 ease-in-out`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedPaymentOption === "paystack"
                  ? "border-black bg-black"
                  : "border-gray-300"
              } transition-all duration-200 ease-in-out`}
            >
              {selectedPaymentOption === "paystack" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Paystack</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="border border-solid shadow-sm">
              <Image src={mastercardLogo} height={25} alt="logo-mastercard" />
            </span>
            <span className="border border-solid shadow-sm">
              <Image src={visaLogo} height={25} alt="logo-visa" />
            </span>
            <span className="border border-solid shadow-sm">
              <Image src={verveLogo} height={25} alt="logo-verve" />
            </span>
          </div>
          <input
            type="radio"
            name="paymentOption"
            value="paystack"
            checked={selectedPaymentOption === "paystack"}
            onChange={() => changePaymentMethod("paystack")}
            className="sr-only"
          />
        </label>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            selectedPaymentOption === "paystack" ? "max-h-96" : "max-h-0"
          }`}
        >
          {renderPaystackContent()}
        </div>
        <label
          className={`relative flex items-center justify-between h-[50px] px-4 border ${
            selectedPaymentOption === "bank-transfer"
              ? "border-black bg-stone-100/70"
              : "border-gray-300 rounded-b-[5px]"
          } cursor-pointer transition-all duration-200 ease-in-out`}
        >
          <div className="flex items-center">
            <div
              className={`w-[18px] h-[18px] rounded-full border mr-3 flex items-center justify-center ${
                selectedPaymentOption === "bank-transfer"
                  ? "border-black bg-black"
                  : "border-gray-300"
              } transition-all duration-200 ease-in-out`}
            >
              {selectedPaymentOption === "bank-transfer" && (
                <div className="w-[6px] h-[6px] rounded-full bg-white"></div>
              )}
            </div>
            <span className="text-sm">Bank Transfer</span>
          </div>
          <input
            type="radio"
            name="paymentOption"
            value="bank-transfer"
            checked={selectedPaymentOption === "bank-transfer"}
            onChange={() => changePaymentMethod("bank-transfer")}
            className="sr-only"
          />
        </label>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            selectedPaymentOption === "bank-transfer" ? "max-h-96" : "max-h-0"
          }`}
        >
          {renderBankTransferContent()}
        </div>
      </div>
    </div>
  );
}
