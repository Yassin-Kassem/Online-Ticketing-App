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
export const getAllUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateProfile = (data) => api.put('/users/profile', data);
export const updateUserRole = (id, data) => api.put(`/users/${id}`, data);


// Event API Methods
export const getAllEvents = () => api.get('/events/all');
export const getApprovedEvents = () => api.get('/events/');
export const getDetailsOfEvent = (id) => api.get(`/events/${id}`);
export const updateStatus = (id, data) => api.put(`/events/status/${id}`, data);
export const getUserEvents = () => api.get('/users/events');
export const deleteEvent = (id) => api.delete(`events/${id}`);
export const createEvent = (data) => api.post('/events', data)
export const getUserEventAnalytics = (data) => api.get('/users/events/analytics', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);

// Booking API Methods
export const createBooking = (data) => api.post('/bookings/', data);
export const deleteBooking  = (id) => api.delete(`/bookings/${id}`);
export const getBookings = () => api.get('/users/bookings');
export const getBookingDetails = (id) => api.get(`/bookings/${id}`);

export default api;