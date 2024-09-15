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
