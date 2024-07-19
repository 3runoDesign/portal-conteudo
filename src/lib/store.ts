import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';

const preloadedState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    return {
      auth: {
        token: token ? token : null,
        username: username ? username : null,
        userId: userId ? userId : null,
      },
    };
  }

  return {
    auth: {
      token: null,
      username: null,
      userId: null,
    },
  };
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
  preloadedState: preloadedState(),
});


setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;