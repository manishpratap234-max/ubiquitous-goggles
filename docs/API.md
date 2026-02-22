# API Documentation

Base URL: `/api`

## Auth
- `POST /auth/request-otp`
  - Body: `{ phone, role, name }`
- `POST /auth/verify-otp`
  - Body: `{ phone, otp }`
  - Returns JWT

## Rider
- `POST /rides/estimate` (RIDER)
- `POST /rides` (RIDER)
- `GET /rides/mine` (RIDER/CAPTAIN)

## Captain
- `POST /captain/profile` (CAPTAIN)
- `PATCH /captain/online-status` (CAPTAIN)

## Ride Lifecycle
`REQUESTED -> ACCEPTED -> ONGOING -> COMPLETED`

Cancelable states:
- Rider/Captain can mark `CANCELLED` based on product rules.

## Admin
- `GET /admin/stats` (ADMIN)
- `PUT /admin/pricing` (ADMIN)
- `PATCH /admin/drivers/:driverProfileId/approve` (ADMIN)

## Realtime Events (Socket.IO)
- `join:user` room registration
- `driver:location:update`
- `ride:status:update`
- `chat:message`
