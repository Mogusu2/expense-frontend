// src/components/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
        navigate('/dashboard');
      } catch (err) {
        setError('Invalid credentials');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
          label="Password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
        >
          Sign In
        </Button>
      </form>
    </Box>
  );
};