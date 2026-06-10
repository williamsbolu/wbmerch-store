import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  name: string;
  coverImage: string;
  price: number;
  slug: string;
}

interface Wishlist {
  id: string;
  productId: string;
  product: Product;
}

interface WishlistState {
  items: Wishlist[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<Wishlist[]>) => {
      state.items = action.payload;
    },
    addWishlist: (state, action: PayloadAction<Wishlist>) => {
      state.items.push(action.payload);
    },
    removeWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      state.items = state.items.filter((item) => item.id !== id);
    },
  },
});

export const { addWishlist, removeWishlist, setWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

export function getExistingWishlistItem(id: string) {
  return (state: any) =>
    state.wishlist.items.find((item: Wishlist) => item.productId === id);
}
