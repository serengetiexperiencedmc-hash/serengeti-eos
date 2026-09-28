# ADR-0006 Gate C migration backlog

> **`OWNER AUTHORIZATION RECORDED — BOUNDED GATE C DEV/TEST SLICE 1–3`**  
> **`MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED`**  
> **`GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION`**  
> **`GATE C REMAINDER / UAT / PRODUCTION — NOT AUTHORIZED`**  
> Named personal signature, legal authority title, and handwritten approval date are **not** invented.

This backlog was discovered while implementing Gate B against **existing** Dev/Test structures (migrations 015/016/017/018/019/119/122 as inputs). No item below was implemented.

This file is the **authoritative Gate C backlog, readiness record, bounded Dev/Test authorization request, and bounded-slice owner authorization record**. The owner authorization in **OWNER AUTHORIZATION — BOUNDED DEV/TEST GATE C SLICE — CONSTRAINTS 1–3** applies only to that slice and does **not** authorize UAT, Production, full `migrate()`, or backlog items 4–7. Named signature, handwritten approval date, and attestation are **not** fabricated. CREATE SQL for constraints 1–3 is recorded in **OA.10**. REVIEW result is recorded in **OA.11**. Backup/restore evidence review is recorded in **OA.12** (**PASS**). EXECUTE checkpoint is [`adr-0006-gate-c-migration-123-execution-checkpoint.md`](adr-0006-gate-c-migration-123-execution-checkpoint.md). Formal execute authorization record is [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md) — **EXECUTED / POST-EXECUTION VERIFICATION PASSED** (run `20260916-021912`); authorization **consumed**. Gate C overall remains **OPEN**. Remainder / UAT / Production remain **not authorized**.

## Classifications of existing migrations (Gate B)

| Migration | Classification | Notes |
| --- | --- | --- |
| `015_c2_opportunity.sql` | **Required dependency** | `opp_opportunities` / `opp_stage_history`; Opportunity persist uses these tables. |
| `016_c3_rfp.sql` | **Reusable supporting structure** | `rfp_rfps` / `rfp_versions`; incomplete vs target (no RFP→Opportunity FK). |
| `017_c5_programme.sql` | **Reusable supporting structure** | `prg_programmes` / `prg_days` / `prg_items`; incomplete vs target (no Programme→RFP FK; no unique active programme-per-RFP). |
| `018_c6_costing.sql` | **Reusable supporting structure** | Cost sheet/line/version tables; used where schema already supports costing persist. |
| `019_c7_commercial_approval.sql` | **Reusable supporting structure** | Approval request table; used where schema already supports persist. |
| `119_cd_commercial_documents.sql` | **Reusable supporting structure** | Commercial document **metadata**; required for GB-09/10. Bytes remain behind `DocumentStorage`. |
| `122_cd_programme_item_extensions.sql` | **Reusable supporting structure** | RFP notes/source/received_at; programme notes; item type/qty; `prg_programme_versions`. |

## Gate C requirements

1. **RFP → Opportunity foreign key** (`rfp_rfps.opportunity_id` → `opp_opportunities.id`) — **COMPLETE** on disposable Gate-B Dev/Test via migration 123 (run `20260916-021912`). **Not** UAT/Production.
2. **Programme → RFP foreign key** (`prg_programmes.rfp_id` → `rfp_rfps.id`) — **COMPLETE** on disposable Gate-B Dev/Test via migration 123. **Not** UAT/Production.
3. **Unique active programme-per-RFP** (partial unique index on `(tenant_id, rfp_id) WHERE archived_at IS NULL`) — **COMPLETE** on disposable Gate-B Dev/Test via migration 123. Existing non-unique `prg_programmes_tenant_rfp` **remains**. **Not** UAT/Production.
4. Any additional indexes required for Production query plans — **OPEN**; repository readiness assessment recorded in [`adr-0006-gate-c-item-4-production-query-plan-index-readiness.md`](adr-0006-gate-c-item-4-production-query-plan-index-readiness.md) (**OA.15**). No category-C Production index named. **Not** authorized. **Not** a migration.
5. Production migration scripts / data backfill / cutover scripts — **OPEN**; repository readiness assessment recorded in [`adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md`](adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md) (**OA.16**). Classification **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**. **Not** authorized. **Not** UAT/Production.
6. Optional: RFP/programme **event catalogue rows** in `event_catalogue` — **OPEN**; requires separate authorization.
7. Optional: `DocumentStorage.delete` on the kernel port — **OPEN**; not Gate C DDL; requires separate authorization.

## Explicitly out of Gate C unless separately decided

- Participant tables  
- Rooming tables  
- New hotel/transport/activity master tables (hotels/transport/activities remain programme **item types**)  
- Hosting/residency/provider/region  
- Production credentials, KMS, WAF, PCI  

## Status

**GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION**

Gate C remainder (backlog items 4–7; UAT; Production): **NOT AUTHORIZED**  
Bounded Dev/Test slice constraints 1–3: **COMPLETE** on disposable Gate-B. Migration 123 **EXECUTED / POST-EXECUTION VERIFICATION PASSED** (run `20260916-021912`). Execute authorization **consumed**. UAT / Production **NOT AUTHORIZED**. Production readiness **not** claimed.

---

# Review — Gate C migration readiness / authorization package (2026-09-16)

Governance and readiness review only. No migration SQL was created. No schema was altered. No `migrate()` was invoked. No UAT or Production action was taken. Named personal signature is **not** fabricated.

Authoritative inputs for this review:

- [`adr-0006-gate-b-dev-test-implementation-authorization.md`](adr-0006-gate-b-dev-test-implementation-authorization.md) §8–9, §16, §19
- [`adr-0006-gate-b-postgresql-verification-prerequisites.md`](adr-0006-gate-b-postgresql-verification-prerequisites.md)
- [`adr-0006-dtv-001-devtest-postgresql-schema-source.md`](adr-0006-dtv-001-devtest-postgresql-schema-source.md)
- [`adr-0006-devtest-schema-bootstrap-authorization.md`](adr-0006-devtest-schema-bootstrap-authorization.md)
- [`adr-0006-persistence-architecture-implementation-authorization.md`](adr-0006-persistence-architecture-implementation-authorization.md) §5–6, §9, §15, Authorizations C/F
- [`adr-0006-gate-a-design-approval-record.md`](adr-0006-gate-a-design-approval-record.md) (design baseline; not a migration authorization)
- This backlog (items 1–7 as written at Gate B implementation time)

## R.1 Starting position

### Gate B

| Fact | Evidence |
| --- | --- |
| **CLOSED / VERIFICATION ACCEPTED** | Gate B package banner and §19 |
| Isolated Dev/Test evidence only | §19.3–19.4 |
| PostgreSQL persistence verification passed | §19.1 Phase 4: 11/11 migration-free suite + typecheck |
| No migrations executed during Gate B | §19.2 criterion 13; `schema_migrations` absent |
| No Gate C schema changes during Gate B | §19.5: FK/unique objects **ABSENT** after verification |
| No UAT | §19.7 |
| No Production | §19.4 / §19.7 |

### Gate C

| Fact | Evidence |
| --- | --- |
| **NOT AUTHORIZED** | This file; Gate B §19.7; DTV-001; bootstrap package |
| No migration execution has occurred | Disposable instance: `schema_migrations` still absent; no `123+` SQL in repository |
| No Gate C schema changes have occurred | READ-ONLY inspection 2026-09-16: RFP→Opportunity FK **ABSENT**; Programme→RFP FK **ABSENT**; unique active programme-per-RFP **ABSENT** |

### Known Gate C schema gaps (already documented — not invented)

| # | Requirement | Documented source |
| --- | --- | --- |
| 1 | RFP → Opportunity FK, `ON DELETE RESTRICT` | Backlog item 1; Gate B §9; architecture §6 |
| 2 | Programme → RFP FK, `ON DELETE RESTRICT` | Backlog item 2; Gate B §9; architecture §6 |
| 3 | Unique active Programme per RFP: partial unique `(tenant_id, rfp_id) WHERE archived_at IS NULL` | Backlog item 3; Gate B §9 |
| 4 | Supporting indexes “required for Production query plans” | Backlog item 4 — **unspecified** |
| 5 | Production migration / backfill / cutover scripts | Backlog item 5; architecture §15 / WP-14 (cutover is a **separate** authorization) |
| 6 | Optional `event_catalogue` rows | Backlog item 6 |
| 7 | Optional kernel `DocumentStorage.delete` | Backlog item 7; architecture §9 — **not SQL** |
| Sequencing | Additive file **after 122**; do not rewrite `016`/`017`/`122` | Gate B §8; architecture §5.2 / WP-02 |
| Backfill (Dev/Test intent) | Empty runtime tables expected; no Production data backfill | Gate B §8; architecture §15 |
| Optional related FKs | `cost_sheets` / `com_approval_requests` “optionally” | Gate B §8 tables list; architecture §5.2 items 5–6 — **not** numbered in this backlog’s items 1–7 |

No additional requirement from the numbered backlog is treated as already-approved scope. Items discovered from schema/code that are **not** in items 1–7 are listed in §R.6 as **newly identified review items**.

## R.2 Backlog classification

Classifications below are **not** approvals. “READY FOR AUTHORIZATION REVIEW” means the **design of that item** is sufficiently specified to be included in a later, separately bounded owner request — not that authorization is granted.

| Item | Current state | Evidence | Remaining prerequisite | Authorization required |
| --- | --- | --- | --- | --- |
| 1. RFP → Opportunity FK | **READY FOR AUTHORIZATION REVIEW** (Dev/Test additive DDL design only) | Column `rfp_rfps.opportunity_id UUID NOT NULL` exists without FK to `opp_opportunities`; `createRfp` already rejects missing opportunity (`invalid_opportunity`); Gate B §9 RESTRICT; disposable rows for `rfp_rfps` / `opp_opportunities` = 0 | Bound the first Gate C slice to Dev/Test; choose apply method (explicit additive file vs unbounded `migrate()`); author SQL **only after** authorization; confirm simple `id` FK vs composite `(tenant_id, opportunity_id)` (§R.6); backup/restore of the disposable instance before any DDL | Separate **Gate C** authorization to **create and/or execute** additive Dev/Test SQL. **Not** Production (that is architecture Authorization **F**). |
| 2. Programme → RFP FK | **READY FOR AUTHORIZATION REVIEW** (Dev/Test additive DDL design only) | Column `prg_programmes.rfp_id UUID NOT NULL` exists without FK to `rfp_rfps`; `createProgramme` already requires RFP (`invalid_rfp`); Gate B §9 RESTRICT; disposable `prg_programmes` = 0 | Same apply-method and backup prerequisites as item 1; sequence **after** parent `rfp_rfps` rows can satisfy the constraint (vacuous on this empty instance) | Same as item 1 |
| 3. Unique active Programme per RFP | **READY FOR AUTHORIZATION REVIEW** (Dev/Test additive DDL design only) | Existing index `prg_programmes_tenant_rfp` is **non-unique** `(tenant_id, rfp_id) WHERE archived_at IS NULL`; uniques today are PK and `(tenant_id, programme_code)` only; app rejects second non-archived programme (`programme_exists_for_rfp`); “active” for this rule is **`archived_at IS NULL`** | Confirm dual `status` vs `archived_at` caveat (§R.4) is accepted; unique index must be **new** (existing index does not enforce uniqueness); empty-table compatibility on this instance only | Same as item 1 |
| 4. Additional Production query-plan indexes | **REQUIRES DATA/SCHEMA EVIDENCE** (repository assessment **OA.15**; Production plans still unavailable) | No named Production indexes in the original backlog. **OA.15** inspected repository schema and persist SQL: **no category-C index**. Existing `rfp_rfps_opportunity` and 123 `prg_programmes_tenant_active_rfp` cover coded relationship lookups. Potential (B) shapes are listed but not required | Production (or separately authorized lab) `EXPLAIN`/workload evidence before any named index can be classified C. Do not invent speculative Production indexes | Not presentable as a named migration. **OA.15** is not authorization. Production indexes are not implied by Gate B closure or migration 123 |
| 5. Production migration / backfill / cutover | **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE** (repository assessment **OA.16**; still **OPEN**, not authorized) | Architecture Authorization **C** = Dev/Test additive migrate; Authorization **F** = Production migration; WP-14 cutover ≠ DDL. **OA.16:** no category-C backfill script; cutover **not defined**; `migrate()` auto-runs on API startup; E1/hosting/ADR-0011 Production backup remain unresolved | Production PostgreSQL, E1 placement, backup product, preflight inspection, bounded apply method (not silent `migrate()`), and a written WP-14 procedure before any F request | **Not** Gate C Dev/Test. **OA.16** is not Authorization F and not WP-14. UAT/Production remain **NOT AUTHORIZED** |
| 6. Optional event catalogue rows | **REQUIRES DESIGN CLARIFICATION** | Optional in backlog. `event_catalogue` table exists on the disposable instance (0 rows). Gate B runtime inserts outbox from kernel event type constants without requiring catalogue rows. No FK from `outbox_events` to `event_catalogue` observed in this review’s SQL sources | Decide whether Production publishers must validate catalogue membership; if yes, specify which event types and whether that is data seed vs schema | Owner/design decision before inclusion. Not a blocker of items 1–3 |
| 7. Kernel `DocumentStorage.delete` | **NOT APPLICABLE** as schema migration | Kernel port is `put`/`get` only (`packages/kernel/src/commercial-document.ts`). Architecture §9 is a design note, not DDL. Local-fs compensation delete is application/port work | If retained in a later package, treat as **application/kernel** change under a Dev/Test implementation authorization, not Gate C SQL | Not Gate C DDL. Do not include in a migration-execution request |

**None of the rows above is approved for execution.**

## R.3 Migration-impact review (items 1–3 and supporting indexes)

Inspection combined repository SQL (`016`, `017`), application persist paths, and READ-ONLY catalogue/constraint/count queries against disposable `serengeti-eos-gate-b-pg`. Findings apply to **this disposable Dev/Test instance**. They are **not** Production data-compatibility evidence.

### RFP → Opportunity FK

| Question | Finding |
| --- | --- |
| Existing data compatibility | `rfp_rfps` = 0, `opp_opportunities` = 0, orphan `opportunity_id` count = 0. Adding `REFERENCES opp_opportunities(id)` is vacuously compatible **here**. |
| Nullability | `opportunity_id` is already `NOT NULL`. Adding the FK does not relax or add nulls. |
| Can existing rows satisfy the constraint? | Yes on this instance (no rows). Unknown for any other database; no other database was inspected. |
| Required backfill | **None** for this disposable instance. Production/UAT backfill is **not** in scope and is not evidenced. |
| Application write/read | `createRfp` loads the opportunity by tenant and rejects `invalid_opportunity`. Repository writes persist `opportunity_id` copied from that opportunity. Reads do not depend on a database FK. |
| Safe without application changes? | **Proposed:** yes for the API persist path already verified in Gate B, because the app already requires a live opportunity. Direct SQL inserts could still violate until the FK exists. Concurrent or non-API writers are **not** evidenced. Application change is **not** demonstrated as required for the happy path. |

`ON DELETE RESTRICT` is the recorded design (Gate B §9; architecture §6). `ON DELETE CASCADE` is explicitly not recommended. Soft-archive of opportunities (`archived_at`) would **not** remove the parent row, so RESTRICT would not block archive; it would block **hard delete** of an opportunity that still has RFPs.

### Programme → RFP FK

| Question | Finding |
| --- | --- |
| Existing data compatibility | `prg_programmes` = 0, orphan `rfp_id` count = 0. Vacuously compatible **here**. |
| Nullability | `rfp_id` is already `NOT NULL`. |
| Required backfill | **None** on this instance. |
| Application assumptions | `createProgramme` requires `loadRfp` and copies `rfp.id`, `opportunityId`, and `organizationId` from the RFP. |
| Safe without application changes? | **Proposed:** yes for the API persist path. Same caveat as the RFP FK for non-API writers. |

Logical sequence: parent Opportunity rows → RFP rows → Programme rows. On empty tables, FK order of **creation** should still be Opportunity FK (item 1) then Programme FK (item 2), then unique index (item 3).

### Unique active Programme per RFP

| Question | Finding |
| --- | --- |
| Current data shape | 0 programmes; 0 duplicate active `(tenant_id, rfp_id)` groups. |
| Definition of “active” | Backlog and existing index predicate: **`archived_at IS NULL`**. Application `loadProgrammeByRfp` / `getProgrammeByRfpId` use `!archivedAt`, **not** `status = 'active'`. |
| Representable in PostgreSQL? | Yes: `CREATE UNIQUE INDEX … ON prg_programmes (tenant_id, rfp_id) WHERE archived_at IS NULL`. |
| Partial unique index required? | **Yes.** A table-level `UNIQUE (tenant_id, rfp_id)` would forbid archived historical programmes for the same RFP. The approved rule is one **non-archived** programme. |
| Could existing data violate it? | Not on this instance. Unknown elsewhere. |
| Is “active” sufficiently explicit? | **For the stated rule, yes** (`archived_at IS NULL`). See §R.4 for the separate `status` column caveat (newly identified, not a change to the stated rule). |

The existing index `prg_programmes_tenant_rfp` is the same keys and predicate but **non-unique**. Item 3 requires a **new unique** index. Replacing or dropping the non-unique index is **not** an approved requirement; it would be speculative.

### Supporting indexes

Indexes **demonstrably** required by the approved design:

- The unique index that **is** item 3 (constraint implementation).
- No additional index is named in items 1–3. `rfp_rfps_opportunity (tenant_id, opportunity_id)` already exists in `016`. `prg_programmes_tenant_rfp` already exists in `017` as a query index.

Item 4’s “Production query plans” indexes are **not** identified. This review does **not** add speculative indexes.

## R.4 READ-ONLY disposable database inspection

Inspection performed 2026-09-16 against the existing disposable Gate-B instance. **SELECT / catalogue only.** No CREATE/ALTER/DROP/INSERT/UPDATE/DELETE. `migrate()` not invoked.

| Item | Observed |
| --- | --- |
| Instance | Docker container `serengeti-eos-gate-b-pg` (Up; PostgreSQL accepting connections on the Gate-B mapping) |
| Availability | **Available** for read-only inspection |
| `schema_migrations` | **Absent** (`false`) |
| RFP → Opportunity FK | **ABSENT** (`rfp_rfps` FKs: tenant, assigned/created/updated principals only) |
| Programme → RFP FK | **ABSENT** (`prg_programmes` FKs: tenant, created/updated principals only) |
| Unique active programme-per-RFP | **ABSENT** (uniques: PK; `(tenant_id, programme_code)` only) |
| `rfp_rfps.opportunity_id` | `uuid NOT NULL` |
| `prg_programmes.rfp_id` / `opportunity_id` | both `uuid NOT NULL` |
| `prg_programmes.status` | `NOT NULL` CHECK `draft \| active \| archived` (independent of `archived_at`) |
| Row counts (business) | `opp_opportunities` 0; `rfp_rfps` 0; `prg_programmes` 0; `cost_sheets` 0; `com_approval_requests` 0; `commercial_documents` 0 |
| Residual (unchanged by this review) | tenants 2; principals 6; `audit_events` 93; `outbox_events` 27 — consistent with Gate B §19.6 |
| `event_catalogue` | table **exists**, 0 rows |
| `crm_organizations` | **does not exist** on this bounded bootstrap schema (CRM catalogue files were not applied) |

**`status` vs `archived_at` (newly identified caveat, not a new approved rule):** a programme with `status = 'archived'` and `archived_at IS NULL` would still occupy the unique slot. A programme with `status = 'draft'` and `archived_at IS NULL` **is** “active” under the stated uniqueness rule. Application uniqueness already follows `archived_at`, not `status`. This review does not change the rule; an owner/design note should confirm that is intended before SQL is authored.

## R.5 Migration safety — what must be true before execution can eventually be authorized

Distinguish evidence from proposal. **Nothing in this section has been tested as a Gate C migration.** Gate B verification was migration-free.

### Known / evidenced

- Gate B application persist already validates RFP↔opportunity and one non-archived programme per RFP.
- Target constraint shapes are recorded: FK RESTRICT; partial unique on `(tenant_id, rfp_id) WHERE archived_at IS NULL`; additive file after `122`; no CASCADE delete of RFP/programme headers; empty Dev/Test tables expected.
- Disposable Dev/Test business tables for these entities are currently empty; orphan counts are 0.
- Bounded bootstrap applied 11 enumerated files only; full catalogue `migrate()` was rejected for Gate B and remains unauthorized.
- No `123+` migration file exists in `packages/db/migrations`.
- `schema_migrations` ledger is absent on the disposable instance.
- Forward-fix preferred over CASCADE rollback of headers (design record, not a tested down-migration).
- Gate B §13 backup/PITR of EOS tables was **not** executed; E2 remains `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`.
- Production hosting, residency, RTO/RPO, HA/DR, backup architecture, identity, UAT, and Production remain **not** approved by this review or by Gate B closure.

### Proposed / requires validation

- **Ordering:** (1) confirm no orphans / no duplicate active programmes; (2) add RFP→Opportunity FK with validation; (3) add Programme→RFP FK with validation; (4) create partial unique index. Optional costing/approval FKs, if ever included, after their parent rows/tables.
- **Transaction behavior:** additive `ALTER TABLE … ADD CONSTRAINT` and `CREATE UNIQUE INDEX` on empty Dev/Test tables can run in a single transaction. `CREATE UNIQUE INDEX CONCURRENTLY` **cannot** run inside a transaction — relevant only if a non-empty environment and lock strategy require it (not evidenced; not Production).
- **FK validation:** default PostgreSQL FK creation validates existing rows. Compatible with 0 rows here. `NOT VALID` / validate-later is a Production-sized strategy and is **not** selected.
- **Constraint creation strategy:** new numbered SQL after `122`; do not rewrite `016`/`017`/`122`.
- **Rollback strategy:** `DROP CONSTRAINT` / `DROP INDEX` of the new objects only; do not DROP business tables. Default remains forward-fix. No down-migration file exists.
- **Application compatibility:** proposed that items 1–3 do not require application code changes for the already-verified persist paths; the unique index would additionally close a create-programme TOCTOU gap currently enforced only in application code. That benefit is **not** a test result.
- **Idempotency:** `CREATE TABLE IF NOT EXISTS` style of older files does not automatically make `ADD CONSTRAINT` idempotent. Re-run behavior must be designed (named constraints + existence checks, or a migration ledger). **Not designed.**
- **Observability:** record the exact SQL file, apply method, start/end timestamps, constraint names, and before/after `\d` of `rfp_rfps` / `prg_programmes`. **Not implemented.**
- **Failure handling:** stop on first error; do not continue a partial catalogue apply. **Not tested.**
- **Apply method:** a **bounded** replay of a single additive file (same discipline as Authorization B bootstrap) vs `migrate()` of the remaining 100+ catalogue files. **Not decided.** Unbounded `migrate()` would apply CRM/HR/ITSM/etc. objects never authorized on this instance — that is a different, larger authorization.

### Unknown / requires decision or evidence

- Whether the first authorized Gate C act is **file creation**, **Dev/Test execute**, or both (Gate B §8 lists create / review / execute as Gate C; architecture splits **C** Dev/Test execute from **F** Production).
- Whether optional `cost_sheets` / `com_approval_requests` FKs are in or out of the first slice (architecture proposed; this backlog did not number them).
- Simple `REFERENCES parent(id)` vs composite `(tenant_id, parent_id)` matching unique `(tenant_id, …)` parent keys.
- Lock/downtime on a non-empty database (not applicable to current 0-row business tables; Production unknown).
- Backup-before-DDL and restore-verification procedure for even the disposable instance (Gate B did not claim EOS-table restore).
- Re-run / ledger semantics if `schema_migrations` is introduced later.
- Any environment other than `serengeti-eos-gate-b-pg`.
- Production data shape, residency, RTO/RPO, HA/DR, or cutover.

## R.6 Newly identified review items (not already-approved Gate C scope)

These are **not** added to the approved/numbered requirements. They must not be treated as authorized work.

1. **Apply mechanism vs full catalogue.** Bounded 11-file bootstrap left files `002`, `004`–`013`, `020`–`118`, `120`–`121` unapplied. A Gate C `migrate()` of the catalogue is not equivalent to adding items 1–3.
2. **First-slice optional FKs.** Architecture §5.2/§6 and Gate B §8 mention `cost_sheets` and `com_approval_requests` FKs. Observed on this instance: `programme_id` / `rfp_id` (and related UUIDs) **NOT NULL** without parent FKs. Not numbered in items 1–7.
3. **`prg_programmes.opportunity_id`** is `NOT NULL` and unconstrained to `opp_opportunities` (copied from RFP in application code).
4. **Organization FKs** remain application-level until CRM is a true SoR; `crm_organizations` is absent on this instance.
5. **Tenant-composite FKs** vs id-only FKs (cross-tenant UUID reference theoretically possible with id-only FK).
6. **`status = 'archived'` vs `archived_at IS NULL`** dual fields on `prg_programmes`.
7. **No migration ledger** (`schema_migrations` absent); numbering/idempotency for a future 123 file is unset.
8. Item 7 (`DocumentStorage.delete`) is a kernel/port change, not a database migration.

## R.7 What this review does **not** do

This review does **not**: select a Production cloud provider or region; approve Tanzania/EU/other residency; approve RTO/RPO, HA/DR, or backup architecture; approve Production security or identity architecture; approve UAT or Production; authorize deployment; authorize migration execution; convert Gate B evidence into Production readiness; create or alter schema; create `123+` SQL; run `migrate()`; modify application code.

## R.8 Determination

**B. REQUIRES PRE-AUTHORIZATION WORK**

Items 1–3 are **design-specified** enough that they could later be presented as a **bounded Dev/Test additive-DDL** authorization request. The Gate C backlog **as currently written** is **not** that request: it mixes those three constraints with unspecified Production indexes (item 4), Production backfill/cutover (item 5; architecture places Production migration on Authorization **F** and cutover on WP-14), and optional non-SQL work (items 6–7). Execution method (bounded additive file vs unbounded `migrate()`) is unset. No migration SQL exists. Backup/restore-before-DDL is not evidenced. Optional costing/approval FKs are unspecified relative to the first slice.

Therefore an owner authorization request covering the **entire** current backlog would not be bounded. Specific missing work must be completed **before** a reasonable authorization request can be presented.

This is **not** determination A (the mixed package is not ready to present). This is **not** determination C (there is no single material governance block that prevents **preparing** a bounded Dev/Test items 1–3 request; Gate B is closed; the disposable schema is inspectable; the three constraint shapes are recorded).

### Pre-authorization work (documentation/decision only — still not Gate C execution)

1. Split this backlog into a **first Gate C candidate slice** (Dev/Test items 1–3 only) versus later packages (Production indexes, Production migration/cutover, optional catalogue, kernel delete).
2. Record the apply method for that slice: **explicit additive SQL file after 122**, applied with the same bounded discipline as Authorization B — **not** unbounded `migrate()` of the remaining catalogue — unless a separate, larger authorization is explicitly sought.
3. Record in or out: optional `cost_sheets` / `com_approval_requests` FKs for the first slice (default from this review: **out**, because they are not numbered items 1–3).
4. Record FK shape: `REFERENCES parent(id) ON DELETE RESTRICT` as already designed, or composite tenant keys (newly identified). Default from existing design records: **id-only RESTRICT**.
5. Record confirmation that uniqueness follows `archived_at IS NULL` even for `status = 'draft'`.
6. Specify disposable-instance backup/restore-verification as a **prerequisite to eventual execute**, without claiming it has been done.
7. Leave SQL unauthored until Gate C create-and/or-execute is actually authorized (creating migration files is itself a Gate C act per Gate B §8).

### Required approvals (absent — not fabricated)

All of the following remain **REQUIRES HUMAN/OWNER APPROVAL**. No owner name, signature, approval date, legal attestation, Finance approval, IT approval, Production approval, migration authorization, UAT authorization, or deployment authorization is recorded by this review.

| Approval still required | Purpose | Status |
| --- | --- | --- |
| Owner decision to split / bound the first Gate C slice | Pre-authorization work §R.8 | **REQUIRES HUMAN/OWNER APPROVAL** |
| Gate C authorization to **create** additive Dev/Test migration SQL (items 1–3 only, once bounded) | Gate B §8: creating SQL is Gate C | **REQUIRES HUMAN/OWNER APPROVAL** — not granted |
| Gate C authorization to **review** that SQL | Gate B §8 | **REQUIRES HUMAN/OWNER APPROVAL** — not granted |
| Gate C authorization to **execute** that SQL on disposable Dev/Test | Architecture Authorization **C**; Gate B §8 | **REQUIRES HUMAN/OWNER APPROVAL** — not granted |
| Owner decision on apply method (bounded additive file vs unbounded `migrate()`) | §R.5 / §R.6 | **REQUIRES HUMAN/OWNER APPROVAL** |
| Owner confirmation of uniqueness = `archived_at IS NULL` (including `status = 'draft'`) | Item 3 | **REQUIRES HUMAN/OWNER APPROVAL** |
| Owner decision to include or exclude optional costing/approval FKs in the first slice | Newly identified vs numbered 1–3 | **REQUIRES HUMAN/OWNER APPROVAL** |
| Backup/restore-verification before any execute | §R.5 | **REQUIRES HUMAN/OWNER APPROVAL** of the procedure; restore is **not evidenced** |
| Architecture Authorization **F** — Production migration | Item 5 / architecture pack | **REQUIRES HUMAN/OWNER APPROVAL** — not granted; **not** this Gate C review |
| WP-14 cutover authorization | Item 5 / architecture §15 | **REQUIRES HUMAN/OWNER APPROVAL** — not granted |
| UAT authorization (Architecture **D**) | Out of this review | **REQUIRES HUMAN/OWNER APPROVAL** — not granted |
| Production implementation / deploy (Architecture **E**/later) | Out of this review | **REQUIRES HUMAN/OWNER APPROVAL** — not granted |
| E1 data-residency / hosting / RTO-RPO / HA-DR / Production security / identity | Explicitly out of Gate C unless separately decided | **REQUIRES HUMAN/OWNER APPROVAL** — not granted; this review does not select or approve them |

## R.9 Next governed action (superseded)

The bounded request described here was subsequently prepared. See **Proposed Gate C Dev/Test Authorization Slice — Constraints 1–3** below.

Until that slice is separately authorized:

- Gate C remains **NOT AUTHORIZED**
- Do not create additive migration SQL
- Do not execute migrations
- Do not authorize UAT or Production

---

# Proposed Gate C Dev/Test Authorization Slice — Constraints 1–3

> **AUTHORIZATION REQUEST — NOT AN AUTHORIZATION RECORD**  
> **`GATE C EXECUTION — NOT AUTHORIZED`**  
> Prepared 2026-09-16 after Gate B **CLOSED / VERIFICATION ACCEPTED**.  
> No owner name, signature, approval date, approval ID, legal/IT/Finance attestation, or grant statement is recorded here.  
> Where approval is required: **REQUIRES HUMAN/OWNER APPROVAL**.

This section converts the mixed Gate C backlog into a **bounded** request the owner can approve or reject. Approving this document in a later human instruction would authorize only the actions the owner explicitly names (create SQL, review SQL, execute DDL, and/or verify). Until then, nothing in this section is granted.

SQL in this section is **specification only**. It is not a migration file and has not been executed.

## A. Requested scope

Exactly three Dev/Test schema objects, on the disposable Gate-B PostgreSQL instance only:

| # | Object | Target |
| --- | --- | --- |
| 1 | Foreign key | `rfp_rfps.opportunity_id` → `opp_opportunities.id` **`ON DELETE RESTRICT`** |
| 2 | Foreign key | `prg_programmes.rfp_id` → `rfp_rfps.id` **`ON DELETE RESTRICT`** |
| 3 | Partial unique index | `UNIQUE (tenant_id, rfp_id) WHERE archived_at IS NULL` on `prg_programmes` |

**FK shape (recommendation, recorded design):** Option A — simple `child.parent_id → parent.id`. Not composite `(tenant_id, parent_id)`. Evidence: Gate B §9 and architecture §6 specify id-level RESTRICT FKs; existing catalogue FKs (including `opp_stage_history.opportunity_id → opp_opportunities(id)`) are id-only; no `FOREIGN KEY (tenant_id, …)` exists in `packages/db` SQL; parents have `PRIMARY KEY (id)` and **no** `UNIQUE (tenant_id, id)` that a composite FK would require. Tenant isolation remains the application `WHERE tenant_id = $n` filter already used by repositories. The unique index in constraint 3 is tenant-scoped because the **business** rule is one active programme per tenant+RFP (`getProgrammeByRfpId(tenant_id, rfp_id)`), not because the FKs must be composite.

Option B (composite tenant FKs) would be extra DDL (parent unique on `(tenant_id, id)`) **outside this slice**. It is **deferred**, not rejected forever.

## B. Excluded scope

This request does **not** include, imply, or authorize:

- Production migration (architecture Authorization **F**)
- Production backfill or Production data
- Production cutover / WP-14
- UAT
- Production deployment
- Additional unspecified indexes (backlog item 4)
- Optional `event_catalogue` rows (backlog item 6)
- Kernel/application `DocumentStorage.delete` (backlog item 7)
- Costing / commercial-approval header FKs (`cost_sheets`, `com_approval_requests`) — architecture §5.2/§6 and Gate B §8 list them as **optional**, not as this slice
- Unbounded `migrate()` of `packages/db` (`schema.sql` + all 117 numbered files)
- Creating or using `schema_migrations` on the disposable instance
- Rewriting `016` / `017` / `122`
- `ON DELETE CASCADE` of RFP / Opportunity / Programme rows
- Dropping existing non-unique index `prg_programmes_tenant_rfp`
- Hosting, residency, RTO/RPO, HA/DR, Production security, identity, credentials
- Application code changes
- A second database, clone, or container

Backlog items 4–7 remain on the backlog for **later, separate** packages. They are **deferred**.

## C. Target environment

| Item | Value |
| --- | --- |
| Instance | Docker container `serengeti-eos-gate-b-pg` |
| Bind | `127.0.0.1:5434` (container 5432) |
| Volume | `serengeti-eos-gate-b-pgdata` |
| Role / database | as established by Authorization B bootstrap (`eos_gateb`) |
| Class | Disposable **Dev/Test only** |
| Data | Synthetic identifiers only (Gate B `GBV-*` residue plus identity bootstrap) |
| Not | UAT, Production, Production-migration rehearsal, live customer data |

Do not create another database. This request is not a Production rehearsal.

READ-ONLY inspection (2026-09-16): `rfp_rfps` / `opp_opportunities` / `prg_programmes` = 0 rows; orphan and duplicate-active counts = 0; Gate C objects **ABSENT**; `schema_migrations` **absent**.

## D. Proposed implementation method

**Recommendation:** bounded additive SQL file in `packages/db/migrations`, numeric prefix **after `122`**, applied with the same **explicit-file** discipline as Authorization B bootstrap.

| Option | Verdict |
| --- | --- |
| 1. Bounded additive file after `122`, applied via explicit `psql` of **that file only** | **RECOMMENDED** for this slice |
| 2. `migrate()` (`packages/db/src/index.ts`) | **NOT REQUESTED** and **not acceptable** for this instance |

`migrate()` creates `schema_migrations` and applies `schema.sql` plus **every** unapplied file under `packages/db/migrations` in sort order. The disposable instance received only the 11-file bootstrap (not the full catalogue). Invoking `migrate()` would apply CRM/HR/ITSM and other unauthorized files. This request therefore states:

- **no `migrate()` execution is requested**
- proposed SQL would be a **dedicated additive Gate C migration**
- it must **not** silently execute unrelated migrations
- exact filename/number is **not allocated by this request**

Catalogue convention is `NNN_description.sql`. Highest existing file is `122_cd_programme_item_extensions.sql`. Gate B §8 gives `123_…sql` as an **example**, not an allocated name. **Exact filename is assigned only when CREATE SQL is authorized.** This request does not invent or reserve `123`.

### Ledger / idempotency (recommendation)

Repository ledger = `schema_migrations` populated **only** by `migrate()`. Using that ledger on this instance without applying the rest of the catalogue would mis-state apply state and make a later `migrate()` still apply the missing files.

**Recommended for this slice:**

- Do **not** create `schema_migrations`
- Do **not** call `migrate()`
- Name the two FKs and the unique index (proposed names below)
- Unique index: `CREATE UNIQUE INDEX IF NOT EXISTS` (existing catalogue style, e.g. `049`)
- FKs: named `ALTER TABLE … ADD CONSTRAINT`; pre-check `pg_constraint` before add (PostgreSQL has no `ADD CONSTRAINT IF NOT EXISTS` in the engine used here)
- Treat the execute as a **single authorized run** on the empty disposable database
- Evidence of apply = governance record + `pg_constraint` / `pg_indexes` listings, not the application ledger

A later environment that already has `001`–`122` in `schema_migrations` could apply the same additive file via `migrate()` only under a **separate** authorization. That is **not** this request.

## E. Proposed object definitions

**PROPOSED DDL — specification only. Not a file. Not executed. Not authorized.**

Proposed names (for later SQL authoring):

| Object | Proposed name |
| --- | --- |
| FK 1 | `rfp_rfps_opportunity_id_fkey` |
| FK 2 | `prg_programmes_rfp_id_fkey` |
| Unique index | `prg_programmes_tenant_active_rfp` |

```sql
ALTER TABLE rfp_rfps
  ADD CONSTRAINT rfp_rfps_opportunity_id_fkey
  FOREIGN KEY (opportunity_id) REFERENCES opp_opportunities (id)
  ON DELETE RESTRICT;

ALTER TABLE prg_programmes
  ADD CONSTRAINT prg_programmes_rfp_id_fkey
  FOREIGN KEY (rfp_id) REFERENCES rfp_rfps (id)
  ON DELETE RESTRICT;

CREATE UNIQUE INDEX IF NOT EXISTS prg_programmes_tenant_active_rfp
  ON prg_programmes (tenant_id, rfp_id)
  WHERE archived_at IS NULL;
```

`ON UPDATE` is omitted (PostgreSQL default `NO ACTION`), matching existing catalogue FKs in `015`/`016`/`017` which do not specify `ON DELETE`/`ON UPDATE`. Explicit `ON DELETE RESTRICT` follows Gate B §9 / architecture §6 rather than the catalogue default.

### Nullability

Both FK columns are already `UUID NOT NULL`. This slice does not change nullability.

### Uniqueness semantics (confirmed from code — not `status`)

| Source | Rule used |
| --- | --- |
| Backlog item 3 | `(tenant_id, rfp_id) WHERE archived_at IS NULL` |
| `getProgrammeByRfpId` | `WHERE tenant_id = $1 AND rfp_id = $2 AND archived_at IS NULL` |
| `createProgramme` | rejects when `loadProgrammeByRfp` finds a row (`programme_exists_for_rfp`) |
| Memory path | `!p.archivedAt` |
| Kernel `ProgrammeStatus` | `'draft' \| 'active' \| 'archived'` — **separate** column |
| Existing index `prg_programmes_tenant_rfp` | same keys and `archived_at IS NULL` predicate, **non-unique** |

**Recommendation, for owner confirmation:** “active” for this constraint **is** `archived_at IS NULL`.

- Archived programmes (`archived_at IS NOT NULL`) remain allowed (including multiple historical rows per RFP).
- Draft programmes with `archived_at IS NULL` **count as active** and occupy the unique slot.
- A full-table `UNIQUE (tenant_id, rfp_id)` would be **incorrect** for the stated rule.
- Do **not** substitute `status = 'active'` or `status <> 'archived'`.
- Do **not** drop `prg_programmes_tenant_rfp` in this slice.

Application uniqueness and the proposed index **agree**. This is not marked `REQUIRES OWNER/DESIGN DECISION` as a conflict; owner approval of this request includes accepting this definition.

### Application impact (no code in this request)

| Constraint | Code change required? | Notes |
| --- | --- | --- |
| FK 1 | **No** (API persist path) | `createRfp` already loads opportunity by `(id, tenant_id)` and returns `invalid_opportunity` |
| FK 2 | **No** (API persist path) | `createProgramme` already requires RFP (`invalid_rfp`) |
| Unique index | **No** (API persist path) | App already rejects a second non-archived programme. Index would additionally reject concurrent/non-API inserts. **Not** migration-tested |

Direct SQL writers could currently insert orphans; the FKs would start rejecting those. That is the point of the slice.

## F. Preconditions

Distinguish **already obtained** from **prerequisite for execution**.

### Evidence already obtained (not re-claimed as execution)

- Gate B **CLOSED / VERIFICATION ACCEPTED** (Dev/Test persist verification)
- Disposable instance identity and 11-file bootstrap (Authorization B)
- READ-ONLY 2026-09-16: 0 business rows; 0 orphans; 0 duplicate active programme groups; Gate C objects absent
- Application invariants for the three constraints exist in code
- Backup/restore of EOS tables was **not** demonstrated in Gate B; E2 remains `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`

### Prerequisite for execution (not done now)

1. Human/owner approval of **this bounded request**, naming which of create / review / execute / verify are granted.
2. Confirm target identity immediately before DDL: container `serengeti-eos-gate-b-pg`, `127.0.0.1:5434`, disposable Dev/Test, not UAT/Production.
3. Confirm synthetic-only data (no live customer rows).
4. Capture pre-DDL schema/constraint/index listings for `rfp_rfps` and `prg_programmes`.
5. Capture pre-migration counts: `opp_opportunities`, `rfp_rfps`, `prg_programmes`; orphan opportunity_id; orphan rfp_id; duplicate active `(tenant_id, rfp_id)` groups. **Stop** if orphans or duplicates exist.
6. **Backup procedure (recommended, not evidenced):** `pg_dump` of database `eos_gateb` to a dated evidence path **before** DDL. This dump is **not** claimed to exist today.
7. **Restore / recovery (recommended for this disposable instance):** if DDL fails or must be undone beyond dropping the three objects, **re-bootstrap** from the Authorization B 11-file SQL (instance is disposable). A clone restore-verification is **stronger** and is **not** in this slice (it would require another database). Gate B did **not** prove dump restore.
8. SQL file exists only after **CREATE** is authorized; review completed if the owner required **REVIEW** before execute.
9. Execute only after **EXECUTE** is separately authorized. Do not run `migrate()`.

## G. Verification plan

After a future authorized execute, capture (do **not** do this now):

1. `pg_get_constraintdef` for `rfp_rfps_opportunity_id_fkey` and `prg_programmes_rfp_id_fkey` (or the names actually created).
2. `pg_indexes.indexdef` for `prg_programmes_tenant_active_rfp` showing `UNIQUE` and `WHERE (archived_at IS NULL)`.
3. Repeat orphan and duplicate-active counts (expect 0 on this instance).
4. Confirm `schema_migrations` still absent (bounded apply did not introduce the ledger).
5. Confirm unrelated catalogue objects were not added (spot-check that CRM/HR tables beyond the bootstrap set remain absent).
6. If separately authorized: re-run the existing **migration-free** Gate B persist suite against the same instance (constraints must not break verified persist). Do **not** run `pg.integration.test.ts` (`migrate()`).
7. Record evidence in this governance file or a dated evidence note. Stop.

No new test file is created by this request.

## H. Rollback boundary

Rollback removes **only** the objects this slice added:

```sql
ALTER TABLE rfp_rfps DROP CONSTRAINT IF EXISTS rfp_rfps_opportunity_id_fkey;
ALTER TABLE prg_programmes DROP CONSTRAINT IF EXISTS prg_programmes_rfp_id_fkey;
DROP INDEX IF EXISTS prg_programmes_tenant_active_rfp;
```

Rollback must **not**: delete RFPs, Opportunities, Programmes, or other business rows; use `ON DELETE CASCADE`; drop `016`/`017` tables; drop `prg_programmes_tenant_rfp`; modify application state.

**Transactional DDL (design characteristic, not tested for this migration):** on PostgreSQL, `ALTER TABLE ADD CONSTRAINT` and non-`CONCURRENTLY` `CREATE UNIQUE INDEX` can run in one `BEGIN`/`COMMIT`. Failure can `ROLLBACK` the three objects together. `CREATE UNIQUE INDEX CONCURRENTLY` is **not** proposed for this empty disposable instance (it cannot run inside a transaction). This is not Production lock evidence.

Default remains **forward-fix** if execute succeeds and a defect is found later. No down-migration file is created by this request.

## I. Open decisions

Material design questions for this slice are **recommended above** and are presented for owner acceptance as part of this request. They are not left unspecified.

Non-blocking items (do not prevent presenting this request):

| Item | Note |
| --- | --- |
| Exact migration filename | Assigned only when CREATE SQL is authorized; convention is `NNN_*.sql` after `122`; `123` is not allocated here |
| Clone dump-restore laboratory | Out of this slice; recovery recommendation is re-bootstrap of the disposable instance |
| Option B composite tenant FKs | Deferred; extra parent unique would be required |
| Costing/approval FKs; items 4–7 | Deferred to later packages |
| Production `migrate()` of the same file | Separate later authorization, only on an instance that already has the catalogue ledger |

If the owner rejects any recommendation in §D–§E, the request must be revised before CREATE/EXECUTE. That is owner review, not missing pre-authorization work.

## J. Authorization matrix

| Action | Status |
| --- | --- |
| Prepare design | **COMPLETED** (this section) |
| Create migration SQL | **REQUIRES HUMAN/OWNER APPROVAL** |
| Review migration SQL | **REQUIRES HUMAN/OWNER APPROVAL** |
| Execute Dev/Test DDL | **REQUIRES HUMAN/OWNER APPROVAL** |
| Verify Gate C result | **REQUIRES HUMAN/OWNER APPROVAL** |
| UAT | **NOT AUTHORIZED** |
| Production migration | **NOT AUTHORIZED** |
| Production cutover | **NOT AUTHORIZED** |
| Production deployment | **NOT AUTHORIZED** |
| `migrate()` | **NOT REQUESTED** / **NOT AUTHORIZED** |

## K. Proposed execution sequence (not executed)

1. Confirm instance identity and synthetic-only data.
2. Capture pre-DDL listings and counts; stop if orphans or duplicate active programmes exist.
3. Capture `pg_dump` evidence (if the owner accepted §F).
4. Verify Opportunity parent integrity (0 orphans here).
5. Add RFP → Opportunity FK.
6. Verify Programme parent integrity (0 orphans here).
7. Add Programme → RFP FK.
8. Verify no duplicate active Programme-per-RFP groups.
9. Add partial unique index.
10. Verify all three objects (§G).
11. Run only the specifically authorized Gate C verification.
12. Record evidence.
13. **Stop.**

Preferred Dev/Test wrapping: one transaction containing steps 5, 7, and 9.

## L. Lock / downtime (not Production evidence)

| Object | PostgreSQL operation | Likely lock | Empty disposable DB | Not Production evidence because |
| --- | --- | --- | --- | --- |
| FK 1 | `ALTER TABLE rfp_rfps ADD CONSTRAINT … FOREIGN KEY` | `ACCESS EXCLUSIVE` on child; row-share style lock on parent | `rfp_rfps` / `opp_opportunities` have 0 rows; duration expected short | Production table size, concurrency, and replica lag are unknown |
| FK 2 | `ALTER TABLE prg_programmes ADD CONSTRAINT … FOREIGN KEY` | Same pattern on `prg_programmes` / `rfp_rfps` | 0 rows | Same |
| Unique index | `CREATE UNIQUE INDEX` (non-concurrent) | Blocks writes on `prg_programmes` while building | 0 rows; `CONCURRENTLY` not proposed | Production build time and write-blocking are unmeasured |

This request does **not** claim lock-free or downtime-free execution.

## M. Next governed action

**Superseded for status.** The bounded request was presented and the owner authorization is recorded in **OWNER AUTHORIZATION — BOUNDED DEV/TEST GATE C SLICE — CONSTRAINTS 1–3**. Historical request text above is retained.

The next governed action after that record is **CREATE** the bounded migration SQL. That CREATE step is **not** performed in the authorization-recording task.

---

# OWNER AUTHORIZATION — BOUNDED DEV/TEST GATE C SLICE — CONSTRAINTS 1–3

> **`OWNER AUTHORIZATION RECORDED — BOUNDED GATE C DEV/TEST SLICE 1–3`**  
> **`NOT A UAT AUTHORIZATION`**  
> **`NOT A PRODUCTION AUTHORIZATION`**  
> **`NOT A FULL migrate() AUTHORIZATION`**  
> **`CREATE → REVIEW → EXECUTE CHECKPOINTS REMAIN`**

Governance recording note: this **status** is recorded from the authorized stakeholder instruction in the governing conversation. **Named personal signature, legal authority title, and handwritten date are not invented.** Blank attestation fields follow the Stage 1 convention. Filling a name or signature block is reserved for the stakeholder; this section records **decision status only**.

**GATE C BOUNDED SLICE DECISION:**  
`AUTHORIZED` — disposable Dev/Test constraints 1–3 only, subject to CREATE → REVIEW → EXECUTE controls and the execution prerequisites below.

**Recorded decision:**

> The owner authorizes preparation, review, and controlled execution of the bounded Gate C Dev/Test persistence slice consisting only of the RFP→Opportunity FK, Programme→RFP FK, and tenant-scoped active-Programme uniqueness constraint, subject to the documented CREATE → REVIEW → EXECUTE controls and execution prerequisites.

This statement is **not** expanded beyond that scope.

Do **not** interpret this record as permission to bypass CREATE → REVIEW → EXECUTE. SQL is **not** created by this recording. Execution is **not** started by this recording.

Name: `________________`  
Role: `________________`  
Decision: `AUTHORIZED` (bounded Dev/Test slice 1–3 only; recorded from governing conversation)  
Date: `________________`  
Signature: `________________`

---

## OA.1 Authorized scope

Exactly three objects. Do not silently rename them. If PostgreSQL or repository convention would require a different name, **STOP** and request governance clarification.

| # | Object | Definition | Authorized name |
| --- | --- | --- | --- |
| 1 | Foreign key | `rfp_rfps.opportunity_id` → `opp_opportunities.id` `ON DELETE RESTRICT` | `rfp_rfps_opportunity_id_fkey` |
| 2 | Foreign key | `prg_programmes.rfp_id` → `rfp_rfps.id` `ON DELETE RESTRICT` | `prg_programmes_rfp_id_fkey` |
| 3 | Partial unique index | `UNIQUE (tenant_id, rfp_id) WHERE archived_at IS NULL` on `prg_programmes` | `prg_programmes_tenant_active_rfp` |

**Active Programme** for constraint 3 is `archived_at IS NULL`. Draft rows with `archived_at IS NULL` count as active. Archived rows (`archived_at IS NOT NULL`) remain allowed. Do not substitute `status`. Do not add a full-table unique on `(tenant_id, rfp_id)`.

**Tenant semantics:** id-only FKs (Option A). Do not introduce composite tenant FKs. Do not add parent `UNIQUE (tenant_id, id)`. The unique index remains tenant-scoped because the business invariant is per tenant.

**Nullability:** both FK columns remain `NOT NULL`. This authorization does not change nullability.

## OA.2 Target environment

| Item | Authorized value |
| --- | --- |
| Container | `serengeti-eos-gate-b-pg` |
| Bind | `127.0.0.1:5434` |
| Class | Disposable Dev/Test only |
| Data | Synthetic Dev/Test only |
| Not | UAT; Production; Production data; Production-migration rehearsal |

Do not create another database under this authorization.

## OA.3 Authorized method

- One bounded additive SQL migration file
- Positioned after migration `122`
- Exact filename/number assigned during the **CREATE** step
- Do **not** allocate or fabricate migration `123` at this authorization-recording step
- Execute the authorized file explicitly with `psql`
- Do **not** invoke application `migrate()`
- Do **not** execute unrelated migrations
- Do **not** create `schema_migrations` as part of this slice
- Unique index may use `CREATE UNIQUE INDEX IF NOT EXISTS` for the authorized name
- FKs use named `ALTER TABLE … ADD CONSTRAINT` with a `pg_constraint` pre-check

The owner does **not** authorize full `migrate()`, catalogue `001+`, unrelated files, UAT migration, or Production migration.

## OA.4 CREATE → REVIEW → EXECUTE sequence

This authorization covers the sequence as **separate controlled actions**. Each checkpoint reports and stops as required.

| Step | Action | Status after this record |
| --- | --- | --- |
| 0 | Prepare design | **COMPLETED** (Proposed Gate C Dev/Test Authorization Slice) |
| 1 | **CREATE** the bounded migration SQL for constraints 1–3 only | **COMPLETED** — see **OA.10** |
| 2 | **REVIEW** the generated SQL (three authorized objects only; no unrelated DDL) | **COMPLETED** — **PASS WITH NON-BLOCKING OBSERVATION** (see **OA.11**) |
| 3 | Satisfy execution prerequisites, then **EXECUTE** via `psql` on `serengeti-eos-gate-b-pg` | **PERFORMED** — run `20260916-021912` |
| 4 | **VERIFY** post-migration (specifically authorized evidence only) | **PERFORMED** — catalog verification **PASS** (run `20260916-021912`) |
| 5 | Record evidence and **stop** | **PERFORMED** — evidence under `docs/governance/evidence/gate-c-123-migration-execution/runs/20260916-021912/`; governance reconciliation **OA.14** |

CREATE is **OA.10**. REVIEW is **OA.11**. EXECUTE is **OA.13**. Governance reconciliation is **OA.14**. Do **not** re-run migration 123.

## OA.5 Execution prerequisites

Before EXECUTE, all of the following must be true. If any fails: **STOP** and report. Do not improvise a workaround.

1. Confirm target identity: `serengeti-eos-gate-b-pg` at `127.0.0.1:5434`.
2. Confirm disposable Dev/Test, not UAT/Production.
3. Confirm synthetic-only data.
4. Capture pre-DDL schema/constraint/index state for `rfp_rfps` and `prg_programmes`.
5. Capture pre-DDL orphan counts (`rfp_rfps.opportunity_id`, `prg_programmes.rfp_id`).
6. Capture duplicate active-programme count (`tenant_id, rfp_id` where `archived_at IS NULL`). Stop if orphans or duplicates exist.
7. Establish the authorized pre-DDL dump/backup: `pg_dump` of the disposable database to a dated evidence path **before** DDL. **Subsequent record (OA.12):** run `20260916-014121` **PASS**.
8. Recovery for this disposable instance if objects cannot simply be dropped: re-bootstrap from Authorization B 11-file SQL. Original slice text excluded a standing clone. **Subsequent separate authorization** permitted one isolated restore verification; **OA.12** records that verification **PASS**. Dump restore onto the Gate-B volume remains **not** authorized.
9. REVIEW of the generated SQL completed; confirm the file contains only the three authorized objects (plus transactional wrapping / existence pre-checks as specified).
10. `migrate()` will not be invoked.

## OA.6 Rollback boundary

Authorized rollback removes **only**:

- `rfp_rfps_opportunity_id_fkey`
- `prg_programmes_rfp_id_fkey`
- `prg_programmes_tenant_active_rfp`

Rollback must **not**: delete business rows; CASCADE-delete business rows; drop existing tables; drop unrelated indexes (including `prg_programmes_tenant_rfp`); modify application code; alter business data.

## OA.7 Explicit exclusions

This owner authorization does **not** include:

- Production migration
- Production backfill
- Production cutover
- WP-14
- Architecture F
- UAT
- Production deployment
- Additional Production indexes (backlog item 4)
- Costing/approval FKs
- Optional event catalogue rows (backlog item 6)
- `DocumentStorage` kernel work (backlog item 7)
- Unrelated SQL migrations
- Full `migrate()` execution
- Cloud/hosting changes
- Residency decisions
- RTO/RPO decisions
- HA/DR decisions
- Production backup architecture
- Production security/identity decisions

## OA.8 Remaining later gates

| Item | Status |
| --- | --- |
| Bounded slice 1–3 owner authorization | **RECORDED** (this section) |
| CREATE SQL | **COMPLETED** (`123_cd_rfp_programme_relationship_constraints.sql`) |
| REVIEW SQL | **PASS WITH NON-BLOCKING OBSERVATION** (see **OA.11**) |
| Backup/restore prerequisite | **EVIDENCE REVIEW — PASS** (see **OA.12**) |
| EXECUTE Dev/Test DDL | **PERFORMED** — run `20260916-021912`; **POST-EXECUTION VERIFICATION PASSED**; authorization **consumed** |
| VERIFY | **PERFORMED** — catalog **PASS**; governance reconciliation **OA.14** |
| UAT | **NOT AUTHORIZED** |
| Production migration / cutover / deployment | **NOT AUTHORIZED** |
| Backlog items 4–7 | **NOT AUTHORIZED** |

## OA.9 Next governed action

Gate C remains **OPEN**. Do **not** re-run migration 123. Item 4 has a **read-only** repository assessment (**OA.15**): no evidence-supported Production index is named. Item 5 has a **read-only** assessment (**OA.16**): **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**; not a Production execution authorization. Remaining items 4–7, UAT, and Production still require **separate** owner authorization. Production readiness is **not** claimed.

## OA.10 CREATE record (not executed)

CREATE checkpoint recorded from the governing conversation. This is **not** an execute record and **not** a named signature.

| Item | Value |
| --- | --- |
| Migration number | `123` (assigned at CREATE; next after `122_cd_programme_item_extensions.sql`) |
| Filename | `123_cd_rfp_programme_relationship_constraints.sql` |
| Path | `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` |
| Objects in file | `rfp_rfps_opportunity_id_fkey`; `prg_programmes_rfp_id_fkey`; `prg_programmes_tenant_active_rfp` |
| Executed | **YES** — run `20260916-021912` |
| Gate C complete | **NO** — Gate C overall **OPEN**; slice 1–3 Dev/Test complete; remainder / UAT / Production not authorized |

## OA.11 REVIEW record (not executed)

REVIEW of the actual file `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` against owner authorization and repository schema/history. **Named reviewer identity, signature, and handwritten date are not invented.**

**Verdict:** `REVIEW PASS WITH NON-BLOCKING OBSERVATION`

The SQL conforms to the authorized three objects and schema types. At REVIEW time it had **not** been executed. Subsequent execute is **OA.13**. Gate C overall remains **OPEN**.

| Constraint | Authorized | SQL matches | Verdict |
| --- | --- | --- | --- |
| RFP → Opportunity FK | Yes | Yes | PASS |
| Programme → RFP FK | Yes | Yes | PASS |
| Active Programme unique index | Yes | Yes | PASS |

**Schema compatibility (repository SQL, not live DDL):** `opp_opportunities.id` UUID PK (`015`); `rfp_rfps.id` UUID PK, `opportunity_id` UUID NOT NULL, no existing opportunity FK (`016`); `prg_programmes.id` UUID PK, `rfp_id` / `tenant_id` UUID NOT NULL, `archived_at` TIMESTAMPTZ nullable (`017`); `122` adds notes columns only. `packages/db/schema.sql` does not define these tables. No later migration except `123` alters these FKs/indexes. Authorized object names do not appear in `015`–`122`. Existing index `prg_programmes_tenant_rfp` is non-unique and is not dropped.

**Scope:** file contains only the two FKs and one partial unique index. No `CREATE`/`DROP TABLE`, `DROP INDEX`, DML, `schema_migrations` manipulation, costing/approval FKs, or `status` predicate. Comments are comments only.

**Numbering:** only one `123_` file; ordered after `122` by catalogue sort.

**Transaction:** catalogue files do not wrap `BEGIN`/`COMMIT`. `migrate()` in `packages/db/src/index.ts` wraps **each file** in `BEGIN`/`COMMIT` and records `schema_migrations`. Authorized execute is **explicit `psql` of this file**, which does **not** use that wrapper. Observation: EXECUTE must apply the three statements in one transaction (already an execute control). This review does **not** claim transactional behavior has been tested.

**FK idempotency:** `ADD CONSTRAINT` with no `pg_constraint` pre-check. Catalogue has no FK pre-check pattern; `migrate()` expects run-once via `schema_migrations`. Custom `DO $$` would be a new framework. Acceptable for a single authorized `psql` run; a second `psql` of the same file would fail if constraints already exist. Pre-check was **not** added during REVIEW.

**Unique-index idempotency:** `CREATE UNIQUE INDEX IF NOT EXISTS` matches catalogue (e.g. `049`). `IF NOT EXISTS` keys on **name**, not definition. No object named `prg_programmes_tenant_active_rfp` exists in `015`–`122`, so skip-by-name would not conceal a different existing index in repository history.

**Application:** `createRfp` requires opportunity (`invalid_opportunity`); `createProgramme` requires RFP (`invalid_rfp`) and rejects a second non-archived programme (`programme_exists_for_rfp`); `getProgrammeByRfpId` uses `archived_at IS NULL`. Database uniqueness would strengthen concurrent-write integrity; **not** migration-tested. FKs are id-only as authorized; unique index is tenant-scoped.

**Data safety:** Gate B disposable instance previously recorded 0 business rows and 0 orphans/duplicates. File contains no backfill. Production/UAT/non-empty compatibility, Production lock/duration, and dump restore are **not** established.

**Backup/restore prerequisite remains an execution prerequisite.** At REVIEW time it had not been evidenced. Subsequent run `20260916-014121` is recorded in **OA.12** as **EVIDENCE REVIEW — PASS**. That does **not** execute migration 123.

**Observations (non-blocking):** (1) EXECUTE via `psql` must wrap the file in a transaction; the file itself follows catalogue convention and has no `BEGIN`/`COMMIT`. (2) FK statements are not idempotent; treat EXECUTE as a single run. (3) Do not invoke `migrate()` (would apply the remaining catalogue).

## OA.12 Backup/restore evidence review (not an execute grant)

Governance reconciliation of authorized run `20260916-014121`. **Named operator identity, signature, title, and handwritten date are not invented.**

**Verdict:** `BACKUP/RESTORE EVIDENCE REVIEW — PASS`

**Prerequisite status:** `COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW`

This record does **not** by itself approve migration 123. Subsequent bounded execute completed as run `20260916-021912` and is reconciled as **EXECUTED / POST-EXECUTION VERIFICATION PASSED**. Authorization is **consumed**.

| # | Finding | Record |
| --- | --- | --- |
| 1 | Backup/restore authorization was granted before execution | **YES** — [`adr-0006-gate-c-migration-123-backup-restore-authorization.md`](adr-0006-gate-c-migration-123-backup-restore-authorization.md) owner APPROVE |
| 2 | Authorized procedure executed within scope | **YES** — [`adr-0006-gate-c-migration-123-backup-restore-procedure.md`](adr-0006-gate-c-migration-123-backup-restore-procedure.md) |
| 3 | Backup succeeded | **YES** — `pg_dump` EXIT 0 |
| 4 | Backup validation succeeded | **YES** — `pg_restore --list` EXIT 0; artifact 159176 bytes |
| 5 | Isolated restore succeeded | **YES** — `pg_restore` EXIT 0 on `serengeti-eos-gate-c-123-restore-pg` / `127.0.0.1:5435` |
| 6 | Restore validation succeeded | **YES** — reachable PostgreSQL 16.15; EOS tables present; counts matched source |
| 7 | Migration-123 objects absent from pre-DDL restored state | **YES** |
| 8 | Restore target removed | **YES** (container and volume) |
| 9 | Backup evidence preserved | **YES** — `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/` |
| 10 | Gate-B source remained intact | **YES** — `serengeti-eos-gate-b-pg` running on `serengeti-eos-gate-b-pgdata` |
| 11 | UAT and Production untouched | **YES** |
| 12 | Migration 123 was NOT executed | **YES** |
| 13 | Operator identity remains REQUIRES HUMAN | **YES** |

| Evidence item | Value |
| --- | --- |
| Artifact | `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/backups/gatec-123.dump` |
| SHA-256 | `9C401242B354D81497C1879302615AF3D59CB556C9B3D32F0C3D8CBAC010599D` |
| Database / user (inspected) | `eos_gateb` / `eos_gateb` |
| Counts matched | opp/rfp/prg **0**; tenants **2**; principals **6**; audit_events **93** |

**Next governed action:** remaining Gate C work requires separate authorization (see OA.9 / OA.14). Do **not** execute from this record.

## OA.13 Execute record (bounded Dev/Test only)

Execute of `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` against disposable `serengeti-eos-gate-b-pg`. **Named operator identity, signature, and handwritten date are not invented.**

**Verdict:** `EXECUTED / POST-EXECUTION VERIFICATION PASSED`

| Item | Record |
| --- | --- |
| Run ID | `20260916-021912` |
| Evidence | `docs/governance/evidence/gate-c-123-migration-execution/runs/20260916-021912/` |
| Method | direct `psql`; one transaction; `migrate()` **not** invoked |
| `schema_migrations` | **not created**; **not written** |
| Objects | `rfp_rfps_opportunity_id_fkey`; `prg_programmes_rfp_id_fkey`; `prg_programmes_tenant_active_rfp` — catalog **PASS** (`ON DELETE RESTRICT`; unique `(tenant_id, rfp_id)` where `archived_at IS NULL`) |
| `prg_programmes_tenant_rfp` | **remains** |
| Counts | unchanged vs baseline |
| UAT / Production | **not touched** |
| Gate C remainder | **NOT AUTHORIZED** |
| Operator identity | **REQUIRES HUMAN** |

Do **not** re-run migration 123. Do **not** claim UAT or Production readiness.

## OA.14 Governance reconciliation (run `20260916-021912`)

Governance-only reconciliation of the already-executed bounded Dev/Test migration. **No database operation. No re-execute. Named operator identity not invented.**

**Migration 123:** `EXECUTED / POST-EXECUTION VERIFICATION PASSED`  
**Execute authorization:** **CONSUMED**  
**Bounded Dev/Test slice 1–3:** **COMPLETE** on `serengeti-eos-gate-b-pg`  
**Gate C overall:** `OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION`  
**UAT:** **NOT AUTHORIZED**  
**Production:** **NOT AUTHORIZED**

Evidence preserved (not rewritten): `docs/governance/evidence/gate-c-123-migration-execution/runs/20260916-021912/` (started_utc from evidence: `2026-09-15T23:19:12.7942861Z`). Operator identity: **REQUIRES HUMAN**.

Remaining Gate C items requiring **future separate owner authorization**:

| Item | Status |
| --- | --- |
| 4. Additional Production query-plan indexes | **OPEN** — assessed (**OA.15**); no category-C index; not authorized |
| 5. Production migration / backfill / cutover | **OPEN** — assessed (**OA.16**); blocked by unresolved Production architecture; not authorized |
| 6. Optional event catalogue rows | **OPEN** — not authorized |
| 7. Kernel `DocumentStorage.delete` | **OPEN** — not Gate C DDL; not authorized |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |
| `migrate()` / `schema_migrations` / other migrations | **NOT AUTHORIZED** |

This reconciliation does **not** authorize any subsequent migration, UAT, Production, deployment, or Git operation.

## OA.15 Item 4 read-only query-plan index assessment

Governance-only. **No database contact. No DDL. No new migration. No owner authorization of Production indexes.**

Assessment file: [`adr-0006-gate-c-item-4-production-query-plan-index-readiness.md`](adr-0006-gate-c-item-4-production-query-plan-index-readiness.md)

| Finding | Record |
| --- | --- |
| Category C (evidence-supported Production index) | **None** |
| Existing support (A) | PK/unique/partial indexes plus 123 `prg_programmes_tenant_active_rfp` cover coded commercial get/list lookups |
| Potential candidates (B) | tenant+`updated_at` list sorts; optional `organization_id` / cost-sheet `rfp_id` / `prg_items.programme_id`; audit `resource_id`; outbox tenant/aggregate; approval tenant+status; document `created_at` |
| Unspecified backlog wording (D) | cannot be a named migration |
| `prg_programmes_tenant_rfp` / `prg_programmes_tenant_active_rfp` | both remain; neither dropped or altered |
| Item 4 | **OPEN** — requires additional Production (or separately authorized lab plan) evidence before any index can be classified C |
| Presentable as a bounded index migration now | **NO** |
| UAT / Production | **NOT AUTHORIZED** |

**Next governed action:** do **not** authorize Production indexes from OA.15. Remaining Gate C work (item 4 pending evidence; items 5–7; UAT; Production) still requires separate authorization.

## OA.16 Item 5 read-only Production migration / backfill / cutover assessment

Governance-only. **No database contact. No DDL. No `migrate()`. No new migration. No owner authorization of Production, UAT, or WP-14.**

Assessment file: [`adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md`](adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md)

| Finding | Record |
| --- | --- |
| Classification | **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE** |
| Category C required backfill | **None** |
| Cutover procedure | **Not yet defined** (architecture §15 is a sketch; GB-15 runbook not found) |
| Runner | `migrate()` applies `schema.sql` + all catalogue files per file-transaction; **auto-invoked** from `apps/api/src/main.ts` when `EOS_DATABASE_URL` is set — **not** suitable as silent Production execute |
| Migration 123 Production data compatibility | **Unknown** — Production not inspected |
| Production backup product (ADR-0011) | **TBD** — Gate-B disposable backup is **not** Production evidence |
| E1 / hosting / Auth F / WP-14 | **Unresolved / not authorized** |
| Item 5 | **OPEN** — not presentable as Production execution authorization |
| UAT / Production | **NOT AUTHORIZED** |

**Next governed action:** do **not** authorize Production migration, backfill, or cutover from OA.16. Remaining Gate C work still requires separate authorization after Production architecture prerequisites.

