import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { usersReducer } from './slices/usersSlice';
import { partnersReducer } from './slices/partnersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      partners: partnersReducer
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
