# G5 Regulation-to-Control Mapping Register — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **G5** |
| Capability name | Regulation-to-control mapping register |
| Predecessor | I2 kernel (complete); I15 ERM complete and **not** reopened; G1, P1, G2, G3, and G4 complete and **not** reopened |
| Architecture status | This document is the G5 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `096_g5_regulation_control_mapping.sql`. ADR-0017 not reopened |
| Runtime health increment | `G5` |
| Production / UAT / AI | Not authorized |

Authority: 2026-08-24 governance **MAP=A** and [`g5-regulation-control-mapping-authorized.md`](../governance/g5-regulation-control-mapping-authorized.md). ID **G5** is assigned by that record. This is not I15 and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Compliance** workspace surface where an operator can maintain a tenant-scoped **regulation-to-control mapping register** — not a sampled-test execution engine, not a live regulatory feed, and not legal interpretation. Existing G1 obligations and G2 controls may be referenced by identifier only.

## Scope

| Deliverable | In scope |
| --- | --- |
| Mapping create / list / get / patch (while not retired) | Yes |
| Mapping codes `MAP-0001` unique per tenant | Yes |
| Statuses: `draft` → `active` → `retired` (retired terminal) | Yes |
| Required `title`; optional `description` and `ownerLabel` | Yes |
| Optional `obligationId` — simple same-tenant G1 reference | Yes |
| Optional `controlId` — simple same-tenant G2 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `grc.mapping` | Yes |
| Tenant-scoped `/v1/mappings/health` increment `G5` | Yes |
| Visible **Compliance → Mappings** at `/commercial/mappings` | Yes |
| Sampled test execution / evidence collection | No |
| Live regulatory feeds | No |
| Many-to-many GRC framework product | No |
| G1 / G2 / G3 / G4 / P1 mutations | No |
| Legal-opinion automation | No |

## Domain model

**regulation_control_mappings** (runtime store key `mappingRecords` — not `grcMappings`, so G3/G4 deferred-aggregate assertions remain true)

- `mappingCode` unique per tenant (`MAP-0001`)
- `title` required (max 200)
- optional `description` (max 2000)
- `status`: `draft` \| `active` \| `retired`
- optional `ownerLabel` (operator text, not a principal id)
- optional `obligationId` (G1 `compliance_obligations.id` in the same tenant)
- optional `controlId` (G2 `grc_controls.id` in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include read-only `obligationCode` and `controlCode` resolved at response time. G1 and G2 rows are not patched. G3 findings and G4 campaigns are not referenced or mutated.

No sampled-test or live-feed tables.

## Mapping relationships

If `obligationId` is supplied, it must identify an existing G1 obligation in the actor's tenant. Missing or other-tenant ids → `400` `obligation_not_found`.

If `controlId` is supplied, it must identify an existing G2 control in the actor's tenant. Missing or other-tenant ids → `400` `control_not_found`.

Each reference is a scalar field only. Creating, activating, or retiring a mapping does not change G1, G2, G3, or G4 status.

## Persistence / migration

`096_g5_regulation_control_mapping.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title | draft |
| draft | patch title / description / ownerLabel / obligationId / controlId | draft |
| draft | activate | active |
| active | patch title / description / ownerLabel / obligationId / controlId | active |
| active | retire | retired |
| active | activate | deny |
| draft | retire | deny |
| retired | patch / activate / retire | deny |

## Human-only mutation

Create, patch, activate, and retire require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`.

## API

Prefix `/v1/mappings`. G1 `/v1/compliance`, G2 `/v1/grc`, G3 `/v1/findings`, and G4 `/v1/control-tests` are not modified. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/mappings/health` | `grc:read:mapping` |
| GET | `/v1/mappings?q=&status=` | `grc:read:mapping` |
| POST | `/v1/mappings` | `grc:write:mapping` |
| GET | `/v1/mappings/:id` | `grc:read:mapping` |
| PATCH | `/v1/mappings/:id` | `grc:write:mapping` |
| POST | `/v1/mappings/:id/activate` | `grc:write:mapping` |
| POST | `/v1/mappings/:id/retire` | `grc:write:mapping` |

## RBAC

| Permission | Intent |
| --- | --- |
| `grc:read:mapping` | Health + list/get |
| `grc:write:mapping` | Create / patch / activate / retire |

`platform.admin` — both. Role `grc.mapping` — both. Alice and partner — 403. Bob seed includes `grc.mapping` so the architecture role is exercised. `grc.campaign`, `grc.finding`, `grc.control`, and `compliance.member` are not given mapping permissions (G1–G4 contracts unchanged).

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/mappings`
- Nav section **Compliance → Mappings** (alongside G1 Obligations, G2 Controls, G3 Findings, and G4 Control tests; those routes unchanged)
- Register mapping (title + optional description, owner, G1 obligation picker, G2 control picker)
- Queue, detail with activate (from draft) and retire (from active)
- Draft / active / retired badges; loading / empty / error states
- Copy states this is a mapping register, not a test engine or legal interpretation

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Unknown / other-tenant `obligationId` | 400 `obligation_not_found` |
| Unknown / other-tenant `controlId` | 400 `control_not_found` |
| Illegal transition | 409 `invalid_transition` |
| Patch when retired | 409 `retired` |

## Security

No tenant/principal ids in JSON. No file uploads. No legal AI. Human-only gates are server-enforced.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, patch, activate, retire; patch after retire denied; AiAgent mutate denied
- Invalid obligation or control reference denied; valid G1/G2 references do not mutate those rows or G3/G4
- Web typecheck
- Regression G1 Compliance, G2 Controls, G3 Findings, G4 Campaigns, P1 Privacy, I15 ERM, I16 Internal Audit, I13 SOC

## Acceptance criteria

1. Carol can register a mapping and move it draft → active → retired from **Compliance → Mappings**.
2. Alice and partner cannot read mapping APIs.
3. Health increment is `G5`.
4. Optional G1 `obligationId` and G2 `controlId` are same-tenant references only; G1–G4 rows are unchanged.
5. Store key is `mappingRecords` (not `grcMappings`). No sampled-test tables.
6. I15, G1, P1, G2, G3, and G4 remain closed.

## Exclusions

- I21=D, I22=D, I23=D, EMCOMMS=D, EXER=D, CAL=D, PO=D
- UAT, Production, live regulatory feeds
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only so `/v1/mappings` exists on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. G1 obligation identifiers and G2 control identifiers may be referenced read-only. I15 is not a runtime dependency and is not reopened. G1, P1, G2, G3, and G4 implementations are not modified.
