# GPTA-H-91 — Live Dev/Test F2-DP-01 Persistence/Retrieval Validation Authorization

> **`VALIDATION AUTHORIZATION`**  
> **`OWNER / POA DECISION = APPROVED`**  
> **`NOT A NEW IMPLEMENTATION GRANT`**  
> **`NOT A SCHEMA GRANT`**  
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
**Auditable timestamp:** **2026-09-21T01:06:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-91 STATUS = LIVE DEV/TEST F2-DP-01 PERSIST/RETRIEVE VALIDATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
OWNER/POA DECISION = APPROVED
THIS RECORD DOES NOT EXECUTE VALIDATION
THIS RECORD DOES NOT INSERT FACTS
THIS RECORD DOES NOT MODIFY APPLICATION CODE
LIVE PERSIST/RETRIEVE EXECUTION = NOT STARTED BY THIS RECORD
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

H-36 F1-C-11 remains: authorization ≠ execution evidence. H-80 through H-90 and H-29 are **not overwritten**.

---

## 1. Purpose

Authorize a narrowly bounded **live Dev/Test persistence/retrieval validation** of the **already-implemented** F2-DP-01 application persistence path against isolated Dev/Test PostgreSQL, after H-89 applied migration 124 and H-90 recorded that persist/retrieve remains unvalidated.

This is **not** a new feature grant, **not** a new schema grant, and **not** a redesign of the persistence model.

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
| Decision scope | Bounded live Dev/Test F2-DP-01 persist/retrieve validation as described here, on the already-implemented persistence boundary and isolated Dev/Test PostgreSQL only. **No implementation changes.** |

---

## 3. Governing predecessor records

| Record | Role |
| --- | --- |
| H-29 | Controlling C-spine / commercial-rule baseline |
| H-44 / H-46–H-56 | F2 C1–C10 Dev/Test; frozen I1–I11 |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-82 / H-83 / H-84 | Owner/POA decisions and G-11-C waiver |
| H-85 | F2-DP-01 persist **implementation** authorization |
| H-86 | Implementation artifacts / technical tests |
| H-87 | Live Dev/Test PG grant; `migrate()` STOP |
| H-88 | 124-only apply mechanism; implementation + audit **PASS** |
| H-89 | Migration 124-only execution authorization |
| H-89 execution | **Successful** (124 applied; six tables exist) |
| **H-90** | H-89 execution evidence; audit **PASS**; persist/retrieve **not performed** |

H-90 conclusion and next gate are consistent with this grant. H-90 SHA-256 at H-91 creation: `419428AFACFE1720920E8308DE569A5C7901BFFCA0148ABFD8C677789C824620`.

---

## 4. Current governance state

```text
H-80 = ACTIVE
H-81 = NOT STARTED
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
MIGRATION 124 = APPLIED ON ISOLATED DEV/TEST eos (STRUCTURAL)
LIVE PERSIST/RETRIEVE = NOT YET VALIDATED
```

---

## 5. Authorized validation scope

Later execution may **only** gather technical evidence that the **existing** F2-DP-01 persistence layer can:

1. Persist authorized F2 commercial-fact test data to the six already-created sidecar tables.
2. Retrieve that data through the existing application persistence/read path.
3. Demonstrate preservation of relevant fact-map data across a controlled application restart/hydration cycle **if** that can be done with already-implemented code and **without** new functionality.

No new persistence design. No new tables. No code changes under this grant.

---

## 6. Authorized catalogue scope

| Map | Bound |
| --- | --- |
| `opportunities` | Already-specified F2-I2 facts |
| `rfps` | Already-specified F2-I2 / I8 / I9 facts |
| `pathB` | Already-specified F2-I3 / I4 facts |
| `accounts` | Already-specified F2-I5 facts |
| `rates` | Already-specified F2-I6 facts |
| `programmes` | Already-specified F2-I10 facts; **I11 identifier-trace only** |

Frozen I1 catalogues may be **consumed**, not rewritten. No new catalogue types. I1–I11 remain **frozen**. F2-I12 is **not** authorized.

---

## 7. Controlled test-data boundary

Synthetic/test records are permitted **only** for technical persist/retrieve.

They must be clearly marked as test data. They are **not** genuine commercial facts.

**Forbidden as test/genuine data:** fabricated customer bookings; fabricated actual RFP receipt dates as business history; fabricated business response-time history; fabricated revenue, profit, KPI history, or FX rates; production commercial records; new business rules via fixtures.

Keep fixtures minimal and tied to the existing persistence mechanism.

---

## 8. Authorized Dev/Test database target

| Item | Required |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| Compose service | `compose-postgres-1` |
| Image class | `postgres:16-alpine` |
| Environment | non-production-like |
| Sidecar tables (already exist) | `f2_opportunity_facts`, `f2_rfp_facts`, `f2_path_b`, `f2_account_facts`, `f2_rate_identities`, `f2_programme_facts` |

Positive identity check is required **immediately before** later execution.

**Prohibited:** Production; UAT; Gate B; `127.0.0.1:5434`; `eos_gateb`; production-like databases; stand-in `eos_devtest_f2_dp01`; any remote/unidentified PostgreSQL target.

If identity cannot be established: **STOP**. Do not guess. Do not substitute another database. Do not print credentials.

---

## 9. Validation questions (later execution only)

| ID | Question |
| --- | --- |
| A. Write | Can each authorized fact-map type be persisted through the **existing** application persistence mechanism to its sidecar table? |
| B. Read | Can the persisted test record be retrieved through the **existing** application read/repository path? |
| C. Round trip | Does the retrieved representation preserve already-defined data enough to establish persist/retrieve integrity? |
| D. Restart/hydration | Can the **existing** Dev/Test restart/hydration reconstruct authorized in-memory maps from PostgreSQL, where already implemented? |
| E. Isolation | Does validation remain limited to the six authorized F2-DP-01 sidecar tables? |

Do not invent new business acceptance criteria. Do not convert this into UAT.

---

## 10. Explicit exclusions

Production; UAT; `eos_gateb`; `eos_devtest_f2_dp01`; migration execution; editing migration 124; editing the H-88 apply mechanism; changing global `migrate()`; applying `schema.sql` or migrations `001`–`123` or `125+`; fabricating `schema_migrations`; mailbox / Excel / WhatsApp / phone / automated commercial ingestion; operational SoR cutover; UI; booking facts/workflow; KPI history; revenue; profit; FX; new commercial rules or numerical thresholds; new qualification rules; new market taxonomy; F2-I12; I1–I11 thaw; Class A/B bundling; Path D validation; EOS adoption; commercial-process adoption; Production readiness; UAT sign-off; business KPI baselines/targets; commit; push.

Legacy **250k / 20%** remains **legacy** and must **not** be promoted into an F2 rule.

This grant does **not** authorize implementation changes.

---

## 11. Business-fact boundaries

```text
DURABILITY DOES NOT EQUAL AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
FREE-STRING MARKET ≠ AUTHORITATIVE MARKET TAXONOMY
new_qualified ≠ AUTHORITATIVE QUALIFICATION STATE
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
TECHNICAL PERSISTENCE SUCCESS ≠ COMMERCIAL PROCESS ADOPTION
DEV/TEST VALIDATION ≠ PRODUCTION READINESS
H-91 VALIDATION ≠ H-81 EVIDENCE
NO receivedAt ?? now AUTHORITY
```

Do not infer or invent business facts from successful technical persistence.

---

## 12. H-80 / H-81 boundary

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS AUTHORIZATION DOES NOT START H-81
THIS AUTHORIZATION DOES NOT COMPLETE H-81
THIS AUTHORIZATION DOES NOT MANUFACTURE H-81 EVIDENCE
LATER H-91 EXECUTION IS NOT H-81 EVIDENCE
NOT PATH D VALIDATION
NOT EOS ADOPTION
NOT OPERATIONAL SoR CUTOVER
```

The H-81 trigger remains independently governed.

---

## 13. Production / UAT boundary

```text
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
TARGET = ISOLATED DEV/TEST ONLY
```

---

## 14. F2-I12 boundary

```text
F2-I12 = NOT AUTHORIZED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-I1–I11 = FROZEN
F2-DP-01 = NOT COMPLETE
```

---

## 15. Execution-not-performed

```text
AUTHORIZATION IS GRANTED
EXECUTION IS NOT PERFORMED BY CREATION OF THIS RECORD
NO FACTS INSERTED BY THIS RECORD
NO POSTGRESQL WRITE BY THIS RECORD
NO APPLICATION CODE CHANGE BY THIS RECORD
```

---

## 16. Next governance gate

```text
NEXT GATE = EXECUTE THE SEPARATELY AUTHORIZED LIVE DEV/TEST F2-DP-01 PERSISTENCE/RETRIEVAL VALIDATION, THEN PRODUCE EXECUTION EVIDENCE AND AUDIT IT.
THIS RECORD DOES NOT PERFORM THAT EXECUTION.
THIS RECORD DOES NOT AUTHORIZE UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER.
```

---

## 17. Repository state

| Fact | This documentation action |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Porcelain before this file | **409** |
| Application / schema / migration / H-88–H-90 change | **NONE** |
| H-80–H-90 modified | **NO** |
| Commit | **NONE** |
| Push | **NONE** |

---

## 18. Conclusion

```text
GPTA-H-91 = LIVE DEV/TEST F2-DP-01 PERSIST/RETRIEVE VALIDATION AUTHORIZED
OWNER/POA = PATRICK MAKUNDI
DECISION = APPROVED
EXECUTION = NOT PERFORMED BY THIS RECORD
H-80 = ACTIVE
H-81 = NOT STARTED
THIS GRANT IS NOT H-81 EVIDENCE
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```
