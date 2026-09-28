# H-132 — EOS Personal-Data Surface Audit

> **GOVERNANCE / ASSESSMENT ONLY**  
> Repository inspection of current EOS implementation capability against the H-131 privacy-by-design boundary.  
> **NOT** remediation. **NOT** application, schema, migration, or infrastructure change.  
> **NOT** PDPC registration, exemption, or legal opinion. **NOT** Production authorization.  
> Prior records H-125, H-126, H-128, H-129, H-130, both H-131 artefacts, and `h-132-tin-identity-reconciliation-and-evidence-gate.md` inspected and **not modified**.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 511.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.  
**Commit / push:** **NONE**.

This file is a **distinct** H-132 artefact from `h-132-tin-identity-reconciliation-and-evidence-gate.md`. It does **not** replace TIN identity reconciliation.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration status = OPEN / NOT COMPLETED
```

---

## 1. Purpose

Determine whether any existing EOS application surface, schema, API, fixture, seed data, test data, document-storage capability, logging path, audit path, or UI field **could currently** collect, process, display, persist, or expose information that identifies or can reasonably identify a natural person.

The audit assesses **implementation capability**, not whether live Production data exists (Production is not authorized) and not whether current fixtures contain real persons.

---

## 2. Scope

**In scope:** repository evidence in `apps/api`, `apps/web`, `packages/kernel`, `packages/db` (including migrations and `schema.sql`), Dev/Test seed/demo helpers, and related tests.

**Out of scope:** Production systems, external logs, live databases, Owner company-docs folders, TRA/BRELA certificates, legal classification under PDPA beyond capability language, and any code change.

Inspected categories include schema, models, migrations, API routes, DTOs/validation, web forms/UI, CRM/account/opportunity/programme/RFP/supplier/rate/booking fields, authentication, audit/events, logging, fixtures/seed/tests, document storage, email/WhatsApp surfaces, import/export, search, background/outbox jobs, event payloads, caches, and browser storage.

---

## 3. Baseline governance rule from H-131

From `h-131-eos-personal-data-boundary-and-privacy-by-design.md` (unchanged):

```text
EOS shall not be designed or implemented as a system of record for personal data.
```

EOS is intended to hold business/commercial facts (company names, identifiers, destinations, dates, **counts**, budgets, rates, statuses). EOS is **not** intended to retain individual names, personal emails/phones, traveller records, employee personal records, identity documents, or similar.

This audit does **not** modify that policy. No PDPC exemption is asserted. PDPC applicability to SEDMC’s wider operations remains a separate legal/regulatory question.

---

## 4. Methodology

1. Search kernel types, SQL migrations, API handlers, and web UI for explicit personal-data-bearing field names and mechanisms listed in the H-132 assessment brief.  
2. Classify by **what the software can accept/persist/display**, not by whether fixtures currently hold real people.  
3. Treat synthetic seed/test values as evidence of **capability** when they populate those fields.  
4. Do not copy actual seed names, emails, telephone numbers, or other values into this report.  
5. Prefer capability language over legal conclusions. Where a field is ambiguous (for example organisation switchboard email vs personal email), explain the ambiguity.  
6. Classification vocabulary:

| Code | Meaning |
| --- | --- |
| **A** | No personal-data capability identified on the inspected surface |
| **B** | Business-entity data only |
| **C** | Potential personal-data capability (could contain personal data) |
| **D** | Confirmed personal-data capability (explicitly models/accepts/persists/displays) |
| **E** | Unknown / insufficient evidence |

Do not force A/B merely because fixtures are synthetic.

---

## 5. Inspected implementation areas

| Area | Primary evidence (paths) |
| --- | --- |
| Kernel CRM / contacts | `packages/kernel/src/crm.ts`, `crm-contact.ts`, `crm-import.ts` |
| CRM schema | `packages/db/migrations/004_c1_crm.sql` |
| CRM API / UI | `apps/api/src/crm/contact.ts`, `crm/routes.ts`; `apps/web/src/app/commercial/crm/page.tsx` |
| HR | `packages/db/migrations/081_i10_hr_core.sql`; `apps/api/src/hr/hr.ts`; `apps/web/src/app/commercial/hr/page.tsx` |
| Supplier contacts | `packages/kernel/src/supplier.ts`, `supplier-import.ts`; `apps/web/src/app/commercial/suppliers/page.tsx` |
| Guest manifests / vouchers | `packages/kernel/src/ops-manifest.ts`; `packages/db/migrations/023_o2_ops_manifest.sql`; ops UI |
| Bookings | `packages/kernel/src/booking.ts` |
| Commercial docs | `packages/kernel/src/commercial-document.ts`; `apps/api/src/commercial-documents/` |
| Email notifications | `packages/db/migrations/032_i3_email_outbox.sql`; `packages/kernel/src/notification-email.ts` |
| Auth / principals | `packages/db/schema.sql` (`principals`, `principal_credentials`); `apps/web/src/lib/eos-session.ts` |
| Events / logging | `packages/kernel/src/crm-events.ts`, `event-schema.ts`; `apps/api/src/observability.ts` |
| Seed / tests | `apps/api/src/dev/seed-demo-data.ts`; CRM/ops tests |
| Privacy registers | `packages/db/migrations/092_p1_privacy_ropa_dsr.sql`, `110_p3_consent_records.sql` |
| Field cache | `apps/web/src/lib/field-offline-cache.ts`; `apps/api/src/ops/field-sync.ts` |
| F2 commercial facts / rates / RFP pax | `packages/kernel/src/rfp.ts`, `opportunity.ts`, `programme.ts`, commercial-facts modules |

This is not an exhaustive line-by-line listing of every file. Surfaces not listed were sampled via repository search; residual **E** items are in §17.

---

## 6. Personal-data capability findings

### Confirmed (**D**)

The implementation **explicitly models** natural-person records:

- **CRM contacts:** required `givenName` / `familyName`; optional `email`, `telephone`, `mobile`, `preferredName`, `jobTitle`, `country`, `language`, `communicationPreferences`. Create/list/update/archive APIs exist (`POST/GET/PATCH /v1/crm/contacts`). CSV import accepts contact given/family name, email, telephone. UI lists contact name and email. Classification on contacts defaults to `Confidential` in schema.  
- **HR employees:** required `given_name` / `family_name`; optional `email`, `job_title`, `start_date`; leave requests include leave type `sick` (health-adjacent employee record). UI form collects given name / family name / email.  
- **Supplier contacts:** required `givenName` / `familyName`; optional `email`, `telephone`, `whatsapp`, `notes`. Supplier UI form creates these contacts. CSV import maps `whatsapp`.  
- **Operations guest manifests:** required `guestName`; optional `email`, `dietary`, `mobility`, `rooming`, `flightReference`. API and operations UI add/display guest names. Vouchers copy `guestName` (and may copy dietary into voucher notes).  
- **Demo seed** populates CRM contacts and guest-manifest entries with synthetic but realistic-format names, emails, and telephone numbers — evidence of **intended** use of those fields, not of live persons.

### Potential (**C**)

- Organisation `primaryEmail` / `primaryTelephone` / `address` JSONB: typically business, but not constrained to non-personal values.  
- Free-text: CRM notes (`crm_notes.body`), relationship notes, RFP `notes`, ops briefs `content`, field-task descriptions, assignment notes, AI draft `body`, knowledge/crisis/internal-audit bodies, supplier/rate notes. A user can type a person’s name, email, or health note.  
- Commercial document bytes (PDF/DOCX/XLSX/CSV/JPEG/PNG, up to 10 MiB): no content inspection for identity documents. **Capability** to retain personal data inside files; **no** repository evidence that identity documents are currently stored.  
- CRM/supplier import stores `csv_content` on import batches — the CSV itself can contain contact rows.  
- Privacy DSR `subject_label` and consent `notes` can hold names/identifiers of data subjects.  
- Browser field-ops cache stores briefs (free text). Manifest entries are **denied** as offline entities (mitigation), but online SoR still holds guests.  
- Application logger redacts passwords/tokens **only**; it does not redact email/name/phone. Default request hooks do **not** log bodies; if a caller logs a contact payload, those fields would not be redacted.

### Business-entity only (**B**) — samples aligned with H-131 allowed facts

- Company/account/supplier/hotel legal and trading names.  
- Opportunity / RFP / programme / booking identifiers, destinations, event dates, `paxCount` (counts, not named delegates).  
- Commercial rates, currencies, budgets, proposal/workflow status.  
- F2 commercial-facts overlays as inspected: commercial/status/count-style facts, not traveller dossiers.

### No dedicated capability identified (**A**) on first-class fields

- No `passport_number`, `national_id`, `date_of_birth`, biometric, or individual bank-account columns located in schema.  
- CRM/event catalogues **forbid** payload keys including `passport`, `nationalId`, `dateOfBirth`, `email`, `phone` on CRM domain events (event-minimisation, **not** absence of CRM SoR).  
- No mailbox/IMAP/Gmail/Outlook **inbound** connector or WhatsApp **message** ingest implementation located (WhatsApp appears as a **channel label** and as a supplier-contact **identifier field**, not as message archive ingest).

---

## 7. Database / schema findings

| Object | Classification | Notes |
| --- | --- | --- |
| `crm_contacts` | **D** | Natural-person name + email/phone/mobile |
| `crm_organizations.primary_email` / `primary_telephone` / `address` | **C** | Org-oriented; unconstrained |
| `crm_notes.body` | **C** | Free text |
| `crm_import_batches.csv_content` | **C** | Can hold contact CSVs |
| `hr_employees` | **D** | Employee name + email; leave includes `sick` |
| `sup_contacts` (C4 supplier contacts) | **D** | given/family name, email, telephone, whatsapp |
| `ops_manifest_entries` | **D** | `guest_name`, email, dietary, mobility |
| `ops_briefs.content` | **C** | Free text |
| `bkg_bookings` | **B** (+ **C** via linked manifest) | Booking title/paxCount/status; guest names live on manifest, not booking header |
| `principals.email` / `display_name` | **D** (technical user identity; see §12) | Distinct from traveller CRM |
| `principal_credentials.password_hash` | **A** as customer PII; secrets class | Not a traveller record |
| `notif_email_outbox.recipient_email` / `body_text` | **D** / **C** | Outbound notification to an email address; body may name a person |
| `privacy_dsr_cases.subject_label` | **C** | Label for a data subject |
| Commercial document metadata + object bytes | **C** | See §10 |
| F2 commercial facts / rate identity tables | **B** as designed | Counts, rates, programme/RFP identity — not contact rows |

Schema comments repeatedly mark CRM/HR/ops as Development/Test, **not** Production-ready. That does **not** remove capability.

---

## 8. API findings

| Surface | Classification | Evidence |
| --- | --- | --- |
| `POST/GET/PATCH /v1/crm/contacts` (+ archive, notes, relationships, activities) | **D** | Accepts/returns givenName, familyName, email, telephone, mobile |
| `POST /v1/crm/imports` entityType `contact` | **D** | CSV contact ingest |
| HR employee create/update/list | **D** | givenName, familyName, email |
| Supplier contact create + supplier CSV import | **D** | givenName, familyName, email, telephone, whatsapp |
| Ops manifest entry add + voucher issue | **D** | guestName, dietary, email |
| RFP/opportunity/programme/costing with `paxCount` | **B** | Count only |
| Commercial document upload | **C** | Arbitrary allowed-mime files |
| Notification email outbox | **D** (recipient address) | Not inbound mail ingest |
| Field sync pull | **C** | Tasks + brief content; manifest **denied** offline |

CRM domain events attempt **reference-only** payloads and forbid embedding email/phone/passport keys. Persistence of contacts in `crm_contacts` remains **D**.

---

## 9. UI findings

| Page | Classification | Evidence |
| --- | --- | --- |
| `/commercial/crm` Contacts tab | **D** | Displays givenName, familyName, email; search matches name/email; import entry points |
| `/commercial/hr` | **D** | Given name / family name inputs required |
| `/commercial/suppliers` contact form | **D** | givenName, familyName, email |
| `/commercial/operations/[bookingId]` | **D** | Guest name input; lists guestName and dietary |
| RFP document upload UI | **C** | PDF/DOCX/XLSX upload |
| Pipeline / programme / commercial-facts panels | **B** (plus **C** if notes used) | Identifiers, counts, statuses as inspected |

No CRM “create contact” form was required on the CRM list page; **API + CSV import** still provide create capability. UI display of contacts is sufficient to treat the surface as **D**.

---

## 10. Document / attachment findings

Commercial DocumentStorage (`LocalFsDocumentStorage` in Dev/Test) stores **opaque bytes** with metadata (filename, mime, checksum). Allowed MIME types include PDF, DOCX, XLSX, CSV, JPEG, PNG. Maximum size 10 MiB. Kinds: `rfp`, `contract`, `rate_sheet`, `other`. UI: “Upload PDF / DOCX / XLSX” on RFP pages; supplier contract upload uses the same service.

**Classification: C — potential personal-data capability.**

```text
Generic document attachment capability exists and could technically contain personal data.
```

This audit does **not** find repository evidence that EOS currently stores personal identity documents. That stronger statement is **not** made.

Production object store remains unselected (local-fs forbidden in production-like config). That is a hosting constraint, not a content filter.

---

## 11. Email / WhatsApp findings

**Inbound email ingest (mailbox, IMAP, Gmail, Outlook connectors):** **A** — not identified as an implemented connector. Governance already records mailbox ingest as not authorized; this audit found no contradicting ingest implementation.

**Outbound transactional/notification email:** **D** for recipient email addresses (`notif_email_outbox.recipient_email`, allowlists, suppressions) and **C** for message bodies. This is send-side notification, not mailbox ingest.

**WhatsApp message / attachment ingest:** **A** — no WhatsApp Business API / message-archive connector located.

**WhatsApp as a stored identifier on supplier contacts:** **D** — optional `whatsapp` field on `SupContact` and supplier-import CSV column. That is a personal communication identifier capability, not message-content ingest.

**WhatsApp as an RFP/commercial channel label:** **B** — enumerating `channel: "whatsapp"` as how an RFP arrived does not store message content.

---

## 12. Authentication / user identity findings

`principals` stores `email` (optional), `display_name` (required), actor type, status. `principal_credentials` stores `password_hash`. Web session stores token and email in `sessionStorage`.

**Classification:** technical authentication / operator identity required to operate the software — **not** equivalent to traveller or client CRM records.

It is still **confirmed storage of system-user identity** (email + display name). H-131 forbids employee personal records as ordinary commercial SoR; HR employees are a separate **D** surface. Principals are recorded here as **operator identity**, not as a finding that login must be removed.

No formal corporate IdP is selected (H-126 / ADR-0013 **OPEN**). Local-password IdP is Dev/Test-oriented and is **not** Production-authorized.

---

## 13. Logging / audit findings

- Request completion logs: method/path/status/correlation id — **A** for default body capture.  
- Password/token keys redacted; **email, name, phone not redacted** — **C** if those fields are passed to the logger.  
- CRM events: forbidden PII keys in payloads; entity id references — minimisation **B/C**, while the CRM tables remain **D**.  
- Outbox/audit tables (I4, internal audit, DLQ) may include notification recipient emails or free-text notes — **C**.  
- No Production logs were inspected.

---

## 14. Fixtures / test-data findings

`apps/api/src/dev/seed-demo-data.ts` seeds CRM contact CSV rows and guest-manifest entries using **synthetic** given/family names, `*.example.com` / `*.example.de` emails, and international-format telephone numbers. Ops tests use guest names and dietary strings. CRM tests use `*.example.com` contact emails.

These values are **demonstrably synthetic** (example domains / test labels). They still prove **D** capability: the pipeline is built to persist that class of data.

This report does **not** reproduce those values.

No passport or national-ID fixture columns were found.

---

## 15. Summary classification

| Surface | Personal-data capability? | Classification | Evidence | Remediation required? |
| --- | --- | --- | --- | --- |
| CRM contacts (schema, API, import, UI) | Yes — confirmed | **D** | `crm_contacts`; `/v1/crm/contacts`; CRM page | **Not in this increment.** Governance/privacy review required before keep-or-remove |
| CRM org primary email/phone/address | Possible | **C** | `004_c1_crm.sql` | Review only if policy requires org-only contact |
| CRM notes / free text | Possible | **C** | `crm_notes.body` | Change-control; no code change here |
| HR employees + leave | Yes — confirmed | **D** | `hr_employees`; HR UI | Governance/privacy review |
| Supplier named contacts + whatsapp field | Yes — confirmed | **D** | `SupContact`; suppliers UI/import | Governance/privacy review |
| Guest manifest + vouchers | Yes — confirmed | **D** | `ops_manifest_entries.guest_name`; ops UI | Governance/privacy review |
| Booking header / paxCount | Counts / commercial | **B** | `booking.ts` | None evidenced |
| RFP/opportunity/programme facts | Commercial + notes **C** | **B** / **C** | `paxCount`; `rfp.notes` | Notes policy only |
| Rate identity / costing amounts | Commercial | **B** | kernel rate/costing types | None evidenced |
| DocumentStorage uploads | Possible in file bytes | **C** | MIME allowlist; upload APIs | Do not claim identity docs stored |
| Inbound email ingest | No connector found | **A** | Repository search | None |
| Outbound notification email | Recipient addresses | **D** | `notif_email_outbox` | Distinguish from ingest |
| WhatsApp message ingest | No connector found | **A** | Repository search | None |
| WhatsApp identifier on supplier contact | Yes | **D** | `whatsapp?` on `SupContact` | Governance/privacy review |
| Operator principals | System-user identity | **D** (technical) | `principals.email` | Not traveller SoR; still identity storage |
| Default HTTP logs | Body not logged; PII keys not redacted | **A** / **C** | `observability.ts` | No automatic change |
| Seed/test contacts and guests | Synthetic **D** capability | **D** | `seed-demo-data.ts` | Not live persons |
| Passport / national ID / DoB columns | Not modelled | **A** | Search; forbidden event keys only | Attachments/notes remain **C** |
| Field offline cache | Briefs **C**; manifests denied offline | **C** | `field-sync.ts` policy | None in this increment |

---

## 16. Alignment with H-131

```text
NOT ALIGNED — CONFIRMED PERSONAL-DATA CAPABILITIES IDENTIFIED
```

H-131 says EOS must **not** intentionally collect, retain, or use as ordinary business records: individual client contact names, personal emails/telephones, traveller/delegate records, employee personal records, dietary/medical information, personal WhatsApp identifiers, or uploaded personal identity documents.

The **current implementation** includes CRM contacts, HR employees, supplier named contacts (including a WhatsApp identifier field), and guest manifests with dietary/mobility fields. Those are **ordinary modelled records**, not accidental fixtures.

This is an **architecture-capability** finding. It does **not** mean:

- SEDMC is (or is not) required to register with PDPC;
- EOS compliance equals SEDMC PDPC compliance;
- a personal-data-free EOS would eliminate all SEDMC privacy obligations;
- Production is processing live personal data (Production is not authorized).

H-131 already stated this increment would not certify that every code path complies. This audit now supplies the missing capability assessment.

---

## 17. Gaps or ambiguities

1. Organisation `primaryEmail` / `primaryTelephone` may be a switchboard or a named person’s mailbox — **C**, not forced to **D**.  
2. Whether a work email of a named contact is “personal data” in law is **not** decided here; the field **identifies a natural person** as implemented (`givenName` + `email`). Capability language: **D**.  
3. DocumentStorage **could** hold identity documents; there is **no** evidence it currently does.  
4. Event-payload forbidden keys reduce **event** leakage; they do not remove CRM/HR/ops **tables**.  
5. Surfaces not individually opened (every GRC/ITSM/finance screen) may contain additional **C** free-text fields. Residual risk: **E** for unopened screens; search did not find further traveller/passport models.  
6. Live Dev/Test database contents were **not** dumped. Seed/code paths are sufficient for capability conclusions.

---

## 18. Recommended governance disposition

**Assessment-only. No remediation in this increment.**

Recommended Owner/governance disposition (decision, not implementation):

1. Treat H-131 as the **intended** boundary and this audit as evidence that **current EOS code is not aligned** with that boundary.  
2. Do **not** silently keep CRM contacts, HR employees, supplier named contacts, or guest manifests as if they were H-131-compliant “business facts.”  
3. Any decision to **retain** those capabilities requires a **new governance/privacy review** (H-131 §13) before they are treated as authorized personal-data processing.  
4. Any decision to **remove, disable, or narrow** those capabilities is a **separate change-controlled implementation increment** — not authorized here.  
5. EI-01 TIN identity (other H-132 file) and PDPC registration remain **independent** gates.  
6. Do not use this audit as PDPC exemption evidence.

No field is recommended for deletion in this report’s implementation sense: this increment must not remove fields.

---

## 19. Explicit statement that this was assessment-only

```text
This increment is assessment-only.
No application code, schema, migration, infrastructure, validation,
masking, deletion logic, or privacy control was added or changed.
No finding was remediated automatically.
```

---

## 20. Future change-control requirement

Before implementation of **either** remediation **or** authorized personal-data processing, a new governed increment is required for any of:

- retaining CRM contact / HR employee / supplier contact / guest-manifest personal-data models as an approved privacy architecture;
- removing or disabling those models;
- email or WhatsApp **ingestion**;
- treating DocumentStorage as a store for identity documents;
- adding passport, national ID, date of birth, health, biometric, or individual payment fields;
- introducing pseudonymous person identifiers as a substitute privacy architecture;
- asserting PDPC exemption from EOS alignment.

Until that review, H-131 remains the **intended** boundary, and this audit records that the **current implementation is not aligned** with it.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration remains OPEN.
No PDPC exemption is asserted.
```
