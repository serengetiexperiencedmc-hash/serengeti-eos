# ITC1 IT Change Register — Preview

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`c55b608001e6af764fc80bd41ce9844b24da60d8`**  
> ITC1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `101_itc1_itsm_changes.sql`).  
> The lifecycle table and contract body below are the **historical Stage 1** record (`IMPLEMENTATION_AUTHORIZED=NO`, `STATUS=STAGE_1_AUTHORIZED` at authorization time). They answer “what was authorized at Stage 1?” They must not be read as a pending implementation queue.  
> ITC1 remains **CLOSED**. No ITC1.x. **ITR1** Stage 2 remains **IMPLEMENTED / CLOSED**. **P2** DPIA Register is **SELECTED**; Stage 1 is **approved**; Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not an ITC1 reopen). See [`../governance/p2-dpia-register-authorized.md`](../governance/p2-dpia-register-authorized.md) and [`p2-dpia-register-preview.md`](p2-dpia-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

## Lifecycle status (historical Stage 1)

| Field | Value |
| --- | --- |
| Increment ID | **ITC1** |
| Capability name | IT Change Register |
| Family | itsm |
| Predecessor | I2 kernel (complete); I11 ITSM + CMDB complete and **not** reopened; H1 complete and **not** reopened |
| Architecture status | This document is the ITC1 contract |
| Implementation status | **NOT AUTHORIZED** — preview only |
| Environment | Development/Test only |
| Persistence | In-memory at implementation time. Additive SQL only if implementation is later authorized. ADR-0017 not reopened. No migration file in this increment |
| Runtime health increment | `ITC1` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **ITC1** |
| **STATUS** | **STAGE_1_AUTHORIZED** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |

Authority: 2026-08-24 Operator / product-owner decision **CANDIDATE=IT_CHANGE_REGISTER / FAMILY=ITSM / CAPABILITY_ID=ITC1 / DECISION=APPROVE / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED** and [`itc1-it-change-register-authorized.md`](../governance/itc1-it-change-register-authorized.md). ID **ITC1** is assigned by that record. It is an ITSM-family identifier after I11. This is not I11.x, not H2, not O7, not K3, not G6, and not Problem or Release.

The sections after this heading are the architecture contract. Implementation must not begin until a separate explicit execution instruction. *(Historical Stage 1 sentence. Stage 2 later completed; see current-state banner. Not a new execution authorization.)*

---

## Objective

Deliver an **IT** workspace surface where an authorised human can record **planned or completed IT changes**, optionally against an existing same-tenant I11 Configuration Item — not a CAB, not an ITIL change engine, not Discovery, not UEM, not asset management, not Problem, not Release, and not a redesign of I11 tickets or CMDB.

Domain map 2.2 names Change under `itsm`. I11 shipped incident/request tickets and CIs only and excluded Change / Problem / Release as separate ITIL modules. CMDB chapter 11.4 requires change processes relative to CIs; **ITC1 is the smaller approved register only.**

This is a **register**, not an ITIL engine. Architecture bullets naming Problem and Release remain inventory. They are not authorized by this Stage 1 decision.

## Scope

| Deliverable | In scope |
| --- | --- |
| Change create / list / get / patch (while `open`) | Yes |
| Change codes `CHG-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `ciId`; optional `notes` | Yes |
| Optional `ciId` — existing same-tenant I11 CI | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `itsm.change` | Yes |
| Tenant-scoped `/v1/itsm/changes/health` increment `ITC1` | Yes |
| Visible IT UI for the change register | Yes — I11 Service Desk and CMDB remain I11 |
| I11 ticket / CI redesign | No |
| CAB / approval / freeze / change-window engine | No |
| Problem Management / Release Management | No |
| Discovery / UEM / asset-management replacement | No |

Required field is **`title`**, matching I11 tickets and K2/O6 registers (not a second `name` field).

No date fields. I11 tickets and K2/O6 registers do not require date labels for this class of register. Dates must not be introduced as a scheduler, change window, SLA timer, or automatic status driver.

## Domain model

**itsm_changes** (runtime store key `itsmChanges` — not I11 `itsmTickets` / `cmdbCis` keys, not Problem/Release keys, not GRC keys, not SAMPLE keys)

- `changeCode` unique per tenant (`CHG-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- optional `ciId` (I11 CI id in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `ciCode` resolved from I11 at response time when `ciId` is present. CI class, lifecycle, attributes, relationships, and I11 tickets are not patched by ITC1.

No date, freeze, window, risk-score, CAB, problem, or release fields.

## Change-to-CI relationship

`ciId` is **optional**. When omitted, the change is a standalone register row.

When supplied, `ciId` must identify an existing CI in the actor's tenant (any I11 CI lifecycle, including retired). Missing or other-tenant ids → `400` `ci_not_found`. The reference is a scalar field only. Creating, patching, completing, or cancelling a change does not change I11 CI, relationship, or ticket behaviour.

`ciId` is set at create (or omitted) and is not patched.

## Persistence / migration

No migration in this Stage 1 increment. If implementation is later authorized: additive SQL only; runtime in-memory; live PostgreSQL UNVERIFIED. ADR-0017 not reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional ciId / notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule.

No dedicated approve, reject, execute, schedule, freeze, CAB, emergency, complete, or cancel endpoints. Lifecycle uses **PATCH status** only (same bounded surface as H1 revoke; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

If implementation encounters pressure to add CAB approval, change risk scoring, blackout periods, maintenance windows, automated execution, CI mutation, release linkage, problem linkage, discovery integration, SLA timers, scheduled jobs, or external integrations: **STOP** and report the scope conflict. Do not silently expand this contract.

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. No autonomous change creation, approval, scheduling, execution, or closure.

## API

Prefix `/v1/itsm/changes`, consistent with existing I11 `/v1/itsm/*` routes. I11 `/v1/itsm/health`, `/v1/itsm/tickets`, and `/v1/cmdb/*` are not modified (increment remains `I11`). JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/itsm/changes/health` | `itsm:read:change` |
| GET | `/v1/itsm/changes?q=&status=&ciId=` | `itsm:read:change` |
| POST | `/v1/itsm/changes` | `itsm:write:change` |
| GET | `/v1/itsm/changes/:id` | `itsm:read:change` |
| PATCH | `/v1/itsm/changes/:id` | `itsm:write:change` |

Health increment is `ITC1` (distinct from I11 ITSM health).

Do not add approve, reject, execute, schedule, freeze, CAB, emergency, release, problem, bulk, or automation routes.

## RBAC

| Permission | Intent |
| --- | --- |
| `itsm:read:change` | Health + list/get |
| `itsm:write:change` | Create / patch (including human done / cancelled) |

`platform.admin` — both. Role `itsm.change` — both. Alice and partner — 403. At implementation time, Bob seed includes `itsm.change` so the architecture role is exercised.

Do not broaden:

- I11 permissions (`itsm:read:ticket`, `itsm:write:ticket`, `itsm:assign:ticket`, `itsm:resolve:ticket`, `itsm:close:ticket`, `cmdb:read:ci`, `cmdb:write:ci`)
- role `it.agent`
- H1, GRC, crisis, operations, or HR permissions

Existing I11 ticket/CI permissions are **not** reused for ITC1 write or ITC1-only read. Change write is **not** granted automatically to every I11 role.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant change id → 404. Cross-tenant or unknown `ciId` must not disclose CI existence (`400` `ci_not_found`). I11 isolation unchanged.

## UI

- `/commercial/itsm/changes`
- Nav **IT → Changes** (existing **IT → Service Desk** and **IT → CMDB** I11 surfaces unchanged)
- Register change (title + optional CI picker + optional notes)
- Queue/list, optional filters consistent with O6/K2/H1 registers, detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is a change register, not an ITIL engine, not CAB, not Problem, not Release, and not an I11 Service Desk or CMDB replacement
- I11 Service Desk or CMDB page may add a link to Changes; it is not redesigned

Do not create CAB dashboards, release calendars, change boards, freeze calendars, risk scoring, discovery consoles, or ITIL management suites.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Supplied missing / unknown / other-tenant `ciId` | 400 `ci_not_found` |
| Illegal status change | 409 `invalid_transition` |
| Patch when done | 409 `done` |
| Patch when cancelled | 409 `cancelled` |

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM adapters. Human-only gates are server-enforced. `ciId` is never treated as a second CI object. Status is never treated as a scheduler or executor.

## Testing (when implementation is authorized)

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation
- Same-tenant CI accepted; missing/foreign CI rejected without existence leakage; omitted `ciId` allowed
- Valid CI reference does not mutate I11 CI/ticket behaviour; I11 permissions are not unintentionally broadened
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`)
- Web typecheck
- Regression: I11 health and behaviour unchanged (`increment=I11`); I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 unchanged

## Acceptance criteria (when implementation is authorized)

1. Carol can register a change (with or without a seed CI) and mark it done or cancelled from **IT → Changes**.
2. Alice and partner cannot read change APIs.
3. Health increment is `ITC1`. I11 health remains `I11`.
4. Referenced CI attributes, relationships, and I11 tickets are unchanged.
5. Store key is `itsmChanges`. No I11 ticket/CI/Problem/Release/GRC/SAMPLE keys.
6. I11 remains closed. Problem and Release remain unauthorized. SAMPLE remains deferred.

## Exclusions

- CAB / advisory-board workflow; change approval workflow; change freeze management; change windows
- SLA engine; scheduling engine; automated execution; emergency-change automation
- Problem Management; Release Management
- Discovery; UEM; asset-management replacement; CMDB redesign
- CI mutation; ticket mutation; ticket/programme linkage
- Procurement; payroll; HR; crisis command
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT
- Corporate IdP; vault; SIEM; live regulatory feeds; external providers
- I11 reopen or mutation of tickets / CIs / relationships
- I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 mutation
- UAT, Production, live PostgreSQL, external vendor selection
- Numeric placeholder IDs I11.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an ITC1 defect.

## Rollback

If implemented later: additive migration; disable by not registering routes.

## Dependencies

I0 kernel patterns (tenancy/RBAC). I11 CI identifiers referenced read-only when `ciId` is supplied. No new vendors, external services, identity providers, discovery tools, infrastructure, or live database dependencies.
