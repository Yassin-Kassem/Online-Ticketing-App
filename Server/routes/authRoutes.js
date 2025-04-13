const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/api/v1/register', register);
router.post('/api/v1/login', login);

module.exports = router;