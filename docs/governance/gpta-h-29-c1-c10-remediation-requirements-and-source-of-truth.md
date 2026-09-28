# GPTA-H-29 — C1–C10 Remediation Requirements & Operating Source-of-Truth Decision Package

> **`GOVERNANCE-ONLY — REQUIREMENTS DEFINITION`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO APPLICATION CODE CHANGE`**  
> **`NO SCHEMA / MIGRATION / DATA MODEL CHANGE`**  
> **`NO C1–C10 ALTERATION`** · **`NO C11+`** · **`NO OFFICE MIGRATION`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:45:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Authoritative evidence (not rewritten): GPTA-H-16 freeze · H-17 requirements · H-18 gap analysis · H-19 operating process · [`gpta-h-25-authorized-commercial-business-rules.md`](gpta-h-25-authorized-commercial-business-rules.md) · [`gpta-h-26-business-requirements-closure-and-implementation-readiness.md`](gpta-h-26-business-requirements-closure-and-implementation-readiness.md) · [`gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md`](gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md) · [`gpta-h-28-c1-c10-live-validation-results.md`](gpta-h-28-c1-c10-live-validation-results.md).

```text
IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
OR-04 = NO NUMERICAL TARGET AUTHORIZED
COMMERCIAL FLOOR VALUE = NOT AUTHORIZED
```

This package **defines** remediation requirements and the future operating source-of-truth model. It does **not** authorize development, schema change, Office-history migration, UAT, or Production.

No new Owner commercial rules were invented. H-25 / H-27 remain the business-rule baseline. H-28 remains the live-validation evidence.

---

## A. Executive summary

C1–C10 Dev/Test structures are **retainable as an identity chain**, not as the current operational system of record, and not as Stage 1 requirements-complete capability.

| Question | Answer |
| --- | --- |
| What can be retained? | Opportunity / RFP / programme / costing / approval / proposal / booking **identity linkage**; owner principal fields; `receivedAt` / `sentAt`; cost-sheet versions and totals; rate validity/season/currency **fields**; approval request/decision timestamps |
| What requires remediation? | Market vs buyer type; PCO; SOURCE ≠ CHANNEL; qualification distinct from `new_qualified`; clarification stamps; RFP-bound follow-up; H-27 approval categories (not 250k/20%); rate type/expiry/overlap/snapshot; booking dimensions; KPI pack |
| What is absent? | OR-01 qualification object; LR-01–LR-12 capture; clarification as a distinguishable step; Commercial Parameter Register **values**; C10 commercial KPI pack |
| EOS future SoR? | Structured commercial facts listed in §C.A |
| What may remain outside EOS? | Email / WhatsApp / phone as **channels**; Office as **client-facing document production**; Excel as a **working calculator** until EOS costing is the sent-proposal SoR |
| Implementation? | **Not authorized** |

**Governing operating principle:** EOS must eventually answer pipeline, conversion, follow-up, and KPI questions from **structured records**. Communication and document layout may remain in Office and messaging tools.

The demonstrated Dev/Test chain must **not** be discarded:

`OPP-2026-GLOB` → `RFP-2026-0847` → `PRG-2026-0847` → `CST-2026-0847` → `APR-2026-0847` → `PROP-2026-0847` → `BKG-2026-0847`

---

## B. Current-state evidence

Source: GPTA-H-28 (in-memory commercial preview, HEAD `75ee4c3`, demo seed, read-only).

### B.1 Operating process (H-19 / H-28)

Live commercial process remains:

RFP received → clarification → programme/itinerary → financial proposal → email send → manual follow-up → confirm/reject.

Tools: MS Office, Excel, Outlook/Gmail, WhatsApp, phone. **EOS is not the operational SoR.**

### B.2 H-28 classifications (established)

| Capability | H-28 result |
| --- | --- |
| C1 CRM | `PARTIALLY DEMONSTRATED` |
| C2 Opportunity | `PARTIALLY DEMONSTRATED` |
| C3 RFP | `PARTIALLY DEMONSTRATED` |
| C4 Supplier rates | `PARTIALLY DEMONSTRATED` |
| C5 Programme | `PARTIALLY DEMONSTRATED` |
| C6 Costing | `PARTIALLY DEMONSTRATED` |
| C7 Approval | `PARTIALLY DEMONSTRATED` |
| C8 Proposal | `PARTIALLY DEMONSTRATED` |
| C9 Booking | `PARTIALLY DEMONSTRATED` |
| C10 KPI | `NOT DEMONSTRATED` |

### B.3 Structure reconciliation (read-only; not a code change)

These existing structures **exist** and explain H-28. Existence is **not** operational demonstration.

| Structure | Observed relevance to remediation |
| --- | --- |
| `OppOpportunity.stage` includes `new_qualified` labelled “New / Qualified” | **Must remain a pipeline stage.** Must **not** be treated as OR-01 |
| `OppOpportunity` has `ownerPrincipalId`, `organizationId`, optional `accountId`, value/pax/close date | Retain identity/owner/value; add qualification, SOURCE/CHANNEL, Market, next action as **requirements** (not fields specified as schema) |
| `RfpRecord.workflowStage` = intake → programme → costing → approval → proposal → sent → closed | **No clarification stage** |
| `RfpRecord.source` comment = “intake channel (email, portal, advisor, other)” | Combines origin and intake; **does not** satisfy SOURCE ≠ CHANNEL |
| `RfpRecord.receivedAt` | Retain as RFP-received stamp |
| `CrmAccount.market`, `strategicClassification`, `nextAction` | Structure exists; H-28 seed **unset**; Market list ≠ H-27 15-value taxonomy |
| `DEFAULT_CRM_ORGANIZATION_TYPE_KEYS` | No `pco`; Event Agency not a distinct key |
| `CrmTask` related org/contact/account/activity only | **Not** RFP/opportunity-bound; H-28 tasks `[]` |
| `SupRate` validity/season/currency/`rateType` string/`preferredInConflict` | Useful; H-28 did not observe H-25 five types, verification date, or silent-expiry prevention |
| `CostLineItem.supplierRateId` optional | Requirement: must be **used** (or explicit ad-hoc) on sent costing; H-28 seed lines lacked it |
| `CostSheet.marginFloorPercent` and C7 `sell_threshold` / 250,000 USD | **Not** the approved H-27 rule; must **not** remain the governing commercial approval rule |
| `PropProposal` links rfp/programme/cost/approval; `sentAt`; totals snapshot | Retain identity/send; snapshot insufficient for OR-08 reconstruction |
| `BkgBooking` links proposal/rfp/programme/opportunity/organization; `sellPrice`; `confirmedAt` | Retain chain; Market / Account Type / SOURCE **not** on booking |
| C10 command center | Booking handover/ops/finance rollup. Domain J analytics is **not** C10 and **not** C11+ |

### B.4 Chain breaks (H-28 §E)

Qualification; clarification; SOURCE/CHANNEL; loss reasons; follow-up binding; H-27 approval categories; rate snapshot; Market/buyer-type persistence onto booking; KPI pack.

---

## C. Future-state source-of-truth model

```text
EOS = SYSTEM OF RECORD FOR STRUCTURED COMMERCIAL FACTS
OFFICE / EXCEL = DOCUMENT PRODUCTION AND WORKING TOOLS (NOT COMMERCIAL FACT SoR)
EMAIL / WHATSAPP / PHONE = COMMUNICATION CHANNELS (NOT COMMERCIAL FACT SoR)
```

### C.A EOS system of record (must eventually own)

These facts **cannot safely remain only** in Office/Excel/mail if EOS is intended to provide pipeline visibility, conversion measurement, follow-up control, and KPI reporting:

| Fact | Why EOS must own it |
| --- | --- |
| Account identity | Repeat business, strategic visibility, conversion by account |
| Buyer / account type (OR-03, including PCO) | Distinct from Market; Stage 1 first-pair is SA + Incentive House |
| Market (H-27 15-value list) | Independent geographic dimension |
| Opportunity / RFP identity and relationship | Funnel identity persistence |
| Qualification status, owner, date, evidence | Distinct from pipeline stage |
| Opportunity owner and follow-up owner | “Who owns the action” |
| Primary SOURCE + 0–2 secondary SOURCES | Acquisition reporting |
| CHANNEL (initial intake) | Separate from SOURCE |
| Next action and follow-up timing | Overdue control |
| Ownership transfer audit | OR-04-FU |
| Clarification started/completed (or N/A) | Response-speed measurement |
| Programme identity linked to RFP | Commercial programme SoR |
| Costing identity linked to programme/RFP | Reconstruct “why it cost that” |
| Approval required/status/approver/timestamp/version | Distinct from send |
| Proposal identity, version, sender, send timestamp | Distinct from Office file |
| Commercial snapshot of sent proposal | Reconstruct assumptions |
| Booking / win linked to originating opportunity | Conversion |
| Primary + contributing loss reasons | Loss analysis |
| KPI/reporting facts derived from the above | C10 pack |

### C.B Document / communication channel (may remain outside EOS)

| Remain outside EOS as channel / artefact | Condition |
| --- | --- |
| Email, WhatsApp, phone | Legitimate **communication**. Must not be the only place next action, owner, or outcome lives |
| Supplier correspondence | Allowed; rate **facts used for a live proposal** must still be recorded in EOS |
| Client-facing Office documents (itinerary/proposal layout) | Allowed as **presentation**. Structured identity/version/send/approval/costing facts must exist in EOS |
| Attachments / original RFP files | Allowed as evidence store; qualification/outcome still structured in EOS |

EOS is **not** required to replace email/WhatsApp/phone.

### C.C Working document (Office / Excel)

| Tool | Future role |
| --- | --- |
| Microsoft Office (Word/PowerPoint) | **Controlled document-production** for client-facing programme/proposal presentation |
| Excel | **Temporary working calculator** during costing preparation. Once a proposal is **sent**, the commercial basis used to send it must exist as EOS costing/proposal snapshot |
| Outlook/Gmail | Communication channel; RFP received time and send time must also be structured in EOS when the event occurs |

Office/Excel **must not** remain the operational system of record for the facts in §C.A after a future implementation is authorized **and** accepted. Until that authorization, H-19 remains: Office is the **current** SoR.

### C.D Operating model (future, not live today)

1. Capture structured facts in EOS at the business event (receive, qualify, clarify, cost, approve, send, follow up, win/lose).  
2. Produce client documents in Office if needed, identified against the EOS proposal/programme version.  
3. Continue conversations on email/WhatsApp/phone.  
4. Update EOS when next action, owner, clarification completion, send, or outcome changes.  
5. Do **not** auto-migrate historic Office files unless a **separate** migration policy is approved.

---

## D. C1–C10 remediation requirements

Requirements below are **business requirements**. They do **not** specify schema, APIs, or UI. Implementation remains unauthorized.

Retain / remediate / absent uses H-28 vocabulary against Stage 1 rules.

---

### D1. C1 — CRM

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | Organization/account identity; account `ownerPrincipalId`; account–opportunity relationship (`OppOpportunity.organizationId` / `accountId`); strategic classification **field existence** (value rules still DR-008 deferred) |
| Remediate | Market must use H-27 15-value geographic list, **independent** of country string and of buyer type; buyer/account type must be distinguishable as OR-03 including **PCO** and Event Agency; SOURCE and CHANNEL must not be collapsed; repeat business must be **identifiable** from prior won/booking on the same account (flag taxonomy DR-008 remains deferred) |
| Absent | H-27 Market as a controlled recorded value on live/demo accounts; PCO as a distinct recorded classification; SOURCE/CHANNEL pair on account/opportunity |

**Requirements**

* Each commercially pursued account has a stable identity and is linkable to its opportunities.  
* Buyer/Account Type is recorded from the OR-03 list; **PCO is distinct**.  
* Market is recorded from the H-27 15-value list and is **not** the same fact as Buyer/Account Type or destination.  
* Opportunity ownership is visible on the opportunity; the account owner may differ and must remain distinguishable.  
* SOURCE and CHANNEL follow §D1.1–D1.2 (typically recorded on the **opportunity**, inherited for reporting; account may store relationship-level SOURCE where the relationship itself is the origin).  
* Repeat business is reportable when the same account has a prior confirmed booking/won opportunity.  
* Strategic-account visibility may use existing `strategicClassification` / priority **only as a visibility aid** until DR-008 is separately closed. It must **not** replace OR-03.

#### D1.1 SOURCE

* Exactly **one** primary SOURCE (H-27 catalogue).  
* Zero to **two** secondary SOURCES from the **same** catalogue.  
* Primary and secondaries are identifiable.  
* Primary SOURCE changes only with better evidence; who, when, previous primary, new primary, and reason are retained; previous values are not erased.

#### D1.2 CHANNEL

* CHANNEL is **independent** of SOURCE.  
* One CHANNEL records **initial intake**.  
* Later messaging on another medium is follow-up activity and does **not** replace CHANNEL unless the original intake CHANNEL was incorrect and is corrected with audit.

**Acceptance criteria:** AC-C1-01–AC-C1-06 in §F.

---

### D2. C2 — Qualification / opportunity

**H-28:** `PARTIALLY DEMONSTRATED`.

```text
new_qualified = PIPELINE STAGE
new_qualified ≠ OR-01 QUALIFICATION
```

| Class | Item |
| --- | --- |
| Retain | Pipeline stages including `new_qualified`, `rfp_received`, `proposal_sent`, `negotiation`, `won`, `lost`; opportunity code; owner; estimated value when available; stage history |
| Remediate | Qualification status/evidence/owner/date distinct from stage; next action on the opportunity; loss-reason capture at closed-lost |
| Absent | OR-01 qualification object; LR-01–LR-12 |

**Requirements (OR-01 preserved)**

A Qualified RFP is a genuine commercial opportunity that fits SEDMC target customer and destination/service capabilities; has a sufficiently defined programme requirement; has a credible buying process and decision timeframe; and contains enough verified information to invest proposal/costing resources. **Budget is not mandatory.**

Mandatory conditions (sufficient, not perfect):

1. Buyer/account fit  
2. Genuine requirement  
3. Destination/service fit  
4. Approximate dates or credible decision window  
5. Sufficient programme scope  
6. Approximate group size or participant profile  
7. Buying process known or actively being established  
8. Commercial viability credible  
9. Defined next action  

Also required as **records**:

* Qualification status: `qualified` / `not_qualified` / `not_yet_assessed` (unqualified and not-yet-assessed remain visible).  
* Qualification owner (assigned Sales & Business Development opportunity owner).  
* Qualification date.  
* Qualification evidence (OR-01-E items **where available**).  
* Reclassification / change with reason; material/strategic reclassification **visible to Commercial Director**.  
* Qualification **before** significant proposal/costing resource commitment (OR-01-D).  

**Do not** invent numerical qualification thresholds.

**Loss (OR-02):** exactly one primary LR-01–LR-12 at closed-lost; zero or more contributing reasons from the **same** catalogue; LR-12 requires explanation; owner records; change after finalization only with new evidence and audit.

**Acceptance criteria:** AC-C2-01–AC-C2-06; AC-Q; AC-L.

---

### D3. C3 — RFP / clarification / follow-up

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | RFP identity; `opportunityId`; `receivedAt`; assigned principal; destinations/pax/dates/requirements as commercial content |
| Remediate | Distinguish SOURCE from CHANNEL (do not use `RfpRecord.source` as both); add clarification as a **distinguishable business step** with start/complete (or N/A); bind follow-up to RFP/opportunity |
| Absent | Clarification stage/stamps; RFP-bound next action; follow-up transfer audit |

**RFP**

* Stable RFP identity linked to one opportunity.  
* Received timestamp when received.  
* Accountable owner (opportunity owner unless transferred).

**Clarification**

* Clarification started timestamp (or explicit N/A).  
* Clarification completed timestamp (or explicit N/A).  
* Clarification evidence (what was asked / material response), distinguishable from general activity/notes.  
* Clarification is **not** merely free-text history.

**Follow-up (OR-04-FU)**

* Next action and next-action timing on every **active qualified** opportunity.  
* Follow-up owner = opportunity owner.  
* Reassignment records new owner **and** next action.  
* Transfer is auditable (who, when, previous owner, new owner).  
* Overdue = timing passed and next action not done; escalation point = Commercial Director (process rule).

The system must make it possible to answer, from EOS records:

> Which RFPs require action, who owns the action, and what happens next?

without reconstructing that answer solely from email/WhatsApp.

**Acceptance criteria:** AC-C3-01–AC-C3-07; AC-F; AC-T.

---

### D4. C4 — Supplier rates

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | Supplier identity; rate code/name; `validFrom`/`validTo`; `seasonLabel`/`seasonId`; original `currency`; optional occupancy/meal plan; version field existence; overlapping-preference hint |
| Remediate | Controlled H-25 rate types; verification date/state; expired must not remain silently current; overlapping current rates identifiable and resolved before live-proposal use; original supplier currency not overwritten by proposal currency; FX basis/date identified when converted |
| Absent | Observed H-25 five types on GET; verification date; proposal-grade snapshot of the rate version used |

**Requirements**

A rate used for a **live** proposal/costing must identify: supplier; rate version; rate source (OR-08 priority class); rate type (exactly one of Negotiated/Contracted, Trade/Net, Public, Promotional, Quoted/Ad hoc); original supplier currency; season and applicability; effective-from; effective-to; verification date/state.

* **Expired:** a rate outside validity is **not current**. Reconfirmation is required before commercial commitment. Silent `active` after expiry does not satisfy this requirement.  
* **Overlap:** overlapping records must be identifiable; ambiguous current-rate selection must be resolved before use on a live proposal.  
* **Versioning:** a proposal/costing must be traceable to the rate version used. Historical rates must not be overwritten in a way that destroys reconstruction.  
* **Currency:** original supplier currency preserved.  
* **FX:** if converted, identify exchange-rate **basis and date**. No FX provider is selected here.  
* **Public:** distinguishable; public is benchmark/reference unless explicitly approved for sale.  
* **Seasons:** may differ by supplier; no universal SEDMC calendar is required.  
* **Ownership:** Commercial/Operations supplier-management maintains source rates; Sales flags discrepancies.

**Acceptance criteria:** AC-R; AC-C4-01–AC-C4-05.

---

### D5. C5 — Programme / itinerary

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | Programme identity; RFP/opportunity/organization links; days/items; supplier linkage on items; pax |
| Remediate | Programme is the **commercial programme** associated with the RFP (dates, group, items consistent with what costing/proposal use); version/history where client-facing content changes; Office document is presentation, not the only identity |
| Absent | Operational use as itinerary SoR (Office remains current SoR) |

**Requirements**

Trace: RFP → Programme → Costing → Proposal.

* Identifiable itinerary/programme linked to the RFP.  
* Dates and group information sufficient for commercial pursuit.  
* Programme items and supplier identities used in costing.  
* Programme version identifiable when the client-facing programme changes.  
* Costing and proposal reference that programme identity.

**Office relationship:** Office may remain the **document-production layer**. EOS holds structured commercial programme facts. Client-facing documents may be generated or maintained separately. **Document generation is not required** by this package.

**Acceptance criteria:** AC-C5-01–AC-C5-03.

---

### D6. C6 — Costing

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | Cost-sheet identity; links to programme/RFP/opportunity; line quantities/unit cost/currency; totals; cost-sheet versions; margin **as calculated** |
| Remediate | Each commercial line used in a sent proposal must retain rate source/version (or explicit ad-hoc); original currency; assumptions sufficient to reconstruct; distinguish later changes from the sent basis |
| Absent | H-28 seed `supplierRateId` on lines; FX basis; “why it cost that when sent” completeness |

The future system must answer:

> Why did this proposal cost what it cost when it was sent?

**Requirements**

Trace: Costing → programme → supplier/rate → quantities → currency → margin → proposal.

* Rate source and rate version (or explicit Quoted/Ad hoc / unverified).  
* Currency per line and sheet; original supplier currency not destroyed.  
* Quantities and commercial assumptions retained on the **sent** version.  
* Margin **calculated and retained** as a fact of that version.  
* Costing version linked to the sent proposal snapshot.

```text
DO NOT INTRODUCE A MARGIN TARGET
DO NOT INVENT NUMERICAL COMMERCIAL PARAMETERS
```

Existing `marginFloorPercent` / 20% / 250,000 USD gates are **application artifacts**, not authorized Owner parameters. They must **not** be treated as Stage 1 commercial rules. Floor **value** remains `NOT AUTHORIZED` (Commercial Parameter Register placeholder).

**Acceptance criteria:** AC-C6-01–AC-C6-04; AC-P (costing portion).

---

### D7. C7 — Commercial approval

**H-28:** `PARTIALLY DEMONSTRATED`.

```text
PROPOSAL SEND AUTHORITY != PROPOSAL APPROVAL AUTHORITY
H-28 250k / 20% GATE = NOT THE APPROVED H-27 RULE
DO NOT PRESERVE 250k / 20% AS THE GOVERNING COMMERCIAL APPROVAL RULE
DO NOT REPLACE IT WITH ANOTHER NUMERICAL THRESHOLD IN THIS PACKAGE
```

| Class | Item |
| --- | --- |
| Retain | Approval request identity; requester ≠ decider capability; status; `decidedAt`; notes; link to costing/RFP/programme |
| Remediate | Governing triggers = H-27 non-standard-risk categories; ordinary in-parameter proposals must **not** require unnecessary executive approval; sender distinct from approver |
| Absent | H-27 matrix as observed behavior; Commercial Parameter Register **values** |

**Approval mandatory** if any of:

1. exceptional discounting;  
2. margin below the **currently approved** commercial floor *(value not set; register placeholder)*;  
3. unusual payment/credit terms;  
4. non-standard cancellation/liability;  
5. significant contractual commitments;  
6. strategic/high-risk accounts;  
7. unusually large/complex programmes;  
8. deviations from approved supplier/commercial policy.

**Required records when approval applies:** approval required (yes/no + trigger class); status; approver; timestamp; approved commercial version; rejection/rework if not approved.

**Send (OR-05):** assigned opportunity owner may send **after** required approval/review; sender and send timestamp are recorded; sender is distinguishable from approver.

Reference: future **Commercial Parameter Register**. Values require **separate management approval**. This package does not set them.

**Acceptance criteria:** AC-C7-01–AC-C7-05.

---

### D8. C8 — Proposal

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | Proposal identity; version; links to RFP/programme/costing/approval; `sentAt`; financial totals |
| Remediate | Distinct proposal owner vs sender vs approver; commercial snapshot includes rate-version facts (OR-08 / H-27 §10.7); recipient type (agent/client) as a business fact |
| Absent | Operational use as proposal SoR (Office remains current SoR) |

EOS must eventually answer: what was proposed; to whom; by whom; when; based on which costing; based on which approved version; under which commercial assumptions.

Office may remain the client-facing document-production mechanism. **Document automation is not required.**

**Acceptance criteria:** AC-P; AC-C8-01–AC-C8-03.

---

### D9. C9 — Booking / won opportunity

**H-28:** `PARTIALLY DEMONSTRATED`.

| Class | Item |
| --- | --- |
| Retain | Booking identity; FKs to proposal, RFP, programme, opportunity, organization; `sellPrice`; `confirmedAt` / win date; operations assignee |
| Remediate | Persist Market, Buyer/Account Type, and SOURCE (primary, and secondaries if recorded) as reporting dimensions on the won/booking record **or** as reliably inherited, immutable-at-win copies from the originating opportunity |
| Absent | Those dimensions on H-28 booking payload |

**Requirements**

* Won/booking is traceable to the originating opportunity/RFP.  
* Client/account, programme, value, booking/win date, and owner are recorded.  
* Market, buyer/account type, and SOURCE remain available for conversion and revenue analysis **after** win (must not be lost because later account edits change history without audit).

Do **not** create real bookings in this governance exercise (already observed via demo only).

**Acceptance criteria:** AC-C9-01–AC-C9-03.

---

### D10. C10 — KPI pack

**H-28:** `NOT DEMONSTRATED` as the approved KPI pack. C10 command center is a **booking operations rollup**. Domain J summary counts are **not** this pack and are **not** C11+.

**Required measures (categories only — no targets, no forecasts, no predictive scoring, no dashboard implementation)**

| Group | Measures | Data basis required |
| --- | --- | --- |
| Funnel | Total RFPs; qualified RFPs; proposals sent; bookings; conversion (qualified→booking, and optionally RFP→booking **labelled separately**) | Qualification ≠ stage; outcome linkage |
| Speed | RFP received; clarification start/complete (or N/A); proposal turnaround (prep start→sent); response time | AC-T stamps |
| Pipeline | Open pipeline value (when available, else explicit unknown); stage; owner; market; buyer type | BR-004 / DR-007 |
| Loss | Primary loss reason; contributing reasons; loss timing; market; buyer type; source | OR-02 |
| Commercial | Revenue when available; profit when cost and sell exist; repeat business when identifiable | No invented profit |
| Acquisition | Primary SOURCE; secondary SOURCE; CHANNEL; market; buyer type | OR-07 |

Reproducible from structured records; filterable by the dimensions above; comparable across defined historical periods **once timestamps exist**. Period comparison is a **capability requirement**, not a baseline census.

**Acceptance criteria:** AC-009 restated as AC-C10-01–AC-C10-04.

---

## E. Cross-capability traceability model

Future-state trace:

`SOURCE` → `ACCOUNT` → `OPPORTUNITY` → `QUALIFICATION` → `RFP` → `CLARIFICATION` → `PROGRAMME` → `COSTING` → `APPROVAL` → `PROPOSAL` → `FOLLOW-UP` → `BOOKING` → `LOSS/WIN` → `KPI`

| Transition | Required relationship | Identity | Owner | Timestamps | Audit | Reporting dimensions | H-28 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SOURCE → ACCOUNT / OPP | Primary SOURCE on opportunity; optional secondaries | SOURCE values from catalogue | Opportunity owner records | Capture time; SOURCE change history | SOURCE change who/when/why | SOURCE, CHANNEL | **Breaks** |
| ACCOUNT → OPPORTUNITY | Opportunity linked to account/org | Account id + opportunity id | Account owner vs opportunity owner distinguishable | Opportunity created | Owner change | Market, buyer type | Partial (link yes; dimensions no) |
| OPPORTUNITY → QUALIFICATION | Qualification record on the opportunity/RFP | Qualification status id/state | Qualification owner = opportunity owner | Qualification date; change dates | Evidence + reclassification visibility | Qualified vs not vs not assessed | **Breaks** |
| QUALIFICATION → RFP | RFP linked to opportunity | RFP id | RFP/opportunity owner | `receivedAt` | Receipt distinct from createdAt | Market, buyer type, SOURCE, CHANNEL | Partial |
| RFP → CLARIFICATION | Clarification step on that RFP | RFP id | Same owner unless transferred | Start; complete or N/A | Distinct from general notes | Response speed | **Breaks** |
| CLARIFICATION → PROGRAMME | Programme linked to RFP | Programme id | Opportunity owner (commercial) | Programme created/updated | Programme version if client-facing change | Group/dates | Partial |
| PROGRAMME → COSTING | Cost sheet linked to programme + RFP | Costing id | Preparer identifiable | Costing version time | Line→rate version | Currency, margin as fact | Partial |
| COSTING → APPROVAL | Approval linked to costing/RFP when required | Approval id | Approver ≠ requester | Requested; decided | Trigger class; decision | Approval status | Partial (wrong rule) |
| APPROVAL → PROPOSAL | Proposal linked to approved costing version when approval required; or recorded “approval not required” | Proposal id + version | Proposal owner; sender | `sentAt` | Sender ≠ approver | Sent version | Partial |
| PROPOSAL → FOLLOW-UP | Follow-up bound to opportunity/RFP | Next-action id/state | Follow-up owner = opportunity owner | Due; last action | Transfer audit | Overdue | **Breaks** |
| FOLLOW-UP → BOOKING / LOSS | Outcome on same identity | Booking id or closed-lost | Owner at close | Win date or loss date | Loss reason changes | Market, buyer type, SOURCE, value | Partial win; loss **breaks** |
| LOSS/WIN → KPI | KPIs derived from structured facts | Same identities | n/a (derived) | Event stamps | Reproducible calculation | All §D10 dimensions | **Breaks** (pack absent) |

Identity chain **OPP → RFP → PRG → CST → APR → PROP → BKG** is the retainable spine. Remediation attaches qualification, clarification, SOURCE/CHANNEL, follow-up, dimensions, snapshots, and KPIs **onto that spine**.

---

## F. Acceptance criteria

Measurable presence/quality rules. **No numerical business targets.** Tooling may remain Office **until** a separately authorized implementation is accepted; after acceptance, criteria are evaluated against EOS structured records.

### F.1 Inherited H-27 criteria (still authoritative)

AC-Q, AC-L, AC-F, AC-S, AC-M, AC-P, AC-R, AC-T remain as written in GPTA-H-27 §5.

### F.2 Remediation criteria

| ID | Criterion | Passes when |
| --- | --- | --- |
| AC-C1-01 | Account identity | An opportunity used in the funnel is linked to a stable account/organization identity |
| AC-C1-02 | PCO distinguishable | A PCO account is recorded as PCO and is not forced into Incentive House, Event Agency, or Corporate |
| AC-C1-03 | Market independent | Market is one of the 15 H-27 values and can differ from buyer type and from destination |
| AC-C1-04 | SOURCE cardinality | Opportunity has exactly one primary SOURCE and 0–2 secondaries from the SOURCE catalogue |
| AC-C1-05 | CHANNEL separate | CHANNEL is recorded from the CHANNEL catalogue and is not the same stored fact as SOURCE |
| AC-C1-06 | SOURCE audit | A primary SOURCE change retains previous value, actor, time, and reason |
| AC-C2-01 | Stage ≠ qualification | An opportunity can be at stage `new_qualified` while qualification status is `not_yet_assessed` or `not_qualified` |
| AC-C2-02 | OR-01 conditions | A `qualified` record has the nine OR-01-B conditions treated as established (budget optional) |
| AC-C2-03 | Qualification owner/date | Qualified records show owner and qualification date |
| AC-C2-04 | Evidence | Qualification evidence is visible where available; change of status is visible |
| AC-C2-05 | CD visibility | Material/strategic reclassification is visible to Commercial Director |
| AC-C2-06 | Unqualified visible | Not-yet-assessed and not-qualified RFPs remain listed and are excluded from qualified counts |
| AC-C3-01 | RFP identity | RFP code/id links to one opportunity |
| AC-C3-02 | Received stamp | `receivedAt` (or equivalent business received time) exists and is distinct from system created time when they differ |
| AC-C3-03 | Clarification distinct | Clarification start/complete or N/A exist and are not only unstructured notes |
| AC-C3-04 | Next action | Every active qualified opportunity has next action + timing (or explicit no-deadline reason) |
| AC-C3-05 | Follow-up owner | Follow-up owner equals opportunity owner unless a transfer record exists |
| AC-C3-06 | Transfer audit | Ownership transfer records new owner and next action |
| AC-C3-07 | Action list | A user can list RFPs requiring action with owner and next action **without** opening email |
| AC-C4-01 | Rate type | A live-proposal rate uses one of the five H-25 types |
| AC-C4-02 | Expiry | An expired rate cannot be selected as a current live rate without reconfirmation |
| AC-C4-03 | Overlap | Overlapping validities are identifiable; live use requires a resolved choice |
| AC-C4-04 | Currency | Original supplier currency remains after a proposal is produced in another currency |
| AC-C4-05 | Version trace | Sent costing/proposal identifies the rate version used or explicit ad-hoc |
| AC-C5-01 | Programme↔RFP | Programme identity is that of the RFP being costed/proposed |
| AC-C5-02 | Structure | Dates, group information, items, and suppliers are present on the commercial programme |
| AC-C5-03 | Office split | A client-facing Office file, if used, is identifiable against the EOS programme/proposal version |
| AC-C6-01 | Reconstruct sent cost | From the sent proposal one can identify programme, quantities, currencies, margin, and rate versions/ad-hoc flags used |
| AC-C6-02 | Later change distinct | A later costing edit does not silently overwrite the sent snapshot |
| AC-C6-03 | No target invented | Margin is stored as calculated fact; no Owner margin **target** is implied |
| AC-C6-04 | Linkage | Costing remains linked to programme and RFP |
| AC-C7-01 | Matrix not 250k/20% | Approval required is determined by H-27 risk categories, **not** by the observed 250,000 USD / 20% gate as the governing rule |
| AC-C7-02 | In-parameter bypass | An ordinary in-parameter proposal can proceed to send without executive approval |
| AC-C7-03 | Approval record | When required: status, approver, timestamp, approved version exist |
| AC-C7-04 | Reject/rework | Non-approval is representable (rejected or returned for rework) |
| AC-C7-05 | Send ≠ approval | Sender and send timestamp exist and sender ≠ approver when both roles acted |
| AC-C8-01 | Proposal facts | Sent proposal has identity, version, owner, sender, send time, RFP/programme/costing links |
| AC-C8-02 | Snapshot | Snapshot is sufficient to state what was commercially proposed (not only day counts) |
| AC-C8-03 | Office optional | Criterion AC-C8-01 passes even if the client PDF/Word file is produced outside EOS |
| AC-C9-01 | Trace to origin | Booking/win traces to originating opportunity and RFP |
| AC-C9-02 | Commercial dimensions | Market, buyer type, SOURCE, value, win date, owner are available on the won record |
| AC-C9-03 | Account | Client/account on the booking is the same commercial account as the opportunity |
| AC-C10-01 | Funnel from structure | Counts of RFPs, qualified RFPs, sent proposals, bookings, and conversion are produced from the records above — not from stage name `new_qualified` alone |
| AC-C10-02 | Speed from stamps | Response/turnaround is calculable only using AC-T stamps; missing stamps are reported as not measurable, not invented |
| AC-C10-03 | Dimensions | Funnel, loss, and acquisition views can be filtered by SOURCE, CHANNEL, Market, buyer type |
| AC-C10-04 | Not booking-only | A booking command-center rollup **alone** does not satisfy C10 |

### F.3 Traceability to H-17

| H-17 | Satisfied by |
| --- | --- |
| BR-001 / PR-009 / AC-002 | D2 / AC-Q / AC-C2-* |
| BR-002 / PR-006 / AC-005 | D9 / D10 / AC-C9-* / AC-C10-01 |
| BR-003 / AC-006 | D3 / AC-T |
| BR-004 / AC-003 / AC-004 | D2–D3 / AC-F |
| BR-005 / AC-010 | D1 (OR-03 + repeat from history; DR-008 still deferred) |
| BR-006 / AC-007 | D2 loss / AC-L |
| BR-007 / AC-008 | D1 SOURCE/CHANNEL/Market |
| BR-008 / AC-012 | This package still **NOT AUTHORIZED** for implementation |
| BR-009 | OR-04 unchanged |
| PR-001–PR-008 / CR-013–CR-025 / CR-S01–CR-S04 | D3–D8 |
| KR-* / AC-009 | D10 — categories only |

---

## G. Non-goals / exclusions

Do **not** implement under this package (unless separately authorized later):

* C11+ capabilities  
* Numerical commercial targets (OR-04)  
* Numerical margin floor **value** unless separately authorized via Commercial Parameter Register  
* Numerical qualification thresholds  
* Predictive lead scoring  
* AI-generated qualification  
* Automated supplier procurement  
* Production deployment  
* Automatic migration of Office history  
* Forced replacement of email / WhatsApp / phone  
* Unrelated EOS redesign  
* Digital advertising implementation  
* LinkedIn automation  
* SEO implementation  
* Instagram automation  
* Treating Domain J analytics as the C10 KPI pack  
* Treating C10 command center as commercial KPI completion  
* Preserving 250k / 20% as the Owner approval rule  
* Inventing FX providers  
* Creating a `pco` seed key as a **coding** act under this governance file  
* Accounting/invoice product (I8) as part of C1–C10  
* UAT / Production data / live customer records

---

## H. Implementation-readiness gate

This document **defines** the gate. It does **not** pass the gate. It is **not** implementation authorization.

Future implementation authorization requires **all** of:

1. This remediation-requirements package **approved** by the authorized commercial decision-maker.  
2. All affected C1–C10 requirements remain traceable to H-17 / H-25 / H-27 / this file.  
3. Acceptance criteria in §F remain measurable.  
4. Data ownership is accepted: EOS owns §C.A; Office owns presentation; channels own communication.  
5. Source-of-truth boundaries in §C are accepted.  
6. Commercial approval parameters are **resolved or formally deferred** (register values remain deferred unless management approves them).  
7. Office/EOS operating model in §C.D is accepted.  
8. **Migration policy is explicitly decided before any migration** (default in this pack: **no** automatic Office-history migration).  
9. Test strategy defined (Dev/Test disposable data; no production data).  
10. UAT criteria defined (separate from this pack; UAT **not** authorized now).  
11. Rollback strategy defined where a future increment would change stored commercial facts.  
12. Security/privacy implications reviewed (existing E1/privacy governance remains separately binding).  
13. Production architecture remains **separately governed** (E1 / E1-C / E1-D unchanged by this pack).  
14. Implementation authorization **explicitly granted** in a later governance decision.

```text
GPTA-H-29 = REQUIREMENTS PACKAGE
GPTA-H-29 ≠ IMPLEMENTATION AUTHORIZATION
GATE H ITEMS 1–14 = NOT SATISFIED BY THE EXISTENCE OF THIS FILE ALONE
```

---

## I. Open governance dependencies

### I.1 Business-rule dependencies

| Item | Status |
| --- | --- |
| OR-01–OR-03, PCO, Market≠Buyer, OR-04-FU, OR-05–OR-08 | **Closed** (H-25) |
| SOURCE multiplicity / CHANNEL intake | **Closed** (H-27) |
| Contributing loss catalogue | **Closed** — same LR-01–LR-12 (H-27) |
| Market 15-value list | **Closed** (H-27) |
| DR-008 account flags (target / strategic / repeat / direct / agency) vs OR-03 | **Still deferred** (H-27). Repeat **reportability via prior booking** is required in D1 without closing DR-008 |
| How Commercial Director “visibility” is operationalized (queue vs notification vs access) | **Process detail open**; requirement is visibility, not a named mechanism |
| This H-29 package **Owner approval** | **Open** — required by Gate H item 1 |

### I.2 Commercial-parameter dependencies

| Item | Status |
| --- | --- |
| OR-04 numerical targets | **Closed as unauthorized:** `NO NUMERICAL TARGET AUTHORIZED` |
| Commercial margin floor **value** | **Not authorized**; placeholder register only |
| Discount / credit / size / liability parameter **values** | **Not authorized** |
| Ordinary “in-parameter” determination in production | Depends on register values **or** remains a documented professional judgement against the eight H-27 categories until values exist |

### I.3 Technical dependencies

| Item | Status |
| --- | --- |
| C1–C10 modification | **NOT AUTHORIZED** |
| Schema / migrations | **NOT AUTHORIZED** |
| Mapping `RfpRecord.source` vs SOURCE/CHANNEL | Requirements conflict with current combined meaning — **remediation requirement only** |
| Dual-path PostgreSQL vs in-memory preview | H-28 used in-memory only; durable SoR testing is **not** this pack |
| Test strategy / rollback artefacts | **Not produced** (Gate H 9–11) |

### I.4 Production-governance dependencies

| Item | Status |
| --- | --- |
| E1 / architecture / provider / geography | **Unselected**; E1 **NOT APPROVED / BLOCKED** |
| E1-C | **CONTROLLED PAUSE** |
| E1-D | **FORMALLY PARKED / DEFERRED** |
| GPTA-H-01 Path B | **HOLD** |
| NA-A-22 | **OPEN** |
| UAT / Production / procurement / spend | **NOT AUTHORIZED** |
| Live operational SoR today | **Office** (H-19 / H-28) |

---

## J. Final status

Requirements for C1–C10 remediation and the Office-vs-EOS source-of-truth model are **defined** from H-25/H-27 rules and H-28 evidence. Remaining opens are **approvals, parameter values, and production governance**, not missing Stage 1 commercial-rule text.

```text
GPTA-H-29 STATUS = C1–C10 REMEDIATION REQUIREMENTS DEFINED — IMPLEMENTATION READINESS PACKAGE COMPLETE

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
C1–C10 DEVELOPMENT = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
OR-04 = NO NUMERICAL TARGET AUTHORIZED
COMMERCIAL FLOOR VALUE = NOT AUTHORIZED
NA-A-22 = OPEN

NEXT ACTION = OWNER / GOVERNANCE APPROVAL OF H-29 SOURCE-OF-TRUTH AND REMEDIATION REQUIREMENTS — NO IMPLEMENTATION
```

Approval of this package, if later given, still **does not** itself authorize coding. Gate H item 14 remains a separate decision.
