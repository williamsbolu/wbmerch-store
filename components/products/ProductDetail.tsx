"use client";

import React, { useState, useTransition } from "react";
import cookies from "js-cookie";
import toast from "react-hot-toast";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { products } from "@prisma/client";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { TfiMinus } from "react-icons/tfi";
import { HiOutlinePlus } from "react-icons/hi";
import { TfiClose } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { addItem, getExistingCartItem } from "../cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import { addOrUpdateCart } from "@/actions/cart";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  formatCurrency,
  formatSizeText,
  getCurrencySymbol,
} from "@/utils/helpers";
import { addToWishlist, removeFromWishlist } from "@/actions/wishlist";
import {
  addWishlist,
  getExistingWishlistItem,
  removeWishlist,
} from "@/components/wishlist/wishlistSlice";
import { useCurrency } from "@/context/CurrencyContext";

export default function ProductDetail({
  productInfo: { id, name, coverImage, sizes, stock, price, slug },
}: {
  productInfo: products;
}) {
  const { currency, convertPrice } = useCurrency();
  const user = useCurrentUser();
  const [selectedSize, setSelectedSize] = useState<string>("s");
  const [quantity, setQuantity] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const [isPendingWishlist, startWishlistTransition] = useTransition();
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [isAddingCart, setIsAddingCart] = useState<boolean>(false);
  const existingItem = useSelector(
    getExistingCartItem(id, sizes ? selectedSize : null)
  );
  const existingWishlist = useSelector(getExistingWishlistItem(id));
  const dispatch = useDispatch();
  const router = useRouter();

  // TODO:(3) implement code to caculate if a product is out of stock for both stock by "sizes" object and "stock"
  const totalQuantity = sizes
    ? Object.values(sizes).reduce((acc, val) => acc + val, 0)
    : stock;

  const addToCartHandler = (type: "cart" | "checkout") => {
    // TODO (1): get the total "product quantity" and then add it to the local cart, can either be from the stock or price
    const productQuantityInStock = sizes
      ? sizes[selectedSize as keyof typeof sizes]
      : stock;

    // TODO:(2) if the items exist and the quantity the user is adding for a particular size is larger than the units available for that size
    if (existingItem) {
      const totalNewCartQuantiity = existingItem.quantity + quantity;

      if (totalNewCartQuantiity > productQuantityInStock!) {
        toast.error("Not enough stock!");
        return;
      }
    }

    // TODO: check if the product quantity of that product is available before adding to the cart
    if (quantity > productQuantityInStock!) {
      toast.error("Not enough stock!");
      return;
    }

    const sessionId = cookies.get("sessionId");

    if (type === "cart") {
      setIsAddingCart(true);
    } else {
      setIsCheckingOut(true);
    }

    startTransition(() => {
      addOrUpdateCart({
        sessionId,
        productId: id,
        quantity: quantity,
        size: sizes ? selectedSize : null,
      })
        .then((data) => {
          dispatch(
            addItem({
              id: uuidv4(),
              productId: id,
              product: {
                name,
                coverImage,
                price,
                slug,
              },
              size: sizes ? selectedSize : null,
              productQuantityInStock,
              quantity,
            })
          );

          // Note: this code is not important, it just for fighting against cases where the user manually messes with the sessionId cookie
          // if d user adds to cart when he is not loggedIn and there was no sessionId when the user added to cart, we set the new sessionId that was used on the server to create the cart
          if (!sessionId && !user?.id) {
            cookies.set("sessionId", data.sessionId!);
          }

          if (type === "cart") {
            router.push("/cart");
          } else {
            router.push("/checkout");
          }
        })
        .catch(() => toast.error("Failed to update cart!"))
        .finally(() => {
          if (type === "cart") {
            setIsAddingCart(false);
          } else {
            setIsCheckingOut(false);
          }
        });
    });
  };

  const increaseQuantity = () => {
    setQuantity((prevQty) => prevQty + 1);
  };
  const decreaseQuantity = () => {
    if (quantity === 1) return;
    setQuantity((prevQty) => prevQty - 1);
  };

  const addToWishlistHandler = async () => {
    // Only Authenticated users can save items or interact with wishlist data
    if (!user) {
      toast("You need to be logged in to save an Item", {
        icon: "🚫",
        position: "bottom-left",
        style: {
          borderRadius: "5px",
          color: "#121212",
          fontSize: "14px",
          padding: "10px 15px",
          borderColor: "#121212",
        },
        duration: 4000,
      });

      router.push("/login");
      return;
    }

    if (existingWishlist) {
      console.log({ existingWishlist });

      startWishlistTransition(() => {
        removeFromWishlist(existingWishlist.id)
          .then(() => {
            console.log("Widhlist deleted");

            dispatch(removeWishlist(existingWishlist.id));
          })
          .catch((err) => {
            toast.error("Something went wrong!");
          });
      });
    } else {
      startWishlistTransition(() =>
        addToWishlist(id)
          .then((data) => {
            dispatch(
              addWishlist({
                id: data.id,
                productId: data.productId,
                product: data.product,
              })
            );
          })
          .catch((err) => {
            toast.error("Something went wrong!");
          })
      );
    }
  };

  const convertedPrice = convertPrice(price);

  return (
    <div className="grid gap-4 content-start">
      <div className="flex">
        <h1 className="text-3xl md:text-[40px] leading-snug w-11/12 mr-auto">
          {name}
        </h1>
        <button
          onClick={addToWishlistHandler}
          className="group self-start mt-3 disabled:cursor-not-allowed"
          disabled={isPendingWishlist}
        >
          {existingWishlist ? (
            <IoIosHeart className="w-7 h-7 text-red-500 group-hover:text-red-500" />
          ) : (
            <IoIosHeartEmpty className="w-7 h-7 group-hover:text-red-500" />
          )}
        </button>
      </div>

      <p className="text-lg tracking-widest">
        {getCurrencySymbol(currency)}
        {formatCurrency(convertedPrice, currency === "NGN" ? 0 : 2)} {currency}
      </p>

      {sizes && (
        <div className="space-y-[7px]">
          <p className="text-[13px] text-[#121212BF]">Size</p>

          <select
            className="bg-white text-[#121212BF] border w-[248PX] border-primary rounded-[5px] text-[13px] px-4 h-11 focus:outline-none"
            defaultValue={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {Object.entries(sizes!).map(([size, quantity]) => (
              <option key={size} value={size} disabled={quantity === 0}>
                {formatSizeText(size)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-[7px]">
        <p className="text-[13px] text-[#121212BF]">Quantity</p>

        <div className="grid grid-cols-[45px_50px_45px] h-[47px] border-[1px] border-solid border-primary rounded-[5px] w-max">
          <button
            className="flex items-center justify-center"
            onClick={decreaseQuantity}
          >
            <TfiMinus className="w-3 h-auto" />
          </button>
          <span className="flex items-center justify-center font-normal text-sm">
            {quantity}
          </span>
          <button
            className="flex items-center justify-center"
            onClick={increaseQuantity}
          >
            <HiOutlinePlus className="w-3 h-3 text-[#121212BF]" />
          </button>
        </div>
      </div>

      <div className="grid gap-[10px] mt-2">
        <Button
          type="button"
          variation="transparent"
          classes={["w-full lg:w-4/5 flex justify-center items-center"]}
          onClick={() => addToCartHandler("cart")}
          disabled={isPending && isAddingCart}
        >
          {totalQuantity === 0 ? "Out of Stock" : "Add to cart"}
        </Button>

        {totalQuantity !== 0 && (
          <Button
            type="button"
            variation="primary"
            classes={["w-full lg:w-4/5 flex justify-center items-center"]}
            onClick={() => addToCartHandler("checkout")}
            disabled={isPending && isCheckingOut}
          >
            Buy it now
          </Button>
        )}
      </div>
    </div>
  );
}
