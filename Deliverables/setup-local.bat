@echo off
setlocal

cd /d "%~dp0.."

echo.
echo Vutto Bike Auction - Local Setup
echo --------------------------------
echo This script will set up the project on this machine.
echo.
echo It may ask for these permissions:
echo - Network access: npm install downloads packages from npm registry.
echo - File write access: creates apps\api\.env, apps\web\.env, and a local SQLite database.
echo - Local ports: if you start the app, API uses port 4000 and web uses port 5173.
echo.
echo It does not need administrator access and does not upload your files.
echo.
choice /C YN /N /M "Continue? [Y/N] "
if errorlevel 2 (
  echo Setup cancelled.
  exit /b 1
)

echo.
echo Checking required tools...
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20.x, then run this script again.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js 20.x with npm, then run this script again.
  exit /b 1
)

node -v
npm -v

echo.
echo Creating local env files if missing...
if not exist "apps\api\.env" (
  copy "apps\api\.env.example" "apps\api\.env" >nul
  echo Created apps\api\.env
) else (
  echo apps\api\.env already exists. Keeping current file.
)

if not exist "apps\web\.env" (
  copy "apps\web\.env.example" "apps\web\.env" >nul
  echo Created apps\web\.env
) else (
  echo apps\web\.env already exists. Keeping current file.
)

echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo npm install failed.
  exit /b 1
)

echo.
echo Creating/updating local database...
call npm run db:migrate
if errorlevel 1 (
  echo Database migration failed.
  exit /b 1
)

echo.
echo Seeding review users and 50 bike auctions...
call npm run db:seed
if errorlevel 1 (
  echo Database seed failed.
  exit /b 1
)

echo.
choice /C YN /N /M "Run automated tests now? [Y/N] "
if errorlevel 2 goto skip_tests
call npm test
if errorlevel 1 (
  echo Tests failed.
  exit /b 1
)
:skip_tests

echo.
choice /C YN /N /M "Run production build check now? [Y/N] "
if errorlevel 2 goto skip_build
call npm run build
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)
:skip_build

echo.
echo Setup complete.
echo.
echo Local URLs:
echo - Web: http://localhost:5173
echo - API health: http://localhost:4000/health
echo.
echo Review accounts:
echo - Admin: admin@bikeauction.test / Password123!
echo - Buyer: buyer@bikeauction.test / Password123!
echo.
choice /C YN /N /M "Start the app now? [Y/N] "
if errorlevel 2 (
  echo You can start it later with: npm run dev
  exit /b 0
)

echo.
echo Starting API and web app. Press Ctrl+C to stop.
call npm run dev
