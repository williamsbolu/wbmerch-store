import { Toaster } from "react-hot-toast";

import "@/app/_styles/globals.css";
import { LoadingBar } from "@/hooks/LoadingBar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://unpkg.com/nprogress@0.2.0/nprogress.css"
        />
      </head>
      <body>
        <LoadingBar />
        {children}

        <Toaster
          position="top-right"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 4000,
              style: {
                border: "1px solid #34d399  ",
              },
            },
            error: {
              duration: 5000,
              style: {
                border: "1px solid #EF4444",
              },
            },
            style: {
              fontSize: "15px",
              maxWidth: "500px",
              padding: "13px 15px",
              backgroundColor: "#fff",
              color: "#121212 ",
            },
          }}
        />
      </body>
    </html>
  );
}
