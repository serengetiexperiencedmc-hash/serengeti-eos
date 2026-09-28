# H-187 — Production Startup Control-Flow and Write-Safety Gate

> **DEV/TEST ENGINEERING SAFETY REMEDIATION ONLY.**  
> Makes Production/UAT startup write-safety an explicit invariant, not an accident of earlier `process.exit`.  
> **NOT** Production deployment. **NOT** UAT. **NOT** Production readiness. **NOT** Production implementation authorization.  
> H-181 through H-186 were **inspected and not rewritten**. H-81 remains **OUT OF SCOPE**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (pre-existing dirty set preserved; H-187 added the write-safety guard, tests, and this artefact)  
**Porcelain at start of this increment:** 689  
**Application fail-closed controls:** **UNCHANGED** (`productionReady: false`)  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-187 STATUS = COMPLETE — PRODUCTION/UAT STARTUP WRITE-SAFETY MADE EXPLICIT
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## A. Objective

H-185 identified `syncStoreToPostgres` after the startup migrate decision in `apps/api/src/main.ts`. H-186 confirmed that path is currently unreachable under `EOS_ENV=production` because `validateDeploymentConfig()` fails closed first.

That safety depended on **process ordering**. H-187 exists to prove, and if needed harden, that Production/UAT startup cannot fall through into implicit database mutation after migrations are skipped — even if an earlier validator is later changed or bypassed.

---

## B. Baseline

Verified at H-187 start (not assumed from H-186 alone):

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | 689 |
| Tracked diff vs HEAD | 182 |
| H-186 | complete; artefact present; **not rewritten** |

---

## C. Startup control-flow map

Traced from `apps/api/src/main.ts` (actual call order, not inferred from names):

1. **Environment selection** — `EOS_ENV` / `NODE_ENV` → `isProduction` and later `isProductionLikeEnv`.
2. **Deployment validation** — `validateDeploymentConfig(process.env)`; any `fatal` → `deployment_config_refused` → `process.exit(1)`.
3. **Token / identity / bootstrap** — `resolveDevTestTokenSecret`; `localPasswordIdentityForbiddenReason` (Production-like exit); `bootstrapSecretsFromEnv` or Dev defaults; **in-memory** `seedStore`.
4. **Named Dev/Test branches** — `decideF2Dp01BoundedDevtestApiStartup` / `decideH112FullSchemaDevtestApiStartup` (Production-like **refuse**).
5. **If `EOS_DATABASE_URL`:** `createPool`.
   - Bounded mode: F2 hydrate only (SELECTs); no global migrate; no `syncStoreToPostgres`.
   - Default path:
     1. `shouldApplyStartupMigrations` → `migrate()` **or** skip.
     2. `shouldSyncStoreToPostgresOnStartup` → `syncStoreToPostgres` **or** skip (**H-187**).
     3. Attach `store.dbPool`.
     4. Hydrates (CRM catalogue **writes** only when store-sync apply is true).
     5. `publishPendingOutbox` (operational drain).
6. If no URL and Production-like: exit. Else memory-only warning.
7. **Events / email adapters** — `initEventTransport` / `initEventConsumers` (Production-like forbids in-memory-dev).
8. **`buildServer`**. Demo seed only if `EOS_SEED_DEMO=true` and **not** Production-like.
9. **`app.listen`**.

---

## D. Startup mutation inventory

| Operation | Startup location | Read/write | Environment gate | Production reachable? | Intended? |
| --- | --- | --- | --- | --- | --- |
| `migrate()` | `main.ts` default DB path | write (schema) | `shouldApplyStartupMigrations` | **No** (`production_gate_c_not_authorized`) | Dev/Test empty catalogs only |
| `syncStoreToPostgres` | immediately after migrate skip/apply | write (upsert tenants/orgs/principals/sessions/audit) | **H-187** `shouldSyncStoreToPostgresOnStartup` | **No** (same reason; independent of validation exit) | Dev/Test bootstrap only (`sync.ts` comment) |
| CRM `syncCatalogues` via `hydrateCrmFromPostgres` | after store sync | write (org/relationship types) | **H-187** `persistCatalogues: storeSyncDecision.apply` | **No** | Dev/Test catalogue dual-write |
| Other `hydrate*` | after store sync | read → process memory | none (SELECT) | Only if validation later passed | Load SoR; not seed upsert |
| `publishPendingOutbox` | after hydrates | write if pending rows (`UPDATE` status) | none | Only if validation later passed | I4 operational drain; **not** in-memory seed push |
| `seedDemoCommercialData` | after `buildServer` | write via HTTP APIs | `EOS_SEED_DEMO` + Production-like **exit** + deployment-config fatal | **No** | Dev/Test demo only |
| `seedStore` | before DB | in-memory only | n/a | N/A (not a DB write) | Process bootstrap |
| Bounded F2 hydrate | named branch | read | Production-like **refuse** | **No** | Dev/Test sidecar |
| `validateDeploymentConfig` | first | none | fail-closed | Exits before DB | Required |

`syncStoreToPostgres` is **not** a documented Production operation. It is labelled Development/Test. H-187 does **not** authorize it for Production.

---

## E. Safety invariant

When `EOS_ENV=production` or `EOS_ENV=uat` (and `NODE_ENV=production` via the existing Production-like helper):

1. Startup migrations are **not** automatically executed.
2. Startup seed/demo data is **not** automatically executed.
3. Startup store synchronization **must not** mutate PostgreSQL unless a separate, documented Production-safe mechanism exists (none exists today).
4. Configuration validation remains fail-closed.
5. Startup **cannot** fall through into the Dev/Test `syncStoreToPostgres` path merely because an earlier exit was removed.

Development/Test migrate + store sync on isolated catalogs **remain enabled**.

---

## F. Root cause

**Case B.** Before H-187, Production/UAT write safety for `syncStoreToPostgres` depended **solely** on `validateDeploymentConfig()` terminating the process. After migrate skip, `await syncStoreToPostgres(pool, store)` was unconditional.

CRM hydrate also upserted in-memory catalogues. That is the same class of implicit startup write.

---

## G. Remediation

Minimum explicit guard. No persistence rewrite. No migrate-semantics change. No Production authorization change.

| File | Change |
| --- | --- |
| `apps/api/src/persistence/startup-migrations.ts` | Added `shouldSyncStoreToPostgresOnStartup()` — `apply: false` / `production_gate_c_not_authorized` when Production-like. |
| `apps/api/src/main.ts` | Call that decision **after** migrate skip/apply; `syncStoreToPostgres` only if `apply`; else `database_startup_store_sync_skipped`. |
| `apps/api/src/persistence/crm.ts` | `hydrateCrmFromPostgres(..., { persistCatalogues })`; Production/UAT pass `false`. |
| `apps/api/src/h187-startup-write-safety.test.ts` | **new** regression tests. |
| `apps/api/src/f2-dp-01.bounded-devtest-api-startup.test.ts` | Assert main.ts also names `shouldSyncStoreToPostgresOnStartup`. |

Dev/Test `dev` / `start` scripts unchanged. Fail-closed IdP / secrets / infra / object-store / events / email **not** weakened.

---

## H. Test evidence

| Suite | Tests | Result |
| --- | --- | --- |
| `h187-startup-write-safety` | 7 | passed |
| `e1-c-closure.identity-f1-restart` | 6 | passed |
| `e1-c-deployment-config` | 8 | passed |
| `e1-d-class-a.token-bootstrap` | 4 | passed |
| `f2-dp-01.bounded-devtest-api-startup` | 14 | passed |
| `h112-full-schema-startup` | 5 | passed |
| `f2-dp-01.bounded-devtest-shutdown-observability` | 9 | passed |
| **Total this increment** | **53** | **53 passed, 0 failed** |

Production: migrate not applied; store sync not applied; demo seed still fatal in `validateDeploymentConfig`.  
UAT: same.  
Development: migrate + store sync still `apply: true` on isolated catalog names; CRM hydrate still persists catalogues by default.

**Not run:** full workspace `npm test`.  
**Skipped:** Cloud Run, P19, Production migrate (out of scope / not in repo).

---

## I. Database mutation proof

Disposable catalog `eos_h187_rehearsal` on `127.0.0.1:55434` (container `eos-h187-pg`, `postgres:16-alpine`). Password **not recorded**. Container **removed** after rehearsal.

| Moment | Fingerprint |
| --- | --- |
| Empty, after compiled `EOS_ENV=production` and `uat` `node dist/main.js` | `tables=0; ledger=absent; tenants=absent` |
| After compiled Dev/Test start (intended migrate+sync) | `tables=158; ledger=121\|2026-09-22 20:56:19.965656+00; tenants=2; principals=6; crm_org_types=26` |
| After compiled `EOS_ENV=production` against that migrated catalog | **identical** (`UNCHANGED=True`) |
| After Dev/Test smoke + restart | ledger **unchanged**; `opps=1; accounts=1; rate_ids=1; orgs=1` |

Production/UAT compiled starts: **exit 1**, `deployment_config_refused`, **no** `database_migrated`, **no** `database_seed_synced`, **no** `api_listening`, **no** `ERR_MODULE_NOT_FOUND`. The process did not execute migrate/sync/seed mutation before exiting.

---

## J. Compiled runtime evidence

`npx tsc -p tsconfig.json` in `apps/api` **exit 0**. Dist contains `shouldSyncStoreToPostgresOnStartup` and `database_startup_store_sync_skipped`.

Compiled module:

```text
prodSync/uatSync/nodeProdSync apply:false reason:production_gate_c_not_authorized
devSync apply:true
prodMig/uatMig apply:false reason:production_gate_c_not_authorized
devMig apply:true
```

Runtime used **`node dist/main.js`**, not `tsx`, for Production/UAT fail-closed starts, Dev/Test migrate, smoke, and restart.

---

## K. Remaining concerns

- **`publishPendingOutbox` after hydrates** can `UPDATE` already-persisted pending outbox rows. That is I4 operational drain, not in-memory seed upsert. It remains unreachable today because validation still fails closed first.  
  `KNOWN FOLLOW-UP / NOT PART OF H-187` if Gate C and all fatals are later cleared.
- Dockerfile / Cloud Run / Cloud SQL / IaC still **absent** (not added).
- Owner/POA implementation grant, IdP/MFA, secrets/IAM, DNS/TLS, PITR/DR/P19, HUM-08, H-181 **authorized / sent NONE**.

No new defect that allows Production/UAT startup to upsert in-memory seed after migrate skip.

---

## L. Governance interpretation

| Class | Status |
| --- | --- |
| Engineering safety evidence | **H-187 write-safety guard proven** |
| UAT | **NOT produced** |
| Production readiness | **NOT claimed** (`productionReady` remains false) |
| Production authorization | **NOT granted** |

---

## M. Final determination

```text
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## N. Next governed action

H-187 closed the H-185/H-186 latent fall-through: Production/UAT store-sync is now an **explicit env gate**, not an accident of `validateDeploymentConfig` ordering.

Do **not** add Cloud Run/Terraform. Do **not** send H-181 from Cursor. Do **not** start H-81. Do **not** treat outbox drain as automatically in-scope for a new increment unless Owner/POA so directs.

The highest-value remaining work is still **organizational / Production-grant**: human H-181 send/queue from the appointed mailbox, and HUM-08 specialist naming.

---

## Audit and stop

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| H-181–H-186 | not rewritten |
| Fail-closed controls | unchanged |
| Commit / push | **NONE** |

```text
PROCESS STOPPED AFTER H-187
NEXT GOVERNED ACTION: Human H-181 send/queue and HUM-08 specialist naming.
  Do not provision GCP. Do not authorize Production.
```
