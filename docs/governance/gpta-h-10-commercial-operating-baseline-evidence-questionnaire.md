# GPTA-H-10 — Commercial Operating Baseline Evidence Questionnaire

> **`GOVERNANCE-ONLY — EVIDENCE COLLECTION PACKAGE`**  
> **`NOT A COMMERCIAL OBJECTIVE SELECTION`**  
> **`NOT STAGE 1 APPROVAL`** · **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`OWNER DECISION = NOT YET RECORDED`**  
> **`NO COMMERCIAL OBJECTIVE AUTHORIZED`**  
> **`NO INFERRED ANSWERS`** · **`NO INVENTED BASELINES`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T22:25:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Working tree **DIRTY** (preserved). Index **EMPTY**.

GPTA-H-09 proposed **PIPELINE / CRM EFFECTIVENESS** for consideration only. This questionnaire does **not** assume that CRM effectiveness is the primary problem. Evidence may show the constraint is demand, capture, follow-up, conversion, adoption, reporting, process, staffing, data quality, Production availability, or another issue.

Do **not** answer these questions in this file. Every question status is **`OPEN`**.

---

## 1. Purpose

Establish the **actual commercial operating baseline** before any commercial objective is selected or Stage 1 is approved. Respondents: Owner or designated SEDMC staff. Technical knowledge is **not** required.

`CAPABILITY EXISTS` (C1–C10 Dev/Test) ≠ `LIVE OPERATIONAL USE CONFIRMED`.

---

## 2. Authoritative baseline (unchanged)

`NEXT_INCREMENT=NONE_AUTHORIZED`. E1-D **PARKED**. E1-C **PAUSE**. E1-B **PAUSE**. Path B **HOLD**. No commercial objective selected. No Stage 1 approval. No implementation. Commit/push **NOT GRANTED**. Production **NOT AUTHORIZED**.

---

## 3. Response model

Copy one block per answered question into a later evidence record (not filled here).

| Field | Content |
| --- | --- |
| Question ID | e.g. A-01 |
| Response | narrative / figure / selection / `UNKNOWN` |
| Respondent role | role only; do not invent a name |
| Date | ISO date |
| Evidence source | e.g. spreadsheet, email, memory, EOS, none |
| Confidence | high / medium / low / unknown |
| Follow-up required | yes / no + note |
| Status | see below |

**Allowed status values:** `OPEN` · `ANSWERED — EVIDENCE PROVIDED` · `ANSWERED — ESTIMATE` · `UNKNOWN` · `CONFLICTING EVIDENCE` · `FOLLOW-UP REQUIRED`

Do **not** mark answered without supplied evidence.

**Volume figures (Section B)** also capture: value; period; source; confidence; actual / estimated / unknown. If unavailable: **`BASELINE = NOT YET ESTABLISHED`**.

---

## 4. Questionnaire

### SECTION A — Commercial operating model

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| A-01 | What is the current commercial workflow from initial contact to confirmed booking? | Distinguishes actual process from the C1–C10 product path | Short narrative; `UNKNOWN` if needed | **OPEN** |
| A-02 | Who receives new enquiries and RFPs? | Identifies first-touch accountability | Role/function; tool/system name; `UNKNOWN` | **OPEN** |
| A-03 | Where are leads initially recorded? | Capture location vs EOS | Tool/system name; short narrative; `UNKNOWN` | **OPEN** |
| A-04 | Where are opportunities currently tracked? | Pipeline system of record in practice | Tool/system name; short narrative; `UNKNOWN` | **OPEN** |
| A-05 | Where are follow-ups recorded? | Whether follow-up is observable | Tool/system name; short narrative; `UNKNOWN` | **OPEN** |
| A-06 | Who is accountable for opportunity progression? | Ownership vs product RBAC | Role/function; `UNKNOWN` | **OPEN** |
| A-07 | Which tools are actually used today? | Dual-running / shadow systems | List of tool/system names; `UNKNOWN` | **OPEN** |
| A-08 | Is EOS currently used by staff in live operations? | `LIVE OPERATIONAL USE CONFIRMED` vs capability-only | Yes / no / partial / `UNKNOWN` + short narrative | **OPEN** |

---

### SECTION B — Volume and baseline

Most recent available **12-month** period (state the period). Do not invent values.

For each: value; period; source; confidence; actual / estimated / unknown. Else **`BASELINE = NOT YET ESTABLISHED`**.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| B-01 | Number of new commercial enquiries | Demand vs capture | Figure pack as above | **OPEN** |
| B-02 | Number of RFPs received | Mid-funnel volume | Figure pack | **OPEN** |
| B-03 | Number of proposals submitted | Proposal throughput | Figure pack | **OPEN** |
| B-04 | Number of confirmed bookings | Outcome volume | Figure pack | **OPEN** |
| B-05 | Total opportunity value, if available | Pipeline scale | Figure pack or `BASELINE = NOT YET ESTABLISHED` | **OPEN** |
| B-06 | Number of active accounts | Account coverage | Figure pack | **OPEN** |
| B-07 | Number of active buyer contacts | Contact coverage | Figure pack | **OPEN** |
| B-08 | Average response time, if measured | Speed constraint | Figure pack or not measured | **OPEN** |
| B-09 | Proposal conversion rate, if measured | Conversion constraint | Figure pack or not measured | **OPEN** |
| B-10 | Win/loss reasons, if recorded | Learning / quality | Narrative list + source, or not recorded | **OPEN** |

---

### SECTION C — Commercial bottleneck

Unranked options. Respondent may select **more than one** and should name a **suspected primary** if possible. Do **not** convert the answer into a final objective.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| C-01 | Which constraints apply? Select any: insufficient demand; insufficient qualified leads; poor lead capture; delayed response; incomplete follow-up; unclear opportunity ownership; proposal conversion; data quality; lack of reporting; staff adoption; Production system availability; process inconsistency; other; unknown | Prevents assuming CRM effectiveness | Multi-select from the list; `other` = short text | **OPEN** |
| C-02 | What is the suspected **primary** constraint? | Focuses later Stage 1 | One option from C-01, or `UNKNOWN` | **OPEN** |

---

### SECTION D — EOS adoption

Distinguish **`CAPABILITY EXISTS`** from **`LIVE OPERATIONAL USE CONFIRMED`**.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| D-01 | Which staff **roles** currently use EOS? (no invented names) | Who actually operates the system | Role list; none; `UNKNOWN` | **OPEN** |
| D-02 | Which C1–C10 capabilities are used? | Adoption vs unused modules | List (CRM / pipeline / RFP / …) or none; `UNKNOWN` | **OPEN** |
| D-03 | Which C1–C10 capabilities are not used? | Gap between product and practice | List or `UNKNOWN` | **OPEN** |
| D-04 | Is usage mandatory, optional, or undefined? | Policy | One of those three, or `UNKNOWN` | **OPEN** |
| D-05 | Are live records entered into EOS? | Live data vs demo/seed | Yes / no / partial / `UNKNOWN` | **OPEN** |
| D-06 | Are opportunities updated consistently? | Pipeline hygiene | Yes / no / partial / `UNKNOWN` | **OPEN** |
| D-07 | Are follow-ups and tasks recorded? | Task discipline | Yes / no / partial / `UNKNOWN` | **OPEN** |
| D-08 | Is EOS treated as a system of record? | SoR vs sidecar | Yes / no / partial / `UNKNOWN` | **OPEN** |
| D-09 | What prevents or limits adoption? | Constraint type | Short narrative; `UNKNOWN` | **OPEN** |
| D-10 | Is training required? | Process vs product | Yes / no / `UNKNOWN` | **OPEN** |

---

### SECTION E — Data and reporting

Do **not** propose analytics implementation.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| E-01 | Where does commercial data currently reside? | Data location | Tool/system names; `UNKNOWN` | **OPEN** |
| E-02 | Are records duplicated across tools? | Data quality | Yes / no / partial / `UNKNOWN` + short narrative | **OPEN** |
| E-03 | Can RFPs be traced from receipt to outcome? | Traceability | Yes / no / partial / `UNKNOWN` | **OPEN** |
| E-04 | Is opportunity ownership visible? | Accountability | Yes / no / partial / `UNKNOWN` | **OPEN** |
| E-05 | Can management see pipeline value? | Visibility | Yes / no / partial / `UNKNOWN` | **OPEN** |
| E-06 | Can conversion be measured? | Measurement | Yes / no / partial / `UNKNOWN` | **OPEN** |
| E-07 | Is lead source recorded? | Attribution | Yes / no / partial / `UNKNOWN` | **OPEN** |
| E-08 | Is reporting manual or automated? | Reporting mode | Manual / automated / mixed / none / `UNKNOWN` | **OPEN** |
| E-09 | Which reports are currently needed? | Reporting demand | Short list; `UNKNOWN` | **OPEN** |
| E-10 | Which reports are currently unavailable? | Reporting gap | Short list; `UNKNOWN` | **OPEN** |

---

### SECTION F — Target market and buyer

Do **not** assume South Africa or any buyer. Company-position lists are **not** answers.

Buyer options (unranked): incentive houses; event agencies; PCOs; travel agencies; corporate travel companies; MICE agencies; destination/event specialists; corporate clients; other.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| F-01 | Should a commercial objective focus on any of the buyer options above? | Buyer scope | Multi-select; `other` = text; `UNKNOWN` | **OPEN** |
| F-02 | Which **buyer category** should be addressed first? | Sequencing | One category or `UNKNOWN` | **OPEN** |
| F-03 | Which **market** should be addressed first? | Sequencing | Named market or `UNKNOWN` | **OPEN** |
| F-04 | What geographic market is in scope? | Geography | List; `UNKNOWN` | **OPEN** |
| F-05 | Is South Africa the initial market? | Do not assume | Yes / no / `UNKNOWN` | **OPEN** |
| F-06 | Are Europe, USA, Canada, or other markets in scope? | Breadth | Yes/no per region or list; `UNKNOWN` | **OPEN** |
| F-07 | What evidence supports the selected market (if any)? | Evidence vs preference | Short narrative / source; `UNKNOWN` | **OPEN** |
| F-08 | Is the objective demand generation, relationship development, opportunity management, or another activity? | Objective class | One or more + `other` text; `UNKNOWN` | **OPEN** |

---

### SECTION G — Business consequence

For **each selected** consequence: example; approximate frequency; business impact; supporting evidence; confidence. Do not invent examples.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| G-01 | Which consequences apply? Select any: lost opportunities; slow response; missed follow-ups; low conversion; poor visibility; duplicated effort; unreliable reporting; staff time loss; inability to forecast; inability to attribute source; no material consequence established; other | Separates pain from preference | Multi-select | **OPEN** |
| G-02 | For each selected item in G-01, provide example, approximate frequency, business impact, supporting evidence, confidence | Makes consequence auditable | One mini-pack per selected item | **OPEN** |

---

### SECTION H — Owner and accountability

Do **not** invent individual names. If unknown: **`OWNER / ACCOUNTABILITY = OPEN`**.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| H-01 | Programme Owner **role** | Stage 1 Owner | Role title or `OWNER / ACCOUNTABILITY = OPEN` | **OPEN** |
| H-02 | Accountable business department | Org home | Department name or OPEN | **OPEN** |
| H-03 | Operational participants (roles) | Who executes | Role list or OPEN | **OPEN** |
| H-04 | Decision-maker role | Who decides Stage 1 | Role or OPEN | **OPEN** |
| H-05 | Role responsible for supplying baseline evidence | Who answers this pack | Role or OPEN | **OPEN** |
| H-06 | Expected review frequency | Cadence | e.g. weekly / monthly / unknown | **OPEN** |
| H-07 | Does the Owner have authority to approve Stage 1? | Decision right | Yes / no / `UNKNOWN` | **OPEN** |

---

### SECTION I — Scope and exclusions

No scope is approved through this questionnaire.

| ID | Question | Why it matters | Expected format | Status |
| --- | --- | --- | --- | --- |
| I-01 | Is the objective process improvement, system adoption, reporting, demand generation, or another purpose? | Objective type | One or more + `other`; `UNKNOWN` | **OPEN** |
| I-02 | Is existing C1–C10 reuse mandatory? | Prevent rebuild | Yes / no / `UNKNOWN` | **OPEN** |
| I-03 | Is new application development potentially in scope? | Code vs process | Yes / no / later / `UNKNOWN` | **OPEN** |
| I-04 | Are website changes in scope? | Digital boundary | Yes / no / later / `UNKNOWN` | **OPEN** |
| I-05 | Are SEO, paid media, and LinkedIn in scope? | Channel boundary | Yes / no / later / per-channel; `UNKNOWN` | **OPEN** |
| I-06 | Are external platforms in scope? | Tooling boundary | Yes / no / named tools / `UNKNOWN` | **OPEN** |
| I-07 | Is Production use in scope now or only later? | E1/DP-0006 boundary | Now / later / `UNKNOWN` | **OPEN** |
| I-08 | What must explicitly remain outside scope? | Exclusions | Short list; `UNKNOWN` | **OPEN** |

---

## 5. Decision-readiness criteria

Minimum evidence **before** a commercial objective may proceed to **Stage 1 approval**. Missing items remain **`OPEN`**. This questionnaire **does not** satisfy them.

1. Named objective  
2. Documented business problem  
3. Target users/stakeholders  
4. Current process  
5. Measurable or observable consequence  
6. Initial baseline **or** explicit baseline-collection plan (`BASELINE = NOT YET ESTABLISHED` plus plan is acceptable)  
7. Scope  
8. Exclusions  
9. Named Owner **role**  
10. Existing EOS capability reconciliation  
11. Dependencies  
12. Acceptance criteria  
13. Implementation boundary  
14. UAT boundary  
15. Production boundary  

---

## 6. Authorization boundary

Preserved: no commercial objective selection; no Stage 1 approval; no implementation; no CRM changes; no C11+; no website/SEO/ads/LinkedIn; no UAT; no commit; no push; no E1-D reopen; no E1-C resume; no Path B reopen; no leftover-noun selection; no procurement; no Production; no E1-B send.

---

## 7. Final status

All questions **A-01–I-08** remain **`OPEN`**. No answers inferred.

`GPTA-H-10 STATUS = COMMERCIAL BASELINE EVIDENCE COLLECTION PACKAGE CREATED`

`OWNER DECISION = NOT YET RECORDED`

`NO COMMERCIAL OBJECTIVE AUTHORIZED`
