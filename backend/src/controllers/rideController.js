const { z } = require('zod');
const Ride = require('../models/Ride');
const { calculateFare } = require('../services/fareService');
const { findNearestDriver } = require('../services/matchingService');
const { sendPushNotification } = require('../services/notificationService');
const { created, ok, fail } = require('../utils/http');

const rideEstimateSchema = z.object({
  serviceType: z.enum(['BIKE', 'AUTO', 'CAB']),
  distanceKm: z.number().positive(),
  durationMin: z.number().positive(),
  demandIndex: z.number().default(1)
});

const createRideSchema = z.object({
  serviceType: z.enum(['BIKE', 'AUTO', 'CAB']),
  pickup: z.object({ address: z.string(), lat: z.number(), lng: z.number() }),
  dropoff: z.object({ address: z.string(), lat: z.number(), lng: z.number() }),
  distanceKm: z.number().positive(),
  durationMin: z.number().positive(),
  paymentMode: z.enum(['UPI', 'CARD', 'WALLET', 'CASH']).default('CASH'),
  scheduledAt: z.string().datetime().optional()
});

async function estimateFare(req, res) {
  const parsed = rideEstimateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Invalid payload');
  const fare = await calculateFare(parsed.data);
  return ok(res, fare, 'Fare estimated');
}

async function createRide(req, res) {
  const parsed = createRideSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'Invalid payload');

  const payload = parsed.data;
  const fare = await calculateFare(payload);
  const nearestDriver = await findNearestDriver({
    pickup: payload.pickup,
    serviceType: payload.serviceType
  });

  const ride = await Ride.create({
    riderId: req.user.sub,
    captainId: nearestDriver?.userId?._id,
    ...payload,
    fare,
    status: nearestDriver ? 'ACCEPTED' : 'REQUESTED',
    scheduledAt: payload.scheduledAt
  });

  if (nearestDriver?.userId?._id) {
    await sendPushNotification({
      userId: nearestDriver.userId._id,
      title: 'New ride assigned',
      body: 'A ride near your location is waiting for acceptance.',
      data: { rideId: String(ride._id) }
    });
  }

  return created(res, ride, 'Ride created');
}

async function updateRideStatus(req, res) {
  const { rideId } = req.params;
  const { status } = req.body;
  const allowed = ['ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED'];
  if (!allowed.includes(status)) return fail(res, 400, 'Invalid status');

  const ride = await Ride.findByIdAndUpdate(rideId, { status }, { new: true });
  if (!ride) return fail(res, 404, 'Ride not found');

  return ok(res, ride, 'Ride status updated');
}

async function listMyRides(req, res) {
  const query = req.user.role === 'RIDER' ? { riderId: req.user.sub } : { captainId: req.user.sub };
  const rides = await Ride.find(query).sort({ createdAt: -1 });
  return ok(res, rides, 'Ride history fetched');
}

async function getRideById(req, res) {
  const ride = await Ride.findById(req.params.id);
  if (!ride) return fail(res, 404, 'Ride not found');
  return ok(res, ride, 'Ride fetched');
}

module.exports = { estimateFare, createRide, updateRideStatus, listMyRides, getRideById };
