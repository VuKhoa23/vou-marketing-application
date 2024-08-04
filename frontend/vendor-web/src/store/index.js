import { createSlice, configureStore } from '@reduxjs/toolkit';


const stepSlice = createSlice ({
    name: 'step',
    initialState: {currentStep: 1},
    reducers: {
        setStep: (state, action) => {
            state.currentStep = action.payload;
        }
    }
})

const store = configureStore({
    reducer: stepSlice.reducer
});


export const stepAction = stepSlice.actions;

export default store; 