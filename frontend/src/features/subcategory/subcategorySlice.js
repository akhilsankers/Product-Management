import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSubcategories, createSubcategory } from './subcategoryApi';

export const getSubcategories = createAsyncThunk(
  'subcategory/getSubcategories',
  async () => {
    const response = await fetchSubcategories();
    return response.data;
  }
);

export const addSubcategory = createAsyncThunk(
  'subcategory/addSubcategory',
  async (formData) => {
    const response = await createSubcategory(formData);
    return response.data;
  }
);

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    subcategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(getSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories.unshift(action.payload.subcategory);
      })
      .addCase(addSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default subcategorySlice.reducer;
