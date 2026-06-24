# GitHub Pages Deployment

GitHub Pages hosts only the React frontend. A real multi-user auction platform still needs the API, database, and Socket.IO server hosted somewhere else.

## What Gets Deployed to Pages

- React/Vite frontend from `apps/web`
- Static assets
- Hash-based routing, so URLs work on Pages without server rewrites

## What Must Be Hosted Separately

- Express API from `apps/api`
- Database
- Socket.IO realtime server

Good API hosting options: Render, Railway, Fly.io, AWS, GCP, Azure, or any VPS that can run Node.js and expose HTTPS.

## Repository Setup

Create the GitHub repository:

```bash
git init
git add .
git commit -m "Initial production-ready bike auction platform"
gh repo create vutto-bike-auction-assignment --public --source=. --remote=origin --push
```

In GitHub:

1. Open the repo settings.
2. Go to `Settings -> Pages`.
3. Set Source to `GitHub Actions`.
4. Go to `Settings -> Secrets and variables -> Actions -> Variables`.
5. Add `VITE_API_URL` with your hosted API URL, for example:

```text
https://your-auction-api.onrender.com
```

Push to `main`. The workflow `.github/workflows/github-pages.yml` will deploy the frontend.

The final frontend URL will be:

```text
https://<your-github-username>.github.io/vutto-bike-auction-assignment/
```

Because this project uses `HashRouter`, app routes will look like:

```text
https://<your-github-username>.github.io/vutto-bike-auction-assignment/#/auctions
```

## Hosted API Requirements

The API must set:

```text
CLIENT_ORIGIN=https://<your-github-username>.github.io
JWT_SECRET=<long-random-secret>
DATABASE_URL=<your-production-database-url>
PORT=<hosting-platform-port>
```

For a real production deployment, use the PostgreSQL schema in `apps/api/prisma-postgres`. SQLite is kept for local development only.

## Important

Do not deploy only GitHub Pages and expect bidding/auth/admin to work. If `VITE_API_URL` is missing, the Pages workflow fails intentionally because that would produce a fake static demo instead of a real working product.
