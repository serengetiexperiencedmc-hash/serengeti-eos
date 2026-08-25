# H1 HR Certification Register — Preview

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`**  
> H1 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `100_h1_hr_certifications.sql`).  
> The lifecycle table and contract body below are the **historical Stage 1** record (`IMPLEMENTATION_AUTHORIZED=NO` at authorization time). They answer “what was authorized at Stage 1?” They must not be read as a pending implementation queue.  
> No H1.x. No payroll/LMS. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

## Lifecycle status (historical Stage 1)

| Field | Value |
| --- | --- |
| Increment ID | **H1** |
| Capability name | HR Certification Register |
| Family | hr |
| Predecessor | I2 kernel (complete); I10 HR Core complete and **not** reopened |
| Architecture status | This document is the H1 contract |
| Implementation status | **NOT AUTHORIZED** — preview only |
| Environment | Development/Test only |
| Persistence | In-memory at implementation time. Additive SQL only if implementation is later authorized. ADR-0017 not reopened. No migration file in this increment |
| Runtime health increment | `H1` |
| Production / UAT / AI | Not authorized |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |

Authority: 2026-08-24 Operator / product-owner decision **CANDIDATE=HR_CERTIFICATION_REGISTER / DECISION=APPROVE / CAPABILITY_ID=H1 / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED** and [`h1-hr-certification-register-authorized.md`](../governance/h1-hr-certification-register-authorized.md). ID **H1** is assigned by that record. It is an HR-family identifier after I10. This is not I10.x, not I21, not O7, not K3, not G6, and not payroll.

The sections after this heading are the architecture contract. Implementation must not begin until a separate explicit execution instruction. *(Historical Stage 1 sentence. Stage 2 later completed; see current-state banner. Not a new execution authorization.)*

---

## Objective

Deliver a **People / HR** workspace surface where an authorised human can record **certifications held by an existing same-tenant I10 employee** — not payroll, not an LMS, not a competency engine, not credential verification, and not a redesign of I10 employee / leave / skills.

Domain map 2.2 names Certification under `hr`. I10 shipped employee, leave, and skills only and excluded certifications.

Optional `issuedOn` / `expiresOn` are operator-entered date labels only. They are **not** an expiry engine, reminder, SLA, or renewal workflow.

## Scope

| Deliverable | In scope |
| --- | --- |
| Certification create / list / get / patch (while `held`) | Yes |
| Certification codes `CRT-0001` unique per tenant | Yes |
| Statuses: `held` → `revoked` (`revoked` terminal) | Yes |
| Required `name`; required `employeeId`; optional `issuerLabel`, `issuedOn`, `expiresOn`, `notes` | Yes |
| Required `employeeId` — existing same-tenant I10 employee | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `hr.certification` | Yes |
| Tenant-scoped `/v1/hr/certifications/health` increment `H1` | Yes |
| Visible HR UI for the certification register | Yes — I10 HR directory remains I10 |
| I10 employee / leave / skills redesign | No |
| Payroll / salary / tax / benefits / employment contracts | No |
| LMS / training / competency / expiry automation / renewal | No |
| External verification / IdP / document storage | No |

## Domain model

**hr_certifications** (runtime store key `hrCertifications` — not I10 `hrEmployees` / leave / skills keys, not payroll keys, not GRC keys, not SAMPLE keys)

- `certificationCode` unique per tenant (`CRT-0001`)
- `name` required (max 200)
- optional `issuerLabel` (operator text, not a principal id; max 200)
- `status`: `held` \| `revoked`
- optional `issuedOn` (`YYYY-MM-DD` label only)
- optional `expiresOn` (`YYYY-MM-DD` label only)
- optional `notes` (max 2000)
- `employeeId` required (I10 employee id in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `employeeCode` resolved from I10 at response time. Employee status, leave, skills, and linked-account fields are not patched by H1.

`issuedOn` / `expiresOn` must not trigger jobs, notifications, status changes, or verification.

## Certification-to-employee relationship

`employeeId` must identify an existing employee in the actor's tenant (any I10 status, including terminated). Missing or other-tenant ids → `400` `employee_not_found`. The reference is a scalar field only. Creating, patching, or revoking a certification does not change I10 employee, leave, or skill behaviour.

`employeeId` is set at create and is not patched.

## Persistence / migration

No migration in this Stage 1 increment. If implementation is later authorized: additive SQL only; runtime in-memory; live PostgreSQL UNVERIFIED. ADR-0017 not reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with name and employeeId | held |
| held | patch name / issuerLabel / issuedOn / expiresOn / notes | held |
| held | patch status to `revoked` | revoked |
| revoked | patch | deny |

No dedicated renewal, expire, or verify endpoints. Illegal status change → `409` `invalid_transition`. If both date labels are present and `issuedOn` is after `expiresOn` → `400` `invalid_dates`. Date presence does not change status.

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. No autonomous certification creation, renewal, expiry, or verification.

## API

Prefix `/v1/hr/certifications`, consistent with existing I10 `/v1/hr/*` routes. I10 `/v1/hr/health`, `/v1/hr/employees`, `/v1/hr/skills`, and `/v1/hr/leave` are not modified (increment remains `I10`). JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/hr/certifications/health` | `hr:read:certification` |
| GET | `/v1/hr/certifications?q=&status=&employeeId=` | `hr:read:certification` |
| POST | `/v1/hr/certifications` | `hr:write:certification` |
| GET | `/v1/hr/certifications/:id` | `hr:read:certification` |
| PATCH | `/v1/hr/certifications/:id` | `hr:write:certification` |

Health increment is `H1` (distinct from I10 HR health).

## RBAC

| Permission | Intent |
| --- | --- |
| `hr:read:certification` | Health + list/get |
| `hr:write:certification` | Create / patch (including human revoke) |

`platform.admin` — both. Role `hr.certification` — both. Alice and partner — 403. At implementation time, Bob seed includes `hr.certification` so the architecture role is exercised.

Do not broaden:

- I10 permissions (`hr:read:employee`, `hr:write:employee`, `hr:read:leave`, `hr:write:leave`, `hr:approve:leave`, `hr:read:skill`, `hr:write:skill`)
- roles `hr.member` / `hr.approver`
- GRC, crisis, or operations permissions

Existing I10 HR permissions are **not** reused for H1 write or H1-only read.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant certification id → 404. Cross-tenant or unknown `employeeId` must not disclose employee existence (`400` `employee_not_found`). I10 isolation unchanged.

## UI

- `/commercial/hr/certifications`
- Nav **People → Certifications** (existing **People → HR** I10 surface unchanged)
- Register certification (name + required employee picker + optional issuer / dates / notes)
- Queue/list, optional filters consistent with O6/K2 registers, detail with revoke (from `held` via patch)
- Held / revoked badges; loading / empty / error / authorization-failure states
- Copy states this is a certification register, not payroll, not an LMS, and not an I10 directory replacement
- I10 HR page may add a link to Certifications; it is not redesigned

Do not create training dashboards, document upload, bulk import, or expiry calendars.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing name | 400 `name_required` |
| Missing / unknown / other-tenant `employeeId` | 400 `employee_not_found` |
| Both dates present and issuedOn after expiresOn | 400 `invalid_dates` |
| Illegal status change | 409 `invalid_transition` |
| Patch when revoked | 409 `revoked` |

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/payroll adapters. Human-only gates are server-enforced. `issuerLabel` is never treated as a principal ID. Date labels are never treated as schedule jobs.

## Testing (when implementation is authorized)

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation
- Invalid employee reference denied; valid employee reference does not mutate I10 employee/leave/skills
- Creation, listing, retrieval, patch while `held`; `held` → `revoked`; revoked immutability
- Date labels stored without status automation
- Web typecheck
- Regression: I10 health and behaviour unchanged; I11, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 unchanged

## Acceptance criteria (when implementation is authorized)

1. Carol can register a certification against a seed employee and revoke it from **People → Certifications**.
2. Alice and partner cannot read certification APIs.
3. Health increment is `H1`. I10 health remains `I10`.
4. Referenced employee status, leave, and skills are unchanged.
5. Store key is `hrCertifications`. No I10/payroll/GRC/SAMPLE keys.
6. I10 remains closed. Payroll remains deferred. SAMPLE remains deferred.

## Exclusions

- Payroll, salary, tax, benefits, employment contracts
- LMS, training management, competency engine
- Certification expiry automation, reminders, SLA, renewal workflows
- External credential verification; IdP integration; document/object storage
- Legal/compliance conclusions; regulatory certification interpretation
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT
- I10 reopen or mutation of employees / leave / skills
- I11, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 mutation
- UAT, Production, live PostgreSQL, external vendor selection
- Numeric placeholder IDs I10.x / I21 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized.

## Rollback

If implemented later: additive migration; disable by not registering routes.

## Dependencies

I0 kernel patterns (tenancy/RBAC). I10 employee identifiers referenced read-only. No new vendors, external services, identity providers, document stores, infrastructure, or live database dependencies.
