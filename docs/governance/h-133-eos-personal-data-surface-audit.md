# H-133 — EOS Personal-Data Surface Audit

> **GOVERNANCE / ASSESSMENT ONLY**  
> Repository inspection of current EOS implementation capability against the H-131 privacy-by-design boundary.  
> **NOT** remediation. **NOT** application, schema, migration, or infrastructure change.  
> **NOT** PDPC registration, exemption, or legal opinion. **NOT** Production authorization.  
> Prior records H-125, H-126, H-128, H-129, H-130, both H-131 artefacts, `h-132-tin-identity-reconciliation-and-evidence-gate.md`, and `h-132-eos-personal-data-surface-audit.md` inspected and **not modified**.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 512.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.  
**Commit / push:** **NONE**.

This increment is numbered **H-133** because H-132 is already used by the TIN identity reconciliation record. This file does **not** replace that record.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration status = OPEN / NOT COMPLETED
```

---

## 1. Purpose

Determine whether any existing EOS application surface, database schema, API, fixture, seed data, document-storage capability, logging path, audit path, or UI field **could currently** collect, process, display, transmit, or persist information that identifies or can reasonably identify a natural person.

Assess **both**:

- **A.** current stored/sample data in the repository (fixtures, seeds, tests);
- **B.** technical **capability** of the implementation.

Do not treat synthetic fixtures as proof that a capability is absent.

This audit answers the H-131 residual question: whether EOS has already been **proven free of personal-data capability**. It does **not** assert a PDPC exemption, that SEDMC has no privacy obligations, or that SEDMC does not process personal data **outside** EOS.

---

## 2. Scope

**In scope:** `apps/api`, `apps/web`, `packages/kernel`, `packages/db` (including `schema.sql` and migrations), Dev/Test seed helpers, and related tests.

**Out of scope:** Production systems, external logs, live databases, Owner company-docs, TRA/BRELA certificates, legal determinations under PDPA, and any code change.

Inspected where applicable: schema, ORM/kernel models, migrations, API routes and DTOs, validation, web forms/UI, opportunity/account/programme/RFP/supplier/rate/booking fields, authentication, audit/events, logging, error handling, fixtures/seed/tests, document storage, email/WhatsApp, import/export, search, background/outbox jobs, event payloads, caches, and browser storage.

---

## 3. H-131 privacy boundary

From `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md` (unchanged):

```text
EOS shall not be designed or implemented as a system of record for personal data.
```

Intended ordinary records: company/account names, opportunity/RFP/programme identifiers, destination, travel/event dates, participant **counts**, budgets, currencies, commercial rates, supplier/company information, proposal and workflow status, approved business metrics, operational status.

Not intended as ordinary EOS records: individual traveller/client/employee names, personal email/telephone, passport/national ID, residential address, date of birth, health/dietary/biometric data, individual banking data, personal WhatsApp/email **content**, uploaded identity documents, traveller/delegate identity records, and other information identifying a natural person.

H-131 does **not** assert a PDPC exemption, that SEDMC has no privacy obligations, that SEDMC does not process personal data outside EOS, or that EOS has already been proven free of personal-data capability.

This document does **not** modify that policy.

---

## 4. Assessment methodology

1. Search kernel types, SQL migrations, API handlers, and web UI for named person/contact/email/phone/guest/employee/passport/ID/DoB/dietary fields and related mechanisms.  
2. Classify by **capability** (can the software accept/persist/display/transmit?) as well as current sample data.  
3. Treat synthetic seed/test values as evidence of **intended use of a field**, not as live persons.  
4. Do not copy actual names, emails, telephone numbers, or other values into this report.  
5. Prefer capability language over legal conclusions.  
6. Classification vocabulary:

| Code | Meaning |
| --- | --- |
| **A** | No personal-data capability identified on the inspected surface |
| **B** | Business-entity / commercial data only |
| **C** | Potential personal-data capability (could contain personal data) |
| **D** | Confirmed personal-data capability (explicitly models, accepts, persists, displays, or transmits) |
| **E** | Unknown / insufficient evidence |

Do not classify a surface as A/B merely because fixtures are fake.

---

## 5. Repository areas inspected

| Area | Primary evidence |
| --- | --- |
| Kernel CRM | `packages/kernel/src/crm.ts`, `crm-contact.ts`, `crm-import.ts` |
| CRM schema | `packages/db/migrations/004_c1_crm.sql` |
| CRM API / UI | `apps/api/src/crm/contact.ts`, `crm/routes.ts`; `apps/web/src/app/commercial/crm/page.tsx` |
| Opportunity / RFP / programme | `packages/kernel/src/opportunity.ts`, `rfp.ts`, `programme.ts` |
| HR | `packages/db/migrations/081_i10_hr_core.sql`; `apps/api/src/hr/hr.ts`; `apps/web/src/app/commercial/hr/page.tsx` |
| Supplier / rates | `packages/kernel/src/supplier.ts`, `supplier-import.ts`; suppliers UI |
| Guest manifests / bookings | `packages/kernel/src/ops-manifest.ts`, `booking.ts`; `packages/db/migrations/023_o2_ops_manifest.sql` |
| Documents | `packages/kernel/src/commercial-document.ts`; `apps/api/src/commercial-documents/` |
| Email notifications | `packages/db/migrations/032_i3_email_outbox.sql` |
| Auth | `packages/db/schema.sql` (`principals`); `packages/kernel/src/types.ts`; `apps/web/src/lib/eos-session.ts` |
| Events / logging | `packages/kernel/src/crm-events.ts`, `event-schema.ts`; `apps/api/src/observability.ts` |
| JSON / snapshots | F2 commercial-facts `payload JSONB`; proposal/programme snapshots; field-sync payloads |
| Seed / tests | `apps/api/src/dev/seed-demo-data.ts`; CRM/ops tests |
| Field cache | `apps/web/src/lib/field-offline-cache.ts`; `apps/api/src/ops/field-sync.ts` |

Surfaces not opened line-by-line may retain residual **E** (see §22). Search did not find first-class passport/national-ID/DoB columns.

---

## 6. Database / schema findings

| Object | Classification | Notes |
| --- | --- | --- |
| `crm_contacts` | **D** | `given_name`, `family_name` required; `email`, `telephone`, `mobile` optional |
| `crm_organizations.primary_email` / `primary_telephone` / `address` JSONB | **C** | Organisation-oriented; not constrained to non-personal values |
| `crm_notes.body` | **C** | Free text |
| CRM/supplier import `csv_content` | **C** | Can hold contact rows |
| `hr_employees` | **D** | Employee given/family name, email; leave type includes `sick` |
| Supplier contacts | **D** | `givenName`, `familyName`, `email`, `telephone`, `whatsapp` |
| `ops_manifest_entries` | **D** | `guest_name`, `email`, `dietary`, `mobility` |
| `ops_briefs.content` | **C** | Free text |
| `bkg_bookings` | **B** (guests via linked manifest **D**) | Title, `paxCount`, status |
| `principals.email` / `display_name` | **D** (technical operator identity) | Distinct from traveller CRM |
| `notif_email_outbox.recipient_email` | **D** | Outbound recipient address |
| F2 commercial facts `payload JSONB` | **C** structurally / **B** as intended commercial facts | Unconstrained JSON could hold extra keys |
| Commercial document bytes | **C** | See §14 |
| Passport / national ID / DoB columns | **A** as first-class fields | Forbidden on some event payloads; not modelled as columns |

Schema comments mark several contexts Development/Test. That does **not** remove capability.

---

## 7. API findings

| Surface | Classification | Evidence |
| --- | --- | --- |
| `POST/GET/PATCH /v1/crm/contacts` | **D** | Accepts/returns givenName, familyName, email, telephone, mobile |
| `POST /v1/crm/imports` (`contact`) | **D** | CSV contact ingest |
| HR employee create/update/list | **D** | givenName, familyName, email |
| Supplier contact create + CSV import | **D** | Name, email, telephone, whatsapp |
| Ops manifest entry add + voucher issue | **D** | guestName, dietary, email |
| Opportunity / RFP / programme / costing with `paxCount` | **B** | Counts, not named delegates |
| Commercial document upload | **C** | Allowed-mime files stored and retrievable |
| Notification email outbox | **D** (addresses) / **C** (bodies) | Send-side, not mailbox ingest |
| Field sync pull | **C** | Tasks + brief; `manifest_entry` **denied** offline |

CRM domain events forbid embedding keys such as `email`, `phone`, `passport`, `nationalId`, `dateOfBirth` in event payloads. That is event minimisation. **Tables still persist contacts.**

---

## 8. UI findings

| Page | Classification | Evidence |
| --- | --- | --- |
| `/commercial/crm` Contacts tab | **D** | Displays givenName, familyName, email; search matches name/email; import |
| `/commercial/hr` | **D** | Given name / family name inputs |
| `/commercial/suppliers` contact form | **D** | givenName, familyName, email |
| `/commercial/operations/[bookingId]` | **D** | Guest name input; lists guestName and dietary |
| RFP document upload | **C** | PDF / DOCX / XLSX upload |
| Pipeline / programme / commercial-facts panels | **B** / notes **C** | Identifiers, counts, statuses as inspected |

A dedicated “create contact” form is not required on the CRM list page. **API + CSV import** still create contacts. Display of contacts is sufficient for **D**.

---

## 9. Opportunity / RFP findings

Opportunity (`OppOpportunity`): organisation/account linkage, stage/status, title, `programmeSummary`, estimated value/currency, **`paxCount`**, expected close date, owner principal id. **B** for commercial pipeline fields. `programmeSummary` is unconstrained text → **C**.

RFP (`RfpRecord`): codes, organisation/opportunity linkage, title, workflow, **`paxCount`**, `travelDates`, `destinations`, budgets/currency (**B**). `requirementsText` and `notes` are free text → **C**. `source` may be a channel label (email/portal/advisor) → **B** as catalogue, not message content.

No traveller name, passport, or contact-person field is modelled on opportunity/RFP types as inspected.

---

## 10. Account / user findings

**CRM accounts** (`crm_accounts`): account name, organisation link, owner principal, status/priority — **B** (commercial account), not a natural-person row. Contacts hang off organisations/relationships separately (**D**).

**Operator users:** see §16.

Do not collapse CRM **account** (company commercial record) with CRM **contact** (named person).

---

## 11. Programme findings

Programme: title, day count, start/end dates, **`paxCount`**, destinations — **B**.  
`internalNotes` and `clientNotes` — **C**.  
Programme items: title, description, supplier labels, notes — **C** for free text; supplier company labels **B**.  
Programme version `snapshot` holds title/dayCount/itemCount/destinations — **B** as currently typed.

No named-delegate list on the programme header. Named guests live on **ops manifests** (§13), not on programme pax counts.

---

## 12. Supplier / rate findings

Supplier **company** fields (legal/trading name, category, country/city, company telephone/email, address) — **B**, with company email/phone **C** if used for a named person.

Supplier **contacts** (`SupContact`): required given/family name; optional email, telephone, **whatsapp**, notes — **D**. UI and CSV import persist these.

Rates / rate identity (amounts, currency, season, occupancy, meal plan, validity) — **B** commercial data, not personal data merely because commercially sensitive. Rate `notes` / blackout/supplement free text — **C**.

---

## 13. Booking findings

Booking header: booking code, proposal/RFP/programme/opportunity/organisation links, title, status, `paxCount` — **B**. Handover task labels include “guest manifest prepared” as a **process** checklist, not a name field.

**Guest SoR for bookings** is `ops_manifest_entries`: required `guestName`; optional email, dietary, mobility, rooming, flight reference — **D**. Vouchers copy `guestName` (dietary may be copied into voucher notes). Operations UI creates and displays these fields.

Field-sync policy **denies** `manifest_entry` as an offline cached entity (mitigation). Online persistence remains **D**.

---

## 14. Document / attachment findings

DocumentStorage stores opaque bytes plus metadata (filename, mime, checksum, storageRef). Allowed MIME: PDF, DOCX, XLSX, CSV, JPEG, PNG. Max 10 MiB. Kinds: `rfp`, `contract`, `rate_sheet`, `other`. Upload and retrieval APIs exist. Dev/Test adapter is local filesystem; production-like config forbids local-fs (object store unselected).

**Classification: C.**

```text
EOS permits documents that could contain personal data.
```

This audit does **not** find repository evidence that EOS currently stores personal identity documents. The statement “EOS currently stores personal data in uploaded documents” is **not** made.

Photographs: JPEG/PNG are allowed MIME types. There is **no** dedicated “identity photo” model. Capability to store images of people is **C**, not confirmed identity-photo SoR.

---

## 15. Email / WhatsApp findings

**Inbound email ingest** (IMAP, Gmail, Outlook, mailbox parse/store of bodies/headers/attachments): **A** — no connector implementation located.

**Outbound notification email:** `notif_email_outbox` stores `recipient_email`, `subject`, `body_text` — **D** for addresses, **C** for bodies. Allowlists/suppressions store emails. This is send-side, not mailbox ingest.

**WhatsApp message / attachment ingest:** **A** — no message-archive connector located.

**WhatsApp identifier on supplier contacts:** **D** — optional `whatsapp` field and import column.

**WhatsApp as commercial channel label** (e.g. RFP channel): **B** — not message content.

---

## 16. Authentication findings

`principals`: optional `email`, required `display_name`, actor type, status, roles/permissions (kernel `Principal`). `principal_credentials.password_hash` is a secret, not a traveller record. Web `sessionStorage` holds token and login email.

**Distinction required by this increment:**

1. **Technical identity** to operate the software (principal email/display name) — documented as **D** for system-user identity, **not** equivalent to traveller/client CRM.  
2. **Commercial customer / traveller / employee records** — CRM contacts, guest manifests, HR employees are **separate D** surfaces.

No formal corporate IdP is selected (prior governance: OA-07 / ADR-0013 **OPEN**). Local-password authentication is not Production-authorized.

Actual principal email values from seeds/tests are **not** reproduced here.

---

## 17. Logging / audit findings

- Default `onResponse` log: method/path/status/correlation id — **A** for body capture.  
- Redaction set: passwords/tokens/secrets. **Email, name, phone are not redacted** — **C** if a caller logs those fields.  
- `onError` logs `error.message` — **C** if messages embed submitted values.  
- CRM events: forbidden PII keys; entity references — minimisation, while CRM tables remain **D**.  
- Outbox / DLQ / internal-audit bodies and notification recipient emails — **C** / **D** as applicable.  
- Field-sync `server_payload` / `client_payload` JSONB — **C**.  
- Production logs were **not** accessed.

---

## 18. Free-text / JSON / snapshot findings

Mechanisms that can hold **arbitrary** user text or JSON, even when not named as person fields:

| Mechanism | Classification |
| --- | --- |
| CRM notes, relationship notes, RFP notes/requirementsText, programme internal/client notes, item description/notes | **C** |
| Ops briefs, field-task descriptions, assignment notes | **C** |
| AI draft `body`, knowledge/crisis/internal-audit bodies | **C** |
| Organisation `address` JSONB; contact `communication_preferences` JSONB | **C** |
| F2 commercial-facts `payload JSONB` | **C** (capability) / intended **B** |
| Proposal `snapshot` JSONB; programme version snapshot; heatmap JSONB | **C** if unconstrained; currently commercial-shaped **B** where typed |
| Import `csv_content` | **C** / contact import **D** |
| Document bytes | **C** |

A user can type a person’s name, email, or health note into these fields. That is **capability**, not evidence of current live personal data.

---

## 19. Fixtures / test-data findings

`apps/api/src/dev/seed-demo-data.ts` seeds CRM contact CSV rows and guest-manifest entries with **synthetic** given/family names, example-domain emails, and international-format telephone numbers. Ops/CRM tests use guest names, dietary strings, and example.com contact emails. Login tests use `*.sedmc.local` / `*.local` operator emails.

These are **demonstrably synthetic**. They still prove **D** capability: the pipeline persists that class of data.

No passport or national-ID fixture columns were found. Values are **not** reproduced in this report.

---

## 20. Personal-data capability classification

| Surface | Capability | Classification | Evidence | Current personal data observed? | Remediation required? |
| --- | --- | --- | --- | --- | --- |
| CRM contacts | Create/persist/display named persons + email/phone | **D** | `crm_contacts`; `/v1/crm/contacts`; CRM UI; CSV import | Synthetic seed/test only | No remediation performed |
| CRM org email/phone/address | Could hold personal values | **C** | `004_c1_crm.sql` | Not evidenced as live persons | No remediation performed |
| CRM accounts | Company commercial account | **B** | account name / org link | N/A as person row | No remediation performed |
| HR employees | Employee name/email/leave | **D** | `hr_employees`; HR UI | Synthetic/test | No remediation performed |
| Supplier company / rates | Commercial | **B** | legalName, amounts, currency | N/A | No remediation performed |
| Supplier named contacts + whatsapp | Named person + comms IDs | **D** | `SupContact`; suppliers UI/import | Synthetic/test | No remediation performed |
| Opportunity / RFP core + paxCount | Commercial + counts | **B** | `opportunity.ts`, `rfp.ts` | N/A | No remediation performed |
| Opportunity/RFP/programme notes | Free text | **C** | notes / requirementsText / clientNotes | Not inspected as live PD | No remediation performed |
| Programme paxCount / destinations | Counts / places | **B** | `programme.ts` | N/A | No remediation performed |
| Booking header | Commercial | **B** | `booking.ts` | N/A | No remediation performed |
| Guest manifest / vouchers | Traveller names, dietary, email | **D** | `ops_manifest_entries`; ops UI | Synthetic seed/test | No remediation performed |
| DocumentStorage | Files that could contain PD | **C** | MIME allowlist; upload/get | **No** identity-document contents evidenced | No remediation performed |
| Inbound email ingest | None found | **A** | Repository search | N/A | No remediation performed |
| Outbound notification email | Recipient addresses | **D** | `notif_email_outbox` | Synthetic operator/test emails | No remediation performed |
| WhatsApp message ingest | None found | **A** | Repository search | N/A | No remediation performed |
| Operator principals | Technical user identity | **D** (auth) | `principals.email` | Synthetic local emails | No remediation performed |
| Default HTTP logs | No body; PII keys not redacted | **A** / **C** | `observability.ts` | N/A | No remediation performed |
| JSON/snapshots/free text | Arbitrary content possible | **C** | notes, JSONB payloads | Not evidenced as live PD | No remediation performed |
| Passport/DoB/national ID columns | Not modelled | **A** | Schema search | None | No remediation performed |

---

## 21. Alignment with H-131

```text
NOT ALIGNED — CONFIRMED PERSONAL-DATA CAPABILITIES IDENTIFIED
```

H-131 intends EOS **not** to be a system of record for personal data. The current implementation **explicitly models** CRM contacts, HR employees, supplier named contacts (including a WhatsApp identifier), and guest manifests (including dietary/mobility). Those are ordinary persistable records, not accidental fixtures.

**ALIGNED** is not chosen merely because fixtures are synthetic.

This is an **EOS architecture-capability** finding. It does **not** mean:

- SEDMC is exempt from PDPC registration;
- SEDMC does not need PDPC registration;
- EOS compliance (or non-alignment) equals SEDMC PDPC compliance;
- designing EOS to avoid personal data eliminates SEDMC’s wider privacy obligations.

---

## 22. Gaps and ambiguities

1. Organisation switchboard email vs named-person mailbox — **C**, not forced to **D**.  
2. Whether a work email of a named contact is “personal data” in law is **not** decided here. Capability: givenName + email identifies a natural person → **D**.  
3. DocumentStorage **could** hold identity documents; **no** evidence it currently does.  
4. Event forbidden keys do not remove CRM/HR/ops tables.  
5. F2 `payload JSONB` is commercially intended; structurally unconstrained → residual **C**.  
6. Unopened GRC/ITSM/finance screens may add more **C** free-text (**E** residual). Search found no further traveller/passport models.  
7. Live Dev/Test database contents were **not** dumped; seed/code paths suffice for capability conclusions.  
8. A related H-132 surface audit file exists in the worktree; it was **not** used as a substitute for this numbered H-133 record and was **not** modified.

---

## 23. Governance disposition

**Assessment-only. No remediation in this increment.**

1. H-131 remains the **intended** boundary.  
2. Current EOS code is **not aligned** with that boundary.  
3. Do not treat CRM contacts, HR employees, supplier named contacts, or guest manifests as H-131-compliant “business facts.”  
4. **Retaining** those capabilities as authorized personal-data processing requires a **new** governance/privacy review (H-131 §13) before implementation of that authorization.  
5. **Removing or disabling** them is a **separate** change-controlled increment — not authorized here.  
6. EI-01 TIN identity (H-132 TIN record) and PDPC registration remain **independent** gates.  
7. This audit is **not** PDPC exemption evidence.

---

## 24. Future change-control requirements

Before implementation of **either** remediation **or** authorized personal-data processing, a new governed increment is required for any of:

- retaining CRM contact / HR employee / supplier contact / guest-manifest models as an approved privacy architecture;
- removing or disabling those models;
- email or WhatsApp **ingestion**;
- treating DocumentStorage as a store for identity documents;
- adding passport, national ID, date of birth, health, biometric, or individual payment fields;
- introducing pseudonymous person identifiers as a substitute privacy architecture;
- asserting PDPC exemption from EOS alignment or from this audit.

Until that review, H-131 remains the intended boundary, and this audit records that the **current implementation is not aligned** with it.

---

## 25. Explicit statement that this was assessment-only

```text
This increment is assessment-only.
No application code, schema, migration, infrastructure, validation,
masking, deletion logic, field removal, API/UI/fixture/seed change,
or privacy control was added or changed.
No finding was remediated automatically.
No PDPC exemption is asserted.
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration remains OPEN.
```
