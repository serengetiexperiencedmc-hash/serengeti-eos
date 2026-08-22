# PG.7 — Supplier Import Execute Idempotency

**Increment:** PG.7  
**Server version:** `0.39.0-pg7`

## Summary

PostgreSQL durability for C4 supplier import execute idempotency — survives process restarts and supports safe replay of committed imports.

## Persistence

| Layer | Change |
| --- | --- |
| Table | `sup_import_execute_idempotency` (migration 014) |
| Migration | `045_pg7_supplier_import_idempotency.sql` — batch lookup index |
| Facade | `persistSupImportExecuteIdempotencyAfterCommit`, `hydrateSupImportExecuteIdempotenciesFromPostgres` |
| Import | `executeSupplierImportBatch` dual-writes after successful commit |
| Startup | `main.ts` hydrates idempotency map |

PG key format: `{batchId}:{clientKey}` scoped by `tenant_id`.

## Verification

```bash
npm run test -w @sedmc/api   # pg7-supplier-idempotency.test.ts, pg-supplier PG.7 block
```
