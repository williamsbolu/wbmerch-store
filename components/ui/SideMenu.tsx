import Link from "next/link";
import { PiHandbagLight } from "react-icons/pi";
import { TfiClose } from "react-icons/tfi";
import ListDropdown from "./ListDropdown";
import { BiUser } from "react-icons/bi";
import { SiYoutube } from "react-icons/si";
import { LiaInstagram } from "react-icons/lia";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function SideMenu({
  onCloseModal,
}: {
  onCloseModal?: () => void;
}) {
  return (
    <>
      <div>
        <div className="px-[10px] py-4">
          <button onClick={onCloseModal} className="p-1">
            <TfiClose className="w-4 h-4 text-primary" />
          </button>
        </div>
        <div className="px-[10px] py-4">
          <Link
            href="/cart"
            className="flex items-center justify-between border-[0.08rem] border-solid border-primary p-[10px] py-2"
          >
            <p>
              <span className="uppercase font-medium text-sm mr-1">Cart</span>
              <span className="uppercase font-medium text-sm">0</span>
            </p>
            <PiHandbagLight className="h-5 w-5 right-3 top-0" />
          </Link>
        </div>

        <ul className="px-[10px] mt-4 text-sm">
          <li className="border-b border-primary border-solid py-3 px-[10px]">
            <Link href="/">New Arrivals</Link>
          </li>
          <ListDropdown
            text="Men"
            path="/collections/men"
            dropDown={[
              { text: "All", path: "/collections/men" },
              { text: "Bags", path: "/collections/bags" },
              { text: "Accessories", path: "/collections/accessories" },
            ]}
          />
          <ListDropdown
            text="Women"
            path="/collections/women"
            dropDown={[
              { text: "All", path: "/collections/women" },
              { text: "Bags", path: "/collections/bags" },
              { text: "Accessories", path: "/collections/accessories" },
            ]}
          />
          <ListDropdown
            text="Collections"
            path="#"
            dropDown={[
              { text: "All", path: "/collections/all" },
              { text: "Hoodies", path: "/collections/hoodies" },
              { text: "Jackets", path: "/collections/jackets" },
            ]}
          />
          <li className="flex items-center gap-4 border-b border-primary border-solid py-3 px-[10px]">
            <BiUser className="w-[19px] h-[19px] text-primary" />
            <Link href="/">Log In/Create Account</Link>
          </li>
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
