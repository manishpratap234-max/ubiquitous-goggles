const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    captainId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceType: { type: String, enum: ['BIKE', 'AUTO', 'CAB'], required: true },
    status: {
      type: String,
      enum: ['REQUESTED', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED'
    },
    pickup: { address: String, lat: Number, lng: Number },
    dropoff: { address: String, lat: Number, lng: Number },
    distanceKm: Number,
    durationMin: Number,
    fare: {
      baseFare: Number,
      distanceFare: Number,
      surgeMultiplier: Number,
      total: Number
    },
    scheduledAt: Date,
    paymentMode: { type: String, enum: ['UPI', 'CARD', 'WALLET', 'CASH'], default: 'CASH' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    otpStartCode: String,
    review: {
      rating: Number,
      comment: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
