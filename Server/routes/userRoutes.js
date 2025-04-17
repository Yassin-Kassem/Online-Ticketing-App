const express = require('express');
const { getAllUsers, registerUser, loginUser, LogoutUser, forgotPassword, getUserById, updateUserRole, deleteUser} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateRole, authoriseOnly } = require('../middleware/authorisationMiddleware');
const router = express.Router();

router.get("/", auth, authoriseOnly(['System Admin']),  getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', auth, LogoutUser);
router.post("/forgetPassword", forgotPassword);
router.get("/:id", auth , authoriseOnly(['System Admin']), getUserById);
router.put("/:id", auth, validateRole, authoriseOnly(['System Admin']), updateUserRole);
router.delete("/:id", auth, authoriseOnly(['System Admin']), deleteUser);

module.exports = router;