# E1-D — Class A Dev/Test Implementation Record

> **`CLASS A COMPLETE WITH TEST-ENVIRONMENT EXCEPTION — WORKING TREE, NOT COMMITTED`**  
> **Post-implementation audit: `PASS WITH TEST-ENVIRONMENT EXCEPTION`**  
> **`NOT PRODUCTION AUTHORIZATION`**  
> **`NO MIGRATION CREATED OR EXECUTED`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`E1-B = 9 / 2 / 1 ; 0 TRANSMISSIONS`**  
> **`productionReady REMAINS false`**

**Implementation date:** 2026-09-17.

---

## 1. Repository HEAD before implementation

`75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`docs: reconcile DG2 UAT governance state`) on branch `master`.

## 2. Repository HEAD after implementation

**Unchanged.** No commit was made. HEAD remains `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.

## 3. Exact Class-A scope

A1 security headers (manual Fastify; **no Helmet**); A2 localhost/127.0.0.1 HTTP CORS; A3 in-memory login rate limit (10 / 60s, per `buildServer` instance); A4 token-secret fallback refused when Production-like flags set; A5 bootstrap users remain `*.local` / `not-for-prod`; A6 logger `productionReady: false` + redaction tests; A7 compose file Dev/Test non-lock comment; A8 synthetic fixture tests; A9 LocalFs disk recovery tests (not pg_dump); A10 tests run as recorded below.

## 4. Files changed (this stage)

**Code**

- `apps/api/src/devtest-http-controls.ts` (new)
- `apps/api/src/devtest-token-secret.ts` (new)
- `apps/api/src/server.ts` (hooks + login limiter; token resolve when store omitted)
- `apps/api/src/main.ts` (fail-closed token secret when Production-like)

**Tests (new)**

- `apps/api/src/e1-d-class-a.devtest-http.test.ts`
- `apps/api/src/e1-d-class-a.token-bootstrap.test.ts`
- `apps/api/src/e1-d-class-a.observability.test.ts`
- `apps/api/src/e1-d-class-a.localfs-recovery.test.ts`

**Hygiene / docs (minimum)**

- `infra/compose/dev.yaml` (Dev/Test non-lock banner)
- `.env.example` (one-line fail-closed note for `EOS_TOKEN_SECRET`)
- `docs/governance/adr-0006-e1-c-parallel-work-register.md` (additive section)
- this file

**Not changed:** `apps/api/package.json` (no Helmet/cors/rate-limit deps); `packages/db/migrations/*` (no new SQL); frozen E1-B; ADR-0006; DP-0006; application MFA/CRM outbox/kernel DocumentStorage port; `/ready` semantics.

## 5. Implementation summary

Manual Dev/Test HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy` default-src none, `Cache-Control: no-store`, `X-EOS-DevTest: 1`). **No HSTS.** CORS allowlist `http://localhost` and `http://127.0.0.1` any port; `*` and other origins rejected on preflight. Login limiter is process-local `Map` per server instance; 429 body includes `productionReady: false` and `scope: dev-test-in-memory`. `resolveDevTestTokenSecret` throws if `EOS_ENV` is production/uat or `NODE_ENV` is production and the secret is unset. Bootstrap fail-closed on missing env refs unchanged. Logs still emit `productionReady: false`. Compose is labelled isolated Dev/Test.

## 6–8. Tests run and results

| Category | Command | Result | Evidence |
| --- | --- | --- | --- |
| Class A focused | `npx vitest run src/e1-d-class-a.devtest-http.test.ts src/e1-d-class-a.token-bootstrap.test.ts src/e1-d-class-a.observability.test.ts src/e1-d-class-a.localfs-recovery.test.ts --reporter=verbose` (cwd `apps/api`) | **PASS** 11/11 | Duration 11.23s |
| Typecheck | `npx tsc -p tsconfig.json --noEmit` (cwd `apps/api`) | **PASS** exit 0 | |
| Affected regression | `npx vitest run src/security.regression.test.ts src/gate-b.fail-closed.test.ts src/cd-phase1-foundation.test.ts src/api.test.ts --reporter=dot` | **PASS** 31/31 | Duration 7.31s |
| Full `@sedmc/api` vitest | `npx vitest run --reporter=dot` | **600 passed; 21 failed** | Failures: `crm.integration.test.ts`, `pg-crm.integration.test.ts`, `pg-i3.integration.test.ts`, `pg-i4.integration.test.ts`, `pg-supplier.integration.test.ts`, `pg.integration.test.ts` — `error: relation "tenants" already exists` during `migrate()`. **Not** 429/CORS/header failures. **Full suite is not PASS.** Post-implementation audit classified all 21 as **F1 — PRE-EXISTING TEST ENVIRONMENT DEFECT** (see §19). Gate B migration-free persist tests **passed** in the same run |

No test in this record is marked PASS unless it was executed. The full API suite is **not** recorded as PASS.

## 9. Migrations created

**NONE.**

## 10. Migrations executed

**NONE** (this stage did not invoke `migrate()`; full-suite PG tests attempted migrate against an existing local database and failed on pre-existing relations — that is **not** an authorized Gate C or new-migration execution by this stage).

## 11. Production credentials/data accessed

**NO.**

## 12. Providers contacted

**NO.**

## 13. Production deployment

**NO.**

## 14. Excluded Class B–F work (untouched)

MFA; Helmet dependency; `/ready` redesign; CRM same-TX outbox; kernel `DocumentStorage.delete`; SoR expansion; local NATS; Dev pg_dump/restore harness; all provider products; IdP/BCM/RACI/PITR decisions; new/Production migrations; Production SoR/TLS/DNS/RTO/deploy.

## 15. Known residual gaps

Class B–F TECH IDs remain open. In-memory rate limit is **not** Production. Headers are **not** Production TLS/WAF. Token fallback still exists for non-Production-like Dev/Test. CD-01 **OPEN**. DPO **NOT ESTABLISHED**.

## 16. Contradictions

- E1-D authorization **pack** still says PREPARED — NOT GRANTED; this **stage prompt** authorized Class A only. Recorded without rewriting the pack.  
- Local `EOS_DATABASE_URL` PG integration tests fail `relation "tenants" already exists` (pre-existing schema). **Audit 2026-09-17:** F1 — `eos_gateb` @ `127.0.0.1:5434` has `tenants` and empty `schema_migrations`; individual `pg.integration.test.ts` fails the same way. Not a Class A regression.  
- Kernel `DocumentStorage.delete` vs LocalFs.delete (Gate C item 7) **unchanged**.  
- CD-01 S1 vs S2 **unchanged**.

## 17. Rollback

Remove `devtest-http-controls.ts` / `devtest-token-secret.ts` and revert `server.ts` / `main.ts` hook and limiter; revert compose/`.env.example` comments. No schema rollback.

## 18. Production authorization

**This record does not constitute Production authorization, UAT authorization, provider selection, architecture selection, or migration authorization.**

---

## 19. Post-implementation audit reconciliation (2026-09-17)

Companion: [`adr-0006-e1-d-class-a-post-implementation-audit.md`](adr-0006-e1-d-class-a-post-implementation-audit.md).

**Verdict:** `PASS WITH TEST-ENVIRONMENT EXCEPTION`. Class A A1–A10 verified inside boundary. **No Class-A remediation required.** Full suite remains **600 PASS / 21 FAIL**.

Audit re-runs (cwd `apps/api`):

| Category | Result |
| --- | --- |
| Class A focused (`src/e1-d-class-a.*.test.ts`) | **11/11 PASS** |
| Typecheck | **PASS** |
| Targeted regression (security / gate-b.fail-closed / cd-phase1-foundation / api.test) | **31/31 PASS** |
| `pg.integration.test.ts` alone | **2/2 FAIL** — `relation "tenants" already exists` at `migrate()` |
| Five remaining `*.integration.test.ts` as a group | **19 FAIL / 1 PASS** — pass is static CRM `listMigrationFiles`; all live `migrate()` tests fail `42P07` |
| Gate B persist (`gate-b.persistence.integration.test.ts`, same DB, no `migrate()`) | **11/11 PASS** |
| Full `npx vitest run` | **not re-executed in audit**; implementation-stage **600 / 21** stands |

**Failure class for all 21:** **F1 — PRE-EXISTING TEST ENVIRONMENT DEFECT.** SELECT-only: database `eos_gateb` on `127.0.0.1:5434`; `tenants` exists; `schema_migrations` exists with **0** rows. `schema.sql` `CREATE TABLE tenants` has no `IF NOT EXISTS`. Class A does not call `migrate()`. **Not F3.** Latent parallel-`migrate()` isolation risk recorded as residual F2, not the observed cause.

**Not fixed in Class A.** Future governed work: isolate migrate()-based PG integration tests from the Gate B already-provisioned schema. Do not DROP Gate B tables as informal cleanup.

Class A stage status: **COMPLETE WITH TEST-ENVIRONMENT EXCEPTION** (working tree, uncommitted). E1-D overall **not closed**. Class B–F **remain**.
