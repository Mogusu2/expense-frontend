// src/components/Layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Expense Manager
        </Typography>
        
        {user && (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/budgets">Budgets</Button>
            <Button color="inherit" component={Link} to="/invoices">Invoices</Button>
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin">Admin</Button>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};