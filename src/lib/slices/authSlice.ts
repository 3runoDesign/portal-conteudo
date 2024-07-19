import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  username: string | null,
  userId: string | null,
}

const initialState: AuthState = {
  token: null,
  username: null,
  userId: null
};

const authSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.userId = action.payload.userId;

      if (action.payload.token && action.payload.username && action.payload.userId) {
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('userId', action.payload.userId);
      }
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
