# ADR-0006 Dev/Test Schema Bootstrap Authorization Package

> **`DEV/TEST SCHEMA BOOTSTRAP AUTHORIZATION PACKAGE`**  
> **`AUTHORIZATION B EXECUTED 2026-09-15 (SEE §12.2)`**  
> **`THIS FILE DID NOT GRANT GATE B TESTS; AUTHORIZATION C WAS LATER EXECUTED — CLOSURE IN GATE B PACKAGE §19`**  
> **`NOT A GATE C GRANT`**  
> **`NOT A UAT GRANT`**  
> **`NOT A PRODUCTION GRANT`**  
> **`NOT A DEPLOYMENT GRANT`**

**This file does not by itself authorize Gate B tests.** Named personal signature, legal authority title, and handwritten date remain **not invented**. Filling the attestation is reserved for the stakeholder. Execution evidence: failed first attempt §12.1; successful retry §12.2.

Predecessor: [`adr-0006-dtv-001-devtest-postgresql-schema-source.md`](adr-0006-dtv-001-devtest-postgresql-schema-source.md).

---

## 0. Preserved gate status

| Item | Status (unchanged by this amendment) |
| --- | --- |
| Gate A design approval | Already **APPROVED** (separate record). Does **not** approve this bootstrap. |
| Gate B implementation | Already **AUTHORIZED** (isolated Dev/Test code). Does **not** approve this bootstrap. |
| Gate B runtime verification | **Incomplete / BLOCKED** (DTV-001). Remains a **later** step after bootstrap, if bootstrap is later granted and completed. |
| Dev/Test schema bootstrap | **NOT YET AUTHORIZED** |
| Gate C | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |
| Production migrations | **NOT AUTHORIZED** |
| Deployment | **NOT AUTHORIZED** |

Review of this file is **not** authorization of Gate C, UAT, or Production. §0 is the **amendment-time** snapshot. Successor: Authorization B executed (§12.2); Authorization C later executed; Gate B **CLOSED / VERIFICATION ACCEPTED** in [`adr-0006-gate-b-dev-test-implementation-authorization.md`](adr-0006-gate-b-dev-test-implementation-authorization.md) §19.

---

## 1. Why this package is necessary

DTV-001 established:

- no dedicated Dev/Test PostgreSQL is currently available;
- no approved existing Dev/Test snapshot/schema source was identified;
- Stage 4B lab dumps are `lab_*` tables, not EOS Gate B schema;
- UAT (`serengeti-eos-uat-pgdata` / `serengeti-eos-uat-postgres`) cannot be used;
- blank database + unbounded `migrate()` is outside current **Gate B verification** authorization.

Without a **separate** bootstrap grant, Gate B verification cannot consume an already-existing compatible schema, because none is available in the verification environment.

---

## 2. Single proposed method (the only executable path)

**One method only.** There is no backup-restore path and no clone path in this package: no approved EOS Dev/Test snapshot or clone source was identified.

### Proposed method

> Establish a **dedicated, disposable, local Dev/Test PostgreSQL instance** whose schema is created by **bounded replay of an explicitly enumerated set of EXISTING repository SQL files**, in a fixed order, sufficient for the Gate B verification harness.

This is **not**:

- “latest repository schema”;
- “full catalogue replay”;
- “all migrations”;
- “015–122” alone;
- `packages/db` `migrate()` / `npm run migrate -w @sedmc/db`.

`migrate()` always creates `schema_migrations` and applies `schema.sql` plus **every** unrecorded file in `packages/db/migrations/` (117 SQL files as of inspection). **Calling `migrate()` is not the proposed method** and remains **not authorized** by this package.

### Why 014 is in the bounded set (`sup_rates`)

Migration `122_cd_programme_item_extensions.sql` is required for `prg_programme_versions` and for RFP/programme columns used by Gate B. **The same file also `ALTER TABLE sup_rates`.** Applying the existing 122 file therefore requires `sup_rates` to exist first.

`sup_rates` is created in `014_c4_supplier.sql` (which also creates other C4 supplier tables in the same file; the file cannot be split without a new artifact).

**A dedicated Gate B schema artifact** that extracted only the Gate B portions of 122 (omitting `ALTER TABLE sup_rates`) **would require a separate implementation authorization.** This package does **not** create that artifact. The proposed method therefore includes **existing** `014_c4_supplier.sql` as a **file-level predecessor of 122**, not as authorization of supplier-domain persistence work.

### Why 001 is in the bounded set

`upsertPrincipal` (used if bootstrap identities are synced) writes `principals.attributes`. That column is added in `001_i1_admin_shell.sql`, not in `schema.sql`.

---

## 3. Exact SQL inputs and order

Apply **only** these existing files, **in this order**, each file’s SQL as committed in the repository, unchanged:

| Order | Repository path | Why included |
| --- | --- | --- |
| 1 | `packages/db/schema.sql` | Extension `pgcrypto`; `tenants`; `organisations` / `org_units` (FK predecessors of `principals`); `principals`; `principal_credentials`; `audit_events` (insert-only trigger); base `outbox_events`; `schema_registry` (used by later files). |
| 2 | `packages/db/migrations/001_i1_admin_shell.sql` | `principals.attributes` (and `external_subject_id`) required by existing principal upsert SQL. |
| 3 | `packages/db/migrations/003_i4_outbox_events.sql` | `outbox_events` columns used by `insertOutboxEventOn`. |
| 4 | `packages/db/migrations/014_c4_supplier.sql` | Creates `sup_rates` so existing file 122 can run. |
| 5 | `packages/db/migrations/015_c2_opportunity.sql` | `opp_opportunities`, `opp_stage_history`. |
| 6 | `packages/db/migrations/016_c3_rfp.sql` | `rfp_rfps`, `rfp_versions`. |
| 7 | `packages/db/migrations/017_c5_programme.sql` | `prg_programmes`, `prg_days`, `prg_items`. |
| 8 | `packages/db/migrations/018_c6_costing.sql` | `cost_sheets`, `cost_line_items`, `cost_sheet_versions`. |
| 9 | `packages/db/migrations/019_c7_commercial_approval.sql` | `com_approval_requests`. |
| 10 | `packages/db/migrations/119_cd_commercial_documents.sql` | `commercial_documents`. |
| 11 | `packages/db/migrations/122_cd_programme_item_extensions.sql` | `prg_programme_versions`; additive columns on `rfp_rfps` / `prg_programmes` / `prg_items`; **also** alters `sup_rates`. |

**Prohibited during bootstrap execution:** any other file under `packages/db/migrations/`; `packages/db/src/index.ts` `migrate()`; `packages/db` `migrate-cli.ts`.

**Application pattern (when Authorization B is later granted):** for each listed file, run that file’s SQL in a **single transaction** (BEGIN / file SQL / COMMIT), then proceed to the next file. Do **not** create or modify `schema_migrations` unless a later execution grant explicitly requires an id scheme; this disposable instance must **never** be handed to unbounded `migrate()`.

Inspection note: no later migration (other than 003 and 122) `ALTER`s the Gate B jointly-critical tables listed in §5. Skipping files 002, 004–013, 020–118, 120–121, and 123+ is therefore compatible with current Gate B repository SQL **provided** 001, 003, 014, 015–019, 119, and 122 are applied as listed.

---

## 4. `outbox_events` column dependency

`schema.sql` creates `outbox_events` with: `id`, `tenant_id`, `event_type`, `payload`, `classification`, `created_at`, `published_at`, `attempts`.

`insertOutboxEventOn` (`apps/api/src/persistence/pg-repository.ts`) also inserts:

- `envelope` (JSONB)
- `status` (TEXT, check `pending` / `published` / `dead_letter`)
- `last_error`
- `correlation_id`
- `aggregate_id`

Those columns are added by **`003_i4_outbox_events.sql`**. File 003 also creates `event_catalogue`, `dead_letter_events`, and `processed_events` because they are in the same existing file (file-level extra objects, not a catalogue replay).

---

## 5. Expected bootstrap final state

After successful bounded replay, the disposable database **must** contain at least:

1. `tenants`  
2. `principals`  
3. `opp_opportunities`  
4. `opp_stage_history`  
5. `rfp_rfps`  
6. `rfp_versions`  
7. `prg_programmes`  
8. `prg_days`  
9. `prg_items`  
10. `prg_programme_versions`  
11. `cost_sheets`  
12. `cost_line_items`  
13. `cost_sheet_versions`  
14. `com_approval_requests`  
15. `commercial_documents`  
16. `audit_events`  
17. `outbox_events` (including §4 columns)

plus **only** prerequisite / file-atomic objects required to create those structures from the listed files, including at least:

- `pgcrypto` extension  
- `organisations`, `org_units` (principals FK chain in `schema.sql`)  
- `principal_credentials`  
- `schema_registry`  
- `audit_events_immutable` trigger (insert-only `audit_events`)  
- from 001 (same file as `attributes`): `locations`, `cost_centers`, `groups`, `group_members`, extra `org_units` / `principals` columns  
- from 003 (same file as outbox columns): `event_catalogue`, `dead_letter_events`, `processed_events`  
- from 014 (same file as `sup_rates`): `sup_import_batches`, `sup_suppliers`, `sup_contacts`, `sup_rates`, `sup_content_blocks`, `sup_import_execute_idempotency`

**Explicitly NOT added:**

- Gate C RFP → Opportunity FK (`rfp_rfps.opportunity_id` → `opp_opportunities.id`) — 016 leaves `opportunity_id` unconstrained to `opp_opportunities`.  
- Gate C Programme → RFP FK (`prg_programmes.rfp_id` → `rfp_rfps.id`) — 017 leaves `rfp_id` unconstrained to `rfp_rfps`.  
- Gate C unique active programme-per-RFP constraint.  
- No new Gate C migration SQL.  
- No Production migration, backfill, or cutover.  
- No participant/rooming tables.  
- No files 002, 004–013, 020–118, 120–121, or later catalogue modules (CRM dual-write, notifications, AI, HR, ITSM, ERM, privacy, etc.).

---

## 6. Dev/Test SQL replay vs Gate C

**A. Repository SQL replay for a separately authorized disposable Dev/Test bootstrap**

Execution of the **specifically enumerated** existing repository SQL in §3, solely to establish the disposable Gate B Dev/Test verification schema described in §5, is a **Dev/Test bootstrap action** — and **only if Authorization B is granted**.

It does **not** authorize creation or execution of **new** Gate C migration work, Production migration, Production backfill, Production cutover, or the application/database relationship changes identified in [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md).

**B. Gate C migration work**

Gate C remains the authorization for **new** schema (FKs, unique active programme-per-RFP, Production indexes/scripts, backfill, cutover) and for Production/UAT migration. This package does **not** claim that “migration execution” in general is outside Gate C. Unbounded `migrate()` of the full catalogue is **not** this bootstrap and is **not** authorized here.

---

## 7. Disposable instance (proposed, not created)

| Item | Proposed value |
| --- | --- |
| Environment | Dev/Test only |
| Purpose | Schema prerequisite for **later** Gate B PostgreSQL runtime verification |
| Engine | PostgreSQL |
| Image (proposed pin, not pulled) | `postgres:16-alpine` (same image family as `infra/compose/dev.yaml`; not started by this document) |
| Bind | `127.0.0.1` only — no public bind, no `0.0.0.0` |
| Host port (proposed) | `5434` mapped to container `5432` (must **not** use UAT host port `5433`) |
| Container name | `serengeti-eos-gate-b-pg` |
| Volume name | `serengeti-eos-gate-b-pgdata` |
| Shared DB | **Forbidden** — this instance must not be UAT, Production, or a developer’s mixed database |
| UAT volume | **Forbidden** — not `serengeti-eos-uat-pgdata`; not container `serengeti-eos-uat-postgres` |
| Production | **Forbidden** |
| Lifecycle | Disposable: instance **and** volume **must** be destroyed after the verification lifecycle (or on bootstrap failure) |

These names are unused in the repository at amendment time and are distinct from UAT naming.

---

## 8. Credentials and connectivity

- Connection only via `EOS_DATABASE_URL` targeting **this** dedicated database.  
- Secret must **not** be committed.  
- Secret must **not** be printed in logs, chat, or governance reports.  
- Credentials must be **disposable local Dev/Test** credentials created for this instance only.  
- **No** UAT or Production credentials may be used.  
- Reachable only from the intended local verification environment (`127.0.0.1`).

This document does **not** create credentials.

---

## 9. Data prohibitions

**Prohibited:** Production data; UAT data; customer data; live RFPs; live programmes; live opportunities; live commercial documents; real participant data; real financial/customer records.

**Allowed:** synthetic Gate B verification data only (e.g. `GBV-` / `*-GBV-*` identifiers), and only after schema exists.

`audit_events` is insert-only. **Audit residue generated during verification is acceptable only because the entire database instance and its volume are disposable and are required to be destroyed after the verification lifecycle.**

---

## 10. Failure handling

If bootstrap fails:

1. Do **not** attempt rollback against any shared database.  
2. Stop using the failed disposable instance.  
3. Discard/destroy the dedicated database instance **and** volume (`serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata`).  
4. Do **not** retry against UAT or Production.  
5. Preserve only governance/log evidence needed to explain the failure (no secrets).  
6. Return to human review if failure indicates the bounded SQL set is incorrect.

No destructive action against any non-disposable environment is authorized.

---

## 11. Three distinct authorizations

### Authorization A — Prepare (**not granted**)

If later granted separately or as an explicit subset, would allow only:

- inspect Docker availability;  
- prepare a disposable local PostgreSQL **definition** (names in §7);  
- prepare connection configuration **without** committing secrets.

Does **not** start the instance or apply SQL.

### Authorization B — Execute bootstrap (**not granted**; this package’s future grant target)

If this package is later granted, it would allow **only**:

- start the dedicated disposable instance in §7;  
- apply **only** the SQL files in §3 in the stated order;  
- verify §5 final state (tables + `outbox_events` columns);  
- record which file paths were applied and in what order;  
- confirm Gate C FK/unique objects are **absent**;  
- confirm UAT/Production were not touched.

Does **not** authorize Gate B tests. Does **not** authorize `migrate()`. Does **not** authorize other migration files.

### Authorization C — Gate B PostgreSQL verification (**not granted here**)

> **Authorization of this bootstrap package does NOT authorize execution of the Gate B PostgreSQL verification suite.**

Gate B runtime verification remains a **later, separate** action after the database prerequisite exists. The harness must remain migration-free (`EOS_RUN_PG_TESTS=1` must not call `migrate()`).

---

## 12. Evidence required if Authorization B is later executed

### 12.1 Execution evidence — Authorization B attempt (2026-09-15)

Human instruction granted **Authorization B only** (Execute Bootstrap). Authorization C, Gate C, UAT, Production, `migrate()`, Gate B tests, commits, pushes, and PRs remained **not authorized**.

**Result: STOPPED before instance create. No SQL applied. No disposable instance left running.**

| Evidence item | Recorded fact |
| --- | --- |
| Authorization used | Section B — Execute Bootstrap only |
| Environment classification | Intended Dev/Test; instance **not created** |
| Collision check (host) | `127.0.0.1:5434` not listening; `5433` and `5432` also not listening at check time |
| Collision check (Docker names) | **Incomplete** — Docker Linux engine was not available, so `serengeti-eos-gate-b-pg` / `serengeti-eos-gate-b-pgdata` could not be listed. Last prior engine log (same day, before VM power-off) queried volume `serengeti-eos-uat-pgdata` only; that UAT volume/container was **not used** |
| Container | **Not created** (`serengeti-eos-gate-b-pg`) |
| Volume | **Not created** (`serengeti-eos-gate-b-pgdata`) |
| Bind / port | Not bound (`127.0.0.1:5434` unused) |
| PostgreSQL version | N/A — engine did not start |
| SQL files executed | **None** of the 11 authorized files |
| `schema_migrations` | Not created (no database) |
| Gate B tables | Not verified (no database) |
| `outbox_events` columns | Not verified (no database) |
| Gate C RFP→Opportunity FK | Not created; not verified in a database (no database) |
| Gate C Programme→RFP FK | Not created; not verified in a database (no database) |
| Gate C unique active programme-per-RFP | Not created; not verified in a database (no database) |
| UAT database/volume used | **No** |
| Production database used | **No** |
| Live/customer data | **None** |
| `migrate()` / full catalogue | **Not invoked** |
| Gate B tests | **Not executed** |
| Credentials | **None established**; `EOS_DATABASE_URL` not written to any file |
| Disposal | Nothing to destroy: dedicated instance and volume were never created. No destructive action against any other database |

**Stop cause (prerequisite, not SQL failure):** Docker Desktop client is present, but the Linux/WSL engine failed to start. Host log: WSL `CreateVm` / `AttachDisk` `HCS/0x800705aa` — “Insufficient system resources exist to complete the requested service.” Host physical memory at check: approximately 2.73 GB free of 15.28 GB. Windows service `com.docker.service` was Stopped; starting it from this non-elevated session failed. `wsl --shutdown` was **not** performed (host-level WSL control is outside this bootstrap authorization).

No substitute PostgreSQL was started (no UAT, no Production, no local non-Docker instance, no other container/volume names).

This evidence does **not** authorize Authorization C, Gate C, UAT, Production, or a retry against any other database. A later Authorization B retry requires a working Docker Linux engine and sufficient host resources to start `postgres:16-alpine` as `serengeti-eos-gate-b-pg` on `127.0.0.1:5434`.

### 12.2 Execution evidence — Authorization B retry (2026-09-15)

Human instruction granted **Authorization B only** (Execute Bootstrap retry after separate host remediation restored the Docker Linux engine). Authorization C, Gate C, UAT, Production, `migrate()`, Gate B tests, commits, pushes, and PRs remained **not authorized**. `EOS_DATABASE_URL` was **not** written to any repository or environment file.

**Result: SUCCESS. Disposable Dev/Test schema bootstrap completed. Instance left running for a later, separately authorized Gate B verification. Gate B tests were not executed.**

| Evidence item | Recorded fact |
| --- | --- |
| Authorization used | Section B — Execute Bootstrap only |
| Environment classification | Disposable local Dev/Test |
| Docker Linux engine | Healthy (`desktop-linux`; Engine 29.8.0) before instance create |
| Collision check (host) | `127.0.0.1:5434` not listening before create |
| Collision check (Docker names) | No existing `serengeti-eos-gate-b-pg` container; no existing `serengeti-eos-gate-b-pgdata` volume |
| Image | `postgres:16-alpine` (already present locally; same family as `infra/compose/dev.yaml`) |
| Container | **Created** `serengeti-eos-gate-b-pg` |
| Volume | **Created** `serengeti-eos-gate-b-pgdata` |
| Bind / port | `127.0.0.1:5434` → container `5432` |
| PostgreSQL version | **16.15** |
| SQL mechanism | `psql -v ON_ERROR_STOP=1 --single-transaction` per file via `docker exec`; **not** `migrate()` |
| SQL files executed (order) | 1 `packages/db/schema.sql` PASS; 2 `001_i1_admin_shell.sql` PASS; 3 `003_i4_outbox_events.sql` PASS; 4 `014_c4_supplier.sql` PASS; 5 `015_c2_opportunity.sql` PASS; 6 `016_c3_rfp.sql` PASS; 7 `017_c5_programme.sql` PASS; 8 `018_c6_costing.sql` PASS; 9 `019_c7_commercial_approval.sql` PASS; 10 `119_cd_commercial_documents.sql` PASS; 11 `122_cd_programme_item_extensions.sql` PASS |
| `schema_migrations` | **Absent** (not created; bounded replay did not use catalogue bookkeeping) |
| Gate B tables | All 17 required tables present: `tenants`, `principals`, `opp_opportunities`, `opp_stage_history`, `rfp_rfps`, `rfp_versions`, `prg_programmes`, `prg_days`, `prg_items`, `prg_programme_versions`, `cost_sheets`, `cost_line_items`, `cost_sheet_versions`, `com_approval_requests`, `commercial_documents`, `audit_events`, `outbox_events` |
| `outbox_events` columns | Present: `envelope`, `status`, `last_error`, `correlation_id`, `aggregate_id` |
| Gate C RFP→Opportunity FK | **ABSENT** |
| Gate C Programme→RFP FK | **ABSENT** |
| Gate C unique active programme-per-RFP | **ABSENT** (existing uniques on `prg_programmes` are primary key and `(tenant_id, programme_code)` only) |
| Row counts (identity/commercial) | `tenants` 0; `principals` 0; `opp_opportunities` 0; `rfp_rfps` 0; `prg_programmes` 0; `commercial_documents` 0 |
| UAT database/volume used | **No** (`serengeti-eos-uat-postgres` / `serengeti-eos-uat-pgdata` not started, stopped, inspected, or modified) |
| Production database used | **No** |
| Live/customer data | **None** |
| `migrate()` / full catalogue | **Not invoked** |
| Gate B tests | **Not executed** |
| Credentials | Disposable local Dev/Test credentials in the container environment only; **not** committed; **not** printed; `EOS_DATABASE_URL` **not** configured in files |
| Disposal | **Not destroyed** after success (instance retained for later separately authorized verification). Remains disposable Dev/Test; not UAT or Production |

This evidence does **not** authorize Authorization C, Gate C, UAT, Production, application connection, or Gate B verification.

---

## 13. What a future grant of **this** package would and would not do

**Would authorize (Authorization B only):** §7 instance + §3 bounded SQL replay + §5 verification + §10 failure disposal.

**Would not authorize:**

- Gate C (including RFP→Opportunity FK, Programme→RFP FK, unique active programme-per-RFP, Production indexes, Production backfill/cutover);  
- UAT or Production migration;  
- deployment;  
- hosting/provider/region selection;  
- live customer data;  
- `serengeti-eos-uat-pgdata` / `serengeti-eos-uat-postgres`;  
- unbounded `migrate()`;  
- Gate B verification suite (Authorization C);  
- a new split-122 SQL artifact (separate implementation authorization).

---

## 14. Status

| Item | Status |
| --- | --- |
| This bootstrap package | Authorization B **EXECUTED** 2026-09-15 (see §12.2). Attestation table below remains blank (no invented signature). |
| Authorization A (prepare) | **NOT AUTHORIZED** as a standalone grant |
| Authorization B (execute bootstrap) | **GRANTED** and **EXECUTED** — disposable instance + 11-file bounded SQL replay complete |
| Authorization C (Gate B PG tests) | Later **GRANTED** and **EXECUTED** (initial PARTIAL; remediations; then PASS). Closure: [`adr-0006-gate-b-dev-test-implementation-authorization.md`](adr-0006-gate-b-dev-test-implementation-authorization.md) §19. This bootstrap file did not grant C. |
| Gate C | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |

**Do not provision a database from this file.**

---

## 15. Attestation (stakeholder only — left blank)

| Field | Value |
| --- | --- |
| Name | |
| Role / authority | |
| Date | |
| Decision (`AUTHORIZED` / `REJECTED` / `DEFER`) | |
| If AUTHORIZED, confirms Authorization B only (not A unless stated, not C) | |
| Signature | |
