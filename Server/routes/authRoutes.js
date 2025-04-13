const express = require('express');
const { login, register } = require('../controllers/authcontroller');
const router = express.Router();

router.post('/api/v1/register', register);
router.post('/api/v1/login', login);

module.exports = router;