# GPTA-H-100 — F2-DP-01 Live Dev/Test Shutdown Observability Validation Authorization

> **`VALIDATION AUTHORIZATION`**  
> **`OWNER / POA DECISION = APPROVED`**  
> **`NOT A CODE-CHANGE GRANT`**  
> **`NOT AN IMPLEMENTATION GRANT`**  
> **`NOT A SCHEMA GRANT`**  
> **`NOT A MIGRATION GRANT`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
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
**Auditable timestamp:** **2026-09-21T10:29:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-100 STATUS = LIVE DEV/TEST SHUTDOWN OBSERVABILITY VALIDATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
NAMED INCREMENT = F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
NAMED STARTUP BRANCH = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT EXECUTE VALIDATION
THIS RECORD DOES NOT MODIFY APPLICATION CODE
THIS RECORD DOES NOT MODIFY TESTS
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
THIS RECORD DOES NOT CREATE H-101
NO IMPLEMENTATION AUTHORITY IS GRANTED
NO MIGRATION EXECUTION IS AUTHORIZED
H-96 EXECUTION CLASSIFICATION REMAINS = PASS WITH FINDINGS
H-99 = IMPLEMENTATION EVIDENCE/AUDIT PASS
LIVE RUNTIME VALIDATION OF SHUTDOWN OBSERVABILITY HAS NOT YET OCCURRED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS AUTHORIZATION IS NOT H-81 EVIDENCE
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
NO GLOBAL migrate()
NO CODE CHANGE
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

Authorization is granted, but execution is **NOT** performed by creation of this record.

H-36 F1-C-11 remains: authorization ≠ execution evidence. H-80 through H-99 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize one narrowly bounded **live Dev/Test validation-only** step of the **already-implemented** named increment `F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY`, so the **actual API process** can be shown to enter the existing bounded Dev/Test startup branch, hydrate the six F2-DP-01 maps without mixed init or migration, then exercise the already-implemented shutdown path with observable lifecycle evidence.

This is **validation authorization only**. It is **not** an implementation grant, code-change grant, schema grant, migration grant, Production/UAT grant, H-81, F2-I12, SoR cutover, or EOS adoption.

H-100 **does not itself constitute validation evidence**.

---

## 2. Owner / POA identity and decision status

| Field | Record |
| --- | --- |
| Owner / POA | **Patrick Makundi** |
| Authority basis | Company Owner has granted Patrick Makundi power of attorney to act on behalf of the company for commercial business-rule and governance decisions within this process. |
| Instrument number | **Not recorded in this repository; none is invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41 / H-85) |
| UAT Authority | **Patrick Makundi** (H-41 / H-85) — UAT **not** granted by this record |
| Combined role | **YES** — functions remain distinct |
| **Decision** | **APPROVED** |
| Decision scope | Authorize a **future validation-only** step of the already-implemented bounded Dev/Test startup and shutdown observability increment. **No implementation authority. No code change. No migration.** |

---

## 3. Current governance state

| Record | Status |
| --- | --- |
| H-80 | **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-96 | Live bounded API startup validation **PASS WITH FINDINGS** (not upgraded) |
| H-97 | H-96 evidence/audit only; **PASS** |
| H-98 | Authorized the bounded shutdown-observability **implementation** |
| H-99 | Implementation evidence/audit only; **PASS** |
| Implementation of `F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY` | **complete** |
| Focused tests | **23/23 passed** |
| TypeScript compilation | **passed** (`tsc -p tsconfig.json --noEmit` exited 0) |
| Live runtime validation of shutdown observability | **NOT YET OCCURRED** |

H-99 SHA-256 at H-100 creation: `E75C2CF2CBF5DC44EE7DD9FE691FE7CF94B830E9F83CFCE2DDF6B833E5D682AF`.  
H-98 SHA-256 (unchanged): `A4553FAF7077D352C2A933E17F11A3D8534817407AE038E29EC2FAB2E8C3E942`.

H-99 next gate is this validation grant. No material conflict with the predecessor chain. H-96 Finding 2 (incomplete shutdown observability on Windows external `process.kill`) remains controlling for how later validation may prove the JS handler path.

---

## 4. Exact validation scope

Later execution may start the **actual API process** through existing `apps/api/src/main.ts` and:

1. Use the existing opt-in bounded startup mechanism (`EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` or authorized equivalent `1`).
2. Use only the isolated Dev/Test TCP target below.
3. Exercise the **already-implemented** bounded shutdown path.
4. Collect observable lifecycle evidence (see §6).
5. Confirm the API listener is released after shutdown.
6. Confirm the process does not remain running.
7. Confirm the bounded startup branch remains isolated and opt-in.
8. Confirm six-map hydration behavior remains intact during startup, **without** adding or modifying commercial facts.
9. Perform **read-only** post-validation checks where necessary to establish that no unauthorized migration or schema activity occurred.

### 4.1 Authorized database target (exact)

| Item | Required |
| --- | --- |
| Host | `127.0.0.1` |
| PostgreSQL port | `5432` |
| Database | `eos` |
| Class | isolated non-production-like Dev/Test |

**Do not substitute:** Unix socket as controlling identity; another host/port/database; Gate B; `eos_gateb`; UAT; Production; production-like env; in-process memory persistence; stand-in `eos_devtest_f2_dp01` as live PostgreSQL evidence.

Positive TCP identity (`current_database()=eos`, `inet_server_port()=5432`) is required before treating the run as in-scope. If identity cannot be established: **STOP**.

### 4.2 Schema / migration / data prohibition

Do **not**: run `migrate()`; run `listMigrationFiles()` / migration discovery; apply `schema.sql`; apply 001–123, 124, or 125+; create or modify `schema_migrations`; modify any migration; modify the six sidecar tables; INSERT/UPDATE/DELETE commercial facts; delete remaining H-91 synthetic rows.

Hydration may reconstruct the existing six maps. No new business facts are authorized.

---

## 5. Critical signal-testing constraint

Later validation **must not** treat an external Windows:

```text
process.kill(pid, 'SIGINT')
```

as sufficient proof of the JavaScript signal-handler path.

H-98/H-99 investigation established that this mechanism is **not** reliable evidence of a Node.js signal handler executing on Windows. It can terminate the process without invoking JS handlers. A freed port after such a kill is **not** proof that Fastify close began.

Therefore later validation must use a **deterministic mechanism** that exercises the **actual already-implemented** bounded shutdown runner / signal-host behavior (for example, invoking the installed catchable handler path or `runF2Dp01BoundedDevtestShutdown` against the live process in a way that is already supported, without new code).

**Do not modify the implementation merely to make validation easier.**

If the existing runtime environment makes deterministic signal delivery impossible: **STOP** and report the limitation rather than changing application code.

---

## 6. Required evidence

A later PASS requires evidence, as applicable, that:

1. The actual API process started.
2. The correct bounded Dev/Test branch was entered.
3. The target was the correct non-production-like `127.0.0.1:5432/eos`.
4. Global `migrate()` was not executed.
5. Migration discovery was not executed.
6. Migration 124 was not executed.
7. `schema_migrations` was not created or modified.
8. Mixed initialization was not executed.
9. Existing `hydrateF2CommercialFacts()` behavior was preserved.
10. Shutdown phases were observed in the intended order:
    - signal received;
    - `shutdown_started`;
    - Fastify close invoked;
    - pool end invoked;
    - shutdown completed **or** a clearly observable shutdown failure.
11. Fastify close was actually invoked.
12. Pool close/end was actually invoked.
13. Process exit status was appropriate (0 on successful shutdown; 1 on observed failure).
14. The listener was released.
15. No unrelated listener was disturbed.
16. Default startup code and the bounded implementation were not altered during validation.

Observation must use already-present logs/instrumentation or minimally non-mutating observation. **Do not add instrumentation code** under this grant.

---

## 7. Stop conditions

**STOP** immediately, rather than expand scope, if later validation would require:

- changing source code;
- changing tests;
- changing migrations;
- changing configuration;
- executing an unauthorized migration;
- using a Production/UAT environment;
- using Gate B / `eos_gateb`;
- modifying commercial facts;
- altering the bounded startup implementation;
- treating Windows `process.kill(pid, 'SIGINT')` as JS-handler proof;
- adding code solely to make validation easier.

Any such requirement must become a **separate governance decision**. Do not silently bypass this record.

---

## 8. Explicit exclusions

H-100 does **NOT** authorize:

- code changes;
- test changes;
- configuration changes;
- migration execution;
- schema changes;
- `schema_migrations` fabrication;
- Production;
- UAT;
- Gate B;
- `eos_gateb`;
- full unrestricted API validation;
- Production-readiness certification;
- H-81 evidence;
- EOS adoption;
- SoR cutover;
- ingestion;
- UI;
- booking facts;
- KPI history;
- revenue/profit logic;
- FX;
- new commercial rules or numerical thresholds;
- F2-I12;
- I1–I11 thaw;
- Path D;
- broad startup/shutdown redesign;
- commit or push.

Legacy **250k / 20%** remains **legacy**.

```text
DURABILITY ≠ AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
NO FABRICATED receivedAt / FIRST-RESPONSE FACTS
FREE-STRING MARKET ≠ AUTHORITATIVE MARKET TAXONOMY
new_qualified ≠ AUTHORITATIVE QUALIFICATION STATE
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
NO KPI HISTORY
NO BOOKING FACTS
TECHNICAL SHUTDOWN VALIDATION ≠ EOS ADOPTION
TECHNICAL SHUTDOWN VALIDATION ≠ SoR CUTOVER
TECHNICAL SHUTDOWN VALIDATION ≠ PRODUCTION READINESS
H-100 AUTHORIZATION ≠ VALIDATION EVIDENCE
H-100 AUTHORIZATION ≠ H-81 EVIDENCE
WINDOWS process.kill(SIGINT) ≠ JS HANDLER PROOF
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 9. Governance interpretation

```text
H-100 IS VALIDATION AUTHORIZATION ONLY
H-100 DOES NOT ITSELF CONSTITUTE VALIDATION EVIDENCE
H-100 DOES NOT ESTABLISH PRODUCTION READINESS
H-100 DOES NOT ESTABLISH H-81 EVIDENCE
H-100 DOES NOT AUTHORIZE EOS ADOPTION
H-100 DOES NOT ALTER THE CURRENT COMMERCIAL SYSTEM OF RECORD
H-100 DOES NOT AUTHORIZE ANY BROADER F2 INCREMENT
H-100 DOES NOT GRANT IMPLEMENTATION AUTHORITY
H-96 REMAINS PASS WITH FINDINGS
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
```

---

## 10. H-80 / H-81 / F2-I12

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS VALIDATION AUTHORIZATION IS NOT H-81 EVIDENCE
LATER EXECUTION OF THIS VALIDATION, IF PERFORMED, IS NOT H-81 COMPLETION
NO H-81 TRIGGER IS MANUFACTURED
F2-I12 = NOT AUTHORIZED
F2-I1–I11 = FROZEN
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
```

---

## 11. Repository safety

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **420** |
| Application / schema / migration / H-80–H-99 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

Pre-existing dirty-worktree changes are **preserved exactly**.

---

## 12. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
VALIDATION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO API PROCESS STARTED BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO TEST CHANGE BY THIS RECORD
NO MIGRATION BY THIS RECORD
H-101 = NOT CREATED
```

---

## 13. Next governance gate

```text
NEXT GATE = EXECUTE THE AUTHORIZED LIVE DEV/TEST SHUTDOWN-OBSERVABILITY VALIDATION AGAINST 127.0.0.1:5432/eos USING A DETERMINISTIC MECHANISM THAT EXERCISES THE ALREADY-IMPLEMENTED BOUNDED SHUTDOWN RUNNER/SIGNAL-HOST PATH, THEN PRODUCE EXECUTION EVIDENCE AND AUDIT IT.
THIS RECORD DOES NOT PERFORM THAT EXECUTION.
THIS RECORD DOES NOT CREATE H-101.
THIS RECORD DOES NOT AUTHORIZE CODE CHANGES, TEST CHANGES, MIGRATION, UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER.
WINDOWS process.kill(pid, 'SIGINT') MUST NOT BE TREATED AS JS-HANDLER PROOF.
```
