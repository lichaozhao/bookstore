import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '../api';
import type { Book, CollectionState } from '../types';

interface AddFavoritePayload {
  token: string;
  bookId: string;
}

export const fetchFavorites = createAsyncThunk<Book[], string>('favorites/fetchFavorites', async (token) => {
  const res = await fetch(apiUrl('/favorites'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch favorites');
  }
  return await res.json() as Book[];
});

export const addFavorite = createAsyncThunk<string, AddFavoritePayload>('favorites/addFavorite', async ({ token, bookId }) => {
  const res = await fetch(apiUrl('/favorites'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookId }),
  });
  if (!res.ok) {
    throw new Error('Failed to add favorite');
  }
  return bookId;
});

const initialState: CollectionState<Book> = { items: [], status: 'idle' };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => { state.status = 'loading'; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, state => { state.status = 'failed'; })
      .addCase(addFavorite.fulfilled, state => { state.status = 'succeeded'; });
  },
});

export default favoritesSlice.reducer;
