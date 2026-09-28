# GPTA-H-93 — F2-DP-01 Dev/Test Startup/Hydration Boundary Authorization

> **`OWNER / POA DECISION = APPROVED`**  
> **`BOUNDED ASSESSMENT AUTHORIZATION`**  
> **`STAGE B IMPLEMENTATION IS CONDITIONAL ONLY`**  
> **`NOT A BLANKET STARTUP REDESIGN`**  
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
**Auditable timestamp:** **2026-09-21T01:20:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-93 STATUS = F2-DP-01 DEV/TEST STARTUP/HYDRATION BOUNDARY ASSESSMENT AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
STAGE A = AUTHORIZED (ASSESSMENT; SOURCE READ-ONLY)
STAGE B = CONDITIONAL ONLY IF STAGE A PROVES REMEDIATION NECESSARY
THIS RECORD DOES NOT EXECUTE ASSESSMENT
THIS RECORD DOES NOT MODIFY APPLICATION CODE
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
THIS RECORD IS NOT "CHANGE STARTUP NOW"
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS AUTHORIZATION IS NOT H-81 EVIDENCE
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
NO GLOBAL migrate()
NO MIGRATION EXECUTION
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

Authorization is granted, but execution is **NOT** performed by creation of this record.

H-36 F1-C-11 remains: authorization ≠ execution evidence. H-80 through H-92 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize a narrowly bounded **Dev/Test technical assessment** of the remaining F2-DP-01 **startup/hydration** boundary after H-91 persist/retrieve succeeded and H-92 audited that execution as **PASS WITH FINDINGS**.

The remaining question is:

> Can the existing application be safely started in isolated Dev/Test with F2-DP-01 enabled, using the already-applied six-table schema, without invoking unauthorized global migration behavior or unrelated persistence?

This is **not** Production authorization, UAT, H-81, F2-I12, SoR cutover, or EOS adoption.

---

## 2. Owner / POA

| Field | Record |
| --- | --- |
| Owner / POA | **Patrick Makundi** |
| Authority basis | Company Owner has granted Patrick Makundi power of attorney to act on behalf of the company for commercial business-rule and governance decisions within this process. |
| Instrument number | **Not recorded in this repository; none is invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41 / H-85) |
| UAT Authority | **Patrick Makundi** (H-41 / H-85) — UAT **not** granted by this record |
| Combined role | **YES** — functions remain distinct |
| **Decision** | **APPROVED** |
| Decision scope | Authorize a narrowly bounded Dev/Test technical assessment of the existing F2-DP-01 startup/hydration boundary, including implementation remediation **ONLY if** the assessment demonstrates that remediation is necessary and can be performed without crossing the boundaries in this record. **Not** arbitrary startup redesign. |

---

## 3. Governing predecessor records

| Record | Role |
| --- | --- |
| H-29 | Controlling C-spine / commercial-rule baseline |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-85 | F2-DP-01 persist implementation authorization |
| H-86 | Implementation artifacts / technical tests |
| H-87 | Live Dev/Test PG grant; `migrate()` STOP |
| H-88 | 124-only apply mechanism; implementation + audit **PASS** |
| H-89 / H-90 | Migration 124 applied structurally on isolated Dev/Test `eos`; six sidecar tables exist |
| H-91 | Persist/retrieve validation **APPROVED** and **executed** |
| **H-92** | H-91 execution evidence; audit **PASS WITH FINDINGS**; persist/read/hydration function demonstrated; full process restart **not performed** |

H-92 SHA-256 at H-93 creation: `F48A8D796B0FD4D54CE62F0C704F03495FB457E782AB1D3A527CB018550DCDB1`.

H-92 finding 2 is the rationale for this gate: full `main.ts` process restart was not performed because that startup path would invoke mixed `migrate()` / `syncStoreToPostgres` against the 124-only schema.

---

## 4. Current governance state

```text
H-80 = ACTIVE
H-81 = NOT STARTED
H-92 = PASS WITH FINDINGS
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
MIGRATION 124 = APPLIED ON ISOLATED DEV/TEST eos (STRUCTURAL)
LIVE PERSIST/RETRIEVE = VALIDATED IN DEV/TEST (H-91/H-92; PASS WITH FINDINGS)
FULL APPLICATION STARTUP/HYDRATION BOUNDARY = NOT YET ASSESSED UNDER THIS GRANT
```

---

## 5. Rationale

H-91 / H-92 established that, in isolated Dev/Test:

- all six F2-DP-01 fact maps can persist;
- all six can be read through the application repository path;
- field-level round-trip integrity succeeds;
- existing `hydrateF2CommercialFacts` reconstructs all six maps;
- the six sidecar tables remain isolated.

**Full application process restart/startup validation was not performed.**

H-93 exists to authorize answering whether a safe bounded F2-DP-01 Dev/Test startup path can operate against the already-applied six-table schema without unauthorized global migration or unrelated persistence.

---

## 6. Stage A — Assessment authorization

Later execution of Stage A **may inspect** the existing startup path and determine:

1. exactly where `migrate()` is invoked;
2. exactly where `syncStoreToPostgres` or equivalent mixed persistence is invoked;
3. exactly where `hydrateF2CommercialFacts` is invoked;
4. whether F2-DP-01 startup can currently operate against the 124-only Dev/Test schema;
5. whether a safe bounded F2-DP-01 startup path already exists;
6. whether a narrowly scoped implementation change is required.

**Stage A must be read-only with respect to application source.** Do not change code during Stage A.

This H-93 record **does not execute Stage A**.

---

## 7. Stage B — Conditional remediation authorization

Stage B exists **only if** Stage A proves remediation is technically necessary.

If so, a **narrowly bounded** implementation may be created to allow F2-DP-01 Dev/Test startup/hydration to operate against the already-existing six-table sidecar schema.

If Stage A determines **no** implementation is necessary: **do not modify code**.

H-93 must **not** be interpreted as “change startup now.” Required sequence for later execution:

1. inspect;
2. determine necessity;
3. if no change needed, do not change code;
4. if change is necessary, make only the minimum bounded change described here;
5. test it;
6. stop.

---

## 8. Precise database boundary

Only:

| Item | Required |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| Compose service | `compose-postgres-1` |
| Class | isolated Dev/Test; non-production-like |

Before any later runtime test: `current_database()=eos`, `inet_server_port()=5432`, `isProductionLikeEnv=false`.

**Prohibited:** Production; UAT; Gate B; `127.0.0.1:5434`; `eos_gateb`; `eos_devtest_f2_dp01`; any remote/unidentified database.

If identity cannot be established: **STOP**.

---

## 9. Precise F2-DP-01 scope

Only: `opportunities`, `rfps`, `pathB`, `accounts`, `rates`, `programmes`. I11 identifier-trace only. No new catalogue. No I1–I11 thaw. No F2-I12.

---

## 10. Migration prohibition

H-93 does **not** authorize any migration. The six sidecar tables already exist because H-89 applied 124.

Do **not**: run `migrate()`; run `listMigrationFiles()`; run `migrate-cli.ts`; run `npm run migrate`; apply 124 again; apply 001–123 or 125+; apply `schema.sql`; create/fabricate `schema_migrations`; modify migration 124.

If Stage B occurs: preserve the existing global migration path **unchanged**. Do **not** modify `migrate()` or `listMigrationFiles()`.

---

## 11. Startup / hydration boundary

Later assessment must determine whether startup can perform:

1. environment identification;
2. safe Dev/Test database connection;
3. F2-DP-01 hydration;
4. reconstruction of the six authorized fact maps;

**WITHOUT:** global migration; mixed legacy migration; schema creation; unrelated synchronization; booking persistence; KPI persistence; revenue/profit persistence; ingestion.

If existing `main.ts` cannot safely do this, the later execution must document the exact call chain and why. Do not silently bypass governance.

---

## 12. Conditional implementation constraints

If Stage B is necessary, the implementation must be the **smallest coherent change** that establishes a clearly bounded F2-DP-01 Dev/Test startup path.

It must:

- be limited to Dev/Test F2-DP-01 behavior;
- preserve the existing global migration path unchanged;
- **not** modify `migrate()` / `listMigrationFiles()` / migration 124 / `schema_migrations`;
- **not** apply any migration;
- **not** invoke Gate B or the in-process stand-in;
- **not** introduce a Production or UAT path;
- **not** introduce new commercial rules;
- **not** change Production behavior;
- **not** create a second competing persistence architecture;
- **not** implement a design merely because it seems convenient.

Examples (not mandates): a Dev/Test-only startup mode; explicit F2-DP-01 persist/hydrate initialization; an explicit guard preventing global migration in that mode; existing environment gating. Inspect the actual architecture first.

---

## 13. Testing constraints

If Stage B implementation occurs, tests may be added/updated **only** to prove:

- Dev/Test target gating;
- no global migration invocation in the bounded F2-DP-01 startup mode;
- hydration from the six existing sidecar tables;
- reconstruction of the six authorized maps;
- prohibited targets are rejected;
- Production-like environments do not enter the bounded mode.

Tests must **not** modify Production; apply migrations; fabricate schema history; test unrelated commercial functionality; or create booking / KPI / revenue / profit / FX rules.

---

## 14. Synthetic-data boundary

Existing H91 synthetic records remain in Dev/Test. **Do not delete them.**

Do not create additional synthetic commercial records unless technically necessary to validate a specific startup/hydration assertion. If existing H91 records are sufficient, reuse them.

Do not introduce genuine commercial data. Do not invent RFP receipt facts, first-response facts, qualification facts, market taxonomy, SOURCE, CHANNEL, revenue, profit, KPI history, or FX.

---

## 15. Explicit exclusions

Production; UAT; Gate B; `eos_gateb`; in-process stand-in; migration activity; schema changes; migration-history fabrication; mailbox / Excel / WhatsApp / phone ingestion; operational SoR cutover; UI; booking; KPI history; revenue; profit; FX; new commercial rules or thresholds; qualification redesign; market taxonomy redesign; F2-I12; I1–I11 thaw; Path D; EOS adoption; Production readiness; commercial-process adoption; unrelated refactoring; **broad startup redesign**.

Legacy **250k / 20%** remains **legacy**.

```text
DURABILITY ≠ AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
TECHNICAL PERSISTENCE ≠ COMMERCIAL PROCESS ADOPTION
DEV/TEST ≠ PRODUCTION
HYDRATION ≠ H-81
TECHNICAL STARTUP SUCCESS ≠ EOS COMPLETION
SYNTHETIC DATA ≠ GENUINE COMMERCIAL FACTS
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 16. H-80 / H-81 boundary

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS ASSESSMENT IS NOT H-81 EVIDENCE
ANY RESULTING TECHNICAL IMPLEMENTATION IS NOT H-81 COMPLETION
STARTUP/HYDRATION SUCCESS IS NOT EOS ADOPTION
STARTUP/HYDRATION SUCCESS IS NOT SoR CUTOVER
NO H-81 TRIGGER IS MANUFACTURED
```

---

## 17. F2-I12 boundary

```text
F2-I12 = NOT AUTHORIZED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-I1–I11 = FROZEN
```

---

## 18. Production / UAT boundary

```text
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
TARGET = ISOLATED DEV/TEST ONLY
```

---

## 19. Repository safety

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **411** |
| Application / schema / migration / H-80–H-92 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

---

## 20. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
EXECUTION IS NOT PERFORMED BY CREATION OF THIS RECORD
STAGE A ASSESSMENT = NOT STARTED BY THIS RECORD
STAGE B REMEDIATION = NOT STARTED BY THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO STARTUP RUNTIME TEST BY THIS RECORD
```

---

## 21. Next governance gate

```text
NEXT GATE = EXECUTE THE H-93 STAGE A ASSESSMENT (SOURCE READ-ONLY), THEN APPLY STAGE B ONLY IF THAT ASSESSMENT PROVES REMEDIATION NECESSARY.
THIS RECORD DOES NOT PERFORM THAT EXECUTION.
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER.
```
