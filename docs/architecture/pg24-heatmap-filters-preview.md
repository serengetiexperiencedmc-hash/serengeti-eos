# PG.24 — Heatmap unresolved / season filters

**Increment:** PG.24  
**Server version:** `0.62.0-pg24-i3.24-i4.22`

## Summary

Filter the PG.23 conflict heatmap by unresolved pairs and by catalogue season (`seasonId`) or free-text `seasonLabel`.

## API

| Route | Query |
| --- | --- |
| GET `/v1/suppliers/rates/calendar` | `unresolvedOnly`, `seasonId`, `seasonLabel` |
| GET `/v1/suppliers/rates/conflicts` | same |
| GET `/v1/suppliers/rates/conflicts/heatmap` | same |

Responses include `filters` echoing the applied query. A conflict matches a season filter if **either** rate in the pair matches.

## UI

Supplier calendar — season text filter + unresolved-only checkbox.

## Banner

`PG.24`

## Tests

`apps/api/src/pg24-heatmap-filters.test.ts`
