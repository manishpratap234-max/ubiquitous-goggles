const mongoose = require('mongoose');

const pricingConfigSchema = new mongoose.Schema(
  {
    serviceType: { type: String, enum: ['BIKE', 'AUTO', 'CAB'], unique: true },
    baseFare: Number,
    perKmFare: Number,
    perMinFare: Number,
    surgeThreshold: Number,
    maxSurgeMultiplier: Number,
    commissionPercent: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingConfig', pricingConfigSchema);
