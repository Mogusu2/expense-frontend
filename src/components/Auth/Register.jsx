// src/components/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'employee', 'freelancer'], 'Invalid role')
});

export default function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'employee' // Default role
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://management-tool-1.onrender.com/register', values);
        
        if (response.status === 201) {
          navigate('/login'); // Redirect to login after successful registration
        }
      } catch (err) {
        if (err.response) {
          // Handle backend validation errors
          if (err.response.status === 400) {
            setError(err.response.data.message);
          } else if (err.response.status === 429) {
            setError('Too many requests. Please try again later.');
          }
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    }
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            label="Role"
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="freelancer">Freelancer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </Box>
  );
}