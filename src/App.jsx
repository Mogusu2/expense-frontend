import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BudgetProvider } from "./contexts/BudgetContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Home from "./pages/Home";

const theme = createTheme({
  palette: {
    primary: { main: "#2A3F54" },
    secondary: { main: "#1ABB9C" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <BudgetProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
                <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* Catch-All Redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BudgetProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
