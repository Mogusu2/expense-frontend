import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

// Validation Schema
const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  description: Yup.string().max(200, 'Description too long'),
  budget_id: Yup.string().required('Category is required'),
});

export function ExpenseForm({ onClose, onSubmit }) {
  ExpenseForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  const [budgets, setBudgets] = useState([]); // Ensure budgets is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
  
        const token = localStorage.getItem("token"); // Get token from storage
        if (!token) {
          setError("Authentication required. Please log in.");
          return; // Stop execution if no token
        }
  
        const { data } = await axios.get("http://localhost:5000/budgets", {
          headers: { Authorization: `Bearer ${token}` }, // Attach token
        });

        console.log("Fetched budgets:", data);

        // Ensure the data structure is correct
        if (Array.isArray(data)) {
          setBudgets(data);
        } else if (Array.isArray(data.budgets)) {
          setBudgets(data.budgets);
        } else {
          setBudgets([]);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setError(error.response?.data?.message || "Failed to load budgets.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBudgets();
  }, []);

  // Formik for handling form submission
  const formik = useFormik({
    initialValues: {
      amount: '',
      description: '',
      budget_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required.");
          return;
        }

        await axios.post(
          "http://localhost:5000/expenses",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        onSubmit(); // Refresh expenses after creation
        onClose();  // Close form
      } catch (error) {
        console.error("Failed to create expense:", error);
        setError(error.response?.data?.error || "Error creating expense.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            {/* Budget Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="budget-label">Category</InputLabel>
              <Select
                labelId="budget-label"
                id="budget_id"
                name="budget_id"
                value={formik.values.budget_id}
                onChange={formik.handleChange}
                error={formik.touched.budget_id && Boolean(formik.errors.budget_id)}
              >
                {budgets.length > 0 ? (
                  budgets.map(budget => (
                    <MenuItem key={budget.id} value={budget.id}>
                      {budget.category} (${budget.monthly_limit} limit)
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No budgets available</MenuItem>
                )}
              </Select>
            </FormControl>

            {/* Amount Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />

            {/* Description Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Box>
        )}
      </DialogContent>

      {/* Buttons */}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit"
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={!formik.isValid || loading}
        >
          Add Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExpenseForm;
