const DriverProfile = require('../models/DriverProfile');
const { ok } = require('../utils/http');

async function nearbyDrivers(req, res) {
  const { lat, lng, serviceType } = req.query;
  const hasLocation = lat !== undefined && lng !== undefined;

  const query = { isOnline: true, status: 'APPROVED' };
  if (serviceType) query.vehicleType = serviceType;

  const drivers = await DriverProfile.find(query)
    .populate('userId', 'name phone')
    .limit(20)
    .lean();

  const mapped = drivers.map((driver) => ({
    id: String(driver._id),
    name: driver.userId?.name || 'Driver',
    phone: driver.userId?.phone || '',
    rating: driver.rating || 4.8,
    vehicleType: driver.vehicleType,
    vehicleNumber: driver.vehicleNumber,
    location:
      driver.currentLocation && hasLocation
        ? driver.currentLocation
        : {
            lat: Number(lat || 12.9716) + (Math.random() - 0.5) * 0.01,
            lng: Number(lng || 77.5946) + (Math.random() - 0.5) * 0.01,
            heading: 0
          }
  }));

  return ok(res, mapped, 'Nearby drivers fetched');
}

module.exports = { nearbyDrivers };
