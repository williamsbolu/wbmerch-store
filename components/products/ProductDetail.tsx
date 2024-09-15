"use client";

import React, { useState, useTransition } from "react";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { TfiMinus } from "react-icons/tfi";
import { HiOutlinePlus } from "react-icons/hi";
import { ProductDetailtypes, Sizes } from "@/utils/types";
import { Session } from "next-auth";
import { useDispatch } from "react-redux";
import { addItem } from "../cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import { addOrUpdateCart } from "@/actions/cart";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProductDetail({
  productInfo: { id, name, coverImage, price, slug },
  session,
}: {
  productInfo: ProductDetailtypes;
  session: Session | null;
}) {
  const user = useCurrentUser();
  const [selectedSize, setSelectedSize] = useState<string | "">("xl");
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const router = useRouter();

  const addToCartHandler = () => {
    const sessionId = cookies.get("sessionId");

    startTransition(() => {
      addOrUpdateCart({
        sessionId,
        productId: id,
        quantity: 1,
        size: selectedSize,
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
              size: selectedSize,
              quantity: 1,
            })
          );
          router.push("/cart");

          // Note: this code is not important, it just for fighting against cases where the user manually messes with the sessionId cookie
          // if d user adds to cart when he is not loggedIn and there was no sessionId when the user added to cart, we set the new sessionId that was used on the server to create the cart
          if (!sessionId && !user?.id) {
            cookies.set("sessionId", data.sessionId!);
          }
        })
        .catch(() => toast.success("Failed to update cart!"));
    });
  };

  return (
    <div className="grid gap-4 content-start">
      <h1 className="text-3xl md:text-[40px] leading-snug">{name}</h1>

      <p className="text-lg tracking-widest">${price} USD</p>

      <div className="space-y-[7px]">
        <p className="text-[13px] text-[#121212BF]">Size</p>

        <select
          className="text-[#121212BF] border w-[248PX] border-primary rounded-[5px] text-[13px] px-4 h-11 focus:outline-none"
          defaultValue={"xl"}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
          <option value="xl">XL</option>
          <option value="xxl">2XL</option>
          <option value="xxxl">3XL</option>
        </select>
      </div>

      <div className="space-y-[7px]">
        <p className="text-[13px] text-[#121212BF]">Quantity</p>

        <div className="grid grid-cols-[45px_50px_45px] h-[47px] border-[1px] border-solid border-primary rounded-[5px] w-max">
          <button className="flex items-center justify-center">
            <TfiMinus className="w-3 h-auto" />
          </button>
          <span className="flex items-center justify-center font-normal text-sm">
            2
          </span>
          <button className="flex items-center justify-center">
            <HiOutlinePlus className="w-3 h-3 text-[#121212BF]" />
          </button>
        </div>
      </div>

      <div className="grid gap-[10px] mt-2">
        <Button
          type="button"
          variation="transparent"
          classes={["w-full lg:w-4/5 flex justify-center items-center"]}
          onClick={addToCartHandler}
          disabled={isPending}
        >
          Add to cart
        </Button>

        <Button type="button" variation="primary" classes={["w-full lg:w-4/5"]}>
          Buy it now
        </Button>
      </div>
    </div>
  );
}
