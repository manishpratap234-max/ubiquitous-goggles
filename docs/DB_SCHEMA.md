# Database Schema (MongoDB)

## Collections

### `users`
- phone (unique)
- name
- role: RIDER | CAPTAIN | ADMIN
- walletBalance
- otpCode, otpExpiry
- isVerified

### `driverprofiles`
- userId -> users
- vehicleType: BIKE | AUTO | CAB
- vehicleNumber
- dl { number, imageUrl, verified }
- rc { number, imageUrl, verified }
- status: PENDING | APPROVED | REJECTED
- isOnline
- currentLocation { lat, lng, heading }

### `rides`
- riderId -> users
- captainId -> users
- serviceType
- status
- pickup/dropoff (address + lat/lng)
- distanceKm, durationMin
- fare { baseFare, distanceFare, surgeMultiplier, total }
- paymentMode/paymentStatus
- review

### `pricingconfigs`
- serviceType
- baseFare
- perKmFare
- perMinFare
- surgeThreshold
- maxSurgeMultiplier
- commissionPercent

### `promocodes`
- code
- discountType
- discountValue
- minFare
- maxDiscount
- active, expiry
