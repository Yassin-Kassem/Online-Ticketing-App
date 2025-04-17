const express = require('express');
const { getAllUsers, registerUser, loginUser, LogoutUser, forgotPassword, getUserById, updateUserRole, deleteUser} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateRole, authoriseOnly } = require('../middleware/authorisationMiddleware');
const router = express.Router();

router.get("/", auth, getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', LogoutUser);
router.post("/forgetPassword", forgotPassword);
router.get("/:id", getUserById);
router.put("/:id", validateRole, updateUserRole);
router.delete("/:id", auth, authoriseOnly(['System Admin']), deleteUser);

module.exports = router;