# GPTA-H-86 — F2-DP-01 Bounded Dev/Test F2 Commercial-Facts Persist Implementation Evidence

> **`IMPLEMENTATION EVIDENCE`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
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
**Auditable timestamp:** **2026-09-21T00:28:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-86 STATUS = F2-DP-01 IMPLEMENTATION ARTIFACTS AND TECHNICAL TEST EVIDENCE RECORDED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
LIVE DEV/TEST POSTGRESQL APPLICATION/VALIDATION = NOT PERFORMED / NOT CLAIMED
MIGRATION 124 = ARTIFACT CREATED — NOT APPLIED DURING THE IMPLEMENTATION ACTION
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record is the **implementation-evidence record** required after H-85 authorization and F2-DP-01 execution. It does **not** authorize further software, UAT, UI, Production, `eos_gateb`, or live database migration.

H-36 F1-C-11 remains: specification / authorization ≠ implementation evidence. This record **is** implementation evidence for **artifacts and technical tests only**. It is **not** live PostgreSQL validation evidence.

H-80, H-81, H-82, H-83, H-84, H-85, and H-29 are **not overwritten**. Frozen F2-I1–I11 catalogues are **not** thawed by this record.

---

## 1. Purpose

Document that F2-DP-01 was **executed as authorized by GPTA-H-85**, and record what is and is not proven.

This document is **documentation of implementation evidence only**.

---

## 2. Authority basis

| Field | Record |
| --- | --- |
| Owner / POA | **Patrick Makundi** |
| Authority basis | Company Owner has granted Patrick Makundi power of attorney to act on behalf of the company for commercial business-rule and governance decisions within this process. |
| Instrument number | **Not recorded in this repository; none is invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41 / H-85) |
| UAT Authority | **Patrick Makundi** (H-41 / H-85) — UAT **not** performed and **not** granted by this record |
| Combined role | **YES** — functions remain distinct |

---

## 3. Document control

| Field | Record |
| --- | --- |
| Document | GPTA-H-86 — F2-DP-01 Bounded Dev/Test F2 Commercial-Facts Persist Implementation Evidence |
| Path | `docs/governance/gpta-h-86-f2-dp-01-bounded-devtest-f2-facts-persist-implementation-evidence.md` |
| Identifier | **GPTA-H-86** |
| Type | Implementation evidence — not an authorization grant |
| Date | 2026-09-21 |
| Sequence | H-85 F2-DP-01 persist **grant** → F2-DP-01 **execution** → **H-86 evidence (this record)** |
| Governing authorization | **GPTA-H-85** |
| Implemented increment | **F2-DP-01** |
| Does this record overwrite H-80 / H-81 / H-82 / H-83 / H-84 / H-85 / H-29? | **NO** |
| Does this record authorize Production, UI, UAT, live DB migrate, `eos_gateb`, or F2-I12? | **NO** |

---

## 4. Governing authorization: GPTA-H-85

H-85 authorized **only** bounded Dev/Test coexistence persist of already-specified F2 sidecar maps:

`opportunities`, `rfps`, `pathB`, `accounts`, `rates`, `programmes`

I11 identifier-trace only. I1 catalogues consumed, not rewritten. Mixed persist continues. F2 persist additional. Authority G-03-B. Environment G-10-C Dev/Test only. G-04-B isolation of mixed 250k/20% from F2 generate/send without a replacement number. H-84 G-11-C waiver conditions apply.

H-85 §11 completion of the increment requires later evidence that the granted maps are durable on Dev/Test coexistence (not lost solely because the process restarts), mixed persist continues, I1 was not rewritten, booking/KPI history were not added, G-03-B and environment bounds were not violated, and H-84 statements were not violated.

This H-86 record **does not claim live Dev/Test PostgreSQL durability**. See §9.

---

## 5. Authorized / implemented increment

```text
GRANTED INCREMENT = F2-DP-01
F2-DP-01 = BOUNDED DEV/TEST DURABLE PERSIST OF ALREADY-SPECIFIED F2 COMMERCIAL-FACTS MAPS
MUST NOT BE CALLED F2-I12
```

**Granted maps documented as implemented:**

| Map | Preview origin | Persist content as authorized |
| --- | --- | --- |
| `opportunities` | F2-I2 | Qualification / loss / ownership / next action |
| `rfps` | F2-I2 / I8 / I9 | SOURCE and CHANNEL (distinct); explicit receipt / first response / clarification |
| `pathB` | F2-I3 / I4 | Qualitative Path B records and generate/send Path B state |
| `accounts` | F2-I5 | Account type and F2 market catalogue |
| `rates` | F2-I6 | Supplier-rate identity facts |
| `programmes` | F2-I10 / I11 | Programme commercial facts and **identifier trace only** (no freeze-on-send) |

I7 KPI preview remains **non-durable** as a history store.

---

## 6. Implementation evidence (artifacts)

### 6A. IMPLEMENTED — artifacts created or modified

The following files were reported as the F2-DP-01 execution set.

**Created by F2-DP-01 (new files):**

| Path | Role |
| --- | --- |
| `packages/db/migrations/124_f2_dp01_commercial_facts.sql` | Dev/Test sidecar schema **artifact** for the six maps. JSONB payloads. No booking table. No KPI-history table. |
| `apps/api/src/persistence/f2-commercial-facts-repository.ts` | Queryable load/upsert of the six maps |
| `apps/api/src/commercial-facts/persist.ts` | Dev/Test persist gate; dual-write/read helpers; hydrate |
| `apps/api/src/f2-dp-01.memory-pool.ts` | In-process sidecar **stand-in** used by tests |
| `apps/api/src/f2-dp-01.commercial-facts-persist.test.ts` | F2-DP-01 persist technical tests |

**Modified files that were already dirty / untracked before F2-DP-01** (not newly created by this increment):

| Path | Role in F2-DP-01 |
| --- | --- |
| `apps/api/src/commercial-facts/service.ts` | Opportunity and RFP facts persist instead of durable 409 when F2-DP-01 is enabled |
| `apps/api/src/commercial-facts/account.ts` | Account facts persist |
| `apps/api/src/commercial-facts/path-b.ts` | Path B persist; skip Path B only when persist is **not** enabled |
| `apps/api/src/commercial-facts/rate-identity.ts` | Rate identity persist |
| `apps/api/src/commercial-facts/programme.ts` | Programme facts persist (identifier-trace fields) |
| `apps/api/src/proposal/proposal.ts` | G-04-B: F2 generate uses Path B when F2-DP-01 is enabled; mixed 250k/20% remains legacy |
| `apps/api/src/main.ts` | Hydrate the six maps on Dev/Test when F2-DP-01 persist is enabled |
| `apps/api/src/f2-i4.in-memory-generation-path-b.test.ts` | Durable generate now Path B under F2-DP-01; legacy gate still evaluated as mixed |
| `apps/api/src/f2-i8.c3-rfp-timestamp-clarification-preview.test.ts` | Durable boundary updated from 409 to persist-across-cache-clear |
| `apps/api/src/f2-i9.c3-first-response-preview.test.ts` | Same for explicit first-response |
| `apps/api/src/f2-i10.c5-programme-identity-preview.test.ts` | Same for programme facts |
| `apps/api/src/f2-i11.c5-costing-proposal-trace-preview.test.ts` | Same for I11 identifier-trace facts |

**Reported unchanged in that execution (not F2-DP-01 deliverables):** `kpis.ts`, `routes.ts`, `memory.ts`, I1 `packages/kernel/src/commercial-contract.ts`, UI.

Migration **124 exists as a file**. Existence of the file is **not** application of the file.

### 6B. TECHNICALLY TESTED

Reported from the F2-DP-01 execution action:

| Check | Result recorded |
| --- | --- |
| `apps/api/src/f2-dp-01.commercial-facts-persist.test.ts` | **3 passed** |
| F2-I2–I11 tests, including updated durable-boundary tests | **Passed** (first sweep 76 passed after persist-test fix; durable-boundary re-run 48 passed; I2/I3/I5/I6 passed in the first sweep) |
| API `tsc --noEmit` | **Clean** after F2-DP-01 type fixes in already-touched commercial-facts files |

An earlier combined F2-DP-01 + I2–I11 run failed one persist test because mixed entities were created after `dbPool` was attached. That test was reordered (mixed first, then persist). The later persist run passed. That failure is **not** live-database evidence.

These tests used an **in-process sidecar stand-in** (`f2-dp-01.memory-pool.ts`), not a live PostgreSQL database.

Successful technical tests are **not** H-81 evidence, EOS adoption evidence, Path D validation, Production readiness, or operational SoR adoption.

### 6C. NOT LIVE-DB-VALIDATED

```text
MIGRATION 124 WAS NOT APPLIED DURING THE IMPLEMENTATION ACTION
NO migrate() WAS RUN AGAINST ANY DATABASE AS PART OF F2-DP-01 EXECUTION
UNIT TESTS USED AN IN-PROCESS SIDECAR STAND-IN
LIVE DEV/TEST POSTGRESQL PERSISTENCE IS NOT PROVEN
DATABASE INTEGRATION IS NOT COMPLETE
```

This record does **not** state that PostgreSQL persistence is validated, that migration 124 has been successfully applied, that live Dev/Test database persistence is proven, or that database integration is complete.

Live PostgreSQL application/validation of migration 124 remains a **separate subsequent action if authorized**. This evidence record does **not** authorize that action.

---

## 7. H-85 §11 criteria — what this record does and does not demonstrate

| H-85 §11 item | This record |
| --- | --- |
| Maps durable on Dev/Test coexistence (survive process restart); mixed persist continues | **Artifacts and in-process cache-clear tests recorded.** Live PG restart durability **not claimed**. Mixed persist **continues** in code/tests as coexistence. |
| Frozen I1 catalogues consumed, not rewritten | **Recorded** — `commercial-contract.ts` not rewritten |
| No booking facts; no KPI history; I7 preview non-durable | **Recorded** — I7 still `409 f2_i7_in_memory_preview_only` when durable |
| G-03-B distinctions not violated | **Recorded** in tests (qualification ≠ stage; SOURCE ≠ CHANNEL; mixed market not F2 market; durability ≠ authority) |
| Environment: `eos_gateb` untouched; Production untouched | **Recorded** — persist gate refuses Production-like env and `eos_gateb` name; migrate not executed |
| H-84 statements not violated | **Recorded** in §11 of this file |

---

## 8. Explicit non-evidence limitations

This record is **not**:

- H-81 evidence
- satisfaction of the H-81 evidence trigger
- start or completion of H-81
- post-H-75 natural commercial evidence
- EOS operational adoption evidence
- Path D validation
- UAT acceptance
- Production readiness
- operational SoR cutover
- live Dev/Test PostgreSQL validation

---

## 9. H-80 / H-81 / H-84 provisos

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
H-81 SUBSTANTIVE REVIEW = NOT EXECUTED
THIS IMPLEMENTATION IS NOT H-81 EVIDENCE
THIS IMPLEMENTATION DOES NOT SATISFY THE H-81 EVIDENCE TRIGGER
THIS IMPLEMENTATION DOES NOT START H-81
THIS IMPLEMENTATION DOES NOT COMPLETE H-81
THIS IMPLEMENTATION IS NOT POST-ADOPTION EVIDENCE
THIS IMPLEMENTATION IS NOT EOS OPERATIONAL ADOPTION EVIDENCE
THIS IMPLEMENTATION IS NOT PATH D VALIDATION
THIS IMPLEMENTATION CANNOT BE REPRESENTED AS NATURAL POST-H-75 COMMERCIAL EVIDENCE
H-81 REMAINS REQUIRED TO EXECUTE IF AND WHEN ITS GENUINE TRIGGER IS LATER SATISFIED
```

---

## 10. Current commercial System of Record

```text
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT PERFORMED / NOT AUTHORIZED
H-75 PROCESS ADOPTION = YES
H-75 ≠ EOS / SOFTWARE ADOPTION
G-01-C = INTENDED FUTURE SoR FOR NAMED FACT TYPES — NOT A PRESENT CUTOVER
```

F2-DP-01 persist artifacts do **not** make EOS the live commercial SoR.

---

## 11. Production, F2-I12, I1–I11

| Item | Status |
| --- | --- |
| Production | **NOT AUTHORIZED** |
| F2-I12 | **NOT AUTHORIZED** |
| I1–I11 catalogues / frozen I1 source | **FROZEN** — consumed, not rewritten |
| `eos_gateb` migration | **NOT EXECUTED** / **NOT AUTHORIZED** |

---

## 12. Explicit exclusions (not implemented / not authorized by this evidence)

F2-I12; Production; `eos_gateb` migration; booking facts; KPI history; I7 history store; UI; mailbox / Excel / WhatsApp / phone ingestion; FX; revenue; profit; new commercial rules; new numerical thresholds; Path D validation; operational SoR cutover; unrelated I1–I11 thaw; unrelated Class A/B bundling.

Legacy **250k / 20%** remains **legacy** and is **not** an approved F2 rule. G-04-B isolation from F2 generate/send (when F2-DP-01 persist is enabled) **does not** substitute a replacement number.

---

## 13. Preserved commercial distinctions

```text
DURABILITY DOES NOT EQUAL AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
NO KPI HISTORY EXISTS MERELY BECAUSE PERSISTENCE ARTIFACTS EXIST
NO BUSINESS RECEIPT / FIRST-RESPONSE FACT MAY BE INVENTED
NO MARKET TAXONOMY MAY BE INVENTED FROM FREE-STRING MARKET DATA
NO LEGACY 250K / 20% LOGIC MAY BE PROMOTED INTO A NEW AUTHORITATIVE F2 RULE
NO BOOKING FACT MAY BE FABRICATED
NO H-81 EVIDENCE MAY BE MANUFACTURED
```

---

## 14. Repository integrity (this documentation action)

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved |
| Commit | **NONE** |
| Push | **NONE** |
| Application / schema / migration / UI / API change by **this** H-86 file | **NONE** (this record only) |
| H-80 / H-81 / H-82 / H-83 / H-84 / H-85 / H-29 modified | **NO** |
| Porcelain count at start of this documentation action (reported) | **399** |

---

## 15. Conclusion / status

F2-DP-01 implementation artifacts and technical test evidence are recorded; live Dev/Test PostgreSQL application/validation remains unperformed and is not claimed.

The EOS commercial system is **not** complete. F2-I1–I11 remain frozen preview catalogues plus this bounded persist increment’s artifacts. F2-I12 remains not authorized. Production remains not authorized.

```text
GPTA-H-86 = F2-DP-01 IMPLEMENTATION ARTIFACTS AND TECHNICAL TEST EVIDENCE RECORDED
LIVE DEV/TEST POSTGRESQL APPLICATION/VALIDATION = NOT PERFORMED / NOT CLAIMED
UAT = NOT PERFORMED
UI = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
F2-I12 = NOT AUTHORIZED
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS RECORD IS NOT H-81 EVIDENCE
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

---

## 16. Next gate

```text
NEXT GATE = LIVE DEV/TEST POSTGRESQL APPLICATION/VALIDATION OF F2-DP-01 (MIGRATION 124 / SIDECAR PERSIST) IF SEPARATELY AUTHORIZED
THIS RECORD DOES NOT AUTHORIZE THAT ACTION
THIS RECORD DOES NOT AUTHORIZE UAT
THIS RECORD DOES NOT AUTHORIZE G-08-B UI
THIS RECORD DOES NOT AUTHORIZE PRODUCTION
THIS RECORD DOES NOT START H-81
```

H-85: a separate UAT execution authorization would be required after implementation evidence exists. G-08-B UI remains a later grant, only after the granted facts are actually durable on the authorized Dev/Test store. Those grants are **not** this record.
