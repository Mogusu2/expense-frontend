import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

import { Typography } from "@mui/material";

const ExpenseChart = ({ expenses = [] }) => {
  const data = expenses.map(expense => ({
    category: expense.category,
    amount: expense.amount
  }));

  if (expenses.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No expenses found. Add expenses to view the spending analysis.
      </Typography>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#1ABB9C" />
      </BarChart>
    </ResponsiveContainer>
  );
};

ExpenseChart.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
};

export default ExpenseChart;
