const DriverProfile = require('../models/DriverProfile');
const { created, ok } = require('../utils/http');

async function registerCaptain(req, res) {
  const profile = await DriverProfile.findOneAndUpdate(
    { userId: req.user.sub },
    { ...req.body, userId: req.user.sub },
    { upsert: true, new: true }
  );

  return created(res, profile, 'Driver profile submitted');
}

async function setOnlineStatus(req, res) {
  const { isOnline, currentLocation } = req.body;
  const profile = await DriverProfile.findOneAndUpdate(
    { userId: req.user.sub },
    { isOnline, currentLocation },
    { new: true }
  );

  return ok(res, profile, 'Online status updated');
}

module.exports = { registerCaptain, setOnlineStatus };
