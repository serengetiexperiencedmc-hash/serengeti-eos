# PG.21 — Bulk reassign rates outside season bounds

After a season shrink (PG.20), operators can bulk-clear or move linked rates that no longer fit.

## API

`POST /v1/suppliers/seasons/:id/reassign-outside-rates`

```json
{ "mode": "clear" }
{ "mode": "move", "targetSeasonId": "…" }
{ "mode": "clear", "rateIds": ["…"] }
```

## Behaviour

- Targets rates currently linked to the season that fail PG.19 bounds checks
- `clear` — removes `seasonId`
- `move` — assigns `targetSeasonId` only when the rate fits the target season; otherwise `skipped` with bounds reason
- Optional `rateIds` subset; unknown / in-bounds ids → `rate_not_outside_bounds`
- Response includes `remainingImpact` (same shape as PG.20)

## Banner

`PG.21`

## Tests

`apps/api/src/pg21-season-reassign-outside.test.ts`
