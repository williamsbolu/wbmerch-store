import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import { PiUserList, PiLockKey, PiMapPin, PiHeart } from "react-icons/pi";
import { SlBag } from "react-icons/sl";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { signOut } from "@/auth";

const navLinks = [
  {
    name: "Dashboard",
    href: "/account",
    icon: <RxDashboard className="h-5 w-5 text-primary" />,
  },
  {
    name: "Personal Info",
    href: "/account/information",
    icon: <PiUserList className="h-5 w-5 text-primary" />,
  },
  {
    name: "Change Password",
    href: "/account/password",
    icon: <PiLockKey className="h-5 w-5 text-primary" />,
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
    name: "Wishlist",
    href: "/account/favorite",
    icon: <PiHeart className="h-5 w-5 text-primary" />,
  },
];

export default function SideNavigation() {
  return (
    <nav className="h-full border-r-[3px] border-[#d5d5d5] pr-10">
      <h1 className="text-xl font-medium mb-5 tracking-wide">My Account</h1>
      <ul className="flex flex-col gap-[2px] h-full text-[15px]">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="flex items-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120c] px-2 transition-all duration-150 hover:px-5"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/account"
            className="flex items-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120c] px-2 transition-all duration-150 hover:px-5"
          >
            <MdOutlineAdminPanelSettings className="w-5 h-5 text-primary" />
            Admin Panel
          </Link>
        </li>
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex items-center py-3 rounded-[5px] gap-3 hover:bg-[#1212120a] px-2 transition-all duration-150 hover:px-5">
              <TbLogout className="w-5 h-5 text-primary" />
              Sign Out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
