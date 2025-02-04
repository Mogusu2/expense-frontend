import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/"); // Default redirect path
  const navigate = useNavigate();

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Decode token and set user data
  const decodeAndSetUser = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      const userData = decoded.sub || decoded;

      if (!userData?.role) {
        console.error("Invalid token: missing role");
        logout();
        return;
      }

      setUser({
        id: userData.id || null,
        username: userData.username || "",
        role: userData.role.toLowerCase(),
      });
    } catch (error) {
      console.error("Token decoding failed:", error);
      logout();
    }
  }, [logout]);

  // Updated login function
  const login = async (credentials) => {
    try {
      console.log("Attempting login with:", credentials);

      const response = await axios.post("http://localhost:5000/login", credentials, {
        headers: { "Content-Type": "application/json" },
        validateStatus: (status) => status < 500, // Avoid throwing errors for client-side (400s)
      });

      console.log("Login response:", response);

      if (response.status === 401) {
        throw new Error("Incorrect username or password.");
      }

      if (response.status !== 200 || !response.data?.access_token) {
        throw new Error("Unexpected login response.");
      }

      localStorage.setItem("access_token", response.data.access_token);
      decodeAndSetUser(response.data.access_token);

      setTimeout(() => {
        navigate(`/dashboard/${response.data.user?.role}`);
      }, 100); // Small delay to ensure state updates
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      decodeAndSetUser(token);
    }
  }, [decodeAndSetUser]);

  return (
    <AuthContext.Provider value={{ user, login, logout, setRedirectPath, redirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
