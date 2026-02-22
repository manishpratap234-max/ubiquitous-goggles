# Ride Hailing MVP (Rapido-like)

UI-first Expo React Native app that demonstrates a complete mock ride booking flow for riders and a basic captain dashboard.

## Features

- Rider auth (phone + OTP mock)
- Home screen with mock map and pickup/drop input
- Ride options (Bike/Auto/Cab) with fare estimates
- Ride flow: confirm → searching → driver assigned → trip status progression
- Captain UI: login, online/offline toggle, ride request card, accept/reject, start/end trip

## Tech Stack

- Expo + React Native + TypeScript
- React Navigation (Native Stack)
- NativeWind
- Expo Vector Icons

## Folder Structure

```text
.
├── App.tsx
├── src
│   ├── components
│   │   └── RideOptionCard.tsx
│   ├── data
│   │   └── mock.ts
│   └── types.ts
├── tailwind.config.js
└── babel.config.js
```

## Run Locally

```bash
npm install
npm run start
```
