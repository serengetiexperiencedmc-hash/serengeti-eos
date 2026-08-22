# PG.8 — Supplier CRUD Dual-Write

**Increment:** PG.8  
**Server version:** `0.41.0-pg8-i3.8`

## Summary

Manual supplier create/update REST API with the same PostgreSQL dual-write path used by import commits (`persistSupEntityAfterCommit` → `sup_suppliers`).

## API

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/v1/suppliers` | `supplier:write:supplier` |
| PATCH | `/v1/suppliers/:id` | `supplier:write:supplier` |

Create defaults `status` to `pending_review` (Procurement review gate). Supplier codes are normalized uppercase and unique per tenant.

## Verification

```bash
npm run test -w @sedmc/api   # pg8-supplier-crud.test.ts
EOS_RUN_PG_TESTS=1 EOS_DATABASE_URL=... npm run test -w @sedmc/api  # PG.8 block
```
