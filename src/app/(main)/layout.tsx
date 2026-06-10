import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ReduxProvider from "@/components/ReduxProvider";
import Layout from "@/components/ui/Layout";

export const metadata = {
  title: {
    default: "WB Merch",
    template: "%s / WB Merch",
  },
  description:
    "Discover the best in styles and lifestyle clothing, accessories, and equipment at WB Merch store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ReduxProvider>
        <Layout>{children}</Layout>
      </ReduxProvider>
    </SessionProvider>
  );
}

// In some cases, if server components rely on session data, you may want to fetch the session server-side first using auth() and then pass it down as props to avoid hydration mismatches. This prevents cases where the server-rendered HTML differs from what the client renders.
