# GPTA-H-41 — Owner Appointment Recording

> **`APPOINTMENT RECORDING ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**  
> **`NO PROCUREMENT`** · **`NO PROVIDER / SUPPLIER CONTACT`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T15:18:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Subject:** Record the Owner’s explicit appointments for F1-C-07, F1-C-06, and the combined-role decision. Name is recorded **exactly** as supplied. H-16–H-40 historical bodies are **not rewritten**.

**Authoritative Owner input (this record):**

```text
Technical Increment Owner = Patrick Makundi
UAT Authority = Patrick Makundi
Same person for both roles = YES
```

---

## Governance boundary

> The appointment of Patrick Makundi as Technical Increment Owner and UAT Authority resolves the previously open appointment dependencies F1-C-07 and F1-C-06. It does not authorize F2, does not authorize implementation, and does not override H-31 Decision 5 or any remaining governance conditions.

```text
H-31 DECISION 5 = IMPLEMENTATION NOT AUTHORIZED
F1 = ACCEPTED WITH CONDITIONS
F2 = NOT AUTHORIZED
IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO
```

---

## 1. Repository and programme position

```text
Branch = master
HEAD = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index = empty
Working tree = intentionally dirty (preserved)

GPTA-H-40 = TECHNICAL OWNER AND UAT AUTHORITY APPOINTMENT RECORD COMPLETED
  (fields were OPEN — PERSON NOT YET NAMED)
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
NEXT_INCREMENT = NONE_AUTHORIZED
```

---

## 2. Status transition

| ID | Previous status | New status |
| --- | --- | --- |
| F1-C-07 Technical Increment Owner | OPEN — PERSON NOT YET NAMED | **APPOINTED — PATRICK MAKUNDI** |
| F1-C-06 UAT Authority | OPEN — PERSON NOT YET NAMED | **APPOINTED — PATRICK MAKUNDI** |
| Combined-role decision | OPEN | **DECIDED — SAME PERSON** |

These transitions resolve **appointment dependencies only**. They do **not** make F2 ready.

---

## 3. F1-C-07 — Technical Increment Owner

```text
Technical Increment Owner = Patrick Makundi
Status = APPOINTED
```

H-39 role definition is **preserved**. Patrick Makundi is now explicitly appointed to that role.

**Responsibilities:**

* Maintaining future implementation scope against the approved F1 specification.  
* Coordinating technical implementation evidence.  
* Coordinating controlled test execution.  
* Coordinating defect identification and disposition.  
* Coordinating rollback readiness.  
* Ensuring C1–C10 scope compliance.  
* Maintaining requirement-to-evidence traceability.  
* Coordinating responses to governance findings.  
* Escalating technical matters requiring Owner/governance decisions.

**Authority exclusions.** Appointment does **not** independently authorize Patrick Makundi to:

* start F2  
* authorize implementation  
* approve production deployment  
* authorize procurement  
* change migration strategy  
* authorize infrastructure  
* approve numerical CPR parameters  
* select an FX provider  
* accept UAT *(UAT acceptance is a separate function — see §4; combined-role safeguards in §5)*  
* override governance gates  
* expand scope into C11+  

---

## 4. F1-C-06 — UAT Authority

```text
UAT Authority = Patrick Makundi
Status = APPOINTED
```

Patrick Makundi is explicitly appointed as UAT Authority.

**Responsibilities:**

* Reviewing approved acceptance criteria.  
* Coordinating business UAT.  
* Reviewing UAT evidence.  
* Accepting or rejecting UAT results.  
* Coordinating business-side defect disposition.  
* Recording UAT acceptance, rejection, or permitted waiver.  
* Maintaining traceability between UAT evidence and approved requirements.

**Authority exclusions.** UAT authority does **not** independently authorize:

* F2  
* implementation  
* production deployment  
* procurement  
* migration  
* infrastructure changes  
* supplier/provider engagement  
* unauthorized scope  

UAT acceptance must **not** be treated as production authorization. F2 authorization must **not** be treated as UAT completion.

---

## 5. Combined-role decision

```text
Technical Increment Owner and UAT Authority = SAME PERSON
Appointee = Patrick Makundi
Owner Decision = YES
Status = DECIDED
```

The Owner explicitly authorized the **same person** to hold both roles. This does **not** eliminate the governance distinction between the two responsibilities. The two accountability functions remain **separately defined** even though they are held by the same person.

**Safeguards (mandatory because one individual holds both roles):**

* Technical implementation evidence must remain distinguishable from UAT acceptance evidence.  
* UAT acceptance must be based on the approved acceptance criteria and evidence.  
* The combined role does not permit self-expansion of scope.  
* Unresolved governance blockers remain blockers.  
* The appointee cannot override Owner/governance decisions through either role.

```text
Technical Increment Owner ≠ automatically UAT Authority
```

The functions remain distinct. Combination is Owner-authorized for this named person only; it is not a general rule that the roles merge.

---

## 6. Existing commercial authority

```text
Commercial Director = existing approved commercial authority
```

H-25 / H-36 F1-C-05 current model is **not** expanded or altered. Historical records are **not** rewritten.

Where Patrick Makundi’s existing recorded identities overlap these appointments, they remain **distinct functions**:

| Function | Record |
| --- | --- |
| Commercial authority | Commercial Director remains the approved commercial authority under existing business rules. Not rewritten here. |
| Named RFI sender (historical E1-B) | Previously recorded separately. **Not** converted into F1-C-07 or F1-C-06 by this record, and these appointments do **not** reopen E1-B. |
| Technical increment ownership | **This record:** Patrick Makundi (F1-C-07). |
| UAT authority | **This record:** Patrick Makundi (F1-C-06). |

Commercial authority does **not** automatically equal technical increment ownership, UAT authority, or production authority.

---

## 7. F2 blocker impact

Appointment of the two roles resolves the **appointment dependency** only (F1-C-07 and F1-C-06 as named-person gaps). It does **not** automatically make F2 ready.

| ID | Current status after H-38 / H-41 | F2 impact |
| --- | --- | --- |
| F1-C-07 | **APPOINTED — PATRICK MAKUNDI** | Appointment gap **closed**. Does **not** grant F2. |
| F1-C-06 | **APPOINTED — PATRICK MAKUNDI** | Appointment gap **closed**. Does **not** complete or waive UAT. F5 still requires actual UAT evidence. |
| F1-C-02 | **DECIDED — M0** (H-38) working/initial governance direction | No migration/ingest authorized. M3 unauthorized. |
| F1-C-04 / F1-C-08 | **DECIDED — PATH B** (H-38) | Future design direction only. No numerical CPR values. Not F2. |
| F1-C-09 | **DECIDED — REMAIN DEFERRED** (H-38) | DR-008-dependent claims remain unavailable. `DR-008 = DEFERRED`. |
| F1-C-10 | **DECIDED — DEFER PROVIDER SELECTION** (H-38) | Provider-dependent FX remains unavailable. No provider selected. |
| F1-C-11 | Closed as governance rule (H-36) | Specification ≠ implementation evidence. Still binds F2. |
| H-31 Decision 5 | **IMPLEMENTATION NOT AUTHORIZED** | Separate F2 / implementation grant still required. |
| E1 / Production / commit / push | Unchanged | Still separately gated. |

Do **not** mark F2 ready merely because F1-C-06 and F1-C-07 are now resolved.

---

## 8. Acceptance criteria

| ID | Criterion | Result |
| --- | --- | --- |
| H41-AC-01 | Patrick Makundi explicitly recorded as Technical Increment Owner | **MET** |
| H41-AC-02 | Patrick Makundi explicitly recorded as UAT Authority | **MET** |
| H41-AC-03 | Same-person appointment explicitly recorded as Owner decision | **MET** |
| H41-AC-04 | Technical-owner responsibilities remain defined | **MET** |
| H41-AC-05 | UAT responsibilities remain separately defined | **MET** |
| H41-AC-06 | Combined-role safeguards remain explicit | **MET** |
| H41-AC-07 | No F2 authorization inferred | **MET** |
| H41-AC-08 | H-31 Decision 5 unchanged | **MET** |
| H41-AC-09 | Remaining F2 blockers not falsely closed | **MET** |
| H41-AC-10 | No application/schema/data/infrastructure changes | **MET** |
| H41-AC-11 | Index remains empty | **MET** at creation (validated after write) |
| H41-AC-12 | No commit or push | **MET** |

H41-AC-* record **this appointment recording’s integrity**, not F2 evidence (H-36 F1-C-11).

---

## 9. Next governance-controlled action

F1-C-07 and F1-C-06 appointment gaps are closed. Remaining F2 conditions (M0 no-ingest, Path B design-only, DR-008 deferred, FX unselected, H-31 Decision 5, F1-C-11 evidence rule, separate F2 grant) still bind.

```text
NEXT ACTION = F2 REMAINS NOT AUTHORIZED — NO CODING; REMAINING GOVERNANCE CONDITIONS STILL BIND
```

Do not commence F2. Do not treat appointment as implementation authorization.

---

## 10. Governance status

```text
GPTA-H-41 STATUS = OWNER APPOINTMENTS RECORDED

F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F1-C-07 TECHNICAL INCREMENT OWNER = APPOINTED — PATRICK MAKUNDI
F1-C-06 UAT AUTHORITY = APPOINTED — PATRICK MAKUNDI
COMBINED ROLE = YES
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
FX PROVIDER = UNSELECTED
C11+ = NOT IN SCOPE
E1 = NOT APPROVED / BLOCKED
ADR-0006 = OPEN
DP-0006 = OPEN
NA-A-22 = OPEN
```

---

## 11. Validation

| Check | Result |
| --- | --- |
| Name recorded exactly as Owner supplied | **Yes** — Patrick Makundi |
| Combined-role YES recorded | **Yes** |
| Functions remain separately defined | **Yes** |
| Remaining F2 blockers not falsely closed | **Yes** |
| H-31 Decision 5 unchanged | **Yes** |
| No application / schema / migration / data / infrastructure change | **Yes** |
| No tests or migrations executed | **Yes** |
| Index empty | **Yes** |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** |

**Files created or updated by this action (documentation only):**

* Created: `docs/governance/gpta-h-41-owner-appointment-record.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-40 historical bodies **not rewritten**.
