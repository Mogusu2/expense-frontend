import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Avatar
} from "@mui/material";
import {
  PeopleAlt,
  MonetizationOn,
  Settings,
  CheckCircle,
  Cancel,
  Add,
  NotificationsActive
} from "@mui/icons-material";
import UserManagement from "../components/Admin/UserManagement";
import SystemAnalytics from "../components/Admin/SystemAnalytics";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingBudgets, setPendingBudgets] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Admin Data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [usersRes, budgetsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/admin/budgets/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setUsers(usersRes.data);
      setPendingBudgets(budgetsRes.data);
      setSystemStats(statsRes.data);
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  // Handle Budget Approval
  const handleBudgetAction = async (budgetId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/admin/budgets/${budgetId}/${action}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error("Budget action failed:", error);
      setError(`Failed to ${action} budget`);
    }
  };

  // Handle User Actions
  const handleUserAction = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error("User action failed:", error);
      setError("Failed to delete user");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }
    fetchAdminData();
  }, []);


  const handleUserUpdate = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/admin/users/${userData.id}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch {
      setError("Failed to update user");
    }
  };



  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{
        fontWeight: "bold",
        color: "#2A3F54",
        display: "flex",
        alignItems: "center",
        gap: 2
      }}>
        <Settings fontSize="large" />
        Admin Dashboard
        <Chip
          icon={<NotificationsActive />}
          label="3 Alerts"
          color="warning"
          variant="outlined"
          sx={{ ml: 2 }}
        />
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* System Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#1ABB9C" }}>
              System Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#2A3F54" }}>
                    <PeopleAlt />
                  </Avatar>
                  <Box>
                    <Typography variant="body2">Total Users</Typography>
                    <Typography variant="h4">{systemStats.totalUsers}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#1ABB9C" }}>
                    <MonetizationOn />
                  </Avatar>
                  <Box>
                    <Typography variant="body2">Pending Budgets</Typography>
                    <Typography variant="h4">{systemStats.pendingBudgets}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress
                  variant="determinate"
                  value={systemStats.storageUsed || 0}  // Add fallback to 0
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Storage Usage: {systemStats.storageUsed}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* User Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}>
              <Typography variant="h6" sx={{ color: "#1ABB9C" }}>
                User Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => console.log("Add new user")}
              >
                New User
              </Button>
            </Box>
            <UserManagement
              users={users}
              onEditUser={(user) => handleUserUpdate(user)}  // Add this handler
              onDeleteUser={handleUserAction}
            />
          </Paper>
        </Grid>

        {/* Pending Budget Approvals */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#2A3F54" }}>
              Pending Budget Approvals ({pendingBudgets.length})
            </Typography>

            {pendingBudgets.map((budget) => (
              <Paper
                key={budget.id}
                sx={{
                  p: 2,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{budget.category}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {budget.user} • ${budget.amount}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(budget.used / budget.amount) * 100}
                    sx={{ width: 200, mt: 1 }}
                  />
                </Box>

                <Box>
                  <Tooltip title="Approve">
                    <IconButton
                      color="success"
                      onClick={() => handleBudgetAction(budget.id, "approve")}
                    >
                      <CheckCircle />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton
                      color="error"
                      onClick={() => handleBudgetAction(budget.id, "reject")}
                    >
                      <Cancel />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </Paper>
        </Grid>

        {/* System Analytics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#2A3F54" }}>
              System Analytics
            </Typography>
            <SystemAnalytics data={systemStats} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;