# ITC1 Authorization — IT Change Register

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`4f2ffd3afbf28b547f8e6deadd1c4f5241562cfb`**  
> ITC1 Stage 2 is **COMPLETE / CLOSED** for Development/Test. The Stage 1 fields below (`IMPLEMENTATION_AUTHORIZED=NO`, `STATUS=STAGE_1_AUTHORIZED`) remain the **historical authorization**. They must not be read as a pending execution queue.  
> Release remains **NOT AUTHORIZED** (inventory). No ITC1.x. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Date:** 2026-08-24  
**Authority:** Operator / product-owner decision **CANDIDATE=IT_CHANGE_REGISTER / FAMILY=ITSM / CAPABILITY_ID=ITC1 / DECISION=APPROVE / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED**.  
**Capability ID assigned by this record:** **ITC1**

This record assigns **ITC1**. It is an **ITSM-family** identifier after I11. It is **not** I11.x (I11 is closed and must not be reopened). It is **not** H2, **not** O7, **not** K3, **not** G6, and **not** Problem or Release. I11, I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, P1, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **ITC1** |
| Name | IT Change Register |
| Family | itsm |
| Environment | Development/Test only |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
| **STATUS** | **STAGE_1_AUTHORIZED** |
| I11 ITSM / CMDB | CLOSED — not reopened (optional read-only parent CIs only) |
| I10 HR Core / H1 certifications | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| I15 ERM / I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I11.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| Problem / Release | **NOT AUTHORIZED** — architecture inventory only |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll | **D** — deferred / untouched |

## Authorized scope (preview/contract only)

Tenant-scoped, human-maintained **IT change register**. Required `title` (I11 ticket / K2 register convention; not a duplicate `name` field); optional `ciId` (scalar reference to an existing same-tenant I11 CI); optional `notes`; status. Lifecycle `open` → `done`, `open` → `cancelled` (`done` and `cancelled` terminal). `ciId` immutable after create. Human-only mutation. Dedicated change read/write permissions `itsm:read:change` / `itsm:write:change` and role `itsm.change` (do not broaden I11 `it.agent` / ticket / CI permissions; do not grant Change write to every I11 role). API `/v1/itsm/changes`. UI **IT → Changes** at `/commercial/itsm/changes` (I11 Service Desk and CMDB remain I11). Store key `itsmChanges`. Aggregate `itsm_changes`. Runtime in-memory. Additive SQL only if implementation is later authorized.

ITC1 is a **register**, not an ITIL engine. Optional I11 CI is a parent/reference only. No second CI model. No date/scheduler/SLA/window fields.

## Architectural boundary

I11 remains closed and operational. ITC1 must not create a second CI model, modify an I11 CI, modify I11 tickets, become Discovery, UEM, asset management, a CMDB redesign, Problem Management, or Release Management.

## RBAC boundary

Dedicated `itsm:read:change` and `itsm:write:change`. Dedicated role `itsm.change`. `platform.admin` receives both. Alice and partner remain denied (`403`). I11 ticket/CI permissions and `it.agent` are not reused for ITC1.

## Human / AI boundary

Create and patch are Human-only. Non-human mutation → `403` `ai_actor`. No autonomous change execution, AI approval, AI scheduling, or AI closure.

## Intended API / UI (implementation later)

- `/v1/itsm/changes/health`, `/v1/itsm/changes`, `/v1/itsm/changes/:id` — health, list, create, get, patch only
- Health increment **ITC1**; I11 `/v1/itsm/health` remains **I11**
- `/commercial/itsm/changes`; nav **IT → Changes**

## Acceptance criteria (when implementation is authorized)

Unauthenticated health `401`; Alice/partner `403`; same-tenant CI accepted; missing/foreign CI `400` `ci_not_found` without existence leak; omitted `ciId` allowed; create/list/get/patch; `open` → `done` / `cancelled`; terminal patch `409`; `403` `ai_actor`; I11 permissions not unintentionally broadened. Regression: I11, I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 unchanged.

## Explicitly excluded

CAB / advisory-board workflow; change approval workflow; change freeze management; change windows; SLA engine; scheduling engine; automated execution; emergency-change automation; Problem Management; Release Management; Discovery; UEM; asset-management replacement; CMDB redesign; CI mutation; ticket mutation; ticket/programme linkage; procurement; payroll; HR; crisis command; EMCOMMS; EXER; CAL; PO; SUCC; SAMPLE; I20X; I21; I22; I23; corporate IdP; vault; SIEM; live regulatory feeds; external providers; live PostgreSQL; UAT; Production; I11 reopen; I10/H1/I18/K1/K2/O6/G1–G5/P1/I15/I17/C9/C10 mutation; autonomous AI change creation, approval, scheduling, execution, or closure. I11 `/v1/itsm/health` increment remains **I11**.

## Implementation

**IMPLEMENTATION_AUTHORIZED=NO** *(historical Stage 1)*

This record plus the architecture preview authorize **preview/authorization artifacts only**. Implementation (kernel, API, RBAC, UI, tests, runtime store, migration) requires a **separate explicit execution instruction** after these records are committed. *(Historical Stage 1 sentence. That execution later completed; ITC1 is CLOSED. This paragraph is not a new authorization.)*

## Contract

[`docs/architecture/itc1-it-change-register-preview.md`](../architecture/itc1-it-change-register-preview.md)
