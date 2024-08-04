import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './stepSlice';
import formsReducer from './formsSlice';

const store = configureStore({
    reducer: {
        step: stepReducer,
        forms: formsReducer
    }
});


export default store; 