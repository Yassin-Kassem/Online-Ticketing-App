const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

// Routes for authenticated users
router.get('/ap1/v1/users/profile', protect, getProfile);      // Get current user's profile
router.put('/ap1/v1/profile', protect, updateProfile);   // Update current user's profile

// Admin-only routes
router.get('/api/v1/users', protect, admin, getUsers);        // Get all users
router.get('/ap1/v1/users/:id', protect, admin, getUserById);  // Get a single user by ID
router.put('/ap1/v1/users/:id', protect, admin, updateUserRole); // Update user's role
router.delete('/ap1/v1/users/:id', protect, admin, deleteUser); // Delete a user

module.exports = router;