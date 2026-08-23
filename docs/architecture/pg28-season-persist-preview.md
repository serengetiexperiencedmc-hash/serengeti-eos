# PG.28 — Persist season catalogue

**Increment:** PG.28  
**Server version:** `0.66.0-pg28-i3.28-i4.26`

## Summary

Complete migration 055: dual-write `sup_seasons` on create/update/archive, hydrate on API startup, and persist `season_id` on rates.

## Behaviour

- `persistSupEntityAfterCommit(..., "supplier_season", id)`
- `hydrateSupFromPostgres` merges seasons
- `upsertSupRate` writes `season_id`

Uses existing table `sup_seasons` (no new migration).

## Banner

Season list/create/update/archive/export: `PG.28`

## Tests

`apps/api/src/pg28-season-persist.test.ts`
