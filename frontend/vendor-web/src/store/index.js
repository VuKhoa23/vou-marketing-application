import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './stepSlice';

const store = configureStore({
    reducer: stepReducer
});


export default store; 