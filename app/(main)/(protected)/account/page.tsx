import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <h2 className="text-2xl text-accent-400 mb-7"></h2>;
}
