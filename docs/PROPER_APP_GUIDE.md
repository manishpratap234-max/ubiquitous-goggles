# How to Build a Proper Production App From This Scaffold

This repository is a **starter architecture**, not a finished Rapido/Uber clone. Use this guide to transform it into a real production system in phases.

---

## 0) What “proper app” means

A proper ride-hailing app is not only screens + APIs. It must include:
- Reliable OTP login with anti-abuse controls
- Accurate maps, routing, ETA and fare
- Strong dispatch/matching under load
- Crash-safe ride lifecycle + reconciliation
- Real payments + refunds + webhooks
- Driver KYC workflow and audit trail
- Observability, alerts, backups, and CI/CD
- Security hardening and compliance

---

## 1) Phase 1 (Week 1–2): Foundation Hardening

## Backend
1. Replace static OTP:
   - Integrate Twilio/MSG91 provider in `authController`.
   - Store hashed OTP, not plain OTP.
   - Add resend cooldown and attempt limits.
2. Add request validation for all mutating routes.
3. Add structured logging (`pino`) and request IDs.
4. Add global error taxonomy (validation, auth, business, infra).
5. Add Mongo indexes:
   - `User.phone` unique
   - `Ride.riderId`, `Ride.captainId`, `Ride.status`, `Ride.createdAt`
   - Geospatial index for captain current location (move to GeoJSON).

## Frontend apps
1. Implement auth storage:
   - Rider/Captain: secure token in `expo-secure-store`.
   - Admin: token/session with refresh flow.
2. Add API interceptors (401 refresh, retries for idempotent calls).
3. Add real design system (spacing, colors, typography, components).

## Ops
1. Dockerize backend + admin.
2. Use `.env` per environment + secret manager.
3. Add CI pipeline:
   - lint, test, build, security scans.

---

## 2) Phase 2 (Week 3–4): Real Ride Booking Core

1. Integrate Google services:
   - Places autocomplete
   - Distance Matrix / Routes API
   - Geocoding
2. Replace simplistic distance formula in matching with geospatial query:
   - Store driver location as GeoJSON Point.
   - Use `$near` with max radius + ETA scoring.
3. Enforce ride state machine:
   - `REQUESTED -> ASSIGNED -> ACCEPTED -> ARRIVED -> ONGOING -> COMPLETED`
   - Allowed transitions only.
4. Add cancellation policy:
   - Free window, cancellation charges, captain compensation.
5. Build retry-safe dispatch process:
   - If driver times out/rejects, fan-out to next candidates.

---

## 3) Phase 3 (Week 5–6): Payments, Wallet, Promo

1. Integrate Stripe/Razorpay end-to-end:
   - Create payment intent/order at ride completion.
   - Webhook verification.
   - Idempotency keys.
2. Wallet ledger model (credit/debit with immutable entries).
3. Promo engine:
   - First ride, user segment rules, expiry windows, max caps.
4. Invoice generation:
   - PDF/email + GST fields if needed.

---

## 4) Phase 4 (Week 7–8): Captain KYC + Admin Power Tools

1. KYC pipeline:
   - File uploads to object storage (S3/GCS)
   - Document OCR + manual review states
   - Rejection reason tracking.
2. Admin tools:
   - Live map of active rides/captains
   - Dynamic pricing controls
   - Commission and payout settings
   - Fraud flags and user/driver suspension.
3. Earnings and payout:
   - Daily settlement jobs
   - Weekly payout statements

---

## 5) Phase 5: Reliability + Scale

1. Move realtime scaling to Redis adapter for Socket.IO.
2. Add background workers (BullMQ):
   - Matching retries
   - Notifications
   - Scheduled rides
   - Settlement jobs.
3. Add caching (Redis) for hot geospatial lookups.
4. Add load tests for dispatch and socket fan-out.

---

## 6) Minimum feature checklist before launch (MVP+)

- [ ] OTP with real provider, abuse prevention
- [ ] Token refresh + secure storage
- [ ] Place search + route ETA + fare estimate
- [ ] Driver assignment with retry logic
- [ ] Live location updates every 2–4s
- [ ] Ride lifecycle with guarded transitions
- [ ] Payment collection + webhook reconciliation
- [ ] Rider/captain chat + masked calling
- [ ] SOS flow + emergency contacts
- [ ] Rating and support ticketing
- [ ] Admin KYC approval and suspension tools
- [ ] Monitoring dashboards + on-call alerts

---

## 7) Suggested production architecture

- **API Layer:** Express services (auth, rides, pricing, payments)
- **Realtime Layer:** Socket.IO gateway + Redis adapter
- **Workers:** BullMQ consumers for async workflows
- **DB:** MongoDB replica set with indexes and backups
- **Cache:** Redis
- **Storage:** S3/GCS for documents and invoices
- **Notifications:** FCM + SMS provider
- **Observability:** OpenTelemetry + Grafana + alerting

---

## 8) Exactly what to implement first in this repo

1. Backend: OTP provider + ride state machine + geospatial driver lookup.
2. Rider app: auth flow, pickup/drop search, confirm booking, live tracking screen.
3. Captain app: incoming request screen with timer, navigation deep-link, trip actions.
4. Admin dashboard: login, KYC queue, pricing CRUD, live rides table.
5. Tests: API integration tests for auth, booking, ride transitions, and payment webhook.

If you execute the phases in order, this scaffold becomes a proper production-grade ride-hailing platform.
