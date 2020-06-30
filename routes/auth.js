const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth');

const router = express.Router({ mergeParams: true});

const { protect, authorize } = require('../middleware/auth');



router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, authorize(['admin']),  getMe);
router.get('/logout', logout);

module.exports = router;