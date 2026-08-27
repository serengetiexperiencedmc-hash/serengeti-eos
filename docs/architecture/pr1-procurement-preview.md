# PR1 Procurement Catalogue — Stage 1 contract (approved)

> **CURRENT STATE (2026-08-27 documentation catch-up — PR1 push COMPLETED; Product Owner HOLD)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`01d62322453af837026827018caf278f7b8f8071`** (`origin/master`; `feat(pr1): implement procurement catalogue`). Parent **`27066dadb35bdec643b41caa998bbab1c72aeae6`**. **DG1** Dataset Register remains **COMPLETE**.  
> This document remains the **approved** Stage 1 architecture contract. Development/Test implementation is **COMPLETED**. Preview **PASS**. Commit **COMPLETED**. Push **COMPLETED**. It does **not** authorize UAT or Production.  
> Preview **PASS** includes a **non-blocking** browser-automation / environment finding (Cursor browser MCP not attached). That finding is environmental, not a PR1 product defect.  
> **CAPABILITY=PROCUREMENT (PO)** · **SELECTION_STATUS=SELECTED** · **CAPABILITY_ID=PR1** · **ID_ASSIGNMENT=EXECUTED**  
> **STAGE_1_AUTHORING=AUTHORIZED** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES**  
> **IMPLEMENTATION_AUTHORIZED=YES** · **IMPLEMENTATION=COMPLETED** · **PREVIEW=PASS** · **COMMIT=COMPLETED** · **PUSH=COMPLETED**  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **ADR-0012=OPEN** · **ADR-0013=OPEN**  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> Authority record: [`../governance/pr1-procurement-authorized.md`](../governance/pr1-procurement-authorized.md). Predecessor undefer: [`../governance/procurement-po-undefer-authorized.md`](../governance/procurement-po-undefer-authorized.md).

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **PR1** |
| Capability name | PROCUREMENT (PO) |
| Product | Procurement Catalogue |
| Family | procure |
| Domain | Procurement (`procure` — domain map 2.2 leftover nouns **Request** and **PO** only; **not** SourcingEvent) |
| Predecessor | I0 kernel (complete). C4 Supplier master complete and **not** reopened. C1–C10 / C6 / C9 / C10 / I8 complete and **not** reopened |
| Architecture status | This document is the PR1 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; IMPLEMENTATION COMPLETED (Dev/Test); PREVIEW PASS; COMMIT COMPLETED; PUSH COMPLETED** |
| Implementation status | **COMPLETED** (Development/Test only; Preview **PASS**; not UAT) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` is Dev/Test SoR. Additive SQL `117_pr1_procurement_records.sql`. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record. |
| Runtime health increment | **PR1** (must not replace C4 supplier health or I8 finance health) |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **PR1** |
| **STAGE_1_AUTHORING** | **AUTHORIZED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Development/Test only) |
| **IMPLEMENTATION** | **COMPLETED** |
| **PREVIEW** | **PASS** |
| **COMMIT** | **COMPLETED** |
| **PUSH** | **COMPLETED** |
| **EXECUTION_QUEUE** | **EMPTY** |

Authority: 2026-08-27 Operator **PROCUREMENT (PO) — PRODUCT OWNER SELECTION + ID ASSIGNMENT ONLY** (`CAPABILITY_ID=PR1`, recorded by [`pr1-procurement-authorized.md`](../governance/pr1-procurement-authorized.md)); 2026-08-27 Operator **PR1 STAGE 1 CONTRACT AUTHORING — GOVERNANCE-BOUNDED**; 2026-08-27 Operator **PR1 PROCUREMENT — STAGE 1 APPROVAL** (`STAGE_1_APPROVED=YES`); 2026-08-27 Operator **PR1 PROCUREMENT — IMPLEMENTATION AUTHORIZATION** (`IMPLEMENTATION=COMPLETED`, Development/Test only); subsequent Operator Preview / commit / push gates (Preview **PASS**, commit **COMPLETED**, push **COMPLETED** at `01d62322453af837026827018caf278f7b8f8071`). This Stage 1 document remains the **approved** architecture contract. Preview PASS, commit, and push do **not** authorize UAT or Production, and do **not** reopen C1–C10 / C4 / C6 / C9 / C10 / I8 / DG1. It is **not** C11, **not** C10.x, **not** PO (stream label), **not** PO1, **not** P4, **not** I24, and **not** a sourcing, rate, AP, or booking engine.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ Preview.**  
**Preview ≠ UAT.**  
**UAT ≠ Production.**

The sections after this heading are the **approved** architecture contract. Development/Test implementation of this contract is **COMPLETED**. Preview **PASS**. Commit **COMPLETED**. Push **COMPLETED**. UAT remains unauthorized.

```text
CAPABILITY = PROCUREMENT (PO)
CAPABILITY_ID = PR1
CAPABILITY_NAME = PROCUREMENT (PO)
STAGE = 1
STATUS = SELECTED_ID_ASSIGNED_STAGE_1_APPROVED_IMPLEMENTED_DEVTEST_PREVIEW_PASS_PUSHED
STAGE_1_AUTHORING = AUTHORIZED
STAGE_1_CREATED = YES
STAGE_1_STATUS = APPROVED
STAGE_1_APPROVED = YES
IMPLEMENTATION_AUTHORIZED = YES
IMPLEMENTATION = COMPLETED
PREVIEW = PASS
COMMIT = COMPLETED
PUSH = COMPLETED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
ADR_0006 = OPEN
ADR_0012 = OPEN
ADR_0013 = OPEN
EXECUTION_QUEUE = EMPTY
NEXT_INCREMENT = NONE_AUTHORIZED
NEW_CAPABILITY_AUTHORIZED = NONE
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
```

---

## Objective

Deliver a **Commercial / Procurement** workspace surface where an authorised human can record **Procurement Catalogue rows**: a human catalogue that a **purchase request and/or purchase order exists**, or was cancelled.

**Procurement Catalogue = catalogue/governance record that a PR/PO row exists.**  
**Procurement Catalogue ≠ procurement engine.**  
**Procurement Catalogue ≠ sourcing / RFQ / tender platform.**  
**Procurement Catalogue ≠ accounts payable.**

The register is an **existence catalogue only**. It must **not** source suppliers, run tenders, score vendors, calculate rates or costs, approve purchases, match receipts, process invoices, post GL, pay banks, or mutate bookings.

Domain map 2.2 names **Request, PO, SourcingEvent** under `procure`, owned by Head of Procurement. This selection is the leftover **Request** and **PO** nouns as **one** catalogue. **SourcingEvent** remains inventory/context only and is **out of PR1 Stage 1**.

---

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **PR1 Procurement Catalogue** | A human record that a purchase request and/or purchase order **catalogue row exists** (or was cancelled) | New store (`procurementRecords`) |
| **C4 Supplier** | Supplier master | Closed — optional read-only `supplierId` only; **no** C4 mutation |
| **C6 Costing / rates** | Programme costing and rate cards | Closed — **no** rate or costing fields |
| **C9 / C10 Booking** | Booking and command center | Closed — **no** booking mutation |
| **I8 Finance** | Client quotes, invoices, reconciliation | Closed — **no** AP / invoice / payment / GL |
| **SourcingEvent** | Domain-map inventory noun | **Out of scope** — not a PR1 aggregate |

**C4 Supplier** records that a **supplier** exists.  
**PR1** records that a **purchase request / purchase order** is listed in the human catalogue.

Distinctness from C4 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra purchasing fields. Do **not** add amounts, currencies, line items, quantities, delivery dates, match flags, or approval states merely to enlarge the distinction. Those fields would turn PR1 into a purchasing or AP engine.

Do **not** use store key `suppliers` or reuse I8 finance keys. The PR1 key is **`procurementRecords`**.

Do **not** create `/v1/suppliers/:id/purchase-orders` or `/v1/finance/purchase-orders`. That would hang PR1 product behaviour off C4 or I8. PR1 has its own collection. C4 `/v1/suppliers` and I8 `/v1/finance` remain unchanged.

---

## Scope

| Deliverable | In scope |
| --- | --- |
| Catalogue create / list / get / patch (while `open`) | Yes |
| Codes unique per tenant with a dedicated prefix | Yes (`PRC-`) |
| Statuses: `open` → `cancelled`; `cancelled` terminal | Yes (catalogue membership only — **not** approval, issue, receipt, or payment state) |
| Required `title`; optional `notes`; optional `ownerLabel` | Yes |
| Optional `supplierId` — simple same-tenant C4 reference | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Dedicated store, API, health, UI, permissions, role | Yes |
| In-memory Dev/Test SoR if implementation is later authorized | Yes |
| Additive SQL only if a later implementation gate authorizes it | Yes (not in this authoring pass) |
| SourcingEvent / RFQ / tender / scoring | No |
| Supplier onboarding / supplier-master replacement | No |
| Rate-card or costing engine | No |
| Approval / workflow engine (I2 purchasing path) | No |
| Inventory / three-way matching / invoices / AP / payments / bank / GL | No |
| C10 booking mutation; C4 / C6 / C9 / I8 mutation | No |
| Automated purchasing; external procurement providers | No |
| C11 / C10.x | No |

Required field is **`title`**, matching ITA1/ITL1/ITR1/P2/ITE1/P3/DG1/E1 registers.

Code prefix is **`PRC-`**, a **register code**, not the capability id `PR1`, not the stream label `PO`. Repository search found no existing `PRC-` allocator and no `/v1/procurement` collection.

No amount, currency, quantity, line-item, delivery, match, invoice, or payment fields. No date fields as SLA, delivery, or automatic status drivers. Do **not** copy H1 optional `issuedOn` / `expiresOn` as purchasing dates. Do **not** copy C6 cost or I8 invoice fields.

Do **not** use statuses that imply purchasing, matching, or finance (`approved`, `rejected`, `issued`, `ordered`, `received`, `matched`, `invoiced`, `paid`, `posted`, `fulfilled`, `draft` as an approval queue). This catalogue uses only **`open` / `cancelled`**.

`open` means the human listed the PR/PO in the **catalogue**. It is **not** “approved to buy”, not “PO issued to supplier”, not “goods received”, and not “ready to pay”.  
`cancelled` means the human withdrew the row from the current catalogue. It is **not** an AP void, not a booking cancel, and not a three-way-match exception.

---

## Domain model (conceptual; approved)

**procurement_records** (runtime store key **`procurementRecords`**)

- Not C4 `suppliers` / `sup_suppliers`
- Not C6 costing / rate-card stores
- Not C9 / C10 booking stores
- Not I8 quotes / invoices / reconciliations
- Not SourcingEvent

Approved fields:

- `id`
- `procurementCode` unique per tenant (`PRC-0001`) — a **register code**, not a purchasing-system PO number engine
- `title` required (max 200)
- optional `notes` (max 2000)
- optional `ownerLabel` (operator text, not a principal id; max 200)
- optional `supplierId` (C4 supplier `id` in the same tenant)
- `status`: `open` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ record: ... }`. List wraps as `{ items }` (ITA1/P2/ITL1/DG1 pattern). JSON may include a read-only `supplierCode` resolved from C4 at response time when `supplierId` is set. C4 rows are not patched.

No amount, currency, quantity, lineItems, requestedDate as an engine, expectedDelivery, matchStatus, invoiceId, bookingId, sourcingEventId, rateCardId, or approvalTaskId.

A single catalogue row covers **purchase request and/or purchase order** existence. Do **not** split PR1 into two products, two IDs, or a `kind` workflow. The human `title` / `notes` may name the transaction; that is catalogue text, not a sourcing or AP document type engine.

---

## Relationship to C4 Supplier

**Optional `supplierId` is included.** Evidence: E1 optional `riskId` against closed I15; G2 optional `obligationId` against closed G1. Domain map lists `procure` and `supplier` as sibling contexts. C4 remains the supplier SoR.

Rules:

- `supplierId` is **not** required to create a catalogue row. A request/PO may be listed with no supplier link.
- If supplied, it must identify an existing C4 supplier in the actor's tenant (any C4 status). Missing or other-tenant ids → `400` `supplier_not_found`.
- The reference is a scalar identifier only. Creating, patching, or cancelling a PR1 row does **not** change C4 status, legal name, rates, contacts, or import batches.
- No cascade, no inverse collection on C4, no `/v1/suppliers/:id/procurement`.
- Do not add `supplierIds[]` many-to-many. One optional scalar is the G2-sized maximum.
- Do not create, edit, import, or approve suppliers from PR1.

C4 is **not** a hard runtime write prerequisite beyond “the C4 supplier module already exists in Dev/Test so a same-tenant id can be validated if the client sends one.”

---

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `procurement_records` table; do **not** `ALTER` C4 `sup_suppliers`, C6 costing, C9/C10 booking, or I8 finance tables);
- `UNIQUE (tenant_id, procurement_code)`;
- `supplier_id` nullable; **no** foreign-key cascade to C4 required (identifier validation in the service, matching E1/G2-style reference semantics);
- live PostgreSQL UNVERIFIED;
- PostgreSQL is **not** a newly established system of record;
- intended `schema_registry` context_key `procurement-records`;
- additive filename assigned at implementation to the next free number on **committed** `master` — **do not** invent a number that depends on uncommitted PQL (`109`–`115`) or O7 drafts;
- ADR-0017 **not** reopened.

---

## Workflow

| From | Action | To | Purpose |
| --- | --- | --- | --- |
| (none) | create with title (optional notes, ownerLabel, supplierId) | open | List a PR/PO in the catalogue |
| open | patch title / notes / ownerLabel / supplierId | open | Maintain catalogue metadata while listed |
| open | patch status to `cancelled` | cancelled | Human withdraws the row from the current catalogue |
| cancelled | patch | deny | Terminal — no silent reactivation |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule (create ignores client status and writes `open`).

**Why these states (minimum):** a catalogue needs “listed” and “withdrawn”. A third `draft`/`approved`/`issued` chain is an approval or purchasing engine and is **out of scope**. `done` (DG1 work-item pair) would imply a completed purchasing task, not a standing existence record.

No dedicated approve, order, receive, match, invoice, pay, source, tender, or score endpoints. Lifecycle uses **PATCH status** only (bounded surface as ITA1/ITL1/P2/E1/DG1). Illegal status change → `409` `invalid_transition`. Patch when `cancelled` → `409` `cancelled`.

Do **not** bind PR1 to I2 workflow/approval tasks. I2 remains available to other modules and is not a PR1 purchasing path.

---

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance for a new decision or a revised Stage 1. Do not silently expand this contract:

- SourcingEvent; RFQ; tender; supplier scoring
- supplier onboarding; C4 mutation; supplier-master replacement
- rate cards; costing; amounts; currencies; line items; quantities
- approval / workflow engines; I2 purchasing tasks
- inventory; three-way matching
- invoices; AP; payments; bank integration; GL
- C9 / C10 booking mutation; booking-linked settlement
- automated purchasing; external procurement-provider integration
- `supplierId` required, many-to-many suppliers, or C4 write from PR1
- a second capability or ID (C11, C10.x, PO1, P4, I24)
- AI mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen

---

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous PR/PO creation, issuing, matching, or cancellation.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency. Do not reopen ADR-0012 or ADR-0013.

---

## API

Prefix `/v1/procurement`. Do **not** attach PR1 to `/v1/suppliers`, `/v1/finance`, or C9/C10 booking routes. C4 and I8 collections are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

Repository search found no existing `/v1/procurement` collection. These routes are the intended **new** collection, consistent with DG1 `/v1/datasets` and E1 `/v1/erm/kris` beside existing domain prefixes.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/procurement/health` | `procure:read:record` |
| GET | `/v1/procurement?q=&status=` | `procure:read:record` |
| POST | `/v1/procurement` | `procure:write:record` |
| GET | `/v1/procurement/:id` | `procure:read:record` |
| PATCH | `/v1/procurement/:id` | `procure:write:record` |

Health increment is `PR1`. Intended health shape follows ITA1/ITL1/DG1: `module` `procurement-catalogue`, `increment` `PR1`, `status` `ok`, `records` count, `openRecords` count.

Do not add source, tender, score, approve, order, receive, match, invoice, pay, book, or automation routes. Forbidden engine subroutes on `/v1/procurement/:id/` return **404**.

**Required residual C4 / I8 / C10 protection:** `POST /v1/suppliers/:id/purchase-orders`, `/v1/finance/purchase-orders`, and any C10 procurement subroutes remain **404** if not already present. PR1 implementation must not hang catalogue behaviour off those modules.

Conceptual request/response:

- **Create** body: `{ title, notes?, ownerLabel?, supplierId? }` → `{ record }` with server `procurementCode`, `status: "open"`.
- **Patch** body while `open`: any of `title`, `notes`, `ownerLabel`, `supplierId` (including JSON `null` to clear the reference), or `status: "cancelled"`.
- **List** `{ items }` with optional `q` (title/code substring) and `status`.
- **Get** `{ record }` including optional read-only `supplierCode` when linked.

Do not create these routes in this Stage 1 authoring pass.

---

## RBAC

| Permission | Intent |
| --- | --- |
| `procure:read:record` | Health + list/get |
| `procure:write:record` | Create / patch (including human cancel) |

`platform.admin` — both (additive seed only, if implementation is later authorized). Role **`procure.catalogue`** — both. Alice and partner — 403.

Do **not** reuse or broaden:

- C4 supplier permissions or roles (`supplier:read:supplier` / `supplier:write:supplier`)
- C6 costing / rate permissions
- C9 / C10 booking permissions
- I8 finance permissions

C4 write is **not** granted automatically to `procure.catalogue`. Optional supplier picker, if implemented later, may *read* C4 only when the actor already holds C4 read; PR1 must still create rows with no `supplierId` without requiring C4 write.

Do not invent a second procurement admin role. Do not update `docs/architecture/24-rbac-abac-model.md` in this Stage 1 authoring task (implementation-time seed only, if later authorized). Do not create implementation permissions in source code in this authoring pass.

---

## Tenant isolation

Tenant-scoped. Collection queries are tenant-filtered. Missing / wrong-tenant catalogue id → 404 (do not disclose another tenant’s record). C4 isolation unchanged. No cross-tenant administrative behaviour.

---

## Audit / security

ITA1/ITR1/P2/ITL1/E1/DG1 register services do **not** call `recordAudit` on the register service. PR1 must match that sibling class if implementation is later authorized. Do not introduce a new audit subsystem or a new hash-chain writer solely for PR1. I0 audit/hash-chain remains available to other modules and is not redesigned here.

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM/metrics adapters. Human-only gates are server-enforced. Status is never treated as an approval outcome, match result, or payment executor. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

---

## UI / navigation

Intended UX contract only. Do **not** implement pages or navigation in this Stage 1 authoring task.

- `/commercial/procurement` (no existing page; **not** `/commercial/suppliers`, **not** `/commercial/finance`)
- Nav **Commercial → Procurement** (existing **Suppliers** and **Finance** unchanged except optional additive link)
- Register a row (required title + optional notes, owner label, optional C4 supplier picker)
- Queue/list, filters `q` / status, detail with cancel (from `open` via patch status)
- Open / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is a **Procurement Catalogue**, never a sourcing engine, RFQ/tender platform, rate/costing engine, AP/GL system, booking engine, or C4 Supplier replacement

Do not create RFQ suites, scorecards, rate editors, three-way-match screens, invoice capture, payment forms, or booking mutation from this nav.

---

## Search / filter / sort

List supports `q` (title / `procurementCode` substring) and `status`, consistent with ITA1/ITL1/G2/P2/E1/DG1 registers. Default list order: newest first (existing register convention). No spend analytics, supplier ranking, or AP ageing.

---

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Title longer than 200 | 400 `title_too_long` |
| Notes longer than 2000 | 400 `notes_too_long` |
| Unknown / other-tenant `supplierId` | 400 `supplier_not_found` |
| Illegal status change | 409 `invalid_transition` |
| Patch when cancelled | 409 `cancelled` |

Allocated `PRC-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, procurement_code)` if SQL is later added).

---

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `cancelled`
- Terminal records reject further patch (`409` `cancelled`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`PRC-0001`, then `PRC-0002`)
- Optional `supplierId`: valid same-tenant C4 id accepted without mutating the supplier; missing/other-tenant → `400` `supplier_not_found`; omitted `supplierId` allowed
- Forbidden engine subroutes on `/v1/procurement/:id/` (`source`, `tender`, `score`, `approve`, `order`, `receive`, `match`, `invoice`, `pay`, …) return 404
- C4 residual: `/v1/suppliers` remains C4; `/v1/suppliers/:id/purchase-orders` remains 404
- I8 residual: `/v1/finance` remains I8; no purchase-order finance collection
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `procure.catalogue` has only the PR1 permission pair; C4 / I8 roles do not gain PR1 perms
- Kernel allocator/status helpers analogous to sibling register tests
- Web typecheck
- UI: **Commercial → Procurement** register / queue / detail / cancel (implementation-time browser verification)
- Regression: C4 supplier store and I8 finance store unchanged in meaning
- If freeze tests currently assert absence of a procurement collection, updating those fixtures to allow the new `procurementRecords` key is **test-fixture evolution only**, not a C4/I8 reopen

---

## Acceptance criteria (when implementation is authorized)

Contract-level. Not code-level. **Not** an implementation authorization.

1. An authorised human can register that a purchase request / purchase order exists and cancel it from **Commercial → Procurement**.
2. Alice and partner cannot read PR1 APIs.
3. Health increment on `/v1/procurement/health` is `PR1`. C4 supplier health and I8 finance health remain those modules.
4. Optional C4 `supplierId` is a same-tenant reference only; C4 rows are unchanged.
5. A catalogue row can be created with no `supplierId`.
6. Store key is `procurementRecords`. C4 / C6 / C9 / C10 / I8 keys are not reused.
7. C4, C6, C9, C10, and I8 remain closed. SourcingEvent is not implemented. SAMPLE / CAL remain deferred.
8. `/v1/suppliers/:id/purchase-orders` remains 404.
9. The UI and API copy present a catalogue/governance register, not a purchasing, sourcing, or AP engine.

---

## Exclusions / Not included

- Sourcing-event management; RFQ; tender; supplier scoring
- Supplier onboarding; supplier-master replacement; C4 mutation
- Rate-card or costing engine; C6 mutation; amounts; currencies; line items
- Approval / workflow engine; I2 purchasing path
- Inventory; procurement planning; three-way matching
- Invoice processing; accounts payable; payments; bank integration; GL / accounting; I8 mutation
- C10 booking mutation; C9 mutation; supplier settlement through booking
- Automated purchasing; external procurement-provider integration
- C11; C10.x; PO as increment ID; PO1; P4; I24; dotted `*.x`
- Reopening C1–C10
- SourcingEvent as a PR1 aggregate
- SAMPLE; CAL; UEM; EMCOMMS; EXER; I21–I23; payroll
- O7; PQL; DP-0006
- AI mutation
- UAT; Production
- PostgreSQL as a newly established system of record
- ADR-0006 / ADR-0012 / ADR-0013 implementation
- Push; commit; Preview

---

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is **not** authorized by this document. Implementation-time preview restart, if any, is verification infrastructure only after execution is authorized. Signed-in browser automation remains `AUTHENTICATION_AUTOMATION_GAP` and is not a PR1 product defect. This Stage 1 authoring pass must **not** start runtimes or perform live verification.

---

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter C4, C6, C9, C10, or I8 schema or behaviour to “make room” for PR1.

---

## Dependencies

| Kind | Item |
| --- | --- |
| Hard prerequisites (Dev/Test) | I0 kernel patterns (tenancy / RBAC / human actor) |
| Optional references (Dev/Test) | Same-tenant C4 `supplierId` — C4 is **CLOSED** and is not a write dependency |
| Non-dependencies | C6 costing, C9/C10 booking write, I8 finance write, I2 purchasing workflow, SourcingEvent, ADR-0006/0012/0013, live PostgreSQL as SoR, new vendors |
| UAT / Production blockers (independent) | ADR-0006, ADR-0012, ADR-0013 remain **OPEN**. They do **not** reject a later bounded Dev/Test implementation, and they do **not** authorize UAT or Production. |

---

## Approved defaults (Stage 1 approval)

Operator **PR1 PROCUREMENT — STAGE 1 APPROVAL** (2026-08-27) accepts the authored defaults. Scope is **not** broadened.

1. **Optional `supplierId`** — **approved yes** (E1/G2-style). Not required. C4 remains SoR; PR1 does not mutate suppliers.
2. **Lifecycle `open` / `cancelled`** — **approved** as the minimum catalogue pair. Do **not** add `approved` / `issued` / `matched` / `paid` without a new increment.
3. **Single catalogue (no `kind` enum)** — **approved**. Request and PO remain one product. Do not introduce a `kind` engine.
4. **Dedicated role `procure.catalogue`** — **approved** so C4 / I8 roles are not broadened.
5. **No amount / line-item / approval fields** — **approved**. Any later “just one amount” is a new increment, not a PR1 patch.

---

## Governance / authority matrix

```text
CAPABILITY=PROCUREMENT (PO)
CAPABILITY_ID=PR1
STAGE_1_STATUS=APPROVED
STAGE_1_APPROVED=YES
IMPLEMENTATION_AUTHORIZED=YES
IMPLEMENTATION=COMPLETED
EXECUTION_QUEUE=EMPTY
PREVIEW=PASS
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
COMMIT=COMPLETED
PUSH=COMPLETED
```

Operator next step: **HOLD.** No next capability is selected. Preview PASS, commit, and push are **not** UAT or Production. This is not C11, not C10.x, not a sourcing engine, not AP/GL, and not C4 replacement.
