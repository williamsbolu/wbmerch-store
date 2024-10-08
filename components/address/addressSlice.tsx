import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

interface AddressObject {
  id: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address: string;
  optional: string | null;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface AddressState {
  data: AddressObject[];
}
const initialState: AddressState = {
  data: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState: initialState,
  reducers: {
    replaceAddress(state, action: PayloadAction<AddressObject[]>) {
      state.data = action.payload;
    },
    addAddress(state, action: PayloadAction<AddressObject>) {
      const newAddress = action.payload;
      state.data.push(newAddress);
    },
    updateUserAddress(state, action: PayloadAction<AddressObject>) {
      const addressToUpdate = action.payload;

      const existingAddress = state.data.find(
        (item) => item.id === addressToUpdate.id
      );

      if (existingAddress) {
        existingAddress.firstName = addressToUpdate.firstName;
        existingAddress.lastName = addressToUpdate.lastName;
        existingAddress.address = addressToUpdate.address;
        existingAddress.optional = addressToUpdate.optional;
        existingAddress.country = addressToUpdate.country;
        existingAddress.state = addressToUpdate.state;
        existingAddress.city = addressToUpdate.city;
        existingAddress.postalCode = addressToUpdate.postalCode;
        existingAddress.phone = addressToUpdate.phone;
      }
    },
  },
});

export const { replaceAddress, addAddress, updateUserAddress } =
  addressSlice.actions;
export default addressSlice.reducer;
