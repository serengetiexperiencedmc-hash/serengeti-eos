# E1-C — NA-A-22 Validator Appointment Decision

> **`GOVERNANCE / HUMAN APPOINTMENT DECISION PACKAGE`**  
> **`NA-A-22 — OPEN`**  
> **`INDEPENDENT VALIDATOR — REQUIRED / NOT YET APPOINTED`**  
> **`HUMAN DECISION REQUIRED`**  
> **`PREPARATION OF THIS RECORD DOES NOT CONSTITUTE APPOINTMENT`**  
> **`NO VALIDATOR NAMED / SELECTED / CONTACTED / CONTRACTED`**  
> **`NO SHORTLIST`** · **`NO PROCUREMENT`** · **`NO RFI/RFQ`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`STAGE 1 = NOT APPROVED / NOT COMPLETE`**  
> **`VALIDATION NOT PERFORMED`**  
> **`Assessment authorization does not constitute Production authorization.`**  
> **`SEDMC remains NOT Production Ready.`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T19:05:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Decision owner (appointment, when later recorded):** **Patrick Makundi**, Owner.  
**This file does not appoint anyone.**

Companion (readiness / scope / checklist — not duplicated here): [`adr-0006-e1-c-na-a-22-independent-validation-readiness-package.md`](adr-0006-e1-c-na-a-22-independent-validation-readiness-package.md).  
Maps to **HUM-CAP-VAL-01** / **GAP-VAL-01**.

---

## 1. Status

| Field | Value |
| --- | --- |
| Dependency | **NA-A-22 — OPEN** |
| Independent validator | **REQUIRED / NOT YET APPOINTED** |
| Appointment | **HUMAN DECISION REQUIRED** |
| This record | Preparation package — **not** an appointment |
| Validation performed | **No** |
| External engagement authorized | **No** |

---

## 2. Required validator profile

Independent **external** professional or firm capable of **reviewing existing evidence**, not merely repeating the implementation team's measurements.

Relevant capability (no invented certification mandates):

1. IT infrastructure assessment  
2. PostgreSQL / database capacity assessment  
3. Backup and restore validation  
4. Business continuity / disaster recovery assessment  
5. Evidence-based technical assurance  
6. Capacity and scalability review  
7. Network / infrastructure dependency review  
8. Governance / evidence review  

No named company or individual. No candidate list. No scores. No ranking.

---

## 3. Independence requirements

Final independence determination is a **human governance decision** (owner). Objective requirements:

| Requirement | Status now |
| --- | --- |
| Must not be the person who performed the underlying E1-C assessment | Criterion **defined**; determination **OPEN** |
| Must not be the person/team responsible for implementing the infrastructure being assessed | Criterion **defined**; determination **OPEN** |
| Must not be a supplier seeking the infrastructure/procurement engagement being evaluated | Criterion **defined**; determination **OPEN** |
| Must disclose actual, potential, or perceived conflicts of interest | Criterion **defined**; disclosure **NOT YET RECEIVED** |
| Must not have authority to approve Production deployment | Criterion **defined**; determination **OPEN** |
| Must not simultaneously act as the Production infrastructure supplier for this assessment | Criterion **defined**; determination **OPEN** |

---

## 4. Required deliverables

| ID | Deliverable | Bound |
| --- | --- | --- |
| A | **Evidence review** — identify exact evidence examined in the E1-C package | Review only |
| B | **Capacity validation** — methodology and planning assumptions internally coherent; distinguish owner inputs from measured technical evidence | No Production sizing approval |
| C | **PostgreSQL review** — Dev/Test evidence; what remains unvalidated for Production | Idle + disposable restore only unless later evidence exists |
| D | **Backup/restore review** — disposable Dev/Test drill and limitations | Not Production restore PASS |
| E | **RTO/RPO review** — whether any evidence demonstrates Production RTO/RPO | **Must not invent** Production RTO/RPO values |
| F | **Facility/network review** — evidence requirements and gaps | **Must not** approve an unselected facility |
| G | **Operations review** — accountability; unresolved individual technical assignments | Role-level DoO/MD already recorded |
| H | **Legal/privacy dependency review** — identify evidence gaps | **No** legal conclusions outside competence |
| I | **CAP-GATE-01 review** — whether evidence is complete enough to **support a future Stage 1 decision** | Validator **does not** approve Stage 1 or Production |

---

## 5. Required validation report structure

1. Executive evidence summary  
2. Documents / evidence reviewed  
3. Validation methodology  
4. Independence / conflict declaration  
5. Findings by evidence domain  
6. Evidence limitations  
7. Unsupported assumptions  
8. Open dependencies  
9. CAP-GATE-01 assessment  
10. Items requiring owner decision  
11. Items requiring further technical evidence  
12. Final validation conclusion  
13. Validator identity / date / signature or equivalent attestation  

Allowed conclusion states only:

- **validated**  
- **partially validated**  
- **evidence required**  
- **not applicable with justification**  
- **not assessed**  

Unsupported **PASS** / **CLOSED** (as Production capability) is **not permitted**.

---

## 6. Appointment decision criteria

**No candidates at this stage.** Do not score. Do not rank.

| Criterion | Required? | Decision |
| --- | ---: | --- |
| External to E1-C implementation team | Yes | **OPEN** |
| Relevant infrastructure experience | Yes | **OPEN** |
| PostgreSQL/database capability | Yes | **OPEN** |
| Backup/restore capability | Yes | **OPEN** |
| Business continuity/DR capability | Yes | **OPEN** |
| Evidence-assurance capability | Yes | **OPEN** |
| Conflict disclosure | Yes | **OPEN** |
| Independence accepted by owner | Yes | **OPEN** |
| Scope accepted | Yes | **OPEN** |
| Deliverables accepted | Yes | **OPEN** |

---

## 7. Human approval section

| Field | Value |
| --- | --- |
| `VALIDATOR APPOINTED` | **NO** |
| `APPOINTMENT DECISION` | **OPEN** |
| `APPOINTED INDIVIDUAL/FIRM` | **NOT YET DESIGNATED** |
| `INDEPENDENCE ACCEPTED` | **OPEN** |
| `SCOPE ACCEPTED` | **OPEN** |
| `OWNER APPROVAL DATE` | **NOT YET RECORDED** |

Do not populate with invented information.

---

## 8. External engagement boundary

Preparation of this appointment decision package **does not** authorize:

- contacting validators  
- requesting quotations  
- issuing an RFI/RFQ  
- procurement  
- contract negotiation  
- payment  
- vendor onboarding  

A **separate human authorization** is required before any external engagement.

---

## 9. CAP-GATE-01 and Stage 1

**CAP-GATE-01 — NOT COMPLETE**

This package is **not** validation. Blockers remain: independent validation; FAC-01–FAC-24; site-dependent network; legal/privacy evidence; Production capacity validation; Production RTO/RPO.

**Stage 1 — NOT APPROVED / NOT COMPLETE**  
**SEDMC — NOT Production Ready**

No infrastructure sizing approval; provider selection; facility selection; procurement; RFI/RFQ; Production deployment; Production migration.

**Assessment authorization does not constitute Production authorization.**
