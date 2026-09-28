# GPTA-H-102 — F2-DP-01 Bounded Dev/Test Deterministic Shutdown Trigger Authorization

> **`OWNER / POA DECISION = APPROVED`**  
> **`NAMED BOUNDED IMPLEMENTATION-SCOPE AUTHORIZATION`**  
> **`AUTHORIZATION ≠ IMPLEMENTATION`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
> **`NOT A GENERAL SHUTDOWN API`**  
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
**Auditable timestamp:** **2026-09-21T10:41:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-102 STATUS = F2-DP-01 BOUNDED DEV/TEST DETERMINISTIC SHUTDOWN TRIGGER AUTHORIZED AS FUTURE IMPLEMENTATION SCOPE

INCREMENT IDENTIFIER = F2-DP-01
NAMED INCREMENT = F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT IMPLEMENT THE INCREMENT
THIS RECORD DOES NOT EXECUTE RUNTIME VALIDATION
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
THIS RECORD DOES NOT CREATE H-103
NO MECHANISM IS PRESCRIBED BY THIS RECORD
H-96 EXECUTION CLASSIFICATION REMAINS = PASS WITH FINDINGS
H-101 EXECUTION CLASSIFICATION REMAINS = STOP / NOT VALIDATED
H-101 IS NOT REINTERPRETED AS IMPLEMENTATION FAILURE
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

Authorization is granted for a **future narrowly bounded implementation increment** only. Implementation is **NOT** performed by creation of this record. Implementation, if later executed, is a **separate execution step** still governed by the scope in this record.

H-36 F1-C-11 remains: authorization ≠ later operational adoption. H-80 through H-101 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize, under Owner/POA decision, **only** a future named bounded implementation increment so that the **actual Dev/Test `main.ts` process** can deterministically invoke the **already-implemented** bounded shutdown runner, enabling a later H-100-style live validation to complete without weakening the evidence standard.

This record is an **Owner/POA authorization decision** only.

It does **not**:

- implement the trigger;
- choose HTTP, stdin, a signal bridge, or any other concrete mechanism;
- run runtime validation;
- modify the database;
- create H-103;
- upgrade H-101 from `STOP / NOT VALIDATED`;
- reinterpret H-101 as a failed implementation;
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
| Decision scope | Authorize a **future** narrowly bounded implementation increment named `F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER`, limited to a fail-closed Dev/Test-only deterministic invocation of the **existing** bounded shutdown runner. **Implementation is not performed by this record.** |

---

## 3. Reason for this decision — H-101 STOP

H-101 executed the H-100 validation authorization and correctly classified:

```text
H-101 = STOP / NOT VALIDATED
```

That classification is **retained**. This record does **not** upgrade it.

H-101 established that bounded API startup succeeded, six-map hydration succeeded, migration/mixed-init avoidance succeeded, and the isolated Dev/Test process started correctly.

H-101 also established that the actual live `main.ts` process could **not** provide deterministic evidence that the JavaScript SIGINT/SIGTERM shutdown handler executed on Windows.

Controlling facts (not dismissed):

1. `main.ts` reaches the bounded shutdown runner through process signal handlers.
2. The implementation logs `windowsExternalKillIsNotCatchable=true`.
3. An external Windows `process.kill(pid, 'SIGINT')` **cannot** be treated as JavaScript signal-handler evidence.
4. The fake signal host used by focused tests exists **only in tests** and is **not** wired into the live API process.
5. There is currently **no** HTTP/stdin deterministic shutdown entry in the live bounded process.
6. `Stop-Process` is operational cleanup only and is **not** shutdown-lifecycle evidence.
7. A freed port is **not** proof that Fastify close ran.
8. H-101 therefore correctly **stopped** rather than weakening the evidence standard.

```text
H-101 IS A VALIDATION-ENVIRONMENT / TRIGGER LIMITATION
H-101 IS NOT AN IMPLEMENTATION FAILURE
H-101 DID NOT AUTHORIZE A CODE CHANGE
H-101 DID NOT INVALIDATE THE H-98/H-99 SHUTDOWN-OBSERVABILITY IMPLEMENTATION
```

---

## 4. Relationship to previous governance

| Record | Status (unchanged by this decision) |
| --- | --- |
| H-80 | **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-96 | **PASS WITH FINDINGS** |
| H-97 | **PASS — evidence/audit only** |
| H-98 | Implementation authorization for shutdown **observability** |
| H-99 | **PASS — implementation evidence/audit only** |
| H-100 | Live validation **authorization** |
| H-101 | **STOP / NOT VALIDATED** (execution report of H-100; not upgraded) |
| **H-102** | **New** authorization for a deterministic live-process **trigger** gap only |

H-100 SHA-256 at H-102 creation: `2F916EDD2917508E063A1748E11E104FA718AAA790292956C3F8164D092F1E9C`.  
H-98 SHA-256 (unchanged): `A4553FAF7077D352C2A933E17F11A3D8534817407AE038E29EC2FAB2E8C3E942`.  
H-99 SHA-256 (unchanged): `E75C2CF2CBF5DC44EE7DD9FE691FE7CF94B830E9F83CFCE2DDF6B833E5D682AF`.

H-102 does **not** replace H-98 observability. It addresses only the missing **deterministic live-process invocation** of that already-implemented runner.

---

## 5. Named increment and future implementation scope

**Name:** `F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER`

A later implementation, if separately executed under this record, may introduce the **minimum necessary deterministic trigger** for the bounded Dev/Test API process so that H-100-style runtime validation can later prove the actual `main.ts` process executed the existing bounded shutdown runner.

The later implementation **must inspect the existing architecture before selecting the trigger mechanism**.

This record **does not prescribe** an HTTP endpoint, stdin command, signal bridge, or other concrete mechanism. The implementation step must choose the **smallest safe mechanism** consistent with this authorization.

If later implemented, the mechanism **must**:

1. Be available only in the explicitly opt-in bounded Dev/Test mode.
2. Be fail-closed outside that mode.
3. Invoke the **existing** bounded shutdown runner rather than duplicate shutdown logic.
4. Preserve the existing shutdown lifecycle phases:
   - signal/request received;
   - `shutdown_started`;
   - Fastify close invoked;
   - pool end invoked;
   - completed or failed;
   - appropriate exit status.
5. Not alter the default/non-bounded shutdown path.
6. Not become a general-purpose Production shutdown API.
7. Not create a new commercial application capability.
8. Be locally constrained to the isolated Dev/Test environment.
9. Be covered by focused automated tests.
10. Be designed so that a later live validation can prove the actual `main.ts` process executed the shutdown runner.

```text
AUTHORIZATION IS GRANTED FOR FUTURE BOUNDED SCOPE ONLY
IMPLEMENTATION REQUIRES A SEPARATE EXECUTION STEP
THAT EXECUTION STEP REMAINS GOVERNED BY THIS RECORD
CREATION OF H-102 IS NOT IMPLEMENTATION
CREATION OF H-102 IS NOT RUNTIME VALIDATION
NO CONCRETE TRIGGER MECHANISM IS SELECTED BY THIS RECORD
```

---

## 6. Critical safety requirement

The future trigger must **NOT** become available merely because the application is running.

It must require the existing bounded Dev/Test opt-in (`EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` or authorized equivalent `1`) and must **additionally fail closed** unless the exact authorized Dev/Test conditions are satisfied (host `127.0.0.1`, PostgreSQL port `5432`, database `eos`, non-production-like).

The trigger must **not** be exposed or enabled in:

- Production;
- UAT;
- Gate B;
- `eos_gateb`;
- normal/default API startup;
- production-like environments.

If later implementation cannot guarantee this isolation: **STOP** rather than broaden the mechanism. Do not treat this record as permission to add a general shutdown API.

---

## 7. Explicit exclusions

H-102 does **NOT** authorize:

- Production changes;
- UAT changes;
- Gate B;
- `eos_gateb`;
- general application shutdown redesign;
- replacement of the existing signal handling;
- changes to default SIGINT/SIGTERM behavior outside the bounded branch;
- changes to persistence semantics;
- changes to hydration semantics;
- migration execution;
- migration discovery;
- Migration 124 changes;
- schema changes;
- `schema_migrations`;
- mixed initialization;
- ingestion;
- UI;
- booking;
- KPI history;
- revenue;
- profit;
- FX;
- new commercial rules;
- new numerical thresholds;
- F2-I12;
- I1–I11 thaw;
- Path D;
- EOS adoption;
- SoR cutover;
- H-81 evidence;
- Production-readiness certification;
- broad API testing;
- broad startup redesign;
- broad shutdown redesign;
- commit;
- push.

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
TECHNICAL TRIGGER IMPLEMENTATION ≠ EOS ADOPTION
TECHNICAL TRIGGER IMPLEMENTATION ≠ SoR CUTOVER
TECHNICAL TRIGGER IMPLEMENTATION ≠ PRODUCTION READINESS
H-102 AUTHORIZATION ≠ IMPLEMENTATION
H-102 AUTHORIZATION ≠ SHUTDOWN VALIDATION
H-102 AUTHORIZATION ≠ H-81 EVIDENCE
WINDOWS process.kill(SIGINT) ≠ JS HANDLER PROOF
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 8. Future validation objective

The reason for this authorization is to enable a **later** validation in which the actual API process can demonstrate:

1. bounded Dev/Test startup;
2. actual live-process invocation of the deterministic shutdown trigger;
3. shutdown request received;
4. `shutdown_started`;
5. Fastify close invoked;
6. pool end invoked;
7. shutdown completed or failed;
8. correct exit status;
9. listener released;
10. no orphaned process;
11. no unrelated listener disturbed.

That later validation, if separately authorized/executed, must still retain H-100’s prohibition on treating Windows external `process.kill(pid, 'SIGINT')` as JavaScript signal-handler evidence.

This H-102 record does **not** authorize or perform that validation.

---

## 9. Governance boundaries after H-102

Even though H-102 is **APPROVED**:

```text
H-102 DOES NOT MEAN THE TRIGGER HAS BEEN IMPLEMENTED
H-102 DOES NOT MEAN SHUTDOWN HAS BEEN VALIDATED
H-102 DOES NOT ESTABLISH PRODUCTION READINESS
H-102 DOES NOT ESTABLISH H-81 EVIDENCE
H-102 DOES NOT ESTABLISH EOS ADOPTION
H-102 DOES NOT CHANGE THE COMMERCIAL SYSTEM OF RECORD
H-102 DOES NOT AUTHORIZE ANY BROADER F2 INCREMENT
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
H-101 REMAINS STOP / NOT VALIDATED
```

---

## 10. Repository safety

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **421** |
| Expected porcelain after this file | **422** (this file only) |
| Application / schema / migration / configuration / H-80–H-101 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

Pre-existing dirty-worktree changes are **preserved exactly**.

---

## 11. Execution-not-performed

```text
AUTHORIZATION IS GRANTED FOR FUTURE BOUNDED SCOPE
IMPLEMENTATION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO TEST CHANGE BY THIS RECORD
NO CONFIGURATION CHANGE BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO MIGRATION BY THIS RECORD
NO RUNTIME VALIDATION BY THIS RECORD
NO TRIGGER MECHANISM SELECTED BY THIS RECORD
H-103 = NOT CREATED
```

---

## 12. Next governance gate

```text
NEXT GATE = SEPARATE EXECUTION OF THE NAMED F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER IMPLEMENTATION WITHIN THIS SCOPE, AFTER INSPECTING EXISTING ARCHITECTURE AND SELECTING THE MINIMUM FAIL-CLOSED DEV/TEST-ONLY MECHANISM, THEN PRODUCE IMPLEMENTATION EVIDENCE.
THIS RECORD DOES NOT PERFORM THAT IMPLEMENTATION.
THIS RECORD DOES NOT CREATE H-103.
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, H-81, SoR CUTOVER, MIGRATION, OR A GENERAL SHUTDOWN API.
WINDOWS process.kill(pid, 'SIGINT') MUST NOT BE TREATED AS JS-HANDLER PROOF.
```
