# PG.11 — Supplier Soft-Delete Cascade & Archive Indexes

**Increment:** PG.11  
**Server version:** `0.46.0-pg11-i3.11`

## Summary

`DELETE /v1/suppliers/:id` soft-archives the supplier and cascades `archivedAt` to active contacts, rates, and content blocks. Partial unique indexes free codes for reuse after archive.

## Persistence

Migration `049_pg11_supplier_archive_indexes.sql`:

- Replace full UNIQUE on supplier/rate/block codes with partial unique indexes `WHERE archived_at IS NULL`
- Add `(tenant_id, archived_at DESC)` indexes for archived scans

## API

| Route | Auth | Purpose |
| --- | --- | --- |
| DELETE `/v1/suppliers/:id` | Bearer (`supplier:write:supplier`) | Archive supplier + cascade |

Response includes `cascaded: { contacts, rates, contentBlocks }`.

## Health

`GET /v1/suppliers/health` → `increment: PG.11`, `archivedSuppliers`.

## Verification

```bash
npm run test -w @sedmc/api   # pg11-supplier-archive.test.ts
```
