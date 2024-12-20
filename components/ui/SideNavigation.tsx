"use client";

import Link from "next/link";
// import { RxDashboard } from "react-icons/rx";
import { PiUserList, PiLockKey, PiMapPin, PiHeart } from "react-icons/pi";
import { SlBag } from "react-icons/sl";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const navLinks = [
  {
    name: "Personal Info",
    href: "/account",
    icon: <PiUserList className="h-5 w-5 text-primary" />,
  },
  {
    name: "My Orders",
    href: "/account/orders",
    icon: <SlBag className="h-5 w-5 text-primary" />,
  },
  {
    name: "My Address",
    href: "/account/address",
    icon: <PiMapPin className="h-5 w-5 text-primary" />,
  },
  {
    name: "My Wishlist",
    href: "/account/wishlist",
    icon: <PiHeart className="h-5 w-5 text-primary" />,
  },
];

export default function SideNavigation() {
  const user = useCurrentUser();
  const pathName = usePathname();

  return (
    <nav className="h-full border-[#12121218] md:pr-5 md:border-r-[3px]">
      <h1 className="text-xl text-center mb-5 tracking-wide md:text-start">
        My Account
      </h1>
      <ul className="grid gap-[2px] text-[15px]">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`flex items-center justify-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120c] px-2 transition-all duration-150 hover:px-5 md:justify-start ${
                pathName === link.href && "px-5 bg-[#1212120c]"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
        {!user?.isOAuth && (
          <li>
            <Link
              href="/account/password"
              className={`flex items-center justify-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120c] px-2 transition-all duration-150 hover:px-5 md:justify-start ${
                pathName === "/account/password" && "px-5 bg-[#1212120c]"
              }`}
            >
              <PiLockKey className="h-5 w-5 text-primary" />
              Change Password
            </Link>
          </li>
        )}
        {user?.role !== "USER" && (
          <li>
            <Link
              href="/admin"
              target="_blank"
              className="flex items-center justify-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120c] px-2 transition-all duration-150 hover:px-5 md:justify-start"
            >
              <MdOutlineAdminPanelSettings className="w-5 h-5 text-primary" />
              Admin Panel
            </Link>
          </li>
        )}
        <li>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120a] px-2 w-full transition-all duration-150 hover:px-5 md:justify-start"
          >
            <TbLogout className="w-5 h-5 text-primary" />
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}

{
  /* <RxDashboard className="h-5 w-5 text-primary" /> */
}
