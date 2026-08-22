# PG.5 — Supplier Import Batch Dual-Write

**Increment:** PG.5  
**Server version:** `0.37.0-i3.6-i4.4-pg5`

## Summary

PostgreSQL durability for C4 supplier import batches — dual-write on create, validate, and execute; hydrate on startup.

## Persistence

| Layer | Change |
| --- | --- |
| Migration | `043_pg5_supplier_import.sql` |
| Repository | `upsertSupImportBatch`, `loadSupImportBatches`, `countSupImportBatches` |
| Facade | `persistence/supplier.ts` |
| Import | `supplier/import.ts` — fire-and-forget persist after each status transition |
| Startup | `main.ts` — `hydrateSupImportBatchesFromPostgres` |

## Verification

```bash
npm run test -w @sedmc/api          # c4.import.test.ts (memory)
EOS_RUN_PG_TESTS=1 EOS_DATABASE_URL=... npm run test -w @sedmc/api  # pg-supplier.integration.test.ts
```
