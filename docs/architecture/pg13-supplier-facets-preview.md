# PG.13 — Supplier Search Facets

**Increment:** PG.13  
**Server version:** `0.48.0-i3.12-pg13`

## Summary

Server-side facets and extended list filters for large supplier libraries: category, status, country, preferredPartner, with total + optional limit/offset.

## API

| Route | Purpose |
| --- | --- |
| GET `/v1/suppliers/facets?...` | Facet counts (`increment: PG.13`) |
| GET `/v1/suppliers?country=&preferredPartner=&limit=&offset=` | Filtered list + `total` |

## Health

`increment: PG.13`

## UI

Supplier Library — country facet chips; preferred partners filter server-side.

## Verification

```bash
npm run test -w @sedmc/api   # pg13-supplier-facets.test.ts
```
