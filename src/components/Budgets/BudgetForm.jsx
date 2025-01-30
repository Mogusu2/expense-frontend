// src/components/Budgets/BudgetForm.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, MenuItem } from '@mui/material';

const validationSchema = Yup.object({
  category: Yup.string().required('Required'),
  monthly_limit: Yup.number().required('Required').min(0),
});

export default function BudgetForm({ categories, onSubmit }) {
  const formik = useFormik({
    initialValues: { category: '', monthly_limit: 0 },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <TextField
        select
        fullWidth
        margin="normal"
        label="Category"
        name="category"
        value={formik.values.category}
        onChange={formik.handleChange}
        error={formik.touched.category && Boolean(formik.errors.category)}
        helperText={formik.touched.category && formik.errors.category}
      >
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        margin="normal"
        label="Monthly Limit"
        name="monthly_limit"
        type="number"
        value={formik.values.monthly_limit}
        onChange={formik.handleChange}
        error={formik.touched.monthly_limit && Boolean(formik.errors.monthly_limit)}
        helperText={formik.touched.monthly_limit && formik.errors.monthly_limit}
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Create Budget
      </Button>
    </Box>
  );
}