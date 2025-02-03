// src/components/Budgets/BudgetProgress.jsx
import { Typography, LinearProgress, Box } from "@mui/material";
import PropTypes from 'prop-types';

const BudgetProgress = ({ budgets = [] }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {budgets.length === 0 ? (
        <Typography>No budgets set.</Typography>
      ) : (
        budgets.map((budget) => (
          <Box key={budget.id} sx={{ mb: 2 }}>
            <Typography variant="body2">
              {budget.category} (${budget.used}/${budget.limit})
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(budget.limit > 0 ? (budget.used / budget.limit) * 100 : 0)}
              sx={{ height: 8, borderRadius: 4 }}
              color={budget.used > budget.limit ? "error" : "primary"}
            />
          </Box>
        ))
      )}
    </Box>
  );
};
BudgetProgress.propTypes = {
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      used: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
    })
  ),
};

export default BudgetProgress;
