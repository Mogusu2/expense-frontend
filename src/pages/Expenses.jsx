// src/pages/Expenses.jsx
import { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import axios from 'axios';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await axios.get('/api/expenses');
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Expenses</Typography>
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Add Expense
      </Button>

      {showForm && (
        <ExpenseForm 
          onClose={() => setShowForm(false)}
          onSubmit={async (values) => {
            try {
              const { data } = await axios.post('/api/expenses', values);
              setExpenses([...expenses, data]);
              setShowForm(false);
            } catch (error) {
              console.error('Error creating expense:', error);
            }
          }}
        />
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map(expense => (
            <TableRow key={expense.id}>
              <TableCell>${expense.amount}</TableCell>
              <TableCell>{expense.budget?.category}</TableCell>
              <TableCell>{new Date(expense.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
