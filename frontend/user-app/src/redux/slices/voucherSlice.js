import { createSlice } from '@reduxjs/toolkit';
import voucherData from '../../json/vouchers.json'

const initialState = {
    vouchers: voucherData
};

const voucherSlice = createSlice({
    name: 'voucher',
    initialState,
    reducers: {
        setVouchers: (state, action) => {
            state.vouchers = action.payload;
        },
    },
});

export const { setVouchers } = voucherSlice.actions;
export default voucherSlice.reducer;
