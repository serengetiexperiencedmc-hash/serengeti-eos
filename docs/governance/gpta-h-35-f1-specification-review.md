# GPTA-H-35 — F1 Specification Review

> **`GOVERNANCE REVIEW ONLY`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`F2 NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TEST EXECUTION`** · **`NO MIGRATION EXECUTION`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T14:41:00+03:00**.  
**HEAD at review:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

**Subject:** [`gpta-h-34-f1-detailed-design-and-implementation-specification.md`](gpta-h-34-f1-detailed-design-and-implementation-specification.md)

**Reviewer role:** governance auditor / business analyst / solution-design reviewer. Not wet-ink Commercial Director countersignature. Not F2 authorization.

H-16–H-34 historical bodies are **not rewritten**. Standalone `gpta-h-20/21/22-*.md` remain **absent** (content inside H-19). H-23 and H-24 exist; H-25 remains the authorized rule baseline.

```text
F1 ACCEPTANCE ≠ F2
F1 ACCEPTANCE ≠ IMPLEMENTATION AUTHORIZATION
F1 ACCEPTANCE ≠ CODING
M0 ≠ APPROVED MIGRATION DECISION
```

---

## Review conclusion

```text
F1 ACCEPTED WITH CONDITIONS
```

H-34 is a coherent, bounded, C1–C10-only logical design that preserves H-16–H-33 decisions, H-25/H-27 rules, H-28 findings, and H-29 remediation. It is **sufficient as a controlled baseline** for a later implementation-authorization decision **if** the conditions in §18 are closed or carried as explicit F2 blockers.

It is **not** unconditionally accepted because:

* §2 places opportunity ownership **after** qualification, which conflicts with OR-01 (the owner qualifies) and PR-001 (owner at receipt). C2/C3 text is the controlling design; §2 numbering is not.  
* M0 is a **working assumption**, not an Owner-approved migration decision.  
* Overlap/conflict **resolution method**, FX provider, `CPR-*` values, UAT authority, and technical increment owner remain open.  
* H-34 self-labelled several ACs `MET` as specification content; this review independently **downgrades** workflow completeness.

**H-34 rewrite is not required** if F1-C-01–F1-C-12 bind F2. Material contradiction is isolated, not systemic.

**F1 design completeness:** `SUBSTANTIALLY COMPLETE — CONDITIONS BIND F2`

---

## 4. Traceability review

| Link | Finding |
| --- | --- |
| H-16 freeze | Objective, primary problem, C1–C10-only, process-first, no targets — **preserved** |
| H-17 | BR/PR/AC mapped via H-29 ACs cited per capability — **preserved**; implementation rows remain unauthorized |
| H-18 | Structure ≠ operational use — **preserved** |
| H-19–H-24 | Office live SoR; H-20/21/22 in H-19 — **accurately treated** |
| H-25 / H-27 | OR-01–OR-08, catalogues, 15-value Market, eight approval classes — **preserved** |
| H-28 | Demo chain labelled Dev/Test only; gaps have design treatment — **preserved** |
| H-29 | Retain/remediate/absent represented in §4 — **preserved** |
| H-30 / H-31 | Decision 5 still not authorized; lifecycle ≠ technical-slice F0–F6 — **preserved** |
| H-32 / H-33 | F0 conditions C-01–C-10 reflected (C-07: content MET ≠ F2 evidence; C-08 250k/20% rejected; C-09 `source` not AC-S) — **addressed** |

| Item | Treatment |
| --- | --- |
| Missing mandatory H-29 requirement | **None found** that would void the baseline |
| Ambiguous | Ownership **timing** in §2 vs C2/C3; overlap resolution method; “significant/unusual” qualitative triggers |
| Contradictory | §2 steps 5→6 vs OR-01-C / PR-001 — **not silently resolved**; see F1-C-01 |
| Deferred | DR-008; `CPR-*`; FX provider; UAT name; increment owner; migration **selection** |
| Incorrectly marked resolved | M0 must **not** be read as Owner-approved (H-34 §10 “Decision not selected” is controlling) |

---

## 5. C1–C10 design completeness review

Fifteen H-34 design points assessed per capability. Dev/Test existence ≠ operational readiness.

| Cap | Completeness | Finding |
| --- | --- | --- |
| **C1 CRM** | `COMPLETE` | Identity, OR-03+PCO, Market, SOURCE/CHANNEL, repeat-from-history, DR-008 deferred. Tasks-to-RFP pointed to C3. |
| **C2 Opportunity** | `PARTIALLY COMPLETE` | Qualification≠stage and OR-02 specified. **Negotiation** as a commercial step is thin (versioning only). Ownership timing vs §2 — F1-C-01. |
| **C3 RFP** | `COMPLETE` | Clarification stamps; follow-up bound; SOURCE≠CHANNEL; `RfpRecord.source` not AC-S. |
| **C4 Rates** | `PARTIALLY COMPLETE` | Types, validity, expiry, snapshot, FX identity specified. Overlap **must be resolved** but **method not designed** — F1-C-03. |
| **C5 Programme** | `COMPLETE` | Structured programme vs Office presentation; generation not required. |
| **C6 Costing** | `COMPLETE` | Sent snapshot; rate version or ad-hoc; 20% not Owner rule. |
| **C7 Approval** | `COMPLETE` | Eight classes; send≠approval; `CPR-FLOOR` placeholder; 250k/20% rejected. Qualitative “exceptional” remains F1-C-04. |
| **C8 Proposal** | `COMPLETE` | EOS identity vs Office PDF; sender vs approver. Negotiation revisions = new version. |
| **C9 Booking** | `COMPLETE` | Origin FKs; win-time dimensions; no real bookings in tests. |
| **C10 KPI** | `COMPLETE` | Categories from facts; not command center; not C11+/Domain J; no targets. |

---

## 6. Commercial workflow review

Intake, classification, SOURCE, CHANNEL, clarification, qualification, programme, costing, approval, Office proposal, EOS proposal identity, send, follow-up, negotiation, booking/loss, KPI — **all present**.

| Distinction | Collapsed? |
| --- | --- |
| SOURCE ≠ CHANNEL | **No** |
| Market ≠ buyer type | **No** |
| Qualification ≠ pipeline stage | **No** (explicit) |
| Send ≠ approval | **No** |
| Office ≠ EOS structured facts | **No** |

**Defect:** §2 step 5 (qualification) before step 6 (ownership). Controlling requirements: owner at/before qualification (OR-01-C, PR-001, C2/C3). F1-C-01. Do not implement §2 order literally.

---

## 7. Business-rule consistency review

| Area | Result |
| --- | --- |
| OR-01-A–F, timing, authority, evidence, reclassification, CD visibility as queryable record | **Accurate** |
| LR-01–12; one primary; contributing same catalogue; LR-12 explanation; finalization; audit | **Accurate** |
| OR-03 + PCO distinct; Market separate; 15-value list | **Accurate** |
| Follow-up owner = opportunity owner; transfer = new owner + next action; CD escalation | **Accurate** |
| Sender = owner after required approval; approved version | **Accurate** |
| 250,000 / 20% | **Remains rejected** |
| OR-04 | **Intact** |

---

## 8. Supplier-rate design review

| Topic | Resolved vs documented |
| --- | --- |
| Source, type, currency, season, dates, expiry, version, supersession, verification, snapshot, expired not silent | **Specified** |
| Overlapping rates | **Documented, not resolved** (identify + record resolution; no algorithm) |
| Conflicting supplier rates | **Documented** (Sales flags; supplier-management owns) |
| FX provider | **Unresolved — correctly not invented** |
| FX conversion identity | **Specified** (basis + date) |
| Snapshot timing | **Specified** (sent costing/proposal) |

---

## 9. Approval-matrix review

All eight H-27 classes are present. **No unauthorized numerical threshold introduced.** `CPR-FLOOR`, `CPR-DISCOUNT`, `CPR-CREDIT`, `CPR-SIZE`, `CPR-LIABILITY` remain **NOT AUTHORIZED**. Trigger 2 cannot auto-fire until floor value or increment waiver. Trigger 6 must not silently close DR-008.

---

## 10. Source-of-truth review

Approved model **preserved**. EOS facts vs Office presentation vs channels. Office/version identifier required when Office is used. Mailbox/WhatsApp ingest **not** authorized. Follow-up attributable via RFP+opportunity-bound next action.

**Edge cases (conditions, not SoR collapse):** outbound email without `sentAt`; WhatsApp follow-up vs intake CHANNEL; confirm/reject arriving only by phone — H-34 requires EOS outcome record; capture discipline is operational, not an integration grant.

---

## 11. Data / identity-chain review

Logical chain Account → Opportunity → RFP → Programme → Costing → Approval → Proposal → Booking, plus follow-up, loss, rate snapshots, KPI facts — **specified**. Demo chain **Dev/Test only**. Identity, integrity, sent-snapshot immutability, reassignment, closed-record audit — **specified**. Physical schema **not** designed (correct).

---

## 12. Security / role review

| Role | H-34 | Ambiguity |
| --- | --- | --- |
| Sales & BD opportunity owner | Named | Timing vs §2 — F1-C-01 |
| Commercial Director | Oversight / triggered approver | Visibility = queryable record (adequate as process) |
| Proposal sender | Owner after approval | Distinct from approver when both acted |
| Commercial approver | CD or designated under register | **Designated title not named** — F1-C-05 |
| Supplier-management | C4 owner | Function, not a named person |
| Finance | **Not a C1–C10 approver** (correct; 250k finance gate rejected; I8 out of scope) | Do not reintroduce finance-threshold approval |
| UAT authority | Proposed CD; **not named** | F1-C-06 |
| Technical increment owner | **Not named** | F1-C-07 |

No permissions implemented.

---

## 13. Migration review

```text
M0 STATUS = F1 WORKING ASSUMPTION — NOT AN OWNER-APPROVED MIGRATION DECISION
```

H-34 §10: “Decision not selected.” Column “Default if Owner silent” is a **design convenience**, not H-31 Decision 6. Excel, Office, historic RFPs, rates, quality, dedup, scope, rollback principles, and historic-data limitations are **options/criteria**, not a selected strategy. Automatic ingest (M3) remains not authorized. F1-C-02.

---

## 14. Test / UAT / rollback review

Future test types listed (unit through rollback) as a **plan**. Store must be named. Disposable data only. UAT authority **unresolved**. Defect classes and blocker retest exist. Sign-off not inferred from compile. Production acceptance separately gated. **No tests executed in this review.** Rollback **principle** only; detailed procedure remains F2-request evidence.

---

## 15. F1 acceptance-criteria review

Independent of H-34 self-scores. Distinguish specification completeness, design correctness, future evidence, Owner authorization.

| Criterion | Result | Evidence / finding |
| --- | --- | --- |
| F1-AC-01 Traceability | `MET` | Chain H-16→H-33 represented |
| F1-AC-02 C1–C10 coverage | `MET` | §4.1–4.10 present |
| F1-AC-03 Workflow completeness | `PARTIALLY MET` | Sixteen steps exist; ownership **sequence** incorrect vs OR-01/PR-001 |
| F1-AC-04 SoR clarity | `MET` | §3 preserves approved model |
| F1-AC-05 Business-rule representation | `MET` | No invented numbers; 250k/20% rejected |
| F1-AC-06 Identity chain | `MET` | Logical; demo labelled Dev/Test |
| F1-AC-07 Approval and auditability | `MET` | Eight classes; placeholders |
| F1-AC-08 Supplier-rate requirements | `PARTIALLY MET` | Core specified; overlap **method** open |
| F1-AC-09 Migration strategy | `PARTIALLY MET` | Options listed; selection Owner; M0 not approved |
| F1-AC-10 Testing strategy | `MET` as **plan** | Execution `REQUIRES FUTURE EVIDENCE` |
| F1-AC-11 UAT strategy | `PARTIALLY MET` | Framework yes; authority `REQUIRES OWNER DECISION` |
| F1-AC-12 Rollback strategy | `PARTIALLY MET` | Principle; detailed steps `REQUIRES FUTURE EVIDENCE` |
| F1-AC-13 Dependencies | `MET` | Not hidden as closed |
| F1-AC-14 Security considerations | `MET` as requirements | IAM not implemented (correct) |
| F1-AC-15 Scope / no C11+ | `MET` | |
| F1-AC-16 F1 specification review | `MET` | **This document** |
| F1-AC-17 Technical increment owner | `REQUIRES OWNER DECISION` | |
| F1-AC-18 Parameter values or F2 waiver | `REQUIRES OWNER DECISION` | |

H-34 `MET` on F1-AC-03 is **over-stated**. This review’s classification controls.

---

## 16. F2 entry-condition review

```text
IMPLEMENTATION AUTHORIZED = NO
F2 = NOT AUTHORIZED
```

This review **does not** change those facts. Condition 1 (F1 review) is **satisfied as a review record**; it does **not** grant F2.

| # | Condition | Status | Evidence | Outstanding | Blocks F2? | Owner decision? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | F1 specification review | **Satisfied as H-35** | This file | Conditions §18 | **Yes** until §18 closed or listed as F2 blockers in the grant | No for the review itself |
| 2 | Traceability in review | **Satisfied** | §4 | — | Carried | No |
| 3 | Design completeness accepted | **Accepted with conditions** | This conclusion | F1-C-01–12 | **Yes** | Some |
| 4 | Parameters authorized or waived | **Outstanding** | `CPR-*` | Values/waiver | **Yes** | **Yes** |
| 5 | Security/role review | **Partially satisfied** (requirements) | §12 | Named approver/UAT/increment owner; Production IAM = E1 | **Yes** for Production; Dev/Test F2 still needs named owner | **Yes** for names |
| 6 | Migration decision | **Outstanding** | M0 assumption | Owner selection | **Yes** before any ingest; F2 of **new capture only** still needs explicit M0/M1 statement | **Yes** |
| 7 | Test plan accepted | **Outstanding** | Plan exists, not accepted as an increment plan | Increment-scoped plan | **Yes** | Reviewer + Owner |
| 8 | UAT plan or waiver | **Outstanding** | Framework | Named authority or waiver | **Yes** | **Yes** |
| 9 | Rollback plan | **Outstanding** | Principle | Increment note | **Yes** | No |
| 10 | Operational/technical ownership | **Outstanding** | Commercial roles yes | Technical name | **Yes** | **Yes** |
| 11 | Explicit implementation authorization | **Absent** | H-31 D5 | Decision 5-class grant | **Yes** | **Yes** |
| 12 | Production separately gated | **Still gated** | E1 | Unchanged | **Yes** for Production | E1 Owner |
| 13 | Commit/push separately granted | **Absent** | — | Grant | **Yes** | **Yes** |

---

## 18. Conditions register

H-34 body is **not** rewritten. Conditions bind any future F2 grant.

| ID | Condition | Reason | Source | Responsible | Evidence | Blocks F2? | Closure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1-C-01 | Opportunity owner assigned at intake / **before** qualification; do not implement H-34 §2 steps 5→6 as sequence | Owner qualifies (OR-01-C); named owner at receipt (PR-001); C2/C3 control | H-17 PR-001; H-25 OR-01; H-34 §2 vs §4.2–4.3 | F2 author / governance | F2 increment spec states intake-time owner | **Yes** | Record in F2 request; optional H-34 addendum |
| F1-C-02 | M0 remains a working assumption until Owner selects M0/M1/M2; M3 not authorized | H-34 “Decision not selected” | H-29 DEP-12; H-33 C-04; H-34 §10 | Owner | Written migration choice | **Yes** before ingest; **Yes** to claim historic load | Owner decision |
| F1-C-03 | Overlapping/conflicting live rates: resolution must be **recorded**, not silent `preferredInConflict` | Method not designed | H-27 §10.2; H-34 §8 | F1 addendum or F2 design | Recorded choice + actor | **Yes** for AC-C4-03 | Design note in F2 request |
| F1-C-04 | Do not encode numeric proxies for “exceptional / unusual / significant” | Qualitative triggers | H-27 §9; H-32 DEP-03 | F2 author | No 250k/20% or invented % | **Yes** | F2 tests against classes |
| F1-C-05 | Designated commercial approver title if not CD | Optional register role unnamed | H-27 §9 | Owner | Name or “CD only” | **Yes** if F2 assigns a non-CD approver | Owner |
| F1-C-06 | UAT authority named or UAT waived for a Dev/Test-only increment | Proposed, not named | H-34 §11.2 | Owner | Name or waiver | **Yes** for F5; per grant for F2 | Owner |
| F1-C-07 | Technical increment owner named | H-33 C-10 | H-33 / H-34 F1-AC-17 | Owner | Name | **Yes** | Owner |
| F1-C-08 | `CPR-*` values authorized **or** increment waiver for category-only C7 | Floor undefined | OR-04; H-27; H-33 C-02 | Owner / management | Waiver or values | **Yes** | Owner |
| F1-C-09 | DR-008 remains DEFERRED; trigger 6 must not close it | Flags ≠ OR-03 | H-33 C-03 | Owner | No silent close | **Yes** if full AC-010 flags claimed | Owner later |
| F1-C-10 | FX provider remains unselected; only basis/date | No provider invention | H-27 §10.4 | F2 author | No provider in increment | **Yes** if F2 selects a provider | Separate decision |
| F1-C-11 | H-34 content-MET ACs are not F2 evidence | H-33 C-07 | H-29 §F | F2/UAT | Independent tests | **Yes** if used as sole proof | Test evidence |
| F1-C-12 | Negotiation revisions = new versioned costing/proposal; do not invent a separate negotiation module | Thin C2 negotiation design | H-34 §2 step 13 | F2 author | Versioning only; no C11+ | **No** if versioning used | F2 increment scope |

**Remediation of H-34 as a whole:** **not required.** F1-C-01 is the only **internal contradiction**; isolated by this register.

---

## 19. Governance status

```text
GPTA-H-35 STATUS = F1 SPECIFICATION REVIEW COMPLETED

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
250k/20% = REJECTED
M0 = WORKING ASSUMPTION — NOT OWNER-APPROVED
C11+ = NOT IN SCOPE
DR-008 = DEFERRED
NA-A-22 = OPEN

NEXT ACTION = CLOSE F1 CONDITIONS OR CARRY THEM AS EXPLICIT F2 BLOCKERS — NO CODING
```

---

## 20. Validation

| Check | Result |
| --- | --- |
| All 20 review areas addressed | **Yes** — §1–3 in preamble (repo/objective/sources); §4–16 reviews; conclusion = §17; §18 conditions; §19 status; this §20 |
| C1–C10 individually reviewed | **Yes** — §5 |
| All F1-AC-* assessed independently | **Yes** — §15 (F1-AC-03/08/09/11/12 **not** upgraded merely because present in H-34) |
| All F2 entry conditions assessed | **Yes** — §16 |
| No numerical commercial targets invented | **Yes** |
| No commercial-floor value invented | **Yes** — `CPR-FLOOR` remains **NOT AUTHORIZED** |
| 250,000 / 20% remains rejected | **Yes** |
| No C11+ scope introduced | **Yes** |
| M0 not converted into an approved migration decision | **Yes** — F1-C-02 |
| No application / schema / migration / data / infrastructure change in this review | **Yes** — documentation only |
| No migration or tests executed | **Yes** |
| Index empty | **Yes** — `git diff --cached` empty |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Dirty tree | **PRESERVED** (pre-existing Class A/B and other uncommitted work untouched) |

**Files created or updated by this review (documentation only):**

* Created: `docs/governance/gpta-h-35-f1-specification-review.md`
* Updated (additive pointers only): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`
* Updated (additive §74 only): `docs/governance/adr-0006-e1-next-action-dependency-register.md`
* Updated (additive H-35 row only): `docs/governance/adr-0006-e1-c-parallel-work-register.md`

H-16–H-34 historical bodies **not rewritten**. Standalone `gpta-h-20/21/22-*.md` remain **absent**. H-23 and H-24 remain present. No coding, F2, production, procurement, or external supplier engagement authorized.
