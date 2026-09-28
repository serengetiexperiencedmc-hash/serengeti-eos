# H-112 — Isolated full-schema Dev/Test validation

> **Dev/Test only.** Not UAT. Not Production. Not Gate B. Not H-81. Not EOS adoption.  
> This environment is **not** `127.0.0.1:5432/eos`.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged). Index empty. Dirty tree preserved.

---

## 1. Environment

| Fact | Value |
| --- | --- |
| Container | `serengeti-eos-h112-full-pg` |
| Image | `postgres:16-alpine` |
| Bind | `127.0.0.1:5435→5432` |
| Database | `eos_h112_full` |
| User | `eos_h112` |
| API | `http://127.0.0.1:18116` (`EOS_LISTEN_HOST=127.0.0.1`) |
| Opt-in | `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP=true` |
| Demo seed | `EOS_SEED_DEMO=false` |
| Named log branch | `H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` |
| `mixedSqlDurable` | `true` |
| Bounded flag | unset (mutually exclusive) |

Compose Postgres `compose-postgres-1` on `5432/eos` was not migrated. Gate B `serengeti-eos-gate-b-pg` on `5434` was not targeted.

---

## 2. Migration apply

CLI: `EOS_DATABASE_URL` → `127.0.0.1:5435/eos_h112_full`; `npm run migrate -w @sedmc/db`.

| Check | Result |
| --- | --- |
| Applied files | **120** (`db/schema.sql` + `migrations/001` … `111`, `117` … `124`) |
| First failing file | **none** |
| `125+` | **absent**; not applied |
| `112`–`116` | **missing from repository** (numbering hole, not a rollback) |
| Re-run migrate on API start | `database_migrated applied:[]` |
| CLI migrate against `127.0.0.1:5432/eos` | **refused** `h111_eos_124_only_preserved` (exit 1, nothing applied) |

Failure handling: `migrate()` wraps each file in a transaction and rolls that file back on error. No repair was required.

---

## 3. Bounded catalog preservation (control)

Queried `compose-postgres-1` / `eos` after full-schema work:

| Check | Result |
| --- | --- |
| `to_regclass('schema_migrations')` | **NULL** |
| `to_regclass('opp_opportunities')` | **NULL** |
| `f2_opportunity_facts` count | **3** (H-111 baseline unchanged) |

---

## 4. API startup

Second process (post catalogue-id + mixed-SQL lookup fixes), `npx tsx src/main.ts`:

- `database_migrated` `applied:[]` `namedBranch=H-112-FULL-SCHEMA-DEVTEST-API-STARTUP` `mixedSqlDurable=true`
- `pg3_crm_hydrate` (organizations 0 at this restart; live org already in PG from the prior process)
- `f2_dp01_commercial_facts_hydrate` **accounts=1** (prior live account facts survived)
- `api_listening` `http://127.0.0.1:18116`

First process with `EOS_SEED_DEMO=true` exited 1 (CRM FKs, then proposal 404). That is a finding, not a pass. Subsequent processes used `EOS_SEED_DEMO=false`.

---

## 5. Representative commercial workflow (HTTP)

Principal: Dev/Test `carol.admin@sedmc.local` / tenant `sedmc` only.

| Step | Result |
| --- | --- |
| `GET /health` | 200 |
| `GET /ready` | 200 `applicationReady: true` |
| `GET /v1/me` unauthenticated | **401** |
| `GET …/crm/accounts/:id/commercial-facts` unauthenticated | **401** |
| `POST /v1/auth/login` | 200 |
| `GET /v1/crm/organization-types` | 200; **13** types; ids match durable PG after hydrate adoption |
| `POST /v1/crm/organizations` | **201** `e1b2a4d9-8b2d-4f70-a8a6-900d74c0c33c` |
| `POST /v1/crm/accounts` | **201** `e6bb520a-0945-47f0-99c8-1d5cddccd772` |
| `PUT` account facts `{accountType:pco, market:united_kingdom}` | **200**; PCO distinct from event agency; market independent |
| `GET` account facts after process restart | **200**; same type/market; `persistence.recorded=true` |
| Conflicting `accountId` PUT | **409** |
| `POST /v1/pipeline/opportunities` | **201** `167cf8ec-a688-492f-b45c-329c822e4a34` |
| `POST /v1/rfps` | **201** `247a6ab2-e632-4746-8562-c60a810bf352` |
| `POST /v1/programmes` | **201** `5f6c89bf-11c5-4a74-bbfe-0b954f14ab40` |
| Opportunity/RFP/Path B/programme facts **before** SoR lookup fix | **404** (process-local Store empty) |
| Same facts **after** lookup fix + restart | PUT/GET **200** |
| Opportunity facts | `qualificationStatus=not_yet_assessed`; stage `rfp_received`; `persistence.mixedSqlDurable=true` |
| RFP facts | `primarySource=referral` `channel=email` `sourceDistinctFromChannel=true` `receivedAt=2026-09-21T10:00:00.000Z` |
| Path B | `categories=[exceptional_discounting]` `required=true` `status=pending` |
| Programme facts | `rfpObserved=true` note recorded `sellPriceTreatedAsRevenue=false` |
| Conflicting `rfpId` PUT | **409** |

No invented market taxonomy, KPI baseline, revenue, profit, or FX. `new_qualified` was not treated as qualification.

---

## 6. PostgreSQL counts after live writes (`eos_h112_full`)

| Relation | Count |
| --- | --- |
| `opp_opportunities` | 4 |
| `rfp_rfps` | 2 |
| `prg_programmes` | 2 |
| `crm_organizations` | 1 |
| `crm_accounts` | 1 |
| `f2_opportunity_facts` | 1 |
| `f2_rfp_facts` | 1 |
| `f2_path_b` | 1 |
| `f2_account_facts` | 1 |
| `f2_programme_facts` | 1 |

Opportunity/RFP/programme counts above the single intentional live chain are **leftovers from the failed `EOS_SEED_DEMO=true` attempt**. The catalog is disposable.

---

## 7. Shutdown

`node process.kill(listenPid, 'SIGTERM')` on PID owning `127.0.0.1:18116`:

- Listen port released.
- Wrapper (`npx tsx`) **exit 1**.
- Logs did **not** include `shutdown_started` / `shutdown_completed`.

This is **not** classified as the H-107/H-111 bounded deterministic shutdown evidence class. It is not a Production drain. Bounded POST trigger remains bounded-opt-in only.

---

## 8. What this validation does not claim

- Production connectivity or Production migration.
- UAT.
- That `eos` became full-schema.
- That demo seed works on mixed SQL.
- Browser UI against this API.
- Completeness of booking/KPI/revenue/FX/ingest because those tables exist in the chain.
