// src/pages/Budgets.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, LinearProgress, Box } from '@mui/material';
import BudgetForm from '../components/Budgets/BudgetForm';
import axios from 'axios';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories] = useState(['Rent', 'Travel', 'Food', 'Utilities']);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const { data } = await axios.get('/api/budgets');
        setBudgets(data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchBudgets();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const { data } = await axios.post('/api/budgets', values);
      setBudgets([...budgets, data]);
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Budget Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BudgetForm categories={categories} onSubmit={handleSubmit} />
        </Grid>
        
        <Grid item xs={12} md={8}>
          {budgets.map(budget => (
            <Box key={budget.id} mb={3} p={2} boxShadow={2}>
              <Typography variant="h6">{budget.category}</Typography>
              <Typography>
                ${budget.current_spending} of ${budget.monthly_limit}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(budget.current_spending / budget.monthly_limit) * 100} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};