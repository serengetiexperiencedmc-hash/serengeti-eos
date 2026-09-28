# H-138 — Phase C Personal-Data UI Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Phase C UI only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** import/export, DocumentStorage, notification, logging, field-ops, or schema remediation.  
> Historical H-131 through H-137 artefacts, including numbering-collision files (`h-136-phase-a`, `h-136-phase-2`, `h-137-phase-b`, `h-137-phase-3`), are **not renamed, deleted, merged, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — Phase C UI Remediation in Dev/Test only.  
**Commit / push:** **NONE**.

---

## A. Authorization

```text
PHASE C UI REMEDIATION — AUTHORIZED
```

The Owner authorized **Phase C UI remediation** following Phase A domain/schema (migration 125) and Phase B API/domain-surface (`person_domain_removed` after authorize). This increment does **not** authorize schema/migration change, import/export redesign, DocumentStorage, free-text/JSONB, notifications, logging, field-ops redesign, infrastructure, UAT, Production, commit, or push.

In-tree predecessor UI work exists as H-137 Phase 3 (`h-137-phase-3-personal-data-ui-remediation.md`). This H-138 record is the governed Phase C artefact; it does not replace or overwrite that file.

---

## B. Repository state

Recorded at the start of this increment:

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 585
Porcelain after: 589
```

No reset, clean, stash, revert, or baseline alteration. Unrelated dirty work, including H-137 Phase 3 UI edits, was preserved.

---

## C. UI inventory

| Domain | UI surface | Previous state (pre-Phase C / as left by Phase 3) | H-138 result | Evidence |
| --- | --- | --- | --- | --- |
| CRM contacts | Combined CRM page tabs, contact table, `listContacts`, org contact counts, Contacts import option | Phase 3 already removed Contacts tab and `listContacts` | Confirmed retired; no functional person-contact flow | `CRM_PAGE_TABS`; `crm/page.tsx` has no `listContacts`; vitest H-138 |
| HR | People nav, `/commercial/hr`, certifications | Phase 3 removed nav; routes show retired notice | Nav absent; direct routes remain as non-CRUD retired notice | `navItems`; HR page render contains “retired”; no `listEmployees` |
| Supplier contacts | Drawer Contacts form/list; import `supplier_contact` | Phase 3 removed drawer UI and import option | Confirmed retired; company/rate UI retained | suppliers page has no `createSupplierContact`; `IMPORT_ENTITY_OPTIONS` |
| Guest/manifests/vouchers | Ops booking Guest Manifest / Guest Vouchers tabs; dashboard/analytics/command-center guest metrics | Phase 3 removed tabs and display metrics | Confirmed retired; `OPS_BOOKING_TABS` = suppliers, field | ops booking page; dashboard has no Draft Vouchers |
| DSR/consent | `subjectLabel`; consent `notes` | Phase 3 removed UI and client types | Confirmed absent; RoPA processing-activity catalogue retained | dsr/consents/privacy-api/consent-register-api source |
| Dashboard contact count | `CommercialLiveStats.contacts` from CRM health | Health field still mapped into live stats after Phase 3 | Mapping removed this increment so dashboard cannot present a contacts card | `commercial-stats.ts` |

No replacement contact, employee, guest, traveller, or voucher model was created.

---

## D. Navigation/routing

| Feature | Navigation entry removed | Normal UI entry point removed | Direct route safely retired | Quick action removed | Dashboard/search entry removed |
| --- | --- | --- | --- | --- | --- |
| CRM Contacts tab | YES (tab gone) | YES | N/A (no `/crm/contacts` route existed) | YES | YES (CRM Clients no longer shows contact count) |
| HR employees/leave/skills | YES (People section removed) | YES | YES — `/commercial/hr` retired notice, no CRUD | YES | YES (none remained) |
| HR certifications | YES | YES | YES — `/commercial/hr/certifications` retired notice | YES | YES |
| Supplier individual contacts | YES (no tab/nav) | YES (drawer section gone) | N/A (no dedicated contact route) | YES | YES |
| Guest manifest/vouchers | YES (ops tabs gone) | YES | N/A (no standalone guest route) | YES | YES (dashboard/analytics/command-center display stripped) |
| DSR `subjectLabel` | N/A (DSR nav retained for case register) | YES (input/display gone) | DSR route retained as non-identifying case register | YES | YES |
| Consent `notes` | N/A (Consents nav retained for catalogue) | YES | Consents route retained as title/status catalogue | YES | YES |

Direct-route compatibility: HR URLs remain so leftover bookmarks do not 404 into a fake empty employee UI. They render a retired notice and do not call `/v1/hr/*`. No person-data fallbacks.

Commercial routes retained: `/commercial`, `/commercial/crm`, `/commercial/pipeline`, `/commercial/rfps`, `/commercial/programme`, `/commercial/proposals`, `/commercial/suppliers`, `/commercial/bookings`, `/commercial/operations`, `/commercial/privacy`.

---

## E. API call-site audit

Normal UI pages do **not** call retired person APIs.

| Location | Reference | Classification |
| --- | --- | --- |
| `apps/web/src/lib/crm-api.ts` `listContacts` `/v1/crm/contacts` | Client helper | Dead compile shim — no page import |
| `CrmContact`, `fromContactId?` | Types | Compatibility declaration |
| `CrmImportEntityType` includes `"contact"` | Type union | Phase E leftover; dropdown options organization-only |
| `apps/web/src/lib/hr-api.ts` `/v1/hr/employees|leave|skills` | Client helpers | Dead compile shim — HR pages do not import |
| `apps/web/src/lib/hr-certifications-api.ts` `/v1/hr/certifications*` | Client helpers | Dead compile shim; health unused by UI |
| `apps/web/src/lib/suppliers-api.ts` `createSupplierContact` `/v1/suppliers/:id/contacts` | Client helpers | Dead compile shim — suppliers page does not import |
| `SupplierDetail.contacts` | Type on company GET | Compatibility; UI does not render |
| `SupplierImportEntityType` includes `supplier_contact` | Type union | Phase E leftover; dropdown omits it |
| `apps/web/src/lib/ops-api.ts` `/v1/ops/manifests*` `/v1/ops/vouchers*` | Client helpers | Dead compile shim — ops booking page does not import |
| `ManifestEntry.guestName` / `OpsVoucher.guestName` | Types | Compatibility declaration |
| `analytics-api.ts` / `booking-api.ts` / workbench `manifestGuestCount`, `vouchersDraft` | Response types | API payload types; UI no longer displays |
| CRM health `entities.contacts` | Health | Not mapped into dashboard live stats as of this increment |
| `getHrHealth` | Health helper | Unused by UI |

No mechanical deletion of those lib helpers in this increment (grant: classify rather than blindly delete).

---

## F. Commercial preservation

```text
Commercial workflow preserved: YES
Commercial UI regression: PASS
Authentication preserved: YES
```

Retained: organizations, accounts, activities, tasks; pipeline/opportunities; programmes; RFPs; proposals/costing (untouched); supplier companies/rates/Rate Identity; booking header, pax, dates, status, ops brief, supplier confirmations, field tasks; RoPA processing-activity catalogue; DSR case register without subject identity; Consent Register without person notes; `eos-session` login/sessionStorage.

Rate Identity, proposal, and costing semantics were not altered.

---

## G. Database

```text
New migration: NONE
Schema changes: NONE
Migration 125 modified: NO
```

---

## H. Client-side storage

```text
Browser-side person-data persistence introduced: NO
```

- `eos-session.ts` / `eos-client.ts` sessionStorage keys remain `sedmc.eos.accessToken` and `sedmc.eos.email` (authentication). Unchanged.
- `field-offline-cache.ts` localStorage keys remain device id, salt, and per-booking field cache (`sedmc-field-cache:`). SyncBundle holds field tasks and brief only — no guest/contact/employee records. Field-ops cache redesign is out of scope (Phase F leftover `manifest_entry` deny-list remains an API/policy string).

No localStorage/sessionStorage/IndexedDB guest, contact, or employee store was added.

---

## I. Tests

```text
apps/web: npx tsc -p tsconfig.json --noEmit
EXIT 0

apps/web: npx vitest run src/h138-phase-c-personal-data-ui.test.ts src/h137-phase-3-personal-data-ui.test.ts
Test Files  2 passed (2)
Tests  11 passed (11)
EXIT 0

apps/api: npx tsc -p tsconfig.json --noEmit
EXIT 0

apps/api: npx vitest run src/h137-phase-b-personal-data-api-domain-surface.test.ts src/h136-phase-2-personal-data-api-domain-surface.test.ts
Test Files  2 passed (2)
Tests  11 passed (11)
EXIT 0

packages/kernel: npx tsc -p tsconfig.json --noEmit
EXIT 0
Kernel vitest: NOT RUN (kernel sources not modified)

packages/db: npx tsc -p tsconfig.json --noEmit
EXIT 0

packages/db: npx vitest run src/h135-phase1-personal-data-domain.test.ts src/h136-phase-a-personal-data-domain.test.ts
Test Files  2 passed (2)
Tests  10 passed (10)
EXIT 0
```

Full repository vitest was **not** claimed green.

New proof file:

```text
apps/web/src/h138-phase-c-personal-data-ui.test.ts
```

Unsigned browser/HTML check on `:3001`: CRM page has no People nav; HR page contains retired notice; suppliers HTTP 200.

---

## J. Remaining dependencies

Carry-forward (not implemented here):

- **Phase E imports:** Type unions still include `contact` / `supplier_contact`; execute already refuses person rows; UI dropdowns do not offer those options
- **Web lib compile shims:** unused `listContacts`, HR/ops guest helpers
- **Store/kernel compile shims:** `Store.crmContacts`, `supContacts`, `hrEmployees`, `opsManifests`/`Entries`/`Vouchers`; kernel guest types
- **Kernel timeline guest keys:** may still exist as zeros/pending, not redesigned
- **`notifications.ts` leftover `opsVouchers` read:** API-side; out of scope
- **DocumentStorage / free-text / JSONB:** RFP notes, programme notes, AI body, commercial-facts JSONB
- **Notification `recipient_email`:** Owner Decision
- **Logging redaction**
- **Field-ops `manifest_entry` deny-list string:** not redesigned
- **`privacy_processing_activities`:** Owner Decision still open; catalogue retained

---

## K. Governance gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
Production: NOT AUTHORIZED / NOT READY
UAT: NOT STARTED
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
- redesign CSV import/export (person entity options remain hidden, types unchanged)
- redesign DocumentStorage, free-text, or JSONB
- redesign notifications, logging, or field-offline-cache
- change authentication / IdP / principals
- alter Rate Identity, proposal, or costing rules
- invent a replacement person/contact/guest/employee/traveller model
- apply any migration to Production, `eos`, `eos_gateb`, or UAT
- commit, push, reset, clean, stash, or revert unrelated work
- overwrite H-137 Phase 3 or Phase B artefacts

---

## Conclusion

Phase C UI remediation is implemented in Dev/Test: obsolete person-data capabilities have no normal functional UI entry point; leftover HR URLs fail closed as retired notices; commercial EOS workflow and authentication remain usable.

**STOP.** A new governance review is required before Phase E+ (import, DocumentStorage, notifications, logging, field cache).
