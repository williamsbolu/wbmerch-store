import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SideNavigation from "@/components/ui/SideNavigation";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <section className="mt-10 mb-16">
        <div className="py-5">
          <h1 className="text-2xl text-primary text-center tracking-wider">
            Account
          </h1>
        </div>
        <div
          className={`max-w-[1100px] mx-auto grid grid-cols-[14rem_1fr] gap-10`}
        >
          <SideNavigation />
          <div className="">{children}</div>
        </div>
      </section>
    </SessionProvider>
  );
}
