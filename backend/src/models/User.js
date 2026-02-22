const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: String,
    role: { type: String, enum: ['RIDER', 'CAPTAIN', 'ADMIN'], required: true },
    avatarUrl: String,
    walletBalance: { type: Number, default: 0 },
    otpCode: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
