# GPTA-H-73 — Owner Disposition of H-72 Paths A–D

> **`OWNER DECISION RECORD`**  
> **`DECISIONS RECORDED UNDER COMPANY POA`**  
> **`H-73 OWNER DECISION = PATH A + PATH D`**  
> **`GOVERNANCE / PROCESS-DESIGN DECISION`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`F2-I12 NOT AUTHORIZED`**  
> **`PRODUCTION NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / PERSISTENCE / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T23:52:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-73 STATUS = OWNER DISPOSITION RECORDED — PATH A + PATH D SELECTED

PATH A = ACTIVE GOVERNANCE / PROCESS REFINEMENT
PATH D = ACTIVE REQUIREMENTS / FUTURE CAPABILITY TRACK
PATH B = DEFERRED
PATH C = DEFERRED
IMPLEMENTATION = NOT AUTHORIZED
```

H-72 is **not overwritten**. H-29 remains the controlling commercial-rule baseline. H-64 remains the controlling post-UAT disposition baseline unless a later Owner decision supersedes a specific row. H-66 Option C (process validation before further software) is **not reversed**; H-73 records the **next** operating direction after that validation produced a partial observation.

This is a **sequencing decision**, not a ranking of H-72 Paths A–D.

---

## 1. Owner decision authority

The decisions below are recorded as **authorized company decisions** under the previously granted company power of attorney held by:

**Patrick Makundi**

Role for this governance process:

- Commercial decision authority under the granted POA;
- Technical Increment Owner;
- UAT Authority.

This record does **not** invent a POA instrument number, date, or legal opinion. It records the Owner instruction that these H-73 decisions are made under that previously granted POA.

Path A + Path D is **not** authorization to modify EOS software.

---

## 2. Authoritative context

| Record | Role |
| --- | --- |
| H-29 | Controlling commercial-rule baseline |
| H-44 | F2 C1–C10 Dev/Test authorization (paused increment) |
| H-64 | Controlling post-UAT disposition unless superseded |
| H-65 / H-66 | Option C — process validation before further software |
| H-67–H-70 | Readiness, blocked access, Model B authorization |
| H-71 | Controlled validation executed — three genuine cases |
| [`gpta-h-72-commercial-process-validation-findings-and-future-capability-disposition.md`](gpta-h-72-commercial-process-validation-findings-and-future-capability-disposition.md) | Findings and unranked Paths A–D |

H-72 established:

```text
COMMERCIAL PROCESS PARTIALLY OBSERVED — VALIDATION EVIDENCE INSUFFICIENT FOR FULL PROCESS CONCLUSION
```

H-72 identified four possible strategic paths and **did not select** any of them.

---

## 3. Primary disposition — Path A

```text
OPTION A — COMMERCIAL / OPERATING-PROCESS REFINEMENT
```

**SELECTED** as the immediate operating direction.

Purpose:

- stabilize the commercial process;
- make qualification and follow-up practices explicit;
- clarify SOURCE versus CHANNEL;
- clarify market / account classification;
- strengthen loss-reason capture;
- establish proposal / approval discipline;
- establish supplier-rate evidence discipline;
- improve evidence / provenance discipline;
- establish a practical commercial operating baseline **before further software**.

```text
PATH A = ACTIVE GOVERNANCE / PROCESS REFINEMENT
```

Path A does **not** authorize modification of EOS software.

---

## 4. Path D — future capability requirements without implementation

```text
OPTION D — FUTURE CAPABILITY REQUIREMENTS WITHOUT IMPLEMENTATION
```

**SELECTED** as a requirements / roadmap track **alongside** Path A.

```text
PATH D = ACTIVE REQUIREMENTS / FUTURE CAPABILITY TRACK
```

The ten H-72 future capability candidates are carried forward. For all ten:

```text
IMPLEMENTATION AUTHORIZED = NO
CURRENT STATUS = FUTURE CAPABILITY / REQUIREMENTS ONLY
```

No implementation tasks. No F2-I12. No C1–C10 modification.

---

## 5. Path B — deferred

```text
OPTION B — ADDITIONAL OPERATIONAL EVIDENCE = DEFERRED / AVAILABLE IF MATERIAL EVIDENCE BECOMES ACCESSIBLE
```

**Not selected** as the primary workstream.

Rationale: H-71 already obtained three genuine operational cases and produced useful evidence. Additional evidence may be reviewed later if it becomes naturally available through the approved Model B process. Further evidence collection is **not** required as a prerequisite for commercial-process refinement.

Do **not**:

- create a new access / integration project;
- build connectors;
- import Excel;
- ingest Gmail / Outlook / WhatsApp.

```text
PATH B = DEFERRED
```

---

## 6. Path C — deferred

```text
OPTION C — OWNER STRATEGIC DISPOSITION BEFORE FURTHER WORK = DEFERRED
```

**Not selected** as the immediate direction.

Rationale: the Owner has now made the strategic disposition through this H-73 decision. The immediate direction is Path A + Path D. No separate strategic deadlock remains.

```text
PATH C = DEFERRED
```

---

## 7. Combined governance position

```text
H-73 OWNER DECISION = PATH A + PATH D
```

| Path | H-73 disposition |
| --- | --- |
| **A** | Immediate commercial operating-process refinement — **ACTIVE** |
| **D** | Future capability requirements / roadmap only — **ACTIVE** |
| **B** | Deferred; opportunistic evidence expansion if material Model B evidence becomes accessible |
| **C** | Deferred because strategic direction has now been decided |

This is a **sequencing** decision, not a ranking of the paths.

H-72 remains the findings record. H-73 does **not** reclassify H-72 D1–D6 rows merely by selecting a path.

---

## 8. Process refinement scope (Path A)

Path A focuses on commercial **operating disciplines**. It remains compatible with already-approved H-29 rules. It does **not** rewrite H-29.

### 8.1 Qualification

Use the existing approved OR-01 definition.

Do **not** introduce a numerical budget threshold.

Do **not** use the legacy 250k/20% rule as a new qualification rule.

### 8.2 SOURCE / CHANNEL

Maintain the H-29 distinction:

- SOURCE answers where / how the commercial opportunity originated.
- CHANNEL answers the communication / intake medium.

Do **not** infer SOURCE from CHANNEL.

### 8.3 Market / Account

Maintain market separately from buyer / account type.

Do **not** infer market from destination, email domain, account name, or buyer type.

### 8.4 Loss

Use the H-29 LR-01–LR-12 taxonomy.

Exactly one primary loss reason where the process reaches closed-lost.

Optional contributing reasons may also be recorded.

Do **not** invent a loss reason from insufficient evidence.

### 8.5 Follow-up

Maintain explicit:

- opportunity owner;
- next action;
- ownership transfer where necessary;
- escalation where appropriate.

### 8.6 Proposal / Approval

Strengthen the operating discipline around:

- final commercial version;
- required approvals;
- exceptional commercial terms;
- strategic / high-risk programmes;
- significant contractual commitments.

Do **not** create new numerical approval thresholds.

### 8.7 Supplier rates

Maintain:

- source;
- rate type;
- currency;
- validity;
- season;
- received date;
- verified date;
- expiry;
- version identity;
- item / service identity.

Do **not** implement FX.

Do **not** select an FX provider.

### 8.8 Evidence

Maintain sufficient provenance for important commercial decisions without copying unnecessary source documents into EOS.

---

## 9. OR-01 budget decision

H-72 identified an optional decision concerning live budget filtering.

Under H-73:

```text
NO NUMERICAL BUDGET RULE IS AUTHORIZED
250K/20% = LEGACY / NOT APPROVED AS F2 QUALIFICATION RULE
```

Do **not** replace it.

Do **not** delete it.

Do **not** implement a new threshold.

If budget filtering is used operationally, it must be treated as a **commercial judgment / process observation** rather than an EOS numerical rule until separately decided.

H-72’s optional D6 (`OR-01 BUDGET FILTERING REOPEN DECISION`) is **answered for the present**: **do not reopen OR-01 as a numerical rule**. A future Owner decision would be required to change this.

---

## 10. Future capability register (Path D)

Planning artifact only. For each candidate: **IMPLEMENTATION AUTHORIZED = NO**. **CURRENT STATUS = FUTURE CAPABILITY / REQUIREMENTS ONLY**.

Do **not**: write code; modify schemas; create migrations; create API routes; modify persistence; modify C1–C10; create implementation slices.

| Capability | Evidence basis | Business problem | Desired business outcome | Current process limitation | Potential capability | Dependencies | Governance questions | Implementation authorized? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Structured qualification capture | H-71 OR-01 PARTIAL; H72-FND-03 | Nine-box not stamped on live mail | Repeatable qualification before significant commitment | Operating practice not explicit | Structured fields / checklist later | Path A process first; H-29 OR-01 | When, if ever, to enforce in software | **NO** |
| Loss-reason capture | H-71 OR-02 PARTIAL; H72-FND-05 | Informal decline without LR code | Comparable loss analysis | LR-01–LR-12 not applied on observed case | Structured LR capture later | Path A loss discipline; H-29 OR-02 | Do not invent LR from weak evidence | **NO** |
| SOURCE / CHANNEL capture | H-71 OR-07 PARTIAL; H72-FND-07 | CHANNEL=email; SOURCE unlabelled | Acquisition reporting without collapsing origin and medium | SOURCE not labelled | Structured SOURCE/CHANNEL later | Path A labelling; H-29 D1.1–D1.2 | Do not infer SOURCE from CHANNEL | **NO** |
| Market / account classification | H-71 OR-03 / OR-03-M; H72-FND-06 | Catalogue and market field unstamped | Independent market and account-type reporting | Market not available as a field | Structured classification later | Path A classification; H-29 OR-03 / OR-03-M | Do not infer market from destination / domain / name | **NO** |
| Proposal versioning | H-71 OR-05 PARTIAL; H72-FND-08 | Intent without inspected artefact | Controlled final commercial version | Artefact / version discipline incomplete | Version tracking later | Path A proposal discipline | Artefact ≠ software grant | **NO** |
| Approval evidence | H-71 OR-06 NOT AVAILABLE | Path B not observed | Traceable exceptional / required approvals | Approval evidence not presented | Approval-evidence capability later | Path A approval discipline; Path B qualitative categories | No numerical CPR | **NO** |
| Supplier-rate provenance | H-71 OR-08 NOT AVAILABLE; H72-FND-09 | No quotation inspected | Traceable rate identity | Provenance not demonstrated | Provenance capability later | Path A rate discipline; H-29 OR-08 | Do not implement FX; do not modify supplier-rate system now | **NO** |
| Booking commercial facts | H-71 no won booking; H-64 GAP-02/03 | Booking validation not established | Win-dimension facts when justified | Evidence / prior F2 gap, not a process-defect proof | Booking facts later | Path A win/loss closure; H-64 remain D4 | F2-I12 not authorized | **NO** |
| KPI history | H-71 / H-64 D5 | Population insufficient for series | Durable KPI history when justified | Three cases cannot establish history | KPI history later | Process + data sufficiency | Do not seed ~25/~3/~12% | **NO** |
| Response-time evidence | Incomplete timestamps | Mail time ≠ defined first-response metric | Explicit receipt-to-response evidence | Definition and capture incomplete | Timestamp observation later | Path A first-response discipline | Do not fabricate timestamps | **NO** |

Software is **not** assumed to be the answer to every process gap. The commercial process should be stabilized (Path A) before further software is considered.

---

## 11. Commercial process refinement deliverable (commissioned, not executed)

H-73 commissions a future **governance / business-process package**, not software.

The next process-design step (H-74) should document:

1. RFP intake;
2. initial clarification;
3. qualification;
4. opportunity ownership;
5. programme development;
6. costing / supplier evidence;
7. commercial approval;
8. proposal issuance;
9. follow-up;
10. won / lost / deferred closure;
11. account / source / market classification;
12. loss recording;
13. evidence / provenance expectations.

The process must remain compatible with the already-approved H-29 rules.

**H-74 is not started in this record.**

---

## 12. Software boundary

```text
F2-I12 = NOT AUTHORIZED
SUBSEQUENT F2 IMPLEMENTATION = NOT AUTHORIZED
C1–C10 IMPLEMENTATION = PAUSED
PRODUCTION = NOT AUTHORIZED
MIGRATION = NOT AUTHORIZED
MAILBOX INGEST = NOT AUTHORIZED
GMAIL/OUTLOOK CONNECTORS = NOT AUTHORIZED
WHATSAPP CONNECTOR = NOT AUTHORIZED
EXCEL IMPORT = NOT AUTHORIZED
FX IMPLEMENTATION = NOT AUTHORIZED
NUMERICAL CPR = NOT AUTHORIZED
250K/20% REPLACEMENT = NOT AUTHORIZED
```

The future-capability register is a **planning artifact only**. Path A and Path D must **not** be interpreted as authorization for software implementation.

H-64 gaps (booking cancel, sidecar / win copies, commercial-facts route, KPI / revenue / profit, sent-cost, non-durable sidecar / UI, mixed 250k/20%) remain **D4** unless a later Owner decision supersedes a specific row. They are **not** reopened by H-73.

---

## 13. What H-73 does not do

H-73 does **not**:

- claim full commercial-process validation;
- claim commercial-process failure;
- claim operational EOS adoption;
- authorize F2-I12 or any subsequent F2 increment;
- authorize production, migration, ingest, or connectors;
- authorize a numerical budget rule or numerical CPR;
- start H-74;
- modify C1–C10;
- rewrite H-29, H-64, H-66, or H-72.

---

## 14. Next governance gate

```text
NEXT GATE = GPTA-H-74 — COMMERCIAL OPERATING PROCESS REFINEMENT DESIGN
APPLICATION NEXT_INCREMENT = NONE AUTHORIZED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

H-74 is governance / process design only. It must **not** implement software.

---

## Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — pre-existing work **preserved** |
| This task | Additive governance only |
| Tests / staged / commit / push | **NONE** / **NONE** / **NOT PERFORMED** / **NOT PERFORMED** |

UAT Authority / Technical Increment Owner: **Patrick Makundi** (combined **YES**). Company POA for these commercial / governance decisions: **Patrick Makundi** (no instrument number in repository).

```text
GPTA-H-73 STATUS = OWNER DISPOSITION RECORDED — PATH A + PATH D SELECTED
```
