# API Design

Base URL: `http://localhost:4000`

All protected routes use:

```http
Authorization: Bearer <jwt>
```

Every response includes `x-request-id`. Error responses include the same `requestId` in JSON.

## Health and Observability

- `GET /health` - readiness response with database check
- `GET /health/live` - process liveness
- `GET /health/ready` - database-backed readiness
- `GET /metrics` - Prometheus-style text metrics

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Auctions

- `GET /api/auctions`
- `GET /api/auctions/:id`
- `POST /api/auctions` admin
- `PUT /api/auctions/:id` admin
- `POST /api/auctions/:id/start` admin
- `POST /api/auctions/:id/end` admin
- `POST /api/auctions/:id/cancel` admin
- `POST /api/auctions/:id/bids` authenticated user

## Bikes

- `GET /api/bikes`
- `POST /api/bikes` admin
- `PUT /api/bikes/:id` admin
- `DELETE /api/bikes/:id` admin

## Buyer Tools

- `GET /api/watchlist`
- `GET /api/watchlist/:auctionId`
- `POST /api/watchlist/:auctionId`
- `DELETE /api/watchlist/:auctionId`
- `POST /api/watchlist/:auctionId/requests`
- `GET /api/requests/me`

## Admin Operations

- `GET /api/users` admin
- `GET /api/requests` admin
- `PATCH /api/requests/:id` admin
- `GET /api/sell/leads` admin
- `PATCH /api/sell/leads/:id` admin

## Realtime Events

Socket.IO rooms use `auction:<auctionId>`.

- Client emits `auction:join`
- Client emits `auction:leave`
- Server emits `bid:new`
- Server emits `auction:updated`
