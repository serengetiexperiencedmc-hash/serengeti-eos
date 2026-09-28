# GPTA-H-26 — Business Requirements Closure and Implementation-Readiness Assessment

> **`GOVERNANCE-ONLY — REQUIREMENTS CLOSURE / READINESS ASSESSMENT`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NOT IMPLEMENTATION APPROVED`**  
> **`NOT IMPLEMENTATION READY FOR PRODUCTION`**  
> **`NO APPLICATION STATE CHANGE`**  
> **`NO C1–C10 MODIFY`** · **`NO C11+`** · **`NO UAT`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:22:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Requirements authority:** [`gpta-h-17-stage-1-business-requirements-and-acceptance-criteria.md`](gpta-h-17-stage-1-business-requirements-and-acceptance-criteria.md).  
**Authorized business rules:** [`gpta-h-25-authorized-commercial-business-rules.md`](gpta-h-25-authorized-commercial-business-rules.md).  
**Capability inventory:** [`gpta-h-18-c1-c10-capability-gap-analysis.md`](gpta-h-18-c1-c10-capability-gap-analysis.md) (not repeated in full).  
**Process walkthrough:** [`gpta-h-19-owner-business-rules-resolution.md`](gpta-h-19-owner-business-rules-resolution.md) Part B.

GPTA-H-16–H-25 **not rewritten**.

```text
IMPLEMENTATION = NOT AUTHORIZED
```

This stage determines whether Stage 1 requirements are **sufficiently defined to move toward implementation planning**. It does **not** authorize implementation planning as a build grant, and it does **not** approve Production.

---

## 0. Status vocabulary

These categories are **not** equivalent:

| Code | Meaning |
| --- | --- |
| A | **REQUIREMENT CLOSED** — business rule text is Owner-approved and internally consistent |
| B | **ACCEPTANCE CRITERION CLOSED** — the test of fitness is precise enough to judge later |
| C | **DESIGN DETAIL STILL REQUIRED** — UI/data/process detail, not an Owner contradiction |
| D | **BASELINE / MEASUREMENT STILL REQUIRED** — method or live count not yet established |
| E | **C1–C10 CAPABILITY VALIDATION REQUIRED** — Dev/Test structure exists or is partial; live/process fit unknown |
| F | **OWNER DECISION REQUIRED** — no authorized rule yet |
| G | **IMPLEMENTATION BLOCKED** — no development, schema, or C1–C10 change is authorized |

**Matrix Status values (only these):** `CLOSED` · `ACCEPTANCE CRITERION REQUIRES DETAIL` · `DESIGN DETAIL REQUIRED` · `BASELINE REQUIRED` · `LIVE VALIDATION REQUIRED` · `C1–C10 CAPABILITY GAP` · `OWNER DECISION REQUIRED` · `IMPLEMENTATION BLOCKED`

Every requirement remains **G. IMPLEMENTATION BLOCKED** until a later governance decision. The matrix Status column records the **tightest remaining closure gap** (not the implementation block, which is global).

---

## 1. Readiness decision (summary)

**B. REQUIREMENTS PARTIALLY CLOSED**

Core commercial business rules (OR-01–OR-03, OR-03-PCO, OR-03-M, OR-04-FU, OR-05–OR-08) are **Owner-approved**. OR-04 numerical targets remain `NO NUMERICAL TARGET AUTHORIZED`.

Material **design, baseline, acceptance-precision, and C1–C10 live-validation** gaps remain. This is **not** C. REQUIREMENTS NOT READY (Owner-rule ambiguity is no longer the primary block). This is **not** A. REQUIREMENTS CLOSED.

```text
GPTA-H-26 STATUS = BUSINESS REQUIREMENTS PARTIALLY CLOSED — TARGETED CLOSURE REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
```

---

## 2. OR-01 — Qualified RFP

| Item | Precise enough as business rule? | Remaining |
| --- | --- | --- |
| Definition (OR-01-A) | **Yes** — A | Budget **not** mandatory; do **not** convert to a mandatory budget field |
| Mandatory conditions (OR-01-B) | **Yes** — “sufficiently established”; perfect information not required | What “sufficient” looks like in a record/UI = **C** |
| Authority (OR-01-C) | **Yes** — opportunity owner; Commercial Director oversight | Assignment of owner = **C** |
| Timing (OR-01-D) | **Yes** — after review/clarification; before significant costing | Stamp set = **C** / **E** |
| Evidence (OR-01-E) | **Yes** — “where available” | Which artefacts are stored vs referenced = **C** |
| Changes (OR-01-F) | **Yes** — owner may update; material/strategic visible to CD | Visibility mechanism = **C** |

`C2 new_qualified` remains a technical stage. **Not** equated with OR-01.

**AC-002:** definition exists; **consistent application** is unproven live → **B not closed** (`LIVE VALIDATION REQUIRED`).

---

## 3. OR-02 — Loss reasons

Captured as required:

* exactly one **primary** loss reason;  
* optional contributing reasons;  
* controlled primary catalogue LR-01–LR-12;  
* OTHER (LR-12) permitted;  
* OTHER explanation mandatory;  
* opportunity owner records; commercial management may reclassify;  
* final at **closed-lost**;  
* later change only with new evidence and **auditability**.

```text
CONTRIBUTING-LOSS CATALOGUE = DESIGN DETAIL STILL REQUIRED
```

No contributing catalogue is invented. Destination rejection is covered by **LR-07** (Programme / Scope / Destination Fit) unless later separately authorized.

---

## 4. OR-03 / PCO / Market

Confirmed:

* Account Type **separate** from Market (OR-03-M = YES).  
* PCO is a **distinct** Account Type (OR-03-PCO = YES; list item 3).  
* Approved account-type list recorded in H-25.  
* Stage 1 first market/buyer remains **South African incentive agencies**.  
* That phrase is **not** an account taxonomy value.

```text
BUSINESS RULE = MARKET AND BUYER/ACCOUNT TYPE ARE SEPARATE
DESIGN DETAIL = FINAL CONTROLLED MARKET VALUE LIST
```

The H-25 market list is **“may include”**. It is **not** silently converted into an exhaustive approved taxonomy.

BR-005 / DR-008 / AC-010 also mention target / strategic / repeat / direct / agency **flags**. H-25 Account Types do **not** replace those flags. Flag rules remain **DESIGN DETAIL REQUIRED** (not an OR-03 contradiction).

---

## 5. OR-07 — SOURCE vs CHANNEL

```text
SOURCE != CHANNEL
```

Both must be **separately reportable**. Catalogues are Owner-approved.

Unresolved (**do not answer here**):

**SOURCE**

* Can multiple sources be associated with one opportunity?  
* If yes, is one SOURCE designated as primary?  
* If yes, how is primary source selected?  
* Can source change?  
* How is source attribution preserved?

**CHANNEL**

* Can multiple channels be recorded?  
* Is CHANNEL operational contact method or acquisition channel?  
* Is channel required at initial enquiry?  
* Can it change during the opportunity lifecycle?

```text
DESIGN DETAIL STILL REQUIRED
```

C3 `source` (email/portal/advisor/other) is **not** the approved SOURCE/CHANNEL pair.

---

## 6. OR-05 / OR-06 — Proposal send vs approval

```text
PROPOSAL SEND AUTHORITY != PROPOSAL APPROVAL AUTHORITY
```

Send: assigned Sales & Business Development opportunity owner **after** required approval/review.  
Approval: required for **non-standard commercial risk**; ordinary in-parameter proposals do not need unnecessary executive approval.

```text
COMMERCIAL FLOOR VALUE = NOT AUTHORIZED / DESIGN DETAIL REQUIRED
```

No percentage or monetary threshold is invented.

**Later controlled approval matrix (design, not invented numbers)** is required for:

* exceptional discounting;  
* margin below approved commercial floor *(floor value itself unauthorized)*;  
* unusual payment/credit terms;  
* non-standard cancellation/liability terms;  
* significant contractual commitments;  
* strategic/high-risk accounts;  
* unusually large or complex programmes;  
* deviations from approved commercial/supplier policy.

C7 exists in Dev/Test as margin/threshold workflow. It is **not** automatically OR-06. Current Office send has **no** evidenced EOS approval step (H-19).

---

## 7. OR-04-FU — Follow-up

Confirmed: opportunity owner owns follow-up through close; transfer needs new owner + next action; Commercial Director is escalation.

| Acceptance need | In H-17 / H-25? | Closure |
| --- | --- | --- |
| Owner | PR-007 / OR-04-FU | Requirement **A**; live **E** |
| Next action | PR-008 / OR-01-B.9 | Requirement **A**; C2 has no first-class nextAction → **E** / **C1–C10 CAPABILITY GAP** vs opportunity record |
| Follow-up date | PR-005 | Requirement **A**; C1 tasks not RFP-bound → **E** |
| Transfer | OR-04-FU | Requirement **A**; transfer record design **C** |
| Escalation | OR-04-FU | Requirement **A**; overdue/strategic visibility **C** + **E** |
| Overdue visibility | implied by PR-005 / KR-S04 | AC-004 not precise on overdue reporting → **ACCEPTANCE CRITERION REQUIRES DETAIL** |

```text
C1–C10 CAPABILITY VALIDATION REQUIRED
```

---

## 8. OR-08 — Supplier rates

Authorized distinctions: source priority; season = applicability dates; validity (from/to, supplier/source, received/verified); retain supplier currency; verification; ≥ quarterly + on new issue; expired rates reconfirmed; rate types **only**:

* Negotiated / Contracted  
* Trade / Net  
* Public  
* Promotional  
* Quoted / Ad hoc  

No additional rate types introduced.

Remaining **DESIGN DETAIL STILL REQUIRED** (not answered here):

* rate versioning;  
* historical rate preservation;  
* overlapping validity periods;  
* supplier-specific season definitions;  
* FX treatment (proposal currency vs retained source currency);  
* expired-rate behavior in a live proposal;  
* approval of public rates for client proposals.

C4 has rate/season **structure**. Last-verification and rate-type enum vs OR-08 = **requirements-aligned change** + **live validation**. **Do not** build a supplier hub.

---

## 9. Pipeline and conversion (no targets)

Primary problems remain: **insufficient qualified RFPs** and **poor conversion**.

Whether approved requirements **eventually allow measurement** (method, not targets):

| Measure | Requirement path | Sufficiently defined to measure later? |
| --- | --- | --- |
| RFP received | PR-001; KR-D01 | **Yes** as process rule; stamps/live **E** |
| Qualified RFP | OR-01; KR-D02 | **Yes** as rule; application **E** |
| Proposal sent | PR-004; C8 `sentAt` if used | **Yes** as rule |
| Booking/win | PR-006; C9 if used | **Yes** as rule; Office confirm may bypass EOS |
| Closed-lost | OR-02-F | **Yes** as rule |
| Primary loss reason | OR-02-A/B | **Yes** as rule |
| Conversion | KR-S05; AC-005 | **Method** defined; **no target**; baseline unaudited |
| Response speed | BR-003; AC-006 | **Requirement exists**; clarification stamps **gap** |
| Pipeline value | DR-007; KR-C01 | **When available**; else explicit unknown — **Should** |

```text
OR-04 = NO NUMERICAL TARGET AUTHORIZED
```

No targets created or calculated.

---

## 10. Baselines

| Item | Record | Status |
| --- | --- | --- |
| ~25 RFPs / 12 months | `UNAUDITED OWNER ESTIMATES` | **D** — replace or confirm (DR-B01) |
| ~3 confirmed bookings | `UNAUDITED OWNER ESTIMATES` | **D** (DR-B03) |
| ~12% indicative conversion | `UNAUDITED OWNER ESTIMATES` | **D** — not qualified-to-booking (DR-B04) |
| Qualified RFP volume | not established | **D** (DR-B02) |
| Response time / turnaround | not established | **D** (DR-B05/B06) |
| Pipeline value / revenue / profit / repeat | not established | **D** (DR-B07–B10) |
| Market/buyer/source mix | not a census | **D** (DR-B11) |
| Loss-reason mix | taxonomy now exists; **no** historic census | **D** (DR-B12) |
| Proposals submitted | unknown | **D** (DR-B14) |

Do **not** treat estimates as system-generated historical facts. Future live operational use is required to replace them.

---

## 11. Response speed and clarification

Required stamps: received; clarification begins; clarification complete; proposal preparation begins; proposal sent; what “response time” is (BR-003 / AC-006).

H-18: **no** C3 clarification stage; **no** dedicated clarification requested/completed stamps; proposal **started** not a dedicated field.

```text
C1–C10 CAPABILITY GAP / DESIGN DETAIL STILL REQUIRED
```

This is **not** `REQUIREMENT CLOSED` for measurable response time. Timestamps are **not** implemented here.

---

## 12. Current workflow vs approved future requirements

**Current Owner-stated process (H-14/H-19):**

`RFP received` → `clarifying questions` → `Office programme/itinerary + financial proposal` → `email send` → `manual follow-up` → `confirm/reject`

**Approved Stage 1 process requirements add (not software yet):**

| Current | Approved future requirement | Difference |
| --- | --- | --- |
| Receipt in mail/WhatsApp/phone | Named owner, received stamp, SOURCE and CHANNEL if known (PR-001; OR-07) | Attribution and identity not in a commercial register today |
| Informal “qualified RFPs” language | OR-01 applied **before** treating as qualified; unqualified remain visible (PR-009) | Qualification is now a defined control; not C2 `new_qualified` |
| Clarification by email | Status, what was asked, completed stamp (PR-002) | Measurable clarification; C3 gap |
| Office programme + financial proposal | Identifiable programme/proposal version; itemized commercial financial proposal; rate governance (CR-013–020; OR-08) | Rules exist; Office is still SoR |
| Email send | Send only after OR-06 conditions; owner accountable for approved version (OR-05) | Conditional approval vs today’s send |
| Manual follow-up “after some time” | Next action, due date, last follow-up, transfer/escalation (PR-005; OR-04-FU) | Cadence and ownership now specified |
| Confirm/reject | Booking link or primary loss reason at closed-lost (PR-006; OR-02) | Loss catalogue did not exist in current practice |
| EOS unused | 1B must still decide tool (Excel/process/EOS) | Software **not** assumed |

**No software changes are prescribed.**

---

## 13. C1–C10 reuse (H-18 baseline, not repeated)

Live operational use: **none demonstrated**. Demo seed ≠ live.

| Capability | H-18 class | H-26 class (pick one primary + live) |
| --- | --- | --- |
| C1 CRM | Partial | **3. Requires material enhancement** (RFP-bound follow-up; Account Type vs seed keys; SOURCE/CHANNEL) **and 5. Live validation required** |
| C2 Opportunity | Partial | **3. Requires material enhancement** (OR-01 ≠ `new_qualified`; loss catalogue; next action on opportunity) **and 5** |
| C3 RFP | Partial | **3. Requires material enhancement** (clarification stamps; SOURCE≠CHANNEL; qualification on RFP) **and 5**. Clarification = **C1–C10 CAPABILITY GAP** |
| C4 Supplier/rates | Reuse with validation | **2. Reusable with requirements-aligned change** (OR-08 verification, rate types) **and 5**. **Not 1** |
| C5 Programme | Reuse with validation | **2. Reusable with requirements-aligned change** **and 5**. Office itinerary **not** automatically C5 |
| C6 Costing | Reuse with validation | **2. Reusable with requirements-aligned change** **and 5**. Internal cost sheet ≠ proven client financial proposal |
| C7 Approval | Reuse with validation | **2. Reusable with requirements-aligned change** **and 5**. Threshold engine ≠ OR-06 risk matrix; floor unauthorized |
| C8 Proposal | Partial | **3. Requires material enhancement** or **2** pending 1B (Office send vs C8 generate-from-C7; recipient type) **and 5** |
| C9 Booking | Reuse with validation | **2. Reusable with requirements-aligned change** **and 5**. Confirm may occur without accepted-proposal path |
| C10 Command Center | Partial | **4. Does not satisfy** GPTA-H-17 KPI pack. Booking rollup only. **C11+ not authorized**. KPI **process** may not need C10 |

**None** classified **1. Reusable without material change.**

---

## 14. Digital programmes (1F)

LinkedIn, SEO/website, Google Ads, Instagram remain:

```text
COMMERCIAL PROGRAMMES / REQUIREMENTS
```

**Not** implementation authorization. **No** ad spend. **No** digital-system build.

Future commercial measurement they create: SOURCE (e.g. LinkedIn, Website/Organic, Google Ads/Paid Search, Other Digital Marketing) and CHANNEL (LinkedIn, Website/Web Form, etc.) must be **separately reportable** into qualified-RFP counts (BR-001 / KR-D02). Programme **briefs** (audience, objective, economics for Ads) are still **definition** work (MR-001–MR-004). Instagram’s specific measurable outcome was not restated in H-25 → **DESIGN DETAIL REQUIRED** (map to SOURCE/CHANNEL; do not assume direct-response).

---

## 15. Finance (1E)

| Item | Closure |
| --- | --- |
| Itemized commercial financial proposal | Rules **partial** (CR-020; OR-08 rates; OR-06 approval). AC-011 not live-proven |
| Invoices | CR-022 **rules Should**; invoice **product Deferred**. C9 deposit checklist ≠ invoice product |
| Financial statements / KPI pack | CR-023 / AC-009 **categories**; no targets; C10 ≠ pack |
| Costing linkage | CR-021 Should when figures exist |
| Accounting integration | CR-026 **Deferred** |

Do **not** build finance functionality or accounting integrations.

---

## 16. Programme / itinerary (1C)

Requirements exist for programme creation, itinerary, supplier items, costing, proposal generation, approval, send.

Current SoR is **Office**. C5/C6/C7/C8 are **Dev/Test structures**, unused live.

**Existing C5/C6/C7/C8 implementation is not automatically fit for purpose.**

---

## 17. Master requirements-closure matrix

| Requirement | Business Rule | Acceptance Criterion | Current Evidence | C1–C10 Capability | Status | Remaining Work |
| --- | --- | --- | --- | --- | --- | --- |
| BR-001 | OR-01 | AC-002 | H-25 definition | C2 stage ≠ OR-01 | `LIVE VALIDATION REQUIRED` | Apply definition; do not mandate budget field |
| BR-002 | OR-01 + OR-02 + PR-006 | AC-005 | Funnel defined; 12% unaudited | C2/C8/C9 partial | `BASELINE REQUIRED` | Live conversion method; no target |
| BR-003 | Workflow stamps | AC-006 | Process yes; stamps no | **C3 no clarification stage** | `C1–C10 CAPABILITY GAP` | Design stamp set; do not implement now |
| BR-004 | Visibility of stage/owner/next action/value | AC-003; AC-004; AC-009 | EOS unused | C2/C10 partial | `LIVE VALIDATION REQUIRED` | Pipeline value when available |
| BR-005 | OR-03 + flags | AC-010 | Account Types approved; flags not | C1 seed ≠ taxonomy | `DESIGN DETAIL REQUIRED` | Strategic/repeat/direct/agency flags vs Account Type |
| BR-006 | OR-02 | AC-007 | Primary catalogue approved | C2 no catalogue | `DESIGN DETAIL REQUIRED` | Contributing-loss catalogue |
| BR-007 | OR-03-M + OR-07 | AC-008 | Separate dimensions approved | C3 source ≠ SOURCE/CHANNEL | `DESIGN DETAIL REQUIRED` | SOURCE/CHANNEL multiplicity; Market list finalization |
| BR-008 | Process → baseline → 1B before build | AC-012 | This assessment is not 1B complete | CR-001 gate | `LIVE VALIDATION REQUIRED` | 1B live workflow validation |
| BR-009 | OR-04 no targets | AC-009 categories only | H-16/H-25 | n/a | `CLOSED` | Do not invent targets |
| PR-001 | Receipt control | AC-001 | Mail/WhatsApp/phone | C3 `receivedAt` unused | `LIVE VALIDATION REQUIRED` | Owner + SOURCE/CHANNEL at receipt |
| PR-002 | Clarification control | AC-001; AC-006 | Email clarification | **No C3 stage** | `C1–C10 CAPABILITY GAP` | Stamp design |
| PR-003 | Programme + financial proposal | AC-001; AC-011 | Office | C5/C6 unused | `LIVE VALIDATION REQUIRED` | Fit vs Office |
| PR-004 | Sent + version + recipient | AC-001 | Email send | C8 `sentAt`; no recipient type | `DESIGN DETAIL REQUIRED` | Agent vs client; approved version identity |
| PR-005 | Follow-up | AC-004 | Manual; role now named in OR-04-FU | C1 tasks not RFP-bound | `C1–C10 CAPABILITY GAP` | Bind follow-up to opportunity/RFP (design only) |
| PR-006 | Outcome | AC-005; AC-007 | Confirm/reject; no catalogue used | C2/C8/C9 | `LIVE VALIDATION REQUIRED` | Closed-lost + primary LR |
| PR-007 | One owner | AC-003 | OR-04-FU / OR-01-C | C2 `ownerPrincipalId` | `LIVE VALIDATION REQUIRED` | Assignment process |
| PR-008 | Next action + deadline | AC-004 | OR-01-B.9 | Not first-class on C2 | `C1–C10 CAPABILITY GAP` | Opportunity next-action design |
| PR-009 | Qualify before qualified funnel | AC-002 | OR-01-D | C2 assumes `new_qualified` | `DESIGN DETAIL REQUIRED` | Mapping OR-01 ↔ stages |
| PR-010 | Repeat link | AC-010 | Should | C9/C1 unproven | `DESIGN DETAIL REQUIRED` | Repeat flag vs Account Type |
| DR-B01 | RFP volume baseline | Count method | ~25 unaudited | C3 empty live | `BASELINE REQUIRED` | Live count method |
| DR-B02 | Qualified volume | AC-002 + count | None | — | `BASELINE REQUIRED` | After OR-01 applied |
| DR-B03 | Bookings baseline | Count method | ~3 unaudited | C9 unused | `BASELINE REQUIRED` | |
| DR-B04 | Conversion method | AC-005 | ~12% unaudited | — | `BASELINE REQUIRED` | Qualified→booking vs RFP→booking labelled |
| DR-B05 | Response-time baseline | AC-006 | Unknown | C3 gap | `BASELINE REQUIRED` | After stamp design |
| DR-B06 | Turnaround baseline | AC-006 | Unknown | C8 proxy | `BASELINE REQUIRED` | |
| DR-B07 | Pipeline value | AC-009 | Unknown | C2 estimatedValue | `BASELINE REQUIRED` | Explicit unknown allowed |
| DR-B08 | Revenue | KR-C02 | Unknown | — | `BASELINE REQUIRED` | |
| DR-B09 | Profit | KR-C03 | Unknown | C6 demo | `BASELINE REQUIRED` | |
| DR-B10 | Repeat | AC-010 | Unknown | — | `BASELINE REQUIRED` | |
| DR-B11 | Market/buyer/source mix | AC-008 | Not a census | — | `BASELINE REQUIRED` | After taxonomies usable |
| DR-B12 | Loss-reason mix | AC-007 | Taxonomy yes; census no | — | `BASELINE REQUIRED` | |
| DR-B13 | Non-RFP enquiries | Could | Unknown | — | `DESIGN DETAIL REQUIRED` | In or out of first baseline |
| DR-B14 | Proposals submitted | Count method | Unknown | C8 unused | `BASELINE REQUIRED` | |
| DR-001 | Business identity + statuses | AC-001 | Office SoR | C2+C3 | `LIVE VALIDATION REQUIRED` | Tool may remain non-EOS |
| DR-002 | Qualification result + definition version | AC-002 | OR-01 text; no version id | C2 gap | `DESIGN DETAIL REQUIRED` | Definition-version labelling |
| DR-003 | BR-003 timestamps | AC-006 | — | C3 gap | `C1–C10 CAPABILITY GAP` | |
| DR-004 | Owner role | AC-003 | OR-04-FU | C1/C2 | `LIVE VALIDATION REQUIRED` | |
| DR-005 | Outcome + loss | AC-005; AC-007 | OR-02 | C2 notes only | `DESIGN DETAIL REQUIRED` | Primary vs contributing |
| DR-006 | Market + buyer type | AC-008 | OR-03-M | C1 `market` | `DESIGN DETAIL REQUIRED` | Final Market list |
| DR-007 | Value when available | AC-009 | Unknown | C2 | `BASELINE REQUIRED` | |
| DR-008 | Strategic/repeat/direct/agency flags | AC-010 | Not in OR-03 list | C1 fields exist | `DESIGN DETAIL REQUIRED` | Flag rules vs Account Type |
| CR-013 | Programme/itinerary rules | AC-001; AC-011 | Office today | C5 | `LIVE VALIDATION REQUIRED` | Not auto-fit |
| CR-014 | Financial proposal included | AC-011 | Office | C6/C8 | `LIVE VALIDATION REQUIRED` | |
| CR-015 | Client-seen version | AC-001 | Implied | C8 versions | `DESIGN DETAIL REQUIRED` | |
| CR-016 | Started→sent measurable | AC-006 | — | No started stamp | `C1–C10 CAPABILITY GAP` | |
| CR-017 | Who may send | AC-011 | OR-05 | C7 unused | `DESIGN DETAIL REQUIRED` | Approval matrix |
| CR-018 | Delivery + follow-up | AC-004 | Manual | C1/C8 | `LIVE VALIDATION REQUIRED` | |
| CR-019 | Outcome updates | AC-005 | Confirm/reject | C8/C9 | `LIVE VALIDATION REQUIRED` | |
| CR-S01–S04 | Supplier/item/rate/use | AC-010S | OR-08 | C4/C6 | `DESIGN DETAIL REQUIRED` | Edge cases §8 |
| CR-020 | Itemized commercial proposal | AC-011 | Office; rules partial | C6 lines | `ACCEPTANCE CRITERION REQUIRES DETAIL` | Itemization rules vs Office |
| CR-021 | Margin when figures exist | AC-011 | Historic profit unknown | C6 | `BASELINE REQUIRED` | |
| CR-022 | Invoice **rules** | Rules documented | Deferred as product | C9 checklist ≠ invoice | `DESIGN DETAIL REQUIRED` | No invoice product |
| CR-023 | Commercial KPI pack rules | AC-009 | Categories only | C10 ≠ pack | `ACCEPTANCE CRITERION REQUIRES DETAIL` | Process pack, not C11+ |
| CR-024 | Currency + commercial version | AC-011 | OR-08 retain source FX | C6/C8 | `DESIGN DETAIL REQUIRED` | FX treatment |
| CR-025 | Approval before commit price | AC-011 | OR-06 | C7 | `DESIGN DETAIL REQUIRED` | Matrix; no floor value |
| CR-026 | Accounting integration | Out of Stage 1 impl. | Deferred | I8 not C-spine | `CLOSED` | Remains Deferred |
| CR-001 | 1B gate | AC-012 | Inventory done; live no | All C* | `LIVE VALIDATION REQUIRED` | Smallest next package §19 |
| CR-002–CR-011 | C1–C10 inventory | — | H-18 | See §13 | `LIVE VALIDATION REQUIRED` | No modify |
| CR-J | Domain J / C11+ | — | Not created | — | `IMPLEMENTATION BLOCKED` | C11+ not authorized |
| CR-P | Production CRM | — | Not approved | — | `IMPLEMENTATION BLOCKED` | |
| KR-D01–KR-M05 | KPI **categories** | AC-009 | No targets (OR-04) | C10 insufficient | `BASELINE REQUIRED` | Measure later; no targets |
| KR-S01/S02 | Response / turnaround | AC-006 | — | C3 gap | `C1–C10 CAPABILITY GAP` | |
| KR-S03 | Qualification rate | AC-002 | OR-01 | — | `BASELINE REQUIRED` | |
| KR-S04 | Follow-up on time | AC-004 | — | C1 unbound | `C1–C10 CAPABILITY GAP` | |
| KR-S05 | Conversion | AC-005 | 12% estimate | — | `BASELINE REQUIRED` | |
| MR-001–MR-004 | Digital **programme definition** | Written brief; no launch | H-16 freeze | Attribution needs OR-07 | `DESIGN DETAIL REQUIRED` | Briefs; Ads economics before spend; no spend |
| MR-005 | SA incentive-agency programme definition | Approach + KR-M01 | First market frozen | C1 unused | `DESIGN DETAIL REQUIRED` | Written programme; no outreach execution |
| MR-006 | Subsequent markets placeholder | KR-M02–M05 | Not first wave | — | `CLOSED` | Keep visible; no campaigns |
| AC-001 | Track full lifecycle | PR-001–006 | Office informal | Partial C-spine | `LIVE VALIDATION REQUIRED` | |
| AC-002 | Distinguish qualified | OR-01 | Unused | C2 mismatch | `LIVE VALIDATION REQUIRED` | |
| AC-003 | Owner on qualified | OR-04-FU | Named role | Structure | `LIVE VALIDATION REQUIRED` | |
| AC-004 | Next action + follow-up | PR-005/008 | Cadence unspecified historically | Unbound tasks | `ACCEPTANCE CRITERION REQUIRES DETAIL` | Overdue visibility |
| AC-005 | Conversion calculable | Method | Estimates | — | `BASELINE REQUIRED` | |
| AC-006 | Turnaround from stamps | BR-003 | — | Gap | `C1–C10 CAPABILITY GAP` | |
| AC-007 | Loss reasons | OR-02 | Catalogue unused | No catalogue in C2 | `LIVE VALIDATION REQUIRED` | Contributing design |
| AC-008 | Market/buyer/source | OR-03-M; OR-07 | — | Wrong C3 source | `DESIGN DETAIL REQUIRED` | |
| AC-009 | KPI categories from process | KR-* | No targets | C10 ≠ pack | `ACCEPTANCE CRITERION REQUIRES DETAIL` | |
| AC-010 | Account flags | BR-005 | Flags ≠ Account Type | C1 fields | `DESIGN DETAIL REQUIRED` | |
| AC-010S | Controlled vs ad hoc rates | OR-08; CR-S04 | — | C4 partial | `DESIGN DETAIL REQUIRED` | |
| AC-011 | Itemized financial proposal | CR-020; OR-05/06 | Office | C6/C8 unproven | `LIVE VALIDATION REQUIRED` | |
| AC-012 | No new EOS until BR-008 | BR-008 | Still true | — | `CLOSED` | Holds: implementation not authorized |

Global: **`IMPLEMENTATION = NOT AUTHORIZED`** on every row.

---

## 18. Owner decisions remaining

**None** that reopen OR-01–OR-03, OR-04-FU, OR-05–OR-08, or OR-04 numerical targets.

Residual items previously listed in H-25 remain **design/detail**, not new Owner-rule voids:

* SOURCE/CHANNEL multiplicity and primary;  
* contributing-loss catalogue;  
* final Market list;  
* commercial-floor **value**;  
* Instagram measurable outcome mapping;  
* account **flags** vs Account Type.

Do **not** treat these as Owner contradictions.

---

## 19. Smallest next governance package

Prefer **targeted requirements-closure**, not another broad discovery.

**GPTA-H-27 candidate (single package):**

1. SOURCE / CHANNEL attribution rules (multiple, primary, change, preservation).  
2. Contributing-loss catalogue **or** explicit rule “contributing reasons use LR-01–LR-12”.  
3. Final **controlled Market** value list (close “may include”).  
4. Commercial **approval matrix** for OR-06 categories **without** a numerical floor.  
5. Supplier-rate edge-case rules (versioning, overlap, FX, expired, public-for-sale).  
6. Measurable AC for follow-up overdue visibility and BR-003 stamp meanings (process-level, not code).  
7. **1B** C1–C10 **live/process** validation plan against Office SoR (read-only; no modify).

Do **not** resolve those items in this document. Do **not** implement.

---

## 20. Repository safety

HEAD `75ee4c3`. Index empty. No commit. No push. No application/schema/data change. Dirty-tree work preserved.

---

## GPTA-H-26 status

```text
GPTA-H-26 STATUS = BUSINESS REQUIREMENTS PARTIALLY CLOSED — TARGETED CLOSURE REQUIRED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
NEXT ACTION = TARGETED REQUIREMENTS-CLOSURE PACKAGE (SOURCE/CHANNEL, CONTRIBUTING LOSS, MARKET LIST, APPROVAL MATRIX, RATE EDGE CASES, MEASURABLE AC, 1B LIVE VALIDATION PLAN)
```
