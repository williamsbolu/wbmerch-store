"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Session } from "next-auth";
import logo from "@/public/logo.png";
import { useDispatch } from "react-redux";
import { replaceAddress } from "@/components/address/addressSlice";

export default function CheckoutHeader({ session }: { session: Session }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session?.user) {
      const checkoutAddressString = localStorage.getItem("checkout_address");

      if (!checkoutAddressString) return;

      const storedAddress = JSON.parse(checkoutAddressString);

      if (!storedAddress || storedAddress.address.length === 0) {
        return;
      }

      const now = new Date().getTime();

      if (now > storedAddress.expiration) {
        // Data has expired, remove it from local storage
        localStorage.removeItem("checkout_address");
        return;
      }

      dispatch(replaceAddress(storedAddress.address));
    }
  }, [session, dispatch]);

  return (
    <header className="py-5 border-b border-solid border-gray-300 shadow-sm">
      <div className="max-w-xl px-4 mx-auto flex items-center lg:max-w-[1100px]">
        <Link href="/" className="mr-auto">
          <Image src={logo} width={60} alt="wb-merch logo" />
        </Link>
        <Link href="/cart">
          <HiOutlineShoppingBag className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
