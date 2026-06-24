# Security Checks Made

## Security Controls Implemented

- Passwords hashed with bcrypt.
- JWT-based authentication.
- Buyer/admin role-based authorization.
- Protected buyer and admin routes.
- Zod validation for request payloads.
- Helmet security headers.
- Express `x-powered-by` disabled.
- CORS restricted by `CLIENT_ORIGIN`.
- JSON body size limit.
- Global API rate limiting.
- Tighter rate limiting for auth endpoints.
- Centralized error handling with request IDs.
- Async route error wrapper to avoid server crashes on rejected promises.
- Production `JWT_SECRET` validation.
- Socket.IO bid payload validation.
- Server-side bid validation for status, deadline, and minimum increment.
- Controlled 400 responses for invalid bids.

## Manual Security Probe Results

The local API was probed after applying seed data.

Passed checks:

- `/health/ready` returned 200.
- Helmet security headers were present.
- `X-Powered-By` header was absent.
- CORS did not echo an untrusted `https://evil.example` origin.
- Invalid registration payload returned 400.
- Buyer login returned 200.
- Admin login returned 200.
- Login response did not expose `passwordHash`.
- Anonymous `/api/users` request returned 401.
- Buyer `/api/users` request returned 403.
- Admin `/api/users` request returned 200.
- Buyer bike creation attempt returned 403.
- Tampered bearer token returned 401.
- Under-minimum bid returned controlled 400.

## Dependency Security

The dependency audit was run after upgrading the vulnerable Vitest dependency chain:

```bash
npm audit --audit-level=moderate
```

Result:

```text
found 0 vulnerabilities
```

## Automated Verification

```bash
npm test
npm run build
```

Last verified results:

- Tests: 6 passed.
- Production build: passed.
- npm audit: 0 vulnerabilities.

## Remaining Production Recommendations

- Run the API only over HTTPS.
- Use PostgreSQL in production.
- Add audit logs for admin lifecycle actions.
- Use short-lived access tokens plus refresh-token rotation for long sessions.
- Use object storage and malware scanning for real user-uploaded images.
- Add Redis Socket.IO adapter for horizontal scaling.
- Add CI dependency scanning on every pull request.
