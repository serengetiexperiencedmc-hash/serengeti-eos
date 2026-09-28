# ADR-0006 Gate C — Migration 123 bounded execution owner-authorization record

> **`MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED`**  
> **`BOUNDED EXECUTE AUTHORIZATION CONSUMED`**  
> **`GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION`**  
> **`NOT UAT / NOT PRODUCTION`**  
> Named personal signature, legal authority title, handwritten date, operator identity, and execution timestamps are **not** invented.

This file **records** owner authorization, the bounded execute of migration **123** (run `20260916-021912`), and governance reconciliation of that run. The execute authorization is **consumed**. Gate C overall remains **OPEN**.

**UAT AND PRODUCTION REMAIN NOT AUTHORIZED.**  
**PRODUCTION READINESS IS NOT CLAIMED.**

Governance recording note: **Named personal signature, legal authority title, handwritten date, and operator identity are not invented.** Blank attestation fields remain for the stakeholder.

| Document | Role |
| --- | --- |
| [`adr-0006-gate-c-migration-123-execution-checkpoint.md`](adr-0006-gate-c-migration-123-execution-checkpoint.md) | Execution checkpoint (prepared). Authoritative owner decision is **this** file |
| [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md) | Bounded slice 1–3; CREATE **OA.10**; REVIEW **OA.11**; backup/restore **OA.12 PASS** |
| [`adr-0006-gate-c-migration-123-backup-restore-authorization.md`](adr-0006-gate-c-migration-123-backup-restore-authorization.md) | Backup/restore prerequisite — **EVIDENCE REVIEW PASS**; does **not** by itself authorize 123 |
| `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` | Exact reviewed file — **EXECUTED** on disposable Gate-B (run `20260916-021912`) |

---

## 1. STATUS

**MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED**

**GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION**

| State | When |
| --- | --- |
| REVIEWED — NOT EXECUTED — NOT AUTHORIZED | Historical |
| MIGRATION 123 — AWAITING OWNER AUTHORIZATION | Historical |
| MIGRATION 123 — OWNER AUTHORIZED / AWAITING EXECUTION | Historical (§12 APPROVE recorded) |
| MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED / AWAITING GOVERNANCE RECONCILIATION | Historical (run `20260916-021912` completed; before this reconciliation) |
| **MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED** | **Now** (governance reconciliation of run `20260916-021912`) |
| Execute authorization | **CONSUMED** — do **not** re-run migration 123 |
| GATE C SLICE 1–3 (Dev/Test objects) | **COMPLETE** on disposable Gate-B |
| Gate C overall | **OPEN** |

Migration 123 **was executed** against disposable Gate-B only. UAT/Production were **not** used. Remaining Gate C work (backlog items 4–7, UAT, Production) requires **separate** owner authorization.

---

## 2. Review basis

| Fact | Record |
| --- | --- |
| REVIEW verdict | **REVIEW PASS WITH NON-BLOCKING OBSERVATION** (backlog **OA.11**) |
| File | `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` |
| Migration number | `123` (only one `123_` file in `packages/db/migrations/`) |
| Executed | **YES** — run `20260916-021912`; evidence `docs/governance/evidence/gate-c-123-migration-execution/runs/20260916-021912/` |
| Backup/restore prerequisite | **BACKUP/RESTORE EVIDENCE REVIEW — PASS** (run `20260916-014121`) |

Non-blocking REVIEW observations that execute must honor (do **not** edit the migration file unless separately authorized):

1. Direct `psql` does not inherit `migrate()`’s per-file `BEGIN`/`COMMIT`. Wrap the three statements in **one** transaction at execute time.
2. FK `ADD CONSTRAINT` is not idempotent. Treat execute as a **single run**.
3. Do **not** invoke `migrate()`.

---

## 3. Authorized scope (OWNER APPROVE recorded)

Owner approval of this file authorizes **ONLY**:

| | Item |
| --- | --- |
| A | The three reviewed objects in migration 123 (semantics in §4) |
| B | Disposable Gate-B Dev/Test PostgreSQL only (identity in §5) |
| C | The exact reviewed file `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` |
| D | Direct `psql` of **that file only**, using the bounded method in §7 |
| E | Execution-time pre-checks in §9 |
| F | Post-execution catalog verification in §10 |
| G | Rollback / **STOP** on failure (§11) |

It does **not** authorize any item in §13. This recording does **not** execute.

---

## 4. Authorized objects and semantics

The reviewed file contains **exactly** these three objects. Execute must not add others.

### Object 1 — `rfp_rfps_opportunity_id_fkey`

- `rfp_rfps.opportunity_id` → `opp_opportunities.id`
- id-only FK
- `ON DELETE RESTRICT`
- no CASCADE
- no SET NULL
- no `ON UPDATE` clause

### Object 2 — `prg_programmes_rfp_id_fkey`

- `prg_programmes.rfp_id` → `rfp_rfps.id`
- id-only FK
- `ON DELETE RESTRICT`
- no CASCADE
- no SET NULL
- no `ON UPDATE` clause

### Object 3 — `prg_programmes_tenant_active_rfp`

- Unique on `(tenant_id, rfp_id)`
- Predicate: `WHERE archived_at IS NULL`
- Active Programme = `archived_at IS NULL`
- Tenant-scoped
- No `status` predicate
- No full-table uniqueness
- Existing non-unique index `prg_programmes_tenant_rfp` **remains**
- That existing index is **not** to be dropped

---

## 5. Authorized target

Proposed execute target **only**:

| Item | Recorded identity (inspected at backup/restore run `20260916-014121`) |
| --- | --- |
| Container | `serengeti-eos-gate-b-pg` |
| Host bind | `127.0.0.1:5434` |
| Volume | `serengeti-eos-gate-b-pgdata` |
| Database | `eos_gateb` |
| User | `eos_gateb` |
| PostgreSQL | 16.15 |
| Environment | disposable Dev/Test |
| UAT | **not** authorized (`serengeti-eos-uat-postgres` / `5433` forbidden) |
| Production | **not** authorized |

These values were inspected during backup/restore. **At actual migration execution time, source identity must still be confirmed before DDL.** If identity differs from this table: **STOP**.

Do not restore onto the Gate-B volume as part of execute. Do not retarget another container, port, or database.

---

## 6. Backup/restore prerequisite (complete; not this authorization)

Evidence review verdict: **BACKUP/RESTORE EVIDENCE REVIEW — PASS**

| Item | Record |
| --- | --- |
| Run ID | `20260916-014121` |
| Evidence directory | `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/` |
| Artifact | `backups/gatec-123.dump` |
| Size | 159176 bytes |
| SHA-256 | `9C401242B354D81497C1879302615AF3D59CB556C9B3D32F0C3D8CBAC010599D` |
| `pg_dump` | EXIT 0 |
| `pg_restore --list` | EXIT 0 |
| Isolated restore | `serengeti-eos-gate-c-123-restore-pg` / `127.0.0.1:5435` — EXIT 0 — **PASS** |
| Migration-123 objects in restored pre-DDL state | **ABSENT** |
| Restore target | **removed** |
| Backup | **preserved** |
| Gate-B source | **intact** |
| UAT / Production | **not touched** |

The completed prerequisite **does not** itself authorize migration 123.

Before DDL, execute must still confirm this evidence directory and artifact remain locatable. If they cannot be located: **STOP**.

---

## 7. Execution method (authorized; not executed by this recording)

- Exact reviewed migration file only.
- Direct `psql` against `serengeti-eos-gate-b-pg` (`127.0.0.1:5434`) / database `eos_gateb` only.
- **ONLY** migration 123.
- Do **not** run `migrate()` (`packages/db/src/index.ts` creates `schema_migrations` if missing, then applies `schema.sql` and **all** catalogue files).
- Do **not** automatically apply the migration catalogue.
- Do **not** execute migrations `001`–`122` or `124+`.
- Do **not** execute unrelated SQL.

Atomic transaction (execution wrapper; **do not** edit migration 123 to add `BEGIN`/`COMMIT` unless separately authorized):

1. Begin transaction.
2. Execute the three reviewed statements from the file.
3. If all succeed: commit.
4. If any statement fails: rollback. Do **not** continue.

Single-run: FK `ADD CONSTRAINT` is not idempotent.

---

## 8. `schema_migrations` treatment

This authorization does **not** invent a new migration-ledger convention.

Repository facts:

- Bounded slice owner authorization (**OA.3**) already states: do **not** create `schema_migrations` as part of this slice.
- Gate B bootstrap of the disposable instance did **not** create `schema_migrations`.
- The reviewed file comments that it does **not** create `schema_migrations`.
- Direct `psql` of the reviewed file does **not** write a ledger.
- `migrate()` **would** `CREATE TABLE IF NOT EXISTS schema_migrations` and `INSERT` a row for every unapplied catalogue file, including `schema.sql` and `001+`. That path is **forbidden**.

**Treatment authorized here:** do **not** create `schema_migrations`; do **not** `INSERT` into `schema_migrations`; do **not** invoke `migrate()`.

If execute-time inspection finds `schema_migrations` present, or if the procedure cannot safely confirm the correct treatment without inventing a ledger write: **STOP** before DDL and escalate for governance clarification. Do not improvise.

---

## 9. Pre-execution checks (execution-time; do not perform now)

Before any DDL, require verification of:

1. Source container identity is `serengeti-eos-gate-b-pg`.
2. Database identity is `eos_gateb` (inspect; do not infer).
3. PostgreSQL version (re-confirm; historically 16.15).
4. Environment is disposable Dev/Test.
5. UAT is not targeted.
6. Production is not targeted.
7. Gate-B source is the intended source (`127.0.0.1:5434` / volume `serengeti-eos-gate-b-pgdata`).
8. Backup evidence exists at the recorded path and passed review.
9. Data preconditions:
   - zero orphan RFP opportunity references (`rfp_rfps.opportunity_id` with no matching `opp_opportunities.id`)
   - zero orphan Programme RFP references (`prg_programmes.rfp_id` with no matching `rfp_rfps.id`)
   - zero duplicate active Programme groups (`tenant_id, rfp_id` where `archived_at IS NULL`, `HAVING count(*) > 1`)
   - active = `archived_at IS NULL` (do not use `status`)
10. The on-disk file is still the reviewed migration 123 (no silent edit; no second `123_` file).

Do **not** run these checks as part of this authorization-recording task. They remain mandatory immediately before a later execute instruction.

---

## 10. Post-execution verification (after a later authorized execute; do not perform now)

Catalog-level proof required:

**A.** `rfp_rfps_opportunity_id_fkey` exists and references `rfp_rfps.opportunity_id` → `opp_opportunities.id` with `ON DELETE RESTRICT`.

**B.** `prg_programmes_rfp_id_fkey` exists and references `prg_programmes.rfp_id` → `rfp_rfps.id` with `ON DELETE RESTRICT`.

**C.** `prg_programmes_tenant_active_rfp` exists and is unique on `tenant_id, rfp_id` with predicate `archived_at IS NULL`.

Also verify:

- existing `prg_programmes_tenant_rfp` remains
- no unexpected schema objects changed
- relevant row counts remain unchanged
- no DML occurred
- no unrelated migration executed
- `schema_migrations` was not created or written unless a **separate** later authorization explicitly permitted it (this file does not)

Do not claim the three objects exist in PostgreSQL until those catalog queries are actually run after execute.

---

## 11. Failure / STOP conditions

Execution must **STOP** if:

- source identity differs from §5
- source is UAT or Production
- backup evidence cannot be located
- pre-execution data checks fail
- migration file differs from the reviewed file
- migration number 123 collides with another migration
- any unexpected database state is detected
- `schema_migrations` treatment cannot be followed without invention (§8)
- any statement fails
- post-execution verification fails

If a statement fails: **ROLLBACK**. Do not attempt ad hoc remediation. Do not execute another migration. Do not alter the migration file.

Committed-object undo (only if a later authorized execute committed the three objects and they must be removed): drop **only** `rfp_rfps_opportunity_id_fkey`, `prg_programmes_rfp_id_fkey`, and `prg_programmes_tenant_active_rfp`. Do not delete business rows; do not CASCADE; do not drop `prg_programmes_tenant_rfp` or unrelated tables.

No UAT/Production escalation from this authorization.

---

## 12. OWNER DECISION REQUIRED

**OWNER DECISION** — recorded from the governing conversation. Named signature **not** filled.

- [x] **APPROVE** bounded execution of migration 123 against the disposable Gate-B Dev/Test PostgreSQL instance, subject to all stated pre-execution checks and post-execution verification.
- [ ] **DO NOT APPROVE.**

**Recorded decision:**

> I APPROVE bounded execution of migration 123 against the disposable Gate-B Dev/Test PostgreSQL instance, subject to all stated pre-execution checks and post-execution verification.

Name: `________________`  
Role: `________________`  
Date: `________________`  
Signature: `________________`  
Operator identity: **REQUIRES HUMAN**

Owner approval here authorizes **ONLY** migration 123 execution within the defined scope.

It does **NOT** authorize:

- any other migration
- UAT
- Production
- deployment
- application changes
- test changes
- cloud/hosting
- commit / push / PR / merge

**FINAL STATUS:**  
`MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED`

---

## 13. Explicit exclusions

This authorization does **not** include:

- UAT
- Production
- Production migration / backfill / cutover
- migrations `001`–`122`
- migrations `124+`
- `migrate()`
- unrelated DDL / DML
- `schema_migrations` unless explicitly and separately authorized
- costing / approval FKs
- optional event catalogue rows
- `DocumentStorage` kernel work
- application changes
- test changes
- cloud / hosting
- residency
- RTO / RPO
- HA / DR
- Production backup architecture
- identity / security changes
- deployment
- commit
- push
- PR
- merge

---

## 14. Operator and attestation

Do not fabricate operator identity, signature, title, date, or execution timestamp.

Operator identity: **REQUIRES HUMAN**

---

## 15. Execution result (run `20260916-021912`)

Evidence: `docs/governance/evidence/gate-c-123-migration-execution/runs/20260916-021912/`

| Item | Result |
| --- | --- |
| Target | `serengeti-eos-gate-b-pg` / `127.0.0.1:5434` / `eos_gateb` / PostgreSQL 16.15 |
| Pre-checks | **PASS** (orphans 0; duplicate active Programme groups 0; backup SHA-256 match; UAT Exited) |
| `psql` | EXIT **0** — `BEGIN` / two `ALTER TABLE` / `CREATE INDEX` / `COMMIT` |
| Transaction | **COMMIT** |
| `migrate()` | **not invoked** |
| `schema_migrations` | **not created**; **not written** |
| Object A | `rfp_rfps_opportunity_id_fkey` — `rfp_rfps.opportunity_id` → `opp_opportunities.id` — `ON DELETE RESTRICT` |
| Object B | `prg_programmes_rfp_id_fkey` — `prg_programmes.rfp_id` → `rfp_rfps.id` — `ON DELETE RESTRICT` |
| Object C | `prg_programmes_tenant_active_rfp` — unique `(tenant_id, rfp_id)` where `archived_at IS NULL` |
| `prg_programmes_tenant_rfp` | **remains** (non-unique) |
| Row counts | unchanged: opp/rfp/prg **0**; tenants **2**; principals **6**; audit_events **93** |
| Operator identity | **REQUIRES HUMAN** |

Authorization for this bounded execute is **consumed**. Do **not** re-run migration 123 (FK `ADD CONSTRAINT` is not idempotent).

---

## 16. Next governed action

This bounded execute authorization is **consumed**. Do **not** re-run migration 123. Do **not** execute other migrations from this file.

Remaining Gate C work requires **separate** owner authorization. Gate C overall remains **OPEN**. UAT and Production remain **NOT AUTHORIZED**.

**FINAL STATUS:**  
`MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED`  
`GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION`
