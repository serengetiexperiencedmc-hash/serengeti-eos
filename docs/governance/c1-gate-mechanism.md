# C1 DEV/TEST GATE MECHANISM

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of this mechanism)**  
> This file is a **historical procedure** for how a C1 Dev/Test Gate outcome could be reached. It is **not** a live gate and does not authorize implementation.  
> **Current C1 Gate outcome:** **PASS — Development/Test only** in committed [`c1-gate-decision.md`](./c1-gate-decision.md). `ba8cf9e` is the **prior** PENDING / NOT PASSED record.  
> C1.1–C1.11 remain COMPLETE. C2–C10 CLOSED. C11+ not created.  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`c55b608001e6af764fc80bd41ce9844b24da60d8`** · **EXECUTION_QUEUE=EMPTY** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Status:** MECHANISM DEFINED — historical procedure. **Current Gate outcome is recorded elsewhere** (`c1-gate-decision.md` PASS Dev/Test only).  
**Environment:** Development/Test only  
**Gate outcome (this mechanism, historical):** **Not determined** by this file. **Current recorded outcome:** PASS — Development/Test only (`c1-gate-decision.md`). This mechanism still does not by itself state PASS / FAIL / CONDITIONAL PASS.

This document defines the **process** for a future independent C1 Dev/Test Gate decision. It is not that decision.

| Field | Value |
| --- | --- |
| Document purpose | Establish how a future C1 Dev/Test Gate outcome may be reached without inventing lost findings or appointing people by inference |
| Provenance | `46b049f82b871ee5e64faf6b7434c96781d841f6` (original C1 snapshot); `ba8cf9e` (committed PENDING / NOT PASSED record); HEAD at drafting `5cc5d137f069390ed535d2bc3abadf9a43507ec8` |
| Mechanism date | 2026-08-23 |
| Decision Authority | **UNASSIGNED / PENDING EXPLICIT GOVERNANCE APPOINTMENT** |
| Independent Reviewer | **UNASSIGNED / PENDING EXPLICIT GOVERNANCE APPOINTMENT** |
| Implementation authorization from this record | **None** |
| C1.1–C1.11 | **COMPLETE** (implementation evidence) |
| C1 Gate | **PENDING / NOT PASSED** (`ba8cf9e`) — **prior** outcome. **Current:** PASS Dev/Test only (`c1-gate-decision.md`) |

This mechanism does not supersede `ba8cf9e` as provenance. It does not replace the committed **current** outcome in `c1-gate-decision.md`. It does not authorize implementation.

---

## 1. Provenance (must be preserved)

| Commit | Fact |
| --- | --- |
| `46b049f` (2026-08-22 17:23:21 +0300) | Same commit introduced C1.1–C1.11 **COMPLETE** and the status assertion **Pending independent upgrade from CONDITIONAL PASS**. Original findings, reviewer, conditions, and acceptance mapping were **not preserved**. |
| `ba8cf9e` | **Prior** committed C1 Gate record: **PENDING / NOT PASSED**. Outcome not determined at that commit. No implementation authorization beyond already-complete C1 work. Reviewer / signatory unassigned. Independent authority not defined. |
| HEAD `5cc5d137` | Contains `ba8cf9e`. Did not contain a committed C1 PASS **at drafting**. Later: `c1-gate-decision.md` records **PASS — Development/Test only**. |

Repository history must not be used to reconstruct the original CONDITIONAL PASS findings.

---

## 2. Decision Authority

**Current status:** **UNASSIGNED / PENDING EXPLICIT GOVERNANCE APPOINTMENT.**

No C1 Dev/Test Gate Decision Authority is named in existing governance. This mechanism does not invent a person or role.

I0 “Serengeti Experience DMC programme direction (chat approval)” in `docs/governance/phase0-i0-approval.md` applies to Phase 0 / I0. It **must not** automatically be reused for C1.

I1 and I4 acceptance documents do not designate a C1 Gate Decision Authority.

An **explicit governance appointment** is required before any C1 Gate outcome may be recorded. Until that appointment exists in a committed record, no PASS, CONDITIONAL PASS, or FAIL is valid.

---

## 3. Independent Reviewer

**Current status:** **UNASSIGNED / PENDING EXPLICIT GOVERNANCE APPOINTMENT.**

No C1 Independent Reviewer is named in the repository. This mechanism does not invent a reviewer.

Independence requirements (apply when a reviewer is later identified):

1. The reviewer must be independent of the C1.11 implementation.
2. The reviewer must not be the author of the current uncommitted C1 PASS working-tree draft.
3. The reviewer must be **explicitly identified** in a committed record **before** an outcome is recorded.

The repository does not name the C1.11 implementer or the PASS-draft author. Those exclusions are **rules**, not identities.

Whether one appointed person may hold both Decision Authority and Independent Reviewer is **not established** in existing records. This mechanism does not invent a one-person or two-person rule. That choice must be stated in the explicit appointment. Until both offices are appointed (or a later appointment record states they are combined), no outcome may be recorded.

---

## 4. Authority rule

The following are **not** C1 Gate authority:

- Chat instructions, including any 2026-08-23 development-session wording
- Passing tests
- C1.1–C1.11 completion
- Uncommitted working-tree documents, including uncommitted PASS edits
- The untracked I4.32 architecture preview
- I0 programme-direction / chat approval, unless a later **explicit** appointment reuses it for C1 (this mechanism does not reuse it)

Only a committed appointment plus a committed outcome record, following this procedure, can constitute a C1 Gate decision.

---

## 5. Evidence rule

| Item | Treatment |
| --- | --- |
| C1.1–C1.11 completion | **Implementation evidence only.** Not Gate PASS. |
| Passing tests | **Evidence only.** Not Gate PASS. `implementation-sequence.md` already states passing tests alone is insufficient. |
| 17-item list in `docs/architecture/c1/implementation-sequence.md` | **Submission checklist only.** Not the recovered original CONDITIONAL PASS finding set. Missing checklist artefacts are not automatically Gate failures. |
| Original CONDITIONAL PASS findings | **Unrecoverable.** Must not be reconstructed. A future outcome must not claim to upgrade unknown historical conditions. |
| Chat, uncommitted PASS edits, untracked I4.32 preview | **No Gate authority.** |

Preserve the four layers from `ba8cf9e`:

1. Original Gate findings — not recoverable.
2. Submission requirements — the 17-item checklist.
3. C1.11 remediation evidence — recorded complete; not proven to be the original findings.
4. Later UAT / Production / C2+ requirements — not recovered CONDITIONAL PASS findings and not authorized by this mechanism.

---

## 6. Independent-review procedure

An Independent Reviewer, once explicitly identified, must dispose of every row in the matrix below **before** Decision Authority may record PASS, CONDITIONAL PASS, or FAIL.

For each applicable row the reviewer records one of:

- **ACCEPT**
- **REQUIRE MORE EVIDENCE**
- **WAIVE**

Each disposition must cite supporting evidence (path, test, commit, or an explicit waiver statement). Dispositions must not invent original CONDITIONAL PASS findings.

### Evidence-resolution matrix

| # | Item | Notes for review |
| --- | --- | --- |
| 1 | Original lost findings | `46b049f` assertion only. Disposition must acknowledge unrecoverable. Do not reconstruct. |
| 2 | C1.1–C1.11 implementation evidence | Accept as implementation completeness only, or require more, or waive gaps. Not a PASS by itself. |
| 3 | 17-item submission checklist | Treat as submission list. Per missing artefact: accept equivalent, require, or waive. |
| 4 | Architecture-diff evidence | No standalone preview-vs-implemented artefact found at `ba8cf9e` recovery. |
| 5 | Unresolved-risks evidence | No standalone risks document found at `ba8cf9e` recovery. |
| 6 | PostgreSQL runtime / schema-only C1 boundary | C1.11: in-memory SoR, schema-only PG. Preview / `test-matrix.md`: “PostgreSQL persistence.” Later PG.3+ dual-write is a later increment, not a C1 Gate outcome. Reviewer must state the C1 Dev/Test SoR. This review must not create PG.30 or reopen ADR-0017. |
| 7 | SD-01 / SD-02 waivers | Recorded **FORMALLY WAIVED** in `security-coverage-disposition.md`. Reviewer must accept, reject, or require I2 templates. The disposition file is not Gate acceptance. |
| 8 | AZ-05 N/A | No C1 CRM export endpoint. Confirm N/A or REQUIRE MORE EVIDENCE if export is judged in C1 scope (that would be new scope). |
| 9 | Observability | `observability-plan.md` remains Proposed. Accept I1 correlation / request-path evidence, require the plan, or waive. |
| 10 | Concurrency | Partial vs `test-matrix.md` concurrency rows; MG-04 / If-Match exist. Accept current evidence, require named cases, or waive. |
| 11 | Live-PG evidence | Live tests gated on `EOS_RUN_PG_TESTS=1` + `EOS_DATABASE_URL`. C1.11 recorded 157/0/4 without live PG. Accept gated/static, require a live run, or waive. |
| 12 | Dev/Test versus UAT/Production | ADR-0006 / 0012 / 0013 remain OPEN. Those are not C1 Dev/Test PASS conditions. |
| 13 | Stale documentation | `implementation-sequence.md`, `crm-mice-authorization-gate.md`, `docs/backlog/increments.md`, and the C1 preview header still say implementation not authorized; committed implementation-authorized table says implementation authorized and C1.1–C1.11 complete. Record which statements are stale. Do not treat stale lines as PASS or FAIL. |
| 14 | Uncommitted PASS edits | Working-tree PASS language is **not** an outcome. Reviewer must not treat it as authority. |
| 15 | Untracked I4.32 preview | Out of this Gate. Not authorization. Reviewer must not use it as C1 evidence or as increment authorization. |

Rows 1, 14, and 15 are mandatory acknowledgements even when the disposition is simply to exclude them from the C1 outcome.

---

## 7. Scope

**In scope**

- C1 Dev/Test Gate procedure
- C1.1–C1.11 evidence
- CRM Dev/Test boundary (including the PostgreSQL interpretation the reviewer must dispose)

**Out of scope — this mechanism does not authorize or decide**

- I4.32 (undefined / unauthorized at HEAD)
- I3.36
- I20.23
- PG.30
- C2+
- UAT
- Production
- Autonomous AI agents
- New persistence implementation
- Reopening ADR-0017
- Creating a second I2 workflow/rules engine

---

## 8. Outcome rule

After the Independent Reviewer is identified and the matrix is disposed, Decision Authority may record exactly one of:

- **PASS**
- **CONDITIONAL PASS**
- **FAIL / NOT PASS**

**CONDITIONAL PASS** must enumerate the **exact** remaining conditions and the evidence required for each. Do not reuse unrecovered historical findings as those conditions.

This mechanism records **none** of those outcomes.

---

## 9. Commit / provenance rule

A future Gate outcome is valid only when recorded in a **dedicated committed decision record** (separate from this mechanism), citing:

- this mechanism document and its commit;
- `46b049f`;
- `ba8cf9e`;
- named Decision Authority;
- named Independent Reviewer;
- date;
- environment (Development/Test only);
- evidence reviewed;
- matrix dispositions;
- accepted boundaries;
- waivers accepted or rejected;
- unresolved risks;
- explicit PASS / CONDITIONAL PASS / FAIL;
- remaining conditions if conditional;
- consequences (what is and is not authorized).

An **uncommitted working-tree edit does not constitute a Gate decision.**

---

## 10. No automatic authorization

Even a future committed C1 **PASS**:

- does **not** authorize I4.32;
- does **not** authorize C2+;
- does **not** authorize UAT or Production;
- does **not** authorize AI agents.

Any future increment requires its own architecture contract and a separate implementation authorization.

This mechanism authorizes **no** increment.

---

## 11. Relationship to existing records

| Record | Relationship |
| --- | --- |
| `ba8cf9e` / committed `c1-gate-decision.md` | `ba8cf9e` = **prior** PENDING / NOT PASSED. **Current** authoritative outcome: `c1-gate-decision.md` **PASS — Development/Test only** |
| Committed `c1-implementation-authorized.md` | Authoritative C1 implementation table: C1.1–C1.11 COMPLETE; C1 Gate **PASS** (Dev/Test); C2–C10 CLOSED; C11+ not authorized |
| This file | Procedure only. Does not change the committed Gate outcome |
| Uncommitted PASS edits | Not authoritative |
| Untracked I4.32 preview | Not authoritative |

---

## 12. Audit metadata

| Field | Value |
| --- | --- |
| Title | C1 DEV/TEST GATE MECHANISM |
| Current status | MECHANISM DEFINED — AUTHORITY AND REVIEWER UNASSIGNED — NO GATE OUTCOME |
| C1.1–C1.11 | COMPLETE |
| C1 Gate | PENDING / NOT PASSED (`ba8cf9e`, historical) · **current PASS Dev/Test only** (`c1-gate-decision.md`) |
| Decision Authority | UNASSIGNED / PENDING EXPLICIT GOVERNANCE APPOINTMENT |
| Independent Reviewer | UNASSIGNED / PENDING EXPLICIT GOVERNANCE APPOINTMENT |
| I4.32 | Undefined / unauthorized |
| C2+ / UAT / Production / AI | Blocked |
