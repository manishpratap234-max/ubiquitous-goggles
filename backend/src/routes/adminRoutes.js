const express = require('express');
const { auth } = require('../middleware/auth');
const { dashboardStats, updatePricing, approveDriver } = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', auth(['ADMIN']), dashboardStats);
router.put('/pricing', auth(['ADMIN']), updatePricing);
router.patch('/drivers/:driverProfileId/approve', auth(['ADMIN']), approveDriver);

module.exports = router;
