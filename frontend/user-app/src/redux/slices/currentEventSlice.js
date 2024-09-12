import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: 0,
    name: '',
    brandName: '',
    voucherId: '',
};

const currentEventSlice = createSlice({
    name: 'currentEvent',
    initialState,
    reducers: {
        setCurrentEvent: (state, action) => {
            const selected = action.payload;

            state.id = selected.event.id;
            state.name = selected.event.name;
            state.brandName = selected.event.brand.username;
            state.voucherId = selected.voucher.voucherId;
        },
        resetCurrentEvent() {
            return initialState;
        }
    },
});

export const { setCurrentEvent, resetCurrentEvent } = currentEventSlice.actions;
export default currentEventSlice.reducer;
