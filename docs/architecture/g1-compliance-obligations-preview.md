# G1 Compliance Obligations — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **G1** |
| Capability name | Compliance obligation register |
| Predecessor | I2 kernel (complete); I15 ERM complete and **not** reopened |
| Architecture status | This document is the G1 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `091_g1_compliance_obligations.sql`. ADR-0017 not reopened |
| Runtime health increment | `G1` |
| Production / UAT / AI | Not authorized |

Authority: 2026-08-24 governance **COMP=A** and [`g1-compliance-obligations-authorized.md`](../governance/g1-compliance-obligations-authorized.md). ID **G1** is assigned by that record. This is not I15 and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Compliance** workspace where an operator can maintain a tenant-scoped **obligation register** — not a control library, not a findings product, and not legal interpretation.

## Scope

| Deliverable | In scope |
| --- | --- |
| Obligation create / list / get / patch (while not closed) | Yes |
| Obligation codes `OBL-0001` unique per tenant | Yes |
| Statuses: `open` → `in_force` → `closed` (closed terminal) | Yes |
| Optional `ownerLabel` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `compliance.member` | Yes |
| Tenant-scoped `/v1/compliance/health` increment `G1` | Yes |
| Visible **Compliance → Obligations** | Yes |
| Control library / tests / findings | No |
| Regulation-mapping product | No |
| Legal-opinion automation | No |
| Privacy RoPA / DSR (PRIV=D) | No |
| Live regulatory integrations | No |

## Domain model

**compliance_obligations**

- `obligationCode` unique per tenant (`OBL-0001`)
- `title` required
- `status`: `open` \| `in_force` \| `closed`
- optional `ownerLabel` (operator text, not a principal id)
- timestamps + createdByPrincipalId (not returned)

No control, test, finding, or mapping tables.

## Persistence / migration

`091_g1_compliance_obligations.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title | open |
| open | patch title / ownerLabel | open |
| open | activate | in_force |
| in_force | patch title / ownerLabel | in_force |
| open / in_force | close | closed |
| closed | patch / activate / close | deny |

## Human-only mutation

Create, patch, activate, and close require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`.

## API

Prefix `/v1/compliance`. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/compliance/health` | `compliance:read:obligation` |
| GET | `/v1/compliance/obligations?q=&status=` | `compliance:read:obligation` |
| POST | `/v1/compliance/obligations` | `compliance:write:obligation` |
| GET | `/v1/compliance/obligations/:id` | `compliance:read:obligation` |
| PATCH | `/v1/compliance/obligations/:id` | `compliance:write:obligation` |
| POST | `/v1/compliance/obligations/:id/activate` | `compliance:write:obligation` |
| POST | `/v1/compliance/obligations/:id/close` | `compliance:write:obligation` |

## RBAC

| Permission | Intent |
| --- | --- |
| `compliance:read:obligation` | Health + list/get |
| `compliance:write:obligation` | Create / patch / activate / close |

`platform.admin` — both. Role `compliance.member` — both. Alice and partner — 403. Bob seed includes `compliance.member` so the architecture role is exercised.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/compliance`
- Nav section **Compliance → Obligations**
- Register obligation (title + optional owner), queue, detail with activate/close
- Closed / in-force / open badges; loading / empty / error states
- Copy states this is an obligation register, not a control or findings product

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Illegal transition | 409 `invalid_transition` |
| Patch when closed | 409 `closed` |

## Security

No tenant/principal ids in JSON. No file uploads. No legal AI. Human-only gates are server-enforced.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, patch, activate, close; patch after close denied; AiAgent mutate denied
- Web typecheck
- Regression I15 ERM, I16 Internal Audit, I13 SOC

## Acceptance criteria

1. Carol can register an obligation and move it open → in_force → closed from **Compliance → Obligations**.
2. Alice and partner cannot read compliance APIs.
3. Health increment is `G1`.
4. No control, test, finding, RoPA, or DSR tables are introduced.
5. I15 remains closed.

## Exclusions

- PRIV=D, I21=D, I22=D, I23=D, EMCOMMS=D, EXER=D
- UAT, Production, live regulatory feeds
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only so `/v1/compliance` exists on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. Architecture ch.24 role `compliance.member`. I15 is not a runtime dependency and is not reopened.
