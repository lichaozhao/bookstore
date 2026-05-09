import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import booksReducer from './booksSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    books: booksReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
