# PG.12 — Supplier Restore / Unarchive

**Increment:** PG.12  
**Server version:** `0.47.0-i4.9-pg12`

## Summary

Restore soft-archived suppliers. Children archived in the same cascade batch (matching `archivedAt`) are restored with the parent. Conflicts if an active supplier already uses the same `supplierCode`.

## API

| Route | Auth | Purpose |
| --- | --- | --- |
| GET `/v1/suppliers?archived=1` | Bearer | List archived suppliers |
| POST `/v1/suppliers/:id/restore` | Bearer (`supplier:write:supplier`) | Restore + cascade children |

## Health

`GET /v1/suppliers/health` → `increment: PG.12`.

## UI

Supplier Library — **Archived** filter with Restore on each card.

## Verification

```bash
npm run test -w @sedmc/api   # pg12-supplier-restore.test.ts
```
