# H-112 Dev/Test operator runbook

> **Not a Production runbook.**  
> **Not UAT.** **Not H-81.** **Not Gate B.** **Not EOS adoption.**  
> **Not authorization to migrate, restore, or operate Production.**

This runbook tells an operator how to start, stop, and distinguish the two H-112 Dev/Test database environments. It does not satisfy Production RTO/RPO, PITR, HA, or cutover requirements.

**Date:** 2026-09-21.  
**HEAD at H-112 start:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`. Do not treat dirty-tree work as committed.

---

## 1. Two environments — never interchange them

| | Bounded F2 (H-111 validated) | Isolated full-schema (H-112) |
| --- | --- | --- |
| Label | F2-DP-01 sidecar, 124-only | Complete authorized migration chain |
| Host/port | `127.0.0.1:5432` | Dedicated container `127.0.0.1:5435` (see §4) |
| Database | `eos` | `eos_h112_full` |
| Schema | Six F2 sidecar maps only | `schema.sql` then `001`…`124` (files `112`–`116` are absent from the repository) |
| `schema_migrations` | **Must remain absent** | Present; records applied files |
| API opt-in | `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` | `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP=true` |
| Mixed SQL durable | **false** (sidecar-only) | **true** |
| Named log branch | `F2-DP-01-BOUNDED-DEVTEST-API-STARTUP` | `H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` |
| Demo seed | Do not use to “complete” mixed C-spine | **Keep `EOS_SEED_DEMO=false`** (CRM FK / proposal seed is unsafe) |
| Global `migrate()` | **Refused** (`h111_eos_124_only_preserved`) | Allowed only against `eos_h112_full` |

The two opt-in flags are **mutually exclusive**. The API refuses:

- database name `eos` on the full-schema flag;
- database name `eos_h112_full` is not the bounded target;
- `eos_gateb` (Gate B remains unauthorized);
- Production-like env (`EOS_ENV`/`NODE_ENV` production or uat);
- unidentified / wrong host / wrong port / wrong database name.

The bounded database must never be made to pretend it is a complete EOS catalog. If a required mixed table is absent, mixed SQL must fail closed — do not paper over that on `eos`.

---

## 2. Shared Dev/Test process rules

- Listen on `127.0.0.1` only. Do not treat `0.0.0.0` as a Production bind decision.
- Dev bootstrap principals (`carol.admin@sedmc.local` / `test-carol-not-for-prod` / tenant `sedmc`) are **Dev/Test only**.
- Do not commit `.env`, passwords, or connection strings with secrets.
- Do not run `npm run migrate -w @sedmc/db` unless `EOS_DATABASE_URL` names `eos_h112_full`.
- Do not create `schema_migrations` on `eos`.
- Do not initialize Gate B / `eos_gateb`.
- Do not apply migrations `001`–`123` or `125+` to `127.0.0.1:5432/eos`.
- Windows console **SIGINT** is not the proven shutdown path. Use **SIGTERM** to the Node process (or the bounded POST trigger on the bounded branch only).

Health:

```text
GET /health
GET /ready
```

Both should return HTTP 200 when the selected database is reachable. Unauthenticated `/v1/me` should return **401**.

---

## 3. Bounded F2 startup (preserve H-111)

Prerequisite: the existing compose Postgres from `infra/compose/dev.yaml` with database `eos` on `127.0.0.1:5432`. That volume is the validated 124-only catalog. **Do not migrate it.**

```powershell
$env:EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP = "true"
$env:EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP = $null
$env:EOS_DATABASE_URL = "postgres://eos:eos-dev-only@127.0.0.1:5432/eos"
$env:EOS_PORT = "18115"
$env:EOS_LISTEN_HOST = "127.0.0.1"
$env:EOS_ENV = "development"
$env:EOS_TOKEN_SECRET = "replace-with-long-random-dev-secret"
# bootstrap passwords from .env.example
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
npx tsx src/main.ts
```

Working directory: `apps/api`.

Expected log: `f2_dp01_bounded_devtest_api_startup` with `mixedSqlDurable: false` and `globalMigrateInvoked: false`.

If default (non-bounded) startup is pointed at `eos`, the API **exits 1** with `database_startup_refused_124_only_eos`. That is correct.

Bounded shutdown: SIGTERM, or the opt-in bounded POST trigger documented in H-107/H-111 — **not** a Production drain.

Rollback/recovery for the bounded catalog: do **not** recreate it by running `001`–`124`. Restore from the existing validated volume/backup procedure already used for H-111. Recreating `eos` via global migrate would destroy the 124-only safety baseline.

---

## 4. Isolated full-schema Dev/Test database

Do **not** create `eos_h112_full` on the compose instance that serves `eos` unless an operator has explicitly created a **separate database name** on that instance **and** confirmed it is not `eos`. The H-112 live environment used a **dedicated disposable container** so port `5432`/`eos` stays untouched:

```text
container: serengeti-eos-h112-full-pg
image:     postgres:16-alpine
publish:   127.0.0.1:5435 -> 5432
user:      eos_h112
database:  eos_h112_full
password:  Dev/Test only (see local env; do not commit)
```

Create (example; password stays in the operator shell, not in git):

```powershell
docker run -d --name serengeti-eos-h112-full-pg `
  -e POSTGRES_USER=eos_h112 `
  -e POSTGRES_PASSWORD=eos-h112-dev-only `
  -e POSTGRES_DB=eos_h112_full `
  -p 127.0.0.1:5435:5432 `
  postgres:16-alpine
```

Label: **Dev/Test disposable**. No Production credentials. No customer data. No operational SoR data.

### 4.1 Apply the migration chain (full-schema only)

From the repository root, with `EOS_DATABASE_URL` set **in the same shell**:

```powershell
$env:EOS_DATABASE_URL = "postgres://eos_h112:eos-h112-dev-only@127.0.0.1:5435/eos_h112_full"
npm run migrate -w @sedmc/db
```

CLI refuse reasons:

- `h111_eos_124_only_preserved` — URL database name is `eos`
- `eos_gateb_not_authorized` — URL database name is `eos_gateb`

A refused migrate exits **1** and applies **nothing**.

Success JSON includes `applied` (file ids) and `productionReady: false`. Re-running migrate against an already-migrated `eos_h112_full` applies `[]` (idempotent via `schema_migrations`).

**File inventory:** `packages/db/schema.sql` then `packages/db/migrations/*.sql` sorted alphabetically. Present through `124_f2_dp01_commercial_facts.sql`. Numbers `112`–`116` are **missing files** (numbering hole, not a failed apply). No `125+` in this repository; do not invent them.

If a file fails: migrate rolls back **that file’s transaction**, does not record it, and throws. Stop. Do not repair by pointing the CLI at `eos`. Record the first failing id, the error, and whether a safe SQL repair is authorized. H-112 live apply of `001`→`124` on `eos_h112_full` completed with **no failing file**.

### 4.2 Reset / recreate

Disposable by design:

```powershell
docker rm -f serengeti-eos-h112-full-pg
# then docker run ... as above, then migrate again
```

This does **not** roll back Production (none is authorized). It does **not** reset `127.0.0.1:5432/eos`.

---

## 5. Full-schema API startup

```powershell
$env:EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP = "true"
Remove-Item Env:EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP -ErrorAction SilentlyContinue
$env:EOS_DATABASE_URL = "postgres://eos_h112:eos-h112-dev-only@127.0.0.1:5435/eos_h112_full"
$env:EOS_PORT = "18116"
$env:EOS_LISTEN_HOST = "127.0.0.1"
$env:EOS_SEED_DEMO = "false"
$env:EOS_ENV = "development"
$env:EOS_TOKEN_SECRET = "replace-with-long-random-dev-secret"
# bootstrap passwords from .env.example
Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
npx tsx src/main.ts
```

Working directory: `apps/api`.

Expected logs:

- `database_migrated` with `applied: []` (migrations already applied by CLI), `namedBranch: H-112-FULL-SCHEMA-DEVTEST-API-STARTUP`, `mixedSqlDurable: true`
- `pg3_crm_hydrate`
- listen on `127.0.0.1:18116` (or the chosen `EOS_PORT`)

**Do not set `EOS_SEED_DEMO=true` on this path.** Live H-112 evidence showed demo seed failing closed on mixed CRM foreign keys and later `proposal_create_failed:404 rfp_not_found`.

After hydrate, organization-type and relationship-type **PostgreSQL ids** replace process-local seed ids for that tenant. Clients must GET `/v1/crm/organization-types` and use those ids on POST `/v1/crm/organizations`.

Mixed SQL creates opportunity/RFP/programme in PostgreSQL without copying them into process-local Store. Commercial-facts GET/PUT look up those entities from mixed SQL first. Do not expect process-local Store to be SoR on this path.

Shutdown: send **SIGTERM** to the Node process. Confirm `shutdown_started` / `shutdown_completed` (or process exit 0) and that the listen port is released. Do not use this as a Production drain runbook.

---

## 6. Database selection checklist

Before starting the API, confirm:

1. Which catalog is intended (bounded `eos` vs full `eos_h112_full`).
2. Exactly one opt-in flag.
3. `EOS_DATABASE_URL` host, port, and database name match that flag’s allow-list.
4. `EOS_SEED_DEMO=false` on full-schema.
5. `EOS_ENV` is not production/uat.
6. You are **not** targeting `eos_gateb`.

If unsure, do not start.

---

## 7. Troubleshooting

| Symptom | Meaning | Action |
| --- | --- | --- |
| CLI migrate `h111_eos_124_only_preserved` | URL names `eos` | Stop. Point at `eos_h112_full` or do not migrate. |
| API `database_startup_refused_124_only_eos` | Default/full-schema path pointed at `eos` | Use bounded opt-in for `eos`, or full-schema URL for `eos_h112_full`. |
| API `bounded_and_full_schema_mutually_exclusive` | Both flags set | Unset one. |
| API `bounded_eos_not_authorized` | Full-schema flag + database `eos` | Wrong pairing. |
| `crm_organizations_organization_type_id_fkey` | Client used process-local type ids | GET organization-types after hydrate; retry. Fixed in H-112 hydrate adoption. |
| Demo seed CRM FK / proposal 404 | `EOS_SEED_DEMO=true` on mixed SQL | Restart with `EOS_SEED_DEMO=false`. Do not “fix” by migrating `eos`. |
| Mixed relation does not exist on `eos` | Bounded catalog is not full C-spine | Expected. Use `eos_h112_full` for mixed SQL. |
| `/health` not 200 | Process down or DB down | Check container/compose and listen port. |
| Login 401/invalid_credentials | Wrong principal or missing bootstrap env | Use documented Dev/Test carol credentials. |
| 409 `*_immutable` | Body id ≠ path id | Expected identifier protection. |

---

## 8. Health, readiness, authorization smoke

```text
GET  /health                         → 200
GET  /ready                          → 200
GET  /v1/me                          → 401 without token
POST /v1/auth/login                  → 200 with Dev/Test carol
GET  /v1/crm/accounts/:id/commercial-facts → 401 without token
```

Object-level authorization remains `authorize()` on each route. Client Save visibility is not a substitute.

---

## 9. What this runbook does not cover

- Production deployment or Production migration
- UAT sign-off, H-81, H-80 exit
- Gate B / `eos_gateb`
- Live operational SoR cutover
- Mailbox / Excel / WhatsApp / phone ingestion
- Booking, KPI history, revenue/profit, FX (requirements remain undefined or governance-gated)
- Rate-identity operator restart (H-111 **STOPPED**; H-112 does not silently restart it)
- Windows SIGINT as a supported shutdown proof

If Production-like configuration is requested, refuse and keep this document labelled Dev/Test only.
