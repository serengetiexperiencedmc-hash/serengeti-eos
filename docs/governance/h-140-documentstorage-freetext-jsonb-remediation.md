# H-140 — DocumentStorage, Free-Text and JSONB Privacy Boundary Remediation

> **AUTHORIZED ASSESSMENT / REMEDIATION RECORD — Dev/Test only.**  
> This is **not** UAT, **not** Production, **not** a PDPC exemption or compliance claim, **not** a personal-data scanner, and **not** a live-database validation.  
> Historical artefacts `h-138-phase-c-personal-data-ui-remediation.md`, `h-138-import-ingestion-personal-data-remediation.md`, `h-139-import-ingestion-personal-data-remediation.md`, and `h-139-residual-import-hardening.md` were **not renamed, deleted, merged, or overwritten**.  
> This file is the authorized H-140 path. The earlier H-140 implementation increment in this same path is **retained and expanded** under the privacy-boundary grant (complete inventory + remaining safe create-path / logging alignment).

**Date:** 2026-09-22.  
**Authorization:** ChatGPT governance layer / Owner grant — H-140 DocumentStorage, free-text and JSONB privacy-boundary assessment/remediation.  
**Commit / push:** **NONE**.  
**Live migration:** **NONE**.  
**Migration 126:** **NOT CREATED**.

---

## 1. Objective and authorization boundary

Objective: assess whether removing dedicated person-data domains has been undermined by unrestricted generic content surfaces (DocumentStorage, free-text, JSONB, commercial CSV, notes/briefs/RFP/programme/AI bodies, organization/supplier metadata, document metadata/upload paths, client-side storage and API payloads). Remediate only where a contract is already established and no Owner policy, retention rule, legal conclusion, schema migration, or commercial redesign is required.

Authorization boundary (observed and followed):

```text
H-140 DOCUMENTSTORAGE / FREETEXT / JSONB PRIVACY BOUNDARY — AUTHORIZED
Dev/Test only
Do not commit / push / reset / clean / stash / revert / discard
Do not alter Production
Do not run live database migrations
Do not create migration 126 unless unavoidable and Owner-authorized (not created)
Do not claim UAT, Production readiness, EOS adoption, or live database validation
Do not invent privacy, legal, commercial, retention, or data-classification rules
Do not silently broaden into a general application redesign
Preserve historical governance artefacts
```

Implemented control remains **structural**, not a scanner: retired person-domain **object keys** (including nested JSON) and explicit identity-document **filename labels**. Free-text string values, CSV cell values, and opaque file bytes are **not inspected**. Generic commercial content is **not** treated as inherently non-personal.

Governance conditions carried forward (unchanged):

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
UAT: NOT STARTED
Production: NOT AUTHORIZED / NOT READY
```

---

## 2. Repository baseline before and after

**Before this privacy-boundary increment (working tree already dirty from prior authorized work):**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
branch: master
index: empty
porcelain count: 612
```

Expected known baseline from the grant (`porcelain 606`) is the count **before the first H-140 implementation increment**. Observed at the start of this increment: **612**. HEAD, branch, and empty index match. All existing changes were treated as protected.

**After this increment:**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba (unchanged)
branch: master (unchanged)
index: empty (unchanged)
porcelain count: 612
COMMIT: NONE
PUSH: NONE
```

No new untracked files were added; edits were confined to the already-dirty worktree. Historical H-138/H-139 artefacts remain present.

---

## 3. Files inspected

Inspected (read and/or searched; not all modified):

**DocumentStorage / commercial documents**

- `packages/kernel/src/commercial-document.ts`
- `packages/db/migrations/119_cd_commercial_documents.sql`
- `apps/api/src/commercial-documents/service.ts`
- `apps/api/src/commercial-documents/storage.ts`
- `apps/api/src/commercial-documents/routes.ts`
- `apps/api/src/persistence/commercial-document-repository.ts`
- `apps/web/src/app/commercial/rfps/[id]/page.tsx`

**Free-text / commercial writes**

- `apps/api/src/crm/note.ts`
- `apps/api/src/crm/organization.ts`
- `apps/api/src/crm/activity.ts`
- `apps/api/src/pipeline/opportunity.ts`
- `apps/api/src/rfp/rfp.ts`
- `apps/api/src/programme/programme.ts`
- `apps/api/src/ai/drafts.ts`
- `packages/kernel/src/crm.ts`
- `packages/kernel/src/opportunity.ts`
- `packages/kernel/src/programme.ts`
- `packages/kernel/src/supplier.ts`
- `packages/kernel/src/rfp.ts`
- `packages/kernel/src/ops-field.ts`
- `packages/kernel/src/knowledge.ts`

**JSONB / metadata / CSV**

- `packages/db/migrations/004_c1_crm.sql`
- `packages/db/migrations/010_c1_merge_import.sql`
- `packages/db/migrations/014_c4_supplier.sql`
- `packages/db/migrations/020_c8_proposal.sql`
- `packages/db/migrations/026_i9_field_sync.sql`
- `packages/db/migrations/122_cd_programme_item_extensions.sql`
- `packages/db/migrations/124_f2_dp01_commercial_facts.sql`
- `packages/db/schema.sql`
- `apps/api/src/crm/import.ts`
- `apps/api/src/supplier/import.ts`
- `apps/api/src/persistence/pg-repository.ts`
- `apps/api/src/commercial-facts/{service,account,programme,rate-identity,path-b}.ts`

**Auth / logging / client storage / reintroduction**

- `apps/api/src/observability.ts`
- `packages/kernel/src/crm-events.ts`
- `apps/web/src/lib/eos-session.ts`
- `apps/web/src/lib/field-offline-cache.ts`
- `apps/web/src/lib/{crm-api,suppliers-api,ops-api,hr-api}.ts`
- `apps/api/src/notifications/notifications.ts`
- `packages/kernel/src/personal-data-content-contract.ts`
- `apps/api/src/personal-data-content-contract.ts`

**Prior governance (read; not overwritten)**

- `docs/governance/h-140-documentstorage-freetext-jsonb-remediation.md` (this file, expanded)
- `docs/governance/h-139-residual-import-hardening.md` (carried findings only)

---

## 4. DocumentStorage inventory

| Item | Observed evidence | Classification |
| --- | --- | --- |
| Schema | `commercial_documents` in `119_cd_commercial_documents.sql`. Metadata in PostgreSQL; bytes **not** in PG (`storage_ref`). Kinds `rfp\|contract\|rate_sheet\|other`. Status `active\|superseded\|deleted`. Tenant FK. Optional `rfp_id` / `supplier_id` / `contract_id`. Classification default `Confidential`. | **RETAIN WITH CONTROL** |
| Model | `packages/kernel/src/commercial-document.ts` `CommercialDocument` + `DocumentStorage` port. | **RETAIN WITH CONTROL** |
| Upload APIs | `POST /v1/rfps/:id/documents` (and service used for supplier/contract uploads). Auth header required. | **RETAIN WITH CONTROL** |
| Download APIs | `GET /v1/commercial-documents/:id` (metadata, sanitized). `GET /v1/commercial-documents/:id/content` returns `contentBase64`. Auth + `commercialDocument:read:document`. Tenant scoped by `tenant_id` / in-memory `tenantId`. | **RETAIN WITH CONTROL** |
| List | `GET /v1/rfps/:id/documents` tenant + RFP scoped. | **RETAIN WITH CONTROL** |
| HTTP delete | **Observed:** commercial-document routes do **not** register HTTP delete. Storage `delete` exists for compensation after failed persist. | **DEFER WITH DOCUMENTED FINDING** |
| Metadata fields | filename, mimeType, sizeBytes, checksumSha256, storageRef, kind, version, rfp/supplier/contract ids, classification, principals, timestamps. Sanitize omits `storage_ref` and `tenantId` from HTTP body. | **RETAIN WITH CONTROL** |
| File types | MIME allowlist: PDF, DOCX, XLSX, CSV, JPEG, PNG. Max 10 MiB. | **RETAIN WITH CONTROL** |
| File content handling | Opaque `Buffer` via `LocalFsDocumentStorage.put/get`. **No** content scan. Path `{root}/{tenantId}/{documentId}`. Path-safe filename (no `..` `/` `\`). | **RETAIN WITH CONTROL** (bytes remain capable of holding personal data) |
| Storage provider | `LocalFsDocumentStorage` — **Dev/Test only**. Comment states S3/Azure/GCS are future. ADR-0006 remains OPEN. | **RETAIN WITH CONTROL** |
| Commercial references | RFP, supplier, contract FKs on metadata. | **RETAIN WITH CONTROL** |
| Access control | `principalFromAuthHeader` 401; Human-only mutate (`ai_actor`); `authorize` `commercialDocument:write:document` / `read:document`. | **RETAIN WITH CONTROL** (static + targeted tests; not a full security assessment) |
| Tenant scoping | `storageRef` prefixed with `tenantId`; metadata queries include `tenant_id`. Cross-tenant isolation **tested** in `cd-phase1-foundation.test.ts`, not re-proven as a full security audit. | **RETAIN WITH CONTROL** |
| Can files contain names / email / phone / guests / passports / employees / supplier individuals / correspondence? | **Inferred from capability:** yes. PDF/DOCX/XLSX/CSV/JPEG/PNG can hold any of those. Filename labels `passport`, `guest-list`, `employee-record`, `identity-doc`, `visa-copy`, `dietary-list` are rejected. Other filenames are accepted. Bytes are not scanned. | **RETAIN WITH CONTROL** + residual finding |
| H-140 filename / metadata keys | Person-domain object keys on the upload request rejected after authorize, before `put`. Identity-labelled filenames rejected before `put`. **Tested:** commercial PDF persists; `guestName` metadata and `passport-scan.pdf` do not. | **RETAIN WITH CONTROL** |

Do not treat a commercial filename as proof the file is non-personal. **No evidence** in this increment of actual identity documents having been uploaded in Dev/Test; the **capability** remains.

Commercial documents were **not** deleted or disabled.

---

## 5. Free-text inventory

| Surface | Location | API / UI | Required for commercial workflow? | Can contain arbitrary personal data? | Validation / restrictions | Persisted? | Export / logs | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM note `body` | `crm_notes` / `CrmNote.body` / `apps/api/src/crm/note.ts` | `POST /v1/crm/notes`; commercial UI | Yes (organization/account/activity notes) | **Yes** (prose) | Length/`body_required`; `entityType=contact` already `person_domain_removed`; extra person-domain **keys** rejected | Yes | CRM events forbid `body` in domain-event payload. HTTP returns note body to authorized callers. `request_completed` does not log body. | **RETAIN WITH CONTROL** |
| Organization legal/trading name, website, domain | `crm_organizations` | CRM org APIs / UI | Yes | Names are organization-oriented; values not classified as personal vs business | Legal-name validation exists; not a PD scanner | Yes | Org create event payload uses legalName (commercial). | **RETAIN WITH NON-PERSONAL CONTRACT** (company identity) |
| Organization `primaryEmail` / `primaryTelephone` | same | CRM org APIs / UI | Observed as organization commercial fields | **Yes** — a personal mailbox/number can be typed; not mechanically distinguishable | No personal-vs-business validator | Yes | Sanitize returns these fields to API. Logger now redacts keys `primaryEmail`/`primaryTelephone`/`email`/`telephone` **if those keys are logged**. | **DEFER WITH DOCUMENTED FINDING** — Owner policy required to constrain values |
| Opportunity `title` / `programmeSummary` | `opp_opportunities` | pipeline APIs / UI | Yes | **Yes** (prose) | Title required; person-domain **keys** on create rejected this increment | Yes | Not scanned | **RETAIN WITH CONTROL** (keys); body unscanned |
| Opportunity stage-history `notes` | `OppStageHistory.notes` | stage transition | Commercial audit note | **Yes** | No body scanner; key contract not applied to every transition payload | Yes | Deferred | **DEFER WITH DOCUMENTED FINDING** |
| RFP `notes` / `requirementsText` | `rfp_rfps` / `rfp.ts` | create/patch + RFP UI | Yes | **Yes** | Person-domain **keys** on create and patch rejected; string values not scanned | Yes | API returns notes to authorized callers | **RETAIN WITH CONTROL** |
| Programme `internalNotes` / `clientNotes` / item `description`/`notes` | `programme.ts` / kernel programme | programme APIs / UI | Yes | **Yes** | Person-domain **keys** on create/patch rejected this increment; F2 facts PUT already covered; item description not key-checked on every item write | Yes | Unscanned prose | **RETAIN WITH CONTROL** (programme header keys); item/body **DEFER** for scanning |
| Ops briefs | `ops-field.ts` | field ops | Operational | **Yes** | Out of scope to redesign | Yes / cache | Field cache | **DEFER WITH DOCUMENTED FINDING** |
| Proposal snapshot text | `020_c8_proposal.sql` `snapshot JSONB` | proposal APIs | Yes | **Possible** inside snapshot | Not scanned this increment | Yes | Untested this increment | **DEFER WITH DOCUMENTED FINDING** |
| Supplier company `notes` / `email` / `telephone` / `address` (TEXT) | `packages/kernel/src/supplier.ts` `SupSupplier` | supplier APIs | Company commercial | Email/telephone **can** be personal; `SupContact` individual fields remain in the **type** but writes are retired | Individual contact import/API retired (H-136–H-139) | Company fields yes | CSV sanitize omits `csvContent` from HTTP | **RETAIN WITH NON-PERSONAL CONTRACT** (company); individual contact path **REMOVE** (already fail-closed) |
| Rate `notes` | supplier rates | supplier rate APIs | Commercial | **Yes** (prose) | Rate Identity PUT keys rejected; rate-row notes not scanned | Yes | Untested this increment | **RETAIN WITH CONTROL** (Rate Identity keys) / notes body **DEFER** |
| Field-ops task notes | `ops-field.ts` | field UI + localStorage | Operational | **Yes** | Encrypted field cache; not redesigned | localStorage + sync JSONB | **DEFER WITH DOCUMENTED FINDING** |
| Activity `notes` / task `description` | `crm.ts` / `activity.ts` / `task.ts` | CRM APIs | Yes | **Yes** | Contact-linked writes already `person_domain_removed`; extra keys not applied to every activity/task persist | Yes | **DEFER WITH DOCUMENTED FINDING** (key contract not universal) |
| AI draft `body` | `apps/api/src/ai/drafts.ts` | AI draft APIs | Generated commercial artefact | **Yes** (generated or copied prose) | Artefact builder; no person-key ingest added; bodies unconstrained text | In-memory + `persistAiDraft` | Can be copied into activity/task notes | **DEFER WITH DOCUMENTED FINDING** |
| Import `csv_content` | see section 7 | import APIs | Yes for org/supplier commercial import | **Yes** for accepted entity types | Person entity types cannot create batches; HTTP sanitize omits CSV | Yes (TEXT) | Events forbid `csvContent`; logger redacts key if logged | **DEFER WITH DOCUMENTED FINDING** |
| Audit `previous_state` / `new_state` / `evidence` JSONB | `schema.sql` `audit_events` | internal | Audit | **Possible** if mutate audit stores full entities | CRM domain events forbid listed PII keys; allow-audit may still snapshot commercial objects | Yes | **DEFER WITH DOCUMENTED FINDING** — do not redesign audit |
| Notification `body` | `apps/api/src/notifications/notifications.ts` | notification APIs | Operational | Observed bodies use commercial codes/titles; one path interpolates `entry.email` (allowlist / approval — **not** a new person-domain store; still an email string in a notification) | Out of scope to redesign | Yes | **DEFER WITH DOCUMENTED FINDING** |
| Knowledge document body | `packages/kernel/src/knowledge.ts` | knowledge register | Knowledge | **Yes** | Not DocumentStorage; not scanned | Yes | **DEFER WITH DOCUMENTED FINDING** |

No replacement text or new field semantics were invented.

---

## 6. JSONB inventory

| Field | Location | Arbitrary keys/values? | Nested personal data? | Validation | Exposed | Necessary now? | Migration 126? | Owner decision? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `crm_organizations.address` | `004_c1_crm.sql` | **Observed:** stored as provided object | **Yes** if nested person keys/values | This increment rejects nested/retired person-domain **keys** on create/update. String values inside address are not scanned. | API sanitize includes `address` | Commercial org location | No | Value-level personal vs business address **requires Owner** |
| `communication_preferences` | `004_c1_crm.sql` (historical contact column) | N/A for new writes | Contact domain retired | Contact writes `person_domain_removed` | Retired API | No for current commercial SoW | Do not drop without Owner-authorized schema work | Leftover column **REQUIRES OWNER DECISION** if physical drop wanted |
| F2 commercial facts `payload` | `124_f2_dp01_commercial_facts.sql` | HTTP maps known fields; extra person **keys** rejected | Nested keys walked | Typed TS objects + key reject | F2 panels / APIs | Yes | No | No for current typed overlay |
| Import `validation_results` | `010` / `014` | Structured row results | May echo invalid cell text | Import engine | HTTP batch (CSV omitted) | Yes | No | Residual CSV cell echo **DEFER** |
| Merge `affected_counts` / `field_resolutions` / `merged_ids` | `004` / `010` | Structured | Organization merge only after H-136 | Merge engine | Merge APIs | Yes | No | No |
| Proposal `snapshot` | `020_c8_proposal.sql` | Snapshot object | **Possible** | Proposal module; not in this increment’s key contract | Proposal APIs | Yes | No | **DEFER** — do not redesign proposals here |
| Programme item `snapshot` | `122_cd_programme_item_extensions.sql` | Snapshot | **Possible** | Programme versions | Programme APIs | Yes | No | **DEFER** |
| Field sync `server_payload` / `client_payload` | `026_i9_field_sync.sql` | Sync bundle | **Possible** operational notes; guest-level types retired in UI/API | Field sync | Field cache | Operational | No | **DEFER** (field-ops out of redesign scope) |
| Outbox `payload` / envelope | `003_i4` / `schema.sql` | Event payloads | CRM catalogue **forbids** `csvContent`, `body`, `email`, passport keys, etc. | Event catalogue | Consumers | Yes | No | Residual if a non-CRM event includes prose |
| Audit JSONB | `schema.sql` | Entity snapshots | **Possible** | Hash chain; not a PD scanner | Audit APIs | Yes | No | **DEFER** |
| ABAC `body` / workflow `graph` / `context` | `001`/`002` | Policy JSON | Unlikely PII; not assessed as commercial PD | Admin | Admin APIs | Yes | No | Out of H-140 commercial scope |
| Config `value` | `schema.sql` | JSON | Possible secrets; observability redacts password-like keys | Config | Admin | Yes | No | Out of scope |
| Idempotency `response` | `schema.sql` | Cached HTTP JSON | May include commercial notes returned by APIs | Idempotency | Internal | Yes | No | **DEFER** |
| Admin `attributes` | `001_i1_admin_shell.sql` | JSON | Unknown | Admin | Admin | Existing | No | Out of scope |
| Finance `matched_payment_ids` | `025_i8` | IDs array | Not person-domain | Finance | Finance | Yes | No | Out of scope |
| SES `payload` | `041_i36` | Delivery events | May include email addresses for delivery | Notifications | Notifications | Existing | No | **DEFER** (notification redesign forbidden) |

JSONB is **not** safe solely because seed data is synthetic or empty. Historical rows were **not** deleted.

---

## 7. Generic CSV assessment

| Question | Evidence |
| --- | --- |
| Which entity types can store `csv_content`? | **CRM:** batches persist for accepted type `organization`. `contact` create is rejected before persist (H-139). PG CHECK on `crm_import_batches.entity_type` still lists `'organization','contact'` (leftover). **Supplier:** accepted `supplier`, `supplier_rate`, `supplier_content_block`, `supplier_season`. `supplier_contact` create rejected; PG CHECK still lists `supplier_contact`. |
| Which API routes write it? | `POST /v1/crm/imports` (`apps/api/src/crm/import.ts`); `POST /v1/suppliers/imports` (`apps/api/src/supplier/import.ts`). Persistence via `pg-repository.ts`. |
| Organization or supplier commercial imports? | **Yes.** Organization and supplier-company/rate/content/season imports remain. |
| Arbitrary personal data in CSV cells? | **Yes, technically**, for accepted commercial entity types (e.g. a cell in an organization CSV). There is **no** cell-level personal-data scanner. Person-domain **entity types** cannot create a stored batch. |
| Logs / exports / errors? | HTTP `sanitizeBatch` **omits** `csvContent` from API responses (**observed**). CRM events forbid `csvContent`/`csv`. Logger redacts those **keys** if a log field uses them (**tested** this increment). Row `validation_results` may still echo cell text. Error responses use `error`/`reason` codes, not the CSV body (**observed** on document/person-key rejects). |
| Retention / classification / sanitization policy? | **None invented.** H-139 residual already deferred generic `csv_content`. |

**Disposition:** **DEFER WITH DOCUMENTED FINDING.** Commercial CSV functionality was **not** removed. Precise Owner decision required: whether commercial CSV may contain unstructured personal data, whether retention/redaction/sanitization is required, and whether leftover PG CHECKs listing `contact` / `supplier_contact` may be tightened (that last item is **migration 126** — not created).

---

## 8. Reintroduction audit

Question: can removed person-domain data be recreated through a substitute?

| Removed domain | Dedicated path | Substitute surfaces | Result |
| --- | --- | --- | --- |
| CRM individual contacts | Writes/reads `person_domain_removed` (prior H-136–H-138; not all re-executed this increment) | Notes `body`; org `address` JSONB; extra JSON keys; CSV cells; uploaded files | Dedicated path **cannot** be recreated as `crm_contacts` (**inferred** from prior tests + this increment did not re-open those APIs). **Prose/files/CSV can still describe a person.** Nested `givenName`/`guestName` keys on org/opportunity/RFP/programme/notes/facts/documents **tested rejected**. |
| HR employees / leave | Prior H-136/H-137 fail-closed | Filename `employee-record`; key `employeeId`/`employeeName` | Filename/key **tested** on documents. HR API not re-run this increment. Leave data not reintroduced as a domain. |
| Supplier individual contacts | Import/API fail-closed (H-139 residual **tested** this increment: person import does not persist `csv_content`) | Kernel type `SupContact` still exists; company email/notes remain | Type residue is **not** a live write path. Company fields remain. |
| Guest-level manifests / vouchers | Prior O1/O4 tests `person_domain_removed` | Ops briefs; field cache; DocumentStorage | Dedicated guest fields not restored. Generic ops text/files **can** hold guest details. Field-ops **not redesigned**. |
| DSR / consent identifying fields | Prior H-135–H-137 | Generic notes | No new DSR/consent identifying columns. Prose can still name a subject. |

Leftover **TypeScript types** in `apps/web/src/lib/{crm-api,suppliers-api,ops-api,hr-api}.ts` still declare `givenName` / `guestName`. H-138 UI tests assert field-ops source no longer matches those labels. These types are **observed residue**, not evidence of a newly introduced substitute form. They were **not** deleted here (would be a broader UI/API-type cleanup than authorized).

**Do not treat missing dedicated columns as a complete privacy boundary.** Unrestricted prose, opaque files, and commercial CSV cells remain residual capabilities.

Browser storage: `sessionStorage` holds auth token + email only (**observed**). Field-ops `localStorage` holds encrypted operational cache (**observed**; not redesigned). No evidence of a new contact/HR/guest store in client storage.

---

## 9. Exact changes made

**First H-140 implementation increment (already in the dirty tree; preserved):**

- `packages/kernel/src/personal-data-content-contract.ts` (+ tests, kernel export)
- `apps/api/src/personal-data-content-contract.ts`
- Document upload: person keys + identity filenames before `put`
- Commercial-facts PUTs (opportunity, RFP, account, rate-identity, path-b, programme overlay)
- CRM note create (after contact retirement)
- RFP PATCH
- RFP UI commercial-only / no-scanner copy
- `apps/api/src/h140-documentstorage-freetext-jsonb.test.ts` (initial)
- `apps/web/src/h140-documentstorage-freetext-jsonb-ui.test.ts`

**This privacy-boundary increment (additional, same authorization):**

- `apps/api/src/rfp/rfp.ts` — `createRfp` rejects person-domain keys after authorize, before persist
- `apps/api/src/pipeline/opportunity.ts` — `createOpportunity` same
- `apps/api/src/crm/organization.ts` — `createOrganization` / `updateOrganization` same (covers nested `address` JSONB keys)
- `apps/api/src/programme/programme.ts` — `createProgramme` / `patchProgramme` same
- `apps/api/src/observability.ts` — `REDACT_KEYS` aligned with existing CRM event forbidden payload keys plus `contentBase64` (H-134 no-`csv_content`-in-events rule; **not** a new retention policy)
- H-140 API tests extended: create-path / nested address / programme create / logger redaction

No historical documents, notes, or JSONB rows were deleted.

---

## 10. Changes deliberately not made

- No commit, push, reset, clean, stash, revert, or discard
- No Production change; no live migration; **no migration 126**
- No byte/prose/CSV-cell personal-data scanner
- No deletion of commercial DocumentStorage or commercial CSV
- No HTTP document-delete route
- No DocumentStorage provider redesign (local-fs remains Dev/Test)
- No field-ops cache redesign; no notification redesign; no audit-chain redesign
- No knowledge-document redesign
- No drop of leftover PG CHECKs listing `contact` / `supplier_contact`
- No drop of leftover `communication_preferences` / `SupContact` types
- No inventing retention, classification, or legal rules
- No UAT / Production-readiness claim
- Did not apply the key contract to every remaining write (activity, task, AI draft generate, proposal snapshot, programme **item** patch, supplier company notes, costing) — those remain documented findings rather than a silent application-wide redesign

---

## 11. Owner decisions required

1. **Whether commercial free-text and opaque files are acceptable residual risk** while EOS is not a personal-data SoR, or whether those surfaces must be structurally prohibited / replaced. Application-level key filters are incomplete by design.
2. **Generic `csv_content` retention / classification / sanitization** for organization and supplier commercial imports (H-139 residual finding 3, still open).
3. **Organization/supplier company email, telephone, and address values** — business vs personal is not mechanically decidable without Owner policy.
4. **Leftover PG CHECKs** listing `contact` and `supplier_contact` — physical schema tightening needs authorized **migration 126** (H-139 residual finding 1).
5. **Leftover contact JSONB** (`communication_preferences`) and kernel `SupContact` type residue — drop vs retain-as-dead.
6. **Audit JSONB snapshots** that may include commercial objects with email/address.
7. **Field-ops encrypted local cache** and **AI draft bodies**.
8. **EI-01 / ADR-0006 / DP-0006 / PDPC** remain Owner evidence and policy items (not resolved here).

---

## 12. Migration 126 decision and status

```text
migration 126: NOT CREATED
status: NOT REQUIRED for H-140 application-level controls
live migration: NONE
migration 125: unmodified
```

H-140 controls are request-time key/filename rejects and logger key redaction. They do not need a new table/column/index/constraint.

The **only** previously identified schema leftover that still cannot be closed in application code alone remains H-139 residual finding 1:

| Item | Detail |
| --- | --- |
| Exact objects | `crm_import_batches.entity_type CHECK (... 'contact')` (`010_c1_merge_import.sql`); `sup_import_batches.entity_type CHECK (... 'supplier_contact')` (`014_c4_supplier.sql`) |
| Why a future 126 might be needed | Database CHECKs still name retired person entity types |
| Why app controls are insufficient for that leftover | PostgreSQL CHECKs are independent of API validation |
| Proposed concept | Forward-only CHECK tighten to commercial entity types only — **not designed or executed here** |
| Risks | Existing leftover rows; Owner authorization; not in this grant |
| Required Owner authorization | **YES** before any 126 |

---

## 13. Authentication and persistence findings

**Observed / tested (not a full security validation):**

- Document upload without `Authorization` returns **401** (**tested**).
- Upload authorize → structural checks → decode/MIME/size → `put` → metadata persist. Person-key and identity-filename rejects occur **before** `put`. Store length does not increase (**tested**).
- Failed validation does not persist org/opportunity/RFP/programme when person-domain keys are present (**tested** this increment).
- Notes/facts rejects do not mutate records (**tested** prior H-140 tests, still green).
- Document GET content is authorized and tenant-scoped in code (**observed**; CD phase-1 tenant isolation **tested** in `cd-phase1-foundation.test.ts`).
- Error bodies for these rejects are `{ error, reason }` with `person_domain_removed` — they do **not** echo file bytes or note prose (**observed** in tests).
- `request_completed` logs method/path/status/correlation — **not** request bodies (**observed**).
- Logger redacts `csvContent` / `body` / `contentBase64` when those keys are present in a log field (**tested**). This is **not** proof that no other code path logs unrestricted content under a different key name.
- CRM/supplier import HTTP responses omit `csvContent` (**observed** in `sanitizeBatch`).
- sessionStorage: token + email only (**observed**).
- Field-ops localStorage: encrypted cache (**observed**; not claimed clear of operational personal data).
- Commercial organization create, notes, RFP create, PDF upload remain available (**tested**).

**Unresolved / not claimed:** bypass via another IDOR, every error path, Production object storage, or live PG.

---

## 14. Tests and exact results

Targeted only. **Not** a full-suite result.

```text
apps/web     npx tsc --noEmit     EXIT 0
apps/api     npx tsc --noEmit     EXIT 0
packages/kernel npx tsc --noEmit  EXIT 0
packages/db  npx tsc --noEmit     EXIT 0
```

```text
packages/kernel
  npx vitest run src/personal-data-content-contract.test.ts src/supplier-import.test.ts
  Test Files  2 passed (2)
  Tests       12 passed (12)
  EXIT 0
  (content-contract 3, supplier-import 9)
```

```text
apps/api
  npx vitest run ^
    src/h140-documentstorage-freetext-jsonb.test.ts ^
    src/cd-phase1-foundation.test.ts ^
    src/c1.accounts-notes-tasks.test.ts ^
    src/e1-c-closure.observability.test.ts ^
    src/h139-residual-import-hardening.test.ts
  Test Files  5 passed (5)
  Tests       29 passed (29)
  EXIT 0
  h140: 6
  cd-phase1-foundation: 7
  c1.accounts-notes-tasks: 9
  e1-c-closure.observability: 4
  h139-residual-import-hardening: 3
```

```text
apps/web
  npx vitest run src/h140-documentstorage-freetext-jsonb-ui.test.ts
  Test Files  1 passed (1)
  Tests       1 passed (1)
  EXIT 0
```

No targeted test failed. Tests do **not** detect personal data inside arbitrary document bytes or free-text values.

---

## 15. Commercial regression scope

**Actually exercised in the targeted runs above:**

- Organization records (create/list via notes/tasks tests; H-140 org import seed; org PATCH/create reject paths)
- Opportunities (create seed + reject path)
- RFPs (create seed, patch reject, document upload)
- Programmes (create reject path only; happy-path programme workflow **not** fully executed)
- Commercial PDF DocumentStorage upload (H-140 + CD phase 1)
- Organization commercial import CSV persist vs retired person import (H-139 residual)
- CRM accounts, notes, tasks (c1.accounts-notes-tasks)
- Authentication / request logging shape (e1-c observability)

**Not executed / not claimed verified in this increment:**

- Supplier companies, rates, content blocks, seasons (except import **rejection** of retired person type)
- Costing
- Proposals
- Rate Identity happy-path (only structural key reject on PUT was in the first increment’s code; not re-tested as a commercial workflow here)
- Full programme itinerary / costing / proposal chain

---

## 16. Runtime limitations

- Static `tsc` + in-process Vitest (`app.inject`). No live PostgreSQL for this increment.
- No browser end-to-end session for the additional create-path controls (UI copy test is source-read only).
- No UAT environment. No Production. No live DocumentStorage provider other than LocalFs in tests.
- Filename and object-key controls are **incomplete by design**.
- Logger redaction is key-name based, not content-based.

---

## 17. Privacy and PDPC limitations

SEDMC is **not** stated to be legally exempt from PDPC requirements.

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
UAT: NOT STARTED
Production: NOT AUTHORIZED / NOT READY
```

Removing dedicated person-data domains plus structural key/filename rejects does **not** complete a privacy boundary. Generic notes, files, CSV cells, and some JSON string values can still hold personal data. This record does not invent a lawful basis, retention schedule, or data-classification scheme.

---

## 18. Remaining findings

1. Opaque DocumentStorage bytes can contain personal data; scanning/classification needs a later authorized design.
2. Commercial free-text bodies remain unconstrained as strings.
3. Generic import `csv_content` remains unconstrained TEXT for approved entity types.
4. Organization/supplier company email/telephone/address values are not mechanically non-personal.
5. Key contract is **not** applied to every remaining write (activity, task, AI drafts, proposal snapshots, programme items, supplier notes, costing).
6. HTTP document delete still unregistered.
7. Audit JSONB may snapshot commercial objects.
8. Field-ops encrypted localStorage and notification bodies were not redesigned.
9. Leftover web API types still mention `givenName` / `guestName`.
10. PG CHECK leftovers for `contact` / `supplier_contact` still require Owner-authorized migration 126.
11. Filename labelling is incomplete (e.g. `scan.pdf` is not rejected).

---

## 19. Final disposition

```text
PASS WITH FINDINGS
```

The inventory is evidence-based. Dedicated person-domain APIs remain fail-closed from prior increments; this increment did not find a newly introduced substitute **domain**. Safe structural controls were extended to remaining commercial **create** paths (RFP, opportunity, organization JSONB, programme) and to logger key redaction aligned with an existing CRM event forbid-list. Unresolved policy/design issues (prose, bytes, CSV cells, leftover CHECKs, field-ops, notifications) are recorded rather than pretended solved.

Not **PASS**: residual capabilities remain. Not **FAIL**: no tested path recreated a removed person-domain record, authentication was not bypassed on the tested upload route, rejected content was not persisted in the tested cases, and targeted commercial surfaces that ran remained intact.

---

## 20. Stop confirmation

```text
STOPPED AFTER H-140: YES
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
MIGRATION 126: NOT CREATED
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
```

No H-141 work follows. Dirty worktree preserved.
