# E1 KRI Register — Stage 1 Preview

> **CURRENT STATE (2026-08-25 Path B E1 Stage 1 authoring — proposed contract, not approval, not execution)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed implementation HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae` (P2). ITA1 Stage 2 and ITL1 Stage 2 remain **in the working tree**; commit is **not** authorized by this document.  
> ITA1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. ITL1 Stage 2 remains **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. This document does **not** reopen ITA1 or ITL1 and is **not** ITA1.x / ITL1.x.  
> I15 ERM remains **CLOSED**. This document does **not** reopen I15 and is **not** I15.x.  
> I11, ITC1, ITP1, ITR1, P1, P2, G1–G5, K1, and K2 remain **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **PREVIEW=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=KRI_REGISTER** · **CAPABILITY_ID=E1** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=PROPOSED** · **STAGE_1_APPROVED=NO** · **IMPLEMENTATION_AUTHORIZED=NO**

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **E1** |
| Capability name | KRI Register |
| Family | erm |
| Domain | ERM (`erm` — domain map 2.2 aggregate **KRI**) |
| Predecessor | I2 kernel (complete); I15 ERM risk register complete and **not** reopened |
| Architecture status | This document is the E1 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 PROPOSED / AWAITING APPROVAL** |
| Implementation status | **NOT AUTHORIZED** |
| Environment | Development/Test only |
| Persistence | Conceptual only in this Stage 1. If later authorized: in-memory `Store` + additive SQL. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record by this contract. |
| Runtime health increment | `E1` (must not replace I15 `/v1/erm/health`) |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **E1** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **PROPOSED** |
| **STAGE_1_APPROVED** | **NO** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
| **PREVIEW** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **EMPTY** |

Authority: 2026-08-25 Operator **PATH B — KRI REGISTER CAPABILITY SELECTION** (ID **E1** assigned by [`e1-kri-register-authorized.md`](../governance/e1-kri-register-authorized.md)), and 2026-08-25 Operator **E1 — KRI REGISTER STAGE 1 CONTRACT AUTHORING ONLY**. This Stage 1 document is a **proposed** architecture contract. It does **not** approve Stage 1, does **not** authorize implementation, preview, UAT, Production, commit, or push, and does **not** reopen I15 / ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 / P1 / P2 / G1–G5. This is not I15.x, not G6, not K3, not a Treatment Register, and not a KRI calculation or monitoring platform.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

The sections after this heading are the **proposed** architecture contract. Implementation must not begin until a separate explicit execution instruction (`IMPLEMENTATION_AUTHORIZED=YES` / `ENVIRONMENT=DEVTEST`) after Stage 1 approval.

---

## Objective

Deliver a **Risk / ERM** workspace surface where an authorised human can record **KRI register rows**: a human catalogue/governance record that a Key Risk Indicator **exists**, or was retired.

**KRI Register = catalogue/governance record of KRIs.**  
**KRI Register ≠ metric engine.**

E1 is **not** automated KRI calculation, not formulas, not thresholds, not alerting, not notifications, not time-series measurements, not scheduled jobs, not dashboards, not trend analytics, not scoring engines, not automated escalation, not a Treatment Register, not I15 mutation, not legal-opinion functionality, not G3 findings, and not AI mutation. It is not a redesign of I15 Risk.

Domain map 2.2 names **KRI** under `erm` after Risk and beside Treatment, owned by CRO. I15 shipped the residual-risk register only and left “KRI catalogue / treatment projects as separate aggregates” out of scope. **E1 is the smaller proposed-shape KRI register only.** Treatment remains out of scope.

This is a **register**, not a KRI monitoring platform.

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **E1 KRI** | A human record that a **KRI definition exists** in the catalogue (or was retired) | New store `ermKris` |
| **I15 Risk** | A human residual-risk register row | Closed — not reopened; optional `riskId` reference only |
| **Treatment** | Treatment projects as a separate aggregate | Out of scope — I15 already has treatment **status** on risks; do not create a Treatment Register |
| **G3 Finding** | Compliance findings register | Closed — not a KRI |
| **I15 likelihood/impact** | Risk scores on `erm_risks` | Closed — not copied onto KRIs |

**I15 Risk** records that a residual **risk** exists.  
**E1 KRI** records that a **Key Risk Indicator** is listed in the human catalogue.

Distinctness from I15 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra metric fields. Do **not** add formula, unit, target, threshold, direction, frequency, last value, trend, or owner-principal fields merely to enlarge the distinction. Those fields would turn E1 into a metric engine.

Do **not** use store key `ermKri` (singular) or reuse `ermRisks`. The E1 key is **`ermKris`** (plural).

Do **not** create `/v1/erm/risks/:id/kri`. That would hang KRI product behaviour off I15. E1 has its own collection. I15 `/v1/erm/health` increment remains **I15**.

## Scope

| Deliverable | In scope |
| --- | --- |
| KRI create / list / get / patch (while `open`) | Yes |
| KRI codes `KRI-0001` unique per tenant | Yes |
| Statuses: `open` → `retired` (`retired` terminal) | Yes |
| Required `title`; optional `notes`; optional `ownerLabel` | Yes |
| Optional `riskId` — simple same-tenant I15 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `erm.kri` | Yes |
| Tenant-scoped `/v1/erm/kris/health` increment `E1` | Yes |
| Visible Risk UI for the KRI register | Yes — I15 **Risk → Register** remains I15 |
| I15 risk redesign / mutation | No |
| Treatment Register | No |
| Metric engine / thresholds / alerting / time-series / dashboards | No |
| G3 findings | No |

Required field is **`title`**, matching ITA1/ITL1/ITR1/P2/G2 registers.

Code prefix is **`KRI-`**, matching sibling noun prefixes (`RSK-`, `OBL-`, `CTL-`, `FND-`), not the capability id `E1`. Repository search found no existing `KRI-` allocator and no `/v1/erm/kris` collection.

No numeric measurement fields. No date fields as measurement, review-cycle, or automatic status drivers. Do **not** copy H1 optional `issuedOn` / `expiresOn`. Do **not** copy I15 `likelihood` / `impact`.

Do **not** use statuses `active`, `monitoring`, `breached`, `ok`, `green`, `amber`, `red`, `alerting`, `in_force`, `done`, or `cancelled`. I15 already uses `open` / `mitigating` / `accepted` / `closed` for risks. G2 uses `active` for controls in force. E1 uses only **`open` / `retired`** so catalogue membership is not mistaken for a live monitoring state.

## Domain model

**erm_kris** (runtime store key `ermKris` — not I15 `ermRisks`, not G1–G5 keys, not SAMPLE keys)

- `id`
- `kriCode` unique per tenant (`KRI-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- optional `ownerLabel` (operator text, not a principal id)
- optional `riskId` (I15 `erm_risks.id` in the same tenant)
- `status`: `open` \| `retired`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ kri: ... }`. List wraps as `{ items }` (ITA1/P2/ITL1 pattern). JSON may include a read-only `riskCode` resolved from I15 at response time when `riskId` is set. I15 rows are not patched.

No formula, unit, target, threshold, direction, frequency, cadence, lastValue, trend, score, ragStatus, owner principal id, treatmentId, findingId, or measurement series.

`open` means the human listed the KRI in the **catalogue**. It is **not** “currently measured”, not “within threshold”, not “alerting”, and not an I15 risk `open` status.  
`retired` means the human withdrew the KRI from the current catalogue. It is **not** a closed risk, not a G3 finding close, and not an automated expiry.

## Relationship to I15 Risk

**Optional `riskId` is included.** Evidence: G2 optional `obligationId` against closed G1; G3 optional `controlId`; G5 optional G1/G2 references. I15 treated KRI as a **separate aggregate**, not a child table of `erm_risks`. Domain map lists Risk and KRI as sibling `erm` aggregates.

Rules:

- `riskId` is **not** required to create a KRI. An enterprise-level KRI may exist with no risk link.
- If supplied, it must identify an existing I15 risk in the actor's tenant (any I15 status). Missing or other-tenant ids → `400` `risk_not_found`.
- The reference is a scalar identifier only. Creating, patching, or retiring a KRI does **not** change I15 status, scores, owner, or title.
- No cascade, no inverse collection on I15, no `/v1/erm/risks/:id/kris`.
- Do not add `riskIds[]` many-to-many. One optional scalar is the G2-sized maximum.

I15 is **not** a hard runtime prerequisite beyond “the I15 risk module already exists in Dev/Test so a same-tenant id can be validated if the client sends one.”

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `erm_kris` table; do **not** `ALTER` `erm_risks`);
- `UNIQUE (tenant_id, kri_code)`;
- `risk_id` nullable; **no** foreign-key cascade to `erm_risks` required (identifier validation in the service, matching G2-style reference semantics);
- live PostgreSQL UNVERIFIED;
- PostgreSQL is **not** a newly established system of record;
- intended `schema_registry` context_key `erm-kris`;
- additive filename assigned at implementation to the next free number — **do not** invent a number that depends on uncommitted ITA1/ITL1 migrations;
- ADR-0017 **not** reopened.

## Workflow

| From | Action | To | Purpose |
| --- | --- | --- | --- |
| (none) | create with title (optional notes, ownerLabel, riskId) | open | List a KRI in the catalogue |
| open | patch title / notes / ownerLabel / riskId | open | Maintain catalogue metadata while listed |
| open | patch status to `retired` | retired | Human withdraws the KRI from the current catalogue |
| retired | patch | deny | Terminal — no silent reactivation |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule (create ignores client status and writes `open`).

**Why these states (minimum):** a catalogue needs “listed” and “withdrawn”. A third `draft`/`active` pair is not required for the smallest coherent register. `done`/`cancelled` (ITA1/ITL1/P2 work-item pair) would imply a completed task, not a standing indicator definition. `active` (G2) would be easy to misread as live monitoring.

No dedicated calculate, measure, threshold, alert, notify, series, dashboard, score, schedule, treat, or escalate endpoints. Lifecycle uses **PATCH status** only (bounded surface as ITA1/ITL1/P2). Illegal status change → `409` `invalid_transition`. Patch when `retired` → `409` `retired`.

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance for a new decision or a revised Stage 1. Do not silently expand this contract:

- formulas / calculation / derived values
- thresholds / targets / RAG / direction / unit of measure
- alerting / notifications / escalation
- time-series / measurements / last value / trend / dashboards
- scheduled jobs / cadence / review dates as engines
- Treatment Register / treatment project rows
- `riskId` required, many-to-many risks, or I15 mutation
- G3 findings linkage
- legal-opinion / scoring engines
- AI mutation
- I15 / G1–G5 / ITA1 / ITL1 mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous KRI creation, calculation ingest, or retirement.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency. Do not reopen ADR-0012 or ADR-0013.

## API

Prefix `/v1/erm/kris`. Do **not** attach E1 to `/v1/erm/health` or `/v1/erm/risks*`. I15 `/v1/erm/health` and `/v1/erm/risks*` are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

Repository search found no existing `/v1/erm/kris` collection. These routes are the intended **new** collection, consistent with P2 `/v1/privacy/dpias` beside an existing domain prefix.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/erm/kris/health` | `erm:read:kri` |
| GET | `/v1/erm/kris?q=&status=` | `erm:read:kri` |
| POST | `/v1/erm/kris` | `erm:write:kri` |
| GET | `/v1/erm/kris/:id` | `erm:read:kri` |
| PATCH | `/v1/erm/kris/:id` | `erm:write:kri` |

Health increment is `E1` (distinct from I15). Intended health shape follows ITA1/ITL1: `module` `erm-kris`, `increment` `E1`, `status` `ok`, `kris` count, `openKris` count.

Do not add calculate, measure, threshold, alert, notify, series, dashboard, score, schedule, treat, finding, or automation routes. Forbidden engine subroutes on `/v1/erm/kris/:id/` return **404**.

**Required residual I15 protection (unchanged):** `POST /v1/erm/risks/:id/kri` (and any I15 `calculate` / `threshold` / `alert` subroutes) remain **404** if not already present. E1 implementation must not hang KRI product behaviour off I15.

Conceptual request/response:

- **Create** body: `{ title, notes?, ownerLabel?, riskId? }` → `{ kri }` with server `kriCode`, `status: "open"`.
- **Patch** body while `open`: any of `title`, `notes`, `ownerLabel`, `riskId` (including JSON `null` to clear the reference), or `status: "retired"`.
- **List** `{ items }` with optional `q` (title/code substring) and `status`.
- **Get** `{ kri }` including optional read-only `riskCode` when linked.

## RBAC

| Permission | Intent |
| --- | --- |
| `erm:read:kri` | Health + list/get |
| `erm:write:kri` | Create / patch (including human retire) |

`platform.admin` — both (additive seed only). Role **`erm.kri`** — both. Alice and partner — 403. At implementation time, Bob seed includes `erm.kri` so the architecture role is exercised.

Existing `risk.member` (`erm:read:risk` / `erm:write:risk`) is **not** reused for E1 write or E1-only read. KRI write is **not** granted automatically to every `risk.member`. This matches G2 (`grc.control` not given to `compliance.member`) and P2 (`privacy.dpia` not given to every `dpo`).

Do not invent a second ERM admin role. Do not broaden I15 permissions. Do not update `docs/architecture/24-rbac-abac-model.md` in this Stage 1 authoring task (implementation-time seed only, if later authorized).

## Tenant isolation

Tenant-scoped. Collection queries are tenant-filtered. Missing / wrong-tenant KRI id → 404 (do not disclose another tenant’s record). I15 isolation unchanged. No cross-tenant administrative behaviour.

## Audit / security

ITA1/ITR1/P2/ITL1 register services do **not** call `recordAudit`. E1 must match that sibling class. Do not introduce a new audit subsystem or a new hash-chain writer solely for E1. I0 audit/hash-chain remains available to other modules and is not redesigned here.

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM/metrics adapters. Human-only gates are server-enforced. Status is never treated as a measurement result, threshold outcome, or executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

## UI / navigation

Intended UX contract only. Do **not** implement pages or navigation in this Stage 1 authoring task.

- `/commercial/erm/kris` (no existing page; sibling of `/commercial/erm`)
- Nav **Risk → KRIs** after **Risk → Register** (existing **Risk → Register** unchanged except optional additive link)
- Register KRI (title + optional notes, owner label, optional I15 risk picker)
- Queue/list, filters `q` / status, detail with retire (from `open` via patch status)
- Open / retired badges; loading / empty / error / authorization-failure states
- Copy states this is a **KRI Register**, never a KRI engine, dashboard, threshold monitor, or I15 Risk replacement

Do not create KRI dashboards, sparkline charts, RAG tiles, threshold editors, measurement capture forms, or treatment-project suites.

## Search / filter / sort

List supports `q` (title / `kriCode` substring) and `status`, consistent with ITA1/ITL1/G2/P2 registers. Default list order: newest first (existing register convention). No analytics, grouping by risk, threshold monitoring, or time-series behaviour.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Title longer than 200 | 400 `title_too_long` |
| Notes longer than 2000 | 400 `notes_too_long` |
| Unknown / other-tenant `riskId` | 400 `risk_not_found` |
| Illegal status change | 409 `invalid_transition` |
| Patch when retired | 409 `retired` |

Allocated `KRI-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, kri_code)` if SQL is later added).

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `retired`
- Terminal records reject further patch (`409` `retired`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`KRI-0001`, then `KRI-0002`)
- Optional `riskId`: valid same-tenant I15 id accepted without mutating the risk; missing/other-tenant → `400` `risk_not_found`; omitted `riskId` allowed
- Forbidden engine subroutes on `/v1/erm/kris/:id/` (`calculate`, `measure`, `threshold`, `alert`, `notify`, `series`, `dashboard`, `score`, `schedule`, `treat`, …) return 404
- I15 residual: `/v1/erm/health` remains increment `I15`; `/v1/erm/risks/:id/kri` remains 404
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `erm.kri` has only the E1 permission pair; `risk.member` does not gain E1 perms
- Kernel allocator/status helpers analogous to sibling register tests
- Web typecheck
- UI: **Risk → KRIs** register / queue / detail / retire (implementation-time browser verification)
- Regression: I15 health remains `I15`; store key `ermRisks` unchanged in meaning; G1–G5 / P2 / ITA1 / ITL1 freeze as applicable
- If I15 freeze tests currently assert absence of a kris collection, updating those fixtures to allow the new `ermKris` key is **test-fixture evolution only**, not an I15 reopen. Do not add `ermKris` assertions that fail because `"ermObligations" in store` must remain false.

## Acceptance criteria (when implementation is authorized)

Contract-level. Not code-level.

1. Carol can register a KRI and retire it from **Risk → KRIs**.
2. Alice and partner cannot read KRI APIs.
3. Health increment on `/v1/erm/kris/health` is `E1`. I15 `/v1/erm/health` remains `I15`.
4. Optional I15 `riskId` is a same-tenant reference only; I15 rows are unchanged.
5. A KRI can be created with no `riskId`.
6. Store key is `ermKris`. I15 `ermRisks` is not reused. No G3/SAMPLE keys reused.
7. I15 remains closed. No Treatment Register. SAMPLE remains deferred.
8. `/v1/erm/risks/:id/kri` remains 404.
9. The UI and API copy present a catalogue/governance register, not a metric engine.

## Exclusions / Not included

- Automated KRI calculation; formulas; derived values
- Thresholds; targets; RAG; direction; unit of measure
- Alerting; notifications; automated escalation
- Time-series storage; measurements; last value; trend analytics; dashboards
- Scheduled jobs; calculation cadence; review-cycle engines
- Scoring engines
- Treatment Register; treatment project rows; I15 treatment-status mutation
- I15 reopen; mutation of I15 Risk records; I15.x
- Legal-opinion automation
- G3 findings
- SAMPLE
- Consent; Endpoint; UEM; MDM; Dataset / Data Governance
- ITA1 / ITL1 mutation or commit of their working-tree changes
- Corporate IdP; vault; SIEM; live metrics backends
- AI mutation
- Numeric placeholder IDs I15.x / G6 / K3 / H2 / O7 / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24
- I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll
- UAT; Production
- PostgreSQL as a newly established system of record
- ADR-0006 / ADR-0012 / ADR-0013 implementation
- Push; commit

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is **not** authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an E1 defect. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an E1 product defect. This Stage 1 pass must **not** start runtimes or perform live verification.

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter I15 schema or behaviour to “make room” for E1.

## Dependencies

| Kind | Item |
| --- | --- |
| Hard prerequisites | I0 kernel patterns (tenancy / RBAC / human actor). I15 **CLOSED** and present so optional `riskId` can be validated — I15 is not reopened and is not a write dependency. |
| Optional references | Same-tenant I15 `riskId` |
| Non-dependencies | ITA1, ITL1, G1–G5 write, G3, Treatment, Consent, Endpoint/UEM, Dataset, ADR-0006/0012/0013, live PostgreSQL as SoR, new vendors |

## Risks and unresolved decisions (require Stage 1 approval)

These are **not** silently decided beyond the proposed default in this contract. Stage 1 approval accepts or rejects the defaults.

1. **Optional `riskId`** — proposed **yes** (G2-style). Approval may strike the field entirely; do not make it required.
2. **Lifecycle `open` / `retired`** — proposed as the minimum catalogue pair. Approval may instead demand G2 `draft` / `active` / `retired`; if so, `active` must still be defined as catalogue adoption, not monitoring.
3. **Dedicated role `erm.kri`** — proposed so I15 `risk.member` is not broadened. Approval may instead grant E1 perms to `risk.member`; that would be a deliberate I15 permission-model change and should be called out, not assumed.
4. **No formula/unit/threshold fields** — proposed. Any later “just one target number” is a new increment, not an E1 patch.
5. **ITA1/ITL1 working tree** remains `COMMIT=NOT_AUTHORIZED` and is not an E1 dependency.

## Governance / authority matrix

```text
CAPABILITY=KRI_REGISTER
CAPABILITY_ID=E1
STAGE_1_STATUS=PROPOSED
STAGE_1_APPROVED=NO
IMPLEMENTATION_AUTHORIZED=NO
EXECUTION_QUEUE=EMPTY
PREVIEW=NOT_AUTHORIZED
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
COMMIT=NOT_AUTHORIZED
PUSH=NOT_AUTHORIZED
```

Operator next step: **Stage 1 approval** (separate). Then, only if granted, implementation authorization. This is not I15.x, not a Treatment Register, not a metric engine, not Endpoint/UEM/Consent/Dataset, and not a commit/push authorization.
