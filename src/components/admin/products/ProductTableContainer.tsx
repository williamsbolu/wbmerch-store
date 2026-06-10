"use client";

import { useOptimistic } from "react";
import { products } from "@prisma/client";
import toast from "react-hot-toast";
import { deleteProduct } from "@/actions/products";
import ProductRow from "@/components/admin/products/ProductRow";

export default function ProductTableContainer({
  products,
}: {
  products: products[];
}) {
  const [optimisticProducts, optimisticDelete] = useOptimistic(
    products,
    (curProduct, productId) => {
      return curProduct.filter((product) => product.id !== productId);
    }
  );

  const handleDelete = (productId: string) => {
    optimisticDelete(productId);

    deleteProduct(productId)
      .then((data) => {
        if (data?.error) {
          toast.error(data.error, {
            position: "top-center",
          });
        }

        if (data?.success) {
          toast.success(data.success, {
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
  };

  if (optimisticProducts.length === 0) {
    return (
      <p className="text-base text-center m-6">No data to show at the moment</p>
    );
  }

  return (
    <section className="my-2">
      {optimisticProducts.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          onDelete={handleDelete}
        />
      ))}
    </section>
  );
}
