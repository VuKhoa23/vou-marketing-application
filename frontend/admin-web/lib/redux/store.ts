import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { usersReducer } from './slices/usersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
