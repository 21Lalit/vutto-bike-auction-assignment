# Architecture and Design Document

## System Overview

`vutto-bike-auction-assignment` is a full-stack used-bike auction platform for Vutto-style motorcycle auctions. It supports buyer browsing, realtime bidding, buyer dashboards, seller lead intake, admin lifecycle management, and production-oriented observability/security basics.

## Stack

- Frontend: React, TypeScript, Vite, React Router, Socket.IO client
- Backend: Node.js, Express, TypeScript, Socket.IO
- Database: Prisma with SQLite locally and PostgreSQL schema for production
- Auth: JWT, bcrypt password hashing, role-based access control
- Validation: Zod
- Security/infra: Helmet, CORS allowlist, rate limiting, centralized error handling
- Observability: Pino HTTP logging, request IDs, health/readiness, Prometheus-style metrics
- Tests: Vitest

## High-Level Architecture

```text
Browser
  |
  | React/Vite frontend
  | - buyer/admin/seller routes
  | - Socket.IO client for live bidding
  |
Express API
  |
  | REST endpoints
  | - auth
  | - auctions
  | - bikes
  | - bids
  | - users
  | - watchlist
  | - requests
  | - seller leads
  |
Domain Services
  |
  | auctionRules.ts
  | auctions.service.ts
  |
Prisma ORM
  |
SQLite locally / PostgreSQL in production
```

## Core Domain Model

- `User`: buyer/admin identity and role.
- `Bike`: motorcycle listing, images, pricing, condition, location, and structured inspection details.
- `Auction`: lifecycle state, start/end time, current bid, winner, minimum increment.
- `Bid`: immutable bid records tied to users and auctions.
- `WatchlistItem`: saved auctions for buyers.
- `InspectionRequest`: buyer requests for inspection, test ride, or video call.
- `SellerLead`: intake flow for owners who want to sell bikes.

## Auction Lifecycle

Supported states:

```text
DRAFT -> SCHEDULED -> LIVE -> ENDED
                     -> CANCELLED
```

Lifecycle rules are enforced server-side:

- Bids are accepted only when the effective auction status is `LIVE`.
- Late bids are rejected.
- Under-minimum bids are rejected.
- Minimum bid increment is enforced.
- Winner selection uses highest valid bid and reserve-price checks.
- Scheduled/live auctions are synchronized through a lifecycle service.

## Realtime Design

Socket.IO is used for realtime bidding:

- Each auction uses an auction-specific room.
- Viewers join `auction:{id}` rooms.
- New bids broadcast current bid and bid history updates.
- Auction lifecycle updates broadcast status changes.

For horizontal scaling, use a Redis Socket.IO adapter so multiple API instances share room events.

## API Design

REST resources are grouped by domain:

- `/api/auth`
- `/api/auctions`
- `/api/bikes`
- `/api/users`
- `/api/watchlist`
- `/api/requests`
- `/api/sell`

Routes use Zod validation and centralized error responses with request IDs.

## Frontend Design

The UI is optimized around buyer confidence and minimum-click navigation:

- Card-first auction browsing.
- Full-card clickable auction cards.
- Filters for status, brand, location, price, and keyword.
- Auction detail page with carousel, bid panel, bid history, rules, payment planner, request support, and vehicle dossier.
- Dashboard separation for active, won, and lost auctions.
- Admin dashboard for users, bikes, auctions, seller leads, requests, and lifecycle controls.

## Observability

- `/health/live`: liveness.
- `/health/ready`: readiness with database check.
- `/metrics`: request counters and duration summaries.
- `x-request-id`: request correlation.
- Pino logs for HTTP requests and server errors.

## Production Scaling Path

- Use PostgreSQL instead of SQLite.
- Use Redis Socket.IO adapter for multiple API instances.
- Run database migrations during release.
- Serve over HTTPS.
- Keep frontend and API either same-origin or configure CORS tightly with `CLIENT_ORIGIN`.
