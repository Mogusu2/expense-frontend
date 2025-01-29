// src/api/expenses.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getExpenses = async () => {
  const response = await axios.get(`${API_URL}/expenses`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await axios.post(`${API_URL}/expenses`, expenseData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`${API_URL}/expenses/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};