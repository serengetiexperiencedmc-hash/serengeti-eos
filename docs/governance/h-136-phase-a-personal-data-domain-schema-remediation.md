# H-136 — Phase A Personal-Data Domain/Schema Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Phase A Domain/Schema only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** a complete EOS remediation.  
> H-131 through H-135 artefacts, including numbering-collision files, are **not renamed, deleted, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — Phase A Domain and Schema Remediation.  
**Commit / push:** **NONE**.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006 = OPEN
DP-0006 = OPEN
```

---

## 1. Owner authorization

The Owner authorized **Phase A — Domain and Schema Remediation** of the EOS personal-data boundary programme, Dev/Test only, following H-131 (boundary), H-132 (surface audit), H-133 (disposition), H-134 (blueprint), and H-135 (dependency map).

The dirty worktree already contained the authorized H-135 Phase 1 domain/schema implementation of the same A1–A5 cluster. This increment **did not redo that drop as a second migration**. It:

- verified the existing `125` drop against H-135 map evidence and H-136 Phase A rules;
- added H-136 referential-integrity tests (023/029/004/014/015/081/092/110 vs 125);
- added H-136 commercial/auth proof tests;
- recorded Phase A in this file.

No API/UI/import/notification/document redesign was performed.

---

## 2. Scope

Implemented (A1–A6 only):

1. Guest/manifest/voucher domain remediation (coupled cluster)
2. CRM person-contact domain remediation
3. HR employee/leave (+ employee-bound certifications)
4. Supplier individual-contact domain remediation
5. DSR/consent person-identifying field remediation
6. Directly necessary kernel/persist/domain mechanical changes
7. Dev/Test migration `125_h135_phase1_personal_data_domain.sql`
8. Directly affected tests/fixtures
9. Schema/type/build validation

Not implemented: API endpoint removal/redesign; UI redesign; CSV import redesign; notifications; DocumentStorage; free-text/JSONB; logging redaction; field-cache redesign; authentication redesign; IdP; infrastructure; Production; UAT; deployment; DNS; secrets; PDPC registration.

---

## 3. Repository baseline

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 552
```

Matches expected HEAD/branch. No reset/clean/stash/revert. Dirty worktree preserved.

---

## 4. Source governance documents

Used as authoritative inputs (not modified except this new H-136 record):

```text
docs/governance/h-135-personal-data-remediation-dependency-map.md
docs/governance/h-133-personal-data-capability-disposition-and-remediation-specification.md
docs/governance/h-134-personal-data-remediation-implementation-blueprint.md
```

Preserved companions:

```text
docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md
docs/governance/h-132-eos-personal-data-surface-audit.md
docs/governance/h-134-personal-data-capability-disposition-and-remediation-specification.md
docs/governance/h-135-phase-1-personal-data-domain-schema-remediation.md
```

This file is not an audit and not a new disposition specification.

---

## 5. A1 Guest/manifest/voucher remediation

**Evidence (H-135 map + migrations 023/029):**

| Object | Path / symbol | Reason |
| --- | --- | --- |
| `ops_manifests` | `packages/db/migrations/023_o2_ops_manifest.sql` | booking-level header; dropped because entries are the guest SoR and unique(booking) exists only for guest manifests |
| `ops_manifest_entries` | same; `guest_name`, `email`, `dietary`, `mobility`, `rooming` | guest person SoR |
| `ops_vouchers` | `packages/db/migrations/029_o4_vouchers.sql`; `guest_name NOT NULL`; `manifest_entry_id UUID NOT NULL` | guest-level voucher; no valid non-personal purpose without the entry |

**Drop order (125):** `ops_vouchers` → `ops_manifest_entries` → `ops_manifests`. Prevents orphaned `manifest_entry_id NOT NULL`.

**Domain mechanical:** `apps/api/src/ops/manifests.ts`, `apps/api/src/ops/vouchers.ts` (`person_domain_removed` after authorize). Routes remain (**LATER-PHASE DEPENDENCY** — Phase B API).

**Seed:** `apps/api/src/dev/seed-demo-data.ts` no longer POSTs guests/manifests/vouchers (**DIRECT PHASE A DEPENDENCY**).

**Retained:** `bkg_bookings`, pax counts, dates, status, supplier confirmations, ops briefs.

**Not invented:** no traveller/guest replacement table.

**Later-phase:** `store.opsManifests` / `opsVouchers` compile shims; `apps/api/src/ops/field-sync.ts` `deniedOfflineEntities: manifest_entry` (string policy, not a schema FK); `apps/web/src/lib/ops-api.ts` `guestName`.

---

## 6. A2 CRM contact remediation

**Evidence:** `packages/db/migrations/004_c1_crm.sql` (`crm_contacts`; FKs on relationships/activities/tasks); `packages/kernel/src/crm.ts` `CrmContact`; `Store.crmContacts`; `upsertCrmContact`; `apps/api/src/crm/contact.ts`; `/v1/crm/contacts*`.

**Removed:**

| Object | Classification | Action |
| --- | --- | --- |
| `crm_contacts` | A. Person-only SoR | DROP |
| `crm_relationships.from_contact_id` / `to_contact_id` | B. Dual-purpose table | DROP columns/FKs; keep org-org rows; DELETE contact-only rows |
| `crm_activities.contact_id` | B. Dual-purpose | DROP person linkage; keep org/relationship activities |
| `crm_tasks.related_contact_id` | B. Dual-purpose | DROP person linkage; keep org/account tasks |
| `ai_drafts.related_contact_id` | B. Dual-purpose | DROP person linkage (`064_i204_ai_drafts.sql`); keep commercial drafts |
| Polymorphic `entity_type='contact'` notes/tags/external IDs/duplicates/merges | A. Person-only rows | DELETE Dev/Test synthetic rows |
| Duplicate/merge CHECK including `contact` | A. Person-only enum | tighten to `organization` |

**Preserved (C. Commercial):** `crm_organizations`, `crm_accounts`, org-org relationships, organization notes/tasks/activities, `opp_opportunities` (no `contact_id` in `015_c2_opportunity.sql` / kernel `Opportunity`).

**Not invented:** no replacement contact table; no `contact_id` on opportunities.

**Later-phase:** routes `/v1/crm/contacts*`; CRM import `entityType=contact`; kernel `CrmContact` compile shim; UI `crm/page.tsx`.

---

## 7. A3 HR remediation

**Evidence:** `packages/db/migrations/081_i10_hr_core.sql` (`hr_employees`, `hr_leave_requests`, skills; FKs `REFERENCES hr_employees`); `100_h1_hr_certifications.sql` (`employee_id UUID NOT NULL`); `apps/api/src/hr/hr.ts`; `/v1/hr/employees*`.

**Removed:** `hr_certifications`, `hr_leave_requests`, `hr_employee_skills`, `hr_skills`, `hr_employees`. Certifications are exclusively HR-person dependent (`employeeId`) — removed with HR.

**schema_registry:** `hr`, `hr-certifications` → `retired`.

**Preserved:** `principals` (operator authentication). No commercial FK to HR.

**seedDefaultHr** is ensure-only (`apps/api/src/hr/collections.ts`).

**Later-phase:** `/v1/hr/*` routes; `apps/web` HR pages.

---

## 8. A4 Supplier-contact remediation

**Evidence:** `packages/db/migrations/014_c4_supplier.sql` `sup_contacts` (`given_name`, `family_name`, `email`, `telephone`, `whatsapp`); `sup_rates.supplier_id → sup_suppliers`; `apps/api/src/supplier/contacts.ts`.

**Removed:** `sup_contacts` (+ indexes).

**Preserved:** `sup_suppliers`, `sup_rates`, content blocks, seasons. Rates are **not** dependent on contacts.

**Later-phase:** `/v1/suppliers/:id/contacts*`; `supplier_contact` import entity type CHECK; “contact available externally” remains **OWNER DECISION REQUIRED**.

---

## 9. A5 DSR/consent remediation

**Evidence:** `packages/db/migrations/092_p1_privacy_ropa_dsr.sql` `subject_label`; `110_p3_consent_records.sql` `notes`.

**Removed columns:** `privacy_dsr_cases.subject_label`; `consent_records.notes`.

**Preserved:** `privacy_processing_activities` catalogue (**OWNER DECISION REQUIRED** whether it remains long-term). DSR/consent case registers without natural-person labels.

**Kernel:** `PrivacyDsrCase` without `subjectLabel`; `ConsentRecord` without `notes`.

**Later-phase:** API still accepts unused `subjectLabel`/`notes` payloads (not stored) — Phase B; web `privacy-api.ts` `subjectLabel` — Phase C.

---

## 10. Schema changes

After 125 (forward-only apply on authorized Dev/Test catalogs):

Dropped tables: `ops_vouchers`, `ops_manifest_entries`, `ops_manifests`, `crm_contacts`, `sup_contacts`, `hr_certifications`, `hr_leave_requests`, `hr_employee_skills`, `hr_skills`, `hr_employees`.

Dropped columns: CRM contact FKs; `ai_drafts.related_contact_id`; `privacy_dsr_cases.subject_label`; `consent_records.notes`.

Not dropped: `crm_organizations`, `crm_accounts`, `opp_opportunities`, `sup_suppliers`, `sup_rates`, `f2_rate_identities`, `f2_opportunity_facts`, `principals`, `tenants`, `bkg_bookings`, `privacy_processing_activities`.

No replacement person table.

---

## 11. Migration changes

| Identifier | Path | Reason |
| --- | --- | --- |
| `125_h135_phase1_personal_data_domain.sql` | `packages/db/migrations/125_h135_phase1_personal_data_domain.sql` | Phase A Dev/Test drop (also the prior H-135 Phase 1 file). Header notes H-136. No 126. |

Deterministic. FKs/indexes dropped before referenced tables. Unrelated commercial schema preserved. Does not assume Production row state. migrate-guard still refuses `eos` and `eos_gateb`. Live apply against Production/UAT/`eos`/`eos_gateb` **not executed**.

---

## 12. Kernel/domain changes

| Path | Symbol | Change | Dependency |
| --- | --- | --- | --- |
| `packages/kernel/src/crm.ts` | `CrmRelationship` / `CrmActivity` / `CrmTask` | contact FK fields removed | A2 dual-purpose |
| `packages/kernel/src/ai-draft.ts` | `AiDraft.relatedContactId` | removed | A2 AI contact |
| `packages/kernel/src/privacy.ts` | `PrivacyDsrCase.subjectLabel` | removed | A5 |
| `packages/kernel/src/consent-register.ts` | `ConsentRecord.notes` | removed | A5 |
| `packages/kernel/src/opportunity.ts` | `Opportunity` | unchanged; no `contactId` | commercial protection |
| Compile shims `CrmContact`, `HrEmployee`, `OpsManifest`, `OpsVoucher`, `SupContact` | kernel types | retained for compile | **LATER-PHASE** (B/C) |

---

## 13. API/UI mechanical compatibility changes

**API:** minimum stubs so the repository type-checks and person SoR is not written. Routes **not** removed.

Helper: `apps/api/src/personal-data-phase1.ts` (`PERSON_DOMAIN_REMOVED`).

Persist no-ops: `upsertCrmContact`, `loadCrmContacts`, `upsertSupContact`, `loadSupContacts` in `apps/api/src/persistence/pg-repository.ts`.

Import execute skip (handlers remain — Phase E ingest): `apps/api/src/crm/import.ts` `entityType=contact`; `apps/api/src/supplier/import.ts` `supplier_contact`.

**UI:** no page/component redesign. Web types still mention guest/HR/contact fields (**LATER-PHASE** Phase C).

---

## 14. Tests/fixtures

| Path | Validation |
| --- | --- |
| `packages/db/src/h136-phase-a-personal-data-domain.test.ts` | A1 drop order; A2 FKs before `crm_contacts`; opp has no `contact_id`; rates → `sup_suppliers`; HR certs dropped with employees; DSR/consent columns dropped; commercial/rate-identity/bookings not dropped; migrate-guard |
| `apps/api/src/h136-phase-a-personal-data-domain.test.ts` | auth 401; A1–A4 refuse; commercial path without `contactId`; paxCount; rates; bookings health |
| Prior H-135 Phase 1 tests/fixtures | remain; not overwritten as a disposition |

---

## 15. Validation results

Dev/Test local only. Not Production. Not UAT.

```text
apps/api        npx tsc -p tsconfig.json --noEmit     EXIT 0
packages/kernel npx tsc -p tsconfig.json --noEmit     EXIT 0
packages/db     npx tsc -p tsconfig.json --noEmit     EXIT 0
apps/web        npx tsc -p tsconfig.json --noEmit     EXIT 0
```

```text
packages/db:
  npx vitest run src/h136-phase-a-personal-data-domain.test.ts src/h135-phase1-personal-data-domain.test.ts
  Test Files  2 passed / Tests 10 passed / EXIT 0

apps/api:
  npx vitest run src/h136-phase-a-personal-data-domain.test.ts
    src/h135-phase1-personal-data-domain.test.ts src/h112-full-schema-migrate-inventory.test.ts
  Test Files  3 passed / Tests 11 passed / EXIT 0
```

`EOS_RUN_PG_TESTS` was not `1`; live PostgreSQL apply of 125 was not executed in this increment.

These results do **not** make the application production-ready.

---

## 16. Commercial workflow integrity

**PASS**

```text
Organization → Account → Opportunity → RFP → Programme → Costing
Supplier company → Rates
Authentication /v1/auth/login
Unauthenticated 401 (tenant isolation)
Bookings health remains
Opportunity/RFP JSON have no contactId
```

Commercial core preserved: **YES**.  
Authentication preserved: **YES**.  
`opp_opportunities` has no `contact_id`.  
`sup_rates.supplier_id` → `sup_suppliers` only.  
`f2_rate_identities` not dropped.

---

## 17. Remaining Phase B+ dependencies

**LATER-PHASE DEPENDENCY** (do not implement now):

- Phase B API: `/v1/crm/contacts*`, `/v1/ops/manifests*`, `/v1/ops/vouchers*`, `/v1/hr/employees*`, `/v1/hr/leave*`, `/v1/hr/certifications*`, `/v1/suppliers/:id/contacts*`; unused DSR `subjectLabel` / consent `notes` request fields
- Phase C UI: CRM contact, HR, ops guest/voucher, supplier contact, privacy `subjectLabel`
- Phase E import: `entityType=contact`, `supplier_contact` (handlers/CHECK still present)
- Later: Store/kernel compile shims; analytics/command-center in-memory manifest/voucher reads; DocumentStorage; free-text/JSONB; notification `recipient_email`; logging redaction; field-ops `manifest_entry` string

---

## 18. Owner Decisions remaining

1. Notification `recipient_email` retention  
2. Whether `privacy_processing_activities` remains  
3. Organization switchboard email/phone semantics  
4. Non-personal “contact available externally” flag  
5. Extent of commercial free-text restriction  

Not decided in this phase.

---

## 19. Governance gates

```text
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
Production = NOT AUTHORIZED / NOT READY
ADR-0006 = OPEN
DP-0006 = OPEN
```

No PDPC exemption or compliance is claimed. No legal/regulatory conclusion is authorized.

---

## 20. Explicit non-actions

```text
API redesign:                 NOT IMPLEMENTED
UI redesign:                  NOT IMPLEMENTED
CSV/person import redesign:   NOT IMPLEMENTED
DocumentStorage redesign:     NOT IMPLEMENTED
free-text redesign:           NOT IMPLEMENTED
JSONB content controls:       NOT IMPLEMENTED
notification architecture:    NOT IMPLEMENTED — OWNER DECISION REQUIRED
logging redaction:            NOT IMPLEMENTED
field cache redesign:         NOT IMPLEMENTED
authentication redesign:      NOT IMPLEMENTED
IdP:                          NOT IMPLEMENTED
infrastructure:               NONE
Production:                   NOT AUTHORIZED / NOT READY
UAT:                          not this phase
Commit / push:                NONE
```

---

## 21. Conclusion

**H-136 RESULT: PASS**

Phase A Dev/Test domain/schema is aligned with the approved EOS personal-data boundary: guest/manifest/voucher, CRM person-contact, HR employee/leave, supplier individual contacts, and DSR/consent person-identifying fields are removed at schema/domain layer via migration 125, with H-136 integrity proofs that commercial FKs and authentication remain intact.

This is **not** complete EOS remediation, **not** UAT, and **not** Production readiness.

**STOP after Phase A.** A new governance review must authorize Phase B.
)
