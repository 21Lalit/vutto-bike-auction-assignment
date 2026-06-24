# Project Summary

## What I Built

A full-stack used-bike auction platform for motorcycle auctions.

## Main Features

- User registration and login.
- Buyer and admin roles.
- Protected routes and role-based access.
- Browse, search, and filter bike auctions.
- Auction cards with image, status, location, current bid, and time left.
- Full auction detail page with image carousel, bike specs, ownership, inspection notes, bid panel, bid history, and rules.
- Realtime bidding with Socket.IO.
- Auction lifecycle: draft, scheduled, live, ended, cancelled.
- Server-side bid validation, late-bid prevention, and minimum increment checks.
- Winner selection after auction end.
- Buyer dashboard for active, won, and lost auctions.
- Watchlist, compare tray, inspection request, seller lead flow, and payment planner.
- Admin dashboard for bikes, auctions, users, bids, seller leads, and inspection requests.
- Seed data with 50 bike auctions across different locations.
- Health, readiness, metrics, logging, security headers, and dependency audit.

## Engineering Work

- Clean monorepo structure with `apps/api` and `apps/web`.
- TypeScript across frontend and backend.
- Prisma schema with relational models and migrations.
- SQLite for easy local review.
- PostgreSQL schema for production deployment.
- Automated tests for core auction and bidding rules.
- GitHub Pages workflow for frontend deployment.
- Render configuration for hosted API and database.
