# H-190 — Provider-Neutral Production Dependency Contract and Configuration Schema Gate

> **DEV/TEST ENGINEERING — PROVIDER-NEUTRAL CONTRACT ONLY.**  
> States what a future selected Production provider must supply.  
> **Does not** select IdP, MFA, object storage, NATS hosting, email, secrets/KMS, observability, or hostname.  
> **NOT** Production deployment. **NOT** UAT. **NOT** Production readiness. **NOT** Production implementation authorization.  
> H-181 through H-189 were **inspected and not rewritten**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 697  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-190 STATUS = COMPLETE
Contract conclusion = CLOSED WITH LIMITATIONS
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## 1. Repository baseline

Observed at H-190 start (not assumed):

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | 697 |
| Tracked diff vs HEAD | 183 files (pre-existing dirty lineage + H-189) |
| Dirty worktree | **preserved** |

H-189 artefact present and used as inventory. Not rewritten.

---

## 2. H-189 findings confirmed in code

Re-inspected `validateDeploymentConfig`, `initEventTransport`, `DocumentStorage`, `IdentityProvider`, `createEnvSecretsProvider`, CORS, `main.ts` shutdown.

H-189 remains correct:

* Silent Dev/Test email/loopback substitutions are refused.
* Production-like startup exits before migrate/seed/sync/drain/listen when the gate fails.
* Unselected products (IdP, object store, NATS hosting, hostname, secrets platform, observability vendor, KMS) were **named** but several **capability contracts** were incomplete:
  * NATS TLS scheme and URL authentication were not fail-closed.
  * SMTP TLS was not fail-closed.
  * Public origin was not a consumed configuration class (CORS always Dev/Test localhost).
  * `shutdownEventConsumers` existed but was never called on SIGTERM/SIGINT.
  * There was no central provider-neutral catalog.

---

## 3. Provider-neutral dependency matrix

Source of truth: `apps/api/src/production-dependency-contract.ts` (`PRODUCTION_DEPENDENCY_CONTRACT`). Wired into `validateDeploymentConfig` via `providerNeutralContractFatals`.

| Dependency | Required Production capability | Provider-neutral inputs | Provider-specific inputs | Validation boundary | Runtime consumer | Current status |
| ---------- | ------------------------------ | ----------------------- | ------------------------ | ------------------- | ---------------- | -------------- |
| Identity / IdP | Federated subject → EOS principal | `IdentityProvider.authenticateFederated({ issuer, subject, tenantSlug })` | issuer, client, JWKS **UNSELECTED** | local-password-dev fatal | `ports/identity.ts`, `app.ts` login | fail-closed-unselected |
| MFA | MFA before Human session | `identity.mfaEnabled` | MFA product **UNSELECTED** | identity fatal (GAP-IDN-02) | `/health` `/ready` | fail-closed-unselected |
| PostgreSQL | Durable URL SoR | `EOS_DATABASE_URL` non-loopback | host/account **UNSELECTED** | missing/loopback fatal | `createPool` | implemented; product unselected |
| PostgreSQL TLS | TLS + cert verify | `EOS_DATABASE_TLS_MODE=require` | CA **UNSELECTED** | `!== require` fatal | `createPool` ssl | implemented; certs unselected |
| Secrets | Resolve named references | `SecretsProvider.get(reference)` | platform **UNSELECTED** (ADR-0012) | token required; placeholders refused | `env-dev` | Dev/Test implementation only |
| KMS / encryption | No process KMS in current code | device-local field-cache key derivation | KMS product **UNSELECTED** | not a startup env | `field-cache-crypto.ts` | unselected; not a process dependency |
| Object/document storage | put/get/exists/stat/delete | `DocumentStorage` port | object-store product **UNSELECTED** | local-fs and unimplemented future fatal | `commercial-documents/` | fail-closed-unselected |
| Event transport | Publish + `health()`; distinguish in-memory / stub / live | `EOS_EVENT_TRANSPORT=nats-jetstream` | NATS hoster **UNSELECTED** | in-memory/stub refused | `transport-init.ts` | implemented; product unselected |
| NATS TLS | TLS URL scheme | `tls://` or `nats+tls://` | certs **UNSELECTED** | plaintext `nats://` fatal | `nats.connect` | **H-190 contract** |
| NATS authentication | URL userinfo | username on `EOS_NATS_URL` | token/nkey product **UNSELECTED** | missing userinfo fatal | `nats.connect` servers URL | **H-190 contract** |
| Email | `send()`; no Dev/Test sink | `ses` \| `smtp` + host/region + From | email product **UNSELECTED** | H-189 + SMTP TLS | `notifications/email.ts` | implemented; product unselected |
| Public hostname | Explicit https origin | `EOS_PUBLIC_ORIGIN` | hostname **value OPEN** | missing/http/loopback/wildcard fatal | CORS allow-list | contract closed; value open |
| CORS | Allow-list public origin; never `*` | `EOS_PUBLIC_ORIGIN` (Prod-like); localhost HTTP (Dev/Test) | same | wildcard/localhost refused Prod-like | `applyCors` | contract closed; value open |
| Observability | Structured JSON, correlation, health/ready | `EOS_LOG_LEVEL` | APM vendor **UNSELECTED** | not a startup fatal | `observability.ts` | application-emitted |
| Process supervision | SIGINT/SIGTERM: consumers → Fastify → pool | process signals | orchestrator **UNSELECTED** | startup `exit(1)` | `main.ts` | application-emitted |
| Health/readiness | Honest flags | none | none | `productionReady: false` | `server.ts` | application-emitted |
| Region/project | **not consumed** | — | — | — | — | do not invent |

No GCP/project/bucket identifiers are runtime selectors.

---

## 4. Environment matrix

| Setting/class | Dev | Test | UAT | Production |
| --------------------- | --- | ---- | --- | ---------- |
| Migration | isolated catalogs | same | no | no |
| Seed | if flagged | same | forbidden | forbidden |
| Store sync | yes | yes | no | no |
| Catalogue persistence | with sync | with sync | no | no |
| Outbox drain | after transport; in-memory OK | same | healthy NATS only | healthy NATS only |
| Event transport | in-memory default; NATS optional | same | live NATS TLS+userinfo | live NATS TLS+userinfo |
| Object storage | local-fs | local-fs | refused | refused |
| IdP | local-password-dev | same | refused | refused |
| Email | outbox/stubs/smtp/ses | same | ses/smtp + TLS | ses/smtp + TLS |
| Database TLS | disable default | disable | require | require |
| Secrets | env-dev | env-dev | env-dev (platform unselected) | env-dev (platform unselected) |
| CORS | localhost HTTP | localhost HTTP | `EOS_PUBLIC_ORIGIN` https | `EOS_PUBLIC_ORIGIN` https |
| Observability | console JSON | console JSON | console JSON | console JSON |

UAT and Production still **cannot listen** (IdP, object store, infrastructure target remain fatal even when origin/NATS/email contracts are filled with non-product placeholders).

---

## 5. Identity / MFA contract

**Existing implementation:** `local-password-dev` (`authenticatePassword` only).  
**Selected Production provider:** **none**.

Provider-neutral Production contract (port already in `packages/kernel/src/ports.ts`):

* Map `{ issuer, subject, tenantSlug }` → EOS `principalId`.
* Authorization remains EOS RBAC (IdP must not grant permissions).
* MFA must be enforced for Human actors; `mfaEnabled` is currently always `false`.
* Bootstrap local passwords are Dev/Test only; known values fatal in Production-like.
* Failure: Production-like refuses local-password; login returns `identity_not_production_ready`.
* Token verification today is **application HMAC** (`EOS_TOKEN_SECRET`), not IdP JWKS. A future OIDC provider must supply issuer/JWKS/audience; those env names are **not invented** because no consumer exists yet.

Clock tolerance is **not** configurable. Required claims for the current HS256 token: `sub`, `tid`, `act`, `jti`, `iat`, `exp`.

---

## 6. Object / document storage contract

Port `DocumentStorage`: `put`, `get`, `exists`, `stat`, `delete`. Metadata: `storageRef`, `sizeBytes`, `checksumSha256`, optional `contentType`. Encryption at rest is **not** required by the port. Authenticated access is a provider concern once selected.

Only implementation: `LocalFsDocumentStorage` (Dev/Test). Production-like always fatal (local-fs **and** unimplemented future). No cloud adapter was added.

---

## 7. Event / NATS contract

Distinguishable without a vendor:

| Kind | How known |
| --- | --- |
| in-memory | `kind === "in-memory-dev"` |
| stub | `kind === "nats-jetstream"` and `health().ok === false` |
| live | `kind === "nats-jetstream"` and `health().ok === true` |

Production-like: live NATS only; URL non-loopback; scheme `tls://` or `nats+tls://`; URL **userinfo** required (username). Connect uses `nats.connect({ servers: url })` (credentials in URL). Probe timeout remains 3000 ms (Dev/Test probe). Publish is required; connect failure throws (no stub). H-188 drain still requires `health().ok`. Logs/health **redact** URL userinfo.

NATS hosting product, nkey/JWT mechanism, and commercial plan remain **UNSELECTED**. No external NATS was contacted.

---

## 8. Email contract

| Adapter | Production-like required | Credentials | TLS | Sender | Failure |
| --- | --- | --- | --- | --- | --- |
| `ses` | `EOS_SES_REGION` (not placeholder) + From not `.local` | optional IAM/default chain | HTTPS SDK | `EOS_SES_FROM` or `EOS_SMTP_FROM` | H-189; send-time SES errors |
| `smtp` | host non-loopback + From not `.local` + **TLS** (`EOS_SMTP_SECURE=true` or port 465) | optional user/pass | **H-190** | `EOS_SMTP_FROM` | H-189 + TLS fatal |
| stubs / unknown / empty | forbidden | n/a | n/a | n/a | startup fatal |

Product remains UNSELECTED. No new vendor.

---

## 9. Secrets / KMS contract

| Class | Runtime expects | Rotation | Startup validation | Logged | Dev values in Production |
| --- | --- | --- | --- | --- | --- |
| Application token | raw via `SecretsProvider.get("EOS_TOKEN_SECRET")` | no | required; placeholders refused | redacted | refused |
| Bootstrap passwords | raw env refs | no | known Dev values fatal; missing exits Production-like | redacted | refused |
| Database credential | inside `EOS_DATABASE_URL` | no | URL required; loopback refused | URL may contain userinfo (pg) | loopback refused |
| Event credential | URL userinfo | no | userinfo required Production-like | **redacted** (H-190) | plaintext/loopback refused |
| Email credential | optional SES/SMTP env | no | not startup-fatal if adapter valid | redaction keys include secret/password | `.local` From refused |
| IdP credential | none (unselected) | n/a | local-password fatal | n/a | n/a |
| KMS | not used | n/a | n/a | n/a | n/a |

Field-cache uses `deviceId:principalId:salt` SHA-256 → AES-GCM. No process KMS.

---

## 10. Hostname / CORS contract

```text
provider-neutral contract = CLOSED
actual Production value = OPEN
```

* `EOS_PUBLIC_ORIGIN` is the public application origin (absolute `https://`, not localhost, not `*`).
* Production-like CORS allow-lists **exactly** that origin.
* Dev/Test CORS remains localhost HTTP only.
* API listen bind remains `EOS_LISTEN_HOST` (default `127.0.0.1`); process does not terminate TLS.
* Web `EOS_API_URL` is a separate BFF default and is not the Production hostname.

No hostname was inserted as a selected Production value. Tests use `https://app.example.invalid` as a **shape** only.

---

## 11. Observability contract

Application-generated: JSON logs (`productionReady: false`), redaction, correlation/request IDs, `/health`, `/ready` (optional `SELECT 1`).

Not required for startup: metrics backend, APM, alerting vendor, log sink other than stdout/stderr.

Hosting platform logs are out of process. No vendor SDK added.

---

## 12. Process-supervision contract

Expected model: one Node process, `node dist/main.js`.

* Startup failure: `validateDeploymentConfig` / identity / transport throw → `exit(1)` before listen.
* Default (non-bounded) shutdown: SIGINT/SIGTERM → `shutdownEventConsumers()` → `app.close()` → `pool.end()` → `exit(0)`.
* Bounded F2 Dev/Test shutdown remains the isolated named branch.
* Liveness: process up + `/health`.
* Readiness: `/ready` + optional DB probe; `productionReady` always false.
* Outbox drain is startup-only (H-188), not shutdown.

Orchestrator (Cloud Run, systemd, etc.) **UNSELECTED**. No Cloud Run-specific code was added.

---

## 13. Configuration-schema assessment

Validation remains **centralized** at `validateDeploymentConfig` (environment + required vs optional + Dev/Test refusals). H-190 adds `production-dependency-contract.ts` as the catalog and extra Production-like fatals (origin, NATS TLS/auth, SMTP TLS). No large refactor. No unused env vars. Secrets are not logged by the new fatals.

---

## 14. Silent-fallback audit (relevant Production/UAT reachability)

| Occurrence | Prod/UAT reachable? | Gated? | Notes |
| --- | --- | --- | --- |
| `in-memory-dev` default | no | yes | H-188/H-189 |
| NATS stub on connect fail | no (throw) | yes | Dev/Test only |
| email stubs / `?? "dev-outbox"` | no | yes | H-189 |
| `local-password-dev` | no | yes | identity fatal |
| `local-fs` | no | yes | storage fatal |
| `127.0.0.1` listen default | n/a (never listens) | isolation | origin now required separately |
| CORS localhost | no in Prod-like | **H-190** `applyCors` | uses `EOS_PUBLIC_ORIGIN` |
| plaintext `nats://` | no | **H-190** | TLS scheme required |
| `console` logger | yes (visibility) | intentional | not a fake sink |
| field-cache / tmpdir | no document path | storage fatal | |

Invariant preserved: Production/UAT must not silently substitute an unselected or Dev/Test dependency.

---

## 15. Code changes

| File | Rationale |
| --- | --- |
| `apps/api/src/production-dependency-contract.ts` | Central provider-neutral catalog + origin/NATS/SMTP TLS fatals + URL redaction. |
| `apps/api/src/deployment-config.ts` | Applies `providerNeutralContractFatals`. |
| `apps/api/src/devtest-http-controls.ts` | `applyCors` consumes `EOS_PUBLIC_ORIGIN` in Production-like. |
| `apps/api/src/server.ts` | Uses `applyCors`. |
| `apps/api/src/events/nats-transport.ts` | Health detail redacts userinfo. |
| `apps/api/src/events/transport-init.ts` | Logs redacted NATS URL. |
| `apps/api/src/main.ts` | Default shutdown calls `shutdownEventConsumers` before `app.close`. |
| `apps/api/src/h190-provider-neutral-contract.test.ts` | Regression. |
| `.env.example` | Documents TLS/userinfo/origin/SMTP TLS. No selected hostname/product. |

H-181–H-189 artefacts and H-187/H-188 gate modules were not rewritten.

---

## 16. Tests

```text
Run:    9 files / 57 tests
Passed: 57
Failed: 0
Skipped/not run: remainder of workspace (`npm test` not run)
```

Includes H-190, H-189, H-187, H-188, E1-C deployment/infra, E1-D HTTP, identity, I3.3 email.

---

## 17. Compiled runtime evidence

`npm run build -w @sedmc/api` then `node dist/main.js`:

* Production missing config: **EXIT=1**, including new `EOS_PUBLIC_ORIGIN` fatal. No listen/migrate/seed/drain.
* Production plaintext NATS + SMTP without TLS: **EXIT=1**, including `tls://` / userinfo / `EOS_SMTP_SECURE` fatals.
* UAT loopback DB: **EXIT=1**, including localhost DB + `EOS_PUBLIC_ORIGIN`.
* Dev compiled `validateDeploymentConfig`: `productionLike=false`, `fatal=[]`, `productionReady=false`.

---

## 18. Database evidence

No disposable PostgreSQL. Compiled Production/UAT exit before `createPool`.

```text
schema / business / outbox / seed mutation: NONE
```

---

## 19. Unresolved provider / product decisions (Case C)

```text
Decision required: Production IdP product
Why required: authenticateFederated has no implementation; local-password is forbidden
Code boundary: ports/identity.ts, app.ts login
Provider-neutral contract already established: IdentityProvider.authenticateFederated
What remains: issuer, JWKS/discovery, audience, client, MFA product
```

```text
Decision required: Production object-store product
Why required: DocumentStorage has no Production adapter
Code boundary: commercial-documents/storage.ts
Provider-neutral contract already established: put/get/exists/stat/delete
What remains: provider, bucket/account, credentials, geography
```

```text
Decision required: NATS hosting / credential product
Why required: TLS+userinfo shape is specified; hoster is not
Code boundary: nats-transport.ts
Provider-neutral contract already established: tls:// or nats+tls:// with URL userinfo
What remains: endpoint, nkey vs password vs token, certificates
```

```text
Decision required: Email product
Why required: ses and smtp are ports, not a selected vendor
Code boundary: notifications/email.ts
Provider-neutral contract already established: H-189 resolver + SMTP TLS
What remains: which adapter, real From identity, credentials
```

```text
Decision required: Secrets platform (ADR-0012)
Why required: only env-dev exists
Code boundary: ports/secrets.ts
Provider-neutral contract already established: SecretsProvider.get(reference)
What remains: platform, rotation
```

```text
Decision required: Production public hostname
Why required: EOS_PUBLIC_ORIGIN has no selected value
Code boundary: production-dependency-contract.ts, applyCors
Provider-neutral contract already established: https origin allow-list
What remains: the actual hostname
```

```text
Decision required: Observability vendor (optional for startup)
Why required: logs go to stdout only
Code boundary: observability.ts
Provider-neutral contract already established: structured JSON + health
What remains: sink/APM/alerting if operations require it
```

```text
Decision required: KMS product (not a current process dependency)
Why required: field-cache is device-local; no envelope KMS
Code boundary: field-cache-crypto.ts
Provider-neutral contract already established: none required at process start
What remains: whether Production later requires CMEK/process KMS
```

```text
Decision required: Process orchestrator
Why required: SIGTERM handling is process-local
Code boundary: main.ts
Provider-neutral contract already established: consumers → close → pool.end
What remains: Cloud Run vs other supervisor
```

---

## 20. Production status

A provider-neutral contract is **not** provider selection. A valid configuration schema is **not** Production implementation.

```text
Production NOT READY
Production implementation NOT AUTHORIZED
productionReady = false
```

H-181 requests: **NONE**. P19 / DR: **NOT PERFORMED**.
