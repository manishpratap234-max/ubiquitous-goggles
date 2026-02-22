const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  number: String,
  imageUrl: String,
  verified: { type: Boolean, default: false }
});

const driverProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vehicleType: { type: String, enum: ['BIKE', 'AUTO', 'CAB'], required: true },
    vehicleNumber: String,
    dl: documentSchema,
    rc: documentSchema,
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    isOnline: { type: Boolean, default: false },
    currentLocation: {
      lat: Number,
      lng: Number,
      heading: Number
    },
    rating: { type: Number, default: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DriverProfile', driverProfileSchema);
