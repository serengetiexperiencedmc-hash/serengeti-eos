# GPTA-H-95 — F2-DP-01 Bounded Dev/Test API Startup Implementation Evidence

> **`IMPLEMENTATION EVIDENCE`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`NOT UNRESTRICTED RUNTIME VALIDATION`**  
> **`NOT LIVE END-TO-END API STARTUP AGAINST POSTGRESQL`**  
> **`NOT UAT`**  
> **`NOT H-81 COMPLETION`**  
> **`NOT H-81 EVIDENCE`**  
> **`NOT EOS / SOFTWARE ADOPTION`**  
> **`NOT PATH D VALIDATION`**  
> **`NOT OPERATIONAL SoR CUTOVER`**  
> **`NOT PRODUCTION AUTHORIZATION`**  
> **`NOT F2-I12`**  
> **`H-80 REMAINS ACTIVE`**  
> **`H-81 REMAINS NOT STARTED`**  
> **`F2-I1–I11 REMAIN FROZEN`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T01:35:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-95 STATUS = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP IMPLEMENTATION EVIDENCE RECORDED

INCREMENT IDENTIFIER = F2-DP-01
NAMED BRANCH = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
LIVE API PROCESS STARTUP AGAINST POSTGRESQL = NOT PERFORMED / NOT CLAIMED
NO MIGRATION EXECUTED
NO SCHEMA_MIGRATIONS WRITE
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS RECORD IS NOT H-81 EVIDENCE
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
GLOBAL migrate() UNCHANGED
listMigrationFiles() UNCHANGED
MIGRATION 124 UNCHANGED
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record documents **completed H-94 implementation** and focused tests. It does **not** grant unrestricted runtime validation. H-36 F1-C-11 remains: implementation ≠ operational adoption.

H-80 through H-94 and H-29 are **not overwritten**.

---

## 1. Purpose

Record that GPTA-H-94 was **executed as authorized**: one named opt-in fail-closed Dev/Test API startup branch now exists so the already-implemented `hydrateF2CommercialFacts` path can be selected **without** invoking global `migrate()` or mixed startup initialization.

This document is **implementation evidence only**. Live end-to-end API startup against PostgreSQL was **not** performed.

---

## 2. Governing authorization

| Record | Role |
| --- | --- |
| **H-94** | Controlling implementation authorization |
| H-93 Stage A | `main.ts` cannot safely start against 124-only `eos` via the default path |
| H-93 Stage B | STOPPED on ambiguity; **no** implementation under H-93 |
| H-91 / H-92 | Persist/retrieve + `hydrateF2CommercialFacts` already demonstrated on live Dev/Test `eos` |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |

Authority: **Patrick Makundi** (company POA; instrument number not recorded / not invented). H-94 decision: **APPROVED**.

H-94 SHA-256 at H-95 creation: `3CB923549F22E5CE4A4508B760A882011A6F09379B6215A34C722F411D7AC898`.

---

## 3. Implementation scope

Named branch: **`F2-DP-01-BOUNDED-DEVTEST-API-STARTUP`**

Opt-in environment variable: **`EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP`**

- `true` / `1` = requested
- unset / `false` / `0` / `off` = default startup (unchanged)
- any other value = **refuse** (does not fall through to the broad path)

Fail-closed target when requested: host `127.0.0.1`, port `5432` (omitted URL port treated as `5432`), database `eos`, non-production-like. Refuse Production/UAT/`NODE_ENV=production`, Gate B / `eos_gateb`, stand-in `eos_devtest_f2_dp01`, `localhost` / wrong host-port-database, missing or unparseable URL.

In bounded mode the API startup path:

1. creates/attaches the existing `createPool` pool;
2. does **not** call `migrate()`, `listMigrationFiles()`, `shouldApplyStartupMigrations`, `syncStoreToPostgres()`, or mixed hydrates;
3. calls existing `runF2Dp01BoundedDevtestApiStartup` → `hydrateF2CommercialFacts`;
4. continues with the pre-existing listen/event-transport initialization;
5. refuses `EOS_SEED_DEMO` in bounded mode.

Default `main.ts` database path remains in an `else` of the bounded branch and still uses `shouldApplyStartupMigrations` + `migrate` + `syncStoreToPostgres` + mixed hydrates.

No second persistence layer. F2-DP-01 repository/upsert/read path unchanged. Six-table schema unchanged.

---

## 4. Files created / modified by this implementation

| Path | Action |
| --- | --- |
| `apps/api/src/commercial-facts/bounded-startup.ts` | **created** — decide + bounded runner |
| `apps/api/src/f2-dp-01.bounded-devtest-api-startup.test.ts` | **created** — focused tests |
| `apps/api/src/main.ts` | **modified** — insert fail-closed bounded branch; wrap pre-existing default DB init |
| `docs/governance/gpta-h-95-f2-dp-01-bounded-devtest-api-startup-implementation-evidence.md` | **created** — this record |

Not modified: `packages/db/src/index.ts` (`migrate` / `listMigrationFiles`); `packages/db/migrations/124_f2_dp01_commercial_facts.sql`; H-80–H-94; mixed persistence repositories.

`main.ts` was already dirty before H-94. This action added the named branch only; it did not rewrite unrelated startup.

---

## 5. Tests executed

Command: `npx vitest run src/f2-dp-01.bounded-devtest-api-startup.test.ts --maxWorkers=1`  
Working directory: `apps/api`

**Result: 14 passed / 0 failed.**

Covered:

1. Valid opt-in + exact authorized target → `mode: "bounded"`; credentials redacted.
2. Missing opt-in → `default`.
3. Explicit off → `default`.
4. Wrong host (`localhost`) → `refuse`, not default.
5. Wrong port (`5434`) → `refuse`.
6. Wrong database → `refuse`.
7. Production-like (`EOS_ENV` production/uat, `NODE_ENV` production) → `refuse`.
8. Gate B / `eos_gateb` → `refuse`.
9. Stand-in, missing URL, unparseable URL, ambiguous opt-in (`yes`) → `refuse`.
10. Bounded runner issues only F2 sidecar `SELECT`s on a recording pool; no `schema_migrations`, no `INSERT INTO tenants`, no `CREATE TABLE`.
11. `shouldApplyStartupMigrations` default policy unchanged (`eos` Dev/Test still `apply: true`; `eos_gateb` and Production-like still skip).
12. Bounded helper source does not reference mixed hydrates or `listMigrationFiles`.
13. `main.ts` still contains default `shouldApplyStartupMigrations(databaseUrl)` **after** the bounded branch.

No live PostgreSQL. Recording pool only. `tsc -p tsconfig.json --noEmit` in `apps/api` exited 0.

---

## 6. Database / migration confirmation

```text
NO POSTGRESQL CONNECTION FOR VALIDATION
NO migrate() EXECUTION
NO listMigrationFiles() EXECUTION DURING THIS TASK
NO schema.sql / 001–123 / 124 / 125+ APPLICATION
NO schema_migrations WRITE
MIGRATION 124 SHA-256 UNCHANGED = 68D6FB4441F4383284AF1B4892E78F939947C8DF02E53705073E0FD2E4F08EE6
H-91 SYNTHETIC ROWS NOT DELETED (NOT TOUCHED)
```

---

## 7. Governance exclusions

None of the following occurred: Production; UAT; Gate B; stand-in as live evidence; migration execution; schema/history fabrication; modification of migration 124; modification of global `migrate()`; modification of migration discovery; broad startup redesign; ingest; UI; booking; KPI history; revenue/profit; FX; new commercial rules; F2-I12; I1–I11 thaw; Path D; EOS adoption; SoR cutover; H-81 evidence manufacture; unrestricted runtime validation; commit; push.

Legacy **250k / 20%** remains **legacy**.

```text
DURABILITY ≠ AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
TECHNICAL IMPLEMENTATION ≠ EOS ADOPTION
TECHNICAL IMPLEMENTATION ≠ SoR CUTOVER
H-94 IMPLEMENTATION ≠ H-81 EVIDENCE
```

---

## 8. Governance state

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS RECORD IS NOT H-81 EVIDENCE
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
F2-DP-01-BOUNDED-DEVTEST-API-STARTUP = IMPLEMENTED (NOT LIVE-STARTED)
```

---

## 9. Repository state

| Fact | This implementation + evidence action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before implementation | **413** |
| Porcelain after this evidence file | **415** (verified) |
| Commit | **NONE** |
| Push | **NONE** |

---

## 10. Conclusion

H-94 implementation succeeded within scope. The named bounded startup branch is present, fail-closed, isolated from default `migrate()` / mixed init, and covered by focused tests. Live API process startup against PostgreSQL remains **unperformed** and is **not** claimed.

```text
GPTA-H-95 = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP IMPLEMENTATION EVIDENCE RECORDED
LIVE API STARTUP VALIDATION = NOT PERFORMED / NOT CLAIMED
H-81 = NOT STARTED
THIS RECORD IS NOT H-81 EVIDENCE
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

---

## 11. Next governance gate

This record **does not authorize** the next action.

```text
LOGICAL NEXT GATE = SEPARATE AUTHORIZATION FOR BOUNDED LIVE DEV/TEST API-PROCESS STARTUP VALIDATION AGAINST 127.0.0.1:5432/eos, WITHOUT migrate()
THIS RECORD DOES NOT GRANT THAT VALIDATION
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER
```
