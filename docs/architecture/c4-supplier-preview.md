# C4 — Supplier Management Preview

## Lifecycle status (reconciled for C4 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C4** |
| Capability name | Supplier Management |
| Predecessor | C3 RFP Management |
| Architecture status | Existing committed preview remains the C4 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `014_c4_supplier.sql` (schema-only). ADR-0017 not reopened |
| Runtime health increment | `PG.21` (closed PG identity on supplier health/list; not reopened by C4) |
| Production / UAT / AI | Not authorized |
| Next increments | Not assigned by this preview (Commercial phase may assign C5 after C4 completes) |

The sections after this heading are the architecture contract.

---

**Status:** Schema + import validation implemented for Development/Test  
**Migration:** `packages/db/migrations/014_c4_supplier.sql`  
**Kernel validation:** `packages/kernel/src/supplier-import.ts`

## Objective

Provide a tenant-isolated supplier master (library) with contacts, rate cards, content blocks, and CSV import so Commercial can source programme items from approved suppliers.

## User / business purpose

Procurement and commercial managers maintain the supplier library used by programme costing. Users can search/filter, create and edit suppliers, import CSV batches, and inspect rate-card conflicts already delivered by later PG increments.

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
| Commercial UI (Supplier Library) | Live API in `apps/web/src/app/commercial/suppliers` |
| Health / categories authorization | **C4** — `supplier:read:supplier`, tenant-scoped counts |
| Sensitive-field omission | Implemented (`sanitizeSupplier` omits `tenantId`) |
| Tenant isolation on reads | CRUD + health counts |

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
3. **Review** — Procurement approves `pending_review` suppliers (status via `PATCH`; write permission)
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

- Supplier create → Procurement review (`pending_review` default)
- Supplier approve / bank change → Procurement + Finance (dual control) — bank fields are not a C4 API surface; not expanded here
- Rate publish → Sales maintains; Procurement approves periodic updates — overlap/prefer already delivered by PG.15–PG.17

## API (Dev/Test)

Base path: `/v1/suppliers`  
Auth: Bearer token (local Dev/Test IdP)

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/health` | `supplier:read:supplier` (tenant-scoped counts) |
| GET | `/categories` | `supplier:read:supplier` |
| GET | `/` | `supplier:read:supplier` |
| GET | `/:id` | `supplier:read:supplier` |
| POST | `/` | `supplier:write:supplier` |
| PATCH | `/:id` | `supplier:write:supplier` |
| POST | `/imports` | `supplier:import:bulk` |
| POST | `/imports/:id/validate` | `supplier:import:bulk` |
| GET | `/imports/:id` | `supplier:import:bulk` |
| POST | `/imports/:id/execute` | `supplier:import:bulk` (+ `Idempotency-Key`) |

Implementation: `apps/api/src/supplier/`

### Health semantics

- Unauthenticated → 401
- Missing `supplier:read:supplier` → 403
- Counts include only the caller’s `tenantId` (non-archived masters)
- `increment` remains `PG.21` so closed PG supplier tests are not reopened

### Validation

Create requires `supplierCode`, `legalName`, `category`, `country`. Empty `legalName` → 400 `legal_name_required`.

### Failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Wrong tenant / unknown id | 404 |
| Duplicate supplier code | 409 |
| Invalid create/update | 400 |

### Persistence

Dev/Test in-memory SoR. Schema `014_c4_supplier.sql` is committed. Live PostgreSQL is unverified unless a pool is present (ADR-0017).

### Tenant isolation

All list/get/create/update/import paths are tenant-scoped. Health counts must match.

### Audit / history

Supplier mutations emit supplier audit events (existing). C4 does not add a new audit store.

## UI

- `/commercial/suppliers` — Supplier Library (filters, search, create/edit modal, detail drawer, import)
- Navigation: Resources → Supplier Library
- Create/update UI: [C4 UI preview](./c4-supplier-ui-preview.md)

Do not redesign the Supplier Library unless a remaining contract gap requires it.

## Tests

- Existing `c4.import.test.ts` (CSV validate/execute)
- C4 security: 401, 403 (Alice), cross-tenant 404, tenant-scoped health, sanitized detail (no `tenantId`)

## Explicit exclusions

- Asset upload for content-block images (not required to close C4)
- Reopening PG.8–PG.29 supplier increments or changing health `increment` away from `PG.21`
- Dual-control bank-detail workflow (no C4 bank API)
- UAT / Production / AI / ADR-0017
- I3.38 / I4.35 / I20.23 / PG.30

## Dependencies

C1 CRM (refs), I1 org/principals, I0 tenancy/RBAC.

## Related

- [Commercial roadmap C4](./commercial-roadmap.md)
- [C4 import templates](../c4/import/README.md)
- [C4 UI](./c4-supplier-ui-preview.md)
- [Commercial workspace UI](../../apps/web/README.md)
