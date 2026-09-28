# GPTA-H-90 — F2-DP-01 H-89 Migration 124 Dev/Test Execution Evidence

> **`EXECUTION EVIDENCE`**  
> **`NOT AN EXECUTION AUTHORIZATION`**  
> **`NOT LIVE PERSIST/RETRIEVE VALIDATION`**  
> **`NOT H-81 EVIDENCE`**  
> **`NOT UAT`**  
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
**Auditable timestamp:** **2026-09-21T01:04:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-90 STATUS = H-89 MIGRATION 124 DEV/TEST EXECUTION EVIDENCE RECORDED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
MIGRATION 124 = APPLIED ON ISOLATED DEV/TEST eos (STRUCTURAL)
LIVE F2-DP-01 PERSIST/RETRIEVE VALIDATION = NOT PERFORMED / NOT CLAIMED
NO COMMERCIAL FACTS INSERTED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS RECORD IS NOT H-81 EVIDENCE
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb MIGRATION
NO GLOBAL migrate()
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record documents **completed H-89 execution**. It does **not** grant further execution. It does **not** authorize live persist/retrieve validation. H-36 F1-C-11 remains: authorization ≠ later validation.

H-80 through H-89 and H-29 are **not overwritten**.

---

## 1. Purpose

Record that GPTA-H-89 was **executed as authorized**: migration `124_f2_dp01_commercial_facts.sql` was applied through the audited H-88 library path to the isolated Dev/Test PostgreSQL target, and the six sidecar tables were structurally verified.

This document is **execution evidence only**. It is **not** an H-81 evidence record.

---

## 2. Governing authorizations

| Record | Role |
| --- | --- |
| H-85 | F2-DP-01 persist implementation grant |
| H-86 | Implementation artifacts / technical tests; live PG not claimed at that time |
| H-87 | Live Dev/Test PG validation grant; execution **STOPPED** (`migrate()` would apply 120 files) |
| H-88 | 124-only mechanism implementation authorization |
| H-88 implementation + audit | Mechanism completed; audit **PASS** |
| **H-89** | **Controlling execution authorization** for this evidence |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |

Authority: **Patrick Makundi** (company POA; instrument number not recorded / not invented).

H-89 authorized **only**: connect to the verified isolated Dev/Test target; pre-execution checks; apply **only** 124 via `applyF2Dp01Migration124`; verify the six tables exist. H-89 did **not** authorize full live persist/retrieve.

---

## 3. Repository pre-state (H-89 execution)

| Fact | Recorded |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain | **408** |
| Files changed by H-89 database execution | **NONE** |

H-89 execution did not modify repository files. This H-90 documentation action adds **only** this evidence record.

---

## 4. Migration identity / hash

| Item | Record |
| --- | --- |
| Canonical path | `packages/db/migrations/124_f2_dp01_commercial_facts.sql` |
| SHA-256 | `68D6FB4441F4383284AF1B4892E78F939947C8DF02E53705073E0FD2E4F08EE6` |
| Match before execution | **YES** |
| Match after execution | **YES** |
| File edited | **NO** |

---

## 5. Target identity

| Item | Recorded (credentials redacted) |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| Compose service | `compose-postgres-1` |
| Image | `postgres:16-alpine` |
| Compose source | `infra/compose/dev.yaml` |
| Live `current_database()` / `inet_server_port()` | `eos` / `5432` |
| Environment | isolated Dev/Test; `EOS_ENV=development`; production-like = **false** |
| Redacted URL | `postgres://127.0.0.1:5432/eos` |
| Gate B `127.0.0.1:5434` / `eos_gateb` | **not used** |
| Stand-in `eos_devtest_f2_dp01` | **not used** |

---

## 6. Execution path

| Item | Record |
| --- | --- |
| Function | `applyF2Dp01Migration124` |
| `execute` | `true` |
| Client | injected `pg.Pool` (not autonomous `createPool` inside the 124 module) |
| Canonical path confirmed | **YES** (`pathIsCanonical=true`) |
| `calledMigrate` | `false` |
| `migrate()` | **not used** |
| `listMigrationFiles()` | **not used** |
| `migrate-cli.ts` | **not used** |
| `npm run migrate` | **not used** |
| H-88 CLI `--execute` | **not used** (CLI remains refuse-`--execute`) |

---

## 7. Pre-migration state

| Item | Record |
| --- | --- |
| `schema_migrations` | **absent** |
| Six F2 sidecar tables | **absent** |
| Public schema | **empty** |
| Mixed tables (`opp_opportunities`, `rfp_rfps`, `prg_programmes`, `crm_accounts`) | **absent** |

---

## 8. Execution result

| Item | Record |
| --- | --- |
| `decide` | `allow=true` |
| Transaction | `BEGIN` → 124 SQL → `COMMIT` |
| 124 SQL contained `f2_opportunity_facts` CREATE | **YES** |
| 124 SQL contained 123 FK / `schema_migrations` | **NO** |
| `applied` | `true` |
| Outcome | **successful completion** |
| Rollback | **not used** (commit succeeded) |

---

## 9. Post-migration structural verification

Public relations after commit (read-only catalog):

| Relation | Present |
| --- | --- |
| `f2_opportunity_facts` | **yes** |
| `f2_rfp_facts` | **yes** |
| `f2_path_b` | **yes** |
| `f2_account_facts` | **yes** |
| `f2_rate_identities` | **yes** |
| `f2_programme_facts` | **yes** |

These six relations were the **only** public tables. `schema_migrations` remained **absent**. Mixed tables remained **absent**. No unrelated migration was applied. H-88 did **not** fabricate `schema_migrations` history.

---

## 10. Explicit non-actions / distinctions

1. H-89 execution **successfully applied** the authorized Dev/Test schema (six sidecar tables).
2. This does **NOT** prove live application persistence/retrieval.
3. No commercial facts were inserted.
4. No persistence/retrieval round-trip was performed.
5. No KPI history was created.
6. No booking facts were created.
7. No revenue / profit / FX logic was introduced.
8. No new commercial rules or numerical thresholds were introduced.
9. No ingest was performed.
10. No UI work was performed.
11. No SoR cutover occurred.
12. H-81 remains **NOT STARTED**.
13. H-89 execution is **NOT** H-81 evidence.
14. F2-I12 remains **NOT AUTHORIZED**.
15. Production and UAT remain **NOT AUTHORIZED**.
16. Current commercial SoR remains **Office / Excel / Outlook/Gmail / WhatsApp / phone**.

```text
DURABILITY DOES NOT EQUAL AUTHORITY
SCHEMA APPLIED ≠ PERSIST/RETRIEVE VALIDATED
APPLYING 124 ≠ H-81 EVIDENCE
APPLYING 124 ≠ OPERATIONAL SoR CUTOVER
LEGACY 250K / 20% REMAINS LEGACY
```

---

## 11. Governance status

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS RECORD IS NOT H-81 EVIDENCE
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
F2-DP-01 = NOT COMPLETE
LIVE PERSIST/RETRIEVE = NOT AUTHORIZED / NOT PERFORMED
```

---

## 12. Repository post-state

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain at start of this file | **408** |
| Application / schema / migration / H-88 mechanism change | **NONE** |
| H-80–H-89 modified | **NO** |
| Commit | **NONE** |
| Push | **NONE** |

---

## 13. Conclusion

H-89 execution evidence is recorded: migration 124 was applied on isolated Dev/Test `eos` through `applyF2Dp01Migration124`, and the six authorized sidecar tables exist. Live F2-DP-01 persist/retrieve remains **unperformed and not claimed**.

```text
GPTA-H-90 = H-89 MIGRATION 124 DEV/TEST EXECUTION EVIDENCE RECORDED
LIVE PERSIST/RETRIEVE = NOT PERFORMED / NOT CLAIMED
H-81 = NOT STARTED
THIS RECORD IS NOT H-81 EVIDENCE
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

---

## 14. Next governance gate

```text
NEXT GATE = SEPARATE OWNER/POA AUTHORIZATION DECISION FOR LIVE DEV/TEST F2-DP-01 PERSISTENCE/RETRIEVAL VALIDATION
NO SUCH VALIDATION IS AUTHORIZED BY THIS RECORD
THIS RECORD DOES NOT START H-81
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, OR SoR CUTOVER
```
