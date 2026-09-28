# GPTA-H-25 — Authorized Commercial Business Rules

> **`GOVERNANCE-ONLY — BUSINESS RULE BASELINE`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO APPLICATION STATE CHANGE`**  
> **`NO C1–C10 MODIFY`** · **`NO C11+`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:18:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

GPTA-H-16 / H-17 / H-18 **not rewritten**. H-19–H-24 history **not overwritten**. GPTA-H-23 remains the historical blank completion sheet. This file is the **authorized commercial governance baseline**.

`C2 new_qualified` remains a technical pipeline stage. It is **not** equated with OR-01 unless a later mapping decision says so.

---

## 1. Authority / source

**Authority:** the authorized commercial decision-maker, via the GPTA-H-25 instruction, adopted the rules below as the SEDMC commercial governance baseline.

**Source pack:** GPTA-H-16 freeze; GPTA-H-17 requirements; GPTA-H-18 gaps; GPTA-H-19–H-24 capture history; this H-25 authorization.

**Not used as authority:** code, seed data, C1–C10 structures, discussion examples, or industry CRM practice.

```text
IMPLEMENTATION = NOT AUTHORIZED
```

These rules establish **business requirements only**. They do **not** authorize application development, schema changes, migrations, UAT, Production, C1–C10 modification, C11+ development, procurement, advertising spend, or campaign launch. A later governance decision is required for implementation-readiness.

---

## 2. Authorized business rules

### Protected OR-04 — numerical targets

```text
OR-04 = NO NUMERICAL TARGET AUTHORIZED
```

**Not reopened.** ~25 RFP / ~3 bookings remain **unaudited historical Owner estimates**. No targets were created, inferred, or calculated.

---

### OR-01 — Qualified RFP

**Status:** `OWNER APPROVED`

#### OR-01-A — Definition

A Qualified RFP is a genuine commercial opportunity that:

* fits SEDMC's target customer and destination/service capabilities;
* has a sufficiently defined programme requirement to pursue;
* has a credible buying process and decision timeframe;
* contains enough verified information for SEDMC to invest proposal and costing resources.

Budget information is desirable but is **not** an absolute qualification requirement where the opportunity is otherwise credible and commercially viable.

#### OR-01-B — Mandatory conditions

An RFP is qualified when the following are **sufficiently established** (perfect information is **not** required):

1. Buyer/account fit.  
2. Genuine requirement.  
3. Destination/service fit.  
4. Approximate dates or credible decision window.  
5. Sufficient programme scope.  
6. Approximate group size or participant profile.  
7. Buying process known or actively being established.  
8. Commercial viability credible.  
9. Defined next action.

#### OR-01-C — Authority

The assigned Sales & Business Development opportunity owner may qualify the RFP.

Commercial Director retains oversight and may approve exceptions or reclassification of strategic opportunities.

#### OR-01-D — Timing

Qualification occurs after initial RFP review and clarification and **before** significant proposal/costing resources are committed.

#### OR-01-E — Evidence

Evidence should include, **where available**:

* original RFP/enquiry;  
* relevant correspondence;  
* clarification responses;  
* buyer/account information;  
* dates/group/programme information;  
* buying process/timeline;  
* next action.

#### OR-01-F — Changes

Qualification may change when new evidence emerges.

The opportunity owner may update qualification status.

Material changes or strategic reclassification should be visible to the Commercial Director.

---

### OR-02 — Loss reasons

**Status:** `OWNER APPROVED`

#### OR-02-A — Primary loss taxonomy

Controlled catalogue. **Do not** add categories unless separately authorized.

| Code | Primary loss reason |
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

#### OR-02-B — Multiple reasons

**YES.** Multiple contributing reasons are allowed. **Exactly one** primary loss reason is required.

#### OR-02-C — OTHER

**YES.** `OTHER` (LR-12) is permitted.

#### OR-02-D — OTHER explanation

**YES.** OTHER requires an explanatory note.

#### OR-02-E — Responsibility

The opportunity owner records the final loss reason. Commercial management may review/reclassify.

#### OR-02-F — Finalization

The loss reason becomes final when the opportunity is formally **closed-lost**.

#### OR-02-G — Changes

A finalized loss reason may be changed **only** when new evidence demonstrates that the original classification was incorrect. The change must remain **auditable**.

---

### OR-03 — Account taxonomy

**Status:** `OWNER APPROVED`

Primary account types (do **not** collapse into market):

1. Incentive House / Incentive Agency  
2. Event Agency  
3. PCO  
4. Corporate / End Client  
5. Corporate Travel Company / TMC  
6. Travel Agency / Travel Advisor  
7. Tour Operator / Wholesale Partner  
8. Destination / Event Specialist  
9. Association / Non-Profit  
10. Government / Public Sector  
11. Other Strategic Partner  

GPTA-H-16 “South African incentive agencies” remains the frozen **first-market/buyer selection**. It is **not** a combined taxonomy value.

---

### OR-03-PCO

**Status:** `OWNER APPROVED`

```text
YES
```

PCO is a distinct account/buyer classification. This does **not** authorize a `pco` seed key or any technical change.

---

### OR-03-M — Market vs buyer

**Status:** `OWNER APPROVED`

```text
YES
```

Market and Buyer/Account Type are **separate** classifications.

* **Market** = geographic origin.  
* **Buyer / Account Type** = organisation/business model (OR-03).

Initial market values **may include**:

* South Africa  
* United Kingdom  
* Germany  
* France  
* Switzerland  
* Netherlands  
* Italy  
* Spain  
* Rest of Europe  
* United States  
* Canada  
* Middle East  
* Latin America  
* Asia-Pacific  
* Other  

This list is **not** a numerical or performance target.

---

### OR-04-FU — Follow-up ownership

**Status:** `OWNER APPROVED`

The assigned Sales & Business Development opportunity owner owns follow-up from qualification through proposal, negotiation and close.

Transfer is permitted when:

* the opportunity is reassigned;  
* the owner is unavailable;  
* Commercial Director reallocates it;  
* specialist expertise is required.

Transfer must identify the new owner and next action.

Commercial Director is the escalation point for overdue, strategically important, or commercially sensitive opportunities.

---

### OR-05 — Proposal send

**Status:** `OWNER APPROVED`

The assigned Sales & Business Development opportunity owner may send the proposal **after** required internal approval/review conditions have been satisfied.

The proposal owner is accountable for ensuring the final sent version is the approved commercial version.

C7 is **not** assumed to be today’s send process. This rule does **not** modify C7.

---

### OR-06 — Proposal approval

**Status:** `OWNER APPROVED`

Commercial approval is required before sending a proposal containing **non-standard commercial risk**, including:

* exceptional discounting;  
* margin below approved commercial floor;  
* unusual payment/credit terms;  
* non-standard cancellation/liability terms;  
* significant contractual commitments;  
* strategic/high-risk accounts;  
* unusually large or complex programmes;  
* deviations from approved commercial/supplier policy.

Ordinary proposals within approved parameters do **not** require unnecessary executive approval.

**No numerical approval threshold is authorized.** None was invented.

---

### OR-07 — Source and channel

**Status:** `OWNER APPROVED`

SOURCE and CHANNEL are **separate** classifications. Do **not** combine them into one field.

#### SOURCE

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

#### CHANNEL

1. Email  
2. Website / Web Form  
3. LinkedIn  
4. Phone  
5. WhatsApp  
6. Trade Show / In-person  
7. Referral Introduction  
8. Partner Introduction  
9. Other  

LinkedIn (and similar labels) may appear in **both** lists because they name different dimensions (origin vs contact path). That is **not** a combined field.

---

### OR-08 — Supplier-rate practice

**Status:** `OWNER APPROVED`

These are **business process** rules, not a designed technical solution.

#### Rate source (priority)

1. Direct supplier contract/agreement.  
2. Supplier-issued contracted rate sheet.  
3. Written supplier quotation.  
4. Approved trade-partner/net-rate agreement.  
5. Public rate as benchmark/reference unless explicitly approved for sale.

#### Season

Every rate must have explicit applicability dates.

#### Validity

Every rate must have: effective-from; effective-to; supplier/source; date received/verified.

#### Currency

Retain original supplier currency. Do **not** overwrite source currency because SEDMC uses another proposal currency.

#### Verification

A current written supplier source must support a rate before it is relied upon for a live proposal.

#### Verification frequency

Active core supplier rates should be reviewed **at least quarterly** and immediately when a supplier issues new rates. Rates outside their validity period must be reconfirmed before commitment.

#### Negotiated / public distinction

**YES.** Rate type must distinguish:

* Negotiated / Contracted  
* Trade / Net  
* Public  
* Promotional  
* Quoted / Ad hoc  

#### Ownership

Supplier/rate maintenance is owned by the responsible Commercial/Operations supplier-management function. Sales must flag discrepancies discovered during proposal preparation.

---

## 3. Traceability to GPTA-H-17

No new GPTA-H-17 requirements were created. Implementation remains **NOT AUTHORIZED** on every row.

| Owner rule | GPTA-H-17 / dependency | Business-rule status | Implementation |
| --- | --- | --- | --- |
| OR-01 | BR-001 / PR-009 / DR-002 / DR-B02 / KR-D02 / KR-S03 / AC-002 | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-02 | BR-006 / PR-006 / DR-005 / DR-B12 / AC-007 | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-03 | BR-005 / DR-008 / AC-010 / MR-005 | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-03-PCO | Account taxonomy dependency | **OWNER APPROVED** (`YES`) | **NOT AUTHORIZED** (no seed-key change) |
| OR-03-M | Market/buyer classification dependency | **OWNER APPROVED** (`YES`) | **NOT AUTHORIZED** |
| OR-04 numerical targets | BR-009 / KR-* / AC-009 | **RESOLVED — NO NUMERICAL TARGET AUTHORIZED** | **NOT AUTHORIZED** |
| OR-04-FU | Follow-up ownership (PR-005 / PR-008 / AC-004) | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-05 | Proposal-send authority (CR-017 / CR-025) | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-06 | Proposal approval dependency | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-07 | Channel/source (PR-001 / BR-007 / DR-006 / KR-M01 / MR-001–MR-005) | **OWNER APPROVED** | **NOT AUTHORIZED** |
| OR-08 | Supplier-rate governance (CR-013–CR-016) | **OWNER APPROVED** | **NOT AUTHORIZED** |

Previously blocked Owner-input dependencies for these rules are **resolved as business rules**. They are **not** implementation-ready closures of AC/KR measurement.

---

## 4. Remaining ambiguities

These are **not** contradictions and were **not** independently resolved.

1. H-23 asked whether one RFP may have **more than one SOURCE** and which SOURCE is **primary**. H-25 authorized SOURCE and CHANNEL catalogues and their separation; it did **not** restate a multiple-source / primary-source rule. **Not inferred** from OR-02.  
2. Contributing (non-primary) loss reasons are allowed; whether they must use the LR-01–LR-12 catalogue is **not** separately stated.  
3. OR-06 refers to an “approved commercial floor” with **no numerical value**. Consistent with OR-04 / “do not invent a numerical approval threshold.”  
4. Market values are an **initial “may include”** list, not explicitly a closed exclusive set.  
5. How an opportunity owner is **assigned**, and how material qualification changes are made **visible** to the Commercial Director, are process details not specified as systems.  
6. Supplier-rate ownership is a **function** (Commercial/Operations supplier-management), not a single named title.  
7. “Ordinary proposals within approved parameters” is defined by the OR-06 risk list; other parameter documents are **not** created here.

Missing information from H-23 that **is** now supplied by H-25 is **not** listed as outstanding required decisions.

---

## 5. Implementation boundary

```text
IMPLEMENTATION = NOT AUTHORIZED
C1–C10 DEVELOPMENT = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

Do **not** begin implementation. Do **not** modify C1–C10. Do **not** create C11+. Mapping these rules onto EOS, if ever authorized, requires a **separate** governance decision after requirements/acceptance-criteria closure and implementation-readiness assessment.

---

## 6. Validation result

| Check | Result |
| --- | --- |
| Contradictions among authorized rules | **None found** |
| PCO vs OR-03 taxonomy | Consistent (`YES` and listed as class 3) |
| Market vs buyer | Consistent (separate; H-16 freeze not collapsed) |
| OTHER loss reason vs LR-12 | Consistent |
| Multiple contributing + one primary loss reason | Consistent |
| SOURCE vs CHANNEL (including shared labels) | Consistent as **separate dimensions** |
| Budget not mandatory to qualify vs LR-01 Price/Budget | Consistent |
| Send (OR-05) vs conditional approval (OR-06) | Consistent |
| Numerical targets | **OR-04 unchanged** |
| H-16 / H-17 / H-18 | **Unchanged** |
| H-19–H-24 | **Preserved** (H-23 left historically blank) |
| Application / schema / data | **Unchanged by this task** |
| Implementation | **Did not occur** |

---

## GPTA-H-25 status

```text
GPTA-H-25 STATUS = OWNER BUSINESS RULES RESOLVED AND VALIDATED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
NEXT ACTION = BUSINESS REQUIREMENTS / ACCEPTANCE CRITERIA CLOSURE AND IMPLEMENTATION-READINESS ASSESSMENT
```
