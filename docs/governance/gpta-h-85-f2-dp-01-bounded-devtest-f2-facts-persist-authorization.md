# GPTA-H-85 — F2-DP-01 Bounded Dev/Test F2 Commercial-Facts Persist Implementation Authorization

> **`IMPLEMENTATION AUTHORIZATION GRANT`**  
> **`IMPLEMENTATION EXECUTION IS A SEPARATE SUBSEQUENT STEP`**  
> **`DECISIONS RECORDED UNDER COMPANY POA`**  
> **`NOT AN IMPLEMENTATION RESULT`**  
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

**Date:** 2026-09-20.  
**Auditable timestamp:** **2026-09-20T23:53:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-85 STATUS = F2-DP-01 BOUNDED DEV/TEST F2 FACTS PERSIST IMPLEMENTATION AUTHORIZED

INCREMENT IDENTIFIER = F2-DP-01
F2-I12 = NOT AUTHORIZED
THIS INCREMENT MUST NOT BE CALLED F2-I12
IMPLEMENTATION EXECUTION = NOT STARTED BY THIS RECORD
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record is the **separate bounded implementation authorization grant** required after H-83 POA selections and H-84 G-11-C waiver. It does **not** execute software. H-36 F1-C-11 remains: specification / authorization ≠ implementation evidence.

H-80, H-81, H-82, H-83, H-84, and H-29 are **not overwritten**. Frozen F2-I1–I11 source is **not** thawed by this record.

---

## 1. Owner / POA authority

This grant is recorded as an **authorized company decision** under the previously granted company power of attorney held by:

**Patrick Makundi**

| Field | Record |
| --- | --- |
| Owner / POA | **Patrick Makundi** |
| Authority basis | Company Owner has granted Patrick Makundi power of attorney to act on behalf of the company for commercial business-rule and governance decisions within this process. |
| Instrument number | **Not recorded in this repository; none is invented** |
| Wet-ink / board resolution | **Not invented** |
| Technical Increment Owner | **Patrick Makundi** (H-41) |
| UAT Authority | **Patrick Makundi** (H-41) |
| Combined role | **YES** — functions remain distinct (H-41 / H-44) |

Implementation evidence must not substitute for UAT acceptance evidence.

---

## 2. Document control

| Field | Record |
| --- | --- |
| Document | GPTA-H-85 — F2-DP-01 Bounded Dev/Test F2 Commercial-Facts Persist Implementation Authorization |
| Path | `docs/governance/gpta-h-85-f2-dp-01-bounded-devtest-f2-facts-persist-authorization.md` |
| Identifier | **GPTA-H-85** |
| Increment identifier | **F2-DP-01** |
| Type | Owner/POA implementation authorization grant — not an implementation result |
| Date | 2026-09-20 |
| Sequence | H-82 → H-83 POA selections → H-84 G-11-C waiver → **H-85 F2-DP-01 persist grant (this record)** → implementation execution (not this record) |
| Does this record overwrite H-80 / H-81 / H-82 / H-83 / H-84 / H-29? | **NO** |
| Does this record execute implementation? | **NO** |
| Does this record complete H-81? | **NO** |
| Does this record authorize Production? | **NO** |
| Does this record authorize F2-I12? | **NO** |

**Authoritative predecessors (not overwritten):**

| Record | Role |
| --- | --- |
| H-29 | Controlling C-spine and commercial-rule baseline |
| H-44 | Prior F2 C1–C10 Dev/Test authorization; F2-I1–I11 freeze remains |
| H-46–H-56 | Already-specified I1 catalogues and I2–I11 preview sidecar maps |
| H-64 | Preview UAT dispositions and persist-before-operational-adoption limitation |
| H-75 | Commercial process adoption YES; software adoption NO |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** — evidence trigger not satisfied |
| H-82 | Option identifiers and §18 grant checklist |
| H-83 | POA selections G-01-C, G-02-D, G-03-B, G-04-B, G-05-E, G-06-B, G-07-A, G-08-B, G-09-B, G-10-C, G-11-C, G-12-C |
| H-84 | Explicit G-11-C H-81 waiver permitting this grant to be written |

---

## 3. Increment identifier

```text
GRANTED INCREMENT IDENTIFIER = F2-DP-01
F2-DP-01 = BOUNDED DEV/TEST DURABLE PERSIST OF ALREADY-SPECIFIED F2 COMMERCIAL-FACTS MAPS
F2-I12 = NOT AUTHORIZED
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I1–I11 SOURCE = FROZEN
F2-DP-01 IS ADDITIVE CONSUMPTION OF ALREADY-SPECIFIED CATALOGUES (H-83 G-12-C)
```

F2-DP-01 is a **new** increment identifier selected by this grant under H-83 **G-12-C**. It is **not** a thaw of F2-I1–I11 source for unrelated edits. It is **not** F2-I12. H-64 GAP-02 / GAP-03 I12-class booking surface remains **not authorized**.

---

## 4. Environment (G-10-C) — Dev/Test coexistence only

```text
AUTHORIZED ENVIRONMENT = DEV/TEST ONLY
G-10-C = COEXISTENCE
MIXED PERSIST CONTINUES
F2 PERSIST IS ADDITIONAL
AUTHORITY FOLLOWS G-03-B
DEV/TEST PERSISTENCE ≠ PRODUCTION PERSISTENCE
PRODUCTION PERSISTENCE ≠ PRODUCTION AUTHORIZATION
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
NO PRODUCTION MIGRATION
NO PRODUCTION HOSTING
NO PRODUCTION DEPLOYMENT
NO PRODUCTION OPERATIONAL CUTOVER
```

**What an implementer may treat as in-scope environment:**

- Dev/Test only.
- Dual-path coexistence already described in H-82: mixed persist continues when `store.dbPool` is set; F2 commercial-facts maps listed in §5 may be made durable **in addition** on that **same Dev/Test** store.
- Dual-write / dual-read rules: mixed records remain mixed compatibility data; F2 maps remain F2 maps; G-03-B decides authority. Do **not** copy mixed fields into F2 catalogues except as already forbidden below.
- Schema or migration work, **if any**, is permitted **only** as required to persist the §5 maps on **Dev/Test**, and **only** on a store that is **not** Production and **not** `eos_gateb`.

**What an implementer must not treat as authorized:**

- Any Production host, Production database, Production persistence, Production migration, Production deployment, Production cutover, Production geography, Production architecture, or Production provider.
- `eos_gateb` migrate / DROP / migrate() (F1 standing control).
- Bundling parked Class A/B dirty-tree persist work unless a **later** grant names that bundle. **This grant does not.**
- Interpreting “durable” or “SoR when dbPool is set” as Production authorization.

If a store, connection string, or host is Production, or is `eos_gateb`, it is **out of scope**.

---

## 5. Granted catalogue / fact-map scope (G-02-D)

Catalogues, keys, and validators remain those **already specified** in frozen **F2-I1** (`packages/kernel/src/commercial-contract.ts` as frozen I1). This grant **does not** add fields, keys, or commercial rules.

H-82 G-02-D: durable persist of all **existing I2–I11 sidecar maps except booking facts and except KPI history**. H-83 G-02-D / G-07-A: I7-class preview computation remains **non-durable**. H-83 G-06-B: I11-class persist is **identifier trace only** (no freeze-on-send snapshot schema).

**Granted durable maps** (already-specified `f2FactsMemory` sidecar maps; H-47–H-56 preview):

| Already-specified map | Preview origin | Persist content (already specified; not expanded) |
| --- | --- | --- |
| `opportunities` | F2-I2 | Opportunity qualification / loss / ownership / next action. `qualificationStatus` ≠ workflow stage `new_qualified`. |
| `rfps` | F2-I2 / I8 / I9 | RFP SOURCE and CHANNEL (distinct); explicit business receipt; first response; clarification. F2 receipt / first-response require `explicit_business_fact`. `receivedAt ?? now` is **not** F2 receipt. |
| `pathB` | F2-I3 / I4 | Path B qualitative exceptional-approval records and generate/send Path B state. Categories declared, not inferred from 250k/20%. |
| `accounts` | F2-I5 | Account type and F2 market catalogue. Free-string mixed `CrmAccount.market` is **not** F2 market. |
| `rates` | F2-I6 | Supplier-rate identity facts already specified (OR-08 identity). |
| `programmes` | F2-I10 / I11 | Programme commercial facts and **identifier trace** (programme / RFP / costing / proposal links) per G-06-B. **Not** a full cost-line freeze. Mixed `version` integers are **not** Path D proposal versioning. |

**Excluded from this grant (even if I2–I11 preview exists):**

| Exclusion | Controlling record |
| --- | --- |
| Booking commercial-facts map / route / win-copy / cancel | H-83 **G-05-E**; no booking map exists; do not fabricate |
| KPI **history** store | H-83 **G-07-A** / H-82 G-02-D exception |
| I7-class KPI **preview computation** as durable history | H-83 **G-07-A** — remains non-durable. Request-time preview computation from other maps is not a history store and is not KPI-history authorization |
| Freeze-on-send cost-sheet snapshot schema | H-83 **G-06-C** not selected |
| Path D proposal versioning | H-83 **G-06-D** not selected |

Existing preview commercial-facts **routes** that already address the granted maps may be pointed at the durable Dev/Test store for those maps. This grant does **not** invent new public API paths, UI screens, or catalogue keys.

---

## 6. Authority (G-03-B)

```text
FOR FACT TYPES NAMED IN §5: F2 IS AUTHORITATIVE
MIXED FIELDS ARE RETAINED FOR COMPATIBILITY
MIXED MUST NOT BE USED AS F2 REPORTING / RECEIPT / QUALIFICATION / SOURCE / CHANNEL / MARKET AUTHORITY
DURABILITY DOES NOT EQUAL AUTHORITY
```

Binding implementer rules:

- Do **not** copy mixed `receivedAt ?? now` into F2 receipt.
- Do **not** treat workflow stage `new_qualified` as OR-01 qualification.
- Do **not** treat unstructured mixed `source` as F2 SOURCE.
- SOURCE remains distinct from CHANNEL.
- Do **not** treat free-string mixed market (including values such as “Europe” / “Kenya” already rejected by I5 preview tests) as F2 market taxonomy.
- Mapping mixed strings into F2 catalogues is **not** defined here and is **not** authorized (H-82 G-03-C mapping grant was **not** selected).
- Persisting a §5 map does **not** by itself make mixed rows authoritative.

---

## 7. Legacy 250k / 20% (G-04-B)

```text
250K / 20% = LEGACY / NOT AN APPROVED F2 QUALIFICATION RULE
PATH B REMAINS QUALITATIVE
G-04 DOES NOT AUTHORIZE A NEW NUMERICAL COMMERCIAL RULE
```

This grant **may** isolate mixed callers (fail-closed, disabled, or unreachable from F2 generate/send) **without substituting any number**, per H-83 **G-04-B**. It must **not**:

- treat 250k or 20% as F2 Path B or F2 qualification;
- invent a replacement sell threshold, margin floor, CPR, score, or rank;
- infer Path B categories from price or margin.

---

## 8. H-84 G-11-C waiver conditions (mandatory in this grant)

This grant is written **because** H-84 recorded the explicit G-11-C waiver. The following statements are **part of this grant**:

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
H-81 SUBSTANTIVE REVIEW = NOT EXECUTED
THIS IMPLEMENTATION IS NOT FOR MANUFACTURING H-81 EVIDENCE
THIS IMPLEMENTATION IS NOT A FINDING THAT PATH D IS VALIDATED
THIS IMPLEMENTATION IS NOT EOS ADOPTION EVIDENCE
THIS IMPLEMENTATION IS NOT OPERATIONAL SoR CUTOVER
THIS IMPLEMENTATION CANNOT SATISFY THE H-81 EVIDENCE TRIGGER
THIS IMPLEMENTATION CANNOT BE COUNTED AS H-81 EVIDENCE
THIS IMPLEMENTATION CANNOT BE REPRESENTED AS NATURAL POST-H-75 COMMERCIAL EVIDENCE
THIS IMPLEMENTATION CANNOT START OR COMPLETE H-81
THIS GRANT DOES NOT CHANGE THE H-81 EVIDENCE TRIGGER
H-81 REMAINS REQUIRED TO EXECUTE IF AND WHEN ITS GENUINE TRIGGER IS LATER SATISFIED
```

Do **not** search solely to force H-81 start. Do **not** fabricate post-adoption cases.

---

## 9. Current commercial System of Record

```text
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
H-75 PROCESS ADOPTION = YES
H-75 ≠ EOS / SOFTWARE ADOPTION
G-01-C = INTENDED FUTURE SoR FOR NAMED FACT TYPES — NOT A PRESENT CUTOVER
```

The existing commercial System of Record remains Office / Excel / Outlook/Gmail / WhatsApp / phone **unless and until** a separate authorized governance decision changes that status. F2-DP-01 persist does **not** make EOS the live commercial SoR.

---

## 10. H-84 / H-83 exclusions reproduced

This grant does **not** authorize:

| Item | Status |
| --- | --- |
| Production (hosting, persistence, migration, deployment, cutover, geography, architecture, provider) | **NOT AUTHORIZED** |
| Any future Production | Requires a **separate** Production governance grant |
| `eos_gateb` migration | **NOT AUTHORIZED** |
| F2-I12 | **NOT AUTHORIZED** |
| Unrelated I1–I11 source thaw / unrelated I-module edits | **NOT AUTHORIZED** |
| Unrelated Class A/B / application bundling | **NOT AUTHORIZED** |
| Broader EOS implementation beyond §5 | **NOT AUTHORIZED** |
| Mailbox / Excel / WhatsApp / phone ingestion | **NOT AUTHORIZED** |
| FX logic / FX provider | **NOT AUTHORIZED** |
| New commercial rules or numerical thresholds | **NOT AUTHORIZED** |
| Revenue or profit model | **NOT AUTHORIZED** (`sellPrice` ≠ revenue; costing margin ≠ profit) |
| KPI history | **NOT AUTHORIZED** |
| Fabricated booking / cancellation / win-copy facts | **NOT AUTHORIZED** |
| Booking software increment | **NOT AUTHORIZED** (G-05-E) |
| Path D validation | **NOT AUTHORIZED** — Path D remains requirements only |
| Commercial-facts UI | **NOT AUTHORIZED by this persist grant** (H-83 G-08-B remains a **separate** UI grant, only after these facts are durable) |
| Operational adoption claim | **NOT AUTHORIZED** (H-64-FND-06 persist ≠ operational adoption) |

---

## 11. Completion of this increment (no invented acceptance criteria)

F2-DP-01 is **complete as an implementation increment** only when later **implementation evidence** (a subsequent record, not this grant) demonstrates the following, all already supported by H-44 G / H-64-FND-06 / H-82 G-02-D / G-10-C / H-83:

1. The §5 maps are durable on **Dev/Test** coexistence (not lost solely because the process restarts), while mixed persist **continues**.
2. Frozen I1 catalogues were **consumed, not rewritten** (H-83 G-12-C).
3. Booking facts were **not** added. KPI history was **not** added. I7 preview remains non-durable as a history store.
4. G-03-B distinctions in §6 were **not** violated.
5. Environment bounds in §4 were **not** violated (`eos_gateb` untouched; Production untouched).
6. H-84 statements in §8 were **not** violated.

**None of the above is claimed as already done.** This record authorizes execution; it does not record completion. H-44: implementation execution is a separate subsequent step.

UAT of this persist increment, if later sought, is **not** granted by this document (H-62 was preview-only UAT of the frozen in-memory baseline). A separate UAT execution authorization would be required after implementation evidence exists. G-08-B UI is **not** this increment.

---

## 12. Rollback / reversibility

H-44 required rollback / readiness evidence **as required by the F2/F5 governance sequence**, without this record inventing dump/restore mechanics.

If F2-DP-01 is not completed or is reversed:

- F2 commercial facts remain the existing process-local WeakMap preview;
- mixed persist remains as it already exists;
- frozen I1–I11 source remains frozen;
- Production is unaffected because Production is not in scope;
- H-80 / H-81 status is unaffected.

No Production rollback procedure is authorized or required by this grant.

---

## 13. What remains outside scope

Everything not named in §5 and §4, including: UI; ingest; FX; booking; KPI history; revenue/profit; freeze-on-send; Path D versioning; Production; `eos_gateb`; F2-I12; thaw of I1–I11 source; Class A/B bundling; operational SoR cutover; H-81 execution.

---

## 14. Preserved commercial distinctions

```text
DURABILITY DOES NOT EQUAL AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
SELL PRICE ≠ REVENUE
COSTING MARGIN ≠ PROFIT
NO KPI HISTORY EXISTS MERELY BECAUSE PERSISTENCE IS AUTHORIZED
NO BUSINESS RECEIPT / FIRST-RESPONSE FACT MAY BE INVENTED
NO MARKET TAXONOMY MAY BE INVENTED FROM FREE-STRING MARKET DATA
NO LEGACY 250K / 20% LOGIC MAY BE PROMOTED INTO A NEW AUTHORITATIVE F2 RULE
NO BOOKING FACT MAY BE FABRICATED
NO H-81 EVIDENCE MAY BE MANUFACTURED
```

---

## 15. Roles for subsequent execution

| Role | Person | Bound |
| --- | --- | --- |
| Technical Increment Owner | Patrick Makundi | Execute F2-DP-01 only as authorized here |
| UAT Authority | Patrick Makundi | UAT not granted by this record; functions remain distinct |

---

## 16. Sequence after this grant

1. H-83 POA decisions — **COMPLETE**
2. H-84 G-11-C waiver — **COMPLETE**
3. H-85 F2-DP-01 persist authorization — **THIS RECORD**
4. **Implementation execution of F2-DP-01** — not started; not performed by this record
5. Implementation evidence record — after execution
6. Separate UI grant (G-08-B) — only after durable §5 facts; **not** this record
7. H-81 — only if genuine evidence trigger is later satisfied; **not** started by persist
8. Production — **separate** grant only

```text
NEXT GATE AFTER THIS GRANT = IMPLEMENTATION EXECUTION OF F2-DP-01 WITHIN THIS GRANT
THIS RECORD DOES NOT PERFORM THAT EXECUTION
NEXT SOFTWARE ACTION AFTER EXECUTION EVIDENCE = NOT AUTHORIZED HERE
PRODUCTION = STILL NOT AUTHORIZED
```

---

## 17. Repository baseline

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved |
| Application / schema / migration / UI / API / infrastructure change by this record | **NONE** |
| H-80 / H-81 / H-82 / H-83 / H-84 / H-29 / I1–I11 source modified by this record | **NO** |

---

## 18. Status block

```text
GPTA-H-85 = F2-DP-01 BOUNDED DEV/TEST F2 FACTS PERSIST IMPLEMENTATION AUTHORIZED
IMPLEMENTATION RESULT = NOT CLAIMED
IMPLEMENTATION EXECUTION = NOT STARTED
F2-DP-01 MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
F2-I1–I11 = FROZEN
PRODUCTION = NOT AUTHORIZED
NO eos_gateb MIGRATION
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
THIS GRANT IS NOT H-81 EVIDENCE
THIS GRANT IS NOT EOS OPERATIONAL ADOPTION
THIS GRANT IS NOT PATH D VALIDATION
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
NEXT GATE = IMPLEMENTATION EXECUTION OF F2-DP-01
```
