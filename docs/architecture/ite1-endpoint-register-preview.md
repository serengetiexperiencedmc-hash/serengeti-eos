# ITE1 Endpoint Register — Stage 1 Preview

> **CURRENT STATE (2026-08-26 Operator ITE1 GOVERNANCE CLOSURE — Development/Test complete / accepted)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`0ccf1d7a560b8293bbf5a202a8d12a4e4cdecdd9`** (this HEAD **is** the ITE1 implementation commit)  
> Parent of that commit is `a24888523cd82242b341c77e2db7d076374fa8e2` (E2 governance closure).  
> ITE1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED / ACCEPTED** for Development/Test (additive SQL `109_ite1_it_endpoints.sql`).  
> ITA1, ITL1, E1, and E2 remain **CLOSED** on `master`. This document does **not** reopen ITA1, ITL1, I11, E1, or E2.  
> **PATH_B_ENDPOINT_STAGE_1=APPROVED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=ENDPOINT_REGISTER** · **CAPABILITY_ID=ITE1** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete) · **ITE1_IMPLEMENTATION=COMPLETE** · **ITE1_PREVIEW=AUTHORIZED** · **ITE1_PREVIEW_RESULT=PASS** · **OWNER/HUMAN_PREVIEW_RESULT=PASS** · **COMMIT=EXECUTED** · **PUSH=EXECUTED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE**

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **ITE1** |
| Capability name | Endpoint Register |
| Family | asset |
| Domain | Asset (`asset` — domain map 2.2 aggregate **Endpoint**) |
| Predecessor | I2 kernel (complete); ITA1 Asset register complete and **not** reopened; ITL1 License register complete and **not** reopened; I11 ITSM + CMDB complete and **not** reopened |
| Architecture status | This document is the ITE1 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; STAGE 2 COMPLETE / ACCEPTED (DEV/TEST)** |
| Implementation status | **IMPLEMENTED / COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` (`itEndpoints`) + additive SQL `109_ite1_it_endpoints.sql` (next unused after committed `108_e2_erm_treatments.sql`; do **not** use local draft `116`). ADR-0017 not reopened. Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record by this contract. |
| Runtime health increment | `ITE1` (must not replace ITA1 `/v1/assets/health`, ITL1 `/v1/licenses/health`, or I11 `/v1/itsm/health` / `/v1/cmdb/health`) |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **ITE1** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **ITE1_IMPLEMENTATION_AUTHORIZED** | **YES** |
| **ITE1_IMPLEMENTATION** | **COMPLETE** |
| **ITE1_IMPLEMENTATION_ENVIRONMENT** | **DEV_TEST_ONLY** |
| **DEVTEST_STATUS** | **CLOSED / ACCEPTED** |
| **ITE1_PREVIEW** | **AUTHORIZED** (Development/Test; executed) |
| **PREVIEW** | **AUTHORIZED** (Development/Test; executed) |
| **ITE1_PREVIEW_RESULT** | **PASS** |
| **BROWSER_E2E** | **EXECUTED** |
| **OWNER/HUMAN_PREVIEW_RESULT** | **PASS** |
| **HUMAN_ACCEPTANCE** | **PASS** |
| **COMMIT** | **EXECUTED** (`0ccf1d7a560b8293bbf5a202a8d12a4e4cdecdd9`) |
| **ITE1_COMMIT_SHA** | **`0ccf1d7a560b8293bbf5a202a8d12a4e4cdecdd9`** |
| **PUSH** | **EXECUTED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **ADR-0006** | **OPEN** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEW_CAPABILITY_AUTHORIZED** | **NONE** |

Authority: 2026-08-25 Operator **PATH B — OPERATOR SELECTION ONLY** (`CAPABILITY=ENDPOINT_REGISTER` recorded by [`endpoint-register-authorized.md`](../governance/endpoint-register-authorized.md)), and 2026-08-26 Operator **PATH B — ENDPOINT REGISTER — STAGE 1 CONTRACT AUTHORING ONLY** (`PATH_B_UNPAUSE_FOR_ENDPOINT_STAGE_1=YES`). ID **ITE1** is assigned at this Stage 1 authoring gate. Repository search found **no** existing use of `ITE1` as a capability ID, no `/v1/endpoints` collection, no `itEndpoints` store key, and no `END-` allocator. It is **not** ITA1, **not** ITA1.x, **not** ITL1, **not** ITL1.x, **not** ITA2, **not** I11.x, **not** E3, and **not** a UEM/MDM/EDR product.

This Stage 1 document is the **approved** architecture contract. Dev/Test Stage 2 is **COMPLETE / CLOSED / ACCEPTED**. Dev/Test Preview was **authorized and executed** with **ITE1_PREVIEW_RESULT=PASS** and **OWNER/HUMAN_PREVIEW_RESULT=PASS**. Commit **EXECUTED** at `0ccf1d7a560b8293bbf5a202a8d12a4e4cdecdd9`. Push **EXECUTED**. UAT and Production remain **not** authorized. **ADR-0006** remains **OPEN**. It does **not** reopen ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 / E1 / E2 / P1 / P2. Path B leftover-noun **auto-selection remains paused**. This record does **not** select or authorize another capability.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ Preview authorization.**  
**Preview authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**  
**Dev/Test closure ≠ next-increment authorization.**

The sections after this heading are the **approved** architecture contract. The lifecycle table above is the **current** Development/Test closure state. The contract body is not a pending implementation queue.

```text
ITE1_STAGE_1_APPROVED = YES
STAGE_1_AUTHORING = AUTHORIZED
STAGE_1_APPROVED = YES
ITE1_IMPLEMENTATION_AUTHORIZED = YES
ITE1_IMPLEMENTATION_ENVIRONMENT = DEV_TEST_ONLY
ITE1_IMPLEMENTATION = COMPLETE
IMPLEMENTATION = COMPLETE
DEVTEST_STATUS = CLOSED / ACCEPTED
ITE1_PREVIEW = AUTHORIZED
PREVIEW = AUTHORIZED
ITE1_PREVIEW_RESULT = PASS
OWNER/HUMAN_PREVIEW_RESULT = PASS
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
COMMIT = EXECUTED
ITE1_COMMIT_SHA = 0ccf1d7a560b8293bbf5a202a8d12a4e4cdecdd9
PUSH = EXECUTED
ADR_0006 = OPEN
PATH_B_ENDPOINT_STAGE_1 = APPROVED
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
EXECUTION_QUEUE = EMPTY
NEW_CAPABILITY_AUTHORIZED = NONE
```

---

## Objective

Deliver an **IT** workspace surface where an authorised human can record **endpoint register rows**: a human label that an IT **endpoint exists**, or was cancelled.

**Endpoint Register = catalogue/governance record of endpoints.**  
**Endpoint Register ≠ device-management / UEM / MDM / EDR engine.**

ITE1 is **not** unified endpoint management, not mobile device management, not endpoint configuration management, not endpoint security enforcement, not vulnerability scanning, not EDR, not automated device discovery, not remote device control, not fleet policy enforcement, not last-seen telemetry, not agent inventory, not serial-number identity, not a CMDB, not asset management, not license management, not procurement, and not AI mutation. It is not a redesign of ITA1 Assets, ITL1 Licenses, or I11 tickets/CMDB (including I11 CI class `endpoint`).

Domain map 2.2 names Asset, License, and Endpoint under `asset`, owned by IT Manager, separate from `itsm` and `cmdb`. ITA1 shipped the Asset register only. ITL1 shipped the License register only and left Endpoint out of scope. **ITE1 is the smaller authored-shape endpoint register only.**

This is a **register**, not an inventory engine and not a fleet-control product.

---

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **ITE1 Endpoint** | A human record that an IT **endpoint exists** (or was cancelled) | New store `itEndpoints` |
| **ITA1 Asset** | A human record that an **IT asset exists** (or was cancelled) | Closed — not reopened; no `assetId` on ITE1 |
| **ITL1 License** | A human record that a software/IT **license exists** (or was cancelled) | Closed — not reopened; no `licenseId` on ITE1 |
| **I11 CI** | A **configuration object** (class, lifecycle, relationships). I11 already has CI class `endpoint` | Closed — not reopened; no `ciId` on ITE1; I11 class `endpoint` is **not** this capability |
| **I11 Ticket** | Incident/request work item | Closed — no `ticketId` |
| **ITC1 / ITP1 / ITR1** | Change / problem / release register rows | Closed — no `changeId` / `problemId` / `releaseId` |
| UEM / MDM / EDR / discovery | Device control / fleet / agents / scanners | Does not exist as a product; must not be invented here |

**ITA1** records that an IT **asset** exists.  
**ITL1** records that a software/IT **license record** exists.  
**ITE1** records that an IT **endpoint** is listed in the human catalogue.  
ITE1 is **not** an attribute or child of an Asset or License. I11 CI class `endpoint` remains I11.

Distinctness from ITA1, ITL1, and I11 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra telemetry fields. Do **not** add `assetId`, `ciId`, `licenseId`, serial uniqueness, hostname/IP/MAC as product identity, last-seen timestamps, agent versions, OS inventory, owner-principal fields, or location fields merely to enlarge the distinction. Linkage or telemetry would turn ITE1 into CMDB, UEM, or an inventory engine.

Do **not** use store key `itEndpoint` (singular) or reuse `itAssets` / `itLicenses` / `cmdbCis` / `itsmTickets`. The ITE1 key is **`itEndpoints`** (plural).

Do **not** create `/v1/assets/:id/endpoint` or `/v1/licenses/:id/endpoint`. Those ITA1/ITL1 engine subroutes must remain **404**. ITE1 has its own collection.

---

## Scope

| Deliverable | In scope |
| --- | --- |
| Endpoint create / list / get / patch (while `open`) | Yes |
| Endpoint codes `END-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `notes` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `it.endpoint` | Yes |
| Tenant-scoped `/v1/endpoints/health` increment `ITE1` | Yes |
| Visible IT UI for the endpoint register | Yes — ITA1 Assets, ITL1 Licenses, I11 Service Desk and CMDB remain those capabilities |
| ITA1 / ITL1 / I11 redesign | No |
| UEM / MDM / EDR / discovery / fleet control / endpoint security enforcement | No |
| Asset, license, or CMDB relationship | No |

Required field is **`title`**, matching ITA1/ITL1/ITR1/ITC1/ITP1/P2 registers (not a second `name` field).

Code prefix is **`END-`**, matching sibling noun prefixes (`AST-`, `LIC-`, `CI-`, `TKT-`, `REL-`), not the capability id `ITE1`. Repository search found no existing `END-` allocator and no `/v1/endpoints` or `/commercial/endpoints` collection.

No date fields. Sibling registers in this class (ITA1/ITL1/P2/ITR1) do not require date labels. Dates must not be introduced as last-seen, enrolment, wipe, or automatic status drivers.

Do **not** use statuses `enrolled`, `compliant`, `non_compliant`, `managed`, `unmanaged`, `online`, `offline`, `wiped`, `quarantined`, or `deployed`. I11 already uses `active` as CI lifecycle. ITE1 uses only `open` / `done` / `cancelled`.

---

## Domain model

**it_endpoints** (runtime store key `itEndpoints` — not ITA1 `itAssets`, not ITL1 `itLicenses`, not I11 `itsmTickets` / `cmdbCis`, not ITC1 `itsmChanges`, not ITP1 `itsmProblems`, not ITR1 `itsmReleases`, not GRC keys, not SAMPLE keys)

- `id`
- `endpointCode` unique per tenant (`END-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ endpoint: ... }`. List wraps as `{ items }` (ITA1/ITL1/P2 pattern).

No `assetId`, `ciId`, `licenseId`, `ticketId`, serial number uniqueness, hardware UUID, hostname, IP, MAC, OS name/version, agent ID/version, last-seen, enrolment state, compliance score, owner-principal, site/location, MDM/UEM tenant, EDR sensor, vulnerability count, remote-control handle, or discovery source.

`done` means the human marked the **register row** complete. It is **not** enrolled, not compliant, not online, not wiped, not unmanaged-resolved, not CMDB lifecycle `retired`, and not a discovery reconciliation.

---

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `it_endpoints` table; do not `ALTER` `it_assets`, `it_licenses`, `itsm_tickets`, `cmdb_cis`, `cmdb_relationships`, `itsm_changes`, `itsm_problems`, or `itsm_releases`);
- `UNIQUE (tenant_id, endpoint_code)`;
- no foreign key to ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 tables;
- live PostgreSQL UNVERIFIED;
- authorized implementation filename: `109_ite1_it_endpoints.sql` (next unused after committed `108_e2_erm_treatments.sql`; do **not** use local draft `116`);
- intended `schema_registry` context_key `it-endpoints`;
- ADR-0017 **not** reopened.

---

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

No dedicated enrol, discover, wipe, quarantine, comply, lock, unlock, locate, push-policy, or agent endpoints. Lifecycle uses **PATCH status** only (same bounded surface as ITA1/ITL1/ITR1/P2; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

---

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- UEM / MDM / endpoint configuration management
- endpoint security enforcement / EDR / vulnerability scanning
- automated device discovery / scanner feeds / last-seen telemetry
- remote device control / wipe / lock / locate / quarantine
- fleet policy enforcement / compliance score
- serial uniqueness / hostname / IP / MAC / agent ID as product identity
- `assetId` / `ciId` / `licenseId` / ITA1, ITL1, or CMDB mutation
- nested `/v1/assets/:id/endpoint` product behaviour
- scheduler / SLA / automation
- AI mutation
- ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen
- Tanzania Production hosting, public cloud versus colocation, Production DB/backup/DR, RTO/RPO, Production encryption/KMS, Production secrets, Production NATS, provider-specific infrastructure, TCO, or L6 mechanism

---

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous endpoint creation, discovery ingest, enrolment, wipe, or closure.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, MDM connector, or production security dependency. Do not reopen ADR-0012 or ADR-0013.

---

## API

Prefix `/v1/endpoints`. Do **not** attach ITE1 to `/v1/assets`, `/v1/assets/:id/endpoint`, `/v1/licenses`, `/v1/licenses/:id/endpoint`, `/v1/itsm/health`, or `/v1/cmdb/health`. ITA1 `/v1/assets*`, ITL1 `/v1/licenses*`, I11 `/v1/itsm/*`, `/v1/cmdb/*`, ITC1 `/v1/itsm/changes*`, ITP1 `/v1/itsm/problems*`, and ITR1 `/v1/itsm/releases*` are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

Repository search found no existing `/v1/endpoints` collection. These routes are the intended **new** collection, consistent with ITA1 `/v1/assets` and ITL1 `/v1/licenses` (not nested under assets).

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/endpoints/health` | `endpoint:read:register` |
| GET | `/v1/endpoints?q=&status=` | `endpoint:read:register` |
| POST | `/v1/endpoints` | `endpoint:write:register` |
| GET | `/v1/endpoints/:id` | `endpoint:read:register` |
| PATCH | `/v1/endpoints/:id` | `endpoint:write:register` |

Health increment is `ITE1` (distinct from ITA1, ITL1, I11, ITC1, ITP1, ITR1, and P2). Intended health shape follows ITA1/ITL1: `module` `it-endpoints`, `increment` `ITE1`, `status` `ok`, `endpoints` count, `openEndpoints` count.

Do not add enrol, discover, wipe, quarantine, comply, lock, unlock, locate, policy, agent, uem, mdm, edr, asset, license, cmdb, bulk, or automation routes.

**Required residual ITA1/ITL1 protection (unchanged):** `POST /v1/assets/:id/endpoint` (and ITA1 `discover` / `uem` / `license` / `cmdb` / `reconcile` subroutes) remain **404**. `POST /v1/licenses/:id/endpoint` must not be created as a product route. ITE1 implementation must not hang endpoint product behaviour off ITA1 or ITL1.

---

## RBAC

| Permission | Intent |
| --- | --- |
| `endpoint:read:register` | Health + list/get |
| `endpoint:write:register` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only). Role `it.endpoint` — both. Alice and partner — 403. At implementation time, Bob seed includes `it.endpoint` so the architecture role is exercised.

Do not reuse or broaden:

- ITA1 permissions (`asset:read:register`, `asset:write:register`) or role `it.asset`
- ITL1 permissions (`license:read:register`, `license:write:register`) or role `it.license`
- I11 permissions (`itsm:read:ticket`, `itsm:write:ticket`, `cmdb:read:ci`, `cmdb:write:ci`) or role `it.agent`
- ITC1 / ITP1 / ITR1 permissions or roles `itsm.change` / `itsm.problem` / `itsm.release`
- P1 / P2, H1, GRC, crisis, operations, or HR permissions

Existing ITA1, ITL1, and I11 permissions are **not** reused for ITE1 write or ITE1-only read. Endpoint write is **not** granted automatically to every `it.asset`, `it.license`, `it.agent`, or CMDB role.

Do not create implementation permissions in source code in this Stage 1 authoring pass.

---

## Tenant isolation

Tenant-scoped. Collection queries are tenant-filtered. Missing / wrong-tenant endpoint id → 404 (do not disclose another tenant’s record). ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 isolation unchanged. No cross-tenant administrative behaviour.

---

## Audit

ITA1/ITL1/ITR1/P2 register services do **not** call `recordAudit`. ITE1 must match that sibling class. Do not introduce a new audit subsystem or a new hash-chain writer solely for ITE1. I0 audit/hash-chain remains available to other modules and is not redesigned here.

This is a contract expectation only. Do not implement audit writers in this pass.

---

## UI

- `/commercial/endpoints` (no existing page; sibling of `/commercial/assets` and `/commercial/licenses`)
- Nav **IT → Endpoints** after **IT → Licenses** (existing **IT → Service Desk**, **IT → CMDB**, **IT → Changes**, **IT → Problems**, **IT → Releases**, **IT → Assets**, and **IT → Licenses** surfaces unchanged except optional additive links)
- Register endpoint (title + optional notes)
- Queue/list, optional filters consistent with ITA1/ITL1/O6/K2/H1/ITR1/P2 registers (`q` / status), detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is an **Endpoint Register**, never UEM, MDM, EDR, Discovery, Device Management, Fleet Control, or Endpoint Security; not an ITA1 Assets replacement, not an ITL1 Licenses replacement, and not an I11 Service Desk or CMDB replacement (including I11 CI class `endpoint`)
- ITA1 Assets and ITL1 Licenses pages may add a link to Endpoints; those pages are **not** redesigned

Do not create discovery consoles, fleet dashboards, agent managers, wipe/lock controls, compliance calculators, CMDB relationship editors, or inventory-management suites.

Do not implement UI in this Stage 1 authoring pass.

---

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

Allocated `END-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, endpoint_code)` if SQL is later added).

---

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM/scanner/MDM/EDR/UEM adapters. Human-only gates are server-enforced. Status is never treated as enrolment, compliance, online-state, wipe, or executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

---

## DP-0006 / hosting independence

This Dev/Test register contract does **not** select or assume:

- Tanzania Production hosting
- public cloud versus colocation
- Production database location
- Production backup location
- Production DR topology
- RTO or RPO
- Production encryption architecture
- KMS / key location
- Production secrets platform
- Production NATS
- provider-specific infrastructure
- 3-year TCO
- L6 legal mechanism
- a hosting provider or ADR-0006 decision

```text
HOSTING_OPTION_SELECTED = NO
ADR_0006_DECISION_READINESS = NOT_READY
```

If a later Production endpoint-management or fleet product would need those facts, that is a **separate** capability after ADR-0006 evidence analysis — not ITE1 Stage 1.

---

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`END-0001`, then `END-0002`)
- Forbidden engine subroutes on `/v1/endpoints/:id/` (`enrol`, `discover`, `wipe`, `quarantine`, `comply`, `lock`, `uem`, `mdm`, `edr`, `agent`, …) return 404
- ITA1 residual: `/v1/assets/:id/endpoint` (and ITA1 `discover` / `uem` / `license`) remain 404
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `it.endpoint` has only the ITE1 permission pair; `it.asset` / `it.license` / `it.agent` / `itsm.release` do not gain ITE1 perms
- Kernel allocator/status helpers analogous to `packages/kernel/src/it-assets.test.ts`
- Web typecheck
- UI: **IT → Endpoints** register / queue / detail / done / cancel (implementation-time browser verification)
- Regression: ITA1 health remains `ITA1`; ITL1 health remains `ITL1`; I11 health remains `I11`; I11 CI class `endpoint` still exists as I11 and is not ITE1; store keys `itAssets` / `itLicenses` / `cmdbCis` unchanged in meaning
- At implementation time, `"itEndpoint" in store` remains `false` — ITE1 uses `itEndpoints`

---

## Acceptance criteria (when implementation is authorized)

1. Carol can register an endpoint and mark it done or cancelled from **IT → Endpoints**.
2. Alice and partner cannot read endpoint APIs.
3. Health increment is `ITE1`. ITA1 health remains `ITA1`. ITL1 health remains `ITL1`. I11 health remains `I11`.
4. ITA1 assets, ITL1 licenses, I11 CIs (including class `endpoint`), tickets, relationships, ITC1/ITP1/ITR1 rows are unchanged.
5. Store key is `itEndpoints`. No ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 / GRC / SAMPLE keys reused.
6. ITA1 remains closed. ITL1 remains closed. I11 remains closed. SAMPLE remains deferred.
7. `/v1/assets/:id/endpoint` remains 404.
8. No UEM/MDM/EDR/discovery/wipe/lock routes exist on `/v1/endpoints`.

---

## Exclusions / non-goals

- UEM / MDM; endpoint configuration management; fleet policy enforcement
- Endpoint security enforcement; EDR; vulnerability scanning
- Automated device discovery; scanner feeds; last-seen telemetry; agent inventory
- Remote device control; wipe; lock; locate; quarantine
- Serial uniqueness / hostname / IP / MAC as product identity
- Asset management; license management; CMDB management; `assetId` / `ciId` / `licenseId` linkage
- Procurement; PO workflows; billing
- ITA1 mutation / ITA1.x; ITL1 mutation / ITL1.x; I11 mutation / I11.x
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT; Consent register
- Corporate IdP; vault; SIEM; live regulatory feeds; MDM/EDR vendors
- ITA1 reopen; ITL1 reopen; I11 reopen
- Numeric placeholder IDs ITA1.x / ITL1.x / I11.x / ITA2 / E3 / ITC1.x / ITP1.x / ITR1.x / P1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I15.x / E1.x / E2.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24
- UAT; Production
- ADR-0006 hosting selection; DP-0006 evidence analysis; provider selection

---

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an ITE1 product defect. This Stage 1 pass creates **no** application source, tests, SQL, or UI.

---

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter ITA1/ITL1/I11 schema or behaviour to “make room” for ITE1.

---

## Dependencies

I0 kernel patterns (tenancy/RBAC). No ITA1 write dependency. No ITL1 write dependency. No I11 write dependency. No new vendors, external services, identity providers, discovery tools, MDM/UEM/EDR products, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test contract. ADR-0017 not reopened. DP-0006 remains pending; this contract does not consume RFI answers.

Path B leftover-noun auto-selection **remains paused**. This contract does not auto-select a successor capability.

---

## Governance / authority matrix

```text
CAPABILITY = ENDPOINT_REGISTER
CAPABILITY_ID = ITE1
CAPABILITY_NAME = Endpoint Register
STAGE = 1
STATUS = STAGE_1_APPROVED_STAGE_2_COMPLETE_ACCEPTED_DEVTEST
STAGE_1_CREATED = YES
STAGE_1_STATUS = APPROVED
STAGE_1_APPROVED = YES
ITE1_STAGE_1_APPROVED = YES
STAGE_1_AUTHORING = AUTHORIZED
ITE1_IMPLEMENTATION_AUTHORIZED = YES
ITE1_IMPLEMENTATION_ENVIRONMENT = DEV_TEST_ONLY
ITE1_IMPLEMENTATION = COMPLETE
IMPLEMENTATION_AUTHORIZED = YES
IMPLEMENTATION = COMPLETE
DEVTEST_STATUS = CLOSED / ACCEPTED
ITE1_PREVIEW = AUTHORIZED
PREVIEW = AUTHORIZED
ITE1_PREVIEW_RESULT = PASS
OWNER/HUMAN_PREVIEW_RESULT = PASS
HUMAN_ACCEPTANCE = PASS
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
COMMIT = EXECUTED
ITE1_COMMIT_SHA = 0ccf1d7a560b8293bbf5a202a8d12a4e4cdecdd9
PUSH = EXECUTED
ADR_0006 = OPEN
PATH_B_ENDPOINT_STAGE_1 = APPROVED
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
EXECUTION_QUEUE = EMPTY
NEW_CAPABILITY_AUTHORIZED = NONE
HOSTING_OPTION_SELECTED = NO
ADR_0006_DECISION_READINESS = NOT_READY
DP_0006_EVIDENCE_ANALYSIS = NOT_AUTHORIZED
DP_0006_SUBSTANTIVE_RESPONSES_RECEIVED = 0
```

This is not UAT, Production, ITA1.x, ITL1.x, UEM, ADR-0006 closure, or next-increment authorization. **NEXT_INCREMENT=NONE_AUTHORIZED**.
