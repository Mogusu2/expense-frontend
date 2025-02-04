// src/services/budgets.js
import axios from "axios";

const API_URL = "http://localhost:5000/budgets";

class BudgetService {
  static async getBudgets(token) {
    if (!token) {
      console.warn("JWT Token is missing! User might not be logged in.");
      return Promise.reject(new Error("You are not logged in."));
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch budgets:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to fetch budgets");
    }
  }

  static async createBudget(budgetData) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("JWT Token is missing! Please log in.");
      alert("Session expired. Please log in again.");
      return Promise.reject(new Error("You are not logged in."));
    }
  
    const formattedData = {
      category: budgetData.category,
      monthly_limit: budgetData.monthlyLimit, // Ensure backend expects this field name
    };
  
    console.log("Sending budget data:", formattedData);
  
    try {
      const response = await axios.post(API_URL, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create budget:", error.response?.data);
      alert(error.response?.data?.error || "Failed to create budget. Please try again.");
      throw error;
    }
  }  
}

export default BudgetService;
