# GPTA-H-92 — H-91 Live Dev/Test F2-DP-01 Persistence/Retrieval Execution Evidence and Audit

> **`EXECUTION EVIDENCE AND INDEPENDENT AUDIT`**  
> **`NOT AN AUTHORIZATION`**  
> **`NOT A NEW IMPLEMENTATION GRANT`**  
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
**Auditable timestamp:** **2026-09-21T01:17:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-92 STATUS = H-91 LIVE DEV/TEST PERSIST/RETRIEVE EXECUTION EVIDENCE RECORDED AND AUDITED

INCREMENT IDENTIFIER = F2-DP-01
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
H-91 EXECUTION CLASSIFICATION = PASS WITH FINDINGS
THIS RECORD IS NOT AN AUTHORIZATION
THIS RECORD DOES NOT GRANT IMPLEMENTATION
THIS RECORD DOES NOT START H-81
THIS RECORD IS NOT H-81 EVIDENCE
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
NO GLOBAL migrate()
NO SCHEMA CHANGE
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
```

This record documents **completed H-91 execution** and an **independent audit** of that execution against H-91. It does **not** grant further work. H-36 F1-C-11 remains: authorization ≠ later operational adoption.

H-80 through H-91 and H-29 are **not overwritten**.

---

## 1. Purpose

Record that GPTA-H-91 was **executed as authorized**: the already-implemented F2-DP-01 persistence/read/hydration boundary was technically validated against isolated Dev/Test PostgreSQL, using six synthetic fact-map records only.

Independently audit that evidence. Classify the execution. Document findings. **Do not remediate** them under this record.

This document is **evidence and audit only**. It is **not** an H-81 evidence record.

---

## 2. Governing predecessor records

| Record | Role |
| --- | --- |
| H-29 | Controlling C-spine / commercial-rule baseline |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-85 | F2-DP-01 persist **implementation** authorization |
| H-86 | Implementation artifacts / in-process technical tests |
| H-87 | Live Dev/Test PG grant; `migrate()` STOP |
| H-88 | 124-only apply mechanism; implementation + audit **PASS** |
| H-89 | Migration 124-only execution authorization |
| H-90 | H-89 execution evidence; audit **PASS**; persist/retrieve **not yet performed** at that time |
| **H-91** | **Controlling execution authorization** for the persist/retrieve validation audited here |

Authority: **Patrick Makundi** (company POA; instrument number not recorded / not invented). H-91 Owner/POA decision: **APPROVED**.

H-91 SHA-256 at H-92 creation: `F7FC89A65C3E861117D131ACD01F8AEF3F8809D84F6452B0AB9C51AD4A5734D3`.  
H-90 SHA-256 (unchanged): `419428AFACFE1720920E8308DE569A5C7901BFFCA0148ABFD8C677789C824620`.

No material conflict was found between the predecessor chain and the supplied H-91 execution evidence. H-90 correctly recorded that persist/retrieve had not yet been validated; H-91 then authorized that validation; execution followed.

---

## 3. H-91 authorization summary

H-91 authorized **only** technical validation of the **already-implemented** F2-DP-01 persistence boundary in isolated Dev/Test PostgreSQL:

1. Write each authorized fact-map type through the existing application persistence path.
2. Read each persisted test record through the existing application read/repository path.
3. Confirm field-level round-trip integrity of already-defined data.
4. Exercise existing restart/hydration **if already implemented**, without new functionality.
5. Remain limited to the six sidecar tables.

Authorized catalogues: `opportunities`, `rfps`, `pathB`, `accounts`, `rates`, `programmes`. I11 identifier-trace only. Frozen I1 catalogues consumed only as already specified. F2-I12 **not** authorized. No new schema. No implementation changes. No Production / UAT / Gate B / stand-in.

---

## 4. Execution classification

```text
H-91 EXECUTION = PASS WITH FINDINGS
```

This audit **does not** upgrade the result to an unqualified PASS. It **does not** downgrade it to FAIL. The findings below are technical limitations of the bounded test, not authorization breaches.

---

## 5. Repository pre/post state (H-91 execution)

| Fact | H-91 execution | This H-92 documentation action |
| --- | --- | --- |
| Branch | `master` | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Index | **EMPTY** | **EMPTY** |
| Porcelain | **410 → 410** | **410 → 411** (this file only; expected) |
| Source / schema / migration change | **NONE** | **NONE** |
| Prior governance records modified | **NO** | **NO** |
| Commit | **NONE** | **NONE** |
| Push | **NONE** | **NONE** |

Throwaway helper scripts used during H-91 execution were removed. The pre-existing dirty worktree was preserved.

---

## 6. Target identity

Controlling identity is the **application TCP** connection used for persist/retrieve, not a Docker Unix-socket `psql` session.

| Item | Recorded (credentials redacted) |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `eos` |
| Live `current_database()` | `eos` |
| Live TCP `inet_server_port()` | `5432` |
| Compose container / service identity | `compose-postgres-1` (`infra/compose/dev.yaml`) |
| Image class | `postgres:16-alpine` |
| PostgreSQL | **16.15** alpine |
| `isProductionLikeEnv` | **false** |
| `EOS_DATABASE_URL` in the execution process | unset |
| Persist decision | `{ persist: true }` |
| Gate B `127.0.0.1:5434` / `eos_gateb` | **not used** |
| Stand-in `eos_devtest_f2_dp01` / in-process memory pool | **not used** |
| Production / UAT | **not used** |

**Unix-socket distinction:** a `docker exec` `psql` session over the container Unix socket can return `inet_server_port()` as null because that session is not a TCP connection. That null is **not** evidence against the application TCP target. The persist/retrieve path connected as `127.0.0.1:5432/eos` and received `current_database()=eos` and `inet_server_port()=5432`. That TCP identity is controlling.

---

## 7. Schema boundary

| Item | Pre (H-91 execution) | Post (H-91 execution) |
| --- | --- | --- |
| Public relations | the six F2-DP-01 sidecar tables only | same six |
| Row counts | 0 / 0 / 0 / 0 / 0 / 0 | 1 / 1 / 1 / 1 / 1 / 1 |
| `schema_migrations` | **absent** | **absent** |
| `migrate()` / 124 / 001–123 / 125+ | not run | not run |
| Mixed tables | absent | absent |

Isolation: validation remained limited to:

1. `f2_opportunity_facts`
2. `f2_rfp_facts`
3. `f2_path_b`
4. `f2_account_facts`
5. `f2_rate_identities`
6. `f2_programme_facts`

---

## 8. Six fact-map validation results

Synthetic identifiers (not genuine commercial facts). Schema columns are UUID; H91 labels are deterministic test identifiers recorded in already-defined string fields and/or this evidence map.

| Label | Map | Write (existing persist path) | PostgreSQL row | Application read after cache clear | Field-level round-trip |
| --- | --- | --- | --- | --- | --- |
| `H91-TEST-OPP-001` | opportunities | **OK** | **yes** | **yes** (`readOpportunityFacts`) | **preserved** |
| `H91-TEST-RFP-001` | rfps | **OK** | **yes** | **yes** (`readRfpFacts`) | **preserved** |
| `H91-TEST-PATHB-001` | pathB | **OK** | **yes** | **yes** (`readPathB`) | **preserved** |
| `H91-TEST-ACCOUNT-001` | accounts | **OK** | **yes** | **yes** (`readAccountFacts`) | **preserved** |
| `H91-TEST-RATE-001` | rates | **OK** | **yes** | **yes** (`readRateIdentities`) | **preserved** |
| `H91-TEST-PROGRAMME-001` | programmes | **OK** | **yes** | **yes** (`readProgrammeFacts`) | **preserved** |

Direct SQL confirmed row presence as **supporting** structural evidence. It was **not** a substitute for the application read path.

I11 remained identifier-trace only (programme `note` marker). No new catalogue. I1–I11 not thawed. F2-I12 not tested.

---

## 9. Application write results

Each of the six maps was persisted through the **existing** F2-DP-01 application persistence path (`writeOpportunityFacts` / `writeRfpFacts` / `writePathB` / `writeAccountFacts` / `writeRateIdentity` / `writeProgrammeFacts` → repository upsert on the live pool). All six writes succeeded. A corresponding PostgreSQL sidecar row existed for each.

No alternative persistence mechanism was introduced to make the test pass.

---

## 10. Application read results

Process-local F2 maps were cleared after write. Each record was then retrieved through the existing application read functions listed in §8. All six application reads succeeded. Deterministic H91 markers survived on the application read path.

---

## 11. Round-trip findings

Byte-identical `JSON.stringify(written) === JSON.stringify(read)` **failed**.

This audit **does not** treat that inequality as data-loss evidence by itself.

PostgreSQL **JSONB canonicalizes object key order**. Canonicalization can change serialization key order **without** changing the represented data. Field-level payload integrity was independently confirmed (SQL pretty-print of payloads plus application-read markers). **Byte-identical serialization is not claimed.**

Preserved technical facts (not business facts):

- opportunity `qualificationStatus` remained `not_yet_assessed`;
- RFP had **no** fabricated `receivedAt` or first-response timestamps;
- Path B remained `status=not_required` with empty categories;
- account stored identifiers/timestamps only — no invented market or accountType;
- rate used existing catalogue keys, currency `XXX`, future test window `2099-01-01`–`2099-01-02`, and was **not** treated as price, revenue, or FX;
- programme test was identifier-trace only.

---

## 12. Hydration result

```text
HYDRATION VALIDATION = PASS
```

Existing `hydrateF2CommercialFacts` **was exercised** against a fresh `seedStore` and the live Dev/Test pool (the same function `main.ts` calls when F2-DP-01 persist is enabled). Counts reconstructed: **1 / 1 / 1 / 1 / 1 / 1**. All six H91 records were present in the reconstructed in-memory maps.

---

## 13. Process-restart limitation

```text
FULL APPLICATION PROCESS RESTART / STARTUP VALIDATION = NOT PERFORMED
```

A full `main.ts` process restart was **not** performed because that startup path would also invoke mixed `migrate()` / `syncStoreToPostgres` behavior against the intentionally 124-only Dev/Test schema. H-91 did **not** authorize that.

**Hydration ≠ full application startup validation.** These must not be conflated. This audit does **not** recommend building a restart mechanism.

---

## 14. Synthetic test-data handling

All six records were explicitly synthetic Dev/Test fixtures. They are **not** genuine commercial facts. They do **not** represent real clients, RFPs, bookings, receipt history, response-time history, revenue, profit, KPI history, or FX.

Required type fields (for example rate `sourceClass` / `rateType`) consumed **already-specified frozen catalogues**. They were not promoted into live commercial history.

---

## 15. Cleanup finding

No authorized application-level delete mechanism exists on the F2-DP-01 persistence path (select / upsert / list only).

Therefore the six deterministic synthetic rows **remain** in isolated Dev/Test `eos`. This is **controlled Dev/Test residue**, not a governance failure.

This audit does **not** delete them, does **not** create a delete mechanism, and does **not** issue a broad SQL `DELETE`. Pre-test row counts were zero; no unrelated rows were destroyed.

Leftover labels: `H91-TEST-OPP-001`, `H91-TEST-RFP-001`, `H91-TEST-PATHB-001`, `H91-TEST-ACCOUNT-001`, `H91-TEST-RATE-001`, `H91-TEST-PROGRAMME-001`.

---

## 16. Explicit non-actions

This H-92 record does **not**:

- perform another persist/retrieve test;
- insert or delete test data;
- modify application code, schema, or migration 124;
- change JSON serialization or add canonicalization logic;
- add deletion APIs;
- change hydration or startup;
- apply migrations or fabricate `schema_migrations`;
- authorize UI, ingestion, booking, KPI history, revenue, profit, FX, F2-I12, I1–I11 thaw, Path D, SoR cutover, UAT, or Production;
- start or complete H-81;
- remediate the documented findings;
- create H-93;
- commit or push.

Legacy **250k / 20%** remains **legacy**.

---

## 17. Governance state

```text
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
H-91 EXECUTION IS NOT H-81 EVIDENCE
TECHNICAL PERSISTENCE ≠ EOS ADOPTION
TECHNICAL PERSISTENCE ≠ COMMERCIAL-PROCESS ADOPTION
DEV/TEST ≠ PRODUCTION
HYDRATION ≠ FULL APPLICATION STARTUP VALIDATION
DURABILITY ≠ AUTHORITY
QUALIFICATION ≠ WORKFLOW STAGE
SOURCE ≠ CHANNEL
SYNTHETIC TEST DATA ≠ GENUINE COMMERCIAL FACTS
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
LEGACY 250K / 20% REMAINS LEGACY
F2-DP-01 = NOT COMPLETE
```

Successful technical validation is **not** a commercial-system go-live.

---

## 18. Independent audit findings

### A. Authorization fidelity — PASS

Only the six authorized maps were tested. I11 remained identifier-trace. No new catalogue. No I1–I11 thaw. F2-I12 not tested.

### B. Environment integrity — PASS

Application TCP target was `127.0.0.1:5432/eos`; compose identity `compose-postgres-1`; Dev/Test; non-production-like; Gate B and stand-in excluded. Unix-socket `inet_server_port()` null is not controlling.

### C. Persistence integrity — PASS

All six writes succeeded through the existing F2-DP-01 path. Corresponding PostgreSQL rows existed. Application read — after cache clear — returned each record.

### D. Round-trip integrity — PASS WITH FINDING

Field-level payload integrity succeeded. Byte-identical `JSON.stringify` equality is not claimed. JSONB key-order canonicalization explains the serialization mismatch without establishing data loss.

### E. Business-fact integrity — PASS

No fabricated RFP receipt time, response-time KPI, revenue, profit, FX, booking, market taxonomy, or qualification authority. `sellPrice` was not treated as revenue. Costing margin was not treated as profit.

### F. Hydration integrity — PASS, with restart limitation recorded separately

`hydrateF2CommercialFacts` was exercised and reconstructed all six records. Full application process restart/startup validation = **NOT PERFORMED**.

### G. Cleanup finding — DOCUMENTED, NOT A BREACH

Six synthetic Dev/Test rows remain because no authorized application delete path exists. Not remediated under this audit.

### H. Repository integrity — PASS

HEAD, branch, and empty index unchanged by H-91 execution. Porcelain 410 → 410 during execution. No source files modified. No prior governance records modified. No commit. No push. This H-92 file increases porcelain by one, as expected.

---

## 19. Conclusion

H-91 execution evidence is formally recorded and independently audited as **PASS WITH FINDINGS**.

Findings (not authorization breaches):

1. JSONB key-order difference prevents byte-identical `JSON.stringify` equality; field-level integrity succeeded.
2. Full `main.ts` process restart was not performed because doing so would cross the H-91 migration/mixed-schema boundary.
3. Six deterministic synthetic Dev/Test rows remain because no authorized application-level deletion path exists.

```text
GPTA-H-92 = H-91 EXECUTION EVIDENCE RECORDED AND AUDITED
CLASSIFICATION = PASS WITH FINDINGS
THIS RECORD GRANTS NO NEW AUTHORIZATION
H-81 = NOT STARTED
THIS RECORD IS NOT H-81 EVIDENCE
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

---

## 20. Next governance gate

This record **does not authorize** the next action.

```text
LOGICAL NEXT GATE = SEPARATE OWNER/POA GOVERNANCE DECISION WHETHER THE F2-DP-01 DEV/TEST PERSISTENCE BOUNDARY IS SUFFICIENTLY VALIDATED TO PROCEED TO THE NEXT BOUNDED INCREMENT
THIS RECORD DOES NOT MAKE THAT DECISION
THIS RECORD DOES NOT AUTHORIZE PRODUCTION, EOS COMPLETION, H-81, SoR CUTOVER, UI, INGESTION, BOOKING, KPI, REVENUE, PROFIT, FX, F2-I12, OR UNRELATED WORK
```
