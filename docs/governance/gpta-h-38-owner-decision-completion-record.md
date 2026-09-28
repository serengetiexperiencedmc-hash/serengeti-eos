# GPTA-H-38 — Owner Decision Completion Record

> **`GOVERNANCE DIRECTION ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**  
> **`NO PROCUREMENT`** · **`NO PROVIDER / SUPPLIER CONTACT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T15:00:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Subject:** Owner Decision Completion Record for the six open items in [`gpta-h-37-remaining-f2-blocker-owner-decision-pack.md`](gpta-h-37-remaining-f2-blocker-owner-decision-pack.md).

H-16–H-37 historical bodies are **not rewritten**. No fictional signatures. No invented names. No inferred appointments from Git history.

---

## Decision boundary

> These decisions resolve governance direction only. They do not authorize F2, implementation, coding, schema changes, migrations, data movement, infrastructure work, production deployment, procurement, or supplier/provider engagement.

```text
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
F1 = ACCEPTED WITH CONDITIONS
F2 = NOT AUTHORIZED
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
```

A decision recorded here must **not** be interpreted as implementation authorization, F2 authorization, application development authorization, migration authorization, infrastructure authorization, production authorization, or procurement authorization.

---

## 1. Repository and programme position

```text
Branch = master
HEAD = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index = empty
Working tree = intentionally dirty (preserved)

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
GPTA-H-37 = COMPLETED (decision-readiness pack; Owner fields were blank)
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
PATH B (GPTA-H-01) = HOLD
E1-C = CONTROLLED PAUSE
E1-D = FORMALLY PARKED / DEFERRED
NEXT_INCREMENT = NONE_AUTHORIZED
```

---

## 2. Decision table

| ID | Decision | Owner Decision | Status | Implementation effect |
| --- | --- | --- | --- | --- |
| F1-C-07 | Technical increment owner | Person not yet named | Open | Blocks controlled implementation |
| F1-C-04 / F1-C-08 | CPR treatment | Path B | Decided | Future design direction; no implementation |
| F1-C-02 | Migration | M0 | Decided | No migration/ingest authorized |
| F1-C-06 | UAT authority | Person not yet named | Open | Blocks F5/UAT |
| F1-C-09 | DR-008 | Remain deferred | Decided | DR-008-dependent claims remain unavailable |
| F1-C-10 | FX provider | Keep unresolved | Decided | Provider-dependent FX remains unavailable |

---

## 3. Decision 1 — F1-C-07 Technical increment owner

**Required:** A named technical increment owner must be appointed before controlled implementation begins.

```text
OPEN — PERSON NOT YET NAMED
```

No person is named in this record. No individual is designated by inference from repository authorship, Git history, contractor presence, or file ownership.

**Governance decision recorded:**

* The **role is required** before controlled implementation.
* The **appointment must be explicit**.
* Repository authorship does **not** constitute appointment.
* The role is responsible for: controlled technical implementation; evidence coordination; test coordination; rollback coordination; governance-boundary compliance (C1–C10 only; no C11+; H-31 Decision 5 still not an F2 grant).

**Status:**

```text
OPEN — OWNER APPOINTMENT REQUIRED
```

This item **continues to block** controlled implementation. Recording the role requirement does **not** close F1-C-07.

---

## 4. Decision 2 — F1-C-04 / F1-C-08 CPR parameter treatment

```text
OWNER DECISION = PATH B
```

**Path B:** Authorize a **future** implementation design that does **not** depend on invented numerical CPR thresholds. The system should support the approved qualitative exceptional / unusual / significant approval categories (H-27 §9) and Commercial Director approval (H-25 / H-36 F1-C-05 current model), with auditable approval evidence.

```text
CPR-FLOOR = NOT AUTHORIZED
CPR-DISCOUNT = NOT AUTHORIZED
CPR-CREDIT = NOT AUTHORIZED
CPR-SIZE = NOT AUTHORIZED
CPR-LIABILITY = NOT AUTHORIZED
OR-04 = NO NUMERICAL TARGET AUTHORIZED
250k/20% = REJECTED
```

No numerical threshold is invented. C7 must **not** auto-fire on invented revenue, discount %, group size, credit period, or liability numbers.

Selecting Path B does **not** authorize implementation. It resolves **governance direction** for future design only.

**Status:**

```text
DECIDED — PATH B
```

---

## 5. Decision 3 — F1-C-02 Migration strategy

```text
OWNER DECISION = M0
```

**M0** is the **initial** controlled coexistence / no-migration position:

* EOS may be **designed** around the approved structured commercial facts.
* Existing Office / Excel / Outlook / Gmail / WhatsApp / phone workflows remain operational until a later migration decision.
* No bulk migration is authorized.
* No automatic mailbox ingest is authorized.
* M1 and M2 remain future alternatives.
* M3 remains unauthorized.

Selecting M0 is a **governance/design decision only**. It does **not** authorize implementation, migration, ingest, data movement, or application changes.

H-34/H-36 recorded M0 as an F1 working assumption. This record converts that into **Owner-selected initial governance direction**. It does **not** convert M0 into a migration-execution grant.

**Status:**

```text
DECIDED — M0 WORKING/INITIAL GOVERNANCE DIRECTION
```

---

## 6. Decision 4 — F1-C-06 UAT authority

```text
OPEN — UAT AUTHORITY PERSON NOT YET NAMED
```

No explicit appointment exists in an authoritative Owner record. No person is invented. The Commercial Director is **not** automatically assigned this role. H-34’s proposal that CD could be UAT authority remains a **proposal**, not an appointment.

UAT authority must be explicitly appointed before F5/UAT.

**Minimum responsibilities:**

* Review acceptance criteria  
* Coordinate business UAT  
* Evaluate UAT evidence  
* Accept or reject UAT results  
* Coordinate defect disposition  
* Provide formal UAT acceptance or documented rejection  

Technical testing is not UAT acceptance. F2 authorization must not imply UAT completion.

**Status:**

```text
OPEN — OWNER APPOINTMENT REQUIRED
```

This item **continues to block** F5/UAT.

---

## 7. Decision 5 — F1-C-09 DR-008

```text
OWNER DECISION = REMAIN DEFERRED
DR-008 = DEFERRED
```

**Reason:** DR-008 is not required to establish the primary commercial capability around qualified RFPs; RFP conversion; response speed; pipeline visibility; account classification; SOURCE/CHANNEL; programme / proposal / costing; supplier-rate snapshots; booking / loss / KPI structures.

**Independently reportable (not dependent on closing DR-008):** OR-03; PCO; Market; SOURCE/CHANNEL; repeat business / reportability based on prior booking.

Full AC-010 flag taxonomy is **not** claimable. H-34 Trigger 6 must **not** be treated as DR-008 closure.

**Status:**

```text
DECIDED — REMAIN DEFERRED
```

---

## 8. Decision 6 — F1-C-10 FX provider

```text
OWNER DECISION = KEEP UNRESOLVED / OUT OF CURRENT IMPLEMENTATION SCOPE
```

No FX provider is selected. No provider engagement is authorized.

If FX becomes necessary later, a **separate** governance decision must establish: provider; source; rate timestamp; currency-pair handling; fallback; auditability; commercial snapshot behavior.

Identity of conversion (basis + date + currencies + snapshot) remains a specified **requirement** if conversion occurs; naming a live source is out of current scope.

**Status:**

```text
DECIDED — DEFER PROVIDER SELECTION
```

---

## 9. Appointments still open

| Appointment | Status | Blocks |
| --- | --- | --- |
| Technical increment owner (F1-C-07) | `OPEN — OWNER APPOINTMENT REQUIRED` · `OPEN — PERSON NOT YET NAMED` | Controlled implementation / F2 start |
| UAT authority (F1-C-06) | `OPEN — OWNER APPOINTMENT REQUIRED` · `OPEN — UAT AUTHORITY PERSON NOT YET NAMED` | F5/UAT |

No individual has accepted either appointment in this record. None is asserted.

---

## 10. Acceptance criteria

| ID | Criterion | Result |
| --- | --- | --- |
| H38-AC-01 | All six H-37 decisions explicitly addressed | **MET** |
| H38-AC-02 | No technical owner invented | **MET** |
| H38-AC-03 | No UAT authority invented | **MET** |
| H38-AC-04 | Path B recorded for CPR treatment | **MET** |
| H38-AC-05 | M0 recorded as initial migration direction without authorizing migration | **MET** |
| H38-AC-06 | DR-008 remains deferred | **MET** |
| H38-AC-07 | No FX provider selected | **MET** |
| H38-AC-08 | No numerical CPR values introduced | **MET** |
| H38-AC-09 | H-31 Decision 5 unchanged | **MET** |
| H38-AC-10 | F1 remains ACCEPTED WITH CONDITIONS | **MET** |
| H38-AC-11 | F2 remains NOT AUTHORIZED | **MET** |
| H38-AC-12 | No application/schema/data/infrastructure implementation | **MET** |
| H38-AC-13 | Index remains empty | **MET** at creation (validated after write) |
| H38-AC-14 | No commit or push | **MET** |

H38-AC-* record **this completion record’s integrity**, not F2 evidence (H-36 F1-C-11).

---

## 11. Next governance-controlled action

F1-C-07 remains the universal block on controlled implementation until a named technical increment owner is appointed. F1-C-06 remains the block on F5/UAT until a named UAT authority is appointed.

Path B, M0, DR-008 deferred, and FX unresolved are **direction only**. They do **not** open F2.

```text
NEXT ACTION = OWNER APPOINTMENT OF TECHNICAL INCREMENT OWNER (F1-C-07) — DOCUMENTATION ONLY
```

Do not commence F2. Do not code. Do not migrate. Do not ingest.

---

## 12. Governance status

```text
GPTA-H-38 STATUS = OWNER DECISION COMPLETION RECORD COMPLETED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

PATH B (CPR) = DECIDED — FUTURE DESIGN DIRECTION ONLY
M0 = DECIDED — WORKING/INITIAL GOVERNANCE DIRECTION — NO MIGRATION AUTHORIZED
DR-008 = DEFERRED
FX PROVIDER = UNSELECTED / OUT OF CURRENT IMPLEMENTATION SCOPE
F1-C-07 = OPEN — OWNER APPOINTMENT REQUIRED
F1-C-06 = OPEN — OWNER APPOINTMENT REQUIRED
C11+ = NOT IN SCOPE
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
```

---

## 13. Validation

| Check | Result |
| --- | --- |
| Six H-37 decisions addressed | **Yes** |
| No names invented | **Yes** |
| No fictional signatures | **Yes** |
| Path B recorded; no CPR values | **Yes** |
| M0 direction only; no migration/ingest | **Yes** |
| DR-008 deferred | **Yes** |
| FX unselected | **Yes** |
| H-31 Decision 5 unchanged | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-38-owner-decision-completion-record.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-37 historical bodies **not rewritten**.
