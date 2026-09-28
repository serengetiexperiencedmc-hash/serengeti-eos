# H-189 — Production Runtime Dependency and Configuration Closure Audit

> **DEV/TEST ENGINEERING AUDIT AND MINIMUM FAIL-CLOSED REMEDIATION ONLY.**  
> Inspects the compiled application's actual runtime configuration contract.  
> **NOT** Production deployment. **NOT** UAT. **NOT** Production readiness. **NOT** Production implementation authorization.  
> H-181 through H-188 were **inspected and not rewritten**. H-81 remains **OUT OF SCOPE**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 696  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-189 STATUS = COMPLETE
Configuration conclusion = OPEN — GOVERNANCE INPUT REQUIRED
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## 1. Repository baseline

Verified at H-189 start (observed, not assumed):

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty (`git diff --cached --stat` empty) |
| Porcelain | 696 |
| Dirty worktree | **preserved**. No reset, clean, stash, revert, discard, or overwrite of pre-existing dirty work. |
| H-181–H-188 | artefacts present; **not rewritten** |

Prior work (H-154–H-188) remains in the dirty tree. This increment added/updated only:

* `apps/api/src/notifications/email-config.ts`
* `apps/api/src/notifications/email.ts`
* `apps/api/src/deployment-config.ts` (already untracked from earlier E1-C / H-186 lineage; edited in place)
* `apps/api/src/h189-production-runtime-config.test.ts` (new)
* `.env.example` (Dev/Test comments only)
* this artefact

---

## 2. Configuration inventory (traced usage, not name-matching)

Sources inspected: `.env.example`; `apps/api/src/main.ts`; `deployment-config.ts`; `infrastructure-contract.ts`; `devtest-token-secret.ts`; `devtest-http-controls.ts`; `ports/identity.ts`; `ports/secrets.ts`; `events/transport-init.ts`; `events/nats-transport.ts`; `events/consumer-init.ts`; `notifications/email.ts`; `notifications/email-config.ts`; `commercial-documents/storage.ts`; `commercial-documents/service.ts`; `observability.ts`; `server.ts`; `packages/db/src/index.ts`; `apps/web/next.config.ts`; `apps/web/src/app/eos-api/[...path]/route.ts`.

| Variable / switch | Declared | Validated (Production-like) | Runtime consumer | Notes |
| --- | --- | --- | --- | --- |
| `EOS_ENV` / `NODE_ENV` | `.env.example` | `isProductionLikeEnv` | `main.ts`, gates, identity | `production`/`uat`/`NODE_ENV=production` = Production-like |
| `EOS_TOKEN_SECRET` | `.env.example` | required; refuses Dev/Test placeholders | `resolveDevTestTokenSecret` → `seedStore` / `verifyToken` | Consistent |
| `EOS_TOKEN_TTL_SECONDS` | `.env.example` | **not validated** | **not consumed** | Login TTL is hardcoded `3600` in `app.ts`. **DEAD/UNUSED CONFIGURATION** |
| `EOS_DATABASE_URL` | `.env.example` | required; **loopback refused** (H-189) | `createPool` | Consistent after H-189 |
| `EOS_DATABASE_TLS_MODE` | `.env.example` | must be `require` | `resolveDatabasePoolOptions` → `createPool` ssl | Consistent |
| `EOS_DATABASE_POOL_SIZE` | `.env.example` | not Production-fatal | pool `max` default 10 | Optional |
| `EOS_INFRASTRUCTURE_TARGET` | `.env.example` | `local-devtest` fatal; future targets also fatal (unimplemented) | label only | Product UNSELECTED |
| `EOS_DOCUMENT_STORAGE` | `.env.example` | `local-fs` fatal; `future-object-store`/`s3-compatible` fatal (not implemented) | `ensureDocumentStorage` still constructs `LocalFsDocumentStorage` **after** startup; Production never reaches it | Provider UNSELECTED |
| `EOS_DOCUMENT_ROOT` | `.env.example` | n/a if local-fs refused | `resolveDocumentRoot` | Dev/Test only |
| `EOS_EVENT_TRANSPORT` | `.env.example` | must be `nats-jetstream` | `initEventTransport` | Default `in-memory-dev` Dev/Test only |
| `EOS_NATS_URL` | `.env.example` | required; **loopback refused** (H-189) | `createNatsJetStreamTransport` `connect({ servers: url })` | TLS/credentials **not** validated. Product UNSELECTED |
| `EOS_NATS_STREAM` / `SUBJECT_PREFIX` / `CONSUMER` / `CONSUMER_ENABLED` / `AUTO_TENANT_DURABLES` / `FILTER_*` | `.env.example` / code | not Production-fatal beyond URL | NATS transport/consumer | Optional operational knobs |
| `EOS_EMAIL_ADAPTER` | `.env.example` | **resolved** adapter must be `ses` or `smtp` (H-189) | `resolveEmailAdapterName` → `createEmailAdapter` | Was mismatched; **aligned** |
| `EOS_SES_REGION` / `EOS_SES_FROM` / `EOS_SMTP_HOST` / `EOS_SMTP_FROM` | `.env.example` | required for the chosen adapter; placeholder region and `.local` From refused (H-189) | kernel `parseSesConfigFromEnv` / `parseSmtpConfigFromEnv` | Product UNSELECTED |
| `EOS_SES_ACCESS_KEY_ID` / `EOS_SES_SECRET_ACCESS_KEY` / `AWS_*` | `.env.example` | not startup-fatal | optional IAM/default chain at send time | Credentials UNSELECTED |
| `EOS_LISTEN_HOST` / `EOS_PORT` | `.env.example` | not Production-fatal | `listenHostFromEnv` default `127.0.0.1`; port default `8080` | Production bind/public hostname UNSELECTED |
| `EOS_LOG_LEVEL` | `.env.example` | not required | `createLogger` | Console JSON only |
| `EOS_SEED_DEMO` | `.env.example` | `true` fatal | `main.ts` after listen-path gates | Forbidden Production-like |
| `EOS_BOOTSTRAP_*_PASSWORD` | `.env.example` | known Dev/Test values fatal | `bootstrapSecretsFromEnv` | Production-like missing bootstrap **exits** in `main.ts` |
| `EOS_CORS*` / Production origin | **absent** | n/a | `applyDevTestCors` always (localhost HTTP only) | Hostname UNSELECTED; no wildcard |
| `SENTRY` / Datadog / OTEL | **absent** | n/a | none | Vendor UNSELECTED |
| `CLOUD_RUN` / `GCP` / `GOOGLE` / `REGION` / `PROJECT` / `BUCKET` | **absent** as runtime selectors | n/a | not consumed by API startup | Do not invent |
| `EOS_API_URL` / `NEXT_PUBLIC_EOS_API_BASE` / `EOS_WEB_DIST_DIR` | web only | n/a | Next BFF / build distDir | Not compiled API runtime |
| Field-cache key / KMS | **absent** | n/a | `deriveFieldCacheKey(deviceId, principalId, salt)` | No process-level KMS env |
| Secrets platform | n/a | n/a | `createEnvSecretsProvider` name `env-dev` | ADR-0012 OPEN |

`PROD` / `SECRET` in a name was not treated as a dependency unless traced to a consumer.

---

## 3. Runtime dependency matrix

| Dependency | Code entry point | Configuration source | Required in Production? | Required in UAT? | Current validation | Unsafe default? | Current status |
| ---------- | ---------------- | -------------------- | ----------------------: | ---------------: | ------------------ | --------------: | -------------- |
| PostgreSQL | `main.ts` `createPool` | `EOS_DATABASE_URL` | yes | yes | missing / loopback fatal | in-memory if unset — **refused** Production-like | fail-closed; product/host UNSELECTED |
| PostgreSQL TLS | `packages/db` `createPool` ssl | `EOS_DATABASE_TLS_MODE` | yes (`require`) | yes | `!== require` fatal | `disable` Dev/Test | fail-closed; certs UNSELECTED |
| Migration control | `shouldApplyStartupMigrations` | Production-like env | must **not** auto-run | must **not** auto-run | H-187 | none | **preserved** |
| IdP / OIDC | `ports/identity.ts` `login` | none (only `local-password-dev`) | yes (unselected) | yes | always fatal Production-like | local-password — **refused** | **UNSELECTED** (ADR-0013 OPEN) |
| Token signing | `app.ts` `signToken` HS256 | `EOS_TOKEN_SECRET` | yes | yes | missing/placeholder fatal | `dev-only-change-me` — **refused** | fail-closed |
| MFA | health `mfaEnabled: false` | none | yes (GAP-IDN-02) | yes | identity fatal names MFA | unimplemented | **UNSELECTED / unimplemented** |
| Application secrets | `createEnvSecretsProvider` | process env | yes | yes | token + bootstrap | env-dev provider | platform UNSELECTED (ADR-0012) |
| Field-cache encryption | `field-cache-crypto.ts` | device/principal/salt | not a process env | not a process env | none | n/a | no KMS env; not a startup blocker |
| Object/document storage | `ensureDocumentStorage` | `EOS_DOCUMENT_STORAGE` | yes | yes | local-fs **and** unimplemented future both fatal | local-fs / tmpdir — **refused** | **UNSELECTED**; adapter not implemented |
| Event transport | `initEventTransport` | `EOS_EVENT_TRANSPORT` | NATS | NATS | in-memory fatal | `in-memory-dev` — **refused** | fail-closed; NATS product UNSELECTED |
| NATS credentials/TLS | `nats-transport.ts` `connect` | URL only | unresolved | unresolved | loopback URL refused; **no TLS scheme check** | plaintext `nats://` accepted if non-loopback | **UNSELECTED** (do not invent tls://) |
| Email | `createEmailAdapter` | `EOS_EMAIL_ADAPTER` + host/region/from | operational; product unselected | same | stubs/unknown/loopback/.local From fatal | was silent stub — **fixed** | ports `ses`/`smtp` exist; **product UNSELECTED** |
| CORS | `applyDevTestCors` | none (hardcoded localhost HTTP) | Production origin unselected | same | wildcard rejected | localhost-only always | **UNSELECTED** hostname; no wildcard |
| Hostname / origin | none | none | yes (TBD) | yes (TBD) | not invented | listen `127.0.0.1` | correctly deferred |
| HTTP/TLS (process) | Fastify listen | `EOS_LISTEN_HOST` / `EOS_PORT` | edge TLS unselected | same | none | loopback bind | process does not terminate TLS |
| Logging | `createLogger` | `EOS_LOG_LEVEL` | visibility only | same | not required | console JSON | missing sink does **not** block startup |
| Observability / alerting | `registerObservability` | none | vendor unselected | same | not required | no Sentry | **UNSELECTED**; reduced visibility only |
| Process supervision | none | none | ops concern | same | none | none | outside the compiled app |
| Health / readiness | `/health` `/ready` | n/a | honesty | honesty | `productionReady: false` always | n/a | honest |
| Application environment | `isProductionLikeEnv` | `EOS_ENV` / `NODE_ENV` | yes | yes | drives all gates | n/a | consistent |
| Region / project | none | none | not consumed | not consumed | n/a | n/a | do not invent |

---

## 4. Environment behaviour matrix

Populated from `main.ts`, H-187/H-188 gates, `initEventTransport`, `validateDeploymentConfig`, `ensureDocumentStorage`, identity, email, CORS, health.

| Capability | Development | Test | UAT | Production |
| -------------------------- | ----------- | ---- | --- | ---------- |
| Startup migrations | yes (isolated catalogs; not `eos` / `eos_gateb`) | same | **no** (`production_gate_c_not_authorized`) | **no** |
| Demo seed | if `EOS_SEED_DEMO=true` | same | **forbidden** | **forbidden** |
| Store sync | yes (H-187 `apply: true`) | yes | **no** | **no** |
| CRM catalogue persistence | with store sync | with store sync | **no** | **no** |
| Outbox startup drain | after transport init; in-memory allowed | same | only healthy NATS | only healthy NATS |
| In-memory event transport | default | default | **refused** | **refused** |
| NATS / stub transport | NATS if URL; stub if connect/URL fail | same | live NATS required; stub **refused** | live NATS required; stub **refused** |
| Local filesystem documents | default `local-fs` | default | **refused** at startup | **refused** at startup |
| Object storage | unimplemented alias only | same | fatal (unimplemented) | fatal (unimplemented) |
| IdP | `local-password-dev` | same | **refused** (unselected) | **refused** (unselected) |
| Email | `dev-outbox` / stubs / smtp / ses | same | `ses` or `smtp` only; stubs refused | same |
| External event publication | in-memory bus and/or NATS if configured | same | NATS if startup were to proceed | NATS if startup were to proceed |
| Production readiness flag | `false` | `false` | `false` | `false` |

UAT is Production-like (`EOS_ENV=uat` or `NODE_ENV=production`). Compiled UAT/Production currently **cannot listen**: IdP, object store, and infrastructure target remain fatal even when email/DB/NATS loopback issues are corrected.

---

## 5. Fail-closed analysis

Classification of notable defaults (whether Production can actually select them):

| Occurrence | Classification |
| --- | --- |
| `EOS_EVENT_TRANSPORT` default `in-memory-dev` | **SAFE DEV/TEST ONLY** — Production-like fatal + `initEventTransport` throw |
| NATS missing URL → stub (Dev/Test) | **SAFE DEV/TEST ONLY** — Production-like fatal / throw |
| NATS connect failure → stub (Dev/Test only; Production throw) | **SAFE DEV/TEST ONLY** |
| `resolveEmailAdapterName` ses/smtp → stub when incomplete (Dev/Test) | **SAFE DEV/TEST ONLY** |
| Pre-H-189: `ses-stub` / unknown adapter passed validation then became `dev-outbox` | **UNSAFE PRODUCTION DEFAULT** — **fixed** |
| Pre-H-189: loopback `EOS_DATABASE_URL` / `EOS_NATS_URL` / `EOS_SMTP_HOST` | **UNSAFE PRODUCTION DEFAULT** — **fixed** |
| `EOS_TOKEN_SECRET` fallback `dev-only-change-me` | **SAFE DEV/TEST ONLY** — Production throw |
| `local-password-dev` | **SAFE DEV/TEST ONLY** — Production fatal + login `identity_not_production_ready` |
| `LocalFsDocumentStorage` / tmpdir | **SAFE DEV/TEST ONLY** — Production fatal before listen |
| `dev-outbox` / `smtp-stub` / `ses-stub` | **SAFE DEV/TEST ONLY** after H-189 |
| `createPool` tls `disable` | **SAFE DEV/TEST ONLY** |
| Listen `127.0.0.1` | **SAFE DEV/TEST ONLY** (isolation). Production bind UNSELECTED |
| CORS localhost HTTP | **SAFE DEV/TEST ONLY**. Not a Production origin policy |
| Console JSON logger | **SAFE PRODUCTION FALLBACK** for visibility (no vendor). Does not claim a sink |
| `EOS_TOKEN_TTL_SECONDS` in `.env.example` | **DEAD/UNUSED CONFIGURATION** |
| `s3-compatible` → `future-object-store` | **SAFE DEV/TEST ONLY** mapping; Production still fatal unimplemented |
| Bootstrap `TEST_BOOTSTRAP_SECRETS` | **SAFE DEV/TEST ONLY** — Production-like missing bootstrap `process.exit(1)` |

Absent required Production-like config: `validateDeploymentConfig` fatals → `process.exit(1)` **before** pool, migrate, sync, transport, drain, listen. Malformed/placeholder secrets: fatal, class named, secret values not logged (`deployment_config_refused` logs the reason string only). Development values (loopback, stubs, `.local` From, documented SES placeholder): now fatal in Production-like. Failure is deterministic.

---

## 6. Event transport analysis

Implementations:

1. `in-memory-dev` — `createInMemoryDevTransport` (kernel)
2. Real NATS JetStream — `createNatsJetStreamTransport` (`kind: nats-jetstream`, `health().ok` from connection)
3. Stub — `createNatsJetStreamTransportStub` (same `kind`, `health().ok === false`)

Selection (`transport-init.ts`):

* Default request: `in-memory-dev`
* Production-like: must request `nats-jetstream` **and** `EOS_NATS_URL`; then `await createNatsJetStreamTransport` (no stub catch)
* Dev/Test NATS without URL or connect failure: stub + warn/error log

Answers:

1. Three implementations as above.
2. `EOS_EVENT_TRANSPORT` + `EOS_NATS_URL` + Production-like flag.
3. Production cannot select in-memory or stub: validation + throw + H-188 drain gate.
4. NATS user/pass are only whatever is embedded in the URL; no separate credential env. **Not required by code.**
5. TLS is **not** required by code (`connect({ servers: opts.url })`). `nats://` plaintext is accepted if non-loopback. **Do not invent `tls://`.**
6. Connect failure in Production-like: throw → `main.ts` `process.exit(1)`. Fail-closed.
7. Readiness `/ready` does not probe NATS; startup refuses to listen if transport init throws. Health of NATS is used by H-188 drain.
8. Drain is after successful `initEventTransport`. Production drain requires `health().ok`. Outbox cannot be marked published against stub/in-memory (H-188).
9. External publication requires a live NATS connection. There is no separate “enable Production publish” flag; the transport **is** the configuration. Product remains UNSELECTED.

H-188 drain-after-transport architecture was **not** modified.

---

## 7. Object / document storage analysis

* Local filesystem remains the **only implemented** adapter (`LocalFsDocumentStorage`).
* In-memory document bytes are not a separate provider; missing storage is constructed as local-fs on first document operation (`ensureDocumentStorage`).
* Production requires a future object store that **is not implemented**. Both `local-fs` and `future-object-store` are fatal in Production-like validation.
* Production cannot start with unsafe storage: startup exits before `listen` and before document routes run.
* Document writes are **not** performed during startup (no storage `put` in `main.ts`).
* Storage kind is validated; credentials do not exist because no cloud adapter exists.
* `s3-compatible` is an alias to `future-object-store`, not a provider selection.

Governance already selected “object store UNSELECTED”. This audit does not select one.

---

## 8. Email analysis

Available adapters: `dev-outbox`, `smtp-stub`, `ses-stub`, `smtp`, `ses`.

| Environment | Behaviour |
| --- | --- |
| Development / Test | Default `dev-outbox`. `ses` without region → `ses-stub`. `smtp` without host → `smtp-stub`. Unknown names → `dev-outbox`. |
| Production / UAT | Startup requires resolved `ses` or `smtp`. Stubs, empty, unknown, loopback SMTP host, documented SES placeholder region, and `.local` From are fatal. `createEmailAdapter` throws if a stub would be constructed. |

Email is **not** required to serve HTTP in Dev/Test. In Production-like it is a startup configuration class (fail-closed) even though send occurs only on notification operations. Missing email config **blocks Production-like startup** after H-189 (it already blocked `dev-outbox`; it now also blocks silent substitutes).

This audit does **not** select SES vs SMTP as a Production product. The ports already existed (I3).

---

## 9. IdP / MFA / secrets analysis

* Only IdP: `local-password-dev`.
* Production-like: `localPasswordIdentityForbiddenReason` always returns the unselected-IdP / MFA-not-implemented string. `login` returns `identity_not_production_ready`. `main.ts` exits on the same boundary.
* Tokens: HMAC-SHA256 with `EOS_TOKEN_SECRET`. TTL hardcoded 3600s (`EOS_TOKEN_TTL_SECONDS` unused).
* MFA: `mfaEnabled: false` on `/health` and `/ready`. Not implemented.
* Secrets: `env-dev` process env only. No KMS. Secrets are redacted in structured logs (`REDACT_KEYS` includes `EOS_TOKEN_SECRET` and bootstrap password keys).
* Known Dev/Test bootstrap passwords fatal in Production-like.
* Production cannot select local development identity.

Do not select an IdP product. Do not generate credentials.

---

## 10. Database analysis

* `EOS_DATABASE_URL` required Production-like; in-memory refused.
* TLS: `EOS_DATABASE_TLS_MODE=require` → `ssl: { rejectUnauthorized: true }`. No custom CA env. Certificates/product UNSELECTED.
* Loopback URL refused Production-like (H-189).
* Pool default max 10.
* Migrations: H-187 / Gate C — **not** auto-run in Production/UAT. Policy **not** modified.
* Startup DB access after validation would be hydrate SELECTs only (H-187). Compiled Production never reaches the pool: validation exits first.
* `/ready` uses `dbHealth` = `SELECT 1` when a pool exists.
* Database name `eos` / `eos_gateb` remain Dev/Test/Gate-B guards, not Production naming.

Production cannot: skip TLS; use localhost; auto-migrate; create schema; seed; sync catalogues — compiled path exits at configuration.

---

## 11. CORS / origin analysis

* `server.ts` **always** applies Dev/Test CORS: `http://localhost` and `http://127.0.0.1` only. `*` rejected. HTTPS localhost rejected.
* Production cannot start with wildcard CORS.
* Localhost **is** accepted for the running Dev/Test policy. There is no Production origin allow-list variable.
* Public hostname is **unresolved**. Correctly deferred. This audit does not invent `EOS_CORS_ORIGIN` or a Production hostname.

If Production later started without a new CORS module, browser calls from a non-localhost origin would be rejected (fail-closed for browsers, not a Production origin contract).

---

## 12. Observability analysis

* Structured JSON to stdout/stderr. `productionReady: false` on every line.
* Redaction of password/token/secret/PII-shaped keys.
* `x-correlation-id` / `x-request-id` on every request.
* `/health` process-ok; `/ready` may include DB probe; both report `productionReady: false`, `mfaEnabled: false`.
* No Sentry/Datadog/OTEL. Missing sink does **not** prevent startup; it only reduces visibility.
* Do not add a vendor.

---

## 13. Defects found

Concrete defects (Case B), all remediated in this increment:

1. **Email validation vs runtime mismatch.** `validateDeploymentConfig` inspected `EOS_EMAIL_ADAPTER` while `createEmailAdapter` used `resolveEmailAdapterName()`, which mapped `ses` without region → `ses-stub`, `smtp` without host → `smtp-stub`, `ses-stub` and unknown names → `dev-outbox`. Production could pass validation with `ses-stub` or `sendgrid` and then use a Dev/Test sink.
2. **Loopback network targets accepted in Production-like env.** `EOS_DATABASE_URL`, `EOS_NATS_URL`, and `EOS_SMTP_HOST` could be `127.0.0.1` / `localhost`.
3. **Documented SES region placeholder accepted** (`REPLACE_WITH_PROVIDER_REGION_NOT_SELECTED`) as if it were a region.
4. **Runtime email construction did not refuse stubs** in Production-like env (defense in depth missing).

Not defects (Case C — unresolved governance; not invented):

* IdP / MFA product
* Object-store provider
* NATS TLS scheme and NATS credentials
* Production public hostname / CORS allow-list
* Secrets platform (ADR-0012)
* Observability vendor
* Email **product** (ports exist; product unselected)
* Field-cache KMS
* Process supervision
* Cloud region/project/bucket identifiers (not consumed)
* `EOS_TOKEN_TTL_SECONDS` unused

---

## 14. Code changes

| File | Rationale |
| --- | --- |
| `apps/api/src/notifications/email-config.ts` | Single resolver used by validation and runtime; Production-like refuses stubs, unknown adapters, placeholder region, loopback SMTP, `.local` From. |
| `apps/api/src/notifications/email.ts` | `createEmailAdapter` takes `env`; throws on Production-like stub/unknown instead of constructing `dev-outbox`. |
| `apps/api/src/deployment-config.ts` | Uses `productionLikeEmailAdapterForbiddenReason`; refuses loopback PostgreSQL and NATS URLs. |
| `apps/api/src/h189-production-runtime-config.test.ts` | Regression for the Case B boundaries; preserves H-187/H-188 gates. |
| `.env.example` | Documents Production-like refusals. Does not select products. |

H-187 `startup-migrations.ts` and H-188 `startup-outbox.ts` were **not** rewritten.

---

## 15. Tests

Focused run (`NODE_ENV=test`, `EOS_ENV` unset):

```text
Run:    11 files / 56 tests
Passed: 56
Failed: 0
Skipped/not run: remainder of workspace (`npm test` / full workspace not run)
```

Files:

* `src/h189-production-runtime-config.test.ts` (8)
* `src/e1-c-deployment-config.test.ts`
* `src/e1-c-infrastructure-portability.test.ts`
* `src/h187-startup-write-safety.test.ts`
* `src/h188-startup-outbox-drain-safety.test.ts`
* `src/e1-c-closure.identity-f1-restart.test.ts`
* `src/e1-d-class-a.token-bootstrap.test.ts`
* `src/e1-d-class-a.devtest-http.test.ts`
* `src/e1-d-class-a.observability.test.ts`
* `src/i3.3-email.test.ts`
* `src/i3.5-ses.test.ts`

Full workspace `npm test` was **not** executed; success is not claimed.

---

## 16. Compiled runtime evidence

`npm run build` for `@sedmc/kernel`, `@sedmc/db`, `@sedmc/api` succeeded. Verification used `node dist/main.js` (not `tsx`).

### Production — missing required configuration

```text
EXIT=1
deployment_config_refused: EOS_TOKEN_SECRET required
deployment_config_refused: local-password-dev / IdP unselected / MFA not implemented
deployment_config_refused: EOS_INFRASTRUCTURE_TARGET=local-devtest
deployment_config_refused: EOS_DATABASE_URL required
deployment_config_refused: local-fs DocumentStorage
deployment_config_refused: in-memory-dev event transport
deployment_config_refused: EOS_EMAIL_ADAPTER required (dev-outbox / smtp-stub / ses-stub)
```

No `database_migrated`, `database_seed_synced`, `outbox_startup_drain`, `event_transport_ready`, `api_listening`.

### Production — `EOS_EMAIL_ADAPTER=ses-stub` plus non-loopback DB/NATS

```text
EXIT=1
deployment_config_refused: IdP unselected
deployment_config_refused: future infrastructure not authorized
deployment_config_refused: object-store adapter not implemented
deployment_config_refused: ses-stub / silent substitution forbidden
```

### UAT — loopback DB, NATS, SMTP

```text
EXIT=1
deployment_config_refused: IdP unselected
deployment_config_refused: local-devtest infrastructure
deployment_config_refused: EOS_DATABASE_URL localhost
deployment_config_refused: local-fs DocumentStorage
deployment_config_refused: EOS_NATS_URL localhost
deployment_config_refused: EOS_SMTP_HOST localhost
```

### Development/Test compiled module

`validateDeploymentConfig({ NODE_ENV:'test', EOS_ENV:'development' })` from `dist/deployment-config.js`: `productionLike=false`, `productionReady=false`, `fatal=[]`, warnings present (memory-only / in-memory transport / dev-outbox / 127.0.0.1 listen).

Dev/Test listen/migrate/drain behaviour was proven on compiled `node dist/main.js` in H-187/H-188 against disposable PostgreSQL. This increment did not re-listen a Dev/Test server (would require a disposable catalog and would hang the process). Existing H-187/H-188 compiled evidence remains valid; those gates were not rewritten.

---

## 17. Database evidence

No disposable PostgreSQL was created for H-189. Compiled Production/UAT exits in `validateDeploymentConfig` **before** `createPool`. Therefore:

```text
schema mutation on Production/UAT start: NONE (no connection)
business-row mutation: NONE
outbox-row mutation: NONE
seed-row mutation: NONE
external publication: NONE
```

H-187/H-188 disposable catalogs were already removed. No Production database was referenced.

---

## 18. Unresolved dependencies (governance / implementation input)

Do **not** treat these as selected by this audit:

1. Production IdP / OIDC product (ADR-0013 OPEN)
2. MFA implementation (GAP-IDN-02)
3. Production object-store provider and geography
4. NATS/JetStream commercial product, TLS scheme, and credentials
5. Production email product (SES vs SMTP vs other) and real From identity
6. Production public hostname, TLS termination, and CORS allow-list
7. Production listen/bind address (Cloud Run `0.0.0.0` vs current default `127.0.0.1`)
8. Secrets platform (ADR-0012 OPEN) — still `env-dev`
9. Observability / alerting vendor
10. Database CA/client certificates beyond `rejectUnauthorized: true`
11. Field-cache / KMS process key (none today)
12. Process supervision (OS/orchestrator)
13. Region / GCP project / bucket identifiers (not consumed)
14. Whether `EOS_TOKEN_TTL_SECONDS` should be wired or removed
15. Web BFF `EOS_API_URL` default `http://127.0.0.1:8080` for a future Production web process

---

## 19. Production status

The compiled application now has a **more internally consistent fail-closed configuration gate**, and the Case B silent-substitution defects are closed. It still **cannot** start as Production or UAT: IdP, object store, and infrastructure target remain unselected/unimplemented. Completeness of the Production architecture therefore still requires separately governed product, security, legal, and operational decisions.

```text
Production NOT READY
Production implementation NOT AUTHORIZED
productionReady = false
```

This status is **unchanged** by H-189. H-181 requests: **NONE**. H-81: **OUT OF SCOPE**. P19 / DR: **NOT PERFORMED**.
