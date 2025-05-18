import axios from 'axios';
import baseUrl from '../../baseURL';

const API = axios.create({
  baseURL: baseUrl,
});

export const fetchSubcategories = () => API.get('/subcategory');
export const createSubcategory = (data) => API.post('/subcategory', data);
