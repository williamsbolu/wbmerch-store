"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { Address } from "@prisma/client";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import Modal from "../ui/ModalContainer";
import AddressForm from "@/components/ui/AddressForm";

export default function CheckoutAddressList({
  session,
  addresses,
}: {
  addresses: Address[];
  session: Session;
}) {
  const [open, setOpen] = useState(false);
  const defaultAddress = addresses.find((address) => address.isDefault);

  return (
    <div className="border-y border-solid border-stone-300 py-4">
      <div
        role="button"
        className="flex justify-between items-center mb-2"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        <h2 className="text-sm">Ship to</h2>
        <button className="p-1 bg-[#0000000D] rounded-md">
          <MdKeyboardArrowDown
            className={`w-5 h-5 transition-all duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
      {!open && defaultAddress && (
        <div className="rounded-lg cursor-pointer">
          <div className="">
            <p className="text-sm">
              {defaultAddress.firstName} {defaultAddress.lastName},{" "}
              {defaultAddress.address}
            </p>
            <p className="text-sm capitalize text-stone-500">
              {defaultAddress.city}, {defaultAddress.state},{" "}
              {defaultAddress.postalCode}, {defaultAddress.country}
            </p>
          </div>
        </div>
      )}

      {open && (
        <Modal>
          <ul>
            {addresses.map((address) => (
              <CheckoutAddress
                key={address.id}
                address={address}
                open={open}
                session={session}
              />
            ))}

            {session?.user && (
              <div className="mt-[10px]">
                <Modal.Open opens="add-checkout-address">
                  <button className="text-sm text-[#000000CC] flex items-center gap-3 font-medium">
                    <IoAdd className="w-6 h-6" />
                    <span className="mt-[2px]">Use a different address</span>
                  </button>
                </Modal.Open>
                <Modal.Window name="add-checkout-address">
                  <AddressForm type="modal" method="add" session={session} />
                </Modal.Window>
              </div>
            )}
          </ul>
        </Modal>
      )}
    </div>
  );
}
