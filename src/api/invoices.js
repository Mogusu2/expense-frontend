// src/api/invoices.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  getInvoices: async (token) => {
    const response = await axios.get(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createInvoice: async (invoiceData, token) => {
    const response = await axios.post(`${API_URL}/invoices`, invoiceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};