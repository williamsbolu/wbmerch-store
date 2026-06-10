import { getUserWishlist } from "@/data/wishlist";
import { currentUser } from "@/lib/auth";
import Wishlist from "@/components/wishlist/Wishlist";
import { IoIosHeartEmpty } from "react-icons/io";

export default async function UsersWishlist({ page }: { page: number }) {
  const user = await currentUser();

  const { count, data } = await getUserWishlist({
    userId: user?.id!,
    page,
  });

  return (
    <>
      {data.length === 0 ? (
        <div className="flex flex-col gap-3 items-center py-24 md:pr-20">
          <IoIosHeartEmpty className="h-8 w-8 text-primary/80" />
          <p className="text-primary tracking-wide text-[15px] text-center">
            You haven&apos;t wishlisted any goods yet.
          </p>
        </div>
      ) : (
        <Wishlist count={count} data={data} />
      )}
    </>
  );
}
