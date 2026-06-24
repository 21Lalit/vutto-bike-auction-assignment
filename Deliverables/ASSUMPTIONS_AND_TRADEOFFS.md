# Assumptions and Trade-offs

## Assumptions

- The assignment reviewer will run the project locally with seeded data.
- The primary business domain is used motorcycles and scooters, not cars or general vehicles.
- Vutto-style data and public listing images are acceptable for seeded review inventory.
- Buyers need enough vehicle information to bid confidently, so bike details include inspection, documents, ownership, service, features, and known notes.
- Admins are trusted internal users.
- Production deployment should use PostgreSQL, even though local development uses SQLite.
- GitHub Pages is acceptable for the frontend only, with the API hosted separately.

## Trade-offs

### SQLite Locally, PostgreSQL in Production

SQLite keeps local setup simple and fast for reviewers. PostgreSQL schema and migrations are included for production because concurrent bidding and hosted deployment need a stronger database.

### JWT Auth Instead of Full Session Management

JWT keeps the implementation straightforward and stateless. For a larger production product, short-lived access tokens, refresh-token rotation, device sessions, and logout token invalidation should be added.

### Socket.IO for Realtime Bidding

Socket.IO gives reliable realtime bid updates with room-based auction broadcasts. At horizontal scale, the API should add a Redis adapter so rooms and events work across multiple instances.

### Seeded Inventory Instead of Image Uploads

The project uses seeded Vutto-style listing data and image URLs so it can be tested immediately. A real production system should add authenticated uploads, object storage, image moderation, malware scanning, and CDN optimization.

### Admin UI Over Back-office Workflow Depth

The admin dashboard covers core lifecycle operations, users, bikes, seller leads, and requests. A production operations system would add approval workflows, audit trails, staff assignment, notifications, and reconciliation screens.

### GitHub Pages Frontend Constraint

GitHub Pages is static hosting. It is used only for the frontend workflow. The full product still needs a backend host for API, database, authentication, and WebSockets.

### Review Credentials

Review credentials are generated only through seed data for local review use. Production should create admin users through a controlled onboarding process and should not run sample seed data unless explicitly required.

### Security Scope

A scoped local security pass was performed, including RBAC, validation, token tampering, headers, CORS behavior, bid rejection, tests, build, and dependency audit. This is not a replacement for a professional third-party penetration test before real customer traffic.
