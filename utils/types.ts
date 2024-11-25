import {
  Category,
  PaymentMethod,
  ShippingMethod,
  Size,
  Status,
} from "@prisma/client";

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

export type OrderAddressType = {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  postalCode: string;
  phone: string;
  optional?: string | null;
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

export interface OrderData {
  contactEmail?: string;
  userId?: string;
  items: CartItem[];
  currency: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  shippingAddress: OrderAddressType;
  billingAddress: OrderAddressType;
  quantity: number;
  shippingFee: string;
  totalAmount: string;
  rateToUsd: number;
}

export interface OrderItem {
  productId: string;
  size: Size;
  quantity: number;
  product: {
    name: string;
    coverImage: string;
    price: number;
    stock: number;
    slug: string;
  };
}

export type OrderListType = {
  id: string;
  orderId: string;
  quantity: number;
  createdAt: Date;
  contactEmail: string | null;
  currency: string;
  status: Status;
  paymentMethod: PaymentMethod;
  totalAmount: string;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  user: {
    name: string | null;
    email: string | null;
  } | null;
};

export type OrderDetailType = {
  id: string;
  referenceId: string;
  transactionId?: string | null;
  orderId: string;
  contactEmail: string | null;
  userId: string | null;
  currency: string;
  status: Status;
  isPaid: boolean;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  quantity: number;
  shippingFee: string;
  totalAmount: string;
  rateToUsd: number;
  shippingAddress: OrderAddressType;
  billingAddress: OrderAddressType;
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
  } | null;
  items: {
    id: string;
    quantity: number;
    size: Size | null;
    price: number;
    product: {
      id: string;
      name: string;
      coverImage: string;
      category: Category;
    };
  }[];
  createdAt: Date;
  confirmedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  updatedAt: Date;
};

export type TodaysOrderProp = {
  id: string;
  orderId: string;
  totalAmount: string;
  currency: string;
  items: {
    product: {
      name: string;
      coverImage: string;
    };
  }[];
};
