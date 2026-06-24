# Setup Instructions

## Requirements

- Node.js 20.x
- npm 10.x
- Git
- GitHub CLI only if cloning from GitHub with `gh`

No paid database is needed for local review. Local setup uses SQLite.

## Option A: Run From Source Zip

1. Extract `Deliverables\SOURCE_CODE.zip`.
2. Open the extracted project folder in a terminal.
3. Run:

```bat
Deliverables\setup-local.bat
```

The script explains each permission before it starts.

## Option B: Clone With GitHub CLI

Install GitHub CLI, then run:

```bash
gh auth login -h github.com
gh repo clone <github-user-or-org>/vutto-bike-auction-assignment
cd vutto-bike-auction-assignment
Deliverables\setup-local.bat
```

If using normal Git:

```bash
git clone https://github.com/<github-user-or-org>/vutto-bike-auction-assignment.git
cd vutto-bike-auction-assignment
Deliverables\setup-local.bat
```

## What the Setup Script Does

- Checks Node.js and npm.
- Creates `apps/api/.env` from `.env.example` if missing.
- Creates `apps/web/.env` from `.env.example` if missing.
- Runs `npm install`.
- Runs database migration.
- Seeds review users and 50 bike auctions.
- Optionally runs tests.
- Optionally runs production build.
- Optionally starts API and frontend.

## Permissions Explained

- Network access: required by `npm install` to download packages.
- File write access: required to create `.env` files and local SQLite database files.
- Local ports: API uses `4000`; frontend uses `5173`.
- No administrator access is required.
- The script does not upload project files anywhere.

## Manual Setup

From the project root:

```bash
npm install
```

Windows PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

macOS/Linux:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Then:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

## Open Locally

- Web app: `http://localhost:5173`
- API health: `http://localhost:4000/health`
- API readiness: `http://localhost:4000/health/ready`
- API metrics: `http://localhost:4000/metrics`

## Review Accounts

Created by `npm run db:seed`:

```text
Admin: admin@bikeauction.test / Password123!
Buyer: buyer@bikeauction.test / Password123!
```

## Test and Build

```bash
npm test
npm run build
```

Tests cover auction lifecycle, bid validation, reserve handling, tie ordering, and winner selection.
