# Source Package

`SOURCE_CODE.zip` contains the project source needed to run and review the application.

## Included

- `apps/api` - Express API, Prisma schemas, migrations, realtime server, tests, seed data.
- `apps/web` - React/Vite frontend.
- `docs` - supporting technical documents.
- `.github/workflows` - GitHub Pages deployment workflow.
- `docker-compose.yml`
- `package.json`
- `package-lock.json`
- `render.yaml`
- `README.md`
- `Deliverables` review documents and setup scripts.

## Excluded

- `.env` files
- `.git`
- `.tools`
- `.agents`
- `node_modules`
- `dist`
- local SQLite databases
- coverage reports
- TypeScript build cache files
- screenshots
- existing zip files

## Regenerate Zip

From the project root:

```powershell
powershell -ExecutionPolicy Bypass -File Deliverables\create-source-zip.ps1
```

The script only reads project files, copies allowed files to a temporary folder, and writes `Deliverables\SOURCE_CODE.zip`.
