import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/products/productSlice'
import categoryReducer from '../features/category/categorySlice'
import subcategoryReducer from '../features/subcategory/subcategorySlice'
import authReducer from '../features/services/authSlice';
import favoriteReducer from '../features/favorites/favoritesSlice'
export const store = configureStore({
  reducer: {
    product: productReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    auth: authReducer,
    favorite: favoriteReducer,
  },
})