import axios from 'axios';
import baseUrl from '../../baseURL'; // Fixed relative path

const API = axios.create({
  baseURL: baseUrl,
});

export const fetchCategories = () => API.get('/category');
export const createCategory = (data) => API.post('/category', data);
