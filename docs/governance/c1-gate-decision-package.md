# C1 GATE DECISION PACKAGE

**Status:** OUTCOME RECORDED — see `docs/governance/c1-gate-decision.md`  
**Environment:** Development/Test only  
**Package date:** 2026-08-24  
**Authoritative HEAD at assembly:** `1d722670a43e88e8afb488b0578b140b6987b0a3`  
**API identity at HEAD:** `1.04.0-i3.37`  
**Gate outcome:** **PASS — Development/Test only** (recorded 2026-08-24). This package remains the evidence matrix. It does not appoint a named reviewer. It does not authorize C2+, UAT, Production, AI/LLM, I3.38, I4.35, I20.23, or PG.30.

| Field | Value |
| --- | --- |
| Document purpose | Assemble committed C1 evidence so an independent reviewer can record one Gate outcome |
| Authoritative outcome record | `docs/governance/c1-gate-decision.md` at commit `ba8cf9e5e9be05c7f7a1f19f1173d32781929b66` |
| Authoritative implementation table | `docs/governance/c1-implementation-authorized.md` at HEAD |
| Working-tree PASS wording | **Not authoritative.** Must not be treated as a Gate decision. |
| Untracked `c1-gate-mechanism.md` | **Not authoritative.** Inspection only. |
| Implementation authorization from this package | **None** |

---

## 1. C1 scope

C1 is CRM Foundation for Development/Test only: Organizations, units, contacts, relationships, accounts, activities, notes, tasks, search, duplicates, controlled merge, tags, external identifiers, CRM domain events, security/hardening, and C1.11 Gate remediation.

C1 is not Opportunity/RFP/Supplier/Programme/Costing/Proposal/Booking, not UAT, not Production, not AI, and not a production PostgreSQL system of record.

---

## 2. Why this package cannot record the Gate

Committed `c1-gate-decision.md` (`ba8cf9e`) states:

- Gate outcome is **not determined**.
- Original CONDITIONAL PASS findings, reviewer, conditions, and acceptance mapping are **not recoverable** from Git (`46b049f` introduced the status assertion and C1.1–C1.11 COMPLETE in the same commit).
- Reviewer / signatory: **UNASSIGNED / PENDING GOVERNANCE**.
- Independent authority: **Not defined in the repository**.
- C1.1–C1.11 completion is **not** the independent Gate upgrade.
- Passing tests alone is insufficient (`docs/architecture/c1/implementation-sequence.md`).
- Chat instructions and uncommitted documents are **not** Gate authority.

Classification of an agent-recorded outcome from this evidence:

**D. INSUFFICIENT EVIDENCE TO RECORD A GATE OUTCOME.**

That is a process gap, not a demonstrated C1 implementation defect.

| Option | Supportable by repository evidence alone? |
| --- | --- |
| A. PASS | **No.** Completeness and tests are evidence, not the independent decision. |
| B. CONDITIONAL PASS | **No.** Exact remaining conditions would have to be invented or recovered from lost findings. |
| C. NOT PASS | **No.** Committed records do not identify an unsatisfied C1.1–C1.11 requirement as a Gate failure. Missing original findings must not be treated as automatic failures. |
| D. INSUFFICIENT EVIDENCE | **Yes** — for recording an outcome without an appointed independent decision. |

---

## 3. C1.1–C1.11 status (committed implementation evidence)

Source: HEAD `docs/governance/c1-implementation-authorized.md`.

| Increment | Committed status | Evidence (HEAD) |
| --- | --- | --- |
| C1.1 Database/domain foundation | COMPLETE | Migrations `004`+; kernel CRM types; module skeleton |
| C1.2 Organizations + units | COMPLETE | `c1.organizations.test.ts`; org lifecycle; tenant 404 |
| C1.3 Contacts + relationships | COMPLETE | `c1.contacts.test.ts`; relationships; email duplicate rule |
| C1.4 Activities + interaction history | COMPLETE | `c1.activities.test.ts`; immutable associations |
| C1.5 Accounts + notes + tasks | COMPLETE | `c1.accounts-notes-tasks.test.ts`; recorded 88/0/2 skipped |
| C1.6 Search + duplicates | COMPLETE | `c1.search-duplicates.test.ts`; recorded 99/0/2 skipped |
| C1.7 Controlled merge + bulk import | COMPLETE | `c1.merge-import.test.ts`; recorded 106/0/2 skipped |
| C1.8 Tags + external identifiers | COMPLETE | `c1.tags-external-identifiers.test.ts`; recorded 117/0/2 skipped |
| C1.9 CRM domain events | COMPLETE | `c1.events.test.ts`; outbox; recorded 128/0/2 skipped |
| C1.10 Hardening | COMPLETE | `crm.security.regression.test.ts`; `crm.integration.test.ts`; Gate **NOT passed** in committed notes |
| C1.11 Gate remediation | COMPLETE | Atomicity, OpenAPI, performance, security disposition; recorded **157 passed / 0 failed / 4 skipped** at `0.14.0-c1.11` without live PG |

Committed C1 Gate row: **Pending independent upgrade from CONDITIONAL PASS.**

---

## 4. Current C1/CRM automated evidence (2026-08-24)

Targeted Vitest at HEAD `1d722670`, `apps/api`, no `EOS_RUN_PG_TESTS`:

| Result | Count |
| --- | --- |
| Test files | 14 passed |
| Tests | **111 passed** |
| Skipped | **3** (live PostgreSQL gated) |
| Failed | **0** |

Files: `c1.foundation.test.ts`, `c1.organizations.test.ts`, `c1.contacts.test.ts`, `c1.activities.test.ts`, `c1.accounts-notes-tasks.test.ts`, `c1.search-duplicates.test.ts`, `c1.merge-import.test.ts`, `c1.tags-external-identifiers.test.ts`, `c1.events.test.ts`, `c1.11.atomicity.test.ts`, `c1.11.openapi.test.ts`, `c1.11.performance.test.ts`, `crm.security.regression.test.ts`, `crm.integration.test.ts`.

This run is **current Dev/Test evidence**. It is not Gate PASS. The historical C1.11 “157/4 skipped” figure was a broader API suite at `0.14.0-c1.11`; identity is now `1.04.0-i3.37`. Version drift is not a C1 Gate finding (`ba8cf9e` §2).

---

## 5. Requirement matrix

Disposition column is for the **independent reviewer**. This package does not dispose the rows.

| Requirement | Evidence | Status | Remaining action | Blocking C1 Dev/Test Gate? |
| --- | --- | --- | --- | --- |
| C1.1–C1.11 implementation | `c1-implementation-authorized.md` | COMPLETE | Accept as implementation completeness, or require more | Reviewer must dispose. Completeness ≠ PASS |
| Original CONDITIONAL PASS findings | `46b049f` status assertion only | UNRECOVERABLE | Acknowledge unrecoverable. Do not reconstruct | Must not be invented as failures or as upgraded conditions |
| Independent reviewer / Decision Authority | `ba8cf9e` | UNASSIGNED | Human appointment or the recorder identifies themselves in the outcome record | **Yes — outcome cannot be recorded without this** |
| 17-item submission checklist | `implementation-sequence.md` | Submission list, not recovered findings | Per missing artefact: accept equivalent, require, or waive | Not automatically FAIL |
| Architecture-diff artefact | No standalone preview-vs-implemented document at `ba8cf9e` recovery | MISSING as named artefact | Accept equivalent (preview + implementation notes), require artefact, or waive | Reviewer |
| Database migrations 004–013 | `packages/db/migrations/`; static check in `crm.integration.test.ts` | PRESENT | Accept or list remaining schema conditions | Reviewer |
| OpenAPI | `docs/architecture/openapi/crm-c1.yaml`; `c1.11.openapi.test.ts` | PRESENT | Accept or list gaps | Reviewer |
| RBAC/ABAC | AZ-* in `crm.security.regression.test.ts` | PRESENT | Accept or list gaps | Reviewer |
| Tenant isolation | TI-* same suite | PRESENT | Accept or list gaps | Reviewer |
| SoD SD-01 / SD-02 | **FORMALLY WAIVED** in `security-coverage-disposition.md`; I2 templates stubbed (`workflow-integration.md`) | WAIVER RECORDED — not Gate acceptance of the waiver | Accept waiver, reject, or require I2 templates | Reviewer |
| Audit | AU-01 + mutation audit | PRESENT | Accept or list gaps | Reviewer |
| Duplicates | `c1.search-duplicates.test.ts` | PRESENT | Accept or list gaps | Reviewer |
| Merge | `c1.merge-import.test.ts`; MG-* | PRESENT | Accept or list gaps | Reviewer |
| Events | `c1.events.test.ts`; EV-*; `commitCrmWithOutbox()` | PRESENT | Accept or list gaps | Reviewer |
| Concurrency | MG-04 stale version / If-Match; not every `test-matrix.md` concurrency row | PARTIAL vs matrix | Accept current, require named cases, or waive | Reviewer |
| Security regression | 22 IMPLEMENTED+PASS · 1 N/A (AZ-05, no C1 export) · 2 FORMALLY WAIVED | 100% disposition of planned IDs | Accept disposition or reopen waived IDs | Reviewer |
| Performance | `performance-baseline.md`; `c1.11.performance.test.ts` | Dev/Test samples, not an SLA | Accept as Dev/Test baseline or require more | Reviewer |
| Observability | `observability-plan.md` still **Proposed**; optional `GET /v1/crm/operations` not found | PLAN NOT MARKED IMPLEMENTED | Accept I1 request-path evidence, require the plan, or waive | Reviewer |
| Test matrix / live PG | Live tests gated on `EOS_RUN_PG_TESTS=1` + `EOS_DATABASE_URL`. This package: 3 skipped | IN-MEMORY SUITE VERIFIED; live PG UNVERIFIED | Accept gated/static, require a live run, or waive | Reviewer. Unavailability is not a new increment |
| Unresolved-risks document | No standalone risks artefact at `ba8cf9e` recovery | MISSING as named artefact | Accept scattered notes, require a document, or waive | Reviewer |
| ADR impact | `adr-impact-assessment.md`: no new ADR required to start C1 Dev/Test; ADR-0006 / 0012 / 0013 remain OPEN | PRESENT | Confirm those ADRs still block UAT/Production, not automatically C1 Dev/Test | Reviewer |
| CRM PostgreSQL runtime vs schema-only | Preview/`test-matrix.md` DoD lists “PostgreSQL persistence”. C1.11: in-memory read SoR; PG schema-only until a later persist increment; live PG create expects row count 0 | UNRESOLVED SCOPE INTERPRETATION (`ba8cf9e` §5) | Reviewer must state the C1 Dev/Test SoR. Must not create PG.30 or reopen ADR-0017 | Reviewer if material to this Gate |
| Stale “implementation not authorized” lines | `implementation-sequence.md`, `crm-mice-authorization-gate.md`, `docs/backlog/increments.md`, C1 preview header | STALE vs committed implementation-authorized table | Record which statements are stale. Do not treat them as PASS or FAIL | No |
| Working-tree C1 PASS edits | Uncommitted `c1-gate-decision.md` / `c1-implementation-authorized.md` / `c1-crm-preview.md` | NOT AUTHORITATIVE | Ignore for this decision | No — must not be committed as the outcome |
| Untracked I4.32 duplicate preview | `i4.32-dlq-sla-digest-stale-audit-export-presets-rename-delete-preview.md` | OUT OF GATE | Ignore. I4.32 already IMPLEMENTED via the other contract | No |
| UAT / Production / IdP / secrets / hosting | ADR-0006, 0012, 0013 OPEN | BLOCKED independently | Not C1 Dev/Test PASS conditions (`ba8cf9e`) | No for C1 Dev/Test |
| C2+ new work | Blocked pending this Gate; C2–C10 / J1 / J2 already exist in source from earlier work | NEW C2+ still requires its own authorization even after PASS | Do not treat this package as C2+ authorization | After Gate: still a separate authorization |
| I3.37 / I4.34 / I20.22 verification gaps | Owned by those closed increments | NOT C1 | Do not convert into C1 conditions or successor IDs | No |

---

## 6. Security findings (C1.11 disposition)

`docs/architecture/c1/security-coverage-disposition.md`:

- 22 IMPLEMENTED + PASS
- AZ-05 NOT APPLICABLE (no C1 CRM export endpoint)
- SD-01 / SD-02 FORMALLY WAIVED (I2 merge/import workflow stubbed in C1 Dev/Test)

This file is coverage disposition, not Gate acceptance of the waivers.

---

## 7. Architecture / release findings

- C1 architecture preview: **APPROVED**; implementation **AUTHORIZED — Dev/Test** (committed implementation-authorized table).
- Committed C1 preview §13 Gate row: **Pending independent upgrade** (working-tree PASS row is not authority).
- ADR-0006 / 0012 / 0013 remain proposed/open. They block UAT/Production. They are not recovered CONDITIONAL PASS findings.
- ADR-0017 remains the Dev/Test dual-write / in-memory read SoR boundary. This package must not reopen it.
- Production readiness remains false until a Production Readiness Review (`phase0-i0-approval.md`). I0 chat approval must not be reused as C1 Gate authority unless a later explicit appointment says so.

---

## 8. Known defects and verification gaps

**C1 implementation defects demonstrated in committed records:** none identified as open C1.1–C1.11 blockers.

**C1 verification gaps (not defects, not new increments):**

- Live PostgreSQL CRM tests not executed in this environment
- Live confirmation of schema-only PG row-count behaviour
- Full-matrix concurrency rows beyond MG-04 / If-Match
- Observability plan not marked implemented
- Credentialed/browser CRM UI Gate pass (not recorded as C1.11 evidence)

**Non-C1 gaps (do not attach to this Gate):** I3.37 / I3.36 / I4.34 PostgreSQL dual-write, restart, hydrate, persist-failure, and live isolation checks remain on those closed increments.

---

## 9. Decision options and consequences

Record exactly one outcome in a **dedicated committed decision record** (do not use an uncommitted working-tree edit). Cite this package, `46b049f`, `ba8cf9e`, HEAD `1d722670`, named Decision Authority, named Independent Reviewer (or a statement that they are the same person), date, and Development/Test only.

### PASS — Development/Test only

Meaning: C1 Dev/Test Gate is passed on current evidence, without claiming to upgrade unknown historical CONDITIONAL PASS findings.

Does:

- Record C1 Dev/Test Gate PASS.

Does not:

- Automatically authorize C2+
- Authorize UAT or Production
- Authorize AI agents / LLM / autonomous apply
- Assign I3.38, I4.35, I20.23, or PG.30
- Close ADR-0006 / 0012 / 0013
- Reopen ADR-0017
- Convert I3.37 verification gaps into C1 work

### CONDITIONAL PASS — Development/Test only

Meaning: C1 Dev/Test may proceed under **exact new conditions** listed in the outcome record. Do not reuse unrecovered historical findings as those conditions.

Each condition must state the evidence required and whether it blocks new C2+ authorization.

Does not automatically authorize C2+, UAT, Production, AI, or successor IDs.

### NOT PASS / FAIL

Meaning: C1 Dev/Test Gate is not passed.

The outcome must list **objective remaining conditions**. Remediation is a separately authorized action. This package does not authorize that remediation.

Do not choose NOT PASS solely because:

- the original reviewer is unnamed;
- original CONDITIONAL PASS findings are unrecoverable;
- live PostgreSQL was unavailable;
- a working-tree PASS draft exists;
- C1.1–C1.11 completion is “only” implementation evidence.

---

## 10. Recommended option (advisory — not an outcome)

Repository evidence supports that **NOT PASS is not required** merely because the reviewer is unassigned or original findings are lost.

Repository evidence does **not** allow this agent to record PASS.

**Advisory recommendation to the human Decision Authority:**

If you accept C1.1–C1.11 completeness, the security disposition, in-memory Dev/Test CRM SoR, and gated/static PostgreSQL evidence as sufficient for a **fresh** C1 Dev/Test Gate — and you explicitly refuse to reconstruct lost CONDITIONAL PASS findings — record **PASS — Development/Test only**.

If any matrix row must remain a binding condition (commonly: live PG run, observability-plan implementation, named architecture-diff artefact, or SD-01/SD-02 waiver acceptance), record **CONDITIONAL PASS** and list only those exact conditions.

Do not record **NOT PASS** unless you identify an objective unsatisfied C1 Dev/Test requirement.

This recommendation is not a Gate decision.

---

## 11. Human decision — recorded

**Recorded 2026-08-24:** PASS — Development/Test only.

See `docs/governance/c1-gate-decision.md`. A named Independent Reviewer identity was not designated and was not invented. Working-tree PASS drafts dated 2026-08-23 were not used as authority.

---

## 12. What continues immediately after the decision

| Outcome | Next execution path |
| --- | --- |
| PASS | Reassess remaining **already-defined and separately authorized** work. Do not start new C2+ solely because C1 passed. C2–C10 / J1 / J2 already exist in source. Do not invent I3.38 / I4.35 / I20.23 / PG.30. |
| CONDITIONAL PASS | Execute only repository-authorized conditions. Stop only conditions that need external infrastructure or further human approval. |
| NOT PASS | Execute only separately authorized remediation. Prepare the next review package against the listed objective conditions. |

I3.36, I3.37, I4.34, I20.22, and PG.29 remain closed. Their verification gaps stay with them.

---

## 13. Audit metadata

| Field | Value |
| --- | --- |
| Title | C1 GATE DECISION PACKAGE |
| Outcome | **PASS — Development/Test only** (`c1-gate-decision.md`, 2026-08-24) |
| C1.1–C1.11 | COMPLETE (implementation evidence) |
| C1 Gate | PASS — Development/Test only |
| Current C1/CRM tests | 111 passed / 0 failed / 3 skipped (2026-08-24, no live PG) |
| Decision Authority | Explicit 2026-08-24 project-authority instruction |
| Independent Reviewer | Not designated — not invented |
| C2+ / UAT / Production / AI | Blocked (unchanged by this PASS) |
| Successor IDs | Undefined |
