import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from '../types';

interface SetUserPayload {
  token: string;
  username: string;
}

const initialState: UserState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SetUserPayload>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    },
    logout(state) {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
