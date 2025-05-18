import axios from 'axios';
import baseUrl from '../../baseURL'; // Adjust relative path if needed

const API = axios.create({
  baseURL: baseUrl,
});

// Helper to simplify error handling (optional)
const handleError = (error) => {
  if (error.response && error.response.data) {
    return Promise.reject(error.response.data.message || 'API Error');
  }
  return Promise.reject(error.message || 'Network Error');
};

// Fetch all products
export const fetchProducts = () =>
  API.get('/product').catch(handleError);

// Fetch product by ID
export const fetchProductById = (id) =>
  API.get(`/product/${id}`).catch(handleError);

// Create a new product with images (multipart/form-data)
export const createProduct = (formData) =>
  API.post('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).catch(handleError);

// Update a product by ID (no images, send JSON)
export const updateProduct = (id, productData) =>
  API.put(`/product/${id}`, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(handleError);

