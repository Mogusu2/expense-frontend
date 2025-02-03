import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { 
  Box, Typography, Grid, Paper, Tabs, Tab, LinearProgress, 
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { useSnackbar } from 'notistack';
import InvoiceBuilder from '../components/Invoices/InvoiceBuilder';
import PaymentMethods from '../components/Payments/PaymentMethods';
import BudgetManager from '../components/Budgets/BudgetManager';
import IncomeChart from '../components/Reports/IncomeChart';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    budgets: [],
    invoices: [],
    payments: [],
    activeTab: 0,
    reportFilters: { timeframe: 30, category: '' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgets, invoices] = await Promise.all([
          api.get('http://localhost:5000/budgets'),
          api.get('http://localhost:5000/invoices')
        ]);
        
        setState(prev => ({
          ...prev,
          budgets: budgets.data,
          invoices: invoices.data
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        enqueueSnackbar('Error loading data', { variant: 'error' });
      }
    };
    
    if (user) fetchData();
  }, [user, enqueueSnackbar]);

  const handleAddBudget = async (categoryData) => {
    try {
      const { data } = await api.post('http://localhost:5000/budgets', categoryData);
      setState(prev => ({
        ...prev,
        budgets: [...prev.budgets, data]
      }));
    } catch (error) {
      console.error("Budget creation error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Budget creation failed', { variant: 'error' });
    }
  };

  const handleAddExpense = async (budgetId, expenseData) => {
    try {
      const { data } = await api.post('http://localhost:5000/expenses', { 
        budget_id: budgetId,
        ...expenseData 
      });
      
      setState(prev => ({
        ...prev,
        budgets: prev.budgets.map(budget => 
          budget.id === budgetId ? { ...budget, expenses: [...budget.expenses, data] } : budget
        )
      }));
    } catch (error) {
      console.error("Expense addition error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Expense addition failed', { variant: 'error' });
    }
  };


  const handleCreateInvoice = async (invoiceData) => {
    try {
      const { data } = await api.post('http://localhost:5000/invoices', invoiceData);
      setState(prev => ({
        ...prev,
        invoices: [...prev.invoices, data]
      }));
      enqueueSnackbar('Invoice created successfully!', { variant: 'success' });
    } catch (error) {
      console.error("Invoice creation error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Invoice creation failed', { variant: 'error' });
    }
  };

  const handlePayment = async (method, amount, invoiceId, phone) => {
    try {
      const endpoint = method === 'mpesa' ? 'http://localhost:5000/payments/mpesa' : 'http://localhost:5000/payments/paypal';
      const { data } = await api.post(endpoint, {
        invoice_id: invoiceId,
        amount,
        ...(method === 'mpesa' && { phone_number: phone })
      });
      
      if (method === 'paypal') window.location.href = data.approvalUrl;
      enqueueSnackbar(`Payment initiated via ${method.toUpperCase()}`, { variant: 'success' });
    } catch (error) {
      console.error("Payment error:", error);
      enqueueSnackbar(error.response?.data?.error || 'Payment failed', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}
      </Typography>

      <Grid container spacing={3}>
        {/* Budget Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <BudgetManager 
              budgets={state.budgets}
              onAddBudget={handleAddBudget}
              onAddExpense={handleAddExpense}
            />
          </Paper>
        </Grid>

        {/* Invoice Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Create Invoice</Typography>
            <InvoiceBuilder 
              onCreate={handleCreateInvoice}
              invoices={state.invoices}
            />
          </Paper>
        </Grid>

        {/* Payments Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Payment Processing</Typography>
            <PaymentMethods 
              invoices={state.invoices}
              onPayment={handlePayment}
            />
          </Paper>
        </Grid>

        {/* Reports Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Financial Reports</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={state.reportFilters.timeframe}
                  onChange={e => setState(prev => ({
                    ...prev,
                    reportFilters: { ...prev.reportFilters, timeframe: e.target.value }
                  }))}
                  label="Timeframe"
                >
                  <MenuItem value={7}>Last 7 Days</MenuItem>
                  <MenuItem value={30}>Last 30 Days</MenuItem>
                  <MenuItem value={90}>Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Tabs value={state.activeTab} onChange={(e, val) => setState(prev => ({ ...prev, activeTab: val }))}>
              <Tab label="Income vs Expenses" />
              <Tab label="Budget Analysis" />
              <Tab label="Payment History" />
            </Tabs>

            {state.activeTab === 0 && <IncomeChart filters={state.reportFilters} />}
            {state.activeTab === 1 && (
              <Box sx={{ mt: 2 }}>
                {state.budgets.map(budget => (
                  <Box key={budget.id} sx={{ mb: 2 }}>
                    <Typography variant="body2">{budget.category}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(budget.current_spending / budget.monthly_limit) * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                      ${budget.current_spending} of ${budget.monthly_limit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FreelancerDashboard;