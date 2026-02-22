const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const { jwtSecret, jwtExpiry } = require('../config/env');
const { created, ok, fail } = require('../utils/http');

const requestOtpSchema = z.object({
  phone: z.string().min(10),
  role: z.enum(['RIDER', 'CAPTAIN', 'ADMIN']).default('RIDER'),
  name: z.string().min(2)
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6)
});

async function requestOtp(req, res) {
  const parsed = requestOtpSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Invalid payload');

  const { phone, role, name } = parsed.data;
  const otpCode = '123456';
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.findOneAndUpdate(
    { phone },
    { $set: { phone, role, name, otpCode, otpExpiry } },
    { upsert: true, new: true }
  );

  return created(res, { phone: user.phone, otp: otpCode }, 'OTP generated');
}

async function verifyOtp(req, res) {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Invalid payload');

  const { phone, otp } = parsed.data;
  const user = await User.findOne({ phone });

  if (!user || user.otpCode !== otp || user.otpExpiry < new Date()) {
    return fail(res, 401, 'Invalid or expired OTP');
  }

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign({ sub: user._id, role: user.role, phone: user.phone }, jwtSecret, {
    expiresIn: jwtExpiry
  });

  return ok(res, { token, user }, 'Login success');
}

module.exports = { requestOtp, verifyOtp };
