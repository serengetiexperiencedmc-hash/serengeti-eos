# H-133 — Personal-Data Capability Disposition and Remediation Specification

> **GOVERNANCE / ARCHITECTURE / REMEDIATION SPECIFICATION ONLY**  
> Specifies the target architecture and a **future** controlled remediation sequence.  
> **NO IMPLEMENTATION IS AUTHORIZED IN THIS STEP.**  
> **NOT** code, schema, migration, API, UI, fixture, seed, or infrastructure change.  
> **NOT** deletion of Dev/Test or Production data. **NOT** PDPC registration or exemption. **NOT** legal advice.  
> **NOT** Production authorization.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 513.  
**Commit / push:** **NONE**.

**Sources of truth (not modified):**

- `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md`
- `docs/governance/h-132-eos-personal-data-surface-audit.md`

**Not modified:** `h-132-tin-identity-reconciliation-and-evidence-gate.md`; both H-131 files; H-125/H-126/H-128/H-129/H-130; `h-133-eos-personal-data-surface-audit.md` (prior numbered audit artefact; not rewritten here).

This file is the H-133 **disposition / specification**. It does **not** replace the TIN H-132 record or the completed personal-data surface audit (H-132 filename despite numbering collision).

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration status = OPEN / NOT COMPLETED
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

---

## 1. Purpose

Following the completed personal-data surface audit, record **exactly** what must change, what can remain, what dependencies exist, and what a **safe future implementation sequence** would be — **without performing that work now**.

Owner business direction (H-131):

```text
EOS SHALL NOT BE A SYSTEM OF RECORD FOR PERSONAL DATA.
```

The audit found **confirmed** personal-data capabilities. This specification does **not** immediately remove them.

```text
CURRENT IMPLEMENTATION NOT ALIGNED WITH THE OWNER-ESTABLISHED EOS PERSONAL-DATA BOUNDARY;
CONTROLLED REMEDIATION SPECIFICATION REQUIRED.
```

---

## 2. Disposition vocabulary

Use **only**:

| Disposition | Meaning |
| --- | --- |
| `REMOVE` | Capability must leave EOS; personal-data workflow stays in external operational systems |
| `RETAIN WITH REDESIGN` | Surface may remain if redesigned so it no longer persists personal data |
| `RETAIN — TECHNICAL NECESSITY` | Minimum identity/security function required to operate the software |
| `UNKNOWN / OWNER DECISION REQUIRED` | Evidence does not establish a unique target without an Owner decision |

Do not use subjective severity scores. Do not implement any disposition in this increment.

---

## 3. Target business architecture

```text
EOS
  → business/commercial data only
     (organizations/accounts, opportunities, RFPs, programmes,
      destinations, hotels, suppliers-as-companies, commercial rates,
      proposals, dates, pax counts, budgets, currencies,
      commercial workflow status, operational status,
      approved commercial metrics)

External operational systems
  → personal-data workflows
     (traveller/guest names, client contact persons, supplier named
      individuals, employee records, dietary/mobility, WhatsApp/email
      content, identity documents)

Technical authentication
  → minimum operator identity required for secure access
     (not a traveller/client/employee dossier)

External communications
  → email / WhatsApp / other operational systems remain external
     unless separately approved

Document storage
  → only approved non-personal commercial documents, if retained
```

No vendor, hosting provider, IdP product, or cloud region is selected here.

---

## 4. Commercial workflow preservation

Intended commercial path (already present as commercial entities, not invented here):

```text
Opportunity
  → Account / Organization
  → Programme
  → RFP
  → Proposal / Commercial Facts
  → Rate Identity
  → commercial approval / operational handoff
```

**Kernel types (audit + type inspection):** opportunity, RFP, programme, proposal, costing, and booking headers key to **organization / account / RFP / programme / proposal identifiers**, **pax counts**, dates, destinations, amounts, and statuses. They do **not** require `crm_contacts`, HR employees, supplier named contacts, or guest-manifest rows as mandatory foreign keys on those commercial records.

**Desired result:**

```text
Commercial workflow remains operational without individual
traveller / client / supplier / employee personal records.
```

**What the evidence supports today:** the **core commercial objects** can exist without person rows. Contact counts on the CRM UI, CRM relationship rows from contacts to organisations, supplier-contact UI, guest-manifest/voucher UI, HR pages, contact CSV import, and tests/fixtures that create those rows are **dependent surfaces**, not proven business-rule requirements that commercial costing or proposal send **cannot** proceed without a named person.

**What is not invented:** this specification does **not** claim a hidden Owner rule that “every RFP needs a stored contact.” No such requirement is in H-131. If a later Owner decision asserts that EOS **must** store named contacts, that would be a **new** personal-data authorization under H-131 §13 — not the current target.

**Handoff caveat:** operations **guest manifest** is downstream of booking. Removing it from EOS does **not** remove the need for guest-level work **outside** EOS (Office / Excel / mail / WhatsApp / phone, already the commercial SoR in H-126). Booking header + paxCount + operational status can remain in EOS.

---

## 5. Capability dispositions (1–12)

Findings below are **only** those recorded in the H-132 surface audit. No new capabilities are invented.

### 5.1 CRM contacts — `REMOVE` (person SoR) with optional `RETAIN WITH REDESIGN` for non-personal channel flags

**Audit:** given/family name; email; telephone; mobile; API; CSV import; UI. Classification **D**.

| Item | Evidence |
| --- | --- |
| Schema | `crm_contacts` (`packages/db/migrations/004_c1_crm.sql`); relationships `from_contact_id` / `to_contact_id`; notes/activities keyed by contact entity |
| API | `POST/GET/PATCH /v1/crm/contacts`; archive; notes; relationships; activities; `POST /v1/crm/imports` entityType `contact` |
| UI | `/commercial/crm` Contacts tab (name/email display, search, import) |
| Import | Contact CSV columns givenName, familyName, email, telephone; `csv_content` on import batches |
| Search | CRM UI filters name/email; email uniqueness / duplicate signals |
| Reporting | No separate Production reporting product identified; CRM list/search is the in-app surface |

**Does commercial workflow require individual contact records?** Not established. Opportunity/RFP/programme/booking commercial keys are organisation/account based. H-131 preferred pattern is “client contact available externally,” not stored name/email.

**Target:** **REMOVE** persistence of named client contacts (and their emails/phones/mobiles) from EOS. If a commercial flag is still needed: **RETAIN WITH REDESIGN** as a non-personal reference only (e.g. “contact available externally” / channel class) **without** givenName, familyName, email, telephone, mobile.

**Not implemented now.**

---

### 5.2 HR employees — `REMOVE`

**Audit:** employee name, email, leave including `sick`. Classification **D**. UI collects given/family name.

**Does HR belong in EOS?** No specific commercial-workflow requirement is established in H-131 or the audit that EOS must be an HR system of record. Owner direction is that EOS must not store employee personal records.

**Target:** **REMOVE FROM EOS** (employee directory, leave including sick, HR UI/API), unless a later Owner increment **proves** a specific business requirement and completes H-131 §13 privacy review. No such proof is on record.

**Not implemented now.**

---

### 5.3 Supplier named contacts — `REMOVE` person records; `RETAIN WITH REDESIGN` company + external method

**Audit:** givenName, familyName, email, telephone, WhatsApp identifier; UI + CSV. Classification **D**. Supplier **company** and **rates** remain **B**.

**Target commercial model:** retain supplier/company entity + commercial rates. Do **not** retain the individual’s personal record. Prefer “external contact method/reference” without storing the named person’s email/phone/WhatsApp.

**Redesign boundary:** keep `SupSupplier` / rates / contracts (company-level). Remove or stop persisting `SupContact` personal fields (`givenName`, `familyName`, `email`, `telephone`, `whatsapp`) and the supplier-contact create UI/import columns. A later redesign **may** add a non-personal “reservations desk available externally” flag — only if separately specified. Do not invent that flag in code now.

**Not implemented now.**

---

### 5.4 Operations guest manifests / vouchers — `REMOVE` guest-level personal data from EOS

**Audit:** guestName, email, dietary, mobility; vouchers copy guestName (dietary may copy into notes). Classification **D**. Inconsistent with H-131.

**Target:** **REMOVE FROM EOS**. Guest-level information remains in the appropriate **external** operational system (already the operational SoR: Office / Excel / mail / WhatsApp / phone).

**Dependencies to remove or redesign in a later increment (do not execute now):**

| Class | Surfaces (from audit / known ops paths) |
| --- | --- |
| Schema | `ops_manifests`, `ops_manifest_entries` (`guest_name`, email, dietary, mobility, rooming, flight_reference) |
| APIs | Manifest create/add-entry; voucher issue paths that persist `guestName` |
| UI | `/commercial/operations/[bookingId]` guest name input and lists |
| Caches | Field-sync **denies** `manifest_entry` offline already; online SoR still holds guests |
| Documents / exports | Voucher artefacts that embed guestName/dietary |
| Notifications / reports | Any digest/export that includes guest fields (if present in a later implementation pass) |
| Tests / fixtures / seed | Ops tests and `seed-demo-data.ts` guest rows |
| Background jobs | None separately identified as a dedicated guest-ingest job; voucher/manifest writes are request-path |

Booking **header** (code, status, paxCount, programme/RFP links) is **B** and is **not** the same as the guest list. Target: keep booking commercial/operational status; drop named-guest SoR.

**Not implemented now.**

---

### 5.5 Operator principals — `RETAIN — TECHNICAL NECESSITY` (minimize; do not delete authentication)

**Audit:** `principals.email`, `display_name`; `sessionStorage` login email; password_hash on `principal_credentials`. Distinct from traveller/client CRM.

| Question | Assessment (no provider invented) |
| --- | --- |
| **A. Technically required** | Principal **id**, **tenant**, **actor type**, **status**, **roles/permissions** (authorization). A **login identifier** is required for the **current** local-password model; today that identifier is email. |
| **B. Convenience** | `display_name` as a human label; persisting email in `sessionStorage` in addition to the token (token is the session secret). |
| **C. Minimizable** | Avoid storing operator dossiers beyond authz; do not copy operator email into commercial records, events, or unredacted logs. Display name is not required for authorization. |
| **D. Future IdP** | A future corporate IdP **could** move email/display name to the identity provider and leave EOS with opaque subject ids. **No provider is selected** (Entra, Google Workspace, Okta, Auth0, and others are **not** chosen). ADR-0013 remains **OPEN**. |

**Target:** keep authentication. Minimize stored operator profile. Do **not** treat this as traveller/customer personal data. Do **not** configure an IdP in this increment.

---

### 5.6 Outbound notification recipient email — `UNKNOWN / OWNER DECISION REQUIRED` (with redesign constraint)

**Audit:** `notif_email_outbox.recipient_email` (and allowlist/suppression emails). Classification **D** for addresses; bodies **C**. Not inbound ingest.

**Constraint from H-131:** EOS should not be a store of personal email addresses as ordinary records. Notifications **may** use approved system/service identities, external communication systems, transient delivery, or non-personal organisational addresses — **none of those mechanisms is selected here**.

**Required architectural decision (future, Owner):** whether EOS retains **any** notification outbox with recipient addresses; if yes, whether recipients are limited to **non-personal organisational / system** addresses; if no, whether notification leaves EOS entirely.

Until that decision: do not implement a new mail product. Do not claim SES (or any provider) as the Production notifier.

---

### 5.7 Free-text — `RETAIN WITH REDESIGN`

**Audit:** CRM notes, RFP notes, ops briefs, AI-draft bodies, and other free-text — **C** (user can type a person’s name, email, or health note).

Unrestricted free-text **is** a personal-data **capability** even when not named as a person field.

**Target options (choose in a later governed increment; not implemented now):**

- **A.** retain unrestricted free text — **not compatible** with H-131 as an ordinary design;  
- **B.** restrict to structured business information;  
- **C.** apply controlled field semantics (counts, statuses, commercial notes without identity);  
- **D.** remove specifically personal-data-bearing note surfaces (e.g. contact-entity notes once contacts are removed).

**Specification stance:** **B + C** for remaining commercial notes; **D** for notes whose only purpose is a person record. Do **not** apply validation/masking in this increment.

---

### 5.8 Document storage — `RETAIN WITH REDESIGN`

**Audit:** generic DocumentStorage; PDF/DOCX/XLSX/CSV/JPEG/PNG; no content scanning. **C** capability. **No** evidence that identity documents are currently stored.

```text
Generic document capability could contain personal data.
EOS is not known from repository evidence to contain personal data in documents.
```

**Target (future):** not compatible with H-131 if uploads remain arbitrary. Later increment must choose among: remove arbitrary uploads; restrict to **approved non-personal commercial** documents (RFP/rate sheet/contract class already in metadata); move storage outside EOS; or require a controlled classification model **and** still forbid identity documents. **No** content-scanner product is selected here.

**Not implemented now.**

---

### 5.9 Imports — `REMOVE` person-row imports; `RETAIN WITH REDESIGN` company-only imports

**Audit:** CRM contact CSV and supplier contact CSV (including whatsapp) persist person fields; batches store `csv_content`. Organisation/supplier **company** import is **B** if limited to company fields.

| Aspect | From audit |
| --- | --- |
| Routes | `POST /v1/crm/imports`; supplier import paths |
| Accepted person fields | givenName, familyName, email, telephone; supplier whatsapp |
| Validation | Email/phone plausibility helpers exist — they **enable** person ingest, they do not prevent it |
| Persistence | Contact/supplier-contact rows + batch `csv_content` |
| Errors | Import row results; CSV remains on the batch |

**Target:** stop accepting/persisting person columns. Company-level import may remain if redesigned. Do not implement now.

---

### 5.10 DSR / privacy fields — `REMOVE` from EOS **as a personal-data register** (handle externally if needed)

**Audit:** `privacy_dsr_cases.subject_label`; consent `notes` — **C**. Registers are labelled Development/Test; not a live erasure/CMP platform.

If EOS is designed **not** to hold personal data, an in-EOS DSR casefile keyed by a data-subject label is **not** automatically required. DSR for SEDMC’s **wider** operations (email, WhatsApp, spreadsheets) remains **outside EOS** and is a separate PDPC/legal matter.

**Target:** do **not** assume EOS must run DSR. Remove or do not use subject-identifying labels/notes inside EOS; keep any RoPA-style **activity catalogue without natural-person identifiers** only if a later Owner decision wants an internal processing register. **OWNER DECISION REQUIRED** on whether a non-identifying processing-activity catalogue stays.

**Not implemented now.**

---

### 5.11 Logging — `RETAIN WITH REDESIGN`

**Audit:** request bodies **not** normally logged (**A** for default body capture). Names/emails/phones **not** in the redaction set (**C** if a caller logs those fields). Error messages could embed submitted values.

**Residual risk:** operator or contact payloads passed to `logger.*` or `error.message` could persist personal data in logs even after tables are removed, if APIs still accept those fields or if operator email is logged.

**Future logging architecture (specification only):** keep no-body default; extend redaction to email/name/phone/whatsapp/guestName and similar keys; forbid logging request bodies and CSV contents; treat correlation ids as the trace key. **Do not implement now.**

---

### 5.12 Field-ops cache — `RETAIN WITH REDESIGN` after guest data is removed

**Audit:** encrypted local cache of field **tasks** and **briefs**; `manifest_entry` **denied** offline; online manifests still **D**. Briefs are free-text **C**.

Once guest-level personal data is removed from EOS, the cache **should not** exist as a guest-manifest store (it already is not). Remaining cache of briefs still needs the free-text redesign (§5.7). Device id / salt in localStorage are technical — not traveller records.

**Not implemented now.**

---

## 6. Personal-data dependency matrix

| Capability | Current personal-data fields | Current dependencies | Intended disposition | Commercial workflow impact | Future remediation |
| --- | --- | --- | --- | --- | --- |
| CRM contacts | givenName, familyName, email, telephone, mobile | `crm_contacts`; `/v1/crm/contacts`; contact import; CRM UI; relationships; contact notes; duplicate email/phone; seed/tests | `REMOVE` (person SoR); optional `RETAIN WITH REDESIGN` non-personal channel flag | Core Opportunity→RFP→Proposal keys are org/account based; UI contact counts are not proven costing requirements | Phase 2–3: stop APIs/UI/import; later schema |
| CRM org email/phone/address | primaryEmail, primaryTelephone, address JSONB | Organisation schema/API | `RETAIN WITH REDESIGN` (org-only; no named person) | Low if kept as company switchboard without a person’s name | Constrain/document semantics; not a person table |
| HR employees | given/family name, email, sick leave | `hr_employees`; HR API/UI; leave | `REMOVE` | Not on Opportunity→Proposal path as established | Phase 2–3 remove domain |
| Supplier named contacts | givenName, familyName, email, telephone, whatsapp | `SupContact`; supplier UI; CSV import | `REMOVE` person record; `RETAIN WITH REDESIGN` company + external method | Rates/costing use supplier/rate ids, not contact persons, as established | Phase 2–3; keep company/rates |
| Guest manifests / vouchers | guestName, email, dietary, mobility | `ops_manifest_entries`; ops UI; voucher copy; seed/tests | `REMOVE` | Booking header/paxCount can remain; guest work stays external | Phase 2–3; field cache already denies offline guests |
| Operator principals | email, displayName, session email | `principals`; credentials; sessionStorage | `RETAIN — TECHNICAL NECESSITY` (minimize) | Required to sign in; not commercial person SoR | Minimize; IdP later without selecting a vendor now |
| Outbound notification email | recipient_email; body **C** | `notif_email_outbox`; allowlist/suppression | `UNKNOWN / OWNER DECISION REQUIRED` | Not required for costing/proposal objects themselves | Phase 5 after Owner decision |
| Free-text | notes, briefs, AI body, etc. | Many commercial/ops tables | `RETAIN WITH REDESIGN` | Needed for commercial notes if semantics exclude identity | Phase 4 |
| DocumentStorage | opaque bytes (PDF/DOCX/XLSX/CSV/JPEG/PNG) | upload/get APIs; RFP/supplier UI | `RETAIN WITH REDESIGN` | Commercial RFP/rate/contract files may remain if non-personal | Phase 4; no claim of current identity docs |
| Person CSV imports | contact/supplier-contact columns; csv_content | import routes/batches | `REMOVE` person imports; `RETAIN WITH REDESIGN` company import | Company import can remain | Phase 3 |
| DSR subject_label / consent notes | subject_label; notes | privacy/consent tables | `REMOVE` identifying fields; catalogue **OWNER DECISION REQUIRED** | Not on commercial send path | Phase 2 or externalize |
| Logging | unredacted email/name/phone if logged | `observability.ts` | `RETAIN WITH REDESIGN` | None if bodies stay unlogged | Phase 5 |
| Field-ops cache | briefs **C**; guests denied offline | localStorage encrypted cache | `RETAIN WITH REDESIGN` | Field tasks can remain without guest names | Phase 5 after manifests removed |

---

## 7. Data lifecycle (no deletion now)

| Capability | Dev/Test records exist? | Production data exists? | Later deletion/migration? | Capability vs data | External remainder |
| --- | --- | --- | --- | --- | --- |
| CRM contacts | **Yes** — synthetic seed/tests (audit) | **Not established.** Production is not authorized. Do not claim Production data exists or does not exist | Later Dev/Test cleanup **after** schema/API change; Production N/A until authorized | Schema/API/UI **and** synthetic rows | Client contacts stay in operational tools |
| HR | Seed/UI capability; tests as present | Not established | Later removal | Schema/API/UI | HR stays outside EOS |
| Supplier contacts | Tests/UI/import | Not established | Later removal of person rows | Schema/API/UI | Named supplier contacts stay external |
| Guest manifests | Synthetic seed/tests | Not established | Later removal | Schema/API/UI | Guest lists stay external |
| Operator principals | Dev/Test bootstrap users (synthetic local emails) | Not established | **Do not delete** auth; minimize | Technical identity | Future IdP optional, unselected |
| Notification emails | Outbox capability / tests | Not established | Depends on Owner decision | Schema | Mail remains external unless approved |
| Documents | Upload capability; no identity-doc contents evidenced | Not established | Restrict class later; no mass “PD file” deletion claimed | Capability | Identity docs must not enter EOS |
| Imports csv_content | Test/seed batches | Not established | Stop storing person CSVs later | Capability + synthetic | Imports of persons stay out |

**This increment deletes no records.**

---

## 8. Proposed future remediation sequence

**Do not perform any phase now.**

| Phase | Intent |
| --- | --- |
| **1** | Governance/contract baseline (H-131 + this specification). Owner accepts dispositions. |
| **2** | Remove or redesign personal-data **domain models** (contacts, HR, supplier persons, guest entries) in a dedicated implementation grant. |
| **3** | Remove dependent APIs, UI, person CSV imports, relationship/note attach-to-contact paths, tests/fixtures that require person rows. |
| **4** | Restrict document upload and free-text semantics; drop contact-only note surfaces. |
| **5** | Harden logs, notification decision, caches. |
| **6** | Dev/Test validation against H-131 (capability re-audit). |
| **7** | UAT regression (H-119 remains valid until a new UAT; this spec does not reopen UAT). |
| **8** | Production readiness **reassessment** — not authorization. |

Each phase requires its own implementation authorization. This document is **not** that authorization.

---

## 9. PDPC, TIN, Production

```text
PDPC registration remains OPEN.
Removing or specifying removal of personal-data capability from EOS
does not eliminate SEDMC's wider PDPC obligations.
This document addresses EOS architecture only.
No PDPC exemption is asserted.

EI-01 remains OPEN / REQUIRES OWNER EVIDENCE REVIEW.
TIN evidence is not modified.

PRODUCTION = NOT AUTHORIZED / NOT READY
```

This specification is **not** Production readiness.

---

## 10. Governance conclusion

```text
CURRENT IMPLEMENTATION NOT ALIGNED WITH THE OWNER-ESTABLISHED EOS PERSONAL-DATA BOUNDARY;
CONTROLLED REMEDIATION SPECIFICATION REQUIRED.
```

The implementation is **not** aligned. It is **not** “partially aligned” as a substitute conclusion: confirmed person SoR (CRM contacts, HR, supplier named contacts, guest manifests) sits inside EOS contrary to H-131. Commercial objects (orgs, opportunities, RFPs, programmes, rates, pax counts) **can** remain.

**Remediation is specified, not performed.**

---

## 11. Change-control

Implementation of Phase 2 or later requires a **new** Owner/governance grant. Until then: no field removal, no API change, no migration, no data deletion, no IdP configuration, no Production activity.

H-131 §13 still governs any proposal to **re-introduce** personal-data collection.

---

## 12. Assessment / specification only

```text
No application code, schema, migration, API, UI, fixture, seed,
infrastructure, authentication, or Production change was made.
No personal-data records were deleted.
No certificate was copied.
No full TIN was added.
No PDPC filing was made.
No commit. No push.
```
