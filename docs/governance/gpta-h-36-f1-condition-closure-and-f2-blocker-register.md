# GPTA-H-36 — F1 Condition Closure and F2 Blocker Register

> **`GOVERNANCE DOCUMENTATION ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T14:48:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Subject:** Close F1 design defects where existing approved records already provide authority, and preserve unresolved Owner decisions, parameter values, appointments, production dependencies, and implementation evidence as explicit F2 blockers.

**Sources (read, not rewritten):** [`gpta-h-25-authorized-commercial-business-rules.md`](gpta-h-25-authorized-commercial-business-rules.md); [`gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md`](gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md); [`gpta-h-28-c1-c10-live-validation-results.md`](gpta-h-28-c1-c10-live-validation-results.md); [`gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md`](gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md); [`gpta-h-30-implementation-authorization-readiness-and-owner-decision.md`](gpta-h-30-implementation-authorization-readiness-and-owner-decision.md); [`gpta-h-31-owner-decision-capture-and-commercial-implementation-governance.md`](gpta-h-31-owner-decision-capture-and-commercial-implementation-governance.md); [`gpta-h-32-f0-governance-and-requirements-baseline-specification.md`](gpta-h-32-f0-governance-and-requirements-baseline-specification.md); [`gpta-h-33-f0-baseline-governance-review.md`](gpta-h-33-f0-baseline-governance-review.md); [`gpta-h-34-f1-detailed-design-and-implementation-specification.md`](gpta-h-34-f1-detailed-design-and-implementation-specification.md); [`gpta-h-35-f1-specification-review.md`](gpta-h-35-f1-specification-review.md); dependency register; parallel-work register.

Standalone `gpta-h-20/21/22-*.md` remain **absent** (content inside H-19). H-23 and H-24 exist. H-25 remains the authorized commercial-rule baseline. H-34 body is **not rewritten**; this document is the controlling F1 addendum for the conditions below.

```text
CLOSING AN F1 CONDITION ≠ F2 AUTHORIZATION
CLOSING AN F1 CONDITION ≠ IMPLEMENTATION AUTHORIZATION
CLOSING AN F1 CONDITION ≠ CODING
SPECIFICATION ≠ IMPLEMENTATION EVIDENCE
M0 ≠ OWNER-APPROVED MIGRATION DECISION
250k/20% = REJECTED
```

---

## 1. Repository and governance position

```text
Branch = master
HEAD = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index = empty
Working tree = intentionally dirty (preserved)

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F1 DESIGN COMPLETENESS = SUBSTANTIALLY COMPLETE — CONDITIONS BIND F2
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED

E1 = NOT APPROVED / BLOCKED
E1-C = CONTROLLED PAUSE
E1-D = FORMALLY PARKED / DEFERRED
PATH B = HOLD
NA-A-22 = OPEN
DR-008 = DEFERRED
NEXT_INCREMENT = NONE_AUTHORIZED
```

No application code, schema, migration, application data, or infrastructure was modified for this record. No tests or migrations were executed. No commit. No push.

---

## 2. Objective and method

H-35 recorded F1-C-01 through F1-C-12 and required: close conditions **or** carry them as explicit F2 blockers — **no coding**.

This record classifies each condition as one of:

| Classification | Meaning |
| --- | --- |
| `CLOSED BY DESIGN CLARIFICATION` | Approved records already supply the rule; this document records the controlling design. Not implementation. |
| `CLOSED FOR CURRENT APPROVED GOVERNANCE MODEL` | Current authority is sufficient; a later change of authority needs a new decision. |
| `CLOSED AS GOVERNANCE RULE` | Permanent evidence/scope rule. |
| `NOT A BLOCKER` | Remaining work is scope discipline, not an open F1 defect. |
| `REQUIRES OWNER DECISION` | Owner/management must decide; not invented here. |
| `REQUIRES ROLE/APPOINTMENT` | Named person/role not inventable here. |
| `REQUIRES FUTURE IMPLEMENTATION EVIDENCE` | Cannot be closed by documentation. |
| `REMAINS F2 BLOCKER` | Blocks the stated F2 claim until separately closed. |

Assumptions are **not** evidence. Closure is not forced to advance the programme.

---

## 3. Condition-by-condition review

### F1-C-01 — Ownership timing

**H-35:** Opportunity owner assigned at intake / **before** qualification; do not implement H-34 §2 steps 5→6 as sequence.

**Source authority (already approved):**

* H-17 **PR-001:** RFP received requires a **named owner**.
* H-25 **OR-01-C:** the assigned Sales & Business Development opportunity owner may qualify the RFP.
* H-25 **OR-01-D:** qualification after initial review/clarification and **before** significant proposal/costing resource.
* H-25 **OR-04-FU:** the assigned owner owns follow-up from qualification through proposal, negotiation and close; transfer must identify the new owner and next action; Commercial Director is the escalation point.
* H-34 §4.2–4.3 (C2/C3) already treated named owner as a C2/C3 control; H-35 held those sections controlling over §2 numbering.

**Controlling F1 design (this record supersedes H-34 §2 step order for ownership):**

1. An opportunity owner is assigned at intake or before qualification is finalized.
2. The assigned Sales & BD opportunity owner is responsible for qualification.
3. The owner remains accountable through follow-up, proposal, negotiation, and close unless formally transferred.
4. Transfer must identify: new owner; transfer reason where required; next action; transfer timestamp / audit evidence.
5. Commercial Director oversight remains as established in H-25 (exceptions, strategic reclassification visibility, escalation).
6. No new business rule is created that contradicts H-25. OR-04-FU “from qualification through close” describes **follow-up accountability after qualification**, not delayed **assignment**. Assignment remains PR-001 / OR-01-C.

H-34 §2 steps 5 then 6 must **not** be implemented as a sequence. Qualification (step 5) requires the already-assigned owner. Step 6 remains the ownership **record / transfer** surface, not first assignment after qualification.

**Not implemented.** Permissions not changed.

```text
F1-C-01 = CLOSED BY DESIGN CLARIFICATION
```

---

### F1-C-02 — M0 migration assumption

H-34 §10 lists M0 as “Default assumed for F1” and “Decision not selected.” H-35 recorded M0 as a working assumption, not H-31 Decision 6.

```text
M0 = F1 WORKING ASSUMPTION ONLY
M0 ≠ OWNER-APPROVED MIGRATION DECISION
```

Explicit statements:

* M0 cannot authorize migration.
* No automatic ingest is authorized.
* M3 automatic ingest remains unauthorized.
* No historical data migration is authorized.
* A future migration decision requires explicit governance approval.
* Existing Office/Excel records remain outside the EOS source-of-truth implementation until migration is separately approved.

This record **does not** select M0, M1, M2, or M3.

F2 impact: blocks **migration/ingest** and any claim of historic load. A new-capture-only increment still requires an **explicit** Owner statement that historic ingest is out of scope; silence must not be read as M0 approval.

```text
F1-C-02 = REMAINS F2 BLOCKER
```

Classification: `REQUIRES OWNER DECISION` + `REMAINS F2 BLOCKER`.

---

### F1-C-03 — Supplier-rate overlap / conflict

H-27 §10.2 already required overlapping rates to be identifiable and resolved before live proposal use. H-34 §8 documented the gap without a resolution method. H-28 observed expired rates remaining selectable and costing lines without `supplierRateId`. Those are Dev/Test evidence, not a commercial policy.

**Controlling F1 design (requirements level; no supplier-specific commercial policy invented):**

When multiple potentially applicable supplier rates overlap:

1. Preserve each source/rate version independently.
2. Do not silently overwrite one rate with another.
3. Determine applicability using: supplier; rate type; service/item; season; effective-from date; effective-to date; expiry; contract/agreement status; source priority.
4. Where two rates remain legitimately applicable or conflict materially, the commercial/operations responsible function must resolve the conflict **before** the rate is used for a committed proposal.
5. The selected rate must retain a reference to the applicable source/version.
6. The proposal/costing must use a rate snapshot.
7. An expired or unresolved conflicting rate must not be treated as silently valid.

**Not invented:** discount percentages; margins; numerical precedence values; supplier-specific rules; FX provider.

Silent `preferredInConflict` is **not** an approved resolution method.

Implementation of the rule remains future F2 evidence (F1-C-11). The **design gap** that blocked F1 completeness is closed.

```text
F1-C-03 = CLOSED BY DESIGN CLARIFICATION
```

---

### F1-C-04 — Numeric proxies for approval triggers

Approved qualitative categories (H-27 §9 / H-34 §7) remain:

1. Exceptional discounting  
2. Margin below approved floor  
3. Unusual payment/credit terms  
4. Non-standard cancellation/liability  
5. Significant contractual commitments  
6. Strategic/high-risk accounts  
7. Unusually large/complex programmes  
8. Deviations from approved supplier/commercial policy  

**Prohibited:** substitute numerical proxies, including arbitrary revenue threshold, arbitrary discount percentage, arbitrary group-size threshold, arbitrary credit period, arbitrary liability value.

H-28 `250,000` sell threshold / `20%` margin floor remain **rejected Dev/Test artefacts**, not Owner rules.

```text
CPR-FLOOR = NOT AUTHORIZED
CPR-DISCOUNT = NOT AUTHORIZED
CPR-CREDIT = NOT AUTHORIZED
CPR-SIZE = NOT AUTHORIZED
CPR-LIABILITY = NOT AUTHORIZED
```

Implementation cannot safely encode unresolved commercial parameters. Qualitative category recording may be designed; parameter-dependent auto-trigger encoding may not.

```text
F1-C-04 = REMAINS F2 BLOCKER
```

Classification: `REQUIRES OWNER DECISION` + `REMAINS F2 BLOCKER` (parameter-dependent approval implementation).

---

### F1-C-05 — Approver role

H-25 establishes Commercial Director as commercial oversight / exception / escalation authority. H-27 §9 names Commercial Director, with an optional “designated commercial approver under the parameter register.” No named person or alternate title exists in the approved record.

This record **does not** invent another person's name or title. It **does not** infer that an unnamed employee has authority. Permissions are **not** implemented.

**Current approved governance model:** Commercial Director is the commercial approver for mandatory H-27 triggers.

Any future workflow that assigns a **different** designated approver requires a **new** governance decision. Until that decision exists, F2 must not encode a non-CD approver.

```text
F1-C-05 = CLOSED FOR CURRENT APPROVED GOVERNANCE MODEL
```

---

### F1-C-06 — UAT authority

H-34 §11.2 proposed Commercial Director as UAT authority; H-35 recorded the individual as **unnamed**. No appointment record exists.

* UAT authority is currently unnamed.
* UAT authority must be formally designated before F5 UAT.
* No UAT acceptance can be inferred from technical testing.
* No F2 authorization should imply UAT completion.
* No individual is invented here. Repository access is not appointment.

```text
F1-C-06 = REMAINS F2/F5 BLOCKER
```

Classification: `REQUIRES ROLE/APPOINTMENT` + `REMAINS F2 BLOCKER` for F5/UAT claims (and for any F2 grant that pretends UAT is complete).

---

### F1-C-07 — Technical increment owner

H-33 C-10 / H-34 F1-AC-17 require a named technical increment owner. None is recorded.

* Technical increment ownership is currently unresolved.
* A named responsible role/person must be established before controlled implementation.
* Technical implementation ownership must include accountability for implementation evidence, testing coordination, rollback preparation, and defect closure.
* No individual is invented. Repository access is not ownership.

This blocks **controlled implementation** as a whole, not only a subset of C1–C10.

```text
F1-C-07 = REMAINS F2 BLOCKER
```

Classification: `REQUIRES ROLE/APPOINTMENT` + `REMAINS F2 BLOCKER`.

---

### F1-C-08 — Commercial Parameter Register

```text
CPR-FLOOR = NOT AUTHORIZED
CPR-DISCOUNT = NOT AUTHORIZED
CPR-CREDIT = NOT AUTHORIZED
CPR-SIZE = NOT AUTHORIZED
CPR-LIABILITY = NOT AUTHORIZED
OR-04 = NO NUMERICAL TARGET AUTHORIZED
```

**Not inferred from:** H-28 250k / 20%; historical proposals; supplier practices; industry benchmarks; personal judgement; assumed company policy.

A future Owner decision may either:

1. authorize explicit parameter values, or  
2. authorize an implementation design that safely handles the **absence** of such values (category recording only; no invented numeric auto-triggers).

This record does **not** make that decision. No existing governance record authorizes either option as an F2 grant.

```text
F1-C-08 = REMAINS F2 BLOCKER
```

Classification: `REQUIRES OWNER DECISION` + `REMAINS F2 BLOCKER` (parameter-dependent implementation). Coupled with F1-C-04.

---

### F1-C-09 — DR-008

```text
DR-008 = DEFERRED
```

H-25 authorized OR-03 account types (including PCO). H-29 retained `strategicClassification` **field existence** as a visibility aid only; value rules remain DR-008. H-33 C-03 / H-35 F1-C-09 forbid silent close. H-34 trigger 6 must not close DR-008.

This record does **not** close DR-008 by inference. Full AC-010 capability (approved target / strategic / repeat / direct / agency **flag taxonomy**) is **not** claimable.

**Independent of DR-008 (may be designed without closing DR-008):** OR-03 including PCO; Market (15 values); SOURCE ≠ CHANNEL; qualification; loss catalogue; follow-up ownership; C4 overlap rule (F1-C-03); qualitative C7 categories; proposal send ≠ approval; booking identity; KPI from structured facts; repeat **reportability via prior won/booking** as already required by H-29 without closing DR-008.

**Dependent on DR-008 (blocked until Owner closes DR-008):** approved meaning and operational use of strategic / repeat / direct / agency flags as taxonomy; any claim that trigger 6 is a closed flag engine.

```text
F1-C-09 = REMAINS F2 BLOCKER FOR ANY CLAIM DEPENDENT ON DR-008
```

Classification: `REQUIRES OWNER DECISION` + `REMAINS F2 BLOCKER` (DR-008-dependent claims only).

---

### F1-C-10 — FX provider

H-27 §10.4 / H-34 §8: original supplier currency preserved; conversion must identify basis/date; **no FX provider selected**.

This record does **not** select a provider, API, rate source, refresh interval, or commercial FX policy.

**Requirements the eventual design must preserve:**

* FX source identity  
* FX rate  
* rate date/time  
* source/provider (when one is later authorized)  
* base currency  
* quote currency  
* conversion direction  
* rate snapshot associated with costing/proposal  
* auditability  

Identity of conversion (basis + date + currencies + snapshot) may be specified without a provider. **Provider-dependent** implementation (live feed, named source, refresh, policy) remains blocked.

```text
F1-C-10 = REMAINS F2 BLOCKER FOR PROVIDER-DEPENDENT IMPLEMENTATION
```

Classification: `REQUIRES OWNER DECISION` + `REMAINS F2 BLOCKER` (provider-dependent FX only).

---

### F1-C-11 — Specification ≠ implementation evidence

**Permanent governance rule:**

> A requirement, design specification, acceptance criterion, or governance document is not evidence that the corresponding application capability has been implemented, tested, accepted, or deployed.

Therefore:

* H-34 specification content cannot prove implementation.
* H-35 review cannot prove implementation.
* H-36 condition closure cannot prove implementation.
* F1 acceptance cannot prove implementation.
* Future F2 evidence must come from actual controlled implementation and testing.
* UAT must have its own evidence.
* Production readiness must have separate evidence.

H-28 Dev/Test demonstration remains labelled Dev/Test only. H-33 C-07 remains in force.

```text
F1-C-11 = CLOSED AS GOVERNANCE RULE
```

This does **not** create F2 evidence. It forbids treating documents as F2 evidence.

---

### F1-C-12 — Negotiation / C11+ boundary

Negotiation may be represented **only** insofar as required for the approved C1–C10 commercial workflow:

* proposal versioning  
* revision history  
* commercial follow-up  
* next-action tracking  
* status/lifecycle evidence  

Sent snapshots remain immutable (H-34 §2 step 13). A separate negotiation platform/module is **not** in scope. C11+ is **not** created. Domain J commercial analytics remain outside C1–C10.

```text
F1-C-12 = NOT A BLOCKER IF IMPLEMENTED STRICTLY WITHIN C1–C10 SCOPE
```

If a future increment proposes a distinct negotiation module or C11+, that increment is **out of authorized scope** and is not F1-covered.

---

## 4. F2 blocker register

| ID | Status | F2 impact | Required closure |
| --- | --- | --- | --- |
| F1-C-01 | Closed (`CLOSED BY DESIGN CLARIFICATION`) | None | Design correction recorded in this document; do not implement H-34 §2 steps 5→6 as sequence |
| F1-C-02 | Open (`REMAINS F2 BLOCKER`) | Blocks migration/ingest and historic-load claims | Explicit Owner migration decision (M0/M1/M2); M3 remains unauthorized |
| F1-C-03 | Closed (`CLOSED BY DESIGN CLARIFICATION`) | None as a design defect | Overlap/conflict rule specified; implementation evidence still F1-C-11 |
| F1-C-04 | Open (`REMAINS F2 BLOCKER`) | Blocks parameter-dependent approval implementation | Approved parameter treatment (values **or** authorized absence-handling); no numeric proxies |
| F1-C-05 | Closed for current model (`CLOSED FOR CURRENT APPROVED GOVERNANCE MODEL`) | None unless F2 assigns a non-CD approver | Future governance decision only if authority changes |
| F1-C-06 | Open (`REMAINS F2/F5 BLOCKER`) | Blocks F5/UAT; F2 must not imply UAT complete | Formal UAT authority designation |
| F1-C-07 | Open (`REMAINS F2 BLOCKER`) | Blocks controlled implementation | Named technical increment owner |
| F1-C-08 | Open (`REMAINS F2 BLOCKER`) | Blocks parameter-dependent implementation | Parameter values **or** approved alternative that handles absence |
| F1-C-09 | Open (`REMAINS F2 BLOCKER FOR ANY CLAIM DEPENDENT ON DR-008`) | Blocks DR-008-dependent claims (not all C1–C10) | DR-008 closure by Owner |
| F1-C-10 | Open (`REMAINS F2 BLOCKER FOR PROVIDER-DEPENDENT IMPLEMENTATION`) | Blocks provider-dependent FX implementation | FX provider decision (not selected here) |
| F1-C-11 | Closed (`CLOSED AS GOVERNANCE RULE`) | None as a design defect; remains an evidence constraint | Permanent evidence rule |
| F1-C-12 | Not a blocker (`NOT A BLOCKER IF IMPLEMENTED STRICTLY WITHIN C1–C10 SCOPE`) | None if versioning/follow-up only | Maintain C1–C10 boundary; no C11+ |

**Universal F2 gates that remain even after the closed design items:** F1-C-07 (named technical increment owner); H-31 Decision 5 still **IMPLEMENTATION NOT AUTHORIZED**; separate F2 grant; F1-C-11 evidence rule; Production/E1/commit/push separately gated.

---

## 5. F2 readiness rule

> Closing an F1 condition does not authorize F2.

Even if all design conditions are eventually closed:

```text
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
```

remain unchanged until a **separate** authorization decision is recorded. H-31 Decision 5 is **not** reversed by this document.

---

## 6. Remaining Owner / appointment / parameter decisions

| Item | Condition | Decision-maker | Not invented here |
| --- | --- | --- | --- |
| Migration strategy | F1-C-02 | Owner | M0/M1/M2 selection; M3 unauthorized |
| Numeric proxies / CPR values or absence-handling | F1-C-04 / F1-C-08 | Owner / management | No 250k/20%; no invented floors |
| UAT authority | F1-C-06 | Owner | No named individual |
| Technical increment owner | F1-C-07 | Owner | No named individual |
| DR-008 flag taxonomy | F1-C-09 | Owner | Remains DEFERRED |
| FX provider | F1-C-10 | Owner (separate) | No provider/API/policy |
| Non-CD commercial approver | F1-C-05 (only if changing model) | Owner | CD remains current authority |
| Implementation authorization | H-31 D5 | Owner | Still NO |

---

## 7. F1 status

Material conditions remain open (F1-C-02, F1-C-04, F1-C-06, F1-C-07, F1-C-08, F1-C-09, F1-C-10). F1 is **not** upgraded.

```text
GPTA-H-36 STATUS = F1 CONDITION REVIEW AND F2 BLOCKER REGISTER COMPLETED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F1 DESIGN COMPLETENESS = SUBSTANTIALLY COMPLETE — CONDITIONS BIND F2
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

OR-04 = NO NUMERICAL TARGET AUTHORIZED
CPR-FLOOR = NOT AUTHORIZED
CPR-DISCOUNT = NOT AUTHORIZED
CPR-CREDIT = NOT AUTHORIZED
CPR-SIZE = NOT AUTHORIZED
CPR-LIABILITY = NOT AUTHORIZED
250k/20% = REJECTED
M0 = WORKING ASSUMPTION — NOT OWNER-APPROVED
C11+ = NOT IN SCOPE
DR-008 = DEFERRED
NA-A-22 = OPEN
PATH B = HOLD
E1-D = FORMALLY PARKED / DEFERRED
E1-C = CONTROLLED PAUSE

NEXT ACTION = OWNER / GOVERNANCE DECISION PACK FOR REMAINING F2 BLOCKERS — DOCUMENTATION ONLY
```

Closed design items (F1-C-01, F1-C-03, F1-C-05, F1-C-11, F1-C-12) do **not** make the programme implementation-ready.

---

## 8. Next governance-controlled action

Determined from the blocker register:

1. **F1-C-07** blocks all controlled implementation until a technical increment owner is named.  
2. **F1-C-04 / F1-C-08** block parameter-dependent C7 encoding until values **or** an authorized absence-handling design is Owner-approved.  
3. **F1-C-02** blocks ingest/historic load until an explicit migration decision.  
4. **F1-C-06** blocks F5/UAT until authority is designated.  
5. **F1-C-09** and **F1-C-10** block only their dependent claims.

**Next action:** prepare an Owner/governance decision pack covering remaining F2 blockers, beginning with F1-C-07 and F1-C-04/F1-C-08. **Documentation only. No coding. F2 not authorized.**

Do not commence F2. Do not treat closed F1 conditions as implementation evidence.

---

## 9. Validation

| Check | Result |
| --- | --- |
| F1-C-01 through F1-C-12 addressed | **Yes** |
| Closed conditions have source evidence | **Yes** — H-17 PR-001; H-25 OR-01/OR-04-FU; H-27 §9–§10; H-33 C-07; H-35 register |
| Unresolved conditions remain explicit | **Yes** — C-02, C-04, C-06, C-07, C-08, C-09, C-10 |
| No numerical commercial parameters invented | **Yes** |
| No migration decision invented | **Yes** — M0 not approved |
| No FX provider invented | **Yes** |
| No UAT authority invented | **Yes** |
| No technical increment owner invented | **Yes** |
| DR-008 remains deferred | **Yes** |
| C11+ not introduced | **Yes** |
| 250k/20% remains rejected | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-36-f1-condition-closure-and-f2-blocker-register.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-35 historical bodies **not rewritten**.
