# CD Phase 1 — Stage 1 implementation contract (FROZEN)

> **STATUS:** **FROZEN** Stage 1 architecture / implementation contract (2026-08-30).  
> **BASE SHA:** `7c75a16ca942755421bc4ef8a528e0bf2d579e41`  
> **WORKTREE:** `C:\Users\PC\Branding MICE\serengeti-eos-cd-phase1` · **BRANCH:** `feat/cd-phase1-foundation`  
> **ENVIRONMENT:** Development/Test only.  
> **PR1 / PR2:** Closed; API/schema contracts unchanged.  
> **ADR-0006:** OPEN — no Production hosting or object-storage decision.  
> **DP-0006:** NOT APPROVED.  
> **PQL1–PQL7:** DORMANT / REFERENCE ONLY. Migrations **109–115 PQL MUST NOT** be reused.  
> Governance: [`../governance/cd-phase1-commercial-foundation-authorized.md`](../governance/cd-phase1-commercial-foundation-authorized.md)

This document is the **authoritative Stage 1 contract** for Commercial Department Phase 1. It supersedes the prior design-sketch text of the same path. It describes the **existing uncommitted** implementation. It does **not** claim that implementation authorization existed before the code was written (see §23).

---

## 1. Purpose

Define a freezeable Dev/Test contract for Phase 1: extend the existing commercial spine (C3–C8) with RFP documents, C4 hotel profile and versioned supplier contracts, additive programme/rate fields, and reuse of C6 costing — without a parallel commercial OS, PQL resurrection, PR1/PR2 expansion, UAT, Production, commit, or push.

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| Extend C3 RFP (optional fields, PATCH, document attach) | Second RFP aggregate or `new/qualified/…` lifecycle |
| `DocumentStorage` + commercial document metadata (Dev/Test local FS) | Production object storage; ADR-0006 closure |
| Extend C4: hotel profile 1:1, versioned contracts, rate optional fields | Second supplier or hotel master |
| Extend C5: item fields, programme notes, thin version snapshots | Programme variants; snapshot-as-SoR |
| Reuse C6 `supplierRateId` | Second costing / quote-basis / FX engine |
| Preserve C7 approval and C8 proposal | Approval/proposal replacement or PDF render |
| Additive SQL files 119–122 (review only) | Migration execution |
| Kernel + API tests listed in §19 | UAT, Production, commit, push |

## 3. Non-goals

AI extraction; OCR; portals; email/WhatsApp ingest; Production storage; FX engine; proposal rendering; programme variants; PQL resurrection; PQL migrations 109–115; PR1/PR2 API or schema changes; commit; push; UAT; Production deployment; cloud/object-storage selection; DP-0006 approval.

## 4. Architectural boundary

Phase 1 **extends** the existing spine:

C1 CRM → C2 Pipeline → **C3 RFP** → **C4 Supplier / rates / hotel profile / contracts** → **C5 Programme** → **C6 Costing** → **C7 Approval** → **C8 Proposal**

**Authoritative entities (unchanged identity):**

- C3 `RfpRecord` and `workflowStage`: `intake` | `programme` | `costing` | `approval` | `proposal` | `sent` | `closed` (plus `status` `active` | `closed` | `cancelled`).
- C4 `SupSupplier` master; C4 `SupRate` / seasons.
- C5 one programme per RFP (`programme_exists_for_rfp`).
- C6 cost sheet / line items and existing markup/margin math.
- C7 commercial approval; C8 proposal aggregate.

**No parallel spine.** Owner vocabulary such as `new/qualified/…` is documentation mapping only — not an API or kernel lifecycle.

Runtime SoR for Phase 1 commercial writes remains **in-memory `Store`**, consistent with **ADR-0017** (accepted for Development): PostgreSQL schema for commercial modules is **schema-readiness**, not a new runtime SoR. This contract does **not** reopen ADR-0017 or close ADR-0006.

## 5. Entity model

| Entity | Origin | Phase 1 role |
| --- | --- | --- |
| `RfpRecord` | Existing C3 | SoR for RFP; additive `notes`, `source`, `receivedAt` |
| `CommercialDocument` | New | Metadata; bytes behind `DocumentStorage` |
| `PrgProgramme` / `PrgDay` / `PrgItem` | Existing C5 | SoR for itinerary; additive item/programme fields |
| `PrgProgrammeVersion` | New (C5 extension) | Append-only **thin** snapshot; not SoR |
| `SupSupplier` | Existing C4 | SoR for supplier (including hotels as category) |
| `SupHotelProfile` | New | Optional 1:1 profile on accommodation suppliers |
| `SupContract` / `SupContractVersion` | New | Versioned commercial contract metadata |
| `SupRate` | Existing C4 | Additive optional `contractId`, occupancy, meal, notes |
| `CostSheet` / `CostLineItem` | Existing C6 | Unchanged engine; `supplierRateId` already present |

## 6. Relationships

```
RfpRecord 1──* CommercialDocument (optional rfpId; many documents per RFP)
SupSupplier 1──0..1 SupHotelProfile
SupSupplier 1──* SupContract
SupContract 1──* SupContractVersion (append-only; optional documentId 0..1 per version)
SupContract 1──* CommercialDocument (optional contractId on document)
SupRate *──0..1 SupContract (optional contractId)
PrgProgramme 1──1 RfpRecord (constraint: one live programme per RFP)
PrgProgramme 1──* PrgProgrammeVersion (append-only thin snapshots)
PrgItem *──0..1 SupSupplier / SupRate (existing + Phase 1 types)
CostLineItem *──0..1 supplierRateId (existing C6)
```

A `CommercialDocument` **may** carry `rfpId` and/or `supplierId`/`contractId`. Phase 1 does **not** require exclusive parent XOR. RFP upload sets `rfpId` (and default `kind=rfp`). Contract attach sets `kind=contract`, `supplierId`, `contractId`.

## 7. Invariants

1. No second RFP, supplier, hotel, programme, costing, approval, or proposal aggregate.
2. C3 `workflowStage` transitions remain the existing C3 graph; PATCH must **not** change `workflowStage` (stage changes remain `POST .../transitions`).
3. At most one non-archived programme per RFP.
4. Hotel profile at most one per `(tenantId, supplierId)`; supplier `category` must be `accommodation` to upsert.
5. Contract `contractRef` unique per `(tenantId, supplierId)` among non-archived contracts.
6. Contract versions are append-only; prior version rows are not overwritten.
7. Live `PrgProgramme` is itinerary SoR; versions do not restore and are not variants.
8. Document `id` is a new UUID (`newId()`); callers must not reuse `documentId`.
9. Filename must not contain `..`, `/`, or `\`; MIME must be on the allowlist; size ≤ 10 MiB.
10. Tenant: all reads/writes filter `principal.tenantId`.
11. Document and contract **mutations** require `actorType === Human` then RBAC. Hotel profile mutations use `supplier:write:supplier` (not human-only unless later Owner-extended).
12. `kind` is the document classifier field. **`documentType` is not a Phase 1 API field.**

## 8. Lifecycle

### 8.1 RFP

Existing C3: `workflowStage` + `status`. Phase 1 PATCH is additive commercial metadata only.

### 8.2 CommercialDocument (Phase 1)

Kernel **defines** statuses: `active` | `superseded` | `deleted`.

| Concept | Phase 1 classification |
| --- | --- |
| Create (upload / attach) | **IMPLEMENTED** and **EXPOSED** |
| Read metadata / content | **IMPLEMENTED** and **EXPOSED** |
| List by RFP | **IMPLEMENTED** and **EXPOSED** |
| Status `active` on create | **IMPLEMENTED** |
| `superseded` | **DEFINED BUT NOT EXPOSED** — no Phase 1 API to supersede |
| `deleted` | **DEFINED BUT NOT EXPOSED** — no Phase 1 delete API |
| Byte delete (`DocumentStorage.delete`) | **OUT OF SCOPE** for Phase 1 API (optional on early sketch; **not** on kernel `DocumentStorage` type) |

**Phase 1 is create/read for documents.** There is no authorized delete or supersede endpoint.

If a record with `status === deleted` were present, current getters treat it as **not_found (404)**. Phase 1 has no writer that sets `deleted`. Bytes are **not** contractually removed: there is no delete API.

### 8.3 SupContract

Statuses: `draft` | `active` | `expired` | `superseded` (kernel). Phase 1 create accepts status; versioning appends `SupContractVersion` and increments `currentVersion`. No Phase 1 requirement to rewrite historical version rows.

### 8.4 SupHotelProfile

`active` | `inactive`. **In-place upsert** (not versioned). Updating the profile overwrites profile fields and increments profile `version`. This is **not** a hotel master and **not** contract versioning.

### 8.5 Programme versions

Append-only. No Phase 1 API to edit or delete a version snapshot.

## 9. API surface (frozen to implementation)

Existing C3–C6 routes remain. Phase 1 **additive** routes and fields:

### 9.1 RFP PATCH

`PATCH /v1/rfps/:id`  
Permission: `rfp:write:rfp`  
Body (optional): `title`, `notes`, `source`, `receivedAt`, `travelDates`, `destinations`, `paxCount`, `requirementsText`, `assignedPrincipalId`.  
Does **not** accept `workflowStage`.

### 9.2 Documents

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/v1/rfps/:id/documents` | Body: `filename`, `mimeType`, `contentBase64`, optional `kind` (default `rfp`) |
| GET | `/v1/rfps/:id/documents` | Active documents for that RFP |
| GET | `/v1/commercial-documents/:id` | Metadata |
| GET | `/v1/commercial-documents/:id/content` | Metadata + `contentBase64` |

**Not in Phase 1:** `GET /v1/rfps/:id/documents/:documentId` and nested `/content` under the RFP path. Clients use `/v1/commercial-documents/:id`.

Field name: **`kind`** ∈ `rfp` | `contract` | `rate_sheet` | `other`.

### 9.3 Hotel profile

| Method | Path |
| --- | --- |
| GET | `/v1/suppliers/:id/hotel-profile` |
| PUT | `/v1/suppliers/:id/hotel-profile` (upsert) |

There is **no** separate POST or PATCH hotel-profile route in Phase 1.

Permissions: `supplier:read:supplier` / `supplier:write:supplier`.

### 9.4 Contracts

| Method | Path |
| --- | --- |
| POST | `/v1/suppliers/:id/contracts` |
| GET | `/v1/suppliers/:id/contracts` |
| GET | `/v1/suppliers/:id/contracts/:contractId` |
| POST | `/v1/suppliers/:id/contracts/:contractId/versions` |
| POST | `/v1/suppliers/:id/contracts/:contractId/documents` |

Permissions: `supplier:read:contract` / `supplier:write:contract`. Human-only on writes.

### 9.5 Rates (existing POST/PATCH)

Existing `/v1/suppliers/:id/rates` accepts additive optional fields: `contractId`, `occupancy`, `mealPlan`, `blackoutNotes`, `supplementsNotes`. `contractId` must refer to a non-archived contract for that supplier and tenant when present.

### 9.6 Programme

| Method | Path |
| --- | --- |
| PATCH | `/v1/programmes/:id` — `title`, `internalNotes`, `clientNotes`, `destinations`, `startDate`, `endDate`, `paxCount` |
| PATCH | `/v1/programmes/:id/items/:itemId` — existing item fields plus `itemType`, `quantity`, `unit`, `notes`, `visibility` |
| POST | `/v1/programmes/:id/versions` — `{ summary }` |

Item create (`POST .../days/:dayId/items`) may include the same additive fields. Existing `POST /v1/programmes` one-per-RFP rule is unchanged.

### 9.7 PR1 / PR2

`/v1/procurement` and `/v1/sourcing-events` **unchanged**.

## 10. Authorization model

New permissions (seeded on `commercialManager` and `platformAdmin`):

- `commercialDocument:read:document`
- `commercialDocument:write:document`
- `supplier:read:contract`
- `supplier:write:contract`

Existing: `rfp:*`, `programme:*`, `supplier:read/write:supplier`, `costing:*`, commercial approval, proposal.

Human-only (`canMutateCommercialDocument` / `canMutateSupplierContract`): **document write** and **contract write** (create contract, create version, attach document). **Not** contracted for hotel profile, RFP PATCH, or programme PATCH.

No `commercial_admin` bypass.

Reads of documents/contracts require the corresponding `read` permission; tenant mismatch → not found or forbidden per existing `authorize` + store filter pattern.

## 11. Tenant isolation

Every Phase 1 list/get/mutate must scope by `principal.tenantId`. Cross-tenant document list must not return another tenant’s items (403 or empty-of-foreign-data consistent with existing modules; API tests expect 403 for partner tenant listing another tenant’s RFP documents). Storage paths include `tenantId`. Content `get` uses **server-stored** `storageRef`, not a client-supplied path.

## 12. Document storage contract

### 12.1 Identity and refs

- **documentId:** UUID from `newId()` at upload; primary identity.
- **storageRef:** `{tenantId}/{documentId}` (relative to storage root).
- **tenant ownership:** `CommercialDocument.tenantId` = uploading principal’s tenant; bytes stored under that tenant segment.
- **Checksum:** SHA-256 hex of decoded bytes (`checksumSha256`); size = decoded byte length.

### 12.2 Limits

- Max size: **10 × 1024 × 1024** bytes (`COMMERCIAL_DOC_MAX_BYTES`).
- MIME allowlist: `application/pdf`; Word OOXML; Excel OOXML; `text/csv`; `image/jpeg`; `image/png`.

### 12.3 put semantics (required vs current)

**Required by this contract:** `documentId` is unique; a put **must not** be used to replace another document’s identity. Phase 1 APIs always allocate a new id.

**Current LocalFs implementation (KNOWN LIMITATION — do not treat as Production-safe):** `writeFile` is **not** exclusive; reusing a `documentId` **can overwrite** bytes at the same path. That reuse is **forbidden** by invariant 8. Exclusive-create remediation is **not** authorized in this contract action; it is tracked for **implementation remediation review**.

**Collision:** If `documentId` collides, behavior of the current FS adapter is overwrite; the contract forbids callers from causing that collision.

**Duplicates:** Multiple documents with the same filename or identical bytes **are allowed**. Replacement is a **new** document (and, for contracts, a **new** version), not an in-place byte replace.

### 12.4 Filesystem root (Dev/Test)

- If `EOS_DOCUMENT_ROOT` is set (non-empty), that directory is the root.
- Else implementation default: `join(os.tmpdir(), "serengeti-eos-documents")`.
- An earlier sketch mentioned `.eos-documents/<tenantId>/`; **that is not the implemented default**. The frozen default is **tmpdir** unless env is set.
- **Dev/Test only.** Must not be used as Production object storage. Does **not** decide ADR-0006.

### 12.5 Path safety

`get` must reject `storageRef` containing `..`, starting with `/`, or containing `\`. Filename on upload is similarly restricted. Client metadata is not trusted for path construction beyond validated filename/MIME/size.

### 12.6 attachContractDocument transaction (accepted Dev/Test rule)

**Required success invariant:** HTTP 201 from attach means (1) bytes stored, (2) `CommercialDocument` metadata persisted in Store, (3) a new `SupContractVersion` exists with `documentId` set.

**Current implementation:** upload then `createContractVersion`. Not a single filesystem+memory transaction.

**Accepted compensation (Dev/Test, no automation required in this Phase):**

- Partial failure **may** leave orphaned bytes and/or metadata without a version row.
- Phase 1 does **not** auto-delete orphans.
- Retry is **not** idempotent: a new upload allocates a new `documentId`.
- Reconciliation is operational/manual; a later governed increment may add exclusive put + compensating delete. **Not authorized now.**

## 13. Contract / version semantics

- `SupContract` is the Phase 1 **authoritative commercial contract record** (type, status, dates, currency, notes, `currentVersion`).
- Versions are append-only (`versionNumber` monotonic per contract).
- Attaching a document **creates a new version** whose `documentId` points at the new `CommercialDocument`. Prior versions retain their `documentId` if any.
- A version has **at most one** `documentId`. Additional files require additional versions (or a later increment).

### 13.1 Legacy C4 supplier fields

`SupSupplier.contractRef`, `contractValidFrom`, `contractValidTo` remain on the supplier master for **pre-Phase-1 compatibility**. They are **not** the Phase 1 authoritative contract ledger. Phase 1 UI/API for versioned contracts use `SupContract` / `SupContractVersion`. This contract does **not** authorize deleting or migrating those legacy columns.

## 14. Hotel profile semantics

- Extension of C4 supplier; **not** a second hotel master.
- At most one profile per supplier; PUT upserts in place.
- Not versioned (profile `version` counter only).
- Authorization: existing supplier read/write permissions.
- Human-only gate: **not** required for hotel profile in Phase 1.

## 15. Rate semantics

Existing C4 rate/season engine unchanged. Optional `contractId` links a rate to a Phase 1 `SupContract` after tenant/supplier validation. Occupancy, meal plan, blackout/supplement notes are labels/text, not a pricing engine. No FX.

## 16. Programme / version semantics

- Live `PrgProgramme` (days/items) is **SoR**.
- One programme per RFP remains enforced on create.
- `itemType` is a classifier on existing `PrgItem`, not a second item system. Values: `accommodation` | `activity` | `experience` | `transport` | `flight` | `meal` | `meeting_event` | `other`. Visibility: `internal` | `client` | `both`.
- **Thin snapshot (frozen to implementation):** `{ title, dayCount, itemCount, destinations? }`. Not a full itinerary dump. Not a restore source. Not an alternate master. No programme variants.
- SQL `prg_programme_versions.snapshot JSONB` is schema-readiness for that **same thin object** (or a JSON encoding of it). This contract does **not** authorize changing migration 122 in this action; any JSONB/kernel mismatch is **implementation remediation** to align SQL comments/docs with the thin shape, not a new product feature.
- No Phase 1 version-edit API.

## 17. Costing integration

C6 remains authoritative. `supplierRateId` on line items is **additive reference** to C4 rates (already present). Phase 1 must not change `computeCostTotals` / margin semantics or introduce quote-basis. Costing source files are not required to change for Phase 1.

C7/C8: no new approval state machine; no new proposal aggregate; Phase 1 must not bypass approval or replace proposal generate.

## 18. Migration policy

**Files (review only, not executed):**

| File | Purpose |
| --- | --- |
| `119_cd_commercial_documents.sql` | Document metadata; `storage_ref` TEXT; no BYTEA |
| `120_cd_supplier_contracts.sql` | `sup_contracts` + `sup_contract_versions` |
| `121_cd_hotel_profiles.sql` | `sup_hotel_profiles` |
| `122_cd_programme_item_extensions.sql` | Additive columns on programmes/items/RFP/rates + `prg_programme_versions` |

**MIGRATION_EXECUTION = NOT_AUTHORIZED.**

**FK policy — OPTION B (explicit):**

Because **ADR-0017** keeps commercial Dev/Test runtime SoR in-memory and treats much commercial PG as schema-readiness (and PR2 similarly omitted FKs to sibling catalogues), Phase 1 **allows intentional soft references** in 119–121 (and `sup_rates.contract_id` in 122):

| Column | Intentional soft ref |
| --- | --- |
| `commercial_documents.rfp_id` | C3 RFP — integrity at service layer |
| `commercial_documents.supplier_id` | C4 supplier |
| `commercial_documents.contract_id` | Phase 1 contract |
| `sup_contracts.supplier_id` | C4 supplier |
| `sup_contract_versions.document_id` | commercial document |
| `sup_hotel_profiles.supplier_id` | C4 supplier (unique with tenant) |
| `sup_rates.contract_id` | Phase 1 contract |

`tenant_id` → `tenants` and `prg_programme_versions.programme_id` → `prg_programmes` may remain real FKs as written.

OPTION B does **not** authorize applying migrations. Future persistence hardening **may** add FKs only via a **separately governed** migration. OPTION A (require FKs before apply) is **not** selected for this freeze.

Never use PQL 109–115 numbering.

## 19. Test acceptance criteria

### 19.1 Required contract tests (Stage 1)

Evidence may be existing `commercial-document.test.ts`, `cd-phase1-foundation.test.ts`, `pr1-procurement.test.ts`, `pr2-sourcing-events.test.ts`.

| Obligation | Required |
| --- | --- |
| MIME reject for non-allowlist | Yes |
| Document write denied without permission | Yes |
| Cross-tenant document list denied | Yes |
| RFP PATCH notes/source (and additive fields) | Yes |
| Programme item `itemType` / quantity / notes | Yes |
| One programme per RFP (existing create conflict) | Yes (existing C5 behavior; Phase 1 must not remove) |
| Programme version returns thin snapshot with itemCount | Yes |
| Hotel profile PUT on accommodation supplier | Yes |
| Contract create + document attach increments version | Yes |
| Rate `contractId` accepted when valid | Yes |
| Costing line can carry `supplierRateId` | Yes |
| PR1 `/v1/procurement` still creates | Yes |
| PR2 `/v1/sourcing-events` still creates | Yes |
| Migration file list includes 119–122 and not `109_pql` / `115_pql` | Yes |

### 19.2 Recommended future tests (not freeze blockers)

Filesystem exclusive-create / overwrite; attach orphan paths; UI 401/403 vs empty list; document delete (out of Phase 1 API); SQL apply (not authorized).

## 20. Known limitations (report-only; no fix in this freeze)

1. `LocalFsDocumentStorage.put` uses non-exclusive `writeFile`.
2. `attachContractDocument` is not atomic; orphans possible.
3. RFP UI may catch document-list errors and show “No documents uploaded yet.” **Contract forbids that representation** for 401/403 (see §20.1); **UI code is not changed by this freeze**.
4. Tree-wide and Phase-1 `exactOptionalPropertyTypes` TypeScript errors (see §20.2).
5. Soft SQL FKs until a future governed hardening migration.
6. Programme SQL JSONB vs thin snapshot: align in remediation if needed; product meaning is thin.

### 20.1 UI error semantics (frozen rule; implementation may still violate until remediation)

| HTTP | Must not display | Expected |
| --- | --- | --- |
| 401 | “No documents uploaded yet.” | Unauthenticated / session error |
| 403 | “No documents uploaded yet.” | Not authorized to list documents |
| 404 | Empty-as-success if the RFP itself is missing | RFP or resource not found |
| 5xx | Empty list as success | Transient/server error |
| 200 with `items: []` | — | “No documents uploaded yet.” is appropriate |

### 20.2 TypeScript (Owner has not authorized remediation)

- The repo already fails tree-wide `tsc` under `exactOptionalPropertyTypes` (e.g. kernel costing/notifications/supplier-import; existing supplier route unions).
- Phase 1 **adds** the same class of errors in new commercial document/contract/hotel route unions and optional PATCH assigns.
- These are **type-assignability** issues; prior review found **no evidence** they encode a competing commercial model or an auth bypass. Kernel/API **tests still pass**.
- **Classification B:** known Dev/Test technical debt for a **subsequent implementation remediation gate**. They are **not** a Stage 1 **architecture-contract** freeze prerequisite, because (1) Owner has not authorized code remediation, (2) they are not assessed as Phase 1 runtime/contract-model risk.
- A later Owner may elevate clean `tsc` to a **commit** prerequisite. That is **not** authorized here.

## 21. Governance boundaries

| Flag | Value |
| --- | --- |
| STAGE_1_APPROVED | YES |
| IMPLEMENTATION_AUTHORIZED | YES — existing uncommitted worktree, Dev/Test only |
| UAT | NOT_AUTHORIZED / NOT_EXECUTED |
| PRODUCTION | NOT_AUTHORIZED |
| COMMIT / PUSH | NOT_AUTHORIZED |
| MIGRATION_EXECUTION | NOT_AUTHORIZED |
| ADR-0006 | OPEN |
| DP-0006 | NOT APPROVED |

## 22. Explicit out-of-scope items

Second RFP/programme/proposal/costing/approval; PQL modules and PQL 109–115; PR1/PR2 expansion; AI/OCR/FX/render/variants; Production storage and hosting; applying 119–122; exclusive FS create and attach transactions (until remediation gate); document delete/supersede APIs.

## 23. Retrospective authorization history

1. Phase 1 **implementation already existed** uncommitted on `feat/cd-phase1-foundation` at base `7c75a16`.
2. Forensic audit: architecture generally conformant; `IMPLEMENTATION_AUTHORIZED=YES` was **not independently evidenced** (docs co-located with code).
3. **2026-08-30:** Owner **explicitly** authorized that existing Dev/Test implementation (**retrospective**; does not rewrite history).
4. Contract review: architecture OK; Stage 1 **sketch incomplete** → **CONTRACT AMENDMENT**.
5. **This document (2026-08-30):** Stage 1 contract **amended and frozen**. It does **not** claim authorization existed before implementation.

## 24. Freeze criteria

This Stage 1 **architecture contract** is **FROZEN** when all of the following hold:

- Architectural boundary (§4) unchanged from Owner decisions.
- API surface (§9) matches implemented routes (`kind`, hotel PUT, commercial-document GET paths).
- Storage, lifecycle, attach compensation, FK OPTION B, thin snapshots, hotel upsert, legacy C4 fields, UI rules, tests, and TypeScript debt class B are recorded.
- Governance flags in §21 remain as recorded; no UAT/Production/commit/push/migration execution authorized.

**Not freeze criteria for this document:** clean tree-wide `tsc`; exclusive `writeFile`; atomic attach; UI 403 fix; applying SQL.

**Next gate after this freeze:** **IMPLEMENTATION REMEDIATION REVIEW** (known limitations §20) — **not** UAT, commit, push, or Production.

---

## Capability map (summary)

| Domain | Approach | Deliverable |
| --- | --- | --- |
| RFP | Extend C3 | PATCH + documents |
| Programme | Extend C5 | Item/notes + thin versions |
| Hotel | Extend C4 | 1:1 profile PUT |
| Contracts | New on C4 | Versioned metadata + docs |
| Rates | Reuse C4 | Optional contract/occupancy/meal/notes |
| Costing | Reuse C6 | `supplierRateId` unchanged engine |
| Proposal / approval | Preserve C7/C8 | No Phase 1 mutate of those aggregates |
| Documents | New | `DocumentStorage` + metadata |
| PR1 / PR2 | Preserve | No contract changes |
