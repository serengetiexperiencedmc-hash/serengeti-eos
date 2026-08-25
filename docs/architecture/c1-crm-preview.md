# C1 — CRM Foundation (Architecture Preview)

> **CURRENT STATE (2026-08-24 documentation hygiene)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`**  
> C1 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test. Gate **PASS** ([`c1-implementation-authorized.md`](../governance/c1-implementation-authorized.md), [`c1-gate-decision.md`](../governance/c1-gate-decision.md)).  
> The body below is the **historical** architecture preview. It is not a pending implementation queue.  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Increment:** C1 — CRM Foundation  
**Environment:** Development/Test only  
**Implementation:** **IMPLEMENTED / COMPLETE (Dev/Test)** — historical preview body follows  
**Architecture:** Historical contract (Gate **PASS**)  
**Dependencies:** I0 Kernel → I1 Admin → I2 Workflow/Rules → I4 Outbox/Events

## Platform position

Serengeti EOS has an established control plane: RBAC, ABAC, SoD, human approval, tenant isolation, tamper-evident audit, workflow, rules, simulation, transactional outbox, event transport abstraction, schema governance, idempotent consumption, retry/DLQ, controlled replay, and event observability.

**C1 must consume these capabilities — not recreate them.**

CRM must not introduce independent authorization, workflow, rules, audit, event, or tenant-isolation frameworks.

---

## 1. Objective

C1 establishes the **B2B commercial relationship foundation**:

```
Organizations → Contacts → Relationships → Accounts → Activities → Tasks
```

Preparing clean references for:

```
Opportunities → RFPs → Programmes → Suppliers → Costing → Proposals → Bookings → Operations
```

C1 is **not** the complete CRM/MICE platform.

---

## 2. Architectural principle

**B2B enterprise relationship system** — not consumer CRM.

Primary model:

**Serengeti EOS ↔ Organization ↔ People ↔ Commercial Relationships**

Target organization types (configuration-driven): Incentive House, Corporate Travel Agency, Travel Advisor, MICE Agency, Corporate, Association, DMC Partner, Tour Operator, Wholesaler, Consortium, Supplier, Media/Partner, Other.

---

## 3. Scope

### In scope

| Records | Capabilities |
| --- | --- |
| Organization, Organization Unit, Contact, Relationship, Account, Activity, Task, Note, Tag/Classification, External Identifier | CRUD, search, archive, ownership, classification, duplicate detection, audit, tenant isolation |

Foundation: lifecycle, authorization, data-quality controls, event publication, workflow/rules integration points, structured search.

### Out of scope

Opportunity, RFP, Supplier, Programme, Costing, Proposal, Booking, payments, ERP/GDS/banking, autonomous AI, production integrations.

---

## 4. Deliverable index (pre-implementation)

| # | Artifact | Document |
| --- | --- | --- |
| 1 | Architecture preview | This document |
| 2 | Domain + ER model | [c1/domain-model.md](./c1/domain-model.md) |
| 3 | Lifecycle / state model | [c1/lifecycle-state-model.md](./c1/lifecycle-state-model.md) |
| 4 | Authorization matrix | [c1/authorization-matrix.md](./c1/authorization-matrix.md) |
| 5 | API specification | [c1/api-specification.md](./c1/api-specification.md) |
| 6 | Database schema design | [c1/database-schema.md](./c1/database-schema.md) |
| 7 | Event catalogue candidates | [c1/event-catalogue-candidates.md](./c1/event-catalogue-candidates.md) |
| 8 | Workflow integration | [c1/workflow-integration.md](./c1/workflow-integration.md) |
| 9 | Rules integration | [c1/rules-integration.md](./c1/rules-integration.md) |
| 10 | Duplicate detection | [c1/duplicate-detection-strategy.md](./c1/duplicate-detection-strategy.md) |
| 11 | Migration strategy | [c1/migration-strategy.md](./c1/migration-strategy.md) |
| 12 | Security test plan | [c1/security-test-plan.md](./c1/security-test-plan.md) |
| 13 | Test matrix | [c1/test-matrix.md](./c1/test-matrix.md) |
| 14 | Observability plan | [c1/observability-plan.md](./c1/observability-plan.md) |
| 15 | ADR impact assessment | [c1/adr-impact-assessment.md](./c1/adr-impact-assessment.md) |
| 16 | Implementation sequence | [c1/implementation-sequence.md](./c1/implementation-sequence.md) |

---

## 5. Domain summary

See [domain-model.md](./c1/domain-model.md) for full ER diagram and attributes.

| Entity | Role |
| --- | --- |
| **Organization** | Legal/trading entity (authoritative master) |
| **OrganizationUnit** | Division, branch, regional office within org |
| **Contact** | Person; may link to multiple orgs/units |
| **Relationship** | First-class link: Contact↔Org, Org↔Org (configurable types) |
| **Account** | Serengeti's commercial management view (does not duplicate org master) |
| **Activity** | Recorded interaction (not a substitute for structured business objects) |
| **Task** | Actionable work item |
| **Note** | Short-form annotation linked to CRM entities |
| **Tag** | Classification label (tenant-scoped catalogue) |
| **ExternalIdentifier** | Explicit external system refs (no invented IDs; data only — no sync) |
| **DuplicateCandidate** | Potential → Confirmed → Not Duplicate workflow |

**Account ownership** integrates I1 authorization: Owner ≠ unrestricted access; RBAC/ABAC remains authoritative.

---

## 6. Control plane integration (mandatory)

| Capability | C1 usage |
| --- | --- |
| I0 RBAC/ABAC/SoD | All CRM permissions and high-risk actions |
| I0 Audit hash chain | Every consequential mutation |
| I1 Principals / org shell | Record owners, teams |
| I2 Workflow | Merge, bulk import, sensitive export (where warranted) |
| I2 Rules | Field requirements, duplicate thresholds, data-quality |
| I4 Outbox | Domain write + governed event in same transaction (C1.9: CRM catalogue + emission) |

### C1.9 domain events (Dev/Test)

- **Catalogue:** `packages/kernel/src/crm-events.ts` — all `crm.*.v1` types registered at runtime.
- **Emission:** after successful CRM mutations via `emitCrmEvent()` → I4 outbox (in-memory Dev/Test transport).
- **Not audit:** CRM audit hash chain unchanged; events are integration-facing contracts.
- **Payload:** reference-first — entity IDs, status, merge metadata; no PII, note bodies, or CSV content.
- **Mandatory merge event:** `crm.record.merged.v1` on successful controlled merge only.
- **No external delivery** in C1.9 — no Kafka, webhooks, or production dispatchers.

---

## 7. Data quality & provenance

**Quality states:** Unverified → Partially Verified → Verified | Needs Review | Duplicate Suspected | Archived

**Provenance (import-ready):** source system, source record ID, import batch, imported timestamp, transformation status, verification status.

**No import** of existing 3,000+ contact universe during C1 — see [migration-strategy.md](./c1/migration-strategy.md).

---

## 8. Soft delete / archival

Prefer lifecycle archival over hard delete. Permanent deletion requires separate authorization and audit. Merges preserve provenance and re-point references — never silent destruction of commercial history.

---

## 9. AI boundary

Structured data for future **advisory** AI only. **No AI agent in C1.** Future path: AI Agent → CRM Tool → Authorization → CRM API → Audit → Database.

---

## 10. Implementation sequence (after approval)

See [implementation-sequence.md](./c1/implementation-sequence.md): C1.1 domain foundation → … → C1.10 security/integration testing. Do not build entire CRM in one step.

---

## 11. C1 Definition of Done

C1 complete when all items in [test-matrix.md](./c1/test-matrix.md) pass and:

- Organization units, contacts, relationships, accounts, activities, tasks work
- Lifecycle, tenant isolation, RBAC/ABAC, SoD, audit work
- Duplicate detection + controlled merge work
- Search, PostgreSQL persistence, I4 events, observability work
- Documentation complete
- **Development/Test evidence only — not Production certification**

---

## 12. C1 gate (post-implementation)

Return with 17-item submission per [implementation-sequence.md](./c1/implementation-sequence.md#c1-gate-submission). Do not advance to C2 without gate approval.

---

## 13. Authorization status

| Gate | Status |
| --- | --- |
| C1 architecture preview | **APPROVED** |
| C1 implementation | **AUTHORIZED — Dev/Test** |
| C1.1 | **COMPLETE** |
| C1.2 | **COMPLETE** |
| C1.3 | **COMPLETE** |
| C1.4 | **COMPLETE** |
| C1.5 | **COMPLETE** |
| C1.6 | **COMPLETE** |
| C1.7 | **COMPLETE** |
| C1.8 | **COMPLETE** |
| C1.9 | **COMPLETE** |
| C1.10 | **COMPLETE** |
| C1.11 | **COMPLETE** |
| C1 Gate | **PASS — Development/Test only** |
| AI / UAT / Production | **BLOCKED** |

### C1.11 gate remediation (Dev/Test)

- Task search defect fixed; security plan 100% disposition; OpenAPI `crm-c1.yaml`; `commitCrmWithOutbox()` atomicity; typecheck green; performance baseline captured.
- PostgreSQL: schema migrations validated when `EOS_RUN_PG_TESTS=1` + live DB; **CRM API persistence remains in-memory by approved C1 boundary**.
- See `docs/architecture/c1/security-coverage-disposition.md` and `performance-baseline.md`.

---

**Related:** [commercial-roadmap.md](./commercial-roadmap.md) · [crm-mice-authorization-gate.md](../governance/crm-mice-authorization-gate.md)
