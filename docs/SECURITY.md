# Security Notes

## Implemented

- Passwords are hashed with bcrypt.
- JWT authentication protects buyer and admin routes.
- Admin routes enforce role-based access control.
- Zod validates request payloads.
- Helmet sets standard security headers.
- CORS is restricted by `CLIENT_ORIGIN`.
- JSON body size is capped.
- Rate limiting protects the API from basic abuse.
- Auth endpoints have a tighter rate limit for login/register abuse.
- Server-side bidding rules prevent late bids, invalid bids, and bids below increment.
- Error responses avoid leaking stack traces and include request IDs for investigation.
- Async route failures are routed through centralized error handling instead of crashing the API process.
- Production startup fails if `JWT_SECRET` is left as the development default or is too short.
- Socket.IO bid placement validates payload shape before checking JWT and auction rules.

## Security Validation Performed

The local API was probed after seeding with demo data:

- Health/readiness endpoint returned 200.
- Helmet security headers were present.
- `X-Powered-By` was absent.
- CORS did not echo an untrusted origin.
- Invalid registration payload returned 400 without crashing the server.
- Buyer/admin login succeeded and did not expose password hashes.
- Anonymous access to `/api/users` returned 401.
- Buyer access to admin-only `/api/users` and `/api/bikes` returned 403.
- Admin access to `/api/users` returned 200.
- Tampered bearer token returned 401.
- Under-minimum bid returned a controlled 400 response.
- `npm audit --audit-level=moderate` reported 0 vulnerabilities after upgrading Vitest.

## Production Recommendations

- Set `JWT_SECRET` to a long random secret in production.
- Serve API and frontend only over TLS.
- Move from SQLite to PostgreSQL for stronger concurrent bidding guarantees.
- Use refresh-token rotation or short-lived access tokens for long-running sessions.
- Add audit logging for admin lifecycle actions.
- Add object storage and malware scanning for real image uploads.
- Put Socket.IO behind a Redis adapter when horizontally scaling the API.
- Add dependency scanning in CI and review npm audit output before release.
