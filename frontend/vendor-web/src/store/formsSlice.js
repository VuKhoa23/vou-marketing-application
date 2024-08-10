import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventForm: {
        images: [],
        eventName: '',
        slogan: '',
        gameType: '',
        startDate: null,
        endDate: null,
        info: ''
    },
    voucherForm: {
        images: [],
        description: '',
        endDate: null,
        vouchers: {
            'Voucher 10%': { selected: false, quantity: 0 },
            'Voucher 20%': { selected: false, quantity: 0 },
            'Voucher 30%': { selected: false, quantity: 0 }
        }
    }
};

const formsSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        setEventForm(state, action) {
            state.eventForm = action.payload;
        },

        setVoucherForm(state, action) {
            state.voucherForm = action.payload;
        },

        updateVoucherSelection(state, action) {
            const { voucherType, selected } = action.payload;
            state.voucherForm.vouchers[voucherType].selected = selected;
            if (!selected) {
                state.voucherForm.vouchers[voucherType].quantity = 0; // Reset quantity if deselected
            }
        },

        updateVoucherQuantity(state, action) {
            const { voucherType, quantity } = action.payload;
            state.voucherForm.vouchers[voucherType].quantity = quantity;
        }
    }
});


export const { setEventForm, setVoucherForm, updateVoucherSelection, updateVoucherQuantity } = formsSlice.actions;
export default formsSlice.reducer;

