# PG.16 — Rate Conflict Prefer / Resolve

**Increment:** PG.16  
**Server version:** `0.54.0-pg16-i4.14`

## Summary

Marks one overlapping rate as preferred (`preferredInConflict`) for a supplier + rateType conflict set. Preferring a rate clears the flag on overlapping peers. Conflicts expose `preferredRateId`, `resolved`, and `unresolvedOnly` filtering.

## API

| Route | Purpose |
| --- | --- |
| POST `/v1/suppliers/:id/rates/:rateId/prefer` | Prefer rate in conflict set |
| GET `/v1/suppliers/rates/conflicts?unresolvedOnly=1` | Unresolved pairs only |
| GET `/v1/suppliers/rates/calendar` | Conflicts include resolve flags (`increment: PG.16`) |

## Persistence

Migration `053_pg16_rate_preferred_conflict.sql` — `sup_rates.preferred_in_conflict`.

## UI

Supplier detail calendar — Prefer buttons on unresolved conflicts.

## Verification

```bash
npm run test -w @sedmc/api   # pg16-rate-prefer.test.ts
```
