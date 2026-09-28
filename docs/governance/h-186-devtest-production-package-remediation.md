# H-186 — Dev/Test Production-Package Remediation

> **DEV/TEST PACKAGING REMEDIATION ONLY.**  
> Remediates two H-185 engineering defects: compiled API not executable with `node`, and undocumented web-build heap.  
> **NOT** Production deployment. **NOT** UAT. **NOT** Production readiness. **NOT** Production implementation authorization.  
> H-181 through H-185 were **inspected and not rewritten**. H-81 remains **OUT OF SCOPE**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (pre-existing dirty set preserved; H-186 added packaging/build files only)  
**Porcelain at start of this increment:** 682  
**Porcelain after this increment:** 689 (H-186 packaging files + this artefact; pre-existing dirty set preserved)  
**Application fail-closed controls:** **UNCHANGED** (`productionReady: false`)  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-186 STATUS = COMPLETE — DEV/TEST PACKAGING REMEDIATION PROVEN
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## A. Objective

H-185 proved migrate, production-like migrate refusal, and Dev/Test smoke, then recorded two packaging defects that would block a future compiled Production start:

1. `node dist/main.js` could not execute (workspace packages resolved TypeScript sources).
2. Canonical `next build` could OOM unless an operator set `NODE_OPTIONS=--max-old-space-size=8192`.

H-186 remediates those defects to the minimum defensible extent and proves the resulting package.

---

## B. Authority and boundaries

| Boundary | Status |
| --- | --- |
| Dev/Test only | **YES** |
| Production infrastructure | **NONE** |
| Production deployment | **NONE** |
| Production credentials / secrets | **NONE** |
| DR implementation / P19 | **NOT EXECUTED** |
| H-81 | **OUT OF SCOPE** |
| Cloud Run / Terraform / OpenTofu / Pulumi added | **NO** |
| Fail-closed Production validation weakened | **NO** |

Disposable catalog: `eos_h186_rehearsal` on `127.0.0.1:55433` (container `eos-h186-pg`, image `postgres:16-alpine`). Password **not recorded**. Container removed after rehearsal.

---

## C. Baseline

At H-186 start (verified, not assumed from H-185 alone):

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | 682 |
| Tracked diff vs HEAD | 179 files (pre-existing dirty set) |
| H-185 artefact | present, untracked, **not rewritten** |

H-186 packaging files were then added in this increment. After H-186: porcelain **689**, tracked diff **182**.

## D. H-185 findings

1. **Compiled API not runnable with Node** — `node dist/main.js` failed with `ERR_MODULE_NOT_FOUND` for `packages/db/src/migrate-guard.js` imported from `packages/db/src/index.ts`.
2. **Web build memory** — canonical `next build` OOM (exit 134) during “Collecting page data using 11 workers”; same build succeeded with an 8 GB heap.

---

## E. API root cause

Reproduced on this increment **before** the fix. `apps/api/dist/main.js` existed and is compiled JavaScript. It imports `@sedmc/db`.

`@sedmc/db` `package.json` had:

- `main`: `./dist/index.js` (unused when `exports` is present)
- `exports["."].import`: `./src/index.ts`

Node 24 ESM resolution honours `exports.import`, loads the **TypeScript source**, then follows that file’s `from "./migrate-guard.js"` specifier relative to `packages/db/src/`. `migrate-guard.js` does not exist next to the `.ts` file. `packages/db/dist/migrate-guard.js` **does** exist after `tsc`.

`@sedmc/kernel` had the same pattern (`import` → `./src/*.ts`), including subpaths `./field-cache-crypto` and `./personal-data-content-contract`.

This is **not** missing `tsc` emit, not path aliases, and not a bundler gap. It is **package `exports` pointing runtime `import` at TypeScript sources**.

---

`ROOT CAUSE: workspace package exports.import pointed at TypeScript sources; Node loaded packages/db/src/index.ts and failed on ./migrate-guard.js beside that .ts file.`

`SELECTED MINIMUM REMEDIATION: point runtime import/default at dist/*.js; keep types and a source condition on src/*.ts for Vitest/dev.`

## F. API remediation

Minimum packaging model:

> Node runtime (`import` / `default`) → compiled `dist/*.js`.  
> TypeScript (`types`) and Vitest/dev (`source` custom condition) → `src/*.ts`.

Changes:

| File | Change |
| --- | --- |
| `packages/db/package.json` | `exports["."].import`/`default` → `./dist/index.js`; added `source` → `./src/index.ts`. Preserved existing `apply-f2-dp01-124` script. |
| `packages/kernel/package.json` | Same for `.`, `./field-cache-crypto`, `./personal-data-content-contract`. Preserved the pre-existing personal-data subpath. |
| `apps/api/package.json` | `dev` → `node --conditions=source --import tsx src/main.ts` so Dev/Test still loads workspace TypeScript. Preserved `start`: `node dist/main.js`. |
| `apps/api/vitest.config.ts`, `packages/db/vitest.config.ts`, `packages/kernel/vitest.config.ts`, `apps/web/vitest.config.ts` | `resolve.conditions: ["source"]` so `npm test` does not require `dist` (CI still runs test before build). |

No bundler added. No fail-closed control changed. No Production secrets added.

---

## G. API build evidence

Commands (TypeScript emit):

```text
npx tsc -p tsconfig.json   # packages/db
npx tsc -p tsconfig.json   # packages/kernel
npx tsc -p tsconfig.json   # apps/api
```

All **exit 0**. Artefacts present: `packages/db/dist/index.js`, `packages/db/dist/migrate-guard.js`, `packages/kernel/dist/index.js`, `packages/kernel/dist/field-cache-crypto.js`, `packages/kernel/dist/personal-data-content-contract.js`, `apps/api/dist/main.js`.

Node import without tsx (from `apps/api`):

```text
import { createPool, listMigrationFiles } from '@sedmc/db'
→ {"files":121,"hasCreatePool":true}
```

---

## H. Node runtime evidence

Command: `node dist/main.js` (from `apps/api`). **No tsx.**

### H.1 `EOS_ENV=production`, missing mandatory config

**Exit 1.** Logs: `deployment_config_refused` (token, IdP, infra target, `EOS_DATABASE_URL`, local-fs, in-memory events, `dev-outbox`).  
**No** `ERR_MODULE_NOT_FOUND`. **No** `database_migrated`.

Interpretation: **compiled artefact executes correctly until deliberate configuration validation.**

### H.2 `EOS_ENV=production` with disposable DB URL and future-looking labels

**Exit 1.** Remaining fatals: IdP unselected; future infra not authorized; object-store adapter not implemented.  
**No** `database_migrated` / `database_startup_migrate_skipped`. Ledger fingerprint **unchanged**.

### H.3 Dev/Test compiled start

`EOS_ENV=development`, port **18186**, disposable catalog, `EOS_SEED_DEMO=false`.

```text
database_migrated  applied: []
api_listening      http://127.0.0.1:18186
```

**Process started with `node dist/main.js`.**

---

## I. Compiled API smoke evidence

Not UAT. Not H-185 reuse. Compiled `node dist/main.js` against `eos_h186_rehearsal`.

| Check | Result |
| --- | --- |
| Process starts | **PASS** |
| `GET /health` | **200**, `productionReady: false` |
| `GET /ready` | **200**, `applicationReady: true`, `database.ok: true` |
| DB connectivity | **PASS** |
| Login | **200** (Dev Carol) |
| Unauthenticated pipeline health | **401** |
| Opportunity `POST` | **201** |
| RFP `POST` | **201** |
| Account `POST` | **201** |
| Programme `POST` | **201** |
| Rate Identity GET/PUT | **200** / **200** |
| Missing opportunity | **404** |
| Logging | JSON `request_completed` with `correlationId` |
| Restart | **PASS** — second `node dist/main.js`; hydrate `organizations:1` `accounts:1` `rates:1`; SQL opps=1, rate identities=1 |
| Schema fingerprint | **unchanged** `121\|2026-09-22 20:27:23.311832+00` |

---

## J. Production migration safety regression

Mandatory after packaging changes.

| Probe | Migrate invoked? | Ledger |
| --- | --- | --- |
| `node dist/main.js` + `EOS_ENV=production` (missing config) | **NO** | n/a (no DB used) |
| `node dist/main.js` + `EOS_ENV=production` + disposable URL | **NO** (fail-closed before migrate gate) | `121\|2026-09-22 20:27:23.311832+00` **unchanged** |
| Dev/Test compiled start | runner called with `applied: []` (idempotent no-op) | **unchanged** |

`shouldApplyStartupMigrations` tests still pass (`production_gate_c_not_authorized`). Fail-closed IdP / secrets / infra / object-store / events / email **not bypassed**.

---

## K. Web-build diagnosis

Canonical command before H-186: `next build` (Next.js **16.3.2** Turbopack). OOM occurred during **Collecting page data using 11 workers**, not during compile or `tsc`. Repository specified **no** `NODE_OPTIONS`. H-185: default heap **FAIL** (exit 134); `--max-old-space-size=8192` **PASS**.

This increment: running `node --max-old-space-size=8192 …/next build` while the shell still had `NODE_ENV=development` (leaked from an API rehearsal) produced a **prerender `useContext` null** failure — not an OOM. Next.js warns that a non-production `NODE_ENV` during `next build` is inconsistent. That is an operator-environment hazard, not a reason to disable checks.

8 GB is **not** claimed as universally required on every host. It is the **rehearsal-proven** heap that allowed this repository’s Next 16 page-data workers to complete on the H-185/H-186 machine.

---

## L. Web-build remediation

**Option A — canonical build configuration**, with inherited heap (so Next **worker processes** receive it, which parent-only `--max-old-space-size` does not guarantee).

New file `apps/web/scripts/canonical-next-build.mjs`:

- sets `NODE_OPTIONS` to include `--max-old-space-size=8192` unless a size is already present;
- forces `NODE_ENV=production`;
- spawns `node_modules/next/dist/bin/next build`.

`apps/web/package.json`: `"build": "node ./scripts/canonical-next-build.mjs"`.

Pre-existing dirty vitest/`test` script on `@sedmc/web` **preserved**. Worker count **not** reduced. Typecheck **not** removed.

---

## M. Web-build evidence

```text
node ./scripts/canonical-next-build.mjs
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=8192
Node v24.19.0
exit 0
~12.7 s
Next.js 16.3.2 (Turbopack)
54 routes generated (same commercial/field set as H-185)
```

Compile, TypeScript, page-data collection, and static generation all completed. No build checks removed.

---

## N. Test evidence

| Suite | Tests | Result |
| --- | --- | --- |
| `@sedmc/db` `h186-compiled-exports` + `migrate-guard` | 4 | passed |
| `@sedmc/kernel` `h186-compiled-exports` | 1 | passed |
| `@sedmc/api` identity / migrate-guard / deployment-config / token-bootstrap | 18 | passed |
| `@sedmc/web` `h151-d03.client-bundle` (kernel subpath imports) | 2 | passed |
| **Total this increment** | **25** | **25 passed, 0 failed** |

**Not run:** full workspace `npm test`.  
**Skipped:** Cloud Run, P19, Production migrate.  
**Why:** out of H-186 scope / not implemented in repository.

---

## O. Remaining defects

H-185 items **1 and 2 are closed** for Dev/Test packaging.

Still not in repository (unchanged; **not** created here):

- Dockerfile / Cloud Run service / IaC — Production-grant artefacts, not H-186 scope.
- `tsx` remains the **Dev/Test** API and migrate CLI loader (`source` condition). Production start path is `node dist/main.js`.
- Operators must still **build workspace packages** (`tsc` / `npm run build`) before `node dist/main.js`.

No new packaging defect that blocks compiled Node start was left open.

```text
KNOWN FOLLOW-UP / NOT PART OF H-186
```

`syncStoreToPostgres` remains on the default (non-bounded) startup path in `apps/api/src/main.ts` **after** migrate skip/apply (line 177). Packaging (`exports` → `dist`) does **not** change that control flow.

Under `EOS_ENV=production`, `validateDeploymentConfig` and `localPasswordIdentityForbiddenReason` still `process.exit(1)` **before** the database/migrate/`syncStoreToPostgres` block. Empirically, compiled `node dist/main.js` with `EOS_ENV=production` logs `deployment_config_refused` and never `database_migrated` or `database_seed_synced`.

If Gate C were later opened **and** all fatals were cleared, `shouldApplyStartupMigrations` would skip migrate (`production_gate_c_not_authorized`) **and** `syncStoreToPostgres` would still run. That latent seed-sync gate is **not** remediating in H-186.

---

## P. Remaining Production dependencies

After H-186, packaging no longer blocks a compiled Node start. Still required before Production (unchanged; not closed here):

- Owner/POA **implementation grant**
- GCP project / Cloud SQL / Cloud Run (no IaC in repo)
- IdP / MFA
- Production secret store / IAM
- Hostname / DNS / TLS
- Backup / PITR / DR replica / P19
- HUM-08 specialist appointments
- H-181 outbound evidence **authorized, sent NONE**

## Q. Governance interpretation

| Class | Status |
| --- | --- |
| Dev/Test engineering evidence | **H-186 packaging remediation proven** |
| UAT | **NOT produced** |
| Production readiness | **NOT claimed** (`productionReady` remains false) |
| Production authorization | **NOT granted** |

---

## R. Final determination

```text
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## S. Next governed action

Do **not** add Cloud Run/Terraform in the next increment. Do **not** send H-181 from Cursor. Do **not** start H-81.

H-185’s two packaging defects are remediated. The highest-value remaining work is **organizational / Production-grant**, not another internal packaging patch: human H-181 send/queue from the appointed mailbox, and Owner Session appointment of Database Owner, Security/Access Owner, and DR Coordinator. A container definition remains a **later** implementation-grant artefact.

---

## 18. Audit and stop

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 682 → 689 |
| H-181–H-185 | not rewritten |
| Fail-closed controls | unchanged |
| Commit / push | **NONE** |

```text
PROCESS STOPPED AFTER H-186
NEXT GOVERNED ACTION: Human H-181 send/queue and HUM-08 specialist
  naming. Do not provision GCP. Do not invent a Dockerfile here.
```
