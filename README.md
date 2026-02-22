# Ride Hailing Super App (Rapido-like)

Production-ready monorepo containing:
- **Rider mobile app** (Expo React Native)
- **Captain mobile app** (Expo React Native)
- **Admin dashboard** (React + Vite)
- **Backend API + Realtime services** (Node.js + Express + MongoDB + Socket.IO)

## Project Structure

- `backend` — REST API, Socket.IO matching, auth, fares, lifecycle
- `apps/rider-app` — customer app
- `apps/captain-app` — driver app
- `apps/admin-dashboard` — operations dashboard
- `docs` — API docs, DB schema, architecture

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables using `.env.example` files.
3. Start services:
   ```bash
   npm run dev:backend
   npm run dev:admin
   npm run dev:rider
   npm run dev:captain
   ```

Detailed setup: [`docs/SETUP.md`](docs/SETUP.md).


## Build a Proper Production App

If you want to turn this scaffold into a real, launch-ready product, follow the implementation playbook:

- [`docs/PROPER_APP_GUIDE.md`](docs/PROPER_APP_GUIDE.md)
- [`docs/PROPER_APP_GUIDE.html`](docs/PROPER_APP_GUIDE.html)

This guide provides phased milestones, must-have launch checklist, and exact next implementation steps.
