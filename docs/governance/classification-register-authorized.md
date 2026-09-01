# Selection — Classification Register (Stage 1 approved; DG2 assigned)

> **CURRENT STATE (2026-09-01 Owner DG2 ID assignment only — not implementation)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **origin/master=`d918f98729f2f3fd0969d7cc6066700dcb21fb01`**  
> Governance reconciliation on `feat/cd-phase1-foundation` = `8941a866d2f3317f5cafa0bb331456994fcc7e69` (docs only; not required to implement this capability).  
> **CAPABILITY=CLASSIFICATION_REGISTER** · **SELECTION_STATUS=SELECTED** · **CAPABILITY_ID=DG2** · **ID_ASSIGNMENT=DG2 / ASSIGNED** · **ID_ASSIGNMENT_STATUS=ASSIGNED**  
> **STAGE_1_AUTHORING=AUTHORIZED** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES**  
> **IMPLEMENTATION_AUTHORIZED=NO** · **PREVIEW=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** (this is a named leftover-noun selection, not Path B auto-selection) · **NEXT_INCREMENT=NONE_AUTHORIZED**  
> **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **DEPLOYMENT=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **DP-0006=NOT APPROVED**  
> Approved Stage 1 contract: [`../architecture/classification-register-preview.md`](../architecture/classification-register-preview.md).

**Date:** 2026-09-01  
**Authority (selection):** Product Owner **SELECT CLASSIFICATION AS NEXT CANDIDATE CAPABILITY** (2026-09-01) — name **Classification**, interpreted **narrowly** as a Path B **Classification Register** (existence catalogue), **not** a classification engine and **not** I0 information-classification clearance.  
**Authority (Stage 1 authoring):** Same 2026-09-01 instruction — **Stage 1 contract authoring and governance assessment only**.  
**Authority (Stage 1 approval):** Product Owner **CLASSIFICATION REGISTER — STAGE 1 APPROVAL ONLY** (2026-09-01) **STAGE_1_APPROVED=YES**. Bounded leftover-noun Classification Register sibling of DG1 Dataset. That approval did **not** assign DG2 and did **not** authorize implementation.  
**Authority (capability ID assignment):** Product Owner **ASSIGN CAPABILITY ID DG2 ONLY** (2026-09-01) **CAPABILITY_ID=DG2** / **ID_ASSIGNMENT=DG2 / ASSIGNED**. Uniqueness check found **no** other capability, architecture file, migration, or health increment using **DG2**. Historical DG1 / PR1 / PR2 / backlog lines that DG2 was **not created** remain accurate **for those records** and are **not** rewritten.  
**Capability ID assigned by this record:** **DG2** (`ID_ASSIGNMENT_STATUS=ASSIGNED`). Assignment does **not** authorize implementation.

This record selects the capability **name** `CLASSIFICATION_REGISTER`: a bounded human-maintained **catalogue that a classification register row exists**. It sits in domain-map context `dg` as the leftover 2.2 noun **Classification** after **DG1 Dataset** (leftover noun **Dataset** only).

It does **not** select Lineage or QualityRule. It does **not** select the entire `dg` programme. It does **not** reopen DG1. It **does** approve Stage 1 (`STAGE_1_APPROVED=YES`). It **does** assign **CAPABILITY_ID=DG2**. It does **not** authorize implementation.

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
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
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
-> DEV/TEST IMPLEMENTATION AUTHORIZATION          ← NO
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
- **Does** keep **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**.
- **Does** keep **EXECUTION_QUEUE=EMPTY**.

## What this record does not do

- Does **not** authorize implementation, Preview, commit, push, UAT, Production, or deployment.
- Does **not** execute or apply SQL (including 119–122 and any future additive file).
- Does **not** select Lineage, QualityRule, lakehouse, DLP, CAL, or C11+.
- Does **not** reopen DG1, I0 classification, P1–P3, or other closed increments.
- Does **not** unpause Path B general auto-selection.
- Does **not** modify application code, tests, or migrations.

## Next gate

**STAGE_1_APPROVED=YES.** **CAPABILITY_ID=DG2.** **ID_ASSIGNMENT=DG2 / ASSIGNED.** **IMPLEMENTATION_AUTHORIZED=NO.** Owner decision on **implementation authorization**. ID assignment does **not** grant it.
