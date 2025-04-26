const express = require('express');
const router = express.Router();
const { register, login } = require('../../interfaces/controllers/authController');

router.post('/register', register);
router.post('/login', login);
module.exports = router;