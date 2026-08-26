# E2 Treatment Register — Stage 1 Preview

> **CURRENT STATE (2026-08-26 Operator E2 GOVERNANCE CLOSURE — Development/Test complete / accepted)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`68ed0994de8703b89e7c233282af8f3c0f38108e`** (this HEAD **is** the E2 implementation commit)  
> E2 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED / ACCEPTED** for Development/Test (additive SQL `108_e2_erm_treatments.sql`).  
> I15 ERM remains **CLOSED**. This document does **not** reopen I15 and is **not** I15.x. I15 risk `status`, likelihood, impact, and residual-risk scoring remain untouched.  
> E1 KRI remains **CLOSED**. This document does **not** reopen E1 and is **not** E1.x.  
> ITA1 and ITL1 remain **CLOSED** (Stage 2 is on `master`; not an E2 reopen). I11, ITC1, ITP1, ITR1, P1, P2, G1–G5, K1, and K2 remain **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **PREVIEW_RESULT=PASS** · **OWNER/HUMAN_PREVIEW_RESULT=PASS** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=TREATMENT_REGISTER** · **CAPABILITY_ID=E2** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **E2** |
| Capability name | Treatment Register |
| Family | erm |
| Domain | ERM (`erm` — domain map 2.2 aggregate **Treatment**) |
| Predecessor | I2 kernel (complete); I15 ERM risk register complete and **not** reopened; E1 KRI register complete and **not** reopened |
| Architecture status | This document is the E2 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; STAGE 2 COMPLETE / ACCEPTED (DEV/TEST)** |
| Implementation status | **IMPLEMENTED / COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` + additive SQL `108_e2_erm_treatments.sql`. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record by this contract. |
| Runtime health increment | `E2` (must not replace I15 `/v1/erm/health` or E1 `/v1/erm/kris/health`) |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **E2** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **COMMIT** | **EXECUTED** (`68ed0994de8703b89e7c233282af8f3c0f38108e`) |
| **PUSH** | **EXECUTED** |
| **PREVIEW** | **AUTHORIZED** (Development/Test; executed) |
| **PREVIEW_RESULT** | **PASS** |
| **OWNER/HUMAN_PREVIEW_RESULT** | **PASS** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEW_CAPABILITY_AUTHORIZED** | **NONE** |

Authority: 2026-08-25 Operator **PATH B — OPERATOR SELECTION ONLY** (`CAPABILITY=TREATMENT_REGISTER` recorded by [`treatment-register-authorized.md`](../governance/treatment-register-authorized.md)); 2026-08-25 Operator **PATH B — TREATMENT REGISTER STAGE 1 AUTHORING ONLY**; 2026-08-25 Operator **E2 TREATMENT REGISTER STAGE 1 APPROVAL** and **IMPLEMENTATION AUTHORIZATION**; 2026-08-26 Operator **E2 DEVELOPMENT/TEST PREVIEW** (**PREVIEW_RESULT=PASS** / **OWNER/HUMAN_PREVIEW_RESULT=PASS**); 2026-08-26 Operator **E2 GOVERNANCE CLOSURE**. ID **E2** is assigned at the Stage 1 authoring gate because Path B Stage 1 contracts require an increment identity (filename, lifecycle table, health `increment`). It is **not** I15, **not** I15.x, **not** E1, **not** E1.x, **not** T1, **not** G6, **not** K3, and **not** a treatment engine. This document does **not** authorize UAT, Production, hosting, ADR-0006 closure, or a next increment, and does **not** reopen I15 / E1 / ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 / P1 / P2 / G1–G5.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

The sections after this heading are the **approved** architecture contract. The lifecycle table above is the **current** Development/Test closure state. The contract body is not a pending implementation queue.

---

## Objective

Deliver a **Risk / ERM** workspace surface where an authorised human can record **Treatment register rows**: a human catalogue/governance record that a treatment **exists**, or was retired.

**Treatment Register = catalogue/governance record of treatments.**  
**Treatment Register ≠ treatment engine.**

E2 is **not** a treatment-effectiveness engine, not residual-risk calculation, not risk scoring, not cost/effectiveness optimization, not formulas, not measurements, not units, not targets, not thresholds, not RAG, not time-series, not dashboards, not alerts, not notifications, not scheduled jobs, not automated scoring, not automated escalation, not a recommendation engine, not I15 mutation, not E1 mutation, not G3 findings, and not AI mutation. It is not a redesign of I15 Risk and not an E1.x.

Domain map 2.2 names **Treatment** under `erm` after Risk and KRI, owned by CRO. I15 shipped the residual-risk register only and left “KRI catalogue / **treatment projects as separate aggregates**” out of scope. E1 shipped the KRI catalogue leftover. **E2 is the remaining named leftover: a bounded Treatment Register only.**

This is a **register**, not a treatment-management or mitigation-tracking platform.

I15 already has a **risk lifecycle/status** (`open` / `mitigating` / `accepted` / `closed`) plus likelihood/impact on the risk row. That I15 field is **not** this aggregate. E2 must not replace, mirror, or drive those I15 semantics.

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **E2 Treatment** | A human record that a **treatment exists** in the catalogue (or was retired) | New store `ermTreatments` |
| **I15 Risk** | A human residual-risk register row, including I15 **risk** status and scores | Closed — not reopened; optional `riskId` reference only; **no** PATCH/mutation of I15 rows |
| **E1 KRI** | A human KRI-register row | Closed — not reopened; **no** `kriId` |
| **G3 Finding** | Compliance findings register | Closed — not a treatment |
| **I15 likelihood / impact** | Risk scores on `erm_risks` | Closed — not copied onto treatments; not recalculated by E2 |

**I15 Risk** records that a residual **risk** exists, and carries the risk’s own treatment **status** (`mitigating` / `accepted` / `closed`).  
**E2 Treatment** records that a **treatment** is listed in the human catalogue.

**Treatment lifecycle describes the Treatment Register record, not the lifecycle/status of the referenced I15 risk.**

Distinctness from I15 is **product identity** (codes, store, permissions, UI copy, exclusions) plus a hard write-isolation rule. Do **not** add effectiveness scores, residual-risk fields, priority, cost, due dates, RAG, strategy taxonomies (`avoid` / `mitigate` / `transfer` / `accept`), or KRI links merely to enlarge the distinction. Those fields would turn E2 into a treatment engine or a second I15.

Do **not** use store key `ermTreatment` (singular) or reuse `ermRisks` / `ermKris`. The E2 key is **`ermTreatments`** (plural).

Do **not** create `/v1/erm/risks/:id/treatment` or `/v1/erm/risks/:id/treatments`. That would hang Treatment product behaviour off I15. E2 has its own collection. I15 `/v1/erm/health` increment remains **I15**. E1 `/v1/erm/kris/health` increment remains **E1**.

## Scope

| Deliverable | In scope |
| --- | --- |
| Treatment create / list / get / patch (while `open`) | Yes |
| Treatment codes `TRT-0001` unique per tenant | Yes |
| Statuses: `open` → `retired` (`retired` terminal) | Yes |
| Required `title`; optional `notes`; optional `ownerLabel` | Yes |
| Optional `riskId` — simple same-tenant I15 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `erm.treatment` | Yes |
| Tenant-scoped `/v1/erm/treatments/health` increment `E2` | Yes |
| Visible Risk UI for the Treatment register | Yes — I15 **Risk → Register** remains I15; E1 **Risk → KRIs** remains E1 |
| I15 risk redesign / mutation (status, scores, residual) | No |
| E1 KRI mutation or required KRI link | No |
| Treatment engine / effectiveness / residual-risk calc / RAG / alerts | No |
| G3 findings | No |

Required field is **`title`**, matching ITA1/ITL1/ITR1/P2/G2/E1 registers.

Code prefix is **`TRT-`**, matching sibling noun prefixes (`RSK-`, `KRI-`, `OBL-`, `CTL-`, `FND-`), not the capability id `E2`. Repository search found no existing `TRT-` allocator and no `/v1/erm/treatments` collection except E1 freeze tests that currently assert that path is absent.

No numeric measurement fields. No date fields as due-date, SLA, review-cycle, or automatic status drivers. Do **not** copy H1 optional `issuedOn` / `expiresOn`. Do **not** copy I15 `likelihood` / `impact`. Do **not** copy I15 statuses `mitigating` / `accepted` / `closed`.

Do **not** use statuses `mitigating`, `accepted`, `closed`, `close`, `done`, `cancelled`, `in_progress`, `effective`, `ineffective`, `active`, `monitoring`, `green`, `amber`, or `red`. I15 already uses `open` / `mitigating` / `accepted` / `closed` for **risks**. P2/ITA1/ITL1 use `done` / `cancelled` for work-item registers. E2 uses only **`open` / `retired`** so catalogue membership is not mistaken for I15 risk treatment-status or for project completion.

## Domain model

**erm_treatments** (runtime store key `ermTreatments` — not I15 `ermRisks`, not E1 `ermKris`, not G3 `findingRecords`, not SAMPLE keys)

- `id`
- `treatmentCode` unique per tenant (`TRT-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- optional `ownerLabel` (operator text, not a principal id)
- optional `riskId` (I15 `erm_risks.id` in the same tenant)
- `status`: `open` \| `retired`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ treatment: ... }`. List wraps as `{ items }` (ITA1/P2/ITL1/E1 pattern). JSON may include a read-only `riskCode` resolved from I15 at response time when `riskId` is set. I15 rows are not patched.

No effectiveness, residualRisk, likelihood, impact, score, ragStatus, priority, cost, currency, dueDate, startDate, endDate, sla, formula, unit, target, threshold, direction, frequency, lastValue, trend, owner principal id, kriId, findingId, strategy/type taxonomy, or measurement series.

`open` means the human listed the treatment in the **catalogue**. It is **not** I15 risk `open`, not “currently mitigating a risk”, not “effective”, and not an in-progress project.  
`retired` means the human withdrew the treatment from the current catalogue. It is **not** an I15 `closed` risk, not I15 `accepted`, not a G3 finding close, and not automated completion.

## Relationship to I15 Risk

**Optional `riskId` is included.** Evidence: E1 optional `riskId` against closed I15; G2 optional `obligationId` against closed G1; G3 optional `controlId`. I15 treated treatment projects as a **separate aggregate**, not a child table of `erm_risks`. Domain map lists Risk and Treatment as sibling `erm` aggregates.

Rules:

- `riskId` is **not** required to create a Treatment. A catalogue treatment may exist with no risk link.
- If supplied, it must identify an existing I15 risk in the actor's tenant (any I15 status). Missing or other-tenant ids → `400` `risk_not_found`.
- The reference is a scalar identifier only. Creating, patching, or retiring a Treatment does **not** change I15 status, likelihood, impact, residual scoring, owner, or title. E2 must not PATCH `/v1/erm/risks/:id` and must not write `ermRisks`.
- No cascade, no inverse collection on I15, no `/v1/erm/risks/:id/treatment`, no automatic Treatment creation from a Risk.
- Do not add `riskIds[]` many-to-many. One optional scalar is the E1/G2-sized maximum.
- Wrong/missing parent must not silently resolve across tenants.

I15 is **not** a hard runtime write prerequisite beyond “the I15 risk module already exists in Dev/Test so a same-tenant id can be validated if the client sends one.”

I15 risk `status` (`open` / `mitigating` / `accepted` / `closed`) remains the risk’s own lifecycle. Linking a Treatment to a risk does **not** move that risk to `mitigating`. Retiring a Treatment does **not** `close` or `accept` the risk.

## Relationship to E1 KRI

**No `kriId`.** Default is **NO**. Domain map lists KRI and Treatment as siblings under `erm`, not as parent/child. E1 is closed and must not be a write dependency. A Treatment → KRI relationship is not required to list treatments in a catalogue. Do not add it in this contract.

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `erm_treatments` table; do **not** `ALTER` `erm_risks` or `erm_kris`);
- `UNIQUE (tenant_id, treatment_code)`;
- `risk_id` nullable; **no** foreign-key cascade to `erm_risks` required (identifier validation in the service, matching E1/G2-style reference semantics);
- live PostgreSQL UNVERIFIED;
- PostgreSQL is **not** a newly established system of record;
- intended `schema_registry` context_key `erm-treatments`;
- additive filename assigned at implementation to the next free number — **do not** invent a number that depends on uncommitted ITA1/ITL1/E1 migrations;
- ADR-0017 **not** reopened.

## Workflow

| From | Action | To | Purpose |
| --- | --- | --- | --- |
| (none) | create with title (optional notes, ownerLabel, riskId) | open | List a treatment in the catalogue |
| open | patch title / notes / ownerLabel / riskId | open | Maintain catalogue metadata while listed |
| open | patch status to `retired` | retired | Human withdraws the treatment from the current catalogue |
| retired | patch | deny | Terminal — no silent reactivation |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule (create ignores client status and writes `open`).

**Why these states (minimum):** a catalogue needs “listed” and “withdrawn”. Copying I15 `mitigating` / `accepted` / `closed` would make E2 a second risk-lifecycle field. Using ITA1/ITL1/P2 `done` / `cancelled` would imply a completed project and invite due dates, cost, and effectiveness. `effective` / `ineffective` would be a treatment engine. G2 `draft` / `active` / `retired` is not required for the smallest coherent register.

No dedicated calculate, measure, score, recommend, escalate, alert, notify, evaluate, trend, series, dashboard, automation, or scheduled-job endpoints. Lifecycle uses **PATCH status** only (bounded surface as E1/ITA1/ITL1/P2). Illegal status change → `409` `invalid_transition`. Patch when `retired` → `409` `retired`.

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance for a new decision or a revised Stage 1. Do not silently expand this contract:

- I15 mutation (status, likelihood, impact, residual, owner, title) or I15.x
- E1 mutation, required KRI link, or E1.x
- risk scoring / residual-risk calculation on treatments
- treatment effectiveness calculation or cost/effectiveness optimization
- formulas / measurements / units / targets / thresholds / RAG
- time-series / dashboards / alerts / notifications / scheduled jobs
- automated scoring / automated escalation / recommendation engines
- due dates, SLA, priority, cost, strategy taxonomy as product fields
- `riskId` required, many-to-many risks, nested routes under I15, or automatic Treatment creation from a Risk
- G3 findings linkage
- SAMPLE / Consent / Endpoint / UEM / MDM / Dataset / Data Governance
- AI mutation
- ITA1 / ITL1 mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen
- PostgreSQL as a newly established system of record

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous treatment creation, scoring ingest, or retirement.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency. Do not reopen ADR-0012 or ADR-0013.

## API

Prefix `/v1/erm/treatments`. Do **not** attach E2 to `/v1/erm/health`, `/v1/erm/risks*`, or `/v1/erm/kris*`. I15 `/v1/erm/health` and `/v1/erm/risks*` are not modified. E1 `/v1/erm/kris*` is not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

Repository search found no existing `/v1/erm/treatments` collection (E1 tests currently expect that path to 404). These routes are the intended **new** collection, consistent with E1 `/v1/erm/kris` beside an existing domain prefix. This table is a **Stage 1 proposal only**.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/erm/treatments/health` | `erm:read:treatment` |
| GET | `/v1/erm/treatments?q=&status=` | `erm:read:treatment` |
| POST | `/v1/erm/treatments` | `erm:write:treatment` |
| GET | `/v1/erm/treatments/:id` | `erm:read:treatment` |
| PATCH | `/v1/erm/treatments/:id` | `erm:write:treatment` |

Health increment is `E2` (distinct from I15 and E1). Intended health shape follows ITA1/ITL1/E1: `module` `erm-treatments`, `increment` `E2`, `status` `ok`, `treatments` count, `openTreatments` count. This health endpoint represents the **Treatment Register** capability, not treatment effectiveness or I15 risk health.

Do not add calculate, measure, score, recommend, escalate, alert, notify, evaluate, trend, series, dashboard, automation, schedule, or residual routes. Forbidden engine subroutes on `/v1/erm/treatments/:id/` return **404**.

**Required residual I15 protection (unchanged):** `POST /v1/erm/risks/:id/treatment`, `GET /v1/erm/risks/:id/treatments`, and any I15 `calculate` / `score` / `recommend` subroutes remain **404** if not already present. E2 implementation must not hang Treatment product behaviour off I15.

**Required residual E1 protection (unchanged):** E1 `/v1/erm/kris*` is not extended with treatment subroutes.

Conceptual request/response:

- **Create** body: `{ title, notes?, ownerLabel?, riskId? }` → `{ treatment }` with server `treatmentCode`, `status: "open"`.
- **Patch** body while `open`: any of `title`, `notes`, `ownerLabel`, `riskId` (including JSON `null` to clear the reference), or `status: "retired"`.
- **List** `{ items }` with optional `q` (title / `treatmentCode` / notes / `ownerLabel` substring, consistent with ITA1/ITL1/G2/P2/E1 register list search) and `status`.
- **Get** `{ treatment }` including optional read-only `riskCode` when linked.

## RBAC

| Permission | Intent |
| --- | --- |
| `erm:read:treatment` | Health + list/get |
| `erm:write:treatment` | Create / patch (including human retire) |

`platform.admin` — both (additive seed only). Role **`erm.treatment`** — both. Alice and partner — 403. At implementation time, Bob seed includes `erm.treatment` so the architecture role is exercised.

Existing `risk.member` (`erm:read:risk` / `erm:write:risk`) is **not** reused for E2 write or E2-only read. Treatment write is **not** granted automatically to every `risk.member`. Existing `erm.kri` is **not** reused for E2. This matches E1 (`erm.kri` not given to `risk.member`), G2 (`grc.control` not given to `compliance.member`), and P2 (`privacy.dpia` not given to every `dpo`).

Do not invent a second ERM admin role. Do not broaden I15 or E1 permissions. Do not update `docs/architecture/24-rbac-abac-model.md` in this Stage 1 authoring task (implementation-time seed only, if later authorized).

## Tenant isolation

Tenant-scoped. Collection queries are tenant-filtered. Missing / wrong-tenant Treatment id → 404 (do not disclose another tenant’s record). I15 and E1 isolation unchanged. No cross-tenant administrative behaviour. A `riskId` that exists only in another tenant is `400` `risk_not_found`, not a silent attach.

## Audit / security

ITA1/ITR1/P2/ITL1/E1 register services do **not** call `recordAudit`. E2 must match that sibling class. Do not introduce a new audit subsystem or a new hash-chain writer solely for E2. I0 audit/hash-chain remains available to other modules and is not redesigned here.

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM/metrics adapters. Human-only gates are server-enforced. Status is never treated as I15 risk status, effectiveness, residual score, or executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

## UI / navigation

Intended UX contract only. Do **not** implement pages or navigation in this Stage 1 authoring task.

- `/commercial/erm/treatments` (no existing page; sibling of `/commercial/erm` and `/commercial/erm/kris`)
- Nav **Risk → Treatments** after **Risk → Register** and **Risk → KRIs** (existing **Risk → Register** unchanged except optional additive link; **Risk → KRIs** unchanged)
- Register treatment (title + optional notes, owner label, optional I15 risk picker)
- Queue/list, filters `q` / status, detail with retire (from `open` via patch status)
- Open / retired badges; loading / empty / error / authorization-failure states
- Copy states this is a **Treatment Register**, never a treatment engine, effectiveness dashboard, residual-risk chart, RAG board, or I15 Risk replacement

Do not create treatment dashboards, effectiveness charts, residual-risk charts, RAG boards, treatment performance analytics, automated recommendations, or alerts.

I15 Risk → Register remains intact. An optional additive “Treatments” link on that page is useful (same class as E1’s additive KRIs link) and does **not** reopen I15.

## Search / filter / sort

List supports `q` (title / `treatmentCode` / notes / `ownerLabel` substring) and `status`, consistent with ITA1/ITL1/G2/P2/E1 registers. Default list order: newest first (existing register convention). No analytics, grouping by risk, effectiveness monitoring, or time-series behaviour.

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

Allocated `TRT-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, treatment_code)` if SQL is later added).

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `retired`
- Terminal records reject further patch (`409` `retired`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`TRT-0001`, then `TRT-0002`)
- Optional `riskId`: valid same-tenant I15 id accepted without mutating the risk (status, likelihood, impact unchanged); missing/other-tenant → `400` `risk_not_found`; omitted `riskId` allowed
- Forbidden engine subroutes on `/v1/erm/treatments/:id/` (`calculate`, `measure`, `score`, `recommend`, `escalate`, `alert`, `notify`, `evaluate`, `trend`, `series`, `dashboard`, `automation`, …) return 404
- I15 residual: `/v1/erm/health` remains increment `I15`; `/v1/erm/risks/:id/treatment` remains 404; I15 risk rows are not patched
- E1 residual: `/v1/erm/kris/health` remains increment `E1`; no `kriId` field
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `erm.treatment` has only the E2 permission pair; `risk.member` and `erm.kri` do not gain E2 perms
- Kernel allocator/status helpers analogous to sibling register tests
- Web typecheck
- UI: **Risk → Treatments** register / queue / detail / retire (implementation-time browser verification)
- Regression: I15 health remains `I15`; E1 health remains `E1`; store keys `ermRisks` / `ermKris` unchanged in meaning; G1–G5 / P2 / ITA1 / ITL1 freeze as applicable
- If E1 freeze tests currently assert absence of a treatments collection, updating those fixtures to allow the new `ermTreatments` key / `/v1/erm/treatments` collection is **test-fixture evolution only**, not an E1 or I15 reopen. Do not add `ermTreatments` assertions that fail because `"ermObligations" in store` must remain false.

## Acceptance criteria (when implementation is authorized)

Contract-level. Not code-level.

1. Aggregate/store identity: store key is `ermTreatments`; table intent `erm_treatments`; I15 `ermRisks` and E1 `ermKris` are not reused; no G3/SAMPLE keys reused.
2. Required/optional fields: required `title`; server `treatmentCode`; optional `notes`, `ownerLabel`, `riskId`; no engine/metric/project-management fields.
3. Code generation: `TRT-0001` then `TRT-0002`, unique per tenant.
4. Lifecycle: `open` → `retired` only; `retired` terminal; Treatment status is not I15 `mitigating` / `accepted` / `closed`.
5. Tenant isolation: wrong-tenant Treatment id → 404; other-tenant `riskId` → `400` `risk_not_found`.
6. RBAC: `erm:read:treatment` / `erm:write:treatment`; role `erm.treatment`; `risk.member` not broadened; Alice/partner 403.
7. Human-only mutation: non-Human create/patch → 403 `ai_actor`.
8. Optional risk reference: same-tenant I15 id accepted; omitted `riskId` allowed; no cascade; no nested I15 routes.
9. No I15 mutation: creating/patching/retiring a Treatment leaves I15 status, likelihood, impact, and residual scoring unchanged.
10. Health identity: `/v1/erm/treatments/health` increment `E2`; I15 `/v1/erm/health` remains `I15`; E1 `/v1/erm/kris/health` remains `E1`.
11. Absence of treatment-engine routes: calculate / measure / score / recommend / escalate / alert / notify / evaluate / trend / series / dashboard / automation → 404.
12. Absence of metric/engine fields: no effectiveness, residual, RAG, formula, threshold, cost, due date, or `kriId`.
13. UI register surface: **Risk → Treatments** at `/commercial/erm/treatments`; I15 Register intact except optional additive link.
14. Dev/Test persistence boundary: in-memory Store is SoR; additive SQL only if later authorized; no new PostgreSQL SoR; no `ALTER` of I15/E1 tables.
15. Explicit deferred/out-of-scope: G3, SAMPLE, Endpoint/UEM/MDM, Consent, Dataset/Data Governance, UAT, Production, E1.x, I15.x, ITA1.x, ITL1.x.

## Exclusions / Not included

- I15 mutation; I15 risk status (`mitigating` / `accepted` / `closed`) as Treatment status; I15.x
- E1 mutation; required KRI link; E1.x
- Risk scoring; residual-risk calculation; treatment effectiveness calculation
- Cost/effectiveness optimization
- Formulas; measurements; units; targets; thresholds; RAG
- Time-series; dashboards; alerts; notifications; scheduled jobs
- Automated scoring; automated escalation; recommendation engines
- Due dates; SLA; priority; cost; strategy taxonomy (`avoid` / `mitigate` / `transfer` / `accept`)
- Nested `/v1/erm/risks/:id/treatment`; automatic Treatment creation from a Risk
- G3 findings
- SAMPLE
- Consent; Endpoint; UEM; MDM; Dataset / Data Governance
- ITA1 / ITL1 mutation or commit of their working-tree changes
- Corporate IdP; vault; SIEM; live metrics backends
- AI mutation
- Numeric placeholder IDs I15.x / E1.x / T1 / G6 / K3 / H2 / O7 / I3.38 / I4.35 / I20.23 / PG.30 / C11 / I24
- I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll
- UAT; Production
- PostgreSQL as a newly established system of record
- ADR-0006 / ADR-0012 / ADR-0013 implementation
- Push; commit

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is **not** authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. A stale process returning 404 is not an E2 defect. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not an E2 product defect. This Stage 1 pass must **not** start runtimes or perform live verification.

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter I15 or E1 schema or behaviour to “make room” for E2.

## Dependencies

| Kind | Item |
| --- | --- |
| Hard prerequisites | I0 kernel patterns (tenancy / RBAC / human actor). I15 **CLOSED** and present so optional `riskId` can be validated — I15 is not reopened and is not a write dependency. |
| Optional references | Same-tenant I15 `riskId` |
| Non-dependencies | E1 write, KRI link, ITA1, ITL1, G1–G5 write, G3, SAMPLE, Consent, Endpoint/UEM/MDM, Dataset, ADR-0006/0012/0013, live PostgreSQL as SoR, new vendors |

## Risks and unresolved decisions (require Stage 1 approval)

These are **not** silently decided beyond the proposed default in this contract. Stage 1 approval accepts or rejects the defaults.

| Decision | Proposed default | Classification |
| --- | --- | --- |
| Capability ID assigned at Stage 1 | **E2** (ERM family sequential after E1; unused; required for Path B increment/health/filename convention) | **ACCEPTABLE** |
| Lifecycle `open` / `retired` | Catalogue pair, distinct from I15 risk status. Approval may instead demand ITA1-style `done` / `cancelled`; if so, those words must still mean register-row completion, not I15 `closed` / `accepted` and not effectiveness. | **ACCEPTABLE** (clarification if operator wants work-item statuses) |
| Optional `riskId` | **Yes** (E1/G2-style). Approval may strike the field entirely; do not make it required. | **ACCEPTABLE** |
| Dedicated role `erm.treatment` | **Yes**, so I15 `risk.member` is not broadened. Approval may instead grant E2 perms to `risk.member`; that would be a deliberate I15 permission-model change and should be called out, not assumed. | **ACCEPTABLE** |
| No project-management fields (dates, cost, priority, category/strategy) | **Yes** — bounded catalogue. Any later “just one due date” is a new increment. | **ACCEPTABLE** |
| No Treatment → KRI relationship | **NO `kriId`.** Not required for a catalogue. | **OUT OF SCOPE** |
| I15 Register additive Treatments link | Optional and useful; does not reopen I15. | **ACCEPTABLE** |

No **BLOCKER** or **REVISION REQUIRED** items were found in this authoring pass. Remaining items are operator-approval choices, not silent architecture invention.

## Governance / authority matrix

```text
CAPABILITY=TREATMENT_REGISTER
CAPABILITY_ID=E2
STAGE_1_STATUS=APPROVED
STAGE_1_APPROVED=YES
IMPLEMENTATION_AUTHORIZED=YES
IMPLEMENTATION=COMPLETE
COMMIT=EXECUTED
COMMIT_SHA=68ed0994de8703b89e7c233282af8f3c0f38108e
PUSH=EXECUTED
PREVIEW=AUTHORIZED
PREVIEW_RESULT=PASS
OWNER/HUMAN_PREVIEW_RESULT=PASS
EXECUTION_QUEUE=EMPTY
NEW_CAPABILITY_AUTHORIZED=NONE
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
```

Operator next step: **none selected**. **EXECUTION_QUEUE=EMPTY.** UAT and Production remain **NOT_AUTHORIZED**. This is not I15.x, not E1.x, not a treatment engine, not Endpoint/UEM/Consent/Dataset, not O7/ITE1/PQL selection, and not ADR-0006 closure.
