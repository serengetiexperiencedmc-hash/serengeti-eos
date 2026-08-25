# ITP1 IT Problem Register — Preview

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`** (current product HEAD is the P2 implementation; ITP1 remains closed at `4f2ffd3afbf28b547f8e6deadd1c4f5241562cfb`)  
> ITP1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `102_itp1_itsm_problems.sql`).  
> The lifecycle table and contract body below are the **historical Stage 1** record (`IMPLEMENTATION_AUTHORIZED=NO`, `STATUS=STAGE_1_AUTHORIZED` at authorization time). They answer “what was authorized at Stage 1?” They must not be read as a pending implementation queue.  
> RCA remains inventory / **NOT AUTHORIZED**. No ITP1.x. **ITR1** Stage 2 remains **IMPLEMENTED / CLOSED**. **P2** DPIA Register is **SELECTED**; Stage 1 is **approved**; Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not an ITP1 reopen). See [`../governance/p2-dpia-register-authorized.md`](../governance/p2-dpia-register-authorized.md) and [`p2-dpia-register-preview.md`](p2-dpia-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

## Lifecycle status (historical Stage 1)

| Field | Value |
| --- | --- |
| Increment ID | **ITP1** |
| Capability name | IT Problem Register |
| Family | itsm |
| Predecessor | I2 kernel (complete); I11 ITSM + CMDB complete and **not** reopened; ITC1 IT Change Register complete and **not** reopened |
| Architecture status | This document is the ITP1 contract |
| Implementation status | **NOT AUTHORIZED** — preview only |
| Environment | Development/Test only |
| Persistence | In-memory at implementation time. Additive SQL only if implementation is later authorized. ADR-0017 not reopened. No migration file in this increment |
| Runtime health increment | `ITP1` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **ITP1** |
| **STATUS** | **STAGE_1_AUTHORIZED** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |

Authority: 2026-08-24 Operator / product-owner decision **CANDIDATE=IT_PROBLEM_REGISTER / FAMILY=ITSM / CAPABILITY_ID=ITP1 / DECISION=APPROVE / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED** and [`itp1-it-problem-register-authorized.md`](../governance/itp1-it-problem-register-authorized.md). ID **ITP1** is assigned by that record. It is an ITSM-family identifier after I11 and ITC1. This is not I11.x, not ITC1.x, not H2, not O7, not K3, not G6, and not Release.

The sections after this heading are the architecture contract. Implementation must not begin until a separate explicit execution instruction. *(Historical Stage 1 sentence. Stage 2 later completed at this HEAD; see current-state banner. Not a new execution authorization.)*

---

## Objective

Deliver an **IT** workspace surface where an authorised human can record **IT problems**, optionally against an existing same-tenant I11 ticket and/or I11 Configuration Item — not Problem Management ITIL, not an RCA engine, not a known-error database, not major-incident command, not Release, not CAB, not Discovery, not UEM, not asset management, and not a redesign of I11 tickets, CMDB, or ITC1 Changes.

Domain map 2.2 names Problem under `itsm`. I11 shipped incident/request tickets and CIs only and excluded Change / Problem / Release as separate ITIL modules. ITC1 shipped the Change register only and left Problem as architecture inventory. **ITP1 is the smaller approved problem register only.**

This is a **register**, not an ITIL engine. Architecture bullets naming Release remain inventory. They are not authorized by this Stage 1 decision.

## Scope

| Deliverable | In scope |
| --- | --- |
| Problem create / list / get / patch (while `open`) | Yes |
| Problem codes `PRB-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `ticketId`; optional `ciId`; optional `notes` | Yes |
| Optional `ticketId` — existing same-tenant I11 ticket | Yes |
| Optional `ciId` — existing same-tenant I11 CI | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `itsm.problem` | Yes |
| Tenant-scoped `/v1/itsm/problems/health` increment `ITP1` | Yes |
| Visible IT UI for the problem register | Yes — I11 Service Desk, CMDB, and ITC1 Changes remain those capabilities |
| I11 ticket / CI redesign | No |
| ITC1 change redesign | No |
| RCA / known-error / major-incident / Problem Management ITIL | No |
| CAB / Release Management / Discovery / UEM / asset management | No |

Required field is **`title`**, matching I11 tickets, ITC1 changes, and K2/O6 registers (not a second `name` field).

No date fields. I11 tickets, ITC1 changes, and K2/O6 registers do not require date labels for this class of register. Dates must not be introduced as a scheduler, SLA timer, or automatic status driver.

## Domain model

**itsm_problems** (runtime store key `itsmProblems` — not I11 `itsmTickets` / `cmdbCis` keys, not ITC1 `itsmChanges`, not Release keys, not GRC keys, not SAMPLE keys)

- `problemCode` unique per tenant (`PRB-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- optional `ticketId` (I11 ticket id in the same tenant)
- optional `ciId` (I11 CI id in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include read-only `ticketCode` resolved from I11 when `ticketId` is present, and read-only `ciCode` resolved from I11 when `ciId` is present. Ticket fields, CI class, lifecycle, attributes, relationships, and ITC1 changes are not patched by ITP1.

No RCA, known-error, major-incident, CAB, release, freeze, window, risk-score, or scheduler fields.

## Problem-to-ticket and problem-to-CI relationships

`ticketId` and `ciId` are each **optional**. When both are omitted, the problem is a standalone register row. Both may be supplied together.

When supplied, `ticketId` must identify an existing ticket in the actor's tenant (any I11 ticket status, including closed or cancelled). Missing or other-tenant ids → `400` `ticket_not_found`.

When supplied, `ciId` must identify an existing CI in the actor's tenant (any I11 CI lifecycle, including retired). Missing or other-tenant ids → `400` `ci_not_found`.

Each reference is a scalar field only. Creating, patching, completing, or cancelling a problem does not change I11 ticket, CI, relationship, or ITC1 change behaviour.

`ticketId` and `ciId` are set at create (or omitted) and are not patched.

## Persistence / migration

No migration in this Stage 1 increment. If implementation is later authorized: additive SQL only; runtime in-memory; live PostgreSQL UNVERIFIED. ADR-0017 not reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional ticketId / ciId / notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule.

No dedicated root-cause, known-error, major-incident, approve, reject, execute, schedule, complete, or cancel endpoints. Lifecycle uses **PATCH status** only (same bounded surface as ITC1 / H1; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

If implementation encounters pressure to add RCA workflow, known-error records, major-incident process, Problem Management ITIL, CAB, Release, Discovery, UEM, asset management, ticket mutation, CI mutation, ITC1 mutation, SLA timers, scheduled jobs, or external integrations: **STOP** and report the scope conflict. Do not silently expand this contract.

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. No autonomous problem creation, RCA, scheduling, execution, or closure.

## API

Prefix `/v1/itsm/problems`, consistent with existing I11 `/v1/itsm/*` and ITC1 `/v1/itsm/changes` routes. I11 `/v1/itsm/health`, `/v1/itsm/tickets`, `/v1/cmdb/*`, and ITC1 `/v1/itsm/changes*` are not modified (I11 increment remains `I11`; ITC1 increment remains `ITC1`). JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/itsm/problems/health` | `itsm:read:problem` |
| GET | `/v1/itsm/problems?q=&status=&ticketId=&ciId=` | `itsm:read:problem` |
| POST | `/v1/itsm/problems` | `itsm:write:problem` |
| GET | `/v1/itsm/problems/:id` | `itsm:read:problem` |
| PATCH | `/v1/itsm/problems/:id` | `itsm:write:problem` |

Health increment is `ITP1` (distinct from I11 ITSM health and ITC1 change health).

Do not add root-cause, known-error, major, approve, reject, execute, schedule, freeze, CAB, release, change, bulk, or automation routes.

## RBAC

| Permission | Intent |
| --- | --- |
| `itsm:read:problem` | Health + list/get |
| `itsm:write:problem` | Create / patch (including human done / cancelled) |

`platform.admin` — both. Role `itsm.problem` — both. Alice and partner — 403. At implementation time, Bob seed includes `itsm.problem` so the architecture role is exercised.

Do not broaden:

- I11 permissions (`itsm:read:ticket`, `itsm:write:ticket`, `itsm:assign:ticket`, `itsm:resolve:ticket`, `itsm:close:ticket`, `cmdb:read:ci`, `cmdb:write:ci`)
- ITC1 permissions (`itsm:read:change`, `itsm:write:change`) or role `itsm.change`
- role `it.agent`
- H1, GRC, crisis, operations, or HR permissions

Existing I11 ticket/CI permissions and ITC1 change permissions are **not** reused for ITP1 write or ITP1-only read. Problem write is **not** granted automatically to every I11 or ITC1 role.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant problem id → 404. Cross-tenant or unknown `ticketId` must not disclose ticket existence (`400` `ticket_not_found`). Cross-tenant or unknown `ciId` must not disclose CI existence (`400` `ci_not_found`). I11 and ITC1 isolation unchanged.

## UI

- `/commercial/itsm/problems`
- Nav **IT → Problems** (existing **IT → Service Desk**, **IT → CMDB**, and **IT → Changes** surfaces unchanged)
- Register problem (title + optional ticket picker + optional CI picker + optional notes)
- Queue/list, optional filters consistent with O6/K2/H1/ITC1 registers, detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is a problem register, not Problem Management ITIL, not RCA, not a known-error database, not major-incident command, not Release, not CAB, and not an I11 Service Desk, CMDB, or ITC1 Changes replacement
- I11 Service Desk, CMDB, or ITC1 Changes page may add a link to Problems; none of those pages is redesigned

Do not create RCA consoles, known-error databases, major-incident boards, CAB dashboards, release calendars, discovery consoles, or ITIL management suites.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Supplied missing / unknown / other-tenant `ticketId` | 400 `ticket_not_found` |
| Supplied missing / unknown / other-tenant `ciId` | 400 `ci_not_found` |
| Illegal status change | 409 `invalid_transition` |
| Patch when done | 409 `done` |
| Patch when cancelled | 409 `cancelled` |

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM adapters. Human-only gates are server-enforced. `ticketId` is never treated as a second ticket object. `ciId` is never treated as a second CI object. Status is never treated as a scheduler, RCA engine, or executor.

## Testing (when implementation is authorized)

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation
- Same-tenant ticket accepted; missing/foreign ticket rejected without existence leakage; omitted `ticketId` allowed
- Same-tenant CI accepted; missing/foreign CI rejected without existence leakage; omitted `ciId` allowed
- Valid ticket/CI references do not mutate I11 ticket/CI behaviour or ITC1 changes; I11 and ITC1 permissions are not unintentionally broadened
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`)
- Web typecheck
- Regression: I11 health and behaviour unchanged (`increment=I11`); ITC1 health remains `ITC1`; I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 unchanged

## Acceptance criteria (when implementation is authorized)

1. Carol can register a problem (with or without a seed ticket and/or seed CI) and mark it done or cancelled from **IT → Problems**.
2. Alice and partner cannot read problem APIs.
3. Health increment is `ITP1`. I11 health remains `I11`. ITC1 health remains `ITC1`.
4. Referenced ticket attributes, CI attributes, relationships, I11 tickets, and ITC1 changes are unchanged.
5. Store key is `itsmProblems`. No I11 ticket/CI/ITC1 change/Release/GRC/SAMPLE keys.
6. I11 remains closed. ITC1 remains closed. Release remains unauthorized. SAMPLE remains deferred.

## Exclusions

- RCA workflow / engine; root-cause analysis automation; known-error database; major-incident management
- Problem Management ITIL workflow
- CAB / advisory-board workflow; change approval; change freeze
- Release Management; deployment; release windows
- SLA engine; scheduling engine; automated execution; autonomous problem creation or closure
- Discovery; UEM; asset management; CMDB redesign
- CI mutation; ticket mutation; ITC1 modification; I11 modification
- Procurement; payroll; HR; crisis command
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT
- Corporate IdP; vault; SIEM; live regulatory feeds; external providers
- I11 reopen or mutation of tickets / CIs / relationships
- ITC1 reopen or mutation of changes
- I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 mutation
- UAT, Production, live PostgreSQL, external vendor selection
- Numeric placeholder IDs I11.x / ITC1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an ITP1 defect. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an ITP1 product defect.

## Rollback

If implemented later: additive migration; disable by not registering routes.

## Dependencies

I0 kernel patterns (tenancy/RBAC). I11 ticket identifiers referenced read-only when `ticketId` is supplied. I11 CI identifiers referenced read-only when `ciId` is supplied. No ITC1 write dependency. No new vendors, external services, identity providers, discovery tools, infrastructure, or live database dependencies.
