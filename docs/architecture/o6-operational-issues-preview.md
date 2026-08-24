# O6 Operational Issues Register — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **O6** |
| Capability name | Operational Issues Register |
| Predecessor | I2 kernel (complete); O5 Operations Workbench complete and **not** reopened; C9/C10 complete and **not** reopened; I15 ERM complete and **not** reopened; G1–G5 complete and **not** reopened |
| Architecture status | This document is the O6 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `097_o6_operational_issues.sql`. ADR-0017 not reopened |
| Runtime health increment | `O6` |
| Production / UAT / AI | Not authorized |
| **IMPLEMENTATION_AUTHORIZED** | **YES** |

Authority: 2026-08-24 governance **CANDIDATE=OPERATIONAL_ISSUES / DECISION=APPROVE / CAPABILITY_ID=O6** and [`o6-operational-issues-authorized.md`](../governance/o6-operational-issues-authorized.md). ID **O6** is assigned by that record. This is not G6, not I15, and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver an **Operations** workspace surface where an operator can maintain a tenant-scoped **operational issue register** against an existing same-tenant booking — not an autonomous issue-management system, not documents or comms, and not a redesign of the O5 workbench. O5 already flags attention; O6 records a human issue.

## Scope

| Deliverable | In scope |
| --- | --- |
| Issue create / list / get / patch (while not closed) | Yes |
| Issue codes `ISS-0001` unique per tenant | Yes |
| Statuses: `open` → `in_progress` → `closed` (closed terminal; close also from `open`) | Yes |
| Required `title`; optional `description` and `ownerLabel` | Yes |
| Required `bookingId` — same-tenant C9 booking | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `ops.issue` | Yes |
| Tenant-scoped `/v1/ops/issues/health` increment `O6` | Yes |
| Visible **Operations → Issues** at `/commercial/operations/issues` | Yes |
| Optional navigation link from O5 workbench into Issues | Yes — link only |
| O5 workbench redesign | No |
| Automatic issue creation from O5 signals or I9 sync conflicts | No |
| Documents / file / object storage / comms providers | No |
| Assignment boards / SLA / escalation | No |
| GRC / SAMPLE / G1–G5 / I15 | No |

## Domain model

**operational_issues** (runtime store key `operationalIssues` — not GRC keys, not SAMPLE keys, not O5 computed workbench state)

- `issueCode` unique per tenant (`ISS-0001`)
- `title` required (max 200)
- optional `description` (max 2000)
- `status`: `open` \| `in_progress` \| `closed`
- optional `ownerLabel` (operator text, not a principal id)
- `bookingId` required (C9 booking id in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `bookingCode` resolved from C9 at response time. Booking, handover %, O5 attention calculations, and C10 snapshots are not patched.

## Issue-to-booking relationship

`bookingId` must identify an existing booking in the actor's tenant. Missing or other-tenant ids → `400` `booking_not_found`. The reference is a scalar field only. Creating, starting, or closing an issue does not change C9 booking status, O5 handover/attention, or C10 command-center behaviour.

## Persistence / migration

`097_o6_operational_issues.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title and bookingId | open |
| open | patch title / description / ownerLabel / bookingId | open |
| open | start | in_progress |
| in_progress | patch title / description / ownerLabel / bookingId | in_progress |
| open / in_progress | close | closed |
| in_progress | start | deny |
| closed | patch / start / close | deny |

## Human-only mutation

Create, patch, start, and close require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. No autonomous issue creation or remediation.

## API

Prefix `/v1/ops/issues`. O5 `/v1/ops/workbench` and `/v1/ops/health` (increment `O5`) are not modified. C9 `/v1/bookings` is not modified. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/ops/issues/health` | `ops:read:issue` |
| GET | `/v1/ops/issues?q=&status=&bookingId=` | `ops:read:issue` |
| POST | `/v1/ops/issues` | `ops:write:issue` |
| GET | `/v1/ops/issues/:id` | `ops:read:issue` |
| PATCH | `/v1/ops/issues/:id` | `ops:write:issue` |
| POST | `/v1/ops/issues/:id/start` | `ops:write:issue` |
| POST | `/v1/ops/issues/:id/close` | `ops:write:issue` |

Health increment is `O6` (distinct from O5 ops health).

## RBAC

| Permission | Intent |
| --- | --- |
| `ops:read:issue` | Health + list/get |
| `ops:write:issue` | Create / patch / start / close |

`platform.admin` — both. Role `ops.issue` — both. Alice and partner — 403. Bob seed includes `ops.issue` so the architecture role is exercised. Existing `ops:read:operations` is not broadened to issue write. GRC roles (`grc.control`, `grc.finding`, `grc.mapping`, `grc.campaign`, `compliance.member`) are not given issue permissions. G1–G5 permissions are unchanged.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant issue id → 404. Booking isolation unchanged.

## UI

- `/commercial/operations/issues`
- Nav **Operations → Issues** (Workbench, Event Infrastructure, Field App, Sync Conflicts unchanged)
- Register issue (title + required booking picker + optional description/owner)
- Queue, detail with start (from open) and close (from open or in_progress)
- Open / in progress / closed badges; loading / empty / error / authorization-failure states
- Copy states this is an issue register, not an autonomous ops engine
- O5 workbench may add a link to Issues; it is not redesigned

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Missing / unknown / other-tenant `bookingId` | 400 `booking_not_found` |
| Illegal transition | 409 `invalid_transition` |
| Patch when closed | 409 `closed` |

## Security

No tenant/principal ids in JSON. No file uploads. Human-only gates are server-enforced. No AI operational decisions.

## Testing (when implementation is authorized)

- 401/403 Alice/partner, tenant isolation
- Create, patch, start, close from open, close from in_progress; patch after close denied; AiAgent mutate denied
- Invalid booking reference denied; valid booking reference does not mutate C9/O5/C10
- Web typecheck
- Regression O5, C9, C10, I9, I8.4; confirmation G1, P1, G2, G3, G4, G5, I15, I16, I13 unchanged

## Acceptance criteria (when implementation is authorized)

1. Carol can register an issue against a seed booking and move it open → in_progress → closed (and close from open) from **Operations → Issues**.
2. Alice and partner cannot read issue APIs.
3. Health increment is `O6`.
4. Referenced booking status, O5 handover/attention, and C10 behaviour are unchanged.
5. Store key is `operationalIssues`. No GRC/SAMPLE keys.
6. O1–O5, C9, C10, I15, G1–G5 remain closed. SAMPLE remains deferred.

## Exclusions

- Automatic issue creation; O5 signal automation; sync-conflict automation
- Autonomous remediation; AI operational decisions
- Assignment boards; SLA/escalation engine
- Documents; file/object storage; communications providers; SMS/email/Teams/WhatsApp
- Supplier-performance scoring; GRC integration; G1–G5 mutation; I15 reopen; SAMPLE
- UAT, Production, live PostgreSQL, external vendor selection
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 / G6

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized.

## Rollback

If implemented later: additive migration; disable by not registering routes.

## Dependencies

I0 kernel patterns. C9 booking identifiers referenced read-only. O5 workbench is not a runtime dependency beyond optional UI linking. I15 is not a runtime dependency. G1–G5 implementations are not modified.
