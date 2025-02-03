import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const BudgetCategory = ({ category, onAddExpense }) => {
  const [expense, setExpense] = useState({ amount: '', description: '' });

  const handleAdd = () => {
    onAddExpense(category.id, {
      amount: Number(expense.amount),
      description: expense.description,
      date: new Date().toISOString()
    });
    setExpense({ amount: '', description: '' });
  };

  return (
    <Box sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
      <Typography variant="subtitle1">{category.name}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          label="Amount"
          type="number"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          size="small"
        />
        <TextField
          label="Description"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          size="small"
        />
        <Button variant="outlined" onClick={handleAdd} disabled={!expense.amount}>
          Add Expense
        </Button>
      </Box>
      <List dense sx={{ maxHeight: 100, overflow: 'auto' }}>
        {category.expenses.map((expense, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={`$${expense.amount}`} 
              secondary={expense.description} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
BudgetCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    expenses: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  onAddExpense: PropTypes.func.isRequired
};

export default BudgetCategory;