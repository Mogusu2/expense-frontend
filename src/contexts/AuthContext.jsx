// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //  login function
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/login', 
        JSON.stringify(credentials), // Explicit JSON serialization
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      localStorage.setItem('token', response.data.access_token);
      setToken(response.data.access_token);
      
      // Wait for verification before navigation
      await verifyUser();
      
      // Navigate using verified user data
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
  
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Update the verifyUser function
  const verifyUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);  // Explicit loading state
      const { data } = await axios.get('http://localhost:5000/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUser(data);
    } catch (error) {
      console.error('Verification error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);


  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpire = expirationTime - currentTime;

    if (timeUntilExpire <= 0) {
      logout();
      return;
    }

    const timeout = setTimeout(() => {
      logout();
    }, timeUntilExpire);

    return () => clearTimeout(timeout);
  }, [token, logout]);

  // Call verifyUser on component mount
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // Add axios request interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Add axios response interceptor
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;