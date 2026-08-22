# PG.10 — Supplier Content-Block Manual CRUD

**Increment:** PG.10  
**Server version:** `0.45.0-i3.10-pg10`

## Summary

Manual create / update / archive for supplier content blocks (same dual-write path as contacts and rates).

## API

| Route | Auth | Purpose |
| --- | --- | --- |
| POST `/v1/suppliers/:id/content-blocks` | Bearer (`supplier:write:supplier`) | Create |
| PATCH `/v1/suppliers/:id/content-blocks/:blockId` | Bearer | Update |
| DELETE `/v1/suppliers/:id/content-blocks/:blockId` | Bearer | Soft-archive |

Block codes are unique per supplier (active). Setting `isDefault` clears other defaults of the same `blockType`.

## Health

`GET /v1/suppliers/health` → `increment: PG.10`, `contentBlocks` count.

## UI

Supplier Library detail drawer — add / remove content blocks.

## Verification

```bash
npm run test -w @sedmc/api   # pg10-supplier-content-block.test.ts
```
