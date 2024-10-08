import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SideNavigation from "@/components/ui/SideNavigation";

export const metadata = {
  title: "Account",
};

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <section className="mt-32 mb-24">
        <div
          className={`max-w-[1100px] mx-auto px-5 grid gap-7 md:grid-cols-[12rem_1fr] lg:grid-cols-[14rem_1fr] lg:gap-10`}
        >
          <SideNavigation />
          <div>{children}</div>
        </div>
      </section>
    </SessionProvider>
  );
}
