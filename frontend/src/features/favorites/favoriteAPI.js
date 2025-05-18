import axios from 'axios';
import baseUrl from '../../baseURL'; 

const API_URL = `${baseUrl}/favorites`;

const getAuthConfig = () => {
  const token = localStorage.getItem('token'); // adjust if token stored elsewhere
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const getFavorites = async () => {
  try {
    const res = await axios.get(API_URL, getAuthConfig());
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addFavorite = async (productId) => {
  console.log('Sending favorite productId:', productId); // <--- log this
  try {
    const res = await axios.post(API_URL, { productId }, getAuthConfig());
    return res.data;
  } catch (error) {
    console.error('Favorite API Error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


export const removeFavorite = async (productId) => {
  try {
    const res = await axios.delete(`${API_URL}/${productId}`, getAuthConfig());
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
