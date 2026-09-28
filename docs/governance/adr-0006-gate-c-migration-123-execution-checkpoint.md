# ADR-0006 Gate C — Migration 123 Execution Authorization/Checkpoint

> **`GATE C — MIGRATION 123 EXECUTION AUTHORIZATION/CHECKPOINT`**  
> **`STATUS: EXECUTED / POST-EXECUTION VERIFICATION PASSED`**  
> **`GATE C — OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION`**  
> **`NOT UAT / NOT PRODUCTION`**  
> Named personal signature, legal authority title, and handwritten approval date are **not** invented.

This file is the prepared execution checkpoint. Bounded execute completed as run `20260916-021912` and is **reconciled**. Authoritative record: [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md). Execute authorization is **consumed**. Gate C overall remains **OPEN**.

Recorded from the governing conversation. Filling a name or signature block is reserved for the stakeholder.

Predecessor: [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md) (owner authorization of bounded slice 1–3; CREATE **OA.10**; REVIEW **OA.11**; backup/restore evidence **OA.12 PASS**).

Navigation: backup/restore procedure [`adr-0006-gate-c-migration-123-backup-restore-procedure.md`](adr-0006-gate-c-migration-123-backup-restore-procedure.md); backup/restore evidence review [`adr-0006-gate-c-migration-123-backup-restore-authorization.md`](adr-0006-gate-c-migration-123-backup-restore-authorization.md) — **PASS**. Formal owner-authorization record: [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md) — **MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED**; authorization **consumed**. This checkpoint does **not** re-execute.

---

## 1. STATUS

**GATE C — MIGRATION 123 EXECUTION AUTHORIZATION/CHECKPOINT**  
**STATUS: EXECUTED / POST-EXECUTION VERIFICATION PASSED**

| Item | Status |
| --- | --- |
| Current state | **MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED** |
| Execute authorization | **CONSUMED** (run `20260916-021912`) |
| Backup/restore prerequisite | **EVIDENCE REVIEW — PASS** (run `20260916-014121`) |
| Gate C overall | **OPEN** — remaining work requires separate authorization |
| UAT / Production | **NOT AUTHORIZED** |

Do not interpret this file as permission to run `psql`, `migrate()`, or DDL. Backup/restore evidence PASS does **not** approve §12.

---

## 2. REVIEW BASIS

| Fact | Record |
| --- | --- |
| REVIEW verdict | **REVIEW PASS WITH NON-BLOCKING OBSERVATION** ([backlog **OA.11**](adr-0006-gate-c-migration-backlog.md)) |
| Migration 123 executed (at checkpoint **preparation**) | **NO** — historical row |
| Migration 123 executed (current) | **YES** — run `20260916-021912`; catalog verification **PASS** |
| Database changed by 123 | **YES** — three authorized objects only, disposable Gate-B |
| `migrate()` / other migrations / DML | **NO** |
| Backup/restore evidence | **PASS** — run `20260916-014121` |
| Workspace inspected | `C:\Users\PC\Branding MICE\serengeti-eos-cd-phase1` |
| Known master HEAD at checkpoint preparation | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |

Non-blocking REVIEW observations that this execute checkpoint must honor:

1. Direct `psql` does not inherit `migrate()`’s per-file `BEGIN`/`COMMIT`. Wrap the three statements in **one** transaction at execute time. Do **not** edit migration 123 to add `BEGIN`/`COMMIT` unless a separate remediation is authorized.
2. FK `ADD CONSTRAINT` is not idempotent. Treat execute as a **single run**.
3. Do **not** invoke `migrate()` (would apply the remaining catalogue and create `schema_migrations`).

---

## 3. AUTHORIZED TARGET

Disposable Dev/Test PostgreSQL:

- container: `serengeti-eos-gate-b-pg`
- bind: `127.0.0.1:5434`

| Rule | Statement |
| --- | --- |
| Data | Synthetic / disposable Dev/Test only |
| Not | UAT |
| Not | Production |
| Live customer / PII | **Not authorized** |

Do not create another database in this checkpoint document. Do not retarget UAT (`5433` / `serengeti-eos-uat-postgres`) or Production.

---

## 4. EXACT MIGRATION

`packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql`

Execution scope is limited to **exactly** these three database objects:

| | Object | Semantics |
| --- | --- | --- |
| A | `rfp_rfps_opportunity_id_fkey` | `rfp_rfps.opportunity_id` → `opp_opportunities.id`; id-only; `ON DELETE RESTRICT`; no CASCADE; no SET NULL; no `ON UPDATE` clause |
| B | `prg_programmes_rfp_id_fkey` | `prg_programmes.rfp_id` → `rfp_rfps.id`; id-only; `ON DELETE RESTRICT`; no CASCADE; no SET NULL; no `ON UPDATE` clause |
| C | `prg_programmes_tenant_active_rfp` | Partial unique index on `prg_programmes (tenant_id, rfp_id) WHERE archived_at IS NULL`; no `status` predicate; no full-table uniqueness; existing non-unique `prg_programmes_tenant_rfp` remains |

Active Programme = `archived_at IS NULL`.

---

## 5. PRE-DDL BACKUP REQUIREMENT

**NO DDL EXECUTION IS AUTHORIZED UNTIL A PRE-DDL BACKUP HAS BEEN SUCCESSFULLY CREATED AND ITS RESULT RECORDED.**

Backup evidence for the disposable Gate-B source is now **recorded PASS** (run `20260916-014121`). This **clears the backup-evidence gap** for authorization review. It does **not** authorize migration 123. §12 remains unchecked.

### Recorded evidence (not invented)

| Field | Record |
| --- | --- |
| Source | `serengeti-eos-gate-b-pg` / `127.0.0.1:5434` / volume `serengeti-eos-gate-b-pgdata` |
| Database / user | `eos_gateb` / `eos_gateb` (inspected at execute) |
| PostgreSQL | 16.15 |
| Artifact | `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/backups/gatec-123.dump` |
| Size / SHA-256 | 159176 bytes / `9C401242B354D81497C1879302615AF3D59CB556C9B3D32F0C3D8CBAC010599D` |
| Format | custom (`-Fc`) |
| `pg_dump` | EXIT 0 |
| `pg_restore --list` | EXIT 0 |
| UAT / Production as source or destination | **NO** |

Procedure: [`adr-0006-gate-c-migration-123-backup-restore-procedure.md`](adr-0006-gate-c-migration-123-backup-restore-procedure.md). Authorization and evidence review: [`adr-0006-gate-c-migration-123-backup-restore-authorization.md`](adr-0006-gate-c-migration-123-backup-restore-authorization.md).

This checkpoint still does **not** execute backup or DDL.

---

## 6. RESTORE VERIFICATION REQUIREMENT

Distinguish:

| | Activity | Status |
| --- | --- | --- |
| A | Backup creation | **PASS** — run `20260916-014121` |
| B | Restore verification | **PASS** — isolated target `serengeti-eos-gate-c-123-restore-pg` on `127.0.0.1:5435`; volume `serengeti-eos-gate-c-123-restore-pgdata`; **not** the Gate-B volume |

Recorded restore result: `pg_restore` EXIT 0; restored PostgreSQL 16.15 reachable; expected EOS tables present; row counts matched source (opp/rfp/prg **0**; tenants **2**; principals **6**; audit_events **93**); migration-123 objects **ABSENT**; restore container and volume **removed** after validation; source remained running and unchanged by restore; dump **preserved**.

This **clears the restore-verification gap** for authorization review. It does **not** authorize migration 123. Restore onto the Gate-B volume remains **FORBIDDEN**.

This checkpoint does **not** perform restore and does **not** execute DDL.

---

## 7. EXECUTION METHOD

Proposed method **if** owner later approves **and** §§5–6 and §8 are cleared:

- Direct `psql` against disposable Dev/Test `serengeti-eos-gate-b-pg` (`127.0.0.1:5434`) only.
- Execute **ONLY** migration 123.
- Do **NOT** run `migrate()` (`packages/db/src/index.ts` wraps each catalogue file in `BEGIN`/`COMMIT` and inserts `schema_migrations`, then applies **all** unapplied files including `schema.sql` and `001+`).
- Do **NOT** execute migrations `001`–`122`.
- Do **NOT** execute migrations `124+` (none expected; none authorized).
- Do **NOT** create `schema_migrations` entries unless separately authorized.
- Wrap the three migration statements in **ONE** transaction at execution time (execution wrapper; **do not** edit `123_cd_rfp_programme_relationship_constraints.sql` to add `BEGIN`/`COMMIT` unless a separate technical remediation is authorized).
- Rollback on failure.
- Commit only after all three statements succeed.

This method is **proposed**. It is **not** authorized by this file.

---

## 8. PRE-EXECUTION DATA CHECKS

These are **execution-time** checks. **Do not run them now.**

Immediately before DDL, after backup/restore prerequisites, confirm on the target:

1. Orphan RFP opportunity references = 0  
   (`rfp_rfps.opportunity_id` with no matching `opp_opportunities.id`)
2. Orphan Programme RFP references = 0  
   (`prg_programmes.rfp_id` with no matching `rfp_rfps.id`)
3. Duplicate active Programme groups = 0  
   (`tenant_id, rfp_id` where `archived_at IS NULL`, `HAVING count(*) > 1`)
4. Active definition = `archived_at IS NULL` (do not use `status`)
5. Relevant tables contain no unexpected incompatible data (including unexpected non-zero business rows if the instance is no longer empty; stop and report rather than improvising backfill)

If any check fails: **STOP**; do not execute (§10).

Prior Gate B READ-ONLY inspection recorded 0 business rows and 0 orphans/duplicates. That evidence is **historical**. It must be **re-confirmed at execute time**. It is **not** Production/UAT evidence.

---

## 9. POST-EXECUTION VERIFICATION

These queries are **required after** a future authorized execute. **Do not run them now.**

### Foreign key A — `rfp_rfps_opportunity_id_fkey`

Catalog proof that the constraint exists; source `rfp_rfps.opportunity_id`; referenced `opp_opportunities.id`; `ON DELETE RESTRICT`.

### Foreign key B — `prg_programmes_rfp_id_fkey`

Catalog proof that the constraint exists; source `prg_programmes.rfp_id`; referenced `rfp_rfps.id`; `ON DELETE RESTRICT`.

### Unique index C — `prg_programmes_tenant_active_rfp`

Catalog proof that the index exists; **unique**; columns `tenant_id`, `rfp_id` in that order; predicate exactly `archived_at IS NULL`; no `status` predicate.

### Preservation

Existing non-unique index `prg_programmes_tenant_rfp` **remains**.

### Negative checks

`schema_migrations` still absent unless a later separate authorization created it (this checkpoint does not). Unrelated catalogue modules not added.

Do not claim the three objects exist in PostgreSQL until those catalog queries are actually run after execute.

---

## 10. FAILURE / ROLLBACK

| Condition | Action |
| --- | --- |
| Pre-check (§8) fails | **STOP**; do not execute |
| Backup (§5) fails or is not recorded | **STOP** |
| Restore verification (§6) fails or remains unconfirmed | **STOP** |
| Any migration statement fails | Transaction **must roll back**; do not retry unrelated DDL |
| Post-execution verification fails | **STOP**; preserve evidence; do not attempt unrelated remediation |
| Need to undo **committed** three objects | Drop **only** `rfp_rfps_opportunity_id_fkey`, `prg_programmes_rfp_id_fkey`, `prg_programmes_tenant_active_rfp`. Do not delete business rows; do not CASCADE; do not drop unrelated indexes/tables |
| Escalation | **No** UAT/Production escalation from this checkpoint |

---

## 11. SCOPE EXCLUSIONS

This checkpoint does **not** include:

- Production migration
- Production backfill
- Production cutover
- UAT
- Architecture F
- WP-14
- Additional Production indexes
- Costing/approval FKs
- Optional event catalogue rows
- DocumentStorage kernel work
- Cloud/hosting
- Residency
- RTO/RPO
- HA/DR architecture
- Production backup architecture
- Production identity/security
- Unrelated migrations
- Application code changes
- Full `migrate()`
- Creating `schema_migrations` (unless separately authorized)
- Commit / push / PR / merge
- Deployment

---

## 12. AUTHORIZATION GATE

**OWNER DECISION REQUIRED:**

- [ ] **APPROVE** bounded Gate C execution of migration 123 after all stated preconditions are satisfied.
- [ ] **DO NOT APPROVE** execution.

Named signature / date: **not filled**.

Approval, if later recorded, would cover **only** bounded Dev/Test execute of this file on `serengeti-eos-gate-b-pg` after §§5–8.

Approval does **NOT** authorize:

- Production
- UAT
- other migrations
- `schema_migrations` changes
- application changes
- commit / push / PR / merge
- deployment

Until a box is checked by a human owner instruction on **this** checkpoint: historical preparation remains. Authoritative owner APPROVE is recorded on [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md).

---

## 13. GOVERNANCE STATUS

**Current status:**  
`MIGRATION 123 — EXECUTED / POST-EXECUTION VERIFICATION PASSED`

**Execute authorization:** **CONSUMED**

**Gate C overall:**  
`OPEN / REMAINING WORK REQUIRES SEPARATE GOVERNED AUTHORIZATION`

**UAT / Production:** **NOT AUTHORIZED**

---

## 14. Next governed action

Do **not** re-run migration 123. Remaining Gate C items (backlog 4–7, UAT, Production) require **separate** owner authorization.
