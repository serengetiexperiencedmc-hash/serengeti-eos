# PostgreSQL Persistence — Preview

Phased persistence per [ADR-0017](../adr/ADR-0017-persistence-increment-boundary.md).

## PG.1 — I3 notifications ✅

| Table | Trigger |
| --- | --- |
| `notif_dismissals` | Dismiss notification |
| `notif_email_outbox` | Email adapter send |

Tests: `pg-i3.integration.test.ts`

## PG.2 — I4 outbox ✅

| Action | When |
| --- | --- |
| **Insert** | `commitWithOutbox`, CRM `commitCrmWithOutbox`, `emitCrmEvent` |
| **Update** | `publishPendingOutbox` (published / dead_letter) |
| **Hydrate + drain** | API startup when `EOS_DATABASE_URL` set |

Migration: `035_pg2_outbox_persistence.sql` (pending index)

Tests: `pg-i4.integration.test.ts` (gated)

## Dev/Test behavior

- In-memory `Store` remains read SoR
- PG dual-write when `store.dbPool` is set via `main.ts`

## Future

- **PG.3** — CRM full read/write persistence (separate gate)
- Read-through hydration for all modules
- Production SoR cutover
