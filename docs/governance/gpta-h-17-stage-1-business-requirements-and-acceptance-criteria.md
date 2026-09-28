# GPTA-H-17 — Stage 1 Business Requirements & Acceptance Criteria

> **`GOVERNANCE-ONLY — REQUIREMENTS AND ACCEPTANCE CRITERIA`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`IN FIRST PHASE ≠ BUILD / LAUNCH / SPEND`**  
> **`NO C11+`** · **`NO C1–C10 MODIFY`** · **`NO COMMIT`** · **`NO PUSH`** · **`NO UAT`** · **`NO PRODUCTION`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T23:23:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Working tree **DIRTY** (preserved). Index **EMPTY**.

**Authoritative freeze:** [`gpta-h-16-owner-decision-and-stage-1-freeze.md`](gpta-h-16-owner-decision-and-stage-1-freeze.md).  
**Definition record:** [`gpta-h-14-commercial-objective-definition-and-stage-1-freeze.md`](gpta-h-14-commercial-objective-definition-and-stage-1-freeze.md).  
**Owner ticks:** [`gpta-h-15-owner-commercial-objective-scope-and-sequencing-decision.md`](gpta-h-15-owner-commercial-objective-scope-and-sequencing-decision.md).

This document is **business-readable**. It is **not** a technical architecture, schema, or build specification.

Every requirement below has **`Implementation status = NOT AUTHORIZED`**.

---

## 1. Frozen Stage 1 (copied, not re-decided)

| Item | Frozen content |
| --- | --- |
| Objective | **Commercial Growth & Sales Effectiveness** |
| Primary problem | **Insufficient qualified RFPs + poor conversion** |
| Secondary issues | South African penetration; European penetration — **not independently measured** |
| Primary market/buyer | **South African incentive agencies** |
| Subsequent candidates | European MICE agencies; US incentive houses; corporate event planners; PCOs — **not excluded** |
| Primary outcome | **More qualified RFPs + better conversion** |
| Secondary outcomes | Faster turnaround; more revenue; more strategic accounts; more profit |
| Numerical targets | **None approved** — `OWNER TARGET NOT YET DEFINED` |
| Sequencing | **PROCESS-FIRST:** `1A → 1B → 1C–1G REQUIREMENTS` |
| Software principle | Process → baseline → requirements → **assess C1–C10** → identify gaps → **only then** decide whether new development is required |

**1A** commercial process and baseline · **1B** EOS/C1–C10 operational readiness · **1C** programme/proposal · **1D** supplier costing · **1E** commercial finance · **1F** demand generation · **1G** market development.

---

## 2. How to read requirements

| Prefix | Meaning |
| --- | --- |
| `BR-###` | Business requirement |
| `PR-###` | Process requirement |
| `DR-###` | Data requirement |
| `KR-###` | KPI / reporting requirement |
| `CR-###` | Capability requirement |
| `MR-###` | Marketing / demand-generation / market-development requirement |
| `AC-###` | Acceptance criterion |

**Priority:** Must / Should / Could / Deferred / `OWNER CONFIRMATION REQUIRED`.

**Evidence** is only GPTA-H-11/H-14/H-16 Owner evidence and repository capability inventory. No invented volumes, rates, or campaign performance.

Control points may be met with **process, spreadsheet, or existing EOS** after 1B. Software is **not** assumed.

---

## 3. Business requirements

| ID | Requirement | Business rationale | Priority | Evidence source | Dependency | Acceptance criterion | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BR-001 | SEDMC must **define and apply** what counts as a **qualified RFP**. | Primary problem is insufficient **qualified** RFPs; volume without qualification cannot be managed. | **Must** (definition in 1A). Exact definition text: `OWNER CONFIRMATION REQUIRED` | GPTA-H-16 primary problem | 1A | AC-002 | **NOT AUTHORIZED** |
| BR-002 | SEDMC must measure `RFP → Qualified opportunity → Proposal → Confirmed booking` and record where opportunities are lost. | Primary problem includes **poor conversion**; cannot improve what is not staged. | **Must** | GPTA-H-16; current confirm/reject workflow | BR-001; PR-006 | AC-005 | **NOT AUTHORIZED** |
| BR-003 | SEDMC must timestamp and measure: RFP received; clarification requested; clarification completed; proposal started; proposal sent; follow-up; decision. | Secondary outcome includes faster turnaround; Owner process has those steps. | **Must** | GPTA-H-14/H-16 workflow | PR-001–PR-006 | AC-006 | **NOT AUTHORIZED** |
| BR-004 | The commercial team must see open opportunities, stage, owner, expected decision, next action, and pipeline value **when available**. | Operating process and conversion control require visibility. Pipeline value is often unknown today. | **Must** (visibility). Pipeline value: **Should** until baseline exists | GPTA-H-16 pipeline/EOS-CRM in first-phase **definition**; EX-13 unknown | DR-004; DR-007 | AC-003; AC-004; AC-009 | **NOT AUTHORIZED** |
| BR-005 | The process must support target accounts, strategic accounts, repeat business, direct business, and agency relationships. | Owner wants strategic accounts, repeat business, and direct business; current mix is mainly B2B agents and incentive houses. | **Should** (classification). Direct/strategic lists: `OWNER CONFIRMATION REQUIRED` | GPTA-H-14 Owner statements | DR-008; MR-005 | AC-010 | **NOT AUTHORIZED** |
| BR-006 | Lost opportunities must be categorised with an approved **loss-reason** list (including destination rejection where applicable). | Owner process ends in confirm **or reject**; reasons unknown. | **Must** (capture). Taxonomy: `OWNER CONFIRMATION REQUIRED` | GPTA-H-14 workflow; gap register | BR-002 | AC-007 | **NOT AUTHORIZED** |
| BR-007 | Where information exists, each opportunity must record **market/buyer source**. | First market is SA incentive agencies; attribution required to know if that focus is working. | **Must** | GPTA-H-16 first market | DR-006 | AC-008 | **NOT AUTHORIZED** |
| BR-008 | Commercial process, baseline, requirements, and C1–C10 readiness **must** be established **before** new software development is authorized. | Frozen software principle. | **Must** | GPTA-H-16 Decision 7 | CR-001 | AC-012 | **NOT AUTHORIZED** |
| BR-009 | No numerical commercial targets are in force until the Owner sets them. | Freeze: no targets invented. | **Must** | GPTA-H-16 | KR-* | AC-009 (categories only) | **NOT AUTHORIZED** |

---

## 4. Current-state process requirements

Approved current workflow:

`RFP RECEIVED` → `CLARIFICATION` → `PROGRAMME / ITINERARY + FINANCIAL PROPOSAL` → `PROPOSAL SENT` → `MANUAL FOLLOW-UP` → `CONFIRM / REJECT`

Software is **not** required at every control point.

| ID | Requirement | Business rationale | Priority | Evidence source | Dependency | Acceptance criterion | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PR-001 | **RFP received:** named owner (role), received timestamp, source channel if known, status = received. | First control point of the approved workflow. Channel mix currently unknown. | **Must** | Owner workflow | BR-003 | AC-001 | **NOT AUTHORIZED** |
| PR-002 | **Clarification:** status, what was asked, completed timestamp, deadline if used. | Owner step 2. | **Must** | Owner workflow | PR-001 | AC-001 | **NOT AUTHORIZED** |
| PR-003 | **Programme / itinerary + financial proposal:** status (not started / in progress / ready), started and ready timestamps, whether a financial proposal is included. | Owner builds programme and includes financial proposal today. | **Must** | Owner workflow | PR-002; CR-013 | AC-001; AC-011 | **NOT AUTHORIZED** |
| PR-004 | **Proposal sent:** sent timestamp, recipient type (agent/client), version identity (business version, not a schema). | Owner sends proposal for review. | **Must** | Owner workflow | PR-003 | AC-001 | **NOT AUTHORIZED** |
| PR-005 | **Follow-up:** next action, due date, last follow-up timestamp, status (open / snoozed / done). Cadence “after some time” is insufficient. | Conversion control; current follow-up is manual email. Current duty role still unnamed (EX-06). | **Must** | Owner workflow; EX-06 follow-up | BR-004 | AC-004 | **NOT AUTHORIZED** |
| PR-006 | **Outcome:** confirm or reject; booking reference if confirmed; loss reason if lost; decision timestamp. | End of approved workflow. | **Must** | Owner workflow | BR-002; BR-006 | AC-005; AC-007 | **NOT AUTHORIZED** |
| PR-007 | Every **active qualified** opportunity has one accountable commercial **owner** (role). | GPTA-H-16; programme role Commercial Director / Sales & Business Development. | **Must** | GPTA-H-16; EX-30 | BR-004 | AC-003 | **NOT AUTHORIZED** |
| PR-008 | Every active qualified opportunity has a **next action** and a **deadline** (or explicit “no deadline — reason”). | Visibility and follow-up. | **Must** | GPTA-H-16 sales process in first phase | PR-005 | AC-004 | **NOT AUTHORIZED** |
| PR-009 | Qualification is applied **before** treating an RFP as a qualified opportunity (BR-001). Unqualified items remain visible as unqualified. | Avoid inflating conversion. | **Must** | GPTA-H-16 primary problem | BR-001 | AC-002 | **NOT AUTHORIZED** |
| PR-010 | Confirmed bookings can be linked to a **repeat** opportunity later (same account/relationship). Repeat rate currently unknown. | Secondary outcome: strategic/repeat accounts. | **Should** | GPTA-H-16 secondary outcomes | BR-005 | AC-010 | **NOT AUTHORIZED** |

---

## 5. Baseline requirements

Establish these **before** implementation decisions. Do **not** manufacture figures.

Retained Owner estimate (not audited): approximately **25** RFPs and **3** confirmed bookings in the last 12 months; indicative conversion approximately **12%** (`OWNER ESTIMATE — NOT AUDITED`).

| ID | Baseline item | Current record | Priority | Evidence | Dependency | Acceptance | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DR-B01 | RFP volume | `OWNER ESTIMATE — NOT AUDITED` (~25 / 12 months) | **Must** to replace or confirm | GPTA-H-11 EX-10 | 1A | Count method documented; estimate vs actual labelled | **NOT AUTHORIZED** |
| DR-B02 | Qualified RFP volume | `BASELINE NOT YET ESTABLISHED` | **Must** | Qualification undefined | BR-001 | AC-002 + count | **NOT AUTHORIZED** |
| DR-B03 | Confirmed bookings | `OWNER ESTIMATE — NOT AUDITED` (~3 / 12 months) | **Must** to replace or confirm | EX-12 | 1A | Count method documented | **NOT AUTHORIZED** |
| DR-B04 | Conversion rate | Indicative 3/25 ≈ 12% **not audited**; qualified-to-booking **not established** | **Must** (defined method) | EX-14 | BR-002 | AC-005 | **NOT AUTHORIZED** |
| DR-B05 | Response time | `BASELINE NOT YET ESTABLISHED` | **Must** (method). Historic average: unknown | EX-15 | BR-003 | AC-006 | **NOT AUTHORIZED** |
| DR-B06 | Proposal turnaround | `BASELINE NOT YET ESTABLISHED` | **Must** (method) | GPTA-H-14 gap | BR-003 | AC-006 | **NOT AUTHORIZED** |
| DR-B07 | Pipeline value | `BASELINE NOT YET ESTABLISHED` | **Should** | EX-13 unknown | BR-004 | Value rules documented or “not available” | **NOT AUTHORIZED** |
| DR-B08 | Revenue | `BASELINE NOT YET ESTABLISHED` | **Should** | GPTA-H-14 gap | KR-C01 | Method documented | **NOT AUTHORIZED** |
| DR-B09 | Profit | `BASELINE NOT YET ESTABLISHED` | **Should** | GPTA-H-14 gap | KR-C03 | Method documented | **NOT AUTHORIZED** |
| DR-B10 | Repeat business | `BASELINE NOT YET ESTABLISHED` | **Should** | GPTA-H-14 gap | PR-010 | Method documented | **NOT AUTHORIZED** |
| DR-B11 | Market/buyer source mix | `BASELINE NOT YET ESTABLISHED` (current mix stated as B2B agents + incentive houses — **not** a census) | **Must** for SA-first programme | EX-20 | BR-007 | AC-008 | **NOT AUTHORIZED** |
| DR-B12 | Lost-opportunity reasons | `BASELINE NOT YET ESTABLISHED` | **Must** (taxonomy + capture) | GPTA-H-14 gap | BR-006 | AC-007 | **NOT AUTHORIZED** |
| DR-B13 | Enquiries (non-RFP) | `BASELINE NOT YET ESTABLISHED` | **Could** | EX-09 unknown | — | Count or explicitly out of first baseline | **NOT AUTHORIZED** |
| DR-B14 | Proposals submitted | `BASELINE NOT YET ESTABLISHED` | **Must** (method) | EX-11 unknown | PR-004 | Count method | **NOT AUTHORIZED** |

---

## 6. Data requirements (operating records — not a schema)

| ID | Requirement | Business rationale | Priority | Evidence source | Dependency | Acceptance criterion | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DR-001 | Each RFP/opportunity has a business identity and the PR-001–PR-006 statuses. | Cannot track lifecycle without a record. Tool may be Excel or EOS after 1B. | **Must** | Owner workflow | PR-* | AC-001 | **NOT AUTHORIZED** |
| DR-002 | Qualification result and definition version (qualified / not / not yet assessed). | BR-001. | **Must** | GPTA-H-16 | BR-001 | AC-002 | **NOT AUTHORIZED** |
| DR-003 | Timestamps listed in BR-003, where the step occurred. Missing steps marked not applicable. | Response/turnaround. | **Must** | GPTA-H-16 | BR-003 | AC-006 | **NOT AUTHORIZED** |
| DR-004 | Accountable owner role (and named person only if already real — do not invent). | PR-007. | **Must** | EX-30 | PR-007 | AC-003 | **NOT AUTHORIZED** |
| DR-005 | Outcome, booking flag, loss reason. | BR-002/006. | **Must** | Owner workflow | PR-006 | AC-005; AC-007 | **NOT AUTHORIZED** |
| DR-006 | Market and buyer type when known (SA incentive agency as first-priority label). | BR-007. | **Must** | GPTA-H-16 | BR-007 | AC-008 | **NOT AUTHORIZED** |
| DR-007 | Pipeline/opportunity value **when available**; otherwise explicit unknown. | BR-004; do not invent. | **Should** | EX-13 unknown | BR-004 | AC-009 | **NOT AUTHORIZED** |
| DR-008 | Account flags: target / strategic / repeat / direct / agency — when classified. | BR-005. Classification rules: `OWNER CONFIRMATION REQUIRED` | **Should** | GPTA-H-16 secondaries | BR-005 | AC-010 | **NOT AUTHORIZED** |

---

## 7. Programme / proposal requirements (1C — define only)

| ID | Requirement | Business rationale | Priority | Evidence source | Dependency | Acceptance criterion | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CR-013 | Business rules for creating a programme/itinerary that can be sent as (or with) a proposal. | Current work already does this manually. | **Must** (rules). **No** builder development | Owner workflow; scope B | PR-003 | AC-001; AC-011 | **NOT AUTHORIZED** |
| CR-014 | Proposal includes a **financial proposal** per approved commercial rules. | Owner includes financial proposal today. | **Must** (rules) | Owner workflow | CR-020 | AC-011 | **NOT AUTHORIZED** |
| CR-015 | Business **version** of programme/proposal is identifiable (what the client last saw). | Review cycles implied by “sent for review”. | **Should** | Owner workflow | PR-004 | AC-001 | **NOT AUTHORIZED** |
| CR-016 | Turnaround is measurable from proposal started to proposal sent (DR-B06). | Secondary outcome: speed. | **Must** (measurement) | GPTA-H-16 | BR-003 | AC-006 | **NOT AUTHORIZED** |
| CR-017 | Review/approval of a proposal before send is defined as a business rule (who may send). | Control; C7 exists in Dev/Test but unused live. | **Should** | Scope B; C7 inventory | CR-007 | AC-011 | **NOT AUTHORIZED** |
| CR-018 | Delivery and follow-up of the sent proposal follow PR-004–PR-005. | Current manual follow-up. | **Must** | Owner workflow | PR-005 | AC-004 | **NOT AUTHORIZED** |
| CR-019 | Confirmation/rejection of the proposal updates PR-006. | Outcome capture. | **Must** | Owner workflow | PR-006 | AC-005 | **NOT AUTHORIZED** |

---

## 8. Supplier / costing requirements (1D — define only, no schema)

Business facts a proposal may need. **Not** a database design. **No** supplier-hub implementation.

| ID | Requirement | Business rationale | Priority | Evidence source | Dependency | Acceptance criterion | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CR-S01 | A supplier used in a programme can be identified. | Costing and financial proposal. | **Must** (definition) | Scope C; C4 inventory | CR-004 | AC-010S | **NOT AUTHORIZED** |
| CR-S02 | Service/item used in a programme can be identified. | Owner asked for rates by service/item. | **Must** (definition) | GPTA-H-16 scope C | CR-S01 | AC-010S | **NOT AUTHORIZED** |
| CR-S03 | Destination, season, effective dates, rate, currency, unit, validity, source, last verification can be stated for a rate **when used**. | Owner asked for seasonal rates. Completeness of historic data unknown. | **Should** | GPTA-H-16 scope C | CR-S02 | AC-010S | **NOT AUTHORIZED** |
| CR-S04 | A proposal can point to the rates used (or state that a rate is ad hoc / unverified). | Controlled vs informal costing. | **Must** (rule) | Scope C | CR-S03; AC-010S | AC-010S | **NOT AUTHORIZED** |

**AC-010S:** A proposal can use controlled supplier/service/item rates **where the approved capability exists**; otherwise the proposal records that rates were not controlled. **Not** a build grant.

---

## 9. Financial requirements (1E)

**`COMMERCIAL FINANCIAL REQUIREMENTS`** (this section) ≠ **`ACCOUNTING / FINANCE-SYSTEM INTEGRATION`**. The latter is **not authorized** and is **Deferred**.

| ID | Requirement | Business rationale | Priority | Evidence source | Dependency | Acceptance criterion | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CR-020 | Itemized **commercial** financial proposal (client pricing vs identifiable cost lines as the business rules require). | Owner includes financial proposal; wants itemized invoices/KPIs as first-phase **definition**. | **Must** (rules) | GPTA-H-16 scope D | CR-014 | AC-011 | **NOT AUTHORIZED** |
| CR-021 | Supplier cost vs client price visibility sufficient to see **margin/profit** when those figures exist. | Secondary outcome: profit. Historic profit unknown. | **Should** | GPTA-H-16 secondaries | CR-020; DR-B09 | AC-011 | **NOT AUTHORIZED** |
| CR-022 | Business rules for **itemized invoices** (commercial document), distinct from accounting AR. | Scope D. | **Should** (rules). Invoice product: **Deferred** as software | GPTA-H-16 | CR-020 | Rules documented | **NOT AUTHORIZED** |
| CR-023 | Business rules for **commercial financial statements / KPI pack** used by management (not statutory accounts). | Scope D; KR section. | **Should** (rules) | GPTA-H-16 KPI categories | KR-* | AC-009 | **NOT AUTHORIZED** |
| CR-024 | Currency and commercial versioning of a financial proposal (which version the client saw). | Multi-currency DMC context in company position; versioning from review cycle. | **Should** | Scope D; CR-015 | CR-020 | AC-011 | **NOT AUTHORIZED** |
| CR-025 | Commercial approval control before a financial proposal is sent (who may commit price). | Control; not accounting SoD design. | **Should** | CR-017 | CR-007 | AC-011 | **NOT AUTHORIZED** |
| CR-026 | Accounting / finance-system integration. | Not in freeze as authorized work. | **Deferred** | GPTA-H-17 exclusion | — | Out of Stage 1 implementation | **NOT AUTHORIZED** |

---

## 10. KPI / reporting requirements

Categories only. **`OWNER TARGET NOT YET DEFINED`** on every target.

| ID | Metric category | Requirement | Priority | Evidence | Target | Acceptance | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| KR-D01 | Demand — total RFPs | Count per defined period | **Must** | EX-10 estimate | `OWNER TARGET NOT YET DEFINED` | AC-009 | **NOT AUTHORIZED** |
| KR-D02 | Demand — qualified RFPs | Count using BR-001 | **Must** | Primary problem | `OWNER TARGET NOT YET DEFINED` | AC-002; AC-009 | **NOT AUTHORIZED** |
| KR-D03 | Demand — new qualified accounts | Count | **Should** | BR-005 | `OWNER TARGET NOT YET DEFINED` | AC-009 | **NOT AUTHORIZED** |
| KR-D04 | Demand — direct enquiries | Count when distinguishable | **Should** | Owner wants direct business | `OWNER TARGET NOT YET DEFINED` | AC-009 | **NOT AUTHORIZED** |
| KR-S01 | Sales — response time | Per BR-003 | **Must** | Secondary outcome | `OWNER TARGET NOT YET DEFINED` | AC-006 | **NOT AUTHORIZED** |
| KR-S02 | Sales — proposal turnaround | Started→sent | **Must** | Secondary outcome | `OWNER TARGET NOT YET DEFINED` | AC-006 | **NOT AUTHORIZED** |
| KR-S03 | Sales — qualification rate | Qualified ÷ RFPs | **Must** | BR-001/002 | `OWNER TARGET NOT YET DEFINED` | AC-002 | **NOT AUTHORIZED** |
| KR-S04 | Sales — follow-up completion | Next action done on time | **Must** | PR-005 | `OWNER TARGET NOT YET DEFINED` | AC-004 | **NOT AUTHORIZED** |
| KR-S05 | Sales — conversion | Qualified → booking (and optionally RFP → booking, labelled separately) | **Must** | Primary outcome | `OWNER TARGET NOT YET DEFINED` | AC-005 | **NOT AUTHORIZED** |
| KR-C01 | Value — pipeline value | When available | **Should** | EX-13 unknown | `OWNER TARGET NOT YET DEFINED` | AC-009 | **NOT AUTHORIZED** |
| KR-C02 | Value — revenue / revenue per booking | When available | **Should** | Secondary outcome | `OWNER TARGET NOT YET DEFINED` | AC-009 | **NOT AUTHORIZED** |
| KR-C03 | Value — profit per booking | When available | **Should** | Secondary outcome | `OWNER TARGET NOT YET DEFINED` | AC-009 | **NOT AUTHORIZED** |
| KR-C04 | Value — repeat business | When classified | **Should** | PR-010 | `OWNER TARGET NOT YET DEFINED` | AC-010 | **NOT AUTHORIZED** |
| KR-M01 | Market — South African opportunities | Count/attribution | **Must** | First market | `OWNER TARGET NOT YET DEFINED` | AC-008 | **NOT AUTHORIZED** |
| KR-M02 | Market — European opportunities | Count/attribution | **Should** | Subsequent candidate | `OWNER TARGET NOT YET DEFINED` | AC-008 | **NOT AUTHORIZED** |
| KR-M03 | Market — US opportunities | Count/attribution | **Should** | Subsequent candidate | `OWNER TARGET NOT YET DEFINED` | AC-008 | **NOT AUTHORIZED** |
| KR-M04 | Market — corporate opportunities | Count/attribution | **Should** | Subsequent candidate | `OWNER TARGET NOT YET DEFINED` | AC-008 | **NOT AUTHORIZED** |
| KR-M05 | Market — PCO opportunities | Count/attribution | **Should** | Subsequent candidate | `OWNER TARGET NOT YET DEFINED` | AC-008 | **NOT AUTHORIZED** |

Management reporting (AC-009) means these **categories** can be produced from the defined process. It does **not** authorize a new analytics module or C11+.

---

## 11. C1–C10 capability-gap assessment

**`C1–C10 MUST NOT BE REBUILT OR EXTENDED UNTIL THIS GAP ANALYSIS IS COMPLETE.`**

This section is the **requirements-level assessment** (inventory + mapping + unknowns). **Live operational validation** remains **NEXT ACTION**. A gap **does not** mean development. **No C11+.**

Possible outcomes: existing capability sufficient · requires configuration/process · requires validation · partial · genuine gap · unknown.

| ID | Existing capability | Dev/Test state | Relevant Stage 1 requirement | Reusable? | Gap? | Evidence | Additional development required? | Governance status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CR-001 | **Gate:** full 1B validation of this table against the approved process | n/a | BR-008 | n/a | n/a | GPTA-H-16 | **Unknown** until 1B | **Must complete before any EOS modify/extend** |
| CR-002 | **C1 CRM** — orgs, contacts, accounts, activities, tasks | **IMPLEMENTED / CLOSED** | BR-004; BR-005; PR-007; DR-004; DR-008 | **Unknown** (unused live) | **Unknown** | Roadmap; GPTA-H-14; EX-08 non-use | **Unknown** | Closed Dev/Test; **modify not authorized**; Production CRM **not approved** |
| CR-003 | **C2 Opportunity / pipeline** | **IMPLEMENTED / CLOSED** (demo seed ≠ live) | BR-002; BR-004; KR-S05 | **Unknown** | **Unknown** | Roadmap; GPTA-H-09 | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-004 | **C3 RFP management** | **IMPLEMENTED / CLOSED** | PR-001; BR-001; KR-D01 | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-005 | **C4 Supplier management** | **IMPLEMENTED / CLOSED** (rates **metadata**) | CR-S01–S04 | **Unknown** vs seasonal/item rates | **Unknown** | Roadmap; GPTA-H-14 | **Unknown** | Closed Dev/Test; **no supplier-hub coding** |
| CR-006 | **C5 Programme builder** | **IMPLEMENTED / CLOSED** | CR-013; PR-003 | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **no builder coding** |
| CR-007 | **C6 Costing engine** | **IMPLEMENTED / CLOSED** | CR-S04; CR-020 | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-008 | **C7 Commercial approval** | **IMPLEMENTED / CLOSED** | CR-017; CR-025 | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-009 | **C8 Proposal engine** | **IMPLEMENTED / CLOSED** | CR-014; PR-004 | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-010 | **C9 Booking & handover** | **IMPLEMENTED / CLOSED** | PR-006; KR-S05 | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-011 | **C10 Booking command center** | **IMPLEMENTED / CLOSED** | BR-004 (rollup) | **Unknown** | **Unknown** | Roadmap | **Unknown** | Closed Dev/Test; **modify not authorized** |
| CR-012 | **I0–I4 control plane** | **IMPLEMENTED / CLOSED** | Needed **if** EOS is used | **Yes if EOS used** | No for growth features | Roadmap | **No** as a commercial feature | Closed Dev/Test |
| CR-J | **Domain J commercial analytics / C11+** | **Not created** | AC-009 KPI pack | **No** | KPI **process** may not need C11+ | Roadmap; GPTA-H-16 no C11+ | **Unknown** and **not C11+** | **C11+ NOT AUTHORIZED** |
| CR-P | **Production CRM / live SoR** | **Not approved** | Live use of any C* | **No** | Live data **unknown** whether required | CRM/MICE gate | **Unknown**; Production **not** this package | **NOT APPROVED** |

Owner operational finding (EOS not used; “not complete / currently unusable”) remains **validation input**, **not** a rebuild grant.

---

## 12. Demand-generation requirements (1F — commercial programmes only)

**No** website development, SEO implementation, ad spend, campaign launch, LinkedIn/Instagram automation, or tracking implementation.

| ID | Programme | Requirement (business) | Priority | Evidence | Dependency | Acceptance (definition, not launch) | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MR-001 | **LinkedIn** | Define: target audience; lead objective (qualified RFP / meeting / other); content role; enquiry mechanism; measurement against BR-001/KR-D02. | **Must** (programme definition). Execution: **Deferred** | GPTA-H-16 digital | BR-001 | Written programme brief exists; no automation | **NOT AUTHORIZED** |
| MR-002 | **SEO / website** | Define: target commercial audiences (incl. SA incentive agencies); enquiry intent; conversion path into RFP/qualification; content requirements; measurement. | **Must** (definition). Build/SEO work: **Deferred** | GPTA-H-16 | BR-001; MR-005 | Written brief exists; no site/SEO implementation | **NOT AUTHORIZED** |
| MR-003 | **Google Ads** | Define: acquisition objective; qualified-lead definition (= BR-001); target audience; **acquisition economics required before any spend**; conversion measurement. | **Must** (definition + economics). Spend/launch: **Deferred** | GPTA-H-16 Ads condition | BR-001 | Economics paper exists before any spend request | **NOT AUTHORIZED** |
| MR-004 | **Instagram** | Define: **B2B demand-generation role** (not assumed to be direct-response); target audience; content role; measurable commercial outcome (e.g. enquiry to qualification — `OWNER CONFIRMATION REQUIRED`). | **Must** (role definition). Automation: **Deferred** | GPTA-H-16 Instagram condition | BR-001 | Role statement exists; not assumed DR channel | **NOT AUTHORIZED** |

---

## 13. Market-development requirements (1G)

**No** campaigns or outreach lists in this document.

| ID | Requirement | Business rationale | Priority | Evidence | Dependency | Acceptance | Implementation status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MR-005 | **South Africa first:** define target-account **approach**, qualification (BR-001), outreach method, relationship development, how RFPs are generated, and measurement (KR-M01). Target: **South African incentive agencies**. | Frozen first market/buyer. | **Must** (programme definition). Outreach execution: **Deferred** | GPTA-H-16 | BR-001; BR-007 | Written SA incentive-agency programme definition | **NOT AUTHORIZED** |
| MR-006 | Subsequent candidates (Europe MICE agencies; US incentive houses; corporate event planners; PCOs) have a **placeholder** measurement category (KR-M02–M05) and are **not** first-wave execution. | Frozen subsequent list; not excluded; not simultaneous. | **Should** (keep visible). Campaigns: **Deferred** | GPTA-H-16 | KR-M02–M05 | Listed as subsequent; no campaign pack required now | **NOT AUTHORIZED** |

---

## 14. Acceptance criteria (testable)

How we will know the approved commercial process/capability is fit for purpose. **Not** implementation authorization. Tooling may be manual until 1B says otherwise.

| ID | Criterion | Maps to |
| --- | --- | --- |
| AC-001 | An RFP can be tracked from receipt through clarification, programme/proposal, send, follow-up, and final outcome. | PR-001–PR-006 |
| AC-002 | The business consistently distinguishes qualified from unqualified opportunities using an **Owner-approved** definition. | BR-001; PR-009 |
| AC-003 | Every active **qualified** opportunity has an accountable commercial owner. | PR-007 |
| AC-004 | An active qualified opportunity has a defined next action and follow-up status. | PR-005; PR-008 |
| AC-005 | Conversion from qualified opportunity to confirmed booking can be calculated from defined records (method labelled; 12% remains estimate until replaced). | BR-002; DR-B04 |
| AC-006 | Response and proposal turnaround can be measured from defined timestamps. | BR-003 |
| AC-007 | Lost opportunities can be categorised using **Owner-approved** loss reasons. | BR-006 |
| AC-008 | Where information exists, source market/buyer of an opportunity can be identified. | BR-007 |
| AC-009 | Management can obtain the approved **KPI categories** from the defined process (targets still undefined). | KR-* |
| AC-010 | Accounts can be classified (target/strategic/repeat/direct/agency) once classification rules are approved. | BR-005 |
| AC-010S | A proposal can use controlled supplier/service/item rates **where that capability exists**; otherwise ad hoc/unverified is explicit. | CR-S04 |
| AC-011 | A proposal can contain an itemized **commercial** financial proposal per approved business rules. | CR-020 |
| AC-012 | No new EOS software development is requested until BR-008 (process, baseline, requirements, C1–C10 1B assessment) is satisfied. | BR-008; CR-001 |

---

## 15. Definition of done — Stage 1 requirements pack

| # | Condition | This document |
| --- | --- | --- |
| 1 | Business requirements documented | **Yes** §3 |
| 2 | Current process documented | **Yes** §4 |
| 3 | Baseline requirements documented | **Yes** §5 |
| 4 | KPI definitions documented | **Yes** §10 (targets not set) |
| 5 | Programme/proposal requirements documented | **Yes** §7 |
| 6 | Supplier/costing requirements documented | **Yes** §8 |
| 7 | Finance requirements documented | **Yes** §9 (accounting integration excluded) |
| 8 | Demand-generation requirements documented | **Yes** §12 |
| 9 | Market-development requirements documented | **Yes** §13 |
| 10 | C1–C10 capability-gap **assessment** completed at inventory/mapping level | **Yes** §11 — **live validation still required** |
| 11 | Acceptance criteria exist | **Yes** §14 |
| 12 | Unknowns and evidence gaps explicit | **Yes** (baselines, reuse, targets, qualification text, loss taxonomy) |
| 13 | No requirement silently implies implementation | **Yes** — all `NOT AUTHORIZED` |

**Still for 1A / Owner confirmation (not missing requirement IDs):** qualified-RFP definition text; loss-reason taxonomy; account classification rules; Instagram measurable outcome; numerical targets; exact baseline counts.

Those are **clarifications inside approved requirements**, not a failure of this pack.

---

## 16. Explicit exclusions (implementation)

Outside implementation authorization: C11+; new CRM development; C1–C10 modifications; programme-builder development; supplier-hub development; finance-module development; website development; SEO implementation; Google Ads launch or spend; LinkedIn automation; Instagram automation; database/schema changes; migrations; infrastructure; Production; procurement; vendor selection; UAT; commit; push; accounting-system integration; E1-D reopen; E1-C resume; Path B reopen.

Unchanged: E1-D **PARKED**; E1-C **PAUSE**; E1-B **PAUSE**; Path B **HOLD**; application `NEXT_INCREMENT=NONE_AUTHORIZED`.

---

## 17. Next action

**`C1–C10 CAPABILITY GAP ANALYSIS AND REQUIREMENTS VALIDATION`**

That next step must: (1) validate §11 Unknowns against the approved process (1B); (2) confirm 1A baseline methods and Owner-confirmation items; (3) **not** authorize development merely because a cell says Unknown or Gap.

---

## 18. Final status

Requirements and acceptance criteria are defined. Implementation remains gated. Remaining Owner items are labelled `OWNER CONFIRMATION REQUIRED` or `BASELINE NOT YET ESTABLISHED`, not silent.

`GPTA-H-17 STATUS = STAGE 1 BUSINESS REQUIREMENTS AND ACCEPTANCE CRITERIA DEFINED`

`COMMERCIAL OBJECTIVE = APPROVED / FROZEN`

`STAGE 1 = APPROVED / FROZEN`

`IMPLEMENTATION = NOT AUTHORIZED`

`NEXT ACTION = C1–C10 CAPABILITY GAP ANALYSIS AND REQUIREMENTS VALIDATION`
