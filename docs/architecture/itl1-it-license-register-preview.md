# ITL1 IT License Register — Stage 1 Preview

> **CURRENT STATE (2026-08-25 Stage 1 approved + Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 and ITL1 Stage 2 remain **in the working tree**; commit is **not** authorized by this document.  
> ITA1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. This document does **not** reopen ITA1 and is **not** ITA1.x.  
> I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **PREVIEW=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=LICENSE_REGISTER** · **CAPABILITY_ID=ITL1** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **ITL1** |
| Capability name | IT License Register |
| Family | asset |
| Predecessor | I2 kernel (complete); I11 ITSM + CMDB complete and **not** reopened; ITC1 / ITP1 / ITR1 complete and **not** reopened; P1 / P2 complete and **not** reopened; ITA1 complete and **not** reopened |
| Architecture status | This document is the ITL1 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; STAGE 2 COMPLETE (DEV/TEST)** |
| Implementation status | **IMPLEMENTED / COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` + additive SQL `106_itl1_it_licenses.sql`. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED |
| Runtime health increment | `ITL1` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **ITL1** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **PREVIEW** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **EMPTY** |

Authority: 2026-08-25 Operator **PROCEED WITH GOVERNANCE SELECTION OF THE LICENSE REGISTER ONLY** (ID **ITL1** assigned by [`itl1-it-license-register-authorized.md`](../governance/itl1-it-license-register-authorized.md)), 2026-08-25 Operator **PROCEED WITH ITL1 STAGE 1 CONTRACT AUTHORING ONLY**, 2026-08-25 Operator **ITL1 STAGE 1 APPROVAL** (**STAGE_1_APPROVED=YES**), and 2026-08-25 Operator **ITL1 IMPLEMENTATION AUTHORIZATION** (**IMPLEMENTATION_AUTHORIZED=YES** / **ENVIRONMENT=DEVTEST**). This Stage 1 document remains the approved architecture contract. Stage 2 is complete for Development/Test. It does **not** authorize UAT, Production, commit, or push, and does **not** reopen ITA1 / I11 / ITC1 / ITP1 / ITR1 / P1 / P2. This is not ITA1.x, not I11.x, not ITC1.x, not ITP1.x, not ITR1.x, not P1.x, not P2.x, not C11, not H1.x, not I24, not LIC1, not ITIL, and not a license-management or compliance product.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

The sections after this heading are the **approved** architecture contract. Stage 2 is complete for Development/Test. This is not UAT or Production authorization.

---

## Objective

Deliver an **IT** workspace surface where an authorised human can record **IT license register rows**: a human label that a software/IT **license record exists**, or was cancelled.

ITL1 is **not** a license-management platform, not license-compliance management, not entitlement reconciliation, not seat/utilization management, not software discovery, not inventory scanning, not UEM, not MDM, not endpoint management, not asset management, not a CMDB, not procurement, not billing, not contract management, not renewals/calendars, not expiry workflows, not automated alerting, not license-key management, not deployment/CI/CD, and not AI mutation. It is not a redesign of ITA1 Assets, I11 tickets/CMDB, ITC1 Changes, ITP1 Problems, or ITR1 Releases.

Domain map 2.2 names Asset, License, and Endpoint under `asset`, owned by IT Manager, separate from `itsm` and `cmdb`. ITA1 shipped the Asset register only and left License out of scope. **ITL1 is the smaller proposed-shape license register only.**

This is a **register**, not a license engine.

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **ITL1 License** | A human record that a software/IT **license exists** (or was cancelled) | New store `itLicenses` |
| **ITA1 Asset** | A human record that an **IT asset exists** (or was cancelled) | Closed — not reopened; no `assetId` on ITL1 |
| **I11 CI** | A **configuration object** (class, lifecycle, relationships) | Closed — not reopened; no `ciId` on ITL1 |
| **I11 Ticket** | Incident/request work item | Closed — no `ticketId` |
| **ITC1 / ITP1 / ITR1** | Change / problem / release register rows | Closed — no `changeId` / `problemId` / `releaseId` |
| Endpoint / UEM / MDM | Device control / fleet inventory | Does not exist as a register; I11 already has CI class `endpoint` — must not be invented here |
| Procurement / PO | `procure` Request / PO / SourcingEvent | **D** — not reopened |
| GRC / Compliance | G1–G5 obligation/control/finding/test/mapping | Closed — not a software-license row |

**ITA1** records that an IT **asset** exists.  
**ITL1** records that a software/IT **license record** exists.  
ITL1 is **not** an attribute or child of an Asset.

Distinctness from ITA1 and I11 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra fields. Do **not** add `assetId`, `ciId`, license keys, seat counts, vendor SKUs, dates, or owner-principal fields merely to enlarge the distinction. Linkage would turn ITL1 into inventory, CMDB, or a compliance engine.

Do **not** use store key `itLicense` (singular) or reuse `itAssets` / `cmdbCis` / `itsmTickets`. The ITL1 key is **`itLicenses`** (plural).

Do **not** create `/v1/assets/:id/license`. That ITA1 engine subroute must remain **404**. ITL1 has its own collection.

## Scope

| Deliverable | In scope |
| --- | --- |
| License create / list / get / patch (while `open`) | Yes |
| License codes `LIC-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `notes` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `it.license` | Yes |
| Tenant-scoped `/v1/licenses/health` increment `ITL1` | Yes |
| Visible IT UI for the license register | Yes — ITA1 Assets, I11 Service Desk and CMDB, ITC1/ITP1/ITR1 remain those capabilities |
| ITA1 asset redesign / I11 ticket / CI redesign | No |
| License engine / discovery / UEM / endpoint inventory / procurement | No |
| Asset or CMDB relationship | No |

Required field is **`title`**, matching ITA1/ITR1/ITC1/ITP1/P2 registers (not a second `name` field).

Code prefix is **`LIC-`**, matching sibling noun prefixes (`AST-`, `CI-`, `TKT-`, `REL-`, `DPI-`), not the capability id `ITL1`. Repository search found no existing `LIC-` allocator and no `/v1/licenses` or `/commercial/licenses` collection.

No date fields. Sibling registers in this class (ITA1/P2/ITR1) do not require date labels. Dates must not be introduced as expiry, renewal, maintenance, purchase, or automatic status drivers. Do **not** copy H1 optional `issuedOn` / `expiresOn`.

Do **not** use statuses `active`, `expired`, `renewing`, `compliant`, `non_compliant`, `suspended`, or `deployed`. I11 already uses `active` as CI lifecycle. ITL1 uses only `open` / `done` / `cancelled`.

## Domain model

**it_licenses** (runtime store key `itLicenses` — not ITA1 `itAssets`, not I11 `itsmTickets` / `cmdbCis`, not ITC1 `itsmChanges`, not ITP1 `itsmProblems`, not ITR1 `itsmReleases`, not GRC keys, not SAMPLE keys)

- `id`
- `licenseCode` unique per tenant (`LIC-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ license: ... }`. List wraps as `{ items }` (ITA1/P2 pattern).

No `assetId`, `ciId`, `endpointId`, `applicationId`, license key, activation key, entitlement ID, seat/user count, utilization, vendor SKU, vendor contract number, cost, currency, purchase/expiry/renewal/maintenance dates, compliance score/status, procurement/PO/contract linkage, deployment state, or discovery state.

`done` means the human marked the **register row** complete. It is **not** license compliant, not “valid until a date”, not expired, not deployed, not entitlement consumed, not CMDB lifecycle `retired`, and not a discovery reconciliation.

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `it_licenses` table; do not `ALTER` `it_assets`, `itsm_tickets`, `cmdb_cis`, `cmdb_relationships`, `itsm_changes`, `itsm_problems`, or `itsm_releases`);
- `UNIQUE (tenant_id, license_code)`;
- no foreign key to ITA1 / I11 / ITC1 / ITP1 / ITR1 tables;
- live PostgreSQL UNVERIFIED;
- intended filename if a migration is added later: `106_itl1_it_licenses.sql` (after `105_ita1_it_assets.sql`);
- intended `schema_registry` context_key `it-licenses` (module name; not CI lifecycle `active` as a license status);
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

No dedicated approve, renew, expire, compliance, discover, deploy, activate, reconcile, schedule, complete, or cancel endpoints. Lifecycle uses **PATCH status** only (same bounded surface as ITA1/ITR1/P2; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance for a new decision or a revised Stage 1. Do not silently expand this contract:

- license keys / activation keys / entitlement IDs
- seats / user counts / utilization
- entitlement reconciliation / compliance score or status
- expiry / renewals / calendars / any date fields
- vendor integration / SKU / contract numbers / cost / currency / billing
- procurement / PO linkage
- `assetId` / `ciId` / `endpointId` / `applicationId` / ITA1 or CMDB mutation
- discovery / auto-reconcile / scanner feeds / software inventory
- UEM / MDM / endpoint agents / deployment / CI/CD / environment promotion
- scheduler / SLA / automated alerts / automation
- AI mutation
- ITA1 / I11 / ITC1 / ITP1 / ITR1 / P1 / P2 mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous license creation, discovery ingest, activation, or closure.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency. Do not reopen ADR-0012 or ADR-0013.

## API

Prefix `/v1/licenses`. Do **not** attach ITL1 to `/v1/assets`, `/v1/assets/:id/license`, `/v1/itsm/health`, or `/v1/cmdb/health`. ITA1 `/v1/assets*`, I11 `/v1/itsm/*`, `/v1/cmdb/*`, ITC1 `/v1/itsm/changes*`, ITP1 `/v1/itsm/problems*`, and ITR1 `/v1/itsm/releases*` are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

Repository search found no existing `/v1/licenses` collection. These routes are the intended **new** collection, consistent with ITA1 `/v1/assets` (not nested under assets).

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/licenses/health` | `license:read:register` |
| GET | `/v1/licenses?q=&status=` | `license:read:register` |
| POST | `/v1/licenses` | `license:write:register` |
| GET | `/v1/licenses/:id` | `license:read:register` |
| PATCH | `/v1/licenses/:id` | `license:write:register` |

Health increment is `ITL1` (distinct from ITA1, I11, ITC1, ITP1, ITR1, and P2). Intended health shape follows ITA1: `module` `it-licenses`, `increment` `ITL1`, `status` `ok`, `licenses` count, `openLicenses` count.

Do not add approve, renew, expire, compliance, discover, deploy, activate, reconcile, schedule, uem, endpoint, asset, cmdb, bulk, or automation routes.

**Required residual ITA1 protection (unchanged):** `POST /v1/assets/:id/license` (and ITA1 `discover` / `uem` / `endpoint` / `cmdb` / `reconcile` subroutes) remain **404**. ITL1 implementation must not hang license product behaviour off ITA1.

## RBAC

| Permission | Intent |
| --- | --- |
| `license:read:register` | Health + list/get |
| `license:write:register` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only). Role `it.license` — both. Alice and partner — 403. At implementation time, Bob seed includes `it.license` so the architecture role is exercised.

Do not reuse or broaden:

- ITA1 permissions (`asset:read:register`, `asset:write:register`) or role `it.asset`
- I11 permissions (`itsm:read:ticket`, `itsm:write:ticket`, `cmdb:read:ci`, `cmdb:write:ci`) or role `it.agent`
- ITC1 / ITP1 / ITR1 permissions or roles `itsm.change` / `itsm.problem` / `itsm.release`
- P1 / P2, H1, GRC, crisis, operations, or HR permissions

Existing ITA1 and I11 permissions are **not** reused for ITL1 write or ITL1-only read. License write is **not** granted automatically to every `it.asset`, `it.agent`, or CMDB role.

## Tenant isolation

Tenant-scoped. Collection queries are tenant-filtered. Missing / wrong-tenant license id → 404 (do not disclose another tenant’s record). ITA1 / I11 / ITC1 / ITP1 / ITR1 isolation unchanged. No cross-tenant administrative behaviour.

## Audit

ITA1/ITR1/P2 register services do **not** call `recordAudit`. ITL1 must match that sibling class. Do not introduce a new audit subsystem or a new hash-chain writer solely for ITL1. I0 audit/hash-chain remains available to other modules and is not redesigned here.

## UI

- `/commercial/licenses` (no existing page; sibling of `/commercial/assets`)
- Nav **IT → Licenses** after **IT → Assets** (existing **IT → Service Desk**, **IT → CMDB**, **IT → Changes**, **IT → Problems**, **IT → Releases**, and **IT → Assets** surfaces unchanged except optional additive links)
- Register license (title + optional notes)
- Queue/list, optional filters consistent with ITA1/O6/K2/H1/ITR1/P2 registers (`q` / status), detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is a **License Register**, never License Management, License Compliance, Software Asset Management, UEM, or Discovery; not an ITA1 Assets replacement and not an I11 Service Desk or CMDB replacement
- ITA1 Assets page may add a link to Licenses; that page is **not** redesigned

Do not create license-compliance dashboards, entitlement calculators, discovery consoles, endpoint fleets, CMDB relationship editors, renewal calendars, or inventory-management suites.

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

Allocated `LIC-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, license_code)` if SQL is later added).

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM/scanner/vendor adapters. Human-only gates are server-enforced. Status is never treated as a compliance result, entitlement counter, activator, or executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`LIC-0001`, then `LIC-0002`)
- Forbidden engine subroutes on `/v1/licenses/:id/` (`approve`, `renew`, `expire`, `compliance`, `discover`, `deploy`, `activate`, `reconcile`, `schedule`, …) return 404
- ITA1 residual: `/v1/assets/:id/license` (and ITA1 `discover` / `uem` / `endpoint`) remain 404
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `it.license` has only the ITL1 permission pair; `it.asset` / `it.agent` / `itsm.release` do not gain ITL1 perms
- Kernel allocator/status helpers analogous to `packages/kernel/src/it-assets.test.ts`
- Web typecheck
- UI: **IT → Licenses** register / queue / detail / done / cancel (implementation-time browser verification)
- Regression: ITA1 health remains `ITA1`; I11 health remains `I11`; ITC1 `ITC1`; ITP1 `ITP1`; ITR1 `ITR1`; P2 `P2`; store keys `itAssets` / `cmdbCis` / `itsmTickets` / `itsmReleases` / `privacyDpias` unchanged in meaning
- At implementation time, `"itLicense" in store` remains `false` — ITL1 uses `itLicenses`
- If ITA1 freeze tests currently assert absence of a licenses collection, updating those fixtures to allow the new `itLicenses` key is **test-fixture evolution only**, not an ITA1 reopen

## Acceptance criteria (when implementation is authorized)

1. Carol can register a license and mark it done or cancelled from **IT → Licenses**.
2. Alice and partner cannot read license APIs.
3. Health increment is `ITL1`. ITA1 health remains `ITA1`. I11 health remains `I11`. ITR1 health remains `ITR1`. P2 health remains `P2`.
4. ITA1 assets, I11 CIs, tickets, relationships, ITC1/ITP1/ITR1 rows are unchanged.
5. Store key is `itLicenses`. No ITA1 / I11 / ITC1 / ITP1 / ITR1 / GRC / SAMPLE keys reused.
6. ITA1 remains closed. I11 remains closed. ITR1 remains closed. P2 remains closed. SAMPLE remains deferred.
7. `/v1/assets/:id/license` remains 404.

## Exclusions

- License-compliance management; entitlement reconciliation; seat counting; utilization
- Software discovery; automated software inventory; scanner feeds
- UEM / MDM; endpoint management; endpoint inventory
- Asset management; CMDB management; `assetId` / `ciId` linkage
- Procurement; PO workflows; vendor management; contract management; billing
- Renewals; calendars; expiry workflows; automated alerts
- Deployment management; CI/CD; environment promotion
- License-key / activation-key management
- External provider integrations; AI mutation
- ITA1 mutation / ITA1.x; I11 mutation; ITC1 / ITP1 / ITR1 mutation; P1 / P2 mutation
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT; Consent register
- Corporate IdP; vault; SIEM; live regulatory feeds
- ITA1 reopen; I11 reopen; ITR1 reopen; P2 reopen
- Numeric placeholder IDs ITA1.x / I11.x / ITC1.x / ITP1.x / ITR1.x / P1.x / P2.x / H1.x / H2 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24
- UAT; Production

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an ITL1 defect. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an ITL1 product defect.

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter ITA1/I11/ITR1/P2 schema or behaviour to “make room” for ITL1.

## Dependencies

I0 kernel patterns (tenancy/RBAC). No ITA1 write dependency. No I11 write dependency. No new vendors, external services, identity providers, discovery tools, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test contract. ADR-0017 not reopened.

## Governance / authority matrix

```text
CAPABILITY=LICENSE_REGISTER
CAPABILITY_ID=ITL1
STAGE_1_STATUS=APPROVED
STAGE_1_APPROVED=YES
IMPLEMENTATION_AUTHORIZED=YES
EXECUTION_QUEUE=EMPTY
PREVIEW=NOT_AUTHORIZED
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
```

Operator next step: UAT and Production remain unauthorized. This is not ITA1.x, not an execution queue for Endpoint / UEM / Consent / I11 reopen, and not a commit/push authorization.
