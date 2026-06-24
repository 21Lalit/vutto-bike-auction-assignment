# Assumptions and Tradeoffs

## Assumptions

- Money is stored as whole USD units for demo simplicity. A production payment system should store minor units and currency explicitly.
- Photo uploads are represented by URLs. Production should add object storage, scanning, and signed uploads.
- Demo seed data is safe to reset and is not intended for real inventory.
- Admin creation is handled by seed data or direct database provisioning.
- Seller leads are lightweight intake records. They do not yet trigger notifications or convert automatically into bike listings.
- Inspection and test-ride requests are scheduling requests only. They do not yet integrate with calendars, SMS, or staff assignment.

## Tradeoffs

- SQLite keeps local setup easy. PostgreSQL is recommended for production concurrency and reporting.
- Socket.IO is used instead of raw WebSocket or SSE because it gives simple rooms, reconnects, and acknowledgement callbacks.
- Auction lifecycle sync runs on interval plus request-time checks. Production should move this to a durable scheduler or queue.
- Bid validation is intentionally centralized in pure domain functions and the auction service. Database-level serializable locking is limited by SQLite; PostgreSQL transactions should be used for higher contention.
- The admin UI is intentionally compact and operational rather than a separate CMS. It covers lifecycle and data management without introducing an additional framework.
- Buyer confidence badges are presented as product workflow states. A production launch should back each badge with structured inspection, document, and finance-provider records.
- The payment planner is an estimate for buyer planning, not a lender quote.
