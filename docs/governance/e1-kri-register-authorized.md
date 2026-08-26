# E1 Selection — KRI Register

> **CURRENT STATE (2026-08-25 Operator E1 IMPLEMENTATION AUTHORIZATION — DEVTEST only)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 and ITL1 Stage 2 remain **in the working tree**; commit is **not** authorized by this document.  
> ITA1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. ITL1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. This record does **not** reopen ITA1 or ITL1 and is **not** ITA1.x / ITL1.x / I15.x.  
> This record **selects** E1, records that Stage 1 has been **authored**, records that Stage 1 is **approved**, and records **IMPLEMENTATION_AUTHORIZED=YES** for Development/Test only against the approved contract.  
> I15 ERM remains **CLOSED**. I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. **EXECUTION_QUEUE=E1 — KRI Register** · **PREVIEW=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED**  
> **CAPABILITY=KRI_REGISTER** · **CAPABILITY_ID=E1** · **ENVIRONMENT=DEVTEST** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES**

**Date:** 2026-08-25  
**Authority (candidate recommendation):** Read-only Path B analysis **RECOMMENDED_CANDIDATE=KRI_REGISTER**.  
**Authority (governance selection + ID assignment):** Operator **PATH B — KRI REGISTER CAPABILITY SELECTION** (2026-08-25) **CAPABILITY=KRI_REGISTER** / **ENVIRONMENT=DEVTEST**.  
**Authority (Stage 1 authoring):** Operator **E1 — KRI REGISTER STAGE 1 CONTRACT AUTHORING ONLY** (2026-08-25).  
**Authority (Stage 1 approval):** Operator **E1 — KRI REGISTER STAGE 1 APPROVAL** (2026-08-25) **STAGE_1_APPROVED=YES**. Approval covers the Stage 1 contract exactly as authored in [`e1-kri-register-preview.md`](../architecture/e1-kri-register-preview.md).  
**Authority (implementation authorization):** Operator **E1 IMPLEMENTATION AUTHORIZATION** (2026-08-25) **ENVIRONMENT=DEVTEST**. Implementation must follow [`e1-kri-register-preview.md`](../architecture/e1-kri-register-preview.md) exactly. Preview, UAT, Production, commit, and push remain **NOT_AUTHORIZED**.  
**Capability ID assigned by this record:** **E1**

This record assigns **E1**. It is an **ERM-family** identifier after **I15**, following the same Operator-established sequential-family pattern as **H1** (after I10), **G1** (after I15 split of compliance), and **P1** (privacy family): family letter + `1`. Repository search found **no** existing use of `E1` as a capability ID. It is **not** I15, **not** I15.x, **not** G6 (GRC family; G1–G5 remain closed), **not** K3 (crisis-command family; K1/K2 remain closed), **not** I3.38, **not** I4.35, **not** I20.23, **not** ITL1.x, **not** a Treatment Register, and **not** EXER / EMCOMMS. I15 remains **CLOSED** and is not reopened. ITA1 and ITL1 remain **CLOSED**. I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **E1** |
| Name | KRI Register |
| Family | erm |
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
| **EXECUTION_QUEUE** | **E1 — KRI Register** — [`e1-kri-register-preview.md`](../architecture/e1-kri-register-preview.md) |
| I15 ERM risk register | CLOSED — not reopened (no mutation of I15 Risk records; not I15.x) |
| G1–G5 GRC | CLOSED — not reopened (not G3 findings; not G6) |
| ITA1 / ITL1 | CLOSED — not reopened; working-tree Stage 2 remains **COMMIT=NOT_AUTHORIZED** |
| I11 / ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| P1 / P2 Privacy | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I15.x / ITA1.x / ITL1.x / I11.x / ITC1.x / ITP1.x / ITR1.x / P1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll / Consent register | **D** — deferred / untouched |
| Endpoint / UEM / MDM | Inventory — not selected |
| Dataset / Data Governance | Not selected (less mature future context) |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test selection; not resolved by this record |
| ADR-0017 | Not reopened |

## Product intent

A tenant-scoped, human-maintained **KRI Register** in the existing Risk / ERM workspace.

A KRI record is a human **label** that a Key Risk Indicator exists, plus associated metadata. It is not a KRI calculation engine, not a dashboard, not a threshold or alerting system, and not time-series analytics.

**I15 Risk** = a human residual-risk register row.  
**E1 KRI** = a human KRI-register row.

E1 is a **REGISTER ONLY**. Distinctness is product identity, not extra workflow invented to enlarge the distinction. The approved field lists, codes, store keys, permissions, APIs, and UI routes are those in the Stage 1 preview.

## Stage 1 contract

**STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES.** Approved Stage 1 contract: [`docs/architecture/e1-kri-register-preview.md`](../architecture/e1-kri-register-preview.md). Implementation is **authorized for Development/Test only**. Preview, UAT, Production, commit, and push remain **not** authorized.

## Explicitly not this capability

Automated KRI calculation; KRI time-series storage; thresholds; alerting; notifications; dashboards; automated scoring; scheduled calculation; Treatment Register; I15 reopen; mutation of I15 Risk records; legal-opinion automation; G3 findings; SAMPLE; Consent; Endpoint; UEM; MDM; Dataset / Data Governance; UAT; Production; PostgreSQL as a newly established system of record; ADR-0006 implementation; ADR-0012 implementation; ADR-0013 implementation; commit of unrelated ITA1/ITL1 working-tree changes; push; AI mutation; I15.x.

## What this record does not do

- **Does** select **KRI_REGISTER** and assign **E1**.
- **Does** record **ENVIRONMENT=DEVTEST**.
- **Does** record that Stage 1 has been authored (`STAGE_1_CREATED=YES`) against [`e1-kri-register-preview.md`](../architecture/e1-kri-register-preview.md).
- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES` / `STAGE_1_STATUS=APPROVED`) as granted by explicit operator instruction on 2026-08-25.
- **Does** authorize implementation (`IMPLEMENTATION_AUTHORIZED=YES`) for Development/Test only.
- **Does** set **EXECUTION_QUEUE=E1 — KRI Register**.
- Does **not** authorize preview (`PREVIEW=NOT_AUTHORIZED`).
- Does **not** reopen I15, ITA1, ITL1, I11, ITC1, ITP1, ITR1, P1, P2, G1–G5, or K1/K2.
- Does **not** authorize UAT or Production.
- Does **not** close or resolve ADR-0006, ADR-0012, or ADR-0013.
- Does **not** reopen ADR-0017.
- Does **not** authorize push or commit.

## Contract

**CAPABILITY=KRI_REGISTER** · **CAPABILITY_ID=E1** · **ENVIRONMENT=DEVTEST** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** · **PREVIEW=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **EXECUTION_QUEUE=E1 — KRI Register** — [`docs/architecture/e1-kri-register-preview.md`](../architecture/e1-kri-register-preview.md).
