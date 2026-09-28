# GPTA-H-66 — Owner Decision: Commercial Process Validation Before Further Software

> **`OWNER DECISION RECORD`**  
> **`OPTION C SELECTED`**  
> **`GOVERNANCE / BUSINESS-PROCESS DECISION`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`F2-I12 IMPLEMENTATION NOT AUTHORIZED`**  
> **`PRODUCTION NOT AUTHORIZED`**  
> **`NO OPERATIONAL ADOPTION`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / PERSISTENCE / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T22:50:00+03:00** (Owner decision recorded). Strengthened **2026-09-18T23:12:00+03:00** to the fuller commissioning text; the Owner decision is **unchanged**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-66 STATUS = OWNER DECISION RECORDED — COMMERCIAL PROCESS VALIDATION BEFORE FURTHER SOFTWARE
```

```text
OWNER DECISION: OPTION C — COMMERCIAL / OPERATING-PROCESS VALIDATION BEFORE FURTHER SOFTWARE.
```

```text
H-66 does not authorize F2-I12, any subsequent implementation increment, production deployment, production migration, operational adoption, or replacement of the legacy 250k/20% gate.
```

H-66 records the Owner decision and the validation framework. H-66 does **not** execute validation cases. H-66 does **not** authorize implementation.

---

## 1. Owner decision

```text
OWNER DECISION: OPTION C — COMMERCIAL / OPERATING-PROCESS VALIDATION BEFORE FURTHER SOFTWARE.
```

> The current technical F2 increment remains paused while the approved commercial operating model is validated against actual business operations before another software implementation increment is considered.

This is a **governance / business-process decision**.

It is **NOT** an implementation authorization.

It is **NOT**:

- an F2-I12 implementation authorization;
- an application development grant;
- a production approval;
- an operational-adoption declaration;
- a migration authorization;
- a commitment to build any particular future capability.

---

## 2. Relationship to H-65

Source: [`gpta-h-65-post-uat-owner-strategic-disposition-readiness.md`](gpta-h-65-post-uat-owner-strategic-disposition-readiness.md).

Controlling chain: GPTA-H-29 through GPTA-H-65.

| Record | State |
| --- | --- |
| H-63 | Controlled preview-only UAT execution completed |
| H-64 | Post-UAT findings and disposition review completed |
| H-65 | Post-UAT Owner strategic disposition / next-increment decision readiness completed |

H-65 presented Options A, B, and C **equally**. H-65 did **not** select an option. H-65 did **not** authorize another implementation increment.

| H-65 option | Description | H-66 |
| --- | --- | --- |
| A | Controlled close / pause | **Not selected** |
| B | Future design / requirements increment | **Not selected** |
| C | Commercial / operating-process validation before further software | **SELECTED** |

H-65 is **not overwritten**. Options A and B remain available only through a **later** Owner decision.

---

## 3. Decision rationale

The F2 preview and UAT demonstrated useful portions of the approved C1–C10 commercial model, but H-63 / H-64 also established material boundaries:

- F2 facts remain preview / non-durable.
- EOS / F2 is not the operational commercial system of record.
- Office, Excel, Outlook / Gmail, WhatsApp and telephone remain operational tools / SoR.
- C1–C10 are not fully operational.
- Booking cancellation capability is unavailable.
- Booking win-dimension facts are deferred.
- Booking commercial-facts routing is deferred.
- Revenue and profit are unavailable within the preview.
- Response-time evidence is incomplete.
- Historical KPI series are absent.
- The ~25 RFP / ~3 booking / ~12% figures remain unaudited Owner estimates.
- The legacy 250k/20% gate remains a mixed legacy residual and has not been replaced.
- No numerical CPR has been authorized.

Therefore, further software implementation **must not be inferred** merely from the existence of capability gaps.

The immediate governance objective is to determine how the approved commercial process operates in actual business use and where genuine process, evidence, data, governance, or software gaps remain.

---

## 4. What Option C authorizes

Option C authorizes **ONLY** the preparation and execution planning of a controlled commercial-process validation activity.

It may validate:

- RFP intake;
- qualification;
- clarification;
- account classification;
- market classification;
- buyer / account type;
- SOURCE;
- CHANNEL;
- opportunity ownership;
- next action;
- programme / proposal workflow;
- supplier-rate evidence;
- commercial approval;
- proposal handling;
- booking outcome;
- loss reasons;
- KPI evidence.

It does **NOT** authorize application development.

Use actual business records where lawfully and appropriately available. Do **not** modify the production system to facilitate validation. Do **not** migrate historical data into EOS.

---

## 5. What Option C does not authorize

Future candidates remain future candidates. Explicitly preserved — **not authorized** by H-66:

- F2-I12;
- any new F2 implementation increment;
- durable persistence of F2 facts;
- commercial-facts UI;
- booking cancellation;
- booking sidecar / win copies;
- booking commercial-facts route;
- KPI historical-series implementation;
- revenue / profit implementation;
- mailbox ingest;
- FX integration;
- DR-008-dependent functionality;
- numerical CPR;
- replacement of the 250k/20% gate;
- C11+;
- production deployment;
- production migration;
- production infrastructure;
- production data migration;
- procurement;
- supplier / provider selection.

```text
H-66 does not authorize F2-I12, any subsequent implementation increment, production deployment, production migration, operational adoption, or replacement of the legacy 250k/20% gate.
```

---

## 6. Commercial process validation objective

> Validate the approved H-29 commercial operating rules and C1–C10 process expectations against actual commercial activity before authorizing any further software implementation.

The validation must determine:

1. What the business process actually does today.
2. What H-29 requires.
3. What F2-I1–I11 can demonstrate.
4. What remains manual.
5. What evidence exists.
6. What evidence does not exist.
7. What is a process issue.
8. What is a data / evidence issue.
9. What is a genuine capability gap.
10. What would require a future Owner decision.

---

## 7. Data governance

> Absence of evidence must remain absence of evidence.

### No synthetic history

Do not manufacture historical commercial records.

### No inferred metrics

Do not convert missing data into calculated results.

### No unaudited baseline conversion

The Owner estimates:

- approximately 25 RFPs;
- approximately 3 bookings;
- approximately 12% conversion;

remain **unaudited estimates**. They must **not** be seeded as EOS historical facts.

### No fabricated revenue / profit

Missing revenue and profit remain **unavailable**.

### No fabricated response time

Missing timestamps remain **unavailable**.

### No fabricated conversion

Conversion remains **unavailable** where the necessary evidence does not exist.

Do not convert: missing revenue into zero; missing profit into zero; missing response time into a calculated estimate; missing conversion history into a pass; missing historical series into a reconstructed series; missing booking facts into inferred booking facts.

---

## 8. Validation method

A controlled validation framework. For each real commercial case examined, capture **only evidence that actually exists**. This record does **not** populate cases.

| Field | Requirement |
| --- | --- |
| Validation Case ID | Unique identifier |
| Commercial case | RFP / opportunity / proposal / booking / lost |
| Account | Actual account |
| Market | Actual market where established |
| Buyer type | Actual classification |
| SOURCE | Actual source evidence |
| CHANNEL | Actual intake channel |
| Qualification | H-29 OR-01 assessment |
| Clarifications | Evidence available |
| Owner | Actual opportunity owner |
| Next action | Actual next action |
| Programme | If applicable |
| Costing | If applicable |
| Approval | If applicable |
| Proposal | If applicable |
| Booking | If applicable |
| Loss reason | If applicable |
| Evidence source | Actual source / reference |
| F2 demonstration | Demonstrated / partial / unavailable |
| Operational result | Observed / unavailable |
| Gap class | Process / data / capability / governance |
| Future implication | If evidence supports one |

Do **not** rank or score commercial cases. Do **not** rank staff performance. Do **not** create a commercial performance leaderboard.

---

## 9. H-29 rules to validate

### Qualification

All approved OR-01-B conditions must be considered. Do **not** equate `new_qualified` with the H-29 qualification definition.

### Loss reasons

Use LR-01 through LR-12. One primary loss reason. Optional contributing reasons.

### Account types

Use the approved OR-03 account-type catalogue. PCO remains distinct.

### Market

Market remains independent from buyer / account type.

### SOURCE

SOURCE remains distinct from CHANNEL.

### CHANNEL

CHANNEL records intake method.

### Follow-up

Sales & BD opportunity owner remains responsible through proposal / negotiation / close unless formally reassigned.

### Approval

Use the eight approved qualitative Path B categories. Do **not** introduce numerical thresholds. Do **not** treat the legacy 250k/20% gate as the approved F2 Path B authority.

### Supplier rates

Validate the approved OR-08 source classes, rate types, validity / season, currency, source date, verification, expiry and version identity where applicable.

---

## 10. KPI validation

Test what can genuinely be evidenced. Possible measures include:

- RFP volume;
- qualified opportunities;
- conversion;
- response time;
- pipeline value;
- repeat business;
- revenue;
- profit.

For every KPI classify it as:

- **OBSERVED**;
- **DERIVED**;
- **UNAVAILABLE**;
- **INSUFFICIENT EVIDENCE**.

Do **not** treat the existence of a formula as evidence that the metric is available.

---

## 11. Future software requirements

The validation may identify future software requirements.

> Identification of a software requirement is NOT authorization to implement it.

Every future candidate must be classified as one of:

- process clarification;
- evidence / data gap;
- capability gap;
- future requirements candidate;
- future design candidate;
- governance decision required;
- out of scope.

No implementation may begin from the validation findings alone. Any future implementation requires a **separate Owner decision** and appropriate governance gate.

---

## 12. Next governance gate

```text
NEXT GATE = COMMERCIAL PROCESS VALIDATION REVIEW
```

At the end of the validation activity, a **separate** governance review must determine:

1. Which H-29 rules are operating consistently?
2. Which are not?
3. Which evidence exists?
4. Which evidence remains unavailable?
5. Which gaps are process gaps?
6. Which gaps are data / evidence gaps?
7. Which gaps are genuine software capability gaps?
8. Whether another software increment is justified for consideration.
9. If so, what decision pack is required before implementation.

Do **not** automatically authorize the next implementation increment.

```text
APPLICATION NEXT_INCREMENT = NONE AUTHORIZED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

---

## 13. Governance roles

| Role | Person |
| --- | --- |
| UAT Authority | **Patrick Makundi** |
| Technical Increment Owner | **Patrick Makundi** |
| Combined role | **YES** |

No additional authority is inferred.

---

## 14. Current technical baseline

F2-I1 through F2-I11 remain the frozen preview evidence baseline.

They are:

- implemented;
- test-demonstrated;
- preview-only;
- non-durable;
- not operationally adopted;
- not production-ready.

Do **not** modify them under H-66.

---

## 15. Operational system of record

Current operational SoR remains:

- Microsoft Office;
- Excel;
- Outlook / Gmail;
- WhatsApp;
- telephone;
- existing live business records.

EOS / F2 has **not** become the operational SoR.

---

## 16. Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — pre-existing Class A/B and F2-I1–I11 **preserved** |
| This task | Governance documentation only (this record strengthened; pointers already present from the first H-66 write) |
| Application / schema / persist / infrastructure | **NOT MODIFIED** |
| Tests run | **NONE** |
| Staged | **NONE** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

---

## 17. Boundary restatement

```text
NO IMPLEMENTATION IS AUTHORIZED BY H-66
F2-I12 IMPLEMENTATION NOT AUTHORIZED
NO SUBSEQUENT IMPLEMENTATION INCREMENT AUTHORIZED
PRODUCTION DEPLOYMENT NOT AUTHORIZED
PRODUCTION MIGRATION NOT AUTHORIZED
OPERATIONAL ADOPTION NOT DECLARED
LEGACY 250k/20% GATE NOT REPLACED
NUMERICAL CPR NOT AUTHORIZED
```

```text
H-66 does not authorize F2-I12, any subsequent implementation increment, production deployment, production migration, operational adoption, or replacement of the legacy 250k/20% gate.
```

```text
GPTA-H-66 STATUS = OWNER DECISION RECORDED — COMMERCIAL PROCESS VALIDATION BEFORE FURTHER SOFTWARE
```
