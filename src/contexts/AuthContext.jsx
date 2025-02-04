import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/"); // Fixed redirect state
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
  
      // Check if user info is in `sub` or another field
      const userData = decoded.sub || decoded.user || decoded;
  
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
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });
  
      // Validate response structure
      if (!response.data.access_token || !response.data.user) {
        throw new Error('Invalid server response format');
      }
  
      // Store authentication data
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
  
      return response.data.user;
    } catch (err) {
      // Handle specific error cases
      let errorMessage = 'Login failed';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) decodeAndSetUser(token);
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
