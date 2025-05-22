import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser, login, logout, register, forgotPassword } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      setUser(response.data);
      navigate('/');
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred during login';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const handleRegister = async (data) => {
    try {
      const response = await register(data);
      console.log('Registration response:', response.data);
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred during registration';
      console.error('Registration failed:', error);
      return { success: false, message: errorMessage };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/register');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error.message);
      toast.error('Logout failed: ' + error.message);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      await forgotPassword({ email });
      toast.success('Password reset link sent!');
      return { success: true, message: 'Password reset link sent!' };
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        forgotPassword: handleForgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};