const { get } = require('mongoose');
const User = require('../models/UserModel');




  module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
  }
