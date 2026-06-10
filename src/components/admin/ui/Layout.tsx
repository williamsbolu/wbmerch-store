"use client";

import { useState } from "react";
import Header from "@/components/admin/ui/Header";
import SideBar from "@/components/admin/ui/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SideBar sideBarOpen={sidebarOpen} />
      <main className="transition-all duration-300 ease-in-out bg-gray-50 pt-8 px-10 pb-12 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">{children}</div>
      </main>
    </>
  );
}
