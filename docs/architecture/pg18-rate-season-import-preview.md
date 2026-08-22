# PG.18 — Season-aware rate import mapping

Rate CSV import resolves optional `seasonCode` (preferred) or `seasonLabel` against the PG.17 seasons catalogue and sets `seasonId` + canonical `seasonLabel` on commit.

## Behaviour

- Unknown code/label → validate error `season_not_found`
- Ambiguous label match → `ambiguous_season_label`
- Neither field → unchanged (no season link)
- Import batch responses banner `increment: "PG.18"`

## Tests

`apps/api/src/pg18-rate-season-import.test.ts`
