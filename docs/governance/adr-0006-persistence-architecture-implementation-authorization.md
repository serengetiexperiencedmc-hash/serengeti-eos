# ADR-0006 Persistence Architecture and Implementation Authorization Package

> **`DESIGN + GOVERNANCE — NOT IMPLEMENTATION`**  
> **STAGE: 6B**  
> **CURRENT STATUS: `NOT AUTHORIZED`**

This package converts Stage 6A factual findings into a **target persistence architecture** and an **implementation authorization request**. It does **not** implement persistence, create or execute migrations, alter schema or runtime, select a cloud provider, approve ADR-0006 or DP-0006, or authorize UAT, Production, cutover, or deployment.

**No implementation is authorized merely because this document describes it.**

Evidence vocabulary:

| Label | Meaning |
| --- | --- |
| **CURRENT** | Observed in repository today (Stage 6A + this inspection) |
| **TARGET** | Proposed future architecture — **not implemented** |
| **PROPOSED SCHEMA** | Future DDL intent — **no migration file created** |
| **REQUIRES DOMAIN DECISION** | Business/Legal/IT must decide before implementation |
| **GOVERNANCE** | Carried from prior ADR-0006 packs |

---

# 1. Stage 6A factual baseline (carried forward exactly)

- Commercial/RFP and Programme Building are jointly critical.
- Runtime reads for critical RFP/programme state currently use the process-local in-memory `Store`.
- RFP writes currently mutate in-memory state.
- Programme writes currently mutate in-memory state.
- Existing RFP/programme PostgreSQL DDL exists but is not used by runtime for those modules.
- Existing PostgreSQL migrations exist through migration **122**.
- PostgreSQL access uses `pg.Pool`.
- CRM/suppliers/notifications have limited dual-write/hydration patterns but do **not** establish durable RFP/programme runtime state.
- Application audit currently uses volatile in-memory state where identified (`recordAudit` → `store.audit.push`).
- Commercial documents have persistence/metadata gaps (metadata in memory; bytes on local FS via `DocumentStorage`).
- Programme participant register is not currently established as a durable domain (`paxCount` only).
- Rooming is represented in operations structures rather than a durable programme participant model.
- Production-grade application recovery is **NOT DEMONSTRATED**.
- Application-level RTO/RPO testing is **NOT YET TESTABLE** until actual critical state is durable.
- Stage 4B PostgreSQL laboratory results remain **laboratory evidence only**.
- Stage 5 remains **DEFER / NOT READY**.
- E1 **OPEN**. E2 **PARTIALLY EVIDENCED**. E3 **OPEN**. E4 **OPEN**.
- ADR-0006 **PROPOSED — BLOCKED**. DP-0006 **OPEN — NOT APPROVED**.

This document does **not** rewrite Stage 6A.

---

# 2. Target architecture principle

**TARGET** (capability class — **not** a Production hosting selection, **not** a provider, **not** a region):

| Capability | Role |
| --- | --- |
| PostgreSQL 16-class | Durable **system of record** for critical Commercial/RFP/Programme (and required predecessors/successors listed below), consistent with ADR-0003 unless a later **approved** equivalent replaces it |
| Repositories / data-access | All reads/writes of critical state go through a repository against PostgreSQL, not process arrays as SoR |
| Transactional service layer | Atomic units for create/transition/version + audit (+ outbox where required) |
| Durable audit / business version history | Distinct stores; both durable |
| Durable document **metadata** in PostgreSQL | `commercial_documents` (or successor) as SoR for metadata |
| Object/file **abstraction** for bytes | Existing `DocumentStorage` port (`put`/`get`); implementation remains **portable**; **no** provider selected |
| Deterministic startup | Fail closed if SoR unavailable; do **not** hydrate the entire estate into memory as SoR |
| Explicit failure/retry | Persist failure **fails the API request** (reject the CRM fire-and-forget anti-pattern for critical modules) |
| Idempotency | Create/transition keys where retries are expected |
| Concurrency | Enforce existing `version` fields (optimistic lock) |
| Integrity constraints | PKs, uniques, CHECKs already in DDL; **add** FKs only per §8 |
| Observability | Persist/hydrate/lock metrics; no swallowed errors on critical path |
| Backup/PITR compatibility | Critical rows live in PostgreSQL so Stage 4B **mechanisms** can later be applied to **real** tables (still not Production proof by itself) |
| Future HA/failover compatibility | Stateless app instances; shared SoR; no process-local critical state |

**Critical principle:** the application must **not** depend on process-local memory as the authoritative source of critical business state.

This is **not** final Production hosting architecture. ADR-0006/DP-0006 remain unapproved. HA/DR/backup **products** remain unelected.

**Anti-pattern to avoid:** copying CRM `void persistXAfterCommit` + swallow-error dual-write as the Production pattern for jointly critical modules.

---

# 3. Domain model (CURRENT fields only; TARGET durability)

Fields listed are those **evidenced** in kernel types / tables. New entities are marked **REQUIRES DOMAIN DECISION** and are **not** invented as required.

**Persistence requirement** = TARGET unless stated CURRENT.

## A. Commercial (pipeline context)

Commercial is the initiating jointly critical function. Runtime **CURRENT** SoR for the pipeline header is `OppOpportunity` plus downstream RFP.

**Authoritative owner (TARGET):** Commercial/pipeline service.  
**Not** a separate “commercial aggregate” table **OBSERVED**. Do not invent one.

## B. Opportunity — `opp_opportunities` / `OppOpportunity`

| Aspect | Definition |
| --- | --- |
| Purpose | Qualified commercial pipeline record; RFP create requires it |
| Owner | Pipeline service (`apps/api/src/pipeline/opportunity.ts`) |
| Identifier | UUID `id`; unique `(tenant_id, opportunity_code)` |
| Lifecycle | stages `new_qualified` → `rfp_received` → … ; status open/won/lost/archived |
| Relationships | `organization_id` (CRM org); optional `account_id`; `owner_principal_id` |
| Required fields | tenant, code, title, organization, stage, status, owner, classification, version, timestamps |
| Mutable | title, stage, status, value, pax, dates, owner, version, archive |
| Immutable | `id`, `tenant_id`, `created_at`, `opportunity_code` after issue (**TARGET** treat code as immutable) |
| Versioning | integer `version`; stage history table **EXISTS** |
| Audit | security audit on create/transition (**TARGET** durable); business stage history **EXISTS** as schema |
| Retention | Legal A17 **OPEN** — do not invent periods |
| Persistence | **CURRENT** VOLATILE. **TARGET REQUIRED** (predecessor of RFP) |

## C. RFP — `rfp_rfps` / `RfpRecord`

| Aspect | Definition |
| --- | --- |
| Purpose | Intake and workflow of an RFP linked to an opportunity |
| Owner | RFP service (`apps/api/src/rfp/rfp.ts`) |
| Identifier | UUID `id`; unique `(tenant_id, rfp_code)` |
| Lifecycle | workflow_stage intake→programme→costing→approval→proposal→sent→closed; status active/closed/cancelled |
| Relationships | `opportunity_id`, `organization_id` (copied from opp), `assigned_principal_id` |
| Required | tenant, code, opportunity, organization, title, stage, status, classification, versions, timestamps, creators |
| Mutable | title, notes, requirements, SLA, assignment, stage, status, budget, pax, travel, destinations, `version` |
| Immutable | `id`, `tenant_id`, `rfp_code` after issue (**TARGET**), `created_at` |
| Derived | `slaStatus` is **computed** at read (`computeSlaStatus`); schema column `sla_status` **EXISTS** — **TARGET**: persist only if explicitly decided; otherwise compute on read |
| Versioning | `current_version` + `rfp_versions` rows (summary snapshots, not full document clone) |
| Audit | `rfp/audit.ts` **CURRENT** memory. **TARGET** durable security audit |
| Retention | Legal **OPEN** |
| Persistence | **CURRENT** VOLATILE. **TARGET REQUIRED** (jointly critical) |

## D. RFP version — `rfp_versions`

Purpose: numbered summary history. Owner: RFP service. PK UUID. FK to `rfp_rfps` **EXISTS**. Immutable after insert (**TARGET**). Persistence **TARGET REQUIRED**.

## E. Programme — `prg_programmes` / `PrgProgramme`

| Aspect | Definition |
| --- | --- |
| Purpose | Itinerary aggregate for one RFP (runtime enforces one non-archived programme per RFP) |
| Owner | Programme service |
| Identifier | UUID; unique `(tenant_id, programme_code)` (`RFP-` → `PRG-`) |
| Lifecycle | draft / active / archived |
| Relationships | `rfp_id`, `opportunity_id`, `organization_id` (copied) |
| Required | as in `017` + CD notes columns from `122` |
| Mutable | title, dates, pax, destinations, notes, status, day_count, version |
| Immutable | `id`, `tenant_id`, `programme_code` after issue, `rfp_id` (**TARGET** do not re-parent) |
| Versioning | integer `version` + `prg_programme_versions` |
| Persistence | **CURRENT** VOLATILE. **TARGET REQUIRED** (jointly critical) |

**Schema gap vs runtime:** one-programme-per-RFP is **application-only** today (no unique on `rfp_id`).

## F. Programme version — `prg_programme_versions`

Purpose: numbered snapshot `{ title, dayCount, itemCount, destinations? }` JSONB — **not** a full itinerary dump (**CURRENT** type). Owner: programme service. FK to programme **EXISTS**. **TARGET REQUIRED**. Expanding snapshot to full days/items is **REQUIRES DOMAIN DECISION** (not invented here).

## G. Programme day — `prg_days`

Purpose: ordered day within a programme. FK to `prg_programmes` **EXISTS**. Unique `(programme_id, day_number)`. **TARGET REQUIRED**.

## H. Programme item — `prg_items`

Purpose: itinerary component on a day. FK to programme and day **EXISTS**. Optional `supplier_id`, `supplier_rate_id`, `supplier_label`. `item_type` CHECK **EXISTS** (`122`): accommodation, activity, experience, transport, flight, meal, meeting_event, other. **TARGET REQUIRED**.

Hotels / transport / activities are **item types** (and optional supplier refs), **not** separate CURRENT tables. Do not invent hotel-stay/transport-leg tables unless a domain decision requires them.

## I. Costing — `cost_sheets` / lines / versions

Purpose: cost and margin for a programme. Header FKs to programme/rfp/opportunity **MISSING** in `018` (plain UUIDs). Lines FK to sheet **EXISTS**. **CURRENT** VOLATILE. **TARGET REQUIRED** before approval/proposal integrity. Downstream of jointly critical programme.

## J. Approval — `com_approval_requests`

Purpose: margin/sell gates. UUIDs to cost_sheet/rfp/programme **without** FKs in `019`. **CURRENT** VOLATILE. **TARGET REQUIRED** for workflow integrity after costing.

## K. Proposal / Booking

Tables **EXIST** (`020`, `021`). Runtime **VOLATILE**. **TARGET:** persist **after** RFP/programme/costing/approval SoR exists. Booking is recovery-sequence **Operations** adjacent; still required for overall EOS RTO <=4h but **not** jointly critical first. Do not block WP-06/07 on booking.

## L. Supplier references

`sup_suppliers` dual-write **PARTIAL CURRENT**. Programme items and cost lines hold optional UUIDs + label copy. **TARGET:** supplier master durable before enforcing item FKs.

## M. Hotel references

`sup_hotel_profiles` DDL **EXISTS** (`121`); runtime **VOLATILE**; not in `persistence/supplier.ts`. Programme uses `item_type = accommodation`. **TARGET:** persist hotel profile with supplier persist extension; do **not** require a new hotel-stay entity without a domain decision.

## N. Transport references

**CURRENT:** `item_type = transport` / `flight` on `prg_items`. No transport-leg table **OBSERVED**. **TARGET:** persist as items. Separate transport entity = **REQUIRES DOMAIN DECISION**.

## O. Activity references

**CURRENT:** `item_type = activity` / `experience`. Same as N.

## P. Commercial documents

Metadata type **OBSERVED:** kind, status, filename, mime, size, sha256, storageRef, version, optional rfpId/supplierId/contractId, classification, audit timestamps. **No `programmeId`.** Bytes: `DocumentStorage`. **TARGET:** metadata **REQUIRED** in PostgreSQL; bytes **REQUIRED** behind portable storage; programme link = **REQUIRES DOMAIN DECISION**.

## Q. Audit history

`audit_events` table **EXISTS** (insert-only trigger, hash chain columns). Runtime RFP/PRG audits **do not** insert. **TARGET REQUIRED** for security/system audit of critical mutations.

## R. Notifications / outbox

PG.1/PG.2 **PARTIAL CURRENT**. **TARGET:** keep transactional outbox for integration events; **add** RFP/programme domain events on commit (**kernel catalogues exist; API emit not OBSERVED**). Production NATS remains pending ADR-0006 — outbox table can still be SoR for pending events.

## S. User / organization references

IAM principals bootstrap-synced. CRM organizations dual-written **PARTIAL**. RFP/programme copy `organization_id` and `classification`. **TARGET:** durable CRM org SoR (complete CRM read-through) **or** at least FK-capable org rows before RFP FK to org.

---

# 4. CURRENT → TARGET data flow

## 4.1 Commercial / RFP

**CURRENT:**

```
API (/v1/rfps, /v1/pipeline/opportunities, …)
  → service (rfp.ts / opportunity.ts)
  → Store.rfpRfps.push / Store.oppOpportunities.push
  → process memory
  → recordAudit → store.audit[]
```

**TARGET:**

```
API (same routes)
  → service (authorize, validate)
  → BEGIN
       repository upsert opportunity/RFP/version
       optimistic version check
       insert security audit_events
       insert outbox_events (if event required)
  → COMMIT
  → PostgreSQL durable state
  → response from committed row (not from a process array as SoR)
```

Optional **cache** after commit is allowed; cache is **not** SoR.

## 4.2 Programme Building

**CURRENT:** API `/v1/programmes*` → `programme.ts` → `prgProgrammes` / `prgDays` / `prgItems` arrays.

**TARGET:** same API → service → transaction → programme/day/item/version repositories → PostgreSQL.

## 4.3 Affected endpoints / services (**CURRENT** routes; TARGET persist behind them)

| Area | Routes | Service files |
| --- | --- | --- |
| Pipeline | `/v1/pipeline/health`, `/stages`, `/board`, `/opportunities`, `POST/GET`, `POST …/transitions` | `pipeline/opportunity.ts` |
| RFP | `/v1/rfps/health`, `/workflow-stages`, `GET/POST /v1/rfps`, `GET/PATCH /:id`, `POST /:id/transitions`, `POST /:id/versions` | `rfp/rfp.ts` |
| RFP documents | `POST/GET /v1/rfps/:id/documents`, `GET /v1/commercial-documents/:id`, `GET …/content` | `commercial-documents/service.ts` |
| Programme | `/v1/programmes/health`, `GET/POST /v1/programmes`, `GET /by-rfp/:rfpId`, `GET/PATCH /:id`, `POST /:id/days`, `POST /:id/days/:dayId/items`, `PATCH /:id/items/:itemId`, `POST /:id/versions` | `programme/programme.ts` |
| Costing | `/v1/costing/health`, `/sheets`, `by-programme`, line-items, recalculate, versions | `costing/sheet.ts` |
| Approval | `/v1/commercial-approvals*` | `commercial-approval/approval.ts` |
| Proposal / booking | existing C8/C9 routes | `proposal/`, `booking/` — later WPs |
| Startup | `main.ts` hydrate list | **TARGET:** stop treating hydrate-into-Store as RFP/PRG SoR |

---

# 5. Database design (inspect, do not modify)

## 5.1 Existing tables vs TARGET

| Table | Verdict | Notes |
| --- | --- | --- |
| `rfp_rfps` | **Reusable + incomplete** | PK, tenant FK, unique code, CHECKs, timestamps, `version`, `archived_at`, CD columns (`122`) **EXIST**. Missing: FKs to opportunity/org; runtime use. `sla_status` may be derived |
| `rfp_versions` | **Reusable** | FK to RFP **EXISTS** |
| `prg_programmes` | **Reusable + incomplete** | Unique code **EXISTS**. Missing: FK to RFP; unique active programme per RFP |
| `prg_days` | **Reusable** | FKs to programme **EXIST** |
| `prg_items` | **Reusable + incomplete** | FKs to programme/day **EXIST**. Supplier FKs absent (nullable UUIDs). `122` type columns **EXIST** |
| `prg_programme_versions` | **Reusable** | JSONB snapshot **EXISTS**; payload is summary-only |
| `opp_opportunities` | **Reusable + incomplete** | Org/account FKs absent |
| `opp_stage_history` | **Reusable** | FK to opportunity **EXISTS** |
| `cost_sheets` | **Reusable + incomplete** | Header FKs to programme/rfp missing |
| `cost_line_items` / `cost_sheet_versions` | **Reusable** | Sheet FKs **EXIST** |
| `com_approval_requests` | **Reusable + incomplete** | Header FKs missing |
| `commercial_documents` | **Reusable + incomplete** | No runtime write; optional FKs; no `programme_id` |
| `sup_hotel_profiles` / `sup_contracts` | **Reusable + unused by persist layer** | |
| `audit_events` | **Reusable** | Insert-only; runtime not wired for RFP/PRG |
| `outbox_events` | **Reusable** | PG.2 pattern |
| In-memory `Store` arrays as SoR | **Obsolete as Production SoR** | May remain Dev cache during transition only |

None marked **obsolete** as DDL. **Unknown:** whether `sla_status` should be stored.

## 5.2 Proposed future schema changes (**PROPOSED SCHEMA** — not created)

Apply only under **migration execution authorization**. Additive, following existing numbered SQL style. Suggested **logical** sequence (numbers not assigned):

1. Opportunity persist enablement: optional FKs `opp_opportunities.organization_id` → `crm_organizations(id)` **if** CRM SoR cutover timing allows; otherwise defer org FK.  
2. `rfp_rfps.opportunity_id` → `opp_opportunities(id)` **ON DELETE RESTRICT**.  
3. `prg_programmes.rfp_id` → `rfp_rfps(id)` **ON DELETE RESTRICT**.  
4. Partial unique index: one non-archived programme per `(tenant_id, rfp_id)`.  
5. `cost_sheets.programme_id` → `prg_programmes(id)` RESTRICT; similarly rfp_id.  
6. `com_approval_requests` FKs to cost_sheet / rfp / programme RESTRICT.  
7. Optional `prg_items.supplier_id` → `sup_suppliers(id)` — see §8.  
8. `commercial_documents` FKs optional; persist path; **do not** add `programme_id` without domain decision.  
9. Optimistic lock: `UPDATE … WHERE version = $expected` (application + optional trigger).  

**Do not** rewrite `016`/`017`/`122` in place; add a **new** migration after 122.

**JSONB:** keep `prg_programme_versions.snapshot` as documented summary unless domain expands it.

**Soft delete:** continue `archived_at` where it already exists; do not invent hard-delete of RFPs.

**Tenant isolation:** all queries **TARGET** filter `tenant_id` (already on tables).

---

# 6. Foreign key decision

Do **not** automatically add FKs. Decisions below are **design recommendations** for a future authorized migration, not DDL.

| Relationship | CURRENT | Decision | Reasoning |
| --- | --- | --- | --- |
| RFP → Opportunity | UUID, no FK; createRfp requires in-memory opp | **DATABASE FOREIGN KEY** `ON DELETE RESTRICT` | Runtime already forbids RFP without opportunity. Restrict preserves history if opportunity archived (`archived_at`) rather than deleted. **Prerequisite:** opportunity rows persisted. |
| Programme → RFP | UUID, no FK; createProgramme requires RFP; one per RFP in app | **DATABASE FOREIGN KEY** RESTRICT + **partial unique** `(tenant_id, rfp_id) WHERE archived_at IS NULL` | Matches runtime invariants; unique is missing in DDL today |
| Programme header → Supplier | No field **OBSERVED** | **NOT APPLICABLE** | Do not invent |
| Programme item → Supplier | Nullable UUID + label; no FK | **APPLICATION-LEVEL REFERENCE** initially; **DATABASE FOREIGN KEY** nullable **ON DELETE RESTRICT** only after supplier SoR is reliable | Items may exist with `supplierLabel` only. Restrict vs SET NULL = **REQUIRES DOMAIN DECISION** if supplier archived |
| Programme item → Rate | Nullable UUID | **APPLICATION-LEVEL REFERENCE** until rate persist proven | `sup_rates` dual-write **PARTIAL**; do not block programme persist |
| Programme → documents | Documents have `rfpId` not `programmeId` | **APPLICATION-LEVEL REFERENCE** via RFP (or supplier/contract) | Adding `programme_id` = **REQUIRES DOMAIN DECISION** |
| RFP / Programme / Opportunity → organization | UUID copied from CRM org; no FK | **DATABASE FOREIGN KEY** to `crm_organizations` **ON DELETE RESTRICT** **after** CRM is a true SoR | Today CRM read SoR is still memory. Premature FK would couple to dual-write gaps. Until then **APPLICATION-LEVEL REFERENCE** |
| Cost sheet → Programme | UUID, no FK | **DATABASE FOREIGN KEY** RESTRICT | Sheet always created from programme in `sheet.ts` |
| Approval → Cost sheet / RFP / Programme | UUIDs, no FK | **DATABASE FOREIGN KEY** RESTRICT | Same invariant |

**ON DELETE CASCADE** is **not** recommended for RFP/programme headers (would destroy jointly critical history).

---

# 7. Transaction model (**TARGET** — not implemented)

| Operation | Atomic with | Async allowed? |
| --- | --- | --- |
| Create opportunity | opp row + stage history + security audit | Outbox emit **after** commit (existing PG.2 drain) |
| Create RFP | RFP + rfp_version + optional opp stage `rfp_received` + stage history + audit | Outbox `rfp.created.v1` after commit |
| Patch RFP | RFP update with `version = expected` + audit | No |
| Transition RFP stage | RFP stage/version + audit; reject illegal kernel transitions | Outbox `rfp.stage.changed.v1` after commit |
| Create RFP version | rfp_versions insert + RFP `current_version` + audit | Outbox after commit |
| Create programme | programme + optional days/items + RFP stage intake→programme + audit | Outbox after commit |
| Add day / add item / patch item / patch programme | parent version check + row writes + programme.version + audit | No |
| Create programme version | version row + programme.version + audit | No |
| Create costing | sheet + lines + totals + optional RFP stage programme→costing + audit | Recalc **in same** transaction |
| Request / decide approval | approval row + RFP stage if kernel requires + audit | No |
| Persist security audit | **same transaction** as the business write | Must **not** be fire-and-forget for critical modules |
| Outbox insert | **same transaction** as business write | **Publish** to NATS/bus **asynchronous** after commit (ADR-0010 pattern) |
| Document upload | metadata INSERT + `DocumentStorage.put`; compensate delete bytes if metadata commit fails (**TARGET**) | Bytes I/O outside PG is inherent; **saga/compensate** required |
| Notifications | existing PG.1 — not jointly critical first | May remain dual-write **until** a later gate; must not block RFP SoR |

**Partial failure:** if COMMIT fails, client sees error; no in-memory “success”. **CURRENT** is the opposite (memory success, PG optional).

---

# 8. Audit and versioning (**TARGET**)

Distinguish two histories:

### 8.1 Security / system audit — `audit_events`

| Field | Source |
| --- | --- |
| Actor | `actor_type`, `actor_principal_id` (**CURRENT** in `recordAudit`) |
| Action | permission/action string |
| Entity | `resource_type`, `resource_id` |
| Timestamp | `occurred_at` |
| Previous / new state | JSONB columns **EXIST**; RFP audit today passes `newState` in `evidence` only |
| Correlation | `correlation_id` from request (**CURRENT**) |
| Authorization allow/deny | **CURRENT** |
| Hash chain | `prev_hash`, `row_hash` **CURRENT** in memory; **TARGET** persist every insert |
| Immutability | table trigger **EXISTS** (insert-only) |

**TARGET:** `recordAudit` (or successor) **INSERT**s in the business transaction. Do not rely on bootstrap `syncStoreToPostgres` snapshot.

### 8.2 Business version history

| Store | Content |
| --- | --- |
| `rfp_versions` | Human summary + version_number |
| `prg_programme_versions` | Summary JSONB snapshot |
| `cost_sheet_versions` | Totals snapshot |
| `opp_stage_history` | Stage transitions |

These are **not** a substitute for `audit_events`. They are product-facing history.

---

# 9. Document persistence (**TARGET**)

Keep the **CURRENT** port; do not choose a provider.

| Concern | CURRENT | TARGET |
| --- | --- | --- |
| Metadata | Memory `commercialDocuments` | PostgreSQL `commercial_documents` |
| Content | `LocalFsDocumentStorage` (`EOS_DOCUMENT_ROOT` or tmpdir) | Same `DocumentStorage` interface (`name`, `put`, `get`). Production adapter **CANDIDATE — NOT SELECTED**; Legal location = E1 |
| Hash / MIME / filename / size | **OBSERVED** on type | Persist; keep allowlist and 10 MiB max unless later decided |
| Owner/entity | Optional rfp / supplier / contract | Persist those FKs as **APPLICATION** or DB per §8; programme link **REQUIRES DOMAIN DECISION** |
| Version / status | version; active/superseded/deleted | Persist; deletion = status + storage delete per retention (**Legal OPEN**) |
| Access control | `commercialDocument:*` permissions | Unchanged kernel perms; bytes never returned without authz |
| Portability | Comment: does not bind ADR-0006 | Abstraction remains; **no** AWS/Azure/bucket selected here |
| Kernel interface | `put`/`get` only; local impl also `delete` | **TARGET** add `delete` to port when compensating uploads — **design note**, not implemented |

---

# 10. Programme participants and rooming

**CURRENT (do not invent):**

- `paxCount` on RFP and programme.
- **No** participant / guest register type **OBSERVED** on programme.
- `rooming` is an optional **string** on operations manifest entries (`ops/manifests.ts`, `OpsManifestEntry`).
- Demo seed uses `{ guestName, rooming }` in **ops** context, not programme persistence.

Stage 1 jointly critical functions are Commercial/RFP and Programme Building (itinerary/workflow), **not** an attested guest-master requirement.

**TARGET recommendation:**

| Question | Position |
| --- | --- |
| Must Production Programme Building include a participant entity? | **REQUIRES DOMAIN DECISION** (Owner/BCM + Legal privacy). Not mandated by Stage 6A code facts |
| Rooming entity? | **REQUIRES DOMAIN DECISION**. If yes, likely **Operations** owned with programme FK — not silently added to `prg_items` |
| Allocation/versioning of rooms? | **REQUIRES DOMAIN DECISION** |
| Privacy controls? | If participants/PII are stored, E1 + classification apply; **do not** store passport because event schema forbids those payload keys in places — **no** passport field on `CrmContact` **OBSERVED** |
| Block WP-06/07? | **No.** Durable programme itinerary can proceed with `paxCount` only until the domain decision |

---

# 11. Application startup / hydration (**TARGET**)

| Topic | TARGET |
| --- | --- |
| Load as SoR | **Nothing critical into process arrays as authority.** Read RFP/programme/opportunity **from PostgreSQL per request** (or short-lived cache) |
| Must NOT load | Entire RFP/programme corpus into `Store` as SoR (rejects CRM-style full hydrate as the end state for these modules) |
| Allowed cache | Optional TTL/request cache; invalidate on write; never serve cache if PG says not found |
| Multiple replicas | Each instance stateless w.r.t. critical data |
| Stale-read | Default read-your-writes from primary; replicas/read-standby = hosting decision later (async replica **RPO > 0** per Stage 4B) |
| Startup failure | If `EOS_DATABASE_URL` required for the persistence-enabled profile: **do not listen** / fail `/ready` if migrate or `SELECT 1` fails |
| DB unavailable | `/ready` 503 (**CURRENT** when `dbHealth` set). **TARGET:** mutating RFP/PRG APIs return 503; do not succeed in memory |
| Dev memory-only | Remaining `EOS_DATABASE_URL` unset path is **Dev/Test only** and **must not** be a Production profile |

IAM seed/`syncStoreToPostgres` may continue for principals **until** identity SoR is complete (ADR-0013 **OPEN**). That does **not** justify RFP memory SoR.

---

# 12. Multi-replica behavior (**TARGET**)

| Concern | CURRENT | TARGET |
| --- | --- | --- |
| Shared critical state | Per-process `Store` | PostgreSQL |
| Sessions | Memory + bootstrap PG insert; revocation persist if pool | Durable sessions (already partial); sticky sessions **not** required if session SoR is PG |
| Locks | None across processes | Optimistic `version`; optional advisory locks only if a later WP proves need |
| Idempotency | CRM/supplier import keys **PARTIAL**; RFP create is duplicate-code check **in memory** | Persist uniqueness `(tenant_id, rfp_code)`; optional idempotency key table for POST |
| Cache | N/A | Per-instance, non-authoritative |
| Background jobs | In-process digest timers | Job state in PG (some digest last-run already dual-written); leader election **REQUIRES** design if multiple replicas |
| Event processing | In-memory bus | Outbox in PG; consumers use `processed_events` (**CURRENT** PG.2 hydrate) |
| Duplicate delivery | In-memory processed set | Durable idempotency keys (**CURRENT** pattern for some modules) |
| Concurrent updates | Last array mutation wins | `UPDATE … WHERE version = $n` → 409 conflict |

**Must move out of process memory for critical path:** `rfpRfps`, `rfpVersions`, `prgProgrammes`, `prgDays`, `prgItems`, `prgProgrammeVersions`, `oppOpportunities`, `oppStageHistory`, runtime `audit` for those actions, `commercialDocuments` metadata, costing/approval when those WPs run.

---

# 13. Failure and recovery model (**TARGET** — not currently implemented)

| ID | Expected TARGET behavior | Data-loss risk | Recovery | Test requirement |
| --- | --- | --- | --- | --- |
| F1 App restart | Reads return last **committed** RFP/PRG | Uncommitted request lost (normal) | Start app; PG still holds rows | Restart/retrieve test |
| F2 App crash | Same as F1 | Same | Same | Crash test (Dev/Test) |
| F3 Replica loss | Other replicas continue | None if writes committed | No sticky critical state | Multi-instance test |
| F4 DB restart | `/ready` 503 until up; then full data | None if fsync/commit (ops config **UNKNOWN**) | PG restart | Integration |
| F5 DB failover | Depends on hosting HA — **not selected** | Sync lab: qualified zero committed loss **only** under tested model; async **RPO > 0** | Hosting class later | **Blocked** on E3/topology |
| F6 Network blip | Request error/retry; idempotent POST | Duplicate create prevented by unique code | Retry | Concurrency/idempotency tests |
| F7 PG restore | Restored `rfp_*`/`prg_*` **if** they were written | Backup-only gap between backups (Stage 4B T1) | Restore + app start | Application restore probe |
| F8 PITR | Restore to marker/time | Post-target commits discarded by design | PITR runbook | App-level PITR with RFP markers |
| F9 Regional recovery | Legal + async RPO — **not selected** | **RPO > 0** unless later proven | E1 + E3 | Not now |
| F10 Duplicate event | Outbox/processed_events idempotent | Duplicate side effects if missing keys | Idempotency keys | Event tests |
| F11 Partial transaction | ROLLBACK entire unit | None committed | Retry | Transaction tests |
| F12 Dependency down | IdP/docs store: fail the dependent action; do not fake RFP success | Document bytes vs metadata saga | Compensate | Dependency tests |

Do **not** claim any TARGET row is implemented.

---

# 14. Application RTO/RPO testability (**future** — not executed)

**Minimum conditions before application-level recovery testing:**

durable opportunity, RFP, programme (days/items), required audit rows, document metadata (and bytes if claiming document recovery); deterministic dataset; documented recovery procedure; dependency inventory; workflow probes; transaction markers in **real** tables (not `lab_markers` only); measured timestamps; integrity checks (FK + one-programme-per-RFP + workflow).

**Future tests (not run this stage):**

1. Create RFP (and required opportunity).  
2. Persist (commit).  
3. Restart application.  
4. Retrieve same RFP.  
5. Update / transition.  
6. Create programme; restart; retrieve itinerary.  
7. Recover database (restore or PITR).  
8. Restart application.  
9. Continue workflow (costing/approval as authorized).  
10. Verify audit + business versions.  
11. Verify document metadata (+ bytes if in scope).  
12. Verify relationships (opp/RFP/programme/org).

Until WP-05–WP-07 exist, these remain **NOT YET TESTABLE**. Stage 4B stays laboratory-only.

---

# 15. Migration / cutover design (**not executed**)

| Step | Design |
| --- | --- |
| Schema sequence | New additive migration(s) after **122**; FKs only when parent tables are populated |
| Data migration | **No Production data.** Dev in-memory state is **not** a migration source of record |
| Demo/seed | `seed-demo-data.ts` may **replay via API** against PG after persist exists. **Not** Production data. Skip-if-CRM-exists logic must be redesigned so seed does not hide empty `rfp_rfps` |
| Dual-write | Allowed **only** if API **fails** when PG fails. Do not copy swallowed persist |
| Dual-read | Transitional: prefer PG; forbid memory fallback for Production profile |
| Backfill | Empty tables expected; no backfill of lost process memory |
| Reconciliation | Count/hash API vs SQL for RFP/PRG after seed |
| Cutover | Flip read SoR module-by-module (ADR-0017 gates). Opportunity → RFP → Programme → costing → approval |
| Rollback | Keep previous API build; DROP/disable new FKs only via **down** migration if authorized — default **forward-fix**. Memory SoR rollback is **not** a Production rollback strategy |
| Post-cutover | Restart test + reconciliation report |

---

# 16. Test strategy

| Layer | Currently possible | Blocked until persist |
| --- | --- | --- |
| 1 Unit (kernel transitions, SLA) | **Yes** | — |
| 2 Repository | No RFP/PRG repos | **Blocked** |
| 3 Transaction (atomic create) | `withTransaction` exists; unused by RFP | **Blocked** for these modules |
| 4 API in-memory | **Yes** (`c3.rfp.test.ts`, `c5.programme.test.ts`) | Not recovery evidence |
| 5 Integration PG | CRM/supplier/outbox gated tests | **Blocked** for RFP/PRG |
| 6 Migration | Runner **EXISTS**; new SQL not created | Future migration tests **blocked** until files exist **and** execution authorized |
| 7 Restart/recovery | **NOT YET TESTABLE** for RFP/PRG | **Blocked** |
| 8 Failover | Lab DB only | App+DB **blocked**; hosting HA **blocked** (E3) |
| 9 Concurrency | Weak (single process) | **Blocked** (optimistic lock tests) |
| 10 Audit/versioning persist | Memory tests only | **Blocked** |
| 11 Document metadata persist | FS + memory | **Blocked** for durable metadata |
| 12 Application RTO/RPO | **NOT YET TESTABLE** | **Blocked** |
| 13 UAT | **NOT AUTHORIZED** | Governance |

---

# 17. Implementation work packages (ordered)

All status: **NOT STARTED** · **NOT AUTHORIZED**.

| ID | Objective | Depends | Expected components (future) | Schema | Tests | Rollback | Auth |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WP-01 | Persistence model (this pack) | 6A | This document | None now | n/a | n/a | Design approval **not granted** |
| WP-02 | Schema amendments (FKs, unique programme/RFP) | WP-01 | New `123+` SQL **when authorized** | Additive after 122 | Migration apply on Dev PG | Forward-fix | Migration **file** vs **execute** split |
| WP-03 | Repositories (`persistence/rfp.ts`, `programme.ts`, `opportunity.ts`) using `pg.Pool` | WP-02 | `apps/api/src/persistence/*` | Uses WP-02 | Repository tests | Code revert | Dev/Test implementation |
| WP-04 | Transactional services; fail-closed persist; optimistic lock | WP-03 | Change `rfp.ts` / `programme.ts` **when authorized** | — | Transaction tests | Code revert | Dev/Test implementation |
| WP-05 | Opportunity persist + read-through | WP-04 | `pipeline/opportunity.ts`, hydrate **or** SQL read | `015` + FKs | Restart retrieve opp | — | Dev/Test + migrate execute |
| WP-06 | RFP persist + versions + transitions | WP-05 | `rfp/*` | `016`/`122` + FKs | Restart retrieve RFP | — | Same |
| WP-07 | Programme persist + days/items/versions | WP-06 | `programme/*` | `017`/`122` + unique rfp | Restart retrieve itinerary | — | Same |
| WP-08 | Durable `recordAudit` + version rows in same TX | WP-04 | `store.ts` audit path | `audit_events` | Audit after restart | — | Dev/Test |
| WP-09 | Document metadata persist + storage port; compensate | WP-06 | `commercial-documents/*` | `119` | Metadata after restart | Delete orphan bytes | Dev/Test; object location Legal |
| WP-10 | Startup: no memory SoR for critical modules; ready/fail | WP-05–07 | `main.ts` | — | Ready 503 without DB | — | Dev/Test |
| WP-11 | Multi-replica / reconnect (pool retry); no Store split-brain | WP-10 | `packages/db` pool options | — | Two-instance test | — | Dev/Test; **not** hosting HA product |
| WP-12 | Backup/PITR against **real** rfp/prg tables | WP-06/07 | Markers in app tables | — | Restore probe | — | Lab/Dev only; ADR-0011 product TBD |
| WP-13 | Application RTO/RPO tests §14 | WP-10–12 | New test files **when authorized** | — | Timed recovery | — | Test authorization |
| WP-14 | Cutover from Store SoR; seed redesign; reconciliation | WP-06/07/10 | `seed-demo-data.ts`, ADR-0017 update | — | Reconcile | Feature flag | **Cutover** auth ≠ this pack |
| WP-15 | Persist metrics, lock conflicts, hydrate counts | WP-04 | observability | — | Metric assertions | — | Dev/Test |
| WP-16 | Secrets/IdP remain ADR-0012/0013 | ADR-0006 later | ports | — | — | — | **Not** granted here; **not** a provider pick |

Costing (I), approval (J), proposal/booking follow WP-07; they are **sequenced after** jointly critical SoR, not omitted from the roadmap.

---

# 18. IMPLEMENTATION AUTHORIZATION REQUEST

**CURRENT STATUS = NOT AUTHORIZED** for every row below. This section **requests** future decisions; it **grants** none.

| ID | Authorization | Would permit (future) | Does **not** permit |
| --- | --- | --- | --- |
| **A. Design approval** | Accept this target architecture as the Dev/Test persistence *design* | Proceed to request B | Code, migrations, Production |
| **B. Dev/Test implementation authorization** | Implement WP-03–WP-11, WP-15 in Development/Test only | Edit application code against Dev PG | Production, UAT, live PII, hosting selection |
| **C. Migration execution authorization** | Apply **new** additive migrations on Dev/Test database | `migrate()` on non-Production | Production schema, data backfill of live data |
| **D. UAT authorization** | Later UAT of persisted modules | UAT environment use | Production |
| **E. Production implementation authorization** | Production-build of persistence | Production code path | Deploy |
| **F. Production migration authorization** | Apply schema on Production | Production DDL | Data residency bypass; still needs E1 |
| **G. Production deployment authorization** | Deploy | Runtime in Production | Implied by ADR-0006 approval alone — **still separate** |

**A is not granted by writing this file.**  
**B–G are not granted.**

Separately still required (unchanged): ADR-0006 approval, DP-0006 approval, Production jurisdiction, backup/DR jurisdiction, identity/secrets, PCI scope as applicable.

---

# 19. Architecture decision dependencies

| Dependency | Relationship to this design |
| --- | --- |
| ADR-0006 hosting | Persistence SoR class ≠ selected region/provider. Hosting must **support** PostgreSQL + backup/PITR + future HA |
| DP-0006 | Same; remains OPEN |
| Legal/DPO (E1) | Document byte location, backup copies, logs, subprocessors; participant PII if that domain is added |
| Security / identity (ADR-0012, ADR-0013) | Sessions/secrets/IdP; not solved by RFP tables |
| Finance (E4) | Implementation/migration labour is a TCO line — **no prices invented** |
| Provider selection | **Not** made. `DocumentStorage` + `pg` remain portable |
| Data residency | Table placement follows later approved jurisdiction |
| Backup/DR | Mechanisms apply to these tables **after** they are used; products TBD (ADR-0011) |
| PCI | Design position: no raw CHD; costing/payment metadata persist still in PCI **scope assessment** |

This persistence design **does not** select a cloud vendor.

---

# 20. Governance impact

This document **strengthens the evidence base** for ADR-0006 (it specifies what must be durable before application RTO/RPO can be tested). It does **NOT** approve ADR-0006.

Statuses remain:

E1: `OPEN — REQUIRES LEGAL/DPO VALIDATION`  
E2: `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`  
E3: `OPEN — HOSTING EVIDENCE IN PROGRESS`  
E4: `OPEN — TCO EVIDENCE INCOMPLETE`  

ADR-0006: `PROPOSED — BLOCKED FOR PRODUCTION`  
DP-0006: `OPEN — NOT APPROVED`  

Production: **NOT AUTHORIZED**  
Implementation: **NOT AUTHORIZED**  
Migration: **NOT AUTHORIZED**  
UAT: **NOT AUTHORIZED**  
Deployment: **NOT AUTHORIZED**

---

# 21. Acceptance criteria for **future** implementation

**Not currently achieved.**

1. No jointly critical business state depends on process-local memory as SoR.  
2. RFP survives process restart.  
3. Programme (including days/items) survives restart.  
4. Opportunity survives restart.  
5. Required security audit history for those mutations survives restart.  
6. Required document **metadata** survives restart (bytes per storage contract).  
7. Documented transactions are atomic (including audit/outbox insert).  
8. Referential integrity enforced where §8 requires DATABASE FOREIGN KEY.  
9. Concurrent updates are deterministic (409 on version conflict).  
10. Application can run with multiple replicas without split-brain RFP/PRG.  
11. Recovery procedure documented.  
12. Backup/PITR can restore **these** tables in Dev/Test (still not Production proof).  
13. Application-level recovery tests in §14 pass in the authorized environment.  
14. Measured timestamps collected (laboratory/Dev — not automatically Production RTO).  
15. Rollback/forward-fix procedure exists for the persistence WPs.

---

# 22. Recommended next governed action

Seek **A. Design approval** from Owner/IT (and Legal overlay for documents/PII) **before** any **B. Dev/Test implementation authorization**.

Do **not** implement from this document alone.

---

## Validation (this package)

- CURRENT findings match Stage 6A and cited schema/routes.  
- TARGET / PROPOSED SCHEMA are labelled and **not** applied.  
- No migrations created or executed.  
- No application/schema/infrastructure changes.  
- ADR-0006 and DP-0006 unmodified.  
- Authorizations A–G remain **NOT AUTHORIZED**.
