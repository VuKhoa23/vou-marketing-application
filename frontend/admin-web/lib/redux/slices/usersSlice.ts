import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";

export interface IUserList {
  users: Array<User>;
}

const initialState: IUserList = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<Array<User>>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;