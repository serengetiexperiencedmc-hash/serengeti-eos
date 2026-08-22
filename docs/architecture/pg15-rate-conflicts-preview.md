# PG.15 — Rate Calendar Conflict Detection

**Increment:** PG.15  
**Server version:** `0.52.0-pg15-i4.12`

## Summary

Detects overlapping active rates on the same supplier with the same `rateType`. Conflicts are included on the calendar response and via a dedicated endpoint.

## API

| Route | Purpose |
| --- | --- |
| GET `/v1/suppliers/rates/conflicts?supplierId=&from=&to=` | Conflict pairs |
| GET `/v1/suppliers/rates/calendar` | Also returns `conflicts[]` (`increment: PG.15`) |

## UI

Supplier detail calendar — conflict list when overlaps exist.

## Verification

```bash
npm run test -w @sedmc/api   # pg15-rate-conflicts.test.ts
```
