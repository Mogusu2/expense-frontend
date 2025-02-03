// src/api.js
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const api = axios.create({
  baseURL:'http://localhost:5000',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      try {
        const response = await axios.post(`${'http://localhost:5000'}/refresh-token`, {
          refreshToken: localStorage.getItem('refresh_token')
        });
        localStorage.setItem('access_token', response.data.access_token);
        config.headers.Authorization = `Bearer ${response.data.access_token}`;
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
