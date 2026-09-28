# GPTA-H-111 — POA 7-Day Accelerated EOS Software Completion Authorization

> **`OWNER / POA IMPLEMENTATION AUTHORIZATION`**  
> **`DECISIONS RECORDED UNDER COMPANY POA`**  
> **`OWNER / POA = PATRICK MAKUNDI`**  
> **`H-111-A SELECTED`**  
> **`EXPLICIT NEW IMPLEMENTATION AUTHORIZATION`**  
> **`NOT H-80 EXIT`**  
> **`NOT H-81 START`**  
> **`NOT H-81 EVIDENCE`**  
> **`NOT EOS / SOFTWARE ADOPTION`**  
> **`NOT OPERATIONAL SoR AUTHORIZATION`**  
> **`NOT PRODUCTION AUTHORIZATION`**  
> **`NOT PRODUCTION DEPLOYMENT`**  
> **`NOT UAT SIGN-OFF`**  
> **`NOT F2-I12`**  
> **`H-80 REMAINS ACTIVE`**  
> **`H-81 REMAINS NOT STARTED`**  
> **`NO COMMIT`** · **`NO PUSH`** (unless separately authorized)

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T12:55:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-111 STATUS = 7-DAY ACCELERATED EOS SOFTWARE COMPLETION PROGRAMME AUTHORIZED

POA DECISION = H-111-A
INCREMENT IDENTIFIER = EOS-7D-ACCEL
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
H-80 REMAINS ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS PROGRAMME IS NOT H-81 EVIDENCE
THIS PROGRAMME IS NOT COMMERCIAL ADOPTION EVIDENCE
THIS PROGRAMME DOES NOT EXIT H-80
THIS PROGRAMME DOES NOT SATISFY H-80 EXIT CONDITIONS M1–M5
THIS PROGRAMME DOES NOT WAIVE H-80
H-110-B REMAINS CONTROLLING FOR H-80 EXIT
H-110 STATEMENT "NO IMPLEMENTATION OR RUNTIME AUTHORIZATION GRANTED" IS SUPERSEDED ONLY FOR THE SCOPE EXPRESSLY AUTHORIZED BY H-111
G-13-B IS SUPERSEDED ONLY TO THE EXTENT OF THIS SEVEN-DAY ENGINEERING PROGRAMME
G-08-B REMAINS UNGRANTED AS A GENERAL COMMERCIAL-FACTS UI INCREMENT
H-111 AUTHORIZES ONLY UI REQUIRED FOR VERIFIED OPERATING WORKFLOWS WITHIN THIS PROGRAMME
H-101 = STOP / NOT VALIDATED (Windows SIGINT path)
H-106 = PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED (acknowledged; not Production; not H-81)
PRODUCTION = NOT AUTHORIZED
UAT SIGN-OFF = NOT AUTHORIZED
NO eos_gateb
PATH D = REQUIREMENTS ONLY — NOT MATURITY DETERMINATION
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED BY THIS RECORD
PUSH = NOT AUTHORIZED BY THIS RECORD
THIS RECORD DOES NOT CREATE H-112
THIS RECORD DOES NOT EXECUTE THE SEVEN-DAY PROGRAMME
AUTHORIZATION ≠ EXECUTION
```

This record is an **explicit new implementation authorization** for a controlled seven-calendar-day engineering programme. Creation of this file does **not** start the programme, modify application code, run migrations, start the API, or perform runtime validation.

H-80 through H-110 and H-29 are **not overwritten** except as expressly stated in §3. Historical governance decisions are **not** rewritten.

---

## 1. Decision identifier and Owner / POA authority

| Field | Record |
| --- | --- |
| Decision identifier | **H-111-A — Authorize 7-day accelerated EOS software completion programme** |
| Document | GPTA-H-111 — POA 7-Day Accelerated EOS Software Completion Authorization |
| Path | `docs/governance/gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md` |
| Type | Owner/POA implementation authorization — **not** an implementation result |
| Sequence | H-110-B (H-80 remains ACTIVE) → **H-111-A engineering acceleration (this record)** → later Day 1–7 execution (not this record) |
| Owner / POA | **Patrick Makundi** |
| Instrument number | **Not recorded; none invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41 / H-85) |
| UAT Authority | **Patrick Makundi** (H-41 / H-85) — UAT **sign-off not** granted by this record |
| Does this record exit H-80? | **NO** |
| Does this record start H-81? | **NO** |
| Does this record authorize Production deployment? | **NO** |
| Does this record create H-112? | **NO** |

H-110 SHA-256 at H-111 creation: `0382AB167B6913E0F4AC3539062B596CA77535362FDD416D283A3F89527E042F`.

---

## 2. Owner / POA rationale

The Company requires accelerated completion of the EOS software for operational and commercial readiness. Waiting for H-80 commercial evidence before completing the software would unnecessarily couple two distinct tracks. The Company therefore authorizes accelerated engineering completion while preserving H-80/H-81 as an independent evidence-based maturity track.

```text
THIS IS AN ENGINEERING ACCELERATION DECISION
THIS IS NOT A WAIVER OF EVIDENCE REQUIREMENTS
SOFTWARE COMPLETION ≠ COMMERCIAL-PROCESS MATURITY
SOFTWARE COMPLETION ≠ EOS ADOPTION
SOFTWARE COMPLETION ≠ H-80 EXIT
SOFTWARE COMPLETION ≠ PRODUCTION AUTHORIZATION
```

---

## 3. Relationship to H-110 / G-13-B / G-08-B

H-110-B remains controlling for **H-80 exit**. H-111 does **not** reverse H-110-B.

H-111 **supersedes** the H-110 statement:

```text
NO IMPLEMENTATION OR RUNTIME AUTHORIZATION GRANTED
```

**only** for the scope expressly authorized in §5–§7 of this record.

H-109 **G-13-B** (defer further F2 implementation/runtime while H-80 remains active) is **superseded only to the extent** of this seven-day engineering programme. G-13-B continues to forbid treating H-80 wait as automatically authorizing unbounded F2 increments, Production, UAT sign-off, F2-I12, or SoR cutover.

**G-08-B** remains **ungranted** as a general commercial-facts UI increment. H-111 authorizes **only** UI required for verified operating workflows already established by existing requirements (H-29 C-spine and authorized F2/Dev/Test surfaces), not a general UI rewrite and not EOS-adoption UI.

---

## 4. Critical separation — H-80 / H-81

```text
H-80 REMAINS ACTIVE
H-81 REMAINS NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
```

The accelerated software programme **MUST NOT** be represented as:

- commercial adoption evidence;
- H-81 evidence;
- Path D operating evidence;
- genuine post-H-75 commercial activity;
- proof of EOS adoption;
- satisfaction of H-80 exit conditions M1–M5.

A genuine post-H-75 commercial case must still be observed independently before H-81 can begin.

H-84/H-85 independence rule remains: implementation **cannot** satisfy the H-81 evidence trigger and **cannot** be represented as natural post-H-75 commercial evidence.

F2-DP-01 and H-106 remain valid **within their documented Dev/Test scope**. They are **not** Production readiness, H-81 evidence, commercial adoption evidence, or full EOS completion.

---

## 5. Authorized 7-day scope

Cursor / engineering is authorized to:

1. Perform a complete repository/system audit.
2. Build a requirements-to-implementation gap matrix.
3. Resolve authorized P0/P1 engineering gaps.
4. Complete core EOS commercial workflows **where requirements already exist**.
5. Complete authorized persistence and data-integrity work.
6. Complete authorized APIs.
7. Complete authorized UI required for the verified operating workflows.
8. Implement appropriate authentication/authorization controls.
9. Complete required tests.
10. Add focused tests where critical coverage is missing.
11. Fix defects discovered during the seven-day programme.
12. Perform authorized Dev/Test runtime validation.
13. Improve startup/shutdown reliability where required (Windows SIGINT experiment remains **not** authorized; the H-106 deterministic POST path may remain valid evidence).
14. Prepare deployment and operational documentation.
15. Produce a final production-readiness **audit** (assessment only — not Production authorization).

Engineering must prioritize the **smallest safe implementation** that satisfies an **already-authorized requirement**.

Authorized Dev/Test target, when runtime validation is performed, remains the isolated non-production-like identity already used for F2-DP-01: TCP `127.0.0.1:5432/eos`. Gate B / `eos_gateb` remains **not** a target.

---

## 6. Requirements discipline

The engineering team **MUST NOT** invent business rules.

Where requirements are ambiguous, contradictory, or genuinely absent:

- identify the issue;
- document it;
- do **not** silently invent the rule;
- implement only if existing governance/requirements **clearly** establish the intended behaviour.

Controlling requirements sources remain H-29 (C-spine / commercial-rule baseline), H-25/H-24 authorized business rules as recorded, H-83 G-01–G-12 policy (not standing open software grants except as consumed by H-85/H-111), and subsequent bounded grants. Prompt/UAT label collisions with H-29 C9=Booking / C10=KPI remain governed by H-83 G-09-B.

Legacy **250k / 20%** remains **legacy** and is **not** an approved F2 qualification rule. `sellPrice` ≠ revenue. Costing margin ≠ profit.

---

## 7. 7-day delivery model

| Day | Focus | Evidence |
| --- | --- | --- |
| **Day 1 — AUDIT** | Full repository architecture and requirements audit | `docs/governance/accelerated-build-day-1-system-gap-matrix.md` and `docs/governance/accelerated-build-day-1-report.md` |
| **Day 2 — FOUNDATION** | Highest-priority P0/P1 architecture, persistence, API, and reliability gaps | `docs/governance/accelerated-build-day-2-report.md` |
| **Day 3 — COMMERCIAL CORE** | Verified core commercial workflows where requirements already exist | `docs/governance/accelerated-build-day-3-report.md` |
| **Day 4 — DATA / OPERATIONAL INTEGRITY** | Persistence, relationships, identifiers, validation, auditability, data integrity | `docs/governance/accelerated-build-day-4-report.md` |
| **Day 5 — UI / SECURITY / REPORTING** | Required operating UI and authorization/security controls | `docs/governance/accelerated-build-day-5-report.md` |
| **Day 6 — TEST / REMEDIATE** | Full tests, critical coverage, failures and regressions | `docs/governance/accelerated-build-day-6-report.md` |
| **Day 7 — READINESS** | Final production-readiness audit; remaining blockers | `docs/governance/accelerated-build-day-7-report.md` and `docs/governance/accelerated-build-final-readiness-audit.md` |

Each daily report, when produced during execution, must contain: work completed; files changed; tests run; tests passed; tests failed; defects discovered; defects resolved; unresolved blockers; governance issues; remaining P0/P1 gaps; production-readiness implications.

The **final** audit must classify every major capability as one of:

`COMPLETE` · `COMPLETE WITH FINDINGS` · `PARTIAL` · `NOT IMPLEMENTED` · `BLOCKED` · `DEFERRED`

and must include requirements traceability; architecture; functional status; data/persistence; security; test evidence; runtime validation evidence; deployment readiness; operational readiness; known limitations; production blockers; governance blockers; and an explicit distinction between software completion and EOS adoption.

**Do not** use an arbitrary percentage such as “95% complete.”

Those Day 1–7 and final files are **authorized future execution artefacts**. They are **not** created by this H-111 record.

---

## 8. Production gate

Production readiness remains a **separate evidence-based gate**.

The seven-day programme **may prepare** the system for Production. It **may NOT** declare Production authorized merely because:

- tests pass;
- the application starts;
- Dev/Test works;
- migrations succeed in Dev/Test;
- the UI is complete;
- the seven days have elapsed.

At the end of the programme, produce a production-readiness **assessment**. Production authorization remains a **separate Owner/POA decision** based on that evidence.

```text
PREPARE ≠ AUTHORIZE PRODUCTION
TESTS PASS ≠ PRODUCTION AUTHORIZED
DEV/TEST WORKS ≠ PRODUCTION AUTHORIZED
SEVEN DAYS ELAPSED ≠ PRODUCTION AUTHORIZED
```

---

## 9. Specific boundaries — NOT automatically authorized

H-111 does **NOT** automatically authorize:

- Production deployment;
- Production database migration;
- Production data modification;
- UAT sign-off;
- Gate B;
- `eos_gateb`;
- F2-I12;
- thawing I1–I11 **governance** (catalogues may be **consumed**, not rewritten, per H-83 G-12-C);
- SoR cutover;
- mailbox / Excel / WhatsApp / phone ingestion;
- automatic commercial-system integration;
- booking **authority** (G-05-E; H-80/H-81 not satisfied);
- KPI **history**;
- revenue definitions;
- profit definitions;
- FX rules;
- Path D maturity determination;
- H-81 execution;
- EOS adoption claims;
- deletion of H91 synthetic rows;
- deletion of governance evidence;
- rewriting historical governance decisions;
- forced repository cleanup (`git reset` / `git clean` / stash-discard / revert of unrelated dirty-tree work);
- commit / push unless **separately** authorized;
- Windows SIGINT testing;
- any unrelated architectural rewrite.

If one of these becomes technically necessary: **STOP** that specific item and record it as a **governance blocker**. Do not silently expand scope.

---

## 10. Fail-closed rule

If implementation reveals:

- an unauthorized business rule;
- an unresolved governance contradiction;
- a Production-only requirement;
- a requirement that materially changes the commercial model;
- a requirement that would alter frozen governance;
- a requirement that requires H-81 evidence;

**STOP** that specific scope item and document it. Do **not** invent a solution merely to keep the seven-day schedule.

---

## 11. H-101 / startup-shutdown

```text
H-101 = STOP / NOT VALIDATED — Windows SIGINT
```

Do **not** perform another SIGINT experiment. The previously validated deterministic Dev/Test POST shutdown path (H-106) may remain valid evidence for that path only.

---

## 12. Worktree safety

The existing dirty worktree **MUST** be preserved.

Never: `git reset`; `git clean`; `git stash` discard; revert of unrelated changes; overwrite of unrelated files; force-push; deletion of existing evidence.

Before and after every major execution action, inspect repository state. HEAD at authorization: `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Index **EMPTY**.

---

## 13. Implementation / runtime / commit statements

```text
IMPLEMENTATION AUTHORIZATION = YES — SEVEN-DAY PROGRAMME SCOPE ONLY (§5–§7)
RUNTIME VALIDATION AUTHORIZATION = YES — AUTHORIZED DEV/TEST ONLY (127.0.0.1:5432/eos)
PRODUCTION RUNTIME = NOT AUTHORIZED
UAT SIGN-OFF = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED BY THIS RECORD
PUSH = NOT AUTHORIZED BY THIS RECORD
EXECUTION OF THIS RECORD = NOT PERFORMED BY CREATION OF THIS FILE
```

---

## 14. Governance status after H-111

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
H-110-B = CONTROLLING FOR H-80 EXIT
H-111-A = 7-DAY ENGINEERING PROGRAMME AUTHORIZED — NOT EXECUTED BY THIS RECORD
G-08-B = UNGRANTED AS GENERAL COMMERCIAL-FACTS UI INCREMENT
H-101 = STOP / NOT VALIDATED (Windows SIGINT)
H-106 = PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT SIGN-OFF = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
EOS ADOPTION = NOT ESTABLISHED
H-112 = NOT CREATED
```

---

## 15. Repository safety for this documentation action

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **430** |
| Application / schema / migration / H-80–H-110 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

Pre-existing dirty-worktree changes are **preserved exactly**.

---

## 16. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
THE SEVEN-DAY PROGRAMME IS NOT STARTED BY CREATION OF THIS RECORD
NO API PROCESS STARTED BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO TEST CHANGE BY THIS RECORD
NO MIGRATION BY THIS RECORD
DAY 1–7 REPORTS = NOT CREATED BY THIS RECORD
FINAL READINESS AUDIT = NOT CREATED BY THIS RECORD
H-112 = NOT CREATED
```

---

## 17. Next governance gate

```text
NEXT GATE = EXECUTE DAY 1 AUDIT UNDER THIS AUTHORIZATION AND PRODUCE accelerated-build-day-1-system-gap-matrix.md AND accelerated-build-day-1-report.md
THIS RECORD DOES NOT PERFORM THAT EXECUTION
THIS RECORD DOES NOT CREATE H-112
THIS RECORD DOES NOT AUTHORIZE PRODUCTION, UAT SIGN-OFF, H-81, SoR CUTOVER, F2-I12, INGEST, BOOKING AUTHORITY, OR COMMIT/PUSH
H-80 REMAINS ACTIVE
```
