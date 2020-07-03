const express = require('express');
const { register, login, getMe, logout, getRolebyId } = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');



router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, authorize(['user', 'admin']),  getMe);
router.get('/logout', logout);
router.post('/:id', protect, authorize(['user', 'admin']), getRolebyId)

module.exports = router;