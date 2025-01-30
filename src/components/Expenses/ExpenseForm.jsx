// src/components/Expenses/ExpenseForm.jsx
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
  MenuItem
} from '@mui/material';
import axios from 'axios';

const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  description: Yup.string()
    .max(200, 'Description too long'),
  budget_id: Yup.string()
    .required('Category is required')
});

export default function ExpenseForm({ onClose, onSubmit }) {
  const [budgets, setBudgets] = useState([]);

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

  const formik = useFormik({
    initialValues: {
      amount: 0,
      description: '',
      budget_id: ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    }
  });

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Expense</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
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
              {budgets.map(budget => (
                <MenuItem key={budget.id} value={budget.id}>
                  {budget.category} (${budget.monthly_limit - budget.current_spending} remaining)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit"
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={!formik.isValid}
        >
          Add Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
}
