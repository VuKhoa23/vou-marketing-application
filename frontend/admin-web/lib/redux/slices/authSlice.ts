import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/lib/types/User';

interface UserState {
    accessToken: string | null;
  }
  
  const initialState: UserState = {
    accessToken: null,
  };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state,action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;