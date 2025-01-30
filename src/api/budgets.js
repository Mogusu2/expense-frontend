// src/api/budgets.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getBudgets = async () => {
  const response = await axios.get(`${API_URL}/budgets`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const createBudget = async (budgetData) => {
  const response = await axios.post(`${API_URL}/budgets`, budgetData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};
