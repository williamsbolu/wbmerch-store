"use client";

import { HiOutlineUser } from "react-icons/hi2";
import { SlMenu } from "react-icons/sl";

import UserAvatar from "@/components/admin/ui/UserAvatar";
import ButtonIcon from "@/components/admin/ui/ButtonIcon";
import LogoutButton from "@/components/admin/ui/LogoutButton";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header className="bg-white py-4 px-6 border-b border-gray-100 flex gap-6 items-center justify-end">
      <div className="mr-auto">
        <ButtonIcon type="button" onClick={onToggleSidebar}>
          <SlMenu className="w-5 h-5 text-indigo-600" />
        </ButtonIcon>
      </div>

      <UserAvatar />

      <ul className="flex items-center gap-1">
        <li>
          <ButtonIcon type="link" to="/admin/account">
            <HiOutlineUser className="w-[22px] h-[22px] text-indigo-600" />
          </ButtonIcon>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </header>
  );
}
