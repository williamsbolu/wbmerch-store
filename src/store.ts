import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/components/cart/cartSlice";
import wishlistReducer from "@/components/wishlist/wishlistSlice";
import addressReducer from "@/components/address/addressSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
  },
});

export default store;
