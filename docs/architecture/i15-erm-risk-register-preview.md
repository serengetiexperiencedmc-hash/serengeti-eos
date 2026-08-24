# I15 ERM Risk Register — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I15** |
| Capability name | ERM risk register |
| Predecessor | I2 workflow kernel (complete); I14 PAM complete and not a runtime dependency |
| Architecture status | This document is the I15 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `086_i15_erm.sql`. ADR-0017 not reopened |
| Runtime health increment | `I15` |
| Production / UAT / AI | Not authorized |

Authority: backlog I15 (Registers, RoPA, DSR; not legal-opinion automation) plus explicit 2026-08-24 governance **I15 = A**: first aggregate is the ERM risk register; owner role `risk.member`; Compliance obligations and Privacy RoPA/DSR are **deferred** and must not be implemented here.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Risk** workspace where an internal user can maintain a tenant-scoped residual-risk register with likelihood/impact and a simple treatment status — not a GRC suite.

## Scope

| Deliverable | In scope |
| --- | --- |
| Risk register create / list / get / patch | Yes |
| Status: open → mitigating / accepted / closed | Yes |
| Tenant-scoped `/v1/erm/health` increment `I15` | Yes |
| Visible **Risk → Register** | Yes |
| Role `risk.member` | Yes |
| Compliance obligations | No (deferred) |
| Privacy RoPA / DSR | No (deferred) |
| KRI catalogue / treatment projects as separate aggregates | No |
| Legal opinion automation | No |

## Domain model

**erm_risks**

- `riskCode` unique per tenant (`RSK-0001`)
- `title` required
- optional `summary` (max 2000)
- `likelihood` 1–5, `impact` 1–5
- `status`: `open` \| `mitigating` \| `accepted` \| `closed`
- optional `ownerLabel` (display text only; not a principal id)
- timestamps + createdByPrincipalId (not returned)

Closed is terminal. No second incident model (I11 remains ITSM).

## Persistence / migration

`086_i15_erm.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create | open |
| open | mitigate | mitigating |
| open / mitigating | accept | accepted |
| open / mitigating / accepted | close | closed |
| closed | — | terminal |

Patch of title/summary/scores/owner is allowed except when closed.

## API

JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/erm/health` | `erm:read:risk` |
| GET | `/v1/erm/risks?q=&status=` | `erm:read:risk` |
| POST | `/v1/erm/risks` | `erm:write:risk` |
| GET | `/v1/erm/risks/:id` | `erm:read:risk` |
| PATCH | `/v1/erm/risks/:id` | `erm:write:risk` |
| POST | `/v1/erm/risks/:id/mitigate` | `erm:write:risk` |
| POST | `/v1/erm/risks/:id/accept` | `erm:write:risk` |
| POST | `/v1/erm/risks/:id/close` | `erm:write:risk` |

## RBAC

| Permission | Intent |
| --- | --- |
| `erm:read:risk` | Health + list/get |
| `erm:write:risk` | Create / patch / transitions |

`platform.admin` — all. Role `risk.member` — read + write. Alice and partner — 403.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/erm`
- Nav section **Risk → Register**
- Create form, queue, detail, mitigate/accept/close
- Loading / empty / error states

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Empty title / scores outside 1–5 | 400 |
| Illegal transition / patch closed | 409 |

## Security

No tenant/principal ids in JSON. No legal/privacy records.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, patch, mitigate/accept/close
- Web typecheck
- Regression I14

## Acceptance criteria

1. Carol can create a risk and close it from **Risk → Register**.
2. Alice and partner cannot read ERM APIs.
3. Health increment is `I15`.
4. No RoPA, DSR, or compliance obligation tables.

## Exclusions

- I16 internal audit, I17 backup, I19 knowledge
- Numeric placeholder IDs, UAT, Production

## Verification limitations

Live PostgreSQL UNVERIFIED. Live preview API UNVERIFIED if the existing process predates I15 (not restarted as a workflow step).

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I2 (kernel patterns). I14 is not a runtime dependency.
