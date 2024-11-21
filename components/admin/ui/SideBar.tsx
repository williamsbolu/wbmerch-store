"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/logo.png";
import {
  HiOutlineCalendarDays,
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

export default function SideBar({ sideBarOpen }: { sideBarOpen: boolean }) {
  const pathName = usePathname();

  return (
    <aside
      className={`${
        sideBarOpen ? "m-0" : "-ml-[220px]"
      } row-span-full w-[220px] bg-white py-8 px-6 border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col gap-8`}
    >
      <div className="flex justify-center mt-10 mb-3">
        <Image src={logo} width={60} alt="wb-merch logo" />
      </div>

      <nav>
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/admin"
              className={`${
                pathName === "/admin" &&
                "rounded-[5px] bg-gray-50 text-gray-800"
              } group flex items-center gap-3 text-gray-600 text-base font-medium py-3 px-6 transition-all duration-300 hover:text-gray-800 hover:bg-gray-50`}
            >
              <HiOutlineHome
                className={`${
                  pathName === "/admin" && "text-indigo-600"
                } w-6 h-6 text-gray-400 transition-all duration-300`}
              />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className={`${
                pathName === "/admin/orders" &&
                "rounded-[5px] bg-gray-50 text-gray-800"
              } group flex items-center gap-3 text-gray-600 text-base font-medium py-3 px-6 transition-all duration-300 hover:text-gray-800 hover:bg-gray-50`}
            >
              <HiOutlineCalendarDays
                className={`${
                  pathName === "/admin/orders" && "text-indigo-600"
                } w-6 h-6 text-gray-400 transition-all duration-300`}
              />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className={`${
                pathName === "/admin/products" &&
                "rounded-[5px] bg-gray-50 text-gray-800"
              } group flex items-center gap-3 text-gray-600 text-base font-medium py-3 px-6 transition-all duration-300 hover:text-gray-800 hover:bg-gray-50`}
            >
              <HiOutlineCube
                className={`${
                  pathName === "/admin/products" && "text-indigo-600"
                } w-6 h-6 text-gray-400 transition-all duration-300`}
              />
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`${
                pathName === "/admin/users" &&
                "rounded-[5px] bg-gray-50 text-gray-800"
              } group flex items-center gap-3 text-gray-600 text-base font-medium py-3 px-6 transition-all duration-300 hover:text-gray-800 hover:bg-gray-50`}
            >
              <HiOutlineUsers
                className={`${
                  pathName === "/admin/users" && "text-indigo-600"
                } w-6 h-6 text-gray-400 transition-all duration-300`}
              />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/settings"
              className={`${
                pathName === "/admin/settings" &&
                "rounded-[5px] bg-gray-50 text-gray-800"
              } group flex items-center gap-3 text-gray-600 text-base font-medium py-3 px-6 transition-all duration-300 hover:text-gray-800 hover:bg-gray-50`}
            >
              <HiOutlineCog6Tooth
                className={`${
                  pathName === "/admin/settings" && "text-indigo-600"
                } w-6 h-6 text-gray-400 transition-all duration-300`}
              />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
