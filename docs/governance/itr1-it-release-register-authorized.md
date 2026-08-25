# ITR1 Selection — IT Release Register

> **CURRENT STATE (2026-08-24 Path B P2 selection + Stage 1 authoring — supersession banner, not a rewrite of ITR1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`** (current product HEAD is the P2 implementation; ITR1 remains closed at `c55b608001e6af764fc80bd41ce9844b24da60d8`)  
> ITR1 Stage 2 remains **COMPLETE / CLOSED** for Development/Test. The selection/Stage 1 fields below remain the **historical ITR1 selection**. They must not be read as a pending execution queue.  
> ITR1 remains **CLOSED** for further expansion. No ITR1.x. I11, ITC1, and ITP1 remain **CLOSED**. **P2** DPIA Register is **SELECTED**; Stage 1 is **approved**; Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not an ITR1 reopen). See [`p2-dpia-register-authorized.md`](p2-dpia-register-authorized.md) and [`../architecture/p2-dpia-register-preview.md`](../architecture/p2-dpia-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> ITR1 historical: **CAPABILITY_SELECTED=YES** · **CAPABILITY=IT_RELEASE_REGISTER** · **CAPABILITY_ID=ITR1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

**Date:** 2026-08-24  
**Authority (selection):** Operator / product-owner decision **PATH_B_SELECTED=YES / CANDIDATE=IT_RELEASE_REGISTER / FAMILY=ITSM / DECISION=SELECT / STAGE_1=AUTHORED_NOT_APPROVED / IMPLEMENTATION=NOT_AUTHORIZED**.  
**Authority (Stage 1 + Dev/Test execution):** Operator **ITR1 STAGE_1_APPROVED=YES / IMPLEMENTATION_AUTHORIZED=YES / ENVIRONMENT=DEVTEST**.  
**Capability ID assigned by this record:** **ITR1**

This record assigns **ITR1**. It is an **ITSM-family** identifier after I11, ITC1, and ITP1, following the same Operator-established pattern as **ITC1** (IT Change) and **ITP1** (IT Problem): `IT` + register initial + `1`. Repository search found **no** existing use of `ITR1`. It is **not** I11.x, **not** ITC1.x, **not** ITP1.x, **not** C11, **not** H1.x, **not** I24, **not** ITC2, and **not** ITP2. I11, ITC1, and ITP1 remain **CLOSED** and are not reopened. I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, P1, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **ITR1** |
| Name | IT Release Register |
| Family | itsm |
| Environment | Development/Test only |
| **STATUS** | **SELECTED; STAGE 1 PROPOSED / READY FOR REVIEW** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **NO** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
| **EXECUTION_QUEUE** | **EMPTY** |
| I11 ITSM / CMDB | CLOSED — not reopened (optional read-only parent CIs only, if later contracted) |
| ITC1 IT Change Register | CLOSED — not reopened |
| ITP1 IT Problem Register | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| I15 ERM / I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I11.x / ITC1.x / ITP1.x / H1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll | **D** — deferred / untouched |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test selection; not resolved by this record |
| ADR-0017 | Not reopened |

## Product intent

A tenant-scoped, human-maintained **IT Release Register**.

A release record is a human label that a planned or completed **package of IT work is being introduced**, or was cancelled.

**Change (ITC1)** = a configuration/service modification.  
**Release (ITR1)** = a package of IT work being introduced.

ITR1 is a **REGISTER ONLY**. Distinctness is product identity (codes, store, permissions, UI, copy), not extra fields. Do not introduce fields or workflow merely to enlarge the distinction.

## Stage 1 contract

Approved Stage 1 contract (Stage 2 later completed for Dev/Test): [`docs/architecture/itr1-it-release-register-preview.md`](../architecture/itr1-it-release-register-preview.md).

## Explicitly not this capability

Release Management; deployment orchestration; CI/CD; release scheduling; release windows; CAB; rollback management; environment promotion; version management; change-management workflow; problem-management workflow; UEM; discovery; asset management; CMDB redesign; production release control; AI mutation; external-provider integration; change-ticket linkage; problem linkage; date/scheduler/SLA fields; UAT; Production; live PostgreSQL as SoR; corporate IdP; vault; SIEM.

## What this record does not do

*(Historical at selection time. Stage 1 was later approved and Stage 2 completed for Dev/Test; see current-state banner.)*

- Did **not** approve Stage 1 at selection time (`STAGE_1_APPROVED=NO` then).
- Did **not** authorize implementation at selection time.
- Did **not** create an execution-queue entry at selection time.
- Does **not** reopen I11, ITC1, or ITP1.
- Does **not** authorize UAT or Production.
- Does **not** close or resolve ADR-0006, ADR-0012, or ADR-0013.
- Does **not** authorize push.

## Contract

**STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test Stage 2 complete) — [`docs/architecture/itr1-it-release-register-preview.md`](../architecture/itr1-it-release-register-preview.md)
