# Free One-Month Deployment

This project can be deployed as:

```text
GitHub Pages frontend
  +
Render free Node API
  +
Render free Postgres
```

This is appropriate for a short assignment review window. It is not a long-term production setup.

## Why This Fits

- GitHub Pages can host the React frontend for free.
- Render supports free web services.
- Render supports free Postgres, but free databases expire after 30 days.
- This repo includes `render.yaml` configured with `plan: free` for both the API service and the Postgres database.

## Limitations

- Free Render web services spin down after idle time and may take about a minute to wake up.
- Render free Postgres expires after 30 days.
- Free services can be restarted or suspended under platform limits.
- WebSocket bidding works, but the first request after idle may be slow.
- After the API/database expires, GitHub Pages can still host the frontend, but live auth, bidding, admin, dashboard, and database-backed pages will no longer work.

## Step 1: Push Source to GitHub

```bash
gh auth login -h github.com
git init
git add .
git commit -m "Production-ready Vutto bike auction platform"
gh repo create vutto-bike-auction-assignment --public --source=. --remote=origin --push
```

If your local repo is already initialized, use:

```bash
git remote add origin https://github.com/<your-username>/vutto-bike-auction-assignment.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy API and Database on Render

1. Open Render.
2. Create a new Blueprint.
3. Connect the GitHub repository.
4. Render reads `render.yaml`.
5. Confirm the API web service uses `plan: free`.
6. Confirm the Postgres database uses `plan: free`.
7. Set `CLIENT_ORIGIN` to:

```text
https://<your-github-username>.github.io
```

Render automatically generates `JWT_SECRET` and injects `DATABASE_URL` from the free Postgres database.

After deploy, verify:

```text
https://<your-render-api>.onrender.com/health/ready
```

## Step 3: Seed Review Data

Use Render Shell if available for your service, or run locally against the Render database URL.

Local machine option:

```bash
DATABASE_URL="<render-postgres-external-url>" npm --workspace apps/api run db:deploy:postgres
DATABASE_URL="<render-postgres-external-url>" npm --workspace apps/api run db:seed
```

Only seed if you want demo bikes/users for the assignment reviewer.

## Step 4: Deploy Frontend to GitHub Pages

In GitHub:

1. Open repository settings.
2. Go to `Settings -> Pages`.
3. Set Source to `GitHub Actions`.
4. Go to `Settings -> Secrets and variables -> Actions -> Variables`.
5. Add:

```text
VITE_API_URL=https://<your-render-api>.onrender.com
```

Push to `main`. The workflow deploys the frontend to:

```text
https://<your-github-username>.github.io/vutto-bike-auction-assignment/
```

## After One Month

If you do not need the backend after review:

1. Leave GitHub Pages enabled.
2. Delete or suspend the Render API and free Postgres.
3. Keep the source code public on GitHub.

The frontend will still be visible on GitHub Pages, but database-backed features will fail once the API is gone.

For a permanent real working deployment, keep the API and database hosted on a paid or credit-backed service.
