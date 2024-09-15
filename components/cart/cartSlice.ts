import { products } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export interface cartItemObject {
  id: string;
  productId: string;
  product: products;
  size: string;
  quantity: number;
}

interface CartState {
  items: cartItemObject[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    replaceCart(state, action) {
      const products = action.payload;

      state.items = action.payload;
      state.totalQuantity = products.reduce(
        (acc: number, curValue: cartItemObject) => acc + curValue.quantity,
        0
      );
      state.totalAmount = products.reduce(
        (acc: number, curValue: cartItemObject & { product: products }) =>
          acc + curValue.quantity * curValue.product.price,
        0
      );
    },
    addItem(state, action) {
      const { productId, size, quantity } = action.payload;

      const existingItem = state.items.find(
        (item) => item.productId === productId && item.size === size
      );

      // id because of the proxy object error
      if (existingItem && existingItem.id) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItemQuantity(state, action) {
      const { id, size } = action.payload;

      // Remove item that has both the same productId "id" and size
      const existingItem = state.items.find(
        (item) => item.productId === id && item.size === size
      );

      if (existingItem) {
        existingItem.quantity--;
      }
    },
    removeItem(state, action) {
      const { id, size } = action.payload;

      // Remove item that has both the same productId "id" and size
      state.items = state.items.filter(
        (item) => !(item.productId === id && item.size === size)
      );
    },
  },
});

export const { replaceCart, addItem, removeItemQuantity, removeItem } =
  cartSlice.actions;
export default cartSlice.reducer;

export const getTotalCartQuantity = (state: any) =>
  state.cart.items.reduce(
    (sum: number, item: cartItemObject) => sum + item.quantity,
    0
  );

// export const getTotalCartAmount = (state: any) =>
//   state.cart.cart.reduce(
//     (sum: number, item: cartItemObject) =>
//       sum + item.quantity * item.product.price,
//     0
//   );

// export const getCart = (state: any) => state.cart.products;
