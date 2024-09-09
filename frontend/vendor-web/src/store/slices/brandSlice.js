import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 0,
    username: '',
    category: '',
    address: '',
};

const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        setBrandInfo: (state, action) => {
            const { id, username, category, address } = action.payload;
            state.id = id;
            state.username = username;
            state.category = category;
            state.address = address;
        },
        resetBrandInfo(state) {
            return initialState;
        }
    },
});

export const { setBrandInfo, resetBrandInfo } = brandSlice.actions;
export default brandSlice.reducer;
