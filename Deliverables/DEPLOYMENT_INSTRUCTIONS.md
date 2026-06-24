# Deployment Instructions

## Important Point

GitHub Pages can host only the React frontend. It cannot run the API, database, authentication backend, or Socket.IO realtime bidding.

Use this deployment shape:

```text
GitHub Pages frontend
Hosted Node API
Hosted PostgreSQL database
```

## 1. Publish Source to GitHub

Using GitHub CLI:

```bash
gh auth login -h github.com
git init
git add .
git commit -m "Initial bike auction platform"
gh repo create vutto-bike-auction-assignment --public --source=. --remote=origin --push
```

If the repo already exists:

```bash
git remote add origin https://github.com/<github-user-or-org>/vutto-bike-auction-assignment.git
git branch -M main
git push -u origin main
```

## 2. Deploy API and Database

Recommended simple option: Render.

This repo includes `render.yaml` for:

- Node API service
- PostgreSQL database
- Health check path `/health/ready`
- Production build/start commands

Required API environment variables:

```text
NODE_ENV=production
DATABASE_URL=<postgresql-url>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://<github-user-or-org>.github.io
PORT=<host-port>
```

Production commands:

```bash
npm run render:build:api
npm run render:start:api
```

After deploy, check:

```text
https://<api-host>/health/ready
```

## 3. Seed Review Data If Needed

Only seed review data when required:

```bash
DATABASE_URL="<postgresql-url>" npm --workspace apps/api run db:seed:postgres
```

For a real production system, admins should create inventory through the admin UI instead of running sample seed data.

## 4. Configure GitHub Pages

In GitHub:

1. Open repository settings.
2. Go to `Pages`.
3. Set source to `GitHub Actions`.
4. Go to `Settings -> Secrets and variables -> Actions -> Variables`.
5. Add:

```text
VITE_API_URL=https://<api-host>
```

Or with GitHub CLI:

```bash
gh variable set VITE_API_URL --body "https://<api-host>"
gh workflow run github-pages.yml
```

Frontend URL:

```text
https://<github-user-or-org>.github.io/vutto-bike-auction-assignment/
```

## 5. Deployment Checklist

- Source is pushed to GitHub.
- API is deployed with PostgreSQL.
- `/health/ready` returns `ok: true`.
- `JWT_SECRET` is long and unique.
- `CLIENT_ORIGIN` matches the GitHub Pages origin.
- `VITE_API_URL` points to the hosted API.
- GitHub Pages workflow completes successfully.
- Login, auction list, auction detail, and bidding are tested after deploy.

## Notes

- Do not commit `.env` files.
- Do not commit database URLs or JWT secrets.
- Free hosting plans may sleep when idle.
- A free temporary database may expire depending on provider limits.
