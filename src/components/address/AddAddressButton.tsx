"use client";

import { Session } from "next-auth";
import { IoAdd } from "react-icons/io5";
import Modal from "@/components/ui/ModalContainer";
import AddressForm from "@/components/ui/AddressForm";

export default function AddAddressButton({
  session,
}: {
  session: Session | null;
}) {
  return (
    <Modal>
      <Modal.Open opens="add-address-form">
        <button className="border border-solid border-primary rounded-full">
          <IoAdd className="w-6 h-6 text-primary" />
        </button>
      </Modal.Open>
      <Modal.Window name="add-address-form">
        <AddressForm type="modal" method="add" session={session} />
      </Modal.Window>
    </Modal>
  );
}
