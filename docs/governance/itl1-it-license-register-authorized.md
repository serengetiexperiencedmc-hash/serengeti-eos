# ITL1 Selection — IT License Register

> **CURRENT STATE (2026-08-25 Stage 1 approved + Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 and ITL1 Stage 2 remain **in the working tree**; commit is **not** authorized by this document.  
> ITL1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `106_itl1_it_licenses.sql`).  
> ITA1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. This record does **not** reopen ITA1 and is **not** ITA1.x.  
> I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **PREVIEW=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=LICENSE_REGISTER** · **CAPABILITY_ID=ITL1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

**Date:** 2026-08-25  
**Authority (candidate acceptance):** Operator **accept** of Path B recommendation **CANDIDATE=LICENSE_REGISTER** / **RECOMMENDATION=READY_FOR_OPERATOR_SELECTION**.  
**Authority (governance selection + ID assignment):** Operator **PROCEED WITH GOVERNANCE SELECTION OF THE LICENSE REGISTER ONLY** (2026-08-25) **CAPABILITY=LICENSE_REGISTER**.  
**Authority (Stage 1 authoring):** Operator **PROCEED WITH ITL1 STAGE 1 CONTRACT AUTHORING ONLY** (2026-08-25).  
**Authority (Stage 1 approval):** Operator **ITL1 STAGE 1 APPROVAL** (2026-08-25) **STAGE_1_APPROVED=YES**.  
**Authority (Dev/Test execution):** Operator **ITL1 IMPLEMENTATION AUTHORIZATION** (2026-08-25) **IMPLEMENTATION_AUTHORIZED=YES** / **ENVIRONMENT=DEVTEST**. Execution-queue entry was **ITL1 — IT License Register** against [`docs/architecture/itl1-it-license-register-preview.md`](../architecture/itl1-it-license-register-preview.md); the queue is **empty** after Stage 2 completion.  
**Capability ID assigned by this record:** **ITL1**

This record assigns **ITL1**. It is an **asset-family** identifier using the same Operator-established `IT` + register initial + `1` pattern as **ITC1**, **ITP1**, **ITR1**, and **ITA1**, applied to domain-map 2.2 noun **License** (context `asset`, not `itsm`). Repository search found **no** existing use of `ITL1`. It is **not** ITA1, **not** ITA1.x, **not** I11.x, **not** ITC1.x, **not** ITP1.x, **not** ITR1.x, **not** P1.x, **not** P2.x, **not** C11, **not** H1.x, **not** I24, **not** ITA2, **not** LIC1, and **not** ITIL (framework prose elsewhere in the repository is not a capability ID). ITA1 remains **CLOSED** and is not reopened. I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **ITL1** |
| Name | IT License Register |
| Family | asset |
| Environment | Development/Test only |
| **STATUS** | **SELECTED; STAGE 1 APPROVED; STAGE 2 COMPLETE (DEV/TEST)** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **PREVIEW** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **EMPTY** |
| ITA1 IT Asset Register | CLOSED — not reopened (no `assetId`; not ITA1.x) |
| I11 ITSM / CMDB | CLOSED — not reopened (no `ciId`) |
| ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| P1 / P2 Privacy | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1–G5 / I15 ERM / I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| ITA1.x / I11.x / ITC1.x / ITP1.x / ITR1.x / P1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll / Consent register | **D** — deferred / untouched |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test selection; not resolved by this record |
| ADR-0017 | Not reopened |

## Product intent

A tenant-scoped, human-maintained **IT License Register**.

A license record is a human **label** that a software/IT license exists (or was cancelled). It is not license-compliance management, not entitlement reconciliation, and not a CMDB or asset register.

**ITA1 Asset** = a human asset-register row.  
**ITL1 License** = a human license-register row.  
**I11 CI** = a configuration object (class, lifecycle, relationships).

ITL1 is a **REGISTER ONLY**. Distinctness is product identity (codes, store, permissions, UI, copy), not extra fields. Do not introduce fields or workflow merely to enlarge the distinction.

Do **not** introduce: `assetId`, `ciId`, license key, seat count, vendor SKU, cost, expiry/renewal dates, compliance status, utilization, deployment state, discovery state, or procurement linkage.

## Stage 1 contract

**STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES.** Approved Stage 1 contract: [`docs/architecture/itl1-it-license-register-preview.md`](../architecture/itl1-it-license-register-preview.md). Dev/Test Stage 2 is complete.

## Explicitly not this capability

License-compliance engine; entitlement reconciliation; seat/utilization management; software discovery; software inventory scanning; UEM / MDM; endpoint management; procurement; PO management; billing; vendor integration; contract management; renewal/calendar management; expiry management; automated alerting; license-key management; AI mutation; CMDB functionality; Asset functionality; ITA1 reopen; ITA1.x; I11 reopen; UAT; Production; live PostgreSQL as SoR; ADR-0017 reopen.

## What this record does not do

- **Does** select **LICENSE_REGISTER** and assign **ITL1**.
- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES`).
- **Does** authorize Dev/Test implementation (`IMPLEMENTATION_AUTHORIZED=YES` / `ENVIRONMENT=DEVTEST`).
- Does **not** create a further execution-queue entry (Stage 2 complete; `EXECUTION_QUEUE=EMPTY`).
- Does **not** reopen ITA1, I11, ITC1, ITP1, ITR1, P1, or P2.
- Does **not** authorize UAT or Production.
- Does **not** close or resolve ADR-0006, ADR-0012, or ADR-0013.
- Does **not** reopen ADR-0017.
- Does **not** authorize push or commit.

## Contract

**STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test Stage 2 complete) — [`docs/architecture/itl1-it-license-register-preview.md`](../architecture/itl1-it-license-register-preview.md)
