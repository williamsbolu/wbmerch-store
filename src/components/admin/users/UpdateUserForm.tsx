"use client";

import { useState, useTransition } from "react";
import Button from "@/components/admin/ui/Button";
import { useSession } from "next-auth/react";
import { updateAdminInformation } from "@/actions/user";
import toast from "react-hot-toast";

export default function UpdateUserForm() {
  const { data, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState<string | null | undefined>(
    data?.user.name
  );
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName) return;

    const form = new FormData();
    form.append("name", fullName);
    if (avatar) {
      form.append("image", avatar);
    }

    startTransition(() => {
      updateAdminInformation(form)
        .then((data) => {
          if (data?.success) {
            toast.success(data.success, {
              position: "top-center",
            });
            update();
          }

          if (data?.error) {
            toast.error(data.error, {
              position: "top-center",
            });
          }
        })
        .catch(() =>
          toast.error("Something went wrong", {
            position: "top-center",
          })
        );
    });
  };

  function handleCancel() {
    setFullName(data?.user.name);
    setAvatar(null);
  }

  const inputStyles =
    "border border-solid border-gray-300 bg-white rounded-[5px] shadow-sm py-2 px-3 focus:outline-2 outline-indigo-600 disabled:bg-gray-200";

  return (
    <form
      onSubmit={handleSubmit}
      className="py-6 px-10 bg-white border border-gray-200 rounded-lg text-sm"
    >
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center pb-3 border-b border-solid border-gray-100">
        <label htmlFor="email" className="font-medium">
          Email address
        </label>
        <input
          type="email"
          id="email"
          className={inputStyles}
          value={data?.user.email || ""}
          disabled
        />
      </div>
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center py-3 border-b border-solid border-gray-100">
        <label htmlFor="name" className="font-medium">
          Full name
        </label>
        <input
          type="text"
          id="name"
          className={inputStyles}
          disabled={isPending}
          defaultValue={fullName || ""}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center py-3 border-b border-solid border-gray-100">
        <label htmlFor="avatar" className="font-medium">
          Avatar image
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="block w-full text-sm text-gray-700 rounded-[5px] file:mr-4 file:py-2 file:px-3 file:cursor-pointer file:rounded-[5px] file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 file:transition-all file:duration-200 hover:file:bg-indigo-100"
          disabled={isPending}
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
      </div>
      <div className="flex gap-3 pt-3 justify-end">
        <button
          type="reset"
          onClick={handleCancel}
          className="rounded-[5px] shadow-sm text-sm py-3 px-4 font-medium text-gray-600 bg-white border border-solid border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>
        <Button disabled={isPending}>Update account</Button>
      </div>
    </form>
  );
}
