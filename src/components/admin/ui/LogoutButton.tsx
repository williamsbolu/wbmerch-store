"use client";

import { signOut } from "next-auth/react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";

export default function LogoutButton() {
  return (
    <ButtonIcon type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      <HiArrowRightOnRectangle className="w-[22px] h-[22px] text-indigo-600" />
    </ButtonIcon>
  );
}
