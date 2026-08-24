# I16 Internal Audit — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I16** |
| Capability name | Internal Audit (engagements + workpapers) |
| Predecessor | I15 ERM complete (not a runtime dependency); I0 kernel |
| Architecture status | This document is the I16 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `088_i16_internal_audit.sql`. ADR-0017 not reopened |
| Runtime health increment | `I16` |
| Production / UAT / AI | Not authorized |

Authority: backlog I16 (Engagements, workpapers) plus explicit 2026-08-24 governance authorization for a bounded Dev/Test Internal Audit capability. Opinion, external audit integrations, regulatory filing, automated certification, autonomous conclusions, AI audit decisions, production evidence collection, and external GRC are **out of scope**.

The sections after this heading are the architecture contract.

---

## Objective

Deliver an **Audit** workspace where an internal auditor can open a tenant-scoped engagement, attach workpapers, and close the engagement after another principal finalizes those workpapers — not an external audit platform and not an opinion engine.

## Scope

| Deliverable | In scope |
| --- | --- |
| Engagement create / list / get / patch | Yes |
| Engagement statuses: `planned` → `in_progress` → `closed` | Yes |
| Workpaper create / list / get / patch (draft only) | Yes |
| Workpaper statuses: `draft` → `finalized` | Yes |
| Workpaper belongs to one same-tenant engagement | Yes |
| Object-level SoD: creator cannot finalize own workpaper | Yes |
| Close blocked while any child workpaper is still `draft` | Yes |
| Role `audit.member` | Yes |
| Tenant-scoped `/v1/audit-ia/health` increment `I16` | Yes |
| Visible **Audit → Engagements** | Yes |
| Opinion aggregate | No |
| File/object-storage evidence | No |
| External auditor portal / GRC connector | No |
| AI-generated conclusions | No |

## Domain model

**ia_engagements**

- `engagementCode` unique per tenant (`ENG-0001`)
- `title` required
- optional `objective` (max 2000)
- optional `ownerLabel` (display text only; not a principal id)
- `status`: `planned` \| `in_progress` \| `closed`
- timestamps + createdByPrincipalId (not returned)

**ia_workpapers**

- `workpaperCode` unique per tenant (`WP-0001`)
- `engagementId` required, same tenant
- `title` required
- optional `body` (max 20000) — notes only, not production evidence
- `status`: `draft` \| `finalized`
- timestamps + createdByPrincipalId (used for SoD; not returned)

Closed engagements are terminal. Finalized workpapers are terminal. No Opinion table.

## Persistence / migration

`088_i16_internal_audit.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

### Engagement

| From | Action | To |
| --- | --- | --- |
| (none) | create | planned |
| planned | start | in_progress |
| planned / in_progress | close | closed — only if no child workpaper is `draft` |
| closed | — | terminal |

Patch of title/objective/owner is allowed except when closed. Workpapers may be added while planned or in_progress, not when closed.

### Workpaper

| From | Action | To |
| --- | --- | --- |
| (none) | create on open engagement | draft |
| draft | patch title/body | draft |
| draft | finalize by a **different** principal | finalized |
| draft | finalize by creator | deny SoD |
| finalized | patch / finalize | forbidden |

## Separation of duties

Same-object SoD: the principal who created a workpaper cannot finalize it (`403`, reason `sod`). This follows the existing kernel SoD pattern (creator ≠ approver on the same object).

Dev/Test seed: Bob holds `audit.member` in addition to finance/HR approver so a second auditor can finalize (same pattern as I10 leave approval). Carol (`platform.admin`) can create; she cannot finalize her own workpapers.

## API

Prefix `/v1/audit-ia` so this module does not collide with kernel `/v1/audit-events`. JSON omits `tenantId` and `principalId`. Workpaper JSON may include `engagementId` and `engagementCode` (resource identifiers, not actor ids).

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/audit-ia/health` | `auditia:read:engagement` |
| GET | `/v1/audit-ia/engagements?q=&status=` | `auditia:read:engagement` |
| POST | `/v1/audit-ia/engagements` | `auditia:write:engagement` |
| GET | `/v1/audit-ia/engagements/:id` | `auditia:read:engagement` |
| PATCH | `/v1/audit-ia/engagements/:id` | `auditia:write:engagement` |
| POST | `/v1/audit-ia/engagements/:id/start` | `auditia:write:engagement` |
| POST | `/v1/audit-ia/engagements/:id/close` | `auditia:write:engagement` |
| GET | `/v1/audit-ia/engagements/:id/workpapers` | `auditia:read:workpaper` |
| POST | `/v1/audit-ia/engagements/:id/workpapers` | `auditia:write:workpaper` |
| GET | `/v1/audit-ia/workpapers/:id` | `auditia:read:workpaper` |
| PATCH | `/v1/audit-ia/workpapers/:id` | `auditia:write:workpaper` |
| POST | `/v1/audit-ia/workpapers/:id/finalize` | `auditia:write:workpaper` |

## RBAC

| Permission | Intent |
| --- | --- |
| `auditia:read:engagement` | Health + list/get engagements |
| `auditia:write:engagement` | Create / patch / start / close |
| `auditia:read:workpaper` | List/get workpapers |
| `auditia:write:workpaper` | Create / patch / finalize (SoD still applies) |

`platform.admin` — all. Role `audit.member` — all four. Alice and partner — 403. Bob seed includes `audit.member` for SoD completion.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404. A workpaper cannot reference a cross-tenant engagement.

## UI

- `/commercial/audit-ia`
- Nav section **Audit → Engagements**
- Create engagement, queue, detail with start/close
- Add workpaper on an open engagement; finalize (SoD error if self)
- Loading / empty / error states

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Finalize own workpaper | 403 `sod` |
| Empty title / invalid status | 400 |
| Illegal transition / patch closed or finalized | 409 |
| Close while draft workpapers remain | 409 `open_workpapers` |
| Add workpaper to closed engagement | 409 `closed` |

## Security

No tenant/principal ids in JSON. No file uploads. No autonomous conclusions. SoD is server-enforced.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, start, add workpaper, self-finalize denied, Bob finalizes, close
- Close blocked while draft workpapers exist
- Web typecheck
- Regression I19

## Acceptance criteria

1. Carol can create an engagement, start it, and add a workpaper from **Audit → Engagements**.
2. Carol cannot finalize her own workpaper; Bob can.
3. Engagement cannot close while a draft workpaper remains; it can close after all workpapers are finalized (or if none exist).
4. Alice and partner cannot read Internal Audit APIs.
5. Health increment is `I16`.
6. No Opinion table, no evidence object store, no GRC connector.

## Exclusions

- I15 remaining compliance/privacy, I17 backup, I18 crisis, I22 partner edge
- Opinion / certification / regulatory filing
- Numeric placeholder IDs, UAT, Production

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only as Dev/Test verification so `/v1/audit-ia` (and prior I14/I15/I19) routes exist on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0/I2 kernel patterns. I15 is a backlog predecessor, not a runtime dependency.
