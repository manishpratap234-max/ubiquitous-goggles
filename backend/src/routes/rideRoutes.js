const express = require('express');
const { auth } = require('../middleware/auth');
const { estimateFare, createRide, updateRideStatus, listMyRides, getRideById } = require('../controllers/rideController');

const router = express.Router();

router.post('/estimate', auth(['RIDER']), estimateFare);
router.post('/', auth(['RIDER']), createRide);
router.post('/book', auth(['RIDER']), createRide);
router.get('/history', auth(['RIDER', 'CAPTAIN']), listMyRides);
router.get('/mine', auth(['RIDER', 'CAPTAIN']), listMyRides);
router.get('/:id', auth(['RIDER', 'CAPTAIN', 'ADMIN']), getRideById);
router.patch('/:rideId/status', auth(['CAPTAIN', 'ADMIN']), updateRideStatus);

module.exports = router;
