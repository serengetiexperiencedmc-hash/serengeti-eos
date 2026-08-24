# I10 HR Core — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I10** |
| Capability name | HR Core |
| Predecessor | I1 Org + admin shell (CLOSED) |
| Architecture status | This document is the I10 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `081_i10_hr_core.sql`. ADR-0017 not reopened |
| Runtime health increment | `I10` |
| Production / UAT / AI | Not authorized |

Authority: committed backlog (`docs/backlog/increments.md` I10 — Employee, leave, skills; not payroll) and Phase 2 domain map (`hr` — Employee, Leave, Skill). Certification and payroll are out of scope.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **People / HR** department so an internal user can maintain the employee directory, a skill catalogue with assignments, and leave requests with submit/approve SoD — through API and visible UI.

## User / business purpose

Phase 2 core business includes HR. Commercial → Operations → Finance is live; the organisation still has no employee/leave/skills workspace. I10 is the first HR increment, not a payroll or benefits engine.

## Scope

| Deliverable | In scope |
| --- | --- |
| Employee directory (CRUD-lite: create, list, get, patch) | Yes |
| Skill catalogue + assign/remove on employee | Yes |
| Leave request + submit / approve / reject / cancel | Yes |
| Tenant-scoped `/v1/hr/health` increment `I10` | Yes |
| Visible nav **People → HR** and `/commercial/hr` | Yes |
| Payroll, salary, tax, benefits, contracts, certifications | No |
| Calendar / resource booking | No |
| Production identity, UAT, live PostgreSQL requirement | No |

## User roles

| Role | Intent |
| --- | --- |
| `platform.admin` | Full HR (read/write/approve) |
| `hr.member` | Directory, skills, leave write (no approve) |
| `hr.approver` | Read directory/leave/skills + approve leave |
| Finance member (Alice) | No HR — 403 |
| Partner tenant | No HR — 403 |

Dev/Test seed: Carol has platform.admin (all HR). Bob is granted `hr.approver` in addition to finance.approver so leave SoD can complete (submitter ≠ approver).

## Data model

Tenant-scoped aggregates. Soft-delete is not required in I10 (terminated status instead).

**hr_employees**

- `employeeCode` unique per tenant (`EMP-0001` …)
- `givenName`, `familyName`
- optional `email` unique per tenant when present
- optional link to a same-tenant principal (stored as `principalId`; **not** returned — responses expose `linkedAccountEmail` only)
- optional `orgUnitId`, `locationId`, `jobTitle`, `startDate`
- `status`: `active` \| `on_leave` \| `terminated`

**hr_skills**

- `name` unique per tenant (case-insensitive)
- optional `category`

**hr_employee_skills**

- `(employeeId, skillId)` unique
- `proficiency`: `beginner` \| `intermediate` \| `advanced` \| `expert`

**hr_leave_requests**

- `employeeId`, `leaveType`: `annual` \| `sick` \| `unpaid` \| `compassionate`
- `startDate`, `endDate` (`YYYY-MM-DD`), `days` (inclusive)
- `status`: `draft` \| `submitted` \| `approved` \| `rejected` \| `cancelled`
- optional `notes`

## Workflow / state transitions

| From | Action | To |
| --- | --- | --- |
| draft | submit | submitted |
| draft | cancel | cancelled |
| submitted | approve | approved |
| submitted | reject | rejected |
| submitted | cancel | cancelled |
| approved / rejected / cancelled | — | terminal |

- Terminated employees cannot receive new leave.
- Approver cannot be the linked principal of the employee (`cannot_approve_own_leave`).
- SoD rule `leave-write-approve`: the principal who wrote/submitted a leave record cannot approve it (`hr:write:leave` vs `hr:approve:leave`, same object).

## API

All responses omit `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/hr/health` | `hr:read:employee` |
| GET | `/v1/hr/employees?q=&status=` | `hr:read:employee` |
| POST | `/v1/hr/employees` | `hr:write:employee` |
| GET | `/v1/hr/employees/:id` | `hr:read:employee` |
| PATCH | `/v1/hr/employees/:id` | `hr:write:employee` |
| GET | `/v1/hr/skills?q=` | `hr:read:skill` |
| POST | `/v1/hr/skills` | `hr:write:skill` |
| PATCH | `/v1/hr/skills/:id` | `hr:write:skill` |
| POST | `/v1/hr/employees/:id/skills` | `hr:write:employee` |
| DELETE | `/v1/hr/employees/:id/skills/:skillId` | `hr:write:employee` |
| GET | `/v1/hr/leave?employeeId=&status=` | `hr:read:leave` |
| POST | `/v1/hr/leave` | `hr:write:leave` |
| POST | `/v1/hr/leave/:id/submit` | `hr:write:leave` |
| POST | `/v1/hr/leave/:id/approve` | `hr:approve:leave` |
| POST | `/v1/hr/leave/:id/reject` | `hr:approve:leave` |
| POST | `/v1/hr/leave/:id/cancel` | `hr:write:leave` |

Link a login with `linkedPrincipalEmail` (never accept/return `principalId`).

## UI

- Route: `/commercial/hr`
- Nav: new **People** section, item **HR**
- Tabs: Employees, Leave, Skills
- Employees: search/status filter, create form, list, select detail (edit status/title, assign skills, leave history)
- Leave: pending queue, submit/approve/reject/cancel actions according to role
- Skills: catalogue create + list
- Loading, empty, and error states
- Cross-links: none required to commercial bookings (HR is internal people, not a commercial record)

## Security

- Authentication required
- RBAC permission grammar `{domain}:{action}:{resource}` with domain `hr`
- Tenant isolation on every query
- Missing record or wrong-tenant id → 404 (no leak)
- Alice (no HR) → 403
- Partner tenant → 403

## Failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Missing / wrong-tenant record | 404 |
| Invalid input / dates / enum | 400 `invalid_request` |
| Duplicate code/email/skill | 409 |
| Illegal leave transition | 409 `invalid_transition` |
| Own-leave approve | 403 `cannot_approve_own_leave` |
| SoD write/approve same leave | 403 `sod` |

## Persistence / migration

`081_i10_hr_core.sql` — `hr_employees`, `hr_skills`, `hr_employee_skills`, `hr_leave_requests`. Dev/Test runtime remains the in-memory store. Live PostgreSQL is UNVERIFIED (ADR-0017).

## Tests

- Health 401/403, tenant-scoped increment `I10`
- Employee create/list/get/patch; duplicate; Alice 403; partner 403; foreign id 404
- Skill catalogue + assign/remove
- Leave transitions, own-leave, SoD (Carol submit / Bob approve)
- Invalid dates and terminated-employee leave
- Web typecheck

## Exclusions

- Payroll engine
- Certifications (domain-map aggregate; not in I10 backlog includes)
- Public holiday calendars, accrual balances, carry-over policy
- I11+ Phase 3 modules
- C11, I3.38, I4.35, I20.23, PG.30
- UAT / Production

## Acceptance criteria

1. Carol can maintain employees, skills, and leave through `/commercial/hr`.
2. Bob can approve submitted leave he did not write; Carol cannot approve leave she wrote.
3. Alice and partner cannot read HR APIs.
4. Responses never include `tenantId` or `principalId`.
5. Health reports increment `I10` and tenant-local counts.

## Dependencies

I1 org units, locations, principals (optional link). No commercial C-series tables.
