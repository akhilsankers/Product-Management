import axios from 'axios';
import baseUrl from '../../baseURL'; // your base URL

const signup = async (userData) => {
  const response = await axios.post(`${baseUrl}/auth/signup`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${baseUrl}/auth/login`, userData);
  return response.data;
};

export default {
  signup,
  login,
};
