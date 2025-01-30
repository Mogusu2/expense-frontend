// src/components/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
;

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const storeToken = (token) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("token", token);
      } else {
        console.error("localStorage is not available in this context.");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  };




  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      setIsSubmitting(true);
  
      try {
        const response = await axios.post('http://localhost:5000/login', values, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.status === 200) {
          const { access_token } = response.data;
  
          // Store the token in localStorage
          storeToken(access_token);
  
          // Decode the token to get user info
          const decoded = jwtDecode(access_token);
  
          // Update the auth context
          login({
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
          });
  
          // Redirect based on the user's role or default to dashboard
          let redirectPath = '/dashboard'; // Default redirect path
  
          switch (decoded.role) {
            case 'admin':
              redirectPath = '/admin';
              break;
            case 'manager':
              redirectPath = '/budget'; // Assuming managers might go to budget first
              break;
            case 'employee':
              redirectPath = '/expenses'; // Or any other relevant page
              break;
            default:
              // If no specific role matches, redirect to the default dashboard
              break;
          }
  
          navigate(redirectPath);
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setSubmitting(false); // Crucial for form reset
        setIsSubmitting(false);
      }
    }
  });
  

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      
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
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </form>
    </Box>
  );
}