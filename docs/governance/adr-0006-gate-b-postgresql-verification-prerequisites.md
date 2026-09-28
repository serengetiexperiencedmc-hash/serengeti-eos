# ADR-0006 Gate B PostgreSQL verification prerequisites

> **`GATE B — RUNTIME VERIFICATION: CLOSED / VERIFICATION ACCEPTED`** (see chronological record below)  
> **`AUTHORITATIVE CLOSURE: adr-0006-gate-b-dev-test-implementation-authorization.md §19`**  
> **`GATE C — NOT AUTHORIZED`**  
> **`UAT / PRODUCTION — NOT AUTHORIZED`**

This note originally recorded **test-harness preparation** while runtime verification was blocked (DTV-001). It does not invent human signatures. Technical verification acceptance is recorded here factually; named stakeholder attestation remains blank on the authorization package.

---

## Status

| Item | Status |
| --- | --- |
| Gate A design approval | APPROVED (separate record) |
| Gate B Dev/Test implementation | **CLOSED / VERIFICATION ACCEPTED** |
| Gate B PostgreSQL runtime verification | **CLOSED / VERIFICATION ACCEPTED** (2026-09-15 re-run after harness remediation) |
| Gate B verification harness | Migration-free; remediations applied; suite passed |
| Gate C migration | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |

---

## Chronological verification record

This file previously stated runtime verification was **BLOCKED** (no acceptable existing schema source). That was true at harness-preparation time. History is not erased.

1. **Harness preparation:** migration-free suite; `EOS_RUN_PG_TESTS=1` does not mean `migrate()`.  
2. **DTV-001:** no Option A/B schema source; UAT rejected; unbounded `migrate()` rejected.  
3. **Authorization B bootstrap:** dedicated `serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata` on `127.0.0.1:5434` (PostgreSQL 16.15); 11 bounded SQL files; `schema_migrations` not created.  
4. **Initial Authorization C run:** **FAILED/PARTIAL** — harness defects (approval assertion; Carol email vs id lookup; outbox `uuid[]` vs `text`). Application schema not implicated.  
5. **Harness remediation:** test files only.  
6. **Re-verification:** typecheck PASS; safety 3/3; fail-closed 2/2; persistence integration 11/11; no skips in those files; `pg.integration.test.ts` not run.

Authoritative Gate B closure, §16 mapping, limitations, residual data, and Gate C boundary: [`adr-0006-gate-b-dev-test-implementation-authorization.md`](adr-0006-gate-b-dev-test-implementation-authorization.md) §19.

---

## What this harness means

`EOS_RUN_PG_TESTS=1` means:

> Run Gate B PostgreSQL verification against the **already-provisioned** Dev/Test database identified by `EOS_DATABASE_URL`.

It does **not** mean:

> Run migrations first.

The verification suite treats schema as an **external prerequisite**. Missing schema is a **prerequisite failure**. The harness will not create tables, will not apply pending SQL files, will not create or modify `schema_migrations`, and will not call `migrate()`.

---

## Prerequisites (must all be true before enabling the suite)

1. An isolated **Dev/Test** PostgreSQL instance is already running.  
2. `EOS_DATABASE_URL` points at that instance (no Production, no UAT, no `serengeti-eos-uat-pgdata`).  
3. Required Gate B tables already exist (read-only check):  
   `tenants`, `principals`, `opp_opportunities`, `opp_stage_history`, `rfp_rfps`, `rfp_versions`, `prg_programmes`, `prg_days`, `prg_items`, `prg_programme_versions`, `cost_sheets`, `cost_line_items`, `cost_sheet_versions`, `com_approval_requests`, `commercial_documents`, `audit_events`, `outbox_events`.  
4. `EOS_RUN_PG_TESTS=1` is set only for that run.

If `EOS_RUN_PG_TESTS=1` is set and `EOS_DATABASE_URL` is missing, the Gate B verification gate **fails** (it does not skip silently).

If the database is unreachable, the suite fails with a prerequisite error.

If required tables are missing, the suite fails with a prerequisite error. It does **not** repair schema.

---

## Migration boundary

- Migration **execution** remains outside Gate B.  
- Migration **creation/modification** remains Gate C and is **not authorized**.  
- `apps/api/src/main.ts` still contains a pre-existing `migrate()` path for normal API startup. **Do not start `main.ts` as the Gate B verification runner.**  
- Existing I1/I3/I4/CRM PostgreSQL tests still call `migrate()`. They are **not** part of the Gate B verification suite and must not be enabled for this Gate B run.

---

## Synthetic data

Verification uses identifiers prefixed `GBV-` / `*-GBV-*`. It must not use live customer, UAT, or Production data.

Business rows created by the run are deleted by tracked id. `audit_events` is insert-only, so synthetic audit rows are **not** deleted.

**Residual synthetic Dev/Test data remains in the disposable Gate-B database and requires separate cleanup/disposal when the verification environment is retired.** Recorded counts after the successful re-verification: tenants 2; principals 6; this-run business rows cleaned; audit 93 (insert-only, including prior runs); outbox 27 leftover from the earlier failed run.

---

## Gate C backlog (historical at Gate B closure)

At Gate B closure the three relationship constraints remained **ABSENT**. Gate B closure did **not** authorize creating them.

Subsequent bounded Gate C Dev/Test execute (migration 123, run `20260916-021912`) applied items 1–3 on disposable `serengeti-eos-gate-b-pg` only. That execute is reconciled as **EXECUTED / POST-EXECUTION VERIFICATION PASSED**. Gate C overall remains **OPEN**. Items 4–7, UAT, and Production remain **NOT AUTHORIZED**.

1. RFP → Opportunity FK — **COMPLETE** on disposable Gate-B Dev/Test only  
2. Programme → RFP FK — **COMPLETE** on disposable Gate-B Dev/Test only  
3. Unique active Programme-per-RFP — **COMPLETE** on disposable Gate-B Dev/Test only  
4. Additive indexes / schema changes if required — **OPEN**  
5. Production migration / backfill / cutover artifacts — **OPEN**  
6. Optional event catalogue rows — **OPEN**  
7. Optional kernel `DocumentStorage.delete` — **OPEN** (not Gate C DDL)

---

## Next governed action

Gate B verification is **CLOSED / VERIFICATION ACCEPTED**. This file does **not** authorize UAT, Production, disposal of the disposable instance, or unbounded `migrate()`.

Owner authorization for the **bounded Gate C Dev/Test slice (constraints 1–3 only)** is recorded in [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md). Bounded execute: **YES** (run `20260916-021912`) — **EXECUTED / POST-EXECUTION VERIFICATION PASSED**; authorization **consumed**. **GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION**. UAT / Production remain **not authorized**.
