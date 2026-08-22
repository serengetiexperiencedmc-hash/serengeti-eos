# PG.4 — CRM External IDs, Duplicates, Import Batches

**Increment:** PG.4  
**Server version:** `0.36.0-i4.3-pg4`

## Summary

Dual-write and hydrate for CRM entities that were in-memory-only after PG.3+: external identifiers, duplicate candidates, and import batches. Tables exist from C1 migrations (`004`–`011`); PG.4 adds runtime persistence.

## Persistence

| Entity | `entityType` hook | PG table |
| --- | --- | --- |
| External identifier | `external_identifier` | `crm_external_identifiers` |
| Duplicate candidate | `duplicate_candidate` | `crm_duplicate_candidates` |
| Import batch | `import` | `crm_import_batches` |

Deletes of external identifiers remove the PG row when the in-memory entity is gone after commit.

## Files

- `persistence/pg-repository.ts` — upsert/load/count helpers
- `persistence/crm.ts` — `persistCrmEntityAfterCommit` branches + hydrate merge
- Migration `040_pg4_crm_ext_dup_import.sql` — supporting indexes

## Verification

```bash
EOS_RUN_PG_TESTS=1 EOS_DATABASE_URL=... npm run test -w @sedmc/api  # PG.4 block in pg-crm.integration.test.ts
```
