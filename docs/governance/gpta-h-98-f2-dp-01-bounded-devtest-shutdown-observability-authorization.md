# GPTA-H-98 — F2-DP-01 Bounded Dev/Test Shutdown Observability Authorization

> **`OWNER / POA DECISION = APPROVED`**  
> **`NAMED BOUNDED REMEDIATION-SCOPE AUTHORIZATION`**  
> **`AUTHORIZATION ≠ IMPLEMENTATION`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
> **`NOT A BROAD STARTUP OR SHUTDOWN REDESIGN`**  
> **`NOT UNRESTRICTED RUNTIME VALIDATION`**  
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
**Auditable timestamp:** **2026-09-21T10:13:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-98 STATUS = F2-DP-01 BOUNDED DEV/TEST SHUTDOWN OBSERVABILITY AUTHORIZED AS FUTURE REMEDIATION SCOPE

INCREMENT IDENTIFIER = F2-DP-01
NAMED INCREMENT = F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT IMPLEMENT THE INCREMENT
THIS RECORD DOES NOT EXECUTE RUNTIME VALIDATION
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
THIS RECORD DOES NOT CREATE H-99
H-96 EXECUTION CLASSIFICATION REMAINS = PASS WITH FINDINGS
H-97 AUDIT OF H-96 EVIDENCE = PASS
GRACEFUL SHUTDOWN FINDING IS NOT UPGRADED AND NOT DISMISSED
NO MIGRATION EXECUTION IS AUTHORIZED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS AUTHORIZATION IS NOT H-81 EVIDENCE
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
NO GLOBAL migrate() CHANGE
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

Authorization is granted for a **future narrowly bounded remediation increment** only. Implementation is **NOT** performed by creation of this record. Implementation, if later executed, is a **separate execution step** still governed by the scope in this record.

H-36 F1-C-11 remains: authorization ≠ later operational adoption. H-80 through H-97 and H-29 are **not overwritten**.

---

## 1. Document purpose

Authorize, under Owner/POA decision, **only** a future named bounded remediation increment so that incomplete H-96 shutdown observability can be addressed without redesigning application startup, persistence, hydration, or migration behavior.

This record is an **Owner/POA authorization decision** only.

It does **not**:

- implement code;
- run runtime validation;
- modify the database;
- create H-99;
- upgrade H-96 from `PASS WITH FINDINGS`;
- dismiss H-97 Finding 2;
- manufacture H-81 evidence;
- establish Production readiness, EOS adoption, or SoR cutover.

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
| Decision scope | Authorize a **future** narrowly bounded remediation increment named `F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY`, limited to shutdown-lifecycle observability and exit behavior on the already-tested bounded Dev/Test API startup path. **Implementation is not performed by this record.** |

---

## 3. Source evidence: H-96 and H-97

| Record | Role |
| --- | --- |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-94 / H-95 | Named bounded startup branch authorized and implemented; live API-process startup **not claimed** at H-95 |
| **H-96** | Live Dev/Test bounded API-process startup **validation authorization**, then **executed** |
| **H-97** | H-96 execution evidence and independent audit |

H-97 SHA-256 at H-98 creation: `24058163F9E2F47EFAC50A24AB152687EDDB98A14A143BA2702B93BCD36415FC`.  
H-96 SHA-256 (unchanged): `5A4B3108775AE681E3AC6EA1BCF04ED4743F50553866F712B18A24EC3835896E`.

H-97 recorded:

- H-97 documentation/audit of the H-96 evidence record: **PASS**
- H-96 execution classification: **PASS WITH FINDINGS** (not upgraded)

H-96 demonstrated, and H-97 retained:

- opt-in `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true`;
- TCP target `127.0.0.1:5432/eos` on `compose-postgres-1` / PostgreSQL 16.15;
- isolated non-production-like Dev/Test;
- entry into `F2-DP-01-BOUNDED-DEVTEST-API-STARTUP`;
- pool attachment;
- skip of `migrate()`, migration discovery, `schema.sql`, 001–125+, `schema_migrations`, `syncStoreToPostgres()`, and mixed hydrates;
- execution of existing `hydrateF2CommercialFacts()`;
- reconstruction of all six F2-DP-01 maps (1 / 1 / 1 / 1 / 1 / 1 from remaining H-91 synthetic rows);
- listen on `127.0.0.1:18096`;
- HTTP 200 from `/health` and `/ready` with `database.ok=true` and `applicationReady=true`;
- process termination that freed port `18096` and left no H-96 API process running.

H-96 did **not** fully prove graceful Fastify shutdown. That limitation remains controlling.

---

## 4. Confirmed finding requiring controlled consideration

H-97 Finding 2 is **confirmed** and **must not be upgraded or dismissed**.

SIGINT during H-96:

- stopped the listener;
- freed port `18096`;
- left no H-96 API process running;

**but:**

- `shutdown_started` was **not** emitted;
- the wrapper exited with **status 1**;
- graceful shutdown completion was **not fully observable**.

```text
LISTEN SUCCESS ≠ GRACEFUL-SHUTDOWN PROOF
PROCESS STOPPED AND PORT FREED ≠ COMPLETE FASTIFY SHUTDOWN PATH CONFIRMED
H-96 REMAINS PASS WITH FINDINGS
```

Existing `main.ts` already defines a `shutdown` handler that logs `shutdown_started` and then closes the app/pool. H-96 did not observably confirm that path on the Windows/`npx tsx` process tree used for validation. This grant may later address **observability and exit behavior** of that already-tested bounded Dev/Test path. It does **not** authorize a general application shutdown redesign.

H-91 synthetic records remain in isolated Dev/Test `eos`. This grant does **not** authorize their deletion or replacement.

---

## 5. Proposed bounded remediation scope

**Name:** `F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY`

A later implementation, if separately executed under this record, may address **only**:

1. Clear shutdown lifecycle observability on the already-tested bounded Dev/Test API startup path.
2. Reliable capture of shutdown **start** and shutdown **completion or failure**.
3. Appropriate process exit behavior for that same bounded Dev/Test startup path.
4. Tests that verify the bounded shutdown behavior.

In-scope later work is limited to the minimum change required to make those four items observable and testable without altering H-94/H-95 startup semantics, F2-DP-01 persist/hydrate semantics, or global migration behavior.

Out of this increment’s purpose: broadening startup; changing default non-bounded shutdown globally beyond what is strictly required to observe the bounded path; adding new commercial features.

---

## 6. Authorization boundaries

This record **authorizes the scope** of a future narrowly bounded remediation increment.

It does **not automatically authorize implementation**.

```text
AUTHORIZATION IS GRANTED FOR FUTURE BOUNDED SCOPE ONLY
IMPLEMENTATION REQUIRES A SEPARATE EXECUTION STEP
THAT EXECUTION STEP REMAINS GOVERNED BY THIS RECORD
CREATION OF H-98 IS NOT IMPLEMENTATION
CREATION OF H-98 IS NOT RUNTIME VALIDATION
```

If later implementation is executed, it must remain inside §5 and §8. If it cannot: **STOP**. Do not expand. Do not treat this record as permission to redesign startup or shutdown generally.

Authorized later target, if validation is later performed, remains exactly:

| Item | Required |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| PostgreSQL | 16.x |
| Compose service | `compose-postgres-1` |
| Class | isolated non-production-like Dev/Test |
| Startup mode | existing opt-in `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` or authorized equivalent `1` |
| Named startup branch | `F2-DP-01-BOUNDED-DEVTEST-API-STARTUP` |

Refuse Production, UAT, Gate B, `eos_gateb`, stand-in as live PostgreSQL evidence, unidentified targets, and production-like environments.

---

## 7. Explicit exclusions

This decision does **not** authorize:

- Production or UAT activity;
- Gate B or `eos_gateb`;
- migration execution or schema changes;
- changes to migration discovery or global `migrate()`;
- changes to migration 124;
- changes to persistence or hydration semantics;
- changes to mixed initialization;
- new ingestion capabilities;
- UI work;
- booking facts;
- KPI history;
- revenue, profit, or FX logic;
- new commercial rules or numerical thresholds;
- F2-I12;
- thawing I1–I11;
- Path D or EOS adoption evidence;
- SoR cutover;
- H-81 evidence creation or manufacture;
- broad application startup or shutdown redesign;
- Production-readiness claims;
- commit or push.

H-91 synthetic rows must not be deleted under this grant. I11 remains identifier-trace only.

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
TECHNICAL SHUTDOWN OBSERVABILITY ≠ EOS ADOPTION
TECHNICAL SHUTDOWN OBSERVABILITY ≠ SoR CUTOVER
TECHNICAL SHUTDOWN OBSERVABILITY ≠ PRODUCTION READINESS
H-98 AUTHORIZATION ≠ H-81 EVIDENCE
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 8. Required implementation safeguards

If a later execution step implements this increment, it **must**:

1. Preserve the H-94/H-95 bounded startup branch as **opt-in** and **fail-closed**.
2. Leave the default (non-bounded) startup path’s migration/mixed-init behavior **unchanged**.
3. Not call `migrate()`, `listMigrationFiles()`, `syncStoreToPostgres()`, or mixed hydrates from the bounded path.
4. Not change `hydrateF2CommercialFacts()` semantics or the six authorized maps.
5. Not modify migration 124, `schema_migrations`, packages’ global migrate runner, or schema files.
6. Not disturb unrelated existing listeners (H-96 Finding 1: PID 17868 on `8080` was not to be disturbed; later validation must likewise isolate its listen port).
7. **STOP** rather than expand if shutdown observability cannot be achieved without a broad startup/shutdown redesign, persistence change, or migration change.
8. Add only tests that verify the bounded shutdown behavior; do not thaw I1–I11 or start F2-I12.
9. Redact credentials in logs and evidence.
10. Not claim Production readiness or H-81 conclusions from the work.

---

## 9. Required future validation evidence

Any later implementation **and** later validation of this increment must demonstrate, at minimum:

1. The bounded Dev/Test startup branch remains opt-in and fail-closed.
2. The exact database target remains `127.0.0.1:5432/eos`.
3. The environment remains isolated and non-production-like.
4. No migration or mixed initialization is invoked.
5. Six-map hydration remains unchanged and successful.
6. Shutdown **start** and shutdown **completion or failure** are observable.
7. The process terminates without leaving the listener running.
8. Existing unrelated listeners are not disturbed.
9. No Production readiness or H-81 conclusions are drawn.

Future validation, if separately executed, must not treat stand-in persistence as live PostgreSQL evidence. Unix-socket identity must not be used as the controlling application-target proof.

This H-98 record does **not** perform that validation.

---

## 10. Governance status after H-98

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
H-96 = EXECUTED; CLASSIFICATION REMAINS PASS WITH FINDINGS
H-97 = EVIDENCE/AUDIT RECORD; AUDIT OF THAT RECORD = PASS
H-98 = AUTHORIZATION DECISION RECORD ONLY
H-99 = NOT CREATED
THIS AUTHORIZATION IS NOT H-81 EVIDENCE
LATER IMPLEMENTATION OF THIS INCREMENT, IF EXECUTED, IS NOT H-81 COMPLETION
NO H-81 TRIGGER IS MANUFACTURED
F2-I12 = NOT AUTHORIZED
F2-I1–I11 = FROZEN
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
GATE B = NOT USED / NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
EOS ADOPTION = NOT ESTABLISHED
F2-DP-01 = NOT COMPLETE
```

---

## 11. Repository state before and after document creation

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **417** |
| Expected porcelain after this file | **418** (this file only) |
| Application / schema / migration / configuration / H-80–H-97 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

Pre-existing dirty-worktree changes are **preserved exactly**.

---

## 12. Confirmation that no code, database, migration, configuration, or runtime changes occurred

```text
AUTHORIZATION IS GRANTED FOR FUTURE BOUNDED SCOPE
IMPLEMENTATION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO TEST CHANGE BY THIS RECORD
NO PACKAGE CHANGE BY THIS RECORD
NO CONFIGURATION CHANGE BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO MIGRATION BY THIS RECORD
NO RUNTIME VALIDATION BY THIS RECORD
NO H-91 ROW CHANGE BY THIS RECORD
```

---

## 13. Confirmation that H-99 was not created

```text
H-99 = NOT CREATED
THIS RECORD DOES NOT AUTHORIZE H-99
NEXT EXECUTION, IF ANY, REMAINS A SEPARATE STEP GOVERNED BY THIS RECORD
THIS RECORD DOES NOT PERFORM THAT STEP
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, H-81, SoR CUTOVER, MIGRATION, OR A GENERAL STARTUP/SHUTDOWN REDESIGN
```
