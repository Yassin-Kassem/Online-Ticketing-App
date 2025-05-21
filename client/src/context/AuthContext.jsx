// Client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCurrentUser, login, logout, register, forgotPassword } from '../services/api';

// Export the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  
  const handleLogin = async (credentials) => {
  try {
    const response = await login(credentials); // Assume this returns { user, token }

    // Set user in context
    setUser(response.user);

    // Redirect and notify
    navigate('/');


    return { success: true, user: response.user };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Login failed. Please try again.';

    console.error('Login failed:', errorMessage);


    return { success: false, message: errorMessage };
  }
};

const handleRegister = async (data) => {
  try {
    const response = await register(data); // Assume this returns { user }

    console.log('Registration response:', response);

    navigate(0);

    return { success: true, user: response.user };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Registration failed. Please try again.';

    console.error('Registration failed:', errorMessage);


    return { success: false, message: errorMessage };
  }
};


  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
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
        register: handleRegister, // Ensure 'register' is included
        logout: handleLogout,
        forgotPassword: handleForgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};