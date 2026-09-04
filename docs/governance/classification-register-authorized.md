# Selection — Classification Register (Stage 1 approved; DG2 assigned; Dev/Test implementation written)

> **CURRENT STATE (2026-09-01 Owner DG2 implementation authorization — Dev/Test only; not UAT, not Production)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **origin/master=`d918f98729f2f3fd0969d7cc6066700dcb21fb01`**  
> Governance artifacts committed at `74268a4c0d1d961728e8fcdc08fbff528e585070` (docs only).  
> **CAPABILITY=CLASSIFICATION_REGISTER** · **SELECTION_STATUS=SELECTED** · **CAPABILITY_ID=DG2** · **ID_ASSIGNMENT=DG2 / ASSIGNED** · **ID_ASSIGNMENT_STATUS=ASSIGNED**  
> **STAGE_1_AUTHORING=AUTHORIZED** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES**  
> **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test) · **PREVIEW=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED**  
> **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **DEPLOYMENT=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **DP-0006=NOT APPROVED**  
> Approved Stage 1 contract: [`../architecture/classification-register-preview.md`](../architecture/classification-register-preview.md).

**Date:** 2026-09-01  
**Authority (selection):** Product Owner **SELECT CLASSIFICATION AS NEXT CANDIDATE CAPABILITY** (2026-09-01) — name **Classification**, interpreted **narrowly** as a Path B **Classification Register** (existence catalogue), **not** a classification engine and **not** I0 information-classification clearance.  
**Authority (Stage 1 authoring):** Same 2026-09-01 instruction — **Stage 1 contract authoring and governance assessment only**.  
**Authority (Stage 1 approval):** Product Owner **CLASSIFICATION REGISTER — STAGE 1 APPROVAL ONLY** (2026-09-01) **STAGE_1_APPROVED=YES**. Bounded leftover-noun Classification Register sibling of DG1 Dataset. That approval did **not** assign DG2 and did **not** authorize implementation.  
**Authority (capability ID assignment):** Product Owner **ASSIGN CAPABILITY ID DG2 ONLY** (2026-09-01) **CAPABILITY_ID=DG2** / **ID_ASSIGNMENT=DG2 / ASSIGNED**. Uniqueness check found **no** other capability, architecture file, migration, or health increment using **DG2**. Historical DG1 / PR1 / PR2 / backlog lines that DG2 was **not created** remain accurate **for those records** and are **not** rewritten.  
**Authority (implementation):** Product Owner **IMPLEMENT DG2 CLASSIFICATION REGISTER** (2026-09-01) **IMPLEMENTATION_AUTHORIZED=YES** for Development/Test only against the approved Stage 1 contract. Does **not** authorize Preview, commit, push, UAT, Production, deployment, or SQL/migrations.  
**Capability ID assigned by this record:** **DG2** (`ID_ASSIGNMENT_STATUS=ASSIGNED`).

This record selects the capability **name** `CLASSIFICATION_REGISTER`: a bounded human-maintained **catalogue that a classification register row exists**. It sits in domain-map context `dg` as the leftover 2.2 noun **Classification** after **DG1 Dataset** (leftover noun **Dataset** only).

It does **not** select Lineage or QualityRule. It does **not** select the entire `dg` programme. It does **not** reopen DG1. It **does** approve Stage 1 (`STAGE_1_APPROVED=YES`). It **does** assign **CAPABILITY_ID=DG2**. It **does** authorize Dev/Test implementation (`IMPLEMENTATION_AUTHORIZED=YES`). It does **not** authorize Preview, commit, push, UAT, Production, or deployment.

DG1 remains **IMPLEMENTED / CLOSED** (Dev/Test). Historical DG1 text that Classification was **not selected** remains accurate **for that 2026-08-26 record**. This 2026-09-01 record is a **later** Owner selection. It does **not** rewrite the DG1 file.

| Field | Value |
| --- | --- |
| Capability name | Classification Register |
| **CAPABILITY** | **CLASSIFICATION_REGISTER** |
| **SELECTION_STATUS** | **SELECTED** (Stage 1 definition; not implementation) |
| **CAPABILITY_ID** | **DG2** |
| **ID_ASSIGNMENT** | **DG2 / ASSIGNED** |
| **ID_ASSIGNMENT_STATUS** | **ASSIGNED** |
| Family | data governance (`dg`) — leftover 2.2 noun **Classification** only |
| Environment | Development/Test only **if** later authorized; **not** authorized by this record |
| **STAGE_1_AUTHORING** | **AUTHORIZED** (this record) |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test) |
| **PREVIEW** | **NOT_AUTHORIZED** |
| **COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **DEPLOYMENT** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |
| **PATH_B_GENERAL_AUTO_SELECTION** | **PAUSED** |
| DG1 Dataset Register | CLOSED — not reopened (no `datasetId` / `/v1/datasets` mutation) |
| I0 information classification | CLOSED kernel concept — **not** this aggregate |
| Lineage / QualityRule | **Not selected** |
| CAL / C11+ / I21–I23 | Deferred / not created — not this capability |
| ADR-0006 / 0012 / 0013 | Remain **OPEN** |
| DP-0006 | **NOT APPROVED** |
| ADR-0017 | Not reopened |

## Governance sequence

```text
SELECTION                                         ← AUTHORIZED (this record; name Classification)
-> STAGE 1 CONTRACT AUTHORING                     ← AUTHORIZED (this record)
-> STAGE 1 REVIEW/APPROVAL                        ← YES (this record; contract only)
-> CAPABILITY ID ASSIGNMENT                       ← EXECUTED (DG2; this record)
-> DEV/TEST IMPLEMENTATION AUTHORIZATION          ← YES (this record; Dev/Test only)
-> PREVIEW / COMMIT / PUSH                        ← NOT_AUTHORIZED
-> UAT / Production / deployment                  ← NOT_AUTHORIZED
```

**Selection ≠ Stage 1 approval.**  
**Stage 1 authoring ≠ Stage 1 approval.**  
**ID assignment ≠ implementation authorization.**  
**Stage 1 approval ≠ implementation authorization.**

## What this record does

- **Does** record **CAPABILITY=CLASSIFICATION_REGISTER** / **SELECTION_STATUS=SELECTED**.
- **Does** interpret Owner “Classification” as a Path B **Classification Register** leftover noun after DG1.
- **Does** authorize **Stage 1 contract authoring**.
- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES` / `STAGE_1_STATUS=APPROVED`).
- **Does** assign **CAPABILITY_ID=DG2** (`ID_ASSIGNMENT=DG2 / ASSIGNED`). DG-family sequential after **DG1**; unused elsewhere as a capability ID.
- **Does** authorize Development/Test implementation (`IMPLEMENTATION_AUTHORIZED=YES`).
- **Does** keep **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**.
- **Does** keep **EXECUTION_QUEUE=EMPTY**.

## What this record does not do

- Does **not** authorize Preview, commit, push, UAT, Production, or deployment.
- Does **not** execute or apply SQL (including 119–122 and any future additive file).
- Does **not** select Lineage, QualityRule, lakehouse, DLP, CAL, or C11+.
- Does **not** reopen DG1, I0 classification, P1–P3, or other closed increments.
- Does **not** unpause Path B general auto-selection.

## Next gate

**STAGE_1_APPROVED=YES.** **CAPABILITY_ID=DG2.** **ID_ASSIGNMENT=DG2 / ASSIGNED.** **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test). **PREVIEW=NOT_AUTHORIZED.** Owner decision on Preview / commit. Implementation authorization does **not** grant UAT, Production, push, or PR.
