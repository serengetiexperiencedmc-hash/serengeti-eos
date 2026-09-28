# H-136 — Phase 2 Personal-Data API/Domain-Surface Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Phase 2 API/domain-surface only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** Phase 3 UI / Phase 4 document / Phase 5 import remediation.  
> H-131 through H-135 artefacts, including numbering-collision files, and `h-136-phase-a-personal-data-domain-schema-remediation.md`, are **not renamed, deleted, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — Phase 2 API/Domain-Surface Remediation in Dev/Test only.  
**Commit / push:** **NONE**.

```text
PHASE 2 API/DOMAIN-SURFACE REMEDIATION — AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006 = OPEN
DP-0006 = OPEN
UAT = NOT STARTED FOR THIS PHASE
```

---

## A. Authorization

```text
PHASE 2 API/DOMAIN-SURFACE REMEDIATION — AUTHORIZED
```

The Owner authorized **Phase 2 API/domain-surface remediation** following completed Phase 1 domain/schema remediation (migration `125`). This increment does **not** authorize Phase 3 UI, Phase 4 document/free-text, Phase 5 import/export, notification redesign, logging redesign, field-ops redesign, infrastructure, Production, UAT, commit, or push.

---

## B. Repository state

Recorded at the start of this increment (expected values matched):

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 555
```

No reset, clean, stash, revert, or baseline alteration. Unrelated dirty work was preserved.

---

## C. Phase 1 baseline

Phase 1 (H-135 Phase 1 / H-136 Phase A) implemented Dev/Test schema removal in:

```text
packages/db/migrations/125_h135_phase1_personal_data_domain.sql
```

Removed SoR structures:

- Guest: `ops_vouchers`, `ops_manifest_entries`, `ops_manifests`
- CRM person: `crm_contacts` plus contact FKs/columns and polymorphic contact rows
- HR person: `hr_employees`, `hr_leave_requests`, `hr_skills`, `hr_employee_skills`, `hr_certifications`
- Supplier individuals: `sup_contacts`
- Privacy person fields: `privacy_dsr_cases.subject_label`, `consent_records.notes`

Phase 1 left API routes registered with mechanical stubs: mutations returned `person_domain_removed` after authorize; several GETs still returned empty lists / `not_found` (fake CRUD). That leftover is what Phase 2 retires.

This increment did **not** undo migration 125 and did **not** create migration 126.

---

## D. API inventory

| Domain | Previous API | Current status | Action |
| --- | --- | --- | --- |
| CRM contacts | `/v1/crm/contacts*` GET/POST/PATCH/archive; nested relationships/activities/notes | Registered; authorize then `person_domain_removed` (400) on read and write | Retired; no fake empty CRUD |
| CRM search contact entity | `/v1/crm/search` default included `contact`; `searchContacts` iterated `store.crmContacts` | Contact type skipped; contact-only search returns `person_domain_removed` | Person path retired; org/account/activity/task search retained |
| CRM duplicates contact path | `/v1/crm/duplicates?entityType=contact` | `entityType=contact` → `person_domain_removed`; list filtered to organizations | Person path retired; organization duplicates retained |
| HR | `/v1/hr/employees*`, `/v1/hr/leave*`, `/v1/hr/skills*` | Reads and writes `person_domain_removed` after authorize | Retired as person-data subsystem |
| HR health | `/v1/hr/health` | Still 401/403/200 health (employees: 0) | Retained as module health/auth proof, not person SoR |
| HR certifications | `/v1/hr/certifications*` | List/get/create/patch `person_domain_removed`; health retained | Person-bound cert APIs retired; health retained |
| Supplier contacts | `/v1/suppliers/:id/contacts*` POST/PATCH/DELETE | Mutations `person_domain_removed` after supplier authorize | Retired; no replacement contact model |
| Supplier company GET | `getSupplier` previously mapped `supContacts` names/emails | `contacts: []`; health `contacts: 0` | Person payload stripped; company/rates retained |
| Guest/manifests/vouchers | `/v1/ops/manifests*`, `/v1/ops/vouchers*` | GET and mutations `person_domain_removed` after authorize | Retired; bookings/pax/briefs/field-ops retained |
| Privacy person fields | DSR `subjectLabel`; consent `notes` | Typed contracts no longer accept those fields; extra JSON ignored; responses omit them | Fields not persisted or returned; processing-activity catalogue retained |
| Import contact / supplier_contact | CRM/supplier import execute already skipped in Phase 1 | Unchanged | Phase 5 leftover; execute still refuses person rows |

`apps/api/src/personal-data-phase1.ts` remains the deterministic retirement helper (`PERSON_DOMAIN_REMOVED` / `personDomainRemoved()`). It is **not** a hidden person-data layer. Dependent routes/services: CRM contact/relationship/activity/task/note/search/duplicate, HR + certifications, supplier contacts, ops manifests/vouchers, CRM/supplier import execute skip.

---

## E. Kernel/store changes

No kernel type redesign. No Store collection removal (compile shims remain for later phases).

Actual API/domain changes:

| File | Change | Reason |
| --- | --- | --- |
| `apps/api/src/personal-data-phase1.ts` | Documented as Phase 2 retirement boundary | Compatibility shim, not SoR |
| `apps/api/src/crm/contact.ts` | GET list/get return `personDomainRemoved()` | End fake empty CRUD |
| `apps/api/src/crm/search.ts` | Removed `searchContacts`; skip contact entity | Stop in-memory person reconstruction |
| `apps/api/src/crm/duplicate.ts` | Contact entityType retired; org-only readability | Dual-purpose duplicates preserved |
| `apps/api/src/crm/relationship.ts` | Contact list/filter retired | Dual-purpose org-org relationships preserved |
| `apps/api/src/crm/activity.ts` | Contact list/filter/`listContactActivities` retired | Org activities preserved |
| `apps/api/src/crm/task.ts` | `relatedContactId` list retired | Org/account tasks preserved |
| `apps/api/src/crm/note.ts` | Contact entity notes create/list retired | Org notes preserved |
| `apps/api/src/crm/tag.ts` | Contact entity tagging denied; no `crmContacts` lookup | Org tags preserved |
| `apps/api/src/crm/module.ts` | Health `contacts: 0` | Do not report person SoR count |
| `apps/api/src/hr/hr.ts` | Employee/skill/leave reads retired | Health retained |
| `apps/api/src/hr-certifications/service.ts` | List/get retired | Health retained |
| `apps/api/src/supplier/contacts.ts` | Mutations remain `personDomainRemoved()` | No person persist |
| `apps/api/src/supplier/supplier.ts` | GET never maps contact person fields; health `contacts: 0` | Company/rates preserved |
| `apps/api/src/ops/manifests.ts` | GET retired (was `not_found`) | No guest lookup |
| `apps/api/src/ops/vouchers.ts` | GET retired (was empty items) | No guest voucher list |
| `apps/api/src/privacy/service.ts` | `subjectLabel` removed from create/patch types | Not persisted/returned |
| `apps/api/src/consent-register/service.ts` | `notes` ignored; unused notes helper removed | Not persisted/returned |
| `apps/api/src/booking/command-center.ts` | Does not read `opsManifests`/`opsVouchers` | Stop in-memory guest reconstruction |
| `apps/api/src/analytics/operations.ts` | Guest metrics forced to 0 | Same |
| `apps/api/src/analytics/commercial.ts` | `opsVouchers: 0` | Same |
| `apps/api/src/ops/workbench.ts` | No manifest/voucher reads | Booking workbench retained |
| `apps/api/src/ops/field-ops.ts` | Health `manifests`/`vouchers` = 0 | Field-ops otherwise unchanged |

Store arrays `crmContacts`, `supContacts`, `hrEmployees`, `opsManifests`, `opsManifestEntries`, `opsVouchers` remain as empty compile shims. APIs do not write them. Analytics/command-center/workbench no longer treat them as SoR.

---

## F. Commercial preservation

```text
Commercial workflow preserved: YES
Authentication preserved: YES
```

Evidence: `apps/api/src/h136-phase-2-personal-data-api-domain-surface.test.ts` creates organization → account → opportunity (paxCount, no `contactId`) → RFP → programme → costing sheet → supplier company → supplier rate (no `contactId`) and `GET /v1/bookings/health` 200. Unauthenticated commercial and person routes remain 401. Login `carol.admin@sedmc.local` remains 200.

Commercial objects not redesigned: organizations, accounts, opportunities, programmes, RFPs, proposals, costing, supplier companies, supplier rates, booking headers, authentication, tenant isolation.

---

## G. Tests

### Commands and results

```text
apps/api: npx tsc --noEmit
EXIT 0

packages/kernel: npx tsc --noEmit
EXIT 0

packages/db: npx tsc --noEmit
EXIT 0

apps/web: npx tsc --noEmit
EXIT 0
```

```text
apps/api: npx vitest run
  src/h136-phase-2-personal-data-api-domain-surface.test.ts
  src/h136-phase-a-personal-data-domain.test.ts
  src/h135-phase1-personal-data-domain.test.ts
  src/c1.contacts.test.ts
  src/i10-hr-core.test.ts
  src/h1-hr-certifications.test.ts
  src/j2-ops-analytics.test.ts
  src/c10-command-center.test.ts
  src/crm.security.regression.test.ts
  src/pg9-supplier-contact-rate.test.ts
  src/o1-ops.test.ts
  src/o4-vouchers.test.ts
  src/p1-privacy-ropa-dsr.test.ts
  src/p3-consent-register.test.ts
  src/c1.search-duplicates.test.ts
  src/c1.accounts-notes-tasks.test.ts
  src/c1.activities.test.ts
Test Files  17 passed (17)
Tests  97 passed (97)
EXIT 0
```

```text
apps/api: npx vitest run
  src/h112-full-schema-migrate-inventory.test.ts
  src/pg11-supplier-archive.test.ts
  src/pg12-supplier-restore.test.ts
Test Files  3 passed (3)
Tests  7 passed (7)
EXIT 0
```

```text
packages/db: npx vitest run
  src/h136-phase-a-personal-data-domain.test.ts
  src/h135-phase1-personal-data-domain.test.ts
Test Files  2 passed (2)
Tests  10 passed (10)
EXIT 0
```

Kernel tests were not re-run: kernel sources were not modified in this increment; kernel `tsc --noEmit` EXIT 0.

Full repository vitest was **not** claimed green.

New proof file:

```text
apps/api/src/h136-phase-2-personal-data-api-domain-surface.test.ts
```

---

## H. Runtime migration evidence

```text
Static/schema validation: packages/db h135+h136 tests EXIT 0 (migration 125 still last; no 126)
Test validation: API Phase 2 + commercial/auth/person-retired suites EXIT 0
Live Dev/Test PostgreSQL validation: NOT RUN
UAT: NOT STARTED
Production: NOT RUN / NOT AUTHORIZED
```

Live migration execution: **NOT RUN**  
Reason: this increment did not enable `EOS_RUN_PG_TESTS` and did not apply migration 125 to any PostgreSQL catalog. No disposable live migrate was executed. Static tests must not be treated as runtime catalog evidence.

Catalogs **not** touched: Production, `eos`, `eos_gateb`, UAT `eos_h117_uat`.

---

## I. Remaining dependencies

Carry-forward (not implemented here):

- **Phase 3 UI:** CRM Contacts tab, HR pages, supplier contact form, operations guest/voucher UI, DSR subject UI, web `crm-api.ts` / `ops-api.ts` person types
- **Phase 5 imports:** CRM `entityType=contact` and supplier `entityType=supplier_contact` create/validate metadata; CHECK still lists `supplier_contact`; execute already refuses person rows
- **Free-text/JSONB / DocumentStorage:** RFP notes, programme notes, AI body, briefs, commercial-facts JSONB
- **Notifications:** `notif_email_outbox.recipient_email`, allowlists, suppressions, digest recipients (Owner Decision)
- **Logging redaction**
- **Field-ops cache:** `deniedOfflineEntities` still includes `manifest_entry` string policy
- **Store/kernel compile shims:** `Store.crmContacts`, `supContacts`, `hrEmployees`, `opsManifests`/`Entries`/`Vouchers`; kernel `CrmContact`, `OpsManifest`, `guestName` types; search type union still includes `contact` for mechanical compile
- **Analytics/command-center:** kernel snapshot still has `manifestGuestCount` / `guest_manifest` timeline keys; populated as zeros/pending, not redesigned
- **Notifications draft-voucher attention:** `apps/api/src/notifications/notifications.ts` still reads `store.opsVouchers` (out of scope; arrays unused by retired APIs)
- **`privacy_processing_activities`:** Owner Decision still open; catalogue retained

---

## J. Governance gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
Production: NOT AUTHORIZED / NOT READY
UAT: NOT STARTED FOR THIS PHASE
Commit: NONE
Push: NONE
ADR-0006: OPEN
DP-0006: OPEN
```

No PDPC exemption or compliance is claimed. No EI-01 closure. No Production readiness.

---

## Explicit non-actions

This increment did **not**:

- redesign or remove UI screens
- redesign CSV import/export (beyond existing Phase 1 execute skip)
- redesign DocumentStorage, free-text, or JSONB
- redesign notifications, logging, or field-offline-cache
- change authentication / IdP
- alter commercial pricing, rate identity, proposal, costing, or pipeline rules
- invent a replacement person/contact/guest/employee table
- apply migration 125 to Production, `eos`, `eos_gateb`, or UAT
- commit, push, reset, clean, stash, or revert unrelated work

---

## Conclusion

Phase 2 API/domain-surface remediation is implemented in Dev/Test: obsolete person-data APIs are formally retired with deterministic `person_domain_removed` behaviour after authorize; they no longer present empty-list CRUD; analytics/command-center no longer reconstruct guest records from in-memory arrays; commercial workflow and authentication remain intact.

**STOP.** A new governance review is required before Phase 3+.
