# K2 Crisis Action Register — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **K2** |
| Capability name | Crisis Action Register |
| Family | crisis-command |
| Predecessor | I2 kernel (complete); I18 Crisis overlay complete and **not** reopened; K1 Crisis Decision Log complete and **not** reopened; I17 BCM complete and **not** reopened; O1–O6 complete and **not** reopened; G1–G5 complete and **not** reopened |
| Architecture status | This document is the K2 contract |
| Implementation status | **NOT AUTHORIZED** — preview only |
| Environment | Development/Test only |
| Persistence | In-memory at implementation time. Additive SQL only if implementation is later authorized. ADR-0017 not reopened. No migration file in this increment |
| Runtime health increment | `K2` |
| Production / UAT / AI | Not authorized |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |

Authority: 2026-08-24 governance **CANDIDATE=CRISIS_ACTION_REGISTER / DECISION=APPROVE / CAPABILITY_ID=K2 / FAMILY=CRISIS_COMMAND / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED** and [`k2-crisis-action-register-authorized.md`](../governance/k2-crisis-action-register-authorized.md). ID **K2** is assigned by that record. It is a crisis-command family identifier after I18 and K1. This is not O7, not I18.x, not G6, and not a reopen of I18 or K1.

The sections after this heading are the architecture contract. Implementation must not begin until a separate explicit execution instruction.

---

## Objective

Deliver a **Crisis** workspace surface where an authorised human can record **command actions** against an existing open I18 crisis case — not emergency communications, not an exercise platform, not a decision log, not a full Architecture 13.2 action tracker with owners-as-principals or due times, and not a redesign of I18 declaration, I18 timeline, or K1 decisions.

Architecture 13.2 names an “Action tracker with owners and due times.” **K2 is the smaller approved register only:** `ownerLabel` is operator text, not a principal ID; there is no due time, SLA, reminder, escalation, or scheduling engine.

I18 shipped declaration + immutable timeline only. K1 shipped the decision log. Both excluded this aggregate.

## Scope

| Deliverable | In scope |
| --- | --- |
| Action create / list / get / patch (while `open`) | Yes |
| Action codes `ACT-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; required `crisisId`; optional `ownerLabel` and `notes` | Yes |
| Required `crisisId` — same-tenant open I18 crisis case | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `crisis.action` | Yes |
| Tenant-scoped `/v1/crisis/actions/health` increment `K2` | Yes |
| Visible Crisis UI for the action register | Yes — declaration remains I18; decisions remain K1 |
| I18 case / timeline redesign | No |
| K1 decision log mutation | No |
| Full 13.2 tracker (principal owners, due times, SLA) | No |
| Comms log / resource allocation / recovery review | No |
| Emcomms / exercises | No |
| SAMPLE / G1–G5 / I15 / O6 mutation | No |

## Domain model

**crisis_actions** (runtime store key `crisisActions` — not I18 `crisisCases` / timeline keys, not K1 `crisisDecisions`, not O6 `operationalIssues`, not GRC keys, not SAMPLE keys)

- `actionCode` unique per tenant (`ACT-0001`)
- `title` required (max 200)
- optional `ownerLabel` (operator text, not a principal id; max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- `crisisId` required (I18 crisis case id in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `crisisCode` resolved from I18 at response time. Crisis case status, severity, commander label, summary, timeline entries, and K1 decisions are not patched by K2.

## Action-to-crisis relationship

`crisisId` must identify an existing **open** crisis case in the actor's tenant. Missing or other-tenant ids → `400` `crisis_not_found`. Closed parent case → `409` `case_closed` on create / patch / complete / cancel. The reference is a scalar field only. Creating, patching, completing, or cancelling an action does not change I18 case status, SoD close rules, timeline immutability, or K1 decisions.

`crisisId` is set at create and is not patched.

## Persistence / migration

No migration in this Stage 1 increment. If implementation is later authorized: additive SQL only; runtime in-memory; live PostgreSQL UNVERIFIED. ADR-0017 not reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title and crisisId (parent open) | open |
| open | patch title / ownerLabel / notes | open |
| open | complete | done |
| open | cancel | cancelled |
| open | create when parent closed | deny |
| done | patch / complete / cancel | deny |
| cancelled | patch / complete / cancel | deny |

Lifecycle endpoints must not no-op `open` → `open`. Illegal complete/cancel transitions → `409` `invalid_transition`.

## Human-only mutation

Create, patch, complete, and cancel require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. Architecture 13.1: AI may not declare L2/L3; AI may not create, complete, or cancel K2 actions. No autonomous action generation or execution.

## API

Prefix `/v1/crisis/actions`. I18 `/v1/crisis/health`, `/v1/crisis/cases`, and timeline routes are not modified (increment remains `I18`). K1 `/v1/crisis/decisions` routes are not modified (increment remains `K1`). JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/crisis/actions/health` | `crisis:read:action` |
| GET | `/v1/crisis/actions?q=&status=&crisisId=` | `crisis:read:action` |
| POST | `/v1/crisis/actions` | `crisis:write:action` |
| GET | `/v1/crisis/actions/:id` | `crisis:read:action` |
| PATCH | `/v1/crisis/actions/:id` | `crisis:write:action` |
| POST | `/v1/crisis/actions/:id/complete` | `crisis:write:action` |
| POST | `/v1/crisis/actions/:id/cancel` | `crisis:write:action` |

Health increment is `K2` (distinct from I18 crisis health and K1 decision health).

## RBAC

| Permission | Intent |
| --- | --- |
| `crisis:read:action` | Health + list/get |
| `crisis:write:action` | Create / patch / complete / cancel |

`platform.admin` — both. Role `crisis.action` — both. Alice and partner — 403. At implementation time, Bob seed includes `crisis.action` so the architecture role is exercised.

Do not broaden:

- I18 permissions (`crisis:read:case`, `crisis:write:case`, `crisis:read:timeline`, `crisis:write:timeline`) or role `crisis.commander`
- K1 permissions (`crisis:read:decision`, `crisis:write:decision`) or role `crisis.decision`
- O6 permissions or role `ops.issue`
- G1–G5 / GRC permissions
- generic `*.member` permissions beyond established `platform.admin` behaviour

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant action id → 404. Cross-tenant or unknown `crisisId` must not disclose parent-crisis existence (`400` `crisis_not_found`). I18 and K1 isolation unchanged.

## UI

- `/commercial/crisis/actions`
- Nav **Crisis → Actions** (Declaration, Timeline, Decisions, I17 Backup evidence unchanged)
- Register action (title + required open-crisis picker + optional owner label / notes)
- Queue/list, optional filters consistent with K1/O6 registers, detail with Complete and Cancel (from `open`)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is an action register, not emcomms, not an exercise engine, not a decision log, and not an I18 timeline replacement
- I18 declaration may add a link to Actions; it is not redesigned. K1 Decisions is not redesigned.

Do not create assignment boards, drag-and-drop, due-date calendars, SLA dashboards, automated escalation, communications, or resource allocation.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Missing / unknown / other-tenant `crisisId` | 400 `crisis_not_found` |
| Parent crisis closed | 409 `case_closed` |
| Illegal complete / cancel transition | 409 `invalid_transition` |
| Patch when done | 409 `done` |
| Patch when cancelled | 409 `cancelled` |

## Security

No tenant/principal ids in JSON. No file uploads. No SMS/voice/Teams adapters. Human-only gates are server-enforced. No AI command actions. This module does not fork I11 tickets and does not add linking FKs. `ownerLabel` is never treated as a principal ID.

## Testing (when implementation is authorized)

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation
- Invalid crisis reference denied; closed parent denied; valid crisis reference does not mutate I18 case/timeline or K1 decisions
- Creation, listing, retrieval, patch while `open`
- `open` → `done`; `open` → `cancelled`
- Illegal transitions; done/cancelled immutability (no patch)
- Web typecheck
- Regression: I18 health and behaviour unchanged; K1 health and behaviour unchanged; O6 health and behaviour unchanged; G1–G5 health unchanged; I15, I17, I11, I13 unchanged

## Acceptance criteria (when implementation is authorized)

1. Carol can register an action against a seed open crisis and complete or cancel it from **Crisis → Actions**.
2. Alice and partner cannot read action APIs.
3. Health increment is `K2`. I18 health remains `I18`. K1 health remains `K1`.
4. Referenced crisis status, SoD close, timeline behaviour, and K1 decisions are unchanged.
5. Store key is `crisisActions`. No I18/K1/O6/GRC/SAMPLE keys.
6. I18, K1, I17, O1–O6, I15, G1–G5 remain closed. SAMPLE remains deferred. EMCOMMS and EXER remain deferred.

## Exclusions

- Full Architecture 13.2 action tracker (principal owners, due times, SLA, reminders, escalation, scheduling)
- Communications log; resource allocation; recovery review; financial-impact tracking
- Emcomms / exercises / AI injects (EMCOMMS=D, EXER=D)
- I18 reopen or mutation of `crisis_cases` / timeline; K1 mutation; O6 mutation
- I11 ticket FKs; programme FKs; owner principal IDs
- Autonomous AI action creation or execution
- SAMPLE; G1–G5 mutation; I15 reopen
- I21=D, I22=D, I23=D, CAL=D, PO=D, SUCC=D, I20X=D, EXT=D
- UAT, Production, live PostgreSQL, external vendor selection, IdP/vault/SIEM changes
- Numeric placeholder IDs I18.x / O7 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale pre-K2 process returning 404 is not a K2 defect.

## Rollback

If implemented later: additive migration; disable by not registering routes.

## Dependencies

I0 kernel patterns (tenancy/RBAC). I18 crisis case identifiers referenced read-only. K1 is not a runtime dependency. I17 is not a runtime dependency. O6 and G1–G5 implementations are not modified. No new vendors, external services, communications providers, infrastructure, or live database dependencies.
