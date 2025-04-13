const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

// Routes for authenticated users
router.get('/profile', protect, getProfile);      // Get current user's profile
router.put('/profile', protect, updateProfile);   // Update current user's profile

// Admin-only routes
router.get('/users', protect, admin, getUsers);        // Get all users
router.get('/users/:id', protect, admin, getUserById);  // Get a single user by ID
router.put('/users/:id', protect, admin, updateUserRole); // Update user's role
router.delete('/users/:id', protect, admin, deleteUser); // Delete a user

module.exports = router;