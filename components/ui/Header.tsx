"use client";

import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";
import logo from "@/public/logo.png";
import { RxDashboard } from "react-icons/rx";
import { SlBag } from "react-icons/sl";
import { TbLogout } from "react-icons/tb";
import { signOut } from "next-auth/react";
import { TfiSearch } from "react-icons/tfi";
import { PiHandbagLight, PiHeart, PiMapPin, PiUserList } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import SearchBar from "./SearchBar";
import SideMenu from "./SideMenu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getOrCreateCart } from "@/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { getTotalCartQuantity, replaceCart } from "../cart/cartSlice";

export default function Header() {
  const [isSticky, setIsSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const user = useCurrentUser();
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 90) {
        setIsSticky(false);
      } else if (currentScrollY < lastScrollY) {
        setIsSticky(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    console.log;
    let sessionId = cookies.get("sessionId");

    getOrCreateCart(user?.id, sessionId)
      .then((data) => {
        if (user?.id) {
          if (sessionId) {
            cookies.remove("sessionId");
          }
        } else {
          if (!sessionId) {
            cookies.set("sessionId", data.sessionId!);
          }
        }
        dispatch(replaceCart(data.cartItems));
      })
      .catch(() => {
        return;
      });
  }, [user, dispatch]);

  return (
    <header
      className={`fixed top-0 left-0 h-[90px] w-full bg-white transition-transform duration-200 z-20 ${
        isSticky ? "translate-y-0" : "-translate-y-[90px]"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-full md:px-6">
        <div className="flex items-center gap-4">
          <Modal>
            <Modal.Open opens="menu">
              <button className="md:hidden">
                <IoIosMenu className="h-8 w-8 text-primary" />
              </button>
            </Modal.Open>
            <Modal.Window type="menu" name="menu">
              <SideMenu />
            </Modal.Window>
          </Modal>
          <Modal>
            <Modal.Open opens="search-bar">
              <button>
                <TfiSearch className="h-[18px] w-[18px] md:h-5 md:w-5" />
              </button>
            </Modal.Open>
            <Modal.Window type="search-bar" name="search-bar">
              <SearchBar />
            </Modal.Window>
          </Modal>
          <div className="w-24 hidden md:block">&nbsp;</div>
        </div>

        <Link href="/">
          <Image src={logo} width={70} alt="wb-logo" />
        </Link>

        <nav className="flex items-center gap-6">
          <button>
            <CiHeart className="h-[26px] w-[26px] text-primary" />
          </button>
          <li className="group relative list-none flex">
            <button className="">
              <CiUser className="h-[26px] w-[26px] text-primary" />
            </button>
            {!user && (
              <div className="absolute top-8 -right-14 w-60 bg-white z-30 rounded-2xl shadow-lg border border-[#1212121c] transition-all duration-200 opacity-0 -translate-y-3 invisible group-hover:visible group-hover:opacity-100 group-hover:-translate-y-0">
                <div className=" border-b border-[#1212121c]">
                  <h2 className="text-lg py-3 px-4 tracking-wide">Welcome</h2>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4">
                  <Link
                    href="/login"
                    className="flex justify-center text-white bg-primary rounded-[5px] py-2 text-[15px]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex justify-center text-primary rounded-[5px] border border-primary py-2 text-[15px]"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
            {user && (
              <div className="absolute top-8 -right-14 w-60 bg-white z-30 rounded-2xl shadow-lg border border-[#1212121c] transition-all duration-200 opacity-0 -translate-y-3 invisible group-hover:visible group-hover:opacity-100 group-hover:-translate-y-0">
                <div className=" border-b border-[#1212121c]">
                  <h2 className="text-lg pt-4 pb-3 px-4 tracking- capitalize">
                    Welcome, {user.name?.split(" ")[0]}
                  </h2>
                </div>

                <ul className="grid grid-cols-1 text-sm">
                  <li>
                    <Link
                      href="/account"
                      className={`group/link flex items-center py-3 gap-4 hover:bg-primary hover:text-white pl-5`}
                    >
                      <RxDashboard className="h-5 w-5 text-primary group-hover/link:text-white" />
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/information"
                      className={`group/link flex items-center py-3 gap-4 hover:bg-primary hover:text-white pl-5`}
                    >
                      <PiUserList className="h-5 w-5 text-primary group-hover/link:text-white" />
                      Personal Info
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className={`group/link flex items-center py-3 gap-4 hover:bg-primary hover:text-white pl-5`}
                    >
                      <SlBag className="h-4 w-5 text-primary group-hover/link:text-white" />
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/address"
                      className={`group/link flex items-center py-3 gap-4 hover:bg-primary hover:text-white pl-5`}
                    >
                      <PiMapPin className="h-5 w-5 text-primary group-hover/link:text-white" />
                      My Address
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/favorite"
                      className={`group/link flex items-center py-3 gap-4 hover:bg-primary hover:text-white pl-5`}
                    >
                      <PiHeart className="h-5 w-5 text-primary group-hover/link:text-white" />
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className={`group/link w-full flex items-center py-3 gap-4 hover:bg-primary hover:text-white pl-5 rounded-b-2xl`}
                    >
                      <TbLogout className="h-5 w-5 text-primary group-hover/link:text-white" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <Link href="/cart" className="relative">
            <PiHandbagLight className="h-7 w-7" />
            <span className="bg-primary absolute w-5 h-5 text-white text-xs rounded-full -bottom-1 -right-1 flex items-center justify-center">
              {totalCartQuantity}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
