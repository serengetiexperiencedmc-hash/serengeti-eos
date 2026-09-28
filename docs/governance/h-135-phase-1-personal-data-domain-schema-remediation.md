# H-135 — Phase 1 Personal-Data Domain/Schema Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Phase 1 Domain/Schema only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** a complete EOS remediation.  
> Historical H-131 through H-134 artefacts, including numbering-collision files, are **not renamed, deleted, or overwritten**.

**Date:** 2026-09-21.  
**Authorization:** Owner grant — Phase 1 Domain/Schema Remediation only.  
**Commit / push:** **NONE**.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006 = OPEN
DP-0006 = OPEN
```

---

## 1. Authorization and scope

The Owner authorized **Phase 1 — Domain/Schema Remediation only**, limited to the repository’s **Dev/Test implementation**.

Implemented:

- A. Guest / manifest / voucher domain (coupled)
- B. CRM person/contact domain
- C. HR employee / leave domain
- D. Supplier individual-contact domain
- E. DSR / consent person-identifying fields
- F. Associated schema constraints / relationships
- G. Dev/Test migration `125_h135_phase1_personal_data_domain.sql`
- H. Schema/domain tests and fixtures required to prove A–E

Not authorized and not implemented: Production changes; Production migration; Production data deletion; infrastructure; hosting; DNS; cloud provisioning; PDPC registration; notification-provider selection; IdP selection; UAT; Production-readiness declaration.

Mechanical compile compatibility (stubs returning `person_domain_removed` after authorize; persist no-ops) was required so the repository is not left unable to type-check. That is **not** Phase 2 API redesign.

---

## 2. Repository baseline

Recorded at the start of this increment (expected values matched):

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain count before: 517
```

No reset, clean, stash, revert, or baseline alteration.

Final validation (end of this increment):

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty
Porcelain count after: 551
```

HEAD and branch unchanged. Index empty. Porcelain increased (this increment’s files plus preserved unrelated dirty work). Unrelated dirty work was not discarded.

---

## 3. Source governance documents

Authoritative inputs (not modified):

```text
docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md
docs/governance/h-132-eos-personal-data-surface-audit.md
docs/governance/h-133-personal-data-capability-disposition-and-remediation-specification.md
docs/governance/h-134-personal-data-remediation-implementation-blueprint.md
```

Preserved historical companions (not modified):

```text
docs/governance/h-132-tin-identity-reconciliation-and-evidence-gate.md
docs/governance/h-133-eos-personal-data-surface-audit.md
docs/governance/h-134-personal-data-capability-disposition-and-remediation-specification.md
docs/governance/h-135-personal-data-remediation-dependency-map.md
```

This file is the Phase 1 **implementation record**. It is not a new disposition specification.

---

## 4. Implementation performed

Dev/Test schema/domain removal of confirmed person-data systems of record, with:

1. Sequential migration `packages/db/migrations/125_h135_phase1_personal_data_domain.sql` (forward-only, matching existing convention; no down file).
2. Persist dual-write / hydrate no-ops for dropped tables.
3. Kernel field removals on remaining commercial objects that previously held contact FKs or DSR/consent person labels.
4. Mechanical API stubs: routes remain; authorized mutations return `{ error: "invalid_request", reason: "person_domain_removed" }`; lists return empty.
5. Seed-demo skip of person ingest (CRM contact CSV, supplier_contact CSV, guest manifest/voucher POSTs).
6. Import **execute** of `entityType=contact` and `entityType=supplier_contact` does not write person rows (create/validate handlers remain — Phase 5 ingest metadata path).
7. Affected tests/fixtures updated. New proof tests added.

Commercial core tables and operator authentication were not dropped or redesigned.

---

## 5. Guest/manifest/voucher remediation

**Fact:** `ops_vouchers.guest_name` and `ops_vouchers.manifest_entry_id NOT NULL` couple vouchers to guest manifests. Guest-level vouchers cannot survive without guest identity.

**Removed (schema):**

```text
ops_vouchers
ops_manifest_entries
ops_manifests
```

Drop order in `125_h135_phase1_personal_data_domain.sql`: vouchers → entries → manifests.

**Retained:** booking headers (`bkg_bookings`), pax counts, dates, commercial statuses, supplier confirmations, ops briefs, field tasks that are not guest-identity SoR.

**Domain:** `apps/api/src/ops/manifests.ts` and `apps/api/src/ops/vouchers.ts` are mechanical stubs. Routes in `apps/api/src/ops/routes.ts` remain for Phase 2.

**Seed:** `apps/api/src/dev/seed-demo-data.ts` no longer POSTs manifests, entries, or vouchers.

**Not invented:** no guest-free voucher semantics.

**Remaining in-memory compile shims:** `store.opsManifests`, `store.opsManifestEntries`, `store.opsVouchers` still exist so analytics/command-center compile. They are not written by the stub APIs or seed. PHASE 2/3/4 leftover.

**Field-ops:** `apps/api/src/ops/field-sync.ts` still lists `manifest_entry` in `deniedOfflineEntities`. That is a string policy, not a schema FK. Left in place (do not expand field-ops). Recorded for later phases.

---

## 6. CRM remediation

**Removed (schema):**

```text
crm_contacts
crm_relationships.from_contact_id / to_contact_id (+ FKs and contact indexes)
crm_activities.contact_id
crm_tasks.related_contact_id
ai_drafts.related_contact_id
```

Polymorphic Dev/Test contact pointers deleted before drop:

```text
crm_notes WHERE entity_type = 'contact'
crm_entity_tags WHERE entity_type = 'contact'
crm_external_identifiers WHERE entity_type = 'contact'
crm_duplicate_candidates WHERE entity_type = 'contact'
crm_merge_records WHERE entity_type = 'contact'
```

Duplicate/merge CHECKs tightened to `organization` only.

**Retained:** `crm_organizations`, `crm_accounts`, org-org relationships, organization notes/tasks/activities, merge/import batch tables.

**Kernel:** contact FK fields removed from `CrmRelationship`, `CrmActivity`, `CrmTask`, `AiDraft` (`packages/kernel/src/crm.ts`, `packages/kernel/src/ai-draft.ts`). `CrmContact` type remains as a compile shim. `CrmImportBatch.entityType` still includes `"contact"` (Phase 5 ingest metadata).

**Persistence:** `upsertCrmContact` / `loadCrmContacts` no-op (`apps/api/src/persistence/pg-repository.ts`). Contact persist branch skipped in `apps/api/src/persistence/crm.ts`.

**API mechanical:** `apps/api/src/crm/contact.ts` — list empty; get `not_found`; create/update/archive `person_domain_removed` after authorize. Relationship/activity/task/merge contact paths refuse `person_domain_removed`. Routes kept.

**Seed/import:** contact CSV seed skipped; `executeCrmImportBatch` for `entityType=contact` returns `person_domain_removed` after validate (create/validate remain).

No replacement person table was created.

---

## 7. HR remediation

**Removed (schema):**

```text
hr_certifications
hr_leave_requests
hr_employee_skills
hr_skills
hr_employees
```

`schema_registry` status set to `retired` for `hr` and `hr-certifications`.

**Fact:** commercial objects do not FK HR tables. Principals remain (operator authentication).

**Domain:** `apps/api/src/hr/hr.ts`, `apps/api/src/hr-certifications/service.ts` stubs. `apps/api/src/hr/collections.ts` `seedDefaultHr` is ensure-only (no employee/leave seed rows).

No HR redesign. EOS is not an HR system.

---

## 8. Supplier-contact remediation

**Removed (schema):**

```text
sup_contacts
```

**Retained:** `sup_suppliers`, `sup_rates`, seasons, content blocks, supplier company commercial fields.

**Domain:** `apps/api/src/supplier/contacts.ts` stubs. Persist `upsertSupContact` / `loadSupContacts` no-ops. `apps/api/src/persistence/supplier.ts` skips `supplier_contact` persist writes.

**Import:** `executeSupplierImportBatch` for `entityType=supplier_contact` returns `person_domain_removed` after validate. `sup_import_batches.entity_type` CHECK still lists `supplier_contact` (Phase 5). Seed does not import `docs/c4/import/supplier-contacts.csv`.

No replacement person/contact table. No “contact available externally” field (Owner Decision, unresolved).

---

## 9. DSR/consent remediation

**Removed (schema columns):**

```text
privacy_dsr_cases.subject_label
consent_records.notes
```

**Retained:** `privacy_processing_activities` catalogue; DSR and consent **case registers** without natural-person labels / consent notes.

**Kernel:** `PrivacyDsrCase` has no `subjectLabel` (`packages/kernel/src/privacy.ts`). `ConsentRecord` has no `notes` (`packages/kernel/src/consent-register.ts`).

**Service:** create/patch ignore `subjectLabel` / `notes` inputs and do not store them (`apps/api/src/privacy/service.ts`, `apps/api/src/consent-register/service.ts`). Seed DSR has no `subjectLabel` (`apps/api/src/privacy/collections.ts`).

Processing-activity catalogue is not redesigned.

---

## 10. Schema/migration changes

| Identifier | Path |
| --- | --- |
| `125_h135_phase1_personal_data_domain.sql` | `packages/db/migrations/125_h135_phase1_personal_data_domain.sql` |

Convention: sequential numeric prefix after `124_f2_dp01_commercial_facts.sql`. Prior migrations are forward-only CREATE/ALTER files with no down files; rollback is restore-from-prior-CREATE, not a 125 down file.

Deterministic. Does not `DROP` commercial core:

```text
crm_organizations, crm_accounts, opp_opportunities, programmes / RFP / proposal / costing tables,
sup_suppliers, sup_rates, principals, tenants, bkg_bookings, privacy_processing_activities
```

CLI migrate-guard still refuses:

```text
eos          → h111_eos_124_only_preserved
eos_gateb    → eos_gateb_not_authorized
```

**Live apply:** this increment did **not** run `migrate()` against Production, `eos`, `eos_gateb`, or UAT `eos_h117_uat`. Operator apply of 125 is only against an authorized Dev/Test catalog, outside this record.

Inventory expectation updated: `apps/api/src/h112-full-schema-migrate-inventory.test.ts` (last file is 125, no 126).

---

## 11. API compatibility changes, if any

Mechanical only (compile + prevent person SoR writes). Routes **not** removed.

Shared helper: `apps/api/src/personal-data-phase1.ts` (`PERSON_DOMAIN_REMOVED`, `personDomainRemoved()`).

| Area | Path | Change |
| --- | --- | --- |
| CRM contact | `apps/api/src/crm/contact.ts` | stub |
| CRM relationship | `apps/api/src/crm/relationship.ts` | org-org only; contactId → `person_domain_removed` |
| CRM activity / task / duplicate / merge | `apps/api/src/crm/activity.ts`, `task.ts`, `duplicate.ts`, `merge.ts` | contact FKs refused |
| CRM import execute | `apps/api/src/crm/import.ts` | `entityType=contact` execute refuses write |
| Ops manifest / voucher | `apps/api/src/ops/manifests.ts`, `vouchers.ts` | stub |
| Supplier contact | `apps/api/src/supplier/contacts.ts` | stub |
| Supplier import execute | `apps/api/src/supplier/import.ts` | `supplier_contact` execute refuses write |
| HR / certifications | `apps/api/src/hr/hr.ts`, `hr-certifications/service.ts` | stub |
| AI drafts | `apps/api/src/ai/drafts.ts` | overdue association org-only |
| Privacy / consent | `apps/api/src/privacy/service.ts`, `consent-register/service.ts` | person fields not stored |
| Persist | `apps/api/src/persistence/pg-repository.ts`, `crm.ts`, `supplier.ts` | no dual-write to dropped tables |
| Seed | `apps/api/src/dev/seed-demo-data.ts` | skip person ingest |

```text
PHASE 2 — API REMEDIATION REQUIRED
```

| Route | Method | Dependency | Reason | Expected disposition |
| --- | --- | --- | --- | --- |
| `/v1/crm/contacts` | GET, POST | `crm_contacts` dropped | obsolete person SoR | remove or replace with non-person commercial UX |
| `/v1/crm/contacts/:id` | GET, PATCH | same | same | same |
| `/v1/crm/contacts/:id/archive` | POST | same | same | same |
| `/v1/crm/contacts/:id/relationships` | GET | contact PK gone | same | same |
| `/v1/crm/contacts/:id/activities` | GET | same | same | same |
| `/v1/crm/contacts/:id/notes` | GET | polymorphic contact notes deleted | same | same |
| `/v1/ops/manifests/by-booking/:bookingId` | GET, POST | `ops_manifests` dropped | guest SoR gone | remove guest-manifest API |
| `/v1/ops/manifests/:id/entries` | POST | `ops_manifest_entries` dropped | same | same |
| `/v1/ops/manifests/:id/publish` | POST | same | same | same |
| `/v1/ops/vouchers` | GET | `ops_vouchers` dropped | guest voucher gone | remove guest-voucher API |
| `/v1/ops/vouchers/generate` | POST | same | same | same |
| `/v1/ops/vouchers/:id/issue` | POST | same | same | same |
| `/v1/ops/vouchers/issue-all` | POST | same | same | same |
| `/v1/hr/employees` | GET, POST | `hr_employees` dropped | HR SoR gone | remove HR employee API |
| `/v1/hr/employees/:id` | GET, PATCH | same | same | same |
| `/v1/hr/employees/:id/skills` | POST, DELETE | `hr_employee_skills` dropped | same | same |
| `/v1/hr/leave` | POST | `hr_leave_requests` dropped | same | same |
| `/v1/hr/skills` | GET, POST | `hr_skills` dropped | same | same |
| `/v1/hr/certifications` | GET, POST | `hr_certifications` dropped | employee_id dependency | remove with HR |
| `/v1/suppliers/:id/contacts` | POST | `sup_contacts` dropped | individual supplier contact gone | remove person-contact API |
| `/v1/suppliers/:id/contacts/:contactId` | PATCH, DELETE | same | same | same |
| `/v1/privacy/dsrs` | POST, PATCH | `subject_label` dropped | payload still accepted, not stored | stop accepting person labels |
| `/v1/consents` | POST, PATCH | `notes` dropped | payload still accepted, not stored | stop accepting consent notes |

---

## 12. UI compatibility changes, if any

**None** beyond typecheck remaining green. Web client types still mention `guestName`, `subjectLabel`, HR employees, supplier contacts (`apps/web/src/lib/ops-api.ts`, `privacy-api.ts`, `hr-api.ts`, `suppliers-api.ts`). Pages and components were **not** redesigned.

```text
PHASE 3 — UI REMEDIATION REQUIRED
```

Substantive removals/redesigns remain for CRM contact screens, HR screens, ops manifest/voucher screens, supplier contact UI, and privacy DSR subject-label fields.

---

## 13. Test/fixture changes

| Path | Role |
| --- | --- |
| `packages/db/src/h135-phase1-personal-data-domain.test.ts` | static: 125 last; drops person tables; does not drop commercial core; migrate-guard |
| `apps/api/src/h135-phase1-personal-data-domain.test.ts` | auth; person APIs refuse; commercial org→account→opportunity→RFP→programme→costing→supplier/rate; DSR/consent fields not stored |
| `apps/api/src/h112-full-schema-migrate-inventory.test.ts` | last migration 125 |
| `apps/api/src/c1.contacts.test.ts` | contact SoR gone; org-org relationships remain |
| `apps/api/src/c1.activities.test.ts` | org-only activities |
| `apps/api/src/c1.accounts-notes-tasks.test.ts` | organization notes |
| `apps/api/src/c1.search-duplicates.test.ts` | no contact duplicate SoR |
| `apps/api/src/c1.events.test.ts` | no `CONTACT_CREATED` |
| `apps/api/src/crm.security.regression.test.ts` | AZ-03 against removed contact SoR |
| `apps/api/src/crm.integration.test.ts` | `crm_contacts` must not exist after 125 |
| `apps/api/src/pg-crm.integration.test.ts` | `createContact` → `person_domain_removed` |
| `apps/api/src/i10-hr-core.test.ts` | HR auth kept; employee/leave SoR gone |
| `apps/api/src/h1-hr-certifications.test.ts` | certification writes refused |
| `apps/api/src/o1-ops.test.ts` | manifest create refused; briefs still issued |
| `apps/api/src/o4-vouchers.test.ts` | voucher generate/issue refused |
| `apps/api/src/pg9-supplier-contact-rate.test.ts` | contact refused; rates remain |
| `apps/api/src/pg11-supplier-archive.test.ts` | cascade contacts 0 |
| `apps/api/src/pg12-supplier-restore.test.ts` | restore contacts 0 |
| `apps/api/src/c4.import.test.ts` | supplier_contact execute does not write |
| `apps/api/src/p3-consent-register.test.ts` | notes not stored |
| `apps/api/src/dev/seed-demo-data.ts` | skip person seed |

Kernel scoring helpers such as `scoreContactDuplicatePair` remain (not a SoR).

---

## 14. Validation commands/results

All commands Dev/Test local. Not Production. Not UAT.

```text
apps/api:        npx tsc -p tsconfig.json --noEmit     EXIT 0
packages/kernel: npx tsc -p tsconfig.json --noEmit     EXIT 0
packages/db:     npx tsc -p tsconfig.json --noEmit     EXIT 0
apps/web:        npx tsc -p tsconfig.json --noEmit     EXIT 0
```

```text
packages/db:
  npx vitest run src/h135-phase1-personal-data-domain.test.ts src/migrate.test.ts
  Test Files  2 passed
  Tests       4 passed
  EXIT 0

  (h112 inventory is in apps/api; also EXIT 0 in the API run below)
```

```text
apps/api:
  npx vitest run src/h135-phase1-personal-data-domain.test.ts src/c1.contacts.test.ts
    src/c1.activities.test.ts src/c1.accounts-notes-tasks.test.ts src/i10-hr-core.test.ts
    src/h1-hr-certifications.test.ts src/o1-ops.test.ts src/o4-vouchers.test.ts
    src/pg9-supplier-contact-rate.test.ts src/c4.import.test.ts src/p3-consent-register.test.ts
    src/p1-privacy-ropa-dsr.test.ts src/c1.search-duplicates.test.ts src/c1.events.test.ts
    src/crm.security.regression.test.ts src/crm.integration.test.ts
    src/h112-full-schema-migrate-inventory.test.ts
  First run: 2 failed (activities duplicate org name; P3 CNS code after notes-ignore create) — remediated in Phase 1 tests.
  Re-run: npx vitest run src/c1.activities.test.ts src/p3-consent-register.test.ts
    src/pg11-supplier-archive.test.ts src/pg12-supplier-restore.test.ts src/c1.merge-import.test.ts
  Test Files  5 passed / Tests 23 passed / EXIT 0

  H-135 proof file: 5 passed (auth, person refuse, commercial path, DSR/consent).
```

`EOS_RUN_PG_TESTS` was not `1` in this session; live PostgreSQL apply of 125 was **not** executed. Static inventory + migrate-guard tests passed. CRM integration PG cases were skipped as before.

These results do **not** make the application production-ready.

---

## 15. Commercial workflow integrity

**PASS** (Dev/Test structural proof in `apps/api/src/h135-phase1-personal-data-domain.test.ts`).

Verified remaining:

```text
Organization → Account → Opportunity → RFP → Programme → Costing sheet
Supplier company → Rates
Operator login /v1/auth/login
Tenant isolation (unauthenticated 401)
```

Commercial objects preserved: **YES**.  
Authentication preserved: **YES** (principals, sessions, login unchanged).

Kernel/commercial facts, rate identity, pax counts, dates, budgets, currencies, statuses, approval/handoff tables were not dropped by 125.

---

## 16. Out-of-scope items

```text
API redesign:              NOT IMPLEMENTED (mechanical stubs only)
UI redesign:               NOT IMPLEMENTED
Import/export redesign:    NOT IMPLEMENTED (execute skip only; handlers remain)
DocumentStorage:           NOT IMPLEMENTED
Free-text/JSONB redesign:  NOT IMPLEMENTED
Notifications:             NOT IMPLEMENTED — OWNER DECISION REQUIRED
Logging:                   NOT IMPLEMENTED
Field-ops cache:           NOT IMPLEMENTED (manifest_entry string left in deniedOfflineEntities)
Infrastructure:            NONE
Production:                NOT AUTHORIZED / NOT READY
PDPC:                      OPEN
EI-01:                     OPEN / REQUIRES OWNER EVIDENCE REVIEW
UAT:                       not this phase
```

---

## 17. Remaining dependencies for Phase 2+

**Phase 2 — API remediation:** routes listed in §11; kernel person *types* (`CrmContact`, `HrEmployee`, `OpsManifest`, `OpsVoucher`, `SupContact`) still exported as compile shims; Store collections still exist; analytics (`apps/api/src/analytics/operations.ts`) and command-center still *read* in-memory manifest/voucher arrays if any caller pushes fixtures.

**Phase 3 — UI:** CRM contact pages/components; HR UI; ops manifest/voucher UI; supplier contact UI; `apps/web/src/lib/privacy-api.ts` `subjectLabel`; web `ops-api.ts` `guestName`.

**Phase 5 — import/export:** `CRM entityType=contact`; `supplier supplier_contact`; CSV files under `docs/c4/import/supplier-contacts.csv`; `CrmImportBatch.entityType` still `"organization" | "contact"`. Removing tables did **not** eliminate the ingest path metadata.

**Phase 6 / later:** free-text/JSONB; DocumentStorage MIME; notification `recipient_email` (Owner Decision); logger redaction; field-ops `manifest_entry` policy string.

**Owner Decision Required (unchanged):** notification architecture; “contact available externally”; IdP; PDPC.

Do not proceed automatically into Phase 2.

---

## 18. Risks/blockers

- In-memory Store collections can still hold person-shaped objects if tests or future code `push` them. APIs/seed/persist no longer write them. Residual compile shims are a Phase 2/4 leftover, not a hidden UI-only change.
- Live Dev/Test catalogs that already applied through 124 have **not** had 125 applied in this increment. Operator must apply 125 only to an authorized Dev/Test database.
- Dual catalogs `eos` (H-111 124-only) and `eos_gateb` remain refused by migrate-guard.
- CRM notes `entityType=contact` is still a kernel union member; create against a missing contact id fails `invalid_entity`. PHASE 2.
- `c10-command-center` / `j2-ops-analytics` still accept in-memory manifest/voucher fixtures. Not redesigned.

No blocker prevented Phase 1 schema/domain implementation. Field-ops had no schema FK breakage requiring STOP.

---

## 19. Governance gates

```text
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
Production = NOT AUTHORIZED / NOT READY
ADR-0006 = OPEN
DP-0006 = OPEN
```

This phase does **not** make SEDMC legally compliant with PDPC requirements. It does **not** claim an exemption. PDPC registration was not performed.

H-131 boundary remains: EOS shall not be a personal-data system of record. Phase 1 removes the authorized Dev/Test schema/domain SoR surfaces. Residual API/UI/import/document/free-text/notification surfaces remain until later phases.

---

## 20. Conclusion

**H-135 RESULT: PASS**

Phase 1 Domain/Schema Remediation is **IMPLEMENTED** for Dev/Test: guest/manifest/voucher, CRM person-contact, HR employee/leave, supplier individual-contact, and DSR/consent person-identifying fields are removed at schema/domain layer with migration 125, persist no-ops, mechanical API stubs, seed/import execute skip, and Dev/Test tests proving commercial workflow and authentication remain.

This is **not** complete EOS remediation, **not** UAT, and **not** Production readiness.

**STOP after Phase 1.**
)
