# Dataset Register — Stage 1 contract (approved)

> **CURRENT STATE (2026-08-26 Operator DG1 DATASET REGISTER — COMMIT AUTHORIZATION — COMMIT EXECUTED)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · parent HEAD **`0dfb948f1d5618f3a2dc60b8f191fcd4a574e358`** (P3 Consent Register). P3 remains **COMPLETE**. ITE1 and E2 remain **CLOSED / ACCEPTED**.  
> This document is the **approved** Stage 1 architecture contract. Dev/Test implementation is **complete**. Dev/Test Preview **PASS**. Commit **EXECUTED**. It is **not** push, UAT, or Production authorization.  
> **CAPABILITY=DATASET_REGISTER** · **SELECTION_STATUS=SELECTED** · **CAPABILITY_ID=DG1** · **ID_ASSIGNMENT=EXECUTED**  
> **STAGE_1_AUTHORING=AUTHORIZED** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES**  
> **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test) · **IMPLEMENTATION=COMPLETE** · **PREVIEW=PASS** · **COMMIT=EXECUTED** · **PUSH=NOT_AUTHORIZED**  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **EXECUTION_QUEUE=EMPTY** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> Authority record: [`../governance/dataset-register-authorized.md`](../governance/dataset-register-authorized.md).

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **DG1** |
| Capability name | Dataset Register |
| Family | data governance |
| Domain | Data Governance (`dg` — domain map 2.2 leftover noun **Dataset** only) |
| Predecessor | I0 kernel (complete). P1 / P2 / P3 / I16 / I17 / I19 / ITE1 / E1 / E2 complete and **not** reopened |
| Architecture status | Approved Stage 1 contract; Dev/Test implementation complete |
| Stage | Stage 1 |
| **STATUS** | **SELECTED; ID ASSIGNED (DG1); STAGE 1 APPROVED; IMPLEMENTATION COMPLETE; PREVIEW PASS; COMMIT EXECUTED** |
| Implementation status | **COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` is the Dev/Test SoR. Additive SQL `111_dg1_dataset_records.sql` (next unused after committed `110_p3_consent_records.sql`; do **not** use local uncommitted PQL drafts). Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record. |
| Runtime health increment | **DG1** (`module` `dataset-register`; must not replace P1 / P2 / P3 / I19 health) |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **DG1** |
| **STAGE_1_AUTHORING** | **AUTHORIZED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test) |
| **PREVIEW** | **PASS** |
| **COMMIT** | **EXECUTED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **ADR-0006** | **OPEN** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |

Authority: 2026-08-26 Operator **PRODUCT OWNER DECISION — SELECT DATASET / DATA GOVERNANCE FOR STAGE 1**, interpreted as **Dataset Register** only; 2026-08-26 Operator **GOVERNANCE ACTION — ASSIGN DG1 TO DATASET REGISTER** (`CAPABILITY_ID=DG1`); 2026-08-26 Operator **DG1 DATASET REGISTER — STAGE 1 REVIEW / APPROVAL GATE** (`STAGE_1_APPROVED=YES`); 2026-08-26 Operator **DG1 Dataset Register — IMPLEMENTATION AUTHORIZATION** (`IMPLEMENTATION_AUTHORIZED=YES`, Dev/Test only). Committed `master` uniqueness re-check found no existing `DG1`. It is **not** D1, **not** G6, **not** C11, **not** I24, **not** O7, **not** H2, **not** P1/P2/P3, **not** ITE1/ITA1/ITL1, and **not** E1/E2. This document does **not** authorize push, UAT, Production, hosting, or ADR-0006 closure, and does **not** reopen P1 / P2 / P3 / ITE1 / E1 / E2 / I16 / I17 / I19 / I0 classification. Preview **PASS** and commit **EXECUTED** are recorded by the 2026-08-26 commit authorization.

**Selection ≠ Stage 1 approval.**  
**Stage 1 contract ≠ implementation authorization.**  
**ID assignment ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation complete ≠ Preview authorization.**  
**Preview ≠ UAT.**  
**UAT ≠ Production.**

The sections after this heading are the **approved** architecture contract. They are not a Preview, commit, or push queue.

```text
CAPABILITY = DATASET_REGISTER
CAPABILITY_ID = DG1
CAPABILITY_NAME = Dataset Register
STAGE = 1
STATUS = SELECTED_ID_ASSIGNED_STAGE_1_APPROVED_IMPLEMENTATION_COMPLETE_PREVIEW_PASS_COMMIT_EXECUTED
STAGE_1_AUTHORING = AUTHORIZED
STAGE_1_CREATED = YES
STAGE_1_STATUS = APPROVED
STAGE_1_APPROVED = YES
IMPLEMENTATION_AUTHORIZED = YES
PREVIEW = PASS
COMMIT = EXECUTED
PUSH = NOT_AUTHORIZED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
ADR_0006 = OPEN
EXECUTION_QUEUE = EMPTY
NEXT_INCREMENT = NONE_AUTHORIZED
NEW_CAPABILITY_AUTHORIZED = NONE
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
```

---

## Objective

Deliver a **Data** workspace surface where an authorised human can record **Dataset Register rows**: a human catalogue that a **dataset exists**, or was cancelled.

**Dataset Register = catalogue/governance record of dataset-register rows.**  
**Dataset Register ≠ Data Governance platform.**  
**Dataset Register ≠ lakehouse / catalog engine.**

The register is an **existence catalogue only**. It must **not** govern dataset contents, evaluate data quality, discover lineage, classify data automatically, enforce retention, or perform privacy-compliance determinations. It must **not** discover, crawl, classify, lineage-trace, quality-test, ingest, scan, or delete data.

Domain map 2.2 names **Dataset, Classification, Lineage, QualityRule** under `dg`, owned by CDO. This selection is the leftover **Dataset** noun only. Classification, Lineage, and QualityRule remain **not selected**.

---

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **Dataset Register** | A human record that a dataset **catalogue row exists** (or was cancelled) | New store (`datasetRecords`) |
| **I0 Classification** | Information-classification clearance (`Public` … `HighlyRestricted`) | Closed kernel concept — **not** reused as a Dataset Classification aggregate |
| **P1 Processing activity / DSR** | RoPA / DSR register rows | Closed — **no** `activityId` / `dsrId` |
| **P2 DPIA** | DPIA case register row | Closed — **no** `dpiaId` |
| **P3 Consent Register** | Consent catalogue row | Closed — **no** consent linkage |
| **I16 workpapers** | Audit engagement evidence | Closed — Dataset is not an evidence store |
| **I17 backup jobs** | BCM backup-evidence rows | Closed |
| **I19 knowledge documents** | Knowledge / search documents | Closed |
| **Lakehouse Dataset** | Phase 5 analytical plane / graph node type | Inventory — **not** this SoR |

Do **not** add lineage edges, quality scores, scanner output, provider IDs, P1/P2/P3 foreign keys, or I0 `Classification` fields merely to enlarge the distinction.

---

## Scope

| Deliverable | In scope (Stage 1 approved) |
| --- | --- |
| Dataset-register create / list / get / patch (while `open`) | Yes |
| Codes unique per tenant with a dedicated prefix | Yes (`DST-`) |
| Statuses: `open` → `done`; `open` → `cancelled`; those two terminal | Yes (catalogue membership only — **not** data-quality or retention state) |
| Required `title`; optional `notes` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Dedicated store, API, health, UI, permissions, role | Yes |
| In-memory Dev/Test SoR if implementation is later authorized | Yes |
| Additive SQL only if a later implementation gate authorizes it | Yes (not in this approval pass) |
| Classification / Lineage / QualityRule engines | No |
| Automated classification / lineage discovery / quality execution | No |
| Lakehouse / Iceberg / warehouse / ETL / CDC / pipelines / semantic layer / BI/ML | No |
| Knowledge-graph Dataset nodes as SoR | No |
| DLP / live scanning / erasure / privacy-rights automation | No |
| External data-catalog providers / production ingestion | No |
| `activityId` / `dsrId` / `dpiaId` / `consentId` / lawful-basis / consent capture | No |
| UAT / Production / ADR-0006 closure | No |

Required field is **`title`**, matching ITA1/ITL1/ITR1/P2/ITE1/P3 registers.

### Approved code prefix

**`DST-`** (example `DST-0001`).

- Not a capability ID (capability ID is **DG1**).
- Committed `master` search found **no** `DST-` allocator and no `/v1/datasets` collection.
- This prefix is **approved** as part of Stage 1. It does not authorize implementation.

No date fields as automated expiry, scan, or pipeline drivers.

Do **not** use statuses that imply data quality, retention, ingestion, legal hold, or compliance (`valid`, `invalid`, `classified`, `scanned`, `lineaged`, `quality_failed`, `ingested`, `erased`, `granted`, `withdrawn`, `expired`, `approved`). This catalogue uses only **`open` / `done` / `cancelled`**.

`done` means the human marked the **register row** complete. It does **not** mean the data is validated, or that the dataset is approved, compliant, classified, legally retained, or production-ready. It is **not** lineage-complete or quality-passed.

---

## Domain model (conceptual; approved)

**dataset_records** (runtime store key **`datasetRecords`**)

- Not I19 `knowledgeDocuments`
- Not I16 workpapers
- Not I17 backup jobs
- Not P1/P2/P3 privacy stores
- Not lakehouse / graph Dataset nodes

Proposed fields:

- `id`
- `datasetCode` unique per tenant (`DST-0001`) — a **register code**, not a catalog URN
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ dataset: ... }`. List wraps as `{ items }` (ITA1/ITL1/P2/ITE1/P3 pattern).

No `activityId`, `dsrId`, `dpiaId`, `consentId`, lawful-basis field, I0 `Classification` type, lineage graph, quality score, scanner ID, provider ID, connection string, schema dump, or evidence blob.

---

## Persistence / migration

Additive SQL was created at implementation authorization:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `dataset_records` table; do **not** `ALTER` privacy, knowledge, audit, BCM, consent, endpoint, or ERM tables);
- `UNIQUE (tenant_id, dataset_code)`;
- no foreign key to P1 / P2 / P3 / I16 / I17 / I19 tables;
- live PostgreSQL UNVERIFIED;
- filename **`111_dg1_dataset_records.sql`** (next unused after committed `110_p3_consent_records.sql`); do **not** use local uncommitted PQL drafts (`109_pql1_*`, `110_pql3_item_details.sql`, `111`–`115` PQL files);
- ADR-0017 **not** reopened.

---

## Workflow (approved)

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule.

No dedicated classify, lineage, quality, crawl, scan, ingest, erase, or catalog endpoints. Lifecycle uses **PATCH status** only. Illegal status change → `409` `invalid_transition`; patch when `done` → `409` `done`; patch when `cancelled` → `409` `cancelled`.

---

## STOP rule

If later work encounters pressure to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- Classification / Lineage / QualityRule engines or aggregates
- automated classification, lineage discovery, or quality-rule execution
- lakehouse / Iceberg / warehouse / ETL / CDC / pipelines / semantic layer / BI/ML
- knowledge-graph Dataset nodes as system of record
- DLP / live scanning / erasure / privacy-rights automation
- external data-catalog providers / production ingestion
- I0 `Classification` type reused as a Dataset Classification aggregate
- `activityId` / `dsrId` / `dpiaId` / consent linkage / P1–P3 mutation
- I16 evidence store / I17 backup / I19 document mutation
- scheduler / SLA / automation / AI mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen
- hosting, residency, Production DB, or provider infrastructure decisions

---

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous dataset discovery, classification, or ingestion.

Do not introduce a new actor type, IdP, vault, catalog connector, or crawler. Do not reopen ADR-0012 or ADR-0013.

---

## API (approved)

New collection **`/v1/datasets`**. This is a **sibling register**, not an extension of P1, P2, P3, I16, I17, or I19. Context key `dg` is **not** a runtime namespace.

Do **not** attach this capability to `/v1/privacy/*`, `/v1/consents*`, `/v1/dg/*`, `/v1/knowledge/*`, `/v1/audit/*`, or `/v1/bcm/*`. Those routes are not modified.

JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/datasets/health` | `dataset:read:register` |
| GET | `/v1/datasets?q=&status=` | `dataset:read:register` |
| POST | `/v1/datasets` | `dataset:write:register` |
| GET | `/v1/datasets/:id` | `dataset:read:register` |
| PATCH | `/v1/datasets/:id` | `dataset:write:register` |

Health shape: `module` `dataset-register`, `increment` **DG1**, `status` `ok`, `datasets` count, `openDatasets` count.

Do not add classify, lineage, quality, crawl, scan, ingest, erase, catalog, lakehouse, activity, dsr, dpia, consent, bulk, or automation routes.

Committed `master` has no `/v1/datasets` collection.

---

## RBAC (approved)

| Permission | Intent |
| --- | --- |
| `dataset:read:register` | Health + list/get |
| `dataset:write:register` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only, if implementation is later authorized). Role **`dataset.register`** — both. Alice and partner — 403.

Do **not** reuse or broaden:

- P1 / P2 / P3 privacy or consent permissions or roles (`dpo`, `privacy.dpia`, `consent.register`)
- ITE1 / E1 / E2 roles (`it.endpoint`, `erm.kri`, `erm.treatment`)
- I19 `knowledge:*` permissions
- I16 / I17 permissions
- I0 classification clearance as a Dataset permission

Do not create implementation permissions in source code in this Stage 1 approval pass.

---

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404. No cross-tenant administrative behaviour.

---

## Audit

Sibling registers in this class (ITA1/ITL1/ITR1/P2/ITE1/P3) do **not** call `recordAudit` on the register service. This draft must match that class if implementation is later authorized. Do not introduce a new audit subsystem in this authoring pass.

---

## UI (approved)

- Route **`/commercial/datasets`**
- Nav **Data → Datasets** (do not replace Privacy, Knowledge, or ERM nav)
- Register a row (required title + optional notes); list; open detail; mark `done` or `cancelled` while `open`
- Copy states this is a **Dataset Register / catalogue**, never a Data Governance platform, data-catalog engine, data-quality platform, lineage platform, classification engine, lakehouse, or DLP system; not a P1/P2/P3 replacement; not I19 Knowledge

Do not add classifiers, lineage graphs, quality dashboards, connection wizards, scanners, or evidence upload.

Do not create UI files in this Stage 1 approval pass.

---

## Testing

Kernel and API Dataset Register tests cover title/notes validation, `DST-` generation, tenant isolation, human-only mutation, lifecycle, health identity, RBAC isolation, and closed-increment non-mutation.

---

## Exclusions / non-goals

- Classification engine; automated classification; reuse of I0 `Classification` as a Dataset aggregate
- Lineage engine; automated lineage discovery; crawlers
- QualityRule engine; automated quality evaluation
- Lakehouse; Iceberg; warehouse; ETL; CDC; pipelines; semantic layer; BI/ML platform
- Knowledge-graph Dataset nodes as SoR
- DLP; live data scanning; erasure/deletion engines; privacy-rights automation
- External data-catalog providers; production data ingestion
- ProcessingActivity / DSR / DPIA / Consent relationships; `activityId` / `dsrId` / `dpiaId` / `consentId`; lawful-basis linkage; consent capture
- Mutation of P1, P2, P3, I16, I17, I19, ITE1, E1, E2
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT; payroll
- O7; PQL; UEM/MDM
- UAT; Production; ADR-0006 hosting/residency; live PostgreSQL as SoR; new vendors

---

## Verification limitations

This Stage 1 contract is implemented in Development/Test. Live PostgreSQL UNVERIFIED. Preview is **not** authorized. Capability ID **DG1** is assigned; Stage 1 is **approved**; implementation is **complete**; Preview is **not** authorized.

---

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter P1/P2/P3/I16/I17/I19 schema or behaviour to “make room” for Dataset Register.

---

## Dependencies

I0 kernel patterns (tenancy / RBAC / human actor). P1, P2, P3, I16, I17, and I19 are **closed siblings**, not write dependencies. No new vendors, catalog providers, crawlers, identity providers, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test draft. ADR-0017 not reopened. Uncommitted O7 / PQL / DP-0006 working-tree material is not authority.

---

## Governance / authority matrix

```text
CAPABILITY = DATASET_REGISTER
CAPABILITY_ID = DG1
CAPABILITY_NAME = Dataset Register
STAGE = 1
STATUS = SELECTED_ID_ASSIGNED_STAGE_1_APPROVED_IMPLEMENTATION_COMPLETE_PREVIEW_PASS_COMMIT_EXECUTED
STAGE_1_AUTHORING = AUTHORIZED
STAGE_1_CREATED = YES
STAGE_1_STATUS = APPROVED
STAGE_1_APPROVED = YES
IMPLEMENTATION_AUTHORIZED = YES
PREVIEW = PASS
COMMIT = EXECUTED
PUSH = NOT_AUTHORIZED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
ADR_0006 = OPEN
HOSTING_OPTION_SELECTED = NO
EXECUTION_QUEUE = EMPTY
NEXT_INCREMENT = NONE_AUTHORIZED
NEW_CAPABILITY_AUTHORIZED = NONE
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
```

Approved Stage 1 fields: code prefix `DST-`; store key `datasetRecords`; API `/v1/datasets` (not `/v1/privacy/*`, not `/v1/dg/*`); health `/v1/datasets/health` (`increment` **DG1**, `module` `dataset-register`); UI `/commercial/datasets`; permissions `dataset:read:register` / `dataset:write:register`; role `dataset.register`; lifecycle `open` / `done` / `cancelled`. Additive SQL `111_dg1_dataset_records.sql`. Runtime SoR remains in-memory `Store`.

Next gate: **PUSH AUTHORIZATION STILL REQUIRED**. This is not push, UAT, Production, or ADR-0006 closure.
