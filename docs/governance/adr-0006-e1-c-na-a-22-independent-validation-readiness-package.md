# E1-C — NA-A-22 Independent Validation Readiness Package

> **`GOVERNANCE / EVIDENCE PREPARATION ONLY`**  
> **`NA-A-22 = OPEN`**  
> **`HUM-CAP-VAL-01 = REQUIRED — NOT YET APPOINTED`**  
> **`OPEN — HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR`**  
> **`NO VALIDATOR NAMED / SELECTED / CONTACTED / CONTRACTED`**  
> **`NO PROCUREMENT`** · **`NO RFI/RFQ`** · **`NO SUPPLIER CONTACT`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`STAGE 1 = NOT APPROVED / NOT COMPLETE`**  
> **`VALIDATION NOT PERFORMED`**  
> **`Assessment authorization does not constitute Production authorization.`**  
> **`SEDMC remains NOT Production Ready.`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T19:02:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Live dependency:** **NA-A-22**.  
**Decision ID:** **HUM-CAP-VAL-01** / **GAP-VAL-01**.  
**This sprint does not appoint a validator and does not close NA-A-22.**

Parent records (not rewritten):

| Record | Path |
| --- | --- |
| HUM-CAP-01 | [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md) |
| Sprint 4 owner baseline & restore | [`adr-0006-e1-c-owner-planning-baseline-and-restore-authorization.md`](adr-0006-e1-c-owner-planning-baseline-and-restore-authorization.md) |
| Sprint 2 HUM-CAP-VAL-01 fields | [`adr-0006-e1-c-human-evidence-and-decision-closure-sprint-2.md`](adr-0006-e1-c-human-evidence-and-decision-closure-sprint-2.md) |
| Assessment results | [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md) |
| Dependency register | [`adr-0006-e1-next-action-dependency-register.md`](adr-0006-e1-next-action-dependency-register.md) |

**Not done:** validator selection/contact/appointment; procurement; RFI; facility selection; application-code changes; migrations; restore re-run; Stage 1 approval; commit; push.

---

## 1. Purpose

Prepare the repository so an **owner-appointed** independent external validator can later review the E1-C evidence package.

This file is a **readiness package**, not a validation result, not an appointment instrument, and not a supplier shortlist.

---

## 2. NA-A-22 status (unchanged as OPEN)

| Field | Value |
| --- | --- |
| Dependency | **NA-A-22 — Independent validation / remaining evidence closure** |
| Independent validator required | **Yes** |
| Appointed | **No** |
| Appointment | **HUMAN DECISION REQUIRED** |
| Supplier / contact activity | **Not authorized** by this package |
| Validator profile | **Prepared** (role/profile only — §5) |
| Future validation scope | **Prepared** (§6) |
| Validation checklist | **Prepared** — all findings **OPEN / NOT ASSESSED** (§7) |
| Validation evidence performed | **No** |
| CAP-GATE-01 | **NOT COMPLETE** |
| NA-A-22 closed? | **No** |

---

## 3. Owner-approved planning baseline (restated — not altered)

| Input | Value | Classification |
| --- | --- | --- |
| Users | **100** | **OWNER-APPROVED PLANNING BASELINE — NOT A MEASURED CURRENT USER CENSUS** |
| Concurrency | **50** | **OWNER-APPROVED PLANNING INPUT — NOT A TECHNICAL MEASUREMENT** |
| Growth | **10% annually** | **OWNER-APPROVED PLANNING INPUT** |
| Horizon | **3 years** | **OWNER-APPROVED PLANNING INPUT** |
| Peak periods | March–May program/proposal; June–October operational delivery | **OWNER-APPROVED PLANNING INPUT** |
| Accounts | **20** current | **OWNER-APPROVED PLANNING INPUT** |
| Account growth | **15% annually** | **OWNER-APPROVED PLANNING INPUT** |
| Documents | **5,000/year** | **PROVISIONAL INFRASTRUCTURE-PLANNING ENVELOPE — CURRENT CENSUS UNKNOWN** |
| Headroom | **30%** | **OWNER-APPROVED PLANNING POLICY — NOT DEMONSTRATED SPARE CAPACITY** |

Derived (**DERIVED PLANNING FIGURE — NOT MEASURED CENSUS**): users Y3 **133.10**; accounts Y3 **30.42**; documents Y3 **6,655**/year.

Historical (not deleted): 500 users / 200 concurrent / ~30% growth = **PREVIOUS PLANNING ASSUMPTION — SUPERSEDED FOR CURRENT PLANNING BASELINE**.

---

## 4. Restore evidence (already executed — not re-run)

| Field | Authoritative result |
| --- | --- |
| Executed | **2026-09-17T18:55:01–18:55:10+03:00** |
| Target | `compose-postgres-1` · `postgres:16-alpine` · `127.0.0.1:5432` |
| Environment | **DEV/TEST ONLY** |
| Disposable DB | `eos_e1d_b5_mu5pnm3r` |
| Method | sql-logical |
| Duration | **7653 ms** |
| Verified | `true` · marker `e1d-b5-disp` rowCount **1** |
| `productionRtoClaimed` | **false** |
| Technical Production RTO/RPO | **NOT DEMONSTRATED** |

RV: RV-01, RV-03, RV-07–09, RV-12–14 **PARTIALLY CLOSED**; RV-04–06 **EVIDENCE REQUIRED**; RV-02/10/11 **NOT APPLICABLE — JUSTIFICATION REQUIRED**. No RV **CLOSED** for Production restore.

---

## 5. Required vs not done

### Required

Independent **external** validation of the E1-C capacity/facility **evidence package**.

### Minimum independence principle

The validator must be **independent from the person/team that performed the underlying assessment or implementation activities being validated.**

That includes independence from:

- this repository’s E1-C assessment execution
- SEDMC application implementation work under review
- any procurement/vendor-selection role in this E1-C work

### Candidate profile (role only — no named company or individual)

- independent IT infrastructure professional or firm
- relevant PostgreSQL / database capability
- infrastructure capacity-assessment experience
- backup/restore and business-continuity assessment capability
- ability to **review evidence** rather than merely reproduce implementation claims
- no conflicting implementation or procurement role in this E1-C work

**Validator identity:** **NOT ESTABLISHED**.  
**Do not** treat this profile as a shortlist.

---

## 6. Future validation scope

To be given to an appointed validator later. The validator **must not** be asked to approve Production deployment. Role = **evidence validation and gap identification**.

| # | Scope item |
| --- | --- |
| 1 | Owner planning inputs and their classifications |
| 2 | Capacity methodology and assumptions |
| 3 | Dev/Test technical measurements and labels |
| 4 | PostgreSQL evidence (idle + disposable restore) |
| 5 | Backup/restore evidence and harness limitations |
| 6 | RV classifications (no Production CLOSED) |
| 7 | Capacity headroom methodology (30% **policy** vs demonstrated spare capacity) |
| 8 | Network/facility dependencies (`FACILITY EVIDENCE BLOCKED — NO AUTHORIZED CANDIDATE SITE`) |
| 9 | Operational accountability (Director of Operations / Managing Director) and `INDIVIDUAL TECHNICAL ASSIGNMENT — OPEN` |
| 10 | Legal/privacy evidence dependencies (entity, PDPC, DPO appointment, PDPA, residency, occupancy, retention, IR) |
| 11 | Distinction among: owner planning input; derived planning figure; Dev/Test measurement; Production evidence; unresolved requirement |
| 12 | Whether CAP-GATE-01 evidence is sufficient for a **future** Stage 1 **decision** — **not** whether to deploy Production |

Primary artefacts for later review:

- this file
- [`adr-0006-e1-c-owner-planning-baseline-and-restore-authorization.md`](adr-0006-e1-c-owner-planning-baseline-and-restore-authorization.md)
- [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md)
- [`adr-0006-e1-c-capacity-and-facility-assessment-specification.md`](adr-0006-e1-c-capacity-and-facility-assessment-specification.md)
- [`adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md`](adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md)
- [`adr-0006-e1-c-human-evidence-and-decision-closure-sprint-2.md`](adr-0006-e1-c-human-evidence-and-decision-closure-sprint-2.md)
- [`adr-0006-e1-c-evidence-gap-closure-sprint-1.md`](adr-0006-e1-c-evidence-gap-closure-sprint-1.md)

ADR-0006 and DP-0006 remain independently **OPEN** and are **not** closed by validation of E1-C assessment evidence.

---

## 7. Required validation outputs (checklist — all OPEN)

No findings invented. Until a legitimately appointed validator completes a row, status = **OPEN / NOT ASSESSED**.

Common unfilled fields for every row: validator identity **NOT ESTABLISHED**; independence declaration **NOT ESTABLISHED**; validation date **N/A**; conclusion **NOT ASSESSED**.

| ID | Evidence to review | Source/path | Method | Finding | Status | Limitation | Unresolved dependency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VAL-01 | Owner planning inputs & classifications | Sprint 4 owner record | Document review | **OPEN** | **NOT ASSESSED** | Not a census | HUM-CAP-VAL-01 appointment |
| VAL-02 | Capacity methodology & assumptions | Specification + results | Document review | **OPEN** | **NOT ASSESSED** | Load tests not run | CAP-03/04/10/11 |
| VAL-03 | Dev/Test measurements | Sprint 1 + results | Document review | **OPEN** | **NOT ASSESSED** | **DEV/TEST ONLY** | Must not be treated as Production |
| VAL-04 | PostgreSQL evidence | Sprint 1 idle + Sprint 4 restore | Document review | **OPEN** | **NOT ASSESSED** | Empty catalog; sql-logical | Production PG **MISSING** |
| VAL-05 | Backup/restore evidence | Sprint 4 restore section | Document review | **OPEN** | **NOT ASSESSED** | Not `pg_dump -Fc` | RV-04–06 |
| VAL-06 | RV classifications | Sprint 4 §8.4 + reconciliation | Document review | **OPEN** | **NOT ASSESSED** | No Production CLOSED | Technical RTO/RPO |
| VAL-07 | Headroom 30% policy vs evidence | HUM-CAP-16 | Document review | **OPEN** | **NOT ASSESSED** | Policy ≠ demonstrated capacity | Future design |
| VAL-08 | Network/facility dependencies | FAC-01–FAC-24 | Document review | **OPEN** | **NOT ASSESSED** | No candidate site | HUM-CAP-02 later |
| VAL-09 | Operational accountability | HUM-08 | Document review | **OPEN** | **NOT ASSESSED** | Role-level only | Individual technical seats |
| VAL-10 | Legal/privacy dependencies | GAP-LEGAL-01 / E-01–E-03 / E-13 | Document review | **OPEN** | **NOT ASSESSED** | Combined Legal/DPO **INCOMPLETE** | **LEGAL REVIEW REQUIRED** |
| VAL-11 | Classification discipline (five-way split) | This file §6 item 11 | Document review | **OPEN** | **NOT ASSESSED** | — | — |
| VAL-12 | CAP-GATE-01 sufficiency for **future** Stage 1 decision | CAP-GATE-01 tables | Document review | **OPEN** | **NOT ASSESSED** | Gate **NOT COMPLETE** | Validator must **not** approve Production |

**Validator conclusion (overall):** **NOT ASSESSED**.  
**Disposition:** **N/A**.

The validator must **not** approve Production deployment.

---

## 8. Facility and legal boundary (unchanged)

| Item | Status |
| --- | --- |
| FAC-01–FAC-24 | **EVIDENCE REQUIRED** |
| Facility | **FACILITY EVIDENCE BLOCKED — NO AUTHORIZED CANDIDATE SITE** |
| Legal entity / PDPC / DPO appointment / PDPA / residency / occupancy / retention / IR | Unresolved as previously recorded — **LEGAL REVIEW REQUIRED** / **HUMAN DECISION REQUIRED** / **EVIDENCE REQUIRED** as applicable |
| DPO designation | **Wensley Shirima** — **not** a completed formal appointment |
| This sprint | No facility identification/ranking/contact; no legal-counsel or provider contact |

---

## 9. CAP-GATE-01 and Stage 1

**CAP-GATE-01 — NOT COMPLETE**

Preserved blockers: independent validation; FAC-01–FAC-24; site-dependent network; legal/privacy evidence; Production capacity validation; Production RTO/RPO.

**Stage 1 — NOT APPROVED / NOT COMPLETE**

This package does **not** approve Production architecture, sizing, BOM, facility, provider, procurement, RFI/RFQ, deployment, or migration.

**Assessment authorization does not constitute Production authorization.**  
**SEDMC remains NOT Production Ready.**

---

## 10. What this package does not do

Appoint, name, select, contact, or contract a validator; close NA-A-22; close CAP-GATE-01; convert planning inputs into Production capacity; claim validation occurred; procure; send RFI; select a facility.

**NA-A-22 remains OPEN until a validator is actually appointed and validation is performed.**

---

## Additive — 2026-09-17 appointment decision companion

Human appointment decision package (still **OPEN**, no appointment): [`adr-0006-e1-c-na-a-22-validator-appointment-decision.md`](adr-0006-e1-c-na-a-22-validator-appointment-decision.md). This readiness file is **not** rewritten.
