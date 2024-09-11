import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Partner } from "../../types/Partner";

export interface IPartnerList {
  partners: Array<Partner>;
}

const initialState: IPartnerList = {
  partners: [],
};

export const partnersSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    setPartners: (state, action: PayloadAction<Array<Partner>>) => {
      state.partners = action.payload;
    },
  },
});

export const { setPartners } = partnersSlice.actions;
export const partnersReducer = partnersSlice.reducer;