# C4 — Supplier Management Preview

**Status:** Schema + import validation implemented for Development/Test  
**Migration:** `packages/db/migrations/014_c4_supplier.sql`  
**Kernel validation:** `packages/kernel/src/supplier-import.ts`

## Scope (C4 increment)

| Deliverable | Status |
| --- | --- |
| Supplier master (`sup_suppliers`) | Migration ready |
| Supplier contacts (`sup_contacts`) | Migration ready |
| Rate cards (`sup_rates`) | Migration ready |
| Content blocks (`sup_content_blocks`) | Migration ready |
| Bulk import batches (`sup_import_batches`) | Migration ready |
| CSV import validation (kernel) | Implemented + tested |
| REST API (`/v1/suppliers`) | Implemented (Dev/Test) |
| Commercial UI (Supplier Library) | Live API in `apps/web/commercial/suppliers` |

## Database tables

```
sup_import_batches
sup_suppliers          ← master (300+ target)
sup_contacts           ← reservations, ops, finance contacts
sup_rates              ← seasonality, validity dates
sup_content_blocks     ← descriptions, programme copy, asset refs
sup_import_execute_idempotency
```

All tables follow EOS record patterns: `tenant_id`, audit columns, `version`, soft delete via `archived_at`, classification default `Confidential`.

## Import workflow

Mirrors C1 CRM bulk import:

1. **Upload CSV** — one entity type per batch
2. **Validate** — kernel validators in `@sedmc/kernel/supplier-import`
3. **Review** — Procurement approves `pending_review` suppliers
4. **Commit** — idempotent; requires `supplier:import:bulk` permission and `Idempotency-Key` header

### Import order

1. `suppliers.csv`
2. `supplier-contacts.csv`
3. `supplier-rates.csv`
4. `supplier-content-blocks.csv`

Templates and field reference: [`docs/c4/import/`](../c4/import/README.md)

## Entity type mapping

| CSV entity | DB table | Required headers |
| --- | --- | --- |
| `supplier` | `sup_suppliers` | supplierCode, legalName, category, country, status |
| `supplier_contact` | `sup_contacts` | supplierCode, contactRole, givenName, familyName |
| `supplier_rate` | `sup_rates` | supplierCode, rateCode, rateName, rateType, amount, currency, validFrom, validTo, status |
| `supplier_content_block` | `sup_content_blocks` | supplierCode, blockCode, blockType, body, status |

## Approval gates

Per [`16-human-approval-matrix.md`](./16-human-approval-matrix.md):

- Supplier create → Procurement review
- Supplier approve / bank change → Procurement + Finance (dual control)
- Rate publish → Sales maintains; Procurement approves periodic updates

## API (Dev/Test)

Base path: `/v1/suppliers`  
Auth: Bearer token (local dev IdP)

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/health` | authenticated |
| GET | `/categories` | authenticated |
| GET | `/` | `supplier:read:supplier` |
| GET | `/:id` | `supplier:read:supplier` |
| POST | `/imports` | `supplier:import:bulk` |
| POST | `/imports/:id/validate` | `supplier:import:bulk` |
| GET | `/imports/:id` | `supplier:import:bulk` |
| POST | `/imports/:id/execute` | `supplier:import:bulk` (+ `Idempotency-Key`) |

Implementation: `apps/api/src/supplier/`

## Next implementation steps

1. ~~`apps/api/src/supplier/` — CRUD + import routes~~ ✓ Dev/Test
2. ~~Wire Supplier Library UI to API~~ ✓ Dev/Test
3. Asset upload endpoint for content block images
4. Rate overlap warnings at validation time
5. Manual supplier create/update UI

## Related

- [Commercial roadmap C4](./commercial-roadmap.md)
- [C4 import templates](../c4/import/README.md)
- [Commercial workspace UI](../../apps/web/README.md)
