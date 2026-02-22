const express = require('express');
const { auth } = require('../middleware/auth');
const { estimateFare, createRide, updateRideStatus, listMyRides } = require('../controllers/rideController');

const router = express.Router();

router.post('/estimate', auth(['RIDER']), estimateFare);
router.post('/', auth(['RIDER']), createRide);
router.patch('/:rideId/status', auth(['CAPTAIN', 'ADMIN']), updateRideStatus);
router.get('/mine', auth(['RIDER', 'CAPTAIN']), listMyRides);

module.exports = router;
