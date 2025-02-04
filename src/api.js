// src/api.js
import axios from 'axios';


// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location = '/login';
  }
  return Promise.reject(error);
});

export default api;