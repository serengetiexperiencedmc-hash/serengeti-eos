# H-157 — EOS Non-Personal-Data Boundary and PDPC Applicability Closure Assessment

> **GOVERNANCE / ASSESSMENT ONLY**  
> Reconciles the Owner’s established EOS non-personal-data boundary against the **current** repository implementation, and determines whether an **EOS-specific** PDPC registration process should be pursued because EOS exists.  
> **NOT** a PDPC exemption. **NOT** SEDMC-wide legal clearance. **NOT** PDPC registration, contact, or document upload. **NOT** Production authorization. **NOT** application, schema, migration, or infrastructure change.  
> Prior records H-129 through H-156 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 651  
**Porcelain after this increment:** 652 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**External PDPC contact:** **NONE**  
**Commit / push:** **NONE**  
**H-158:** **NOT CREATED**

```text
H-157 STATUS = COMPLETE — BOUNDARY ASSESSED; EOS-SPECIFIC PDPC NOT PURSUED
EOS DATA BOUNDARY = NON-PERSONAL COMMERCIAL SYSTEM (OWNER REQUIREMENT + CURRENT CONTROLS)
GENUINE CLASS D EOS PERSON-DOMAIN SoR PATH = NONE FOUND
QUESTION 2 (material PD capability) = CONDITIONAL (Class C residuals only)
EOS-SPECIFIC PDPC = NOT CURRENTLY BEING PURSUED FOR EOS
WIDER SEDMC PDPC = SEPARATELY TRACKED / OPEN (not exempted)
H-156 Q-01–Q-15 = NOT ANSWERED
PRODUCTION = NOT AUTHORIZED / NOT READY
```

---

## 1. Owner/POA decision

The Owner has exercised POA. The established business decision (H-131; restated for this assessment) is:

> EOS shall not be designed or implemented as a system of record for personal data. EOS is intended to operate as a commercial operating system using non-personal commercial data.

```text
EOS SHALL NOT COLLECT OR STORE PERSONAL DATA.
```

This increment **does not** establish, and **must not** be read as:

> SEDMC as a company never processes personal data.

Under POA, and after current-code assessment below, the company further records:

- no PDPC registration process should be initiated **merely for EOS**;
- no PDPC application should be prepared **merely because EOS exists**;
- the EOS-specific PDPC question is resolved **through the system boundary** (this record), not through a filing;
- any **wider SEDMC** PDPC obligation remains a separate business/legal matter.

This is a **governance disposition** for the EOS software surface. It is **not** a legal exemption, compliance certificate, or a finding that PDPC registration is unnecessary for all SEDMC activities.

---

## 2. Exact EOS non-personal-data boundary

### 2.1 EOS (in scope of this assessment)

EOS may retain commercial/operational information necessary for the intended commercial operating model, including:

- organizations / accounts;
- suppliers (as companies);
- opportunities;
- RFPs;
- programmes;
- commercial rates;
- Rate Identity;
- costing;
- proposals;
- approvals;
- commercial tasks and activities;
- non-personal documents;
- commercial notes that do not contain personal information;
- commercial operational facts;
- aggregate quantities such as pax counts **where they are not accompanied by identifying guest-level information**.

EOS is **not** intended to collect, persist, import, or transmit as ordinary business records:

- CRM individual contacts;
- HR employee/person dossiers;
- supplier named individuals;
- guest manifests / guest-level vouchers;
- DSR/consent **identifying** subject fields;
- person-specific import records.

Technical authentication identity (operator principal, session, fail-closed IdP) remains a **minimum software-access necessity** (H-133 `RETAIN — TECHNICAL NECESSITY`), not a traveller/client/employee dossier.

### 2.2 Wider SEDMC operations (out of EOS SoR)

SEDMC’s wider activities may involve personal data **outside EOS** (Office / Excel / Outlook-Gmail / WhatsApp / phone — current commercial SoR). H-81 remains **NOT STARTED**. EOS is **not** authorized as the operational SoR.

### 2.3 PDPC

PDPC applicability to the **wider company** is **not** declared closed because EOS is bounded as non-personal.

---

## 3. Assessment method

Inspected current executable surfaces in `apps/api`, `apps/web`, `packages/kernel`, `packages/db/migrations` (including `125_h135_phase1_personal_data_domain.sql`; **no** `126_` file), and reconciled them with H-131–H-156 — especially H-135/H-136 fail-closed APIs, H-138/H-139 import hardening, H-140 content-contract/DocumentStorage, H-141 notification/logging/field-cache, H-145 OD-01–OD-16, and H-146 dispositions.

H-149 / H-152 / H-153 current-code UAT accepted commercial/privacy fail-closed behaviour with documented limitations. Those campaigns are **not** re-run here. UAT acceptance is **not** Production evidence.

Classification vocabulary (exactly one per residual capability):

| Class | Meaning |
| --- | --- |
| **A** | Current executable system does not accept, persist, or transmit personal data through the path |
| **B** | Path exists technically; current validation rejects person-domain content before persistence/transmission |
| **C** | Path could technically carry personal data in circumstances not fully prevented; Owner expressly accepted/controlled it under H-145/H-146 |
| **D** | Current implementation still provides an executable path that can create, persist, import, transmit, or retain personal data **contrary to** the Owner’s EOS boundary |

Historical names, types, UI routes, and CHECK tokens are **not** treated as executable person-SoR paths unless current code can still create or persist those records.

---

## 4. Database / domain findings

Migration **125** (H-135/H-136 Phase A) drops, in Dev/Test schema worktree:

- `ops_vouchers`, `ops_manifest_entries`, `ops_manifests`;
- `crm_contacts` and contact FKs/columns on relationships, activities, tasks, notes, tags, external identifiers, merge, AI drafts;
- `sup_contacts`;
- `hr_employees`, `hr_leave_requests`, `hr_employee_skills`, `hr_skills`, `hr_certifications`;
- DSR `subject_label` and consent `notes`.

Preserved: commercial organizations/accounts, RFPs, programmes, rates, proposals, costing, principals/auth, processing-activity catalogue, DSR/consent **case registers** without subject-identity columns.

Historical CHECK tokens on `crm_import_batches` / `sup_import_batches` still **list** `contact` / `supplier_contact` (OD-12 leave CHECKs). Those tokens are catalog residue. Current API refuses those entity types before persist (`person_domain_removed`). Migration **126** does **not** exist and is **not** authorized.

In-memory Store still has collection names for compatibility; person-domain **write/read APIs** return `person_domain_removed` after authorize and do not persist (H-137 Phase B).

| Surface | Current executable persist? | Class |
| --- | --- | --- |
| CRM contacts table / API | No — 125 dropped table; `createContact`/`listContacts`/`getContact` return `personDomainRemoved()` | **B** |
| HR employees / leave / certifications | No — 125 dropped tables; `listEmployees`/`getEmployee`/create paths return `personDomainRemoved()` | **B** |
| Supplier individual contacts | No — 125 dropped `sup_contacts`; `createSupplierContact` returns `personDomainRemoved()` | **B** |
| Guest manifests / guest vouchers | No — 125 dropped tables; `ops/manifests.ts` and `ops/vouchers.ts` return `personDomainRemoved()` | **B** |
| DSR identifying subject label | Column dropped; API view is `dsrCode` / `requestType` / `status` / optional `note` | **B** for identity fields; **C** for optional `note` prose (OD-09) |
| Consent identifying notes | `notes` column dropped; API view is `consentCode` / `title` / `status` | **B** for identity fields; **C** for `title` prose (OD-09 / OD-15 catalogue) |
| Import CHECK listing person types | Residue only; create/validate/execute refuse person types | **B** (API) / **C** (CHECK token residue, OD-12) |

No current executable person-domain **SoR table** was found that still accepts new person rows through the API.

---

## 5. API / domain findings

H-136/H-137 fail-closed controls remain in current code (`apps/api/src/personal-data-phase1.ts`). Routes may remain registered so authentication still applies; mutations and reads of retired person surfaces return `person_domain_removed` after authorize and **do not write**.

Verified current files:

- `apps/api/src/crm/contact.ts` — list/get/create/update return `personDomainRemoved()` after authorize;
- `apps/api/src/supplier/contacts.ts` — create/update return `personDomainRemoved()`;
- `apps/api/src/hr/hr.ts` — employee list/get (and related person writes) return `personDomainRemoved()`; module health reports `employees: 0`;
- `apps/api/src/hr-certifications/service.ts` — person_domain_removed;
- `apps/api/src/ops/manifests.ts`, `apps/api/src/ops/vouchers.ts` — person_domain_removed;
- CRM notes/activities: `entityType === "contact"` / `contactId` rejected (`crm/note.ts`, `crm/activity.ts`);
- CRM merge contact entity: `person_domain_removed` (`crm/merge.ts`);
- Structural object-key reject: `rejectPersonDomainContent` on organization, RFP, programme, commercial facts, proposal generate, costing, supplier company/content-block, AI draft create, activity/task, field-sync, notification allowlist (`personal-data-content-contract.ts` wraps `findPersonDomainObjectKeys`; **does not scan prose**).

| Path | Class |
| --- | --- |
| Dedicated person/contact/employee/guest APIs | **B** |
| Person-domain **object keys** on commercial writes | **B** |
| String bodies / titles / notes after key reject | **C** (OD-09 accept residual prose) |

H-136/H-137 fail-closed controls remain **effective** on dedicated person-domain APIs.

---

## 6. Import / ingestion findings

H-138/H-139 controls remain in current `crm/import.ts` and `supplier/import.ts`: create/validate/execute refuse `contact` and `supplier_contact` with `person_domain_removed` and do not persist a person-type batch. Seed does not load supplier-contact rows. Retired sample `supplier-contacts.csv` remains labelled RETIRED and unwired (OD-14).

Approved commercial types (organization / supplier / rate / content-block / season) still persist `csv_content`. Header allowlists reject person-domain **column names**. **Cells are not scanned.** A name *could* appear in an organization CSV cell. HTTP sanitizes responses to omit `csvContent`. Owner accepted this residual (OD-01 / H142-IMP-05).

Mailbox / Gmail / WhatsApp / Excel ingestion remain **NOT AUTHORIZED**. No WhatsApp send adapter found (H142-NTF-09).

| Path | Class |
| --- | --- |
| Dedicated person-entity import | **B** |
| Generic commercial CSV cells | **C** — not claimed privacy-scanned |
| Historical import batches | **C** — left in place (OD-02); leftover person-type execute remains fail-closed |
| Retired sample CSV | **C** (unwired documentation residue) |

Generic commercial CSV is **not** “safe” merely because dedicated person types are rejected. It is a **controlled residual** (Class C), not a reopened person-import SoR (not Class D).

---

## 7. DocumentStorage findings

`apps/api/src/commercial-documents/service.ts`:

1. Intended use: commercial-only RFP documents.
2. Structural metadata: auth, MIME/size allow-list, `rejectPersonDomainContent` on metadata, `rejectPersonDomainDocumentFilename` on identity-labelled filenames.
3. Bytes stored as-is via `LocalFsDocumentStorage`. **No content scanner, OCR, or DLP.** GET exists. No HTTP DELETE.

Owner accepted unscanned commercial files (OD-08). Historical documents not deleted (OD-10).

| Aspect | Class |
| --- | --- |
| Identity-labelled filenames / person-domain object keys | **B** |
| Arbitrary file bytes that could contain personal data | **C** — not scanned |

Do not claim content inspection. Do not invent that stored files currently contain personal data.

---

## 8. Free-text / JSONB findings

Covered commercial notes, RFP/programme fields, F2 JSONB facts, AI draft create, briefs, activity/task content, proposal/costing, organization/supplier fields: **person-domain object keys rejected**; **string values unrestricted**. No semantic detection of personal information in prose.

DSR optional `note` and consent `title` are the same class of prose (non-identifying register + residual free text).

| Aspect | Class |
| --- | --- |
| Person-domain keys | **B** |
| Residual prose / JSON string values | **C** (OD-09, OD-11 historical JSONB left) |

---

## 9. Notification findings

Notification product remains. OD-04 left current allowlist / `principal.email`. OD-06 keeps outbox. OD-07 keeps body persist; HTTP list omits `bodyText` (H-141). Person-domain **keys** on allowlist/template writes are rejected. No new recipient **directory** (CRM/HR) is created. Production SES product remains unselected.

Exact residual: an allowlisted email address and technical `principal.email` **can identify a natural person**. Outbox bodies can contain prose. These are **ops/auth identity and message audit**, Owner-accepted, **not** a CRM person store.

| Path | Class |
| --- | --- |
| Person-domain keys on allowlist/template | **B** |
| Allowlist address / `principal.email` / persisted bodies | **C** (OD-04/06/07) |
| WhatsApp send | **A** (no adapter); type residue **C** (OD-13) |

---

## 10. Logging findings

`apps/api/src/observability.ts` `REDACT_KEYS` includes `email`, `telephone`, `mobile`, `recipientEmail`, `bodyText`, `csvContent`, `contentBase64`, and related named keys. Nested objects with those **key names** are redacted. This is **not** a content scanner. Other field names, `err.message`, and free-text log lines are not auto-redacted (H142-LOG-03). Production log sink is not selected.

| Aspect | Class |
| --- | --- |
| Named-key redaction as implemented | **C** — incomplete vs all possible names; Owner preserved H-141; completeness not selected |

Do not claim logs are fully privacy-safe.

---

## 11. Field-cache / browser storage findings

`apps/web/src/lib/field-offline-cache.ts`: principal-bound encrypted blobs (`field-cache-crypto`); `clearFieldCaches()` on logout/account-switch via `eos-session.ts`; device id/salt retained by design (OD-16; not treated as person-domain SoR). Tests assert cache module does not name `crmContact` / `hrEmployee` / `supplierContact`. No `indexedDB` / `serviceWorker` matches in `apps` (H142-FC-07 CLOSED).

Intended payload is field-ops **commercial** sync. The cache can retain whatever was last synced. It is **not** a personal-data-free system merely because the intended payload is commercial.

H152-F-01 (`/field` `getOrCreateDeviceId()` hydration) remains an unresolved UI defect, non-blocking to UAT, **not** classified here as a person-SoR path.

| Aspect | Class |
| --- | --- |
| IndexedDB / service worker | **A** (not present) |
| Current bind + logout clear blobs | **C** (OD-16) |

---

## 12. Classification summary (A/B/C/D)

| ID | Capability | Class |
| --- | --- | --- |
| PD-API-CRM | CRM contact create/read/update | **B** |
| PD-API-HR | HR employee/leave/certification person APIs | **B** |
| PD-API-SUP | Supplier individual contact APIs | **B** |
| PD-API-GUEST | Guest manifest / voucher APIs | **B** |
| PD-API-KEYS | Person-domain object keys on commercial writes | **B** |
| PD-IMP-PERSON | Dedicated contact / supplier_contact import | **B** |
| PD-DOC-META | Identity filename + person-key document metadata | **B** |
| PD-DSR-ID | DSR subject-identity column / consent notes column | **B** (dropped) |
| PD-IMP-CSV | Commercial CSV cells (unscanned) | **C** |
| PD-IMP-HIST | Historical import batches left in place | **C** |
| PD-IMP-CHECK | Historical CHECK tokens listing person types | **C** (non-executable API) |
| PD-DOC-BYTES | Unscanned document bytes | **C** |
| PD-PROSE | Notes / JSON strings / titles / DSR note / consent title | **C** |
| PD-NTF | Allowlist / principal.email / outbox bodies | **C** |
| PD-LOG | Incomplete named-key log redaction | **C** |
| PD-CACHE | Field-cache blobs | **C** |
| PD-TYPES | Dead types / retired CSV sample / WhatsApp enum | **C** (non-write or unwired) |
| PD-IDB | IndexedDB / service worker | **A** |
| PD-INGEST | Mailbox/Gmail/WhatsApp/Excel ingestion | **A** (not authorized; not implemented as ingestion) |

**Class D:** **none found** in current executable code. Residual technical carry of personal data on commercial surfaces is Owner-accepted Class C, not an unrecognized person-SoR.

H-146: 3 CLOSED (IMP-08, FC-07, DOC-10), 20 CONTROLLED/ACCEPTED. This assessment does not reopen those 23 IDs. It maps them onto A/B/C/D for the EOS-boundary question.

---

## 13. Whether any genuine current EOS personal-data capability remains

```text
GENUINE CLASS D PERSON-DOMAIN SoR PATH: NONE FOUND
```

Dedicated person-domain collection/persistence APIs are fail-closed. Person tables are dropped in migration 125. Current code does **not** recreate CRM contacts, HR employees, supplier individuals, guest identity, or person-type imports.

**Conditional residual (Class C):** operators can still type or upload personal information into commercial CSV cells, unscanned files, free-text notes, notification bodies, logs, or field-cache blobs. That residual is **documented and Owner-accepted** (OD-01, OD-07, OD-08, OD-09, OD-16). It is **not** claimed absent. It is **not** upgraded to Class D solely to keep a PDPC filing open, and **not** downgraded to Class A.

---

## 14. EOS-specific PDPC applicability (Questions 1–4)

### Question 1 — Does the current EOS design intend to collect/process personal data?

**NO.** Controlling requirement: EOS shall not be a personal-data system of record.

### Question 2 — Does current executable EOS code nevertheless provide a material personal-data collection/processing capability?

**CONDITIONAL.**

- Dedicated person-domain SoR: **NO** (Class B fail-closed; tables dropped).
- Residual commercial surfaces (Class C): **technically yes** if an operator pastes or uploads personal data into notes, CSV cells, files, outbox, logs, or field cache. No semantic scanner exists. Owner accepted those residuals under H-145/H-146.

### Question 3 — Can the EOS-specific PDPC dependency be closed as:

> “EOS-specific PDPC registration is not currently being pursued because EOS is explicitly bounded as a non-personal-data commercial system.”

**YES — as a governance disposition for EOS software**, supported by: Owner boundary (H-131 / this POA); fail-closed person-domain APIs; migration 125 drops; H-145/H-146 accepted residuals rather than a live person SoR.

**Do not phrase this as:** “SEDMC does not need PDPC registration.”

**Do not claim:** exemption, compliance, that Class C residuals are legally non-processing, or that the TRA TIN certificate proves PDPC eligibility.

### Question 4 — Should SEDMC’s wider operational PDPC status remain separately tracked?

**YES.** Wider SEDMC regulatory applicability remains a separate matter from the EOS software boundary. Unless and until authoritative external evidence (not this repository) resolves it, wider PDPC stays **OPEN / separately tracked**.

```text
EOS-SPECIFIC PDPC DISPOSITION:
Not currently being pursued as an EOS software registration trigger.

WIDER SEDMC PDPC DISPOSITION:
Separately tracked. OPEN. Not exempted. Not closed by H-157.
```

---

## 15. Explicit distinction

| Layer | Status after H-157 |
| --- | --- |
| EOS privacy-by-design / non-personal commercial boundary | **Recorded and current-code-assessed.** Person-domain SoR fail-closed. Class C residuals accepted. |
| SEDMC operational processing outside EOS | Continues in Office / Excel / Outlook-Gmail / WhatsApp / phone. **Not** assessed as compliant here. |
| EOS-specific PDPC registration | **Not currently being pursued** because EOS exists. |
| Wider SEDMC PDPC | **OPEN**, separately tracked. |
| Production legal/privacy (H-154 blocker 18) | **OPEN** — DPO combined close, vendor DPAs, and wider PDPC remain; EOS-specific filing is not the remaining trigger. |

---

## 16. H-156 reconciliation

H-156 authorized Owner/authorized-representative confirmation of live PDPC requirements (Q-01–Q-15) and **did not execute** external contact. Those questions remain **unanswered**. This increment does **not** fill them.

Under POA, H-157 records that:

- H-156 confirmation is **not** a required next step **for EOS software**;
- no PDPC application should be prepared merely because EOS exists;
- H-156 remains a valid **authorization artefact** if the Owner later addresses **wider SEDMC** PDPC as a separate legal matter;
- EI-03 is **not** treated as the next **EOS** executable action.

H-156 is **not** rewritten.

---

## 17. Production-gate reconciliation

EOS being bounded as non-personal **does not** close Production blockers.

| Gate | After H-157 |
| --- | --- |
| Production authorization | **OPEN** |
| Hosting/provider/region | **OPEN** |
| ADR-0006 | **OPEN** |
| DP-0006 | **OPEN** |
| Production database/catalog | **OPEN** |
| Production migration | **OPEN** (126 not created) |
| Secrets/KMS, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| Backup, restore, supervision, observability, NATS, email product | **OPEN** |
| Operations ownership / on-call | **OPEN** |
| Rollback/DR, Production access model | **OPEN** |
| SoR / adoption (H-81) | **OPEN** — **NOT STARTED** |
| Item 27 current-code UAT | SATISFIED AS UAT EVIDENCE ONLY |
| Item 28 EI-01 | CLOSED BY OWNER ACCEPTANCE (H-155; not TRA-verified) |
| Item 18 E1-C legal/privacy | **OPEN** — not closed; EOS-specific PDPC filing is not pursued, but DPO combined close, DPAs, and **wider** PDPC remain |

`productionReady=false`. Catalogs `eos`, `eos_h112_full`, `eos_h117_uat`, `eos_h149_uat`, `eos_h152_uat`, `eos_gateb` are **not** Production.

Named inventory remains **28** rows. No blocker other than the already-closed item 28 is closed here. Item 18 is **not** silently closed.

---

## 18. Exact next action

```text
Do not initiate PDPC registration for EOS.
Do not contact PDPC from this repository.
Do not create H-158.

Next material Owner/POA action for remaining EOS Production readiness:
resolve a named ADR-0006 / DP-0006 hosting and data-residency option
(reconciling H-125 OA-09 managed-cloud direction with E1-C SEDMC-owned
preferred target). Cursor cannot select a provider or region.

Wider SEDMC PDPC remains a separate Owner/legal matter and is not
the next EOS software action.
```

---

## 19. Explicitly excluded

```text
H-158: NOT CREATED
PDPC contact / registration / upload: NONE
SEDMC PDPC exemption / compliance: NOT CLAIMED
TRA verification: NOT CLAIMED
H-129–H-156 modified: NO
application / schema / infrastructure: UNCHANGED
migration 126 / live migration: NONE
commit / push: NONE
H-81 / SoR cutover: NOT STARTED
```

---

## 20. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 651 → 652 |
| Files changed | `docs/governance/h-157-eos-non-personal-data-boundary-and-pdpc-applicability-assessment.md` only |
| Application / schema / infrastructure | **NONE** |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
PROCESS STOPPED AFTER H-157
```
