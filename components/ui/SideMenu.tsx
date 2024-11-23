import Link from "next/link";
import { signOut } from "next-auth/react";
import { PiHandbagLight } from "react-icons/pi";
import { TfiClose } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { BiUser } from "react-icons/bi";
import { SiYoutube } from "react-icons/si";
import { LiaInstagram } from "react-icons/lia";
import { TbLogout } from "react-icons/tb";
import { Inter } from "next/font/google";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getTotalCartQuantity } from "@/components/cart/cartSlice";
import ListDropdown from "./ListDropdown";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function SideMenu({
  onCloseModal,
}: {
  onCloseModal?: () => void;
}) {
  const user = useCurrentUser();
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  return (
    <>
      <div className={`${inter.className}`}>
        <div className="px-[10px] py-4">
          <button onClick={onCloseModal} className="p-1">
            <TfiClose className="w-4 h-4 text-primary" />
          </button>
        </div>
        <div className="px-[10px] py-4">
          <Link
            href="/cart"
            onClick={onCloseModal}
            className="flex items-center justify-between border-[0.08rem] border-solid border-primary p-[10px] py-2"
          >
            <p>
              <span className="uppercase font-medium text-sm mr-1 tracking-wide">
                Cart
              </span>
              <span className="uppercase font-medium text-sm">
                {totalCartQuantity}
              </span>
            </p>
            <PiHandbagLight className="h-5 w-5 right-3 top-0" />
          </Link>
        </div>

        <ul className="px-[10px] mt-4 text-sm">
          <li className="border-b border-primary border-solid py-3 px-[10px]">
            <Link
              href="/collections/all"
              onClick={onCloseModal}
              className="tracking-wider"
            >
              New Arrivals
            </Link>
          </li>
          <ListDropdown
            text="Men"
            onCloseModal={onCloseModal!}
            dropDown={[
              { text: "All", path: "/collections/all" },
              { text: "Bags", path: "/collections/all" },
              { text: "Accessories", path: "/collections/all" },
            ]}
          />
          <ListDropdown
            text="Women"
            onCloseModal={onCloseModal!}
            dropDown={[
              { text: "All", path: "/collections/all" },
              { text: "Bags", path: "/collections/all" },
              { text: "Accessories", path: "/collections/all" },
            ]}
          />
          <ListDropdown
            text="Collections"
            onCloseModal={onCloseModal!}
            dropDown={[
              { text: "All", path: "/collections/all" },
              { text: "Hoodies", path: "/collections/all" },
              { text: "Jackets", path: "/collections/all" },
            ]}
          />
          {!user && (
            <li className="flex items-center gap-4 border-b border-primary border-solid py-3 px-[10px]">
              <BiUser className="w-[19px] h-[19px] text-primary" />
              <Link
                href="/login"
                onClick={onCloseModal}
                className="tracking-wider"
              >
                Log In/Create Account
              </Link>
            </li>
          )}
          {user && (
            <li className="flex items-center gap-4 border-b border-primary border-solid py-3 px-[10px]">
              <Link
                href="/account"
                onClick={onCloseModal}
                className="flex items-center gap-3"
              >
                <BiUser className="w-[19px] h-[19px] text-primary" />
                <span className="tracking-wider">Account</span>
              </Link>
              <button
                className="flex items-center gap-3"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <TbLogout className="w-[19px] h-[19px] text-primary" />
                <span className="tracking-wider">Logout</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="flex justify-center items-center gap-[10px] py-9">
        <Link href="" className="inline-block">
          <SiYoutube className="w-[22px] h-[22px] text-primary" />
        </Link>
        <Link href="" className="inline-block">
          <LiaInstagram className="w-[22px] h-[22px] text-primary" />
        </Link>
      </div>
    </>
  );
}
