import { configureStore } from '@reduxjs/toolkit';
import stepReducer from './stepSlice';
import formsReducer from './formsSlice';
import eventsReducer from './eventsSlice';

const store = configureStore({
    reducer: {
        step: stepReducer,
        forms: formsReducer,
        events: eventsReducer,
    }
});


export default store; 