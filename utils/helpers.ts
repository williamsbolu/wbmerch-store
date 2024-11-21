import slugify from "slugify";
import { FormattedProductData, ProductFormData, Sizes } from "@/utils/types";
import { ProductSizes } from "@prisma/client";
import { nanoid } from "nanoid";

export function calculateStock(sizes: Sizes): number {
  return sizes.s + sizes.m + sizes.l + sizes.xl + sizes.xxl + sizes.xxxl;
}

export function generateSlug(name: string): string {
  return slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
}

// Can be used during checkout, but the returned value must be converted to a string based on what the payment platform needs
// export function formatCurrency(value: number, decimals: number = 2) {
//   return value.toFixed(decimals);
// }

// same as d one used below
// export function formatCurrency(value: number, decimals: number = 2) {
//   return value
//     .toFixed(decimals)
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

export function formatCurrency(value: number, decimals: number = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function getCurrencySymbol(currency: string) {
  const symbols: { [key: string]: string } = {
    CAD: "\u0024",
    EUR: "\u20ac",
    GHS: "\u20b5",
    NGN: "\u20a6",
    GBP: "\u00a3",
    USD: "\u0024",
  };

  return symbols[currency] || "";
}

export const convertAmountWithRate = (
  rate: number,
  amount: number,
  currency: string
) => {
  const convertedRate = amount * rate;

  const formattedValue = formatCurrency(
    convertedRate,
    currency === "NGN" ? 0 : 2
  );

  return formattedValue;
};

export const convertAmountToUsd = (rate: number, amount: number) => {
  const convertedRate = amount / rate;

  const formattedValue = formatCurrency(convertedRate, 2);

  return formattedValue;
};

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

export function generateOrderId() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomStr = nanoid(6); // Generate a random 6-character string
  return `ORD-${dateStr}-${randomStr}`;
}
