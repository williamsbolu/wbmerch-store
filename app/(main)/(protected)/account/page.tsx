import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <p className="text-accent-400 my-10 tracking-wide">
      No orders to show at the moment.
    </p>
  );
}
