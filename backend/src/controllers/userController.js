const { z } = require('zod');
const User = require('../models/User');
const { ok, fail } = require('../utils/http');

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional()
});

async function getProfile(req, res) {
  const user = await User.findById(req.user.sub).select('-otpCode -otpExpiry');
  if (!user) return fail(res, 404, 'User not found');
  return ok(res, user, 'Profile fetched');
}

async function updateProfile(req, res) {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Invalid payload');

  const user = await User.findByIdAndUpdate(req.user.sub, { $set: parsed.data }, { new: true }).select(
    '-otpCode -otpExpiry'
  );

  if (!user) return fail(res, 404, 'User not found');
  return ok(res, user, 'Profile updated');
}

module.exports = { getProfile, updateProfile };
