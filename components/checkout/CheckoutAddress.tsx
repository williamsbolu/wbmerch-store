import { Session } from "next-auth";
import { Address } from "@prisma/client";
import { RiEditBoxLine } from "react-icons/ri";
import Modal from "@/components/ui/ModalContainer";
import AddressForm from "@/components/ui/AddressForm";
import { useTransition } from "react";
import { editAddress } from "@/actions/address";
import toast from "react-hot-toast";
import { optional } from "zod";

export default function CheckoutAddress({
  address,
  open,
  session,
}: {
  address: Address;
  open: boolean;
  session: Session;
}) {
  const [isPending, startTransition] = useTransition();

  const updateDefaultHandler = () => {
    // By default address of unauthenticated users are default address so no need for protection against unauthenticated users.

    if (address.isDefault) return;
    if (isPending) return;

    const actionData = {
      ...address,
      isDefault: true,
      optional: undefined,
      id: undefined,
    };

    startTransition(() => {
      editAddress(actionData, address.id)
        .then(() => toast.success("Default address updated"))
        .catch(() => toast.error("Failed to update default address"));
    });
  };

  return (
    <li
      className={`rounded-lg cursor-pointer p-3 grid gap-3 ${
        address.isDefault
          ? "border border-stone-200 bg-[#F6F6F6] grid-cols-[1fr_min-content]"
          : "grid-cols-[1fr_20px]"
      }`}
      onClick={updateDefaultHandler}
    >
      <div className="">
        <p className={`text-sm ${open ? "mb-1" : "mb-[2px]"}`}>
          {address.firstName} {address.lastName}, {address.address}
        </p>
        <p className="text-sm capitalize text-stone-500">
          {address.city}, {address.state}, {address.postalCode},{" "}
          {address.country}
        </p>
      </div>
      {address.isDefault && (
        <>
          <Modal.Open opens={`edit-checkout-${address.id}`}>
            <button className={`self-start ${address.isDefault ? "" : ""}`}>
              <RiEditBoxLine className="w-5 h-5" />
            </button>
          </Modal.Open>
          <Modal.Window name={`edit-checkout-${address.id}`}>
            <AddressForm
              type="modal"
              method="edit"
              session={session}
              addressToEdit={address}
            />
          </Modal.Window>
        </>
      )}
    </li>
  );
}
