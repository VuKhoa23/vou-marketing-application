import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './slices/stepSlice';
import formsReducer from './slices/formsSlice';
import eventsReducer from './slices/eventsSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        step: stepReducer,
        forms: formsReducer,
        events: eventsReducer,
        auth: authReducer
    }
});

export default store;