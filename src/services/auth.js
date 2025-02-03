// src/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  getCurrentUser: async (token) => {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};