import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import currentEventReducer from './slices/currentEventSlice';
import voucherReducer from './slices/voucherSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        currentEvent: currentEventReducer,
        voucher: voucherReducer
    },
});

export default store;