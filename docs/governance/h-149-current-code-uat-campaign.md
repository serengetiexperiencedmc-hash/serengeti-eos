# H-149 — Current-code UAT campaign

> **CURRENT-CODE UAT EXECUTION** · Isolated Dev/Test only · Synthetic data only  
> **NOT Production** · **NOT Production authorization** · **NOT Production deployment** · **NOT SoR cutover**  
> Historical H-117 is **not** current-code coverage. H-146/H-147 were **not** overwritten.  
> H-148 was **explicitly skipped** by Owner/POA.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)

```text
H-149 STATUS: PASS WITH FINDINGS
OWNER UAT AUTHORIZATION: GRANTED UNDER POA
CURRENT-CODE UAT: AUTHORIZED / EXECUTED
UAT CATALOG: eos_h149_uat
MIGRATION LEVEL: 125
EOS_ENV: development
SYNTHETIC DATA: YES
UAT PASS ≠ PRODUCTION READY
PRODUCTION: NOT AUTHORIZED / NOT READY
STOPPED AFTER H-149: YES
COMMIT: NONE
PUSH: NONE
PRODUCTION MIGRATION: NONE
```

---

## A. H-149 authority

| Item | Record |
| --- | --- |
| POA | Exercised (H-145). Owner authorized this current-code UAT campaign. |
| Scope | Current worktree only, including migration 125 and H-139–H-145 privacy remediation |
| Environment | Isolated disposable UAT catalog only |
| Data | Synthetic / non-personal Dev identities only (`carol.admin@sedmc.local`, `alice.finance@sedmc.local`, `bob.approver@sedmc.local`, `partner@external.local`, names `UAT Synthetic *`) |
| Production | **Not authorized** |
| Production deployment | **Not authorized** |
| Live Production migration | **Not authorized** |
| H-148 | **Skipped** (Owner instruction). Existing H-148 file, if present, is not this campaign. |
| H-147 | Historical readiness assessment only. Seven UAT prerequisites were the entry conditions; this grant satisfies them. |

This authorization does **not** cover Production infrastructure, credentials, DNS, secrets, deployment, user onboarding, Production data, or Production migration.

Commercial SoR remains Office, Excel, Outlook/Gmail, WhatsApp, and phone. EOS has **not** replaced those systems. C11+, F2-I12, Path D, mailbox/WhatsApp/Excel ingestion, FX, KPI/revenue reconstruction, and 250k/20% remain out of scope.

---

## B. Environment

| Item | Value |
| --- | --- |
| Database host | `127.0.0.1` |
| Catalog | `eos_h149_uat` on published port **5439** |
| Container | `serengeti-eos-h149-uat-pg` (`postgres:16-alpine`), user `eos_h149` |
| Migration level | Current worktree through **125** (`125_h135_phase1_personal_data_domain.sql`). `schema_migrations` count **121**. No 126. |
| EOS_ENV | `development` (required: `EOS_ENV=uat` is production-like and refused) |
| API | `http://127.0.0.1:18149` (`EOS_LISTEN_HOST=127.0.0.1`) |
| Web | `http://127.0.0.1:3049` with `EOS_API_URL=http://127.0.0.1:18149` and `EOS_WEB_DIST_DIR=.next-h149-uat` |
| Startup | Default Dev/Test migrate+hydrate+`dbPool` path. `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP` unset. Bounded opt-in unset. `EOS_SEED_DEMO=false`. |
| Document storage | LocalFs Dev/Test; root under OS temp `eos-h149-uat-docs` (not Production object store) |
| First API start | `database_migrated` applied `[]` (125 already applied by CLI); `api_listening` `http://127.0.0.1:18149`; `productionReady: false` |
| Restart hydrate | CRM orgs/accounts/activities/tasks/notes = 1; F2 facts opportunities/rfps/pathB/accounts/programmes = 1, rates = 12; mixed suppliers = 1, rates = 1, contacts = 0 |
| Production connection | **None** |

Credentials are **not** recorded here. Bootstrap identities match `.env.example` Dev/Test values only.

### Isolation (UAT-REC-02)

Did **not** use `eos`, `eos_h112_full`, or `eos_gateb`. Did **not** reuse historical `eos_h117_uat`.

| Catalog | Observation |
| --- | --- |
| `127.0.0.1:5432/eos` | `to_regclass('public.schema_migrations')` **NULL** — unused |
| `127.0.0.1:5435/eos_h112_full` | still **120** migration rows — unused |
| `127.0.0.1:5436/eos_h117_uat` | still **120** migration rows — unused |
| `127.0.0.1:5434` Gate B | container running, unused |
| `127.0.0.1:5439/eos_h149_uat` | **121** rows including 125 — UAT writes only |

Evidence: `docs/governance/h-149-evidence/uat-environment-identity.json`, `uat-01-isolation.json`.

### Migration 125 apply note (H149-I-01)

Fresh apply of the current 125 file initially failed: `schema_registry_status_check` allows only `planned`/`active`, while authorized H-135 SQL sets HR catalogue rows to `retired`. Under existing H-135 authorization, the **same** 125 file (not 126, not 001–124) was completed with a CHECK expansion to include `retired`, then re-applied successfully. That is a Dev/Test schema-completeness fix required to UAT the authorized 125 chain. It is **not** a Production migrate.

---

## C. Scenario matrix

Evidence files: `h-149-evidence/wave1-results.json`, `wave2-restart-results.json`.  
Harness: `h-149-evidence/execute-scenarios.mjs`, `execute-restart.mjs`.

Columns: Scenario ID · Domain · Expected · Actual · Result · Evidence · Severity · Notes.

| Scenario ID | Domain | Expected | Actual | Result | Evidence | Severity | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-01-HEALTH | Env | 200 | 200 `productionReady:false` | PASS | wave1 | — | Isolated API |
| UAT-01-READY | Env | 200 | 200 applicationReady true | PASS | wave1 | — | in-memory-dev transport labelled |
| UAT-01-ME | Auth | 200 platform.admin | 200 | PASS | wave1 | — | Dev identity |
| UAT-01-ORG-TYPES | CRM | 200 corporate type | 200 | PASS | wave1 | — | PG hydrate |
| UAT-AUTH-01 | Auth | 200 token | 200 tokenPresent | PASS | wave1 | — | token not copied |
| UAT-AUTH-02 | Auth | no usable token | 401 | PASS | wave1 | — | |
| UAT-AUTH-03 | Auth | 401 | 401 | PASS | wave1 | — | |
| UAT-AUTH-04 | Authz | Alice 403 overlay | 403 GET+PUT | PASS | wave1 | — | |
| UAT-ACC-01 | Account | 201/201 | 201/201 | PASS | wave1 | — | synthetic org/account |
| UAT-ACC-02 | Account | 200 name | 200 | PASS | wave1 | — | |
| UAT-ACC-03 | Account | PCO ≠ market | 200 independents true | PASS | wave1 | — | |
| UAT-ACC-04 | Persist | survive restart | 200 pco/UK | PASS | wave2 | — | |
| UAT-OPP-01–05 | Opportunity | create/get/qualify/next/409 | as expected | PASS | wave1 | — | no 250k/20% |
| UAT-OPP-06 | Persist | nextAction retained | 200 | PASS | wave2 | — | |
| UAT-RFP-01–05,07 | RFP | create SOURCE≠CHANNEL timestamps Path B 401 | as expected | PASS | wave1 | — | |
| UAT-RFP-06 | Persist | referral/email | 200 | PASS | wave2 | — | |
| UAT-PRG-01–02 | Programme | 201; rfpObserved; not revenue | as expected | PASS | wave1 | — | |
| UAT-PRG-03 | Persist | rfpObserved | 200 | PASS | wave2 | — | |
| UAT-RI-01 | Rate Identity | 201/201/200 overlay TZS mixed USD | HTTP 201/201/200; identity.amountIsNotIdentity true; TZS; 250 USD; fx false | **FAIL (harness)** | wave1 | P3 | **H149-H-01** nested flag; business result matched |
| UAT-RI-02–04,06–09 | Rate Identity | GET/append/409/401/400/catalogues/no FX | as expected | PASS | wave1 | — | no winner/FX/freeze invented |
| UAT-RI-05 | Persist | v1 TZS v2 EUR | 200 | PASS | wave2 | — | 12 overlay versions hydrated |
| UAT-SEC-01 | Error | 400 dates | 400 | PASS | wave1 | OPTIONAL | |
| UAT-SEC-02 | Error | 404 unknown | 404 | PASS | wave1 | — | |
| UAT-ACT-01 | Activities | 201/200 | PASS | wave1 | — | synthetic meeting |
| UAT-TSK-01 | Tasks | 201/200 | PASS | wave1 | — | |
| UAT-NOTE-01 | Notes | 201 | PASS | wave1 | — | commercial org note |
| UAT-CST-01 | Costing | 201/200 | PASS | wave1 | — | also 200 after restart |
| UAT-PROP-01 | Proposals | 201 generate | POST 404 `rfp_not_found` while GET RFP 200 | **FAIL** | wave1; probe | P1 | **H149-D-01** |
| UAT-DOC-01 | DocumentStorage | 401/201/200 | PASS | wave1 | — | commercial PDF |
| UAT-DOC-02 | Privacy | 400 keys/filename; not persisted | PASS | wave1 | — | count 1→1 |
| UAT-NTF-01 | Notifications | 200; no bodyText | PASS | wave1 | — | |
| UAT-NTF-02 | Notifications | person-key 400; commercial 201 | PASS | wave1 | — | |
| UAT-IMP-01 | Import | org 201 | PASS | wave1 | — | |
| UAT-IMP-02 | Import | contact fail-closed | 400 person_domain_removed | PASS | wave1 | — | no batch |
| UAT-IMP-03 | Import | supplier_contact fail-closed | 400 | PASS | wave1 | — | |
| UAT-PRV-01–05 | Privacy | retired paths + leftover keys reject | PASS | wave1 | — | contacts 0 after hydrate |
| UAT-OPS-01 | Field | policy encrypted; push person-key 400 | PASS | wave1 | — | |
| UAT-TEN-01 | Tenant | partner cannot read SEDMC rows | PASS | wave1 | — | |
| UAT-EXP-01 | Export | allowlist CSV 200 | PASS | wave1 | — | |
| UAT-AUD-01 | Audit | not 5xx | 200 | PASS | wave1 | — | |
| UAT-REC-HEALTH/READY/LOGIN | Persist | 200 | PASS | wave2 | — | wrapper stop/start |
| UAT-REC-01 | Persist | all mixed+overlays | overlays 200; mixed rate GET 404; costing/task 200 | **FAIL** | wave2 | P2 | **H149-D-02** |
| UAT-REC-02 | Isolation | eos unused | schema_migrations NULL | PASS | isolation JSON | — | |
| UAT-UI-01 | UI | critical paths | Next compile error `node:crypto` | **FAIL** | browser snapshot | P1 | **H149-D-03** |
| UAT-UI-02 | Field-cache logout | logout clears blobs | **not live-executed** | BLOCKED | source `clearSession` + H-141 unit | P2 | UI compile blocked live path |

HTTP campaign recorded **65** harness rows: **62 PASS / 3 FAIL**. UI adds one FAIL and one BLOCKED.

---

## D. Privacy regression results

**PASS.**

| Required check | Result |
| --- | --- |
| Retired CRM contact create/list | 400 `person_domain_removed` |
| Retired supplier-contact create | 400 `person_domain_removed`; hydrate contacts **0** |
| Guest/manifest/voucher/HR writes | 400 `person_domain_removed` |
| Person-domain import types | contact + supplier_contact fail-closed; no batch |
| H-145 leftover keys on authorized writes | task/opp/programme/supplier 400; task title unchanged |
| Rejected payloads not persisted | document count unchanged; task count unchanged |
| DocumentStorage filename + keys | `passport-scan.pdf` and `guestName` rejected |
| Notification structural keys | allowlist/template person-keys 400; commercial allowlist 201 |
| Field-cache principal binding | `/v1/ops/sync/policy` `requireEncryptedCache: true`; person-key push 400 |
| Logout clears field-cache | **source-verified** (`clearSession` → `clearFieldCaches`); **live UI not executed** (H149-D-03) |
| Commercial org/supplier/rate/programme still works | PASS |
| No removed person-data API silently writable | PASS |

OD-08 unscanned opaque documents: **not tested as a requirement** (accepted residual).  
OD-12 historical CHECKs: **not removed**.

---

## E. Commercial regression results

Organization → Account → Opportunity → RFP → Programme → Supplier/Rates → Rate Identity → Costing: **PASS** (HTTP), including restart of overlays and costing GET.

Proposal generation: **FAIL** (H149-D-01). Approval request 201 and Bob decision 200; `POST /v1/proposals` returns 404 `rfp_not_found` even though `GET /v1/rfps/:id` is 200. `generateProposal` reads process-local `store.rfpRfps`; mixed-SQL RFP SoR is PostgreSQL.

Activities, tasks, commercial notes, commercial documents, field-sync policy: **PASS** on API.

No FX, overlap winner, freeze, 250k/20%, revenue, or profit fields were invented or required.

---

## F. Historical H-117 comparison

| Topic | H-117 | H-149 |
| --- | --- | --- |
| Label | Historical isolated UAT | **CURRENT-CODE UAT** |
| Catalog | `eos_h117_uat` `:5436` | `eos_h149_uat` `:5439` (new) |
| Migrations | through **124** | through **125** |
| Worktree | then-current | dirty tree after H-139–H-145 |
| H-116 commercial vertical | PASS | PASS on API |
| Privacy 125+ | not in campaign | **PASS** |
| Proposal generate | not in H-116 catalogue | **FAIL** mixed-SQL store read |
| Isolated web | 3017 Ready | **FAIL** webpack `node:crypto` |
| Acceptance | H-119 accepted with limitations | this campaign **PASS WITH FINDINGS**; not Production |

HEAD then = HEAD now. Material change lives in the **dirty worktree**. H-117 must not be reused as current-code coverage.

---

## G. Failures / limitations

### H149-I-01 — Migration 125 CHECK (closed in this campaign)

- **Category:** application/schema completeness of already-authorized 125  
- **Action:** CHECK expanded inside 125 only; 126 not created; 001–124 not altered  
- **Status:** applied on `eos_h149_uat` only

### H149-H-01 — UAT-RI-01 harness (instrumentation)

- **Expected:** overlay TZS, mixed 250 USD, `amountIsNotIdentity`  
- **Actual HTTP:** 201/201/200 with those facts on `identity`  
- **Harness:** required top-level `amountIsNotIdentity`  
- **Category:** instrumentation false-negative  
- **Application defect:** **No**

### H149-D-01 — Proposal generate 404 `rfp_not_found` (application)

- **Expected:** 201 proposal after approval  
- **Actual:** 404 while GET RFP 200  
- **Reproduction:** isolated API against `eos_h149_uat`; Carol POST `/v1/proposals` `{ rfpId, title }`  
- **Category:** application defect (mixed-SQL durable vs process-local Store)  
- **Fixed this action:** **No** (not silently patched)  
- **Severity:** P1 commercial current-code

### H149-D-02 — Combined restart mixed rate GET 404 (contract / application)

- **Expected:** GET mixed rate 200  
- **Actual:** GET `/v1/suppliers/:id/rates/:rateId` 404; overlay GET 200; hydrate `rates:1`  
- **Category:** likely missing GET-by-id route used by the H-117 harness; overlay persistence succeeded  
- **Severity:** P2  
- **H-116 overlay restart scenarios:** PASS

### H149-D-03 — Isolated UI compile `node:crypto` (application + environment)

- **Expected:** commercial UI critical paths  
- **Actual:** Next 16 webpack `UnhandledSchemeError` importing `node:crypto` via `field-offline-cache.ts` → kernel crypto  
- **Environment:** existing `:3001` holds `.next-local` lock; isolated distDir `.next-h149-uat` cold-compiled  
- **Did not** use `:3001` (proxies default `:8080`, not UAT)  
- **Did not** kill the existing Next process  
- **Fixed this action:** **No**  
- **Severity:** P1 for current-code UI

### Known accepted limitations (not fails)

- Windows `npx tsx` process-control (H117-D-01 class): API was stopped via listen PID and restarted; hydrate succeeded.  
- `EOS_ENV=development` on a UAT-named catalog (production-like `uat` flag refused).  
- In-memory event transport / dev-outbox labelled not Production.  
- OD-08/OD-12 residuals not retested as requirements.

---

## H. UAT disposition

**PASS WITH FINDINGS.**

Mandatory H-116 commercial vertical (auth, account, opportunity, RFP, programme, Rate Identity overlay, restart overlays) **passed** on the isolated current-code API with migration 125. Privacy regression **passed**. Tenant isolation, import fail-closed, DocumentStorage, notifications, costing GET, activities/tasks **passed**.

Not a clean PASS: proposal generate failed; isolated UI failed to compile; combined mixed rate GET 404; RI-01 harness false-negative.

```text
UAT PASS ≠ PRODUCTION READY
```

---

## I. Production gate separation

The following remain **OPEN** and are **not** closed by this UAT:

PDPC · EI-01 · ADR-0006 · DP-0006 · Production authorization · hosting/provider/region · Production database · secrets/KMS · IdP/MFA · HTTPS/DNS/TLS/CORS · backup/restore · operational ownership · on-call · observability sink · event/email transport products · process supervision · rollback/DR · Production SoR/adoption cutover · Production access model

`validateDeploymentConfig()` still implies `productionReady: false`. Isolated UAT success does not validate Production.

---

## J. Exact next required gate after H-149

1. **Owner/POA UAT acceptance of this PASS WITH FINDINGS** (human sign-off; not this executor).  
2. **Optional bounded Dev/Test remediation grant** for H149-D-01 (proposal generate against mixed-SQL RFP) and H149-D-03 (client-safe field-cache crypto / isolated web compile). Do not treat this H-149 record as that grant.  
3. Re-test only the failed current-code items after any such grant.  
4. Production gates in §I remain sequential and **unopened**.

Do **not** skip to Production.

---

## Runtime start commands (non-secret)

```text
# Catalog (already created): serengeti-eos-h149-uat-pg  127.0.0.1:5439/eos_h149_uat
# Migrate: EOS_DATABASE_URL=<redacted-h149-url> npm run migrate -w @sedmc/db
# API: EOS_ENV=development EOS_LISTEN_HOST=127.0.0.1 EOS_PORT=18149
#      EOS_SEED_DEMO=false  (H-112 and bounded flags unset)
# Web: EOS_API_URL=http://127.0.0.1:18149 EOS_WEB_DIST_DIR=.next-h149-uat
#      npx next dev --webpack --port 3049
```

---

## Explicitly excluded

Production deploy/migrate/credentials/DNS/secrets/users/data. C11+. F2-I12. Path D. Mailbox/Gmail/WhatsApp/Excel ingestion. FX providers. Historical KPI/revenue/profit reconstruction. 250k/20% rule. New commercial thresholds. H-81 SoR cutover.
