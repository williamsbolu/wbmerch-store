import { Suspense } from "react";
import UsersAddress from "@/components/address/UsersAddress";
import AccountPageSpinner from "@/components/ui/AccountPageSpinner";
import AddAddressButton from "@/components/address/AddAddressButton";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="py-4 space-y-7 md:space-y-6">
      <div className="flex flex-col gap-3 items-center justify-between md:flex-row">
        <h1 className="text-lg tracking-wider">My Address</h1>
        <AddAddressButton session={session} />
      </div>

      <Suspense fallback={<AccountPageSpinner />}>
        <UsersAddress />
      </Suspense>
    </div>
  );
}
