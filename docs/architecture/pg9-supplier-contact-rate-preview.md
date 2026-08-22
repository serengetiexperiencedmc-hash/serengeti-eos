# PG.9 — Supplier Contact & Rate CRUD Dual-Write

**Increment:** PG.9  
**Server version:** `0.44.0-pg9-c4-ui`

## Summary

Manual create/update/archive for supplier contacts and rates, dual-written via `persistSupEntityAfterCommit`.

## API

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/v1/suppliers/:id/contacts` | `supplier:write:supplier` |
| PATCH | `/v1/suppliers/:id/contacts/:contactId` | `supplier:write:supplier` |
| DELETE | `/v1/suppliers/:id/contacts/:contactId` | archive (soft) |
| POST | `/v1/suppliers/:id/rates` | `supplier:write:supplier` |
| PATCH | `/v1/suppliers/:id/rates/:rateId` | `supplier:write:supplier` |
| DELETE | `/v1/suppliers/:id/rates/:rateId` | archive (soft) |

## UI

Supplier detail drawer: **+ Contact** / **+ Rate** forms and Remove (archive).

## Verification

```bash
npm run test -w @sedmc/api   # pg9-supplier-contact-rate.test.ts
npm run typecheck -w @sedmc/web
```
