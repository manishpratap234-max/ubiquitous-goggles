const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    discountType: { type: String, enum: ['PERCENT', 'FLAT'] },
    discountValue: Number,
    minFare: Number,
    maxDiscount: Number,
    active: { type: Boolean, default: true },
    expiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromoCode', promoCodeSchema);
