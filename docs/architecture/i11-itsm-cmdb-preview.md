# I11 ITSM and CMDB — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I11** |
| Capability name | ITSM + CMDB |
| Predecessor | I4 Event bus (ACCEPTED); I10 HR Core (complete, unrelated) |
| Architecture status | This document is the I11 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `082_i11_itsm_cmdb.sql`. ADR-0017 not reopened |
| Runtime health increment | `I11` |
| Production / UAT / AI | Not authorized |

Authority: committed backlog (`docs/backlog/increments.md` I11 — Tickets, CIs; not Discovery), Phase 3 roadmap, domain map (`itsm` Ticket; `cmdb` CI / Relationship / Service), and [`11-cmdb-architecture.md`](11-cmdb-architecture.md). Unified incident lifecycle from [`13-crisis-command-center.md`](13-crisis-command-center.md) informs ticket states. Crisis declaration (L2/L3 command overlay) is **not** I11.

The sections after this heading are the architecture contract.

---

## Objective

Deliver an **IT** department so an internal user can run a service desk (tickets) and maintain an authorised CMDB (configuration items and relationships) through API and visible UI.

## User / business purpose

Phase 3 begins with ITSM and CMDB. Discovery, observability, SOC, PAM, and change/release engines are later increments. I11 is the first authoritative inventory and ticket workspace, not auto-discovered truth.

## Scope

| Deliverable | In scope |
| --- | --- |
| Service desk tickets (create, list, get, patch, lifecycle) | Yes |
| Ticket types `incident` and `request` | Yes |
| Ticket ↔ CI links | Yes |
| CMDB CIs with contracted classes, lifecycle, attributes | Yes |
| CI relationships (`runs_on`, `depends_on`, `connects_to`, `backed_up_by`, `monitored_by`, `owned_by`, `provides`) | Yes |
| Tenant-scoped `/v1/itsm/health` and `/v1/cmdb/health` increment `I11` | Yes |
| Visible nav **IT → Service Desk** and **IT → CMDB** | Yes |
| Discovery / auto-reconcile / UEM population | No |
| Change / Problem / Release as separate ITIL modules | No |
| Crisis declaration, RCA, corrective-action engine | No |
| Observability (I12), SOC (I13), PAM (I14) | No |

BusinessService CIs satisfy the domain-map **Service** aggregate without a separate service table.

## User roles

| Role | Intent |
| --- | --- |
| `platform.admin` | Full ITSM + CMDB |
| `it.agent` | Tickets + CI read/write (service desk) |
| Finance member (Alice) | No IT — 403 |
| Partner tenant | No IT — 403 |

Dev/Test seed: Carol has platform.admin (all IT). `it.agent` role exists for grants; no extra login fixture.

## Data model

**itsm_tickets**

- `ticketCode` unique per tenant (`TKT-0001` …)
- `title`, optional `description`
- `ticketType`: `incident` \| `request`
- `severity`: `low` \| `medium` \| `high` \| `critical`
- `status`: see workflow
- optional assignment stored as `assignedPrincipalId` (not returned; responses expose `assignedToEmail` / `assignedToName`)
- optional `environment`

**itsm_ticket_cis**

- `(ticketId, ciId)` unique, tenant-scoped

**cmdb_cis**

- `ciCode` unique per tenant (`CI-0001` …)
- `name` unique per tenant (case-insensitive)
- `ciClass` from architecture 11.2
- `lifecycle`: `planned` \| `active` \| `maintenance` \| `retired`
- `environment`, `criticality`, `classification`
- `sourceOfTruth`: `manual` (discovery out of scope)
- `ownerName`, `custodianName` (text; not principal IDs)
- optional `rtoMinutes`, `rpoMinutes`

**cmdb_relationships**

- `fromCiId`, `toCiId`, `relType`
- no self-links; both CIs same tenant

## Workflow / state transitions

Truncated unified incident lifecycle for I11 tickets (RCA / corrective action deferred):

| From | Action | To |
| --- | --- | --- |
| open | triage | triaged |
| open | cancel | cancelled |
| triaged | assign | assigned |
| triaged | cancel | cancelled |
| assigned | start | in_progress |
| assigned | triage | triaged |
| in_progress | resolve | resolved |
| in_progress | assign | assigned |
| resolved | close | closed |
| resolved | start | in_progress |
| closed / cancelled | — | terminal |

Assign may be recorded on `open` or `triaged` without forcing status until `assign` action from `triaged`. `POST assign` from `triaged` sets assignee and status `assigned`. `POST assign` from `assigned` / `in_progress` updates assignee only.

CIs have no workflow engine beyond lifecycle patch (`planned` → `active` → `maintenance` → `retired`; `retired` may return to `active`).

## API

All responses omit `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/itsm/health` | `itsm:read:ticket` |
| GET | `/v1/itsm/tickets?q=&status=&ticketType=` | `itsm:read:ticket` |
| POST | `/v1/itsm/tickets` | `itsm:write:ticket` |
| GET | `/v1/itsm/tickets/:id` | `itsm:read:ticket` |
| PATCH | `/v1/itsm/tickets/:id` | `itsm:write:ticket` |
| POST | `/v1/itsm/tickets/:id/triage` | `itsm:write:ticket` |
| POST | `/v1/itsm/tickets/:id/assign` | `itsm:assign:ticket` |
| POST | `/v1/itsm/tickets/:id/start` | `itsm:write:ticket` |
| POST | `/v1/itsm/tickets/:id/resolve` | `itsm:resolve:ticket` |
| POST | `/v1/itsm/tickets/:id/close` | `itsm:close:ticket` |
| POST | `/v1/itsm/tickets/:id/cancel` | `itsm:write:ticket` |
| POST | `/v1/itsm/tickets/:id/cis` | `itsm:write:ticket` |
| DELETE | `/v1/itsm/tickets/:id/cis/:ciId` | `itsm:write:ticket` |
| GET | `/v1/cmdb/health` | `cmdb:read:ci` |
| GET | `/v1/cmdb/cis?q=&ciClass=&lifecycle=` | `cmdb:read:ci` |
| POST | `/v1/cmdb/cis` | `cmdb:write:ci` |
| GET | `/v1/cmdb/cis/:id` | `cmdb:read:ci` |
| PATCH | `/v1/cmdb/cis/:id` | `cmdb:write:ci` |
| GET | `/v1/cmdb/relationships?ciId=` | `cmdb:read:ci` |
| POST | `/v1/cmdb/relationships` | `cmdb:write:ci` |
| DELETE | `/v1/cmdb/relationships/:id` | `cmdb:write:ci` |

Assign uses `assignedToEmail` (same-tenant principal).

## UI

- `/commercial/itsm` — Service Desk (ticket queue, create, detail, lifecycle, CI links)
- `/commercial/cmdb` — CMDB (CI catalogue, create/edit, relationships)
- Nav section **IT** with Service Desk and CMDB
- Cross-link: ticket detail → CMDB; CI detail → related tickets
- Loading, empty, error states

## Security

- Authentication required
- Domains `itsm` and `cmdb` with grammar `{domain}:{action}:{resource}`
- Tenant isolation on every query
- Missing / wrong-tenant id → 404
- Alice and partner → 403
- No `tenantId` / `principalId` in responses

## Failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Missing / wrong-tenant | 404 |
| Invalid enum / input | 400 `invalid_request` |
| Duplicate code/name | 409 |
| Illegal ticket transition | 409 `invalid_transition` |
| Self-relationship or cross-tenant CI | 400 / 404 |

## Persistence / migration

`082_i11_itsm_cmdb.sql`. Dev/Test runtime remains the in-memory store. Live PostgreSQL UNVERIFIED.

## Tests

- Health 401/403, tenant-scoped increment `I11`
- Ticket CRUD + transitions; Alice 403; partner 403; foreign 404
- CI CRUD + relationships; ticket–CI link
- Invalid input and illegal transitions
- Web typecheck
- Regression: I10 HR health/auth

## Exclusions

- Discovery (backlog Not included)
- Change/Problem/Release modules
- Crisis command / L3 declaration
- I12+ Phase 3 modules
- C11, I3.38, I4.35, I20.23, PG.30
- UAT / Production
- Autonomous AI ticket/CI creation

## Acceptance criteria

1. Carol can manage tickets and CIs through `/commercial/itsm` and `/commercial/cmdb`.
2. Alice and partner cannot read ITSM/CMDB APIs.
3. Responses never include `tenantId` or `principalId`.
4. Health reports increment `I11` with tenant-local counts.
5. CI classes and relationship types match architecture 11.2 / 11.4.

## Dependencies

I0/I1 principals (optional ticket assignee). I4 accepted (no new event transport required for I11). CMDB architecture 11.
