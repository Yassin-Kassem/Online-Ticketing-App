const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, profilePicture, role } = req.body;

  try {
    // Check if email is already taken
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    // Validate role (optional, defaults to 'user')
    const validRoles = ['Standard User', 'Organizer', 'System Admin'];
    const userRole = validRoles.includes(role) ? role : 'user';

    // Create new user
    user = new User({
      email,
      password,
      name,
      profilePicture: profilePicture || 'default-profile-picture.png',
      role: userRole,
    });

    // Save user (password is hashed automatically via schema)
    await user.save();

    // Generate JWT
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};