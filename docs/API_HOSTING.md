# API Hosting

The frontend can be hosted on GitHub Pages, but the API must run on a Node-capable host.

## Minimal Host Requirements

- Node.js 20+
- HTTPS public URL
- Persistent database
- WebSocket support for Socket.IO
- Environment variables

## Required Environment Variables

```text
DATABASE_URL=<production-database-url>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://<your-github-username>.github.io
PORT=4000
```

For production, use the PostgreSQL schema in `apps/api/prisma-postgres`.

## Release Commands

```bash
npm run render:build:api
npm run render:start:api
```

## Health Checks

Use these for platform health checks:

- `/health/live`
- `/health/ready`

Use `/metrics` for Prometheus-style scraping.
