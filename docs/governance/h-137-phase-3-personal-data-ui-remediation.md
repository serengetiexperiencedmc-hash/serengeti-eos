# H-137 — Phase 3 Personal-Data UI Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Phase 3 UI only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** import/export, DocumentStorage, notification, logging, field-ops, or schema remediation.  
> Historical H-131 through H-136 artefacts, including numbering-collision files, and `h-137-phase-b-personal-data-api-domain-surface-remediation.md`, are **not renamed, deleted, merged, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — Phase 3 UI Remediation in Dev/Test only.  
**Commit / push:** **NONE**.

```text
PHASE 3 UI REMEDIATION — AUTHORIZED
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
IMPLEMENT PHASE 3 UI REMEDIATION IN DEV/TEST ONLY.
```

The Owner authorized **Phase 3 UI remediation** following completed API/domain-surface remediation. This increment does **not** authorize database/schema changes, new migrations, import/export redesign, DocumentStorage redesign, free-text/JSONB redesign, notification redesign, logging redesign, field-ops redesign, infrastructure, UAT, Production, commit, or push.

---

## B. Repository state

Recorded at the start of this increment (expected HEAD/branch/index matched):

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 570
Porcelain after: 585
```

No reset, clean, stash, revert, or baseline alteration. Unrelated dirty work was preserved.

---

## C. Preceding baseline

The immediately preceding substantive API phase is:

```text
H-136 — Phase 2 Personal-Data API/Domain-Surface Remediation
docs/governance/h-136-phase-2-personal-data-api-domain-surface-remediation.md
```

H-137 Phase B is a later in-tree API correction of the same API retirement (`docs/governance/h-137-phase-b-personal-data-api-domain-surface-remediation.md`). This Phase 3 increment does not overwrite that artefact.

Schema baseline remains migration 125:

```text
packages/db/migrations/125_h135_phase1_personal_data_domain.sql
```

This increment did **not** modify migration 125 and did **not** create migration 126.

---

## D. Objective

```text
The user interface must no longer present obsolete person-data capabilities as functional application features, while the commercial EOS workflow remains fully usable.
```

This is UI retirement, not a UX redesign, not a new product design, and not a commercial workflow redesign.

---

## E. UI inventory and action

| Surface | Previous UI | Action | Preserved |
| --- | --- | --- | --- |
| CRM Contacts tab / list / search on combined CRM page | `apps/web/src/app/commercial/crm/page.tsx` loaded `/v1/crm/contacts`, showed givenName/email table, org “N contacts” | Removed Contacts tab, `listContacts`, contact counts, “Clients & Contacts” person framing | Organizations, Accounts, Activities, Tasks; org CSV import CTA |
| CRM contact import option | `CRM_IMPORT_ENTITY_OPTIONS` included `contact` | Dropdown no longer offers Contacts. Import architecture otherwise unchanged | Organization import remains |
| HR employee/leave/skills | `/commercial/hr` full CRUD forms calling retired APIs | Page replaced with retired notice; People nav removed | Auth/user-management unchanged |
| HR certifications | `/commercial/hr/certifications` employee-bound cert forms | Page replaced with retired notice; nav removed | Direct URL no longer presents functional employee cert CRUD |
| Supplier individual contacts | Supplier drawer Contacts list/add/remove | Contact section, forms, and archive copy removed | Company, rates, content blocks, contracts, Rate Identity overlay |
| Supplier contact import option | `IMPORT_ENTITY_OPTIONS` included `supplier_contact` | Dropdown no longer offers Contacts | Supplier/rate/content/season import options remain |
| Ops guest manifest / vouchers | Operations booking tabs Guest Manifest / Guest Vouchers | Tabs and handlers removed; no localStorage/in-memory guest store | Supplier confirmations, ops brief, field tasks, booking header/pax |
| Ops workbench labels | subtitle + attention “vouchers” | Guest/voucher labels stripped | Booking queue, handover, supplier, field, sync |
| Dashboard guest metrics | Draft Vouchers card; “N contacts” CRM delta | Removed | Handover, supplier confs, field tasks, CRM org count |
| Booking command center | Manifest / Vouchers cards; Manifest guests | Removed | Pax, dates, destinations, ops brief, supplier confs, field tasks |
| Analytics ops guest metrics | Manifests published, vouchers, guest counts, draft-voucher chips | Removed from display | Supplier confs, field tasks, briefs, sync, handover |
| DSR subject identity | `subjectLabel` input, search, list title, detail | Removed | DSR case register: requestType, optional non-identifying note, start/close |
| Consent person notes | `notes` create/edit/display | Removed | Consent Register title/status catalogue |
| RoPA / processing activities | Non-identifying catalogue | Unchanged | Retained |

No organization-contact replacement, HR replacement, traveller/guest tables, or voucher replacement was created.

---

## F. Files changed (this increment)

| File | Change |
| --- | --- |
| `apps/web/src/app/commercial/crm/page.tsx` | Retired Contacts tab and contact loading |
| `apps/web/src/lib/crm-api.ts` | `CRM_PAGE_TABS`; import options organization-only |
| `apps/web/src/app/commercial/hr/page.tsx` | Retired notice |
| `apps/web/src/app/commercial/hr/certifications/page.tsx` | Retired notice |
| `apps/web/src/lib/mock-data.ts` | Removed People nav section |
| `apps/web/src/app/commercial/suppliers/page.tsx` | Removed individual-contact UI |
| `apps/web/src/lib/suppliers-api.ts` | Import options exclude `supplier_contact` |
| `apps/web/src/app/commercial/operations/[bookingId]/page.tsx` | Removed manifest/voucher tabs |
| `apps/web/src/app/commercial/operations/page.tsx` | Removed voucher attention copy |
| `apps/web/src/app/commercial/page.tsx` | Removed guest voucher card and contact delta |
| `apps/web/src/app/commercial/bookings/[id]/page.tsx` | Removed manifest/voucher/guest metrics |
| `apps/web/src/app/commercial/analytics/page.tsx` | Removed guest/manifest/voucher display |
| `apps/web/src/app/commercial/dsr/page.tsx` | Removed `subjectLabel` UI |
| `apps/web/src/lib/privacy-api.ts` | Mechanical type trim: no `subjectLabel` |
| `apps/web/src/app/commercial/consents/page.tsx` | Removed person-identifying `notes` UI |
| `apps/web/src/lib/consent-register-api.ts` | Mechanical type trim: no `notes` |
| `apps/web/src/h137-phase-3-personal-data-ui.test.ts` | Phase 3 UI proof |
| `docs/governance/h-137-phase-3-personal-data-ui-remediation.md` | This record |

Client helpers `listContacts`, `listEmployees`, `createSupplierContact`, and ops manifest/voucher functions remain in `apps/web/src/lib/*` as unused compile shims. Pages no longer call them.

Field app (`apps/web/src/app/field/[bookingId]/page.tsx`) had no guest/manifest/voucher editor; left unchanged (field-ops redesign is out of scope).

---

## G. Commercial preservation

```text
Commercial workflow preserved: YES
```

Retained as functional UI:

- CRM organizations, accounts, activities, tasks, account commercial-facts
- Supplier companies, rates, content blocks, Rate Identity
- Pipeline, RFPs, programme, proposals, bookings (header, pax, dates, status, commercial brief)
- Operations supplier confirmations, ops brief, field tasks
- Privacy RoPA / processing-activity catalogue; DSR case register without subject identity; Consent Register without person notes
- Authentication / session / user-management

---

## H. Tests

```text
apps/web: npx tsc -p tsconfig.json --noEmit
EXIT 0
```

```text
apps/web: npx vitest run src/h137-phase-3-personal-data-ui.test.ts
Test Files  1 passed (1)
Tests  4 passed (4)
EXIT 0
```

New proof file:

```text
apps/web/src/h137-phase-3-personal-data-ui.test.ts
```

Browser (local Next.js on `:3001`, unsigned — API on 8080 was not running):

- `/commercial/crm`: title **Clients**; tabs Organizations / Accounts / Activities / Tasks; **no Contacts tab**; **no People/HR nav**
- `/commercial/hr`: retired notice only; no employee/leave/skills forms
- `/commercial/dsr`: request type + case note; **no subjectLabel**
- `/commercial/consents`: title-only register; **no notes** field
- `/commercial/operations`: workbench retained; no guest/voucher heading

Signed-in supplier drawer and operations booking tabs were **not** exercised live (no API on 8080). Those retirements are in source and compile/tests.

---

## I. Remaining dependencies

Carry-forward (not implemented here):

- **Phase 5 imports:** CRM `CrmImportEntityType` and supplier `SupplierImportEntityType` still include `contact` / `supplier_contact` in TypeScript unions; execute already refuses person rows. UI dropdowns no longer offer those options.
- **Free-text/JSONB / DocumentStorage:** RFP notes, programme notes, AI body, briefs, commercial-facts JSONB
- **Notifications:** `recipient_email`, allowlists, suppressions (Owner Decision)
- **Logging redaction**
- **Field-ops cache:** `deniedOfflineEntities` still includes `manifest_entry` string policy
- **Web lib compile shims:** `listContacts`, `CrmContact`, HR/ops guest helpers unused by pages
- **Store/kernel compile shims:** unchanged from API phases
- **Analytics/command-center API payloads:** may still include zeroed `manifestGuestCount` / voucher fields; UI no longer presents them
- **`privacy_processing_activities` retention:** Owner Decision still open; catalogue retained

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

- modify migration 125 or create migration 126
- change schema, catalogs, or runtime PostgreSQL
- redesign CSV import/export architecture (only hid person entity options from UI)
- redesign DocumentStorage, free-text, or JSONB
- redesign notifications, logging, or field-offline-cache
- change authentication / IdP / user-management
- alter commercial pricing, rate identity, proposal, costing, or pipeline rules
- invent a replacement person/contact/guest/employee/traveller model
- apply any migration to Production, `eos`, `eos_gateb`, or UAT
- commit, push, reset, clean, stash, or revert unrelated work

---

## Conclusion

Phase 3 UI remediation is implemented in Dev/Test: obsolete person-data screens are no longer presented as functional application features; commercial CRM/supplier/operations/booking workflow remains usable.

**STOP.** A new governance review is required before later phases.
