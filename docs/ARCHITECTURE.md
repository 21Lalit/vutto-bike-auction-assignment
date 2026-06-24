# Architecture

## Overview

The platform is split into a TypeScript API and a TypeScript React app.

- React handles navigation, filtering, dashboards, admin forms, and realtime auction detail updates.
- Express exposes REST APIs for authentication, bikes, auctions, bids, users, and health checks.
- Socket.IO broadcasts bid and lifecycle changes to users in per-auction rooms.
- Prisma owns database access and relationship constraints.

## Data model

- `User`: registered buyers and admins.
- `Bike`: motorcycle listing data, including photos, specs, base price, and optional reserve.
- `Auction`: lifecycle state, schedule, minimum increment, current bid, and winner.
- `Bid`: immutable bid records tied to a user and auction.
- `SellerLead`: intake record for owners who want to list a bike for auction.
- `WatchlistItem`: saved auction relationship for a buyer.
- `InspectionRequest`: buyer request for inspection, test ride, or video call.

## Auction lifecycle

Auctions support `DRAFT`, `SCHEDULED`, `LIVE`, `ENDED`, and `CANCELLED`.

Lifecycle syncing derives effective status from start/end time for scheduled and live auctions. When an auction ends, winner selection chooses the highest bid, breaks equal bids by earliest timestamp, and returns no winner if the reserve price is not met.

## Bidding flow

1. The user opens an auction detail page and joins a Socket.IO room.
2. The user submits a bid through REST.
3. The API validates auth, lifecycle state, end time, base price, current bid, and minimum increment.
4. The bid and auction current bid update in one Prisma transaction.
5. Socket.IO broadcasts `bid:new` to every viewer in that auction room.

## Security

- Passwords are hashed with bcrypt.
- JWTs are required for protected routes.
- Admin APIs enforce role checks.
- Zod validates inputs.
- Helmet, CORS, request-size limits, and rate limiting are enabled.
- Centralized error handling avoids leaking internal failures.

## Marketplace Trust Additions

The frontend includes buyer-confidence UI patterns for certified inspection, ownership handoff, finance planning, and deadline enforcement. Seller intake captures contact, bike details, expected price, pickup preference, and notes so admins can evaluate listings before auction creation. Buyers can save auctions, compare motorcycles, estimate payments, and request inspection support; admins can manage those incoming buyer requests.

## Vutto Bike Auction Experience

The web app is oriented around `vutto-auctions-demo`. The event page groups live and scheduled bikes into auction-event cards with hub location, bidding format, catalogue CTA, and interest capture. The hub locator exposes Vutto inspection/handoff locations used by buyers before and after auctions.

## Observability

The API exposes `/health` and uses Pino request logging. Production deployments should ship logs to centralized storage and add metrics/tracing around bid latency and socket fanout.
