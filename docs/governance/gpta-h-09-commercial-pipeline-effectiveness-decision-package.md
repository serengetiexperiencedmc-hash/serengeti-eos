# GPTA-H-09 — Commercial Pipeline Effectiveness Decision Package

> **`GOVERNANCE-ONLY — PROPOSED CANDIDATE FOR OWNER CONSIDERATION`**  
> **`NOT SELECTED`** · **`NOT APPROVED`** · **`NOT FROZEN`** · **`NOT AUTHORIZED`**  
> **`OWNER DECISION = NOT YET RECORDED`**  
> **`NO IMPLEMENTATION`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**  
> **`C11+ IS NOT CREATED`** · **`NA-A-23 IS NOT CREATED`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T22:21:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Working tree **DIRTY** (preserved). Index **EMPTY**.

**`PROPOSED CANDIDATE = PIPELINE / CRM EFFECTIVENESS`** (GPTA-H-07 Candidate 4 / GPTA-H-08 Candidate D). This is **not** an Owner selection.

---

## 1. Purpose

Determine whether improving **operational use and measurable effectiveness** of the existing C1–C10 commercial spine is a **sufficiently defined business objective** for later Owner selection. Do **not** assume the problem exists at any stated severity.

Companion: [`gpta-h-08-owner-commercial-objective-selection-and-stage-1-freeze.md`](gpta-h-08-owner-commercial-objective-selection-and-stage-1-freeze.md) (`OWNER COMMERCIAL OBJECTIVE DECISION REQUIRED`).

---

## 2. Authoritative baseline (unchanged)

`NEXT_INCREMENT=NONE_AUTHORIZED`. E1-D **PARKED**. E1-C **PAUSE**. E1-B **PAUSE**. Path B **HOLD**. No commercial objective selected. No Stage 1 freeze. No implementation. Commit/push **NOT GRANTED**. Production **NOT AUTHORIZED**. CRM/MICE Production **NOT APPROVED**.

---

## 3. Proposed business hypothesis (not approved)

> Determine whether SEDMC can improve commercial pipeline visibility, opportunity follow-up, RFP tracking, accountability, and conversion measurement by using the existing EOS C1–C10 capabilities more effectively.

**Hypothesis, not fact.** Severity **UNKNOWN**.

**`SYSTEM CAPABILITY EXISTS`** (Dev/Test C1–C10) **≠** **`BUSINESS ADOPTION / OPERATIONAL USE IS VERIFIED`**.

---

## 4. Evidence analysis

| Topic | Classification | Record |
| --- | --- | --- |
| Organizations, contacts, accounts, activities, tasks, notes, tags, ownership (RBAC/ABAC) | **DOCUMENTED** | C1 **IMPLEMENTED / CLOSED** Dev/Test; ownership in C1 preview |
| Duplicate detection, merge, bulk import, import provenance fields | **DOCUMENTED** | C1.6–C1.7; provenance design. **No** import of “3,000+ contact universe” during C1 |
| Opportunities, stages, board, stage history | **DOCUMENTED** | C2 **IMPLEMENTED / CLOSED** Dev/Test; `/commercial/pipeline`; **demo seed** of three mock opportunities |
| RFPs, programmes, costing, approval, proposals, booking | **DOCUMENTED** | C3–C10 **CLOSED** Dev/Test; CD Phase 1 **consumed** on C3–C8 spine |
| Commercial persistence (Dev dual-path / Gate B) | **DOCUMENTED** | Gate B **CLOSED** Dev/Test persist; Production SoR **NOT APPROVED** |
| Follow-up as a governed operating cadence | **PARTIALLY DOCUMENTED** | Tasks/activities **exist**; live SLA/follow-up discipline **UNKNOWN** |
| Conversion / win-rate / pipeline-value reporting | **PARTIALLY DOCUMENTED** | C2 board totals / forecasting **hooks**; C1 `estimatedCommercialValue` historically **out of scope**; domain **J** analytics **later** / C11+ **NOT CREATED** |
| Live SEDMC use of EOS for selling | **UNKNOWN** | No operational usage census |
| Opportunities not captured; delayed follow-up; unclear ownership in operations; incomplete live RFP tracking; staff not using EOS; inability to attribute outcomes | **EVIDENCE REQUIRED** | Not evidenced as current operational defects |
| Duplicate/unreliable **live** commercial data | **UNKNOWN** | Product controls exist; live data quality **not** measured here |
| Production CRM data | **DOCUMENTED** as **not approved** | `crm-mice-authorization-gate.md` Production **NOT APPROVED** |

Do **not** invent operational usage data.

---

## 5. Business problem assessment

| Claim | Supported? |
| --- | --- |
| Opportunities not being captured (live) | **EVIDENCE REQUIRED** |
| Delayed follow-up | **EVIDENCE REQUIRED** |
| Unclear ownership (product vs ops) | Product ownership **DOCUMENTED**; operational clarity **UNKNOWN** |
| Incomplete RFP tracking (live) | Capability **DOCUMENTED**; live completeness **UNKNOWN** |
| Poor pipeline visibility (live) | Board **DOCUMENTED** (Dev/Test + demo seed); live use **UNKNOWN** |
| Limited conversion measurement | Analytics **GAP** (later / not C11+); live rates **UNKNOWN** |
| Duplicate/unreliable data (live) | Controls **DOCUMENTED**; live issue **UNKNOWN** |
| Staff not using EOS | **EVIDENCE REQUIRED** — **not proven** |
| Lack of reporting | Product reporting **PARTIAL**; business reporting need **UNKNOWN** |
| Cannot attribute commercial outcomes | Source attribution **GAP**; live attribution **UNKNOWN** |

**Sufficiently defined as a candidate?** **Yes, as an operating/measurement hypothesis** that **reuses** C1–C10 and does **not** require rebuilding them — **if** the Owner later confirms the constraint is adoption/follow-up/measurement rather than missing modules or demand generation.

**Sufficiently evidenced as a current operational crisis?** **No.**

---

## 6. Existing capability reuse

Do **not** rebuild. Do **not** create new technical scope in this package.

| Capability | Class |
| --- | --- |
| C1 CRM foundation | **REUSE** |
| C2 opportunities | **REUSE** |
| C3–C10 RFP-to-booking spine | **REUSE** |
| CD Phase 1 | **REUSE** (documents/contracts on existing spine) |
| I0–I4 control plane | **REUSE** |
| DG1/DG2 | **NOT RELEVANT** (do not select leftover nouns) |
| Commercial analytics / source attribution | **GAP** (not an implementation grant) |
| Live Production SoR | **GAP** relative to Production use; **UNKNOWN** whether this objective even requires Production |
| Whether staff use the spine today | **UNKNOWN** |

---

## 7. Provisional Stage 1 definition

**`PROVISIONAL — NOT OWNER APPROVED`**

| # | Field | Content |
| --- | --- | --- |
| 1 | Business problem | **OPEN / EVIDENCE REQUIRED.** Provisional wording: commercial pipeline visibility, follow-up, RFP tracking, accountability, and conversion measurement **may** be incomplete **in operations** even though C1–C10 exist in Dev/Test. **Severity not established.** |
| 2 | Business objective | Improve **use and measurement** of the existing spine — not a new CRM. |
| 3 | Target users | Roles only: Sales / Business Development / Commercial / RFP team / Management as Owner later names. **No invented individuals.** |
| 4 | Current process | **`CURRENT PROCESS = EVIDENCE REQUIRED`**. Product path: Relationship → Opportunity → RFP → … → Booking (roadmap). Demo seed ≠ live process. |
| 5 | Pain points | **OPEN**. Do not assume delayed follow-up or non-use. |
| 6 | Business consequences | **OPEN**. No repository baselines. |
| 7 | Desired outcomes | Named commercial records complete enough to manage follow-up and count conversion **on existing modules**. |
| 8 | Metric types | Follow-up completion; pipeline completeness; qualified opportunities; RFP volume; response time; proposal conversion; win rate; activity completion. **Types only.** |
| 9 | Baseline status | **`BASELINE = NOT YET ESTABLISHED`**. Measure first: whether live opportunities/RFPs are recorded in EOS at all, then completeness of owner/stage/follow-up. |
| 10 | Scope | Operating rules, data-quality expectations, measurement definitions; reuse C1–C10. |
| 11 | Explicit exclusions | Rebuild C1–C10; C11+; SEO/website/ads/LinkedIn; Path B leftover nouns; E1-D; E1-C resume; Production-by-default; new parallel CRM. |
| 12 | Existing EOS reuse | §6. |
| 13 | Dependencies | C1–C10; people; commercial data (**UNKNOWN**); legal/privacy if live PII; Production **only if** later separately required; not website/ads unless Owner names another candidate. |
| 14 | Risks | Treating demo seed as live pipeline; authorizing code because a board exists; converting “effectiveness” into C11+; Production implication. |
| 15 | Evidence required | Current capture location; whether EOS is used; which stage fails; named programme Owner; confirm constraint is adoption/measurement not demand or missing product. |
| 16 | Acceptance criteria | Named problem/objective/scope/exclusions; `BASELINE` handling; reuse confirmed; **implementation still not granted**. |
| 17 | Owner role | **SEDMC Owner**. Named individual **not documented** for this programme. |
| 18 | Implementation boundary | **`STAGE 1 FREEZE DOES NOT AUTHORIZE IMPLEMENTATION.`** (No freeze in force.) |
| 19 | UAT boundary | **`UAT WILL REQUIRE A SEPARATE AUTHORIZATION AND EVIDENCE PACKAGE.`** |
| 20 | Production boundary | **`PRODUCTION DEPLOYMENT/USE REQUIRES SEPARATE GOVERNANCE UNDER E1/DP-0006.`** |

Whether the objective needs **code, process, training, reporting, or a combination** is **EVIDENCE REQUIRED**. Default from product coverage: **process/training/measurement first**; **code is not implied**.

---

## 8. Owner decision-quality questions (unanswered)

| # | Question | Package position |
| --- | --- | --- |
| 1 | Primary constraint: demand, capture, follow-up, conversion, or adoption? | **EVIDENCE REQUIRED** — not assumed |
| 2 | Is the EOS spine currently used? | **UNKNOWN** |
| 3 | Evidence for the selected problem? | Product **exists**; operational problem **not evidenced** |
| 4 | What to measure first? | Presence of live EOS opportunity/RFP records, then owner/stage/follow-up completeness |
| 5 | What outcome would justify further work? | Owner must name; no invented KPI |
| 6 | Who owns the commercial programme? | Role: SEDMC Owner; person **OPEN** |
| 7 | Outside scope? | §7.11 |
| 8 | Code vs process vs training vs reporting? | **EVIDENCE REQUIRED**; rebuild **not** justified by current evidence |
| 9 | Can it proceed without rebuilding C1–C10? | **Yes** as a **reuse** hypothesis |
| 10 | Evidence before Stage 1 approval? | §7.15 |

Do **not** answer these via unsupported assumptions.

---

## 9. Owner decision options

**None selected.**

### OPTION A

`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — PIPELINE / CRM EFFECTIVENESS`

Still subject to **Stage 1 approval** and **separate implementation authorization**. Does **not** freeze Stage 1 by itself.

### OPTION B

`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — ANOTHER NAMED CANDIDATE`

The Owner **must specify** the candidate (Lead Generation; MICE Market Development; Digital Demand Generation; EOS as Commercial Operating Capability; or an Owner-amended name).

### OPTION C

`OWNER DECISION = MAINTAIN CONTROLLED PAUSE`

### OPTION D

`OWNER DECISION = NOT YET RECORDED`

**This file records OPTION D as the current repository fact, not as an Owner choice among A–C.**

---

## 10. Authorization boundary

Preserved: no implementation; no Stage 1 approval; no C11+; no CRM code; no website/SEO/paid-media/LinkedIn; no UAT; no commit; no push; no E1-D reopen; no E1-C resume; no Path B reopen; no leftover-noun selection; no procurement; no Production.

This package does **not** record Pipeline / CRM Effectiveness as selected.

---

## 11. Final status

**`OWNER DECISION = NOT YET RECORDED`**  
**Selected objective:** **NONE**  
**Proposed candidate:** PIPELINE / CRM EFFECTIVENESS — **consideration only**

`GPTA-H-09 STATUS = PROPOSED COMMERCIAL OBJECTIVE READY FOR OWNER CONSIDERATION`
