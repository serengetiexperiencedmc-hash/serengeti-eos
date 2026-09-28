# GPTA-H-08 — Owner Commercial Objective Selection & Stage 1 Freeze

> **`GOVERNANCE-ONLY — OWNER DECISION SURFACE`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`NOT A STAGE 1 APPROVAL`**  
> **`NOT A STAGE 1 FREEZE`** (no selected objective)  
> **`GPTA-H-08 ITSELF IS NOT AUTHORIZATION`**  
> **`NO IMPLEMENTATION`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**  
> **`NA-A-23 IS NOT CREATED`** · **`C11+ IS NOT CREATED`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T22:18:00+03:00**.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Working tree:** **DIRTY** — preserved. Index: **EMPTY**.

This file does **not** infer an Owner choice from conversation history. No named candidate appears in the GPTA-H-08 instruction as a recorded Owner line.

**`OWNER DECISION = NOT YET RECORDED`**

---

## 1. Purpose

GPTA-H-07 concluded: **`COMMERCIAL OBJECTIVE CANDIDATE READY FOR OWNER SELECTION`**.

This file:

1. preserves the five commercial candidates;
2. provides the exact Owner decision formats;
3. holds the Stage 1 freeze **template** (to be filled **only after** a named selection);
4. keeps technical design **after** business-objective approval and a later implementation grant;
5. states the boundary: Stage 1 freeze ≠ Stage 1 approval ≠ implementation authorization.

---

## 2. Authoritative baseline

[`gpta-h-07-commercial-objective-definition-and-stage-1-readiness.md`](gpta-h-07-commercial-objective-definition-and-stage-1-readiness.md) and preceding GPTA-H-01–H-06 / portfolio records.

**Unchanged global state:** `NEXT_INCREMENT=NONE_AUTHORIZED`; E1-D **PARKED**; E1-C **CONTROLLED PAUSE**; E1-B **PAUSED**; GPTA-H-01 **PATH B HOLD**; commit/push **NOT GRANTED**; no commercial workstream authorized; new commercial Stage 1 **not approved**. Standing Dev/Test remains available and is **not** a new increment.

---

## 3. Formal candidate set (preserved, unranked, unselected)

Mapped from GPTA-H-07 Candidates 1–5. None is authorized.

### CANDIDATE A — LEAD GENERATION

**Business purpose:** Capture, qualify and track B2B commercial opportunities.

**Potential scope (not implemented):** lead capture; qualification; opportunity creation; ownership; follow-up; source; conversion measurement.

Selecting A does **not** authorize implementation. Do **not** rebuild C1–C3.

---

### CANDIDATE B — MICE MARKET DEVELOPMENT

**Business purpose:** Systematically develop priority MICE markets and buyer relationships.

**Potential scope (not implemented):** target markets; buyer segments; accounts; contacts; activities; opportunities; follow-up; conversion.

Selecting B does **not** authorize a market campaign or Production. Company-position markets (including South Africa) are **not** a grant.

---

### CANDIDATE C — DIGITAL DEMAND GENERATION

**Business purpose:** Generate measurable inbound commercial demand through digital channels.

**Potential channels (not implemented):** SEO; website; Google Ads; LinkedIn; landing pages; enquiry/RFP conversion.

**Selecting this candidate does NOT authorize any digital-channel implementation.**

---

### CANDIDATE D — PIPELINE / CRM EFFECTIVENESS

**Business purpose:** Improve operational use and measurement of the existing C1–C10 commercial spine.

**Potential scope (not implemented):** existing CRM adoption; pipeline visibility; opportunity management; RFP tracking; follow-up; conversion measurement; reporting.

**Do not rebuild C1–C10.**

---

### CANDIDATE E — EOS AS COMMERCIAL OPERATING CAPABILITY

**Business purpose:** Use the existing EOS commercial spine as an operating system for measurable commercial execution.

**Potential scope (not implemented):** accounts; contacts; opportunities; RFPs; proposals; activities; tasks; ownership; accountability; reporting.

**Do not create a parallel commercial platform.**

---

## 4. Owner decision (required)

Use **exactly one** of the following lines in a **future** Owner record (not inferred here):

`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — LEAD GENERATION`  
`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — MICE MARKET DEVELOPMENT`  
`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — DIGITAL DEMAND GENERATION`  
`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — PIPELINE / CRM EFFECTIVENESS`  
`OWNER DECISION = ESTABLISH COMMERCIAL OBJECTIVE — EOS AS COMMERCIAL OPERATING CAPABILITY`  

or:

`OWNER DECISION = MAINTAIN CONTROLLED PAUSE`

The Owner **must name** the selected candidate. An unnamed `ESTABLISH COMMERCIAL OBJECTIVE` is **incomplete**.

**Recorded in this file:**

**`OWNER DECISION = NOT YET RECORDED`**

**Selected objective:** **`NONE`**

This file is **not** authorization.

---

## 5. Stage 1 freeze — not executed

Because no Owner selection is recorded, **Stage 1 is not frozen**.

**Stage 1 freeze status:** **INCOMPLETE / NOT STARTED** (blocked on Owner decision).

Open items: **all** Stage 1 fields remain **not applied** to a named objective.

If a later Owner line names a candidate, a **subsequent** governance record must fill §6 below for **that one** objective. Filling it is **not** implementation authorization. Completing it yields:

`COMMERCIAL OBJECTIVE SELECTED`  
`STAGE 1 = READY FOR OWNER APPROVAL`  

**not** `IMPLEMENTATION AUTHORIZED`.

The next step after a completed freeze would be a **separate Stage 1 approval** decision. Only after Stage 1 approval should a later package define implementation scope.

---

## 6. Stage 1 freeze template (apply only after named selection)

Do **not** include database design, API contracts, UI design, migration plans, TypeScript, infrastructure design, vendor selection, or automation architecture.

Required fields (acceptance gate — all must be explicit; missing evidence = `OPEN`):

| # | Field | Rule |
| --- | --- | --- |
| 6.1 | Business problem | Concise; do not invent live-ops facts |
| 6.2 | Business objective | Measurable outcome; **no invented numbers**. If no baseline: `BASELINE = NOT YET ESTABLISHED` and state what to measure first |
| 6.3 | Target users | Roles only (e.g. Sales, Business Development, Commercial Director, Operations, Management, Marketing, RFP team). **Do not invent named individuals** |
| 6.4 | Current process | Known workflow or `CURRENT PROCESS = EVIDENCE REQUIRED` |
| 6.5 | Pain point | Operational/commercial constraint; mark `OPEN` if unconfirmed |
| 6.6 | Business consequence | Observable/measurable; no fabricated values |
| 6.7 | Desired outcome | Successful operation |
| 6.8 | Metrics | **Types only** unless repo baselines exist. Types may include: qualified leads; qualified opportunities; RFP volume; response time; proposal conversion; win rate; pipeline value; revenue; account coverage; activity completion; follow-up completion; source attribution |
| 6.9 | Scope | Included |
| 6.10 | Exclusions | Explicit not-included |
| 6.11 | Existing capability reuse | C1–C10 / CD / I0–I4 / DG1–DG2 as `REUSE` / `PARTIAL REUSE` / `NOT RELEVANT` / `GAP` — **no rebuild** of completed capabilities |
| 6.12 | Dependencies | Existing EOS; commercial data; people; external platforms; legal/privacy; Production; website; digital channels; other governance streams |
| 6.13 | Risks | Material business and technical |
| 6.14 | Evidence requirements | What must exist **before implementation** |
| 6.15 | Acceptance criteria | Objective Stage 1 completion criteria |
| 6.16 | Owner | Role: **SEDMC Owner**. Do not invent a person if not documented |
| 6.17 | Implementation boundary | **`STAGE 1 FREEZE DOES NOT AUTHORIZE IMPLEMENTATION.`** |
| 6.18 | UAT boundary | **`UAT WILL REQUIRE A SEPARATE AUTHORIZATION AND EVIDENCE PACKAGE.`** |
| 6.19 | Production boundary | **`PRODUCTION DEPLOYMENT/USE REQUIRES SEPARATE GOVERNANCE UNDER E1/DP-0006.`** |

GPTA-H-07 §8 drafts may be **inputs** to a later freeze; they are **not** a freeze.

---

## 7. Existing-capability reconciliation (not applied — no selection)

**Status:** **NOT APPLIED** pending named objective.

When applied, classify each as `REUSE` / `PARTIAL REUSE` / `NOT RELEVANT` / `GAP`. Do **not** create replacement functionality.

| Capability | Typical relation (informational only; not a freeze) |
| --- | --- |
| C1 CRM foundation | **REUSE** for A, B, D, E (orgs, contacts, accounts, activities, tasks). Candidate C: **PARTIAL REUSE** if capture lands in CRM; else **NOT RELEVANT** until capture is named |
| C2 opportunities | **REUSE** for A, B, D, E. Candidate C: **PARTIAL REUSE** if enquiry becomes opportunity |
| C3–C10 RFP-to-booking spine | **REUSE** for A (from RFP onward), D, E. Candidate B: **PARTIAL REUSE**. Candidate C: **PARTIAL REUSE** at enquiry/RFP conversion only |
| CD Phase 1 | **REUSE** where RFP-to-programme documents/contracts apply (D, E, later A). **NOT RELEVANT** to digital-channel build |
| I0–I4 control plane | **REUSE** whenever EOS records are used (A, B, D, E). Candidate C: **REUSE** only for in-EOS capture, **NOT RELEVANT** to ads/SEO platforms |
| DG1 / DG2 | **NOT RELEVANT** to these commercial operating objectives. Do **not** select Lineage/QualityRule. **GAP** only if Owner later names a data-governance catalogue problem (that is Path B, **not** this freeze) |

True **GAP** examples (if later confirmed): commercial analytics/reporting (domain J later); source attribution from digital channels; Production CRM use. **Not** a GAP: existence of C1–C10 in Dev/Test.

---

## 8. Evidence gaps (remain OPEN until selection + freeze)

Until the Owner names an objective and a freeze is filled:

* Named candidate: **OPEN**  
* Current commercial process: **`CURRENT PROCESS = EVIDENCE REQUIRED`** (GPTA-H-07)  
* `BASELINE = NOT YET ESTABLISHED`  
* Pain, consequence, first market/buyer, digital-channel in/out: **OPEN**  
* Named individual Owner of this programme: **not documented** (role = SEDMC Owner)

---

## 9. Dependencies (unchanged)

| Item | State |
| --- | --- |
| Owner commercial selection | **OPEN** — blocks freeze |
| C1–C10 / CD Phase 1 | Consumed Dev/Test — **reuse later**, do not reopen as rebuild |
| Production / E1 / DP-0006 | **NOT AUTHORIZED** |
| E1-C / NA-A-22 / facility | **PAUSE / OPEN** — not this freeze |
| E1-D | **PARKED** |
| Path B / leftover nouns | **HOLD** — do not select |
| Website / SEO / ads / LinkedIn | **NOT AUTHORIZED** |
| Commit / push / UAT | **NOT GRANTED** |

---

## 10. Authorization boundary

**Unauthorized:** implementation; Stage 1 freeze (not executed); Stage 1 approval; C11+; website/SEO/paid media/LinkedIn/CRM code; schema/SQL/API/infrastructure; UAT; commit; push; E1-D reopen; E1-C resume; GPTA-H-01 reopen; LINEAGE_REGISTER / QUALITY_RULE_REGISTER; E1-B send; supplier/validator contact; procurement; Production.

**`STAGE 1 FREEZE DOES NOT AUTHORIZE IMPLEMENTATION.`** (template; freeze **not** in force)  
**`UAT WILL REQUIRE A SEPARATE AUTHORIZATION AND EVIDENCE PACKAGE.`**  
**`PRODUCTION DEPLOYMENT/USE REQUIRES SEPARATE GOVERNANCE UNDER E1/DP-0006.`**

The project remains in the current controlled state.

---

## 11. Final status

**`OWNER DECISION = NOT YET RECORDED`**  
**Selected objective:** **`NONE`**  
**Stage 1 freeze:** **not executed**

`GPTA-H-08 STATUS = OWNER COMMERCIAL OBJECTIVE DECISION REQUIRED`
