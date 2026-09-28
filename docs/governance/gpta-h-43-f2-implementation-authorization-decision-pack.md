# GPTA-H-43 — F2 Implementation Authorization Decision Pack

> **`OWNER DECISION PACK ONLY`**  
> **`NOT F2 AUTHORIZATION`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**  
> **`NO PROCUREMENT`** · **`NO PROVIDER / SUPPLIER CONTACT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T15:29:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

H-16–H-42 historical bodies are **not rewritten**. This pack does **not** infer authorization from its own existence.

---

## A. Purpose

GPTA-H-43 exists solely to present the completed F2 readiness position (H-42) to the Owner for an **explicit** authorization decision.

Three facts remain distinct:

1. **F2 may be presented** — H-42: `F2 MAY BE PRESENTED FOR OWNER AUTHORIZATION — NO AUTHORIZATION HAS BEEN GRANTED`.  
2. **F2 is not yet authorized** — `F2 = NOT AUTHORIZED`.  
3. **Implementation is not yet authorized** — H-31 Decision 5 = `IMPLEMENTATION NOT AUTHORIZED`.

The remaining gate is **authorization**, not design readiness. H-42 is **not** reinterpreted as an implementation grant.

This document does **not** begin F2, does **not** answer the Owner decision, and does **not** rank the options below.

---

## B. Current governance status

```text
GPTA-H-43 STATUS = F2 IMPLEMENTATION AUTHORIZATION DECISION PACK PREPARED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F2 ENTRY READINESS = SATISFIED FOR PRESENTATION
F2 = NOT AUTHORIZED
IMPLEMENTATION = NOT AUTHORIZED
OWNER F2 DECISION = PENDING
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
```

**H-42 entry matrix (authoritative starting state):** F1 specification accepted; F1 conditions closed or carried; Technical Increment Owner MET (Patrick Makundi); UAT Authority MET (Patrick Makundi); CPR / Path B MET for current design; Migration / M0 MET for F2 design; DR-008 DEFERRED; FX provider NOT APPLICABLE for current increment; C1–C10 boundary MET; Test/UAT evidence model MET as a governance model; Rollback approach MET as principle; Spec ≠ implementation evidence MET as permanent rule; remaining Owner decision = F2 / implementation authorization only.

---

## C. Owner decision requested

**Primary decision (exactly one):**

**Should F2 implementation of the approved C1–C10 commercial increment be authorized to begin in Dev/Test under the defined governance constraints?**

This pack does **not** answer that question.

### OPTION A — AUTHORIZE F2

If selected, implementation may commence **only** within the approved F2 scope and constraints in §D–§E. Production, E1, commit/push, procurement, ingest, C11+, FX provider, DR-008-dependent claims, and numerical CPR values remain outside that grant unless a **further** explicit decision says otherwise.

### OPTION B — DO NOT AUTHORIZE F2

If selected, F2 remains held and no implementation begins. The current repository state remains preserved. The programme remains at this governance gate.

No recommendation or ranking is provided between OPTION A and OPTION B.

---

## D. Proposed F2 scope

If later authorized, the implementation boundary is:

* C1–C10 only  
* Dev/Test only  
* No production  
* No E1 production authorization  
* No production deployment  
* No production migration  
* No production infrastructure  
* No procurement  
* No supplier/provider engagement  
* No C11+  
* No mailbox ingestion  
* No M3 migration  
* No FX provider implementation  
* No DR-008-dependent functionality  
* No numerical CPR values  
* Path B remains qualitative approval direction  
* M0 means controlled coexistence / no ingest  
* Existing Office / Excel / Outlook / Gmail / WhatsApp / phone workflows remain operationally relevant during coexistence  

Scope is **not** expanded by this pack. Carry-in design constraints from H-36 remain: opportunity owner at intake / before qualification (F1-C-01); recorded supplier-rate overlap/conflict resolution (F1-C-03). Combined-role evidence split from H-41 remains.

---

## E. Mandatory governance constraints

| Control | Requirement |
| --- | --- |
| Ownership timing | Opportunity owner established at intake / before qualification |
| Qualification | OR-01 / OR-01-B rules |
| Loss taxonomy | LR-01–LR-12 |
| Account classification | Approved OR-03 account types |
| Market | Separate from buyer / account type |
| Source | One primary SOURCE, optional secondaries within approved rule |
| Channel | Separate from SOURCE |
| Follow-up | Opportunity owner accountable through close |
| Proposal | Approved commercial version before send |
| Exceptional approval | Approved H-27 categories |
| CPR | No numerical floor authorized |
| Supplier rates | Approved source / version / season / currency / expiry / snapshot controls |
| Migration | M0 only; no ingest |
| DR-008 | Deferred; no dependent claims |
| FX | Provider out of current scope |
| Evidence | Specification does not constitute implementation evidence |
| Scope | C1–C10 only |
| Environment | Dev/Test only |
| UAT | Patrick Makundi appointed; UAT evidence remains distinct from implementation ownership evidence |
| Production | Not authorized |

---

## F. F2 deliverables expected if authorized

Governance-level only. **No code is written here.**

If OPTION A is later selected, F2 would be expected to implement and evidence the approved F1 requirements for C1–C10, including the commercial spine already specified:

* C1 CRM identity, OR-03 including PCO, Market, SOURCE ≠ CHANNEL  
* C2 opportunity ownership, qualification ≠ pipeline stage  
* C3 RFP intake, clarification stamps, follow-up binding  
* C4 supplier rates with snapshot, expiry, and recorded overlap resolution  
* C5 structured programme  
* C6 costing with sent snapshot  
* C7 Path B qualitative exceptional / unusual / significant categories and Commercial Director approval with audit  
* C8 proposal identity vs Office documents; send ≠ approval  
* C9 booking origin chain or closed-lost with LR catalogue  
* C10 KPI facts from structured events, no numerical targets  

Work remains requirement/control-level until a grant exists. Disposable / Dev/Test data only. No live customer data. No production cutover.

---

## G. Evidence standard

* F1 documentation is **not** implementation evidence.  
* H-42 readiness is **not** implementation evidence.  
* H-43 is **not** implementation evidence.  
* Future F2 work must generate **actual** implementation evidence.  
* Future testing must distinguish implementation evidence, test evidence, and UAT evidence.  
* UAT acceptance must remain separately attributable even though Patrick Makundi holds both Technical Increment Owner and UAT Authority roles.  
* No claim of operational readiness may be made solely from specification documents.  

H-36 F1-C-11 remains permanent.

---

## H. Authorization consequence

**If Owner selects AUTHORIZE (OPTION A):**

* F2 may begin under the stated constraints.  
* Implementation remains limited to the approved scope.  
* Any scope expansion requires a new governance decision.  
* Production remains separately gated.  
* Commit/push remain governed separately unless explicitly granted.

**If Owner selects DO NOT AUTHORIZE (OPTION B):**

* No F2 implementation begins.  
* Current repository state remains preserved.  
* The programme remains at the current governance gate.

Authorization is **not** inferred from the existence of this document.

---

## I. Owner Decision Record

Do **not** pre-fill the decision. Blank fields are intentional.

```text
OWNER F2 DECISION

Decision:
[ ] AUTHORIZE F2 IMPLEMENTATION
[ ] DO NOT AUTHORIZE F2 IMPLEMENTATION

Scope:
Approved C1–C10 Dev/Test increment only, subject to all stated constraints.

Owner:
Patrick Makundi

Date:
____________________

Notes / Conditions:
__________________________________________________
__________________________________________________
__________________________________________________

Authorization Status:
____________________
```

```text
OWNER F2 DECISION = PENDING
```

---

## J. Relationship to H-31

* H-31 Decision 5 remains `IMPLEMENTATION NOT AUTHORIZED` until superseded by a **subsequent explicit Owner authorization**.  
* GPTA-H-43 does **not** supersede H-31.  
* Only a subsequent explicit Owner decision can change the authorization state.

---

## K. Relationship to H-42

* H-42 established F2 **presentation** readiness.  
* H-43 converts that readiness into a formal Owner **decision point**.  
* No implementation activity is authorized by H-43 itself.

```text
H-42: F2 MAY BE PRESENTED FOR OWNER AUTHORIZATION — NO AUTHORIZATION HAS BEEN GRANTED
H-43: DECISION PACK PREPARED — OWNER F2 DECISION = PENDING
```

---

## Next governance-controlled action

Owner completes §I. Until then, F2 and implementation remain unauthorized.

```text
NEXT ACTION = OWNER COMPLETES H-43 F2 AUTHORIZATION DECISION — DOCUMENTATION ONLY
```

Do not commence F2. Do not code.

---

## Governance status

```text
GPTA-H-43 STATUS = F2 IMPLEMENTATION AUTHORIZATION DECISION PACK PREPARED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F2 ENTRY READINESS = SATISFIED FOR PRESENTATION
F2 = NOT AUTHORIZED
IMPLEMENTATION = NOT AUTHORIZED
OWNER F2 DECISION = PENDING
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

TECHNICAL INCREMENT OWNER = APPOINTED — PATRICK MAKUNDI
UAT AUTHORITY = APPOINTED — PATRICK MAKUNDI
COMBINED ROLE = YES
PATH B = QUALITATIVE APPROVAL DIRECTION
M0 = CONTROLLED COEXISTENCE — NO INGEST
DR-008 = DEFERRED
FX PROVIDER = OUT OF CURRENT SCOPE
C11+ = NOT IN SCOPE
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
```

---

## Validation

| Check | Result |
| --- | --- |
| Owner decision left blank / pending | **Yes** |
| No option ranked or selected | **Yes** |
| H-31 Decision 5 not superseded | **Yes** |
| H-42 not reinterpreted as a grant | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-43-f2-implementation-authorization-decision-pack.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-42 historical bodies **not rewritten**.
