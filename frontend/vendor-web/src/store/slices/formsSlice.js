import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventForm: {
        eventImage: null,
        eventDTO: {
            name: '',
            startDate: null,
            endDate: null,
            isShaking: false,
            isTrivia: false,
        }
    },
    voucherForm: {
        voucherImage: null,
        voucherDTO: {
            description: '',
            endDate: null,
            voucherQuantities: 0,
            value: 0
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

        updateGameTypeSelection(state, action) {
            const { gameType, selected } = action.payload;
            state.eventForm.eventDTO[gameType] = selected;
        },

        resetForms(state) {
            return initialState;
        }
    }
});

export const {
    setEventForm,
    setVoucherForm,
    updateGameTypeSelection,
    resetForms,
} = formsSlice.actions;

export default formsSlice.reducer;
