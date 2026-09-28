# H-134 — Personal-Data Capability Disposition and Remediation Specification (Definitive)

> **GOVERNANCE / ARCHITECTURE SPECIFICATION ONLY**  
> Definitive future remediation specification to align EOS with the Owner privacy-by-design boundary.  
> **NO IMPLEMENTATION IS AUTHORIZED IN THIS STEP.**  
> **NOT** code, schema, migration, API, UI, fixture, seed, infrastructure, authentication, or Production change.  
> **NOT** data deletion. **NOT** PDPC registration or exemption. **NOT** legal advice.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 514.  
**Commit / push:** **NONE**.

**Sources of truth (not modified):**

- `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md`
- `docs/governance/h-132-eos-personal-data-surface-audit.md`
- `docs/governance/h-133-eos-personal-data-surface-audit.md`

**Not modified:** TIN H-132; H-131 TIN file; H-125/H-126/H-128/H-129/H-130; `h-133-personal-data-capability-disposition-and-remediation-specification.md` (prior specification artefact; not rewritten). Numbering collisions among H-132/H-133 files are **left as-is**.

This increment is **H-134**. None of Phases 1–11 below is executed here.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration status = OPEN / NOT COMPLETED
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

---

## 1. Purpose

Determine, from completed audits and the H-131 boundary:

1. What must be **removed**.  
2. What must be **redesigned**.  
3. What **technical identity** must remain.  
4. What **commercial functionality** must be preserved.  
5. What **dependencies** must be addressed **before** implementation.  
6. What the **future implementation sequence** must be.  
7. What must **not** be changed yet.

Owner boundary:

```text
EOS shall not be a system of record for personal data.
```

```text
The current EOS implementation is not aligned with the Owner-established
personal-data boundary. Controlled remediation is required before the EOS
implementation can be represented as conforming to that boundary.
```

Do **not** claim Production readiness or regulatory compliance.

---

## 2. Disposition vocabulary

Use **only**:

| Disposition | Meaning |
| --- | --- |
| `REMOVE` | Capability leaves EOS; personal-data work stays in external operational systems |
| `REMOVE AND REPLACE WITH BUSINESS ENTITY DATA` | Person row is removed; company/account/channel **without** a natural-person record may remain |
| `RETAIN WITH PRIVACY REDESIGN` | Surface remains only after it no longer persists personal data |
| `RETAIN AS MINIMAL TECHNICAL IDENTITY` | Operator authentication/authorization/audit identity only |
| `RETAIN WITH CONTROLLED NON-PERSONAL CONTENT` | Structured commercial content; not arbitrary personal narrative |
| `OWNER DECISION REQUIRED` | Evidence does not uniquely determine the target |

Do not use numerical severity scores. Do not implement any disposition now.

---

## 3. Target architecture

```text
EOS
  → business/commercial system of record
     (organization/account, opportunity, programme, RFP, destination,
      hotel, supplier-as-company, commercial rates, proposals,
      pax counts, dates, budgets, currencies, workflow and operational
      status, approved commercial metrics)

External operational systems
  → personal-data system of record where required
     (travellers, guests, named client contacts, named supplier people,
      employees, dietary/mobility, email/WhatsApp content, identity documents)

Technical authentication
  → minimum operator identity necessary for secure access
     (not a traveller/client/employee dossier; no IdP vendor selected)

Communications
  → external email / WhatsApp / other systems unless separately approved

Documents
  → only approved non-personal commercial documents if retained
```

No infrastructure vendor, cloud region, or identity product is selected.

---

## 4. Commercial workflow preservation (mandatory)

```text
Opportunity
  → Account
  → Programme
  → RFP
  → Proposal / Commercial Facts
  → Rate Identity
  → Commercial approval / operational handoff
```

**Repository evidence (audits + kernel types):** opportunity, account, programme, RFP, proposal, costing, rate identity, and booking **headers** key to **organisation/account/RFP/programme/proposal identifiers**, **pax counts**, dates, destinations, amounts, and statuses. They do **not** require `crm_contacts`, HR employees, supplier named contacts, or guest-manifest rows as mandatory foreign keys on those commercial records.

| Personal-data domain | Role vs commercial path |
| --- | --- |
| CRM contacts | **Ancillary convenience** (CRM list/search/import). Not established as required to cost or send a proposal |
| HR employees | **Unrelated** to Opportunity→Proposal as established |
| Supplier named contacts | **Ancillary** to supplier **company** + rates (costing uses supplier/rate ids) |
| Guest manifests | **Downstream operations** after booking; **not** required for commercial send. Guest work remains **external** |
| Operator principals | **Technical infrastructure** (sign-in / authz / audit) |

**Target:** core commercial workflow **without** traveller records, guest records, individual client contacts, individual supplier contacts, or HR employee records.

**Workflow preservation: YES** — on the evidence above. If a later Owner rule asserts that EOS **must** store named contacts, that is a **new** H-131 §13 authorization, not a current requirement.

Handoff: booking **status** and **paxCount** may remain; **named guests** do not remain in EOS.

---

## 5. Capability dispositions A–L

Findings are **only** those in the H-131/H-132/H-133 audits. No capabilities invented.

### A. CRM contacts — `REMOVE`

**Confirmed:** name, email, telephone, mobile; schema; API; CSV import; UI.

**Required for intended commercial workflow?** **No** — not demonstrated. H-131 preferred pattern is “client contact available externally,” not a stored person.

**If a non-personal flag is later needed:** that would be `REMOVE AND REPLACE WITH BUSINESS ENTITY DATA` (channel/reference without givenName/familyName/email/phone/mobile). **Do not invent that implementation now.** Person SoR itself is **REMOVE**.

**Dependencies (map only; do not change):**

| Layer | Surfaces |
| --- | --- |
| Schema / model | `crm_contacts`; `crm_relationships.from_contact_id` / `to_contact_id`; notes/activities with `entity_type` contact |
| Migration | `packages/db/migrations/004_c1_crm.sql` and later C1 contact indexes/hardening |
| API | `POST/GET/PATCH /v1/crm/contacts`; archive; notes; relationships; activities; `POST /v1/crm/imports` `contact` |
| UI | `/commercial/crm` Contacts tab; search on name/email; import entry |
| Imports | Contact CSV columns; batch `csv_content` |
| Events | `crm.contact.*.v1` (payloads already forbid embedding email/phone; **tables still persist contacts**) |
| Search | Email uniqueness / duplicate phone/email/name signals |
| Tests / fixtures | CRM contact tests; `seed-demo-data.ts` contact CSV |
| Reports / exports | In-app contact list; no separate Production report product identified |

**Not implemented.**

---

### B. HR employees — `REMOVE`

**Confirmed:** employee names, email, leave including sick.

EOS is a **commercial** operating system, not an HR personal-data system. No documented commercial-path requirement that EOS hold employees.

**Dependencies (map only):** `hr_employees` (`081_i10_hr_core.sql`); leave tables; `apps/api/src/hr/`; `/commercial/hr` UI; tests.

**Not implemented.**

---

### C. Supplier individual contacts — `REMOVE AND REPLACE WITH BUSINESS ENTITY DATA`

**Distinguish:** supplier/company entity (**retain**) vs individual contact (**remove** person record).

**Confirmed:** givenName, familyName, email, telephone, WhatsApp identifier.

**Can commercial supplier workflows operate without the person row?** **Yes**, as established: rates/costing use supplier and rate identifiers. Replacement, if any, is a **non-personal** operational channel/reference — **not invented here**.

**Dependencies (map only):** `SupContact` / C4 supplier contact schema; `/v1/suppliers/:id/contacts`; suppliers UI form; supplier CSV `whatsapp`/name/email/telephone columns; tests (`pg9-supplier-contact-rate.test.ts` and related).

**Retain:** supplier legal/trading name, category, location as **company**, commercial rates, contracts (company-level).

**Not implemented.**

---

### D. Guest manifests / vouchers — `REMOVE`

**Confirmed:** guest name, email, dietary, mobility. Direct conflict with H-131.

Guest-level information remains in **external** operational systems (Office / Excel / mail / WhatsApp / phone — existing commercial SoR).

**Dependencies (map only):**

| Layer | Surfaces |
| --- | --- |
| Schema | `ops_manifests`, `ops_manifest_entries` |
| API | Manifest add-entry; voucher issue copying `guestName` / dietary notes |
| UI | `/commercial/operations/[bookingId]` |
| Cache | Field-sync **denies** `manifest_entry` offline; **online** SoR still holds guests |
| Documents | Voucher content embedding guestName |
| Tests / fixtures / seed | Ops tests; `seed-demo-data.ts` guest rows |
| Notifications / reports / jobs | No dedicated guest-ingest job identified; request-path writes |

Booking **header** (code, status, paxCount) is **not** the guest list — **retain** as commercial/operational status.

**Not implemented.**

---

### E. Operator principals — `RETAIN AS MINIMAL TECHNICAL IDENTITY`

**Confirmed:** login email, display name, sessionStorage email. **Not** equivalent to CRM/traveller/HR.

**Minimum required:**

| Need | Minimum |
| --- | --- |
| Authentication | Stable principal **id**; a login identifier (today: email in local-password model) |
| Authorization | Tenant, actor type, status, roles/permissions |
| Audit attribution | Principal **id** on mutating actions |
| Security / support | Ability to suspend/deprovision; correlation of actor id — not a full HR profile |

**Convenience (minimize later):** display name; duplicating email in sessionStorage when a token already exists.

**Do not** select Entra, Google Workspace, Okta, Auth0, or any other IdP. ADR-0013 remains **OPEN**.

**Not implemented** (no auth change).

---

### F. Outbound notification recipient email — `REMOVE OR REDESIGN` → recorded as `OWNER DECISION REQUIRED` with constraint `RETAIN WITH PRIVACY REDESIGN` **if** any outbox remains

**Confirmed:** `notif_email_outbox.recipient_email`. Individual recipient addresses are **not** required for costing/proposal objects.

H-131 allows organisational/service addresses, transient delivery, or external communications — **none selected**.

**Disposition:** **OWNER DECISION REQUIRED** on whether EOS keeps any notification outbox. If it does, recipients must be **non-personal organisational/system** addresses (`RETAIN WITH PRIVACY REDESIGN`). If it does not, **REMOVE** recipient persistence and keep mail **external**.

Do **not** invent a mail product.

---

### G. Free-text / JSON / JSONB / snapshots — `RETAIN WITH CONTROLLED NON-PERSONAL CONTENT` (and redesign/remove person-only notes)

| Kind (from audits) | Examples | Future (not now) |
| --- | --- | --- |
| 1. Structured commercial data | paxCount, amounts, currencies, stage, destinations, rate identity | **Retain** as business fields |
| 2. Bounded business narrative | programme/RFP commercial notes **if** limited to non-identity facts | `RETAIN WITH CONTROLLED NON-PERSONAL CONTENT` |
| 3. Arbitrary user-provided content | CRM notes, ops briefs, AI draft bodies, unconstrained JSONB, snapshots that can hold extra keys | Redesign into structured fields, prohibit personal-data entry, or **remove** person-entity notes |

Unrestricted free-text **reintroduces** personal-data capability after contact/guest columns are gone. Contact-entity notes go with **REMOVE** of contacts.

**Do not implement controls now.**

---

### H. Document storage — `RETAIN WITH PRIVACY REDESIGN`

**Confirmed:** generic upload/store/retrieve (PDF, DOCX, XLSX, CSV, JPEG, PNG). **No** evidence that identity documents are currently stored. **Do not claim that they are.** Generic uploads **can** contain personal data.

**Future choice (Owner/implementation grant; no vendor):** remove arbitrary upload; restrict to **approved non-personal commercial** documents (RFP / rate sheet / contract kinds already in metadata); move storage outside EOS; and/or require classification **and** still forbid identity documents.

**This specification does not pick a vendor or implement a filter.**

---

### I. CSV import — `REMOVE` person-row imports; company import `RETAIN WITH PRIVACY REDESIGN`

Person columns can enter EOS **even if UI create forms are removed**, via CRM contact import and supplier contact import (including `whatsapp`). Batches store `csv_content`.

**Map (do not change):** import routes; headers givenName/familyName/email/telephone/whatsapp; validation (plausibility checks **enable** ingest); persistence of rows + CSV; row errors; import events; seed/tests.

Organisation/supplier **company** CSV may remain if person columns are not accepted.

---

### J. DSR / consent — `REMOVE` (or move outside EOS)

**Confirmed:** `subject_label`; consent notes. If EOS does not retain personal data, an in-EOS DSR casefile identifying a data subject is **not** required by repository evidence. Wider SEDMC DSR remains **outside EOS** (separate PDPC/legal question).

A non-identifying processing-activity **catalogue** would be `OWNER DECISION REQUIRED`. Identifying labels/notes: **REMOVE**.

**Not implemented.**

---

### K. Logging — `RETAIN WITH PRIVACY REDESIGN`

**Confirmed:** bodies not normally logged; passwords/tokens redacted; names/emails/phones **not** generally redacted when logged.

**Future:** keep no-body default; redact email/name/phone/whatsapp/guestName and similar; do not log CSV or document bytes; trace by correlation/principal **id**.

**Not implemented.**

---

### L. Field-ops cache — `RETAIN WITH PRIVACY REDESIGN`

**Confirmed:** encrypted cache of field **tasks** and **briefs**; guest manifests **denied** offline; online guests still in EOS; briefs are free-text.

After guest-level data is **REMOVE**d, the cache is **not** a guest SoR (already denied offline). It remains useful for **field tasks** if briefs follow controlled non-personal content. Device id/salt are technical, not traveller records.

**Not implemented.**

---

## 6. Disposition matrix

| Capability | Personal data | Current implementation | Commercial purpose | Target disposition | Dependencies | Implementation risk | Future action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CRM contacts | Name, email, telephone, mobile | Schema, API, CSV, UI, events, seed | Ancillary CRM | `REMOVE` | §5.A | Tests/UI/import/relationships break until replaced or dropped | Phases 2–5, 8 |
| Org switchboard email/phone | Possible person mailbox | Org fields | Company reachability | `RETAIN WITH PRIVACY REDESIGN` | Org API | Semantics not constrained today | Phase 2/6 |
| HR employees | Name, email, sick leave | HR schema/API/UI | None established on commercial path | `REMOVE` | §5.B | HR pages/tests | Phases 2–4, 8 |
| Supplier company / rates | Company + commercial | Supplier/rate models | Required commercial | `REMOVE AND REPLACE WITH BUSINESS ENTITY DATA` applies to **persons only**; **retain company/rates** | Rate identity, costing | Must not delete company/rates | Phase 2 keep company |
| Supplier named contacts | Name, email, phone, WhatsApp | SupContact API/UI/CSV | Ancillary | `REMOVE AND REPLACE WITH BUSINESS ENTITY DATA` | §5.C | Supplier contact UI/tests | Phases 2–5, 8 |
| Guest manifests / named vouchers | Guest name, email, dietary, mobility | Ops schema/API/UI/seed | Downstream ops, not commercial send | `REMOVE` | §5.D | Ops UI, vouchers, tests | Phases 2–4, 7–8 |
| Booking header / paxCount | Counts/status | Booking type | Commercial/ops status | `RETAIN WITH CONTROLLED NON-PERSONAL CONTENT` | Booking APIs | Low if guests split off | Keep |
| Operator principals | Login email, display name | `principals`, sessionStorage | Authn/authz/audit | `RETAIN AS MINIMAL TECHNICAL IDENTITY` | Login, RBAC | Do not delete auth | Minimize later; no IdP now |
| Notification recipient email | recipient_email | Outbox | Not required for proposal objects | `OWNER DECISION REQUIRED` | Outbox, allowlist | Mail product unselected | Phase 7 after decision |
| Free-text / JSONB / snapshots | Arbitrary content possible | Notes, briefs, AI, facts JSONB | Commercial narrative vs dump | `RETAIN WITH CONTROLLED NON-PERSONAL CONTENT` | Many tables | Re-introduction of PD | Phase 6 |
| DocumentStorage | File bytes could hold PD | Upload/get; MIME allowlist | Commercial RFP/contract/rates | `RETAIN WITH PRIVACY REDESIGN` | Document APIs/UI | No identity docs evidenced | Phase 6 |
| Person CSV import | Contact columns + csv_content | CRM/supplier import | Bypass UI | `REMOVE` person imports | Import batches | Residual ingest path | Phase 5 |
| DSR subject_label / consent notes | Subject identifiers | Privacy/consent tables | Not required if EOS holds no PD | `REMOVE` | Privacy tables | Catalogue optional | Phase 2 |
| Logging | Unredacted name/email/phone if logged | observability.ts | Ops/debug | `RETAIN WITH PRIVACY REDESIGN` | Logger | Leak after table removal | Phase 7 |
| Field-ops cache | Briefs; guests denied offline | localStorage cache | Field tasks | `RETAIN WITH PRIVACY REDESIGN` | field-sync | After guest REMOVE | Phase 7 |

---

## 7. Dependency map (REMOVE / REDESIGN only — no changes)

Every row is **map-only**.

| Capability | Schema/model | Migration | API | UI | Imports | Exports | Services | Events | Notifications | Documents | Cache | Tests | Fixtures | Reports |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM contacts | crm_contacts, relationships, notes | 004_c1_crm + C1 follow-ons | /v1/crm/contacts, imports | CRM contacts tab | Contact CSV | List/search | crm/contact.ts | crm.contact.* | — | — | — | c1.contacts* | seed contact CSV | In-app list |
| HR | hr_employees, leave | 081_i10_hr_core | HR routes | /commercial/hr | — | — | hr.ts | — | — | — | — | HR tests | as present | HR UI |
| Supplier persons | SupContact | 014_c4_supplier | /contacts | suppliers page | supplier CSV person cols | — | supplier/contacts.ts | — | — | — | — | pg9-supplier-contact* | import tests | — |
| Guest manifests | ops_manifest_entries | 023_o2_ops_manifest | manifest/voucher | operations/[bookingId] | — | voucher text | ops/manifests.ts, vouchers.ts | — | — | voucher content | field-sync denies offline guests | o1-ops, o4-vouchers | seed guests | ops UI |
| Person imports | import batches csv_content | C1/C4 import migrations | import POSTs | CRM import UI | **this row** | — | crm/import, supplier-import | import events | — | — | — | merge-import tests | seed | — |
| Free-text/docs | notes, briefs, documents | CD docs + notes | upload, notes | RFP upload, notes UIs | CSV as file | download | commercial-documents | — | — | DocumentStorage | field briefs | cd-phase1 docs tests | — | — |
| Logging/notify/cache | outbox, logs | i3 email outbox | outbox APIs | — | — | digest exports if any | observability, field-sync | — | recipient_email | — | field cache | notification tests | — | — |

---

## 8. Data lifecycle (no deletion now)

| Capability | Dev/Test capability? | Synthetic records? | Production data established? | Actual personal data observed? | Future deletion/migration? | External SoR? |
| --- | --- | --- | --- | --- | --- | --- |
| CRM contacts | Yes | Yes (seed/tests) | **Not established** | Synthetic only in repo evidence | Later Dev/Test cleanup after API/schema grant | Client contacts outside EOS |
| HR | Yes | Tests/UI as present | Not established | Synthetic/test | Later removal | HR outside EOS |
| Supplier persons | Yes | Tests | Not established | Synthetic/test | Later removal of person rows | Named contacts outside EOS |
| Guests | Yes | Yes (seed/tests) | Not established | Synthetic/test | Later removal | Guest lists outside EOS |
| Operator principals | Yes | Bootstrap local users | Not established | Synthetic local emails | **Do not delete auth**; minimize | Optional future IdP — **unselected** |
| Notification emails | Yes | Tests | Not established | Synthetic | Depends on Owner decision | Mail external unless approved |
| Documents | Yes (capability) | Upload tests | Not established | **No** identity-document contents evidenced | Restrict class later | Identity docs must not enter EOS |

Do **not** claim Production contains data. Do **not** claim Production contains none. Production is **not authorized**.

**This increment deletes no records.**

---

## 9. What must NOT be changed yet

- Application code, schema, migrations, APIs, UI, routes, tables, fields, fixtures, seeds  
- Authentication / IdP configuration  
- Infrastructure / Production  
- TIN / EI-01 records  
- PDPC status  
- Existing H-131 / H-132 / H-133 files  
- Dirty worktree unrelated files  

H-134 is **specification only**.

---

## 10. Future remediation sequence

**None of these phases is executed by H-134.**

| Phase | Intent |
| ---: | --- |
| 1 | Governance and contract baseline (H-131 + this specification). Owner accepts dispositions. |
| 2 | Schema/domain remediation (remove person SoR; keep company/rates/commercial objects) |
| 3 | API remediation |
| 4 | UI remediation |
| 5 | Import/export remediation (stop person CSV) |
| 6 | Document / free-text remediation |
| 7 | Notification / logging / cache remediation (after Owner decision on mail) |
| 8 | Test/fixture remediation |
| 9 | Dev/Test regression vs H-131 capability |
| 10 | UAT (H-119 remains valid until a **new** UAT grant; this spec does not reopen UAT) |
| 11 | Production-readiness **reassessment** — not authorization |

Each phase needs its **own** implementation authorization.

---

## 11. PDPC, EI-01, Production

```text
PDPC = OPEN
EOS redesign does not resolve SEDMC's wider regulatory obligations.
No PDPC exemption is asserted.

EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
TIN evidence is not modified.

PRODUCTION = NOT AUTHORIZED / NOT READY
```

---

## 12. Governance conclusion

```text
The current EOS implementation is not aligned with the Owner-established
personal-data boundary. Controlled remediation is required before the EOS
implementation can be represented as conforming to that boundary.
```

Not Production ready. Not a claim of PDPC/PDPA compliance.

---

## 13. Specification only

```text
No application, schema, migration, API, UI, fixture, infrastructure,
authentication, or Production change was made.
No data was deleted.
No certificate was copied.
No full TIN was added.
No commit. No push.
Phases 1–11 were not executed.
```
