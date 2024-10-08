"use client";

import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed z-10 bottom-[30px] right-7 flex items-center gap-3 md:bottom-[30px] md:right-[30px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="bg-[#F5F7F9] px-3 py-2 rounded-md self-center">
          <p className="text-xs">Need Help? Chat with us</p>
        </div>
      )}
      <Link
        href=" https://wa.me/2347085072330?text=Hello%20Williams,%20pls%20i%20need%20your%20assistance%20on%20wb-merch%20website"
        className="bg-primary h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
      >
        <FaWhatsapp className="text-white h-[34px] w-[34px]" />
      </Link>
    </div>
  );
}
