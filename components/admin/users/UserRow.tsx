"use client";

import { useState, useTransition } from "react";
import { User } from "@prisma/client";
import Tag from "@/components/admin/ui/Tag";
import ModalContainer from "@/components/ui/ModalContainer";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { HiEllipsisVertical, HiTrash } from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import ConfirmDelete from "../ui/ConfirmDelete";
import { deleteUser, removeApplicationUser } from "@/actions/user";
import toast from "react-hot-toast";

export default function UserRow({ user }: { user: User }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOptionsToggle = () => {
    setOptionsOpen((state) => !state);
  };

  const ref = useOutsideClick(handleOptionsToggle, false);

  const handleRemoveUser = async () => {
    startTransition(() => {
      removeApplicationUser(user.id)
        .then((data) => {
          if (data?.success) {
            toast.success(data.success, {
              position: "top-center",
            });
          }

          if (data?.error) {
            toast.error(data.error, {
              position: "top-center",
            });
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleDeleteUser = async () => {
    startTransition(() => {
      deleteUser(user.id)
        .then((data) => {
          if (data?.success) {
            toast.success(data.success, {
              position: "top-center",
            });
          }

          if (data?.error) {
            toast.error(data.error, {
              position: "top-center",
            });
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div
      className="grid grid-cols-[2fr_2fr_0.6fr_0.7fr_1fr_0.5fr] gap-6 items-center py-5 px-6 border-b border-solid border-gray-100 last:border-b-0"
      role="row"
    >
      <p>{user.name}</p>
      <p>{user.email}</p>
      <div>-</div>
      <Tag role={user.role}>{user.role}</Tag>
      <p>06 Dec 2023</p>
      {user.role !== "ADMIN" && (
        <ModalContainer>
          <div className="relative flex items-center justify-end">
            <button
              className="bg-none border-none p-1 rounded-md transition-all duration-200 hover:bg-gray-100"
              onClick={handleOptionsToggle}
            >
              <HiEllipsisVertical className="w-6 h-6 text-gray-700" />
            </button>
            {optionsOpen && (
              <ul
                ref={ref}
                className="absolute border border-solid border-gray-100 w-fit z-10 right-8 top-3 bg-white shadow-md rounded-lg"
              >
                <li>
                  <ModalContainer.Open opens="remove-access">
                    <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                      <HiOutlineLogout className="w-5 h-5 text-gray-400 transition-all duration-300" />
                      <span className="whitespace-nowrap">Remove access</span>
                    </button>
                  </ModalContainer.Open>
                </li>
                <li>
                  <ModalContainer.Open opens="delete-user">
                    <button className="text-left w-full bg-none border-none py-[10px] px-5 text-sm transition-all duration-200 flex items-center gap-4 hover:bg-gray-50">
                      <HiTrash className="w-4 h-4 text-gray-400 transition-all duration-300" />
                      <span className="whitespace-nowrap">Delete</span>
                    </button>
                  </ModalContainer.Open>
                </li>
              </ul>
            )}

            <ModalContainer.Window name="remove-access">
              <ConfirmDelete
                type={"remove"}
                onConfirm={handleRemoveUser}
                resourceName="user"
                disabled={isPending}
              />
            </ModalContainer.Window>
            <ModalContainer.Window name="delete-user">
              <ConfirmDelete
                type="delete"
                onConfirm={handleDeleteUser}
                resourceName="user"
                disabled={isPending}
              />
            </ModalContainer.Window>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
