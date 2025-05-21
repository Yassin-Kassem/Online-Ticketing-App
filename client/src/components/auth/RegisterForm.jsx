// Client/src/components/auth/RegisterForm.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './register.css';

const RegisterForm = () => {
  const context = useContext(AuthContext);
  console.log('AuthContext in RegisterForm:', context);

  const { register, login } = context || {};
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  // Handle input changes for both forms
  const handleRegisterChange = (e) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  // Handle registration submission
  const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  if (registerFormData.password !== registerFormData.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }
  setLoading(true);
  const { confirmPassword, ...data } = registerFormData;
  console.log('Register form data:', data); // Debug payload
  try {
    const result = await register(data);
    if (result.success) {
      toast.success('Registration successful! Redirecting to login...');
      setRegisterFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'standard user' });
      setTimeout(() => navigate('/register'), 2000);
    } else {
      toast.error(result.message || 'Registration failed');
    }
  } catch (error) {
    toast.error(error.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};

  // Handle login submission
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  if (!loginFormData.email || !loginFormData.password) {
    toast.error('Please fill in all fields');
    return;
  }
  setLoading(true);
  try {
    console.log('Submitting login:', loginFormData); // Debug form data
    const result = await login(loginFormData);
    if (result.success) {
      toast.success('Login successful! Redirecting...');
      setLoginFormData({ email: '', password: '' }); // Reset form
      setTimeout(() => navigate('/'), 2000);
    } else {
      toast.error(result.message || 'Login failed');
    }
  } catch (error) {
    toast.error(error.message || 'An error occurred');
  } finally {
    setLoading(false);
  };
};

  // Safely add event listeners after DOM mounts
  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = containerRef.current;

    const handleSignUp = () => {
      setIsSignUp(true);
    };

    const handleSignIn = () => {
      setIsSignUp(false);
    };

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', handleSignUp);
      signInButton.addEventListener('click', handleSignIn);
    }

    // Cleanup to avoid memory leaks
    return () => {
      if (signUpButton && signInButton && container) {
        signUpButton.removeEventListener('click', handleSignUp);
        signInButton.removeEventListener('click', handleSignIn);
      }
    };
  }, []);

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container" ref={containerRef}>
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Create Account</h1>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={registerFormData.name}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerFormData.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerFormData.password}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={registerFormData.confirmPassword}
            onChange={handleRegisterChange}
            required
          />
          <select
            name="role"
            value={registerFormData.role}
            onChange={handleRegisterChange}
            className='dropdown' 
          >
            <option value="Standard User">Standard User</option>
            <option value="Organizer">Organizer</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginFormData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginFormData.password}
            onChange={handleLoginChange}
            required
          />
          <Link to="/forgot-password" className="link">
            Forgot your password?
          </Link>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn">Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;