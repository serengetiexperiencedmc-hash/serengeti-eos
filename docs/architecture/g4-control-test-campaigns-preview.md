# G4 Control-Test Campaign Register — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **G4** |
| Capability name | Control-test campaign register |
| Predecessor | I2 kernel (complete); I15 ERM complete and **not** reopened; G1, P1, G2, and G3 complete and **not** reopened |
| Architecture status | This document is the G4 contract |
| Implementation status | **NOT STARTED** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `095_g4_control_test_campaigns.sql`. ADR-0017 not reopened |
| Runtime health increment | `G4` |
| Production / UAT / AI | Not authorized |

Authority: 2026-08-24 governance **TEST=A** and [`g4-control-test-campaigns-authorized.md`](../governance/g4-control-test-campaigns-authorized.md). ID **G4** is assigned by that record. This is not I15 and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Compliance** workspace surface where an operator can maintain a tenant-scoped **control-test campaign register** — not a mapping product, not a sampled-test execution engine, and not legal interpretation. Existing G2 controls may be referenced by identifier only.

## Scope

| Deliverable | In scope |
| --- | --- |
| Campaign create / list / get / patch (while not closed) | Yes |
| Campaign codes `CTC-0001` unique per tenant | Yes |
| Statuses: `planned` → `in_progress` → `closed` (closed terminal; close also from `planned`) | Yes |
| Required `title`; optional `description` and `ownerLabel` | Yes |
| Optional `controlId` — simple same-tenant G2 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `grc.campaign` | Yes |
| Tenant-scoped `/v1/control-tests/health` increment `G4` | Yes |
| Visible **Compliance → Control tests** at `/commercial/control-tests` | Yes |
| Regulation-to-control mapping engine | No |
| Sampled test execution / evidence collection | No |
| Many-to-many GRC framework | No |
| G1 / G2 / G3 / P1 mutations | No |
| Legal-opinion automation | No |
| Live regulatory integrations | No |

## Domain model

**control_test_campaigns** (runtime store key `controlTestCampaigns` — not `grcTests` / `grcMappings`, so G3 deferred-aggregate assertions remain true)

- `campaignCode` unique per tenant (`CTC-0001`)
- `title` required (max 200)
- optional `description` (max 2000)
- `status`: `planned` \| `in_progress` \| `closed`
- optional `ownerLabel` (operator text, not a principal id)
- optional `controlId` (G2 `grc_controls.id` in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `controlCode` resolved from G2 at response time. G2 rows are not patched. G3 findings are not referenced or mutated.

No mapping or many-to-many join tables.

## Campaign-to-control relationship

If `controlId` is supplied, it must identify an existing G2 control in the actor's tenant. Missing or other-tenant ids → `400` `control_not_found`. The reference is a scalar field only. Creating or closing a campaign does not change G2 or G3 status.

## Persistence / migration

`095_g4_control_test_campaigns.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title | planned |
| planned | patch title / description / ownerLabel / controlId | planned |
| planned | start | in_progress |
| in_progress | patch title / description / ownerLabel / controlId | in_progress |
| planned / in_progress | close | closed |
| in_progress | start | deny |
| closed | patch / start / close | deny |

## Human-only mutation

Create, patch, start, and close require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`.

## API

Prefix `/v1/control-tests`. G2 `/v1/grc` and G3 `/v1/findings` are not modified. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/control-tests/health` | `grc:read:campaign` |
| GET | `/v1/control-tests?q=&status=` | `grc:read:campaign` |
| POST | `/v1/control-tests` | `grc:write:campaign` |
| GET | `/v1/control-tests/:id` | `grc:read:campaign` |
| PATCH | `/v1/control-tests/:id` | `grc:write:campaign` |
| POST | `/v1/control-tests/:id/start` | `grc:write:campaign` |
| POST | `/v1/control-tests/:id/close` | `grc:write:campaign` |

## RBAC

| Permission | Intent |
| --- | --- |
| `grc:read:campaign` | Health + list/get |
| `grc:write:campaign` | Create / patch / start / close |

`platform.admin` — both. Role `grc.campaign` — both. Alice and partner — 403. Bob seed includes `grc.campaign` so the architecture role is exercised. `grc.finding`, `grc.control`, and `compliance.member` are not given campaign permissions (G1/G2/G3 contracts unchanged).

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/control-tests`
- Nav section **Compliance → Control tests** (alongside G1 Obligations, G2 Controls, and G3 Findings; those routes unchanged)
- Register campaign (title + optional description, owner, G2 control picker)
- Queue, detail with start (from planned) and close (while not closed)
- Planned / in progress / closed badges; loading / empty / error states
- Copy states this is a control-test campaign register, not a mapping engine or legal interpretation

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Unknown / other-tenant `controlId` | 400 `control_not_found` |
| Illegal transition | 409 `invalid_transition` |
| Patch when closed | 409 `closed` |

## Security

No tenant/principal ids in JSON. No file uploads. No legal AI. Human-only gates are server-enforced.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, patch, start, close; patch after close denied; AiAgent mutate denied
- Invalid control reference denied; valid G2 reference does not mutate the control or G3 findings
- Web typecheck
- Regression G1 Compliance, G2 Controls, G3 Findings, P1 Privacy, I15 ERM, I16 Internal Audit, I13 SOC

## Acceptance criteria

1. Carol can register a campaign and move it planned → in_progress → closed from **Compliance → Control tests**.
2. Alice and partner cannot read control-test APIs.
3. Health increment is `G4`.
4. Optional G2 `controlId` is a same-tenant reference only; G2 and G3 rows are unchanged.
5. Store key is `controlTestCampaigns` (not `grcTests` / `grcMappings`). No mapping tables.
6. I15, G1, P1, G2, and G3 remain closed.

## Exclusions

- I21=D, I22=D, I23=D, EMCOMMS=D, EXER=D, CAL=D, PO=D
- UAT, Production, live regulatory feeds
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only so `/v1/control-tests` exists on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. G2 control identifiers may be referenced read-only. I15 is not a runtime dependency and is not reopened. G1, P1, G2, and G3 implementations are not modified.
