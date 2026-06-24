# Setup Instructions

## Prerequisites

- Node.js 20.x
- npm 10.x
- Git
- Optional: Docker Desktop for Docker Compose

## Local Setup

From the repository root:

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run db:migrate
npm run db:seed
npm run dev
```

Windows PowerShell equivalent for copying env files:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

## Local URLs

- Web app: `http://localhost:5173`
- API health: `http://localhost:4000/health`
- API readiness: `http://localhost:4000/health/ready`
- API metrics: `http://localhost:4000/metrics`

## Demo Accounts

These accounts are created by `npm run db:seed`:

```text
Admin: admin@bikeauction.test / Password123!
Buyer: buyer@bikeauction.test / Password123!
```

## Tests

```bash
npm test
```

The test suite covers core auction lifecycle, bid validation, reserve-price behavior, tie ordering, and winner selection.

## Build

```bash
npm run build
```

This compiles the API TypeScript, generates the Prisma client, compiles the frontend TypeScript, and builds Vite assets.

## Useful Commands

```bash
npm --workspace apps/api run dev
npm --workspace apps/web run dev
npm run db:migrate
npm run db:seed
npm test
npm run build
```

## Docker Compose

```bash
docker compose up --build
```

Docker Compose is provided for local convenience. The primary local setup uses SQLite and npm scripts.
