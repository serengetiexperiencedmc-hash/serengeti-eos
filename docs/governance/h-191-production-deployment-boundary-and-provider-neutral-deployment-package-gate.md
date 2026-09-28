# H-191 — Production Deployment Boundary and Provider-Neutral Deployment Package Gate

> **DEV/TEST ENGINEERING — DEPLOYMENT BOUNDARY ONLY.**  
> States how a future selected Production environment must start the compiled application.  
> **Does not** select a cloud, container base image, orchestrator, hostname, IdP, object store, NATS hoster, email, secrets platform, observability vendor, or sizing.  
> **NOT** Production deployment. **NOT** UAT. **NOT** Production readiness. **NOT** Production implementation authorization.  
> H-184 through H-190 were **inspected and not rewritten**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 700  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-191 STATUS = COMPLETE
Deployment conclusion = CLOSED WITH LIMITATIONS
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## 1. Repository baseline

Observed at H-191 start (not assumed):

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty (`git diff --cached --stat` empty) |
| Porcelain | 700 |
| Tracked diff vs HEAD | 183 files |
| Dirty worktree | **preserved** |

---

## 2. H-184–H-190 reconciliation

Inspected and **not rewritten**.

| Increment | Commitment used here |
| --- | --- |
| H-184 | Preflight only; no Production IaC; migrate is a **separate grant**; `PRODUCTION REVISION: TBD`; hostname TBD; `infra/compose/dev.yaml` only |
| H-185 | Disposable rehearsal; Cloud Run rehearsal **not** executed because no Production IaC exists |
| H-186 | Compiled `node dist/main.js`; workspace `exports.import` → `dist/*.js`; web heap in canonical next build |
| H-187 | Production-like startup must not migrate/seed/sync |
| H-188 | Outbox drain only after healthy live NATS |
| H-189 | Silent Dev/Test substitutions refused |
| H-190 | Provider-neutral dependency contract `CLOSED WITH LIMITATIONS`; products UNSELECTED |

Nothing in H-191 authorizes Production implementation or rewrites those conclusions.

---

## 3. Deployment artefact inventory

| Artefact | Present? |
| --- | --- |
| Dockerfile | **NO** (repo root, `apps/api`, `apps/web`) |
| docker-compose / compose.yaml | **NO** Production. Dev/Test only: `infra/compose/dev.yaml` (Postgres 16, Redis, NATS JetStream) |
| Cloud Run / Cloud SQL manifests | **NO** |
| Terraform / OpenTofu / Pulumi | **NO** |
| Kubernetes / Helm | **NO** |
| `package.json` workspaces | YES — `@sedmc/api`, `@sedmc/web`, `@sedmc/db`, `@sedmc/kernel` |
| API start | `node dist/main.js` |
| DB migrate | `npm run migrate -w @sedmc/db` → `tsx src/migrate-cli.ts` |
| CI | `.github/workflows/ci.yml` Node **20**, `npm ci` / typecheck / test / build |
| Redis consumer in API | **NO** (compose Redis is unused by compiled API) |

No Production infrastructure was created because it is absent. Creating it would require selecting a platform.

---

## 4. Compiled runtime contract

```text
source (apps/api/src, packages/*/src)
→ tsc outDir dist
→ @sedmc/db and @sedmc/kernel exports.import / default = ./dist/*.js
→ apps/api/dist/main.js
→ Node resolves workspace packages from dist, not .ts
→ process reads process.env (SecretsProvider env-dev)
```

| Question | Answer |
| --- | --- |
| Is `node dist/main.js` a valid entrypoint? | **Yes** (`package.json` `start`; H-186) |
| Do workspace packages resolve from compiled output? | **Yes** (`import`/`default` → dist) |
| Does Production runtime require source files? | **No** for API listen. Dev `npm run dev` uses `--conditions=source --import tsx`. |
| Runtime-only files | `node_modules` production deps: `fastify`, `pg`, `nats`, `@aws-sdk/client-sesv2`, `@sedmc/db`, `@sedmc/kernel` |
| Dynamic imports | None required for startup |
| Static assets | None required for API |
| Working directory | Not required for listen (ESM `import.meta.url`). Typical: `apps/api` with hoisted workspace `node_modules`. |
| Env from compiled artifact | `validateDeploymentConfig(process.env)` then `SecretsProvider.get` |

Web remains a **separate** process: canonical `next build` (`apps/web/scripts/canonical-next-build.mjs`, 8 GiB heap) then `next start`. Combining API+web would be architectural invention and was not done.

---

## 5. Container boundary

**No Dockerfile.** Classified; not invented.

Minimum future image (provider-neutral, no base image selected):

* Node **>=20** (root `engines`; CI `node-version: "20"`)
* Compiled `apps/api/dist`, `packages/db/dist`, `packages/kernel/dist`
* Production npm dependencies (not `tsx`)
* Env injection
* Listen: `EOS_PORT` (default 8080); **explicit non-loopback** `EOS_LISTEN_HOST`
* SIGTERM/SIGINT
* `/health` `/ready`
* Startup `exit(1)` before listen when the gate fails
* Writable local document root **not** required (local-fs refused)
* Read-only root compatible once object storage exists

Redis in Dev compose is **not** a Production container requirement.

---

## 6. Orchestrator-neutral contract

| Input | Application behaviour |
| --- | --- |
| `EOS_PORT` | Listen port; default 8080 via `resolveApiListenPort` |
| `PORT` | **Not consumed.** If a platform injects `PORT`, map it to `EOS_PORT` at injection. Not Cloud Run configuration. |
| `EOS_LISTEN_HOST` | **H-191:** Production-like requires explicit non-loopback. Silent `127.0.0.1` default is Dev/Test only. |
| SIGTERM / SIGINT | `shutdownEventConsumers` → `app.close` → `pool.end` → `exit(0)` |
| Startup failure | `validateDeploymentConfig` fatals → `exit(1)` before listen |
| `/health` | Liveness JSON; `productionReady: false` |
| `/ready` | 200 iff DB health ok; 503 otherwise; memory-ok is Dev/Test |
| Process exit | 1 on config/identity/transport fatal; 0 after graceful shutdown |

Cloud Run is **not** configured and is **not** claimed ready.

---

## 7. Database boundary

* `EOS_DATABASE_URL` required Production-like; loopback fatal
* `EOS_DATABASE_TLS_MODE=require`; `createPool` uses `ssl: { rejectUnauthorized: true }`
* Pool `EOS_DATABASE_POOL_SIZE` optional (default 10)
* Startup migrate: `shouldApplyStartupMigrations` → **skip** `production_gate_c_not_authorized`
* Empty Production catalog initialization = **separate authorized** `npm run migrate -w @sedmc/db`
* Already-migrated catalog: application hydrates with SELECTs; does not schema-create when Production-like
* `/ready` may `SELECT 1`

Invariant held: Production application startup must not automatically execute migrations.

---

## 8. Migration package

* Files: `packages/db/schema.sql` + `packages/db/migrations/*.sql`
* Ordering: filename sort
* Ledger: `schema_migrations(id TEXT PRIMARY KEY)`
* Idempotent: skip if `id` exists
* Latest file: **125**; **126 does not exist**
* Unused numbers **112–116** (historical H-112 named-branch gap; **not** filled here)
* CLI: `tsx src/migrate-cli.ts`; also refuses `eos` and `eos_gateb`
* `packageRoot()` is `dirname(import.meta.url)/..` so both `src/` and `dist/` resolve `packages/db/migrations`
* Failure: ROLLBACK of the current file; throw
* Production startup cannot apply this package (H-187)

No new migrations were created.

---

## 9. Secrets boundary

`createEnvSecretsProvider` (`env-dev`): reference = process env **name**; return = **raw value**. No secret-manager URI. Rotation not implemented. Placeholders and known Dev bootstrap passwords fatal Production-like. Values must not be logged (existing redaction; NATS userinfo redacted H-190).

| Class | Kind |
| --- | --- |
| `EOS_TOKEN_SECRET` | secret value |
| `EOS_DATABASE_URL` | secret value (URL incl. credential) |
| `EOS_NATS_URL` | secret value (URL userinfo) |
| `EOS_BOOTSTRAP_*_PASSWORD` | secret value (Dev/Test; Production-like known values fatal) |
| SMTP/SES keys | optional secret values |
| `EOS_PUBLIC_ORIGIN`, `EOS_LISTEN_HOST`, `EOS_PORT`, adapter names, TLS mode | non-secret configuration |
| Secret **reference** URI | **not implemented** |

Platform remains UNSELECTED (ADR-0012). No names invented.

---

## 10. Identity / MFA boundary

* Implementation: `local-password-dev` only
* Production-like: always fatal (`localPasswordIdentityForbiddenReason`)
* No OIDC issuer/JWKS/audience env is consumed — none invented
* Future injection: implement `authenticateFederated` then add issuer/JWKS env **after** a provider is selected
* MFA: `mfaEnabled: false`; named in the identity fatal (GAP-IDN-02)
* Bootstrap documented passwords fatal Production-like

---

## 11. Event / NATS boundary

Actual sequence in `main.ts`:

```text
validateDeploymentConfig
→ token / identity / bootstrap
→ (optional) createPool + migrate decision + H-187 sync + SELECT hydrates
→ initEventTransport
→ shouldDrainOutboxOnStartup / publishPendingOutbox
→ initEventConsumers
→ buildServer / demo-seed gate
→ listen
→ SIGTERM/SIGINT shutdown
```

Differs from the prompt’s “database setup before configuration validation” only in that **validation is first** (fail closed before pool). That is the correct safety order.

Production-like: live NATS TLS+userinfo; no in-memory/stub; drain only if `health().ok`; no external NATS contacted.

---

## 12. Object-storage boundary

Port: put/get/exists/stat/delete. Only adapter: local-fs under `EOS_DOCUMENT_ROOT` or tmpdir. Production-like: local-fs **and** `future-object-store` both fatal (unimplemented). No bucket/endpoint/credential env names invented. Encryption-at-rest is a future provider concern.

---

## 13. Email boundary

Unchanged H-189/H-190: `ses` or `smtp` only; loopback/placeholder/`.local` From refused; SMTP TLS required Production-like. Product UNSELECTED. No mail sent.

---

## 14. Public origin / CORS boundary

```text
technical contract = CLOSED
actual Production value = OPEN
```

`EOS_PUBLIC_ORIGIN` https, not localhost, not `*`. Production-like CORS allow-lists that origin. DNS not created.

---

## 15. Observability boundary

**Application-observable:** JSON stdout/stderr (`productionReady: false`), correlation/request ids, `/health`, `/ready`, startup `deployment_config_refused` / `api_listening`, shutdown `shutdown_started`, secret redaction.

**External platform:** UNSELECTED. No vendor SDK. Not required to start.

---

## 16. Filesystem analysis

Process writes in API runtime:

| Writer | Production reachable? |
| --- | --- |
| `LocalFsDocumentStorage` mkdir/writeFile | **No** (storage fatal before listen) |
| Tests writing docs | test-only |
| Disposable pg dump helpers | Dev/Test tests |
| Field-cache | client/device derivation; not API disk |

Production must not depend on persistent local document storage. Read-only container root is compatible once object storage is selected.

---

## 17. Build / start / health contract

```text
npm run build -w @sedmc/kernel
npm run build -w @sedmc/db
npm run build -w @sedmc/api
→ inject env (no Dev/Test substitutions)
→ node dist/main.js   (cwd typically apps/api)
→ validateDeploymentConfig
→ connect PostgreSQL + NATS when validation passes
→ GET /ready 200
→ serve
→ SIGTERM graceful shutdown
```

Web (separate): `npm run build -w @sedmc/web` then `next start`.

Failure: any Production-like fatal → `exit(1)`, no listen.

Readiness: DB ok; `productionReady` remains false.

---

## 18. Rehearsal evidence

Disposable local only. No Production credentials.

* `npm run build` kernel/db/api — success
* `node apps/api/dist/main.js`:
  * Production missing config: **EXIT=1**, includes new `EOS_LISTEN_HOST` fatal; no listen/migrate/seed/drain
  * Production loopback listen: **EXIT=1**, `EOS_LISTEN_HOST must not be localhost`
  * UAT loopback DB: **EXIT=1**, localhost DB + origin + listen host fatals
* Dist `validateDeploymentConfig` Dev/Test: `productionLike=false`, `fatal=[]`, `productionReady=false`
* Vitest health/ready via inject (E1-C / E1-D)

No disposable PostgreSQL this increment (compiled Production/UAT exit before `createPool`).

---

## 19. Defects and corrections

Concrete packaging defect closed here:

* Production-like would have **silently bound `127.0.0.1`** if validation later passed. **H-191** requires explicit non-loopback `EOS_LISTEN_HOST`.

Not defects:

* Absence of Dockerfile / Cloud Run YAML (external/platform selection)
* Unused migration numbers 112–116 (historical)
* `PORT` not read (documented mapping; not Cloud Run code)
* Redis in Dev compose unused by API

---

## 20. Unresolved provider-specific decisions (Case C)

```text
Provider-specific decision required: container base image / registry
Technical dependency: future Production image
Current neutral contract: Node >=20, dist + production node_modules, no Dockerfile in repo
Required future input: image family, registry, non-root user policy
Implementation cannot proceed until: orchestrator/container platform is selected
```

```text
Provider-specific decision required: process orchestrator
Technical dependency: SIGTERM, PORT mapping, replicas
Current neutral contract: EOS_PORT, EOS_LISTEN_HOST, /health, /ready, graceful shutdown
Required future input: Cloud Run vs other supervisor; map PORT→EOS_PORT if needed
Implementation cannot proceed until: Owner/POA implementation grant + platform selection
```

Plus H-190 unresolved products: IdP, MFA, PostgreSQL host, object store, NATS hoster, email, secrets platform, hostname, observability vendor, KMS, CPU/memory/concurrency **not invented**.

---

## 21. Production readiness status

A deployment package contract is **not** Production implementation. Absence of a Dockerfile is classified, not silently filled.

```text
Production NOT READY
Production implementation NOT AUTHORIZED
productionReady = false
```

H-181 requests: **NONE**. P19 / DR: **NOT PERFORMED**.
