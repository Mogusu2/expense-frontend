import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button, CircularProgress } from "@mui/material";
import BudgetForm from "../components/Budgets/BudgetForm";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import ExpenseChart from "../components/Reports/ExpenseChart";
import BudgetProgress from "../components/Budgets/BudgetProgress";
import IncomeChart from "../components/Reports/IncomeChart";
import axios from "axios";

const EmployeeDashboard = () => {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [expenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Budgets from API
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await axios.get("http://localhost:5000/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Budgets fetched successfully:", response.data); // Debugging log
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setError("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      if (!token) {
        setError("Authentication required.");
        return;
      }
  
      const response = await axios.get("http://localhost:5000/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Budgets fetched successfully:", response.data); // Debugging log
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setError("Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }
    fetchBudgets();
    fetchExpenses(); // Fetch expenses when the component mounts
  }, []);

  // Handle Budget Submission
  const handleBudgetSubmit = async (budgetData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      console.log("Submitting Budget Data:", budgetData); // Debugging log

      const response = await axios.post("http://localhost:5000/budgets", budgetData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      console.log("Budget created successfully:", response.data); // Debugging log
      fetchBudgets(); // Refresh budgets after successful addition
    } catch (error) {
      console.error("Failed to create budget:", error);
      setError(error.response?.data?.message || "Error creating budget.");
    }
  };

  // Handle Expense Submission
  const handleExpenseSubmit = async (expenseData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
  
      console.log("Submitting Expense Data:", expenseData); // Debugging log
  
      const response = await axios.post("http://localhost:5000/expenses", expenseData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
  
      console.log("Expense created successfully:", response.data); // Debugging log
      fetchBudgets(); // Refresh budgets after adding an expense
      fetchExpenses(); // Refresh expenses after adding an expense
    } catch (error) {
      console.error("Failed to create expense:", error);
      setError(error.response?.data?.message || "Error creating expense.");
    }
  };

  

  // Handle Expense Modal Close
  const handleExpenseClose = () => {
    setExpenseModalOpen(false);
  };


  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#2A3F54" }}>
        Employee Dashboard
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {/* Budget Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#1ABB9C" }}>
              Create Budget
            </Typography>
            <BudgetForm onSubmit={handleBudgetSubmit} />
          </Paper>
        </Grid>

        {/* Expense Tracking */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#1ABB9C" }}>
              Log Expense
            </Typography>
            <Button variant="contained" onClick={() => setExpenseModalOpen(true)}>
              Add Expense
            </Button>
            {expenseModalOpen && (
              <ExpenseForm onClose={handleExpenseClose} onSubmit={handleExpenseSubmit} />
            )}
          </Paper>
        </Grid>

        {/* Budget Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#2A3F54" }}>
              Budget Overview
            </Typography>
            <BudgetProgress budgets={budgets} />
          </Paper>
        </Grid>

        {/* Real-Time Reports - Expense Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#2A3F54" }}>
              Spending Analysis
            </Typography>
            <ExpenseChart expenses={expenses} />
          </Paper>
        </Grid>

        {/* Income vs Expenses Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#2A3F54" }}>
              Income vs Expenses
            </Typography>
            <IncomeChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;