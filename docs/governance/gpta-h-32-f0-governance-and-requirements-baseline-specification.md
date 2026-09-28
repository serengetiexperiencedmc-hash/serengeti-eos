# GPTA-H-32 — F0 Governance and Requirements Baseline Specification

> **`GOVERNANCE-ONLY — F0 SPECIFICATION`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NOT F1 DESIGN COMPLETE`** · **`NOT F2`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T14:22:00+03:00**.  
**HEAD at specification:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Lifecycle meaning:** GPTA-H-31 Decision 4 F0 = **governance and requirements baseline**. This file **specifies** that baseline. It is **not** F0 review/acceptance, **not** F1 design, and **not** F2 implementation.

H-16–H-31 historical bodies are **not rewritten**.

Standalone files **not found** (content lives inside H-19, not invented here):

* `docs/governance/gpta-h-20-*.md` — **does not exist** as a separate file. GPTA-H-20 is an overlay/section inside [`gpta-h-19-owner-business-rules-resolution.md`](gpta-h-19-owner-business-rules-resolution.md).  
* `docs/governance/gpta-h-21-*.md` — **does not exist** as a separate file. GPTA-H-21 Owner Decision Sheet is inside H-19.  
* `docs/governance/gpta-h-22-*.md` — **does not exist** as a separate file. GPTA-H-22 capture is inside H-19.  

H-23 and H-24 **do** exist as standalone files. H-25 superseded them as the authorized business-rule baseline.

```text
F0 APPROVAL / SPECIFICATION ≠ F2 IMPLEMENTATION AUTHORIZATION
```

---

## 1. Governance status

| Item | Status |
| --- | --- |
| Commercial objective | **APPROVED / FROZEN** (H-16) |
| Stage 1 | **APPROVED / FROZEN** (H-16) |
| H-29 requirements | **APPROVED** (H-31 Decision 1) |
| Source-of-truth model | **APPROVED** (H-31 Decision 2) |
| Scope | **C1–C10 ONLY** (H-31 Decision 3) |
| Lifecycle | **F0 → F6 APPROVED** (H-31 Decision 4 — governance lifecycle) |
| F0 | **SPECIFIED** by this file — **not yet reviewed/accepted** |
| F1 | **NOT STARTED / PENDING F0 REVIEW** |
| F2–F6 | **NOT STARTED** |
| Implementation | **NOT AUTHORIZED** (H-31 Decision 5) |
| Implementation readiness | **NO** |
| Commit | **NOT AUTHORIZED** |
| Push | **NOT AUTHORIZED** |
| Production deployment | **NOT AUTHORIZED** |
| Production migration | **NOT AUTHORIZED** |
| Procurement | **NOT AUTHORIZED** |
| External supplier engagement | **NOT AUTHORIZED** |
| OR-04 | `NO NUMERICAL TARGET AUTHORIZED` |
| Commercial floor **value** | **NOT AUTHORIZED** |
| DR-008 | **DEFERRED** |
| NA-A-22 | **OPEN** |
| E1 | **NOT APPROVED / BLOCKED**; architecture/provider/geography **unselected** |
| E1-C | **CONTROLLED PAUSE** |
| E1-D | **FORMALLY PARKED / DEFERRED** |
| GPTA-H-01 Path B | **HOLD** |
| Application `NEXT_INCREMENT` | **NONE_AUTHORIZED** |

This F0 specification does **not** authorize F1 to become coding, and does **not** authorize F2 implementation.

H-31 F0–F6 remains a **governance lifecycle**. It does **not** adopt H-30 §H technical-slice labels (identity → KPI) as the approved sequence.

---

## 2. Approved commercial objective

**Name (H-16):** Commercial Growth & Sales Effectiveness.

**Frozen wording (H-16, used here without amendment):**

> Improve commercial growth and sales effectiveness by increasing qualified MICE RFPs, improving RFP-to-booking conversion and response speed, expanding priority markets, and establishing a measurable commercial operating process.

**Primary problem (H-16; inseparable for first-phase attention):**

* Insufficient qualified RFPs  
* Poor RFP-to-booking conversion  

**Secondary concerns** (preserved; **not** independently ranked or measured here; **no** invented baselines):

* South African market penetration  
* European business development  
* Response speed  
* Revenue  
* Strategic accounts  
* Profitability  

**First market/buyer (H-16, not a taxonomy value, not a target):** South African incentive agencies. Subsequent candidates (not excluded, not simultaneous): European MICE agencies; US incentive houses; corporate event planners; PCOs.

**Primary outcome (H-16):** Increase qualified RFPs and improve RFP-to-booking conversion.

Unaudited Owner estimates from H-14 (~25 RFPs / ~3 bookings / indicative ~12%) remain **unaudited historical estimates**, not authorized targets (OR-04).

---

## 3. Approved scope boundary

**Current programme:** **C1–C10 ONLY** (H-31 Decision 3).

### 3.1 In scope (requirements / future authorized work — not coding now)

C1 CRM · C2 Opportunity/qualification · C3 RFP/clarification/follow-up · C4 Supplier rates · C5 Programme · C6 Costing · C7 Commercial approval · C8 Proposal · C9 Booking · C10 commercial KPI pack (process/reporting facts — **not** C11+ / Domain J as a substitute).

### 3.2 Out of current implementation scope

* C11+ development  
* Unapproved ERP expansion  
* Broad marketing automation  
* Production infrastructure implementation  
* Procurement  
* Production deployment  
* Migration execution  
* Advertising expenditure  
* Website or social-media **implementation** under this governance task  

### 3.3 Commercial programmes that are **not** application authorization

LinkedIn, SEO/website, Google Ads, Instagram, South African market development, and broader international MICE development remain **commercial programmes and requirements** (H-16 groups F/G; H-31 Decision 3). They do **not** authorize application implementation, spend, website change, automation, or campaign execution.

I8 invoices / statutory finance / Domain J analytics modules remain **outside** the C1–C10 remediation programme unless a later governance decision expands scope.

---

## 4. Source-of-truth baseline

Approved model: H-31 Decision 2 / H-29 §C.

### 4.1 EOS — structured commercial system of record (future)

Owns structured commercial facts, including:

* Accounts  
* Markets  
* Buyer/account types  
* Qualification  
* SOURCE and CHANNEL  
* Ownership and follow-up  
* Next actions  
* RFP, programme, costing, approval, proposal, and booking identities  
* Supplier-rate snapshots  
* Loss reasons  
* KPI facts  

### 4.2 Office — document production

Remains the document-production environment for programmes, itineraries, financial proposals, and other client-facing documents.

Structured commercial facts and workflow status **must not** depend exclusively on disconnected Office files **after** a later authorized increment is accepted. **Today**, Office remains the **live** operating method (H-19 / H-28). This F0 baseline records that distinction; it does **not** execute cutover.

### 4.3 Communication channels

Email, WhatsApp, and phone remain communication channels. They are **not** SOURCE attribution and **not** structured commercial ownership.

### 4.4 Distinctions that must be preserved

| Distinction | Meaning |
| --- | --- |
| SOURCE ≠ CHANNEL | Origin vs intake mechanism (H-27) |
| Market ≠ buyer/account type | Geography vs organisation model (H-25 / H-27) |
| Proposal-send authority ≠ commercial approval authority | OR-05 ≠ OR-06 |
| Pipeline stage ≠ qualification decision | `new_qualified` is a **stage**, not OR-01 |
| Dev/Test existence ≠ operational fitness | H-28 / H-31 Decision 1 condition 5 |

---

## 5. C1–C10 baseline register

Evidence: H-28 live validation (in-memory preview demo seed) + H-29 retain/remediate/absent. **No capability is operationally ready.** Existing C1–C10 requires requirements-aligned change and/or further live validation before reuse as the commercial SoR.

| Cap | Approved business purpose | Current Dev/Test evidence (H-28) | Observed limitations (H-28) | H-29 remediation direction | Live operational status | Required F0 clarification | Later implementation authorization required? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **C1 CRM** | Account identity; OR-03 including PCO; Market; SOURCE/CHANNEL; owner; account–opportunity link; repeat identifiable | 3 orgs/accounts; 13 org types; owner on account | No PCO type; Market unset / ≠ 15-value list; no SOURCE/CHANNEL pair; tasks not RFP-bound | Remediate taxonomy/dimensions; retain identity/owner | **Not used live** | DR-008 flags remain deferred; repeat-from-history is the F0 path for KR-C04 | **Yes** before any C1 change |
| **C2 Opportunity** | Pipeline stages; owner; value when available; **qualification distinct from stage**; loss reasons | 3 opportunities; stages including `new_qualified` labelled “New / Qualified” | Stage ≠ OR-01; no qualification object; no LR catalogue | Keep `new_qualified` as stage; add OR-01 + OR-02 | Demo seed only | Qualification version **label** (H-26 DR-002) remains a design detail, not a new Owner rule | **Yes** |
| **C3 RFP** | RFP identity; received stamp; clarification distinct; follow-up bound to RFP/opp | `RFP-2026-0847`; `receivedAt`; closed workflow | No clarification stamps; `source` absent/combined as intake; 0 CRM tasks | Clarification start/complete or N/A; SOURCE≠CHANNEL; next action | Office/email is SoR | Existing `RfpRecord.source` comment conflicts with SOURCE≠CHANNEL — F1 must not treat it as AC-S | **Yes** |
| **C4 Rates** | Supplier rates with type, validity, season, currency, verification, snapshot | 5 suppliers; season/validity/currency fields | Expired still `active`; H-25 types not observed; no verification date; overlap not resolved | OR-08 + H-27 §10; expired not silently current | Unused live as commercial SoR | FX **provider** remains unselected; only basis/date identity is required | **Yes** |
| **C5 Programme** | Commercial programme identity linked to RFP; dates/group/items/suppliers | `PRG-2026-0847`; items with supplierId | Title vs dayCount inconsistency; not Office equivalent | EOS holds structured programme facts; Office may present | **Office itinerary SoR** | Document generation **not** required | **Yes** |
| **C6 Costing** | Reconstruct “why it cost that when sent” | `CST-2026-0847`; totals/margin/versions | No `supplierRateId` on observed lines; 20% floor is an **app artifact**, not an Owner value | Snapshot + rate version; **no** invented margin target | Unused live | Do not preserve 20% as OR-04/OR-06 value | **Yes** |
| **C7 Approval** | H-27 risk categories; send ≠ approval; in-parameter path | `APR-2026-0847`; requester ≠ decider; `sell_threshold` 250,000 USD | Numerical gate ≠ H-27 matrix | Categories 1–8; no invented floor | Unused live | Floor **value** deferred; in-parameter = professional judgement against 8 categories **until** register values exist **and only if** a later increment decision waives values | **Yes** |
| **C8 Proposal** | Identity, version, sender, send time, costing/approval/RFP links, commercial snapshot | `PROP-2026-0847`; `sentAt`; versions | Sender vs creator indistinct; snapshot incomplete | Retain identity/send; complete snapshot; Office may remain PDF/Word | **Office proposal SoR** | Document automation **not** required | **Yes** |
| **C9 Booking** | Win linked to origin; Market/type/SOURCE/value/date/owner persist | `BKG-2026-0847`; FKs; `sellPrice`; `confirmedAt` | Dimensions not on booking | Persist dimensions at win | Demo only | No real bookings in F0–F4 test data policy | **Yes** |
| **C10 KPI** | H-17 categories from structured facts (no targets) | Command center = booking rollup; Domain J summary ≠ pack | Pack **not demonstrated** | Funnel/speed/pipeline/loss/commercial/acquisition from records | Not a KPI pack | C10 ≠ Domain J ≠ C11+ | **Yes** (reporting within C1–C10; **not** C11+) |

**Identity chain to retain (not discard):**  
`OPP-2026-GLOB` → `RFP-2026-0847` → `PRG-2026-0847` → `CST-2026-0847` → `APR-2026-0847` → `PROP-2026-0847` → `BKG-2026-0847`

---

## 6. Business-rule baseline

Source: H-25 (authorized) and H-27 (targeted closures). **No numerical floors or targets invented.**

### 6.1 OR-01 — Qualified RFP

A Qualified RFP is a genuine commercial opportunity that fits SEDMC target customer and destination/service capabilities; has a sufficiently defined programme requirement; has a credible buying process and decision timeframe; and contains enough verified information to invest proposal/costing resources. **Budget is not mandatory.**

**Mandatory conditions** (sufficient, not perfect): buyer/account fit; genuine requirement; destination/service fit; approximate dates or credible decision window; sufficient programme scope; approximate group size or participant profile; buying process known or actively being established; commercial viability credible; defined next action.

**Authority:** assigned Sales & Business Development opportunity owner may qualify. Commercial Director retains oversight and may approve exceptions or strategic reclassification.

**Timing:** after initial RFP review and clarification; **before** significant proposal/costing resource commitment.

**Evidence (where available):** original RFP/enquiry; correspondence; clarification responses; buyer/account information; dates/group/programme; buying process/timeline; next action.

**Changes:** owner may update; material/strategic reclassification visible to Commercial Director.

`new_qualified` **remains a pipeline stage**. It is **not** OR-01.

### 6.2 OR-02 — Loss taxonomy

Exactly **one** primary reason at closed-lost. Zero or more contributing reasons from the **same** catalogue (H-27). LR-12 Other **requires explanation**. Owner records; commercial management may reclassify. Change after finalization only with new evidence; **auditable**.

| Code | Reason |
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

### 6.3 OR-03 — Account classification

1. Incentive House / Incentive Agency  
2. Event Agency  
3. **PCO** (distinct)  
4. Corporate / End Client  
5. Corporate Travel Company / TMC  
6. Travel Agency / Travel Advisor  
7. Tour Operator / Wholesale Partner  
8. Destination / Event Specialist  
9. Association / Non-Profit  
10. Government / Public Sector  
11. Other Strategic Partner  

### 6.4 Market vs buyer

**Separate.** Market = geographic origin. Buyer/account type = OR-03.

**H-27 controlled initial Market list (15):** South Africa; United Kingdom; Germany; France; Switzerland; Netherlands; Italy; Spain; Rest of Europe; United States; Canada; Middle East; Latin America; Asia-Pacific; Other.

New Market values require **controlled governance**, not ad hoc creation. **No application values are created in F0.**

### 6.5 OR-04-FU — Follow-up ownership

Opportunity owner owns follow-up from qualification through close. Transfer permitted when reassigned, owner unavailable, Commercial Director reallocates, or specialist expertise required. Transfer must identify **new owner and next action**. Commercial Director is the escalation point for overdue/strategic/sensitive items.

### 6.6 OR-05 / OR-06 — Send vs approval

**Send:** assigned opportunity owner may send **after** required internal approval/review.

**Approval mandatory** if any of: exceptional discounting; margin below the **currently approved** commercial floor *(value not set)*; unusual payment/credit terms; non-standard cancellation/liability; significant contractual commitments; strategic/high-risk accounts; unusually large/complex programmes; deviations from approved supplier/commercial policy.

Ordinary in-parameter proposals do **not** require unnecessary executive approval.

```text
OR-04 = NO NUMERICAL TARGET AUTHORIZED
COMMERCIAL FLOOR VALUE = NOT AUTHORIZED
H-28 250k / 20% GATE = NOT THE APPROVED RULE
```

Observed application thresholds are **not** Owner parameters.

### 6.7 OR-07 — SOURCE and CHANNEL

**SOURCE catalogue:** Existing Client / Repeat Business; Existing Partner / Agency Relationship; Referral; Trade Show / Industry Event; Sales Prospecting; Website / Organic; LinkedIn; Google Ads / Paid Search; Other Digital Marketing; Consortium / Industry Network; Corporate Direct; Other.

**CHANNEL catalogue:** Email; Website / Web Form; LinkedIn; Phone; WhatsApp; Trade Show / In-person; Referral Introduction; Partner Introduction; Other.

H-27: **one primary SOURCE required**; **zero to two** secondary SOURCES from the same catalogue; CHANNEL = **initial intake**; SOURCE change auditable (who, when, previous, new, reason; previous not erased).

### 6.8 OR-08 — Supplier rates

**Source priority:** direct contract; supplier-issued contracted sheet; written quotation; trade/net agreement; public as benchmark unless explicitly approved for sale.

**Types:** Negotiated/Contracted; Trade/Net; Public; Promotional; Quoted/Ad hoc.

**Must have:** applicability/season (may differ by supplier); effective-from; effective-to; original supplier currency preserved; verification date/state; version not overwritten so as to destroy reconstruction; expired not silently current; overlapping validities identifiable and resolved before live-proposal use; proposal snapshot sufficient to reconstruct commercial basis; FX **basis/date** identified if converted — **no FX provider selected**.

Ownership: Commercial/Operations supplier-management maintains rates; Sales flags discrepancies.

---

## 7. Outstanding dependencies and unresolved design details

**Do not resolve by assumption.** Closed **business rules** are listed as closed; remaining work is design, parameter **values**, or production governance.

| ID | Description | Current status | Decision-maker / function | Blocks F1 specification? | Blocks implementation authorization (F2)? | Required evidence or decision |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-01 | Commercial Parameter Register **values** (margin floor, discount, credit, size, liability) | **NOT AUTHORIZED** (placeholder only) | Management / Owner | **No**, if F1 designs against the eight H-27 **categories** and records value-deferral | **Yes**, unless the authorizing decision explicitly waives values for that increment | Written waiver **or** authorized values |
| DEP-02 | Approval thresholds as **numbers** | Same as DEP-01; 250k/20% **rejected** as Owner rule | Owner | **No** (categories exist) | Same as DEP-01 | Same |
| DEP-03 | Non-numerical risk-parameter operationalisation (what counts as “exceptional”, “unusual”, “significant”) | Categories **closed**; judgement criteria **not** enumerated | Commercial Director | **Should** be addressed in F1 as process guidance, not invented numbers | **Yes** if F2 would encode unapproved numeric proxies | F1 process notes; no invented floors |
| DEP-04 | Contributing-loss **handling** (storage/UI) | **Rule closed** (same LR catalogue, 0+ contributing) | F1 design | **No** for rules | **Yes** if F2 ships without representing the closed rule | F1 spec maps AC-L |
| DEP-05 | SOURCE multiplicity / primary-source **audit representation** | **Rule closed** (H-27); record shape **not** designed | F1 design | **No** for rules | **Yes** if F2 cannot evidence AC-C1-04/06 | F1 spec |
| DEP-06 | Final Market-list **change-control procedure** | 15 values **closed**; add-path = controlled governance, procedure not written | Owner / governance | **No** for using the 15 | **No** for F2 using the 15 | Procedure only when adding a 16th value |
| DEP-07 | C3 clarification timestamps (start/complete/N/A) | **Requirement closed**; **not implemented**; H-28 absent | F1 design | **No** | **Yes** for any increment claiming AC-T | F1 + later tests |
| DEP-08 | C1 task-to-RFP/opportunity binding | **Requirement closed**; tasks not bound (H-28) | F1 design | **No** | **Yes** for AC-F | F1 spec |
| DEP-09 | Follow-up / reassignment audit details | Rule closed (OR-04-FU); mechanism open (queue vs notice) | Commercial Director + F1 | Visibility required; **mechanism** should be chosen in F1 | **Yes** for AC-C3-06 | F1 names the mechanism without inventing a product |
| DEP-10 | Supplier-rate overlap/conflict handling | Requirement: identifiable + resolved before live use; `preferredInConflict` exists in structure only | F1 design | **No** | **Yes** for AC-C4-03 | F1 spec; no silent current-rate |
| DEP-11 | FX identity / conversion rules | Preserve original currency; identify basis/date; **provider unselected** | F1 (identity only); provider = E1/finance later | **No** if F1 records identity-only | **Yes** if F2 selects an FX provider | Do **not** select provider in F1 |
| DEP-12 | Migration approach | H-29 default: **no** automatic Office-history migration; Owner not restated as a numbered H-31 decision | Owner | F1 must assume **no** historic Office ingest unless Owner decides otherwise | **Yes** before any migration | Explicit Owner migration decision before execute |
| DEP-13 | Test and rollback evidence artefacts | Required by H-29 Gate H / H-30; **not produced** | Technical owner **after** implementation authorization | F1 must **define** the strategy | **Yes** before F2 complete / F3 | Test plan + rollback note in F1; execution after F2 auth |
| DEP-14 | UAT ownership and acceptance evidence | Not named (H-30 TU-05) | Owner | F1 should propose; Owner names authority | **Yes** for F5; F2 Dev/Test may proceed only if authorizing decision says UAT not required for that increment | Named UAT authority |
| DEP-15 | DR-008 target/strategic/repeat/direct/agency **flags** | **DEFERRED** | Owner | **No** for H-29 D1 (OR-03 + repeat-from-history) | **Yes** only if the increment claims full AC-010 flags | Do **not** close DR-008 in F0 |
| DEP-16 | Qualification definition **version label** (H-26 DR-002) | Design detail | F1 | **No** | **No** if OR-01 text is used as the definition | Optional label in F1; do not invent a new OR-01 |
| DEP-17 | E1 production architecture / hosting / geography | **Unselected / BLOCKED** | E1 Owner | **No** for F1 paper design of commercial C1–C10 | **Yes for Production / F6 deploy**; not a substitute for H-31 Decision 5 | Separate E1 track |
| DEP-18 | E1-C | **CONTROLLED PAUSE** | E1-C governance | **No** for F0/F1 paper | **Yes** for Production | Unchanged |
| DEP-19 | E1-D | **FORMALLY PARKED** | E1-D governance | **No** for F0/F1 paper | **Yes** if unparking claimed | Do not unpark |
| DEP-20 | NA-A-22 independent validator | **OPEN** | Owner appointment | **No** for F0/F1 | **Yes** for claiming Production Ready | Unchanged |
| DEP-21 | Path B / GPTA-H-01 | **HOLD** | Owner | **No** | **Yes** if Path B work is mixed into C1–C10 | Keep separate |
| DEP-22 | Dual-path / durable store beyond H-28 in-memory | H-28 limitation | Technical | F1 must not assume in-memory = Production SoR | **Yes** if F2 persists commercial facts | Named Dev/Test store in F1 |
| DEP-23 | F0 **review/acceptance** of this specification | **NOT DONE** | Owner / Commercial Director | **Yes** — F1 pending F0 review | **Yes** | Next action |

---

## 8. F0 acceptance criteria

Governance-level criteria. **Specified** in this file. **F0 review acceptance is not recorded.** Status below is evidence against this specification only.

| ID | Criterion | Evidence method | Status |
| --- | --- | --- | --- |
| F0-AC-01 | Approved requirements traceable to H-16–H-31 | Sections 2–6 cite H-n | **MET BY THIS SPECIFICATION** — not a substitute for F0 review |
| F0-AC-02 | C1–C10 scope explicit | §3 and §5 | **MET BY THIS SPECIFICATION** |
| F0-AC-03 | No C11+ scope introduced | §3.2; C10 ≠ Domain J | **MET BY THIS SPECIFICATION** |
| F0-AC-04 | Business rules recorded without invented numerical values | §6; OR-04 / floor restated unauthorized | **MET BY THIS SPECIFICATION** |
| F0-AC-05 | Source-of-truth boundaries explicit | §4 | **MET BY THIS SPECIFICATION** |
| F0-AC-06 | Existing capability not treated as operationally fit | §5 “no capability operationally ready” | **MET BY THIS SPECIFICATION** |
| F0-AC-07 | Dependencies listed with status and ownership | §7 | **MET BY THIS SPECIFICATION** |
| F0-AC-08 | Implementation, commit, push, production remain unauthorized | §1; H-31 Decision 5 | **MET BY THIS SPECIFICATION** |
| F0-AC-09 | No application, schema, migration, data, or infrastructure changes in this task | Repository check at close of this task | **TO BE CONFIRMED IN TASK VALIDATION** |
| F0-AC-10 | F1 cannot begin as **implementation** without separate authorization and readiness evidence | §9; H-31 F1 “do not implement” | **MET AS A GOVERNANCE RULE** — F1 not started |
| F0-AC-11 | F0 baseline **reviewed** by Owner / Commercial Director | Review record | **NOT MET** — next action |

F0-AC-01–08 and F0-AC-10 being met **by specification** does **not** mean F0 is accepted, implementation-ready, or F1-started.

---

## 9. F1 entry conditions

**F1** (H-31) is a **future specification/design stage**, not implementation. **Do not implement during F1.**

**None of the following is claimed as already met** except where F0 specification exists and still awaits review.

| # | Minimum condition before F1 can be **accepted** as complete | Current |
| --- | --- | --- |
| 1 | F0 baseline **review** (this file reviewed; exceptions recorded) | **Not started** |
| 2 | Requirements traceability confirmed in the review | Specified here; **not reviewed** |
| 3 | Approved unresolved-parameter treatment (DEP-01/02 waiver or values) recorded for the intended later increment | **Not recorded** for an increment |
| 4 | Explicit design scope (which C1–C10 ACs F1 will specify; DR-008 remains deferred unless Owner says otherwise) | **Not written** |
| 5 | Security and auditability considerations specified (no Production IAM invented; no mailbox ingest) | **Not written** |
| 6 | Migration and rollback **strategy** written (default: no Office-history ingest) | **Not written** |
| 7 | Test strategy written (disposable Dev/Test; H-29 ACs; identity-chain regression) | **Not written** |
| 8 | UAT strategy written (or Owner records UAT not required for a later Dev/Test-only F2) | **Not written** |
| 9 | Operational ownership named for the design (commercial vs technical) | Commercial roles exist in H-25; technical increment owner **not named** |
| 10 | Separate **implementation** authorization remains **absent** unless a later Decision 5-class grant is recorded | **Absent** (H-31 Decision 5) |

F1, even if later completed, **does not** authorize F2.

---

## 10. Governance status (final)

```text
GPTA-H-32 STATUS = F0 GOVERNANCE AND REQUIREMENTS BASELINE SPECIFIED — IMPLEMENTATION NOT AUTHORIZED

F0 = SPECIFIED
F1 = NOT STARTED / PENDING F0 REVIEW
IMPLEMENTATION READINESS = NO
IMPLEMENTATION AUTHORIZED = NO
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
H-29 = APPROVED
SoR = APPROVED
SCOPE = C1–C10 ONLY
LIFECYCLE = F0 → F6 APPROVED (governance sequence)

NEXT ACTION = F0 BASELINE REVIEW — SPECIFICATION AND GOVERNANCE REVIEW ONLY
```
