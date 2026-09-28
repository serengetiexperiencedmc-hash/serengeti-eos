# ADR-0006 Gate C — Migration 123 Dev/Test backup and restore procedure

> **`BACKUP/RESTORE PROCEDURE — EXECUTED WITHIN AUTHORIZED SCOPE`**  
> **`BACKUP/RESTORE EVIDENCE REVIEW — PASS`** (run `20260916-014121`)  
> **`NOT A MIGRATION 123 EXECUTION`**  
> **`NOT PRODUCTION / NOT UAT`**  
> Named personal signature, operator identity, and handwritten date are **not** invented.

This procedure defines the **prerequisite mechanism** for a later bounded Gate C execute of migration `123` against disposable `serengeti-eos-gate-b-pg`.

**This procedure does not authorize migration 123 execution.**

Owner-authorization checkpoint for **running** this procedure: [`adr-0006-gate-c-migration-123-backup-restore-authorization.md`](adr-0006-gate-c-migration-123-backup-restore-authorization.md) — **BACKUP/RESTORE EVIDENCE REVIEW — PASS**; prerequisite **COMPLETED / CLEARED FOR MIGRATION-123 AUTHORIZATION REVIEW** (run `20260916-014121`). This procedure file does **not** authorize migration 123.

The existing checkpoint [`adr-0006-gate-c-migration-123-execution-checkpoint.md`](adr-0006-gate-c-migration-123-execution-checkpoint.md) is prepared. Formal execute result: [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md) — **EXECUTED / POST-EXECUTION VERIFICATION PASSED**; authorization **consumed**. This procedure file does **not** re-execute.

Distinguish:

| Layer | This file |
| --- | --- |
| Procedure **design** | **YES** — this document |
| Procedure **approval** | **RECORDED** as owner authorization of the prerequisite **run** — see authorization record |
| Actual **backup** execution | **YES** — run `20260916-014121` (evidence under `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/`) |
| Actual **restore** execution | **YES** — isolated target only; target **removed** after validation; source **not** overwritten |
| Evidence review | **PASS** |
| Migration 123 execution | **NO** — remains **BLOCKED** until §7 E |

---

## 0. Relationship to existing records

| Record | Role |
| --- | --- |
| [`adr-0006-gate-c-migration-123-execution-checkpoint.md`](adr-0006-gate-c-migration-123-execution-checkpoint.md) | Execute checkpoint; identified that **no established Gate-B backup/restore procedure** existed |
| [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md) | Bounded slice 1–3 **COMPLETE** on disposable Gate-B (run `20260916-021912`); backup/restore evidence **PASS** (OA.12) |
| [`adr-0006-devtest-schema-bootstrap-authorization.md`](adr-0006-devtest-schema-bootstrap-authorization.md) §12.2 | Source instance identity (container, volume, bind, image, PG 16.15); **no backup-restore or clone path** |
| [`adr-0006-gate-b-dev-test-implementation-authorization.md`](adr-0006-gate-b-dev-test-implementation-authorization.md) §13 items 5–6 / §19.4 | EOS-table backup restore / PITR **not executed** |
| `docs/governance/evidence/e2-lab/run-e2-lab.ps1` | E2 lab `pg_dump -Fc` / `pg_restore` on **different** containers (`eos-e2-lab-primary`, DB `eos_lab`) |
| `infra/compose/dev.yaml` | Different Postgres (`5432`, DB `eos`) — **not** the Gate-B target |
| ADR-0011 file in this repository | **Not found.** Production backup product remains **TBD** in other ADR-0006 records |

`packages/db` `npm run migrate` / `migrate()` is **not** a backup tool and must **not** be used here.

---

## 1. Target identification (source)

Confirm **at execution time**. Do not skip. If identity is ambiguous: **STOP**.

| Item | Established in governance | Status |
| --- | --- | --- |
| Container | `serengeti-eos-gate-b-pg` (Authorization B §12.2) | **Established** |
| Volume | `serengeti-eos-gate-b-pgdata` | **Established** (source data dir — **do not restore onto this volume**) |
| Host bind | `127.0.0.1:5434` → container `5432` | **Established** |
| Image family | `postgres:16-alpine` | **Established** |
| PostgreSQL version at bootstrap | **16.15** | **Established** (re-confirm at execute: `SELECT version();` — not run now) |
| Classification | Disposable local Dev/Test; synthetic only | **Established** |
| Not UAT | Must not be `serengeti-eos-uat-postgres` / port `5433` / volume `serengeti-eos-uat-pgdata` | **Established prohibition** |
| Not Production | Must not be any Production endpoint | **Established prohibition** |
| Database name | Gate C backlog records `eos_gateb`. Authorization B §12.2 does **not** print `POSTGRES_DB`. | **Confirmed at execute:** `eos_gateb` |
| Role / user | Not printed in Authorization B. Compose `eos` user is a **different** instance. | **Confirmed at execute:** `eos_gateb` |
| Password / `EOS_DATABASE_URL` | Authorization B: credentials disposable, **not** committed, **not** printed; `EOS_DATABASE_URL` **not** written to repository files | **Do not record secrets.** Prefer `docker exec` inside the source container (E2/bootstrap pattern) so the runbook contains **no** password |

Execute-time identity commands (structure only — **not run now**):

```text
docker inspect --format "{{.Name}} {{.State.Status}}" serengeti-eos-gate-b-pg
docker inspect --format "{{range .Config.Env}}{{println .}}{{end}}" serengeti-eos-gate-b-pg
```

Record from inspect **only** `POSTGRES_USER` and `POSTGRES_DB`. Do **not** copy `POSTGRES_PASSWORD` into evidence, chat, or this runbook.

Forbidden sources: `infra/compose/dev.yaml` service `postgres` (`127.0.0.1:5432`); UAT; Production; E2 lab containers.

---

## 2. A. PRE-DDL BACKUP (executed — PASS)

**Executed** in authorized run `20260916-014121`. Design text below is retained as the mechanism.

Backup **before** any migration 123 DDL. Source remains running. Do **not** stop or destroy `serengeti-eos-gate-b-pg` to take the dump.

### Format

Reuse the **established E2 lab dump format**: PostgreSQL **custom** format (`pg_dump -Fc`), which supports `pg_restore --list`.

Do **not** use plain SQL dump unless execute-time evidence shows `-Fc` is unavailable (then **STOP** and request clarification rather than silently switching).

### Artifact location

Outside the database container, uniquely named, following the E2 evidence layout (dated run directory + `backups/`).

Proposed evidence root (directory **not** created by this design task):

```text
docs/governance/evidence/gate-c-123-backup/runs/<yyyyMMdd-HHmmss>/
  backups/gatec-123.dump
  backups/gatec-123-manifest.json
  logs/
```

`<yyyyMMdd-HHmmss>` for the authorized run: **`20260916-014121`**.

### Command structure (placeholders only)

`<USER>` and `<DB>` = values confirmed in §1. **No password in the runbook.**

```text
docker exec serengeti-eos-gate-b-pg pg_dump -U <USER> -d <DB> -Fc -f /tmp/gatec-123.dump
docker cp serengeti-eos-gate-b-pg:/tmp/gatec-123.dump <evidence-run>/backups/gatec-123.dump
```

This matches E2 lab (`docker exec … pg_dump -U … -d … -Fc -f /tmp/….dump` then `docker cp` to host evidence). It is **not** a copy of the E2 container names or database `eos_lab`.

Retain command exit status and a short transcript in `<evidence-run>/logs/` **without** secrets.

---

## 3. B. BACKUP VALIDATION (executed — PASS)

**Executed.** All listed checks succeeded for run `20260916-014121` (`pg_dump` 0; artifact present; 159176 bytes; `pg_restore --list` 0; TOC includes `rfp_rfps`, `prg_programmes`, `opp_opportunities`; source PostgreSQL 16; not UAT/Production).

1. `pg_dump` and `docker cp` exit status **0**.
2. Host artifact `gatec-123.dump` **exists**.
3. Artifact size **> 0** bytes.
4. `pg_restore --list <artifact>` exit status **0** (custom format TOC). Tooling: `pg_restore` from the **same** `postgres:16-alpine` image via `docker run --rm -v <host-backup-dir>:/backup:ro postgres:16-alpine pg_restore --list /backup/gatec-123.dump` **or** copy the dump into a throwaway helper — **not** into the source data volume. If `pg_restore` is not available on the host, use the image; do not invent another tool.
5. TOC listing includes expected EOS relation names from Authorization B §12.2 (at least `rfp_rfps`, `prg_programmes`, `opp_opportunities`). Absence: **STOP**.
6. PostgreSQL major version of source (re-confirmed) is **16**; dump taken from that instance. Incompatibility: **STOP**.
7. Artifact is **not** from UAT/Production (identity recorded in manifest).

Manifest (proposed fields, not filled now): source container; bind `127.0.0.1:5434`; confirmed `<DB>` name; format `custom`; bytes; dump exit code; list exit code. **No password.**

---

## 4. Restore target

### Repository finding

**No established disposable restore clone exists for Gate-B.**

| Candidate | Verdict |
| --- | --- |
| Restore onto `serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata` | **FORBIDDEN** — would overwrite the source |
| E2 lab destroy-primary-then-`pg_restore` onto the same name | **FORBIDDEN** for Gate-B (E2 destroyed `eos-e2-lab-primary`; must not be copied onto the Gate-C source) |
| `infra/compose/dev.yaml` postgres | **FORBIDDEN** — different instance |
| UAT `5433` | **FORBIDDEN** |
| Authorization B clone path | **Does not exist** |

### Minimum **proposed** mechanism (does **not** exist until a later authorized run creates it)

Isolated Docker PostgreSQL, same image family `postgres:16-alpine`:

| Item | Proposed value | Status |
| --- | --- | --- |
| Restore container | `serengeti-eos-gate-c-123-restore-pg` | **Created for run `20260916-014121`; removed after validation** |
| Restore volume | `serengeti-eos-gate-c-123-restore-pgdata` | **Created for the run; removed after validation** |
| Bind | `127.0.0.1:5435` → container `5432` | **Used after collision check passed; now unused after cleanup** |
| Network | local Docker; bind `127.0.0.1` only | Required |
| `POSTGRES_USER` / `POSTGRES_DB` | **Same names as confirmed source** (so restore maps) | Set at execute; **do not publish password** (generate disposable restore-only secret in container env; never copy into git) |

**NEVER restore over the source database.**

Creating this restore instance is **not** a standing clone. It existed only for run `20260916-014121` and was removed after validation.

---

## 5. C. DISPOSABLE RESTORE (executed — PASS)

**Executed** into the isolated restore cluster only. Migration 123 was **not** applied to restore or source.

Into the **empty restore** cluster only:

```text
docker cp <evidence-run>/backups/gatec-123.dump serengeti-eos-gate-c-123-restore-pg:/tmp/gatec-123.dump
docker exec serengeti-eos-gate-c-123-restore-pg pg_restore -U <USER> -d <DB> /tmp/gatec-123.dump
```

Notes:

- Do **not** pass `--clean` against the **source**.
- `--clean --if-exists` on the **restore** container is acceptable only if that cluster is the proposed empty restore instance and contains no other purpose.
- Do **not** run `migrate()`.
- Do **not** apply migration 123 on the restore target as part of this prerequisite (the point is to prove the **pre-DDL** backup restores).
- Wait for restore Postgres ready (`pg_isready`) before `pg_restore` (E2 `Wait-Pg` pattern).

---

## 6. D. RESTORE VALIDATION (executed — PASS)

**PASS** on the restore container for run `20260916-014121`. Design checks below were satisfied; Gate C objects remained **ABSENT**; counts matched source; source remained on `5434`.

1. `pg_restore` exit status **0** (or documented acceptable warnings only; unexpected errors: **STOP**).
2. Restore instance reachable: `pg_isready` and `SELECT 1`.
3. Expected EOS tables exist, including at least: `opp_opportunities`, `rfp_rfps`, `prg_programmes` (Authorization B required set of 17 tables should be present unless TOC showed otherwise — then **STOP**).
4. Gate C objects `rfp_rfps_opportunity_id_fkey`, `prg_programmes_rfp_id_fkey`, `prg_programmes_tenant_active_rfp` remain **ABSENT** on the restored copy (backup is pre-123). If they appear: **STOP** (wrong dump or wrong target).
5. Row counts for `opp_opportunities`, `rfp_rfps`, `prg_programmes` (and optionally tenants/principals/audit) **match** counts taken from the **source** immediately before dump. Historical Gate B counts are **not** a substitute for execute-time comparison.
6. Restore bind is not `5434` / `5433` / Production.
7. Source container still running and **unmodified** by restore (spot-check source still lacks the three Gate C objects).

---

## 7. Migration 123 execution remains BLOCKED until

A. pre-DDL backup succeeds — **PASS** (run `20260916-014121`);  
B. backup validation succeeds — **PASS**;  
C. restore verification succeeds — **PASS**;  
D. evidence is recorded — **PASS** (`docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/`);  
E. the owner has separately authorized the bounded Gate C execution — **YES**, recorded on [`adr-0006-gate-c-migration-123-execution-authorization.md`](adr-0006-gate-c-migration-123-execution-authorization.md); **not executed**.

A–E are **cleared**. Bounded execute completed as run `20260916-021912` and is reconciled. This procedure file does **not** re-execute. Migration 123 is **EXECUTED / POST-EXECUTION VERIFICATION PASSED**.

---

## 8. Not Production

This procedure is **ONLY** for the disposable Dev/Test Gate C target `serengeti-eos-gate-b-pg`.

It does **NOT** establish: Production backup architecture; Production DR; Production RPO; Production RTO; HA; geo-replication; Production residency; Production compliance; Production backup policy; ADR-0011 product selection.

---

## 9. E. EVIDENCE RECORD

Filled from run `20260916-014121` / `summary.json`. Operator identity is **not** fabricated.

| Field | Record |
| --- | --- |
| Timestamp (start UTC) | `2026-09-15T22:41:39.3794976+00:00` (from `summary.json`) |
| Source container / bind / confirmed DB name | `serengeti-eos-gate-b-pg` / `127.0.0.1:5434` / `eos_gateb` |
| PostgreSQL version string | 16.15 |
| Backup artifact path and byte size | `docs/governance/evidence/gate-c-123-backup/runs/20260916-014121/backups/gatec-123.dump` — 159176 bytes; SHA-256 `9C401242B354D81497C1879302615AF3D59CB556C9B3D32F0C3D8CBAC010599D` |
| Backup command exit status | `pg_dump` EXIT **0** |
| `pg_restore --list` exit status | EXIT **0** |
| Restore target container / bind | `serengeti-eos-gate-c-123-restore-pg` / `127.0.0.1:5435` |
| Restore command result | `pg_restore` EXIT **0** |
| Restore validation result (tables, counts, Gate C objects absent) | **PASS** — EOS tables present; opp/rfp/prg **0**; tenants **2**; principals **6**; audit_events **93**; Gate C objects **ABSENT** |
| Source still intact (yes/no) | **YES** |
| Cleanup result | restore container **removed**; restore volume **removed**; dump **preserved** |
| UAT/Production unused (yes/no) | **YES** |
| Operator / executor identity | **REQUIRES HUMAN** — not fabricated |
| Named signature / date | left blank unless stakeholder fills |
| Evidence review | **PASS** |

---

## 10. Failure handling

| Condition | Action |
| --- | --- |
| Backup failure | **STOP** |
| Backup validation failure | **STOP** |
| Restore failure | **STOP** |
| Restore validation failure | **STOP** |
| Source/target ambiguity (wrong name, port, or inspect mismatch) | **STOP** |
| Credential/configuration ambiguity | **STOP** |
| Unexpected data or environment (UAT/Production/live PII; non-empty unexpected Production-like data) | **STOP** |
| Collision on proposed restore port/name | **STOP** |

**No migration 123 execution after any failed prerequisite.** Do not improvise a workaround. Do not restore onto the source to “retry.”

---

## 11. Security

- Do **not** place passwords, `EOS_DATABASE_URL`, tokens, or connection strings with credentials in this runbook or in evidence files.
- Use `docker exec` on named containers and inspect `POSTGRES_USER` / `POSTGRES_DB` only.
- Do not copy `infra/compose/dev.yaml` `POSTGRES_PASSWORD` into Gate-B or restore configuration documentation.
- Evidence dumps may contain synthetic Dev/Test rows; treat the dump as **Dev/Test only**; do not copy to Production systems.

---

## 12. F. CLEANUP (executed — PASS)

After successful restore validation of run `20260916-014121`:

1. Restore container `serengeti-eos-gate-c-123-restore-pg` **removed**.
2. Restore volume `serengeti-eos-gate-c-123-restore-pgdata` **removed**.
3. `gatec-123.dump` **kept** in the evidence run directory.
4. `serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata` **not** destroyed; source remained running.

---

## 13. Next governed action

Gate C remains **OPEN**. Migration 123 is **EXECUTED / POST-EXECUTION VERIFICATION PASSED**. Remaining Gate C work requires **separate** owner authorization.

This procedure does **not** execute further DDL.

**STOP** — do not re-run migration 123 from this document.
