# E1-D — Dev/Test Implementation Authorization Pack (future grant)

> **`PREPARED — NOT GRANTED`**  
> **`CREATION OF THIS FILE IS NOT AUTHORIZATION`**  
> **`NO IMPLEMENTATION PERFORMED UNDER THIS PACK`**  
> **`NO MIGRATION`** · **`NO PRODUCTION`** · **`NO PROVIDER/ARCHITECTURE SELECTION`**

**Date:** 2026-09-17.  
**Design:** [`adr-0006-e1-d-dev-test-remediation-plan.md`](adr-0006-e1-d-dev-test-remediation-plan.md).

A later competent human may grant **exactly** the scope below. Until then, engineers must **not** treat this pack as a Gate B-style authorization.

**Proposed future decision (not granted):**

> Authorize isolated Dev/Test implementation of the **included work** only, in the repository working tree, without Production credentials, without new migrations, and without selecting a hosting provider or architecture.

---

## Scope

Isolated Development/Test HTTP hardening and secrets/log **hygiene** for `@sedmc/api` (and tests). Environment: local / disposable Dev. **Not** UAT. **Not** Production.

## Included work (Class A)

1. Explicit API security headers (manual Fastify headers **or** equivalent **without** treating Helmet as already authorized — if Helmet is added, that is **TECH-SEC-06 Class B** and **excluded** unless the grant text names it).  
2. API CORS allowlist limited to Dev localhost / 127.0.0.1.  
3. In-memory HTTP rate limiting on `/v1/auth/login` (and similarly anonymous routes if named in the grant).  
4. Tests documenting `dev-only-change-me` fallback and Production-flag refuse behavior already in `main.ts`.  
5. Preserve bootstrap users as Dev-only; do not add Production seeds.  
6. Keep logger `productionReady: false` and redaction.  
7. Keep existing LocalFs document tests (no new storage product).

## Excluded work

- MFA / TOTP / IdP selection (TECH-IDN-01/02)  
- Helmet npm dependency unless **explicitly named** in a future grant (TECH-SEC-06)  
- Ready-probe semantics change (TECH-OBS-02 **B**)  
- CRM transactional outbox / kernel DocumentStorage.delete / module SoR expansion / local NATS (Class B persist)  
- Recovery dump/restore harness extension (TECH-REC-01 **B**)  
- Any Class C/D/E/F item  
- Provider/architecture/jurisdiction selection  
- Production/UAT deploy, credentials, data  
- New migration files; Production `migrate()`; re-running consumed Migration 123 as a new grant  
- Contacting providers  

## Exact files/modules potentially affected

- `apps/api/src/server.ts`  
- `apps/api/src/main.ts` (hygiene tests / comments only unless grant names boot-guard changes)  
- `apps/api/src/app.ts` (login hook for rate-limit **if** not done solely in `server.ts`)  
- `apps/api/src/observability.ts` (only if header/correlation tests require it — prefer **no** change)  
- New `apps/api/src/*.test.ts` files for headers/CORS/rate-limit/secret fallback  
- `apps/api/package.json` **only if** the grant names a specific plugin; default included work uses **manual headers** to avoid an unauthorized dependency  

**Not affected:** frozen E1-B files; ADR-0006; DP-0006; `packages/db/migrations/*` (no new SQL).

## Test expectations

- Header assertions on `/health`  
- CORS allow vs deny  
- Login burst → 429  
- Secret fallback tests  
- Existing Gate B fail-closed and persist tests still pass (regression)  

All such tests are **NOT RUN** until implementation is actually authorized and executed.

## Rollback

Revert the Fastify hooks/plugins; `git` revert of the bounded files. No schema rollback because **no migration**.

## Migration boundary

**None in scope.** See [`adr-0006-e1-d-migration-boundary-register.md`](adr-0006-e1-d-migration-boundary-register.md).

## Production boundary

No Production code path, credentials, DNS, TLS certs, or data. `productionReady` remains `false`.

## Provider boundary

No CU contact; no product selection (Helmet-as-vendor is a **library**, still excluded unless named).

## Security boundary

No Production secrets. CORS not `*`. Rate-limit in-memory only. No MFA in this pack.

## Evidence to be produced (after a future grant and implementation)

- Diff limited to included files  
- Test output labelled Dev/Test  
- Confirmation no new files under `packages/db/migrations/`  

## Acceptance criteria (for a future grant)

- Included work present in Dev/Test only  
- Exclusions untouched  
- Gate B persist tests not regressed  
- No migration created/executed  
- No Production authorization implied  

**Status: PREPARED — NOT GRANTED.**
