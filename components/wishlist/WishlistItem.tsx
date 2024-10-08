"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiDeleteBinLine } from "react-icons/ri";
import ButtonSpinner from "../ui/ButtonSpinner";
import Modal from "@/components/ui/ModalContainer";
import ConfirmDelete from "@/components/ui/ConfirmDelete";

type Product = {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  slug: string;
};

type WishlistItemProps = {
  id: string;
  product: Product;
  onDelete: (id: string) => void;
};

export default function WishlistItem({
  id,
  product,
  onDelete,
}: WishlistItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => onDelete(id));
  }

  return (
    <li className="relative group flex gap-4 border border-solid border-gray-300 p-4 pr-9 rounded-md shadow-sm md:pr-4">
      <div className="flex gap-4 mr-auto">
        <Link
          href={`/products/${product.slug}`}
          className="block rounded-md overflow-hidden"
        >
          <Image
            src={product.coverImage}
            height={104}
            width={104}
            alt={product.name}
          />
        </Link>

        <div className="flex flex-col gap-3 py-2 md:justify-between md:gap-0">
          <Link
            href={`/products/${product.slug}`}
            className="text-sm tracking-wider font-normal pb-[1px] group-hover:underline group-hover:underline-offset-1"
          >
            {product.name}
          </Link>
          <p className="text-[15px] tracking-wider">${product.price} USD</p>
        </div>
      </div>

      <div className="absolute right-0 flex flex-col md:static md:justify-end md:self-stretch">
        <Modal>
          <Modal.Open opens="delete-modal">
            <button className="text-red-500 flex gap-2 items-center py-[5px] px-2 rounded-[3px] hover:bg-red-100 transition-all duration-150">
              {isPending ? (
                <ButtonSpinner type="small" variation="primary" />
              ) : (
                <RiDeleteBinLine className="w-5 h-5" />
              )}
              <span className="hidden uppercase text-[13px] font-medium md:block">
                Remove
              </span>
            </button>
          </Modal.Open>
          <Modal.Window name="delete-modal">
            <ConfirmDelete
              disabled={isPending}
              onConfirm={handleDelete}
              resourceName="wishlist"
            />
          </Modal.Window>
        </Modal>
      </div>
    </li>
  );
}
