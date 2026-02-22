# Setup Instructions

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB 6+
- Expo Go app (for mobile testing)

## 1) Install dependencies
```bash
npm install
```

## 2) Configure environment files
- `backend/.env` from `backend/.env.example`
- `apps/rider-app/.env` from `apps/rider-app/.env.example`
- `apps/captain-app/.env` from `apps/captain-app/.env.example`
- `apps/admin-dashboard/.env` from `apps/admin-dashboard/.env.example`

## 3) Start backend
```bash
npm run dev:backend
```

## 4) Start apps
```bash
npm run dev:admin
npm run dev:rider
npm run dev:captain
```

## Notes
- OTP service currently uses a static code (`123456`) for local development.
- Integrate Twilio/MSG91 before production.
- Replace placeholder bearer tokens in frontend services with secure auth storage.
