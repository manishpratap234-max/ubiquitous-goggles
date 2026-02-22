const express = require('express');
const { auth } = require('../middleware/auth');
const { registerCaptain, setOnlineStatus } = require('../controllers/captainController');

const router = express.Router();

router.post('/profile', auth(['CAPTAIN']), registerCaptain);
router.patch('/online-status', auth(['CAPTAIN']), setOnlineStatus);

module.exports = router;
