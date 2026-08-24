# I17 BCM Backup Evidence — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I17** |
| Capability name | BCM backup evidence register (jobs + restore probes) |
| Predecessor | ADR-0011; I16 complete (not a runtime dependency); I0 kernel |
| Architecture status | This document is the I17 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `089_i17_bcm_backup_evidence.sql`. ADR-0017 not reopened |
| Runtime health increment | `I17` |
| Production / UAT / AI | Not authorized |

Authority: backlog I17 (19:00 EAT job, restore probe evidence; hot site excluded) plus explicit 2026-08-24 governance **I17=A**: Dev/Test evidence-register backup model. No named backup product, appliance, vendor, hot site, or production recovery platform.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **BCM** workspace where an operator can record that a 19:00 EAT backup **slot** ran and that a **different** principal recorded a restore probe — not a backup product and not a DR environment.

Job completion without a passed restore probe remains **unproven** (ADR-0011).

## Scope

| Deliverable | In scope |
| --- | --- |
| Backup job create / list / get | Yes |
| One job per tenant per `backupDate` | Yes |
| `scheduledFor` always 19:00 Africa/Nairobi | Yes |
| Job statuses: `scheduled` → `completed` \| `failed` | Yes |
| Restore probe create / list on a completed job | Yes |
| Probe outcomes: `passed` \| `failed` | Yes |
| Derived `proven` = completed + at least one passed probe | Yes |
| Object-level SoD: job creator cannot record a probe | Yes |
| Role `bcm.member` | Yes |
| Tenant-scoped `/v1/bcm/health` increment `I17` | Yes |
| Visible **BCM → Backup evidence** | Yes |
| Real PostgreSQL / object-store / event-store backup | No |
| Backup appliance / vendor / remote copy product | No |
| Hot site / restore-test environment | No |
| Crisis command center (I18) | No |

## Domain model

**bcm_backup_jobs**

- `jobCode` unique per tenant (`JOB-0001`)
- `backupDate` required (`YYYY-MM-DD`), unique per tenant
- `scheduledFor` derived 19:00 EAT for that date (stored UTC; EAT is UTC+3 with no DST — Dev/Test decision)
- optional `note` (max 2000) — operator text, not a backup blob
- `status`: `scheduled` \| `completed` \| `failed`
- timestamps + createdByPrincipalId (used for SoD; not returned)

**bcm_restore_probes**

- `probeCode` unique per tenant (`PRP-0001`)
- `jobId` required, same tenant, job must be `completed`
- `outcome`: `passed` \| `failed`
- optional `note` (max 2000)
- timestamps + createdByPrincipalId (not returned)

Failed and completed jobs are terminal. Probes are immutable after create. No BIA, continuity-plan, or exercise tables.

## Persistence / migration

`089_i17_bcm_backup_evidence.sql`. Runtime in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

### Job

| From | Action | To |
| --- | --- | --- |
| (none) | create with `backupDate` | scheduled |
| scheduled | complete | completed — **unproven** until a passed probe |
| scheduled | fail | failed — terminal; no probes |
| completed / failed | complete / fail | deny |
| scheduled | patch note | scheduled |

### Probe

| From | Action | To |
| --- | --- | --- |
| (none) | create on **completed** job by a **different** principal | passed or failed |
| (none) | create by job creator | deny SoD |
| (none) | create on scheduled or failed job | deny |

## Separation of duties

Same-object SoD: the principal who created the backup job cannot record a restore probe (`403`, reason `sod`). Recoverability attestation must be a second pair of eyes.

Dev/Test seed: Bob holds `bcm.member` in addition to finance/HR/audit so a second operator can record the probe (same pattern as I10 / I16). Carol (`platform.admin`) can record jobs; she cannot probe her own jobs.

## API

Prefix `/v1/bcm`. JSON omits `tenantId` and `principalId`. Probe JSON may include `jobId` and `jobCode`. Job JSON includes derived `proven`, `probeCount`, `passedProbeCount`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/bcm/health` | `bcm:read:job` |
| GET | `/v1/bcm/jobs?q=&status=` | `bcm:read:job` |
| POST | `/v1/bcm/jobs` | `bcm:write:job` |
| GET | `/v1/bcm/jobs/:id` | `bcm:read:job` |
| PATCH | `/v1/bcm/jobs/:id` | `bcm:write:job` |
| POST | `/v1/bcm/jobs/:id/complete` | `bcm:write:job` |
| POST | `/v1/bcm/jobs/:id/fail` | `bcm:write:job` |
| GET | `/v1/bcm/jobs/:id/probes` | `bcm:read:probe` |
| POST | `/v1/bcm/jobs/:id/probes` | `bcm:write:probe` |
| GET | `/v1/bcm/probes/:id` | `bcm:read:probe` |

## RBAC

| Permission | Intent |
| --- | --- |
| `bcm:read:job` | Health + list/get jobs |
| `bcm:write:job` | Create / patch / complete / fail |
| `bcm:read:probe` | List/get probes |
| `bcm:write:probe` | Record probe (SoD still applies) |

`platform.admin` — all. Role `bcm.member` — all four. Alice and partner — 403. Bob seed includes `bcm.member` for SoD completion.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404. A probe cannot reference a cross-tenant job.

## UI

- `/commercial/bcm`
- Nav section **BCM → Backup evidence**
- Record job (date + optional note), queue, detail with complete/fail
- Record probe on a completed job (SoD error if self)
- Proven / unproven badges; loading / empty / error states
- Copy states this is an evidence register, not a backup product

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Probe by job creator | 403 `sod` |
| Invalid / missing `backupDate` | 400 `invalid_date` |
| Duplicate `backupDate` for tenant | 409 `duplicate_date` |
| Illegal job transition / patch after terminal | 409 `invalid_transition` |
| Probe on non-completed job | 409 `not_completed` |
| Invalid probe outcome | 400 `invalid_outcome` |

## Security

No tenant/principal ids in JSON. No file uploads. No backup blobs. No autonomous restore. SoD is server-enforced. This module does not connect to PostgreSQL dump, object storage, or a restore-test host.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create job, complete, self-probe denied, Bob records passed probe, job becomes proven
- Fail job; probes rejected; duplicate date rejected
- Web typecheck
- Regression I16

## Acceptance criteria

1. Carol can record a 19:00 EAT backup job and mark it completed from **BCM → Backup evidence**.
2. Carol cannot record a restore probe on her own job; Bob can.
3. A completed job is unproven until a passed probe exists; health counts unproven completed jobs.
4. Alice and partner cannot read BCM APIs.
5. Health increment is `I17`.
6. No backup vendor, appliance, hot site, or production copy is introduced.

## Exclusions

- I18 crisis / emcomms / exercises
- I15 remaining compliance/privacy, I22 partner edge
- Production backup product selection
- Numeric placeholder IDs, UAT, Production

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview restart is authorized only as Dev/Test verification so `/v1/bcm` (and prior I14–I16/I19) routes exist on 8080.

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 kernel patterns. ADR-0011 I17=A. I16 is not a runtime dependency.
