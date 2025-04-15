const express = require('express');
const { getAllUsers, registerUser, loginUser, LogoutUser} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get("/", auth, getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', LogoutUser);

module.exports = router;