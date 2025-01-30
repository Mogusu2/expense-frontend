// src/components/Dashboard/BudgetSummary.jsx
import { Box, Typography, LinearProgress } from '@mui/material';

export default function BudgetSummary({ budgets }) {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Budget Overview</Typography>
      {budgets.map(budget => (
        <Box key={budget.id} mb={2}>
          <Typography variant="body2">{budget.category}</Typography>
          <Typography variant="caption">
            ${budget.current_spending} / ${budget.monthly_limit}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(budget.current_spending / budget.monthly_limit) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      ))}
    </Box>
  );
}
