"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { usePathname } from "next/navigation";

export function LoadingBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => {
      NProgress.start();
    };

    const handleComplete = () => {
      NProgress.done();
    };

    handleStart(); // Start progress bar on initial load or route change

    // Use a timeout to simulate the end of the initial load or route change
    const timer = setTimeout(() => {
      handleComplete();
    }, 300); // Adjust this value as needed

    return () => {
      clearTimeout(timer);
      handleComplete(); // Ensure NProgress is done when component unmounts or before re-running the effect
    };
  }, [pathname]);

  return null;
}
