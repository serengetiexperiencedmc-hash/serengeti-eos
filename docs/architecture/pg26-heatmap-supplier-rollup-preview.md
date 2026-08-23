# PG.26 — Heatmap supplier rollup / multi-supplier export

**Increment:** PG.26  
**Server version:** `0.64.0-pg26-i3.26-i4.24`

## Summary

Roll up conflict heatmap counts by supplier and export that rollup as CSV/JSON across one or all suppliers.

## API

| Route | Change |
| --- | --- |
| GET calendar / conflicts / heatmap | `heatmap.suppliers[]` |
| GET `…/heatmap/export` | `view=cells\|suppliers` (omit `supplierId` for all suppliers) |

Supplier row: `supplierId, supplierCode, legalName, conflictCount, unresolvedCount`.

## UI

Supplier Library — **Export heatmap rollup**. Calendar still exports cells for the open supplier.

## Banner

`PG.26`

## Tests

`apps/api/src/pg26-heatmap-supplier-rollup.test.ts`
