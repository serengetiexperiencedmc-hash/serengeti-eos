# G2 GRC Control Catalogue — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **G2** |
| Capability name | GRC Control Catalogue |
| Predecessor | I2 kernel (complete); I15 ERM complete and **not** reopened; G1 complete and **not** reopened; P1 complete and **not** reopened |
| Architecture status | This document is the G2 contract |
| Implementation status | **PREVIEW / NOT IMPLEMENTED** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `093_g2_grc_control_catalogue.sql`. ADR-0017 not reopened |
| Runtime health increment | `G2` |
| Production / UAT / AI | Not authorized |

Authority: 2026-08-24 governance **GRC=A** and [`g2-grc-control-catalogue-authorized.md`](../governance/g2-grc-control-catalogue-authorized.md). ID **G2** is assigned by that record. This is not I15 and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Compliance** workspace surface where an operator can maintain a tenant-scoped **internal control catalogue** — not a findings product, not a test-campaign engine, and not legal interpretation. Existing G1 obligations may be referenced by identifier only.

## Scope

| Deliverable | In scope |
| --- | --- |
| Control create / list / get / patch (while not retired) | Yes |
| Control codes `CTL-0001` unique per tenant | Yes |
| Statuses: `draft` → `active` → `retired` (retired terminal) | Yes |
| Required `title`; optional `description` and `ownerLabel` | Yes |
| Optional `obligationId` — simple same-tenant G1 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `grc.control` | Yes |
| Tenant-scoped `/v1/grc/health` increment `G2` | Yes |
| Visible **Compliance → Controls** at `/commercial/controls` | Yes |
| Findings / test campaigns / risk scoring | No |
| Regulation-to-control mapping engine | No |
| Many-to-many compliance framework | No |
| G1 obligation mutations | No |
| P1 Privacy mutations | No |
| Legal-opinion automation | No |
| Live regulatory integrations | No |

## Domain model

**grc_controls** (runtime store key `grcControls` — not `complianceControls`, so G1's deferred-aggregate assertions remain true)

- `controlCode` unique per tenant (`CTL-0001`)
- `title` required (max 200)
- optional `description` (max 2000)
- `status`: `draft` \| `active` \| `retired`
- optional `ownerLabel` (operator text, not a principal id)
- optional `obligationId` (G1 `compliance_obligations.id` in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `obligationCode` resolved from G1 at response time. G1 rows are not patched.

No findings, test, mapping, or many-to-many join tables.

## Control-to-obligation relationship

If `obligationId` is supplied, it must identify an existing G1 obligation in the actor's tenant. Missing or other-tenant ids → `400` `obligation_not_found`. The reference is a scalar FK-style field only. Creating or retiring a control does not change G1 status.

## Persistence / migration

`093_g2_grc_control_catalogue.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title | draft |
| draft | patch title / description / ownerLabel / obligationId | draft |
| draft | activate | active |
| active | patch title / description / ownerLabel / obligationId | active |
| active | retire | retired |
| draft | retire | deny |
| retired | patch / activate / retire | deny |

## Human-only mutation

Create, patch, activate, and retire require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`.

## API

Prefix `/v1/grc`. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/grc/health` | `grc:read:control` |
| GET | `/v1/grc/controls?q=&status=` | `grc:read:control` |
| POST | `/v1/grc/controls` | `grc:write:control` |
| GET | `/v1/grc/controls/:id` | `grc:read:control` |
| PATCH | `/v1/grc/controls/:id` | `grc:write:control` |
| POST | `/v1/grc/controls/:id/activate` | `grc:write:control` |
| POST | `/v1/grc/controls/:id/retire` | `grc:write:control` |

## RBAC

| Permission | Intent |
| --- | --- |
| `grc:read:control` | Health + list/get |
| `grc:write:control` | Create / patch / activate / retire |

`platform.admin` — both. Role `grc.control` — both. Alice and partner — 403. Bob seed includes `grc.control` so the architecture role is exercised. `compliance.member` is not given GRC permissions (G1 contract unchanged).

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/controls`
- Nav section **Compliance → Controls** (alongside G1 Obligations; G1 route unchanged)
- Register control (title + optional description, owner, G1 obligation picker)
- Queue, detail with activate (from draft) and retire (from active)
- Draft / active / retired badges; loading / empty / error states
- Copy states this is a control catalogue, not findings, tests, or legal interpretation

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Unknown / other-tenant `obligationId` | 400 `obligation_not_found` |
| Illegal transition | 409 `invalid_transition` |
| Patch when retired | 409 `retired` |

## Security

No tenant/principal ids in JSON. No file uploads. No legal AI. Human-only gates are server-enforced.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, patch, activate, retire; patch after retire denied; AiAgent mutate denied
- Invalid obligation reference denied; valid G1 reference does not mutate the obligation
- Web typecheck
- Regression G1 Compliance, P1 Privacy, I15 ERM, I16 Internal Audit, I13 SOC

## Acceptance criteria

1. Carol can register a control and move it draft → active → retired from **Compliance → Controls**.
2. Alice and partner cannot read GRC APIs.
3. Health increment is `G2`.
4. Optional G1 `obligationId` is a same-tenant reference only; G1 rows are unchanged.
5. Store key is `grcControls` (not `complianceControls`). No findings tables.
6. I15, G1, and P1 remain closed.

## Exclusions

- I21=D, I22=D, I23=D, EMCOMMS=D, EXER=D, CAL=D, PO=D
- UAT, Production, live regulatory feeds
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only so `/v1/grc` exists on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. G1 obligation identifiers may be referenced read-only. I15 is not a runtime dependency and is not reopened. G1 and P1 implementations are not modified.
