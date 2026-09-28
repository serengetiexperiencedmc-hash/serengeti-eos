# GPTA-H-67 — Commercial Process Validation Execution Readiness

> **`EXECUTION-READINESS RECORD`**  
> **`NOT VALIDATION EXECUTION`**  
> **`NOT AN IMPLEMENTATION GRANT`**  
> **`F2-I12 IMPLEMENTATION NOT AUTHORIZED`**  
> **`PRODUCTION NOT AUTHORIZED`**  
> **`NO OPERATIONAL ADOPTION`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / PERSISTENCE / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T23:15:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-67 STATUS = COMMERCIAL PROCESS VALIDATION EXECUTION READINESS COMPLETED

VALIDATION EXECUTION = NOT YET EXECUTED
```

This record makes the H-66 Option C validation phase **execution-ready**. It does **not** execute validation. It does **not** invent sample cases or evidence. It does **not** authorize F2-I12 or any subsequent implementation increment.

---

## 1. H-66 decision reference

Source: [`gpta-h-66-owner-decision-commercial-process-validation.md`](gpta-h-66-owner-decision-commercial-process-validation.md).

```text
OWNER DECISION: OPTION C — COMMERCIAL / OPERATING-PROCESS VALIDATION BEFORE FURTHER SOFTWARE.
```

H-63 = preview-only UAT completed. H-64 = disposition completed. H-65 = decision readiness completed (no option selected). H-66 selected Option C and authorized **commercial-process validation** before further software.

H-66 did **not** authorize: F2-I12; another implementation increment; production; operational adoption; replacement of the 250k/20% legacy gate.

H-66 is **not overwritten**.

---

## 2. Validation objective

> Determine how the approved H-29 commercial operating rules actually function in current business operations, what evidence exists, where the live process differs from the approved model, which limitations are process/data/evidence limitations, and which remaining gaps genuinely require future software consideration.

Compare:

- **A.** H-29 approved business rules  
- **B.** actual commercial operating evidence  
- **C.** F2-I1–I11 preview capabilities.

---

## 3. Layer separation

Do **not** merge these layers.

| Layer | Meaning |
| --- | --- |
| **1 — Approved commercial model** | H-29 rules and associated approved requirements |
| **2 — Actual operational process** | What the company currently does using Office, Excel, Outlook/Gmail, WhatsApp, telephone, existing live records |
| **3 — F2 preview capability** | What F2-I1–I11 can currently demonstrate in Dev/Test |

The existence of an F2 capability does **not** prove operational adoption. An operational practice does **not** become an EOS fact merely because a corresponding F2 field exists. A missing F2 capability does **not** automatically mean the business process itself is defective.

---

## 4. Case-selection method

Use actual commercial cases where appropriate and lawfully available. Prefer a cross-section of **recent real cases** covering different outcomes and process states.

Seek coverage across:

- qualified opportunities;
- opportunities requiring clarification;
- proposals;
- closed-won / booked cases;
- closed-lost cases;
- opportunities that did not progress;
- repeat / existing-client cases where available;
- new / prospect cases where available.

Do **NOT** invent cases merely to satisfy coverage.

If a required case type does not exist in the available evidence, record:

```text
NOT AVAILABLE IN VALIDATION POPULATION
```

Do not manufacture it. Do not seed historical business data into EOS or the F2 preview sidecar.

---

## 5. Sample register structure

Blank schema. **Not populated.** No fictional rows.

| Field | Meaning |
| --- | --- |
| Validation Case ID | Internal validation reference |
| Business Case Reference | Actual business reference where appropriate |
| Case Type | RFP / Opportunity / Proposal / Booking / Lost / Other |
| Account | Actual account |
| Market | Actual established market |
| Buyer Type | Actual account type |
| SOURCE | Actual source |
| CHANNEL | Actual intake channel |
| Date Range | Relevant business period |
| Evidence Available | Yes / Partial / No |
| Evidence Location | Actual source |
| Validation Status | Not Started / In Review / Complete |
| Notes | Controlled factual notes |

Do not expose unnecessary personal information. Do not copy passwords, payment information, personal financial information, or unrelated personal data into governance records.

---

## 6. Evidence hierarchy

Prefer, in this order:

1. contemporaneous client / RFP correspondence;
2. proposal and commercial documents;
3. approved supplier quotations / rate documents;
4. booking / contract records;
5. internal commercial records;
6. CRM / EOS preview observations;
7. retrospective staff recollection.

Clearly identify retrospective recollection as such. Do **not** treat a recollection as equivalent to contemporaneous evidence.

---

## 7. H-29 validation matrix

Do **not** change approved rules during validation. If a rule appears unsuitable or ambiguous, record a **governance observation** requiring a separate decision. Results remain **TBD** until H-68.

| Rule | Validation question | Evidence required | Result |
| --- | --- | --- | --- |
| OR-01 | Was the opportunity genuinely qualified? | H-29 qualification conditions + supporting evidence | TBD |
| OR-02 | Was loss classification applied correctly? | Primary / contributing loss evidence | TBD |
| OR-03 | Was buyer / account type classified correctly? | Account evidence | TBD |
| OR-03-M | Was market separated from buyer type? | Market / account evidence | TBD |
| OR-04 | Was follow-up ownership clear? | Owner / next-action evidence | TBD |
| OR-05 | Was proposal sending controlled appropriately? | Proposal / approval evidence | TBD |
| OR-06 | Were exceptional approval conditions recognized? | Approval evidence | TBD |
| OR-07 | Were SOURCE and CHANNEL distinguished? | Intake evidence | TBD |
| OR-08 | Was supplier-rate identity sufficiently evidenced? | Rate source / version / validity evidence | TBD |

---

## 8. C1–C10 validation framework

Commissioning / H-59–H-66 capability labels used here:

C1 CRM · C2 Qualification · C3 RFP / Clarification / Follow-up · C4 Programme / Itinerary · C5 Costing / Supplier Rates · C6 Approval · C7 Proposal · C8 Booking / Commercial Conversion · C9 Commercial / Account Relationship · C10 KPI / Commercial Reporting.

H-29 / H-34 file §B.2 numbering remains separately recorded and is **not rewritten**. Cross-walk is unchanged from H-59 / H-64.

For each capability, H-68 must record: current operational process; actual evidence; H-29 requirement; F2 preview capability; operational alignment; limitation / gap; evidence reference.

Do **not** claim complete operational capability merely because an F2 preview test passed.

| Capability | Operational process | Actual evidence | H-29 requirement | F2 preview | Alignment | Limitation / gap | Evidence ref. |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 CRM | TBD | TBD | OR-03 / OR-03-M | Preview account facts | TBD | TBD | — |
| C2 Qualification | TBD | TBD | OR-01 | Preview qualification sidecar | TBD | TBD | — |
| C3 RFP / clarification / follow-up | TBD | TBD | OR-04 / timestamps | Preview RFP facts | TBD | TBD | — |
| C4 Programme / itinerary | TBD | TBD | Programme identity / trace | Preview programme facts | TBD | TBD | — |
| C5 Costing / supplier rates | TBD | TBD | OR-08 | Preview rate identity | TBD | TBD | — |
| C6 Approval | TBD | TBD | Path B qualitative | Preview Path B | TBD | TBD | — |
| C7 Proposal | TBD | TBD | OR-05 | Preview generate / send | TBD | TBD | — |
| C8 Booking / conversion | TBD | TBD | Booking outcome | Mixed booking only | TBD | TBD | — |
| C9 Account relationship | TBD | TBD | SOURCE / CHANNEL / type / market | Preview facts | TBD | TBD | — |
| C10 KPI / reporting | TBD | TBD | Evidence-based KPIs | Preview KPI pack | TBD | TBD | — |

---

## 9. Qualification validation

For each applicable opportunity, determine whether the nine OR-01-B conditions can actually be evidenced:

1. buyer / account fit;
2. genuine requirement;
3. destination / service fit;
4. approximate dates / decision window;
5. sufficient scope;
6. approximate group size / profile;
7. buying process known / active;
8. commercial viability credible;
9. defined next action.

Record: all conditions evidenced; partially evidenced; not evidenced; not applicable.

Do **NOT** use budget as a mandatory qualification condition. Do **NOT** use `new_qualified` as a substitute for qualification.

---

## 10. Loss validation

For closed-lost cases test:

- exactly one primary loss reason;
- zero or more contributing reasons;
- LR-01 through LR-12;
- evidence supporting the classification;
- whether `Other` requires explanation.

Do **not** force a loss classification when evidence is insufficient.

---

## 11. Account / market validation

Test independently.

**Account type:** approved OR-03 catalogue. PCO must remain distinct from Event Agency and other categories.

**Market:** approved market catalogue. Do **not** infer market from email domain, telephone number, destination, account name, or free-text assumptions. If market is not evidenced, record it as **unknown / unavailable**.

---

## 12. SOURCE / CHANNEL validation

**SOURCE:** one primary SOURCE; up to two secondary SOURCE values where supported.

**CHANNEL:** separate intake channel.

Do **not** collapse SOURCE and CHANNEL. Record the evidence supporting each.

---

## 13. Follow-up validation

Determine whether each applicable opportunity has:

- assigned owner;
- current next action;
- identifiable follow-up responsibility;
- evidence of reassignment where relevant.

Do **not** infer ownership merely from who sent an email.

---

## 14. Proposal / approval validation

For proposals actually sent, determine:

- who owned the opportunity;
- what proposal version was used;
- whether required approval conditions applied;
- whether any Path B qualitative category was triggered;
- whether approval evidence exists.

Use only the approved qualitative Path B categories.

Do **NOT** introduce: numerical margin floors; numerical CPR; $250,000 threshold; 20% threshold.

The legacy 250k/20% gate remains a mixed legacy residual and is **not** the F2 Path B authority.

---

## 15. Supplier-rate validation

Where costing / rates are part of a case, test OR-08 identity.

**Source classes:** (1) Direct supplier contract / agreement; (2) Supplier-issued contracted rate sheet; (3) Written supplier quotation; (4) Approved trade / net; (5) Public benchmark unless approved.

**Rate types:** (1) Negotiated / Contracted; (2) Trade / Net; (3) Public; (4) Promotional; (5) Quoted / Ad hoc.

Also test where evidence exists: original currency; season; valid-from; valid-to; source date; verified date; expiry; version identity; item / service identity.

Do **not** infer FX. Do **not** select an FX provider.

---

## 16. Commercial trace validation

Where records exist, test:

RFP → Programme → Costing → Approval → Proposal → Booking / Closed outcome

Use actual identifiers and **explicit relationships**.

Do **not** use names, dates, creation order, or matching amounts as substitutes for explicit relationships.

Where the chain is incomplete, record:

```text
PARTIAL TRACE
```

not failure.

---

## 17. KPI validation

For every KPI examined, classify evidence as: **OBSERVED**; **DERIVED**; **UNAVAILABLE**; **INSUFFICIENT EVIDENCE**.

Potential KPIs: RFP volume; qualified opportunities; conversion; response time; pipeline value; repeat business; revenue; profit.

Rules: no synthetic history; no fabricated revenue; no fabricated profit; no inferred conversion; no inferred response time; no conversion of the ~25 / ~3 / ~12% estimate into system history.

If data is insufficient, state that directly. Do **not** treat the existence of a formula as evidence that the metric is available.

| KPI | Evidence class (until H-68) |
| --- | --- |
| RFP volume | TBD |
| Qualified opportunities | TBD |
| Conversion | TBD |
| Response time | TBD |
| Pipeline value | TBD |
| Repeat business | TBD |
| Revenue | TBD |
| Profit | TBD |

---

## 18. Gap classification

Do **not** rank gaps. Do **not** assign severity scores unless separately authorized.

| Code | Meaning |
| --- | --- |
| **P — Process Gap** | The approved rule exists but the live process does not consistently follow it |
| **E — Evidence / Data Gap** | The process may have occurred, but adequate evidence / data is unavailable |
| **C — Capability Gap** | The process / evidence requirement cannot reasonably be supported by the current tools / capability |
| **G — Governance Decision** | A rule, threshold, authority, or policy requires a separate Owner decision |
| **O — Out of Scope** | The matter is deliberately outside the current phase |

---

## 19. Finding register

Blank schema. **Not populated.**

| Finding ID | Case | Rule / C | Observation | Evidence | Classification | Future implication | Owner decision required |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — |

`Future implication` is descriptive only. It does **NOT** authorize implementation.

---

## 20. Execution-log template

Blank schema. Do **not** populate results until actual validation occurs.

| Validation Case ID | Date / time | Validator | Evidence inspected | Rule tested | Observation | Result | Finding ID | Evidence reference | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | — | — |

---

## 21. Explicit statement that execution has not occurred

```text
VALIDATION EXECUTION = NOT YET EXECUTED
```

H-67 itself is **NOT** execution. Do not report PASS / FAIL results. Do not invent sample cases. Do not create fictional evidence.

---

## 22. Future software boundary

The validation may later identify candidates such as: durable commercial facts; commercial-facts UI; booking cancellation; booking win-dimension facts; booking commercial-facts route; historical KPI architecture; sent-cost reconstruction; replacement of legacy approval gating.

These remain **future candidates only**. No candidate receives implementation authorization through H-67.

```text
F2-I12 IMPLEMENTATION NOT AUTHORIZED
NO SUBSEQUENT IMPLEMENTATION INCREMENT AUTHORIZED
PRODUCTION NOT AUTHORIZED
```

---

## 23. Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — pre-existing Class A/B and F2-I1–I11 **preserved** |
| This task | Additive governance document(s) only |
| Application / schema / persist / infrastructure | **NOT MODIFIED** |
| Tests run | **NONE** |
| Staged | **NONE** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

---

## 24. Governance roles

| Role | Person |
| --- | --- |
| UAT Authority | **Patrick Makundi** |
| Technical Increment Owner | **Patrick Makundi** |
| Combined role | **YES** |

No additional authority is inferred. H-68 may only execute against actual evidence available to the authorized validator.

---

## 25. Next gate

```text
NEXT GATE = GPTA-H-68 — CONTROLLED COMMERCIAL PROCESS VALIDATION EXECUTION
```

H-68 may only execute against actual evidence available to the authorized validator. H-68 must **not** become a software implementation increment. At completion of H-68, findings must be reviewed **before** any future technical increment is considered.

```text
APPLICATION NEXT_INCREMENT = NONE AUTHORIZED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

```text
GPTA-H-67 STATUS = COMMERCIAL PROCESS VALIDATION EXECUTION READINESS COMPLETED
VALIDATION EXECUTION = NOT YET EXECUTED
```
