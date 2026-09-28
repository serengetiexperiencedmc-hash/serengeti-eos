# GPTA-H-40 — Technical Increment Owner and UAT Authority Appointment Record

> **`APPOINTMENT RECORD ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**  
> **`NO PROCUREMENT`** · **`NO PROVIDER / SUPPLIER CONTACT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T15:08:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Subject:** Single appointment decision record for the two remaining named-person governance dependencies:

1. **F1-C-07 — Technical Increment Owner**  
2. **F1-C-06 — UAT Authority**

Sources (read, not rewritten): H-25; H-31; H-34; H-35; H-36; H-37; H-38; H-39. H-16–H-39 historical bodies are **not rewritten**. No fictional signatures. No invented names.

---

## Governance boundary

> Appointment of either role establishes accountability only. It does not authorize F2 or implementation. Both roles must be named and the applicable governance gates must subsequently be satisfied before any controlled implementation can begin.

```text
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
F1 = ACCEPTED WITH CONDITIONS
F2 = NOT AUTHORIZED
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
```

This record does **not** begin F2, write application code, modify schema, create or execute migrations, move data, configure infrastructure, deploy, procure, or contact suppliers/providers.

---

## 1. Repository and programme position

```text
Branch = master
HEAD = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index = empty
Working tree = intentionally dirty (preserved)

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
TECHNICAL INCREMENT OWNER = OPEN — PERSON NOT YET NAMED
UAT AUTHORITY = OPEN — PERSON NOT YET NAMED
GPTA-H-39 = TECHNICAL INCREMENT OWNER APPOINTMENT DECISION RECORDED (role defined; person unnamed)
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
DR-008 = DEFERRED
NEXT_INCREMENT = NONE_AUTHORIZED
```

**Authoritative-record search:** H-31, H-33 C-10, H-34 §11.2, H-35 F1-C-06/C-07, H-36, H-37 Decisions 1 and 4, H-38 Decisions 1 and 4, and H-39 were inspected. **No named Technical Increment Owner and no named UAT Authority exist** in those Owner records. H-34 proposed Commercial Director as UAT authority; that remains a **proposal**, not an appointment. No substitution is made.

---

## 2. Owner decision table

| Decision | Current status | Owner decision | Status |
| --- | --- | --- | --- |
| F1-C-07 Technical Increment Owner | Person not yet named | `OPEN — PERSON NOT YET NAMED` | Open |
| F1-C-06 UAT Authority | Person not yet named | `OPEN — PERSON NOT YET NAMED` | Open |
| Same person for both roles? | Not decided | `OPEN — OWNER DECISION REQUIRED` | Open |

No invented names. Combined-role question is **not** answered here.

---

## 3. Appointment 1 — F1-C-07 Technical Increment Owner

| Field | Record |
| --- | --- |
| Role | Technical Increment Owner |
| Why appointment is required | H-33 C-10 / H-36 F1-C-07: controlled implementation has no accountable technical party until a person is named. Blocks F2 start. |
| Appointment | `Technical Increment Owner: NOT YET NAMED` |
| Scope of authority | Coordination of a **future** controlled technical increment within the approved F1 / C1–C10 boundary (H-39 role preserved). |
| Explicit exclusions | Does **not** automatically authorize F2, implementation, production, procurement, migration changes, infrastructure, CPR parameters, FX provider, or UAT acceptance. |
| Evidence of appointment | **None.** Requires explicit Owner appointment naming person and role, with effective date. Git history / access / prior EOS work is **not** evidence. |
| Current status | `OPEN — OWNER APPOINTMENT REQUIRED` |

```text
Technical Increment Owner: NOT YET NAMED
```

**H-39 role preserved.** The Technical Increment Owner coordinates:

* implementation scope  
* technical evidence  
* controlled test execution  
* defect disposition  
* rollback readiness  
* C1–C10 boundary compliance  
* requirement-to-evidence traceability  
* governance finding responses  
* escalation of technical matters requiring Owner decisions  

This role is **not** the UAT authority by virtue of H-39 or this record.

---

## 4. Appointment 2 — F1-C-06 UAT Authority

| Field | Record |
| --- | --- |
| Role | UAT Authority |
| Why appointment is required | H-34 §11.2 / H-36 F1-C-06 / H-38 Decision 4: F5/UAT cannot proceed without a named business-acceptance authority. Technical testing is not UAT. |
| Appointment | `UAT Authority: NOT YET NAMED` |
| Scope of authority | Business UAT coordination and formal acceptance, rejection, or permitted waiver of UAT evidence against approved acceptance criteria. |
| Explicit exclusions | Does **not** confer production deployment authority, procurement authority, or automatic technical implementation authority. F2 must not imply UAT completion. |
| Evidence of appointment | **None.** Requires explicit Owner appointment. Commercial Director role, Technical Increment Owner role, Git history, repository access, prior UAT/test activity, and management title are **not** appointment. |
| Current status | `OPEN — OWNER APPOINTMENT REQUIRED` |

```text
UAT Authority: NOT YET NAMED
```

**Responsibilities when appointed:**

1. Reviewing approved acceptance criteria.  
2. Coordinating business UAT.  
3. Reviewing UAT evidence.  
4. Accepting or rejecting UAT results.  
5. Coordinating defect disposition from the business-acceptance perspective.  
6. Recording formal acceptance, rejection, or permitted waiver.  
7. Ensuring UAT evidence remains traceable to the approved requirements.

---

## 5. Separation of duties

```text
Technical Increment Owner ≠ automatically UAT Authority
```

The two roles may be held by the same person **only if** the Owner **explicitly** decides so. This record does **not** assume separation and does **not** assume combination.

### Combined-role question

| Field | Record |
| --- | --- |
| Can one person hold both? | Permitted **only** by explicit Owner decision. Not assumed. |
| Current decision | `OPEN — OWNER DECISION REQUIRED` |
| If yes | Required: explicit authorization that the **same named person** holds both roles, with both appointment fields completed and the dual-role conflict accepted in writing. |
| If no | Separate appointments required; two named persons. |

No authoritative Owner decision on combination exists. The question is **not** answered here.

---

## 6. Commercial authority

```text
Commercial Director = existing approved commercial authority
```

H-25 / H-36 F1-C-05 current model is preserved. That authority is **not** expanded by inference.

Commercial authority does **not** automatically equal:

* technical increment ownership  
* UAT authority  
* production authority  

---

## 7. Acceptance criteria

| ID | Criterion | Result |
| --- | --- | --- |
| H40-AC-01 | F1-C-07 explicitly addressed | **MET** |
| H40-AC-02 | F1-C-06 explicitly addressed | **MET** |
| H40-AC-03 | No person invented | **MET** |
| H40-AC-04 | No appointment inferred | **MET** |
| H40-AC-05 | Role boundaries explicit | **MET** |
| H40-AC-06 | Separation between technical ownership and UAT authority explicit | **MET** |
| H40-AC-07 | Combined-role question remains open unless explicitly decided | **MET** — remains open |
| H40-AC-08 | H-31 Decision 5 unchanged | **MET** |
| H40-AC-09 | F1 remains ACCEPTED WITH CONDITIONS | **MET** |
| H40-AC-10 | Implementation remains NOT AUTHORIZED | **MET** |
| H40-AC-11 | F2 remains NOT AUTHORIZED | **MET** |
| H40-AC-12 | No application/schema/data/infrastructure changes | **MET** |
| H40-AC-13 | Index remains empty | **MET** at creation (validated after write) |
| H40-AC-14 | No commit or push | **MET** |

H40-AC-* record **this appointment record’s integrity**, not F2 evidence (H-36 F1-C-11). Defining roles without named persons does **not** close F1-C-07 or F1-C-06.

---

## 8. Next governance-controlled action

Owner must **name** both persons (or name one person **and** explicitly authorize dual-role holding). Until then:

* F1-C-07 continues to **block** controlled implementation.  
* F1-C-06 continues to **block** F5/UAT.  
* F2 remains **NOT AUTHORIZED**.

```text
NEXT ACTION = OWNER MUST NAME TECHNICAL INCREMENT OWNER AND UAT AUTHORITY — DOCUMENTATION ONLY
```

Do not commence F2.

---

## 9. Governance status

```text
GPTA-H-40 STATUS = TECHNICAL OWNER AND UAT AUTHORITY APPOINTMENT RECORD COMPLETED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
TECHNICAL INCREMENT OWNER = OPEN — PERSON NOT YET NAMED
UAT AUTHORITY = OPEN — PERSON NOT YET NAMED
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

COMBINED ROLE = OPEN — OWNER DECISION REQUIRED
COMMERCIAL DIRECTOR = EXISTING APPROVED COMMERCIAL AUTHORITY (NOT INFERRED AS TECHNICAL OWNER OR UAT)
PATH B (CPR) = DECIDED — FUTURE DESIGN DIRECTION ONLY
M0 = DECIDED — WORKING/INITIAL GOVERNANCE DIRECTION — NO MIGRATION AUTHORIZED
DR-008 = DEFERRED
FX PROVIDER = UNSELECTED
C11+ = NOT IN SCOPE
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
```

---

## 10. Validation

| Check | Result |
| --- | --- |
| F1-C-07 and F1-C-06 addressed | **Yes** |
| No person invented or inferred | **Yes** |
| Combined-role question left open | **Yes** |
| H-39 role definition preserved | **Yes** |
| Commercial Director not inferred as technical owner or UAT | **Yes** |
| H-31 Decision 5 unchanged | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-40-technical-owner-and-uat-authority-appointment-record.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-39 historical bodies **not rewritten**.
