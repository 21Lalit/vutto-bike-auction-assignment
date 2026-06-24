# Challenges and Solutions

## 1. GitHub Pages Cannot Host the Full App

GitHub Pages can host only static frontend files. It cannot run an API, database, auth server, or WebSocket server.

Solution:

- Kept GitHub Pages for the React frontend.
- Added a separate hosted API path using Render.
- Added `VITE_API_URL` so the frontend can point to any hosted backend.

## 2. Local Setup Needed to Be Simple

Reviewers should not need a paid database just to test the app.

Solution:

- Used SQLite for local development.
- Added seed data.
- Added `setup-local.bat` to install dependencies, create env files, migrate, seed, test, and optionally start the app.

## 3. Production Needs PostgreSQL

SQLite is fine locally, but hosted multi-user bidding should use a stronger database.

Solution:

- Added separate PostgreSQL Prisma schema and migrations.
- Added Render build/start commands for production migration and API startup.

## 4. Realtime Bidding Needs Server Authority

The frontend cannot be trusted to decide if a bid is valid.

Solution:

- All bid validation happens on the API.
- The API checks auction status, end time, bid amount, and minimum increment.
- Socket.IO only broadcasts accepted bids.

## 5. Bike Details Needed More Buyer Confidence

Basic title, price, and image are not enough for a buyer to place a bid.

Solution:

- Added detailed bike dossier data: technical specs, ownership, service, inspection notes, documents, included items, and known issues.
- Added image carousel and clearer detail sections.

## 6. Seed Data Images Needed to Match Bike Names

Generic images would make the listing look unrealistic.

Solution:

- Seed data uses matching public listing image URLs for bike names/models.
- The seed contains 50 auction lots distributed across multiple locations.

## 7. Security Needed More Than UI Checks

Admin buttons hidden in the UI are not enough protection.

Solution:

- Added backend RBAC checks.
- Added validation, rate limits, Helmet headers, CORS allowlist, token checks, and controlled error handling.
- Documented each security check in `SECURITY_CHECKS.md`.
