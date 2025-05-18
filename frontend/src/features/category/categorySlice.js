import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories, createCategory } from './categoryApi';

export const getCategories = createAsyncThunk('category/getAll', async () => {
  const response = await fetchCategories();
  return response.data;
});

export const addCategory = createAsyncThunk('category/add', async (data) => {
  const response = await createCategory(data);
  return response.data;
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export default categorySlice.reducer;
