import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUrl } from '../api';
import type { Book, CollectionState } from '../types';

export const fetchBooks = createAsyncThunk<Book[]>('books/fetchBooks', async () => {
  const res = await fetch(apiUrl('/books'));
  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }
  return await res.json() as Book[];
});

const initialState: CollectionState<Book> = { items: [], status: 'idle' };

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBooks.pending, state => { state.status = 'loading'; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, state => { state.status = 'failed'; });
  },
});

export default booksSlice.reducer;
