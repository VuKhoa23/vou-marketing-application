import { createSlice } from '@reduxjs/toolkit';

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
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        }
    },
});

export const { setAuthUser, logout, setDestination } = authSlice.actions;
export default authSlice.reducer;