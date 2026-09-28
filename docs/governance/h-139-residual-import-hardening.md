# H-139 — Residual Import Hardening and Finding Disposition

> **AUTHORIZED IMPLEMENTATION RECORD — Residual finding disposition only (Dev/Test).**  
> This is **not** UAT, **not** Production, **not** a PDPC claim, and **not** a repeat of H-137/H-138 UI or import-engine implementation.  
> Historical artefacts through `h-139-import-ingestion-personal-data-remediation.md` are **not renamed, deleted, merged, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — H-139 Residual Import Hardening and Finding Disposition.  
**Commit / push:** **NONE**.

---

## 1. Authorization and scope

```text
H-139 RESIDUAL IMPORT HARDENING — AUTHORIZED
Dev/Test only
Production: NOT AUTHORIZED
UAT: NOT STARTED
```

Scope is disposition of four H-138 import findings. Import create/validate/execute fail-closed behavior from the prior import increment is **not re-implemented**. No DocumentStorage, free-text/JSONB redesign, notifications, logging, field-ops, infrastructure, PDPC determination, UAT, Production, commit, or push.

---

## 2. Baseline repository state

Recorded at the start of this increment:

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty
Porcelain before: 601
Porcelain after: 606
```

Dirty worktree preserved. No reset/clean/stash/revert.

---

## 3. H-138 historical result

H-138 import/ingestion completed as **PASS WITH FINDINGS**. Preserved:

```text
docs/governance/h-138-import-ingestion-personal-data-remediation.md
docs/governance/h-138-phase-c-personal-data-ui-remediation.md
docs/governance/h-137-phase-b-personal-data-api-domain-surface-remediation.md
docs/governance/h-139-import-ingestion-personal-data-remediation.md
```

The four findings dispositioned here originated in that PASS WITH FINDINGS record (and were carried into the subsequent authorized import increment).

---

## 4. Finding-by-finding status

| # | Finding | Status |
| --- | --- | --- |
| 1 | PostgreSQL CHECK still lists `supplier_contact` | **NOT RESOLVED — REQUIRES AUTHORIZATION** |
| 2 | Unwired `supplier-contacts.csv` | **RETAINED WITH CONTROL** |
| 3 | Generic commercial `csv_content` unconstrained | **DEFERRED WITH RATIONALE** |
| 4 | Unused kernel contact-row parser helper | **RESOLVED** |

### Finding 1 — CHECK constraint

**Status:** NOT RESOLVED — REQUIRES AUTHORIZATION

Exact active historical constraint:

```text
packages/db/migrations/014_c4_supplier.sql
sup_import_batches.entity_type CHECK (
  entity_type IN ('supplier', 'supplier_contact', 'supplier_rate', 'supplier_content_block')
)
```

Related leftover (same class of issue, also not altered):

```text
packages/db/migrations/010_c1_merge_import.sql
crm_import_batches.entity_type CHECK (entity_type IN ('organization', 'contact'))
```

Migration 125 explicitly left the supplier CHECK in place (`-- sup_import_batches.entity_type CHECK still lists supplier_contact`). The constraint is **historical and still active** on any catalog that has applied 014. It is **not** test-only metadata.

Removing it requires `ALTER TABLE ... DROP CONSTRAINT` / `ADD CONSTRAINT` in a **new forward-only migration (126)**. Editing 014 or 125 is forbidden. Repository convention is forward-only; application validation already rejects the value, but that **does not** retire the CHECK.

**This increment did not create migration 126.** Owner authorization is required before any schema change.

Application control (not a substitute for CHECK retirement): create/validate/execute refuse `supplier_contact` with `person_domain_removed`; persist skips leftover person-domain batches.

### Finding 2 — Unwired sample CSV

**Status:** RETAINED WITH CONTROL

```text
docs/c4/import/supplier-contacts.csv
```

Inspection:

* not referenced by executable TypeScript/SQL
* not loaded by `seed-demo-data.ts`
* previously presented as a live template in README / field-reference
* cannot execute through the import API because `entityType=supplier_contact` is rejected before CSV persist

The file was **not deleted**. It is marked retired in-file, in README, and in field-reference. Submitting its contents as `supplier_contact` still returns `person_domain_removed` and writes no batch.

### Finding 3 — Generic commercial `csv_content`

**Status:** DEFERRED WITH RATIONALE

Storage: in-memory `csvContent` and PG `crm_import_batches.csv_content` / `sup_import_batches.csv_content` (TEXT). Used by approved types: CRM `organization`; supplier `supplier`, `supplier_rate`, `supplier_content_block`, `supplier_season`.

Verified:

* retired `contact` / `supplier_contact` creates do **not** write `csv_content`
* organization create **does** store CSV (commercial path intact)
* stored commercial CSV is executable later via validate/execute for **that batch’s approved entity type**
* arbitrary personal strings **can** appear inside commercial CSV columns (unconstrained TEXT)

A privacy-safe constraint would require a retention/classification policy, possibly schema change, and/or free-text redesign — all out of scope. **No claim is made that generic CSV storage is inherently non-personal.** Later authorized phase required.

### Finding 4 — Unused kernel contact-row parser

**Status:** RESOLVED

Removed because they parsed person-domain rows, were not on the import execute path, and were a reintroduction risk:

| Removed | File |
| --- | --- |
| `validateContactImportRow` / `ContactImportRow` | `packages/kernel/src/crm-import.ts` |
| `validateSupplierContactImportRow` / `SupplierContactImportRow` / `SUPPLIER_CONTACT_ROLES` | `packages/kernel/src/supplier-import.ts` |

`importRowDuplicateKey` now keys organizations only. Kernel unit test no longer exercises a person-row parser; it asserts `supplier_contact` is retired. These helpers cannot write person records because they no longer exist.

---

## 5. Exact files inspected / changed

Inspected: `014_c4_supplier.sql`, `010_c1_merge_import.sql`, `125_h135_phase1_personal_data_domain.sql`, `043_pg5_supplier_import.sql`, `crm/import.ts`, `supplier/import.ts`, persist CRM/supplier, `pg-repository.ts` `upsertCrmContact`/`upsertSupContact` no-ops, seed, schema JSON, field-reference, README.

Changed this increment:

```text
packages/kernel/src/crm-import.ts
packages/kernel/src/supplier-import.ts
packages/kernel/src/supplier-import.test.ts
docs/c4/import/supplier-contacts.csv
docs/c4/import/README.md
docs/c4/import/field-reference.md
apps/api/src/h139-residual-import-hardening.test.ts
docs/governance/h-139-residual-import-hardening.md
```

Migration 125 unmodified. Migration 126 not created.

---

## 6. Cross-cutting reference audit

| Class | Examples | Disposition |
| --- | --- | --- |
| Historical docs / governance | H-133–H-139 artefacts; architecture previews | Preserved |
| Tests proving rejection | h138/h139/c4 import tests | Retained |
| Dead compatibility shims | leftover batch `entityType` unions; persist skip; `upsertCrmContact` no-op | Fail-closed / no-op |
| Active executable ingest | none for `contact` / `supplier_contact` | Confirmed |
| Commercial retained | organization, supplier, rate, content, season import | Untouched except parser removal |
| Non-import person API leftovers | notes/duplicates/tags `entityType=contact` already `person_domain_removed` | Out of import scope |

`store.supContacts.push` remains only in H-136 API retirement tests (not import execution).

---

## 7. Tests

```text
apps/web tsc --noEmit                         EXIT 0
apps/api tsc --noEmit                         EXIT 0
packages/kernel tsc --noEmit                  EXIT 0
packages/db tsc --noEmit                      EXIT 0

apps/api vitest:
  src/h139-residual-import-hardening.test.ts
  src/h139-import-ingestion-personal-data.test.ts
  src/c4.import.test.ts
  src/c1.merge-import.test.ts
Test Files  4 passed (4)
Tests  24 passed (24)
EXIT 0
  residual: 3, h139-import: 7, c4.import: 7, c1.merge-import: 7

packages/kernel vitest src/supplier-import.test.ts
Test Files  1 passed (1)
Tests  9 passed (9)
EXIT 0
```

Full repository vitest was **not** run.

---

## 8. Commercial regression

**PASS for the import surfaces actually tested.** Organization import still stores CSV and remains executable. C4 supplier master + rate import still succeed. Authentication still required. Costing, proposals, and Rate Identity were **not** re-exercised in this increment; those modules were not modified here. This is **not** a full commercial workflow verification.

---

## 9. Database state

```text
migration 125: unmodified
migration 126: not created
schema changes: none
live migration: not run
```

---

## 10. Runtime limitations

Static typecheck + in-process API/kernel tests only. No live PostgreSQL import run. No UAT. No Production. CHECK evidence is from migration SQL text, not a live `\d` of a running catalog.

---

## 11. Out of scope

DocumentStorage; free-text/JSONB redesign; notifications; logging; field-ops; infrastructure; PDPC registration; EI-01; UI redesign; UAT; Production.

---

## 12. Governance gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
UAT: NOT STARTED
Production: NOT AUTHORIZED / NOT READY
```

---

## Final disposition

```text
PASS WITH FINDINGS
```

No executable person-domain import path remains. Remaining findings are formally dispositioned: CHECK retirement requires Owner-authorized migration 126; generic commercial `csv_content` requires a later policy/design phase.

```text
STOPPED AFTER H-139: YES
COMMIT: NONE
PUSH: NONE
```
