# PG.17 — Rate Seasons Catalogue

**Increment:** PG.17  
**Server version:** `0.55.0-i3.17-pg17-i4.15`

## Summary

Named seasons (`sup_seasons`) with code/label/date or month range. Rates may reference `seasonId` (copies catalogue `label` into `seasonLabel` for calendar compatibility).

## API

| Route | Purpose |
| --- | --- |
| GET/POST `/v1/suppliers/seasons` | List / create |
| PATCH/DELETE `/v1/suppliers/seasons/:id` | Update / soft-archive |

## Verification

```bash
npm run test -w @sedmc/api   # pg17-rate-seasons.test.ts
```
