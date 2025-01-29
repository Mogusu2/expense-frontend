// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';

const theme = createTheme({
  palette: {
    primary: { main: '#2A3F54' },
    secondary: { main: '#1ABB9C' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}