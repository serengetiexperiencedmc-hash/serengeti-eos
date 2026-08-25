# ITP1 Authorization — IT Problem Register

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`** (current product HEAD is the P2 implementation; ITP1 remains closed at `4f2ffd3afbf28b547f8e6deadd1c4f5241562cfb`)  
> ITP1 Stage 2 is **COMPLETE / CLOSED** for Development/Test. The Stage 1 fields below (`IMPLEMENTATION_AUTHORIZED=NO`, `STATUS=STAGE_1_AUTHORIZED`) remain the **historical authorization**. They must not be read as a pending execution queue.  
> ITP1 remains **CLOSED**. No ITP1.x. **ITR1** Stage 2 remains **IMPLEMENTED / CLOSED**. **P2** DPIA Register is **SELECTED**; Stage 1 is **approved**; Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not an ITP1 reopen). See [`p2-dpia-register-authorized.md`](p2-dpia-register-authorized.md) and [`../architecture/p2-dpia-register-preview.md`](../architecture/p2-dpia-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Date:** 2026-08-24  
**Authority:** Operator / product-owner decision **CANDIDATE=IT_PROBLEM_REGISTER / FAMILY=ITSM / CAPABILITY_ID=ITP1 / DECISION=APPROVE / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED**.  
**Capability ID assigned by this record:** **ITP1**

This record assigns **ITP1**. It is an **ITSM-family** identifier after I11 and ITC1. It is **not** I11.x (I11 is closed and must not be reopened). It is **not** ITC1.x (ITC1 is closed and must not be reopened). It is **not** H2, **not** O7, **not** K3, **not** G6, and **not** Release. I11, ITC1, I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, P1, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **ITP1** |
| Name | IT Problem Register |
| Family | itsm |
| Environment | Development/Test only |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
| **STATUS** | **STAGE_1_AUTHORIZED** |
| I11 ITSM / CMDB | CLOSED — not reopened (optional read-only parent tickets and CIs only) |
| ITC1 IT Change Register | CLOSED — not reopened |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| I15 ERM / I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I11.x / ITC1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| Release | **NOT AUTHORIZED** — architecture inventory only |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll | **D** — deferred / untouched |

## Authorized scope (preview/contract only)

Tenant-scoped, human-maintained **IT problem register**. Required `title` (I11 ticket / ITC1 / K2 register convention; not a duplicate `name` field); optional `ticketId` (scalar reference to an existing same-tenant I11 ticket); optional `ciId` (scalar reference to an existing same-tenant I11 CI); optional `notes`; status. Lifecycle `open` → `done`, `open` → `cancelled` (`done` and `cancelled` terminal). `ticketId` and `ciId` immutable after create. Human-only mutation. Dedicated problem read/write permissions `itsm:read:problem` / `itsm:write:problem` and role `itsm.problem` (do not broaden I11 `it.agent` / ticket / CI permissions or ITC1 `itsm.change` / change permissions; do not grant Problem write to every I11 or ITC1 role). API `/v1/itsm/problems`. UI **IT → Problems** at `/commercial/itsm/problems` (I11 Service Desk, CMDB, and ITC1 Changes remain those capabilities). Store key `itsmProblems`. Aggregate `itsm_problems`. Runtime in-memory. Additive SQL only if implementation is later authorized.

ITP1 is a **register**, not an ITIL Problem Management engine. Optional I11 tickets and CIs are parent/references only. No second ticket or CI model. No date/scheduler/SLA/RCA fields.

## Architectural boundary

I11 remains closed and operational. ITC1 remains closed and operational. ITP1 must not create a second ticket or CI model, modify an I11 ticket, modify an I11 CI, modify ITC1 changes, become RCA, a known-error database, major-incident management, Problem Management ITIL, CAB, Release Management, Discovery, UEM, asset management, or a CMDB redesign.

## RBAC boundary

Dedicated `itsm:read:problem` and `itsm:write:problem`. Dedicated role `itsm.problem`. `platform.admin` receives both. Alice and partner remain denied (`403`). I11 ticket/CI permissions, `it.agent`, and ITC1 change permissions / `itsm.change` are not reused for ITP1.

## Human / AI boundary

Create and patch are Human-only. Non-human mutation → `403` `ai_actor`. No autonomous problem creation, RCA, scheduling, execution, or closure.

## Intended API / UI (implementation later)

- `/v1/itsm/problems/health`, `/v1/itsm/problems`, `/v1/itsm/problems/:id` — health, list, create, get, patch only
- Health increment **ITP1**; I11 `/v1/itsm/health` remains **I11**; ITC1 `/v1/itsm/changes/health` remains **ITC1**
- `/commercial/itsm/problems`; nav **IT → Problems**

## Acceptance criteria (when implementation is authorized)

Unauthenticated health `401`; Alice/partner `403`; same-tenant ticket accepted; missing/foreign ticket `400` `ticket_not_found` without existence leak; omitted `ticketId` allowed; same-tenant CI accepted; missing/foreign CI `400` `ci_not_found` without existence leak; omitted `ciId` allowed; create/list/get/patch; `open` → `done` / `cancelled`; terminal patch `409`; `403` `ai_actor`; I11 and ITC1 permissions not unintentionally broadened. Regression: I11, ITC1, I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 unchanged.

## Explicitly excluded

RCA workflow/engine; root-cause analysis automation; known-error database; major-incident management; Problem Management ITIL workflow; CAB; change approval; change freeze; Release Management; deployment; release windows; scheduler; SLA engine; autonomous problem creation; autonomous closure; mutation of I11 tickets; mutation of I11 CIs; CMDB redesign; Discovery; UEM; asset management; ITC1 modification; I11 modification; I10/H1 modification; K1/K2 modification; GRC/Privacy/BCM modification; SAMPLE; EMCOMMS; EXER; CAL; PO; SUCC; I20X; I21; I22; I23; EXT; live PostgreSQL; UAT; Production; corporate IdP; vault; SIEM; live regulatory feeds; external providers; I11 reopen; ITC1 reopen; I10/H1/I18/K1/K2/O6/G1–G5/P1/I15/I17/C9/C10 mutation. I11 `/v1/itsm/health` increment remains **I11**. ITC1 `/v1/itsm/changes/health` increment remains **ITC1**.

## Implementation

**IMPLEMENTATION_AUTHORIZED=NO** *(historical Stage 1)*

This record plus the architecture preview authorize **preview/authorization artifacts only**. Implementation (kernel, API, RBAC, UI, tests, runtime store, migration) requires a **separate explicit execution instruction** after these records are committed. *(Historical Stage 1 sentence. That execution later completed at this HEAD; ITP1 is CLOSED. This paragraph is not a new authorization.)*

## Contract

[`docs/architecture/itp1-it-problem-register-preview.md`](../architecture/itp1-it-problem-register-preview.md)
