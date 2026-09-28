# H-142 — Residual Privacy Findings and Owner Decision Register

> **GOVERNANCE-ONLY.** Not UAT, not Production, not a PDPC or legal conclusion, not a scanner, not live-database validation, and not an implementation phase.  
> H-138, H-139, H-140, and H-141 artefacts were **not** rewritten, deleted, merged, or overwritten.  
> This file is the authorized H-142 record. A prior H-142 increment on this same path is **expanded in place** to the field model required by this grant (stable finding IDs retained). No application, schema, or infrastructure change.

**Date:** 2026-09-22.  
**Authorization:** Owner / ChatGPT governance layer — H-142 residual findings and Owner Decision Register.  
**Application / schema / migration / infrastructure changes this increment:** **NONE**.

```text
COMMIT: NONE
PUSH: NONE
MIGRATION 126: NOT CREATED
LIVE MIGRATION: NONE
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
```

---

## 1. H-142 scope and authorization

Purpose: a single auditable register of **remaining privacy findings and Owner decisions required before any future remediation can be authorized**.

This increment does **not**:

- turn unresolved findings into engineering requirements by assumption
- invent Owner decisions, privacy policy, retention periods, notification-recipient rules, document-content rules, legal or PDPC conclusions, migration requirements, Production readiness, or UAT status
- treat a rejected API payload as proof that personal data cannot technically exist anywhere in the system

Distinction used throughout:

```text
cannot currently create   = dedicated person-domain path is fail-closed / rejected before persist
cannot technically exist  = no remaining storage surface could hold equivalent data
```

The second claim is **not** made for generic CSV, files, notes, JSON strings, notification emails/bodies, or ops briefs.

---

## 2. Repository baseline

**Commands executed:**

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

**Actual state at start of this grant:**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
branch: master
index: empty
porcelain: 623
dirty worktree: preserved
```

Verified rather than assumed:

```text
H-141 porcelain (historical, first H-141 increment): 612 → 622
First H-142 increment: 622 → 623 (this file created)
This grant start: 623
```

```text
H-139 residual: PASS WITH FINDINGS
H-140 (including create-path increment): PASS WITH FINDINGS
H-141: PASS WITH FINDINGS / STOPPED
Migration 125: present, unmodified this increment
Migration 126: not present
```

No baseline correction was applied.

---

## 3. Relationship to H-139 / H-140 / H-141

| Phase | File (not overwritten) | Disposition |
| --- | --- | --- |
| H-139 import | `docs/governance/h-139-import-ingestion-personal-data-remediation.md` | PASS WITH FINDINGS |
| H-139 residual | `docs/governance/h-139-residual-import-hardening.md` | PASS WITH FINDINGS |
| H-140 | `docs/governance/h-140-documentstorage-freetext-jsonb-remediation.md` (includes create-path increment in the same file) | PASS WITH FINDINGS |
| H-141 | `docs/governance/h-141-notification-logging-field-cache-remediation.md` | PASS WITH FINDINGS / STOPPED |

Numbering context (not merged): H-138 Phase C UI vs intervening H-138 import file remain distinct. H-140 and H-141 each expanded in place once already.

**H-140 supporting test evidence (historical, not re-run in H-142):** targeted API vitest **5 files / 29 tests / all passed** (H-140 record and a later background terminal artifact). That result supports H-140 in-process evidence only.

**Not an H-141 defect:** a background `curl` to `127.0.0.1:3017/commercial` failed with connection reset (curl 56). That was local-server unavailability. It was **not** independently reproduced and is **not** recorded as a field-cache or notification defect.

### A. Resolved findings

Executable or persistence **path closed** (the helper/path no longer exists or cannot write person records):

| ID | Item |
| --- | --- |
| H142-IMP-08 | Kernel `validateContactImportRow` / `validateSupplierContactImportRow` helpers **removed** (H-139 residual finding 4) |
| H142-FC-07 | IndexedDB / service-worker caches **not present** in repository search (H-141) |

Dedicated CRM contact / supplier contact / HR / guest APIs remain fail-closed from earlier phases; they are classified **Controlled** below because generic surfaces can still hold describing text. They are **not** listed as Resolved “cannot technically exist.”

### B. Controlled findings

A control exists; the underlying capability remains technically possible **or** the dedicated path is closed while residue/generic storage remains:

- Retired `contact` / `supplier_contact` import APIs (`person_domain_removed`, no new `csv_content`)
- Unwired retired sample `supplier-contacts.csv`
- Document upload auth, MIME/size, structural keys, identity filenames
- Notification auth, tenant allowlist isolation, outbox HTTP omitting `bodyText`, person-domain **keys** on allowlist/template/sync/cache
- Logger named-key redaction and query-stripped `request_completed` path
- Field-cache principal bind + logout/account-switch clear (in-process stub tests)
- Compatibility TypeScript types / historical JSON `SupplierContactRecord` unused in `oneOf`
- RoPA processing-activity catalogue without DSR subject identity / consent person notes (H-138 Phase C)

### C. Deferred findings

Intentionally left for a later **authorized** phase (not silently implemented):

- Generic commercial `csv_content` cell content
- Opaque file bytes; unrestricted note/brief/AI-draft/JSON **string** values
- Writes that never received the H-140 key contract (activity, task, AI generate, proposal snapshot, programme item, supplier notes, costing)
- HTTP document delete; audit JSONB snapshots; field-cache TTL auto-expire; device id/salt after logout
- Notification export-of-emails; SES `includePayload`; allowlist email interpolated in inbox body
- Historical row treatment (imports, outbox, documents) — not deleted

### D. Owner-policy-dependent findings

Cannot be remediated until the Owner specifies business/privacy policy (see §5). Engineering must not assume a rule.

### E. Migration/schema-dependent findings

PostgreSQL CHECK text still lists retired import entity types. Application rejection does **not** rewrite the catalog. Whether to change that is an **Owner decision first**; H-142 does **not** invent that migration 126 must be created. See §6.

### F. External-evidence-dependent findings

PDPC registration; EI-01 TIN certificate; ADR-0006 hosting; DP-0006 region/residency; Production SES/object-store/log sink (not selected).

### G. UAT-dependent findings

Operator CSV/file/note behaviour; real-browser cache logout/switch; live UAT PostgreSQL constraints and historical rows; runtime logs beyond Vitest stdout.

### H. Production-dependent findings

Anything requiring Production infrastructure, credentials, providers, or operational evidence. `productionReady = false`. Not authorized.

These eight categories are **not** collapsed.

---

## 4. Residual finding register

**Status values:** Resolved / Controlled / Deferred / Open / Blocked.

**Migration 126 column:** Yes / No / Unknown — “Yes” here means “a forward-only schema change *could* address catalog residue **if Owner later authorizes it**,” not that H-142 requires creating 126.

### Import / ingestion (H-139)

**H142-IMP-01 — CHECK lists `supplier_contact`**

```text
Finding ID: H142-IMP-01
Source phase: H-139
Exact location: packages/db/migrations/014_c4_supplier.sql — sup_import_batches.entity_type CHECK includes 'supplier_contact'; 125 comments this CHECK was left in place
Current behavior: API create/validate/execute refuse supplier_contact with person_domain_removed and do not persist csv_content. CHECK text still names the retired type on catalogs that applied 014.
Evidence type: Static (SQL); test (API, H-139 residual); runtime live catalog not verified
Executable?: No (API). Unknown (non-API SQL client against a live catalog)
Persisted?: No (new API batches). Historical/Unknown (live catalogs)
Rejected?: Yes (API before persist)
Compatibility residue?: Yes (CHECK listing)
Current control: Application fail-closed
Residual risk: Catalog still names a retired person entity type. DROP TABLE sup_contacts already occurred in 125; a CHECK token is not a person table. This is not proof that personal data cannot exist in commercial csv_content.
Required action: Owner decides whether a later forward-only CHECK tighten is wanted. Do not create 126 in this increment.
Owner decision required?: Yes
Migration 126 required?: Unknown (Owner first). If authorized, a future migration could tighten the CHECK. Residue-only: yes, that is the technical basis — not a current executable import path.
External evidence required?: No for the SQL text; Yes for live \d if a catalog exists
UAT required?: Yes if a CHECK change is later applied
Production dependency?: Yes to apply any later migration to Production (not authorized)
Status: Open
```

**H142-IMP-02 — CHECK lists `contact` on CRM import batches**

```text
Finding ID: H142-IMP-02
Source phase: H-139 / H-140 §12
Exact location: packages/db/migrations/010_c1_merge_import.sql — crm_import_batches.entity_type CHECK ('organization','contact'). 125 tightened duplicate_candidates/merge_records CHECKs only, not this import-batch CHECK.
Current behavior: contact import API fail-closed. CHECK still lists contact.
Evidence type: Static; test (H-139); live catalog not verified
Executable?: No (API)
Persisted?: No (new API contact batches)
Rejected?: Yes (API)
Compatibility residue?: Yes
Current control: Application fail-closed
Residual risk: Same class as IMP-01
Required action: Owner decision before any schema change
Owner decision required?: Yes
Migration 126 required?: Unknown (Owner first); same residue class as IMP-01
External evidence required?: Live catalog optional
UAT required?: If later applied
Production dependency?: Yes for any Production migrate
Status: Open
```

**H142-IMP-04 — Unwired sample CSV**

```text
Finding ID: H142-IMP-04
Source phase: H-139 residual finding 2
Exact location: docs/c4/import/supplier-contacts.csv; README and field-reference mark RETIRED
Current behavior: Not loaded by seed or kernel parsers. Submitting entityType=supplier_contact is rejected before persist. File retained (not deleted).
Evidence type: Test (H-139 residual)
Executable?: No
Persisted?: Documentation file only
Rejected?: Yes if used as that entity type
Compatibility residue?: Yes (sample)
Current control: Retired labelling; API reject
Residual risk: A reader might ignore retired banners
Required action: Owner may later keep, relabel, or authorize deletion of the sample — not decided here
Owner decision required?: Yes (artifact fate)
Migration 126 required?: No
External evidence required?: No
UAT required?: Operator training confirmation
Production dependency?: No
Status: Controlled
```

**H142-IMP-05 — Generic commercial `csv_content`**

```text
Finding ID: H142-IMP-05
Source phase: H-139 residual finding 3; H-140 §7
Exact location: crm_import_batches.csv_content; sup_import_batches.csv_content; POST /v1/crm/imports; POST /v1/suppliers/imports
Current behavior: Approved types (organization; supplier, supplier_rate, supplier_content_block, supplier_season) persist CSV. Person entity types do not. HTTP sanitize omits csvContent. No cell-level personal-data inspection.
Evidence type: Test
Executable?: Yes (commercial types)
Persisted?: Yes
Rejected?: Partial (entity type only)
Compatibility residue?: No
Current control: Entity-type gate + response omit
Residual risk: Personal strings can appear in commercial cells. cannot currently create a contact batch ≠ cannot technically store a name in an organization CSV cell.
Required action: Owner policy before any sanitization/retention design
Owner decision required?: Yes
Migration 126 required?: No unless Owner later requires a schema/retention change
External evidence required?: No for the technical fact
UAT required?: Yes
Production dependency?: Yes for Production use of import
Status: Deferred
```

**H142-IMP-06 — Historical import batches**

```text
Finding ID: H142-IMP-06
Source phase: H-139
Exact location: crm_import_batches / sup_import_batches; leftover GET-by-id of historical batches (H-139)
Current behavior: Historical rows were not deleted. Live catalogs were not inspected in H-142.
Evidence type: Historical; runtime Unknown
Executable?: Unknown (depends on catalog contents)
Persisted?: Historical / Unknown
Rejected?: New person-type creates Yes
Compatibility residue?: Possible leftover rows
Current control: No deletion authorized
Residual risk: Pre-remediation rows may exist somewhere
Required action: Owner treatment decision + live evidence if catalogs exist
Owner decision required?: Yes
Migration 126 required?: No for inspection; Unknown if Owner later wants a data-treatment migration
External evidence required?: Yes (live DB) if those environments exist
UAT required?: Yes if UAT DB may contain leftovers
Production dependency?: Yes
Status: Open
```

**H142-IMP-07 — Compatibility types / historical JSON**

```text
Finding ID: H142-IMP-07
Source phase: H-139 / H-138 / H-140
Exact location: docs/c4/import/supplier-import-schema.json SupplierContactRecord (retired unused); web lib crm-api/suppliers-api/ops-api/hr-api types; kernel SupContact
Current behavior: JSON oneOf no longer includes supplier_contact batch. Types not deleted. UI person forms retired (H-138 tests).
Evidence type: Static; test (H-138 UI; H-139 schema)
Executable?: No (types/docs are not a write path)
Persisted?: No via types
Rejected?: Live APIs Yes
Compatibility residue?: Yes
Current control: Unwired / retired
Residual risk: Future rewiring
Required action: Optional later hygiene if Owner authorizes
Owner decision required?: Yes (keep vs later cleanup)
Migration 126 required?: No
External evidence required?: No
UAT required?: Confirm UI still has no person forms
Production dependency?: No
Status: Controlled
```

**H142-IMP-08 — Removed kernel parsers**

```text
Finding ID: H142-IMP-08
Source phase: H-139 residual finding 4
Exact location: packages/kernel/src/crm-import.ts; supplier-import.ts (helpers absent)
Current behavior: Helpers do not exist
Evidence type: Test
Executable?: No
Persisted?: No
Rejected?: N/A
Compatibility residue?: No
Current control: Removal
Residual risk: None from those helpers
Required action: None
Owner decision required?: No
Migration 126 required?: No
External evidence required?: No
UAT required?: No
Production dependency?: No
Status: Resolved
```

**H142-IMP-09 — Create → validate → execute person path**

```text
Finding ID: H142-IMP-09
Source phase: H-139
Exact location: apps/api/src/crm/import.ts; apps/api/src/supplier/import.ts
Current behavior: contact and supplier_contact fail-closed at create/validate/execute; persist skips leftover person-domain batches
Evidence type: Test
Executable?: No
Persisted?: No (new)
Rejected?: Yes before persistence
Compatibility residue?: No
Current control: person_domain_removed after authorize
Residual risk: Does not close generic commercial CSV (IMP-05)
Required action: Keep fail-closed; do not reopen
Owner decision required?: No for keeping closed
Migration 126 required?: No
External evidence required?: No
UAT required?: Regression that person types stay closed
Production dependency?: No for the reject itself
Status: Controlled
```

### DocumentStorage / free-text / JSONB (H-140)

There is **no** evidenced OCR, DLP, keyword, or file-byte personal-data scanner.

**H142-DOC-01 — Opaque file bytes**

```text
Finding ID: H142-DOC-01
Source phase: H-140
Exact location: commercial-documents storage (LocalFs Dev/Test); PDF/DOCX/XLSX/CSV/JPEG/PNG ≤ 10 MiB
Current behavior: Auth, MIME, size, structural keys, identity filenames checked before put. Bytes stored as-is. Historical files not deleted. HTTP delete unregistered.
Evidence type: Test (reject/auth); static (no scanner)
Executable?: Yes (commercial upload)
Persisted?: Yes (opaque)
Rejected?: Partial (keys/filenames, not content)
Compatibility residue?: No
Current control: Structural object-key + filename labelling + MIME/size — NOT content inspection
Residual risk: File bytes can contain personal data
Required action: Owner decides whether unscanned files remain acceptable
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: Production object store if later hosted
UAT required?: Yes
Production dependency?: Yes (Production storage not selected)
Status: Deferred
```

**H142-DOC-02 — Free-text notes (CRM / RFP / programme)**

```text
Finding ID: H142-DOC-02
Source phase: H-140
Exact location: CRM notes body; RFP notes; programme notes; apps/api crm/note.ts contact entityType rejected
Current behavior: Nested person-domain object keys rejected on covered create/patch paths. String values unrestricted. contact notes entityType rejected.
Evidence type: Test (keys); static (no semantic scan)
Executable?: Yes (commercial notes)
Persisted?: Yes
Rejected?: Partial (keys / contact entity)
Compatibility residue?: No
Current control: Structural key rejection — NOT content inspection
Residual risk: Prose can describe a person
Required action: Owner policy on unrestricted free-text
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: Yes for Production use
Status: Deferred
```

**H142-DOC-04 — F2 / organization address JSONB**

```text
Finding ID: H142-DOC-04
Source phase: H-140 (including create-path increment)
Exact location: commercial-facts PUTs; organization address JSONB; opportunity/RFP/programme create
Current behavior: Nested person-domain keys rejected before persist on those paths. String values in JSONB unrestricted.
Evidence type: Test
Executable?: Yes (commercial JSON)
Persisted?: Yes
Rejected?: Partial (keys)
Compatibility residue?: communication_preferences leftover (H-140)
Current control: Structural keys
Residual risk: Values can still be personal strings
Required action: Owner policy
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: Yes
Status: Deferred
```

**H142-DOC-05 — AI drafts / ops briefs / knowledge**

```text
Finding ID: H142-DOC-05
Source phase: H-140 / H-141
Exact location: AI draft bodies; ops brief.content (also field-cache); I19 knowledge documents
Current behavior: H-140 did not apply key contract to AI generate. Briefs unscanned. Knowledge not redesigned.
Evidence type: Static; field cache tested for keys only
Executable?: Yes
Persisted?: Yes
Rejected?: Partial / No on some writes
Compatibility residue?: No
Current control: Incomplete vs H-140 covered routes
Residual risk: Unrestricted generated or operational prose
Required action: Owner policy before extending controls
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: Yes
Status: Deferred
```

**H142-DOC-10 — Writes without key contract**

```text
Finding ID: H142-DOC-10
Source phase: H-140 remaining finding 5
Exact location: activity, task, AI draft generate, proposal snapshot, programme item patch, supplier company notes, costing
Current behavior: Not silently given the global key contract (H-140 authorization boundary)
Evidence type: Static / documented
Executable?: Yes
Persisted?: Yes
Rejected?: No (person keys not uniformly applied)
Compatibility residue?: No
Current control: Auth/tenant on those modules as previously implemented; not H-140 key walk
Residual risk: Nested retired keys could be stored if clients send them
Required action: Future authorized increment if Owner/governance authorizes extension — not assumed required
Owner decision required?: Yes (whether to extend)
Migration 126 required?: No
External evidence required?: No
UAT required?: If later changed
Production dependency?: No for documenting the gap
Status: Deferred
```

**H142-DOC-11 — Document metadata / filenames / MIME**

```text
Finding ID: H142-DOC-11
Source phase: H-140
Exact location: document upload metadata; isPersonDomainDocumentFilename
Current behavior: Identity-labelled filenames rejected; MIME allow-list; scan.pdf not rejected. Metadata persisted. Bytes uninspected.
Evidence type: Test
Executable?: Yes
Persisted?: Yes (metadata + bytes)
Rejected?: Partial
Compatibility residue?: No
Current control: Filename labelling incomplete by design
Residual risk: Neutral filenames with personal bytes
Required action: Owner whether incomplete labelling is acceptable
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: Yes
Status: Controlled
```

**H142-DOC-12 — Audit JSONB / historical documents / JSONB rows**

```text
Finding ID: H142-DOC-12
Source phase: H-140
Exact location: audit_events previous_state/new_state JSONB; DocumentStorage objects; commercial JSONB rows
Current behavior: Historical content not deleted. Audit may snapshot commercial objects.
Evidence type: Static; live Unknown
Executable?: Yes (audit continues)
Persisted?: Historical / Yes
Rejected?: No for historical
Compatibility residue?: Possible
Current control: No unauthorized deletion
Residual risk: Unknown historical contents
Required action: Owner treatment; do not invent erasure
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: Live catalogs
UAT required?: Yes
Production dependency?: Yes
Status: Open
```

**H142-DOC-14 — RoPA processing-activity catalogue**

```text
Finding ID: H142-DOC-14
Source phase: H-138 Phase C (carried); listed because this grant requires Owner evaluation
Exact location: privacy / consent-register catalogue UI and APIs (non-identifying titles/status)
Current behavior: Catalogue retained; DSR subject identity and consent person notes removed from UI
Evidence type: Test (H-138); static
Executable?: Yes (catalogue)
Persisted?: Yes (non-identifying fields as designed in those phases)
Rejected?: Identifying fields previously removed
Compatibility residue?: No
Current control: Non-identifying catalogue
Residual risk: Catalogue titles could still be written in a way that identifies someone — not scanned
Required action: Owner whether catalogue remains in scope
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: No for Dev/Test catalogue
Status: Controlled
```

### Notification / logging / field cache (H-141)

**H142-NTF-01 — Recipient email / allowlist**

```text
Finding ID: H142-NTF-01
Source phase: H-141
Exact location: notif_email_allowlist; outbox recipient_email; digest recipients; principal.email
Current behavior: Auth + permission; tenant-scoped list (partner GET 403 tested); arbitrary email strings on allowlist; no Owner recipient rule exists in repository
Evidence type: Test; static (no policy)
Executable?: Yes
Persisted?: Yes
Rejected?: Partial (extra person-domain keys)
Compatibility residue?: No
Current control: Auth/tenant/key contract — not recipient classification
Residual risk: Addresses may identify individuals. Engineering cannot invent org-mailbox rules.
Required action: Owner recipient policy
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: Production email provider if used later
UAT required?: Yes
Production dependency?: Yes
Status: Open
```

**H142-NTF-04 — Outbox bodies / failed sends / historical outbox**

```text
Finding ID: H142-NTF-04
Source phase: H-141
Exact location: notif_email_outbox body_text/subject; SMTP/SES adapters persist failed rows; HTTP list omits bodyText
Current behavior: Commercial persist including failed send. HTTP hides bodies. Skip reasons are codes. Historical rows not deleted. Live contents Unknown.
Evidence type: Test (omit body, skip codes); static (persist-on-fail)
Executable?: Yes
Persisted?: Yes / Historical Unknown
Rejected?: Person keys on template/allowlist Yes; failed-send persist is not a validation reject
Compatibility residue?: No
Current control: Auth; HTTP omit; no scanner
Residual risk: Bodies can contain personal prose
Required action: Owner whether outbox remains required, whether bodies may be retained
Owner decision required?: Yes
Migration 126 required?: No unless Owner later wants column change
External evidence required?: Live DB; Production SES
UAT required?: Yes
Production dependency?: Yes
Status: Deferred
```

**H142-NTF-06 — Allowlist email in inbox body; templates; exports; SES payload**

```text
Finding ID: H142-NTF-06
Source phase: H-141
Exact location: notifications.ts interpolates entry.email; templates; allowlist/DLQ exports; SES includePayload
Current behavior: Live inbox can show an email string. Exports emit emails by design. SES JSONB can be returned if includePayload.
Evidence type: Static; template upsert tested
Executable?: Yes
Persisted?: Yes
Rejected?: Keys on template PUT Yes; string values No
Compatibility residue?: No
Current control: Key contract on templates
Residual risk: Unscanned subjects/bodies/exports
Required action: Owner policy
Owner decision required?: Yes
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: Yes
Status: Deferred
```

**H142-NTF-09 — WhatsApp outbound**

```text
Finding ID: H142-NTF-09
Source phase: H-141
Exact location: no send adapter found; commercial channel enum whatsapp; leftover SupContact.whatsapp type
Current behavior: No WhatsApp notification dispatch
Evidence type: Static search
Executable?: No (dispatch)
Persisted?: Historical type/schema residue only
Rejected?: N/A dispatch
Compatibility residue?: Yes
Current control: No adapter
Residual risk: Channel label is not a message store
Required action: None for dispatch; leftover type is IMP-07 class
Owner decision required?: No for “no adapter”
Migration 126 required?: No
External evidence required?: No
UAT required?: No
Production dependency?: No
Status: Controlled
```

**H142-LOG-03 — Named redaction incomplete**

```text
Finding ID: H142-LOG-03
Source phase: H-140 / H-141
Exact location: apps/api/src/observability.ts REDACT_KEYS includes recipientEmail, bodyText, bodyHtml, contentBase64, whatsapp, CRM-aligned person keys, secrets/tokens/passwords
Current behavior: Those keys redacted when logged as fields. request_completed does not log bodies; path has no query (tested). Other key names (e.g. to) and err.message / SMTP lines are not automatically redacted. Deployed runtime logs not verified.
Evidence type: Test (named probes); static
Executable?: Logger yes
Persisted?: Test stdout; Production sink not selected
Rejected?: N/A
Compatibility residue?: No
Current control: Key-name redaction — NOT full log privacy
Residual risk: Personal data under other field names
Required action: Do not claim logs are fully privacy-safe
Owner decision required?: Yes for completeness bar
Migration 126 required?: No
External evidence required?: Production log destination
UAT required?: Runtime log review
Production dependency?: Yes
Status: Controlled
```

**H142-FC-07 — IndexedDB / service worker**

```text
Finding ID: H142-FC-07
Source phase: H-141
Exact location: repository search for indexedDB / serviceWorker / caches.open
Current behavior: No IndexedDB or service-worker cache implementation found
Evidence type: Static
Executable?: No
Persisted?: No
Rejected?: N/A
Compatibility residue?: No
Current control: Mechanism not present
Residual risk: None from those stores
Required action: None
Owner decision required?: No
Migration 126 required?: No
External evidence required?: No
UAT required?: No
Production dependency?: No
Status: Resolved
```

**H142-FC-01 — Field cache principal / logout / switch**

```text
Finding ID: H142-FC-01
Source phase: H-141
Exact location: apps/web/src/lib/field-offline-cache.ts; eos-session.ts
Current behavior: Read fail-closed without matching principal; AES-GCM blob; logout and storeSession clear cache+meta; device id/salt remain; TTL not auto-deleted; person-domain keys rejected on write/delta/push; briefs unscanned. Tests used in-memory Storage stub, not a real browser.
Evidence type: Test (stub); static
Executable?: Yes (field pages)
Persisted?: Encrypted blob while cached
Rejected?: Person-domain keys Yes
Compatibility residue?: Legacy plaintext parse only if principal matches
Current control: Principal gating + clear + encryption + key reject
Residual risk: Operational prose in blob; stub ≠ browser; salt remains
Required action: Owner cache-retention policy; UAT browser
Owner decision required?: Yes (retention/salt/TTL)
Migration 126 required?: No
External evidence required?: No
UAT required?: Yes
Production dependency?: Yes to claim Production cache safety
Status: Controlled
```

---

## 5. Owner Decision Register

Engineering **cannot** choose these. Where unknown:

```text
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-01 Generic commercial CSV content

```text
Decision ID: OD-01
Question: May approved commercial CSV cells contain unstructured personal data, or must they be further constrained later?
Why engineering cannot decide it unilaterally: Would invent privacy/commercial policy
Available options: (a) accept residual capability; (b) later process/policy only; (c) later technical constraint; (d) later stop storing csv_content — listed without preference
Technical consequence of each option: (a) no code; (b) no code; (c) possible validation/schema; (d) schema/API change
Privacy/commercial consequence: (a) residual capability remains; (c)(d) may affect organization/supplier import usability
Whether schema/migration would be required: Only if Owner later chooses a schema option
Whether UAT would be required: Yes for operator import
Whether Production evidence would be required: Yes for Production import
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-02 Historical import batches

```text
Decision ID: OD-02
Question: How should historical import batches (if any exist in a catalog) be treated?
Why engineering cannot decide it unilaterally: Deletion/retention is Owner/legal; H-139 forbade unauthorized deletion
Available options: (a) leave in place; (b) Owner-authorized review extract; (c) later treatment migration — no preference
Technical consequence: (a) none; (b) read-only evidence; (c) schema/data change if later authorized
Privacy/commercial consequence: Unknown contents until inspected
Whether schema/migration would be required: Only if (c)
Whether UAT would be required: Yes if UAT DB may contain leftovers
Whether Production evidence would be required: Yes if any Production catalog is later authorized
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-03 Historical notification outbox records

```text
Decision ID: OD-03
Question: How should historical outbox/allowlist/SES rows be treated?
Why engineering cannot decide it unilaterally: Retention/erasure policy
Available options: (a) leave; (b) review extract; (c) later treatment — no preference
Technical consequence: (c) may need later migration
Privacy/commercial consequence: Bodies/recipients may identify people if rows exist
Whether schema/migration would be required: Only if Owner later chooses structural treatment
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-04 Notification recipient policy

```text
Decision ID: OD-04
Question: Who may be a notification recipient (individual address, shared mailbox, role, principal id only)?
Why engineering cannot decide it unilaterally: Would invent recipient rules
Available options: (a) leave current allowlist/principal.email; (b) later policy restriction; (c) later redesign; (d) disable outbound email until specified — no preference
Technical consequence: (a) none; (b)(c) API/schema possible; (d) feature off
Privacy/commercial consequence: Operational email vs individual identification
Whether schema/migration would be required: Unknown until option chosen
Whether UAT would be required: Yes
Whether Production evidence would be required: Email provider if Production mail is used
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-05 Notification retention

```text
Decision ID: OD-05
Question: How long may notification records be kept?
Why engineering cannot decide it unilaterally: Would invent a retention period
Available options: (a) unspecified continue; (b) later defined period; (c) later drop fields — no period invented here
Technical consequence: (b)(c) jobs or schema
Privacy/commercial consequence: Retention vs operational audit of sends
Whether schema/migration would be required: If columns change
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-06 Whether notification outbox functionality remains required

```text
Decision ID: OD-06
Question: Must email outbox remain part of EOS, or may it later be reduced/removed?
Why engineering cannot decide it unilaterally: Commercial/product requirement
Available options: (a) keep; (b) later reduce; (c) later remove — no preference
Technical consequence: (b)(c) substantial product change, out of H-142
Privacy/commercial consequence: Staff notification workflows
Whether schema/migration would be required: If removed later
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-07 Whether email body content may be retained

```text
Decision ID: OD-07
Question: May outbox/template/SES bodies retain message text?
Why engineering cannot decide it unilaterally: Content retention policy
Available options: (a) keep current persist; (b) later omit bodies; (c) later store ids only — no preference
Technical consequence: (b)(c) API/schema
Privacy/commercial consequence: Debugging vs personal prose in bodies
Whether schema/migration would be required: Possibly later
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-08 Whether file bytes must remain content-unscanned

```text
Decision ID: OD-08
Question: Is structural key/filename/MIME control the accepted DocumentStorage bar, or must content inspection be specified later?
Why engineering cannot decide it unilaterally: Would invent DLP/OCR/classification
Available options: (a) remain unscanned; (b) later specify inspection; (c) later restrict kinds — no preference, no scanner designed
Technical consequence: (b) new product; (c) policy + possible MIME/kind changes
Privacy/commercial consequence: Opaque commercial files vs inspection cost
Whether schema/migration would be required: Not for (a)
Whether UAT would be required: Yes
Whether Production evidence would be required: Object store if Production
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-09 Whether free-text may remain unrestricted beyond structural keys

```text
Decision ID: OD-09
Question: May notes, briefs, JSON strings, and similar prose remain semantically unrestricted aside from person-domain object keys?
Why engineering cannot decide it unilaterally: Would invent a content rule
Available options: (a) accept residual prose; (b) later structure fields; (c) later inspection — no preference
Technical consequence: (b)(c) later authorized engineering
Privacy/commercial consequence: Commercial writing vs residual personal-data capability
Whether schema/migration would be required: If structured replacements
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-10 Historical DocumentStorage content

```text
Decision ID: OD-10
Question: How should already-stored documents be treated?
Why engineering cannot decide it unilaterally: Historical deletion forbidden in H-140
Available options: (a) leave; (b) review; (c) later treatment — no preference
Technical consequence: (c) storage/API change if later authorized
Privacy/commercial consequence: Unknown file contents
Whether schema/migration would be required: Unknown
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-11 Historical JSONB content

```text
Decision ID: OD-11
Question: How should historical JSONB (facts, addresses, audit snapshots) be treated?
Why engineering cannot decide it unilaterally: Same as OD-10
Available options: (a) leave; (b) review; (c) later treatment — no preference
Technical consequence: (c) possible later migration
Privacy/commercial consequence: Unknown values
Whether schema/migration would be required: If (c)
Whether UAT would be required: Yes
Whether Production evidence would be required: Yes
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-12 Migration 126

```text
Decision ID: OD-12
Question: Should a future forward-only migration retire stale import-batch CHECK values listing contact / supplier_contact?
Why engineering cannot decide it unilaterally: Schema change requires Owner authorization; H-142 must not invent that 126 is mandatory
Available options: (a) leave CHECKs; (b) later authorize a migration to tighten CHECKs only; (c) later broader schema cleanup — no preference
Technical consequence: (b) DROP/ADD CHECK; risk if leftover rows use retired tokens
Privacy/commercial consequence: Catalog hygiene vs no change to current API fail-closed
Whether schema/migration would be required: Yes if (b) or (c)
Whether UAT would be required: Yes if applied
Whether Production evidence would be required: Yes if ever applied to Production
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-13 Compatibility residues

```text
Decision ID: OD-13
Question: Keep dead types/docs (SupContact, guestName shims, SupplierContactRecord JSON, manifest_entry type) or later clean them?
Why engineering cannot decide it unilaterally: Hygiene vs historical evidence preservation
Available options: (a) keep; (b) later cleanup increment — no preference
Technical consequence: (b) type/doc edits; not a person API reopen
Privacy/commercial consequence: Low if unwired
Whether schema/migration would be required: No for types
Whether UAT would be required: If UI types change
Whether Production evidence would be required: No
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-14 Sample CSV / documentation artifacts

```text
Decision ID: OD-14
Question: Retain retired supplier-contacts.csv and related docs as historical samples?
Why engineering cannot decide it unilaterally: Historical evidence vs operator confusion
Available options: (a) retain labelled retired; (b) later delete if authorized — no preference; file not deleted in H-142
Technical consequence: None for (a)
Privacy/commercial consequence: Sample contains person-shaped columns as a retired example
Whether schema/migration would be required: No
Whether UAT would be required: Operator awareness
Whether Production evidence would be required: No
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-15 Non-identifying processing-activity catalogue

```text
Decision ID: OD-15
Question: Does the RoPA processing-activity catalogue remain in intended scope as a non-identifying register?
Why engineering cannot decide it unilaterally: Privacy-programme product scope
Available options: (a) keep as now; (b) later change catalogue fields; (c) later remove — no preference
Technical consequence: (b)(c) later API/UI
Privacy/commercial consequence: GRC catalogue vs residual free-text titles
Whether schema/migration would be required: If fields change
Whether UAT would be required: Yes
Whether Production evidence would be required: If Production GRC is used
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

### OD-16 Field-cache retention / device salt (discovered)

```text
Decision ID: OD-16
Question: Required field-cache lifetime and whether device id/salt must be cleared on logout?
Why engineering cannot decide it unilaterally: Retention/device policy
Available options: (a) keep current bind+clear blobs; (b) later clear salt; (c) later TTL enforce; (d) later disable cache — no preference
Technical consequence: Client storage behaviour
Privacy/commercial consequence: Offline field ops vs leftover crypto material
Whether schema/migration would be required: No
Whether UAT would be required: Yes (browser)
Whether Production evidence would be required: Yes to claim Production cache safety
Current Owner decision: OPEN — OWNER DECISION REQUIRED
Status: Open
```

---

## 6. Migration 126 assessment

```text
Migration 126: NOT CREATED
Migration 125: unmodified
Live migration: NONE
```

**Assessment outcome:**

```text
POSSIBLY REQUIRED — OWNER DECISION FIRST
```

Basis (factual, not an invented mandate):

- Application already rejects `contact` / `supplier_contact` import before persist (**tested** H-139).
- PostgreSQL CHECK strings in 010 and 014 still list those tokens (**static**). That is **compatibility/history residue**, not a demonstrated live executable person-contact table (125 dropped `crm_contacts` / `sup_contacts`).
- Changing CHECK text needs a **new forward-only migration** if Owner later wants catalog hygiene. Editing 010/014/125 is forbidden by repository convention.
- Findings that can be handled **without** schema change: API fail-closed, sample CSV labelling, logger keys, field-cache client controls, structural JSON keys.
- Outbox body columns are **not** a 126 candidate unless Owner later chooses a schema option under OD-07.

Not used: `REQUIRED — TECHNICAL BASIS IDENTIFIED` as a current mandate to create 126. Not `NOT REQUIRED` in the absolute sense for CHECK hygiene. Live catalog `\d` was **not** run → residue on a given database is **not fully determined**.

---

## 7. Engineering recommendation matrix

Future work **must not** bypass these gates. Nothing below is authorized to start.

### A. Safe engineering work

After ordinary later governance authorization, without inventing new privacy policy:

- Keep person-domain import/UI/API fail-closed (already done).
- Browser-level tests of existing cache clear behaviour.
- Compatibility type cleanup **only if** OD-13 later says cleanup.
- Named log-key additions that match an **already established** forbid-list.

### B. Owner-policy-dependent work

All of OD-01–OD-16. No implementation until the Owner records a decision.

### C. Schema/migration-dependent work

CHECK tighten (OD-12) or any later column drop for outbox/CSV **after** Owner decision. **Do not create 126 now.**

### D. External-evidence-dependent work

PDPC; EI-01; ADR-0006; DP-0006; Production email/object-store/log sink documentation.

### E. UAT-dependent work

Operator CSV/files/notes; live UAT DB CHECKs and historical rows; real-browser cache; runtime logs.

### F. Production-dependent work

Hosting, credentials, SES, DocumentStorage provider, Production migrate, Production logging. Not authorized.

---

## 8. Commercial impact

Factual usability in Dev/Test as evidenced by prior phases (H-142 did not re-run commercial workflows):

| Area | Remains usable today (Dev/Test, as previously tested or inspected) | Residual privacy finding that could later affect it |
| --- | --- | --- |
| Organizations/accounts | Yes (H-139/H-140 tests) | CSV cells; notes; company email/address |
| Opportunity/RFP | Create/patch paths with key reject (H-140); full chain not all re-run | Notes/files/JSON strings |
| Suppliers and rates | Company/rate import preserved; person contact import closed | Company fields; CHECK residue irrelevant to rates API |
| Bookings / field ops | I9 sync tested; cache stub-tested | Briefs in cache (OD-16/OD-09) |
| Costing / proposals / Rate Identity | Code present; **not** claimed workflow-verified in H-141 or H-142 | If Owner later extends key contract or free-text rules |
| Commercial documents | PDF upload tested H-140 | Unscanned bytes (OD-08/OD-10) |
| Notes | CRM notes tested | Unrestricted prose (OD-09) |
| Notifications | Inbox/template/allowlist tested H-141 | Recipients/bodies (OD-04–OD-07) |
| Imports/exports | Org/supplier commercial import tested; person types closed; exports still emit emails | OD-01, OD-04 |

EOS is **not** claimed Production-ready. EOS is **not** claimed fully compliant with Tanzanian data-protection requirements. PDPC remains OPEN.

---

## 9. Unresolved external evidence

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
```

Also unresolved outside the repo: Production email provider, object storage, log sink, live catalog extracts, TIN certificate (EI-01).

---

## 10. UAT implications

```text
UAT: NOT STARTED
```

UAT would be required to close G-category items (operator residual capability, live DB, real browser, runtime logs). UAT cannot close PDPC, EI-01, ADR-0006, or DP-0006 by itself. H-142 does not start UAT.

---

## 11. Production implications

```text
PRODUCTION: NOT AUTHORIZED / NOT READY
productionReady = false
```

Production cannot be claimed on the basis of fail-closed person APIs while generic surfaces remain capable of holding personal data and Owner decisions remain OPEN. No Production credentials, deploy, or migrate.

---

## 12. Stop conditions

```text
STOPPED AFTER H-142: YES
COMMIT: NONE
PUSH: NONE
MIGRATION 126: NOT CREATED
LIVE MIGRATION: NONE
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
Application code: unmodified this increment
Historical H-139 / H-140 / H-141 records: unmodified
```

Do not proceed automatically to H-143.

---

## 13. Final H-142 disposition

```text
PASS WITH FINDINGS
```

H-142 is a governance consolidation. Known policy, CHECK-residue, external-evidence, UAT, and Production dependencies remain. Dedicated person-domain create paths remain fail-closed per prior tests; that is **not** treated as “cannot technically exist anywhere.” No option was chosen on the Owner’s behalf.

Not PASS: OPEN Owner decisions and residual capabilities remain.  
Not BLOCKED: register completed without requiring unauthorized implementation; no retired person path was reopened.

---

## Finding count summary

| Status | IDs | Count |
| --- | --- | --- |
| Resolved | IMP-08, FC-07 | 2 |
| Controlled | IMP-04, IMP-07, IMP-09, DOC-11, DOC-14, NTF-09, LOG-03, FC-01 | 8 |
| Deferred | IMP-05, DOC-01, DOC-02, DOC-04, DOC-05, DOC-10, NTF-04, NTF-06 | 8 |
| Open | IMP-01, IMP-02, IMP-06, DOC-12, NTF-01 | 5 |
| Blocked | (none as H-142 execution blocks) | 0 |

**Findings in register: 23** (FC-07 recorded in §3.A as IndexedDB/service-worker not present).  
**Owner decisions: OD-01–OD-16 (16), all `OPEN — OWNER DECISION REQUIRED`.**
