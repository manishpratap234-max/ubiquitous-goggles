const PricingConfig = require('../models/PricingConfig');

async function calculateFare({ serviceType, distanceKm, durationMin, demandIndex = 1 }) {
  const config = await PricingConfig.findOne({ serviceType });
  if (!config) throw new Error(`Pricing config missing for ${serviceType}`);

  const surgeMultiplier = demandIndex > config.surgeThreshold
    ? Math.min(config.maxSurgeMultiplier, 1 + (demandIndex - config.surgeThreshold) * 0.2)
    : 1;

  const distanceFare = distanceKm * config.perKmFare;
  const durationFare = durationMin * config.perMinFare;
  const subtotal = config.baseFare + distanceFare + durationFare;
  const total = Number((subtotal * surgeMultiplier).toFixed(2));

  return {
    baseFare: config.baseFare,
    distanceFare: Number((distanceFare + durationFare).toFixed(2)),
    surgeMultiplier: Number(surgeMultiplier.toFixed(2)),
    total
  };
}

module.exports = { calculateFare };
