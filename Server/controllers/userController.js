const User = require('../models/User');

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update current user's profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if new email is taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      user.email = email;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    await user.save();
    res.json({ email: user.email, name: user.name, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get list of all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  // Get details of a single user (Admin only)
  exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Invalid user ID' });
      }
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  // Update user's role (Admin only)
  exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
  
    try {
      const validRoles = ['user', 'organizer', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: 'Invalid role' });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Prevent admin from demoting themselves
      if (user._id.toString() === req.user.id && role !== 'admin') {
        return res.status(403).json({ msg: 'Cannot change your own role' });
      }
  
      user.role = role;
      await user.save();
  
      res.json({ email: user.email, name: user.name, role: user.role });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Invalid user ID' });
      }
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  // Delete a user (Admin only)
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user.id) {
        return res.status(403).json({ msg: 'Cannot delete your own account' });
      }
  
      await User.deleteOne({ _id: req.params.id });
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Invalid user ID' });
      }
      res.status(500).json({ msg: 'Server error' });
    }
  };