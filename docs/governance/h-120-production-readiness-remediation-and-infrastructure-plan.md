# H-120 — Production Readiness Remediation and Infrastructure Dependency Plan

> **PLANNING AND PREPARATION ONLY**  
> **NOT Production authorization · NOT deployment · NOT catalog creation · NOT migrate · NOT credentials · NOT DNS · NOT certificates**  
> **`productionReady = false`** · **H-80 ACTIVE** · **H-81 NOT STARTED** · **SoR unchanged**

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Application code this increment:** **NONE**.

Classification of this increment:

```text
PRODUCTION REMEDIATION PLAN COMPLETE WITH FINDINGS
```

Finding: **zero H-119 P0 gaps can be closed in the repository without Production access, a vendor/product selection, or a further Owner/POA decision.** H-120 therefore delivers the remediation **matrix**, **runbooks**, and **configuration contracts**. It does not flip `productionReady` and does not authorize Production.

---

## 1. Executive status

H-117 UAT is **accepted with documented limitations** (H-119). H-118 established that H117-D-02 is Cursor IDE instrumentation, not an application Shell defect. H-119 classified overall Production-readiness as **`NOT READY`**.

Inspection of the live startup/configuration path (`apps/api/src/deployment-config.ts`, `main.ts`, `ports/identity.ts`, `events/transport-init.ts`, `notifications/email-config.ts`, `infrastructure-contract.ts`, `persistence/startup-migrations.ts`, `packages/db/src/migrate-guard.ts`) confirms H-119’s P0 list remains technically accurate:

- Production-like env (`EOS_ENV=production|uat` or `NODE_ENV=production`) **fail-closes** when required products are unselected.
- Local-password IdP, Dev token fallback, in-memory NATS, `dev-outbox`/`smtp-stub` email, `local-fs` documents, `EOS_SEED_DEMO=true`, and documented bootstrap passwords are **refused**.
- Startup migrations are **not applied** in production-like env (`production_gate_c_not_authorized`).
- `validateDeploymentConfig()` returns `productionReady: false` by type.
- Bounded shutdown POST is **not registered** outside bounded Dev/Test loopback.

No application change is authorized or necessary in this increment: writing code to “select” NATS/email/IdP/CORS origins would constitute a vendor or architecture decision that ADR-0006 / DP-0006 / ADR-0013 explicitly leave **OPEN**.

**Overall Production-readiness remains `NOT READY`. Production authorization remains `NOT GRANTED`.**

---

## 2. H-119 baseline

| Item | H-119 record |
| --- | --- |
| UAT | `H-117 UAT ACCEPTED WITH DOCUMENTED LIMITATIONS` |
| H117-D-01 | DATA/ENVIRONMENT (Windows `npx tsx` wrapper); in-process bounded POST shutdown evidenced |
| H117-D-02 | Cursor `data-cursor-ref`; no application remediation |
| H-118 | `REMEDIATION COMPLETE WITH LIMITATIONS` |
| Overall Production-readiness | `NOT READY` |
| Application slice (isolated UAT) | READY WITH CONDITIONS |
| Database / hosting / secrets / IdP / TLS / backup / ops | NOT READY or HUMAN/INFRASTRUCTURE / GOVERNANCE |

H-120 does not rewrite H-117, H-118, or H-119 evidence.

---

## 3. Production authorization boundary

This increment **does not** authorize:

- Production deployment, database creation, migration, credentials, secrets, DNS, certificates, or infrastructure provisioning
- Gate B / `eos_gateb`
- F2-I12; I1–I11 thaw
- SoR cutover; ingestion; booking; KPI history; revenue/profit/FX
- Unresolved live-proposal Rate Identity policies
- Closing ADR-0006 or DP-0006
- Setting `productionReady: true`

Existing catalogs that **must not** be treated as Production:

| Catalog | Role | Constraint |
| --- | --- | --- |
| `127.0.0.1:5432/eos` | Bounded F2-DP-01 Dev/Test | CLI/startup migrate **refused** (`h111_eos_124_only_preserved`) |
| `127.0.0.1:5435/eos_h112_full` | Full-schema Dev/Test | Disposable; leftover demo-seed possible |
| `127.0.0.1:5436/eos_h117_uat` | Isolated UAT evidence | Synthetic UAT data only |
| `eos_gateb` | Gate B | **Unauthorized** (`eos_gateb_not_authorized`) |

A future Production catalog, if ever authorized, must be a **new** name, host, and credential set.

---

## 4. P0 gap inventory

Class: **A** repository-remediable · **B** infrastructure/human owner · **C** governance decision · **D** post-Production/operational.

“Repository action possible now?” means documentation/contracts in this file, **not** that the P0 is closed. Closing still requires the listed human/infra/governance evidence.

| Gap ID | Current state | Evidence | Class | Production impact | Repo now? | Human/infra? | Governance? | Required evidence for closure | Current status | Next owner/action | Prod auth required? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H120-P0-01 Production authorization grant | Not granted | H-119 §3; this file | **C** | Blocks all Production acts | No | Yes | Yes | Named Owner/POA Production grant document | OPEN | Owner/POA — future grant, not H-120 | Yes (the grant itself) |
| H120-P0-02 Hosting/region | Unselected; Tanzania preference only | ADR-0006 proposed-blocked; DP-0006 OPEN; GAP-HST-01 | **C** | No place to run Production | No | Yes (after decision) | Yes | Approved ADR-0006 + named region/class | OPEN | Owner + Legal + evidence pack — **do not select here** | Yes before provision |
| H120-P0-03 ADR-0006 | **proposed — blocked for Production** | `docs/adr/ADR-0006-hosting-and-residency.md` | **C** | Architecture cannot close | No (closing it would fake approval) | Yes | Yes | Formal human approval after evidence | OPEN | Owner — do not auto-close | Yes to operate under it |
| H120-P0-04 DP-0006 | **OPEN — NOT APPROVED**; recommended option *Not selected* | `docs/decisions/DP-0006-hosting-data-residency.md` | **C** | Forbids locking IaC/host | No | Yes | Yes | Human approval of a named option | OPEN | Owner — do not lock Terraform/K8s | Yes |
| H120-P0-05 Production database | Does not exist | H-112/H-117 catalogs are not Production; GAP-PER-01 | **B** | No Production SoR | Docs only (runbook §9) | Yes (DBA/host) | Yes (must not use `eos`) | New catalog + credentials **outside** repo; never `eos`/`eos_h112_full`/`eos_h117_uat`/`eos_gateb` | OPEN | DBA after architecture + grant | Yes |
| H120-P0-06 Authorized Production migration procedure | Gate C Item 5 **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**; startup migrate refused production-like | `startup-migrations.ts`; Gate C Item 5 | **C** then **B** | Schema cannot be applied | Docs only (runbook §9) | Yes | Yes (Gate C / grant F) | Separate migrate authorization + executed apply evidence | OPEN | Owner grant **then** DBA | Yes |
| H120-P0-07 Secrets/KMS | Env files Dev; ADR-0012 blocked | GAP-SEC-01; `deployment-config.ts` | **C** then **B** | Cannot store Production secrets | No (would select KMS) | Yes | Yes | Named secrets platform; rotation owners; non-placeholder `EOS_TOKEN_SECRET` | OPEN | Owner (ADR-0012) then infra | Yes |
| H120-P0-08 IdP | Local-password Dev; production-like **refuses** it | `ports/identity.ts`; ADR-0013 OPEN; DP-0013 OPEN | **C** then **B** | Nobody can log in Production | No (would select vendor) | Yes | Yes | Named OIDC IdP + EOS principal mapping evidence | OPEN | Owner (ADR-0013) then identity owner | Yes |
| H120-P0-09 MFA | No application-side MFA; required at IdP/support | GAP-IDN-02; Q-I-07/Q-H-07 | **C** | Privileged Production access unverified | No | Yes (IdP MFA) | Yes (scope) | IdP MFA enabled for Production admin/support | OPEN | Identity owner after IdP selection | Yes |
| H120-P0-10 HTTPS | None Production | GAP-NET-01; Dev CORS is `http` loopback only | **B** | Traffic not Production-safe | Config contract only | Yes | After host | Valid TLS for public origin | OPEN | DNS/cert owner after host | Yes |
| H120-P0-11 DNS | TBD | GAP-NET-01; DP-0006 exit notes | **B** | No public name | No | Yes | Yes (name policy) | Delegated Production hostname | OPEN | DNS owner — **no change now** | Yes |
| H120-P0-12 Database TLS | `EOS_DATABASE_TLS_MODE=require` fatal if missing in production-like; Dev default disable | `deployment-config.ts`; `infrastructure-contract.ts` | **B** | Unencrypted DB path refused in production-like, but no Production DB to attach | Contract exists | Yes | No additional product if host offers TLS | Live Production PG with `require` + certs | OPEN | DBA after catalog exists | Yes |
| H120-P0-13 Production CORS | `applyDevTestCors` allows only `http` + `localhost`/`127.0.0.1`; wildcard rejected | `devtest-http-controls.ts` | **B** | Production origin would be rejected today — **fail-closed, appropriate** | Config contract only (`EOS` public origin **unselected**) | Yes | Yes (public origin) | Named HTTPS origins allow-list after DNS | OPEN | App ops after hostname exists | Yes |
| H120-P0-14 Backup | Product TBD; lab dumps excluded | GAP-BKP-01; ADR-0011 intent 19:00 EAT + remote copy | **B** | Data loss risk | Contract §14 | Yes | Yes (product later) | Named encrypted backup + remote copy evidence | OPEN | Backup owner after host | Yes |
| H120-P0-15 Restore | Lab synthetic only | GAP-REC-01; E2 PARTIAL | **D** (proof) + **B** (system) | Cannot prove recovery | Contract only | Yes | Yes (accept measured RTO) | Restore of **Production** state, not lab | OPEN | Ops after backup product | Yes |
| H120-P0-16 Operations ownership | HUM-08 **NOT ESTABLISHED** except Privacy/DPO | Owner formal decision record §7; ops plan | **B** | No accountable operator | Matrix §15 (titles only) | Yes | Yes (HUM-08) | Named/titled RACI | OPEN | Owner — **do not invent names** | Yes to operate |
| H120-P0-17 On-call ownership | None | Ops readiness plan NOT READY | **B** | No coverage of commercial RTO window | No | Yes | Yes | On-call roster overlapping EAT window | OPEN | Owner / ops | Yes to operate |
| H120-P0-18 E1-C legal/privacy Production-blocking | Counsel attestation complete; DPO **NOT ESTABLISHED**; entity/PDPC **NOT VERIFIED**; L-05/L-17 deferred | E1-C01 register 2026-09-16; GAP-LEG-01..08 | **C** + **B** | E1 not approved | Cross-ref §16 only | Yes | Yes | See §16 required evidence | OPEN | Legal / company / DPO — not Cursor | Yes |
| H120-P0-19 Production event transport | Interface `EventTransport`; Dev `in-memory-dev`; NATS client **implemented**; **product unselected**; production-like **throws** without `EOS_NATS_URL` | `transport-init.ts`; ADR-0004; GAP-PER-02 | **C** then **B** | Production-like **cannot start** without NATS URL | No (selecting NATS hosting would pick vendor) | Yes | Yes (ADR-0004 pending ADR-0006) | Named JetStream offering + URL in secrets, not git | OPEN | Owner then infra | Yes |
| H120-P0-20 Production email product | Adapters: `dev-outbox`, `smtp`/`smtp-stub`, `ses`/`ses-stub`; production-like fatal on stub/outbox | `email.ts`; `email-config.ts`; GAP-INF-02 | **C** then **B** | Notifications cannot be Production | No | Yes | Yes (subprocessor/DPA) | Named adapter + host/region **unselected**; DPA | OPEN | Owner then infra | Yes |
| H120-P0-21 Production process supervision | Intended contract: `npm run build` → `node dist/main.js` and `next start`; Dev uses `tsx` / `next dev` | `apps/api/package.json`; `apps/web/package.json`; H117-D-01 | **B** | Ad-hoc `npx tsx` is not Production | Contract §13 | Yes | No (supervisor product after host) | Supervised compiled process, not `tsx` | OPEN | Infra after host | Yes |
| H120-P0-22 Observability/logging/alerting | JSON logs + redaction; `productionReady: false`; no Production sink | GAP-OBS-01; `observability.ts` | **B** | No Production alert path | Contract only | Yes | Yes (product) | Named sink + on-call alerts | OPEN | Ops after host | Yes |
| H120-P0-23 Production configuration validation | Fail-closed implemented; cannot succeed until products exist | `validateDeploymentConfig`; tests `e1-c-deployment-config.test.ts` | **A** (contract) / remains **OPEN** for live values | Prevents silent Dev substitution — **appropriate** | Done in code already | Yes (values) | Yes (which products) | Passing production-like start on **real** config, not invented | OPEN for values; COMPLETE WITH CONDITIONS for fail-closed behaviour | Infra after all products selected | Yes to run it |
| H120-P0-24 Rollback/recovery procedure | Rollback SQL **not designed**; DR unselected | Gate C Item 5; GAP-DR-01/02 | **C** then **B** | Failed migrate/deploy has no Production rollback | Approach in §9 (restore-from-backup, not invented DROP scripts) | Yes | Yes | Authorized rollback method after topology | OPEN | Owner + DBA | Yes |
| H120-P0-25 Production data/SoR boundary | Operational SoR remains Office/Excel/mail/WhatsApp/phone | H-115/H-117/H-119 | **C** | Deploy ≠ adoption | Restated §3 | No | Yes | Separate SoR cutover grant if ever desired | OPEN (boundary preserved) | Owner — no cutover | Yes for cutover only |
| H120-P0-26 Production security/access model | `authorize()` RBAC evidenced in UAT; Production principals unprovisioned; CORS/HTTPS/IdP missing | H-117 AUTH-*; ADR-0005 OIDC protocol; ADR-0013 product OPEN | **C** + **B** | UAT authz ≠ Production access | No | Yes | Yes | IdP-linked principals + MFA + HTTPS origin | OPEN | Identity + Owner | Yes |

---

## 5. Repository-remediable items

Items that H-120 **does** close in-repo (documentation/contracts only):

| Item | Delivered here | Does **not** close |
| --- | --- | --- |
| P0 inventory with A/B/C/D | §4 | Production authorization |
| Production migrate runbook (unexecuted) | §9 | Actual migrate |
| Configuration contract (no secrets) | §17 | Live Production env |
| Process-supervision contract | §13 | A real supervisor |
| Backup/restore contract | §14 | A backup product |
| Operations RACI skeleton | §15 | Named owners except already recorded |
| E1-C cross-reference | §16 | Legal artefacts |
| Gate checklist + evidence requirements | §18–§19 | Green Production gates |

**No application code** was required: fail-closed production-like validation, migrate guards, identity refuse, NATS/email refuse, bounded-shutdown isolation, and Dev CORS already exist and were re-inspected. Implementing a Production CORS allow-list, OIDC client, or NATS URL would **select** products and is **not** authorized.

H117-D-01 remains DATA/ENVIRONMENT. H-120 does not add a second shutdown mechanism.

---

## 6. Infrastructure / human dependencies

Do not invent owner names. Recorded humans (do not expand):

| Already recorded | Role | Source |
| --- | --- | --- |
| THOMAS NGULUMA | LEGAL COUNSEL only (not DPO) | E1-C01 attestation 15 Sep 2026 |
| Wensley Shirima | Privacy/DPO **designation** on HUM-08 row; DPO appointment still **NOT ESTABLISHED** as combined E1 close | Owner formal decision record §7; E1-C01 |
| A.T.N | Legal Counsel approval mark | E1-C01 |

| Function | Dependency | Status |
| --- | --- | --- |
| Hosting / compute / region | Infra after ADR-0006/DP-0006 | OWNER NOT YET ASSIGNED |
| DBA / Production catalog | After host + grant | OWNER NOT YET ASSIGNED |
| DNS / certificates | After hostname decision | OWNER NOT YET ASSIGNED |
| Secrets/KMS | ADR-0012 | OWNER NOT YET ASSIGNED |
| Corporate IdP | ADR-0013; inventory company directory first | OWNER NOT YET ASSIGNED |
| Backup/restore | ADR-0011 product later | OWNER NOT YET ASSIGNED |
| On-call / app ops | HUM-08 | OWNER NOT YET ASSIGNED |
| NATS/JetStream offering | After architecture | OWNER NOT YET ASSIGNED |
| Email subprocessor | After architecture + DPA | OWNER NOT YET ASSIGNED |

---

## 7. Governance decisions required

Still **OPEN** (do not close in this file):

- Production authorization (H120-P0-01)
- ADR-0006; DP-0006; hosting class/region (Tanzania = preference only)
- ADR-0012 secrets; ADR-0013 IdP; ADR-0004 Production NATS product
- Gate C Production migrate authorization
- HUM-08 named RACI (other than recorded Privacy/DPO designation)
- E1 combined Legal/DPO close
- Whether overlay-only Rate Identity is the Production commercial contract (H-113 PARTIALLY DEFINED)
- H-80 exit; H-81; SoR cutover; booking; KPI/revenue/profit/FX; live-proposal rate policies

---

## 8. Production architecture dependency map

```text
Owner/POA Production grant (P0-01)
    └── ADR-0006 + DP-0006 (P0-02/03/04)
            ├── Host + region + network (P0-10/11)
            ├── Production PG catalog (P0-05) ── TLS (P0-12) ── migrate grant (P0-06)
            ├── Secrets/KMS (P0-07)
            ├── Event transport product (P0-19)
            ├── Email product + DPA (P0-20)
            ├── Object store (GAP-PER-03; not a separate H-119 P0 but fail-closed)
            └── Observability sink (P0-22)

Parallel (does not require host selection to *start*):
    ├── E-01 entity extract / E-02 PDPC / E-03 DPO (P0-18)
    ├── HUM-08 roster except already-named Privacy/DPO (P0-16/17)
    └── Corporate IdP *inventory* (P0-08) — selection still after ADR-0013

Blocked until IdP + HTTPS origin exist:
    └── MFA (P0-09), Production CORS (P0-13), Production principals (P0-26)

Blocked until catalog + backup product exist:
    └── Backup (P0-14), restore proof (P0-15), rollback (P0-24)

Never implied by the above:
    └── SoR cutover (P0-25), H-80/H-81, ingestion, booking, FX, Rate Identity live-proposal policy
```

Fail-closed application behaviour is **downstream** of these products: `validateDeploymentConfig` will keep exiting 1 until they exist. That is **correct**.

---

## 9. Database readiness plan

### 9.1 Facts (inspected, not executed)

| Fact | Evidence |
| --- | --- |
| Chain | `packages/db/schema.sql` then numbered `001`…`124`; hole **112–116** (files absent) |
| Highest file | `124_f2_dp01_commercial_facts.sql` |
| `schema.sql` header | “Not production-ready. No live data.” |
| CLI | `packages/db/src/migrate-cli.ts` — requires `EOS_DATABASE_URL`; prints `productionReady: false` |
| Guard | Refuses database name `eos` and `eos_gateb` |
| Startup migrate | `shouldApplyStartupMigrations`: production-like → **do not apply** |
| UAT apply | H-117: 120 rows on `eos_h117_uat` only |
| Rollback SQL | **Not designed** (Gate C Item 5) |
| `pgcrypto` | Required by `schema.sql` |

### 9.2 Production database migration runbook (UNEXECUTED)

**Do not run this runbook now.** It is a procedure for a **future** authorized Production catalog.

1. **Prerequisite checks**
   - Written Owner/POA Production **and** migrate grants exist.
   - ADR-0006/DP-0006 approved with named host.
   - Target URL is **not** `eos`, `eos_h112_full`, `eos_h117_uat`, or `eos_gateb`.
   - `EOS_ENV` production-like configuration is complete enough that the API would not exit 1 for unrelated fatals — **or** migrate is run by DBA CLI under a dedicated grant, not by API startup (startup currently **refuses** production-like migrate).
   - Encrypted backup of the empty/new catalog is possible (P0-14).
   - `pgcrypto` privilege confirmed on the host.
   - Numbering hole 112–116 acknowledged (not a failed apply).

2. **Database creation requirements**
   - New database name, user, and password from secrets platform — **not** `eos-dev-only`.
   - Network isolation; `EOS_DATABASE_TLS_MODE=require`.
   - No copy of UAT/Dev/Test data; no Production customer PII until a **separate** data-load grant (none exists).

3. **Backup requirements**
   - Pre-migrate backup of the new catalog (even if empty).
   - Backup encryption keys known (GAP-SEC-02). Retention **NOT YET GOVERNED** (E-13).

4. **Migration command/procedure**
   - After grant: DBA sets `EOS_DATABASE_URL` to the **new** catalog and runs the existing CLI (`npm run migrate -w @sedmc/db` or equivalent).
   - API process must **not** be relied on to migrate Production (`production_gate_c_not_authorized`).
   - **Do not** run this against `eos`.

5. **Migration verification**
   - CLI JSON `ok: true` and `applied` list; `productionReady` remains `false` until a later claim is authorized.
   - Re-run is idempotent (`applied: []`).

6. **Schema version verification**
   - Count `schema_migrations` rows; expect the same 120-file class as H-112/H-117 **on the new catalog only**.
   - Confirm hole 112–116 still has no files.

7. **Rollback/recovery approach**
   - There is **no** in-repo reverse migration.
   - Authorized approach: **restore from pre-migrate backup**, not invented `DROP` scripts.
   - If migrate fails mid-chain, treat catalog as compromised until restore.

8. **Application compatibility checks**
   - Production-like API start against the new URL **after** IdP/secrets/NATS/email/TLS are real — not against Dev adapters.
   - Confirm `GET /health` and `GET /ready` on the supervised process.

9. **Post-migration smoke tests**
   - Authenticated `/v1/me` via **Production IdP**, not Carol bootstrap.
   - Unauthenticated 401; unauthorized 403.
   - No SoR cutover; no ingestion; no booking smoke as operator authority.

**H-120 executed none of the above.**

---

## 10. Security readiness plan

### Authentication

- Protocol direction: OIDC (ADR-0005). Product: ADR-0013 / DP-0013 **OPEN**.
- Implemented: `local-password-dev` only. Production-like **cannot authenticate** with it (`localPasswordIdentityForbiddenReason`).
- Tokens: `EOS_TOKEN_SECRET` required in production-like; Dev fallback and `.env.example` placeholder **fatal**.
- Bootstrap Alice/Bob/Carol/Partner passwords are **fatal** if those exact Dev strings appear in production-like env.
- No OIDC client implementation to “turn on”. Selecting Entra/Google/Keycloak here is forbidden.

### MFA

- **No application-side MFA.** Requirement is IdP/console/support MFA (Q-H-07, Q-I-07, GAP-IDN-02).
- Closure evidence: IdP MFA enabled for Production privileged access — **external**.

### Authorization

- Server `authorize()` remains the authority. UAT: Carol 200, Alice 403, unauth 401.
- `/v1/me` has no permission keys (D5-S1 by design).
- Production administrative access = provisioned principals in EOS **after** IdP mapping — **not done**.

### Secrets

- Loader: env `SecretsProvider`. No KMS adapter selected.
- Do not put Production secrets in git. `.env.example` is Dev/Test placeholders only.
- Hard-coded Dev passwords exist **as documented Dev bootstrap** and are refused in production-like.

### Transport

- HTTPS: not configured. Dev CORS: `http` localhost/127.0.0.1 only — Production HTTPS origin would be **rejected** until an allow-list exists **after** DNS.
- DB TLS: `require` mandatory production-like.
- Cookies/session: bearer Dev/Test; Production session cookie policy **not specified** pending IdP.

Do not weaken these controls to make local startup easier.

---

## 11. Event / email dependency plan

### Event transport

| Question | Answer |
| --- | --- |
| Interface | `@sedmc/kernel` `EventTransport` |
| Env | `EOS_EVENT_TRANSPORT` default `in-memory-dev`; `nats-jetstream` + `EOS_NATS_URL` (`EOS_NATS_STREAM` default `EOS_EVENTS`, prefix `eos.events`) |
| Dev adapters | In-memory; NATS stub if URL missing (Dev only) |
| Production adapter | `createNatsJetStreamTransport` **implemented** (nats npm client) |
| Production-like absent URL | **Throw** — fail-closed — **appropriate** |
| Provider selection | **Governance** (ADR-0004 pending ADR-0006), then infra provision |
| Do not | Put a real `EOS_NATS_URL` in git or invent a cloud NATS |

### Email

| Question | Answer |
| --- | --- |
| Interface | `EmailNotificationAdapter` via `createEmailAdapter` |
| Env | `EOS_EMAIL_ADAPTER` default `dev-outbox`; `smtp` needs `EOS_SMTP_HOST`; `ses` needs `EOS_SES_REGION` |
| Dev | `dev-outbox`, `smtp-stub`, `ses-stub` |
| Production-like | `dev-outbox` / `smtp-stub` **fatal**; `ses` without region **fatal**; `smtp` without host **fatal** |
| Provider selection | **Governance** (subprocessor + DPA GAP-LEG-05 / GAP-INF-02) |
| Do not | Treat Dev SES keys or `sedmc.local` as Production |

---

## 12. Hosting / region decision status

| Item | Status |
| --- | --- |
| ADR-0006 | **proposed — blocked for Production** |
| DP-0006 | **OPEN — NOT APPROVED**; options A–D sketched; **Recommended option: Not selected** |
| Tanzania | **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** — not approval (GAP-RES-01, LA-06) |
| E1-B transmission | Historically paused/superseded as current next action (2026-09-17 gap register) — **not reopened here** |
| What cannot be decided from the repo | Vendor, region, colo vs cloud, backup copy location, DR site |
| Deployment architecture assumed | Portable app (Fastify + Next compiled start + PostgreSQL). **Not** a locked k8s/Terraform Production topology (DP-0006 forbids locking IaC before approval) |

**Classification: GOVERNANCE DECISION REQUIRED.** Do not close ADR-0006 or DP-0006 in H-120.

---

## 13. Process supervision requirement

**Production must not be operated with ad-hoc `npx tsx`.**

H117-D-01 (wrapper SIGTERM exit 1, no `shutdown_completed`) is **DATA/ENVIRONMENT**, not an application defect. In-process bounded `POST /eos-devtest/f2-dp-01/bounded-shutdown` remains the deterministic **Dev/Test bounded** route and is **not** a Production control (unregistered when not bounded / production-like).

| Script | Role |
| --- | --- |
| `apps/api` `dev` = `tsx src/main.ts` | Dev/Test only |
| `apps/api` `build` = `tsc`; `start` = `node dist/main.js` | **Intended compiled API entry** |
| `apps/web` `dev` = `next dev --webpack --port 3001` | Dev/Test only |
| `apps/web` `build` / `start` = `next build` / `next start --port 3001` | **Intended compiled web entry** |

Production supervisor (systemd, container orchestrator, or equivalent) is **unselected**. Required contract when one exists:

- Start compiled API (`node dist/main.js`) and compiled web (`next start`), not `tsx` / `next dev`
- Restart on crash; capture stdout/stderr
- Probe `GET /health` (liveness) and `GET /ready` (readiness; 503 when DB probe fails if pool attached)
- SIGTERM handled by existing `installF2Dp01BoundedDevtestShutdown` **only in bounded Dev/Test**; Production supervisor should send SIGTERM to **`node dist/main.js`**, not to an `npx tsx` wrapper
- Do not expose `/eos-devtest/f2-dp-01/bounded-shutdown` on Production (already fail-closed)
- Exit codes: configuration refuse → **1** before listen; that is fail-closed, not a supervisor bug

Do not introduce a supervisor implementation in this increment.

---

## 14. Backup / restore requirement

| Topic | Record |
| --- | --- |
| What to back up | Future Production PostgreSQL catalog **only** (not `eos` / `eos_h112_full` / `eos_h117_uat`) |
| Responsibility | OWNER NOT YET ASSIGNED |
| Retention | **NOT YET GOVERNED** (E-13 all periods TO BE DETERMINED) |
| Encryption | Required envelope (GAP-SEC-02); key location **unselected** |
| Schedule intent already governed | ADR-0011 / DP-0006: **19:00 EAT** + remote copy as **future** requirement — **not** an implemented job |
| PITR | Candidate; **not selected** (GAP-BKP-02). Do not claim RPO=0 |
| Business RTO/RPO (company position) | ≤3h / ≤4h cited in GAP-REC-02 — **not** measured technical values |
| Technical RTO/RPO | **NOT YET GOVERNED** as approved measured values |
| Restore test | Required before relying on backup; lab timings are **not** Production RTO |
| Evidence to close | Named product; encrypted remote copy; restore test artefact of the Production catalog |

**Backup readiness is not claimed.**

---

## 15. Operations / on-call requirement

**Operational readiness is not claimed.** HUM-08 named RACI: Privacy/DPO designation recorded; **other personnel = NOT ESTABLISHED**.

| Function | Owner |
| --- | --- |
| Application operations | OWNER NOT YET ASSIGNED |
| Database | OWNER NOT YET ASSIGNED |
| Infrastructure / host | OWNER NOT YET ASSIGNED |
| Security | OWNER NOT YET ASSIGNED |
| Identity | OWNER NOT YET ASSIGNED |
| Incident response | OWNER NOT YET ASSIGNED (E-15 draft ≠ Production IR) |
| Backup/restore | OWNER NOT YET ASSIGNED |
| DNS/certificates | OWNER NOT YET ASSIGNED |
| Privacy/DPO designation | Wensley Shirima (designation only; combined E1 DPO **NOT ESTABLISHED**) |
| Legal Counsel | THOMAS NGULUMA (counsel only) |
| On-call | OWNER NOT YET ASSIGNED |

E1-B RFI sender ≠ Production ops.

---

## 16. E1-C legal / privacy blockers

Do not reinterpret or weaken. Counsel positions remain adopted; factual artefacts remain incomplete.

| H-120 P0 | E1-C item | Current state | Required evidence | Blocking |
| --- | --- | --- | --- | --- |
| P0-18 | GAP-LEG-01 / E-01 | Company-provided name **Makundi Serengeti Experience DMC**; seed `Ltd` **not** verified | Registry extract | PRODUCTION-BLOCKING |
| P0-18 | GAP-LEG-02 / E-02 | PDPC **NOT VERIFIED** | Company-specific PDPC status artefact | PRODUCTION-BLOCKING if required/unknown |
| P0-18 | GAP-LEG-03 / E-03 | DPO **NOT ESTABLISHED**; counsel is not DPO | Appointment if required | PRODUCTION-BLOCKING if required; E1 incomplete |
| P0-18 | GAP-LEG-04 | Combined Legal/DPO **INCOMPLETE** | Both complete for E1 close | DECISION-BLOCKING for E1 |
| P0-18 | GAP-LEG-05 / E-07 | Vendor DPAs **absent** | Contracts after named provider | PRODUCTION-BLOCKING for vendors |
| P0-02/18 | GAP-LEG-06 / L-17 | Deferred | Assess connected services after topology | PRODUCTION-BLOCKING |
| P0-18 | GAP-LEG-07 / E-12 | Privacy notice **draft unpublished** | Complete after entity/DPO/recipients | PRODUCTION-BLOCKING to publish |
| P0-18 | GAP-LEG-08 | Kenya/GDPR/UK GDPR **conditional** | Fact-specific determination | DECISION-BLOCKING for those regimes |
| P0-02 | GAP-RES-01 | Tanzania preference ≠ approval | Approved jurisdiction | PRODUCTION-BLOCKING |
| P0-02 | L-05 / GAP-RES-02 | Data-flow map deferred | Actual Production topology | PRODUCTION-BLOCKING |

E1 = **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**. No legal conclusions invented here.

---

## 17. Production configuration contract

**No real values. No fake credentials as readiness evidence.** References only.

| Concern | Variable / contract | Production-like behaviour today |
| --- | --- | --- |
| Environment identification | `EOS_ENV=production` (note: `uat` is also production-like refuse) | Fail-closed until fatals empty |
| Database URL | `EOS_DATABASE_URL` secret reference | Required; in-memory refused |
| DB TLS | `EOS_DATABASE_TLS_MODE=require` | Fatal if not require |
| DB pool | `EOS_DATABASE_POOL_SIZE` (default 10) | Optional |
| Listen | `EOS_LISTEN_HOST` / `EOS_PORT` | Default `127.0.0.1` is Dev isolation — Production bind **unselected** |
| Token | `EOS_TOKEN_SECRET` (not placeholder, not Dev fallback) | Required |
| Auth/IdP | Corporate OIDC — **product unselected**; local-password **forbidden** | Fatal |
| MFA | External IdP — **not an EOS env var** | Unverified |
| Bootstrap passwords | Must not be `test-*-not-for-prod` | Fatal if those strings present |
| CORS | Today Dev loopback HTTP only; Production HTTPS origin **unselected** | Non-loopback origin rejected |
| HTTPS | Terminated at unselected edge/host | Not in app env |
| Event transport | `EOS_EVENT_TRANSPORT=nats-jetstream` + `EOS_NATS_URL` | Fatal if missing |
| Email | `smtp`+`EOS_SMTP_HOST` or `ses`+`EOS_SES_REGION` — **product unselected** | Stub/outbox fatal |
| Documents | Object store **unimplemented**; `local-fs` fatal | Fatal |
| Infra target | `local-devtest` fatal; `sedmc-owned-future` / `third-party-future` still “not authorized” | Fatal either way until implementation exists |
| Seed | `EOS_SEED_DEMO` must not be true | Fatal if true |
| Logging | `EOS_LOG_LEVEL`; JSON + redaction; `productionReady: false` | Dev sink ≠ Production SIEM |
| Health/ready | `GET /health`, `GET /ready` | Implemented; not Production-aware beyond DB probe |
| Process supervision | `node dist/main.js` + `next start` under unselected supervisor | See §13 |
| Backup/restore | External to app; see §14 | Not an env var |
| Demo / Dev headers | `X-EOS-DevTest` is Dev/Test HTTP control | Must not be treated as Production hardening |

If configuration is incomplete, **fail-closed is required**. Do not add silent Dev substitution to make Production-like start “work”.

---

## 18. Production gate checklist

Statuses used only: `COMPLETE` · `COMPLETE WITH CONDITIONS` · `OPEN` · `BLOCKED — HUMAN/INFRASTRUCTURE` · `BLOCKED — GOVERNANCE` · `NOT YET ASSESSED` · `NOT APPLICABLE`.

| Gate | Status | Closes when |
| --- | --- | --- |
| Engineering (authorized slice) | COMPLETE WITH CONDITIONS | H-115; conditions = documented limitations, not Production |
| Formal UAT | COMPLETE | H-117 |
| UAT acceptance | COMPLETE WITH CONDITIONS | H-119; limitations remain |
| H117-D-02 application defect | COMPLETE WITH CONDITIONS | H-118; Cursor overlay may still appear in IDE browser |
| H117-D-01 | NOT APPLICABLE as app defect | Process-control; Production must not use `npx tsx` |
| Fail-closed production-like config | COMPLETE WITH CONDITIONS | Code exists; live values OPEN |
| Production authorization | BLOCKED — GOVERNANCE | Owner/POA grant |
| ADR-0006 / DP-0006 / host / region | BLOCKED — GOVERNANCE | Human approval after evidence |
| Production database | BLOCKED — HUMAN/INFRASTRUCTURE | New catalog after grant |
| Production migrate | BLOCKED — GOVERNANCE | Gate C / grant F + DBA execute |
| Secrets/KMS | BLOCKED — GOVERNANCE | ADR-0012 + platform |
| IdP / MFA | BLOCKED — GOVERNANCE | ADR-0013 + IdP MFA |
| HTTPS / DNS / CORS | BLOCKED — HUMAN/INFRASTRUCTURE | After hostname |
| DB TLS live | BLOCKED — HUMAN/INFRASTRUCTURE | After Production PG |
| Event transport product | BLOCKED — GOVERNANCE | Named JetStream offering |
| Email product | BLOCKED — GOVERNANCE | Named adapter + DPA |
| Backup | BLOCKED — HUMAN/INFRASTRUCTURE | Named product |
| Restore proof | OPEN | Restore of Production state |
| Process supervision | BLOCKED — HUMAN/INFRASTRUCTURE | Supervised `node dist/main.js` |
| Observability | BLOCKED — HUMAN/INFRASTRUCTURE | Named sink + alerts |
| Ops / on-call | BLOCKED — GOVERNANCE | HUM-08 roster |
| E1-C legal/privacy | BLOCKED — GOVERNANCE | §16 artefacts |
| SoR cutover | NOT APPLICABLE | Not in Production-readiness of software; separate grant |
| Rollback | OPEN | Restore-from-backup after topology |
| `productionReady: true` | BLOCKED — GOVERNANCE | Explicit later claim — **not this increment** |

Documentation existing in H-120 is **not** `COMPLETE` for infrastructure gates.

---

## 19. Evidence required for each gate

| Gate | Evidence that would close it |
| --- | --- |
| Production authorization | Signed Owner/POA grant naming Production |
| Hosting | Approved ADR-0006/DP-0006 with selected option + region |
| Database | Connection **reference** (not secret in git) to a new catalog; DBA confirmation it is not `eos*` |
| Migrate | Grant + CLI apply JSON + `schema_migrations` count on **that** catalog |
| Secrets | Named KMS/platform; rotation owner; `EOS_TOKEN_SECRET` stored there |
| IdP | Named OIDC; EOS principals mapped; local-password unused |
| MFA | IdP policy evidence for Production admin |
| HTTPS/DNS | Certificate + resolved name; browser HTTPS to web |
| CORS | Documented allow-list matching that origin |
| DB TLS | `require` verified on live connection |
| NATS | Reachable JetStream; API `event_transport_ready` kind `nats-jetstream` |
| Email | Adapter logs non-stub send in Production (or equivalent) |
| Backup/restore | Encrypted copy + restore test artefact |
| Supervision | Process table shows `node dist/main.js`, not `tsx` |
| Observability | Alert fired in a controlled test |
| Ops | HUM-08 named/titled roster |
| Legal | Registry extract; PDPC artefact as required; DPO if required; unpublished notice not counted as published |
| SoR | Separate cutover grant — **absent**, correctly |

---

## 20. Explicit non-authorizations

H-120 does **not** authorize or perform: Production deployment; Production database creation; Production migration; Production credentials/secrets; DNS; certificates; infrastructure provisioning; Gate B; F2-I12; I1–I11 thaw; SoR cutover; mailbox/Excel/WhatsApp/phone ingestion; booking; KPI history; revenue/profit; FX; Rate Identity winner/freeze/expired-live-use/public-for-sale/overlay-mixed precedence; H-80 exit; H-81; commit; push; `productionReady: true`.

---

## 21. H-120 verification results

| Check | Result |
| --- | --- |
| Application code changed | **NONE** |
| Databases contacted for change | **NONE** |
| Migrate executed | **NO** |
| Production commands | **NO** |
| Tests | Documentation-only; no focused test run required |
| Static | This file created; H-117/H-118/H-119 not rewritten |

Git verification is recorded in the executing agent’s closing report (HEAD unchanged, index empty, porcelain +1 for this file).

---

## 22. Next governed action

**Do not start H-121 automatically. Do not deploy.**

Smallest concrete next action supported by this evidence:

```text
Owner/POA human Production-readiness session (NOT Production authorization):
  1. HUM-08 — assign titled operational owners (do not invent names in git).
  2. Route company collection of E-01 registry extract and E-02/E-03 artefacts.
  3. Inventory the corporate directory for ADR-0013 (do not select an IdP).
  4. Leave ADR-0006 / DP-0006 OPEN until hosting evidence exists.
  5. Keep productionReady = false.
```

Repository engineering cannot honestly close another P0 until those human/infrastructure inputs exist. A later increment that implements OIDC or Production CORS **without** a selected origin/IdP would be **out of order**.

```text
H-117 UAT ACCEPTED WITH DOCUMENTED LIMITATIONS
H-119 / H-120 PRODUCTION READINESS = NOT READY
PRODUCTION AUTHORIZATION = NOT GRANTED
H-80 = ACTIVE
H-81 = NOT STARTED
SoR = UNCHANGED
STOP
```
