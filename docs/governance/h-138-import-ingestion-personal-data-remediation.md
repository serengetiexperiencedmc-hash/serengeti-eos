# H-138 — Import / Ingestion Personal-Data Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Import/ingestion only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** DocumentStorage, free-text/JSONB, notification, logging, or field-ops remediation.  
> Historical H-133 through H-137 artefacts, and the numbering-collision file `h-138-phase-c-personal-data-ui-remediation.md`, are **not renamed, deleted, merged, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — H-138 Import / Ingestion Remediation in Dev/Test only.  
**Commit / push:** **NONE**.

---

## A. Authorization

```text
H-138 IMPORT / INGESTION REMEDIATION — AUTHORIZED
Dev/Test only
Production: NOT AUTHORIZED
UAT: NOT STARTED
```

The Owner authorized elimination of remaining person-domain import/ingestion paths (`entityType=contact`, `entityType=supplier_contact`) after schema, API, and UI person-domain retirement. This increment does **not** authorize schema redesign, migration 126, DocumentStorage, free-text/JSONB, notifications, logging, field-ops, UAT, Production, commit, or push.

---

## B. Repository state

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 589
Porcelain after: 597
```

No reset, clean, stash, revert, or baseline alteration. Unrelated dirty work, including H-137 Phase 3 and H-138 Phase C UI, was preserved.

---

## C. Import inventory

| Import path | Previous state | H-138 disposition | Evidence |
| --- | --- | --- | --- |
| CRM `entityType=contact` | Accepted by `isValidImportEntityType`; create persisted `csvContent`; validate previewed rows; execute returned `person_domain_removed` after CSV stored | Create/validate/execute fail closed with `person_domain_removed` after authorize; **no batch, no csv_content, no person rows** | `crm/import.ts`; h138 API test |
| Supplier `entityType=supplier_contact` | Accepted type; create persisted batch+CSV; execute refused writes | Same fail-closed at create; not an accepted type; no persist | `supplier/import.ts`; `c4.import.test.ts` |
| Kernel accepted unions | `organization \| contact`; supplier list included `supplier_contact` | Accepted types: CRM `organization` only; supplier company/rate/content/season. Retired lists explicit | `crm-import.ts`, `supplier-import.ts` |
| Raw CSV / import batch | `CrmImportBatch.csvContent` / `SupImportBatch.csvContent` in memory; PG persist of batches | Person types never written. Commercial types still store csv_content (generic) | See §F |
| UI dropdown | Phase 3/C already hid options | Client unions no longer include retired types; modal copy no longer says “then contacts” | `crm-api.ts`, `suppliers-api.ts`, import modals |
| Retained CRM organization import | Functional | Remains functional | h138 org import test |
| Retained supplier company/rate import | Functional | Remains functional | `c4.import.test.ts` |
| Guest/HR ingest | Already retired in earlier phases | Unchanged | Not reopened |
| Notes `entityType=contact` | API already `person_domain_removed` | Not an import path; left as prior API retirement | `c1.accounts-notes-tasks.test.ts` |
| Sample file `docs/c4/import/supplier-contacts.csv` | Not seeded since Phase 1 | Left on disk; not wired to seed/execute | Finding |

---

## D. CRM contact import

| File | Change |
| --- | --- |
| `packages/kernel/src/crm-import.ts` | `CRM_IMPORT_ENTITY_TYPES = ["organization"]`; `CRM_RETIRED_IMPORT_ENTITY_TYPES = ["contact"]`; `isRetiredCrmImportEntityType` |
| `packages/kernel/src/crm.ts` | `CrmImportBatch.entityType` remains `"organization" \| "contact"` so leftover stored batches can be classified and refused (compatibility; create never writes `contact`) |
| `apps/api/src/crm/import.ts` | After authorize: retired type → `personDomainRemoved()` with no mutate/csv persist; validate/execute same; contact row persist loop removed |
| `apps/web/src/lib/crm-api.ts` | `CrmImportEntityType = "organization"` |
| `apps/web/src/components/commercial/CrmImportModal.tsx` | Copy no longer instructs contact import |

---

## E. Supplier contact import

| File | Change |
| --- | --- |
| `packages/kernel/src/supplier-import.ts` | `supplier_contact` removed from accepted types; `SUPPLIER_RETIRED_IMPORT_ENTITY_TYPES`; header/validate/execute switches no longer treat it as supported |
| `packages/kernel/src/supplier.ts` | Stored batch `entityType` allows `"supplier_contact"` only for leftover classification |
| `apps/api/src/supplier/import.ts` | Create/validate/execute fail closed; `commitImportRow` throws instead of writing `supContacts` |
| `apps/web/src/lib/suppliers-api.ts` | Union omits `supplier_contact` |
| `apps/web/src/components/commercial/SupplierImportModal.tsx` | Copy no longer mentions contacts |
| `apps/api/src/dev/seed-demo-data.ts` | Comment updated; still does not seed person CSV |

Kernel `validateSupplierContactImportRow` remains as an unused CSV parser helper (kernel unit tests). It is **not** reachable from import create/validate/execute.

---

## F. Raw CSV

Storage objects:

- In-memory: `store.crmImportBatches[].csvContent`, `store.supImportBatches[].csvContent`
- PG: existing import-batch tables (unchanged schema). `csv_content` is generic per batch, not person-type-specific.

H-138 behavior:

- Retired person-domain creates **do not** persist a batch and therefore **do not** persist `csv_content`.
- Rejected person imports are **not** rewritten into organization/supplier-company imports.
- Commercial organization/supplier CSV is still stored on successful create (existing architecture). That payload is unconstrained text and **could** contain arbitrary strings, including names, if a user puts them in commercial columns. That is a **free-text finding**, not remediated here (out of scope).

No historical import rows were deleted.

---

## G. API

`POST /v1/crm/imports` with `entityType=contact`:

1. 401 if unauthenticated
2. After authorize: `400 { error: "invalid_request", reason: "person_domain_removed" }`
3. No batch, no `csvContent`, no `crmContacts`

`POST /v1/suppliers/imports` with `entityType=supplier_contact`: same.

Leftover in-memory batches with those entity types (if any existed from earlier sessions) fail closed on validate/execute with the same reason.

Approved `organization`, `supplier`, `supplier_rate`, `supplier_content_block`, `supplier_season` unchanged aside from type narrowing.

---

## H. UI

- Dropdowns: organization / supplier / rate / content / season only (already hidden in Phase 3; unions now match).
- No query parameter or hard-coded `entityType=contact` / `supplier_contact` support in import modals.
- Client cannot type-safely request retired types.

---

## I. Fixtures/seeds

- Demo seed still does not import `docs/c4/import/supplier-contacts.csv`.
- That CSV file remains on disk as an unwired sample (**finding**; not executed).
- `c4.import.test.ts` and `c1.merge-import.test.ts` rewritten so they no longer create person-domain batches to exercise later steps.

---

## J. Tests

```text
apps/web: npx tsc -p tsconfig.json --noEmit
EXIT 0

apps/web: npx vitest run src/h138-import-ingestion-personal-data-ui.test.ts src/h137-phase-3-personal-data-ui.test.ts src/h138-phase-c-personal-data-ui.test.ts
Test Files  3 passed (3)
Tests  13 passed (13)
EXIT 0

apps/api: npx tsc -p tsconfig.json --noEmit
EXIT 0

apps/api: npx vitest run src/h138-import-ingestion-personal-data.test.ts src/c4.import.test.ts src/c1.merge-import.test.ts
Test Files  3 passed (3)
Tests  20 passed (20)
EXIT 0

packages/kernel: npx tsc -p tsconfig.json --noEmit
EXIT 0

packages/kernel: npx vitest run src/supplier-import.test.ts
Test Files  1 passed (1)
Tests  9 passed (9)
EXIT 0

packages/db: npx tsc -p tsconfig.json --noEmit
EXIT 0
```

Full repository vitest was **not** claimed green.

New proof files:

```text
apps/api/src/h138-import-ingestion-personal-data.test.ts
apps/web/src/h138-import-ingestion-personal-data-ui.test.ts
```

---

## K. Commercial regression

```text
Commercial workflow: PASS
```

Evidence: organization import create/validate/execute commits an org and writes no contacts; C4 supplier master + rate import still succeed; merge-import organization path still used for idempotency tests. Authentication still required on import routes. Rate Identity / costing / proposal code was not modified.

---

## L. Database

```text
migration 125: unmodified
migration 126: not created
live DB migration: NOT RUN
```

**Finding:** PG CHECK on `sup_import_batches.entity_type` may still list `supplier_contact` from earlier migrations. Application create never writes that value. Schema was not changed (this phase forbids migration 126 merely to tidy CHECK).

---

## M. Out of scope

Not remediated in this H-138 import increment:

- DocumentStorage
- free-text/JSONB (including unconstrained commercial CSV text)
- notifications / `recipient_email`
- logging redaction
- field-ops cache
- infrastructure
- PDPC registration
- EI-01
- UAT
- Production

---

## N. Governance gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
Production: NOT AUTHORIZED / NOT READY
UAT: NOT STARTED
```

---

## O. Final disposition

```text
PASS WITH FINDINGS
```

Person-domain import cannot create or persist person records through the identified CRM/supplier import APIs. Findings are non-material leftover schema CHECK listing, an unwired sample CSV file, generic commercial `csv_content`, and an unused kernel contact-row parser helper.

---

## P. STOP

```text
STOPPED AFTER H-138: YES
COMMIT: NONE
PUSH: NONE
```
