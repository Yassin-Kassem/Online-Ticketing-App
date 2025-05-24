import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1', 
  withCredentials: true, 
});

// Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Auth API methods
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const logout = () => api.get('/logout');
export const forgotPassword = (data) => api.post('/forgotPassword', data);
export const verifyOTP = (data) => api.post('/verifyOtp', data);
export const resetPassword = (data) => api.post('/resetPassword', data);
export const getCurrentUser = () => api.get('/users/profile');

// User API Methods
export const getAllUsers = () => api.get('/users')
export const deleteUser = (id) => api.delete(`/users/${id}`);


// Event API Methods
export const getAllEvents = () => api.get('/events/all');
export const getApprovedEvents = () => api.get('/events/')

export default api;