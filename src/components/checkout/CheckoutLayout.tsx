import { auth } from "@/auth";
import CheckoutAuth from "@/components/checkout/CheckoutAuth";
import CheckoutNoAuth from "@/components/checkout/CheckoutNoAuth";
import { getSettings } from "@/data/settings";

export default async function CheckoutLayout() {
  const session = await auth();
  const settings = await getSettings();

  return (
    <>
      {session?.user ? (
        <CheckoutAuth session={session} settings={settings!} />
      ) : (
        <CheckoutNoAuth session={session!} settings={settings!} />
      )}
    </>
  );
}
