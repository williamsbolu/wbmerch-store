import slugify from "slugify";
import { FormattedProductData, ProductFormData, Sizes } from "@/utils/types";
import { ProductSizes } from "@prisma/client";

export function calculateStock(sizes: Sizes): number {
  return sizes.s + sizes.m + sizes.l + sizes.xl + sizes.xxl + sizes.xxxl;
}

export function generateSlug(name: string): string {
  return slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
}

// for formating the size text for better ui in the application
export function formatSizeText(sizeText: string) {
  if (sizeText === "xxl") {
    return "2XL";
  } else if (sizeText === "xxxl") {
    return "3XL";
  } else {
    return sizeText.toUpperCase();
  }
}

export function saveAddressToLocalStorage(key: string, data: any) {
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // 2 days

  const now = new Date().getTime();
  const expirationTime = now + twoDaysInMilliseconds;
  const storageData = {
    address: [data],
    expiration: expirationTime,
  };
  localStorage.setItem(key, JSON.stringify(storageData));
}

export function caculateProductStock(
  stock: number | null,
  sizes: ProductSizes | null
) {
  let stockCount: number;

  if (sizes) {
    stockCount = Object.values(sizes).reduce((sum, value) => sum + value, 0);
  } else {
    stockCount = stock!;
  }

  return stockCount;
}

export function formatProductData(
  data: ProductFormData,
  stockModel: "stock" | "sizes"
): FormattedProductData {
  const { stock, s, m, l, xl, xxl, xxxl, ...restData } = data;

  if (stockModel === "stock") {
    return {
      ...restData,
      stock: stock || 0,
      totalStock: stock || 0,
    };
  } else {
    const sizes = { s, m, l, xl, xxl, xxxl };
    const totalStock = Object.values(sizes).reduce(
      (sum, size) => sum + (size || 0),
      0
    );

    return {
      ...restData,
      sizes,
      totalStock,
    };
  }
}
