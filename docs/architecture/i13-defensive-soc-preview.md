# I13 Defensive SOC — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I13** |
| Capability name | Defensive SOC integration |
| Predecessor | I12 Observability (complete); I11 tickets (IR casefile) |
| Architecture status | This document is the I13 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `084_i13_defensive_soc.sql`. ADR-0017 not reopened |
| Runtime health increment | `I13` |
| Production / UAT / AI | Not authorized |

Authority: backlog I13 (Alert ingest, IR casefile; **not** Homegrown SIEM), ADR-0014 (integrate defensive products; no attack platform), identity/security §6.6 (Detection → … → Lessons learned; containment that affects production needs human authorisation), crisis architecture 13.4 (**do not fork a second incident model**), domain map (`security` — Detection, Investigation, ContainmentRequest; workspace **SOC**), RBAC role `security.analyst`, I3 adapter-port pattern (Dev/Test ingest without choosing the production product), discovery register (SIEM = Unknown — do not invent a vendor).

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **bounded Dev/Test SOC workspace**: ingest defensive alerts through an internal JSON adapter, and use **I11 incident tickets** as the IR casefile. This is integration plumbing, not a SIEM.

## User / business purpose

Phase 3 SOC integration starts with a place to receive an alert and open an investigation. Production SIEM product choice remains Discovery. Operators still need a Dev/Test path that respects ADR-0014.

## Scope

| Deliverable | In scope |
| --- | --- |
| Alert ingest via authenticated JSON API (`source=devtest.webhook`) | Yes |
| Alert list/get, acknowledge, close | Yes |
| Open IR case → create I11 `incident` ticket (reuse, not a new casefile aggregate) | Yes |
| Optional CI id on ingest (must be tenant CMDB) | Yes |
| Tenant-scoped `/v1/security/health` increment `I13` | Yes |
| Visible **Security → SOC** | Yes |
| Role `security.analyst` | Yes |
| Homegrown SIEM / log search / correlation / detection rules | No |
| Production SIEM vendor connector | No |
| ContainmentRequest / prod isolate / mass disable | No (approval matrix + I14/PAM) |
| Offensive tooling | No (ADR-0014) |

## Non-scope

- Choosing or simulating a named SIEM product
- Storing raw telemetry or exploit payloads
- Alert routing / paging
- Autonomous containment
- Vulnerability / patch / UEM (later Phase 3 modules)
- Crisis L2/L3 declaration (I18)

## Domain model

**security_alerts** (Detection record)

- `alertCode` unique per tenant (`ALT-0001`)
- `source`: `devtest.webhook` only in I13
- `title` (required), optional `summary` (max 2000 chars; not a log blob)
- `severity`: same enum as I11 tickets
- `status`: `open` \| `acknowledged` \| `closed`
- optional `externalId` unique per tenant (idempotent ingest)
- optional `ciId` (tenant CMDB)
- optional `ticketId` (I11 incident — the IR casefile)
- timestamps + createdByPrincipalId (not returned)

IR **Investigation** = existing `itsm_tickets` row (`ticketType=incident`). No `security_casefiles` table.

## Persistence / migration

`084_i13_defensive_soc.sql`. Runtime remains in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | ingest | open |
| open | acknowledge | acknowledged |
| open / acknowledged | close | closed |
| open / acknowledged | open-case | same status; sets `ticketId` |
| closed | — | terminal |
| ingest duplicate `externalId` | — | 200 existing alert (idempotent) |

Open-case when `ticketId` already set → 409. Close does not close the I11 ticket (ITSM owns ticket lifecycle).

## API

All JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/security/health` | `security:read:alert` |
| GET | `/v1/security/alerts?q=&status=` | `security:read:alert` |
| POST | `/v1/security/alerts` | `security:ingest:alert` |
| GET | `/v1/security/alerts/:id` | `security:read:alert` |
| POST | `/v1/security/alerts/:id/acknowledge` | `security:write:alert` |
| POST | `/v1/security/alerts/:id/close` | `security:write:alert` |
| POST | `/v1/security/alerts/:id/case` | `security:write:case` |

Ingest body: `{ title, summary?, severity?, externalId?, ciId? }`. `source` is always `devtest.webhook` (client cannot set a fake vendor).

Open-case creates an I11 incident (status `open`) titled from the alert, optional CI link, returns `{ alert, ticket }`.

## RBAC

| Permission | Intent |
| --- | --- |
| `security:read:alert` | Health + list/get |
| `security:ingest:alert` | Adapter ingest |
| `security:write:alert` | Acknowledge / close |
| `security:write:case` | Open I11 incident from alert |

`platform.admin` — all. Role `security.analyst` — read + write alert + write case (not ingest). Alice and partner — 403. IT agent is not SOC.

Open-case does **not** require `itsm:write:ticket` (SOC may open a case without becoming an IT agent). Ticket remains an I11 incident.

## Tenant isolation

Every query is tenant-scoped. Missing / wrong-tenant id → 404. Cross-tenant `ciId` → 404.

## UI

- `/commercial/soc`
- Nav section **Security** → SOC (domain map: Cybersecurity / SOC workspace)
- Ingest form (Dev/Test adapter), queue, acknowledge/close, open case, link to Service Desk
- Loading / empty / error states

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Invalid enum / empty title | 400 |
| Duplicate externalId | 200 existing |
| Illegal status transition | 409 |
| Case already open | 409 |
| Unknown CI | 404 |

## Security

No tenant/principal ids in JSON. No raw payload field. ADR-0014: no exploit content, no offensive tools. Tests are authz/control tests.

## Audit

Alert create/ack/close/case set `updatedByPrincipalId` internally. No extra audit stream required beyond existing request logs.

## Testing

- 401/403, Alice/partner, tenant isolation, no secret leak
- Ingest + idempotent externalId
- Ack/close/case; case creates I11 incident; illegal transitions
- Web typecheck
- Regression I12 + I11

## Acceptance criteria

1. Carol can ingest a Dev/Test alert and open an I11 incident case from **Security → SOC**.
2. Alice and partner cannot read SOC APIs.
3. No second casefile table; case is an I11 incident.
4. Health increment is `I13`.
5. No SIEM product name, correlation engine, or log lake.

## Exclusions

- I14+ PAM/vault, I15+ GRC, C11, numeric placeholder IDs
- Production SIEM, UAT, autonomous AI containment

## Verification limitations

Live preview / live PostgreSQL: live preview **VERIFIED** after Dev/Test `dev:preview` restart. Live PostgreSQL remains UNVERIFIED.

## Rollback

Additive migration and in-memory collection. Disable routes by not registering them; no destructive SQL.

## Dependencies

I11 tickets + CI link. I12 is predecessor in the backlog (telemetry exists) but I13 does not require the observability map at runtime.
