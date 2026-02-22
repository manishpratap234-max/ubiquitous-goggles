const DriverProfile = require('../models/DriverProfile');

function calculateDistance(a, b) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy) * 111;
}

async function findNearestDriver({ pickup, serviceType }) {
  const onlineDrivers = await DriverProfile.find({
    isOnline: true,
    vehicleType: serviceType,
    status: 'APPROVED'
  }).populate('userId');

  if (!onlineDrivers.length) return null;

  const ranked = onlineDrivers
    .filter((driver) => driver.currentLocation?.lat && driver.currentLocation?.lng)
    .map((driver) => ({
      driver,
      distance: calculateDistance(pickup, driver.currentLocation)
    }))
    .sort((a, b) => a.distance - b.distance);

  return ranked[0]?.driver || null;
}

module.exports = { findNearestDriver };
