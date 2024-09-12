import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 0,
    username: '',
    phone: '',
    gender: '',
    image_url: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            const { id, username, phone, gender, image_url } = action.payload;
            state.id = id;
            state.username = username;
            state.phone = phone;
            state.image_url = image_url;
            state.gender = gender;
        },
        resetUserInfo() {
            return initialState;
        }
    },
});

export const { setUserInfo, resetUserInfo } = userSlice.actions;
export default userSlice.reducer;
