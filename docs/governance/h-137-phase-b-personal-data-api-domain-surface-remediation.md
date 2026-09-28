# H-137 — Phase B Personal-Data API/Domain-Surface Remediation

> **AUTHORIZED IMPLEMENTATION RECORD — Phase B API/domain-surface only (Dev/Test).**  
> This is **not** UAT, **not** Production validation, **not** a PDPC compliance claim, and **not** Phase C UI / import / document / notification remediation.  
> Historical H-131 through H-136 artefacts are **not renamed, deleted, merged, or overwritten**.

**Date:** 2026-09-22.  
**Authorization:** Owner grant — Phase B API/Domain-Surface Remediation in Dev/Test only.  
**Commit / push:** **NONE**.

---

## A. Authorization

```text
PHASE B API/DOMAIN-SURFACE REMEDIATION — AUTHORIZED
```

This increment does **not** authorize schema/migration change, Phase C UI, import/export, DocumentStorage, free-text/JSONB, notifications architecture, logging, field-ops redesign, infrastructure, UAT, Production, commit, or push.

---

## B. Repository state

Recorded at the start of this increment (expected HEAD/branch/index matched):

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain before: 567
```

No reset, clean, stash, revert, or baseline alteration. Unrelated dirty work was preserved.

---

## C. Correction from H-136

The immediately preceding **authorized H-136 result** produced:

```text
docs/governance/h-136-phase-a-personal-data-domain-schema-remediation.md
Owner authorization: PHASE A DOMAIN/SCHEMA REMEDIATION
```

That increment **re-validated already-implemented Phase A** (migration 125 / H-135 Phase 1 domain-schema drops). It did **not** execute the API/domain-surface phase that the later H-136 prompt intended.

This is **not** a failure of the Phase A implementation itself. Phase A schema/domain removal remains the fixed baseline.

H-137 is the authorized **Phase B API/domain-surface** record. This increment:

- did **not** repeat Phase A;
- did **not** create migration 126;
- did **not** modify migration 125;
- did **not** overwrite `h-136-phase-a-personal-data-domain-schema-remediation.md`.

A later uncommitted dirty-tree file `docs/governance/h-136-phase-2-personal-data-api-domain-surface-remediation.md` exists from a subsequent engineering increment. It is **not** the Owner-authorized Phase B record. H-137 is. That H-136 Phase 2 file was not renamed, deleted, or overwritten.

---

## D. API inventory

Least-disruptive retirement chosen: **routes remain registered** (authentication still applies; UI compile compatibility until Phase C) and handlers return deterministic `{ error: "invalid_request", reason: "person_domain_removed" }` after authorize. This is **not** fake CRUD (no empty lists, no `not_found` implying the person domain still exists).

| Domain | Route/API | Previous behavior | H-137 behavior | Evidence |
| --- | --- | --- | --- | --- |
| CRM contacts | `GET/POST /v1/crm/contacts`; `GET/PATCH /v1/crm/contacts/:id`; `POST .../archive`; nested relationships/activities/notes | Phase A: writes `person_domain_removed`; GET empty/`not_found` | After authorize: `person_domain_removed` (400) on read and write; no persist | `h137-phase-b-...test.ts`; `crm/routes.ts` → `crm/contact.ts` |
| CRM search contact | `GET /v1/crm/search?types=contact` | Iterated `store.crmContacts` | Contact-only search `person_domain_removed`; mixed search skips contact | `crm/search.ts` |
| CRM duplicates contact | `GET /v1/crm/duplicates?entityType=contact` | Allowed contact entityType | `person_domain_removed`; org duplicates retained | `crm/duplicate.ts` |
| HR | `/v1/hr/employees*`, `/leave*`, `/skills*` | GET empty/`not_found`; writes retired | All person reads/writes `person_domain_removed` | `hr/routes.ts` → `hr/hr.ts`; H-137 test |
| HR health | `GET /v1/hr/health` | Module health | Retained 401/403/200 health (counts 0); not person SoR | `hr/routes.ts` |
| HR certifications | `/v1/hr/certifications*` | GET empty/`not_found`; writes retired | List/get/write `person_domain_removed`; health retained | `hr-certifications/routes.ts` |
| Supplier contacts | `POST/PATCH/DELETE /v1/suppliers/:id/contacts*` | Mutations `person_domain_removed` | Unchanged retirement; GET company `contacts: []` | `supplier/routes.ts` → `contacts.ts` / `supplier.ts`; H-137 test |
| Supplier company/rates | `/v1/suppliers`, `/rates*` | Commercial | Unchanged; rates have no `contactId` | H-137 commercial + supplier tests |
| Guest manifests | `/v1/ops/manifests*` | GET `not_found`; writes retired | GET/POST `person_domain_removed` | `ops/routes.ts` → `manifests.ts` |
| Guest vouchers | `/v1/ops/vouchers*` | GET empty items; writes retired | GET/POST `person_domain_removed` | `ops/routes.ts` → `vouchers.ts` |
| Privacy person fields | DSR `subjectLabel`; consent `notes` | Not persisted | Still not persisted or returned; extra JSON ignored | `privacy/service.ts`, `consent-register/service.ts`; H-137 privacy test |

### Route registration (server → router → service)

| route | registration location | current behavior | new behavior | test proving behavior |
| --- | --- | --- | --- | --- |
| `/v1/crm/contacts*` | `server.ts` → `registerCrmRoutes` (`crm/routes.ts` ~298–355, 527, 712) | Registered | Registered; service `personDomainRemoved()` after authorize | H-137 person + auth tests |
| `/v1/hr/employees*` `/leave*` `/skills*` | `server.ts` → `registerHrRoutes` (`hr/routes.ts`) | Registered | Same retirement | H-137 person + auth tests |
| `/v1/hr/certifications*` | `server.ts` → `registerHrCertificationRoutes` | Registered | List/get/write retired; health retained | H-137 cert GET via prior H-136/H-1 suites |
| `/v1/suppliers/:id/contacts*` | `server.ts` → `registerSupplierRoutes` (`supplier/routes.ts` ~504–536) | Registered | Mutations retired | H-137 supplier test |
| `/v1/ops/manifests*` `/v1/ops/vouchers*` | `server.ts` → `registerOpsRoutes` (`ops/routes.ts` ~126–257) | Registered | Retired | H-137 person + auth tests |

Commercial routers (`pipeline`, `programme`, `rfp`, `proposal`, `costing`, `bookings`, CRM orgs/accounts) were not unregistered.

---

## E. Kernel/store

```text
Kernel redesign: NONE
Store redesign: NONE
New person storage: NONE
```

**RETAIN (compile shims, not SoR):** `Store.crmContacts`, `supContacts`, `hrEmployees`, `opsManifests`, `opsManifestEntries`, `opsVouchers`; kernel person types (`CrmContact`, `guestName`, etc.); `upsertCrmContact` persist no-op; `contactResource` helper.

**REDUCE / already no-op:** persist dual-write for dropped person tables remains skipped (Phase A). Not changed in H-137.

**REMOVE:** none — remaining symbols are still referenced by UI/import/kernel compile paths (Phase C/E).

`apps/api/src/personal-data-phase1.ts`:

| export | classification |
| --- | --- |
| `PERSON_DOMAIN_REMOVED` | **RETAIN** — deterministic retirement reason used by retired APIs and import execute skip |
| `personDomainRemoved()` | **RETAIN** — never writes/reconstructs person data |

---

## F. Analytics/command-center

Prior dirty-tree work already zeroed guest metrics in command-center, operations analytics, commercial `opsVouchers`, workbench, and ops health (no in-memory manifest/voucher SoR reads).

H-137 additional finding: `apps/api/src/notifications/notifications.ts` still reconstructed “Guest vouchers pending issue” from `store.opsVouchers`. **Smallest mechanical change:** that block was removed so in-app notification generation no longer reads the removed guest voucher collection. Notification architecture, outbox, and `recipient_email` were **not** redesigned.

Kernel timeline still has `guest_manifest` / `guest_vouchers` keys (compile shims; populated pending/zero). Not redesigned.

---

## G. Commercial preservation

```text
Commercial workflow preserved: YES
Commercial API regression: PASS
Authentication preserved: YES
```

Evidence: `apps/api/src/h137-phase-b-personal-data-api-domain-surface.test.ts` — login 200; unauthenticated person/commercial routes 401; organization → account → opportunity (paxCount, no `contactId`) → RFP → `GET /v1/rfps/:id/documents` 200 → programme → costing → supplier company → supplier rate (no `contactId`); `GET /v1/bookings/health` 200; `GET /v1/proposals/health` 200.

Commercial business rules, rate identity, proposal/costing behaviour, booking headers, and authentication semantics were not altered.

---

## H. Database

```text
New migration: NONE
Schema changes: NONE
Migration 125 modified: NO
```

Phase A schema remains the fixed baseline. Catalogs not touched: Production, `eos`, `eos_gateb`, UAT.

---

## I. Tests

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
  src/h137-phase-b-personal-data-api-domain-surface.test.ts
  src/h136-phase-2-personal-data-api-domain-surface.test.ts
  src/h136-phase-a-personal-data-domain.test.ts
  src/h135-phase1-personal-data-domain.test.ts
  src/c1.contacts.test.ts
  src/i10-hr-core.test.ts
  src/h1-hr-certifications.test.ts
  src/pg9-supplier-contact-rate.test.ts
  src/o1-ops.test.ts
  src/o4-vouchers.test.ts
  src/p1-privacy-ropa-dsr.test.ts
  src/p3-consent-register.test.ts
Test Files  12 passed (12)
Tests  46 passed (46)
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

Kernel tests not re-run: kernel sources not modified; kernel `tsc --noEmit` EXIT 0.

Full repository vitest was **not** claimed green.

New proof file:

```text
apps/api/src/h137-phase-b-personal-data-api-domain-surface.test.ts
```

Live Dev/Test PostgreSQL / migrate: **NOT RUN**.

---

## J. Later dependencies

- **Phase C UI:** CRM Contacts tab, HR pages, supplier contact form, operations guest/voucher UI, DSR subject UI
- **Phase E imports:** `entityType=contact` / `supplier_contact` create/validate metadata; execute already refuses person rows
- **Store/kernel compile shims** listed in §E
- Analytics kernel guest timeline keys
- DocumentStorage / free-text / JSONB
- Notifications architecture / `recipient_email` (Owner Decision)
- Logging redaction
- Field-ops `manifest_entry` string policy
- `privacy_processing_activities` retention (Owner Decision)

---

## K. Governance gates

```text
PDPC:
OPEN

EI-01:
OPEN / REQUIRES OWNER EVIDENCE REVIEW

Production:
NOT AUTHORIZED / NOT READY

UAT:
NOT STARTED

Commit:
NONE

Push:
NONE
```

ADR-0006 = OPEN. DP-0006 = OPEN.

No PDPC exemption or compliance is claimed.

---

## Explicit non-actions

This increment did **not**: create migration 126; modify migration 125; drop/alter tables or FKs; redesign UI; redesign CSV import/export; redesign DocumentStorage/free-text/JSONB; redesign notification/logging/field-cache architecture; change authentication; invent a replacement person table; commit; push; touch Production/UAT.

---

## Conclusion

Phase B API/domain-surface remediation is implemented in Dev/Test: obsolete person-data APIs are retired with deterministic `person_domain_removed` behaviour after authorize; they do not persist or retrieve person records; commercial workflow and authentication remain intact; the Phase A schema is unchanged.

**STOP.** A new governance review is required before Phase C+.
