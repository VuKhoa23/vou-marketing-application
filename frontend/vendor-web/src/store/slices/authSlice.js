import { createSlice } from '@reduxjs/toolkit';
import Cookies from "js-cookie";

const initialState = {
    accessToken: null,
    destination: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            Cookies.remove("vendorToken");
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        }
    },
});

export const { setAuthUser, logout, setDestination } = authSlice.actions;
export default authSlice.reducer;