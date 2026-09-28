# ADR-0006 DTV-001 — Dev/Test PostgreSQL schema source for Gate B verification

> **`DTV-001 — DECISION FOR GOVERNED REVIEW`**  
> **`ORIGINAL RUNTIME VERIFICATION STATUS AT DECISION TIME: BLOCKED`** (no acceptable existing schema source identified)  
> **`SUCCESSOR: disposable bootstrap EXECUTED; Gate B verification CLOSED / ACCEPTED — see Gate B authorization package §19`**  
> **`GATE C — NOT AUTHORIZED`**  
> **`UAT / PRODUCTION — NOT AUTHORIZED`**

This file records the schema-source decision required before Gate B PostgreSQL runtime verification may proceed. Named personal signature, legal authority title, and handwritten date are **not invented**.

**Recorded from the governing conversation dated 2026-09-15.** Status below is a **decision record**, not a silent grant of bootstrap, UAT, or Production work.

---

## 1. Decision required

Gate B persistence implementation is complete. The PostgreSQL verification harness is migration-free.

Runtime verification cannot proceed because no reachable Dev/Test PostgreSQL instance is available to the verification environment.

The required decision is:

> **Where will the already-existing Gate B-compatible Dev/Test PostgreSQL schema come from without executing migrations as part of Gate B verification?**

This decision establishes the prerequisite for runtime verification without converting a test exercise into a schema-migration exercise.

---

## 2. Governing principle

Gate B and Gate C remain separate.

| Gate | Responsibility |
| --- | --- |
| **Gate B** | Implement PostgreSQL-backed persistence; prove application behaviour against an **existing compatible schema** (transactionality, process/store persistence, optimistic concurrency, document metadata/compensation, fail-closed). |
| **Gate C** | Schema changes, new FKs, unique constraints, indexes, additive migrations, **migration execution**, backfill, cutover, Production migration artifacts. |

Therefore:

> **Gate B verification must consume an existing schema. It must not create or modify that schema.**

---

## 3. Decision DTV-001

For Gate B runtime verification, the PostgreSQL database MUST be:

1. Dev/Test only;
2. already provisioned;
3. already reachable from the verification environment;
4. already populated with the schema required by the current Gate B implementation;
5. safe for synthetic verification data;
6. outside UAT and Production;
7. configured through `EOS_DATABASE_URL`;
8. used without executing `migrate()`.

The Gate B verification harness MUST NOT:

- create the schema;
- alter the schema;
- execute migration files;
- create or modify `schema_migrations`;
- apply pending migrations;
- repair missing tables;
- modify constraints;
- modify indexes.

---

## 4. Where the schema may come from

| Option | Source | Decision |
| --- | --- | --- |
| **A** | Existing dedicated Dev/Test database, already compatible, separate from UAT/Production/live customer data | **PREFERRED** |
| **B** | Existing approved Dev/Test snapshot/clone/backup restored **without** the application migration runner; source must be known non-UAT/non-Production | **ACCEPTABLE IF SUCH A SNAPSHOT EXISTS** |
| **C** | Blank PostgreSQL + run existing migrations (`migrate()`) | **REJECTED FOR CURRENT GATE B VERIFICATION** |
| **D** | Copy or start UAT volume `serengeti-eos-uat-pgdata` / container `serengeti-eos-uat-postgres` | **REJECTED** |

Option C is rejected because it would convert “verify Gate B against an existing schema” into “create/upgrade a schema and then verify Gate B.”

Option D is rejected because it would introduce UAT into Gate B Dev/Test verification.

---

## 5. Investigation of available sources (this environment)

Performed as a **read-only** locator. Credentials were not printed. `migrate()` was not executed. The UAT volume was not started or queried.

| Priority | Source | Finding |
| --- | --- | --- |
| 1 | Existing dedicated Dev/Test PostgreSQL | **NOT AVAILABLE.** `EOS_DATABASE_URL` unset (process/user/machine). No listener on `127.0.0.1:5432` / `5433` / lab ports. No running Postgres container. No `eos_pg` volume. |
| 2 | Existing approved Dev/Test snapshot/clone | **NOT IDENTIFIED as Gate B-compatible.** Stage 4B laboratory dumps (`docs/governance/evidence/e2-lab/.../lab01.dump`) and `e2-lab/schema.sql` contain synthetic **`lab_*`** tables (`lab_markers`, `lab_rfp`, `lab_programme`, `lab_outbox`), **not** EOS Gate B tables. Lab containers/volumes were removed after run `20260915-183034`. |
| 3 | Existing approved Dev/Test schema backup of EOS tables | **NOT IDENTIFIED.** |
| 4 | Blank PostgreSQL + migrations | **NOT ALLOWED** (Option C). |
| 5 | UAT PostgreSQL/volume | **EXISTS but NOT ALLOWED.** Stopped container `serengeti-eos-uat-postgres` and volume `serengeti-eos-uat-pgdata` were **not** used. |
| 6 | Production PostgreSQL | **NOT IDENTIFIED and NOT ALLOWED.** |

**Critical finding:** there is currently **no legitimate source** from which to obtain an already-existing Gate B-compatible Dev/Test schema in this environment.

Correct action: **do not run `migrate()`**. Gate B remains **OPEN**. A separate **Dev/Test Schema Bootstrap Authorization** is required if schema is to be established for testing. That authorization is **not granted** by this file.

See: [`adr-0006-devtest-schema-bootstrap-authorization.md`](adr-0006-devtest-schema-bootstrap-authorization.md) (**PENDING / NOT AUTHORIZED**).

---

## 6. Allowed vs not allowed flows

**Allowed for Gate B verification:**

```text
Existing Dev/Test PostgreSQL
        ↓
Existing compatible schema
        ↓
EOS_DATABASE_URL
        ↓
Migration-free Gate B tests
        ↓
Evidence
```

**Not allowed under current Gate B authorization:**

```text
Blank PostgreSQL
        ↓
migrate()
        ↓
Create schema
        ↓
Gate B tests
```

---

## 7. Required schema compatibility (read-only)

Before tests execute, the harness must confirm these objects exist and must **not** create them:

`tenants`, `principals`, `opp_opportunities`, `opp_stage_history`, `rfp_rfps`, `rfp_versions`, `prg_programmes`, `prg_days`, `prg_items`, `prg_programme_versions`, `cost_sheets`, `cost_line_items`, `cost_sheet_versions`, `com_approval_requests`, `commercial_documents`, `audit_events`, `outbox_events`.

If any are missing: **STOP**. Do not run migrations.

---

## 8. Dev/Test database requirements (if/when a source is supplied)

- Environment: Dev/Test only; not UAT; not Production; isolated from live customer data.
- Data: synthetic only; no live RFPs, programmes, or commercial documents.
- Connectivity: reachable from the verification environment via `EOS_DATABASE_URL`; credentials not committed; credentials not printed in reports.
- Safety: preferably disposable/dedicated because `audit_events` is insert-only and synthetic audit rows may remain.

---

## 9. Outcome

**Gate B runtime verification is BLOCKED pending identification of an acceptable existing Dev/Test schema source, or a separate bootstrap authorization.**

No schema is to be created as part of Gate B verification.

- If Option A, B, or an equivalent pre-existing schema source is found: proceed to Gate B PostgreSQL Runtime Verification using the existing migration-free harness.
- If none exists: do not improvise. Review the separate bootstrap authorization package. Do not treat this file as that grant.

---

## 10. Gate C boundary

Nothing in DTV-001 authorizes Gate C, Production/UAT migrations, Production backfill/cutover, FK/unique/index creation for Production, hosting selection, or deployment.

**Gate C remains NOT AUTHORIZED.**

---

## 11. Current governance status

Status **at DTV-001 decision time** (not erased):

| Item | Status at DTV-001 |
| --- | --- |
| Gate B implementation | COMPLETE |
| Gate B verification harness | MIGRATION-FREE |
| Dev/Test PostgreSQL | NOT AVAILABLE |
| Existing compatible schema | NOT IDENTIFIED |
| Gate B runtime verification | BLOCKED |
| Gate B closure | OPEN |
| Dev/Test schema bootstrap | NOT AUTHORIZED (separate package pending review) |
| Gate C | NOT AUTHORIZED |
| UAT | NOT AUTHORIZED |
| Production | NOT AUTHORIZED |

**Successor (factual, 2026-09-15/16):** Authorization B bootstrap **EXECUTED** (`adr-0006-devtest-schema-bootstrap-authorization.md` §12.2). Authorization C verification **EXECUTED** (initial PARTIAL, then harness remediation, then PASS). Gate B **CLOSED / VERIFICATION ACCEPTED** in [`adr-0006-gate-b-dev-test-implementation-authorization.md`](adr-0006-gate-b-dev-test-implementation-authorization.md) §19. Gate C / UAT / Production remain **NOT AUTHORIZED**. DTV-001’s governing principle (verification must not call `migrate()`; must not use UAT/Production) remains in force.

---

## 12. Final decision statement

> **Gate B PostgreSQL runtime verification shall use only an already-provisioned Dev/Test PostgreSQL database whose compatible schema already exists. The verification harness shall not execute `migrate()`, create or alter schema, use UAT (`serengeti-eos-uat-pgdata` / `serengeti-eos-uat-postgres`), or use Production. If no such source exists, Gate B runtime verification remains BLOCKED and a separate Dev/Test Schema Bootstrap Authorization is required. That bootstrap is not granted here. Gate C remains NOT AUTHORIZED.**

---

## 13. Attestation (stakeholder only — left blank)

| Field | Value |
| --- | --- |
| Name | |
| Role / authority | |
| Date | |
| Signature | |
