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
router.get('/', protect, admin, getUsers);        // Get all users
router.get('/:id', protect, admin, getUserById);  // Get a single user by ID
router.put('/:id', protect, admin, updateUserRole); // Update user's role
router.delete('/:id', protect, admin, deleteUser); // Delete a user

module.exports = router;