# ITA1 IT Asset Register — Stage 1 Preview

> **CURRENT STATE (2026-08-25 Stage 1 approved + Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 is **in the working tree**; commit is **not** authorized by this document.  
> ITA1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `105_ita1_it_assets.sql`).  
> P2 remains **CLOSED**. No P2.x. I11, ITC1, ITP1, and ITR1 remain **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=ASSET_REGISTER** · **CAPABILITY_ID=ITA1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **ITA1** |
| Capability name | IT Asset Register |
| Family | asset |
| Predecessor | I2 kernel (complete); I11 ITSM + CMDB complete and **not** reopened; ITC1 / ITP1 / ITR1 complete and **not** reopened; P2 complete and **not** reopened |
| Architecture status | This document is the ITA1 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED** |
| Implementation status | **IMPLEMENTED / COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` + additive SQL `105_ita1_it_assets.sql`. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED |
| Runtime health increment | `ITA1` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **ITA1** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **EXECUTION_QUEUE** | **EMPTY** |

Authority: 2026-08-25 Operator **proceed** after post-P2 recommendation **RECOMMENDED_CANDIDATE=ASSET_REGISTER**, 2026-08-25 Operator **accept** (**ITA1 STAGE_1_APPROVED=YES**), 2026-08-25 Operator **ITA1 STAGE_1_APPROVED=YES / IMPLEMENTATION_AUTHORIZED=YES / ENVIRONMENT=DEVTEST**, and [`ita1-it-asset-register-authorized.md`](../governance/ita1-it-asset-register-authorized.md). ID **ITA1** is assigned by the selection record. This Stage 1 document does **not** reopen I11 / ITC1 / ITP1 / ITR1 / P2. This is not I11.x, not ITC1.x, not ITP1.x, not ITR1.x, not P2.x, not C11, not H1.x, and not an asset-management or UEM product.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

The sections after this heading are the **approved** architecture contract. Stage 2 is complete for Development/Test. This is not UAT or Production authorization.

---

## Objective

Deliver an **IT** workspace surface where an authorised human can record **IT asset register rows**: a human label that an IT **asset exists**, or was cancelled.

ITA1 is **not** an asset-management product, not discovery, not auto-reconcile, not UEM, not MDM, not a license-compliance engine, not endpoint-agent inventory, not a CMDB, not a change/problem/release workflow, and not AI mutation. It is not a redesign of I11 tickets/CMDB, ITC1 Changes, ITP1 Problems, or ITR1 Releases.

Domain map 2.2 names Asset, License, and Endpoint under `asset`, owned by IT Manager, separate from `itsm` and `cmdb`. I11 shipped tickets and CIs only. **ITA1 is the smaller approved-shape asset register only** — not License, not Endpoint. Stage 2 is complete for Development/Test.

This is a **register**, not an inventory engine.

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **ITA1 Asset** | A human record that an **IT asset exists** (or was cancelled) | New store `itAssets` |
| **I11 CI** | A **configuration object** (class, lifecycle, relationships) | Closed — not reopened; no `ciId` on ITA1 |
| **I11 Ticket** | Incident/request work item | Closed — no `ticketId` |
| **ITC1 / ITP1 / ITR1** | Change / problem / release register rows | Closed — no `changeId` / `problemId` / `releaseId` |
| License / Endpoint | Other `asset` context nouns | Out of scope |
| Discovery / UEM | Population / device control | Does not exist; must not be invented here |

Distinctness from I11 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra fields. Do **not** add `ciId`, serial uniqueness, license keys, endpoint IDs, or owner-principal fields merely to enlarge the distinction. Linkage would turn ITA1 into a CMDB or inventory engine.

Do **not** use store key `itAsset` (singular) or reuse `cmdbCis` / `itsmTickets`. The ITA1 key is **`itAssets`** (plural).

## Scope

| Deliverable | In scope |
| --- | --- |
| Asset create / list / get / patch (while `open`) | Yes |
| Asset codes `AST-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `notes` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `it.asset` | Yes |
| Tenant-scoped `/v1/assets/health` increment `ITA1` | Yes |
| Visible IT UI for the asset register | Yes — I11 Service Desk and CMDB, ITC1/ITP1/ITR1 remain those capabilities |
| I11 ticket / CI redesign | No |
| Discovery / UEM / license engine / endpoint inventory | No |
| CMDB relationship or Service table | No |

Required field is **`title`**, matching ITR1/ITC1/ITP1/P2 registers (not a second `name` field).

Code prefix is **`AST-`**, matching sibling noun prefixes (`CI-`, `TKT-`, `REL-`), not the capability id `ITA1`. Repository search found no existing `AST-` allocator.

No date fields. Sibling registers in this class do not require date labels. Dates must not be introduced as a warranty SLA, refresh cycle, or automatic status driver.

## Domain model

**it_assets** (runtime store key `itAssets` — not I11 `itsmTickets` / `cmdbCis`, not ITC1 `itsmChanges`, not ITP1 `itsmProblems`, not ITR1 `itsmReleases`, not GRC keys, not SAMPLE keys)

- `assetCode` unique per tenant (`AST-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

No `ciId`, serial, license-key, endpoint-id, owner-principal, location, warranty-date, or scheduler fields.

`done` means the human marked the **register row** complete. It is **not** CMDB lifecycle `retired`, not disposal, and not a discovery reconciliation.

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `it_assets` table; do not `ALTER` `itsm_tickets`, `cmdb_cis`, `cmdb_relationships`, `itsm_changes`, `itsm_problems`, or `itsm_releases`);
- `UNIQUE (tenant_id, asset_code)`;
- no foreign key to I11 / ITC1 / ITP1 / ITR1 tables;
- live PostgreSQL UNVERIFIED;
- intended filename if a migration is added later: `105_ita1_it_assets.sql` (after `104_p2_privacy_dpias.sql`);
- ADR-0017 **not** reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule (create ignores client status and writes `open`).

No dedicated discover, reconcile, license, endpoint, approve, retire, dispose, or complete endpoints. Lifecycle uses **PATCH status** only (same bounded surface as ITR1/P2; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- discovery / auto-reconcile / scanner feeds
- UEM / MDM / endpoint agents
- license-compliance engine / license keys as a second identity
- `ciId` / CMDB mutation / relationship editor
- serial uniqueness as product identity
- scheduler / SLA / automation
- AI mutation
- I11 / ITC1 / ITP1 / ITR1 mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous asset creation, discovery ingest, or closure.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency.

## API

Prefix `/v1/assets`. Do **not** attach ITA1 to `/v1/itsm/health` or `/v1/cmdb/health`. I11 `/v1/itsm/*`, `/v1/cmdb/*`, ITC1 `/v1/itsm/changes*`, ITP1 `/v1/itsm/problems*`, and ITR1 `/v1/itsm/releases*` are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/assets/health` | `asset:read:register` |
| GET | `/v1/assets?q=&status=` | `asset:read:register` |
| POST | `/v1/assets` | `asset:write:register` |
| GET | `/v1/assets/:id` | `asset:read:register` |
| PATCH | `/v1/assets/:id` | `asset:write:register` |

Health increment is `ITA1` (distinct from I11, ITC1, ITP1, ITR1, and P2). Intended health shape follows ITR1: `module` `it-assets`, `increment` `ITA1`, `status` `ok`, `assets` count, `openAssets` count.

Do not add discover, reconcile, license, endpoint, uem, cmdb, approve, dispose, bulk, or automation routes.

## RBAC

| Permission | Intent |
| --- | --- |
| `asset:read:register` | Health + list/get |
| `asset:write:register` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only). Role `it.asset` — both. Alice and partner — 403. At implementation time, Bob seed includes `it.asset` so the architecture role is exercised.

Do not broaden:

- I11 permissions (`itsm:read:ticket`, `itsm:write:ticket`, `cmdb:read:ci`, `cmdb:write:ci`) or role `it.agent`
- ITC1 / ITP1 / ITR1 permissions or roles `itsm.change` / `itsm.problem` / `itsm.release`
- P1 / P2, H1, GRC, crisis, operations, or HR permissions

Existing I11 ticket/CI permissions are **not** reused for ITA1 write or ITA1-only read. Asset write is **not** granted automatically to every `it.agent` or CMDB role.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant asset id → 404. I11 / ITC1 / ITP1 / ITR1 isolation unchanged.

## Audit

ITR1/P2 register services do **not** call `recordAudit`. ITA1 must match that sibling class. Do not introduce a new audit subsystem or a new hash-chain writer solely for ITA1. I0 audit/hash-chain remains available to other modules and is not redesigned here.

## UI

- `/commercial/assets`
- Nav **IT → Assets** (existing **IT → Service Desk**, **IT → CMDB**, **IT → Changes**, **IT → Problems**, and **IT → Releases** surfaces unchanged except optional additive links)
- Register asset (title + optional notes)
- Queue/list, optional filters consistent with O6/K2/H1/ITR1/P2 registers (`q` / status), detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is an **asset register**, not asset management, not discovery, not UEM, not License, not Endpoint, and not an I11 Service Desk or CMDB replacement
- I11 Service Desk or CMDB pages may add a link to Assets; those pages are not redesigned

Do not create discovery consoles, license dashboards, endpoint fleets, CMDB relationship editors, or inventory-management suites.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Title longer than 200 | 400 `title_too_long` |
| Notes longer than 2000 | 400 `notes_too_long` |
| Illegal status change | 409 `invalid_transition` |
| Patch when done | 409 `done` |
| Patch when cancelled | 409 `cancelled` |

Allocated `AST-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, asset_code)` if SQL is later added).

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM/scanner adapters. Human-only gates are server-enforced. Status is never treated as a disposer, reconciler, or executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`AST-0001`, then `AST-0002`)
- Forbidden engine subroutes (`discover`, `uem`, `license`, `endpoint`, `cmdb`, `reconcile`, …) return 404
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `it.asset` has only the ITA1 permission pair; `it.agent` / `itsm.release` do not gain ITA1 perms
- Kernel allocator/status helpers analogous to `packages/kernel/src/privacy-dpias.test.ts`
- Web typecheck
- Regression: I11 health remains `I11`; ITC1 `ITC1`; ITP1 `ITP1`; ITR1 `ITR1`; P2 `P2`; store keys `cmdbCis` / `itsmTickets` / `itsmReleases` unchanged in meaning
- At implementation time, do **not** flip any I11 `"itAsset" in store` freeze if one is added — ITA1 uses `itAssets`

## Acceptance criteria (when implementation is authorized)

1. Carol can register an asset and mark it done or cancelled from **IT → Assets**.
2. Alice and partner cannot read asset APIs.
3. Health increment is `ITA1`. I11 health remains `I11`. ITR1 health remains `ITR1`. P2 health remains `P2`.
4. I11 CIs, tickets, relationships, ITC1/ITP1/ITR1 rows are unchanged.
5. Store key is `itAssets`. No I11 / ITC1 / ITP1 / ITR1 / GRC / SAMPLE keys reused.
6. I11 remains closed. ITR1 remains closed. P2 remains closed. SAMPLE remains deferred.

## Exclusions

- Asset-management product; discovery; auto-reconcile; scanner feeds
- UEM / MDM; endpoint agents; license-compliance engine
- `ciId` linkage; CMDB redesign; relationship editor
- Serial uniqueness as a second identity; license keys; endpoint inventory
- SLA engine; scheduling engine; automated execution
- I11 mutation; ITC1 / ITP1 / ITR1 mutation; P1 / P2 mutation
- Procurement; payroll; HR; crisis command
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT; Consent register
- Corporate IdP; vault; SIEM; live regulatory feeds; external providers
- I11 reopen; ITR1 reopen; P2 reopen
- Numeric placeholder IDs I11.x / ITC1.x / ITP1.x / ITR1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an ITA1 defect. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an ITA1 product defect.

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter I11/ITR1/P2 schema or behaviour to “make room” for ITA1.

## Dependencies

I0 kernel patterns (tenancy/RBAC). No I11 write dependency. No new vendors, external services, identity providers, discovery tools, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test contract. ADR-0017 not reopened.

## Governance / authority matrix

```text
CAPABILITY_SELECTED=YES
CAPABILITY_ID=ITA1
STAGE_1_CREATED=YES
STAGE_1_APPROVED=YES
IMPLEMENTATION_AUTHORIZED=YES
EXECUTION_QUEUE=EMPTY
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
PUSH=NOT_AUTHORIZED
COMMIT=NOT_AUTHORIZED
```

Operator next step: ITA1 Stage 2 is complete for Development/Test. Commit is a separate Operator instruction. This is not UAT, Production, or an execution queue for License / UEM / I11 reopen.
