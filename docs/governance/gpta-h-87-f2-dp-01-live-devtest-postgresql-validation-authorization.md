# GPTA-H-87 — F2-DP-01 Live Dev/Test PostgreSQL Validation Authorization

> **`LIVE DEV/TEST POSTGRESQL VALIDATION AUTHORIZATION`**  
> **`NOT A NEW FEATURE AUTHORIZATION`**  
> **`NOT A NEW IMPLEMENTATION GRANT`**  
> **`AUTHORIZATION ≠ EXECUTION`**  
> **`NOT UAT`**  
> **`NOT UI AUTHORIZATION`**  
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
**Auditable timestamp:** **2026-09-21T00:32:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-87 STATUS = F2-DP-01 LIVE DEV/TEST POSTGRESQL APPLICATION AND VALIDATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
THIS RECORD DOES NOT EXECUTE MIGRATION 124
THIS RECORD DOES NOT CONNECT TO POSTGRESQL
LIVE DEV/TEST POSTGRESQL APPLICATION/VALIDATION EXECUTION = NOT STARTED BY THIS RECORD
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

Authorization to validate live Dev/Test PostgreSQL does not authorize Production, UAT, UI, H-81, Path D, operational SoR cutover, or any expansion of F2-DP-01.

H-36 F1-C-11 remains: specification / authorization ≠ implementation evidence. This record **authorizes** a later bounded validation execution. It does **not** record that execution. It does **not** claim live PostgreSQL persistence is proven.

H-80, H-81, H-82, H-83, H-84, H-85, H-86, and H-29 are **not overwritten**. Frozen F2-I1–I11 catalogues are **not** thawed. F2-DP-01 source/schema/migration artifacts are **not** modified by this record.

---

## 1. Purpose

Permit **only** live Dev/Test PostgreSQL application and technical validation of the **already-implemented** F2-DP-01 persistence increment (GPTA-H-85 / GPTA-H-86).

This is **not** a new feature authorization.  
This is **not** a new implementation grant.  
This is **not** Production authorization.

---

## 2. Authority basis

| Field | Record |
| --- | --- |
| Owner / POA | **Patrick Makundi** |
| Authority basis | Company Owner has granted Patrick Makundi power of attorney to act on behalf of the company for commercial business-rule and governance decisions within this process. |
| Instrument number | **Not recorded in this repository; none is invented** |
| Wet-ink / board resolution | **Not invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41 / H-85) |
| UAT Authority | **Patrick Makundi** (H-41 / H-85) — UAT **not** granted by this record; functions remain distinct |
| Combined role | **YES** — functions remain distinct |

---

## 3. Document control

| Field | Record |
| --- | --- |
| Document | GPTA-H-87 — F2-DP-01 Live Dev/Test PostgreSQL Validation Authorization |
| Path | `docs/governance/gpta-h-87-f2-dp-01-live-devtest-postgresql-validation-authorization.md` |
| Identifier | **GPTA-H-87** |
| Increment identifier | **F2-DP-01** (unchanged; not a new increment) |
| Type | Bounded live Dev/Test PostgreSQL validation authorization — not an execution result |
| Date | 2026-09-21 |
| Sequence | H-85 persist **grant** → F2-DP-01 **execution** → H-86 **implementation evidence** → **H-87 live Dev/Test PG validation grant (this record)** → later execution → later evidence |
| Does this record overwrite H-80 / H-81 / H-82 / H-83 / H-84 / H-85 / H-86 / H-29? | **NO** |
| Does this record execute migration 124? | **NO** |
| Does this record complete H-81? | **NO** |
| Does this record authorize Production? | **NO** |
| Does this record authorize F2-I12? | **NO** |
| Does this record authorize UAT or UI? | **NO** |

---

## 4. Governing records

| Record | Role |
| --- | --- |
| H-29 | Controlling C-spine and commercial-rule baseline |
| H-44 | Prior F2 C1–C10 Dev/Test authorization; I1–I11 freeze remains |
| H-46–H-56 | Frozen I1 catalogues and I2–I11 preview sidecar maps |
| H-64 | Persist ≠ operational adoption |
| H-75 | Commercial process adoption YES; software adoption NO |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** — evidence trigger not satisfied |
| H-82 | Option identifiers; G-02-D / G-10-C / G-03-B / G-04-B |
| H-83 | POA selections, including G-10-C Dev/Test coexistence |
| H-84 | G-11-C H-81 waiver (persist grant permitted; H-81 not started) |
| H-85 | F2-DP-01 persist **implementation** authorization |
| H-86 | F2-DP-01 artifacts and technical tests recorded; **live PG not claimed** |

---

## 5. Relationship to GPTA-H-85

H-85 authorized **implementation** of F2-DP-01 persist (six maps; I11 identifier-trace only; Dev/Test coexistence; no Production; no `eos_gateb`).

This H-87 record does **not** expand, replace, or re-grant that implementation. It authorizes **validation of the already-authorized, already-implemented persist path** against live Dev/Test PostgreSQL.

H-85 §11 completion still requires maps durable on Dev/Test coexistence (not lost solely because the process restarts). H-86 recorded artifacts and in-process tests only. Live PostgreSQL restart durability remains **unproven until separately executed under this grant**.

---

## 6. Relationship to GPTA-H-86

H-86 recorded:

- implementation artifacts exist;
- technical tests passed using an **in-process sidecar stand-in**;
- migration 124 exists as a **file**;
- migration 124 was **not applied**;
- live Dev/Test PostgreSQL application/validation was **not performed / not claimed**.

H-86 next gate was live Dev/Test PostgreSQL application/validation **if separately authorized**. This record is that separate authorization. H-86 is **not overwritten**.

The in-process stand-in URL `postgres://127.0.0.1/eos_devtest_f2_dp01` (`F2_DP01_DEVTEST_URL` in `f2-dp-01.memory-pool.ts`) is **not** a live PostgreSQL target and is **not** authorized as the execution database.

---

## 7. Exact authorized validation scope

Authorize **only**:

1. Apply **existing** migration `124_f2_dp01_commercial_facts.sql` to the designated authorized **Dev/Test** PostgreSQL environment, using the repository's existing approved migration mechanism (§9).
2. Exercise the **already-implemented** F2-DP-01 persistence path against that Dev/Test PostgreSQL environment.
3. Validate persistence and retrieval for **only** the already-authorized F2-DP-01 maps:
   - `opportunities`
   - `rfps`
   - `pathB`
   - `accounts`
   - `rates`
   - `programmes`
4. Preserve I11 as **identifier-trace only**.
5. Validate coexistence with existing mixed persistence (mixed persist continues; F2 persist additional; G-03-B authority unchanged).
6. Run appropriate technical / database integration tests needed to establish whether F2-DP-01 actually works against live Dev/Test PostgreSQL, including existing durable-boundary expectations for F2-I2–I11 **without inventing new business acceptance criteria**.
7. Record the resulting technical evidence in a **later** evidence record (not this grant).

Validation is limited to:

| Item | Authorized? |
| --- | --- |
| A. Migration 124 application to verified Dev/Test | **YES** |
| B. Persistence of the six authorized maps | **YES** |
| C. Retrieval of persisted values | **YES** |
| D. Coexistence with existing mixed persistence | **YES** |
| E. Error/rollback behavior already defined by the implementation (`migrate()` per-file `BEGIN` / `COMMIT` / `ROLLBACK`; persist gate `production_not_authorized` / `eos_gateb_not_authorized`) | **YES — already defined only** |
| F. Existing durable-boundary expectations for F2-I2–I11 | **YES — existing contracts only** |

Do **not** invent new business acceptance criteria.  
Do **not** convert technical validation into UAT.  
Do **not** certify commercial correctness beyond the already-governed contracts.

Live PostgreSQL validation demonstrates **technical persistence only**.

```text
DURABILITY DOES NOT EQUAL AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
LIVE POSTGRESQL VALIDATION ≠ COMMERCIAL SoR CUTOVER
LIVE POSTGRESQL VALIDATION ≠ EOS OPERATIONAL ADOPTION
LIVE POSTGRESQL VALIDATION ≠ H-81 EVIDENCE
LIVE POSTGRESQL VALIDATION ≠ PATH D VALIDATION
LIVE POSTGRESQL VALIDATION ≠ PRODUCTION READINESS
```

---

## 8. Exact Dev/Test environment boundary

```text
AUTHORIZED ENVIRONMENT = DEV/TEST ONLY
G-10-C = COEXISTENCE
MIXED PERSIST CONTINUES
F2 PERSIST IS ADDITIONAL
DEV/TEST PERSISTENCE ≠ PRODUCTION PERSISTENCE
PRODUCTION PERSISTENCE ≠ PRODUCTION AUTHORIZATION
PRODUCTION = NOT AUTHORIZED
UAT DATABASE = NOT AUTHORIZED
NO eos_gateb MIGRATION
NO PRODUCTION MIGRATION
NO PRODUCTION HOSTING
NO PRODUCTION DEPLOYMENT
NO PRODUCTION GEOGRAPHY / PROVIDER / ARCHITECTURE CHANGE
NO OPERATIONAL PRODUCTION CUTOVER
```

**Positive identification required before any migration execution.** Do not infer that a database is Dev/Test merely from a convenient connection string, localhost, a developer assumption, or the in-process stand-in URL.

Repository environment-identification mechanism that later execution **must** apply:

| Check | Required result | Source |
| --- | --- | --- |
| `isProductionLikeEnv` | **false** (`EOS_ENV` is not `production` or `uat`; `NODE_ENV` is not `production`) | `apps/api/src/devtest-token-secret.ts` |
| Database name from URL (`databaseNameFromUrl`) | **not** `eos_gateb` | `isGovernedGateBDatabaseName` in `apps/api/src/persistence/disposable-pg-recovery.ts` |
| `shouldApplyStartupMigrations` | `{ apply: true }` for the identified URL | `apps/api/src/persistence/startup-migrations.ts` |
| `f2Dp01PersistDecision` | `{ persist: true }` on the identified durable Dev/Test store | `apps/api/src/commercial-facts/persist.ts` |
| Target class | Designated **Dev/Test mixed-coexistence** PostgreSQL used via `EOS_DATABASE_URL` / `store.dbPool` | H-85 §4; ADR dual-path persist |
| Operator confirmation | Positive confirmation that the identified database is that authorized Dev/Test coexistence store | This record |

**Prohibited targets (STOP if matched):**

- Production database, Production migration, Production persistence, Production deployment, Production hosting, Production architecture, Production geography/provider, operational Production cutover
- `EOS_ENV=uat` / UAT PostgreSQL (`isProductionLikeEnv` treats `uat` as production-like)
- `eos_gateb` (F1 standing control; Gate C 123 was a separate consumed authorization on that database)
- The in-process F2-DP-01 memory-pool stand-in
- Any store that cannot be identified by the mechanism above

If the target environment cannot be established safely: **STOP**. Do not apply migration 124. Do not invent a substitute database.

Do not record passwords or credentialed connection strings in the later evidence record.

---

## 9. Migration 124 boundary

| Item | Record |
| --- | --- |
| Exact file | `packages/db/migrations/124_f2_dp01_commercial_facts.sql` |
| Status at H-86 | Artifact created; **not applied** |
| This grant | Permits **applying that existing file** to verified Dev/Test |
| Edit migration 124 | **NOT AUTHORIZED** |
| Create additional migrations | **NOT AUTHORIZED** |
| Alter unrelated schema | **NOT AUTHORIZED** |

Existing approved Dev/Test mechanism (already in repository; not invented here):

- `packages/db` `migrate(pool)` applies pending files from `schema.sql` + `packages/db/migrations/*.sql` using `schema_migrations`, with per-file `BEGIN` / `COMMIT` / `ROLLBACK`.
- API startup applies that path only when `shouldApplyStartupMigrations` returns `{ apply: true }` (refuses Production-like env and `eos_gateb`).
- `npm run migrate -w @sedmc/db` uses `EOS_DATABASE_URL`.

**Bound for this grant:** the authorized outcome is that **migration 124** is applied on the verified Dev/Test coexistence store.

If `migrate()` against that store would apply **any file other than** `124_f2_dp01_commercial_facts.sql` as a new application under this run: **STOP** and report the pending-file list. Do not apply unrelated catalogue files under this grant. Do not edit `migrate()`. Do not edit 124. Do not create a new migration runner.

Do **not** invoke `migrate()` against `eos_gateb`. Gate C standing control remains: `eos_gateb` migrate / DROP / migrate() is **not** authorized.

If migration 124 is discovered to contain anything outside GPTA-H-85 / F2-DP-01 (booking, KPI history, revenue/profit, FX, I1 thaw, new commercial-rule structures): **STOP** and report the discrepancy. Do **not** change the file.

---

## 10. Test-data restrictions

If validation requires test data:

- use clearly synthetic / test data or existing authorized Dev/Test fixtures;
- do **not** fabricate real commercial booking facts;
- do **not** create fake historical KPI records;
- do **not** create fake production / customer records;
- do **not** represent test fixtures as genuine business history.

Any test records must remain clearly Dev/Test.

---

## 11. Explicit exclusions

This authorization does **not** authorize or validate:

F2-I12; Production; `eos_gateb` migration; booking facts; KPI history; I7 history store; revenue; profit; FX; new commercial rules; new numerical thresholds; mailbox / Excel / WhatsApp / phone ingestion; UI; UAT; operational SoR cutover; Path D validation; unrelated I1–I11 thaw; unrelated Class A/B bundling; editing migration 124; additional migrations; code/schema/API/UI changes.

Legacy **250k / 20%** remains **legacy** and is **not** an approved F2 rule. This grant does **not** replace it or create another numerical threshold.

---

## 12. H-80 status

```text
H-80 = ACTIVE
CONTROLLED WAIT FOR NATURAL POST-ADOPTION COMMERCIAL EVIDENCE REMAINS IN FORCE
THIS VALIDATION IS NOT NATURAL POST-H-75 COMMERCIAL EVIDENCE
```

H-80 is **not** altered by this record.

---

## 13. H-81 status

```text
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
LIVE DEV/TEST DATABASE VALIDATION IS NOT H-81 EVIDENCE
SUCCESSFUL DATABASE VALIDATION DOES NOT SATISFY THE H-81 TRIGGER
THIS VALIDATION DOES NOT START H-81
THIS VALIDATION DOES NOT COMPLETE H-81
NO H-81 EVIDENCE MAY BE MANUFACTURED FROM THIS WORK
H-80 REMAINS ACTIVE
H-81 REMAINS REQUIRED TO EXECUTE IF AND WHEN ITS GENUINE TRIGGER IS LATER SATISFIED
```

H-81 is **not** altered by this record. H-84 G-11-C provisos remain in force.

---

## 14. F2-I12 status

```text
F2-I12 = NOT AUTHORIZED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-I1–I11 = FROZEN
```

---

## 15. Production status

```text
PRODUCTION = NOT AUTHORIZED
NO PRODUCTION DATABASE ACCESS
NO PRODUCTION MIGRATION
NO PRODUCTION PERSISTENCE
NO PRODUCTION DEPLOYMENT
NO PRODUCTION HOSTING / ARCHITECTURE / GEOGRAPHY / PROVIDER CHANGE
NO OPERATIONAL PRODUCTION CUTOVER
```

---

## 16. Current commercial System of Record

```text
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED / NOT PERFORMED
H-75 PROCESS ADOPTION = YES
H-75 ≠ EOS / SOFTWARE ADOPTION
G-01-C = INTENDED FUTURE SoR FOR NAMED FACT TYPES — NOT A PRESENT CUTOVER
```

Database validation does **not** constitute operational SoR adoption or cutover.

---

## 17. No-code-change restriction

This authorization is for **applying and validating** the already-existing F2-DP-01 implementation.

It does **not** authorize:

- application code changes;
- schema / migration file edits;
- UI changes;
- infrastructure / hosting changes;
- new tests that encode new commercial rules.

If validation exposes a defect requiring source or schema changes: **STOP**. Report the defect. Create **no fix** under this authorization. A separate implementation / remediation authorization may be considered afterward if necessary.

---

## 18. Failure / stop conditions

**STOP** (do not continue, do not edit 124, do not invent destructive rollback, do not reset/clean the repository) if:

1. The target cannot be positively identified as the authorized Dev/Test coexistence PostgreSQL using the §8 mechanism.
2. The target is Production-like, UAT, `eos_gateb`, or the in-process stand-in.
3. `migrate()` would apply files other than migration 124 as a new application on this run.
4. Migration 124 contains scope outside H-85 / F2-DP-01.
5. Migration 124 cannot be safely applied using the existing mechanism.
6. Validation exposes a defect requiring source/schema changes.
7. Requested work would expand maps, invent test-as-genuine-history, start UAT, touch UI, or start H-81.

Use the existing `migrate()` per-file rollback (`ROLLBACK` of the failing file). Do **not** invent `DROP DATABASE`, volume wipe, git reset/clean/stash, or other destructive commands.

---

## 19. Required evidence after execution

A **later** evidence record (not this grant) must record, without manufacturing H-81 or SoR-cutover claims:

- positive Dev/Test identity confirmation (database name class; production-like = false; not `eos_gateb`);
- whether migration 124 was applied, and by which existing mechanism;
- persist and retrieve results for the six maps;
- mixed-coexistence observation;
- I7 remaining non-durable if exercised;
- I11 remaining identifier-trace only;
- any STOP/blocker;
- H-80 still ACTIVE; H-81 still NOT STARTED;
- current commercial SoR unchanged;
- confirmation that Production / `eos_gateb` / UI / UAT were not used.

Until that later record exists, live Dev/Test PostgreSQL validation remains **not claimed**.

---

## 20. Repository integrity requirements

Later execution and this authorization record must preserve:

| Fact | Required |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved; do not reset / clean / stash / discard / revert |
| Commit | **NONE** unless separately granted |
| Push | **NONE** unless separately granted |
| H-80 / H-81 / H-82 / H-83 / H-84 / H-85 / H-86 / H-29 | **UNCHANGED** by this record |

This documentation action changes **only** this new authorization file.

---

## 21. Next gate

```text
NEXT GATE = EXECUTION OF F2-DP-01 LIVE DEV/TEST POSTGRESQL APPLICATION AND VALIDATION WITHIN THIS GRANT
THIS RECORD DOES NOT PERFORM THAT EXECUTION
THIS RECORD DOES NOT AUTHORIZE UAT
THIS RECORD DOES NOT AUTHORIZE G-08-B UI
THIS RECORD DOES NOT AUTHORIZE PRODUCTION
THIS RECORD DOES NOT START H-81
```

---

## 22. Status block

```text
GPTA-H-87 = F2-DP-01 LIVE DEV/TEST POSTGRESQL APPLICATION AND VALIDATION AUTHORIZED
EXECUTION = NOT STARTED BY THIS RECORD
MIGRATION 124 APPLICATION = NOT PERFORMED BY THIS RECORD
LIVE POSTGRESQL VALIDATION RESULT = NOT CLAIMED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
F2-I1–I11 = FROZEN
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
UAT = NOT AUTHORIZED
UI = NOT AUTHORIZED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS GRANT IS NOT H-81 EVIDENCE
THIS GRANT IS NOT EOS OPERATIONAL ADOPTION
THIS GRANT IS NOT PATH D VALIDATION
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

Authorization to validate live Dev/Test PostgreSQL does not authorize Production, UAT, UI, H-81, Path D, operational SoR cutover, or any expansion of F2-DP-01.
