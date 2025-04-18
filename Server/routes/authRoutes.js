const express = require('express');
const { registerUser, loginUser, LogoutUser, forgotPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', auth, LogoutUser);
router.post("/forgetPassword", forgotPassword);

module.exports = router;