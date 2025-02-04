import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

// Floating icons data
const symbols = ["💰", "📊", "📈", "💲", "Ksh", "€", "%", "💹"];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  const handleNavigate = (path) => {
    setIsVisible(false); // Trigger fade-out effect
    setTimeout(() => {
      navigate(path);
    }, 600); // Delay navigation to allow animation to complete
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2196F3, #E91E63)",
        position: "relative",
        overflow: "hidden",
        padding: 3,
      }}
    >
      {/* Floating Symbols */}
      {symbols.map((symbol, index) => (
        <motion.div
          key={index}
          initial={{ x: Math.random() * 800 - 400, y: Math.random() * 800 - 400, opacity: 0 }}
          animate={{
            x: [Math.random() * 800 - 400, Math.random() * 800 - 400],
            y: [Math.random() * 800 - 400, Math.random() * 800 - 400],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Main Content Box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 5,
            textAlign: "center",
            maxWidth: 500,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            Expense Management System
          </Typography>

          {!user ? (
            <>
              {isVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  
                </motion.div>
              )}
            </>
          ) : (
            <Typography variant="h6" color="success.main">
              Please Login if not Register to access your Dashboardv
              <Box sx={{ marginTop: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ margin: 1, width: "120px" }}
                      onClick={() => handleNavigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ margin: 1, width: "120px" }}
                      onClick={() => handleNavigate("/register")}
                    >
                      Register
                    </Button>
                  </Box>
            </Typography>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Home;
