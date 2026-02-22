const express = require('express');
const { auth } = require('../middleware/auth');
const { nearbyDrivers } = require('../controllers/driverController');

const router = express.Router();

router.get('/nearby', auth(['RIDER', 'ADMIN']), nearbyDrivers);

module.exports = router;
