import { Size } from "@prisma/client";

export type Sizes = {
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
  xxxl: number;
};

export type ProductDetailtypes = {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  images?: string[];
  description?: string;
  sizes: Sizes;
  stock: number;
  slug: string;
};

export type AddressType = {
  country: string;
  isDefault: boolean;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  postalCode: string;
  phone: string;
  optional?: string | undefined;
};

export type BillingAddressType = {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  postalCode: string;
  phone: string;
  optional?: string | undefined;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  size: Size | null;
  quantity: number;
  product: {
    name: string;
    sizes: {
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
      xxxl: number;
    } | null;
    coverImage: string;
    price: number;
    stock: number | null;
    slug: string;
  };
};

export interface ProductFormData {
  name: string;
  category: string;
  gender: string;
  collection: string;
  price: number;
  coverImage: FileList;
  images?: FileList;
  stock: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface FormattedProductData
  extends Omit<
    ProductFormData,
    "stock" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl"
  > {
  totalStock: number;
  stock?: number;
  sizes?: {
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
}
