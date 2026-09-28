# GPTA-H-89 — F2-DP-01 Migration 124-Only Dev/Test Execution Authorization

> **`EXECUTION AUTHORIZATION`**  
> **`NOT AN IMPLEMENTATION GRANT`**  
> **`NOT A CATALOGUE migrate() GRANT`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
> **`NOT FULL LIVE PERSIST/RETRIEVE VALIDATION`**  
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
**Auditable timestamp:** **2026-09-21T00:56:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-89 STATUS = F2-DP-01 MIGRATION 124-ONLY DEV/TEST EXECUTION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
THIS RECORD DOES NOT APPLY MIGRATION 124
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
MIGRATION 124 APPLICATION EXECUTION = NOT STARTED BY THIS RECORD
LIVE F2-DP-01 PERSIST/RETRIEVE VALIDATION = NOT AUTHORIZED BY THIS RECORD
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb MIGRATION
NO GLOBAL migrate()
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record is a **separate execution authorization** for applying **only** `packages/db/migrations/124_f2_dp01_commercial_facts.sql` via the already-implemented and audited GPTA-H-88 124-only mechanism, against **only** the verified isolated Dev/Test PostgreSQL target.

H-36 F1-C-11 remains: authorization ≠ implementation evidence. This record does **not** apply 124. It does **not** perform live persist/retrieve validation.

H-80 through H-88 and H-29 are **not overwritten**.

---

## A. Controlling governance chain

| Record | Role |
| --- | --- |
| H-29 | Controlling C-spine and commercial-rule baseline |
| H-44 / H-46–H-56 | F2 C1–C10 Dev/Test; frozen I1–I11 |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-82 / H-83 / H-84 | Owner/POA decisions and G-11-C waiver |
| H-85 | F2-DP-01 persist **implementation** authorization |
| H-86 | F2-DP-01 artifacts and technical tests; live PG **not claimed** |
| H-87 | Live Dev/Test PG validation grant; **execution STOPPED** (120-file `migrate()`) |
| H-88 | 124-only mechanism **implementation** authorization; **not** 124 application |
| H-88 implementation | Mechanism and safety tests completed |
| H-88 audit | Classification **PASS** |
| **H-89 (this record)** | **Execution** authorization for 124-only apply on the recorded Dev/Test target |

**Depends on:** H-87 STOP; H-88 implementation; H-88 audit **PASS**.  
**Does not supersede:** H-80.  
**Does not start:** H-81.  
**Does not authorize:** Production; F2-I12; global `migrate()`; unrelated migrations.

Authority: **Patrick Makundi** (company POA; instrument number not recorded / not invented). Technical Increment Owner / UAT Authority remain Patrick Makundi; UAT is **not** granted here.

---

## B. H-87 STOP and resolution

H-87 authorized live Dev/Test application of 124 **if** `migrate()` would apply 124 alone. Execution **stopped correctly**: the isolated Dev/Test database `eos` had an empty public schema and no `schema_migrations`, so `migrate()` would have applied **120** files.

Resolution path: H-88 implemented a bounded 124-only mechanism; H-88 audit **PASS**. Global `migrate()` remains **unauthorized**.

---

## C. H-88 implementation

Audited files (unchanged by this record):

- `packages/db/src/f2-dp01-apply-124.ts`
- `packages/db/src/f2-dp01-apply-124.test.ts`
- `packages/db/src/f2-dp01-apply-124-cli.ts`
- `packages/db/src/f2-dp01-apply-124.md`
- `packages/db/package.json` script `apply-f2-dp01-124` (inspect-only CLI)

Authorized execution mechanism: `applyF2Dp01Migration124` with `execute: true` and an **injected** connectable to the verified target. The library does not autonomously `createPool`. Global `migrate()` / `listMigrationFiles()` / `npm run migrate` remain **not** the authorized path.

The H-88 CLI currently **refuses** `--execute`. That refuse is consistent with H-88 (implementation ≠ execution). This H-89 grant authorizes the **audited library apply path**, not a generic runner and not `migrate()`. Later execution must not invent a second runner.

---

## D. H-88 audit PASS

H-88 technical/governance audit classification: **PASS**.

Recorded: allowlist is substantive; CLI/npm inspect cannot apply 124; `--execute` is refused at CLI; no `schema_migrations` fabrication; `migrate()` unchanged; migration 124 SHA-256 matched.

This H-89 record **does not** re-open that implementation for edit.

---

## E. Exact execution authorization

Authorize **later** execution of **only**:

1. Connect to the verified isolated Dev/Test PostgreSQL target in §F.
2. Perform pre-execution safety checks in §I immediately before apply.
3. Apply **exactly** migration 124 using the audited H-88 124-only mechanism (`applyF2Dp01Migration124`, `execute: true`, injected client).
4. Verify the resulting F2-DP-01 sidecar tables **exist** (catalog verification of the six tables created by 124).
5. Record execution evidence (success/failure, redacted target, objects present/absent).

**Not authorized by H-89:** full live F2-DP-01 persist/retrieve validation of opportunity/RFP/Path B/account/rate/programme facts. That remains a **separate later decision** after 124-apply evidence.

This documentation action does **not** perform steps 1–5.

---

## F. Exact Dev/Test target

| Item | Required identity |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| Environment | non-production-like (`isProductionLikeEnv` / H-88 equivalent = **false**) |
| Compose service | `compose-postgres-1` |
| Compose source | `infra/compose/dev.yaml` |

**Forbidden:** Production; UAT; `eos_gateb`; Gate B PostgreSQL; `127.0.0.1:5434`; database `eos_gateb`; in-process stand-in `eos_devtest_f2_dp01`; any other host/port/database.

Positive verification is required **immediately before** execution. If identity cannot be established: **STOP**. Do not guess. Do not substitute another Dev/Test database.

Credentials / credential-bearing URLs must not be printed.

---

## G. Exact migration filename

`packages/db/migrations/124_f2_dp01_commercial_facts.sql`

Basename: `124_f2_dp01_commercial_facts.sql`

**Prohibited:** `schema.sql`; migrations `001`–`123`; migrations `125+`; any other file; generic `migrate()`; `listMigrationFiles()` selection; wildcard; “latest”; fabricated `schema_migrations` history; marking `001`–`123` as applied.

If the mechanism would execute anything other than 124: **STOP**.

---

## H. Exact migration SHA-256

```text
68D6FB4441F4383284AF1B4892E78F939947C8DF02E53705073E0FD2E4F08EE6
```

Before execution, the file hash **must** match. If it does not: **STOP**. Do not edit, regenerate, or substitute the file.

---

## I. Pre-execution safety requirements

Immediately before apply, all of the following must hold (fail closed):

- Positive database identity = §F
- Non-production-like environment
- Database ≠ `eos_gateb`
- Target ≠ Gate B / `127.0.0.1:5434`
- Target ≠ stand-in `eos_devtest_f2_dp01`
- Approved host / port / database
- Migration 124 SHA-256 matches §H
- Invoked mechanism is the audited H-88 124-only path
- No global `migrate()` invocation
- No pending unrelated migration application via this run

---

## J. Transaction boundary

Authorized sequence (already audited):

```text
BEGIN
migration 124 SQL
COMMIT
```

On failure: **ROLLBACK**. No second migration. No `schema.sql`. No unrelated schema. No manual `schema_migrations` population. Do not mark `001`–`123` as applied. No destructive `DROP DATABASE` / volume wipe / git reset.

---

## K. Post-apply catalog verification (not persist/retrieve)

After successful apply, verify **existence** of the six sidecar tables created by 124:

`f2_opportunity_facts`, `f2_rfp_facts`, `f2_path_b`, `f2_account_facts`, `f2_rate_identities`, `f2_programme_facts`

That catalog check is **not** live persist/retrieve of commercial facts.

Full live validation of the six F2-DP-01 maps (`opportunities`, `rfps`, `pathB`, `accounts`, `rates`, `programmes`) and I11 identifier-trace **is not authorized by H-89**. Booking facts and KPI history remain excluded.

---

## L. Explicit exclusions

Production; UAT; `eos_gateb`; Gate B; F2-I12; H-81; Path D; EOS operational adoption; commercial SoR cutover; UI; ingest; booking facts; KPI history; revenue; profit; FX; new commercial rules; new numerical thresholds; qualification-rule changes; market-taxonomy changes; SOURCE/CHANNEL semantic changes; I1–I11 thaw; Class A/B bundling; unrelated schema; unrelated migrations; global `migrate()`; migrations `001`–`123`; `schema.sql`; migration `125+`; fabricated `schema_migrations` history; full live persist/retrieve validation; commit; push.

Legacy **250k / 20%** remains **legacy** and is not an F2 rule.

```text
DURABILITY DOES NOT EQUAL AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
APPLYING 124 ≠ H-81 EVIDENCE
APPLYING 124 ≠ OPERATIONAL SoR CUTOVER
```

---

## M. H-80 / H-81 status

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
APPLYING MIGRATION 124 DOES NOT ITSELF CONSTITUTE H-81 EVIDENCE
DATABASE CATALOG VERIFICATION DOES NOT AUTOMATICALLY START H-81
NO H-81 EVIDENCE MAY BE MANUFACTURED FROM THIS AUTHORIZATION OR ITS LATER EXECUTION
```

---

## N. F2-I12 status

```text
F2-I12 = NOT AUTHORIZED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-DP-01 = NOT COMPLETE
```

---

## O. Production / UAT status

```text
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
TARGET = DEV/TEST ONLY
```

---

## P. Current commercial System of Record

```text
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED / NOT PERFORMED
```

Applying 124 on Dev/Test does **not** change the operational SoR.

---

## Q. Repository integrity

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved |
| Porcelain before this file | **407** |
| Application / schema / migration / mechanism / UI change | **NONE** |
| H-80–H-88 / H-29 modified | **NO** |
| Commit | **NONE** |
| Push | **NONE** |

---

## R. Next gate

```text
NEXT GATE = EXECUTE THE AUTHORIZED 124-ONLY DEV/TEST MIGRATION, THEN RETURN WITH EXECUTION EVIDENCE FOR AUDIT AND A SEPARATE DECISION ON LIVE F2-DP-01 PERSISTENCE/RETRIEVAL VALIDATION.
```

This record does **not** perform that execution.  
This record does **not** authorize UAT, UI, Production, H-81, SoR cutover, or excluded scope.

---

## Status block

```text
GPTA-H-89 = F2-DP-01 MIGRATION 124-ONLY DEV/TEST EXECUTION AUTHORIZED
EXECUTION = NOT STARTED BY THIS RECORD
MIGRATION 124 = NOT APPLIED BY THIS RECORD
LIVE PERSIST/RETRIEVE = NOT AUTHORIZED BY THIS RECORD
H-87 STOP = PRESERVED
H-88 IMPLEMENTATION = COMPLETE
H-88 AUDIT = PASS
GLOBAL migrate() = UNAUTHORIZED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS RECORD IS NOT H-81 EVIDENCE
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```
