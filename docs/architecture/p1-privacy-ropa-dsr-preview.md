# P1 Privacy RoPA + DSR — Preview

> **CURRENT STATE (2026-08-24 Path B P2 selection + Stage 1 authoring — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2; P1 remains closed)  
> P1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `092_p1_privacy_ropa_dsr.sql`).  
> Consent / DPIA **product** / DLP / live erasure remain inventory / **NOT AUTHORIZED** as P1 work. No P1.x. **P2** DPIA Register is **SELECTED**; Stage 1 is **approved**; Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test (not a P1 reopen). See [`../governance/p2-dpia-register-authorized.md`](../governance/p2-dpia-register-authorized.md) and [`p2-dpia-register-preview.md`](p2-dpia-register-preview.md). **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **P1** |
| Capability name | Privacy RoPA + DSR register |
| Predecessor | I2 kernel (complete); I15 ERM complete and **not** reopened; G1 complete and **not** reopened |
| Architecture status | This document is the P1 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `092_p1_privacy_ropa_dsr.sql`. ADR-0017 not reopened |
| Runtime health increment | `P1` |
| Production / UAT / AI | Not authorized |

Authority: 2026-08-24 governance **PRIV=A** and [`p1-privacy-ropa-dsr-authorized.md`](../governance/p1-privacy-ropa-dsr-authorized.md). ID **P1** is assigned by that record. This is not I15 and not I15.x.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Privacy** workspace where an operator can maintain a tenant-scoped **RoPA (processing-activity) register** and **DSR case register** — not a consent platform, not a DPIA product, not DLP, and not live erasure.

## Scope

| Deliverable | In scope |
| --- | --- |
| Processing-activity create / list / get / patch (while not retired) | Yes |
| Activity codes `RPA-0001` unique per tenant | Yes |
| Activity statuses: `open` → `retired` (retired terminal) | Yes |
| Optional activity `purpose` and `ownerLabel` | Yes |
| DSR create / list / get / patch (while not closed) | Yes |
| DSR codes `DSR-0001` unique per tenant | Yes |
| DSR types: `access` \| `erasure` \| `rectification` (case labels only) | Yes |
| DSR statuses: `open` → `in_progress` → `closed` (closed terminal) | Yes |
| Optional DSR `subjectLabel` and `note` (operator text, not a principal id) | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Object-level SoD: DSR creator cannot close | Yes |
| Role `dpo` | Yes |
| Tenant-scoped `/v1/privacy/health` increment `P1` | Yes |
| Visible **Privacy → RoPA** and **Privacy → DSR** | Yes |
| Live data erasure / production deletion | No |
| Consent-management platform | No |
| DPIA product | No |
| DLP | No |
| Legal-opinion automation / PDPA/GDPR engines | No |
| Live regulatory integrations | No |

## Domain model

**privacy_processing_activities** (in-memory key `privacyProcessingActivities`)

- `activityCode` unique per tenant (`RPA-0001`)
- `title` required
- `status`: `open` \| `retired`
- optional `purpose`, optional `ownerLabel`
- timestamps + createdByPrincipalId (not returned)

**privacy_dsr_cases** (in-memory key `privacyDsrCases`)

- `dsrCode` unique per tenant (`DSR-0001`)
- `requestType`: `access` \| `erasure` \| `rectification`
- `status`: `open` \| `in_progress` \| `closed`
- optional `subjectLabel`, optional `note`
- timestamps + createdByPrincipalId (not returned; used for SoD)

Do not use store keys `privacyRopa` or `privacyDsr` (G1 regression asserts those remain absent). No consent, DPIA, DLP, or live-erasure tables.

An `erasure` DSR is a **case label**. Closing it does not delete tenant data, PostgreSQL rows, or production records.

## Persistence / migration

`092_p1_privacy_ropa_dsr.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

### Processing activity

| From | Action | To |
| --- | --- | --- |
| (none) | create with title | open |
| open | patch title / purpose / ownerLabel | open |
| open | retire | retired |
| retired | patch / retire | deny |

### DSR

| From | Action | To |
| --- | --- | --- |
| (none) | create with requestType | open |
| open | patch subjectLabel / note / requestType | open |
| open | start | in_progress |
| in_progress | patch subjectLabel / note | in_progress |
| in_progress | close (not creator) | closed |
| in_progress | close (creator) | deny `sod` |
| open / closed | close | deny |
| closed | patch / start / close | deny |

## Human-only mutation

Create, patch, retire, start, and close require `actorType === "Human"`. Non-Human → `403`, reason `ai_actor`.

## API

Prefix `/v1/privacy`. JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/privacy/health` | `privacy:read:activity` |
| GET | `/v1/privacy/activities?q=&status=` | `privacy:read:activity` |
| POST | `/v1/privacy/activities` | `privacy:write:activity` |
| GET | `/v1/privacy/activities/:id` | `privacy:read:activity` |
| PATCH | `/v1/privacy/activities/:id` | `privacy:write:activity` |
| POST | `/v1/privacy/activities/:id/retire` | `privacy:write:activity` |
| GET | `/v1/privacy/dsrs?q=&status=` | `privacy:read:dsr` |
| POST | `/v1/privacy/dsrs` | `privacy:write:dsr` |
| GET | `/v1/privacy/dsrs/:id` | `privacy:read:dsr` |
| PATCH | `/v1/privacy/dsrs/:id` | `privacy:write:dsr` |
| POST | `/v1/privacy/dsrs/:id/start` | `privacy:write:dsr` |
| POST | `/v1/privacy/dsrs/:id/close` | `privacy:write:dsr` |

## RBAC

| Permission | Intent |
| --- | --- |
| `privacy:read:activity` | Health + activity list/get |
| `privacy:write:activity` | Activity create / patch / retire |
| `privacy:read:dsr` | DSR list/get |
| `privacy:write:dsr` | DSR create / patch / start / close |

`platform.admin` — all four. Role `dpo` — all four. Alice and partner — 403. Bob seed includes `dpo` so SoD close can be exercised.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/privacy` — **Privacy → RoPA**
- `/commercial/dsr` — **Privacy → DSR**
- Register activity (title + optional purpose/owner); queue; retire
- Register DSR (type + optional subject label/note); queue; start; close
- Copy states this is a register, not live erasure, consent, DPIA, or legal interpretation
- Closed / in-progress / open / retired badges; loading / empty / error states
- DSR close copy: creator cannot close; sign in as Bob to close a case Carol opened

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| DSR creator closes | 403 `sod` |
| Invalid / missing title | 400 `title_required` |
| Invalid DSR type | 400 `invalid_request_type` |
| Illegal transition | 409 `invalid_transition` |
| Patch when retired / closed | 409 `retired` / `closed` |

## Security

No tenant/principal ids in JSON. No file uploads. No legal AI. Human-only and SoD gates are server-enforced. Erasure cases do not delete data.

## Testing

- 401/403 Alice/partner, tenant isolation, response identity
- Activity create, patch, retire; DSR create, start, SoD close, Bob close
- AiAgent mutate denied
- Web typecheck
- Regression G1 Compliance, I15 ERM, I16 Internal Audit, I13 SOC

## Acceptance criteria

1. Carol can register a processing activity and retire it from **Privacy → RoPA**.
2. Carol can open a DSR, start it, and is denied close (`sod`); Bob can close it from **Privacy → DSR**.
3. Alice and partner cannot read privacy APIs.
4. Health increment is `P1`.
5. No consent, DPIA, DLP, or live-erasure tables. Store keys `privacyRopa` / `privacyDsr` remain absent.
6. I15 and G1 remain closed.

## Exclusions

- I21=D, I22=D, I23=D, EMCOMMS=D, EXER=D, CAL=D, PO=D
- UAT, Production, live regulatory feeds, live erasure
- Numeric placeholder IDs I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only so `/v1/privacy` exists on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. Architecture ch.24 role `dpo`. I15 and G1 are not runtime dependencies and are not reopened.
