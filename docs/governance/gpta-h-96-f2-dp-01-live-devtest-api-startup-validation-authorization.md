# GPTA-H-96 — F2-DP-01 Live Dev/Test Bounded API Startup Validation Authorization

> **`VALIDATION AUTHORIZATION`**  
> **`OWNER / POA DECISION = APPROVED`**  
> **`NOT A CODE-CHANGE GRANT`**  
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
**Auditable timestamp:** **2026-09-21T01:38:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-96 STATUS = LIVE DEV/TEST BOUNDED API STARTUP VALIDATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
NAMED BRANCH = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT EXECUTE VALIDATION
THIS RECORD DOES NOT MODIFY APPLICATION CODE
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
NO MIGRATION EXECUTION IS AUTHORIZED
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

H-36 F1-C-11 remains: authorization ≠ execution evidence. H-80 through H-95 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize one narrowly bounded **live Dev/Test validation** of the **already-implemented** F2-DP-01 bounded API startup branch, so the **actual API process** can be shown to attach to isolated Dev/Test PostgreSQL, hydrate the six F2-DP-01 maps, and reach minimum listen without global migration or mixed initialization.

This is **validation authorization only**. It is **not** a code-change grant, schema grant, migration grant, Production/UAT grant, H-81, F2-I12, SoR cutover, or EOS adoption.

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
| Decision scope | Bounded live Dev/Test validation of `F2-DP-01-BOUNDED-DEVTEST-API-STARTUP` against `127.0.0.1:5432/eos` only. **No code change. No migration.** |

---

## 3. Prior evidence

| Record | Role |
| --- | --- |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-89 / H-90 | Migration 124 applied structurally on isolated Dev/Test `eos`; audit **PASS**; six sidecar tables exist |
| H-91 / H-92 | Persist/retrieve validation; audit **PASS WITH FINDINGS**; `hydrateF2CommercialFacts` reconstructed six maps; full default `main.ts` restart **not performed** |
| **H-93 Stage A** | Default `main.ts` **cannot** safely start against 124-only `eos` (`migrate()` + mixed init). F2 hydration **can** operate against the six tables. No bounded live-DB application startup path existed then. |
| H-93 Stage B | **STOPPED** on skip-branch ambiguity; **no** implementation under H-93 |
| **H-94** | Authorized the named bounded startup branch |
| **H-95** | Implementation evidence: branch present; opt-in `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` or `1`; fail-closed; focused tests **14 passed**; live API-process PostgreSQL startup **not performed** |

H-95 SHA-256 at H-96 creation: `DDFBA7BBDE46B892D82E768D9BC7225F2891299DCAF71B5068D28039EF65BED9`.  
H-94 SHA-256 (unchanged): `3CB923549F22E5CE4A4508B760A882011A6F09379B6215A34C722F411D7AC898`.

H-95 next gate is this validation grant. No material conflict with the predecessor chain.

---

## 4. Exact validation scope

Later execution may start the **actual API process** with:

- `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` or authorized equivalent `1`
- `EOS_DATABASE_URL` pointing at the authorized TCP target
- existing Dev/Test credentials via the normal environment mechanism (**not** printed in logs or evidence)

The validation may establish that the process:

1. connects to the authorized Dev/Test PostgreSQL instance over **TCP**;
2. enters the explicit bounded startup mode;
3. avoids all global migration and mixed initialization paths;
4. executes existing `hydrateF2CommercialFacts()` against the already-existing six-table 124-only schema;
5. completes the minimum existing application startup necessary for the API process to become operational (listen).

Observation must use already-present logs/instrumentation or minimally non-mutating observation. **Do not add instrumentation code** under this grant. If existing observation is insufficient: **STOP** and report the limitation.

### 4.1 Authorized database target (exact)

| Item | Required |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| PostgreSQL | 16.x |
| Compose service | `compose-postgres-1` |
| Class | non-production-like Dev/Test |

**Do not substitute:** Unix socket as controlling identity; another host/port/database; Gate B; `eos_gateb`; UAT; Production; production-like env; in-process memory persistence; stand-in `eos_devtest_f2_dp01` as live PostgreSQL evidence.

Positive TCP identity (`current_database()=eos`, `inet_server_port()=5432`) is required before treating the run as in-scope. If identity cannot be established: **STOP**.

### 4.2 Schema / migration prohibition

The target is the H-89 124-only Dev/Test database. Later execution **must not** apply or invoke any migration.

Do **not**: run `migrate()`; run `listMigrationFiles()`; apply `schema.sql`; apply 001–123, 124, or 125+; create or modify `schema_migrations`; modify any migration; modify the six sidecar tables.

### 4.3 Data scope

Only `opportunities`, `rfps`, `pathB`, `accounts`, `rates`, `programmes`. I11 identifier-trace only. Prefer existing H-91 synthetic rows. Do not invent genuine commercial facts. Do not perform broad cleanup or deletion.

---

## 5. Explicit non-actions

H-96 does **not** authorize: source-code modification; package modification; migration modification; schema modification; configuration committed to the repository; new startup features; refactoring; `syncStoreToPostgres()`; mixed hydrates; ingest; UI.

If runtime validation exposes a code defect: **document it and STOP**. A later authorization may address it. Do not modify code under H-96.

---

## 6. Success criteria

A later PASS requires evidence that:

1. The real API process started using the bounded mode.
2. PostgreSQL TCP target was exactly `127.0.0.1:5432/eos`.
3. No migration executed.
4. No `schema_migrations` write occurred.
5. No global migration discovery occurred.
6. No `syncStoreToPostgres()` occurred.
7. No mixed hydrate occurred.
8. `hydrateF2CommercialFacts()` executed.
9. The six F2-DP-01 maps were successfully hydrated/reconstructed.
10. The application reached its minimum successful startup/listening condition.
11. Default startup code was not altered during validation.
12. No unauthorized governance scope was touched.

---

## 7. Failure / STOP conditions

**STOP** rather than expand scope if:

- unexpected migration is attempted (do not allow it to proceed if safely preventable; report the path);
- unauthorized target is detected;
- an unrelated existing startup component requires broader schema objects to reach listen (report the exact dependency; do not modify unrelated startup under H-96);
- source-code change would be required;
- existing observation is insufficient without new instrumentation;
- bounded startup itself fails (diagnose within the existing implementation only).

Do not silently bypass governance.

---

## 8. Governance status

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS VALIDATION IS NOT H-81 EVIDENCE
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
DURABILITY ≠ AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
TECHNICAL STARTUP SUCCESS ≠ EOS ADOPTION
TECHNICAL STARTUP SUCCESS ≠ SoR CUTOVER
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 9. Repository safety

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **415** |
| Application / schema / migration / H-80–H-95 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

---

## 10. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
VALIDATION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO API PROCESS STARTED BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO MIGRATION BY THIS RECORD
```

---

## 11. Next governance gate

```text
NEXT GATE = EXECUTE THE AUTHORIZED LIVE DEV/TEST BOUNDED API-PROCESS STARTUP VALIDATION AGAINST 127.0.0.1:5432/eos, THEN PRODUCE EXECUTION EVIDENCE AND AUDIT IT.
THIS RECORD DOES NOT PERFORM THAT EXECUTION.
THIS RECORD DOES NOT AUTHORIZE CODE CHANGES, MIGRATION, UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER.
```
