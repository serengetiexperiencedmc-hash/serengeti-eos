# GPTA-H-105 — F2-DP-01 Deterministic Dev/Test Shutdown Trigger Live Validation Authorization

> **`VALIDATION AUTHORIZATION`**  
> **`OWNER / POA DECISION = APPROVED`**  
> **`NOT A CODE-CHANGE GRANT`**  
> **`NOT AN IMPLEMENTATION GRANT`**  
> **`NOT A SCHEMA GRANT`**  
> **`NOT A MIGRATION GRANT`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
> **`AUTHORIZATION ≠ EVIDENCE/AUDIT`**  
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
**Auditable timestamp:** **2026-09-21T11:06:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-105 STATUS = LIVE DEV/TEST DETERMINISTIC SHUTDOWN TRIGGER VALIDATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
NAMED INCREMENT = F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER
NAMED STARTUP BRANCH = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
NAMED SHUTDOWN RUNNER = F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT EXECUTE VALIDATION
THIS RECORD DOES NOT ITSELF PROVE THAT VALIDATION OCCURRED
THIS RECORD DOES NOT MODIFY APPLICATION CODE
THIS RECORD DOES NOT MODIFY TESTS
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
THIS RECORD DOES NOT CREATE H-106
NO IMPLEMENTATION AUTHORITY IS GRANTED
NO MIGRATION EXECUTION IS AUTHORIZED
H-96 EXECUTION CLASSIFICATION REMAINS = PASS WITH FINDINGS
H-101 EXECUTION CLASSIFICATION REMAINS = STOP / NOT VALIDATED
H-101 IS NOT UPGRADED
H-101 IS NOT REINTERPRETED AS IMPLEMENTATION FAILURE
H-102 = DETERMINISTIC-TRIGGER AUTHORIZATION
H-103 = IMPLEMENTATION + FOCUSED TESTS COMPLETE
H-104 = PASS — IMPLEMENTATION EVIDENCE/AUDIT ONLY
H-104 DOES NOT AUTHORIZE LIVE RUNTIME VALIDATION
LIVE DETERMINISTIC SHUTDOWN VALIDATION HAS NOT YET OCCURRED
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

H-36 F1-C-11 remains: authorization ≠ execution evidence. H-80 through H-104 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize one narrowly bounded **live Dev/Test validation-only** step of the **already-implemented** named increment `F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER`, so the **actual `apps/api/src/main.ts` API process** can be started on the existing fail-closed bounded Dev/Test startup path, confirmed to be running in that mode against `127.0.0.1:5432/eos`, then shut down by invoking the already-created loopback-only endpoint:

```text
POST /eos-devtest/f2-dp-01/bounded-shutdown
```

and the complete bounded shutdown lifecycle can be observed as application evidence, distinguishable from external Windows process termination.

This is **validation authorization only**. It is **not** an implementation grant, code-change grant, schema grant, migration grant, Production/UAT grant, H-81, F2-I12, SoR cutover, or EOS adoption.

H-105 **does not itself constitute validation evidence**. H-105 **does not itself prove that validation occurred**.

A later evidence/audit record will be required after the validation run. That later record is **not** created by this authorization.

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
| Decision scope | Authorize a **future validation-only** run of the already-implemented deterministic bounded Dev/Test shutdown trigger against the actual `main.ts` process. **No implementation authority. No code change. No migration.** |

---

## 3. Current governance state

| Record | Status |
| --- | --- |
| H-80 | **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-94 / H-95 | Named bounded startup branch authorized and implemented |
| H-96 | Live bounded API startup validation **PASS WITH FINDINGS** (not upgraded) |
| H-97 | H-96 evidence/audit; **PASS — evidence/audit only** |
| H-98 | Shutdown-observability implementation authorization |
| H-99 | H-98 implementation evidence/audit; **PASS — implementation evidence/audit only** |
| H-100 | Live shutdown-observability validation authorization (Windows JS SIGINT not proveable without code change) |
| H-101 | Live shutdown-observability execution; **STOP / NOT VALIDATED** |
| H-102 | Deterministic-trigger implementation authorization |
| H-103 | Implementation + focused tests; **complete** (no H-103 governance file) |
| H-104 | Implementation evidence/audit; **PASS — implementation evidence/audit only** |
| Focused tests of trigger + shutdown + startup | **30/30 passed** |
| TypeScript compilation | **passed** (`tsc -p tsconfig.json --noEmit` exited 0) |
| Live runtime validation of the deterministic trigger | **NOT YET OCCURRED** |

H-104 SHA-256 at H-105 creation: `5D0E7631AB82D4CF929FDE6B5E55A2002B2D1ADD27722856987F6276E39AB2BA`.  
H-102 SHA-256 (unchanged): `111E023DB6F0AD5DACDBAF9CB55A2B23312199E8494FEDF0289E2A1E265CA894`.  
H-100 SHA-256 (unchanged): `2F916EDD2917508E063A1748E11E104FA718AAA790292956C3F8164D092F1E9C`.  
H-99 SHA-256 (unchanged): `E75C2CF2CBF5DC44EE7DD9FE691FE7CF94B830E9F83CFCE2DDF6B833E5D682AF`.

H-104 next gate is this validation grant. No material conflict with the predecessor chain.

H-101 remains exactly:

```text
STOP / NOT VALIDATED
```

Creation of H-105 does **not** upgrade H-101. H-101 is **not** reinterpreted as implementation failure. H-96 remains **PASS WITH FINDINGS**.

---

## 4. Governance distinctions

This record distinguishes three separate acts:

| Act | Record / status |
| --- | --- |
| Authorization to validate | **this H-105 record** |
| Actual execution | **not performed** by creation of this record; later separate execution step |
| Evidence/audit after execution | **later required**; **not** this record; **H-106 is not created here** |

```text
H-105 = AUTHORIZATION TO VALIDATE
H-105 ≠ EXECUTION
H-105 ≠ EVIDENCE THAT VALIDATION OCCURRED
H-105 ≠ PROOF THAT THE ACTUAL API PROCESS CAN SHUT ITSELF DOWN
FOCUSED TESTS ≠ LIVE-PROCESS VALIDATION
FASTIFY inject() ≠ ACTUAL main.ts PROCESS
H-104 ≠ LIVE RUNTIME VALIDATION GRANT
```

---

## 5. Exact validation scope

Later execution may:

1. Start the **actual** `apps/api/src/main.ts` API process.
2. Use **only** the existing fail-closed bounded Dev/Test startup mechanism authorized by H-94/H-95 (`EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` or authorized equivalent `1`).
3. Target **only** the isolated Dev/Test PostgreSQL identity in §5.1.
4. Use the already-created loopback-only endpoint:

   ```text
   POST /eos-devtest/f2-dp-01/bounded-shutdown
   ```

   from loopback (`127.0.0.1`) against the process listen host `127.0.0.1`.
5. Invoke that endpoint **only after** confirming the process is actually running in bounded Dev/Test mode (bounded startup logs / `api_listening` on loopback, and no production-like env).
6. Observe the complete shutdown lifecycle, including as applicable:
   - deterministic trigger accepted (`f2_dp01_bounded_devtest_shutdown_trigger_accepted`);
   - shutdown request / signal received;
   - `shutdown_started`;
   - Fastify close invoked;
   - pool end invoked;
   - shutdown completed or failed;
   - final process exit status.
7. Confirm that the API listener is released and the bounded process terminates.
8. Confirm that bounded startup hydration of the six F2-DP-01 maps remains intact (existing `hydrateF2CommercialFacts` behavior; no added or modified commercial facts).
9. Perform **read-only** post-validation checks where necessary to establish that no unauthorized migration or schema activity occurred.

API listen host must remain exact `127.0.0.1`. If port `8080` is occupied, a non-colliding loopback port via existing `EOS_PORT` / `listenHostFromEnv` is acceptable as already established by H-96. That does **not** change the authorized PostgreSQL target.

### 5.1 Authorized database target (exact)

| Item | Required |
| --- | --- |
| Host | `127.0.0.1` |
| PostgreSQL port | `5432` |
| Database | `eos` |
| Class | isolated non-production-like Dev/Test |

**Do not substitute:** Unix socket as controlling identity; another host/port/database; Gate B; `eos_gateb`; UAT; Production; production-like env; in-process memory persistence; stand-in `eos_devtest_f2_dp01` as live PostgreSQL evidence.

Positive TCP identity (`current_database()=eos`, `inet_server_port()=5432`) is required before treating the run as in-scope. If identity cannot be established: **STOP**.

### 5.2 Schema / migration / data prohibition

Do **not**: run `migrate()`; run `listMigrationFiles()` / migration discovery beyond what the bounded path explicitly permits; apply `schema.sql`; apply 001–123, 124, or 125+; create or modify `schema_migrations`; modify any migration; modify the six sidecar tables; INSERT/UPDATE/DELETE commercial facts; delete remaining H-91 synthetic rows; perform mixed-store initialization; perform full schema initialization.

Hydration may reconstruct the existing six maps. No new business facts are authorized.

---

## 6. Critical evidence constraint

Later validation **must not** treat any of the following as sufficient proof of the application shutdown lifecycle:

```text
Windows process.kill(pid, 'SIGINT')
Windows process.kill(pid, 'SIGTERM')
Stop-Process
task termination
a freed TCP port alone
wrapper exit alone
external process termination
```

H-98/H-99 investigation and H-101 execution established that Windows `process.kill(pid, 'SIGINT'|'SIGTERM')` can terminate the process without invoking JavaScript handlers. A freed port after such a kill is **not** proof that Fastify close began. H-101 remains **STOP / NOT VALIDATED** for that reason and is **not** upgraded by this record.

Therefore later validation must invoke the **already-implemented** loopback POST trigger against the real bounded process, then observe the existing runner lifecycle. The purpose of this validation is to distinguish:

```text
deterministic shutdown trigger
→ existing bounded shutdown runner
→ lifecycle events
→ process exit
```

from:

```text
external process termination → process disappears
```

**Do not modify the implementation merely to make validation easier.**

If the deterministic POST trigger cannot be safely invoked against the real bounded process: **STOP**. No source-code modification is authorized as part of the validation. Any such requirement must become a **separate governance decision**.

---

## 7. Required evidence (later execution, not this record)

A later PASS requires evidence, as applicable, that:

1. The actual `main.ts` API process started.
2. The correct bounded Dev/Test branch was entered.
3. The target was the correct non-production-like `127.0.0.1:5432/eos`.
4. The process was confirmed running in bounded mode **before** the POST was issued.
5. The POST was issued to `127.0.0.1` `/eos-devtest/f2-dp-01/bounded-shutdown`.
6. Deterministic trigger accepted was observed.
7. Global `migrate()` was not executed.
8. Unauthorized migration discovery was not executed.
9. Migration 124 was not executed.
10. `schema_migrations` was not created or modified.
11. Mixed initialization was not executed.
12. Existing `hydrateF2CommercialFacts()` six-map behavior was preserved.
13. Shutdown phases were observed in the intended order:
    - trigger accepted / shutdown request received;
    - `shutdown_started`;
    - Fastify close invoked;
    - pool end invoked;
    - shutdown completed **or** a clearly observable shutdown failure.
14. Fastify close was actually invoked.
15. Pool close/end was actually invoked.
16. Process exit status was appropriate (0 on successful shutdown; 1 on observed failure).
17. The listener was released.
18. The bounded process terminated.
19. No unrelated listener was disturbed.
20. Default startup code and the bounded implementation were not altered during validation.

Observation must use already-present logs/instrumentation or minimally non-mutating observation. **Do not add instrumentation code** under this grant.

---

## 8. Stop conditions

**STOP** immediately, rather than expand scope, if later validation would require:

- changing source code;
- changing tests;
- changing migrations;
- changing configuration;
- executing an unauthorized migration;
- using a Production/UAT environment;
- using Gate B / `eos_gateb`;
- modifying commercial facts;
- altering the bounded startup or shutdown implementation;
- treating Windows `process.kill(pid, 'SIGINT'|'SIGTERM')` as JS-handler proof;
- treating `Stop-Process`, task termination, a freed TCP port, or wrapper exit alone as lifecycle proof;
- adding code solely to make validation easier;
- invoking the POST when the process is not confirmed to be in bounded Dev/Test mode;
- invoking the POST from a non-loopback source or against a non-loopback listen host.

Any such requirement must become a **separate governance decision**. Do not silently bypass this record.

---

## 9. Explicit exclusions

H-105 does **NOT** authorize:

- code changes;
- test changes;
- configuration changes;
- new implementation authority;
- migration execution;
- schema changes;
- `schema_migrations` fabrication;
- mixed-store initialization;
- full schema initialization;
- production startup;
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
- treating H-101 as upgraded;
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
H-105 AUTHORIZATION ≠ VALIDATION EVIDENCE
H-105 AUTHORIZATION ≠ H-81 EVIDENCE
WINDOWS process.kill(SIGINT) ≠ JS HANDLER PROOF
Stop-Process ≠ SHUTDOWN LIFECYCLE PROOF
FREED TCP PORT ALONE ≠ SHUTDOWN LIFECYCLE PROOF
WRAPPER EXIT ALONE ≠ SHUTDOWN LIFECYCLE PROOF
H-101 REMAINS STOP / NOT VALIDATED
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 10. Governance interpretation

```text
H-105 IS VALIDATION AUTHORIZATION ONLY
H-105 DOES NOT ITSELF CONSTITUTE VALIDATION EVIDENCE
H-105 DOES NOT ITSELF PROVE THAT VALIDATION OCCURRED
H-105 DOES NOT ESTABLISH PRODUCTION READINESS
H-105 DOES NOT ESTABLISH H-81 EVIDENCE
H-105 DOES NOT AUTHORIZE EOS ADOPTION
H-105 DOES NOT ALTER THE CURRENT COMMERCIAL SYSTEM OF RECORD
H-105 DOES NOT AUTHORIZE ANY BROADER F2 INCREMENT
H-105 DOES NOT GRANT IMPLEMENTATION AUTHORITY
H-101 REMAINS STOP / NOT VALIDATED
H-96 REMAINS PASS WITH FINDINGS
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
```

---

## 11. H-80 / H-81 / F2-I12

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

## 12. Repository safety

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **424** |
| Application / schema / migration / H-80–H-104 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

Pre-existing dirty-worktree changes are **preserved exactly**.

---

## 13. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
VALIDATION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO API PROCESS STARTED BY THIS RECORD
NO POST TRIGGER INVOKED BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO TEST CHANGE BY THIS RECORD
NO MIGRATION BY THIS RECORD
H-106 = NOT CREATED
```

---

## 14. Next governance gate

```text
NEXT GATE = EXECUTE THE AUTHORIZED LIVE DEV/TEST DETERMINISTIC-TRIGGER VALIDATION AGAINST 127.0.0.1:5432/eos BY STARTING THE ACTUAL main.ts BOUNDED PROCESS, CONFIRMING BOUNDED MODE, THEN POST 127.0.0.1 /eos-devtest/f2-dp-01/bounded-shutdown, OBSERVE THE EXISTING RUNNER LIFECYCLE THROUGH PROCESS EXIT, THEN PRODUCE A LATER EVIDENCE/AUDIT RECORD.
THIS RECORD DOES NOT PERFORM THAT EXECUTION.
THIS RECORD DOES NOT CREATE H-106.
THIS RECORD DOES NOT AUTHORIZE CODE CHANGES, TEST CHANGES, MIGRATION, UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER.
WINDOWS process.kill(pid, 'SIGINT') MUST NOT BE TREATED AS JS-HANDLER PROOF.
Stop-Process, TASK TERMINATION, A FREED TCP PORT, OR WRAPPER EXIT ALONE MUST NOT BE TREATED AS SHUTDOWN-LIFECYCLE PROOF.
IF THE DETERMINISTIC POST TRIGGER CANNOT BE SAFELY INVOKED AGAINST THE REAL BOUNDED PROCESS: STOP. NO SOURCE-CODE MODIFICATION IS AUTHORIZED.
H-101 REMAINS STOP / NOT VALIDATED.
```
