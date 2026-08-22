# PG.23 — Season calendar conflict heatmap

**Increment:** PG.23  
**Server version:** `0.61.0-pg23-i3.23-i4.21`

## Summary

Aggregate rate-card conflicts by month and season label so commercial users can see where overlapping cards cluster.

## API

| Route | Change |
| --- | --- |
| GET `/v1/suppliers/rates/calendar` | Adds `heatmap` |
| GET `/v1/suppliers/rates/conflicts` | Adds `heatmap` |
| GET `/v1/suppliers/rates/conflicts/heatmap` | Dedicated heatmap payload |

## heatmap shape

```json
{
  "months": [{ "month": "2026-07", "conflictCount": 1, "unresolvedCount": 1 }],
  "seasons": [{ "label": "High A", "conflictCount": 1, "unresolvedCount": 1 }],
  "cells": [{ "month": "2026-07", "seasonLabel": "High A", "conflictCount": 1, "unresolvedCount": 1 }],
  "maxConflictCount": 1
}
```

A conflict increments every overlap month and each distinct season label on the pair.

## UI

Supplier detail calendar — month chips tinted by conflict intensity.

## Banner

`PG.23` on calendar / conflicts / heatmap.

## Tests

`apps/api/src/pg23-season-conflict-heatmap.test.ts`
