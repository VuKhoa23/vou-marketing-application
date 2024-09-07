import { createSlice } from '@reduxjs/toolkit';

const stepSlice = createSlice({
  name: 'step',
  initialState: { currentStep: 1 },
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    }
  }
});

export const { setStep } = stepSlice.actions;
export default stepSlice.reducer;
