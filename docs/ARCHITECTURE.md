# Architecture Overview

## Services
- Express API for business modules
- Socket.IO for realtime location, chat, and ride state
- MongoDB for transactional ride and profile data
- External integrations: Maps, OTP gateway, payment gateways, push notifications

## Security
- JWT auth + role based middleware
- Helmet, CORS, and rate limiting enabled
- Request validation with Zod
- Sensitive keys isolated in `.env`

## Scalability Notes
- Stateless API services for horizontal scaling
- Socket.IO can be scaled with Redis adapter
- Move matching and surge to background workers for high throughput
- Add caching layer (Redis) for hot geospatial lookups
