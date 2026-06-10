import { Address } from "@prisma/client";
import { PiMapPin } from "react-icons/pi";
import { getUserAddress } from "@/data/address";
import { currentUser } from "@/lib/auth";
import AddressList from "@/components/address/AddressList";

export default async function UsersAddress() {
  const user = await currentUser();
  const addresses = await getUserAddress(user?.id!);

  return (
    <>
      {addresses.length === 0 ? (
        <div className="flex flex-col gap-3 items-center py-24 md:pr-20">
          <PiMapPin className="h-8 w-8 text-primary/80" />
          <p className="text-primary tracking-wide text-[15px] text-center">
            You have not added your addresses
          </p>
        </div>
      ) : (
        <AddressList addresses={addresses} />
      )}
    </>
  );
}
