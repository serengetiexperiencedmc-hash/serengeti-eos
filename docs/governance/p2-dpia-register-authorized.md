# P2 Selection — DPIA Register

> **CURRENT STATE (2026-08-25 documentation hygiene)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`** (this HEAD **is** the P2 implementation commit)  
> P2 Stage 2 is **COMPLETE / CLOSED** for Development/Test. The selection/Stage 1 fields below remain the **historical selection**. They must not be read as a pending execution queue.  
> This record **selects** P2 and records **Stage 1 approval** plus **Dev/Test implementation**. It is **not** UAT or Production authorization.  
> P1 remains **CLOSED**. No P1.x. ITR1 remains **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=DPIA_REGISTER** · **CAPABILITY_ID=P2** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

**Date:** 2026-08-24  
**Authority (selection):** Operator / product-owner decision **PATH_B_SELECTED=YES / CANDIDATE=DPIA_REGISTER / FAMILY=PRIVACY / DECISION=SELECT**.  
**Authority (Stage 1 authoring):** Operator **proceed** after that selection — documentation only.  
**Authority (Stage 1 approval):** Operator **proceed** (2026-08-25) **P2 STAGE_1_APPROVED=YES**.  
**Authority (Dev/Test execution):** Operator **P2 STAGE_1_APPROVED=YES / IMPLEMENTATION_AUTHORIZED=YES / ENVIRONMENT=DEVTEST**.  
**Capability ID assigned by this record:** **P2**

This record assigns **P2**. It is a **privacy-family** identifier after P1, following the same Operator-established sequential-family pattern as **G2** (after G1) and **K2** (after K1). Repository search found **no** existing use of `P2` as a capability ID. It is **not** P1.x, **not** I15.x, **not** D1 (decision-domain collision), **not** ITR1.x, **not** C11, **not** H1.x, and **not** a consent or DLP product. P1 remains **CLOSED** and is not reopened. I11, ITC1, ITP1, ITR1, I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **P2** |
| Name | DPIA Register |
| Family | privacy |
| Environment | Development/Test only |
| **STATUS** | **SELECTED; STAGE 1 APPROVED; STAGE 2 COMPLETE (DEV/TEST)** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **EXECUTION_QUEUE** | **EMPTY** |
| P1 Privacy RoPA + DSR | CLOSED — not reopened (no `activityId` / `dsrId`) |
| I15 ERM | CLOSED — not reopened |
| G1–G5 GRC | CLOSED — not reopened |
| ITR1 IT Release Register | CLOSED — not reopened |
| I11 / ITC1 / ITP1 | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| P1.x / I15.x / H1.x / H2 / O7 / K3 / G6 / ITR1.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll / Consent register | **D** — deferred / untouched |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test selection; not resolved by this record |
| ADR-0017 | Not reopened |

## Product intent

A tenant-scoped, human-maintained **DPIA Register**.

A DPIA record is a human **label** that a data-protection impact assessment case exists (or was cancelled). It is not a legal DPIA product, not an opinion, and not a determination of lawful basis or residual risk.

**P1 RoPA** = a processing-activity register row.  
**P1 DSR** = a data-subject-request case label.  
**P2 DPIA** = a DPIA case label.

P2 is a **REGISTER ONLY**. Distinctness is product identity (codes, store, permissions, UI, copy), not extra fields. Do not introduce fields or workflow merely to enlarge the distinction. Do not add `activityId` or `dsrId`.

## Stage 1 contract

Approved Stage 1 contract (implementation **not** authorized): [`docs/architecture/p2-dpia-register-preview.md`](../architecture/p2-dpia-register-preview.md).

## Explicitly not this capability

DPIA product; legal opinions; PDPA/GDPR interpretation engines; lawful-basis determination; residual-risk scoring as a legal conclusion; consent-management platform; DLP; live erasure / production deletion; RoPA/DSR redesign; P1 mutation; I15 reopen; UAT; Production; live PostgreSQL as SoR; AI mutation; external-provider / regulator integration.

## What this record does not do

- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES`).
- **Does** authorize Dev/Test implementation (`IMPLEMENTATION_AUTHORIZED=YES` / `ENVIRONMENT=DEVTEST`).
- Does **not** create a further execution-queue entry (Stage 2 complete).
- Does **not** reopen P1, I15, G1–G5, or ITR1.
- Does **not** authorize UAT or Production.
- Does **not** close or resolve ADR-0006, ADR-0012, or ADR-0013.
- Does **not** authorize push.

## Contract

**STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test Stage 2 complete) — [`docs/architecture/p2-dpia-register-preview.md`](../architecture/p2-dpia-register-preview.md)
