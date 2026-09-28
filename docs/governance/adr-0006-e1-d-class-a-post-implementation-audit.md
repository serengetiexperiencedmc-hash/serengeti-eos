# E1-D — Class A Dev/Test Post-Implementation Audit

> **`POST-IMPLEMENTATION AUDIT — CLASS A ONLY`**  
> **`NO NEW IMPLEMENTATION THIS STAGE`**  
> **`NO MIGRATION CREATED OR EXECUTED`**  
> **`NO PRODUCTION CREDENTIALS / DATA / DEPLOYMENT`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`E1-B = 9 / 2 / 1 ; 0 TRANSMISSIONS`** · **frozen hashes unchanged**  
> **`productionReady REMAINS false`**  
> **Verdict: `PASS WITH TEST-ENVIRONMENT EXCEPTION`**

**Audit date:** 2026-09-17.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**This file does not authorize Class B–F, UAT, Production, or commit/push.**

---

## 1. Scope

This is a post-implementation audit of **E1-D Class A (A1–A10)** only.

It verifies whether the uncommitted Class A working-tree changes stay inside the authorized Dev/Test boundary, whether the reported 21 full-suite failures are a Class A regression, and whether the Class A implementation record is accurate.

This audit did **not**: implement Class B–F; create or execute migrations; drop or alter tables; modify Migration 123; modify frozen E1-B materials; modify ADR-0006 or DP-0006; resolve CD-01 S1/S2; resolve the DocumentStorage Gate-C contradiction; commit; or push.

---

## 2. Repository state

| Item | Value |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`docs: reconcile DG2 UAT governance state`) |
| Commit this stage | **NONE** |
| Push this stage | **NONE** |

**Working-tree status (material to this audit):**

Class A implementation remains **uncommitted**. Confirmed Class A artefacts:

- `apps/api/src/devtest-http-controls.ts` (untracked)
- `apps/api/src/devtest-token-secret.ts` (untracked)
- `apps/api/src/e1-d-class-a.*.test.ts` (four untracked test files)
- `apps/api/src/server.ts` (modified: Class A hooks/limiter **and** pre-existing Gate B `await listAudit` / `await verifyChain`)
- `apps/api/src/main.ts` (modified: Class A token fail-closed **and** a Gate B SoR log line)
- `.env.example` (one-line `EOS_TOKEN_SECRET` fail-closed note)
- `infra/compose/dev.yaml` (Dev/Test non-lock banner)

The working tree **also** contains a large set of **pre-existing uncommitted** Gate B persist / E1-C / E1-D governance artefacts that are **outside Class A implementation** (commercial dual-path modules, untracked `packages/db/migrations/123_*.sql`, Gate B persist tests, E1-B/E1-C/E1-D docs). Those files are **not** treated as Class A deliverables. They are recorded so this audit does not misattribute them.

`apps/api/src/app.ts` and `apps/api/src/store.ts` diffs versus HEAD are **Gate B durable-audit / SoR comment** changes, not Class A HTTP/secret work.

---

## 3. A1–A10 audit

### A1 — Security headers

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — `applyDevTestSecurityHeaders` on every request via Fastify `onRequest` |
| Files | `apps/api/src/devtest-http-controls.ts`; `apps/api/src/server.ts`; `apps/api/src/e1-d-class-a.devtest-http.test.ts` |
| Headers present | `X-Content-Type-Options: nosniff`; `X-Frame-Options: DENY`; `Referrer-Policy: no-referrer`; `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'`; `Cache-Control: no-store`; `X-EOS-DevTest: 1` |
| HSTS | **Not set** — appropriate for Dev/Test HTTP; not Production TLS approval |
| Permissions-Policy | **Not set** — Class A does not require Production-perfect policy |
| Helmet npm | **Not added.** Fastify constructed with `{ logger: false }`; registration log records `helmet: false`. `apps/api/package.json` has no `helmet` / `@fastify/helmet` |
| Boundary status | **INSIDE CLASS A** — Dev/Test labelled; not Production WAF/TLS |
| Test evidence | Class A HTTP tests **11/11 PASS** (re-run this audit). Header assertions include absence of HSTS and absence of wildcard CORS |

### A2 — CORS

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — `isDevTestAllowedOrigin` requires `http:` and hostname `localhost` or `127.0.0.1` |
| Files | `devtest-http-controls.ts`; `server.ts` OPTIONS 204/403 |
| Wildcard | `origin === "*"` rejected (`cors_origin_rejected` / `wildcard`) |
| Production origins | **None invented** |
| Missing Origin | Requests without `Origin` are allowed (non-browser / same-origin clients) |
| Boundary status | **INSIDE CLASS A** |
| Test evidence | Allows localhost / 127.0.0.1; rejects `https://evil.example` and `*` with 403 |

### A3 — In-memory Dev/Test login rate limiting

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — `createInMemoryLoginRateLimiter` process-local `Map`; `DEVTEST_LOGIN_RATE_LIMIT` **10 attempts / 60_000 ms** |
| Scope | Per `buildServer` instance; restart / new instance clears state |
| Redis / PostgreSQL / shared store | **NONE** |
| Boundary status | **INSIDE CLASS A** — not Production distributed limiting |
| Test evidence | Burst of failed logins → 429 `{ error: rate_limited, productionReady: false, scope: dev-test-in-memory }`; a **new** limiter instance allows login again |
| Residual | `x-forwarded-for` first hop is used in the key (spoofable on an exposed proxy). Acceptable only because this is labelled Dev/Test in-memory |

### A4 — Token-fallback hygiene

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — `resolveDevTestTokenSecret`; fallback constant `dev-only-change-me` is **not** a committed Production secret |
| Production-like refuse | Throws (and `main.ts` `process.exit(1)`) when `EOS_ENV` is `production`/`uat` **or** `NODE_ENV` is `production` and secret is unset |
| Dev/Test | Fallback still used when Production-like flags are absent and env secret is unset — functional for existing tests |
| Boundary status | **INSIDE CLASS A** |
| Test evidence | Token-bootstrap tests: fallback only off Production-like flags; refuse on production/uat/`NODE_ENV=production` |

### A5 — Bootstrap-user Dev/Test boundary

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — `TEST_BOOTSTRAP_SECRETS` still only when not Production-like; users remain `*.local` / `not-for-prod` |
| Production-like startup | Bootstrap missing → `process.exit(1)` when `isProduction` |
| Production credentials | **None added** |
| Boundary status | **INSIDE CLASS A** |
| Test evidence | Token-bootstrap tests keep synthetic Dev/Test users and fail-closed missing env refs |

### A6 — Logging honesty

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — `productionReady` remains `false` on health, login 429, CORS registration log, and structured logger |
| Secrets in logs | Redaction of `token` / `password` / `accessToken` / `EOS_TOKEN_SECRET` preserved |
| `/ready` | **Unchanged** — still `{ ok: true, mode: "memory" }` when `dbHealth` omitted (Class B TECH-OBS-02 **not** implemented) |
| Boundary status | **INSIDE CLASS A** |
| Test evidence | Observability test **PASS**; HTTP tests log `productionReady: false` |

### A7 — IaC non-lock discipline

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — additive comments on `infra/compose/dev.yaml` only |
| Provider / Production infra | **Not selected; not provisioned** |
| GAP-DEP-02 | **Not closed** (hygiene comment ≠ portability closure) |
| Boundary status | **INSIDE CLASS A** |
| Test evidence | File inspection; no new compose services or Production lock |

### A8 — No Production credentials/data

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** for Class A tests and fixtures |
| PG used by live integration tests | Local Dev/Test `127.0.0.1:5434` database name `eos_gateb`, user `eos_gateb` — **not** Production |
| Boundary status | **INSIDE CLASS A** |
| Test evidence | Class A tests use `seedStore` / tmpdir / synthetic PDF bytes. SELECT-only probe did not use Production hosts |

### A9 — LocalFs recovery tests

| Field | Finding |
| --- | --- |
| Implementation verified | **YES** — isolated tmpdir; synthetic bytes; new `LocalFsDocumentStorage` instance as process-restart stand-in |
| pg_dump / restore / migrate | **NONE** |
| Kernel `DocumentStorage.delete` | **Not added.** Tests call **LocalFs** `.delete` (existing adapter). Kernel type remains `put`/`get` only |
| Boundary status | **INSIDE CLASS A** (TECH-REC-07). Does **not** close Gate C item 7 / TECH-PER-09 |
| Test evidence | 2 LocalFs tests PASS |

### A10 — Testing evidence

| Suite | Command (cwd `apps/api`) | Implementation record | This audit re-run |
| --- | --- | --- | --- |
| Class A focused | `npx vitest run src/e1-d-class-a.*.test.ts` | 11/11 PASS | **11/11 PASS** (2026-09-17 03:07:49) |
| Typecheck | `npx tsc -p tsconfig.json --noEmit` | PASS | **PASS** (exit 0, chained after targeted regression) |
| Targeted regression | `npx vitest run src/security.regression.test.ts src/gate-b.fail-closed.test.ts src/cd-phase1-foundation.test.ts src/api.test.ts` | 31/31 PASS | **31/31 PASS** (03:08:25, 7.84s) |
| Full API | `npx vitest run` | **600 passed / 21 failed** | **Not re-executed in full.** Failing subset reproduced (below). Full-suite result is **not** treated as PASS |

A10 status: **VERIFIED WITH EXCEPTION** — Class A and targeted regression pass; full suite is **not** green.

---

## 4. Full-suite failures

### Headline (implementation-stage full run)

- **600 passed**
- **21 failed**
- Six files: `pg.integration.test.ts`, `crm.integration.test.ts`, `pg-crm.integration.test.ts`, `pg-i3.integration.test.ts`, `pg-i4.integration.test.ts`, `pg-supplier.integration.test.ts`
- Exact pattern: PostgreSQL `42P07` `relation "tenants" already exists` at `packages/db/src/index.ts:54` (`migrate()` → `client.query(sql)` applying `schema.sql`)
- Failures are **not** 429 / CORS / header / token-fallback failures

Test counts inside those files (live `describePg` vs static):

| File | Live tests calling `migrate()` | Result when pointed at current `EOS_DATABASE_URL` |
| --- | --- | --- |
| `pg.integration.test.ts` | 2 | both fail |
| `crm.integration.test.ts` | 3 live + 1 static `listMigrationFiles` | 3 fail; static list **passes** (does not migrate) |
| `pg-crm.integration.test.ts` | 6 | all fail |
| `pg-i3.integration.test.ts` | 1 | fail |
| `pg-i4.integration.test.ts` | 4 | all fail |
| `pg-supplier.integration.test.ts` | 5 | all fail |
| **Total live migrate failures** | **21** | matches full-suite 21 |

### How each failing file obtains PostgreSQL

All six use the same gate:

```
enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(process.env.EOS_DATABASE_URL)
describePg = enabled ? describe : describe.skip
pool = createPool(url)
```

They **share one URL**. Current process env: `EOS_RUN_PG_TESTS=1`; URL host `127.0.0.1`, port `5434`, database `eos_gateb`, user `eos_gateb` (password not recorded).

### Whether each calls `migrate()`

**Yes** on every live test except the static CRM file-list test. Gate B persist tests explicitly **must not** call `migrate()` and **passed** on the same database.

### Isolation / concurrency

- `apps/api/vitest.config.ts` sets `include: ["src/**/*.test.ts"]` only. **No** `fileParallelism: false`.
- Vitest default may run files in parallel against the **same** URL.
- **This is a latent suite-design risk (F2)** if `schema_migrations` were empty **and** tables did not yet exist.
- **It is not the cause of the observed 21 failures:** a **single file** fails the same way (see reproduction).

### Database observations (SELECT-only; no DROP; no schema change)

| Probe | Result |
| --- | --- |
| `tenants` exists in `public` | **true** |
| `schema_migrations` exists | **true** |
| `schema_migrations` row count | **0** |
| tracker row like `%schema.sql` | **false** |

`migrate()` always `CREATE TABLE IF NOT EXISTS schema_migrations`, then applies `schema.sql` if its id is absent from the tracker. `packages/db/schema.sql` uses `CREATE TABLE tenants (` **without** `IF NOT EXISTS`. Therefore: tables already applied (Gate B / compose bootstrap) + empty tracker → `42P07`.

This database is the **already-provisioned Gate B Dev/Test** instance. That is why Gate B migration-free persist tests pass and migrate()-based I1/CRM/PG.* tests fail.

### Commands used to investigate

1. SELECT-only Node inspect of `pg_tables` / `schema_migrations` (temporary script deleted after use; **not** retained as product code).
2. `npx vitest run src/pg.integration.test.ts --reporter=verbose`
3. `npx vitest run src/crm.integration.test.ts src/pg-crm.integration.test.ts src/pg-i3.integration.test.ts src/pg-i4.integration.test.ts src/pg-supplier.integration.test.ts --reporter=dot`
4. Class A focused re-run (11 tests)
5. Targeted regression re-run (31 tests)
6. `npx tsc -p tsconfig.json --noEmit`
7. `npx vitest run src/gate-b.persistence.integration.test.ts --reporter=dot` (contrast: same DB, no `migrate()`)

### Individual / group results

| Command | Result |
| --- | --- |
| `pg.integration.test.ts` alone | **FAIL 2/2** — `relation "tenants" already exists` at `migrate()` / `pg.integration.test.ts:27` and `:94` |
| Remaining five files as a group | **19 failed / 1 passed / 20 tests** — the pass is static `lists CRM migration sequence through 013`; all live `migrate()` tests fail with the same `42P07` |
| Combined with `pg.integration` | **21 live failures** — same pattern whether isolated or grouped |
| Failures only when complete suite run? | **NO** — individual file fails |
| Class A 11 tests | **PASS** |
| Targeted 31 tests | **PASS** |
| Gate B persist 11 tests (same DB) | **PASS** |
| Clean empty disposable database | **NOT RUN — ENVIRONMENT BLOCKED** — this audit did not provision a new database (would be extra infra; DROP/recreate forbidden) |

### Class A causal relationship

**None evidenced.** Class A modules do not call `migrate()`, do not edit `schema.sql`, and do not edit `packages/db/src/index.ts`. `pg.integration.test.ts` and the other five files exist independently of Class A. `main.ts` still calls `migrate()` on API **startup** when `EOS_DATABASE_URL` is set — that path is **pre-existing**, not a new migration execution by this Class A stage, and was **not** the test runner’s failure site.

---

## 5. Failure classification

All **21** live PostgreSQL integration failures are classified as **exactly one** class:

### **F1 — PRE-EXISTING TEST ENVIRONMENT DEFECT**

**Evidence:**

1. Individual `pg.integration.test.ts` fails with the same `42P07` as the full suite — concurrency is not required.
2. SELECT shows `tenants` present and `schema_migrations` **empty** on `eos_gateb` @ `127.0.0.1:5434`.
3. `schema.sql` `CREATE TABLE tenants` has no `IF NOT EXISTS`; `migrate()` re-applies it because the tracker has no `db/schema.sql` (or equivalent) row.
4. The same URL is the Gate B already-provisioned database. Gate B persist tests **forbid** `migrate()` and **11/11 PASS**.
5. Class A focused + targeted regression + typecheck PASS; failure messages contain no Class A symbols.
6. These six `*.integration.test.ts` files and `migrate()` behaviour exist independently of the Class A working-tree files.

**Not F2 as the observed class:** file-parallel migrate() against a shared URL is a **latent** isolation defect, recorded below, but the observed failures reproduce sequentially.

**Not F3:** no evidence Class A code causes `42P07`.

**Not F4:** the failing tests are pre-existing migrate()-based Dev/Test PG tests, not a Class A boundary crossing. Class A did not authorize or perform schema repair.

**Not F5:** environment, tracker mismatch, and individual reproduction are sufficient.

**Latent secondary (not assigned to the 21):** **F2 risk** if a future empty database is shared across parallel `migrate()` callers (`CREATE TABLE tenants` is not idempotent). Future governed test-isolation work should address both the empty-tracker/already-applied-schema collision **and** parallel migrate() on one URL.

**Remediation in this stage:** **NONE.** Per audit instructions, F1 is documented, not fixed. Correct future work item: isolate migrate()-based PG integration tests from the Gate B already-provisioned schema (dedicated empty disposable Dev/Test database **or** skip `migrate()` when the schema is already applied). Must **not** DROP Gate B tables as an informal cleanup.

---

## 6. Migration boundary

| Question | Finding |
| --- | --- |
| Migrations created this Class A stage | **NONE** |
| Migrations executed as part of this Class A stage | **NONE** |
| `migrate()` invoked by existing tests during investigation | **YES** — pre-existing integration tests attempted apply and **rolled back** on `42P07`. That is **not** an authorized Gate C execution and **not** a new migration |
| Migration 123 created this stage | **NO.** File `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` is **untracked** from **prior** Gate C / persist work; `git ls-files` does not know it at HEAD. This stage did **not** add or edit it |
| Migration 123 re-executed this stage | **NO** |
| Schema changes this stage | **NONE** (no DDL authored; SELECT-only probe; failed `migrate()` rolled back) |
| Class A tests migration-independent | **YES** — HTTP/token/log/LocalFs tests do not call `migrate()` |

---

## 7. Production boundary

| Question | Finding |
| --- | --- |
| Production credentials accessed | **NO** |
| Production data accessed | **NO** |
| Production deployment | **NO** |
| Production infrastructure provisioned | **NO** |
| Provider selection | **NO** |
| Provider contact / email send | **NO** |

---

## 8. Class-B boundary

Class A implementation **did not** implement:

| Excluded item | Status |
| --- | --- |
| MFA / TOTP | **Not present** in Class A files |
| Helmet npm dependency (TECH-SEC-06) | **Not added** |
| `/ready` redesign (TECH-OBS-02) | **Unchanged** memory-ok when `dbHealth` omitted |
| CRM same-TX outbox (TECH-PER-02) | `void persistOutboxInsert` **unchanged** |
| Kernel `DocumentStorage.delete` (TECH-PER-09) | Kernel type still `put`/`get` only |
| SoR expansion beyond prior Gate B dual-path | Class A did not expand modules; `store.ts` comment vs HEAD is **prior Gate B** wording |
| NATS as Production/dev experiment grant | Default remains `in-memory-dev`; Class A did not add a NATS harness |
| PostgreSQL dump/restore harness (TECH-REC-01) | **Not added** |
| Shared/distributed rate limiting | Process-local `Map` only |
| Schema changes | **None** |

**Mixed-file note (not Class B creep by Class A):** `server.ts` / `app.ts` / `main.ts` also contain **uncommitted Gate B persist** edits (`await listAudit`, `gate_b_durable_sor` log). Those are **prior authorized Gate B** working-tree work, not Class A delivering TECH-PER-02/09/OBS-02.

---

## 9. Security findings

### Confirmed (Class A as designed)

- Dev/Test headers present and labelled (`X-EOS-DevTest: 1`).
- CORS allowlist is localhost/127.0.0.1 HTTP only; wildcard rejected.
- Login limiter is in-memory, per process, 10/60s, 429 body includes `productionReady: false`.
- Token fallback refused when Production-like env flags are set.
- Bootstrap users remain synthetic Dev/Test.
- Logger `productionReady: false`; token/password fields redacted in the Class A probe.
- No Helmet/cors/rate-limit npm packages.
- No committed Production secret.

### Residual risks (not Class A failures)

- Fallback `dev-only-change-me` remains usable whenever Production-like flags are **absent** — labelled Dev/Test only.
- Rate-limit key trusts `x-forwarded-for` (spoofable); process-local; not Production.
- Requests without `Origin` are not CORS-blocked.
- No HSTS / Permissions-Policy (acceptable for Class A HTTP Dev/Test).
- `/ready` can still report memory-ok without a database probe (Class B).
- Login 429 does not leak passwords; failed-auth logs still include email (pre-existing observability pattern; Class A limiter log omits email and records `tenantSlug` only).

No Production enablement path was found in Class A code.

---

## 10. Contradictions

Preserved (unresolved; not closed by this audit):

1. **E1-D authorization pack status wording** — pack file remains **`PREPARED — NOT GRANTED`**; the Class A implementation stage prompt authorized A1–A10 only. Pack **not rewritten**.
2. **Local PG integration-test collision** — now **evidenced** as F1: `eos_gateb` has `tenants` + empty `schema_migrations`; migrate()-based tests vs Gate B migration-free tests disagree on the same URL.
3. **DocumentStorage.delete / Gate C item 7** — kernel port still lacks `delete`; LocalFs still has `delete`. **OPEN.**
4. **CD-01 S1 vs S2** — **OPEN.**

No new contradiction invented. The mixed working tree (Class A + prior Gate B persist uncommitted together) is an **observation**, not a new architecture contradiction.

---

## 11. Verdict

**`PASS WITH TEST-ENVIRONMENT EXCEPTION`**

Class A A1–A10 is verified inside the authorized Dev/Test boundary. Focused Class A tests, targeted regression, and typecheck pass. The 21 full-suite failures are **F1** (pre-existing test-environment / migrate-vs-already-provisioned Gate B schema), **not** a Class A regression, **not** Class B creep, and **not** a migration executed by this stage.

This is **not** `PASS — CLASS A VERIFIED` because the full `@sedmc/api` suite is **not** green and A10 cannot be recorded as unconditional PASS.

This is **not** `REQUIRES CLASS-A REMEDIATION` because no F3/F4 Class A defect was found.

This is **not** `BLOCKED — INSUFFICIENT EVIDENCE` because individual reproduction, SELECT-only tracker evidence, and Gate B contrast tests are sufficient.

**Class A may be marked complete-with-test-environment-exception in the implementation record. E1-D as a whole is not closed. Class B–F remain required. This audit is not Production authorization, UAT authorization, provider selection, architecture selection, or E1 approval.**

E1-C01 Legal Counsel remains **COMPLETE** (THOMAS NGULUMA). DPO **NOT ESTABLISHED**. Combined Legal/DPO **INCOMPLETE**. E1 **NOT APPROVED / BLOCKED**. ADR-0006 / DP-0006 **OPEN**.
