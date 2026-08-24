# I18 Crisis Overlay — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I18** |
| Capability name | Human crisis declaration + immutable timeline (command overlay) |
| Predecessor | Architecture ch.13; I17 complete (not a runtime dependency); I0 kernel |
| Architecture status | This document is the I18 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `090_i18_crisis_overlay.sql`. ADR-0017 not reopened |
| Runtime health increment | `I18` |
| Production / UAT / AI | Not authorized |

Authority: backlog I18 (command center; voice/emcomms/exercises excluded until a provider) plus explicit 2026-08-24 governance **I18=A**: bounded Dev/Test crisis overlay — **human crisis declaration + immutable timeline only**. No SMS/voice/Teams, no exercise engine, no second incident model.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Crisis** workspace where an authorised human can declare an L2/L3 command overlay and append an immutable situation timeline — not emergency communications, not an exercise platform, and not a fork of I11 ITSM incidents.

AI may not declare, close, patch, or write timeline entries (architecture 13.1).

## Scope

| Deliverable | In scope |
| --- | --- |
| Crisis case create / list / get / patch (while open) | Yes |
| Severity `l2` \| `l3` only | Yes |
| Case statuses: `open` → `closed` (closed terminal) | Yes |
| Immutable timeline append / list / get | Yes |
| Object-level SoD: case creator cannot close | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `crisis.commander` | Yes |
| Tenant-scoped `/v1/crisis/health` increment `I18` | Yes |
| Visible **Crisis → Declaration** | Yes |
| Decision log / action tracker / comms log | No |
| Resource allocation / recovery review | No |
| Emcomms (SMS / voice / Teams) | No |
| Exercise engine / AI injects | No |
| L0/L1 incidents (remain I11 ITSM) | No |
| Linking FKs to tickets / programmes | No |

## Domain model

**crisis_cases**

- `crisisCode` unique per tenant (`CRS-0001`)
- `title` required
- `severity`: `l2` \| `l3`
- `status`: `open` \| `closed`
- optional `commanderLabel` (operator text, not a principal id)
- optional `summary` (max 2000)
- timestamps + createdByPrincipalId (used for SoD; not returned)

**crisis_timeline_entries**

- `entryCode` unique per tenant (`TLN-0001`)
- `crisisId` required, same tenant
- `body` required (max 20000)
- immutable after create — no patch/delete
- timestamps + createdByPrincipalId (not returned)

Closed is terminal. Timeline cannot be appended after close. No decision, action, comms, resource, or exercise tables.

## Persistence / migration

`090_i18_crisis_overlay.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

### Case

| From | Action | To |
| --- | --- | --- |
| (none) | declare with title + severity | open |
| open | patch title / summary / commanderLabel | open |
| open | close by a **different** human principal | closed |
| open | close by case creator | deny SoD |
| closed | close / patch / append timeline | deny |

### Timeline

| From | Action | To |
| --- | --- | --- |
| (none) | append on **open** case | new immutable entry |
| (none) | append on closed case | deny |
| (none) | patch or delete an entry | not offered |

## Separation of duties

Same-object SoD: the principal who declared the crisis cannot close it (`403`, reason `sod`). Closure must be a second pair of eyes.

Dev/Test seed: Bob holds `crisis.commander` in addition to finance/HR/audit/BCM so a second operator can close (same pattern as I10 / I16 / I17). Carol (`platform.admin`) can declare; she cannot close her own cases.

## Human-only mutation

Declare, patch, close, and timeline append require `actorType === "Human"`. `AiAgent` (and any non-Human actor) → `403`, reason `ai_actor`. Architecture 13.1: AI may recommend escalation; AI may not declare L2/L3.

## API

Prefix `/v1/crisis`. JSON omits `tenantId` and `principalId`. Timeline JSON may include `crisisId` and `crisisCode`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/crisis/health` | `crisis:read:case` |
| GET | `/v1/crisis/cases?q=&status=&severity=` | `crisis:read:case` |
| POST | `/v1/crisis/cases` | `crisis:write:case` |
| GET | `/v1/crisis/cases/:id` | `crisis:read:case` |
| PATCH | `/v1/crisis/cases/:id` | `crisis:write:case` |
| POST | `/v1/crisis/cases/:id/close` | `crisis:write:case` |
| GET | `/v1/crisis/cases/:id/timeline` | `crisis:read:timeline` |
| POST | `/v1/crisis/cases/:id/timeline` | `crisis:write:timeline` |
| GET | `/v1/crisis/timeline/:id` | `crisis:read:timeline` |

## RBAC

| Permission | Intent |
| --- | --- |
| `crisis:read:case` | Health + list/get cases |
| `crisis:write:case` | Declare / patch / close (SoD + human-only still apply) |
| `crisis:read:timeline` | List/get timeline entries |
| `crisis:write:timeline` | Append timeline (human-only; case must be open) |

`platform.admin` — all. Role `crisis.commander` — all four. Alice and partner — 403. Bob seed includes `crisis.commander` for SoD completion.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404. A timeline entry cannot reference a cross-tenant case.

## UI

- `/commercial/crisis`
- Nav section **Crisis → Declaration**
- Declare case (title + severity + optional commander/summary), queue, detail with close
- Append timeline on an open case
- Closed / L2 / L3 badges; loading / empty / error states
- Copy states this is a command overlay, not emcomms or an exercise engine

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Close by case creator | 403 `sod` |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Invalid severity | 400 `invalid_severity` |
| Close when already closed | 409 `already_closed` |
| Patch or append when closed | 409 `case_closed` |
| Invalid / missing timeline body | 400 `body_required` |

## Security

No tenant/principal ids in JSON. No file uploads. No SMS/voice/Teams adapters. No autonomous declaration. SoD and human-only gates are server-enforced. This module does not fork I11 tickets and does not add linking FKs.

## Testing

- 401/403 Alice/partner, tenant isolation
- Declare case, append timeline, self-close denied, Bob closes
- Append after close rejected; invalid severity rejected; AiAgent mutate denied
- Web typecheck
- Regression I17

## Acceptance criteria

1. Carol can declare an L2/L3 crisis and append a timeline entry from **Crisis → Declaration**.
2. Carol cannot close her own case; Bob can.
3. Timeline entries are append-only; closed cases reject further writes.
4. Alice and partner cannot read crisis APIs.
5. Health increment is `I18`.
6. No emcomms, exercise engine, decision log, or second incident model is introduced.

## Exclusions

- Decision log, action tracker, comms log, resource allocation, recovery review
- Emcomms / exercises / AI injects
- I15 remaining compliance/privacy, I21, I22 partner edge
- I20 L0–L1 expansion
- Numeric placeholder IDs, UAT, Production

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only as Dev/Test verification so `/v1/crisis` (and prior I14–I17/I19) routes exist on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. Architecture ch.13 / 24. I17 is not a runtime dependency. I18=A does not authorize emcomms or exercises.
