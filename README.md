# vutto-bike-auction-assignment

Production-oriented Vutto bike auction platform with buyer dashboards, admin lifecycle management, Vutto hub workflows, and realtime bidding.

## Stack

- Frontend: React, TypeScript, Vite, React Router, Socket.IO client
- Backend: Node.js, Express, TypeScript, Prisma, SQLite, Socket.IO
- Auth: JWT, bcrypt password hashing, role-based route guards
- Validation/security: Zod, Helmet, CORS, rate limiting, centralized error handling
- Tests: Vitest for core auction rules

## Feature highlights

- Realtime live auction bidding with bid history and countdowns
- Buyer dashboard for active, won, and lost auctions
- Admin management for bikes, auctions, users, auction lifecycle, and seller leads
- Seller intake flow for owners who want to list a motorcycle for auction
- Buyer confidence cues for inspection status, ownership handoff, finance planning, and late-bid protection
- Watchlist for saving auctions to a buyer dashboard
- Inspection, test-ride, and video-call requests with admin status management
- Auction comparison tray for side-by-side bike checks
- Payment planner on auction detail pages
- Vutto bike auction event page with live/upcoming event cards
- Vutto hub locator for inspection and handoff locations
- INR pricing and India-focused seed inventory

## Local setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run db:migrate
npm run db:seed
npm run dev
```

Open:

- Web app: http://localhost:5173
- API health: http://localhost:4000/health
- API readiness: http://localhost:4000/health/ready
- API metrics: http://localhost:4000/metrics

Demo accounts:

- Admin: `admin@bikeauction.test` / `Password123!`
- Buyer: `buyer@bikeauction.test` / `Password123!`

## Tests

```bash
npm test
```

The tests cover bid validation, auction lifecycle status derivation, reserve-price handling, tie ordering, and winner selection.

## Useful commands

```bash
npm --workspace apps/api run dev
npm --workspace apps/web run dev
npm run build
npm run db:seed
```

## Deployment

### GitHub Pages frontend + Render API

GitHub Pages can deploy the React frontend only. The API, database, and realtime server must be hosted separately.

Read the exact setup here:

- [Free One-Month Deployment](docs/FREE_MONTH_DEPLOYMENT.md)
- [Full-Stack Deployment Plan](docs/FULL_STACK_DEPLOYMENT.md)
- [GitHub Pages Deployment](docs/GITHUB_PAGES_DEPLOYMENT.md)
- [API Hosting](docs/API_HOSTING.md)

### Docker Compose

```bash
docker compose up --build
```

Set production secrets before deploying:

- `JWT_SECRET`
- `DATABASE_URL`
- `CLIENT_ORIGIN`
- `VITE_API_URL`

### Production notes

SQLite is used for local simplicity. For production traffic, move Prisma to PostgreSQL, run `prisma migrate deploy` during release, and host the API and web app behind TLS. Use a managed Redis adapter for Socket.IO if running more than one API instance.

## Project layout

```text
apps/api      Express API, Prisma schema, realtime sockets, domain rules, seller leads, tests
apps/web      React/Vite application with buyer, seller, and admin experiences
docs          Architecture and tradeoff documents
docker-compose.yml
```

## Review documents

- [Assignment Deliverables](Deliverables/README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Full-Stack Deployment Plan](docs/FULL_STACK_DEPLOYMENT.md)
- [Free One-Month Deployment](docs/FREE_MONTH_DEPLOYMENT.md)
- [API Design](docs/API.md)
- [Security](docs/SECURITY.md)
- [Production Readiness](docs/PRODUCTION_READINESS.md)
- [GitHub Pages Deployment](docs/GITHUB_PAGES_DEPLOYMENT.md)
- [API Hosting](docs/API_HOSTING.md)
- [Evaluation Checklist](docs/EVALUATION_CHECKLIST.md)
- [Assumptions and Tradeoffs](docs/ASSUMPTIONS_AND_TRADEOFFS.md)
