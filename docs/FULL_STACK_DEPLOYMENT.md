# Full-Stack Deployment Plan

Use GitHub for source code, but deploy the running product on infrastructure that supports a backend, database, and WebSockets.

## Recommended Architecture

```text
Custom domain
  |
  |-- app.yourdomain.com  -> GitHub Pages frontend
  |
  |-- api.yourdomain.com  -> Hosted Node API
                              |
                              |-- PostgreSQL database
                              |-- Socket.IO realtime bidding
```

GitHub Pages is fine for the React frontend. It is not enough for the whole app because auth, bidding, admin actions, persistence, and realtime updates need the API and database.

## Option A: GitHub Pages + Render API

This repo includes:

- `.github/workflows/github-pages.yml` for the frontend
- `render.yaml` for API + PostgreSQL on Render
- `apps/api/prisma-postgres` for production PostgreSQL migrations

### 1. Publish source code

```bash
git init
git add .
git commit -m "Production-ready bike auction platform"
gh repo create vutto-bike-auction-assignment --public --source=. --remote=origin --push
```

### 2. Deploy API and database

In Render:

1. Create a Blueprint from the GitHub repository.
2. Render reads `render.yaml`.
3. Set `CLIENT_ORIGIN` to your frontend origin:

```text
https://<your-github-username>.github.io
```

Render generates `JWT_SECRET` and provisions `DATABASE_URL` from the PostgreSQL database.

After deploy, note the API URL:

```text
https://bike-auction-api.onrender.com
```

### 3. Deploy frontend to GitHub Pages

In GitHub repository settings:

1. `Settings -> Pages -> Source -> GitHub Actions`
2. `Settings -> Secrets and variables -> Actions -> Variables`
3. Add:

```text
VITE_API_URL=https://bike-auction-api.onrender.com
```

Push to `main`. GitHub Actions deploys the frontend.

### 4. Use a custom domain

Use a domain from your GitHub Education Pack provider and point it to the frontend host.

For API custom domain, add a subdomain like:

```text
api.yourdomain.com
```

Then update:

```text
VITE_API_URL=https://api.yourdomain.com
CLIENT_ORIGIN=https://app.yourdomain.com
```

## Option B: DigitalOcean App Platform

If you use GitHub Education Pack cloud credits, a single DigitalOcean App Platform project can run:

- Web static frontend
- Node API
- Managed PostgreSQL

Set the same environment variables:

```text
VITE_API_URL
DATABASE_URL
JWT_SECRET
CLIENT_ORIGIN
```

## Option C: Azure Student Credits

You can deploy:

- Frontend to Azure Static Web Apps
- API to Azure App Service
- Database to Azure Database for PostgreSQL

## Production Seed Policy

Do not run `npm run db:seed` in production unless you intentionally want sample inventory. Production admins should create real bikes and auctions through the admin UI.

## Deployment Checklist

- Source code pushed to GitHub
- API deployed and `/health/ready` returns `ok: true`
- Frontend deployed with `VITE_API_URL`
- API `CLIENT_ORIGIN` matches frontend origin
- Strong `JWT_SECRET` configured
- Database migrations applied
- Domain DNS configured
- HTTPS enabled
- Admin account created
