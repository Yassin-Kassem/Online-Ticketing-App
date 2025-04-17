const express = require('express');
const { getAllEvents, createEvent, deleteEvent, getDetailsOfEvent, updateEvent } = require('../controllers/eventController');
const { auth } = require('../middleware/auth');
const { validateRole, authoriseOnly } = require('../middleware/authorisationMiddleware');
const router = express.Router();


router.get("/", getAllEvents);
router.put("/:id", auth , authoriseOnly(["Organizer", "System Admin"]), updateEvent);
router.get("/:id",getDetailsOfEvent);
router.post("/", auth , authoriseOnly(["Organizer"]) ,createEvent);
router.delete("/:id", auth , authoriseOnly(["Organizer", "System Admin"]), deleteEvent);
module.exports = router;