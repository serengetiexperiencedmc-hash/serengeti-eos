# G3 Findings Register — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **G3** |
| Capability name | Findings register |
| Predecessor | I2 kernel (complete); I15 ERM complete and **not** reopened; G1, P1, and G2 complete and **not** reopened |
| Architecture status | This document is the G3 contract |
| Implementation status | **PREVIEW / NOT IMPLEMENTED** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `094_g3_findings_register.sql`. ADR-0017 not reopened |
| Runtime health increment | `G3` |
| Production / UAT / AI | Not authorized |

Authority: 2026-08-24 governance **FIND=A** and [`g3-findings-register-authorized.md`](../governance/g3-findings-register-authorized.md). ID **G3** is assigned by that record. This is not I15 and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Compliance** workspace surface where an operator can maintain a tenant-scoped **findings register** — not a control-test campaign engine, not a mapping product, and not legal interpretation. Existing G2 controls may be referenced by identifier only.

## Scope

| Deliverable | In scope |
| --- | --- |
| Finding create / list / get / patch (while not closed) | Yes |
| Finding codes `FND-0001` unique per tenant | Yes |
| Statuses: `open` → `in_progress` → `closed` (closed terminal; close also from `open`) | Yes |
| Required `title`; optional `description` and `ownerLabel` | Yes |
| Optional `controlId` — simple same-tenant G2 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `grc.finding` | Yes |
| Tenant-scoped `/v1/findings/health` increment `G3` | Yes |
| Visible **Compliance → Findings** at `/commercial/findings` | Yes |
| Control-test campaigns | No |
| Regulation-to-control mapping engine | No |
| Many-to-many GRC framework | No |
| G1 / G2 / P1 mutations | No |
| Legal-opinion automation | No |
| Live regulatory integrations | No |

## Domain model

**finding_records** (runtime store key `findingRecords` — not `grcFindings` / `complianceFindings`, so G1 and G2 deferred-aggregate assertions remain true)

- `findingCode` unique per tenant (`FND-0001`)
- `title` required (max 200)
- optional `description` (max 2000)
- `status`: `open` \| `in_progress` \| `closed`
- optional `ownerLabel` (operator text, not a principal id)
- optional `controlId` (G2 `grc_controls.id` in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `controlCode` resolved from G2 at response time. G2 rows are not patched.

No test-campaign, mapping, or many-to-many join tables.

## Finding-to-control relationship

If `controlId` is supplied, it must identify an existing G2 control in the actor's tenant. Missing or other-tenant ids → `400` `control_not_found`. The reference is a scalar field only. Creating or closing a finding does not change G2 status.

## Persistence / migration

`094_g3_findings_register.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title | open |
| open | patch title / description / ownerLabel / controlId | open |
| open | start | in_progress |
| in_progress | patch title / description / ownerLabel / controlId | in_progress |
| open / in_progress | close | closed |
| in_progress | start | deny |
| closed | patch / start / close | deny |

## Human-only mutation

Create, patch, start, and close require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`.

## API

Prefix `/v1/findings`. G2 `/v1/grc` is not modified. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/findings/health` | `grc:read:finding` |
| GET | `/v1/findings?q=&status=` | `grc:read:finding` |
| POST | `/v1/findings` | `grc:write:finding` |
| GET | `/v1/findings/:id` | `grc:read:finding` |
| PATCH | `/v1/findings/:id` | `grc:write:finding` |
| POST | `/v1/findings/:id/start` | `grc:write:finding` |
| POST | `/v1/findings/:id/close` | `grc:write:finding` |

## RBAC

| Permission | Intent |
| --- | --- |
| `grc:read:finding` | Health + list/get |
| `grc:write:finding` | Create / patch / start / close |

`platform.admin` — both. Role `grc.finding` — both. Alice and partner — 403. Bob seed includes `grc.finding` so the architecture role is exercised. `grc.control` and `compliance.member` are not given finding permissions (G1/G2 contracts unchanged).

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/findings`
- Nav section **Compliance → Findings** (alongside G1 Obligations and G2 Controls; those routes unchanged)
- Register finding (title + optional description, owner, G2 control picker)
- Queue, detail with start (from open) and close (while not closed)
- Open / in progress / closed badges; loading / empty / error states
- Copy states this is a findings register, not a test campaign or legal interpretation

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
- Invalid control reference denied; valid G2 reference does not mutate the control
- Web typecheck
- Regression G1 Compliance, G2 Controls, P1 Privacy, I15 ERM, I16 Internal Audit, I13 SOC

## Acceptance criteria

1. Carol can register a finding and move it open → in_progress → closed from **Compliance → Findings**.
2. Alice and partner cannot read findings APIs.
3. Health increment is `G3`.
4. Optional G2 `controlId` is a same-tenant reference only; G2 rows are unchanged.
5. Store key is `findingRecords` (not `grcFindings` / `complianceFindings`). No test-campaign tables.
6. I15, G1, P1, and G2 remain closed.

## Exclusions

- I21=D, I22=D, I23=D, EMCOMMS=D, EXER=D, CAL=D, PO=D
- UAT, Production, live regulatory feeds
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only so `/v1/findings` exists on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. G2 control identifiers may be referenced read-only. I15 is not a runtime dependency and is not reopened. G1, P1, and G2 implementations are not modified.
