const express = require('express');
const router = express.Router();
const {
    
    createBooking,
    
    deleteBooking,
    getBooking,
  } = require("../controllers/BookingController");
const { authoriseOnly } = require('../middleware/authorisationMiddleware');
const {auth} = require('../middleware/auth');




router.post('/', auth, createBooking);


router.get('/:id', auth,  getBooking);


router.delete('/:id', auth,  deleteBooking);

module.exports = router;