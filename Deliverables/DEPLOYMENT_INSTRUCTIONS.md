# Deployment Instructions

## Important Deployment Boundary

GitHub Pages can deploy only the React frontend. It cannot run:

- Express API
- Database
- Socket.IO realtime bidding server
- Auth/session backend
- Admin mutations

For a real working deployment, deploy the API/database separately and point GitHub Pages to it using `VITE_API_URL`.

## Publish Source to GitHub

The repository is prepared for:

```text
vutto-bike-auction-assignment
```

Commands:

```bash
gh auth login -h github.com
git init
git add .
git commit -m "Production-ready Vutto bike auction platform"
gh repo create vutto-bike-auction-assignment --public --source=. --remote=origin --push
```

If the repo already exists:

```bash
git remote add origin https://github.com/<your-username>/vutto-bike-auction-assignment.git
git branch -M main
git push -u origin main
```

## GitHub Pages Frontend + Render API

### 1. Deploy the API

Use Render for the free one-month API and database deployment. The included `render.yaml` provisions a free web service and free Postgres database.

Required API env vars:

```text
NODE_ENV=production
DATABASE_URL=<postgresql-url>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://<your-github-username>.github.io
PORT=<host-provided-port>
```

For PostgreSQL production deployments, use:

```bash
npm --workspace apps/api run db:deploy:postgres
npm --workspace apps/api run start
```

### 2. Configure GitHub Pages

In the GitHub repository:

1. Open `Settings -> Pages`.
2. Set source to `GitHub Actions`.
3. Open `Settings -> Secrets and variables -> Actions -> Variables`.
4. Add:

```text
VITE_API_URL=https://your-hosted-api.example.com
```

The workflow `.github/workflows/github-pages.yml` builds `apps/web` and deploys `apps/web/dist`.

Frontend URL:

```text
https://<your-github-username>.github.io/vutto-bike-auction-assignment/
```

Because the frontend uses hash routing, app routes look like:

```text
https://<your-github-username>.github.io/vutto-bike-auction-assignment/#/auctions
```

## Free One-Month Review Deployment

For this assignment, the cheapest practical path is:

```text
GitHub Pages frontend + Render free API + Render free Postgres
```

The included `render.yaml` sets both the API service and database to `plan: free`.

This is suitable for a short review period because Render free Postgres expires after 30 days. After that, you can keep the frontend on GitHub Pages and delete/suspend the Render services. The static frontend will remain visible, but live auth, bidding, admin, and database-backed pages need the API.

Detailed steps are in:

```text
docs/FREE_MONTH_DEPLOYMENT.md
```

## Production Seed Policy

Do not seed production unless the reviewer specifically needs sample data. For a real platform, admins should create inventory through the admin UI.

If review/demo seed data is required:

```bash
npm run db:seed
```

## Deployment Checklist

- Source pushed to GitHub.
- API deployed with PostgreSQL.
- API `/health/ready` returns `ok: true`.
- `JWT_SECRET` is strong and not the local default.
- `CLIENT_ORIGIN` matches the frontend origin.
- GitHub Actions variable `VITE_API_URL` is set.
- GitHub Pages uses the Actions workflow.
- WebSocket traffic works through the chosen API host.
