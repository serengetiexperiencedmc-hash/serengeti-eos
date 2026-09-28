# GPTA-H-94 — F2-DP-01 Bounded Dev/Test API Startup Branch Authorization

> **`OWNER / POA DECISION = APPROVED`**  
> **`NAMED BOUNDED STARTUP-BRANCH AUTHORIZATION`**  
> **`NOT A GENERAL STARTUP REDESIGN`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
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
**Auditable timestamp:** **2026-09-21T01:27:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-94 STATUS = F2-DP-01 BOUNDED DEV/TEST API STARTUP BRANCH AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
NAMED BRANCH = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT IMPLEMENT THE BRANCH
THIS RECORD DOES NOT EXECUTE RUNTIME STARTUP
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
THIS RECORD IS NOT A GENERAL STARTUP REDESIGN
NO MIGRATION EXECUTION IS AUTHORIZED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS AUTHORIZATION IS NOT H-81 EVIDENCE
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
NO GLOBAL migrate() CHANGE
NO MIGRATION EXECUTION
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

Authorization is granted, but execution is **NOT** performed by creation of this record.

H-36 F1-C-11 remains: authorization ≠ implementation evidence. H-80 through H-93 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize **one specifically named, bounded Dev/Test application-startup branch** so the already-implemented and already live-validated F2-DP-01 persistence/hydration boundary can be exercised through the **actual API process** against the existing 124-only Dev/Test PostgreSQL schema.

This is **not** a general startup redesign. It is **not** Production, UAT, H-81, F2-I12, SoR cutover, or EOS adoption.

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
| Decision scope | Implement the named opt-in fail-closed F2-DP-01 bounded Dev/Test API startup branch described in this record, and **only** that branch. |

---

## 3. Governing predecessor records

| Record | Role |
| --- | --- |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-85 / H-86 | F2-DP-01 persist implementation + evidence |
| H-87 / H-88 | Live Dev/Test PG; 124-only apply mechanism |
| H-89 / H-90 | Migration 124 applied structurally on isolated Dev/Test `eos`; audit **PASS** |
| H-91 / H-92 | Persist/retrieve validation; audit **PASS WITH FINDINGS**; `hydrateF2CommercialFacts` reconstructed six maps; full `main.ts` restart **not performed** |
| **H-93** | Startup/hydration **assessment** grant; Stage A executed; Stage B **STOPPED** on ambiguity |

H-93 SHA-256 at H-94 creation: `69027DB177B39AC00B458ECB88CD84A9947631C5AB10E5756A1B10741461F95B`.

---

## 4. H-93 Stage A finding (controlling)

Current `main.ts` **cannot** safely start against the 124-only Dev/Test schema because:

- `shouldApplyStartupMigrations` returns `apply: true` for non-production-like, non-`eos_gateb` URLs, including `127.0.0.1:5432/eos`;
- `migrate()` then enumerates `listMigrationFiles()` (`schema.sql` + 001–124+) and would fabricate `schema_migrations`;
- `syncStoreToPostgres()` and mixed hydrates always run when `EOS_DATABASE_URL` is set.

Existing `hydrateF2CommercialFacts` **can** operate against the six sidecar tables. No existing bounded **live-DB application** startup path exists. H-93 execution made **no** code or database changes. Porcelain remained **412**.

---

## 5. H-93 Stage B stop (controlling)

H-93 Stage B was **not** implemented. The candidate skip-branch was **ambiguous** under H-93 (possible “Dev/Test-only startup mode” versus forbidden broader startup redesign). H-94 **resolves that ambiguity** by naming and authorizing **only** the bounded branch below. It does **not** authorize any other startup redesign.

---

## 6. Named bounded startup branch

**Name:** `F2-DP-01-BOUNDED-DEVTEST-API-STARTUP`

**Location:** existing API startup path (`apps/api/src/main.ts` and the minimum supporting decision/gating already in the F2-DP-01 persist boundary). Do **not** create a second persistence implementation.

The branch must be:

- explicitly **opt-in**;
- **fail-closed**;
- Dev/Test-only;
- clearly named;
- isolated from the **default** application startup path.

### 6.1 Fail-closed target constraints

Enter bounded mode **only** when all of the following hold:

| Item | Required |
| --- | --- |
| Mode | explicitly selected / opt-in |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| Environment | non-production-like (`isProductionLikeEnv = false`) |

**Refuse** bounded mode for: Production; UAT; Gate B; `eos_gateb`; stand-in `eos_devtest_f2_dp01`; any non-local / unidentified / unauthorized target; any production-like environment.

If identity cannot be established: **do not enter** bounded mode.

### 6.2 Authorized actions in bounded mode

1. Create/attach the **existing** PostgreSQL pool to the identified target.
2. Call existing `hydrateF2CommercialFacts()` against the six already-authorized sidecar tables.
3. Continue only through the **minimum existing** application initialization necessary to establish that the API process can start with the bounded F2 store.

### 6.3 Prohibited calls in bounded mode

Do **not**:

- call `migrate()`;
- call `listMigrationFiles()`;
- execute `schema.sql`;
- execute migrations `001`–`123`;
- execute migration `124`;
- execute migrations `125+`;
- create or modify `schema_migrations`;
- call `syncStoreToPostgres()`;
- execute mixed persistence initialization;
- execute mixed hydrates.

### 6.4 Unchanged default / global semantics

- Default startup path remains **unchanged**.
- Global `migrate()` implementation remains **unchanged**.
- `listMigrationFiles()` remains **unchanged**.
- Migration 124 remains **unchanged**.
- F2-DP-01 six-table schema remains **unchanged**.
- No second persistence architecture.

---

## 7. Migration prohibition

```text
NO MIGRATION EXECUTION IS AUTHORIZED BY H-94
MIGRATION 124 REMAINS UNCHANGED
schema_migrations MUST NOT BE CREATED OR MODIFIED
GLOBAL migrate() MUST NOT BE MODIFIED
listMigrationFiles() MUST NOT BE MODIFIED
```

The six sidecar tables already exist because H-89 applied 124. They are the database substrate. This grant does **not** re-apply 124.

---

## 8. F2-DP-01 data scope

Only: `opportunities`, `rfps`, `pathB`, `accounts`, `rates`, `programmes`. I11 identifier-trace only.

Do **not** add: booking facts; KPI history; revenue; profit; FX; ingestion; UI; new qualification rules; new market taxonomy; new commercial thresholds; SoR cutover.

---

## 9. Runtime validation boundary

H-94 authorizes **implementation** of the named branch. It does **not** automatically authorize unrestricted runtime validation.

If later runtime validation is required, it must remain strictly within:

- `127.0.0.1:5432` / database `eos`;
- `compose-postgres-1`;
- PostgreSQL 16.x;
- non-production-like Dev/Test.

No migration may be executed during that validation. Stand-in persistence is **not** evidence of the live DB boundary.

---

## 10. Implementation STOP (do not expand)

If later implementation reveals the minimum bounded branch cannot be achieved without:

- changing global startup architecture;
- changing migration semantics;
- changing migration 124;
- modifying schema history;
- modifying unrelated persistence;
- adding broader infrastructure;
- touching Production / UAT / Gate B;

then **STOP** and report the boundary conflict. Do **not** expand scope. Do **not** treat this record as permission to redesign startup.

---

## 11. Explicit exclusions

Production; UAT; Gate B; stand-in as evidence; any migration execution; schema/history fabrication; modification of `schema_migrations`; modification of migration 124; modification of global `migrate()`; modification of migration discovery; **broad startup redesign**; **global startup behavior changes**; ingest; UI; booking; KPI history; revenue/profit; FX; new commercial rules; F2-I12; I1–I11 thaw; Path D; EOS adoption; SoR cutover; H-81; commit; push.

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
TECHNICAL STARTUP SUCCESS ≠ EOS ADOPTION
TECHNICAL STARTUP SUCCESS ≠ SoR CUTOVER
H-94 IMPLEMENTATION ≠ H-81 EVIDENCE
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 12. H-80 / H-81 boundary

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS AUTHORIZATION IS NOT H-81 EVIDENCE
LATER IMPLEMENTATION OF THIS BRANCH IS NOT H-81 COMPLETION
NO H-81 TRIGGER IS MANUFACTURED
```

---

## 13. F2-I12 / Production / UAT

```text
F2-I12 = NOT AUTHORIZED
F2-I1–I11 = FROZEN
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
```

---

## 14. Repository safety

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **412** |
| Application / schema / migration / H-80–H-93 change | **NONE** |
| Commit | **NONE** |
| Push | **NONE** |

---

## 15. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
IMPLEMENTATION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
NO POSTGRESQL ACTION BY THIS RECORD
NO STARTUP RUNTIME TEST BY THIS RECORD
NO MIGRATION BY THIS RECORD
```

---

## 16. Next governance gate

```text
NEXT GATE = IMPLEMENT THE NAMED F2-DP-01-BOUNDED-DEVTEST-API-STARTUP BRANCH EXACTLY AS AUTHORIZED HERE, THEN PRODUCE IMPLEMENTATION EVIDENCE.
THIS RECORD DOES NOT PERFORM THAT IMPLEMENTATION.
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, H-81, SoR CUTOVER, OR A GENERAL STARTUP REDESIGN.
```
