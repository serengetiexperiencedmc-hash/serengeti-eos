# ITA1 Selection — IT Asset Register

> **CURRENT STATE (2026-08-25 Stage 1 approved + Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 is **in the working tree**; commit is **not** authorized by this document.  
> ITA1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `105_ita1_it_assets.sql`).  
> P2 remains **CLOSED**. No P2.x. I11, ITC1, ITP1, and ITR1 remain **CLOSED**. **ITL1** License Register Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not an ITA1 reopen). See [`itl1-it-license-register-authorized.md`](itl1-it-license-register-authorized.md) and [`../architecture/itl1-it-license-register-preview.md`](../architecture/itl1-it-license-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**
> ITA1 historical selection fields below remain **ASSET_REGISTER / ITA1**. They must not be read as a pending ITA1 execution queue. Live Path B selection is **LICENSE_REGISTER / ITL1** with **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete).

**Date:** 2026-08-25  
**Authority (selection + Stage 1 authoring):** Operator **proceed** after the post-P2 read-only recommendation **RECOMMENDED_CANDIDATE=ASSET_REGISTER**.  
**Authority (Stage 1 approval):** Operator **accept** (2026-08-25) **ITA1 STAGE_1_APPROVED=YES**.  
**Authority (Dev/Test execution):** Operator **ITA1 STAGE_1_APPROVED=YES / IMPLEMENTATION_AUTHORIZED=YES / ENVIRONMENT=DEVTEST**.  
**Capability ID assigned by this record:** **ITA1**

This record assigns **ITA1**. It is an **asset-family** identifier using the same Operator-established `IT` + register initial + `1` pattern as **ITC1**, **ITP1**, and **ITR1**, applied to domain-map context `asset` (not to `itsm`). Repository search found **no** existing use of `ITA1`. It is **not** I11.x, **not** ITC1.x, **not** ITP1.x, **not** ITR1.x, **not** P2.x, **not** C11, **not** H1.x, **not** A1 (ambiguous), and **not** an asset-management, discovery, or UEM product. I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED** and are not reopened. I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **ITA1** |
| Name | IT Asset Register |
| Family | asset |
| Environment | Development/Test only |
| **STATUS** | **SELECTED; STAGE 1 APPROVED; STAGE 2 COMPLETE (DEV/TEST)** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **EXECUTION_QUEUE** | **EMPTY** |
| I11 ITSM / CMDB | CLOSED — not reopened (no `ciId`) |
| ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| P1 / P2 Privacy | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1–G5 / I15 ERM / I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I11.x / ITC1.x / ITP1.x / ITR1.x / P1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll / Consent register | **D** — deferred / untouched |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test selection; not resolved by this record |
| ADR-0017 | Not reopened |

## Product intent

A tenant-scoped, human-maintained **IT Asset Register**.

An asset record is a human **label** that an IT asset exists (or was cancelled). It is not discovery, not UEM, not license compliance, not endpoint management, and not a CMDB.

**I11 CI** = a configuration object (class, lifecycle, relationships).  
**ITA1 Asset** = a human asset-register row.

ITA1 is a **REGISTER ONLY**. Distinctness is product identity (codes, store, permissions, UI, copy), not extra fields. Do not introduce fields or workflow merely to enlarge the distinction. Do not add `ciId`, serial uniqueness, license keys, or endpoint inventory.

## Stage 1 contract

Approved Stage 1 contract (Dev/Test Stage 2 complete): [`docs/architecture/ita1-it-asset-register-preview.md`](../architecture/ita1-it-asset-register-preview.md).

## Explicitly not this capability

Asset management product; discovery / auto-reconcile; UEM / MDM; license-compliance engine; endpoint agent inventory; CMDB redesign; CI mutation; serial-number uniqueness as a second identity; I11 reopen; ITC1 / ITP1 / ITR1 reopen; UAT; Production; live PostgreSQL as SoR; AI mutation; external-provider / scanner integration.

## What this record does not do

- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES`).
- **Does** authorize Dev/Test implementation (`IMPLEMENTATION_AUTHORIZED=YES` / `ENVIRONMENT=DEVTEST`).
- Does **not** create a further execution-queue entry (Stage 2 complete).
- Does **not** reopen I11, ITC1, ITP1, ITR1, P1, or P2.
- Does **not** authorize UAT or Production.
- Does **not** close or resolve ADR-0006, ADR-0012, or ADR-0013.
- Does **not** authorize push or commit.

## Contract

**STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test Stage 2 complete) — [`docs/architecture/ita1-it-asset-register-preview.md`](../architecture/ita1-it-asset-register-preview.md)
