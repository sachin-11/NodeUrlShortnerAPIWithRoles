const express = require('express');
const {createRoles } = require('../controllers/roles');
const router = new express.Router();
const { protect }  = require('../middleware/auth'); 


router.route('/').post(createRoles)

module.exports = router

