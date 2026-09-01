# Classification Register — Stage 1 contract (APPROVED; DG2 assigned)

> **CURRENT STATE (2026-09-01 Stage 1 approved; DG2 assigned — not implementation)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **origin/master=`d918f98729f2f3fd0969d7cc6066700dcb21fb01`**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=CLASSIFICATION_REGISTER** · **CAPABILITY_ID=DG2** · **ID_ASSIGNMENT=DG2 / ASSIGNED** · **ID_ASSIGNMENT_STATUS=ASSIGNED**  
> **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=NO**  
> **PREVIEW=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **DEPLOYMENT=NOT_AUTHORIZED**  
> **EXECUTION_QUEUE=EMPTY** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> Authority record: [`../governance/classification-register-authorized.md`](../governance/classification-register-authorized.md).  
> DG1 remains **CLOSED**. This document does **not** reopen Dataset Register.

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **DG2** |
| Capability name | Classification Register |
| Family | data governance |
| Domain | Data Governance (`dg` — domain map 2.2 leftover noun **Classification** only) |
| Predecessor | I0 kernel (complete). **DG1** Dataset Register complete and **not** reopened |
| Architecture status | This document is the **approved** Stage 1 contract. Implementation is **not** authorized. |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; ID ASSIGNED (DG2); IMPLEMENTATION NOT AUTHORIZED** |
| Implementation status | **NOT AUTHORIZED** |
| Environment | Development/Test only **if** later authorized |
| Persistence | Conceptual only in this Stage 1. If later authorized: in-memory `Store` is Dev/Test SoR; additive SQL only; ADR-0017 not reopened; live PostgreSQL UNVERIFIED |
| Runtime health increment | **DG2** (assigned; health endpoint **not** implemented) — must not replace DG1 `/v1/datasets/health` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **DG2** |
| **ID_ASSIGNMENT** | **DG2 / ASSIGNED** |
| **ID_ASSIGNMENT_STATUS** | **ASSIGNED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |

Authority: 2026-09-01 Product Owner **SELECT CLASSIFICATION AS NEXT CANDIDATE CAPABILITY** and **STAGE 1 CONTRACT AUTHORING ONLY**; 2026-09-01 Product Owner **CLASSIFICATION REGISTER — STAGE 1 APPROVAL ONLY** (`STAGE_1_APPROVED=YES`); 2026-09-01 Product Owner **ASSIGN CAPABILITY ID DG2 ONLY** (`CAPABILITY_ID=DG2` / `ID_ASSIGNMENT=DG2 / ASSIGNED`) ([`classification-register-authorized.md`](../governance/classification-register-authorized.md)). This document is the **approved** Stage 1 contract with **DG2 assigned**. It does **not** authorize implementation, preview, UAT, Production, commit, or push, and does **not** reopen DG1 / P1–P3 / I0 classification / I16 / I17 / I19. It is **not** a classification engine, **not** I0 `Public|…|HighlyRestricted` clearance, **not** Lineage, **not** QualityRule, **not** CAL, and **not** C11+.

**Selection ≠ Stage 1 approval.**  
**Stage 1 approval ≠ ID assignment.**  
**ID assignment ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

```text
CAPABILITY = CLASSIFICATION_REGISTER
CAPABILITY_ID = DG2
CAPABILITY_NAME = Classification Register
STAGE = 1
STATUS = SELECTED_STAGE_1_APPROVED_ID_ASSIGNED_IMPLEMENTATION_NOT_AUTHORIZED
STAGE_1_AUTHORING = AUTHORIZED
STAGE_1_CREATED = YES
STAGE_1_STATUS = APPROVED
STAGE_1_APPROVED = YES
ID_ASSIGNMENT = DG2
ID_ASSIGNMENT_STATUS = ASSIGNED
IMPLEMENTATION_AUTHORIZED = NO
PREVIEW = NOT_AUTHORIZED
COMMIT = NOT_AUTHORIZED
PUSH = NOT_AUTHORIZED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
DEPLOYMENT = NOT_AUTHORIZED
ADR_0006 = OPEN
DP_0006 = NOT_APPROVED
EXECUTION_QUEUE = EMPTY
NEXT_INCREMENT = NONE_AUTHORIZED
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
```

---

## Objective

Deliver a **Data** workspace surface (only if implementation is later authorized) where an authorised human can record **Classification Register rows**: a human catalogue that a **classification register row exists**, or was cancelled.

**Classification Register = catalogue/governance record of classification-register rows.**  
**Classification Register ≠ classification engine.**  
**Classification Register ≠ I0 information-classification clearance.**  
**Classification Register ≠ Data Governance platform.**

The register is an **existence catalogue only**, matching the Path B register minimum used by DG1 Dataset, ITE1 Endpoint, P3 Consent, and siblings. It must **not** classify data, scan content, assign I0 clearance to datasets, compute lineage, or evaluate quality.

Domain map 2.2 names **Dataset, Classification, Lineage, QualityRule** under `dg`, owned by CDO. **DG1** shipped the leftover **Dataset** noun only and recorded Classification as **not selected**. This contract is the leftover **Classification** noun only. Lineage and QualityRule remain **not selected**.

---

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **Classification Register** | A human record that a classification **catalogue row exists** (or was cancelled) | New store (`classificationRecords`) if later implemented |
| **DG1 Dataset Register** | Catalogue that a dataset exists | Closed — **no** `datasetId` |
| **I0 Classification** | Information-classification clearance (`Public` … `HighlyRestricted`) | Closed kernel concept — **not** this aggregate; **not** a field type on this row |
| **P1 / P2 / P3** | RoPA / DPIA / Consent | Closed — **no** privacy FKs |
| **I19 knowledge** | Documents / search | Closed |
| **Lineage / QualityRule** | Remaining `dg` nouns | **Not selected** |

Do **not** add I0 clearance enums, dataset foreign keys, lineage edges, quality scores, or scanner output.

---

## Scope

| Deliverable | In Stage 1 (approved; not implemented) |
| --- | --- |
| Classification-register create / list / get / patch (while `open`) | Yes (if later implemented) |
| Codes unique per tenant with dedicated prefix | Yes (`CLS-`) — proposed; not an allocator until implementation |
| Statuses: `open` → `done`; `open` → `cancelled`; those two terminal | Yes (catalogue membership only) |
| Required `title`; optional `notes` | Yes (Path B register minimum) |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Dedicated store, API, health, UI, permissions, role | Yes (if later implemented) |
| In-memory Dev/Test SoR if implementation is later authorized | Yes |
| Additive SQL only if a later implementation gate authorizes it | Yes (not in this approval pass; **do not** apply 119–122) |
| Classification **engine** / automated classification | No |
| Reuse of I0 `Classification` as this aggregate or as a field type | No |
| Lineage / QualityRule engines or aggregates | No |
| Dataset mutation / `datasetId` | No |
| UAT / Production / ADR-0006 closure | No |

Required field is **`title`**, matching DG1/ITA1/P3 registers.

### Proposed code prefix

**`CLS-`** (example `CLS-0001`).

- Not a capability ID (capability ID is **DG2**).
- Repository search found **no** `CLS-` allocator and no `/v1/classifications` collection.
- This prefix is **proposed** as part of Stage 1. It does not authorize implementation.

Do **not** use statuses that imply engine outcome (`classified`, `scanned`, `restricted`, `highly_restricted`, `lineaged`, `quality_failed`). This catalogue uses only **`open` / `done` / `cancelled`**.

`done` means the human marked the **register row** complete. It does **not** mean data was classified, cleared, or legally labelled.

---

## Domain model (conceptual; approved contract)

**classification_records** (runtime store key **`classificationRecords`**)

Proposed fields:

- `id`
- `classificationCode` unique per tenant (`CLS-0001`) — a **register code**, not an I0 clearance
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ classification: ... }`. List wraps as `{ items }`.

No `datasetId`, I0 clearance enum, lineage graph, quality score, scanner ID, or privacy FKs.

---

## Persistence / migration

Conceptual only. **No SQL file is created in this ID-assignment pass.** `123_dg2_classification_records.sql` remains a **future conditional reference only**.

If implementation is later authorized:

- runtime SoR remains Dev/Test **in-memory** `Store`;
- additive SQL only (new `classification_records` table; do **not** `ALTER` `dataset_records` or privacy/knowledge tables);
- `UNIQUE (tenant_id, classification_code)`;
- no foreign key to DG1 datasets;
- live PostgreSQL UNVERIFIED;
- next unused filename after committed `122_cd_programme_item_extensions.sql` would be **`123_dg2_classification_records.sql`** **only if** Owner later authorizes implementation (DG2 is now assigned; this pass still does **not** create that file);
- do **not** reuse PQL 109–115; do **not** execute CD Phase 1 files 119–122;
- ADR-0017 **not** reopened.

This approved Stage 1 contract does **not** authorize creating or applying that file.

---

## Workflow (proposed)

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

No classify, scan, or dataset-link endpoints. Illegal status change → `409`.

---

## STOP rule

If later work encounters pressure to add any of the following, **STOP** and return to governance:

- classification engine; auto-classification; ML labelling
- I0 `Classification` type reused as this aggregate or as a row field
- `datasetId` / Dataset Register mutation
- Lineage / QualityRule engines or aggregates
- lakehouse / DLP / scanners / erasure
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen
- CAL / C11+ / Path B auto-selection unpause

---

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. Do not reopen ADR-0012 or ADR-0013.

---

## API (proposed)

New collection **`/v1/classifications`**. Sibling register, not an extension of DG1. Do **not** use `/v1/dg/*` or `/v1/datasets/:id/classifications`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/classifications/health` | `classification:read:register` |
| GET | `/v1/classifications?q=&status=` | `classification:read:register` |
| POST | `/v1/classifications` | `classification:write:register` |
| GET | `/v1/classifications/:id` | `classification:read:register` |
| PATCH | `/v1/classifications/:id` | `classification:write:register` |

Health shape (if later implemented): `module` `classification-register`, `increment` **DG2**, `status` `ok`, `classifications` count, `openClassifications` count.

Do not add classify, scan, lineage, quality, or dataset-nested routes.

---

## RBAC (proposed)

| Permission | Intent |
| --- | --- |
| `classification:read:register` | Health + list/get |
| `classification:write:register` | Create / patch |

Role **`classification.register`** — both. Do **not** reuse `dataset.register`, `dpo`, or I0 clearance as a permission.

Do not create permissions in source code in this approval pass.

---

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

---

## Audit

Sibling Path B registers do **not** call `recordAudit` on the register service. Match that class if implementation is later authorized.

---

## UI (proposed)

- Route **`/commercial/classifications`**
- Nav **Data → Classifications** (sibling of Datasets; do not replace Datasets)
- Register a row; list; detail; mark `done` / `cancelled` while `open`
- Copy: **Classification Register / catalogue**, never classification engine, never I0 clearance UI, never lineage/quality/lakehouse/DLP

Do not create UI files in this approval pass.

---

## Testing

If implementation is later authorized: kernel and API tests for title/notes validation, `CLS-` generation, tenant isolation, human-only mutation, lifecycle, health identity distinct from DG1, RBAC isolation, and non-mutation of DG1/P1–P3/I0.

This contract does **not** authorize writing or running those tests as implementation work.

---

## Exclusions / non-goals

- Classification **engine**; automated classification; ML/rules labelling of data
- Reuse of I0 `Classification` (`Public` … `HighlyRestricted`) as this aggregate or as a field
- Lineage engine; QualityRule engine; remaining `dg` nouns
- DG1 Dataset mutation; `datasetId`
- Lakehouse; DLP; scanners; erasure
- CAL; C11+; I21–I23; EMCOMMS; EXER; SAMPLE; UEM
- Execute migrations 119–122 or any new SQL
- UAT; Production; ADR-0006 closure; live PostgreSQL as SoR

---

## Dependencies

I0 kernel patterns (tenancy / RBAC / human actor). **DG1 is a closed sibling, not a write dependency.** No new vendors. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test draft. ADR-0017 not reopened. DP-0006 not consumed.

---

## Governance / authority matrix

```text
IMPLEMENTATION_AUTHORIZED = NO
STAGE_1_APPROVED = YES
STAGE_1_STATUS = APPROVED
ID_ASSIGNMENT = DG2 / ASSIGNED
ID_ASSIGNMENT_STATUS = ASSIGNED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
DEPLOYMENT = NOT_AUTHORIZED
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
EXECUTION_QUEUE = EMPTY
```

Next gate: **Owner decision on implementation authorization.** DG2 assignment does **not** grant it.
