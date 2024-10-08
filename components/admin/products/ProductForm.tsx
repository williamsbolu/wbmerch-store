"use client";

import { Poppins } from "next/font/google";
import { products } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/admin/ui/Button";
import { ProductFormData } from "@/utils/types";
import { formatProductData } from "@/utils/helpers";
import { createProduct, updateProduct } from "@/actions/products";
import toast from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function ProductForm({
  onCloseModal,
  productToEdit,
}: {
  productToEdit?: products;
  onCloseModal?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const stockModalState = productToEdit?.sizes ? "sizes" : "stock";
  const isEditSession = Boolean(productToEdit?.id);
  const [stockModel, setStockModel] = useState<"stock" | "sizes">(
    isEditSession ? stockModalState : "stock"
  );

  const { register, handleSubmit, formState } = useForm<ProductFormData>({
    defaultValues: {
      name: productToEdit?.name || "",
      category: productToEdit?.category || "",
      gender: productToEdit?.gender || "",
      collection: productToEdit?.collection || "",
      price: productToEdit?.price || 0,
      stock: productToEdit?.stock || 0,
      s: productToEdit?.sizes?.s || 0,
      m: productToEdit?.sizes?.m || 0,
      l: productToEdit?.sizes?.l || 0,
      xl: productToEdit?.sizes?.xl || 0,
      xxl: productToEdit?.sizes?.xxl || 0,
      xxxl: productToEdit?.sizes?.xxxl || 0,
    },
  });

  const { errors } = formState;

  function onSubmit(data: ProductFormData) {
    const newData = formatProductData(data, stockModel);

    const formData = new FormData();
    Object.entries(newData).forEach(([key, value]) => {
      if (key === "coverImage") {
        // incase we're performing an edit operation: the coverImage might not be present
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (key === "images") {
        Array.from(value).forEach((file: any) => {
          formData.append("images", file);
        });
      } else if (key === "sizes") {
        formData.append("sizes", JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    if (!isEditSession) {
      startTransition(() => {
        createProduct(formData)
          .then((data) => {
            if (data?.success) {
              onCloseModal?.();
              toast.success("Product created", {
                position: "top-center",
              });
            }

            // This is for operational errors.. errors created mannually by my code logic: eg authorization error
            if (data?.error) {
              toast.error(data.error, {
                position: "top-center",
              });
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error("Something went wrong", {
              position: "top-center",
            });
          });
      });
    } else {
      startTransition(() => {
        updateProduct(formData, productToEdit?.id!)
          .then((data) => {
            if (data?.success) {
              onCloseModal?.();
              toast.success("Product updated", {
                position: "top-center",
              });
            }

            if (data?.error) {
              toast.error(data.error, {
                position: "top-center",
              });
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error("Something went wrong", {
              position: "top-center",
            });
          });
      });
    }
  }

  const inputStyles =
    "border border-solid border-gray-300 bg-white rounded-[5px] shadow-sm py-2 px-3 focus:outline-2 outline-indigo-600 disabled:bg-gray-200";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${poppins.className} overflow-y-auto text-gray-700 w-[880px] h-[90vh] overflow-auto text-sm py-8 px-10 grid gap-5`}
    >
      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="name" className="font-medium">
          Product name
        </label>
        <input
          type="text"
          id="name"
          className={inputStyles}
          {...register("name", {
            required: "This field is required",
            min: {
              value: 5,
              message: "Name should be at least 5 characters",
            },
          })}
          disabled={isPending}
        />
        {errors.name?.message && (
          <span className="text-sm text-red-700">{errors.name.message}</span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="category" className="font-medium">
          Category
        </label>
        <select
          id="category"
          defaultValue=""
          className={inputStyles}
          {...register("category", {
            required: "This field is required",
            minLength: 3,
          })}
          disabled={isPending}
        >
          <option value="" disabled>
            Select a category...
          </option>
          <option value="shirts">Shirt</option>
          <option value="t_shirts">T-shirt</option>
          <option value="hoodies">Hoodies</option>
          <option value="joggers">Joggers</option>
          <option value="underwears">Underwears</option>
          <option value="jackets">Jackets</option>
          <option value="sweatshirts">Sweatshirts</option>
          <option value="polo_shirts">Polo shirts</option>
          <option value="shorts">shorts</option>
          <option value="pants">Pants</option>
          <option value="bags">Bags</option>
          <option value="phone_cases">Phone cases</option>
          <option value="caps">Caps</option>
          <option value="hats">Hats</option>
        </select>
        {errors.category?.message && (
          <span className="text-sm text-red-700">
            {errors.category.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="gender" className="font-medium">
          Gender
        </label>
        <select
          id="gender"
          defaultValue=""
          className={inputStyles}
          {...register("gender", {
            minLength: 2,
          })}
          disabled={isPending}
        >
          <option value="" disabled>
            Select gender...
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender?.message && (
          <span className="text-sm text-red-700">{errors.gender.message}</span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="collection" className="font-medium">
          Collection
        </label>
        <select
          id="collection"
          defaultValue=""
          className={inputStyles}
          {...register("collection", {
            minLength: 2,
          })}
          disabled={isPending}
        >
          <option value="" disabled>
            Select a collection...
          </option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
          <option value="kids">Kids</option>
        </select>
        {errors.collection?.message && (
          <span className="text-sm text-red-700">
            {errors.collection.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="price" className="font-medium">
          Price
        </label>

        <input
          type="number"
          id="price"
          defaultValue={0}
          className={inputStyles}
          {...register("price", {
            required: "This field is required",
            min: { value: 0, message: "Price must be non-negative" },
          })}
          disabled={isPending}
        />

        {errors.price?.message && (
          <span className="text-sm text-red-700">{errors.price.message}</span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="coverImage" className="font-medium">
          Cover photo
        </label>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          className="block w-full text-sm text-gray-700 rounded-[5px] file:mr-4 file:py-2 file:px-3 file:cursor-pointer file:rounded-[5px] file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 file:transition-all file:duration-200 hover:file:bg-indigo-100"
          {...register("coverImage", {
            required: isEditSession ? false : "This field is required",
          })}
          disabled={isPending}
        />
        {errors.coverImage?.message && (
          <span className="text-sm text-red-700">
            {errors.coverImage.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="images" className="font-medium">
          Other images (up to 6)
        </label>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-700 rounded-[5px] file:mr-4 file:py-2 file:px-3 file:cursor-pointer file:rounded-[5px] file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 file:transition-all file:duration-200 hover:file:bg-indigo-100"
          {...register("images", {
            validate: (value: FileList | undefined) => {
              return (
                !value ||
                value.length <= 6 ||
                "You can only select up to 6 images."
              );
            },
          })}
          disabled={isPending}
        />
        {/* {error && <span className="text-sm text-red-700">{error}</span>} */}
        {errors.images?.message && (
          <span className="text-sm text-red-700">{errors.images.message}</span>
        )}
      </div>

      <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
        <label htmlFor="" className="font-medium">
          {!isEditSession
            ? "Select model for storing product stock"
            : "Edit product sizes stock:"}
        </label>

        {!isEditSession && (
          <select
            id="collection"
            className={inputStyles}
            onChange={(e) => setStockModel(e.target.value as "sizes" | "stock")}
            disabled={isPending}
          >
            <option value="stock">Total stock</option>
            <option value="sizes">Sizes</option>
          </select>
        )}
      </div>

      {stockModel === "stock" && (
        <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
          <label htmlFor="stock" className="font-medium">
            Stock
          </label>

          <input
            type="number"
            id="stock"
            defaultValue={0}
            className={inputStyles}
            {...register("stock", {
              required: "This field is required",
              min: { value: 0, message: "Stock must be non-negative" },
            })}
            disabled={isPending}
          />

          {errors.stock?.message && (
            <span className="text-sm text-red-700">{errors.stock.message}</span>
          )}
        </div>
      )}
      {stockModel === "sizes" && (
        <>
          <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
            <label htmlFor="small" className="font-medium">
              S
            </label>

            <input
              type="number"
              id="small"
              defaultValue={0}
              className={inputStyles}
              {...register("s", {
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.s?.message && (
              <span className="text-sm text-red-700">{errors.s.message}</span>
            )}
          </div>
          <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
            <label htmlFor="medium" className="font-medium">
              M
            </label>

            <input
              type="number"
              id="medium"
              defaultValue={0}
              className={inputStyles}
              {...register("m", {
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.m?.message && (
              <span className="text-sm text-red-700">{errors.m.message}</span>
            )}
          </div>
          <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
            <label htmlFor="large" className="font-medium">
              L
            </label>

            <input
              type="number"
              id="large"
              defaultValue={0}
              className={inputStyles}
              {...register("l", {
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.l?.message && (
              <span className="text-sm text-red-700">{errors.l.message}</span>
            )}
          </div>
          <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
            <label htmlFor="extra-large" className="font-medium">
              XL
            </label>

            <input
              type="number"
              id="extra-large"
              defaultValue={0}
              className={inputStyles}
              {...register("xl", {
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.xl?.message && (
              <span className="text-sm text-red-700">{errors.xl.message}</span>
            )}
          </div>
          <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
            <label htmlFor="extra-large-2" className="font-medium">
              2XL
            </label>

            <input
              type="number"
              id="extra-large-2"
              defaultValue={0}
              className={inputStyles}
              {...register("xxl", {
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.xxl?.message && (
              <span className="text-sm text-red-700">{errors.xxl.message}</span>
            )}
          </div>
          <div className="grid grid-cols-[240px_1fr_1.2fr] gap-6 items-center">
            <label htmlFor="extra-large-3" className="font-medium">
              3XL
            </label>

            <input
              type="number"
              id="extra-large-3"
              defaultValue={0}
              className={inputStyles}
              {...register("xxxl", {
                required: "This field is required",
                min: { value: 0, message: "Value must be non-negative" },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.xxxl?.message && (
              <span className="text-sm text-red-700">
                {errors.xxxl.message}
              </span>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button variation="secondary" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isPending}>
          {!isEditSession ? " Create product" : "Edit product"}
        </Button>
      </div>
    </form>
  );
}
