import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProducts,
  createProduct,
  fetchProductById,
  updateProduct
} from './productAPI';

const initialState = {
  products: [],
  productDetail: null,
  loading: false,
  error: null,
  successMessage: null,
  addProductStatus: 'idle',
  getProductsStatus: 'idle',
  getProductByIdStatus: 'idle',
  updateProductStatus: 'idle',
};

// Thunks
export const getProducts = createAsyncThunk('product/getProducts', async () => {
  const response = await fetchProducts();
  return response.data;
});

export const addProduct = createAsyncThunk('product/addProduct', async (productData) => {
  const response = await createProduct(productData);
  return response.data;
});

export const getProductById = createAsyncThunk('product/getProductById', async (id) => {
  const response = await fetchProductById(id);
  return response.data;
});

export const updateProductById = createAsyncThunk(
  'product/updateProductById',
  async ({ id, productData }) => {
    const response = await updateProduct(id, productData);
    return response.data;
  }
);
// Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductSuccess: (state) => {
      state.successMessage = null;
    },
    resetProductStatus: (state) => {
      state.addProductStatus = 'idle';
      state.getProductsStatus = 'idle';
      state.getProductByIdStatus = 'idle';
      state.updateProductStatus = 'idle';
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getProductsStatus = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.getProductsStatus = 'succeeded';
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.getProductsStatus = 'failed';
      })

      // ADD a product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.addProductStatus = 'loading';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
        state.successMessage = 'Product added successfully';
        state.addProductStatus = 'succeeded';
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.addProductStatus = 'failed';
      })

      // GET product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getProductByIdStatus = 'loading';
        state.productDetail = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
        state.getProductByIdStatus = 'succeeded';
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.getProductByIdStatus = 'failed';
      })

      // UPDATE product by ID
      .addCase(updateProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.updateProductStatus = 'loading';
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product updated successfully';
        state.updateProductStatus = 'succeeded';

        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }

        state.productDetail = action.payload;
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateProductStatus = 'failed';
      });
  },
});

export const {
  clearProductError,
  clearProductSuccess,
  resetProductStatus,
} = productSlice.actions;

export default productSlice.reducer;
