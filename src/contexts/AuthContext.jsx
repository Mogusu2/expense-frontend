// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/api/login', credentials);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get('/api/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data.user);
      } catch (error) {
        logout();
      }
    };
    if (token) verifyUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);