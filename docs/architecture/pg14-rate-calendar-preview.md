# PG.14 — Supplier Rate Calendar / Season Views

**Increment:** PG.14  
**Server version:** `0.50.0-pg14-i3.14`

## Summary

Date-window rate calendar: overlapping active rates grouped by season label and by calendar month.

## API

| Route | Purpose |
| --- | --- |
| GET `/v1/suppliers/rates/calendar?from=&to=&supplierId=&seasonLabel=` | Overlapping rates + `seasons` + `months` |

## Health

`increment: PG.14`

## UI

Supplier detail — season field on rate create; calendar chips for seasons/months in the selected window.

## Verification

```bash
npm run test -w @sedmc/api   # pg14-rate-calendar.test.ts
```
