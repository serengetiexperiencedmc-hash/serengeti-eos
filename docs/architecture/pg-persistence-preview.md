# PG.1 Notification Persistence — Preview

Increment **PG.1** implements dual-write persistence for I3 notifications per [ADR-0017](../adr/ADR-0017-persistence-increment-boundary.md).

## Scope

| Table | Trigger |
| --- | --- |
| `notif_dismissals` | `POST /v1/notifications/:key/dismiss` |
| `notif_email_outbox` | Email adapter `send()` |

## Wiring

- `main.ts` sets `store.dbPool` when `EOS_DATABASE_URL` is configured
- `persistence/notifications.ts` — optional dual-write helpers
- `pg-repository.ts` — `insertNotifDismissal`, `insertNotifEmailOutbox`, count helpers

## Dev/Test behavior

- **Without PG:** in-memory only (default for unit tests)
- **With PG:** dual-write on dismiss + email dispatch; reads still from memory

## Tests

- `pg-i3.integration.test.ts` — gated by `EOS_RUN_PG_TESTS=1`

## Future (PG.2+)

- I4 outbox insert/drain
- Read-through hydration on startup
- CRM full persistence (PG.3, separate gate)
