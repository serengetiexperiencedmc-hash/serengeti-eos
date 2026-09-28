# H-146 — Residual Privacy Findings Closure Assessment

> **GOVERNANCE / EVIDENCE ASSESSMENT ONLY.** Not remediation. Not UAT. Not Production. Not a PDPC conclusion.  
> H-142, H-143, H-144 register completion, and H-144 worksheet were **not** overwritten.  
> A prior H-146 increment on this same path is **expanded in place** to the field model required by this grant (stable dispositions retained). H-145 decisions are **not** reinterpreted.

**Date / time:** 2026-09-22 12:22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**H-145 status:** COMPLETE WITH FINDINGS

```text
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
APPLICATION CHANGES THIS INCREMENT: NONE
SCHEMA: UNCHANGED
INFRASTRUCTURE: UNCHANGED
STOPPED AFTER H-146: YES
```

---

## A. Baseline

**Commands:**

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

**Actual:**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba (unchanged)
BRANCH: master
INDEX: empty
PORCELAIN BEFORE: 630
PORCELAIN AFTER: 630 (this file expanded in place; no new application files)
```

Dirty worktree preserved. No reset, clean, stash, revert, discard, overwrite of unrelated changes, commit, push, live migration, or Production action.

---

## B. Authority

```text
POA: EXERCISED
Decision authority: Patrick Makundi / Company Owner authority under POA
OWNER DECISIONS: OD-01 through OD-16 CONFIRMED 16/16
H-142: authoritative for original 23 finding IDs
H-145: authoritative for Owner decisions and implementation authorization
```

Confirmed Owner decisions (unchanged):

| OD | Confirmed option |
| --- | --- |
| OD-01 | (a) accept residual capability |
| OD-02 | (a) leave in place |
| OD-03 | (a) leave |
| OD-04 | (a) leave current allowlist/principal.email |
| OD-05 | (a) unspecified continue |
| OD-06 | (a) keep |
| OD-07 | (a) keep current persist |
| OD-08 | (a) remain unscanned |
| OD-09 | (a) accept residual prose |
| OD-10 | (a) leave |
| OD-11 | (a) leave |
| OD-12 | (a) leave CHECKs |
| OD-13 | (a) keep |
| OD-14 | (a) retain labelled retired |
| OD-15 | (a) keep as now |
| OD-16 | (a) keep current bind+clear blobs |

**H-145 implementation scope (Dev/Test only):** apply existing `rejectPersonDomainContent` to leftover writes: activity, task, AI draft create, proposal generate, costing sheet/line, supplier company/content-block, programme item patch. Capture increment of H-145 changed only the H-145 governance file. No further application change is authorized or performed here.

**Prior H-145 test evidence (not re-run this increment):** web/api/kernel/db typecheck PASS; 12 Vitest files / 69 tests PASS; commercial regression PASS. This increment: static verification of OD-09 call sites only.

---

## C. 23-finding reconciliation

Disposition definitions:

- **CLOSED** — no longer an open actionable gap under the authorized scope; evidence supports closure.
- **CONTROLLED / ACCEPTED** — capability/residue remains; Owner accepted or retained it, or existing controls constrain it. Known residual, not an unrecognized gap.
- **REMAINING / DEFERRED** — still exists and was not closed; or Owner explicitly deferred it (H-145 selected “later …” options). None of OD-01–OD-16 selected a “later” option.
- **BLOCKED / FUTURE OWNER DECISION** — genuinely requires a future Owner/external decision **not already resolved by H-145**.

Evidence confidence: **High** = repository/static + Dev/Test. **Medium** = static only. **N/A live** = live/UAT/Production catalogs not inspected (not invented).

| Finding ID | H-142 finding summary | Related OD | Current repository evidence | Current disposition | Reason | Future action, if any | Evidence confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H142-IMP-01 | `sup_import_batches.entity_type` CHECK still lists `supplier_contact` | OD-12 (a) leave CHECKs | `014_c4_supplier.sql` unchanged. No `126_` file. API create/validate/execute return `person_domain_removed` for `supplier_contact`. | CONTROLLED / ACCEPTED | CHECK token is catalog residue, not an executable API person-import path. Owner left CHECKs. | None under H-145. Do not create migration 126. | High (SQL + API); live `\d` not inspected |
| H142-IMP-02 | `crm_import_batches.entity_type` CHECK still lists `contact` | OD-12 (a) | `010_c1_merge_import.sql` unchanged. Same API fail-closed for `contact`. | CONTROLLED / ACCEPTED | Same class as IMP-01. | None. No 126. | High (SQL + API); live catalog N/A |
| H142-IMP-04 | Unwired retired `supplier-contacts.csv` sample | OD-14 (a) retain labelled retired | File present, labelled RETIRED. Seed does not load it. `entityType=supplier_contact` rejected before persist. | CONTROLLED / ACCEPTED | Sample/documentation, not a wired import workflow. | None. Do not delete. | High |
| H142-IMP-05 | Commercial `csv_content` persisted; cells not scanned | OD-01 (a) accept residual capability | POST `/v1/crm/imports` and `/v1/suppliers/imports` persist CSV for approved types. `sanitizeBatch` omits `csvContent`. Header allowlist + person-type fail-closed. No cell scanner. | CONTROLLED / ACCEPTED | Owner accepted residual commercial cells. Not a person-entity import. Do not claim cells are privacy-scanned. Do not invent that Production catalogs contain personal data. | None unless a later Owner later selects H-142 (b)/(c)/(d). Not taken. | High (code + H-139/H-145 tests) |
| H142-IMP-06 | Historical import batches not deleted; live catalogs unknown | OD-02 (a) leave in place | Rows not deleted. Validate/execute of leftover `contact`/`supplier_contact` batches fail-closed. GET omits `csvContent`. Live DBs not inspected; contents not invented. | CONTROLLED / ACCEPTED | Owner required leave-in-place. Leftover person-type batches cannot be committed via API. Historical residue ≠ active person-import workflow. | Live catalog inventory only if UAT/Production catalogs later exist — evidence, not a new OD. | High (API fail-closed); live contents unknown |
| H142-IMP-07 | Dead types/docs (SupContact, JSON samples, UI types) | OD-13 (a) keep | Helpers `validateContactImportRow` / `validateSupplierContactImportRow` absent. Types kept. | CONTROLLED / ACCEPTED | Not a write path. Owner kept residue. | None. Do not rewire. | High |
| H142-IMP-08 | Kernel contact/supplier-contact import parsers | None (already Resolved) | Those exports still absent from `@sedmc/kernel`. | CLOSED | Original gap (helpers exist) no longer present. | None. | High |
| H142-IMP-09 | Person import create→validate→execute | Keep fail-closed (no reopen) | create/validate/execute refuse `contact` and `supplier_contact`. H-145 test: 400 `person_domain_removed`, no batch. | CONTROLLED / ACCEPTED | Dedicated path fail-closed. Residual commercial cells are IMP-05. | Keep fail-closed. Do not reopen. | High |
| H142-DOC-01 | Opaque DocumentStorage bytes; no content scanner | OD-08 (a) remain unscanned | POST `/v1/rfps/:id/documents`: auth, MIME/size, key + identity-filename reject, bytes stored as-is. GET exists. No DELETE. No scanner. | CONTROLLED / ACCEPTED | Owner accepted unscanned commercial files with structural gates. Bytes not claimed scanned. Contents of files not invented. | None unless later OD-08 (b)/(c). | High (code + H-140 tests) |
| H142-DOC-02 | Free-text notes/RFP/programme prose | OD-09 (a) accept residual prose | Key reject on covered note/RFP/programme paths (H-140). String bodies unrestricted. `contact` note entityType rejected. | CONTROLLED / ACCEPTED | Commercial notes retained. Prose residual accepted. Keys rejected. | None. No scanner. | High |
| H142-DOC-04 | JSONB facts/addresses; string values unrestricted | OD-09 (a); OD-11 (a) leave historical | Key reject on facts/address/opportunity/RFP/programme creates. Historical JSONB not deleted. | CONTROLLED / ACCEPTED | Keys controlled; values accepted; historical left. Values not invented as personal data. | None. | High |
| H142-DOC-05 | AI drafts / ops briefs / knowledge prose | OD-09 (a) + leftover key on AI create | `createAiDraft` calls `rejectPersonDomainContent`. H-145 test: `guestName` → 400, no persist. Generated prose unscanned. | CONTROLLED / ACCEPTED | Key gap on AI create addressed; residual prose accepted. | None. | High |
| H142-DOC-10 | Leftover writes lacked person-domain object-key contract | OD-09 leftover-key authorization | All eight authorized files invoke `rejectPersonDomainContent`. H-145 tests: commercial writes 201; person keys 400 without persist. | CLOSED | The actionable gap (missing key contract on those writes) is gone under authorized scope. Residual prose is DOC-02/05. | None. | High |
| H142-DOC-11 | Filename/MIME structural bar incomplete by design | OD-08 (a) | Identity-labelled filenames rejected; MIME allow-list; `scan.pdf` not a marker. | CONTROLLED / ACCEPTED | Structural bar as authorized. | None. | High |
| H142-DOC-12 | Historical documents/JSONB/audit snapshots not deleted | OD-10 (a); OD-11 (a) | Audit continues. Historical objects not deleted. Live contents unknown — not invented. HTTP document delete unregistered. | CONTROLLED / ACCEPTED | Owner left historical rows. Audit of commercial objects is not a person-domain API. | Live evidence only if catalogs later exist. No deletion. | High (code: no delete); live contents unknown |
| H142-DOC-14 | Non-identifying RoPA catalogue | OD-15 (a) keep as now | Catalogue retained; DSR/consent identity UI previously removed. Titles unscanned. | CONTROLLED / ACCEPTED | In-scope non-identifying register. | None. | High (prior H-138 + static) |
| H142-NTF-01 | Allowlist / `principal.email` may identify individuals | OD-04 (a) leave current allowlist/principal.email | Allowlist and technical `principal.email` remain. No new recipient directory. Tenant isolation previously tested. | CONTROLLED / ACCEPTED | Owner retained ops/auth identity. Not an HR/CRM person store. | None. Do not invent org-mailbox rules. | High |
| H142-NTF-04 | Outbox bodies persisted; HTTP omits bodyText | OD-03/05/06/07 (a) | Persist remains. HTTP list omits `bodyText` (H-141). Historical rows not deleted. | CONTROLLED / ACCEPTED | Outbox kept; bodies kept; HTTP omit remains. | None. | High |
| H142-NTF-06 | Inbox interpolates email; exports; SES `includePayload` | OD-04 (a); OD-06 (a); OD-07 (a) | See §D. Executable authenticated ops surfaces of the **kept** notification product. | CONTROLLED / ACCEPTED | Owner kept allowlist/outbox/persist. These surfaces were not authorized for removal. Not CRM/HR. | None under H-145. Tightening would be a later OD — not taken. | High (code); Production SES not selected |
| H142-NTF-09 | WhatsApp channel enum / type residue; no send adapter | OD-13 (a) keep types | No WhatsApp send adapter found. | CONTROLLED / ACCEPTED | Dispatch not executable. Type residue kept. | None. No WhatsApp ingestion. | High |
| H142-LOG-03 | Named-key log redaction is incomplete vs all possible field names | H-145: preserve H-141; no separate completeness OD | `REDACT_KEYS` still includes `recipientEmail`/`bodyText`/person keys. Query-stripped `request_completed` path. Other names / `err.message` not auto-redacted. Production log sink not selected. | CONTROLLED / ACCEPTED | H-141 control retained. Completeness-of-all-keys was not an H-145 selected option. Residual limitation documented. | Do not claim logs are fully privacy-safe. Completeness bar would be a later decision — not taken. | High (code + H-141 tests); Production sink N/A |
| H142-FC-07 | IndexedDB / service-worker caches | None (already Resolved) | Search of `apps` for `indexedDB` / `serviceWorker` / `service-worker`: no matches. | CLOSED | Those caches are not present in the repository search. | None. | High |
| H142-FC-01 | Field-cache bind, logout clear, salt/TTL | OD-16 (a) keep current bind+clear blobs | H-141 implementation not rewritten this programme. Bind + logout/account-switch blob clear remain. | CONTROLLED / ACCEPTED | Owner kept current cache behaviour. Browser UAT not started. | None. Do not disable cache or invent TTL. | High (static + prior H-141 tests); browser UAT N/A |

Every H-142 finding appears exactly once.

---

## D. Detailed analysis — five prior “remaining/deferred” labels

H-145 called these deferred because the **capability still exists**. Under H-146 definitions they are **CONTROLLED / ACCEPTED**: the Owner selected the “accept / leave / keep / remain” options. They are not CLOSED (residue remains) and not REMAINING (H-145 did not defer to “later …”).

### D.1 H142-IMP-05

**H-142 issue:** Approved commercial import types persist `csv_content`. No cell-level personal-data inspection. Person entity types do not persist. HTTP omits `csvContent`. A name *could* appear in an organization CSV cell; that is not proof that Production data contains personal data.

**Owner decision:** OD-01 (a) accept residual capability. No new implementation authorized.

**Current implementation:** Executable authenticated commercial import; header allowlist; person-type fail-closed; persist CSV for organization / supplier / rate / content-block / season; response sanitize omits CSV body.

**Disposition:** CONTROLLED / ACCEPTED.

**Why:** Owner accepted the residual. Controls prevent dedicated person-entity import. Do not scan cells. Do not stop storing commercial CSV.

**Future closure:** Only if a later Owner selects (b)/(c)/(d). Not authorized now.

### D.2 H142-IMP-06

**H-142 issue:** Historical import batches not deleted. Live catalogs unknown. Leftover GET-by-id.

**Owner decision:** OD-02 (a) leave in place.

**Current implementation:** No deletion. Validate/execute of leftover `contact` / `supplier_contact` batches return `person_domain_removed`. `sanitizeBatch` omits `csvContent`. Live catalogs **not** inspected; contents **not** invented.

**Disposition:** CONTROLLED / ACCEPTED.

**Why:** Historical leave plus fail-closed re-ingestion. Residue is not an active person-import workflow.

**Future closure:** Optional live inventory when UAT/Production catalogs exist. No treatment migration.

### D.3 H142-DOC-01

**H-142 issue:** Opaque commercial file bytes stored after structural gates. No OCR/DLP scanner.

**Owner decision:** OD-08 (a) remain unscanned.

**Current implementation:** `POST /v1/rfps/:id/documents` → auth → authorize → object-key reject → identity-filename reject → MIME/size → LocalFs put. No content scanner. No HTTP delete.

**Disposition:** CONTROLLED / ACCEPTED.

**Why:** Commercial DocumentStorage retained as authorized. Bytes not claimed scanned. File contents not invented.

**Future closure:** Only later OD-08 (b)/(c). Not authorized now.

### D.4 H142-DOC-12

**H-142 issue:** Historical documents, JSONB, and audit snapshots not deleted. Live contents unknown.

**Owner decision:** OD-10 (a) leave; OD-11 (a) leave.

**Current implementation:** No unauthorized deletion. Audit of commercial objects continues. Live contents unknown — not invented.

**Disposition:** CONTROLLED / ACCEPTED.

**Why:** Owner forbade automatic historical deletion. Unknown live contents ≠ invented personal data.

**Future closure:** Optional live evidence later. No erasure.

### D.5 H142-NTF-06

**H-142 issue:** Inbox interpolates allowlist `entry.email`; template bodies; allowlist/suppression exports; SES delivery-events `includePayload`.

**Owner decisions:** OD-04 (a), OD-06 (a), OD-07 (a). Removal not authorized.

**Current implementation (executable, authenticated, tenant-scoped ops — not CRM contacts):**

| Surface | Path | Control |
| --- | --- | --- |
| Inbox dual-control line | `notifications.ts` body includes `entry.email` | Allowlist already stored (OD-04) |
| Template PUT | `/v1/notifications/email/templates/:key` | Person-domain **keys** rejected; prose persisted (OD-07/09) |
| Allowlist export | `/v1/notifications/email/allowlist/export` | Auth; emails by design (OD-04) |
| Suppression export | `/v1/notifications/email/suppressions/export` | Auth |
| SES payload | `/v1/notifications/email/delivery-events?includePayload=` | Auth + tenant filter; returns stored webhook JSONB if requested |

**Disposition:** CONTROLLED / ACCEPTED.

**Why:** These are the kept notification product. Not a personal-recipient directory redesign. Production SES not selected; Production usage not invented.

**Future closure:** Tightening would be outside H-145. Not taken.

---

## E. OD-09 verification

Static read this increment (files **not** modified):

| Authorized path | File | `rejectPersonDomainContent` |
| --- | --- | --- |
| activity create/update | `apps/api/src/crm/activity.ts` | import; ~269 create; ~352 update |
| task create/update | `apps/api/src/crm/task.ts` | import; ~207 create; ~280 update |
| AI draft create | `apps/api/src/ai/drafts.ts` | import; ~96 |
| proposal generate | `apps/api/src/proposal/proposal.ts` | import; ~224 |
| costing sheet/line | `apps/api/src/costing/sheet.ts` | import; ~313; ~484 |
| supplier create/update | `apps/api/src/supplier/supplier.ts` | import; ~323; ~415 |
| content-block create/update | `apps/api/src/supplier/content-blocks.ts` | import; ~97; ~163 |
| programme item patch (also create/patch programme from H-140) | `apps/api/src/programme/programme.ts` | import; ~321; ~679; ~805 |

Test artefact present: `apps/api/src/h145-owner-authorized-structural-keys.test.ts`.

**Prior H-145 evidence (not re-run this increment):** that file 3/3 PASS — commercial org/task/supplier 201; person keys 400 without persist; contact import fail-closed; no migration 126. Broader H-145 suite 12 files / 69 tests PASS.

```text
OD-09: VERIFIED
No schema change.
No Production path introduced.
No unrelated commercial capability introduced.
```

---

## F. Explicit non-actions

```text
Migration 126: NOT CREATED
Historical migrations: NOT MODIFIED
Schema changes: NONE
Infrastructure changes: NONE
Production action: NONE
Live migration: NONE
UAT: NOT STARTED
Mailbox ingestion: NOT AUTHORIZED
Gmail ingestion: NOT AUTHORIZED
WhatsApp ingestion: NOT AUTHORIZED
Excel ingestion: NOT AUTHORIZED
C11+: NOT AUTHORIZED
F2-I12: NOT AUTHORIZED
Path D: NOT AUTHORIZED
FX providers / KPI history / revenue-profit reconstruction / booking commercial-facts expansion / 250k-20% rule / new thresholds: NOT AUTHORIZED
```

**CHECK vs executable path:** OD-12 left `contact` / `supplier_contact` tokens in historical CHECKs. The application refuses those entity types with `person_domain_removed` before persist. A CHECK listing is catalog hygiene residue, not an executable person-data API. That distinction does not authorize migration 126.

Systems of record remain Office, Excel, Outlook/Gmail, WhatsApp, and phone. EOS has not replaced them.

---

## G. External gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
```

```text
EOS DATA BOUNDARY: No personal-data system of record.
SEDMC REGULATORY STATUS: Separate governance/legal question.
```

---

## H. Final disposition summary

```text
23 findings reconciled: YES (each ID once)

CLOSED: 3
  H142-IMP-08
  H142-FC-07
  H142-DOC-10

CONTROLLED / ACCEPTED: 20
  H142-IMP-01, IMP-02, IMP-04, IMP-05, IMP-06, IMP-07, IMP-09
  H142-DOC-01, DOC-02, DOC-04, DOC-05, DOC-11, DOC-12, DOC-14
  H142-NTF-01, NTF-04, NTF-06, NTF-09
  H142-LOG-03
  H142-FC-01

REMAINING / DEFERRED: 0

BLOCKED / FUTURE OWNER DECISION: 0
  (among the 23; PDPC / EI-01 / ADR-0006 / DP-0006 remain separate OPEN gates)
```

Categories are not collapsed. Accepted residuals are not labelled CLOSED. Owner-accepted conditions are not labelled REMAINING.

---

## I. Stop

```text
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
STOPPED AFTER H-146: YES
```

Do not start H-147. Do not implement future remediation identified as optional later ODs.
