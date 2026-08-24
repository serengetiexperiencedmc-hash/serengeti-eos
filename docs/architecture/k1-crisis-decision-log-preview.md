# K1 Crisis Decision Log — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **K1** |
| Capability name | Crisis Decision Log |
| Predecessor | I2 kernel (complete); I18 Crisis overlay complete and **not** reopened; I17 BCM complete and **not** reopened; O1–O6 complete and **not** reopened; G1–G5 complete and **not** reopened |
| Architecture status | This document is the K1 contract |
| Implementation status | **NOT AUTHORIZED** — preview only |
| Environment | Development/Test only |
| Persistence | In-memory at implementation time. Additive SQL only if implementation is later authorized. ADR-0017 not reopened. No migration file in this increment |
| Runtime health increment | `K1` |
| Production / UAT / AI | Not authorized |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |

Authority: 2026-08-24 governance **CANDIDATE=CRISIS_DECISION_LOG / DECISION=APPROVE / CAPABILITY_ID=K1** and [`k1-crisis-decision-log-authorized.md`](../governance/k1-crisis-decision-log-authorized.md). ID **K1** is assigned by that record. It is a crisis-command family identifier after I18. This is not O7, not I18.x, not G6, and not I15.x.

The sections after this heading are the architecture contract. Implementation must not begin until a separate explicit execution instruction.

---

## Objective

Deliver a **Crisis** workspace surface where an authorised human can record **command decisions** against an existing open I18 crisis case — not emergency communications, not an exercise platform, not an action tracker, and not a redesign of I18 declaration or timeline.

Architecture 13.2 names the decision log (authority, options, chosen action, rationale). I18 shipped declaration + immutable timeline only and excluded this aggregate.

## Scope

| Deliverable | In scope |
| --- | --- |
| Decision create / list / get / patch (while `recorded`) | Yes |
| Decision codes `DEC-0001` unique per tenant | Yes |
| Statuses: `recorded` → `superseded` (`superseded` terminal) | Yes |
| Required `title`; optional `options`, `chosenAction`, `rationale`, `authorityLabel` | Yes |
| Required `crisisId` — same-tenant open I18 crisis case | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `crisis.decision` | Yes |
| Tenant-scoped `/v1/crisis/decisions/health` increment `K1` | Yes |
| Visible Crisis UI for the decision log | Yes — declaration remains I18 |
| I18 case / timeline redesign | No |
| Action tracker / comms log / resource allocation | No |
| Emcomms / exercises | No |
| SAMPLE / G1–G5 / I15 / O6 mutation | No |

## Domain model

**crisis_decisions** (runtime store key `crisisDecisions` — not I18 `crisisCases` / timeline keys, not GRC keys, not SAMPLE keys, not O6 `operationalIssues`)

- `decisionCode` unique per tenant (`DEC-0001`)
- `title` required (max 200)
- optional `options` (max 2000)
- optional `chosenAction` (max 2000)
- optional `rationale` (max 2000)
- optional `authorityLabel` (operator text, not a principal id; max 200)
- `status`: `recorded` \| `superseded`
- `crisisId` required (I18 crisis case id in the same tenant)
- timestamps + createdByPrincipalId (not returned)

JSON may include a read-only `crisisCode` resolved from I18 at response time. Crisis case status, severity, commander label, summary, and timeline entries are not patched by K1.

## Decision-to-crisis relationship

`crisisId` must identify an existing **open** crisis case in the actor's tenant. Missing or other-tenant ids → `400` `crisis_not_found`. Closed parent case → `409` `case_closed` on create / patch / supersede. The reference is a scalar field only. Recording or superseding a decision does not change I18 case status, SoD close rules, or timeline immutability.

## Persistence / migration

No migration in this Stage 1 increment. If implementation is later authorized: additive SQL only; runtime in-memory; live PostgreSQL UNVERIFIED. ADR-0017 not reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title and crisisId (parent open) | recorded |
| recorded | patch title / options / chosenAction / rationale / authorityLabel | recorded |
| recorded | supersede | superseded |
| recorded | create when parent closed | deny |
| superseded | patch / supersede | deny |

`crisisId` is set at create and is not patched.

## Human-only mutation

Create, patch, and supersede require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`. Architecture 13.1: AI may not declare L2/L3; AI may not record or supersede K1 decisions.

## API

Prefix `/v1/crisis/decisions`. I18 `/v1/crisis/health`, `/v1/crisis/cases`, and timeline routes are not modified (increment remains `I18`). JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/crisis/decisions/health` | `crisis:read:decision` |
| GET | `/v1/crisis/decisions?q=&status=&crisisId=` | `crisis:read:decision` |
| POST | `/v1/crisis/decisions` | `crisis:write:decision` |
| GET | `/v1/crisis/decisions/:id` | `crisis:read:decision` |
| PATCH | `/v1/crisis/decisions/:id` | `crisis:write:decision` |
| POST | `/v1/crisis/decisions/:id/supersede` | `crisis:write:decision` |

Health increment is `K1` (distinct from I18 crisis health).

## RBAC

| Permission | Intent |
| --- | --- |
| `crisis:read:decision` | Health + list/get |
| `crisis:write:decision` | Create / patch / supersede |

`platform.admin` — both. Role `crisis.decision` — both. Alice and partner — 403. At implementation time, Bob seed includes `crisis.decision` so the architecture role is exercised. Existing I18 permissions (`crisis:read:case`, `crisis:write:case`, `crisis:read:timeline`, `crisis:write:timeline`) and role `crisis.commander` are not broadened to decision write. O6 and GRC roles are not given decision permissions.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant decision id → 404. Crisis isolation unchanged.

## UI

- `/commercial/crisis/decisions` (and/or decision list on an open I18 declaration)
- Nav **Crisis → Decisions** (Declaration, I17 Backup evidence unchanged)
- Register decision (title + required open-crisis picker + optional options / chosen action / rationale / authority)
- Queue, detail with supersede (from recorded)
- Recorded / superseded badges; loading / empty / error / authorization-failure states
- Copy states this is a decision log, not emcomms, not an exercise engine, and not an I18 timeline replacement
- I18 declaration may add a link to Decisions; it is not redesigned

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Missing / unknown / other-tenant `crisisId` | 400 `crisis_not_found` |
| Parent crisis closed | 409 `case_closed` |
| Illegal transition | 409 `invalid_transition` |
| Patch when superseded | 409 `superseded` |

## Security

No tenant/principal ids in JSON. No file uploads. No SMS/voice/Teams adapters. Human-only gates are server-enforced. No AI command decisions. This module does not fork I11 tickets and does not add linking FKs.

## Testing (when implementation is authorized)

- 401/403 Alice/partner, tenant isolation
- Create, patch, supersede; patch after supersede denied; AiAgent mutate denied
- Invalid crisis reference denied; closed parent denied; valid crisis reference does not mutate I18 case/timeline
- Web typecheck
- Regression I18, I17, I11, I13; confirmation O6, G1, P1, G2, G3, G4, G5, I15 unchanged

## Acceptance criteria (when implementation is authorized)

1. Carol can record a decision against a seed open crisis and supersede it from **Crisis → Decisions**.
2. Alice and partner cannot read decision APIs.
3. Health increment is `K1`. I18 health remains `I18`.
4. Referenced crisis status, SoD close, and timeline behaviour are unchanged.
5. Store key is `crisisDecisions`. No GRC/SAMPLE/O6 keys.
6. I18, I17, O1–O6, I15, G1–G5 remain closed. SAMPLE remains deferred. EMCOMMS and EXER remain deferred.

## Exclusions

- Decision log is in scope; action tracker, comms log, resource allocation, recovery review are not
- Emcomms / exercises / AI injects (EMCOMMS=D, EXER=D)
- I18 reopen; I11 ticket FKs; programme FKs
- Autonomous AI declaration or decision recording
- SAMPLE; G1–G5 mutation; I15 reopen; O6 mutation
- I21=D, I22=D, I23=D, CAL=D, PO=D
- UAT, Production, live PostgreSQL, external vendor selection
- Numeric placeholder IDs I18.x / O7 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is not authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized.

## Rollback

If implemented later: additive migration; disable by not registering routes.

## Dependencies

I0 kernel patterns. I18 crisis case identifiers referenced read-only. I17 is not a runtime dependency. O6 and G1–G5 implementations are not modified.
