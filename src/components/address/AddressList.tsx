import { Address } from "@prisma/client";
import AddressItem from "./AddressItem";
import { auth } from "@/auth";

export default async function AddressList({
  addresses,
}: {
  addresses: Address[];
}) {
  const session = await auth();

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {addresses.map((address) => (
        <AddressItem key={address.id} address={address} session={session} />
      ))}
    </ul>
  );
}
