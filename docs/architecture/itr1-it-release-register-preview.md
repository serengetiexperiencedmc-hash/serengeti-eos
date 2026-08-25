# ITR1 IT Release Register — Stage 1 Preview

> **CURRENT STATE (2026-08-24 Path B P2 selection + Stage 1 authoring — supersession banner, not a rewrite of ITR1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`** (current product HEAD is the P2 implementation; ITR1 remains closed at `c55b608001e6af764fc80bd41ce9844b24da60d8`)  
> ITR1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `103_itr1_itsm_releases.sql`).  
> The lifecycle table and contract body below are the **historical Stage 1** record (authored before Operator approval). They answer “what was contracted at Stage 1?” They must not be read as a pending implementation queue.  
> ITR1 remains **CLOSED** for further expansion. No ITR1.x. No Release Management, deployment, CAB, or CI/CD. I11, ITC1, and ITP1 remain **CLOSED**. **P2** DPIA Register is **SELECTED**; Stage 1 is **approved**; Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not an ITR1 reopen). See [`../governance/p2-dpia-register-authorized.md`](../governance/p2-dpia-register-authorized.md) and [`p2-dpia-register-preview.md`](p2-dpia-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> ITR1 historical: **CAPABILITY_SELECTED=YES** · **CAPABILITY=IT_RELEASE_REGISTER** · **CAPABILITY_ID=ITR1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

## Lifecycle status (historical Stage 1)

| Field | Value |
| --- | --- |
| Increment ID | **ITR1** |
| Capability name | IT Release Register |
| Family | itsm |
| Predecessor | I2 kernel (complete); I11 ITSM + CMDB complete and **not** reopened; ITC1 IT Change Register complete and **not** reopened; ITP1 IT Problem Register complete and **not** reopened |
| Architecture status | This document is the ITR1 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **PROPOSED / READY FOR REVIEW** |
| Implementation status | **NOT AUTHORIZED** — authoring is not execution |
| Environment | Development/Test only |
| Persistence | In-memory at implementation time. Additive SQL only if implementation is later authorized. ADR-0017 not reopened. No migration file in this Stage 1 increment |
| Runtime health increment | `ITR1` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **ITR1** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **NO** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
| **EXECUTION_QUEUE** | **EMPTY** |

Authority: 2026-08-24 Operator / product-owner decision **PATH_B_SELECTED=YES / CANDIDATE=IT_RELEASE_REGISTER / FAMILY=ITSM / CAPABILITY_ID=ITR1 / DECISION=SELECT** and [`itr1-it-release-register-authorized.md`](../governance/itr1-it-release-register-authorized.md). ID **ITR1** is assigned by that record. This Stage 1 document does **not** approve the contract, authorize implementation, or reopen I11 / ITC1 / ITP1. This is not I11.x, not ITC1.x, not ITP1.x, not C11, not H1.x, not I24, not ITC2, and not ITP2.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

The sections after this heading are the proposed architecture contract. Implementation must not begin until (1) Operator Stage 1 approval and (2) a separate explicit execution instruction. *(Historical Stage 1 sentence. Stage 1 was later approved and Stage 2 completed for Dev/Test; see current-state banner. Not a new UAT or Production authorization.)*

---

## Objective

Deliver an **IT** workspace surface where an authorised human can record **IT release register rows**: a human label that a planned or completed **package of IT work is being introduced**, or was cancelled — optionally against an existing same-tenant I11 Configuration Item.

ITR1 is **not** Release Management, not deployment orchestration, not CI/CD, not environment promotion, not release scheduling, not release windows, not CAB, not rollback management, not version management, not a change-management workflow, not a problem-management workflow, not asset management, not UEM, not discovery, not automation, and not AI mutation. It is not a redesign of I11 tickets/CMDB, ITC1 Changes, or ITP1 Problems.

Domain map 2.2 names Release under `itsm` after Ticket, Change, and Problem. I11 shipped tickets and CIs only. ITC1 shipped the Change register. ITP1 shipped the Problem register. **ITR1 is the smaller approved-shape release register only**, pending Stage 1 approval and later implementation authorization.

This is a **register**, not an ITIL engine.

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **ITR1 Release** | A human record that a **package of IT work is being introduced** (or was cancelled) | New store `itsmReleases` |
| **ITC1 Change** | A human record of a **configuration/service modification** | Closed — not reopened; no `changeId` on ITR1 |
| **ITP1 Problem** | A human record of an **IT problem** | Closed — not reopened; no `problemId` on ITR1 |
| **I11 CI** | The **configuration object** itself (class, lifecycle, relationships) | Closed — optional scalar `ciId` read-only adjacency only |
| **I11 Ticket** | Incident/request work item | Closed — ITR1 does **not** take `ticketId` |
| Asset / Endpoint / License | Separate `asset` context (unimplemented product) | Out of scope |
| Deployment | Execution / promotion / rollback | Does not exist; must not be invented here |

Distinctness from ITC1 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra fields. Do **not** add `changeId`, `problemId`, dates, versions, windows, or environments merely to enlarge the distinction. Linkage would turn ITR1 into a process engine.

## Scope

| Deliverable | In scope |
| --- | --- |
| Release create / list / get / patch (while `open`) | Yes |
| Release codes `REL-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `ciId`; optional `notes` | Yes |
| Optional `ciId` — existing same-tenant I11 CI | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `itsm.release` | Yes |
| Tenant-scoped `/v1/itsm/releases/health` increment `ITR1` | Yes |
| Visible IT UI for the release register | Yes — I11 Service Desk, CMDB, ITC1 Changes, and ITP1 Problems remain those capabilities |
| I11 ticket / CI redesign | No |
| ITC1 change redesign | No |
| ITP1 problem redesign | No |
| Release Management / deploy / CAB / windows / CI/CD | No |
| Discovery / UEM / asset-management replacement | No |

Required field is **`title`**, matching I11 tickets, ITC1 changes, ITP1 problems, and K2/O6 registers (not a second `name` field).

Code prefix is **`REL-`**, matching sibling noun prefixes (`CHG-`, `PRB-`), not the capability id `ITR1`. Repository search found no existing `REL-` allocator.

No date fields. ITC1/ITP1/I11 tickets and K2/O6 registers in this class do not require date labels. Dates must not be introduced as a scheduler, release window, SLA timer, or automatic status driver.

## Domain model

**itsm_releases** (runtime store key `itsmReleases` — not I11 `itsmTickets` / `cmdbCis` keys, not ITC1 `itsmChanges`, not ITP1 `itsmProblems`, not GRC keys, not SAMPLE keys)

- `releaseCode` unique per tenant (`REL-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- optional `ciId` (I11 CI id in the same tenant)
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON may include a read-only `ciCode` resolved from I11 at response time when `ciId` is present. CI class, lifecycle, attributes, relationships, I11 tickets, ITC1 changes, and ITP1 problems are not patched by ITR1.

No date, freeze, window, version, environment, CAB, deployment, rollback, change-linkage, problem-linkage, risk-score, or scheduler fields.

## Release-to-CI relationship

`ciId` is **optional**. When omitted, the release is a standalone register row.

When supplied, `ciId` must identify an existing CI in the actor's tenant (any I11 CI lifecycle, including retired). Missing or other-tenant ids → `400` `ci_not_found` (must not disclose whether a CI exists in another tenant). The reference is a scalar field only. Creating, patching, completing, or cancelling a release does not change I11 CI, relationship, ticket, ITC1 change, or ITP1 problem behaviour.

`ciId` is set at create (or omitted) and is not patched. A PATCH body that includes `ciId` is ignored for that field (ITC1/ITP1 convention). `ciId` is never treated as a second CI object and is not CMDB ownership.

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `itsm_releases` table; do not `ALTER` `itsm_tickets`, `itsm_ticket_cis`, `cmdb_cis`, `cmdb_relationships`, `itsm_changes`, or `itsm_problems`);
- `UNIQUE (tenant_id, release_code)`;
- `ci_id UUID` **without** a foreign key to `cmdb_cis` (matches ITC1 `101_itc1_itsm_changes.sql` / ITP1 `102_itp1_itsm_problems.sql`);
- live PostgreSQL UNVERIFIED;
- ADR-0017 **not** reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional ciId / notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule (ITC1/ITP1: create ignores client status and writes `open`).

No dedicated approve, reject, execute, deploy, schedule, rollback, promote, freeze, CAB, complete, or cancel endpoints. Lifecycle uses **PATCH status** only (same bounded surface as ITC1/ITP1/H1; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- deployment / rollback / CI/CD / environment promotion
- CAB / release windows / version management
- change linkage (`changeId`) or problem linkage (`problemId`)
- scheduler / SLA / automation
- AI mutation
- CMDB / I11 / ITC1 / ITP1 mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous release creation, approval, scheduling, deployment, or closure.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency.

## API

Prefix `/v1/itsm/releases`, consistent with I11 `/v1/itsm/*`, ITC1 `/v1/itsm/changes`, and ITP1 `/v1/itsm/problems`. Do **not** attach ITR1 to `/v1/itsm/health` or `/v1/itsm/tickets`. I11 `/v1/itsm/health`, `/v1/itsm/tickets`, `/v1/cmdb/*`, ITC1 `/v1/itsm/changes*`, and ITP1 `/v1/itsm/problems*` are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/itsm/releases/health` | `itsm:read:release` |
| GET | `/v1/itsm/releases?q=&status=&ciId=` | `itsm:read:release` |
| POST | `/v1/itsm/releases` | `itsm:write:release` |
| GET | `/v1/itsm/releases/:id` | `itsm:read:release` |
| PATCH | `/v1/itsm/releases/:id` | `itsm:write:release` |

Health increment is `ITR1` (distinct from I11, ITC1, and ITP1). Intended health shape follows ITC1: `module` `itsm-releases`, `increment` `ITR1`, `status` `ok`, `releases` count, `openReleases` count.

Do not add approve, reject, execute, deploy, schedule, rollback, promote, freeze, CAB, emergency, change, problem, bulk, environment, or automation routes.

## RBAC

| Permission | Intent |
| --- | --- |
| `itsm:read:release` | Health + list/get |
| `itsm:write:release` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only). Role `itsm.release` — both. Alice and partner — 403. At implementation time, Bob seed includes `itsm.release` so the architecture role is exercised.

Do not broaden:

- I11 permissions (`itsm:read:ticket`, `itsm:write:ticket`, `itsm:assign:ticket`, `itsm:resolve:ticket`, `itsm:close:ticket`, `cmdb:read:ci`, `cmdb:write:ci`)
- ITC1 permissions (`itsm:read:change`, `itsm:write:change`) or role `itsm.change`
- ITP1 permissions (`itsm:read:problem`, `itsm:write:problem`) or role `itsm.problem`
- role `it.agent`
- H1, GRC, crisis, operations, or HR permissions

Existing I11 ticket/CI permissions, ITC1 change permissions, and ITP1 problem permissions are **not** reused for ITR1 write or ITR1-only read. Release write is **not** granted automatically to every I11, ITC1, or ITP1 role.

The UI CI picker may call existing CMDB **read** (`listCis` / `cmdb:read:ci`) as a best-effort overlay. Missing CMDB read yields an empty picker (ITC1 page convention). That overlay does not grant `cmdb:write:ci` and is not an I11 reopen.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant release id → 404. Cross-tenant or unknown `ciId` must not disclose CI existence (`400` `ci_not_found`). I11, ITC1, and ITP1 isolation unchanged.

## Audit

ITC1 and ITP1 register services do **not** call `recordAudit`. ITR1 must match that sibling class. Do not introduce a new audit subsystem or a new hash-chain writer solely for ITR1. I0 audit/hash-chain remains available to other modules and is not redesigned here.

## UI

- `/commercial/itsm/releases`
- Nav **IT → Releases** (existing **IT → Service Desk**, **IT → CMDB**, **IT → Changes**, and **IT → Problems** surfaces unchanged except optional additive links)
- Register release (title + optional CI picker + optional notes)
- Queue/list, optional filters consistent with O6/K2/H1/ITC1/ITP1 registers (`q` / status), detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is a **release register**, not Release Management, not deployment, not CAB, not Change, not Problem, and not an I11 Service Desk or CMDB replacement
- I11 Service Desk, CMDB, ITC1 Changes, or ITP1 Problems pages may add a link to Releases; none of those pages is redesigned

Do not create release calendars, deployment consoles, CAB dashboards, promotion boards, version managers, or ITIL management suites.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Title longer than 200 | 400 `title_too_long` |
| Notes longer than 2000 | 400 `notes_too_long` |
| Supplied missing / unknown / other-tenant `ciId` | 400 `ci_not_found` |
| Illegal status change | 409 `invalid_transition` |
| Patch when done | 409 `done` |
| Patch when cancelled | 409 `cancelled` |

Allocated `REL-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, release_code)` if SQL is later added).

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM adapters. Human-only gates are server-enforced. `ciId` is never treated as a second CI object. Status is never treated as a scheduler, deployer, or executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Same-tenant CI accepted; missing/foreign CI rejected without existence leakage; omitted `ciId` allowed
- PATCH does not change `ciId` (immutability)
- Valid CI reference does not mutate I11 CI/ticket behaviour or ITC1/ITP1 rows; I11/ITC1/ITP1 permissions are not unintentionally broadened
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`REL-0001`, then `REL-0002`)
- Forbidden engine subroutes (`approve`, `execute`, `deploy`, `schedule`, `rollback`, `cab`, `promote`, …) return 404
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `itsm.release` has only the ITR1 permission pair; `it.agent` / `itsm.change` / `itsm.problem` do not gain ITR1 perms
- Kernel allocator/status helpers analogous to `packages/kernel/src/itsm-changes.test.ts`
- Web typecheck
- Regression: I11 health `increment=I11` and ticket/CI counts unchanged; ITC1 health remains `ITC1`; ITP1 health remains `ITP1`; I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 unchanged
- At implementation time, update ITC1/ITP1 freeze assertions that currently require `"itsmReleases" in store` to be `false` — that is fixture hygiene, not an ITC1/ITP1 product reopen

## Acceptance criteria (when implementation is authorized)

1. Carol can register a release (with or without a seed CI) and mark it done or cancelled from **IT → Releases**.
2. Alice and partner cannot read release APIs.
3. Health increment is `ITR1`. I11 health remains `I11`. ITC1 health remains `ITC1`. ITP1 health remains `ITP1`.
4. Referenced CI attributes, relationships, I11 tickets, ITC1 changes, and ITP1 problems are unchanged.
5. Store key is `itsmReleases`. No I11 ticket/CI/ITC1 change/ITP1 problem/GRC/SAMPLE keys reused.
6. I11 remains closed. ITC1 remains closed. ITP1 remains closed. SAMPLE remains deferred.

## Exclusions

- Release Management; deployment orchestration; CI/CD; environment promotion; rollback management; version management
- Release scheduling; release windows; CAB / advisory-board workflow
- Change-management workflow; problem-management workflow; `changeId` / `problemId` linkage
- SLA engine; scheduling engine; automated execution
- Discovery; UEM; asset management; CMDB redesign
- CI mutation; ticket mutation; ITC1 mutation; ITP1 mutation
- Procurement; payroll; HR; crisis command
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT
- Corporate IdP; vault; SIEM; live regulatory feeds; external providers
- I11 reopen; ITC1 reopen; ITP1 reopen
- I10, H1, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 mutation
- UAT, Production, live PostgreSQL as SoR, external vendor selection
- Numeric placeholder IDs I11.x / ITC1.x / ITP1.x / H1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an ITR1 defect. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an ITR1 product defect.

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter I11/ITC1/ITP1 schema or behaviour to “make room” for ITR1.

## Dependencies

I0 kernel patterns (tenancy/RBAC). I11 CI identifiers referenced read-only when `ciId` is supplied. No ITC1 or ITP1 write dependency. No new vendors, external services, identity providers, discovery tools, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test contract. ADR-0017 not reopened.

## Governance / authority matrix

```text
CAPABILITY_SELECTED=YES
CAPABILITY_ID=ITR1
STAGE_1_CREATED=YES
STAGE_1_APPROVED=YES
IMPLEMENTATION_AUTHORIZED=YES
ENVIRONMENT=DEVTEST
STAGE_2=COMPLETE_CLOSED_DEVTEST
EXECUTION_QUEUE=EMPTY
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
PUSH=NOT_AUTHORIZED
```

Operator next steps (separate instructions): (1) review/accept or reject this Stage 1 contract; (2) only after acceptance, a separate implementation authorization may be issued. Neither this file nor Stage 1 approval, by itself, is an execution queue.
