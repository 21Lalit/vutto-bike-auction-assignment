# Source Code

The complete source code is included in this repository. It is intentionally not duplicated inside `Deliverables` to avoid stale copies and review confusion.

## Main Folders

```text
apps/api
  Express API, Prisma schema, realtime Socket.IO server, auth, admin/user routes,
  auction lifecycle services, bidding rules, observability, tests, and seed data.

apps/web
  React/Vite frontend with buyer, admin, seller, auction browsing, auction detail,
  realtime bidding, dashboard, watchlist, compare, and Vutto-style hub/event pages.

docs
  Detailed supporting documents for API design, architecture, security, deployment,
  production readiness, and trade-offs.

.github/workflows
  GitHub Pages deployment workflow for the frontend.

apps/api/prisma
  SQLite local development schema and migrations.

apps/api/prisma-postgres
  PostgreSQL production schema and migrations.
```

## Key Implementation Files

- API entry point: `apps/api/src/app.ts`
- API server and Socket.IO bootstrap: `apps/api/src/server.ts`
- Auth middleware and RBAC: `apps/api/src/middleware/auth.ts`
- Auction domain rules: `apps/api/src/modules/auctions/auctionRules.ts`
- Auction service and bid placement: `apps/api/src/modules/auctions/auctions.service.ts`
- Auction routes: `apps/api/src/modules/auctions/auctions.routes.ts`
- Prisma schema: `apps/api/prisma/schema.prisma`
- Seed data: `apps/api/prisma/seed.ts`
- Web entry point: `apps/web/src/main.tsx`
- API client/types: `apps/web/src/api/client.ts`
- Auction card: `apps/web/src/components/AuctionCard.tsx`
- Auction detail page: `apps/web/src/pages/AuctionDetail.tsx`
- Admin dashboard: `apps/web/src/pages/Admin.tsx`
- Global frontend styles: `apps/web/src/styles.css`
- Core auction tests: `apps/api/src/tests/auctionRules.test.ts`

## Repository Name

The project is prepared for a GitHub repository named:

```text
vutto-bike-auction-assignment
```
