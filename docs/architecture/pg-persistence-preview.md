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

## PG.3 — CRM dual-write ✅

| Table | Trigger |
| --- | --- |
| `crm_organization_types` | Org type mutations |
| `crm_organizations` | Organization create/update |
| `crm_contacts` | Contact create/update |
| `crm_activities` | Activity create/update |

Migration: `036_pg3_crm_persistence.sql` (tenant + updated_at indexes)

Hydrate on startup when `EOS_DATABASE_URL` set. In-memory `Store` remains read SoR in Dev/Test.

Tests: `pg-crm.integration.test.ts`, `crm.integration.test.ts` (`describePg` block)

## PG.3.1 — CRM accounts + notes ✅

| Table | Trigger |
| --- | --- |
| `crm_accounts` | Account create/update/archive/transition |
| `crm_notes` | Note create/update/archive |

Migration: `037_pg31_crm_accounts_notes.sql` (tenant + updated_at indexes)

Tests: `pg-crm.integration.test.ts` (`PG.3.1` describe block)

## PG.3.2 — CRM merge ✅

| Table | Trigger |
| --- | --- |
| `crm_merge_records` | Merge execute (`entityType: merge_record`) |
| `crm_organizations` / `crm_contacts` | Survivor + duplicate updates (cascade) |
| `crm_accounts` / `crm_activities` / `crm_notes` | Repointed child rows (cascade) |

Uses existing merge DDL (004 + 010). Cascade dual-write via `persistCrmMergeAfterCommit`.

Tests: `pg-crm.integration.test.ts` (`PG.3.2` describe block)

## PG.3+ — CRM relationships, tasks, tags ✅

| Table | Trigger |
| --- | --- |
| `crm_relationships` | Relationship create/update/transition |
| `crm_tasks` | Task create/update/complete/cancel |
| `crm_tags` | Tag create/update/archive |
| `crm_entity_tags` | Tag assign/remove |

Migration: `038_pg3plus_crm_rel_tasks_tags.sql`

Tests: `pg-crm.integration.test.ts` (`PG.3+` describe block)

## Dev/Test behavior

- In-memory `Store` remains read SoR
- PG dual-write when `store.dbPool` is set via `main.ts`

## Future

- Read-through hydration for all modules
- Production SoR cutover
- CRM accounts, notes — **PG.3.1 done**
- CRM merge — **PG.3.2 done**
- Relationships, tasks, tags — **PG.3+ done**
