import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getPayments = async () => {
  const response = await axios.get(`${API_URL}/payments`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await axios.post(`${API_URL}/payments`, paymentData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const deletePayment = async (id) => {
  await axios.delete(`${API_URL}/payments/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Default export
export default {
  getPayments,
  createPayment,
  deletePayment
};
