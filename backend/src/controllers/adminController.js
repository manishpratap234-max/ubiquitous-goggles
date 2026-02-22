const User = require('../models/User');
const DriverProfile = require('../models/DriverProfile');
const Ride = require('../models/Ride');
const PricingConfig = require('../models/PricingConfig');
const { ok } = require('../utils/http');

async function dashboardStats(req, res) {
  const [users, captains, pendingDrivers, liveRides] = await Promise.all([
    User.countDocuments({ role: 'RIDER' }),
    User.countDocuments({ role: 'CAPTAIN' }),
    DriverProfile.countDocuments({ status: 'PENDING' }),
    Ride.countDocuments({ status: { $in: ['REQUESTED', 'ACCEPTED', 'ONGOING'] } })
  ]);

  return ok(res, { users, captains, pendingDrivers, liveRides }, 'Admin stats');
}

async function updatePricing(req, res) {
  const { serviceType, ...rest } = req.body;
  const config = await PricingConfig.findOneAndUpdate(
    { serviceType },
    { serviceType, ...rest },
    { upsert: true, new: true }
  );

  return ok(res, config, 'Pricing updated');
}

async function approveDriver(req, res) {
  const { driverProfileId } = req.params;
  const profile = await DriverProfile.findByIdAndUpdate(
    driverProfileId,
    { status: 'APPROVED', 'dl.verified': true, 'rc.verified': true },
    { new: true }
  );

  return ok(res, profile, 'Driver approved');
}

module.exports = { dashboardStats, updatePricing, approveDriver };
