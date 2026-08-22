# PG.22 — Season expand backfill suggestions

After expanding a catalogue season’s bounds, suggest unlinked rates that now fit and optionally link them.

## API

- `POST /v1/suppliers/seasons/:id/expand-backfill-preview` — dry-run (optional proposed patch)
- `POST /v1/suppliers/seasons/:id/backfill-rates` — link candidates (`rateIds` optional)
- `PATCH /v1/suppliers/seasons/:id` — also returns `expandBackfill`

## expandBackfill shape

```json
{
  "suggestionCount": 1,
  "suggestions": [
    {
      "id": "…",
      "supplierId": "…",
      "rateCode": "ORPHAN",
      "validFrom": "2026-06-15",
      "validTo": "2026-08-15"
    }
  ],
  "hint": "season_expand_backfill_available"
}
```

Candidates are non-archived rates with **no** `seasonId` that pass PG.19 bounds for the (proposed) season.

## Banner

`PG.22`

## Tests

`apps/api/src/pg22-season-expand-backfill.test.ts`
