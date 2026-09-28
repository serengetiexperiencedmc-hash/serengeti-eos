# E1-C — Infrastructure Portability and Deployment Abstraction

> **`DEV/TEST ONLY LOCAL TARGET`**  
> **`NOT PRODUCTION INFRASTRUCTURE`** · **`NOT PRODUCTION BACKUP`** · **`NOT PRODUCTION DR`**  
> **`NOT APPROVED DATA-RESIDENCY ARCHITECTURE`**  
> **`NOT TECHNICAL RTO/RPO EVIDENCE`**  
> **`NO PROVIDER SELECTED`** · **`NO FACILITY SELECTED`** · **`NO CLOUD SELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`** · **`E1 = NOT APPROVED / BLOCKED`**  
> **`Gate C = OPEN`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Working tree:** DIRTY (pre-existing Class A/B and E1-C diffs preserved).  
**Owner direction (not Production approval):** SEDMC-owned infrastructure in a suitable Tanzanian facility is considered *capable* of meeting EOS requirements **subject to** factual, legal, facility, security, recovery, and TCO evidence. This does **not** authorize purchasing servers, selecting hardware, selecting colo, selecting a cloud, provisioning, migrating, or deploying Production.

Frozen E1-B questionnaire / PE / template **unmodified**.

---

## 1. Objective

Build EOS **now** on the **local development machine / local hard drive** (and already-authorized disposable Dev/Test PostgreSQL) **without** requiring SEDMC-owned Production infrastructure to exist, while keeping a **clean infrastructure boundary** so a later move to:

1. SEDMC-owned servers (optional Tanzanian colocation), **or**
2. a qualified third-party / cloud provider (AWS, Azure, GCP, African/Tanzanian, or another E1-qualified party)

does **not** require rewriting application/business logic.

Local disk is **DEV/TEST INFRASTRUCTURE ONLY**.

---

## 2. Separation of concerns

| Layer | Contents | Must not contain |
| --- | --- | --- |
| **Application** | Commercial, CRM, RFP, Programme, costing, approvals, documents (metadata/workflows), audit, authZ, web, API | RDS/Cloud SQL APIs; S3/Blob/GCS SDKs; CloudWatch; VPC IDs; server IPs |
| **Data** | PostgreSQL SoR, audit, document metadata, outbox, backups/recovery **data** | Provider backup-product APIs inside domain code |
| **Infrastructure contract** | compute, database URL/TLS/pool, document storage port, identity port, secrets port, email port, event transport port, logs/health, backup/recovery **operational** contract | Selected vendor |
| **Infrastructure implementation** | local-devtest **now**; sedmc-owned-future and third-party-future **later** | Production authorization |

---

## 3. Current local Dev/Test target

| Item | Implementation | Label |
| --- | --- | --- |
| Compute | Node.js on the developer machine | **DEV/TEST ONLY** |
| Database | `EOS_DATABASE_URL` PostgreSQL 16-class (`pg` Pool). Compose `infra/compose/dev.yaml` or other authorized disposable PG | **DEV/TEST ONLY** |
| Document bytes | `LocalFsDocumentStorage` under `EOS_DOCUMENT_ROOT` or OS temp | **DEV/TEST ONLY** — not Production durability |
| Identity | `local-password-dev` | Fail-closed when Production-like |
| Secrets | `env-dev` (`EOS_*` environment variables) | Placeholders refused in Production-like |
| Email | `dev-outbox` / smtp-stub | Fail-closed when Production-like |
| Events | `in-memory-dev`; optional local NATS in compose | Fail-closed / no stub in Production-like |
| Observability | structured JSON logs, correlation/request IDs, `/health`, `/ready` | Not CloudWatch/Azure Monitor/GCP Ops |
| Backup/recovery | disposable PG dump/SQL-logical harness; refuses `eos_gateb` | Not Production backup; technical RTO/RPO **NOT DEMONSTRATED** |
| Listen | default `127.0.0.1` | Dev/Test isolation |

`EOS_INFRASTRUCTURE_TARGET` defaults to `local-devtest`. Production-like env **refuses** this target as Production.

---

## 4. Coupling audit (pre-change classification)

| Dependency | Class | Note |
| --- | --- | --- |
| `pg` + `EOS_DATABASE_URL` | **A** provider-neutral | No RDS/Cloud SQL management SDK |
| `DocumentStorage` + LocalFs | **B** local Dev/Test | Port is **A**; LocalFs implementation is **B** |
| `IdentityProvider` + local-password-dev | **B** / **D** if used as Production | Fail-closed **D** in Production-like |
| `SecretsProvider` env-dev | **B** / **D** placeholders in Production-like | ADR-0012 OPEN (**E**) |
| `EmailNotificationAdapter` + SES v2 SDK | Adapter **C**; business modules **A** | `@aws-sdk/client-sesv2` only in `notifications/ses-*`. Product **UNSELECTED** (**E**) |
| SNS webhook helpers | **C** optional email-event path | Not CRM/RFP/Programme logic |
| `EventTransport` in-memory-dev / NATS | Port **A**; in-memory **B**; NATS product **E** | Production-like refuses in-memory and stub |
| Fastify listen 127.0.0.1 | **B** | Production bind **E** |
| `infra/compose/dev.yaml` | **B** | Not Production architecture |
| Dockerfile / Terraform / K8s | **E** missing | Not created (would risk locking IaC — GAP-DEP-02) |
| CloudWatch / Azure Monitor / GCP Ops | **A** absent from app | Future exporters only |
| Hard-coded Production IPs / VPC / cloud regions in business logic | **A** not found | SES test fixtures may mention `eu-west-1` as **example**, not selected geography |

---

## 5. Boundaries established this stage

- `DocumentStorage.exists` / `stat` (size + SHA-256). Content-type remains on document metadata in SoR; LocalFs stores bytes.  
- `createPool(url, { max, tlsMode })` — portable PostgreSQL, not a cloud DBaaS API.  
- `infrastructure-contract.ts` — target label, document root/kind, pool options.  
- Production-like fail-closed: local-devtest, local-fs, `EOS_DATABASE_TLS_MODE` other than `require`.  
- `IdentityProvider.authenticateFederated?` typed as **FUTURE PROVIDER IMPLEMENTATION** — not implemented; no IdP selected; MFA not claimed.  
- Email/event/secrets/observability ports **unchanged in principle**; SES remains an optional adapter behind `createEmailAdapter`.

---

## 6. Configuration contract (provider-neutral)

| Item | Purpose | Required | Dev/Test | Production-like | Neutral requirement | Later provider adapter? |
| --- | --- | --- | --- | --- | --- | --- |
| `EOS_ENV` | Environment class | Optional (default development) | development | production/uat fail-closed | Yes | No |
| `EOS_INFRASTRUCTURE_TARGET` | Intended deployment class label | Optional | `local-devtest` | Must not be local-devtest; future targets still **not authorized** | Yes | No (label only) |
| `EOS_PORT` / `EOS_LISTEN_HOST` | HTTP bind | Optional | 8080 / 127.0.0.1 | Unselected | Configurable endpoints | Bind/TLS terminator **E** |
| `EOS_DATABASE_URL` | PostgreSQL connection | Optional Dev; required Prod-like | Local/disposable | Required | PostgreSQL-compatible URL | DBaaS **E** |
| `EOS_DATABASE_POOL_SIZE` | Pool size | Optional (10) | 10 | Configurable | Yes | No |
| `EOS_DATABASE_TLS_MODE` | Client TLS | Optional | `disable` | **`require`** | Yes | Certificates **E** |
| `EOS_DOCUMENT_STORAGE` | Bytes adapter | Optional | `local-fs` | local-fs refused; object store UNSELECTED | Port | S3-compatible **FUTURE** |
| `EOS_DOCUMENT_ROOT` | LocalFs root | Optional (OS temp) | Configurable path | N/A if local-fs refused | Portable paths | Facility path **E** |
| `EOS_TOKEN_SECRET` | Session HMAC | Optional Dev fallback | Dev fallback | Required; placeholders refused | Reference via secrets port | KMS **E** |
| Identity | AuthN | Local password | Allowed | Fail-closed | `IdentityProvider` | IdP **E** |
| `EOS_EMAIL_ADAPTER` | Mail | Optional | dev-outbox | not stub | `EmailNotificationAdapter` | SMTP/SES/other **E** |
| `EOS_EVENT_TRANSPORT` | Events | Optional | in-memory-dev | nats-jetstream + URL; no stub | `EventTransport` | Bus product **E** |
| Observability | Logs/IDs/health | Built-in | JSON + headers | `productionReady: false` | Exporters later | Cloud ops **E** |
| Backup | Operational | Harness only | Disposable PG | Not Production backup | Portable PG dump/PITR **later** | Backup product **E** |

No real secrets in this document.

---

## 7. Future SEDMC-owned server deployment contract

**FUTURE PROVIDER IMPLEMENTATION. NOT PROVISIONED. NOT HARDWARE SELECTION.**

The application container/process (when later authorized) expects **external**:

| Capability | Requirement (interface, not brand) |
| --- | --- |
| Compute / RAM / disk | Sufficient to run Node 20+ API and web; sizing **QUOTE REQUIRED** later |
| PostgreSQL | 16-class, durable, reachable via `EOS_DATABASE_URL`, TLS `require` |
| Document storage | Adapter implementing `DocumentStorage` on owned filesystem or later object store |
| Network | Configurable listen + reverse-proxy TLS; no hard-coded IPs in app |
| Identity | Non-local IdP implementing `IdentityProvider` (product UNSELECTED) |
| Secrets | Non-env-dev `SecretsProvider` (ADR-0012 OPEN) |
| Email / events | Configured adapters; products UNSELECTED |
| Backup / recovery | Portable PostgreSQL backup + restore tests; **technical RTO/RPO NOT DEMONSTRATED** |
| Admin access | Least privilege, MFA, logging (LA-16) — facility/process **E** |
| Logging/monitoring | Receive structured logs/metrics; product UNSELECTED |

Tanzanian facility remains **preferred baseline only**, not an approved Production location.

---

## 8. Future cloud deployment contract

**Equivalent contract.** Same env/ports. Adapters marked **FUTURE PROVIDER IMPLEMENTATION**:

- Managed PostgreSQL (RDS / Cloud SQL / Azure Database / African/TZ equivalent) — **connection URL only** from the app  
- S3-compatible or cloud object storage — `DocumentStorage` adapter **not written now**  
- Cloud IdP / KMS / SES / SNS / Monitor — optional adapters behind existing ports; **not selected**  

Do **not** create provider-specific Production IaC in this repository now (GAP-DEP-02).

---

## 9. Container / deployment assessment

No Dockerfile / Kubernetes / Terraform in-repo (by design). Portable packaging today: **`npm ci` + `npm run build` + `node dist/main.js`** with external PostgreSQL. A future container **must** treat the database as an external durable service and must not assume a cloud, physical server, IP, or filesystem layout. Kubernetes is **not** introduced here.

---

## 10. Recovery distinction (preserved)

| Business | Technical |
| --- | --- |
| Critical function **≤ 3 hours** | Technical RTO **NOT DEMONSTRATED** |
| Overall **≤ 4 hours** | Technical RPO **NOT DEMONSTRATED** |
| Zero tolerated loss of **critical business data** | Must **not** be written as RPO=0 achieved |

Local disk and lab PG timings are **not** Production RTO/RPO evidence.

---

## 11. Tests required / executed

Portability tests: `apps/api/src/e1-c-infrastructure-portability.test.ts`. Plus typecheck, API build, DocumentStorage tests. No Production migrate. No `eos_gateb` migrate. No cloud provision.

---

## 12. Production gates still open

Gate C; UAT; Production deploy/migrate; provider/facility/geography/architecture selection; Production IdP/KMS/WAF/CDN/email/event bus; isolated Production; technical RTO/RPO demonstration; E1 / DP-0006 / ADR-0006 approval.

**Exact next governed action (process):** continue parallel E1-B human transmission; do not provision servers or select a cloud from this file.

**SEDMC is NOT Production Ready.**

---

## 13. Additive — 2026-09-17 SEDMC-owned infrastructure direction

Companions: [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md), [`adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md`](adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md).

Section 12 process line above is **historical** for the portability sprint. **Current next action is not** E1-B human transmission.

SEDMC-owned infrastructure is the **preferred current direction** (servers **not** in place; Tanzanian facility **not selected**). Local Dev/Test remains **DEV/TEST ONLY**. Third-party/cloud remains an **optional future contingency**, **not selected**. E1-B transmission is **PAUSED / SUPERSEDED AS CURRENT NEXT ACTION**. **0 transmissions.**

**Current next action:** develop SEDMC-owned infrastructure requirements and continue local Dev/Test. Do **not** send provider RFIs unless separately reauthorized.

**SEDMC is NOT Production Ready.**
