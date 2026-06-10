"use client";

import { useOptimistic } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import WishlistItem from "@/components/wishlist/WishlistItem";
import Pagination from "../ui/Pagination";
import { removeFromWishlist } from "@/actions/wishlist";
import { removeWishlist } from "@/components/wishlist/wishlistSlice";

type Product = {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  slug: string;
};

type wishlistDataProps = {
  id: string;
  userId: string;
  productId: string;
  product: Product;
};

type wishlistProps = {
  count: number;
  data: wishlistDataProps[];
};

export default function Wishlist({ count, data: wishlistData }: wishlistProps) {
  const [optimisticWishlists, optimisticDelete] = useOptimistic(
    wishlistData,
    (curWishlist, wishlistId) => {
      return curWishlist.filter((item) => item.id !== wishlistId);
    }
  );
  const dispatch = useDispatch();

  const handleDelete = async (wishlistId: string) => {
    optimisticDelete(wishlistId);

    try {
      await removeFromWishlist(wishlistId);

      dispatch(removeWishlist(wishlistId));
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="grid gap-5">
      <ul className="grid gap-4">
        {optimisticWishlists.map((item) => (
          <WishlistItem
            key={item.id}
            id={item.id}
            product={item.product}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      <Pagination count={count} size={6} />
    </div>
  );
}
