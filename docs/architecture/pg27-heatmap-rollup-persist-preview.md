# PG.27 — Heatmap rollup persist / season catalogue export

**Increment:** PG.27  
**Server version:** `0.65.0-pg27-i3.27-i4.25`

## Summary

Persist the last computed heatmap supplier rollup per tenant (dual-write when `EOS_DATABASE_URL` is set) and export the season catalogue as CSV/JSON.

## API

| Route | Change |
| --- | --- |
| GET calendar / conflicts / heatmap / export | `increment` `PG.27`; heatmap GET/export stamps `lastSnapshot` |
| GET `…/heatmap/rollup-status` | `{ lastSnapshot }` |
| GET `/v1/suppliers/seasons/export` | `format=json\|csv`, optional `archived` |

## Persist

Migration `061_pg27_heatmap_rollup_snapshot.sql` — table `sup_heatmap_rollup_snapshot` (PK `tenant_id`). Hydrate on API startup.

## UI

Supplier Library — **Export season catalogue**. Calendar label **Rate calendar (PG.27)**.

## Banner

`PG.27`

## Tests

`apps/api/src/pg27-heatmap-rollup-persist.test.ts`
