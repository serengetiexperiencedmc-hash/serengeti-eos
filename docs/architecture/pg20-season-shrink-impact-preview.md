# PG.20 — Season shrink impact report

When shrinking a catalogue season’s date or month bounds, report linked rates that fall outside the new window. **Warn-only** — PATCH never blocks on impact.

## API

- `POST /v1/suppliers/seasons/:id/impact-preview` — dry-run proposed patch; returns `impact`
- `PATCH /v1/suppliers/seasons/:id` — applies patch and returns the same `impact` shape

## Impact shape

```json
{
  "linkedRateCount": 1,
  "outsideCount": 1,
  "ratesOutsideBounds": [
    {
      "id": "…",
      "supplierId": "…",
      "rateCode": "WIDE",
      "validFrom": "2026-06-01",
      "validTo": "2026-08-31",
      "reason": "rate_outside_season_dates"
    }
  ],
  "warning": "season_shrink_affects_rates"
}
```

`warning` is `null` when no linked rates are outside.

## Banner

`PG.20`

## Tests

`apps/api/src/pg20-season-shrink-impact.test.ts`
