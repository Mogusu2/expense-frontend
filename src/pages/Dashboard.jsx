// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import BudgetSummary from '../components/Dashboard/BudgetSummary';
import axios from 'axios';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesRes = await axios.get('/api/expenses');
        const budgetsRes = await axios.get('/api/budgets');
        setExpenses(expensesRes.data);
        setBudgets(budgetsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const processChartData = () => {
    return budgets.map(budget => ({
      category: budget.category,
      amount: budget.current_spending,
      limit: budget.monthly_limit
    }));
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4">Dashboard Overview</Typography>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Expense Distribution</Typography>
          <ExpenseChart data={processChartData()} />
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <BudgetSummary budgets={budgets} />
      </Grid>
    </Grid>
  );
};