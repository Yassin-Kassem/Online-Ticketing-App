const express = require('express');
const { getAllUsers, getUserById, updateUserRole, deleteUser} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateRole, authoriseOnly } = require('../middleware/authorisationMiddleware');
const router = express.Router();

router.get("/", auth, /*authoriseOnly(['System Admin']),*/  getAllUsers);
router.get("/:id", auth , authoriseOnly(['System Admin']), getUserById);
router.put("/:id", auth, validateRole, authoriseOnly(['System Admin']), updateUserRole);
router.delete("/:id", auth, authoriseOnly(['System Admin']), deleteUser);

module.exports = router;