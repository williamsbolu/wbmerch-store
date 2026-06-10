"use client";

import { useTransition } from "react";
import { Address } from "@prisma/client";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiEditBoxLine } from "react-icons/ri";
import Modal from "../ui/ModalContainer";
import AddressForm from "../ui/AddressForm";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { deleteAddress } from "@/actions/address";

export default function AddressItem({
  address,
  session,
}: {
  address: Address;
  session: Session | null;
}) {
  const [isPending, startTransition] = useTransition();

  const deleteAddressHandler = () => {
    startTransition(() => {
      deleteAddress(address.id).catch(() =>
        toast.error("Something went wrong")
      );
    });
  };

  return (
    <li className="relative border border-solid border-gray-200 p-12 self-start rounded-[5px]">
      <div className="absolute right-3 top-3 flex gap-2 items-center">
        <Modal>
          <Modal.Open opens="edit-address">
            <button className="">
              <RiEditBoxLine className="w-[18px] h-[18px] text-primary/80" />
            </button>
          </Modal.Open>
          <Modal.Window name="edit-address">
            <AddressForm
              type="modal"
              method="edit"
              addressToEdit={address}
              session={session}
            />
          </Modal.Window>
          <Modal.Open opens="delete-address">
            <button className="">
              <RiDeleteBinLine className="w-[18px] h-[18px] text-primary/80" />
            </button>
          </Modal.Open>
          <Modal.Window name="delete-address">
            <ConfirmDelete
              disabled={isPending}
              onConfirm={deleteAddressHandler}
              resourceName="address"
            />
          </Modal.Window>
        </Modal>
      </div>

      {address.isDefault && (
        <h3 className="text-[13px] text-center tracking-wider font-medium mb-1 md:text-start">
          Primary Address
        </h3>
      )}
      <div className="text-[13px] font-light text-center md:text-start">
        <p className="tracking-wider leading-5">
          {address.firstName} {address.lastName}
        </p>
        <p className="tracking-wider leading-5">{address.address}</p>
        <p className="tracking-wider leading-5">
          {address.postalCode} {address.city} {address.state} {address.country}
        </p>
      </div>
    </li>
  );
}
