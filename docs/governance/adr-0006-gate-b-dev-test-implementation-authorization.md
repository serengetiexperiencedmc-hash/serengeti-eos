# ADR-0006 Gate B Dev/Test Implementation Authorization Package

> **`GATE B — CLOSED / VERIFICATION ACCEPTED`** (isolated Dev/Test implementation + migration-free PostgreSQL verification)  
> **`GATE C — NOT AUTHORIZED`**  
> **`UAT / PRODUCTION — NOT AUTHORIZED`**

This package converts the **approved Stage 6B design** into an exact **authorization boundary** for Gate B. Implementation in isolated Dev/Test was authorized by the Stage 6B Gate B implementation prompt dated **2026-09-15**. Migration-free PostgreSQL verification was later authorized and executed (Authorization C). It does **not** authorize migration creation/execution, UAT, or Production.

**GATE B DECISION:**  
`AUTHORIZED` (implementation, 2026-09-15) then **`CLOSED / VERIFICATION ACCEPTED`** (technical evidence reconciliation, 2026-09-16). Gates C–G remain **NOT AUTHORIZED**.

Gate A (`adr-0006-gate-a-design-approval-record.md`) is recorded as **APPROVED** as the design baseline. **Gate A does not authorize Gates C–G.** Named human signature on this file remains blank (not fabricated). Technical closure is **not** a substitute for a named stakeholder attestation.

---

# 1. Purpose

Define, at work-package granularity, what a future Gate B grant **would** permit in an **isolated Dev/Test** environment, and what it would **still forbid**.

**Proposed decision (not granted):**

> Authorize implementation of the approved Stage 6B persistence architecture in the isolated Dev/Test environment only, within the explicitly defined work-package scope and controls of this Gate B package.

**This authorization, if actually granted, does NOT authorize:**

- migration execution  
- Production implementation  
- Production migration  
- UAT  
- Production deployment  
- infrastructure provisioning  
- Production data movement  
- external customer data processing  

unless separately and explicitly authorized.

**Migration creation/execution remains subject to separate Gate C authorization.**

---

# 2. Inputs (not rewritten)

| Document | Role |
| --- | --- |
| [`adr-0006-persistence-architecture-implementation-authorization.md`](adr-0006-persistence-architecture-implementation-authorization.md) | Approved **design** (Gate A) |
| [`adr-0006-gate-a-design-approval-record.md`](adr-0006-gate-a-design-approval-record.md) | Gate A **APPROVED**; B–G not authorized |
| [`adr-0006-application-persistence-recovery-readiness.md`](adr-0006-application-persistence-recovery-readiness.md) | CURRENT: in-memory SoR; recovery **NOT DEMONSTRATED** |
| Stage 5 formal decision package | Hosting **DEFER / NOT READY** |
| ADR-0006 / DP-0006 | Proposed/blocked; OPEN |
| ADR-0017 | Phased persist; Dev in-memory read SoR **CURRENT** |
| ADR-0012 / ADR-0013 | OPEN — **not** in Gate B implementation scope |

---

# 3. Category discipline

Do not blur:

| Category | This package |
| --- | --- |
| **DESIGN** | Gate A **GRANTED** (Stage 6B) |
| **IMPLEMENTATION** | Gate B — **CLOSED / VERIFICATION ACCEPTED** (isolated Dev/Test; see §19) |
| **MIGRATION** | Gate C — create/review/execute are **separate**; **none** authorized here |
| **TESTING** | Migration-free Gate B PostgreSQL suite **executed** 2026-09-15 (initial PARTIAL, then remediations, then PASS). See §19. |
| **UAT** | Gate D — **NOT AUTHORIZED** |
| **PRODUCTION** | Gates E–G — **NOT AUTHORIZED** |

---

# 4. Mapping to Stage 6B roadmap

The prompt list is **refined** to match Stage 6B (opportunity **before** RFP; schema/FK additive SQL is Gate C, not Gate B).

| Gate B ID | Objective | Stage 6B analogue | Category if B granted |
| --- | --- | --- | --- |
| **GB-01** | Persistence foundation / DB access boundary | WP-03/04 helpers | IMPLEMENTATION |
| **GB-02** | Opportunity persistence | WP-05 | IMPLEMENTATION |
| **GB-03** | Commercial/RFP repositories | WP-03/06 | IMPLEMENTATION |
| **GB-04** | RFP versions and workflow transitions | WP-06 | IMPLEMENTATION |
| **GB-05** | Programme repositories | WP-03/07 | IMPLEMENTATION |
| **GB-06** | Programme days/items/version persistence | WP-07 | IMPLEMENTATION |
| **GB-07** | Transactional service layer (Commercial/Programme) | WP-04 | IMPLEMENTATION |
| **GB-08** | Durable security audit + business version history | WP-08 | IMPLEMENTATION |
| **GB-09** | Commercial document metadata persistence | WP-09 | IMPLEMENTATION |
| **GB-10** | DocumentStorage integration boundary | WP-09 port | IMPLEMENTATION (Dev FS adapter **already exists**; no cloud vendor) |
| **GB-11** | Startup: remove process-local SoR for in-scope modules | WP-10 | IMPLEMENTATION |
| **GB-12** | Concurrency / idempotency / integrity | WP-04 | IMPLEMENTATION |
| **GB-13** | Observability and persist-failure handling | WP-15 | IMPLEMENTATION |
| **GB-14** | Application recovery test harness | WP-13 | TESTING (Dev/Test; not Stage 4B substitute) |
| **GB-15** | Migration/cutover **preparation** (docs/runbooks/flags) | WP-14 prep only | DESIGN/docs — **not** cutover, **not** Gate C execute |
| **GB-16** | Persistence verification and regression suite | tests | TESTING |

**Sequenced after GB-06 (still Dev/Test, still not UAT/Production):** costing then commercial approval (Stage 6B I/J). They are **in the Gate B planning envelope** but **must not** precede opportunity/RFP/programme SoR.

**Out of Gate B even if granted:** ADR-0012/0013 products; hosting HA product; Production backup product (ADR-0011 TBD); participant/rooming entities; new hotel/transport/activity master tables.

**Existing tables without new migration:** `opp_*`, `rfp_*`, `prg_*`, `commercial_documents`, `audit_events`, `outbox_events` **EXIST**. Gate B implementation **can** target those tables. **New** FKs/unique indexes = **Gate C** artefacts.

---

# 5. Recommended implementation order (dependency graph)

```
GB-01 foundation
    → GB-07 transaction helpers (withTransaction, fail-closed)
    → GB-08 audit insert-in-TX (can start in parallel after GB-01)
    → GB-02 opportunity persist + read-through
        → GB-03 RFP repository + GB-04 versions/transitions
            → GB-05/GB-06 programme (+ days/items/versions)
                → costing → approval (after programme)
                → GB-09 metadata + GB-10 DocumentStorage compensate
    → GB-12 concurrency (with each write path)
    → GB-13 observability (with each write path)
    → GB-11 startup: stop Store SoR for opp/RFP/PRG
    → GB-16 regression
    → GB-14 recovery harness (needs GB-11)
GB-15 cutover/migration prep (docs only under B; execute ≠ B)
Gate C: migration file create/review/execute (not B)
```

**Independent verification:** GB-02 can be verified by restart/retrieve opportunity **before** RFP. GB-03/04 after GB-02. GB-06 after GB-05 and GB-04.

**Requires another authorization:** any new SQL file or `migrate()` apply → **Gate C**. UAT → **D**. Production → **E–G**.

---

# 6. Work packages (original plan — later implemented)

§6 below is the **pre-implementation** work-package text. It is **not** rewritten. Subsequent implementation (Phase 1) and verification (Phases 2–4) are recorded in **§19**.

## GB-01 — Persistence foundation / database access boundary

| | |
| --- | --- |
| **Objective** | Shared Dev/Test access: `pg.Pool`, `withTransaction`, fail-closed error mapping; **no** swallowed persist for critical modules |
| **Depends** | Gate A design; existing `packages/db`, `persistence/pg-repository.ts` `withTransaction` |
| **Expected files** | `packages/db/src/index.ts` (pool options/retry **later** GB-11); new helpers under `apps/api/src/persistence/` — **when B granted** |
| **Schema** | None required (use existing pool) |
| **API/domain** | None yet |
| **Tests** | Unit/helper tests; do not require RFP data |
| **Rollback** | Revert helpers |
| **Observability** | Log TX begin/commit/rollback |
| **Security** | `EOS_DATABASE_URL` remains secrets port (ADR-0012 OPEN — env Dev only) |
| **Integrity** | TX wrapper is the unit of atomicity |
| **Independent verify** | Yes (pool + TX smoke) |
| **Other auth** | Gate C if connection settings become infra/Production |

## GB-02 — Opportunity persistence

| | |
| --- | --- |
| **Objective** | Durable SoR for `opp_opportunities` / `opp_stage_history`; read-through SQL; fail-closed writes |
| **Depends** | GB-01, GB-07/08 as they land |
| **Expected files** | `persistence/opportunity.ts` (new); `pipeline/opportunity.ts`; tests `c2`/pipeline |
| **Schema** | **Use `015` as-is.** Org FK = Gate C / after CRM SoR |
| **API** | `/v1/pipeline/opportunities*` behavior preserved; SoR changes |
| **Tests** | Create → restart → retrieve; unique `opportunity_code` |
| **Rollback** | Revert services to Store (Dev only) |
| **Integrity** | Stage history in same TX as stage change |

## GB-03 — Commercial/RFP repositories

| | |
| --- | --- |
| **Objective** | Repository for `rfp_rfps` (not Store arrays as SoR) |
| **Depends** | GB-02 (runtime createRfp requires opportunity) |
| **Expected files** | `persistence/rfp.ts`; `rfp/rfp.ts` |
| **Schema** | **Use `016`/`122` as-is.** `opportunity_id` FK = **Gate C** |
| **API** | `GET/POST /v1/rfps`, `GET/PATCH /v1/rfps/:id` |
| **Tests** | List/get after persist; duplicate `rfp_code` → 409 from unique constraint |

## GB-04 — RFP versions and workflow transitions

| | |
| --- | --- |
| **Objective** | `rfp_versions`; `transitionRfpStage` / `createRfpVersion` atomic with header `version` |
| **Depends** | GB-03; kernel `canTransitionRfpStage` |
| **Expected files** | `rfp/rfp.ts`, `rfp/routes.ts` |
| **Schema** | `rfp_versions` FK **EXISTS** |
| **API** | `POST /v1/rfps/:id/transitions`, `POST /v1/rfps/:id/versions` |
| **Tests** | Illegal transition rejected; version increment; restart retains stage |

## GB-05 / GB-06 — Programme repositories + days/items/versions

| | |
| --- | --- |
| **Objective** | Durable `prg_programmes`, `prg_days`, `prg_items`, `prg_programme_versions` |
| **Depends** | GB-04 (programme requires RFP; may advance RFP to `programme`) |
| **Expected files** | `persistence/programme.ts`; `programme/programme.ts` |
| **Schema** | **Use `017`/`122` as-is.** Programme→RFP FK + unique active per RFP = **Gate C** |
| **API** | `/v1/programmes*` including days, items, versions, `by-rfp` |
| **Tests** | One programme per RFP conflict; itinerary after restart |
| **Do not invent** | Participant/rooming; hotel/transport/activity **master** tables (`item_type` only) |

## GB-07 — Transactional service layer

| | |
| --- | --- |
| **Objective** | Service operations listed in §8 run in **one** PG transaction |
| **Depends** | GB-01; wraps GB-02–GB-06 |
| **Expected files** | Same service files; no fire-and-forget `void persistX` for these modules |
| **Tests** | Forced PG error → API error and **no** partial RFP |

## GB-08 — Durable audit / business version history

| | |
| --- | --- |
| **Objective** | `recordAudit` **INSERT** `audit_events` in the business TX; keep product version tables |
| **Depends** | GB-01; hash-chain per tenant **CURRENT** in memory — persist every insert |
| **Expected files** | `store.ts` `recordAudit` path or successor used by rfp/programme/pipeline audit modules |
| **Schema** | `audit_events` **EXISTS** (insert-only) |
| **Tests** | Audit row present after restart; deny audits also durable |

## GB-09 / GB-10 — Document metadata + DocumentStorage

| | |
| --- | --- |
| **Objective** | Persist `commercial_documents`; bytes via existing `DocumentStorage` `put`/`get`; compensate if metadata COMMIT fails |
| **Depends** | GB-03 (optional `rfpId`) |
| **Expected files** | `commercial-documents/service.ts`, `storage.ts`; persist module |
| **Schema** | **Use `119` as-is.** Programme FK **not** added (domain decision) |
| **Provider** | **None selected.** Dev: `LocalFsDocumentStorage` **CURRENT** |
| **Tests** | Metadata after restart; content get; compensate path |

## GB-11 — Startup / remove process-local SoR

| | |
| --- | --- |
| **Objective** | `main.ts`: do **not** treat `Store.rfpRfps` / `prg*` / `opp*` as authority; fail `/ready` if DB required profile cannot `SELECT 1` |
| **Depends** | GB-02–GB-06 read-through |
| **Expected files** | `main.ts`, `server.ts` ready; `dev/seed-demo-data.ts` skip logic **redesign** (CURRENT skip-if-CRM-exists hides empty RFPs) |
| **Risks** | Tests that mutate `store.rfpRfps` directly; demo seed; dual-run during transition |
| **Do not** | Blind-delete entire `Store` (IAM, CRM dual-write, notifications still use it) |

## GB-12 — Concurrency / idempotency / integrity

| | |
| --- | --- |
| **Objective** | `UPDATE … WHERE version = $n` → 409; unique codes; optional POST idempotency keys |
| **Depends** | Each write WP |
| **Tests** | Concurrent patch conflict |

## GB-13 — Observability and persistence failure handling

| | |
| --- | --- |
| **Objective** | Metrics/logs for TX rollback, lock conflict, persist latency; **never** swallow critical persist errors |
| **Depends** | GB-07 |
| **Expected files** | `observability` usage in persist path |

## GB-14 — Application recovery test harness

| | |
| --- | --- |
| **Objective** | Automated Dev/Test probes in §11 — **not executed in this governance task** |
| **Depends** | GB-11, GB-16 |
| **Category** | TESTING |
| **Not** | Stage 4B `lab_*` tables; not Production RTO proof |

## GB-15 — Migration / cutover **preparation**

| | |
| --- | --- |
| **Objective** | Document dual-read flags, seed replay, reconciliation checklist |
| **Does not** | Create SQL; run `migrate()` for new files; Production cutover |
| **Other auth** | Gate C for migration; separate cutover auth (Stage 6B WP-14) |

## GB-16 — Verification and regression

| | |
| --- | --- |
| **Objective** | Existing `c3.rfp.test.ts`, `c5.programme.test.ts` plus PG-gated tests (`EOS_RUN_PG_TESTS`) |
| **Depends** | GB-02–GB-12 |
| **Category** | TESTING |

---

# 7. What Gate B **would** authorize (if granted)

**In:** Dev/Test **IMPLEMENTATION** of GB-01–GB-13, GB-16 (and costing/approval **after** GB-06); GB-14 test **code**; GB-15 **documentation**. Isolated environment. No live Production PII.

**Out:** Gate C migration create/review/execute; UAT; Production; infra provisioning; hosting selection; ADR-0006/DP-0006 approval.

---

# 8. Migration boundary (Gate C — not Gate B)

**Migration creation/execution remains subject to separate Gate C authorization.**

Distinguish:

| Activity | Gate |
| --- | --- |
| Creating migration SQL | **C** (not B) |
| Reviewing migration SQL | **C** |
| Executing migration (Dev/Test `migrate()`) | **C** |
| Production migration | **F** (not C) |

**If** a future Gate C proceeds, Stage 6B intent (not created now):

| Item | Intent |
| --- | --- |
| Numbering | Additive file **after 122** (e.g. `123_…sql`); do not rewrite `016`/`017`/`122` |
| Changes | FKs and partial unique as below; no invented tables |
| Tables | `rfp_rfps`, `prg_programmes`, optionally `cost_sheets`, `com_approval_requests` |
| FKs | See §9 |
| Rollback | Forward-fix preferred; no CASCADE delete of RFP/PRG |
| Compatibility | Empty runtime tables expected; no Production data backfill |

Gate B **may** persist into **existing** DDL without those new FKs.

---

# 9. Database design controls (reconfirmed)

PostgreSQL is the proposed durable SoR. `016`/`017`/`122` are **reusable but incomplete**.

| Relationship | Decision (Stage 6B) |
| --- | --- |
| Opportunity → RFP (i.e. **RFP → Opportunity**) | **DATABASE FOREIGN KEY** RESTRICT — **Gate C** |
| RFP → Programme (**Programme → RFP**) | **DATABASE FOREIGN KEY** RESTRICT + unique active `(tenant_id, rfp_id)` — **Gate C** |
| Programme header → Supplier | **NOT APPLICABLE** (no field) |
| Programme item → Supplier | **APPLICATION-LEVEL** first; nullable DB FK later after supplier SoR |
| Programme → documents | **APPLICATION-LEVEL** via `rfpId` (no `programmeId` unless domain decision) |
| Commercial → organization/client | **APPLICATION-LEVEL** until CRM is true SoR; then optional DB FK RESTRICT |

Do **not** invent participant/rooming. Do **not** add hotel/transport/activity **master** tables because `item_type` exists.

---

# 10. Transactional integrity (TARGET for Gate B implementation)

| Operation | Atomic with | Persist failure |
| --- | --- | --- |
| Create RFP | RFP + v1 `rfp_versions` + optional opp stage `rfp_received` + stage history + `audit_events` + outbox **insert** | **Fail API** |
| Transition RFP | Stage + `version` check + audit + outbox insert | **Fail API** |
| Create RFP version | Version row + header `current_version` + audit | **Fail API** |
| Create programme | Programme + optional days/items + RFP stage intake→programme + audit + outbox insert | **Fail API** |
| Day/item/patch programme | Parent version + rows + programme.version + audit | **Fail API** |
| Programme version | Version row + programme.version + audit | **Fail API** |
| Costing (after GB-06) | Sheet + lines + totals + optional RFP→costing + audit | **Fail API** |
| Approval (after costing) | Request/decision + optional RFP stage + audit | **Fail API** |
| Security audit | **Same TX** as business write | **Fail API** |
| Outbox insert | **Same TX**; **publish after COMMIT** | **Fail API** if insert fails |

No silent fire-and-forget for these SoR modules. Idempotency: unique codes; optional POST keys. Optimistic `version` where updates exist.

---

# 11. Process-local Store elimination (in-scope modules only)

**Target:** **NO PROCESS-LOCAL SYSTEM OF RECORD FOR JOINTLY CRITICAL COMMERCIAL/RFP/PROGRAMME DATA** (including required opportunity predecessor).

| Area | CURRENT | TARGET after B implementation |
| --- | --- | --- |
| Reads | `store.rfpRfps.find` / `prgProgrammes` / `oppOpportunities` | SQL via repository |
| Writes | `.push` / field mutate | TX repository |
| Seed/demo | HTTP seed; skip if CRM hydrated | Replay API against PG; do not skip in a way that leaves `rfp_rfps` empty while claiming demo RFPs exist |
| Tests | In-memory unit tests | Keep kernel tests; add PG integration; fix tests that poke Store as SoR |
| Restart | Loss | Retrieve committed rows |
| Multi-replica | Divergent Stores | Shared PG |
| Cache | n/a | Optional, **not** SoR |

**Transitional risks:** CRM/notifications still memory+dual-write; do not delete `Store`. Mixed SoR if only some routes converted. Demo skip predicate. Hash-chain audit if some audits still memory-only.

---

# 12. Document persistence boundary

**Port (no vendor):** `DocumentStorage.put` / `get` (`packages/kernel` type). Dev adapter: `LocalFsDocumentStorage`. Production object store **CANDIDATE — NOT SELECTED**. E1 still OPEN for byte location.

**PostgreSQL metadata (`commercial_documents` / `CommercialDocument`):** id, tenant, kind, status (incl. deletion state), filename, mime, size, checksumSha256, storageRef, version, optional rfpId/supplierId/contractId, classification, created/updated, createdBy/updatedBy. Access via existing `commercialDocument:*` permissions.

**TX vs bytes:** `put` then metadata INSERT in PG TX; if COMMIT fails, compensate `delete` (port may need `delete` — design note, Gate B if granted). Do not treat FS tmpdir as Production.

---

# 13. Recovery tests (NOT executed by this task)

Become possible **only after** durable SoR exists:

1. Restart and retrieve  
2. Create → restart → retrieve  
3. RFP workflow continuation after restart  
4. Programme workflow continuation after restart  
5. DB backup restore against **actual** EOS tables (`rfp_*`, `prg_*`, `opp_*`)  
6. PITR against those tables  
7. Application + DB recovery  
8. Audit verification  
9. Document metadata verification  
10. Concurrency/retry verification  
11. Multi-instance verification where feasible  

**Stage 4B** (`lab_*`, run `20260915-183034`) remains **laboratory mechanism** evidence. It is **not** application persistence evidence (RM-01).

---

# 14. RTO/RPO (unchanged business; unproven technical)

| Layer | Position |
| --- | --- |
| Business MTD | <= 3 hours (critical) |
| Business RTO | Critical <= 3 h; overall <= 4 h |
| Business data-loss | Zero tolerated loss of **critical** data |
| Technical RPO | **NOT** declared 0; **not** proven |
| Application RTO/RPO | **Unproven** until durable state exists and §13 tests run |

Do not convert laboratory seconds or business zero-loss into Production RPO = 0.

---

# 15. Open governance dependencies

| Item | Status | Gate B (even if granted) |
| --- | --- | --- |
| ADR-0006 | proposed — blocked for Production | Unchanged |
| DP-0006 | OPEN — not approved | Unchanged |
| Hosting/provider/region | NOT SELECTED | Unchanged |
| E1 Legal/residency | OPEN | Document bytes location not approved |
| Security | Production controls unproven | Dev only |
| ADR-0012 / ADR-0013 | OPEN | Out of B scope |
| Backup/DR product | ADR-0011 TBD | GB-14 uses Dev PG; not Production DR |
| E4 Finance/TCO | OPEN | No prices |
| PCI | NOT ESTABLISHED | No CHD in EOS by design |
| Production architecture | NOT SELECTED | Unchanged |
| Operational support 24/7 | NOT PROVEN | Unchanged |
| Stage 5 | DEFER / NOT READY | Unchanged |

---

# 16. Acceptance criteria (Gate B **implementation** — assessed 2026-09-16)

Original list (unchanged; not invented for this reconciliation):

1. Jointly critical Commercial/RFP/Programme (and opportunity) state survives process restart.  
2. Reads come from durable persistence.  
3. Writes are transactional.  
4. Persistence failures are surfaced on the API.  
5. No critical fire-and-forget dual-write remains for those modules.  
6. Concurrency protection works (version conflict).  
7. Business versions remain reconstructable.  
8. Security audit remains durable.  
9. Document metadata remains durable.  
10. API routes remain backward-compatible where required (same URLs/contracts).  
11. Existing relevant tests pass; new persistence tests pass.  
12. No Production configuration is introduced.  
13. No migration is executed without Gate C.  
14. No Production deployment occurs.  

Assessment against the migration-free verification evidence is in **§19**. This section no longer claims “none satisfied.” It also does **not** claim Production readiness.

---

# 17. Sign-off (stakeholder attestation — left blank)

Follows Stage 1 blank-attestation convention. Named fields below are **not** filled. Technical closure in §19 is **not** a named stakeholder signature.

**Proposed decision (pending):**

> Authorize implementation of the approved Stage 6B persistence architecture in the isolated Dev/Test environment only, within the explicitly defined work-package scope and controls of this Gate B package.

Name: `________________`  
Role: `________________`  
Decision: `AUTHORIZED / AUTHORIZED WITH CONDITIONS / NOT AUTHORIZED`  
Date: `________________`  
Signature: `________________`

**GATE B DECISION:**  
`AUTHORIZED` — isolated Dev/Test implementation (2026-09-15 prompt). Technical closure **CLOSED / VERIFICATION ACCEPTED** recorded in §19 (2026-09-16). Named signature not fabricated.

Gates C–G: **NOT AUTHORIZED**

---

# 18. Governance status

E1: OPEN — REQUIRES LEGAL/DPO VALIDATION  
E2: PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED  
E3: OPEN — HOSTING EVIDENCE IN PROGRESS  
E4: OPEN — TCO EVIDENCE INCOMPLETE  

ADR-0006: PROPOSED — BLOCKED FOR PRODUCTION  
DP-0006: OPEN — NOT APPROVED  

Gate A: **APPROVED** (design baseline)  
Gate B implementation: **CLOSED / VERIFICATION ACCEPTED** (isolated Dev/Test; §19)  
Gate B verification: **CLOSED / VERIFICATION ACCEPTED** (migration-free PostgreSQL suite; §19)  
Gate C: **NOT AUTHORIZED**  
UAT: **NOT AUTHORIZED**  
Production: **NOT AUTHORIZED**  
Gates D–G: **NOT AUTHORIZED**

---

## Validation

- Named Gate B signature not fabricated.  
- Technical evidence reconciliation is not a named stakeholder attestation.  
- Gate C / UAT / Production remain **NOT AUTHORIZED**.

---

# 19. Chronological reconciliation and Gate B closure (2026-09-16)

This section is the **authoritative Gate B status record**. It does not erase earlier BLOCKED/PARTIAL states. It does not authorize Gate C, UAT, or Production.

## 19.1 Sequence

### Phase 1 — Implementation (2026-09-15)

Gate B isolated Dev/Test persistence implementation completed under this package (GB-01–GB-13, costing/approval after programme, GB-16 harness, GB-14 restart/multi-instance helpers). PostgreSQL is the durable SoR when `store.dbPool` is set. Process-local Store remains for unit tests and is **not** the Production SoR.

### Phase 2 — Initial PostgreSQL verification (PARTIAL)

After DTV-001 and a separately authorized disposable schema bootstrap (`serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata`, `127.0.0.1:5434`, PostgreSQL 16.15; 11 bounded SQL files; **not** `migrate()`), Authorization C ran the migration-free suite.

**GATE B VERIFICATION FAILED/PARTIAL.** Substantial persistence evidence existed (opportunity, RFP, programme, costing, audit, outbox on the successful RFP path, fail-closed, optimistic concurrency, two-instance). Three **verification-harness** defects prevented complete exercise of commercial approval, document compensation, and forced rollback:

1. Approval test expected RFP `workflowStage === "approval"` after an approved decision; implementation advances `costing → approval → proposal`.  
2. Tests called `principals.get(CAROL_ID)` while `seedStore` indexes Carol by email.  
3. Outbox cleanup used `aggregate_id = ANY($1::uuid[])` against existing **text** `outbox_events.aggregate_id`.

No application implementation defect and no missing Gate B schema were established by those failures. `pg.integration.test.ts` was not run (it calls `migrate()`).

### Phase 3 — Harness remediation (separately authorized)

Only `apps/api/src/gate-b.persistence.integration.test.ts` and `apps/api/src/persistence/gate-b-pg-verification.ts` were changed. Application persistence, schema, and migrations were not modified.

### Phase 4 — Migration-free re-verification (PASS)

- Typecheck: PASS  
- `gate-b.verification-safety.test.ts`: 3 passed, 0 skipped  
- `gate-b.fail-closed.test.ts`: 2 passed, 0 skipped  
- `gate-b.persistence.integration.test.ts`: 11 passed, 0 skipped  
- `pg.integration.test.ts`: not run (migration-dependent)

Persistence: Opportunity, RFP, Programme, Costing, Commercial approval, Documents, Transaction rollback, Audit, Outbox, Fail-closed, Optimistic concurrency, Two-instance — all **PASS**. Schema prerequisite **PASS**. Gate C FK/unique objects remained **ABSENT**. UAT/Production untouched. Synthetic identifiers only. `migrate()` not invoked. `schema_migrations` absent. No DDL by tests.

## 19.2 §16 criteria vs evidence

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | State survives process restart | Fresh Store / two-instance retrieve after persist | **PASS** |
| 2 | Reads from durable persistence | Repository reads against PostgreSQL | **PASS** |
| 3 | Writes are transactional | Forced rollback: business + audit + outbox uncommitted | **PASS** |
| 4 | Persist failures surfaced on API | Fail-closed: HTTP ≥500; Store not SoR | **PASS** |
| 5 | No critical fire-and-forget dual-write for those modules | Fail-closed + same-TX audit/outbox | **PASS** |
| 6 | Concurrency (version conflict) | Stale-version update rejected | **PASS** |
| 7 | Business versions reconstructable | RFP versions / programme versions persisted and read | **PASS** |
| 8 | Security audit durable | `audit_events` inserts; insert-only trigger unchanged | **PASS** |
| 9 | Document metadata durable | Metadata persist + compensation on failed metadata TX | **PASS** |
| 10 | API routes backward-compatible | Existing `/v1/*` contracts exercised | **PASS** |
| 11 | Relevant tests pass | Gate B migration-free suite + typecheck; migration-dependent PG tests excluded by design | **PASS** |
| 12 | No Production configuration | Session-only `EOS_DATABASE_URL`; no Production config | **PASS** |
| 13 | No migration without Gate C | Verification did not call `migrate()` or apply catalogue SQL | **PASS** |
| 14 | No Production deployment | None | **PASS** |

Bounded Dev/Test schema bootstrap (Authorization B) is **not** Gate C and is **not** `migrate()`. Gate C FK/unique/backfill/cutover remain **not** done.

## 19.3 Closure statement

> Gate B Dev/Test persistence implementation and migration-free PostgreSQL verification have been completed against the dedicated disposable Gate-B PostgreSQL instance. The verification suite passed after correction of verification-harness defects. No migration was executed as part of Gate B verification. PostgreSQL is the tested durable SoR when the configured pool is present. The process-local Store is not accepted as the Production durable SoR.

## 19.4 What Gate B does **not** establish

Gate B closure does **not** establish: Production readiness; Production hosting approval; data-residency approval; Production RTO/RPO; Production HA; Production DR; Production backup/restore; Production security readiness; Production identity architecture; Production KMS/secrets architecture; Production monitoring/incident response; UAT readiness; Production authorization.

§13 items 5–6 (EOS-table backup restore / PITR) were **not** executed and are **not** claimed. E2 remains `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`.

## 19.5 Gate C boundary (unchanged)

Gate B closure does **not** authorize:

- RFP → Opportunity FK  
- Programme → RFP FK  
- unique active-programme-per-RFP  
- additive migration, backfill, cutover, or Production schema changes  

Those remain [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md). After verification they were confirmed **ABSENT**.

## 19.6 Residual synthetic Dev/Test data

Disposable instance `serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata` (`127.0.0.1:5434`), recorded after the successful re-verification:

| Object | Count / note |
| --- | --- |
| tenants | 2 (identity bootstrap) |
| principals | 6 (identity bootstrap) |
| opportunity / RFP / programme / costing / approval / document business rows | 0 (this-run cleanup) |
| audit_events | 93, including prior verification runs; insert-only by design |
| outbox_events | 27 remaining from the earlier failed verification run; this-run tracked aggregate ids were cleaned |

This is **not** Production or UAT data.

**Residual synthetic Dev/Test data remains in the disposable Gate-B database and requires separate cleanup/disposal when the verification environment is retired.**

## 19.7 Authorization after closure

| Item | Status |
| --- | --- |
| Gate B implementation | **CLOSED / VERIFICATION ACCEPTED** |
| Gate B verification | **CLOSED / VERIFICATION ACCEPTED** |
| Gate C | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |

Closing Gate B does **not** authorize the next gate.
