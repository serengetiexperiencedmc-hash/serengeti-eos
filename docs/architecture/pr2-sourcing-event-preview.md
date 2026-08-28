# PR2 SourcingEvent Catalogue — Stage 1 contract (approved)

> **CURRENT STATE (2026-08-29 Owner PR2 DEV/TEST PREVIEW — authorized for this PR2 in-memory API run only; EXECUTED)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`01d62322453af837026827018caf278f7b8f8071`** (`origin/master`; `feat(pr1): implement procurement catalogue`). **PR1** remains **IMPLEMENTED / CLOSED** (Dev/Test).  
> This document is the **approved** Stage 1 architecture contract. Dev/Test implementation is written. Tests **PASS**. This in-memory API preview **EXECUTED**. It does **not** authorize UAT, Production, commit, or push. It is **not** database-backed validation.  
> Selection / ID / Stage 1 approval / implementation / test-run record: [`../governance/pr2-sourcing-event-authorized.md`](../governance/pr2-sourcing-event-authorized.md).  
> **CAPABILITY=SOURCING_EVENT** · **CAPABILITY_NAME=SourcingEvent** · **CAPABILITY_ID=PR2** · **SELECTION_STATUS=SELECTED**  
> **STAGE_1_CREATED=YES** · **STAGE_1=APPROVED** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES**  
> **EXECUTION_QUEUE=PR2 — SourcingEvent** (this Dev/Test API preview EXECUTED; commit / push not authorized) · **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **PREVIEW=AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY (EXECUTED)** · **TEST EXECUTION=COMPLETED / PASS** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **DP-0006=NOT APPROVED** · **ADR-0006=OPEN** · **ADR-0012=OPEN** · **ADR-0013=OPEN**

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **PR2** (Owner-assigned capability ID; not inferred) |
| Capability name | SourcingEvent |
| Product | SourcingEvent Catalogue |
| Family | procure |
| Domain | `procure` (domain map 2.2 leftover noun **SourcingEvent** after PR1 Request/PO). PR2 is **not** named Procurement. |
| Predecessor | I0 kernel (complete). **PR1** complete and **not** reopened (**conceptual predecessor only**). C4 / C6 / I8 complete and **not** reopened |
| Architecture status | This document is the **approved** PR2 Stage 1 contract. Dev/Test implementation is **written**. Tests **PASS**. This in-memory API preview **EXECUTED**. |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; IMPLEMENTATION WRITTEN; TESTS PASS; THIS DEV/TEST API PREVIEW EXECUTED** |
| Implementation status | **WRITTEN** (Development/Test; tests **PASS**; this in-memory API preview **EXECUTED**) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` is Dev/Test SoR (`sourcingEventRecords`). Additive SQL `118_pr2_sourcing_event_records.sql` (file present; **not** applied to a live database in tests or this preview). This preview is **not** database-backed validation. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record by this contract. |
| Runtime health | `GET /v1/sourcing-events/health`, `increment` **PR2**, `module` `sourcing-event-register`. Must not replace PR1 `/v1/procurement/health`. **Tests PASS. This in-memory preview observed PR2 health.** |
| UI | **U1 / API-only.** No PR2 UI. No `/commercial/sourcing-events`. |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **PR2** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1** | **APPROVED** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Development/Test only) |
| **PREVIEW** | **AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY** — **EXECUTED** (in-memory API) |
| **TEST EXECUTION** | **COMPLETED / PASS** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **PR2 — SourcingEvent** (this Dev/Test API preview EXECUTED; commit / push not authorized) |

Authority: 2026-08-28 Product Owner **PR2 — SOURCINGEVENT CAPABILITY ID ASSIGNMENT** and **PATH B — SOURCINGEVENT CAPABILITY SELECTION** ([`pr2-sourcing-event-authorized.md`](../governance/pr2-sourcing-event-authorized.md)); 2026-08-28 **PR2 STAGE 1 CONTRACT AUTHORING ONLY**; 2026-08-28 **PR2 STAGE 1 OWNER DECISIONS**; 2026-08-28 Product Owner **PR2 STAGE 1 OWNER APPROVAL** (`STAGE_1_APPROVED=YES`); 2026-08-29 Product Owner **PR2 IMPLEMENTATION AUTHORIZATION** (`IMPLEMENTATION_AUTHORIZED=YES` / `ENVIRONMENT=DEVTEST`); 2026-08-29 Product Owner **PR2 TEST EXECUTION AUTHORIZATION** (tests **EXECUTED; PASS**); 2026-08-29 Product Owner **PR2 DEV/TEST PREVIEW AUTHORIZATION** (this in-memory API preview **EXECUTED**). A completed preview ≠ commit, UAT, or Production. This document does **not** reopen PR1 / C4 / C6 / I8.

```text
OWNER SELECTION
    ↓
STAGE 1 DRAFT
    ↓
STAGE 1 OWNER DECISIONS RECORDED
    ↓
STAGE 1 APPROVAL
    ↓
SEPARATE IMPLEMENTATION AUTHORIZATION
    ↓
SEPARATE TEST EXECUTION AUTHORIZATION   ← EXECUTED; PASS
    ↓
SEPARATE PREVIEW AUTHORIZATION          ← current (this in-memory API preview EXECUTED)
    ↓
COMMIT / PUSH (each separate)
```

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ test / Preview authorization.**  
**Preview ≠ UAT.**  
**UAT ≠ Production.**

```text
CAPABILITY                    = SOURCING_EVENT
CAPABILITY_ID                 = PR2
CAPABILITY_NAME               = SourcingEvent
DOMAIN                        = procure
STAGE                         = 1
PRODUCT_STATE                 = FROZEN_DEVTEST
STAGE_1                       = APPROVED
STAGE_1_CREATED               = YES
STAGE_1_STATUS                = APPROVED
STAGE_1_APPROVED              = YES
IMPLEMENTATION_AUTHORIZED     = YES
TEST EXECUTION                = COMPLETED / PASS
PREVIEW                       = AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY (EXECUTED)
UAT                           = NOT_AUTHORIZED
PRODUCTION                    = NOT_AUTHORIZED
COMMIT                        = NOT_AUTHORIZED
PUSH                          = NOT_AUTHORIZED
DP-0006                       = NOT APPROVED
ADR-0006 / ADR-0012 / ADR-0013 = OPEN
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
NEXT_INCREMENT                = NONE_AUTHORIZED
NEW_CAPABILITY_AUTHORIZED     = NONE
```

The sections after this heading are the **approved** Stage 1 contract. Dev/Test implementation of these sections is **authorized**. Tests **PASS**. This in-memory API preview **EXECUTED**. That preview does **not** authorize commit, UAT, or Production.

---

## Capability definition

```text
PR2 / SourcingEvent / procure

A human-maintained Dev/Test catalogue recording that a sourcing event
exists as a catalogue item.

The increment records catalogue identity and membership only.
It does not conduct, manage, automate, score, discover, award, or execute
a sourcing process.
```

```text
catalogue record  = a human row that a sourcing event is listed (or retired from the catalogue)
sourcing process  = RFQ, tender, bidding, scoring, auction, discovery, award, or supplier selection
```

A **SourcingEvent** row is a **catalogue record**. It is **not** a sourcing process.

---

## Objective

Deliver a **bounded Dev/Test catalogue** where an authorised human can record that a **sourcing event exists** as a catalogue item (`open`), or that the human has retired that row from the active catalogue (`retired`).

```text
SourcingEvent Catalogue = a human record that a sourcing event exists.
SourcingEvent Catalogue ≠ a sourcing process.
SourcingEvent Catalogue ≠ RFQ / tender / bidding / scoring / auction.
SourcingEvent Catalogue ≠ PR1 Request/PO catalogue.
```

The row is an **existence / identity / membership catalogue record**. It does **not** conduct sourcing. It does **not** invite, compare, or select suppliers. It does **not** create documents, deadlines, or awards.

Domain map 2.2 names **Request, PO, SourcingEvent** under `procure`. **PR1** shipped Request and PO as **one** Procurement Catalogue. **PR2** is the remaining leftover noun as a **separate** catalogue. PR1 remains **CLOSED**.

---

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **PR2 SourcingEvent Catalogue** | A human record that a sourcing event **catalogue row exists** | Store key `sourcingEventRecords`. **Not** `procurementRecords` |
| **PR1 Procurement Catalogue** | Human record that a PR/PO exists | Closed — **no** PR1 mutation; **no** PR2 subroute on PR1; **no** PR1 foreign key |
| **C4 Supplier** | Supplier master | Closed — **not** selected. No `supplierId` |
| **C6 Costing / rates** | Programme costing and rate cards | Closed — **no** rate or costing fields |
| **I8 Finance** | Quotes, invoices, reconciliation | Closed — **no** AP / invoice / payment / GL |
| **Kernel Event** | Platform outbox / NATS events | Closed — PR2 is not the event bus |

**PR1** records that a purchase request and/or purchase order is listed.  
**PR2** records that a **sourcing event** is listed as a catalogue item.

Distinctness is **product identity** (codes, store, permissions, routes, copy, exclusions), not extra sourcing-process fields. Do **not** add RFQ numbers, bid lists, scorecards, auction clocks, discovery queries, or workflow states merely to enlarge the distinction. Those would turn PR2 into a sourcing process.

Do **not** reuse store key `procurementRecords`. Do **not** reuse codes `PRC-*`. Do **not** reuse `/v1/procurement` or `/v1/procurement/:id/*`. Do **not** create `/v1/procurement/:id/sourcing-events`.

---

## Scope

| Deliverable | In this Stage 1 contract |
| --- | --- |
| Catalogue create / list / get / patch while `open` | Yes (API **implemented** in Dev/Test; this test run **PASS**) |
| Tenant-unique `code` with prefix **`SE-`** | Yes — Owner-resolved. Not `PRC-`. Not capability id `PR2` as allocator |
| Membership `open` → `retired` only | Yes — Owner-resolved Option B |
| Required `title`; optional `notes`; optional `ownerLabel` | Yes (Path B register minimum) |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Store, API, health, permissions, role | Yes (**implemented** in Dev/Test; this test run **PASS**) |
| UI | **U1 / API-only.** No PR2 UI. No `/commercial/sourcing-events` |
| Optional C4 `supplierId` | **No** |
| Optional PR1 `procurementId` | **No** |
| In-memory Dev/Test SoR if implementation is later authorized | Yes |
| Additive SQL if a later implementation gate authorizes it | Yes — `118_pr2_sourcing_event_records.sql` |
| RFQ / tender / bidding / scoring / auction | **No** |
| Supplier discovery / onboarding / C4 mutation | **No** |
| Automated sourcing / automated supplier selection / I2 purchasing workflow | **No** |
| Pricing / rate / costing / AP / GL | **No** |
| PR1 replacement | **No** |
| UAT / Production | **No** |

Required field **`title`** matches ITA1 / ITL1 / ITR1 / P2 / ITE1 / P3 / DG1 / E1 / PR1 register convention.

No amount, currency, quantity, line-item, bid, score, auction, deadline-as-engine, RFQ document, award, or payment fields. No date fields as SLA, bid-close, or automatic status drivers.

Forbidden catalogue statuses: `done`, `cancelled`, `approved`, `issued`, `tendering`, `bidding`, `scoring`, `awarded`, `shortlisted`, `rfq_sent`, `auction_open`, `selected`, `rejected`, `supplier_selected`, and any equivalent sourcing-process state.

---

## Aggregate / resource (Stage 1 contract design)

These names are the **approved** Stage 1 contract design constraints. Dev/Test implementation follows them. They do **not** authorize test execution, UI, UAT, or Production.

| Item | Stage 1 contract value | Must not |
| --- | --- | --- |
| Aggregate name | **SourcingEvent** (catalogue row) | PR1 `ProcurementRecord` |
| JSON object name | `sourcingEvent` (list: `items`) | PR1 `{ record }` |
| Runtime store key | `sourcingEventRecords` | `procurementRecords` |
| SQL table intent | `sourcing_event_records` | `ALTER` `procurement_records` |
| Collection path | `/v1/sourcing-events` | `/v1/procurement` |
| Role | `sourcingEvent.register` | `procure.catalogue` / `procure.record` |
| Health increment | `PR2` | increment `PR1` |
| Health module | `sourcing-event-register` | module `procurement-catalogue` |

---

## Fields (minimum catalogue)

Only Path B register-minimum fields. No sourcing-process fields.

| Field | Type | Required | Validation | Mutability | Boundary |
| --- | --- | --- | --- | --- | --- |
| `id` | UUID string | Yes (server) | Existing kernel id rules | Immutable | Server-assigned row identity |
| `code` | string | Yes (server) | Unique per tenant; prefix **`SE-`**; not `PRC-`; not capability id `PR2` as allocator | Immutable after create | Catalogue identifier only — **not** an RFQ/tender number engine. JSON field is `code`, **not** `procurementCode` |
| `title` | string | Yes | Non-empty; max 200 (PR1/DG1 precedent) | Mutable while `open` | Human catalogue label |
| `notes` | string | No | Max 2000 | Mutable while `open` | Optional catalogue notes. **Not** bid commentary, score rationale, or award narrative as structured process data |
| `ownerLabel` | string | No | Max 200; operator text, **not** a principal id | Mutable while `open` | Human-readable operator label only |
| `status` | enum `open` \| `retired` | Yes (server on create) | Create always `open`; only allowed change is `open` → `retired` | `open` → `retired` only | Catalogue membership. **Not** a sourcing-process state |
| `createdAt` / `updatedAt` | ISO timestamps | Yes (server) | Server clock | Server-managed | Existing platform convention |
| `createdByPrincipalId` / `updatedByPrincipalId` | principal id | Yes (server) | Actor principal | Server-managed; **omit from JSON** (PR1/E1) | Not client-controlled fields |

JSON omits `tenantId` and `principalId`. Tenant comes from the authenticated principal only.

**Not in this contract:** `supplierId`, `procurementId`, amounts, pricing, rates, costs, bids, scores, RFQ documents, tender documents, supplier-discovery data, supplier onboarding data, award data.

Create/get/patch wrap as `{ sourcingEvent: ... }`. List wraps as `{ items }` (ITA1/P2/DG1/PR1 list pattern).

Conceptual JSON:

```json
{
  "sourcingEvent": {
    "id": "...",
    "code": "SE-...",
    "title": "...",
    "notes": "...",
    "ownerLabel": "...",
    "status": "open"
  }
}
```

---

## Identifier

**Capability ID** `PR2` is Owner-assigned and must **not** be used as the per-row code prefix.

**Row-code prefix (Owner-resolved):** `SE-`

- Must not be `PRC-` (PR1).
- Must not be `PR2` as an allocator.
- JSON field name is **`code`**, not `procurementCode`.

Numeric sequencing follows the established register convention (PR1 `PRC-0001`, DG1/E1 sequential per tenant): server-assigned, unique per tenant, next unused `SE-` + zero-padded decimal sequence (first row `SE-0001`). Do **not** invent a new allocator architecture.

A `code` is a **catalogue identifier**. It is **not** an RFQ number, tender number, bid number, or award number.

---

## Lifecycle

**Owner-resolved: Option B.**

```text
open → retired
```

`retired` is the **sole** terminal state. Do **not** introduce `done`, `cancelled`, `awarded`, `approved`, `issued`, `tendering`, `bidding`, `scoring`, `rfq_sent`, `auction_open`, `supplier_selected`, or any equivalent sourcing-process state.

| Status | Meaning | Must not mean |
| --- | --- | --- |
| `open` | The human listed the sourcing event as an **active catalogue entry** | RFQ issued; tender live; bids received; sourcing in progress |
| `retired` | Catalogue membership is **no longer active** — the row is withdrawn from the current catalogue | Sourcing completed; supplier awarded; purchase approved; tender completed |

Transitions:

- Create always starts `open`. Client-supplied create `status` is ignored.
- PATCH metadata (`title`, `notes`, `ownerLabel`) while `open`.
- PATCH `status` to `retired` only from `open`.
- `retired` rows reject further patch (`409` `retired`, matching E1 terminal deny).
- Illegal transition → `409` `invalid_transition`.
- **No reopen.** Do not invent reactivation of a retired row.
- No dedicated source / tender / score / award endpoints. Status change is **PATCH** only.

---

## API

Collection: **`/v1/sourcing-events`**. Not `/v1/procurement`. Not `/v1/events` (kernel). Not `/v1/suppliers/:id/sourcing-events`. No PR2 endpoints under `/v1/procurement`. PR1 remains unchanged.

| Method | Path | Purpose | Permission | Request / response | Validation |
| --- | --- | --- | --- | --- | --- |
| GET | `/v1/sourcing-events/health` | Health | `sourcingEvent:read:register` | `{ increment, module, status, records, openRecords }` | Authenticated; tenant-scoped counts. `increment` is `PR2`. `module` is `sourcing-event-register`. `openRecords` = rows with `status=open` |
| GET | `/v1/sourcing-events?q=&status=` | Catalogue list | `sourcingEvent:read:register` | `{ items }` | `q` = ordinary catalogue text filter on `title` / `code` (**not** supplier discovery). `status` = `open` \| `retired`. Newest first |
| POST | `/v1/sourcing-events` | Create `open` row | `sourcingEvent:write:register` | body `{ title, notes?, ownerLabel? }` → `{ sourcingEvent }` | Human actor; title required; ignore client status; server `code` `SE-*` |
| GET | `/v1/sourcing-events/:id` | Get | `sourcingEvent:read:register` | `{ sourcingEvent }` | Same-tenant; 404 otherwise |
| PATCH | `/v1/sourcing-events/:id` | Patch `open` metadata or retire | `sourcingEvent:write:register` | body subset of `title` / `notes` / `ownerLabel` / `status` | Human; metadata while `open`; `status` only `open` → `retired`; `retired` deny |

GET collection is **catalogue retrieval/filtering only**. `q` is ordinary catalogue text filtering. It is **not** supplier discovery, ranking, or scoring.

Forbidden process subroutes (if later probed, **404**, PR1 engine-subroute precedent): `.../rfq`, `.../tender`, `.../bid`, `.../score`, `.../auction`, `.../award`, `.../discover`, `.../source`, `.../select`.

Unauthenticated → 401. Wrong permission → 403. Cross-tenant → 404.

---

## Permissions

Do **not** reuse `procure:read:record` / `procure:write:record`.

| Permission | Use |
| --- | --- |
| `sourcingEvent:read:register` | Health, list, get |
| `sourcingEvent:write:register` | Create, patch (including retire) |

Role: **`sourcingEvent.register`** — both permissions. Must not reuse `procure.catalogue` / PR1 role keys.

No ABAC expansion. No supplier-specific authorization. No AI/automation permission.

---

## Persistence

Dev/Test SoR is in-memory `Store` under **`sourcingEventRecords`**. Additive SQL: new table **`sourcing_event_records`** (`118_pr2_sourcing_event_records.sql`). Do **not** `ALTER` `procurement_records`, C4, C6, or I8 tables.

- `UNIQUE (tenant_id, code)`.
- **No FK** to PR1 procurement records. **No FK** to C4 supplier records. Conceptual predecessor ≠ technical coupling.
- Live PostgreSQL UNVERIFIED. PostgreSQL is **not** a new SoR. ADR-0017 not reopened.
- `schema_registry` context_key: `sourcing-event-records`.
- Migration number **118** is the next free number after committed `117_pr1_procurement_records.sql`. It does **not** use uncommitted PQL (`109`–`115`) or O7 drafts.

---

## Health

PR2 receives its own health endpoint (register convention). **Written in this implementation pass. Tests not executed.**

| Item | Stage 1 contract | Must not |
| --- | --- | --- |
| Path | `GET /v1/sourcing-events/health` | Alter `GET /v1/procurement/health` |
| `increment` | **`PR2`** | Use increment `PR1` |
| `module` | `sourcing-event-register` | Reuse `procurement-catalogue` |
| Counts | `records` (total), `openRecords` (`status=open`), analogous to PR1 | Change PR1 health accounting |

---

## UI

**Owner-resolved: U1 — API-only.**

```text
UI = U1 / API-only
```

PR2 does **not** require a UI. UI work is **outside this increment**.

- Do **not** create `/commercial/sourcing-events`.
- Do **not** modify the commercial procurement UI (`/commercial/procurement`).
- Do **not** add a Commercial nav item for SourcingEvent in this increment.

---

## Audit / security

Audit/security behaviour inherits the established platform/register audit and authorization mechanisms. PR2 must **not** introduce a new bespoke audit emission mechanism as part of this increment. Path-B register services (PR1, DG1) do **not** call a bespoke `recordAudit` on the register service; PR2 must match that sibling class. I0 audit/hash-chain remains available to other modules and is not redesigned here.

Retain:

- Human-only mutation: `actorType === "Human"`; non-Human → `403` `ai_actor` (existing kernel behaviour).
- Tenant isolation: actor tenant only. Missing / other-tenant id → 404.
- Existing platform authorization (`sourcingEvent:read:register` / `sourcingEvent:write:register`).
- Existing audit mechanisms. **No new audit architecture.**

Prohibit:

- New bespoke audit mechanism
- ABAC expansion
- Supplier discovery
- Automation / AI mutation
- Partner-wide sourcing marketplace / break-glass supplier access
- JSON returning other-tenant rows or principal ids

Do not reopen ADR-0012 or ADR-0013. Do not claim tests or AV have been completed.

---

## Tests (acceptance boundary — authorized run EXECUTED; PASS)

Dev/Test tests were **written** and **EXECUTED** with result **PASS**. This in-memory API preview **EXECUTED**. Commit and push remain separately gated. Do not infer UAT or Production. This preview is **not** live PostgreSQL validation.

- Authorization: unauthenticated 401; missing permission 403
- Tenant isolation: cross-tenant 404
- CRUD: create `open` row; get; list `q` / `status`; patch metadata while `open`
- `SE-*` code allocation (server-assigned; unique per tenant; not `PRC-*`; not `PR2-` as prefix)
- `open` → `retired`; `retired` deny further patch (`409` `retired`)
- Invalid lifecycle transitions `409` `invalid_transition`
- AI / non-Human mutate → `403` `ai_actor` where existing platform convention requires it
- Separation from PR1: no `/v1/procurement` reuse; no `procurementRecords`; no `PRC-*`
- Health `increment` is `PR2`; PR1 `/v1/procurement/health` unchanged
- Prohibited sourcing-process endpoints absent / 404 (`rfq`, `tender`, `bid`, `score`, `auction`, `award`, `discover`, `source`, `select`)

Not in scope: Azure, AV-03–AV-12, UAT, Production, latency, restore. This authorized test run is **not** UAT or Production. No AV item is complete.

---

## Dependencies

| Subject | Classification |
| --- | --- |
| PR1 | **CONCEPTUAL PREDECESSOR** only. **Not** a technical or runtime dependency. No PR1 FK |
| C4 | **Excluded** |
| C6 | **Excluded** |
| I8 | **Excluded** |
| DG1 / E1 / E2 | Convention / reference only. **Not** dependencies |
| DP-0006 | **Not** a dependency for this bounded Dev/Test contract |
| Azure | **Not** a dependency |
| Microsoft response | **Not** a dependency |
| Legal clearance | **Not** a dependency |
| UAT | **Not authorized** |
| Production | **Not authorized** |
| I0 kernel (auth, tenant, audit, Store) | Technical platform already present |

---

## Negative scope

PR2 must **not** become:

- RFQ engine
- Tender-management system
- Supplier-bidding platform
- Supplier-scoring system
- Auction system
- Supplier-discovery system
- Supplier-onboarding system
- Automated sourcing system
- Automated supplier-selection system
- Procurement workflow engine
- Pricing / rate / costing system
- AP / GL system
- PR1 replacement
- C4 expansion
- C6 expansion
- I8 expansion
- UAT system
- Production procurement system

No supplier or procurement foreign key is required by this contract.

---

## STOP rule

If implementation pressure appears to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- RFQ engine; tender management; supplier bidding; supplier scoring; auction
- Supplier discovery; supplier onboarding; C4 mutation
- Automated sourcing; automated supplier selection; I2 purchasing workflow
- Pricing; rates; costing; AP; GL; line items; amounts
- PR1 replacement; PR1 subroutes; reuse of `PRC-` / `procurementRecords` / `/v1/procurement`
- `supplierId` or `procurementId` without a revised Stage 1
- UI (`/commercial/sourcing-events` or procurement-page nesting)
- Reopen of a `retired` row
- AI mutation
- A new bespoke audit mechanism
- UAT / Production
- DP-0006 approval; ADR-0006 / 0012 / 0013 closure; ADR-0017 reopen

---

## Owner decision register

| Decision | Owner-resolved value | Status |
| --- | --- | --- |
| Row-code prefix | `SE-` (not `PRC-`, not `PR2` as allocator) | **APPROVED** (Stage 1 contract; implementation not authorized) |
| JSON register-code field | `code` (not `procurementCode`) | **APPROVED** |
| Lifecycle | `open` → `retired` (`retired` sole terminal; no reopen) | **APPROVED** |
| Permissions | `sourcingEvent:read:register` / `sourcingEvent:write:register` | **APPROVED** |
| Role | `sourcingEvent.register` | **APPROVED** |
| UI | **U1 / API-only.** No `/commercial/sourcing-events` | **APPROVED** |
| Store / table / path | `sourcingEventRecords` / `sourcing_event_records` / `/v1/sourcing-events` | **APPROVED** as Stage 1 design constraints |
| JSON wrapper | `{ sourcingEvent }` | **APPROVED** |
| Health increment / module / path | `PR2` / `sourcing-event-register` / `/v1/sourcing-events/health` | **APPROVED** |
| Audit | Inherit Path-B register pattern; no bespoke `recordAudit` on the register service | **APPROVED** |
| Optional C4 `supplierId` | **Excluded** | **APPROVED** |
| Optional PR1 `procurementId` | **Excluded** | **APPROVED** |

These values are the **approved** Stage 1 contract. Approval ≠ Preview, UAT, Production, commit, or push. This test run does **not** change those gates.

---

## What this document does not do

This **approved** Stage 1 contract does **not**: convert this preview into UAT, Production, commit, or push; treat this preview as database-backed validation; reuse PR1 identifiers or routes; select C4 or a PR1 FK; approve DP-0006; close ADRs; contact Microsoft; send the RFI; commit; or push.
