# E1-D — Technical Remediation Classification

> **`ASSESSMENT / BOUNDARY ONLY — NO APPLICATION CODE CHANGED THIS STAGE`**  
> **`NO PRODUCTION IMPLEMENTATION`** · **`NO MIGRATION EXECUTED`** · **`NO PRODUCTION CREDENTIALS`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`E1-B OPEN — 9 / 2 / 1 ; 0 TRANSMISSIONS`**  
> **`CD-01 OPEN`** · **`DPO NOT ESTABLISHED`** · **`THOMAS NGULUMA = LEGAL COUNSEL ONLY`**

**Date:** 2026-09-17.  
**Verified against source:** `apps/api/src` (`server.ts`, `main.ts`, `app.ts`, `ports/identity.ts`, `ports/secrets.ts`, `observability.ts`, `persistence/durable.ts`, `commercial-documents/storage.ts`, `gate-b.fail-closed.test.ts`, `package.json`), kernel `DocumentStorage`, ADRs 0003/0004/0006/0011/0012/0013, Gate B/C records.

Primary class (exactly one per Technical ID):

| Class | Meaning |
| --- | --- |
| **A** | DEV/TEST IMPLEMENTABLE NOW — isolated Dev/Test; no Production provider/architecture/jurisdiction selection |
| **B** | DEV/TEST IMPLEMENTATION AUTHORIZATION REQUIRED — implementable but needs a specific governed authorization (this E1-D pack is **not** that grant unless a later human records it) |
| **C** | PROVIDER DEPENDENT |
| **D** | HUMAN DECISION DEPENDENT |
| **E** | MIGRATION AUTHORIZATION REQUIRED |
| **F** | PRODUCTION ONLY |

Creating this file is **not** implementation and **not** authorization.

---

## Counts

| Class | Count | Technical IDs |
| --- | --- | --- |
| A | **10** | TECH-SEC-01, TECH-SEC-03, TECH-SEC-04, TECH-SEC-05, TECH-SEC-07, TECH-OBS-01, TECH-OBS-05, TECH-DEP-02, TECH-INF-01, TECH-REC-07 |
| B | **8** | TECH-PER-02, TECH-PER-09, TECH-IDN-02, TECH-SEC-06, TECH-OBS-02, TECH-REC-01, TECH-EVT-01, TECH-PER-11 |
| C | **12** | TECH-PER-03, TECH-SEC-02, TECH-SEU-01, TECH-SEU-02, TECH-BKP-01, TECH-BKP-02, TECH-OBS-03, TECH-INF-02, TECH-NET-02, TECH-DR-01, TECH-IDN-03, TECH-OPS-03 |
| D | **6** | TECH-IDN-01, TECH-REC-03, TECH-OPS-01, TECH-OPS-02, TECH-SEC-08, TECH-BKP-03 |
| E | **4** | TECH-PER-05, TECH-MIG-01, TECH-MIG-02, TECH-MIG-03 |
| F | **8** | TECH-PER-01, TECH-PER-04, TECH-NET-01, TECH-REC-02, TECH-DR-02, TECH-DEP-01, TECH-SEU-03, TECH-TLS-01 |
| Total | **48** | 10+8+12+6+4+8=48 |

Secondary notes (provider also required, etc.) appear in columns. They do **not** create a second primary class.

---

## Classification table

| Technical ID | Existing GAP ID | Current implementation state | Required state | Class | Dependencies | Evidence | Test requirements | Security implications | Production implications | Migration implications | Provider dependency | Human decision dependency | Proposed implementation boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TECH-PER-01 | GAP-PER-01 | Dual-path PostgreSQL **when `store.dbPool` set** for opportunity, rfp, programme, costing, commercial-approval, commercial-documents (`main.ts` `gate_b_durable_sor`). Process-local Store remains SoR when pool unset | Production PostgreSQL-class SoR; no memory SoR in Production | **F** | Hosting; GAP-HST-01 | Gate B CLOSED / VERIFICATION ACCEPTED; ADR-0003 Dev | Production fail-closed + persist tests **PRODUCTION ONLY** | Memory SoR in Production would violate integrity | Do not promote Dev PG | Production schema path is Gate C remainder | YES (instance) | No (principle) | Dev dual-path **in force**. Do not provision Production PG |
| TECH-PER-02 | GAP-PER-02 | Jointly critical Commercial path: `runDurableTx` + `insertChainedAudit` + `insertDomainOutbox` **same transaction**. CRM `commitCrm` uses `void persistOutboxInsert` (**not** same TX). ADR-0004 in-memory event stand-in | Durable transactional audit+outbox for remaining relevant writes; Production event transport later | **B** | Event product later | `durable.ts`; `crm/events.ts`; Gate B tests | Integration: TX rollback leaves no orphan outbox | Orphan events / lost audit | Production still **F** after Dev hardening | New tables if a module lacks schema → **E** | Managed bus later | Event-bus product later | Dev/Test: authorize remaining-module TX outbox **separately**. Do not pick NATS host |
| TECH-PER-03 | GAP-PER-03 | `LocalFsDocumentStorage` Dev; kernel port `put`/`get` only | PG metadata + Production object store | **C** | Legal location | `storage.ts`; `119_cd_commercial_documents.sql` | Round-trip Dev labelled | Bytes location is a transfer fact | Adapter unselected | Metadata schema exists Dev | **YES** | Object-store class | Keep LocalFs. Do not select S3/equivalent |
| TECH-PER-04 | GAP-PER-04 | GB-13 test: pool connect fail → HTTP ≥500; no memory persist of opportunity | Same on Production runtime | **F** | Production DB | `gate-b.fail-closed.test.ts` **DEV/TEST** | Production proof | Fail-open would hide data loss | Do not cut over | None now | YES | No | Keep Dev test. No Production cutover |
| TECH-PER-05 | GAP-PER-05 | Gate C remainder **NOT AUTHORIZED**. Migration 123 **consumed** on disposable Gate-B Dev/Test only | Authorized Production/UAT schema path | **E** | Owner; architecture | Gate C backlog | After authorization only | Schema drift | **NOT AUTHORIZED** | **YES** — creation/execution of **new** or Production migrate | Host later | **YES** Gate C remainder | Do not create/execute new migrations this stage |
| TECH-PER-09 | GAP-PER-03 related; Gate C item 7 | `LocalFsDocumentStorage.delete` exists; kernel `DocumentStorage` type has **no** `delete`; service uses `storage?.delete` | Port-level delete + compensation contract | **B** | Gate C item 7 separate auth | `commercial-document.ts` vs `storage.ts` | Compensation after metadata fail | Orphan bytes | Production adapter must implement same contract | Not DDL | Adapter later | No | Kernel port change = **separate authorization**. Do not treat LocalFs.delete as Gate C item 7 closed |
| TECH-PER-11 | GAP-PER-02 related | Many modules still process-local (CRM, notifications, etc.) even if some rows dual-write | Explicit SoR map per module in Dev | **B** | TECH-PER-02 | `store.ts`; `void persist*` pattern | Module inventory tests | Dual-write races | Production module map after topology | May need schema | No for inventory | Scope which modules | Inventory/hardening under a persist auth pack; no Production SoR claim |
| TECH-EVT-01 | GAP-PER-02 / ADR-0004 | `eventTransportKind: "in-memory-dev"` default | Production NATS **proposed** pending ADR-0006 | **B** for local NATS-dev experiment; Production remains **C/F** (primary **B** = Dev stand-in vs local nats-server only) | ADR-0006 | `events/transport-init.ts`; ADR-0004 | Kind assertion tests exist | Event loss | Do not treat in-memory as Production bus | None | Production NATS **YES** | Architecture | Dev may keep in-memory. Real NATS in Dev needs **authorization**. Do not select Production bus host |
| TECH-IDN-01 | GAP-IDN-01 | `local-password-dev`; ADR-0013 unknown corporate IdP | Named OIDC IdP | **D** | HUM-05 | `ports/identity.ts` | After product chosen | Password IdP is Dev-only | ADR-0013 blocked Production | Possible later | If hosted **YES** | **YES** which IdP exists | Inventory now. Do not select host as IdP |
| TECH-IDN-02 | GAP-IDN-02 | **No** MFA/TOTP/2FA in `apps/api` | MFA on privileged access | **B** | HUM-05; Q-I-07 | Grep: no totp/mfa | Authn tests; no Production claim | Privileged password-only | Production MFA **F/C** | TOTP store would be **E** | Vendor support MFA **C** | Policy scope | Dev TOTP/session-step-up needs **implementation authorization**. Do not implement in this stage |
| TECH-IDN-03 | GAP-IDN-01 hosted | Dev IdP is local | Hosted IdP processing location | **C** | TECH-IDN-01 | None Production | After provider | Transfer | Unselected | None now | **YES** | After inventory | Wait PE identity-hosting |
| TECH-SEC-01 | GAP-SEC-01 related | `EOS_TOKEN_SECRET ?? "dev-only-change-me"` in `main.ts` / `server.ts`. `isProduction` exits if bootstrap secrets missing | No silent default in any environment that could be mistaken for Production; Dev default **labelled** | **A** | None | `main.ts` L30–52 | Unit: default only when not production flags | Stolen default JWT signing key | Must never use fallback in UAT/Production | None | No | No | Dev/Test: tests + optional refuse-default when `EOS_ENV` unset-but-CI. **Do not create Production secrets** |
| TECH-SEC-02 | GAP-SEC-01, GAP-SEC-02 | `EnvSecretsProvider` `env-dev`. ADR-0012 blocked UAT/Production | Named KMS/secrets + rotation | **C** | HUM-06 | `ports/secrets.ts`; ADR-0012 | After product | Secret sprawl | Blocked UAT/Production | None now | **YES** | Product choice **D** (secondary) | Keep gitignored env. Do not select Vault/cloud KMS |
| TECH-SEC-03 | GAP-SEU related | No Helmet/`@fastify/helmet`; no CSP/XFO headers in `server.ts` | Explicit HTTP security headers in Dev/Test API | **A** | CORS policy | `apps/api/package.json` has no helmet/cors/rate-limit | Header presence tests | XSS/clickjacking baseline | Production TLS/HSTS still **F** | None | No | Dev origin list | Fastify header plugin **Dev/Test**. HSTS only meaningful with TLS |
| TECH-SEC-04 | (security assessment) | No CORS plugin in API. Next `allowedDevOrigins` is **dev host allowlist**, not API CORS | Explicit CORS allowlist for Dev web origin | **A** | TECH-SEC-03 | `server.ts`; `apps/web/next.config.ts` | Preflight tests | Over-broad CORS | Production origins **after** DNS | None | Production origins **later** | Production origin **D/F** | Dev: localhost/127.0.0.1 only. Do not allow `*` |
| TECH-SEC-05 | (security assessment) | No HTTP rate-limit middleware (business “rate season” is pricing) | HTTP rate limit on auth and expensive routes | **A** | None | `package.json`; grep | 429 tests | Credential stuffing | Production limits may differ | Optional persist store → **E** if Redis | Managed limiter later | Thresholds | In-memory Dev limiter OK. Do not pick Production Redis |
| TECH-SEC-06 | TECH-SEC-03 related | Helmet not a dependency | Helmet vs manual headers decision | **B** | TECH-SEC-03 | Same | Same as headers | Header set choice | Same | None | No | Header profile | If Helmet is added, treat as **authorized dependency add**. Manual headers may stay **A** |
| TECH-SEC-07 | (security assessment) | `TEST_BOOTSTRAP_SECRETS`; carol.admin@sedmc.local; Production path `process.exit(1)` if bootstrap missing | Bootstrap users **forbidden** in Production | **A** | TECH-SEC-01 | `main.ts` | Guard tests exist in spirit | Seed passwords | **PRODUCTION ONLY** to forbid data | None | No | No | Keep Dev seeds. Do not copy to Production |
| TECH-SEC-08 | GAP-IDN-02 / HUM | Kernel `authorize`, SoD, PAM JIT exist | MFA policy + privileged access reviews | **D** | HUM-08; IdP | Kernel + PAM modules | After policy | SoD without MFA is weaker | Production access reviews | None | IdP MFA **C** | **YES** | Policy first. Do not claim Production IAM |
| TECH-SEU-01 | GAP-SEU-01 | No WAF/CDN in topology | Assess if used | **C** | Architecture | None | After topology | Edge processing = transfer | Unselected | None | **YES** | Include/not | Do not assume Cloudflare/etc. |
| TECH-SEU-02 | GAP-SEU-02 | Password hashing in kernel. Production at-rest/in-transit **unverified** | Envelope encryption | **C** | KMS | Kernel verifyPassword | After provider | Data at rest | Unverified | None now | **YES** | No | Do not assume disk encryption |
| TECH-SEU-03 | GAP-SEU-03 | Dev session logs via observability | Production MFA+session logs | **F** | IdP; SIEM | Dev logger | Production | Audit of admin | **PRODUCTION ONLY** | None | YES | No | Keep Dev logs labelled |
| TECH-TLS-01 | GAP-NET-01 | No Production TLS termination evidenced | Isolated Production TLS | **F** | DNS; host | None | TLS scan Production | Interception | **PRODUCTION ONLY** | None | YES | DNS owner | No Production certs this stage |
| TECH-OBS-01 | GAP-OBS-01 related | `createLogger` JSON + redaction; `productionReady: false` | Keep Dev label; richer fields optional | **A** | None | `observability.ts` | Snapshot tests optional | Secret leakage if redaction regresses | Not SIEM | None | Production sink **C** | Retention **D** later | Do not set `productionReady: true` |
| TECH-OBS-02 | GAP-OBS-02 | `/health` always ok payload with `productionReady: false`. `/ready` uses `dbHealth` or **`{ ok: true, mode: "memory" }`** | Durable audit; dependency probes that do not lie | **B** | Persistence | `server.ts` L195–217 | Ready=503 when DB required | False ready | Production probes **F** | Audit durability may be **E** | Location later | Retention | Authorize probe honesty (fail ready if dual-path expected). Do not claim Production audit durability |
| TECH-OBS-03 | GAP-OBS-01 | Module health routes; security alerts `source: "devtest.webhook"` | Production logs/metrics/alerts | **C** | Ops on-call | `security/service.ts`; `obs/routes.ts` | After product | Alert fatigue / miss | Unselected product | None | **YES** | On-call **D** | Do not pick Datadog/etc. |
| TECH-OBS-05 | (assessment) | Request completed/error hooks | Keep; do not ship to Production SIEM as proven | **A** | TECH-OBS-01 | `registerObservability` | Existing | PII in logs | Label Dev | None | No | Log content policy | No new sink |
| TECH-BKP-01 | GAP-BKP-01 | ADR-0011 **evidence-register only**; E2 lab dump **LAB** | Named encrypted backup product | **C** | Legal location | ADR-0011; E2 lab | Restore probe | Backup = copy = transfer | Unselected | None now | **YES** | Product later | Lab ≠ Production backup |
| TECH-BKP-02 | GAP-BKP-02 | PITR **candidate**; E2 **PARTIAL** | Disclose WAL if adopted | **C** | TECH-BKP-03 | E2 lab | PITR restore labelled | WAL location | Unselected | WAL archive design | **YES** | Adopt **D** | Do not claim RPO=0 |
| TECH-BKP-03 | GAP-BKP-02 / HUM-15 | Candidate only | Adopt or not-adopt PITR as Production control | **D** | Provider capability | HUM-15 | After evidence | Relates to zero-loss **business** envelope | Relative | None until adopted | YES secondary | **YES** | Do not adopt in this stage |
| TECH-REC-01 | RV-01–RV-07 prep | GB-14 `gate-b-recovery-harness.ts` attach pool / new process; **does not** call `migrate()` or backup | Dev/Test restore harness against disposable PG | **B** | Disposable DB | Harness file; RV plan | Labelled restore tests **NOT RUN** as Production | Restore copies | Not Production evidence | Harness must **not** `migrate()` new files | Lab PG only | No | Authorize Dev restore drills. No Production test |
| TECH-REC-02 | GAP-REC-01, GAP-REC-02 | Lab synthetic only; **no** Production measurement | Restore real Production SoR; measured technical RTO/RPO | **F** | Production SoR | E2 **LAB** | Clocked tests after auth | Integrity | **PRODUCTION ONLY** | Production migrate first **E** | YES | Accept results | Do not invent RTO/RPO |
| TECH-REC-03 | GAP-REC-03 | Two BCM sequences | Governing sequence | **D** | CD-01 | BCM decision record | After decision | Runbook order | Decision-blocking packaging | None | No | **YES** Owner | Do not pick S1/S2 |
| TECH-REC-07 | RV-04 | LocalFs round-trip tests exist in CD foundation tests | Keep labelled Dev document recovery tests | **A** | TECH-PER-03 | `cd-phase1-foundation.test.ts` | Existing suite | Orphan files | Not Production object store | None | No | No | Dev only |
| TECH-DR-01 | GAP-DR-01 | Unselected | Assessed DR jurisdiction **if used** | **C** | HUM-10 | LA-08/09/14 | After region | Restricted+ | Unselected | None | **YES** | **YES** after evidence | Do not invent DR region |
| TECH-DR-02 | GAP-DR-02 | No failover procedures | Documented tested failover/failback | **F** | TECH-DR-01 | None | After topology | Failover copies | If in topology | None now | YES | Ops owner | No Production failover test |
| TECH-DEP-01 | GAP-DEP-01 | UAT/Production not authorized | Approved DP-0006 + runbook | **F** | ADR/DP | DP-0006 OPEN | After approval | Deploy = exposure | **NOT AUTHORIZED** | Cutover **E** | Host facts | **YES** | Do not deploy |
| TECH-DEP-02 | GAP-DEP-02 | Standing do-not-lock IaC | Portable until DP-0006 | **A** | Hosting decision | DP-0006 rule | N/A | Lock-in | Do not provision | None | Later | Later lock | Maintain portability. Not closure of GAP-DEP-02 |
| TECH-INF-01 | GAP-INF-01 | Increment 0 local; no live PII in Dev intended | Isolated Production; no live PII in Dev | **A** | Authorization | ADR-0006 | Hygiene | Data leakage | Isolated Production **does not exist** | None | No | Must not create Prod creds | Do not create Production credentials/data |
| TECH-INF-02 | GAP-INF-02 | `dev-outbox` email adapter | Production email | **C** | Subprocessor | `notifications/email.ts` | After product | Email = processor | Dev ≠ Production | None | **YES** | Product | Do not use Dev SES as Production |
| TECH-NET-01 | GAP-NET-01 | Production DNS/TLS TBD | Isolated Production network | **F** | Host | None | After host | Network path | **PRODUCTION ONLY** | None | YES | DNS owner | No Production DNS change |
| TECH-NET-02 | GAP-NET-02 | CU-05 HOLD | Connect only if hybrid later | **C** | Architecture | E1-B4.5 | Scope replies if ever sent | Hybrid path | HOLD | None | **YES** if later | Scope | No SEND CU-05 |
| TECH-OPS-01 | GAP-OPS-01 | Ownership TBD | Named restore/on-call | **D** | HUM-08 | Ops plan NOT READY | After RACI | Unowned restore | Blocks readiness | None | Support model later | **YES** | Paper RACI; no go-live |
| TECH-OPS-02 | GAP-OPS-02 | E-15 draft | Production IR | **D** | DPO; provider contacts | Draft | After owner | Notify clocks | Draft ≠ ready | None | Contacts **C** | **YES** | Keep draft |
| TECH-OPS-03 | GAP-OPS-03 | SLA unknown | Hours vs EAT Commercial RTO | **C** | Quotes | None | After SLA | False RTO expectation | Unselected | None | **YES** | Accept SLA | Wait quotes |
| TECH-MIG-01 | Gate C item 4 | OPEN; assessment exists; **not a migration** | Production query-plan indexes if named | **E** | Architecture | OA.15 | After naming | Index = Production change | **NOT AUTHORIZED** | Index DDL would be migration | Host | **YES** | Do not create index migrations |
| TECH-MIG-02 | Gate C item 5 | **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE** | Production migrate/backfill/cutover scripts | **E** | Architecture selected | OA.16 | After architecture | Data movement | **NOT AUTHORIZED** | **YES** | YES | **YES** | Do not write Production cutover SQL |
| TECH-MIG-03 | Gate C item 6 | Optional event catalogue rows OPEN | Catalogue rows if authorized | **E** | TECH-EVT-01 | Backlog item 6 | After auth | Event metadata | Not Production bus | **YES** if executed | No for Dev row | **YES** | Separate authorization |

---

## Persistence review (Phase 4) — summary

| Question | Finding |
| --- | --- |
| Implemented in Dev/Test | Dual-path SoR for listed Commercial modules when `dbPool` set; chained audit + outbox **in-transaction** on that path; optimistic `version` match (`OptimisticConcurrencyError`); GB-13 fail-closed test; LocalFs documents; GB-14 recovery harness (attach pool; no `migrate()`) |
| Remains | Other modules still memory-authoritative; CRM outbox persist fire-and-forget; Production SoR; Production object store |
| Still in-memory | Default tests; CRM collections; event transport `in-memory-dev`; ADR-0011 BCM register (not a PG dump) |
| PostgreSQL-backed | When `EOS_DATABASE_URL` set: migrate **existing** files, sync seed, dual-path Commercial |
| Audit/outbox transactional? | **Yes** on Gate B Commercial `runDurableTx`. **No** on CRM `void persistOutboxInsert` |
| Reads per-request SQL? | **Yes** for those Commercial getters when `isDurableSoR` |
| Fail-closed? | **Yes** in GB-13 unit/API test when pool throws |
| Optimistic locking? | **Yes** on durable updates (`assertVersionMatch` / WHERE version) |
| DocumentStorage abstraction? | **Yes** port + LocalFs. Kernel type **put/get only** |
| Bytes/metadata consistency? | Compensation via optional `delete`; kernel port lacks `delete` (**contradiction** with Gate C item 7 OPEN) |
| Process-local SoR anywhere relevant? | **Yes** whenever `dbPool` unset, and for non-dual-path modules even when set |

**MIGRATION AUTHORIZATION REQUIRED** for TECH-PER-05, TECH-MIG-01..03, and any new MFA/rate-limit/schema tables. **Do not execute. Do not create new SQL this stage.**

---

## What this stage does **not** do

Implement A/B items; add npm helmet/cors/rate-limit; select IdP/KMS/WAF; run Production or new migrations; claim RTO/RPO; close CD-01.
