# GPTA-H-37 — Remaining F2 Blocker Owner Decision Pack

> **`GOVERNANCE DECISION-READINESS ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**  
> **`NO PROCUREMENT`** · **`NO PROVIDER / SUPPLIER CONTACT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T14:55:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Purpose:** Present Owner/governance decisions required to close remaining F2 blockers recorded by [`gpta-h-36-f1-condition-closure-and-f2-blocker-register.md`](gpta-h-36-f1-condition-closure-and-f2-blocker-register.md). This pack does **not** record Owner answers. Blank Owner fields are intentional.

**Sources (read, not rewritten):** H-25; H-27; H-28; H-29; H-30; H-31; H-32; H-33; H-34; H-35; H-36; dependency register; parallel-work register. Standalone `gpta-h-20/21/22-*.md` remain **absent** (content inside H-19).

```text
RESOLVING AN F2 BLOCKER ≠ F2 AUTHORIZATION
RESOLVING AN F2 BLOCKER ≠ IMPLEMENTATION AUTHORIZATION
RESOLVING AN F2 BLOCKER ≠ CODING
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
```

---

## 1. Repository and programme position

```text
Branch = master
HEAD = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index = empty
Working tree = intentionally dirty (preserved)

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
GPTA-H-36 = COMPLETED
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
E1-C = CONTROLLED PAUSE
E1-D = FORMALLY PARKED / DEFERRED
PATH B = HOLD
NA-A-22 = OPEN
DR-008 = DEFERRED
NEXT_INCREMENT = NONE_AUTHORIZED
```

H-31 Decision 5 is **not** reinterpreted: `IMPLEMENTATION NOT AUTHORIZED`.

---

## 2. Governing rule

> Closing or resolving an F2 blocker is not equivalent to authorizing F2 implementation. F1 remains ACCEPTED WITH CONDITIONS until the applicable governance gate is formally accepted, and implementation remains unauthorized unless separately authorized.

Even if every decision in this pack is later completed:

```text
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
```

until a **separate** authorization decision is recorded. H-36 closed F1-C-01, F1-C-03, F1-C-05, F1-C-11, and F1-C-12 as design items; those closures are **not** F2 grants and are **not** reopened here.

Where no Owner decision exists, status is:

```text
OPEN — OWNER DECISION REQUIRED
```

Recommendations below are **governance considerations only**. They are **not** approved decisions.

---

## 3. Decision table

| Blocker | Decision required | Current status | F2 impact | Owner action |
| --- | --- | --- | --- | --- |
| **F1-C-07** Technical increment owner | Name a responsible role/person with written accountability | `DECISION REQUIRED — NO TECHNICAL INCREMENT OWNER NAMED` | Blocks **all** controlled implementation | Appoint; do not infer from Git history |
| **F1-C-04** Numeric proxies | Path A (explicit CPR values) **or** Path B (no numerical thresholds) | `OPEN — OWNER DECISION REQUIRED` | Blocks parameter-dependent approval implementation | Select Path A or Path B; do not invent values |
| **F1-C-08** CPR register | Same treatment as F1-C-04 | `OPEN — OWNER DECISION REQUIRED` | Blocks parameter-dependent implementation | Authorize values **or** authorized absence-handling |
| **F1-C-02** Migration strategy | Explicit M0 / M1 / M2 (M3 unauthorized unless separately approved) | `OPEN — OWNER DECISION REQUIRED` · M0 = working assumption only | Blocks migration/ingest and historic-load claims | Select strategy; selection ≠ implementation grant |
| **F1-C-06** UAT authority | Formally designate UAT authority | `DECISION REQUIRED` · unnamed | Blocks F5/UAT; F2 must not imply UAT complete | Appoint; do not auto-designate Commercial Director |
| **F1-C-09** DR-008 | Keep deferred **or** bring flag taxonomy back into scope | `DEFERRED` | Blocks DR-008-dependent claims only | Decision item **only if** flags/reporting are brought into scope |
| **F1-C-10** FX provider | Keep unresolved **or** later approve provider-dependent FX scope | Unselected | Blocks provider-dependent FX implementation | Do not select a provider here; no external engagement |

---

## 4. Priority 1 — F1-C-07 Technical increment owner

### Decision statement

A **named** technical increment owner is required before controlled implementation can begin.

```text
DECISION REQUIRED — NO TECHNICAL INCREMENT OWNER NAMED
```

No person is invented. An existing developer, contractor, or repository contributor is **not** appointed merely because they appear in Git history or repository files.

### Why it blocks F2

H-33 C-10 / H-34 F1-AC-17 / H-36 F1-C-07: controlled implementation requires a named accountable owner for the increment. Without that appointment, F2 has no accountable party for boundary, evidence, test coordination, rollback, or governance compliance.

### Minimum responsibilities

* Technical increment accountability  
* Implementation boundary (C1–C10 only; no C11+)  
* Evidence production (implementation evidence ≠ specification)  
* Test execution coordination  
* Rollback coordination  
* Governance compliance (H-31 Decision 5 still not an F2 grant)

### Appointment requirement

Written Owner appointment of a named role **and** person (or named role with a named incumbent). Title-only without an incumbent does not close F1-C-07.

### Evidence required

Owner-signed or Owner-recorded appointment naming the person/role, effective date, and the responsibilities above.

### Current status

`OPEN — OWNER DECISION REQUIRED`

**Governance consideration (not a decision):** leave this as the first Owner item; F2 cannot start while it remains unnamed.

---

## 5. Priority 2 — F1-C-04 and F1-C-08 Parameter treatment

Treat together. Both concern implementation-dependent commercial approval parameters.

```text
NO NUMERICAL CPR VALUE IS CURRENTLY AUTHORIZED.

CPR-FLOOR = NOT AUTHORIZED
CPR-DISCOUNT = NOT AUTHORIZED
CPR-CREDIT = NOT AUTHORIZED
CPR-SIZE = NOT AUTHORIZED
CPR-LIABILITY = NOT AUTHORIZED
OR-04 = NO NUMERICAL TARGET AUTHORIZED
250k/20% = REJECTED DEV/TEST ARTEFACT
```

Do **not** invent values. Do **not** infer from H-28, historical proposals, supplier practice, industry benchmarks, or assumed policy.

Unauthorized parameters include, but are not limited to: `CPR-FLOOR`, `CPR-DISCOUNT`, `CPR-CREDIT`, `CPR-SIZE`, `CPR-LIABILITY`, and any equivalent numerical proxy for exceptional / unusual / significant commercial approval.

### Path A — Owner authorizes explicit parameter values

If selected **later**, the Owner must provide/approve:

* each parameter value  
* currency/unit  
* applicability (when the trigger fires)  
* effective dates  
* who may change the value  

**Implementation impact:** C7 may encode those authorized values as triggers. Unapproved values must not be coded.

**Evidence required:** Owner/management approval record of the values.

**F2 consequence:** Path A does **not** authorize F2. It only removes the F1-C-04/F1-C-08 parameter-value gap for a later F2 request.

### Path B — Owner authorizes implementation without numerical CPR thresholds

If selected **later**, the design must rely on H-27 qualitative/documented approval categories and Commercial Director approval (H-25 / H-36 F1-C-05 current model). No invented numerical proxies.

**Implementation impact:** C7 may record which qualitative category applied and CD decision; it must **not** auto-fire on invented revenue, discount %, group size, credit period, or liability numbers.

**Evidence required:** Owner authorization that absence of CPR values is the approved treatment for the increment.

**F2 consequence:** Path B does **not** authorize F2. It only authorizes a design that safely handles the absence of values.

### Path selection

**Neither Path A nor Path B is selected.** No existing governance record chooses either as an F2-ready authorization. H-27 left values as a placeholder requiring separate management approval.

**Current status:** `OPEN — OWNER DECISION REQUIRED`

**Governance consideration (not a decision):** Path B is consistent with the current fact that no numerical CPR value is authorized; consistency is **not** selection.

---

## 6. Priority 3 — F1-C-02 Migration strategy

```text
M0 = F1 WORKING ASSUMPTION ONLY
M0 ≠ OWNER-APPROVED MIGRATION DECISION
M1 = NOT APPROVED
M2 = NOT APPROVED
M3 = UNAUTHORIZED UNLESS SEPARATELY APPROVED
NO MIGRATION OR INGEST MAY BEGIN
```

Existing Office/Excel records remain outside the EOS source-of-truth implementation until migration is separately approved.

### Choices (none selected)

| Option | Meaning |
| --- | --- |
| **M0** | No historic Office/Excel ingest; controlled coexistence; EOS starts at go-live capture |
| **M1** | Controlled / manual migration of a defined set |
| **M2** | Staged migration |
| **M3** | Automatic ingest — **remains unauthorized** unless separately approved |

Selecting M0, M1, or M2 is a **governance decision only**. It does **not** authorize implementation, coding, ingest execution, or F2.

A new-capture-only increment still requires an **explicit** Owner statement that historic ingest is out of scope. Silence must not be read as M0 approval.

**Current status:** `OPEN — OWNER DECISION REQUIRED`

**Governance consideration (not a decision):** M0 matches the F1 working assumption and is the lowest ingest-risk option; that is **not** Owner approval of M0.

---

## 7. Priority 4 — F1-C-06 UAT authority

```text
DECISION REQUIRED
```

UAT authority remains **unnamed**. This blocks controlled UAT evidence and **F5/UAT**. F2 authorization must **not** imply UAT completion. Technical testing is not UAT acceptance.

Do **not** invent a name or title. Do **not** designate the Commercial Director automatically. H-34 proposed CD as UAT authority; that was a **proposal**, not an Owner appointment.

### Minimum authority responsibilities

* Acceptance-criteria review  
* UAT coordination  
* Acceptance or rejection of UAT evidence  
* Defect disposition / escalation  
* Formal UAT sign-off **or** documented waiver where governance permits  

### Evidence required

Owner-recorded appointment of a named UAT authority (person and/or role with incumbent), or a documented waiver that a stated increment is Dev/Test-only and F5 is deferred.

**Current status:** `OPEN — OWNER DECISION REQUIRED`

---

## 8. Priority 5 — F1-C-09 DR-008

```text
DR-008 = DEFERRED
```

H-37 does **not** close DR-008.

**What remains deferred:** approved meaning and operational use of target / strategic / repeat / direct / agency **flag taxonomy** (full AC-010).

**Still independently structured (not dependent on closing DR-008):** OR-03 including PCO; Market (15 values); SOURCE ≠ CHANNEL; repeat **reportability via prior won/booking** (H-29).

H-34 Trigger 6 (strategic/high-risk accounts) must **not** be treated as DR-008 closure. `strategicClassification` field existence remains a visibility aid only.

DR-008 becomes an Owner decision item **only if** related reporting/flag requirements are brought back into scope. Until then, the correct action is to **leave it deferred**.

**Current status:** `DEFERRED` — not closed; not selected for return-to-scope.

**Owner Decision field below** remains blank unless the Owner later brings flags into scope.

---

## 9. Priority 6 — F1-C-10 FX provider

FX provider remains **unresolved**. No provider is selected. No API, rate source, refresh interval, or commercial FX policy is invented. **No external provider engagement is authorized.**

Provider-dependent FX implementation remains **blocked**.

If FX later becomes implementation scope, governance would need to approve: provider identity; source; rate timestamp; currency-pair handling; fallback behavior; auditability; snapshot association with costing/proposal (H-36 F1-C-10 requirements). That approval is **not** this pack.

Identity of conversion (basis + date + currencies + snapshot) may remain a specified requirement without a provider. Naming a live source is out of scope here.

**Current status:** Unselected — `OPEN — OWNER DECISION REQUIRED` **only if** provider-dependent FX is brought into increment scope; otherwise keep unresolved.

---

## 10. Owner Decision Register

Do **not** fill Owner Decision fields with invented values. Options listed are for later Owner use.

### Decision 1 — Technical Increment Owner (F1-C-07)

| Field | Record |
| --- | --- |
| Decision required | Name the technical increment owner (person and role) |
| Options | (a) Appoint a named person/role now; (b) defer appointment (F2 remains blocked) |
| Governance consideration (not a decision) | Appointment is the universal F2 gate; Git contributors are not appointees |
| Owner decision | |
| Evidence/record required | Written appointment: name, role, responsibilities, effective date |
| Status | `OPEN — OWNER DECISION REQUIRED` · `DECISION REQUIRED — NO TECHNICAL INCREMENT OWNER NAMED` |

### Decision 2 — CPR Parameter Treatment (F1-C-04 / F1-C-08)

| Field | Record |
| --- | --- |
| Decision required | Path A (explicit values) **or** Path B (no numerical CPR thresholds) |
| Options | **Path A** — Owner supplies/approves CPR values and applicability; **Path B** — qualitative categories + Commercial Director approval; no invented proxies |
| Governance consideration (not a decision) | Path B is consistent with `NO NUMERICAL CPR VALUE IS CURRENTLY AUTHORIZED`; consistency ≠ selection |
| Owner decision | |
| Evidence/record required | Path A: approved values, units, applicability, effective dates. Path B: written authorization to operate without numerical CPR thresholds |
| Status | `OPEN — OWNER DECISION REQUIRED` |

### Decision 3 — Migration Strategy (F1-C-02)

| Field | Record |
| --- | --- |
| Decision required | Explicit migration strategy |
| Options | **M0** no migration / controlled coexistence; **M1** controlled/manual; **M2** staged; **M3** automatic ingest (**unauthorized** unless separately approved) |
| Governance consideration (not a decision) | M0 is the F1 working assumption only; do not treat silence as M0 approval |
| Owner decision | |
| Evidence/record required | Written selection of M0, M1, or M2 (or separate M3 approval). Selection ≠ ingest execution grant |
| Status | `OPEN — OWNER DECISION REQUIRED` |

### Decision 4 — UAT Authority (F1-C-06)

| Field | Record |
| --- | --- |
| Decision required | Formally designate UAT authority, or document a permitted F5 waiver |
| Options | (a) Appoint a named UAT authority; (b) document F5 deferral/waiver for a stated Dev/Test-only increment; (c) leave unnamed (F5 blocked) |
| Governance consideration (not a decision) | H-34 proposed Commercial Director; that proposal is **not** an appointment |
| Owner decision | |
| Evidence/record required | Named appointment **or** documented waiver |
| Status | `OPEN — OWNER DECISION REQUIRED` · `DECISION REQUIRED` |

### Decision 5 — DR-008 Scope / Return Decision (F1-C-09)

| Field | Record |
| --- | --- |
| Decision required | Keep **DEFERRED**, or later bring flag taxonomy into scope |
| Options | (a) Remain deferred (current); (b) return flag taxonomy to scope (then a separate DR-008 decision is required) |
| Governance consideration (not a decision) | Leave deferred unless AC-010 flags are explicitly needed for the increment |
| Owner decision | |
| Evidence/record required | If (a): none beyond this pack. If (b): separate Owner closure of DR-008 — **not performed here** |
| Status | `DEFERRED` |

### Decision 6 — FX Provider / FX Scope (F1-C-10)

| Field | Record |
| --- | --- |
| Decision required | Keep provider unselected, or later approve provider-dependent FX scope |
| Options | (a) Keep unresolved / out of increment; (b) later approve provider identity, source, timestamp, pairs, fallback, auditability |
| Governance consideration (not a decision) | Keep unresolved unless the increment claims live FX conversion |
| Owner decision | |
| Evidence/record required | If (b): separate provider decision. **No provider contact authorized** |
| Status | Unselected · `OPEN — OWNER DECISION REQUIRED` only if brought into scope |

---

## 11. What this pack does not do

* Does not start F2.  
* Does not authorize implementation.  
* Does not reverse H-31 Decision 5.  
* Does not upgrade F1.  
* Does not name a technical owner or UAT authority.  
* Does not select Path A or Path B.  
* Does not approve M0/M1/M2 or authorize M3.  
* Does not close DR-008.  
* Does not select an FX provider.  
* Does not invent CPR values.  
* Does not authorize production, deployment, procurement, or external engagement.

---

## 12. Acceptance criteria

| ID | Criterion | Result |
| --- | --- | --- |
| H37-AC-01 | All remaining F2 blockers explicitly registered | **MET** — F1-C-07, C-04, C-08, C-02, C-06, C-09, C-10 |
| H37-AC-02 | No unauthorized numerical CPR values introduced | **MET** |
| H37-AC-03 | No technical owner invented | **MET** |
| H37-AC-04 | No UAT authority invented | **MET** |
| H37-AC-05 | Migration remains unapproved unless explicitly decided | **MET** — none selected |
| H37-AC-06 | DR-008 remains deferred | **MET** |
| H37-AC-07 | FX provider remains unselected | **MET** |
| H37-AC-08 | H-31 implementation authorization unchanged | **MET** — Decision 5 = `IMPLEMENTATION NOT AUTHORIZED` |
| H37-AC-09 | F1 remains ACCEPTED WITH CONDITIONS | **MET** |
| H37-AC-10 | F2 remains NOT AUTHORIZED | **MET** |
| H37-AC-11 | No application/schema/data/infrastructure implementation | **MET** |
| H37-AC-12 | Index empty; no commit/push | **MET** at creation (validated after write) |

H-37-AC-* record **pack completeness**, not Owner decisions and not F2 evidence (H-36 F1-C-11).

---

## 13. Next governance-controlled action

Owner completes Decision Register items 1–4 as a minimum for any later F2 *request* (F1-C-07 is universal; F1-C-04/C-08 for C7 encoding; F1-C-02 before ingest; F1-C-06 before F5). Items 5–6 remain deferred/unselected unless brought into scope.

Completing this pack, or later recording Owner answers, still **does not** authorize F2. A separate implementation-authorization decision remains required.

```text
NEXT ACTION = OWNER COMPLETION OF H-37 DECISION REGISTER — DOCUMENTATION ONLY
```

---

## 14. Governance status

```text
GPTA-H-37 STATUS = REMAINING F2 BLOCKER OWNER DECISION PACK COMPLETED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
OR-04 = NO NUMERICAL TARGET AUTHORIZED
NO NUMERICAL CPR VALUE IS CURRENTLY AUTHORIZED
M0 = WORKING ASSUMPTION — NOT OWNER-APPROVED
DR-008 = DEFERRED
FX PROVIDER = UNSELECTED
C11+ = NOT IN SCOPE
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
```

---

## 15. Validation

| Check | Result |
| --- | --- |
| Remaining F2 blockers registered | **Yes** |
| Owner Decision fields left blank | **Yes** |
| No numerical CPR values invented | **Yes** |
| No technical owner invented | **Yes** |
| No UAT authority invented | **Yes** |
| No migration selected | **Yes** |
| DR-008 deferred | **Yes** |
| FX provider unselected | **Yes** |
| H-31 Decision 5 unchanged | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-37-remaining-f2-blocker-owner-decision-pack.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-36 historical bodies **not rewritten**.
