# PG.6 — Supplier Entity Dual-Write

**Increment:** PG.6  
**Server version:** `0.38.0-i3.6.1-i4.5-pg6`

## Summary

Full C4 supplier entity PostgreSQL durability: suppliers, contacts, rates, and content blocks dual-written on import commit; hydrated on startup.

## Persistence

| Entity | Table | Wired from |
| --- | --- | --- |
| `supplier` | `sup_suppliers` | `commitImportRow` |
| `supplier_contact` | `sup_contacts` | `commitImportRow` |
| `supplier_rate` | `sup_rates` | `commitImportRow` |
| `supplier_content_block` | `sup_content_blocks` | `commitImportRow` |

Migration `044_pg6_supplier_entities.sql` — entity updated-at indexes.

Facade: `persistSupEntityAfterCommit`, `hydrateSupFromPostgres` in `persistence/supplier.ts`.

## Verification

```bash
npm run test -w @sedmc/api          # c4.import.test.ts
EOS_RUN_PG_TESTS=1 EOS_DATABASE_URL=... npm run test -w @sedmc/api  # pg-supplier PG.6 block
```
