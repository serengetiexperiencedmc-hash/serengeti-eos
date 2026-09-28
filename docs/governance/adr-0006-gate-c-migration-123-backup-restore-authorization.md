# ADR-0006 Gate C — Migration 123 backup/restore prerequisite authorization record

> **`BACKUP/RESTORE EVIDENCE REVIEW — PASS`**  
> **`BACKUP/RESTORE PREREQUISITE — COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW`**  
> **`NOT A MIGRATION 123 AUTHORIZATION`**  
> **`NOT UAT / NOT PRODUCTION`**  
> Named personal signature, legal authority title, handwritten date, and operator identity are **not** invented.

This file **records** owner authorization of the **backup/restore prerequisite only**, the executed run `20260916-014121`, and the evidence-review verdict. It does **not** authorize migration 123.

**OWNER APPROVAL HERE DOES NOT AUTHORIZE MIGRATION 123.**  
**A SECOND, SEPARATE OWNER AUTHORIZATION IS REQUIRED BEFORE MIGRATION 123 DDL CAN BE EXECUTED.**

Governance recording note: the **decision status** is recorded from the authorized stakeholder instruction in the governing conversation. **Named personal signature, legal authority title, and handwritten date are not invented.** Blank attestation fields remain for the stakeholder.

| Document | Role |
| --- | --- |
| [`adr-0006-gate-c-migration-123-backup-restore-procedure.md`](adr-0006-gate-c-migration-123-backup-restore-procedure.md) | Procedure **design** (reviewed **PASS WITH NON-BLOCKING OBSERVATIONS**) |
| [`adr-0006-gate-c-migration-123-execution-checkpoint.md`](adr-0006-gate-c-migration-123-execution-checkpoint.md) | Migration 123 **DDL** checkpoint — prepared; owner APPROVE is on the execution-authorization file |
| [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md) | Formal bounded-execute record — **EXECUTED / POST-EXECUTION VERIFICATION PASSED**; authorization **consumed** |
| [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md) | Bounded slice 1–3 **COMPLETE** on disposable Gate-B; Gate C overall **OPEN**; backup/restore **OA.12 PASS** |

---

## 1. STATUS

**BACKUP/RESTORE EVIDENCE REVIEW — PASS**

**BACKUP/RESTORE PREREQUISITE — COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW**

**GATE C BACKUP/RESTORE PREREQUISITE DECISION:**  
`AUTHORIZED` before execution (owner APPROVE of this file). Named signature not fabricated. **Run `20260916-014121` executed within that authorized scope.** Evidence review: **PASS**. Migration 123 **not** executed.

| State | When |
| --- | --- |
| BACKUP/RESTORE PREREQUISITE — AWAITING OWNER AUTHORIZATION | Historical |
| BACKUP/RESTORE PREREQUISITE — OWNER AUTHORIZED / NOT YET EXECUTED | Historical (authorization granted before the run) |
| BACKUP/RESTORE PREREQUISITE — COMPLETED / AWAITING EVIDENCE REVIEW | Historical (run `20260916-014121` completed; before this review) |
| **BACKUP/RESTORE EVIDENCE REVIEW — PASS** | **Now** |
| **BACKUP/RESTORE PREREQUISITE — COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW** | **Now** |
| AUTHORIZED FOR BOUNDED DEV/TEST EXECUTION (migration 123) | Subsequent owner APPROVE recorded and **consumed** — **EXECUTED / POST-EXECUTION VERIFICATION PASSED** (run `20260916-021912`) |

Migration 123 status: **EXECUTED / POST-EXECUTION VERIFICATION PASSED**. This backup/restore file does **not** re-execute it. Gate C overall remains **OPEN**.

---

## 2. Procedure review basis

The backup/restore procedure has been reviewed as:

**PASS WITH NON-BLOCKING OBSERVATIONS**

The procedure establishes (design): disposable source PostgreSQL; pre-DDL custom-format `pg_dump`; external evidence artifact; backup validation; isolated restore target; restore validation; evidence capture; cleanup; protection of the Gate-B source and volume; no Production/UAT implication.

Execution-time observations (must be honored when executed; **not** resolved by inventing values here):

1. `POSTGRES_USER` and actual database name must be inspected from the **running** disposable instance. Do **not** infer them from documentation.
2. Proposed restore port `5435` requires an execution-time collision check.
3. If source identity, database identity, credentials/configuration, or restore target identity is ambiguous: **STOP**.

---

## 3. Authorized scope (EXECUTED WITHIN SCOPE)

The owner authorized **ONLY** the following. Run `20260916-014121` performed these items. It did **not** exceed this list:

| | Activity |
| --- | --- |
| A | Inspection of the disposable Gate-B PostgreSQL source |
| B | Creation of **one** pre-DDL custom-format backup using the repository-grounded `pg_dump` procedure |
| C | Validation of that backup |
| D | Creation of an isolated disposable restore target for recovery verification |
| E | Restoration of the backup into that isolated target |
| F | Validation that the restored database is usable and contains the expected EOS schema/data |
| G | Verification that migration-123 objects are **absent** from the restored pre-DDL state |
| H | Capture of execution evidence |
| I | Destruction/removal of the isolated restore target after successful verification, while **preserving** the backup evidence artifact |
| J | **Stop** after successful completion |

**Performed** by run `20260916-014121`. This recording does **not** authorize a second run and does **not** authorize migration 123.

---

## 4. Explicitly not authorized

This owner authorization does **not** authorize:

- execution of migration 123
- any DDL against the source Gate-B database
- `migrate()`
- migrations `001`–`122`
- migrations `124+`
- `schema_migrations` changes
- application changes
- test changes
- UAT
- Production
- cloud/hosting
- Production backup architecture
- Production DR
- Production RTO/RPO
- HA / geo-replication
- residency
- security/identity changes
- commit / push / PR / merge
- deployment
- restore onto `serengeti-eos-gate-b-pg` or volume `serengeti-eos-gate-b-pgdata`
- informal replacement of restore port or container name if `5435` / proposed names collide

---

## 5. Source (inspected at execute; not invented)

| Item | Execute-time record (run `20260916-014121`) | Invented here |
| --- | --- | --- |
| Container | `serengeti-eos-gate-b-pg` | No |
| Bind | `127.0.0.1:5434` | No |
| Volume | `serengeti-eos-gate-b-pgdata` | No |
| Image | `postgres:16-alpine` | No |
| Class | Disposable Dev/Test; synthetic data only; not UAT; not Production | No |
| PostgreSQL version | **16.15** (inspected) | No |
| Database name | `eos_gateb` (`POSTGRES_DB`, inspected) | No |
| User | `eos_gateb` (`POSTGRES_USER`) | No |

Live customer / PII: **not used**. UAT and Production: **not touched**.

---

## 6. Backup (executed — PASS)

Run `20260916-014121` performed **one** pre-DDL custom-format backup of the disposable Gate-B source.

| Field | Record |
| --- | --- |
| Artifact | `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/backups/gatec-123.dump` |
| Format | PostgreSQL custom (`-Fc`) |
| Size | 159176 bytes |
| SHA-256 | `9C401242B354D81497C1879302615AF3D59CB556C9B3D32F0C3D8CBAC010599D` |
| `pg_dump` | EXIT **0** |
| `pg_restore --list` | EXIT **0** |
| Backup validation | **PASS** |
| Artifact preserved | **YES** |

---

## 7. Restore (executed — isolated target — PASS)

Run `20260916-014121` used the authorized isolated restore identity. Port `5435` was free. Restore container did not pre-exist. Gate-B volume was **not** used.

| Item | Record |
| --- | --- |
| Restore container | `serengeti-eos-gate-c-123-restore-pg` |
| Bind | `127.0.0.1:5435` |
| Volume | `serengeti-eos-gate-c-123-restore-pgdata` |
| `pg_restore` | EXIT **0** |
| Restore onto Gate-B volume | **NO** |

---

## 8. Restore validation (executed — PASS)

| Check | Result |
| --- | --- |
| Restored PostgreSQL reachable | **YES** (16.15) |
| Expected EOS tables present | **YES** |
| Row counts matched source | opp/rfp/prg **0**; tenants **2**; principals **6**; audit_events **93** |
| Isolated restore target | **YES** (`5435`, separate volume) |
| Migration-123 objects on restored pre-DDL state | **ABSENT** (`rfp_rfps_opportunity_id_fkey`; `prg_programmes_rfp_id_fkey`; `prg_programmes_tenant_active_rfp`) |
| Source intact after restore | **YES** (still running on `5434` / `serengeti-eos-gate-b-pgdata`; same counts; Gate C objects absent) |
| Restore container removed | **YES** |
| Restore volume removed | **YES** |
| Backup artifact preserved | **YES** |

---

## 9. Failure conditions

If any prerequisite fails: **STOP**. Do not proceed to migration 123.

STOP if: source cannot be unambiguously identified; database/user configuration is ambiguous; backup fails; artifact missing; backup validation fails; restore target cannot be isolated; restore port collides; restore fails; restored validation fails; expected objects/data do not match; migration-123 objects unexpectedly already exist; any UAT/Production resource is detected; any unexpected database mutation occurs.

**No migration 123 execution may follow a failed prerequisite.** After a successful backup/restore **run**, **STOP** and produce the evidence report. **Do not execute migration 123.**

---

## 10. Evidence (run `20260916-014121`)

Evidence directory: `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/`

Contains: `summary.json`; `backups/gatec-123.dump`; `logs/pg_restore-list.txt`.

| Field | Record |
| --- | --- |
| Run ID | `20260916-014121` |
| Started UTC (from `summary.json`) | `2026-09-15T22:41:39.3794976+00:00` |
| Source | `serengeti-eos-gate-b-pg` / `127.0.0.1:5434` / `serengeti-eos-gate-b-pgdata` |
| PostgreSQL | 16.15 |
| Database | `eos_gateb` |
| User | `eos_gateb` |
| Backup artifact | `backups/gatec-123.dump` (159176 bytes) |
| `pg_dump` | EXIT 0 |
| `pg_restore --list` | EXIT 0 |
| Restore target | `serengeti-eos-gate-c-123-restore-pg` / `127.0.0.1:5435` |
| Restore | EXIT 0 |
| Cleanup | restore container **removed**; restore volume **removed**; source **running**; dump **preserved** |
| UAT / Production | **not touched** |
| Migration 123 executed | **NO** |
| Operator identity | **REQUIRES HUMAN** — not fabricated |

Name: `________________`  
Role: `________________`  
Date: `________________`  
Signature: `________________`

---

## 11. Sequence after this recording

1. This prerequisite **OWNER AUTHORIZED / NOT YET EXECUTED** — historical  
2. Separate instruction **ran** the procedure — run `20260916-014121`  
3. Evidence captured — historical **COMPLETED / AWAITING EVIDENCE REVIEW**  
4. Evidence review — **PASS** (this reconciliation)  
5. Prerequisite is **COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW**  
6. **Then** owner may consider the **separate** migration 123 execution checkpoint  
7. Until a **second, separate** owner authorization of that checkpoint is granted: migration 123 DDL remains **not authorized**

---

## 12. OWNER DECISION (recorded)

**OWNER DECISION** — recorded from the governing conversation. Named signature **not** filled.

- [x] **APPROVE** execution of the bounded Gate C backup/restore prerequisite only.  
- [ ] **DO NOT APPROVE.**

**Recorded decision:**

> I APPROVE the bounded Gate C backup/restore prerequisite described in this file.

Authorization was granted **before** run `20260916-014121`. The run stayed inside that scope.

**OWNER APPROVAL HERE DOES NOT AUTHORIZE MIGRATION 123.**

**A SECOND, SEPARATE OWNER AUTHORIZATION IS REQUIRED BEFORE MIGRATION 123 DDL CAN BE EXECUTED.**

**EVIDENCE REVIEW VERDICT:**  
`BACKUP/RESTORE EVIDENCE REVIEW — PASS`

**FINAL STATUS:**  
`BACKUP/RESTORE PREREQUISITE — COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW`

---

## 13. Evidence review (reconciliation)

Governance reconciliation of run `20260916-014121`. No PostgreSQL, dump, restore, or migration 123 action is performed by this review.

| # | Finding | Record |
| --- | --- | --- |
| 1 | Backup/restore authorization was granted before execution | **YES** — owner APPROVE on this file before the run |
| 2 | Authorized procedure executed within scope | **YES** — procedure file; isolated dump/restore only |
| 3 | Backup succeeded | **YES** — `pg_dump` EXIT 0 |
| 4 | Backup validation succeeded | **YES** — `pg_restore --list` EXIT 0; artifact present, 159176 bytes |
| 5 | Isolated restore succeeded | **YES** — `pg_restore` EXIT 0 on `127.0.0.1:5435` |
| 6 | Restore validation succeeded | **YES** — reachable; tables present; counts matched source |
| 7 | Migration-123 objects absent from pre-DDL restored state | **YES** |
| 8 | Restore target removed | **YES** (container and volume) |
| 9 | Backup evidence preserved | **YES** |
| 10 | Gate-B source remained intact | **YES** (running on `serengeti-eos-gate-b-pgdata`) |
| 11 | UAT and Production untouched | **YES** |
| 12 | Migration 123 was NOT executed | **YES** |
| 13 | Operator identity remains REQUIRES HUMAN | **YES** |

**Verdict:** `BACKUP/RESTORE EVIDENCE REVIEW — PASS`

This verdict **clears the backup/restore prerequisite for migration-123 authorization review**. Subsequent bounded execute completed as run `20260916-021912` and is reconciled. Authorization is **consumed**.

---

## 14. Next governed action

Gate C remains **OPEN**. Migration 123 is **EXECUTED / POST-EXECUTION VERIFICATION PASSED**. Remaining Gate C work requires **separate** owner authorization.

Do **not** execute other migrations from this file.
