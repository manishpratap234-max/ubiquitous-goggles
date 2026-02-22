const express = require('express');
const { auth } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', auth(['RIDER', 'CAPTAIN', 'ADMIN']), getProfile);
router.put('/profile', auth(['RIDER', 'CAPTAIN', 'ADMIN']), updateProfile);

module.exports = router;
