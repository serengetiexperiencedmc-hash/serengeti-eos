# H-139 — Actual Import / Ingestion Personal-Data Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Import/ingestion only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** DocumentStorage, free-text/JSONB, notification, logging, or field-ops remediation.  
> Historical H-133 through H-138 artefacts, including `h-138-phase-c-personal-data-ui-remediation.md` and the intervening `h-138-import-ingestion-personal-data-remediation.md`, are **not renamed, deleted, merged, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — H-139 actual import/ingestion personal-data remediation in Dev/Test only.  
**Commit / push:** **NONE**.

---

## Authorization

```text
H-139 ACTUAL IMPORT / INGESTION REMEDIATION — AUTHORIZED
Dev/Test only
Production: NOT AUTHORIZED
UAT: NOT STARTED
```

This increment removes remaining executable ingestion paths for retired person-domain import types (`entityType=contact`, `entityType=supplier_contact`) while preserving approved non-person commercial imports. It does **not** authorize schema redesign, migration 126, UI redesign, DocumentStorage, free-text/JSONB, notifications, logging, field-ops, UAT, Production, commit, or push.

---

## Historical correction

> H-138 produced a Phase C UI remediation artifact and did not execute the intended import/ingestion remediation. H-138 is preserved as historical evidence and is not overwritten.

Preserved H-138 files:

```text
docs/governance/h-138-phase-c-personal-data-ui-remediation.md
docs/governance/h-138-import-ingestion-personal-data-remediation.md
```

The Phase C file is the Owner-identified duplicate UI re-validation of H-137 Phase 3. An intervening uncommitted import-layer file also exists in the dirty tree; it is preserved as historical evidence. **H-139 is the authorized import/ingestion record.**

This phase did **not** repeat H-137/H-138 UI remediation. UI call-sites were inspected only to confirm the client cannot type-safely submit retired entity types; the engine fail-closed independently of the dropdown.

---

## Repository state

Recorded at the start of this increment:

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 597
Porcelain after: 601
```

No reset, clean, stash, revert, or baseline alteration. Unrelated dirty work, including H-137 Phase 3, H-138 Phase C, and intervening import-layer edits, was preserved.

---

## Import inventory

| Surface | Previous state | H-139 result | Evidence |
| --- | --- | --- | --- |
| CRM `entityType=contact` | Create already fail-closed in dirty tree; leftover batches could still be classified | Create/preview/execute fail closed with `person_domain_removed`; leftover validated batches cannot commit; no `crmContacts` writes | `crm/import.ts`; h139 API test |
| Supplier `entityType=supplier_contact` | Create already fail-closed; leftover conflict/rollback still treated contact rows | Same fail-closed; conflict matcher and rollback no longer reconstruct person rows; persist skip | `supplier/import.ts`; persist; h139 + c4 tests |
| Entity-type unions | Accepted types already org / supplier / rate / content / season | Unchanged; retired lists explicit | kernel `crm-import.ts`, `supplier-import.ts` |
| Preview (`POST .../validate`) | Retired leftover batches returned `person_domain_removed` | Confirmed; leftover status does not progress | h139 leftover validate tests |
| Mapping | No saved column-mapping registry; headers are entity-type-specific | No preset/mapping can newly configure `contact` / `supplier_contact` | kernel accepted unions; schema oneOf |
| Execution (`POST .../execute`) | Retired leftover batches refused | Confirmed; leftover `validated` batches cannot become `committed` | h139 leftover execute tests |
| Import batches | Leftover PG/memory rows possible | Historical rows not deleted; validate/execute refuse; persist will not re-write person-domain batches | persist skip |
| Raw CSV | Commercial batches store `csv_content`; person create does not | Person create stores nothing; leftover CSV remains if historically present (finding) | § Raw CSV |
| Presets | No CRM/supplier import-preset table | None exist; JSON schema no longer accepts `supplier_contact` as a batch const | schema + h139 preset test |
| Fixtures | `docs/c4/import/supplier-contacts.csv` unwired | Left on disk; seed does not load it | `seed-demo-data.ts` |
| Alternate ingest | `upsertCrmContact` / `upsertSupContact` already no-ops | Confirmed no-ops; import no longer calls person persist | `pg-repository.ts` |
| AI/automation | No import-execute helper in AI drafts | None found | inventory |
| UI call-sites | Phase 3/C hid dropdowns; client unions already org/supplier-only | Not redesigned; client types remain retired | `crm-api.ts`, `suppliers-api.ts` |

---

## CRM contact

Accepted import type is `organization` only.

`POST /v1/crm/imports` with `entityType=contact` (after authorize): `400 { error: "invalid_request", reason: "person_domain_removed" }`. No batch, no `csvContent`, no `crmContacts`.

Leftover in-memory/PG batches with `entityType=contact`:

- `POST /v1/crm/imports/:id/validate` → `person_domain_removed`; status unchanged
- `POST /v1/crm/imports/:id/execute` → `person_domain_removed`; cannot become `committed`
- PG persist of those batches is skipped (`entityType === "contact"`)

Compatibility: `CrmImportBatch.entityType` still allows `"contact"` so leftover rows can be classified and refused. Runtime ingest is impossible.

Kernel `validateContactImportRow` remains an unused CSV parser helper (not reachable from create/validate/execute).

---

## Supplier contact

Accepted types: `supplier`, `supplier_rate`, `supplier_content_block`, `supplier_season`.

`POST /v1/suppliers/imports` with `entityType=supplier_contact`: same `person_domain_removed` fail-closed. No batch, no `supContacts`.

Leftover batches: validate/execute refuse; persist skip; `commitImportRow` throws; rollback no longer filters `supContacts` as if person rows had been written.

`upsertSupContact` remains a no-op (table dropped in H-135).

Supplier company, rates, content blocks, seasons, and Rate Identity were not redesigned.

---

## API

Affected routes (auth unchanged: 401 without bearer):

```text
POST /v1/crm/imports
POST /v1/crm/imports/:id/validate
POST /v1/crm/imports/:id/execute
POST /v1/suppliers/imports
POST /v1/suppliers/imports/:id/validate
POST /v1/suppliers/imports/:id/execute
```

GET leftover batch by id remains an audit read of stored metadata (no `csvContent` in sanitize). It does not execute ingest.

---

## Raw CSV

Stored on:

- in-memory `crmImportBatches[].csvContent` / `supImportBatches[].csvContent`
- PG `crm_import_batches.csv_content` / `sup_import_batches.csv_content` (generic TEXT)

Behavior:

- Retired **create** does not persist CSV.
- Leftover historical person-domain CSV, if present, is not deleted.
- Persist skip prevents re-writing leftover person-domain batches.
- Commercial CSV remains unconstrained text (**free-text finding**, out of scope).

---

## Import batches

Retired person-domain batches cannot transition to a successful ingestion:

```text
create → refused (no row)
leftover pending/validated → validate refused, execute refused
committed person ingest → not reachable
```

Historical rows are not destroyed.

---

## Fixtures/tests

- Demo seed does not import person CSV; comments updated to H-139.
- `docs/c4/import/supplier-contacts.csv` remains unwired (**finding**).
- JSON schema `oneOf` no longer includes a `supplier_contact` batch; historical `SupplierContactRecord` definition is marked retired and unused.
- Field-reference entity-type list no longer presents `supplier_contact` as supported.
- New: `apps/api/src/h139-import-ingestion-personal-data.test.ts`.

---

## Commercial regression

```text
Commercial workflow: PASS
```

Evidence: organization import create/validate/execute still commits an org and writes no contacts; C4 supplier master + rate import still succeed (`c4.import.test.ts`); merge-import organization path retained. Authentication still required. Rate Identity / costing / proposal code was not modified in this increment.

---

## Database

```text
migration 125: unmodified
migration 126: not created
schema changes: none
live migration: not run
```

**Finding:** historical PG CHECK on `sup_import_batches.entity_type` may still list `supplier_contact`. Application create never writes that value. Schema was not changed.

---

## Out of scope

Not remediated in H-139:

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
- UI redesign already evidenced by H-137/H-138 Phase C

---

## Governance gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
UAT: NOT STARTED
Production: NOT AUTHORIZED / NOT READY
```

---

## Tests

```text
apps/web: npx tsc -p tsconfig.json --noEmit
EXIT 0

apps/api: npx tsc -p tsconfig.json --noEmit
EXIT 0

packages/kernel: npx tsc -p tsconfig.json --noEmit
EXIT 0

packages/db: npx tsc -p tsconfig.json --noEmit
EXIT 0

apps/api: npx vitest run src/h139-import-ingestion-personal-data.test.ts src/c4.import.test.ts src/c1.merge-import.test.ts
Test Files  3 passed (3)
Tests  21 passed (21)
EXIT 0
  h139-import-ingestion-personal-data.test.ts: 7 passed
  c4.import.test.ts: 7 passed
  c1.merge-import.test.ts: 7 passed

packages/kernel: npx vitest run src/supplier-import.test.ts
Test Files  1 passed (1)
Tests  9 passed (9)
EXIT 0
```

Full repository vitest was **not** claimed green.

---

## Final disposition

```text
PASS WITH FINDINGS
```

No identified path can ingest a CRM contact or supplier individual contact through the import engine. Findings are non-material leftovers: schema CHECK listing, unwired sample CSV, unused kernel person-row parser helpers, unused historical JSON `SupplierContactRecord` definition, generic commercial `csv_content`, and leftover GET-by-id audit of historical batches.

---

## Stop condition

```text
STOPPED AFTER H-139: YES
COMMIT: NONE
PUSH: NONE
```
