import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Typography } from "@mui/material";

const BudgetForm = ({ onSubmit }) => {
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !monthlyLimit) {
      alert("All fields are required.");
      return;
    }
    onSubmit({ category, monthly_limit: parseFloat(monthlyLimit) });
    setCategory("");
    setMonthlyLimit("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Create Budget
      </Typography>
      <TextField
        label="Category"
        variant="outlined"
        fullWidth
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Monthly Limit"
        type="number"
        variant="outlined"
        fullWidth
        value={monthlyLimit}
        onChange={(e) => setMonthlyLimit(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Budget
      </Button>
    </form>
  );
};

BudgetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default BudgetForm;
