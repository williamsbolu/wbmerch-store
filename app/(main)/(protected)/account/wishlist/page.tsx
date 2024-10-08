import { Suspense } from "react";
import UsersWishlist from "@/components/wishlist/UsersWishlist";
import WishlistSpinner from "@/components/ui/AccountPageSpinner";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = !searchParams?.page ? 1 : Number(searchParams.page);

  return (
    <div className="py-4 grid gap-4">
      <h1 className="text-lg tracking-wider text-center md:text-start">
        My Wishlist
      </h1>

      <Suspense fallback={<WishlistSpinner />}>
        <UsersWishlist page={page} />
      </Suspense>
    </div>
  );
}
