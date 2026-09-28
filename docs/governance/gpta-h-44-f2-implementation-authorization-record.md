# GPTA-H-44 — F2 Implementation Authorization Record

> **`F2 AUTHORIZATION RECORD`**  
> **`IMPLEMENTATION EXECUTION IS A SEPARATE SUBSEQUENT STEP`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE IN THIS RECORD`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO DEPLOYMENT`** · **`NO PROCUREMENT`** · **`NO PROVIDER CONTACT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T15:34:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

H-16–H-43 historical bodies are **not rewritten**. This record does **not** begin application implementation.

---

## A. Authorization status

**Authoritative Owner decision (recorded exactly):**

> AUTHORIZE F2 IMPLEMENTATION — C1–C10 Dev/Test increment only, subject to all H-43 constraints.

```text
GPTA-H-44 STATUS = F2 IMPLEMENTATION AUTHORIZED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F2 ENTRY READINESS = SATISFIED
F2 = AUTHORIZED
IMPLEMENTATION = AUTHORIZED — WITHIN F2 SCOPE ONLY
OWNER F2 DECISION = AUTHORIZE F2
H-31 DECISION 5 = SUPERSEDED FOR THE AUTHORIZED F2 SCOPE
```

H-44 supersedes H-31 Decision 5 **only** to the extent necessary to authorize the specifically defined F2 increment (C1–C10 Dev/Test, H-43 constraints). It does **not** imply production authorization, E1 authorization, procurement, ingest, C11+, or any other scope expansion.

---

## B. H-43 transition

```text
H-43:
F2 MAY BE PRESENTED — AUTHORIZATION PENDING

H-44:
F2 AUTHORIZED — C1–C10 DEV/TEST ONLY
```

H-44 is the explicit Owner decision that changes the authorization state. H-43 remains the decision pack; it is not itself a grant.

---

## C. Authorized scope

### Included

* C1–C10 only  
* Dev/Test environment  
* Approved Commercial Growth & Sales Effectiveness requirements  
* H-29 approved business rules  
* Approved SoR  
* Approved F0/F1 design baseline  
* F1 conditions as carried into F2 (H-36 F1-C-01 ownership timing; F1-C-03 rate overlap/conflict rule; Path B; M0)  
* Required implementation evidence  
* Required Dev/Test validation  
* Required UAT preparation/evidence under the approved governance model  

### Explicitly excluded

* C11+  
* Production implementation  
* Production deployment  
* Production infrastructure  
* Production migration  
* Production data changes  
* E1 production authorization  
* M3 migration  
* Mailbox ingestion  
* Automatic email ingestion  
* Procurement  
* Supplier/provider engagement  
* FX provider implementation  
* DR-008-dependent functionality  
* Numerical CPR thresholds  
* Any unapproved new business rule  
* Any expansion of the approved commercial scope  

The authorization is **not** broadened beyond this list.

---

## D. Mandatory F2 constraints

These remain **binding**:

| Control | Binding requirement |
| --- | --- |
| Environment | Dev/Test only |
| C-boundary | C1–C10 only |
| Ownership | Opportunity owner established at intake / before qualification |
| Qualification | OR-01 / OR-01-B |
| Loss | LR-01–LR-12 |
| Account | Approved OR-03 account types |
| Market | Separate from buyer / account type |
| Source | Approved SOURCE model |
| Channel | Separate from SOURCE |
| Follow-up | Opportunity owner accountable through close |
| Proposal | Approved commercial version |
| Exceptional approvals | H-27 approval categories |
| CPR | No numerical CPR values |
| Supplier rates | Approved rate source / version / season / currency / expiry / snapshot controls |
| Migration | M0 controlled coexistence; no ingest |
| DR-008 | Deferred |
| FX | Out of current scope |
| Evidence | Specification is not implementation evidence |
| C11+ | Not authorized |
| Production | Not authorized |
| Procurement | Not authorized |
| Supplier engagement | Not authorized |

---

## E. Role assignments

### Technical Increment Owner

Patrick Makundi

### UAT Authority

Patrick Makundi

### Combined role

YES — explicitly authorized previously (H-41).

Evidence distinction **preserved**:

* Technical implementation evidence must demonstrate what was implemented.  
* UAT evidence must independently demonstrate acceptance against UAT criteria.  
* The combined appointment does **not** allow implementation evidence to substitute for UAT acceptance evidence.

---

## F. F2 implementation principles

1. Implement only requirements already approved through H-29 / H-31 / H-42 / H-43.  
2. Do not introduce new business rules without a new governance decision.  
3. Do not use implementation activity to silently resolve unresolved governance questions.  
4. Preserve the approved SoR.  
5. Preserve the approved commercial workflow.  
6. Preserve the C1–C10 boundary.  
7. Treat existing Office / Excel / Outlook / Gmail / WhatsApp / phone workflows as part of the controlled coexistence environment.  
8. Do not introduce mailbox ingestion.  
9. Do not introduce M3 migration.  
10. Do not select an FX provider.  
11. Do not introduce numerical CPR thresholds.  
12. Do not implement DR-008-dependent functionality.  
13. Do not claim production readiness from Dev/Test evidence.  
14. Do not treat F1 documentation as implementation evidence.

---

## G. Required F2 evidence

Future F2 implementation must produce evidence sufficient to demonstrate:

* requirements implemented  
* C1–C10 boundary respected  
* business rules implemented as approved  
* SoR implemented as approved  
* relevant workflow transitions  
* qualification behavior  
* loss classification  
* source/channel separation  
* follow-up ownership  
* approval controls  
* supplier-rate controls  
* snapshot behavior  
* KPI / structured commercial facts  
* security / role controls where applicable  
* Dev/Test validation  
* defect / remediation evidence where applicable  
* UAT evidence  
* rollback / readiness evidence as required by the F2/F5 governance sequence  

**None of the above is claimed as already demonstrated** merely because authorization has been granted. H-36 F1-C-11 remains: specification ≠ implementation evidence. H-28 Dev/Test demonstration remains labelled Dev/Test only and is **not** this increment’s completion evidence.

---

## H. F2 does not authorize production

> F2 authorization is a Dev/Test implementation authorization only.

It does **not** authorize:

* production deployment  
* production migration  
* production infrastructure  
* production data loading  
* production operations  
* E1 production  
* procurement  
* supplier engagement  

Those remain separately governed gates. E1 remains **NOT APPROVED / BLOCKED**. NA-A-22 remains **OPEN**. ADR-0006 / DP-0006 remain **OPEN**.

---

## I. Commit / push governance

F2 authorization is **not** automatic permission to commit or push.

Existing repository governance controls remain in force. **This task must not commit or push.** Future implementation commits must follow the applicable repository governance and authorization process.

```text
COMMIT = NOT GRANTED BY THIS RECORD
PUSH = NOT GRANTED BY THIS RECORD
```

---

## J. Implementation execution

This record **authorizes** F2. It does **not execute** F2.

```text
IMPLEMENTATION EXECUTION = NOT STARTED IN THIS RECORD
NEXT ACTION = F2 IMPLEMENTATION EXECUTION MAY COMMENCE AS A SEPARATE SUBSEQUENT STEP — WITHIN H-44 SCOPE ONLY
```

---

## K. Governance status

```text
GPTA-H-44 STATUS = F2 IMPLEMENTATION AUTHORIZED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F2 ENTRY READINESS = SATISFIED
F2 = AUTHORIZED
IMPLEMENTATION = AUTHORIZED — C1–C10 DEV/TEST ONLY

TECHNICAL INCREMENT OWNER = PATRICK MAKUNDI
UAT AUTHORITY = PATRICK MAKUNDI
COMBINED ROLE = YES

M0 = CONTROLLED COEXISTENCE / NO INGEST
PATH B = QUALITATIVE CPR DIRECTION / NO NUMERICAL VALUES
DR-008 = DEFERRED
FX PROVIDER = OUT OF SCOPE
C11+ = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
PROCUREMENT = NOT AUTHORIZED

OWNER F2 DECISION = AUTHORIZE F2
H-31 DECISION 5 = SUPERSEDED FOR AUTHORIZED F2 SCOPE

COMMIT = NOT GRANTED BY THIS RECORD
PUSH = NOT GRANTED BY THIS RECORD
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
```

---

## L. Validation

| Check | Result |
| --- | --- |
| Authorization recorded exactly as issued | **Yes** — C1–C10 Dev/Test only, H-43 constraints |
| Scope not broadened | **Yes** |
| Production / procurement / C11+ / ingest / FX / DR-008 / numerical CPR excluded | **Yes** |
| H-31 D5 superseded only for authorized F2 scope | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-44-f2-implementation-authorization-record.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-43 historical bodies **not rewritten**.
