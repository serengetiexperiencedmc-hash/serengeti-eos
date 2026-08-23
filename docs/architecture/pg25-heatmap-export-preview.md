# PG.25 — Heatmap CSV/JSON export

**Increment:** PG.25  
**Server version:** `0.63.0-pg25-i3.25-i4.23`

## Summary

Export the PG.23/PG.24 conflict heatmap cells as CSV or JSON, using the same window and season/unresolved filters.

## API

| Route | Query |
| --- | --- |
| GET `/v1/suppliers/rates/conflicts/heatmap/export` | `from`, `to`, `supplierId`, `seasonId`, `seasonLabel`, `unresolvedOnly`, `format=json\|csv` |

Registered before the dedicated heatmap route. Default format is JSON.

CSV columns: `month,seasonLabel,conflictCount,unresolvedCount`.

## UI

Supplier calendar — **Export heatmap CSV** applies the current window + filters.

## Banner

`PG.25` on calendar / conflicts / heatmap / export.

## Tests

`apps/api/src/pg25-heatmap-export.test.ts`
