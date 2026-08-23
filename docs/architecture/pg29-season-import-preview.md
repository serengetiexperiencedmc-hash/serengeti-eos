# PG.29 — Season catalogue import / idempotent upsert

**Increment:** PG.29  
**Server version:** `0.67.0-pg29-i3.29-i4.27`

## Summary

Import named seasons from CSV (`entityType: supplier_season`). `mode: upsert` updates an existing `seasonCode`; `create_only` fails validate with `existing_record_conflict`.

## CSV

Required: `seasonCode`, `label`  
Optional: `validFrom`, `validTo`, `monthFrom`, `monthTo`

## API

Existing import routes. Season batches report increment `PG.29`. Other entity types stay `PG.21`.

## UI

Supplier Import modal — **Season catalogue** (defaults to upsert).

## Tests

`apps/api/src/pg29-season-import.test.ts`  
`packages/kernel/src/supplier-import.test.ts`
