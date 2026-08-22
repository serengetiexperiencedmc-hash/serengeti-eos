# PG.19 — Season date-range validation on rates

When a rate is linked to a catalogue season (`seasonId` / import-resolved season), `validFrom`/`validTo` must lie within the season’s absolute dates and/or month window.

## Errors

- `rate_outside_season_dates`
- `rate_outside_season_months`

Enforced on create, update (including `seasonId` patch), and import validate. Free-text `seasonLabel` alone is unconstrained. Banner: `PG.19`.

## Tests

`apps/api/src/pg19-rate-season-bounds.test.ts`
