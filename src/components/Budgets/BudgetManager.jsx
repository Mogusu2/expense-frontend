import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, TextField, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext'; 
import { useSnackbar } from 'notistack';
import BudgetCategory from './BudgetCategory';

const BudgetManager = ({ categories = [], onAddCategory = () => {}, onAddExpense = () => {} }) => {  // Default values
  const { enqueueSnackbar } = useSnackbar();
  const [newCategory, setNewCategory] = useState({ name: '', limit: '' });

  
  const handleAdd = async () => {
    console.log("Adding budget...");
    const token = localStorage.getItem('token');
    console.log("Token:", token); // Debugging
  
    if (!token) {
      enqueueSnackbar('Authentication required. Please log in.', { variant: 'error' });
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/budgets',
        {
          category: newCategory.name,
          monthly_limit: Number(newCategory.limit),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log("Response:", response.data);
  
      if (response.data) {
        onAddCategory({
          id: response.data.id,
          category: response.data.category,
          monthly_limit: response.data.monthly_limit,
          current_spending: response.data.current_spending || 0,
          expenses: [],
        });
        setNewCategory({ name: '', limit: '' });
        enqueueSnackbar("Budget added successfully!", { variant: 'success' });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      enqueueSnackbar(error.response?.data?.error || 'Error creating budget', { variant: 'error' });
    }
  };
  
  

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          size="small"
          sx={{ mr: 1 }}
        />
        <TextField
          label="Monthly Limit"
          type="number"
          value={newCategory.limit}
          onChange={(e) => setNewCategory({ ...newCategory, limit: e.target.value })}
          size="small"
          sx={{ mr: 1, width: 100 }}
        />
        <Button variant="contained" onClick={handleAdd} disabled={!newCategory.name || !newCategory.limit}>
          Add
        </Button>
      </Box>

      {categories.length > 0 ? (
        categories.map((category) => (
          <BudgetCategory key={category.id} category={category} onAddExpense={onAddExpense} />
        ))
      ) : (
        <p>No categories added yet.</p>
      )}
    </Box>
  );
};

BudgetManager.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      monthly_limit: PropTypes.number.isRequired,
      current_spending: PropTypes.number.isRequired,
      expenses: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          description: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
  onAddCategory: PropTypes.func,
  onAddExpense: PropTypes.func,
};

export default BudgetManager;
