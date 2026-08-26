# Selection — Treatment Register

> **CURRENT STATE (2026-08-25 Operator E2 TREATMENT REGISTER IMPLEMENTATION AUTHORIZATION — DEVTEST only)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 and ITL1 Stage 2 remain **in the working tree**; commit is **not** authorized by this document.  
> ITA1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. ITL1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. This record does **not** reopen ITA1 or ITL1 and is **not** ITA1.x / ITL1.x / I15.x / E1.x.  
> This record **selects** E2, records that Stage 1 has been **authored**, records that Stage 1 is **approved**, and records **IMPLEMENTATION_AUTHORIZED=YES** for Development/Test only against the approved contract.  
> I15 ERM remains **CLOSED**. E1 KRI remains **CLOSED**. I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. **EXECUTION_QUEUE=E2 — Treatment Register** · **PREVIEW=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED**  
> **CAPABILITY=TREATMENT_REGISTER** · **CAPABILITY_ID=E2** · **SELECTION_STATUS=SELECTED** · **ENVIRONMENT=DEVTEST** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES**

**Date:** 2026-08-25  
**Authority (candidate recommendation):** Read-only Path B analysis **RECOMMENDED_CANDIDATE=TREATMENT_REGISTER**.  
**Authority (governance selection of NAME):** Operator **PATH B — OPERATOR SELECTION ONLY** (2026-08-25) **CAPABILITY=TREATMENT_REGISTER** / **SELECTION_STATUS=SELECTED**.  
**Authority (Stage 1 authoring + ID assignment):** Operator **PATH B — TREATMENT REGISTER STAGE 1 AUTHORING ONLY** (2026-08-25). Contract: [`e2-treatment-register-preview.md`](../architecture/e2-treatment-register-preview.md).  
**Authority (Stage 1 approval):** Operator **E2 TREATMENT REGISTER STAGE 1 APPROVAL** (2026-08-25) **STAGE_1_APPROVED=YES**. Approval covers the Stage 1 contract exactly as authored in [`e2-treatment-register-preview.md`](../architecture/e2-treatment-register-preview.md).  
**Authority (implementation authorization):** Operator **E2 TREATMENT REGISTER IMPLEMENTATION AUTHORIZATION** (2026-08-25) **ENVIRONMENT=DEVTEST**. Implementation must follow [`e2-treatment-register-preview.md`](../architecture/e2-treatment-register-preview.md) exactly. Preview, UAT, Production, commit, and push remain **NOT_AUTHORIZED**.  
**Capability ID assigned by this record:** **E2**

This record selects the capability **name** `TREATMENT_REGISTER` and assigns **E2**. It is an **ERM-family** identifier after **I15** and **E1**, following the same Operator-established sequential-family pattern as **E1** (after I15), **H1** (after I10), **G2** (after G1), and **P2** (after P1): family letter + next unused integer. Repository search found **no** existing use of `E2` as a capability ID. It is **not** I15, **not** I15.x, **not** E1, **not** E1.x, **not** T1, **not** G6, **not** K3, and **not** a treatment engine. I15 remains **CLOSED**. E1 remains **CLOSED** (implementation authorization spent; implementation review closed). ITA1 and ITL1 remain **CLOSED**. I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **E2** |
| Name | Treatment Register |
| **CAPABILITY** | **TREATMENT_REGISTER** |
| **SELECTION_STATUS** | **SELECTED** |
| Family | erm (named leftover after I15 Risk and E1 KRI; not an I15 or E1 reopen) |
| Environment | Development/Test only (**ENVIRONMENT=DEVTEST**) |
| **STATUS** | **SELECTED; STAGE 1 APPROVED; IMPLEMENTATION AUTHORIZED (DEVTEST)** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** |
| **PREVIEW** | **NOT_AUTHORIZED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **E2 — Treatment Register** — [`e2-treatment-register-preview.md`](../architecture/e2-treatment-register-preview.md) |
| I15 ERM risk register | CLOSED — not reopened (not I15.x; I15 treatment **status** on risks is unchanged) |
| E1 KRI Register | CLOSED — not reopened (not E1.x; E1 implementation authorization remains spent) |
| ITA1 / ITL1 | CLOSED — not reopened; working-tree Stage 2 remains **COMMIT=NOT_AUTHORIZED** |
| G1–G5 GRC | CLOSED — not reopened (not G3; not G6) |
| I11 / ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| P1 / P2 Privacy | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| Endpoint / UEM / MDM | Inventory — not required; not selected |
| Consent register | Not required; not selected |
| Dataset / Data Governance | Not required; not selected |
| I15.x / E1.x / T1 / ITA1.x / ITL1.x / I11.x / ITC1.x / ITP1.x / ITR1.x / P1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll | **D** — deferred / untouched |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test authorization; not resolved by this record |
| ADR-0017 | Not reopened |

## Stage 1 contract

**STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES.** Approved Stage 1 contract: [`docs/architecture/e2-treatment-register-preview.md`](../architecture/e2-treatment-register-preview.md). The preview document remains the product-contract artifact. This governance record is the approval and Dev/Test implementation-authorization authority. Preview, UAT, Production, commit, and push remain **not** authorized.

## What this record does

- **Does** record **CAPABILITY=TREATMENT_REGISTER**.
- **Does** record **SELECTION_STATUS=SELECTED**.
- **Does** assign **CAPABILITY_ID=E2**.
- **Does** record **STAGE_1_CREATED=YES**.
- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES` / `STAGE_1_STATUS=APPROVED`) as granted by Operator **E2 TREATMENT REGISTER STAGE 1 APPROVAL** on 2026-08-25.
- **Does** authorize implementation (`IMPLEMENTATION_AUTHORIZED=YES`) for Development/Test only as granted by Operator **E2 TREATMENT REGISTER IMPLEMENTATION AUTHORIZATION** on 2026-08-25.
- **Does** set **EXECUTION_QUEUE=E2 — Treatment Register**.

## What this record does not do

- Does **not** authorize Preview, UAT, Production, commit, or push.
- Does **not** reopen I15, E1, ITA1, or ITL1.
- Does **not** authorize E2.x, I15.x, or E1.x.
- Does **not** require Endpoint/UEM, Consent, Dataset, G3, or SAMPLE.

## Next gate

Preview, UAT, Production, commit, and push remain **NOT_AUTHORIZED**. They require **separate** operator instructions.
