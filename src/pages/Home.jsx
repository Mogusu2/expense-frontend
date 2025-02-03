// src/pages/Home.jsx
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Expense Management System
      </Typography>
      
      {!user && (
        <>
          <Typography variant="body1" gutterBottom>
            Please log in or register to access your dashboard.
          </Typography>
          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 1 }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ margin: 1 }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </>
      )}
      
      {user && (
        <Typography variant="body1" color="textSecondary">
          Redirecting to your dashboard...
        </Typography>
      )}
    </Box>
  );
};

export default Home;