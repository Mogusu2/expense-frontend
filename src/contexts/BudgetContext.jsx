import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to add a new budget
  const addBudget = async (budget) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found, redirecting...");
        navigate('/login');
        return;
      }

      console.log("Adding budget:", budget);
      console.log("Sending request to: http://localhost:5000/budgets");

      const { data } = await axios.post('http://localhost:5000/budgets', budget, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      console.log("Budget added successfully:", data);
      setBudgets((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding budget:", error.response?.data || error);
    }
  };

  // Function to fetch budgets from the backend
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error("No access token found, redirecting...");
          navigate('/login');
          return;
        }
    
        console.log("Fetching budgets from: http://localhost:5000/budgets");
    
        const { data } = await axios.get('http://localhost:5000/budgets', {
          headers: { Authorization: `Bearer ${token}` },
          data: null // <== Ensures no body is sent
        });
    
        console.log("Fetched budgets:", data);
        setBudgets(data);
      } catch (error) {
        console.error('Failed to fetch budgets:', error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [navigate]);

  // Function to update a budget
  const updateBudget = async (id, updatedBudget) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found, redirecting...");
        navigate('/login');
        return;
      }

      console.log("Updating budget with ID:", id);
      console.log("Sending updated data:", updatedBudget);

      const { data } = await axios.put(`http://localhost:5000/budgets/${id}`, updatedBudget, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      console.log("Budget updated successfully:", data);
      setBudgets((prev) => prev.map((budget) => (budget.id === id ? data : budget)));
    } catch (error) {
      console.error("Failed to update budget:", error.response?.data || error);
    }
  };

  // Function to delete a budget
  const deleteBudget = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found, redirecting...");
        navigate('/login');
        return;
      }

      console.log("Deleting budget with ID:", id);

      await axios.delete(`http://localhost:5000/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Budget deleted successfully");
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    } catch (error) {
      console.error("Failed to delete budget:", error.response?.data || error);
    }
  };

 

  return (
    <BudgetContext.Provider value={{ budgets, loading, addBudget, updateBudget, deleteBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

BudgetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useBudget = () => useContext(BudgetContext);
