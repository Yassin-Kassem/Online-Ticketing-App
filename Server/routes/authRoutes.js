const express = require('express');
const { registerUser, loginUser, LogoutUser, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", auth, verifyOTP);
router.post("/resetPassword", auth, resetPassword);
router.get('/logout', auth, LogoutUser);


module.exports = router;