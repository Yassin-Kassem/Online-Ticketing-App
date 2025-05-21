const express = require('express');
const { getProfile, UpdateProfile,getAllUsers, getUserById, updateUserRole, deleteUser, getUserBookings, getUserEvents,userEventAnalytics} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateRole, authoriseOnly } = require('../middleware/authorisationMiddleware');
const router = express.Router();

router.put('/profile', auth, UpdateProfile);
router.get("/profile", auth, getProfile);
router.get("/events/analytics", auth, authoriseOnly(['Organizer']), getUserEvents); // Assuming this is the correct route for user event analytics
router.get("/", /*auth,*/ /*authoriseOnly(['System Admin']),*/  getAllUsers);
router.get("/bookings", auth, authoriseOnly(['Standard User']), getUserBookings);
router.get("/events", auth, authoriseOnly(['Organizer']), getUserEvents);
router.get("/:id", auth , authoriseOnly(['System Admin']), getUserById);
router.put("/:id", auth, validateRole, authoriseOnly(['System Admin']), updateUserRole);
router.delete("/:id", auth, authoriseOnly(['System Admin']), deleteUser);

module.exports = router;