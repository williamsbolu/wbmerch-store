import { auth } from "@/auth";
import PaymentSuccess from "@/components/ui/PaymentSuccess";

export default async function Page() {
  const session = await auth();

  return <PaymentSuccess session={session} />;
}
