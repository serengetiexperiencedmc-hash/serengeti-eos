# GPTA-H-27 — Targeted Requirements Closure and 1B Live-Validation Plan

> **`GOVERNANCE-ONLY — TARGETED CLOSURE + 1B PLAN`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NOT 1B EXECUTION`**  
> **`NO APPLICATION STATE CHANGE`**  
> **`NO C1–C10 MODIFY`** · **`NO C11+`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:28:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Authoritative (not rewritten): GPTA-H-16 · H-17 · H-18 · H-19 · [`gpta-h-25-authorized-commercial-business-rules.md`](gpta-h-25-authorized-commercial-business-rules.md) · [`gpta-h-26-business-requirements-closure-and-implementation-readiness.md`](gpta-h-26-business-requirements-closure-and-implementation-readiness.md).

```text
IMPLEMENTATION = NOT AUTHORIZED
IMPLEMENTATION NOT AUTHORIZED
```

Finding that a C1–C10 capability is inadequate is **a finding only**. It does **not** authorize remediation.

OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`. No margin %, monetary threshold, discount %, credit days, or programme-size threshold is invented.

---

## 1. Scope

Close **only** the six GPTA-H-26 targeted areas, then prepare the **1B live-validation plan**. Do **not** execute 1B in this increment. Do **not** expand into digital-campaign briefs, Instagram outcome mapping, account-flag vs Account Type, or implementation.

| # | Targeted area | This package |
| --- | --- | --- |
| 1 | SOURCE / CHANNEL attribution | **Closed** as requirements |
| 2 | Contributing loss reasons | **Closed** — same catalogue as primary |
| 3 | Final Market taxonomy | **Closed** — controlled initial list |
| 4 | Commercial approval matrix | **Closed** — no numerical floor |
| 5 | Supplier-rate edge cases | **Closed** as requirements |
| 6 | Measurable acceptance criteria | **Closed** as testable criteria |
| — | 1B C1–C10 live validation | **Plan ready** — **not executed** |

---

## 2. Decisions closed

| Decision | Record |
| --- | --- |
| `SOURCE != CHANNEL` | Confirmed; separately reportable |
| `ONE PRIMARY SOURCE REQUIRED` | Adopted |
| Optional secondary SOURCE | Retained; same catalogue; max **two** secondaries |
| Contributing loss | Same LR-01–LR-12 taxonomy; no second catalogue |
| Market list | Controlled **initial** 15-value taxonomy |
| `MARKET != BUYER / ACCOUNT TYPE` | Unchanged |
| Stage 1 first market/buyer | `SOUTH AFRICAN INCENTIVE AGENCIES` — not a taxonomy value; not a target |
| Send ≠ approval | Unchanged (OR-05 / OR-06) |
| Commercial floor **value** | Not invented; parameter register placeholder |
| Rate types | Unchanged five types from H-25 |

---

## 3. Design details closed

SOURCE multiplicity and audit; CHANNEL as intake mechanism; contributing-loss reuse of LR catalogue; Market controlled list + change-control; approval matrix without numbers; rate versioning, overlap, seasons, FX identification (not provider), expiry, public distinction, proposal snapshot **requirement**, rate ownership.

---

## 4. Design details deferred (out of this six-item pack)

| Deferred | Reason |
| --- | --- |
| Numerical commercial-parameter **values** | `CONTROLLED COMMERCIAL PARAMETERS — VALUES REQUIRE SEPARATE MANAGEMENT APPROVAL` |
| FX provider / rate source | Must not be selected yet |
| Snapshot **implementation** | Requirement only |
| 1B **execution** | Next action after this plan |
| Account flags vs Account Type (BR-005/DR-008) | Not in the six H-26 items |
| MR-001–MR-004 programme briefs / Ads economics | Digital programmes remain definition-only; not this pack |
| Application fields / schema | Not created |

---

## 5. Measurable acceptance criteria

No numerical **business targets**. Criteria are **testable presence/quality** rules. Tooling may remain process/Excel/EOS after 1B.

### AC-Q — Qualification (maps AC-002 / OR-01)

A **qualified** RFP must have all of:

* account/buyer classification (OR-03);  
* genuine requirement;  
* destination/service fit;  
* dates **or** credible decision window;  
* sufficient programme/group information;  
* buying-process information **or** active clarification;  
* next action;  
* assigned owner.

**Budget is not mandatory.** Unqualified and not-yet-assessed items remain visible as such (PR-009).

### AC-L — Loss (maps AC-007 / OR-02)

A **Closed-Lost** opportunity must have:

* exactly one primary loss reason from LR-01–LR-12;  
* zero or more contributing reasons from the **same** catalogue;  
* explanatory note when primary or any selected reason is **OTHER** (LR-12).

### AC-F — Follow-up (maps AC-003 / AC-004 / OR-04-FU)

An **active** qualified opportunity must have:

* responsible owner;  
* next action;  
* follow-up timing;  
* transfer record (new owner + next action) when ownership changes.

Overdue = follow-up timing has passed and next action is not done. Escalation point = Commercial Director (process rule).

### AC-S — Source / channel (maps AC-008 / OR-07)

An opportunity must have:

* one **primary SOURCE**;  
* optional secondary SOURCE(s) per §6;  
* **CHANNEL** recorded separately.

### AC-M — Market (maps AC-008 / OR-03-M)

An opportunity/account must have **Market** and **Buyer/Account Type** as **separate** dimensions, each from the controlled lists.

### AC-P — Proposal (maps AC-001 / AC-011 / OR-05 / OR-06)

A **sent** proposal must have:

* proposal version;  
* proposal owner;  
* approval status **where approval is required**;  
* sender;  
* send timestamp;  
* commercial assumptions sufficient to understand what was sent (including supplier-rate snapshot facts per §10.7).

### AC-R — Supplier rates (maps AC-010S / OR-08)

A rate **used for costing** a live proposal must have:

* supplier;  
* source (priority class);  
* rate type (one of the five);  
* currency (original supplier currency preserved);  
* season/applicability;  
* validity (effective-from / effective-to);  
* verification state/date.

Expired rates must show **not current** unless reconfirmed.

### AC-T — Response / turnaround (maps AC-006 / BR-003)

Response time is measurable **only if** these business events are dated when they occur: RFP received; clarification start; clarification complete (or N/A); proposal preparation start; proposal sent. **Absence of C3 stamps is a capability finding**, not an AC rewrite.

---

## 6. SOURCE / CHANNEL rules

```text
SOURCE != CHANNEL
```

Do **not** combine. Do **not** treat CHANNEL as SOURCE.

### 6.1 SOURCE (principal origin)

Controlled values (unchanged from H-25):

1. Existing Client / Repeat Business  
2. Existing Partner / Agency Relationship  
3. Referral  
4. Trade Show / Industry Event  
5. Sales Prospecting  
6. Website / Organic  
7. LinkedIn  
8. Google Ads / Paid Search  
9. Other Digital Marketing  
10. Consortium / Industry Network  
11. Corporate Direct  
12. Other  

```text
ONE PRIMARY SOURCE REQUIRED
```

Primary SOURCE = the source **principally responsible for originating** the opportunity.

**Secondary SOURCE:** optional. Maximum **two** secondaries, from the **same** catalogue. Secondaries are **contributing** origins; they are **not** ranked. Ordering beyond “primary vs secondary” is **not** required.

**Change:** primary SOURCE may change **only** when better evidence is available. Change must record who, when, previous primary, new primary, and reason. Previous values **must not be erased**.

No application fields are created.

### 6.2 CHANNEL (intake / contact mechanism)

Controlled values (unchanged from H-25):

1. Email  
2. Website / Web Form  
3. LinkedIn  
4. Phone  
5. WhatsApp  
6. Trade Show / In-person  
7. Referral Introduction  
8. Partner Introduction  
9. Other  

**One CHANNEL** is recorded for **initial intake** when the opportunity is first captured.

CHANNEL is the **contact/intake mechanism**, not the acquisition origin. Later follow-up on another medium (e.g. WhatsApp after email intake) is **follow-up activity**; it does **not** replace intake CHANNEL unless the original intake CHANNEL was **incorrect** and is corrected with audit.

LinkedIn (and similar labels) may appear in **both** lists as different dimensions.

---

## 7. Loss-reason rules

H-25 primary catalogue remains **authoritative**. **No second catalogue.**

| Code | Primary / contributing loss reason |
| --- | --- |
| LR-01 | Price / Budget |
| LR-02 | Competitor Selected |
| LR-03 | Dates / Availability / Capacity |
| LR-04 | Client Cancelled / Event Cancelled |
| LR-05 | No Decision / Buyer Did Not Proceed |
| LR-06 | Timing / Deferred |
| LR-07 | Programme / Scope / Destination Fit |
| LR-08 | Commercial Terms / Contract Conditions |
| LR-09 | Supplier / Operational Confidence |
| LR-10 | Relationship / Incumbent Supplier |
| LR-11 | SEDMC Response / Process Issue |
| LR-12 | Other |

Rules:

* exactly **one** primary at Closed-Lost (**mandatory**);  
* **zero or more** secondary/contributing reasons from **this** taxonomy;  
* OTHER permitted; OTHER **requires explanation**;  
* opportunity owner records; commercial management may reclassify;  
* finalized reason changes only with new evidence that the original classification was incorrect; change **auditable**.

```text
CONTRIBUTING-LOSS CATALOGUE = SAME AS PRIMARY (LR-01–LR-12)
```

---

## 8. Market taxonomy

```text
MARKET != BUYER / ACCOUNT TYPE
```

Market = **geographic origin** of the account/opportunity. Buyer/Account Type = OR-03 organisation/business model (including PCO as distinct).

**Controlled initial Market values** (replaces H-25 “may include” for Stage 1 commercial recording):

1. South Africa  
2. United Kingdom  
3. Germany  
4. France  
5. Switzerland  
6. Netherlands  
7. Italy  
8. Spain  
9. Rest of Europe  
10. United States  
11. Canada  
12. Middle East  
13. Latin America  
14. Asia-Pacific  
15. Other  

New Market values require **controlled governance**, not ad hoc creation. **No application values created.**

Stage 1 priority remains `SOUTH AFRICAN INCENTIVE AGENCIES` = Market **South Africa** + Account Type **Incentive House / Incentive Agency**. That pair is **not** a single taxonomy value and **not** a numerical target.

---

## 9. Approval matrix

```text
PROPOSAL SEND AUTHORITY != PROPOSAL APPROVAL AUTHORITY
```

| Step | Who | When |
| --- | --- | --- |
| Proposal **preparation** | Assigned Sales & Business Development opportunity owner | After qualification; costing/programme work |
| Proposal **review** | Owner ensures the version is the intended commercial version | Before send; before approval request if required |
| **Commercial approval** | Commercial Director (or designated commercial approver under the parameter register) | **Only** if a mandatory trigger in the list below applies |
| **Proposal send** | Assigned opportunity owner **after** required approval/review | OR-05 |

**Approval mandatory** if any of:

1. exceptional discounting;  
2. any proposal below the **currently approved** commercial margin floor *(value not set here)*;  
3. unusual payment/credit terms;  
4. non-standard cancellation/liability terms;  
5. significant contractual commitments;  
6. strategic/high-risk accounts;  
7. unusually large or complex programmes;  
8. deviations from approved supplier/commercial policy.

**Approval not mandatory** for ordinary proposals **within already approved** commercial and contractual parameters.

```text
CONTROLLED COMMERCIAL PARAMETERS — VALUES REQUIRE SEPARATE MANAGEMENT APPROVAL
COMMERCIAL FLOOR VALUE = NOT AUTHORIZED
```

### Placeholder — Commercial Parameter Register

**Not implemented.** Future design placeholder only:

| Parameter class | Value | Approved by | Effective dates | Notes |
| --- | --- | --- | --- | --- |
| Commercial margin floor | *(not authorized here)* | Management approval | | No number invented |
| Discount / credit / size / liability parameters | *(not authorized here)* | Management approval | | |

C7 numerical-threshold workflow is **not** this matrix until 1B says otherwise.

---

## 10. Supplier-rate edge cases

Rate types remain **only**: Negotiated / Contracted; Trade / Net; Public; Promotional; Quoted / Ad hoc.

### 10.1 Versioning

Historical supplier rates must **not** be overwritten in a way that destroys the rate applicable to a prior proposal/booking.

### 10.2 Overlapping validity

Overlapping supplier-rate records must be **identifiable** and **resolved before** a rate is used for a live proposal.

### 10.3 Supplier-specific seasons

Season definitions **may differ by supplier**. Do **not** force one universal SEDMC season calendar.

### 10.4 FX

Original supplier currency is **preserved**. Client proposal currency **may differ**. The process must identify the **exchange-rate basis/date** used for conversion. **No FX provider selected.**

### 10.5 Expired rates

Expired rates must **not** silently be treated as current. **Reconfirmation** is required before commercial commitment.

### 10.6 Public rates

Public remains distinguishable from the other four types. Public is benchmark/reference unless **explicitly approved** for sale (H-25).

### 10.7 Proposal snapshot

A future approved proposal must retain enough commercial snapshot information to **reconstruct supplier assumptions** used to price it. **Not implemented now.**

### 10.8 Ownership

Commercial/Operations **supplier-management function** owns source-rate maintenance. Sales **flags** discrepancies.

---

## 11. C1–C10 validation protocol (1B)

**Purpose:** determine whether current C1–C10 **can support** the approved requirements. **Not** implementation. **Not** Production.

**Principles:**

* No production data.  
* No external communications.  
* No real customer records.  
* No real supplier commitments.  
* Approved **disposable Dev/Test** dataset or controlled test records **only**.  
* Do not alter business data outside that scope.  
* Record evidence **without** modifying application behavior.  
* Do **not** call PASS merely because code exists.  
* Results: `PASS` · `PARTIAL` · `FAIL` · `NOT TESTED`.

**This increment:** all capabilities **`NOT TESTED`**. Observed result = validation **not executed**.

| ID | Capability | Test scenario | Expected (requirements) | Observed | Evidence | Gap (from H-18, unverified live) | Requirement | Severity | Clarification needed? | Implementation would be required? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1B-C1 | C1 CRM | Inspect Dev/Test: org/account, owner, market, org type, nextAction, tasks | Represent Market, Account Type, owner, association **without treating seed keys as OR-03** | `NOT TESTED` | — | Tasks not RFP-bound; seed ≠ PCO/taxonomy | BR-004; BR-005; AC-S; AC-M; AC-F | High if cannot store separate Market/Type | No if inspect-only | **Unknown until tested**; if yes still `NOT AUTHORIZED` |
| 1B-C2 | C2 Pipeline | Inspect stages, `new_qualified`, lost, owner, value | Qualification **distinct** from stage; evidence/owner/change | `NOT TESTED` | — | Stage ≠ OR-01; no loss catalogue | AC-Q; AC-L; PR-009 | High | Confirm stage vs qualification | Unknown / **NOT AUTHORIZED** |
| 1B-C3 | C3 RFP | Inspect workflow, `receivedAt`, `source`, SLA | Stamps: received, clarification start/complete, proposal prep/send, owner, next action | `NOT TESTED` | — | **No clarification stage** (H-18) | AC-T; PR-002 | High | None for gap existence | Unknown / **NOT AUTHORIZED** |
| 1B-C4 | C4 Rates | Inspect rate/season/validity/currency **on disposable data only** | AC-R; overlap visible; expired not silent; types | `NOT TESTED` | — | Verification/type vs OR-08 | AC-R; OR-08 | Medium | No | Unknown / **NOT AUTHORIZED** |
| 1B-C5 | C5 Programme | Create/inspect **test** programme vs Office workflow | Itinerary, items, supplier, dates, group, RFP link | `NOT TESTED` | — | Unused live; not auto-fit | CR-013 | Medium | No | Unknown / **NOT AUTHORIZED** |
| 1B-C6 | C6 Costing | Inspect test cost sheet | Quantities, currency, margin, programme/proposal link, reconstruct assumptions | `NOT TESTED` | — | Cost sheet ≠ client proposal | AC-P; CR-020 | Medium | No | Unknown / **NOT AUTHORIZED** |
| 1B-C7 | C7 Approval | Inspect whether approval ≠ send; who/when/status | Matches §9 matrix (risk triggers, not invented %) | `NOT TESTED` | — | Threshold engine vs OR-06 | OR-05/06; AC-P | High | Floor remains unauthorized | Unknown / **NOT AUTHORIZED** |
| 1B-C8 | C8 Proposal | Inspect test proposal vs Office send | Version, owner, financials, send, snapshot, RFP link | `NOT TESTED` | — | Generate-from-C7 vs Office | AC-P | High | No | Unknown / **NOT AUTHORIZED** |
| 1B-C9 | C9 Booking | Inspect test booking linkage | RFP/opp, win, value, account, programme, SOURCE, Market, Account Type | `NOT TESTED` | — | Confirm may bypass EOS | KR-S05; AC-005 | Medium | No | Unknown / **NOT AUTHORIZED** |
| 1B-C10 | C10 KPI | Inspect what rollup exists vs pack | H-17 categories **without targets** | `NOT TESTED` | — | C10 ≠ KPI pack (H-18) | AC-009; KR-* | High for pack | No | **C11+ not authorized**; process pack may not need C10 |

---

## 12. Test evidence requirements (when 1B executes)

For each 1B-C* row, retain: screenshot or export of **Dev/Test only**; object IDs of **test** records; timestamp; operator; PASS/PARTIAL/FAIL; gap statement; **no** production URLs; **no** customer PII; **no** live supplier commitments.

**Do not** execute 1B in GPTA-H-27.

---

## 13. Remaining implementation blockers

| Blocker | Status |
| --- | --- |
| Implementation authorization | **NOT GRANTED** |
| C1–C10 modification | **NOT AUTHORIZED** |
| C11+ | **NOT AUTHORIZED** |
| 1B execution | **PLANNED, NOT STARTED** |
| Commercial parameter **values** | Separate management approval |
| Live operational SoR | Office today; EOS unused |
| Baselines | Unaudited estimates remain |
| Production / UAT / procurement / spend | **NOT AUTHORIZED** |

Inadequacy of C1–C10, if later observed, **does not** authorize development.

---

## 14. Governance status

Targeted design details **1–6 are closed** as requirements. 1B plan is **complete** and **unexecuted**. All C1–C10 protocol rows = `NOT TESTED`.

```text
GPTA-H-27 STATUS = TARGETED REQUIREMENTS CLOSURE COMPLETE — 1B LIVE VALIDATION PLAN READY

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
NEXT ACTION = CONTROLLED 1B C1–C10 LIVE VALIDATION (DEV/TEST ONLY; NO PRODUCTION; NO IMPLEMENTATION)
```
