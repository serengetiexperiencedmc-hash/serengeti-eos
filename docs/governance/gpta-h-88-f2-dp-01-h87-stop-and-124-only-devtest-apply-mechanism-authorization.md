# GPTA-H-88 — H-87 STOP Record and 124-Only Dev/Test Apply-Mechanism Implementation Authorization

> **`H-87 EXECUTION STOP RECORDED`**  
> **`FUTURE IMPLEMENTATION AUTHORIZATION — NOT EXECUTION`**  
> **`NOT MIGRATION 124 APPLICATION`**  
> **`NOT LIVE POSTGRESQL VALIDATION`**  
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
**Auditable timestamp:** **2026-09-21T00:40:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-88 STATUS = H-87 STOP RECORDED — 124-ONLY DEV/TEST APPLY MECHANISM IMPLEMENTATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
H-87 EXECUTION = STOPPED CORRECTLY — MIGRATION 124 NOT APPLIED
THIS RECORD DOES NOT APPLY MIGRATION 124
THIS RECORD DOES NOT RUN migrate()
THIS RECORD DOES NOT IMPLEMENT THE 124-ONLY MECHANISM
IMPLEMENTATION EXECUTION OF THE 124-ONLY MECHANISM = NOT STARTED BY THIS RECORD
LIVE DEV/TEST POSTGRESQL VALIDATION = STILL NOT PERFORMED / NOT CLAIMED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record is **documentation of the H-87 STOP** and a **future implementation authorization** for a narrowly bounded Dev/Test mechanism that can apply **only** `124_f2_dp01_commercial_facts.sql`. It is **not** permission to implement that mechanism in this documentation action. It is **not** permission to apply migration 124. H-36 F1-C-11 remains: authorization ≠ implementation evidence.

H-80, H-81, H-82, H-83, H-84, H-85, H-86, H-87, and H-29 are **not overwritten**.

---

## 1. Purpose

1. Record factually that GPTA-H-87 live Dev/Test PostgreSQL execution **stopped correctly**.
2. Authorize, as a **later** software step, design and implementation of a **124-only** Dev/Test application mechanism that removes that migration-path blocker.
3. Keep **database execution** of migration 124 as a **separate subsequent authorization**, not collapsed into this grant.

This is **not** H-81 evidence, Path D validation, EOS adoption, Production readiness, UAT, SoR cutover, F2-I12, or completion of F2-DP-01.

---

## 2. Authority basis

| Field | Record |
| --- | --- |
| Owner / POA | **Patrick Makundi** |
| Authority basis | Company Owner has granted Patrick Makundi power of attorney to act on behalf of the company for commercial business-rule and governance decisions within this process. |
| Instrument number | **Not recorded in this repository; none is invented** |
| Wet-ink / board resolution | **Not invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41 / H-85) |
| UAT Authority | **Patrick Makundi** (H-41 / H-85) — UAT **not** granted |
| Combined role | **YES** — functions remain distinct |

---

## 3. Document control

| Field | Record |
| --- | --- |
| Document | GPTA-H-88 — H-87 STOP Record and 124-Only Dev/Test Apply-Mechanism Implementation Authorization |
| Path | `docs/governance/gpta-h-88-f2-dp-01-h87-stop-and-124-only-devtest-apply-mechanism-authorization.md` |
| Identifier | **GPTA-H-88** |
| Increment identifier | **F2-DP-01** (unchanged) |
| Type | STOP evidence + future mechanism implementation authorization — not database execution |
| Date | 2026-09-21 |
| Sequence | H-85 persist grant → F2-DP-01 artifacts (H-86) → H-87 live-PG validation grant → **H-87 execution STOP** → **H-88 (this record)** |
| Does this record overwrite H-80–H-87 / H-29? | **NO** |
| Does this record apply migration 124? | **NO** |
| Does this record implement the 124-only mechanism? | **NO** |
| Does this record complete H-81? | **NO** |
| Does this record authorize Production? | **NO** |

**Authoritative predecessors (not overwritten):** H-29; H-44; H-46–H-56; H-64; H-75; H-80; H-81; H-82; H-83; H-84; H-85; H-86; H-87.

---

## A. Controlling authorization

**GPTA-H-87** was the controlling authorization for the live Dev/Test PostgreSQL application and technical validation attempt.

H-87 authorized application of **only**:

`packages/db/migrations/124_f2_dp01_commercial_facts.sql`

to the designated isolated Dev/Test PostgreSQL store, using the existing `packages/db` `migrate()` mechanism **if and only if** that run would apply 124 alone. H-87 required **STOP** if `migrate()` would apply any other file.

H-87 remains the live-validation grant. It is **not** rewritten. Its **execution** stopped as required. H-87 did **not** authorize creating a new migration runner at execution time. This H-88 record is the **separate** grant that later permits implementing a 124-only mechanism; it does **not** consume or replace H-87.

---

## B. Exact H-87 STOP reason

H-87 execution **stopped correctly**. The blocker is **not** a defect in migration 124, **not** a Production/UAT/`eos_gateb` identity failure, and **not** a commercial-rule problem.

The blocker is specifically:

**the absence of an already-authorized / existing mechanism that safely applies ONLY migration 124 to this otherwise empty Dev/Test database.**

Recorded execution facts:

| Fact | Record |
| --- | --- |
| Controlling grant | GPTA-H-87 |
| Authorized file | `packages/db/migrations/124_f2_dp01_commercial_facts.sql` only |
| `migrate()` executed | **NO** |
| Migration 124 applied | **NO** |
| PostgreSQL write | **NO** |
| Live persist/retrieve validation | **NOT PERFORMED** |
| Workaround attempted | **NO** |
| Code / schema / migration-file / runner change by H-87 execution | **NONE** |
| Direct `psql` of 124 | **NOT USED** (would bypass the authorized `migrate()` path) |
| Files changed by H-87 execution | **NONE** (porcelain remained 401) |

---

## C. Verified target / environment boundary

H-87 execution identified, then did **not** write to:

| Item | Recorded identity |
| --- | --- |
| Compose source | `infra/compose/dev.yaml` (“Isolated Development/Test compose only”) |
| Compose service | `compose-postgres-1` |
| Host | `127.0.0.1` |
| Published port | `5432` |
| Database name | `eos` |
| `eos_gateb` | **not** the target (`serengeti-eos-gate-b-pg` on `127.0.0.1:5434` identified and not migrated) |
| In-process stand-in `postgres://127.0.0.1/eos_devtest_f2_dp01` | **not used** |
| `isProductionLikeEnv` | **false** (`EOS_ENV` unset; `NODE_ENV` unset) |
| `EOS_DATABASE_URL` in invoking process / User / Machine env | **unset** |
| Public schema on `eos` | **empty** (no relations) |
| `schema_migrations` | **does not exist** |
| Mixed tables (`opp_opportunities`, `rfp_rfps`, `prg_programmes`, `crm_accounts`) | **absent** |
| F2 sidecar tables | **absent** |
| Credentials in the STOP report | **redacted** |

---

## D. Existing `migrate()` behavior

Inspected, unchanged:

- `packages/db/src/index.ts` `listMigrationFiles()` returns `schema.sql` plus every `packages/db/migrations/*.sql` in sort order (**120** files at H-87 inspection).
- `migrate(pool)` creates `schema_migrations` if missing, then applies **every unapplied** catalogue file, each in `BEGIN` / `COMMIT` / `ROLLBACK`.
- `packages/db/src/migrate-cli.ts` (`npm run migrate -w @sedmc/db`) calls that `migrate()` when `EOS_DATABASE_URL` is set. It has **no** 124-only filter.
- Global semantics: **apply all unapplied migrations**. That semantics must **remain unchanged**.

On the verified empty `eos` database, `migrate()` would have created `schema_migrations` and applied **all 120** files, including `schema.sql` and migrations `001` through `124`.

---

## E. Why `migrate()` cannot be used under H-87

H-87: if `migrate()` would apply **any file other than** `124_f2_dp01_commercial_facts.sql` as a new application under this run: **STOP**.

Because `schema_migrations` was absent, the pending set was the **entire** catalogue (120 files), not 124 alone. Using `migrate()` would have applied `schema.sql` and `001`–`123` as well as 124. That is outside H-87.

Marking `001`–`123` as applied without applying them, fabricating `schema_migrations` history, or applying `schema.sql` / `001`–`123` merely to reach 124, would also be outside H-87. Those workarounds were **not** used.

---

## F. Migration 124 remains within F2-DP-01 scope

H-87 inspected `packages/db/migrations/124_f2_dp01_commercial_facts.sql` and did **not** edit it. The file remains six JSONB sidecar tables only:

`f2_opportunity_facts`, `f2_rfp_facts`, `f2_path_b`, `f2_account_facts`, `f2_rate_identities`, `f2_programme_facts`.

No booking, KPI-history, revenue, profit, FX, unrelated commercial-rule, or I1-thaw structures. The **file** is in scope. The **runner path** was not.

---

## G. Proposed 124-only mechanism boundary

Preferred design direction (binding on later implementation; **not** implemented by this record):

| Requirement | Bound |
| --- | --- |
| Global `migrate()` | **Leave unchanged.** Do **not** alter “apply all unapplied migrations”. |
| `schema.sql` / `001`–`123` | **Do not apply** merely to reach 124. |
| `schema_migrations` history | **Do not fabricate.** Do **not** mark `001`–`123` as applied. |
| New catalogue migration | **Do not create.** |
| Edit 124 | **Do not.** |
| General-purpose bypass | **Do not.** This is not an implicit alternate `migrate()`. |
| Invocation | **Explicit, visibly bounded** Dev/Test F2-DP-01 validation invocation only. |
| Target checks before execution | Required: production-like detection **false**; database name **≠** `eos_gateb`; target **is** the approved isolated Dev/Test store (`infra/compose/dev.yaml` / `compose-postgres-1` / `eos` / `127.0.0.1:5432` class). |
| Unidentifiable target | **Refuse.** |
| Any file other than 124 would be applied | **Refuse.** |
| Secrets | Redact credentials / full credential-bearing URLs. |
| Transaction safety | Preserve existing per-statement transactional safety (`BEGIN` / `COMMIT` / `ROLLBACK` of **124 only**). |
| Destructive rollback | **Do not.** No `DROP DATABASE`, volume wipe, or git reset/clean. |
| Unrelated migrations | **Do not** silently execute. |

The future 124-only mechanism would **only** remove the migration-path blocker so that the already-authorized H-87 technical validation can **subsequently** be executed **after a separate execution authorization**. It does **not** itself complete F2-DP-01.

---

## H. Exact future implementation authorization (if this grant is used)

This record **authorizes later implementation** of **only**:

| Authorized | Bound |
| --- | --- |
| Design / implementation of the narrowly bounded **124-only** Dev/Test application mechanism | Dev/Test only; explicit invocation; §G constraints |
| Tests proving the mechanism **cannot** silently apply migrations other than 124 | Static / unit / integration-level safety tests as appropriate |
| Documentation of invocation and safety checks | Governance/code comments as required for the mechanism; **not** a new commercial rule |
| Environment | **Dev/Test only** |

**Implementation execution of that mechanism is a separate subsequent step.** This documentation action does **not** start it.

**Applying migration 124 remains NOT authorized by this record.** After the mechanism exists and is safety-validated, a **separate execution authorization** is required before 124 is actually applied. Do **not** collapse implementation authorization and database execution authorization into one step.

H-87 live persist/retrieve validation of the six maps remains **unperformed** until that later execution authorization is granted and executed.

---

## I. Exact exclusions

**NOT AUTHORIZED** by GPTA-H-88:

actually applying 124; running `migrate()`; applying `schema.sql`; applying migrations `001`–`123`; applying any migration other than 124; modifying migration 124; changing global `migrate()` semantics; fabricating `schema_migrations` history; Production; UAT; `eos_gateb`; H-81; Path D; EOS operational adoption; commercial SoR cutover; UI; ingest (mailbox / Excel / WhatsApp / phone); booking facts; KPI history; I7 history store; revenue / profit; FX; new commercial rules; new numerical thresholds; F2-I12; thawing I1–I11; Class A/B bundling; unrelated schema changes; unrelated migrations; commit / push.

Legacy **250k / 20%** remains **legacy** and is **not** an approved F2 rule. This grant does **not** replace it or create another numerical threshold.

```text
DURABILITY DOES NOT EQUAL AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
```

---

## J. H-80 / H-81 status

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
H-87 STOP IS NOT H-81 EVIDENCE
H-87 STOP DOES NOT SATISFY THE H-81 TRIGGER
THIS RECORD DOES NOT START H-81
THIS RECORD DOES NOT COMPLETE H-81
NO H-81 EVIDENCE MAY BE MANUFACTURED FROM THE H-87 STOP
```

---

## K. F2-I12 status

```text
F2-I12 = NOT AUTHORIZED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-I1–I11 = FROZEN
F2-DP-01 = NOT COMPLETE
```

---

## L. Production / UAT status

```text
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb MIGRATION
```

---

## M. Current commercial System of Record

```text
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED / NOT PERFORMED
H-75 PROCESS ADOPTION = YES
H-75 ≠ EOS / SOFTWARE ADOPTION
```

---

## N. Repository integrity

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved |
| Porcelain before this file | **401** |
| Application / schema / migration / runner / UI / API change | **NONE** |
| H-80–H-87 / H-29 modified | **NO** |
| Commit | **NONE** |
| Push | **NONE** |

---

## O. Next governance gate

```text
NEXT GATE = IMPLEMENTATION AND SAFETY VALIDATION OF THE EXPLICITLY AUTHORIZED 124-ONLY DEV/TEST MIGRATION APPLICATION MECHANISM, FOLLOWED BY A SEPARATE EXECUTION AUTHORIZATION BEFORE MIGRATION 124 IS ACTUALLY APPLIED.
```

This record does **not** perform that implementation.  
This record does **not** authorize applying 124.  
This record does **not** authorize UAT, UI, Production, or H-81.

---

## Status block

```text
GPTA-H-88 = H-87 STOP RECORDED — 124-ONLY DEV/TEST APPLY MECHANISM IMPLEMENTATION AUTHORIZED
H-87 EXECUTION STOP = CORRECT
MIGRATION 124 = NOT APPLIED
LIVE POSTGRESQL VALIDATION = NOT PERFORMED / NOT CLAIMED
124-ONLY MECHANISM IMPLEMENTATION = NOT STARTED BY THIS RECORD
MIGRATION 124 DATABASE EXECUTION = NOT AUTHORIZED BY THIS RECORD
F2-DP-01 = NOT COMPLETE
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
