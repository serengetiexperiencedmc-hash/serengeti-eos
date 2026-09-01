# Selection — CD Phase 1 Commercial Foundation

> **CURRENT STATE (2026-08-31 — post-merge reconciliation of already-executed GitHub PR merges; does not authorize a new capability)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **origin/master=`d918f98729f2f3fd0969d7cc6066700dcb21fb01`**  
> **BASE_SHA=`7c75a16ca942755421bc4ef8a528e0bf2d579e41`** (historical Phase 1 baseline; this was `origin/master` on 2026-08-30)  
> **IMPLEMENTATION_COMMIT=`eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43`**  
> **Capability PR1 (Procurement Catalogue) / capability PR2 (SourcingEvent):** IMPLEMENTED / CLOSED — not reopened; not expanded. These identifiers are **not** GitHub PR #1 / #2 / #3.  
> **GitHub PR #1 / #2 / #3:** merge vehicles only — subsequently **MERGED** (see Post-merge reconciliation).  
> **ADR-0006 / ADR-0012 / ADR-0013:** OPEN — not closed. This record does **not** decide hosting or Production storage.  
> **DP-0006:** NOT APPROVED.  
> **STAGE_1_APPROVED=YES** · **STAGE_1_CONTRACT=FROZEN (2026-08-30 amendment)** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test only; existing isolated worktree only)  
> **REMEDIATION_AUTHORIZED=YES** · **REMEDIATION_STATUS=COMPLETED** · **REMEDIATION_REVIEW=PASS / COMMIT READY** (technical; **not** Owner commit authorization)  
> **COMMIT_AUTHORIZED=YES** · **COMMIT=COMPLETED**  
> **PUSH_AUTHORIZED=YES** · **PUSH=COMPLETED**  
> **UAT_AUTHORIZED=YES** · **UAT_SCOPE=DEV/TEST ONLY** · **UAT=PASS**  
> **PRODUCTION=NOT_AUTHORIZED / NOT_TOUCHED**  
> **MIGRATION_EXECUTION=NOT_AUTHORIZED / NOT_EXECUTED** (migrations **119–122** included as files only; **must not** be executed)  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **CAL=DEFERRED** · **C11+=NOT CREATED / NOT AUTHORIZED**  
> **NEXT GATE=OWNER DECISION / HOLD**  
> Frozen Stage 1 contract: [`../architecture/cd-phase1-commercial-foundation-preview.md`](../architecture/cd-phase1-commercial-foundation-preview.md)

**CAPABILITY:** Commercial Department Phase 1 — RFP-to-Programme foundation (documents, contracts, hotel profile extensions, programme item richness).  
**STRATEGY:** Extend existing C3–C8 commercial spine; do not invent parallel RFP / supplier / hotel / programme / proposal masters.

```text
OWNER SELECTION            ≠ STAGE 1 DRAFT
STAGE 1 DRAFT              ≠ STAGE 1 APPROVAL
STAGE 1 APPROVAL           ≠ IMPLEMENTATION AUTHORIZATION
IMPLEMENTATION AUTHORIZATION ≠ REMEDIATION AUTHORIZATION
REMEDIATION AUTHORIZATION  ≠ TECHNICAL COMMIT READINESS
TECHNICAL COMMIT READINESS ≠ OWNER COMMIT AUTHORIZATION
OWNER COMMIT AUTHORIZATION ≠ PUSH AUTHORIZATION
PUSH AUTHORIZATION         ≠ UAT AUTHORIZATION
UAT AUTHORIZATION          ≠ MIGRATION EXECUTION AUTHORIZATION
UAT AUTHORIZATION          ≠ PRODUCTION AUTHORIZATION
UAT AUTHORIZATION          ≠ DEPLOYMENT AUTHORIZATION
UAT AUTHORIZATION          ≠ PR MERGE AUTHORIZATION
UAT PASS                   ≠ ANY OF THE ABOVE
IMPLEMENTATION AUTHORIZATION ≠ TEST AUTHORIZATION
TEST AUTHORIZATION         ≠ PREVIEW AUTHORIZATION
PREVIEW AUTHORIZATION      ≠ COMMIT AUTHORIZATION
TEST AUTHORIZATION         ≠ UAT AUTHORIZATION
UAT AUTHORIZATION          ≠ PRODUCTION AUTHORIZATION
```

## Sequence (do not rewrite history)

This record **does not claim** that implementation authorization existed before the implementation was created.

Observed sequence:

1. Commercial Department Phase 1 implementation **already existed** as uncommitted work in the isolated Dev/Test worktree `serengeti-eos-cd-phase1` on `feat/cd-phase1-foundation` at baseline `7c75a16ca942755421bc4ef8a528e0bf2d579e41`.
2. A forensic conformance audit identified that `IMPLEMENTATION_AUTHORIZED=YES` was **asserted in uncommitted docs co-located with the code**, and was **not independently evidenced** as a prior Owner grant.
3. On **2026-08-30**, the Owner **explicitly** grants Dev/Test implementation authorization for that **already-existing** implementation.
4. That implementation authorization is recorded **retrospectively**. It does **not** retroactively alter the historical sequence of events.
5. After Contract Review, the Stage 1 contract was **amended and frozen**. Implementation code was **not** changed by that freeze.
6. The Owner then **explicitly** authorized Dev/Test **remediation** of R-01–R-05. That grant did **not** exist before it was given. It is **not** commit, UAT, push, or Production authorization.
7. Remediation of R-01–R-05 was **completed** in the same uncommitted worktree. A read-only Commit Readiness Review recorded **TECHNICAL COMMIT READINESS = PASS**. That review is **not** Owner commit authorization.
8. A later governance reconciliation recorded items 6–7. At that time **COMMIT remained NOT_AUTHORIZED**.
9. On **2026-08-30**, the Owner **explicitly** granted **COMMIT_AUTHORIZED=YES** for creating **one local Git commit** of the already-reviewed Phase 1 changeset only. That grant did **not** exist before it was given. It is **not** push, UAT, PR, migration execution, or Production authorization.
10. That local commit was created as `eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43`. At that time **PUSH remained NOT_AUTHORIZED / NOT_EXECUTED.**
11. On **2026-08-30**, the Owner **explicitly** granted **PUSH_AUTHORIZED=YES** for pushing **only** commit `eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43` on `feat/cd-phase1-foundation`. That grant did **not** exist before it was given. It is **not** UAT, PR merge, migration execution, or Production authorization.
12. That authorized commit was pushed to `origin` (`https://github.com/serengetiexperiencedmc-hash/serengeti-eos.git`). **PUSH=COMPLETED**. At that time **UAT remained NOT_AUTHORIZED / NOT_EXECUTED.**
13. A later **governance-only** commit `8cc9796f20dd400338e6fabc809f4695138924c5` recorded the completed push. That commit is current **HEAD**. It still recorded **UAT = NOT_AUTHORIZED / NOT_EXECUTED** because UAT had not yet been granted.
14. On **2026-08-30**, the Owner **explicitly** granted **UAT_AUTHORIZED=YES** for **Dev/Test only**, existing pushed implementation, frozen Stage 1 contract, existing authorized UAT procedure. That grant did **not** exist before it was given. It is **not** migration execution, Production, deployment, PR merge, or additional implementation authorization.
15. That UAT executed the existing in-memory frozen-contract procedure only (`seedStore` / Fastify inject / kernel Vitest): `commercial-document.test.ts` (3), `cd-phase1-foundation.test.ts` (7), `pr1-procurement.test.ts` (3), `pr2-sourcing-events.test.ts` (3). **UAT_TESTS = 16 PASS / 0 FAIL / 0 BLOCKED.** **UAT=PASS.** **UAT_MIGRATIONS=NOT_EXECUTED.** **DATABASE=UNCHANGED.** **PRODUCTION=NOT_TOUCHED.** Residual coverage limitations (browser R-01, hotel GET, max-bytes HTTP, empty-list HTTP, AI-principal HTTP, separate internal/client notes, dedicated C7/C8 suite) remain **NOT TESTED**, not defects, and do **not** authorize remediation.
16. This worktree update records items 14–15. It is **not** a Git commit unless the Owner separately authorizes a governance commit.

## Post-merge reconciliation (2026-08-31)

This section is a **later current-state reconciliation**. It does **not** rewrite sequence items 1–16. Those items remain the historical 2026-08-30 record. Sequence item 13 recorded `8cc9796f20dd400338e6fabc809f4695138924c5` as current **HEAD at that time**. Sequence item 16 recorded that the UAT worktree update was not yet a Git commit **at that time**. The 2026-08-30 UAT grant did **not** authorize pull-request merge, migration execution, Production, or deployment.

These GitHub PR merges are **already-executed historical results** under later Owner grants. Recording them here is **not** a new authorization. Completion of CD Phase 1 and the remediation PRs does **not** authorize a new capability.

### Current Git state

- **origin/master** = `d918f98729f2f3fd0969d7cc6066700dcb21fb01`
- The CD Phase 1 workstream is now represented on `origin/master`.
- GitHub PR #1, #2, and #3 were subsequently merged.

Name collision — do **not** conflate:

| Name | Meaning |
| --- | --- |
| **GitHub PR #1 / #2 / #3** | Merge vehicles for CD Phase 1 and later remediations |
| **Capability PR1** | Procurement Catalogue (IMPLEMENTED / CLOSED; not reopened; not expanded) |
| **Capability PR2** | SourcingEvent (IMPLEMENTED / CLOSED; not reopened; not expanded) |

GitHub PR #2 is **not** capability PR2.

### Completed merge history

1. **GitHub PR #1** — merged at `3485c377984343fd1692d46d7061948d21d2b50c` (Phase 1 foundation `eb09ca00` plus subsequent governance docs commits).
2. **GitHub PR #2** — merged at `46c0b27ce6d6b5f6a5ff0f94dee1d511c317d9de`. Candidate A is merged through GitHub PR #2:
   - `0efe0d79afdd6bc81a637427840073a6bf1c27a9`
   - `e1c0d11243698d3e12ab855c6b89c486eacc28bc`
   - `f7b57eb8de836ea2537fadcb84fd962504ee348a`
3. **GitHub PR #3** — merged at `d918f98729f2f3fd0969d7cc6066700dcb21fb01`. Candidate B is merged through GitHub PR #3:
   - `b5e866d0c364593a3c3f8d6414736aac3296eb3b`
   - `d44eff38b08745587eedf4396e2e4fd788091cc5`

### CI

Post-merge GitHub Actions on `d918f987` (`eos-kernel-ci` / `push`) completed **SUCCESS**. Recorded from GitHub CI (not a locally executed full test suite):

- `npm install` = PASS
- `npm run typecheck` = PASS
- `npm test` = PASS

### Governance after merge

- **EXECUTION_QUEUE=EMPTY**
- **NEW_CAPABILITY_AUTHORIZED=NONE**
- **NEXT_INCREMENT=NONE_AUTHORIZED**
- **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**
- **MIGRATION_EXECUTION=NOT_AUTHORIZED / NOT_EXECUTED**
- **DATABASE=UNCHANGED**
- **PRODUCTION=NOT_AUTHORIZED / NOT_TOUCHED**
- **DEPLOYMENT=NOT_AUTHORIZED / NOT_EXECUTED**
- **ADR-0006=OPEN**
- **DP-0006=NOT APPROVED**
- **ADR-0012=OPEN**
- **ADR-0013=OPEN**
- **CAL=DEFERRED**
- **C11+=NOT CREATED / NOT AUTHORIZED**
- **NEXT GATE=OWNER DECISION / HOLD** — no next capability is selected; no next increment is authorized; no implementation should begin without a separate Owner grant.

## Historical grants (2026-08-30)

The following grant lines are the original 2026-08-30 authorization record. They are **not** part of the 2026-08-31 post-merge reconciliation.

**Authority (implementation):** Product Owner **CD PHASE 1 DEV/TEST IMPLEMENTATION AUTHORIZATION** (2026-08-30) **IMPLEMENTATION_AUTHORIZED=YES** / **ENVIRONMENT=DEVTEST** / **SCOPE=EXISTING UNCOMMITTED IMPLEMENTATION ONLY**.  
**Authority (remediation):** Product Owner **CD PHASE 1 DEV/TEST REMEDIATION AUTHORIZATION** (2026-08-30) **REMEDIATION_AUTHORIZED=YES** / **SCOPE=R-01–R-05 ONLY**.  
**Technical review (not Owner grant):** Commit Readiness Review **PASS / COMMIT READY**.  
**Authority (commit):** Product Owner **CD PHASE 1 LOCAL COMMIT AUTHORIZATION** (2026-08-30) **COMMIT_AUTHORIZED=YES** / **SCOPE=ONE LOCAL GIT COMMIT OF THE REVIEWED PHASE 1 CHANGESET ONLY**.  
**Authority (push):** Product Owner **CD PHASE 1 PUSH AUTHORIZATION** (2026-08-30) **PUSH_AUTHORIZED=YES** / **SCOPE=`eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43` ON `feat/cd-phase1-foundation` TO CONFIGURED `origin` ONLY**.  
**Authority (UAT):** Product Owner **CD PHASE 1 DEV/TEST UAT AUTHORIZATION** (2026-08-30) **UAT_AUTHORIZED=YES** / **UAT_SCOPE=DEV/TEST ONLY** / **PROCEDURE=EXISTING IN-MEMORY FROZEN-CONTRACT SUITE**. **MIGRATION EXECUTION = NOT GRANTED.** **PRODUCTION = NOT GRANTED.** **DEPLOYMENT = NOT GRANTED.** **PR MERGE = NOT GRANTED.**

## Authorization state

| Field | Value |
| --- | --- |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test only) |
| **IMPLEMENTATION_SCOPE** | **DEV/TEST ONLY** |
| **IMPLEMENTATION** | **WRITTEN** then **LOCALLY COMMITTED** (reviewed Phase 1 changeset only) |
| **REMEDIATION_AUTHORIZED** | **YES** (R-01–R-05; Dev/Test only; granted after implementation authorization) |
| **REMEDIATION_STATUS** | **COMPLETED** |
| **REMEDIATION_REVIEW** | **PASS / COMMIT READY** (technical readiness only) |
| **ENVIRONMENT** | Development/Test only |
| **UAT_AUTHORIZED** | **YES** (Dev/Test only; granted after push of `8cc9796…`) |
| **UAT_SCOPE** | **DEV/TEST ONLY** |
| **UAT_EXECUTION** | existing in-memory frozen-contract procedure (`seedStore` / Fastify inject / kernel Vitest) |
| **UAT_TESTS** | **16 PASS / 0 FAIL / 0 BLOCKED** |
| **UAT_MIGRATIONS** | **NOT_EXECUTED** |
| **DATABASE** | **UNCHANGED** |
| **UAT** | **PASS** |
| **PRODUCTION** | **NOT_AUTHORIZED / NOT_TOUCHED** |
| **COMMIT_AUTHORIZED** | **YES** (one local Git commit; granted after technical commit readiness) |
| **COMMIT** | **COMPLETED** |
| **PUSH_AUTHORIZED** | **YES** (authorized commit `eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43` only) |
| **PUSH** | **COMPLETED** |
| **PULL REQUEST MERGE** | **Historical (2026-08-30 authoring):** **NOT_AUTHORIZED**. **Live (2026-08-31):** GitHub PR #1 / #2 / #3 **MERGED** (already-executed subsequent Owner merges; **not** granted by the 2026-08-30 UAT authorization) |
| **MIGRATION_EXECUTION** | **NOT_AUTHORIZED / NOT_EXECUTED** |
| **MIGRATION_IDS (files only)** | **119–122** additive; never 109–115 |
| **ADR-0006** | **OPEN** — no Production hosting / object-storage decision |
| **DP-0006** | **NOT APPROVED** |
| **ADR-0012** | **OPEN** |
| **ADR-0013** | **OPEN** |
| **STAGE_1_CONTRACT** | **FROZEN** (2026-08-30 contract amendment; retrospective authorization preserved) |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEW_CAPABILITY_AUTHORIZED** | **NONE** |
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |
| **PATH_B_GENERAL_AUTO_SELECTION** | **PAUSED** |
| **CAL** | **DEFERRED** |
| **C11+** | **NOT CREATED / NOT AUTHORIZED** |
| **NEXT GATE** | **Historical (2026-08-30 authoring):** **GOVERNANCE COMMIT DECISION**. **Live (2026-08-31):** **OWNER DECISION / HOLD** (no next capability selected; no next increment authorized; no implementation should begin without a separate Owner grant) |

## Exact authorization boundary

Authorized:

- Commercial Department Phase 1
- Dev/Test only
- Extend existing C3–C8 commercial spine
- The **already-existing** implementation in `serengeti-eos-cd-phase1` / `feat/cd-phase1-foundation` / base `7c75a16ca942755421bc4ef8a528e0bf2d579e41`
- One **local Git commit** of the reviewed Phase 1 changeset (`eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43`)
- Push of **that commit only** on `feat/cd-phase1-foundation` to configured `origin`
- Dev/Test **UAT** of the existing in-memory frozen-contract procedure only
- Migrations 119–122 as **files only** (not executed)

Not authorized:

- pull request merge
- migration execution against UAT
- migration execution against Production
- Production deployment
- Production hosting
- cloud/object storage selection
- ADR-0006 closure
- DP-0006 approval
- PQL 109–115
- resurrection of PQL modules
- PR1 expansion
- PR2 expansion
- AI extraction
- OCR
- FX engine
- proposal rendering
- programme variants
- a second RFP / programme / proposal architecture

## Architectural decisions confirmed (Owner)

1. Commercial Phase 1 **extends** the existing C3–C8 commercial spine.
2. Existing C3 RFP remains authoritative.
3. Existing C3 `workflowStage` remains authoritative. Do **not** introduce a parallel `new → qualified → …` lifecycle.
4. Existing C4 supplier master remains authoritative.
5. Hotel functionality is an **extension/profile of C4 supplier data**, not a second hotel master.
6. Existing C4 supplier rates remain authoritative.
7. Existing C5 programme remains authoritative.
8. **One programme per RFP** remains the Phase 1 constraint.
9. Existing C6 costing remains authoritative.
10. Existing C7 approval and C8 proposal remain authoritative.
11. Documents use the **DocumentStorage** abstraction. Local filesystem is acceptable for **Dev/Test only**.
12. **ADR-0006 remains OPEN.** No production storage decision is being made.
13. PQL1–PQL7 remain **DORMANT / REFERENCE ONLY**.
14. PQL migrations **109–115** must **not** be revived or reused.
15. Phase 1 migration numbering uses **119–122**.
16. **PR1 and PR2 remain separate and unchanged.**

## Non-goals

AI extraction, OCR, portals, email/WhatsApp ingest, Production storage, FX engine, proposal render, PQL resurrection, PR1/PR2 API changes, migration execution, Production.

## Stage 1 contract freeze (2026-08-30)

The Stage 1 architecture document was **amended and frozen** after Contract Review. API names, DocumentStorage semantics, OPTION B SQL soft references (ADR-0017), thin programme snapshots, hotel PUT upsert, legacy C4 `contractRef` coexistence, UI 401/403 rules, test obligations, and TypeScript debt class B are recorded **in the contract**. Implementation code, migrations, and UI were **not** changed by the freeze.

This freeze does **not** claim implementation authorization existed before the implementation was created. Sequence in **Sequence (do not rewrite history)** remains authoritative.

## Remediation (2026-08-30)

Owner **REMEDIATION_AUTHORIZED=YES** for R-01–R-05 only, **after** implementation authorization and the frozen contract. Remediation **COMPLETED** in the uncommitted worktree. Read-only review: **REMEDIATION_REVIEW=PASS / COMMIT READY**.

That technical result is **not** Owner **COMMIT** authorization. Distinctions in force:

1. **Implementation authorization** — YES (Dev/Test; existing worktree; retrospective).
2. **Remediation authorization** — YES (R-01–R-05; granted later the same calendar day).
3. **Technical commit readiness** — PASS (reviewer finding).
4. **Owner commit authorization** — **GRANTED** (2026-08-30; one local Git commit only).
5. **Owner push authorization** — **GRANTED** (2026-08-30; commit `eb09ca00b6bdb4ee51c9a2376de1cf19ceda0b43` on `feat/cd-phase1-foundation` to `origin` only).
6. **Owner UAT authorization** — **GRANTED** (2026-08-30; Dev/Test; existing in-memory frozen-contract procedure only). **UAT=PASS.** **Not** migration execution, Production, deployment, or PR merge authorization.

## Next authorized action

**COMMIT = COMPLETED.**  
**PUSH = COMPLETED.**  
**UAT_AUTHORIZED = YES.**  
**UAT_SCOPE = DEV/TEST ONLY.**  
**UAT_EXECUTION = existing in-memory frozen-contract procedure.**  
**UAT_TESTS = 16 PASS / 0 FAIL / 0 BLOCKED.**  
**UAT = PASS.**  
**UAT_MIGRATIONS = NOT_EXECUTED.**  
**DATABASE = UNCHANGED.**  
**MIGRATION_EXECUTION = NOT_AUTHORIZED / NOT_EXECUTED.**  
**PRODUCTION = NOT_AUTHORIZED / NOT_TOUCHED.**

UAT authorization does **not** constitute migration execution, Production, deployment, or PR merge authorization. **UAT PASS does not grant those permissions.**

**Historical (2026-08-30 authoring):** **NEXT GATE = GOVERNANCE COMMIT DECISION.** This worktree update was **not** a Git commit and was **not** a push.

**Live (2026-08-31):** **NEXT GATE = OWNER DECISION / HOLD.** No next capability is selected. No next increment is authorized. No implementation should begin without a separate Owner grant. Completion of CD Phase 1 and GitHub PR #1 / #2 / #3 does **not** authorize a new capability. See **Post-merge reconciliation (2026-08-31)**.
