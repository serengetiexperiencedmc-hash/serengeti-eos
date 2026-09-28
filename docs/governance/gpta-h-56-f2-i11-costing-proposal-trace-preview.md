# GPTA-H-56 — F2-I11 Costing and Proposal Trace Preview

> **`F2-I11 IMPLEMENTATION EVIDENCE — PREVIEW RFP→PROGRAMME→COSTING→PROPOSAL TRACE`**  
> **`NOT UAT`** · **`NOT FULL C5 / C6 / C7 / C8 COMPLETION`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / MIXED COSTING OR PROPOSAL REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T21:38:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-55 historical bodies are **not rewritten**.

---

## Repository state

| Fact | Before / after |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged) |
| Index | **EMPTY** |
| Mixed `costing/sheet.ts`, `proposal/proposal.ts`, `programme/programme.ts` | **DIRTY**, not rewritten |
| Mixed J3 analytics | **not modified** |

No staging, commit, or push.

---

## Authorization

F2 remains authorized only under GPTA-H-44 (C1–C10 Dev/Test). This record executes **F2-I11 only**.

H-55 recorded next increment as **C9 booking win-dimension observation**. This Owner-commissioned record **reassigns F2-I11** to costing/proposal trace. H-55 is **not rewritten**. C9 booking remains unexecuted and is recommended as **F2-I12**.

---

## Inspection findings

| Question | Finding |
| --- | --- |
| Is costing identity available in preview? | **Yes.** Mixed `POST /v1/costing/sheets` stores `programmeId` and `rfpId` copied from the programme (`costing/sheet.ts`). |
| Is proposal identity available in preview? | **Yes.** Mixed generate stores `rfpId`, `programmeId`, and `costSheetId` (`proposal/proposal.ts`). |
| Did I10 already list those rows? | **Yes**, by `programmeId` only. That is **not** a full trace: a sheet/proposal with the same programme id but a mismatched `rfpId` or `costSheetId` would have been counted. |
| Explicit vs inferred | Mixed FKs are **explicit**. Names, dates, amounts, and creation order are **not** relationship evidence. |
| Safe additive path? | **Yes.** Extend `GET /v1/programmes/:id/commercial-facts`. No mixed persist rewrite. No `CostSheetVersion.snapshot`. |
| Missing facts | Remain **unavailable** / **partial**. |
| Approved semantics | H-29 D5 trace RFP → Programme → Costing → Proposal; AC-C5-01. Identifiers only; not revenue/profit. |

---

## Selected capability

Tighten the existing I10 programme commercial-facts GET so a costing or proposal is **on-trace** only when explicit mixed foreign keys align:

* Cost sheet: `programmeId` **and** `rfpId` match the programme.
* Proposal: `programmeId` **and** `rfpId` match the programme **and** `costSheetId` is an on-trace cost sheet.

Mismatched mixed rows are listed as unsupported and do **not** complete the trace.

---

## Trace semantics

| Completeness | Meaning |
| --- | --- |
| **complete** | Explicit RFP row + on-trace costing + on-trace proposal |
| **partial** | Programme exists with some but not all required links |
| **unavailable** | No explicit RFP/costing/proposal link observed |

I10 detail statuses (`partial_rfp_observed`, `partial_costing_observed`, `rfp_programme_costing_proposal_observed`) are **retained** so I10 tests stay intact.

| Kind | Treatment |
| --- | --- |
| Explicit mixed FK chain | **observed** |
| Missing FK / missing record | **unavailable** |
| Same programmeId, mismatched rfpId or costSheetId | **unsupported** (not on-trace) |
| Name / date / amount / order inference | **not used** (`inferredFromName/Date/Amount/CreationOrder = false`) |

`dataSufficiency`: complete → `sufficient`; partial → `partial`; unavailable → `insufficient`.  
`relationshipProvenance`: `explicit_mixed_foreign_key`.

Sell price / costing totals are **not** returned and are **not** revenue.

---

## API behavior

Existing route only: `GET /v1/programmes/:id/commercial-facts`.

Additive fields: `costingIdentities`, `proposalIdentities`, `unsupportedCostSheetIds`, `unsupportedProposalIds`, `trace.completeness`, `dataSufficiency`, inference flags.

Durable SoR remains **409 `f2_i10_in_memory_preview_only`**. I11 extends the I10 route family; splitting a new `f2_i11` token would have changed I10’s established 409 reason. The preview-only boundary is preserved.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/programme.ts` | On-trace FK alignment; identities; completeness; unsupported rows |
| `apps/api/src/f2-i11.c5-costing-proposal-trace-preview.test.ts` | **Created** |
| `docs/governance/gpta-h-56-f2-i11-costing-proposal-trace-preview.md` | This record |
| `docs/governance/gpta-h-19-owner-business-rules-resolution.md` | Additive H-56 pointer |
| `docs/governance/adr-0006-e1-next-action-dependency-register.md` | Additive §95 |
| `docs/governance/adr-0006-e1-c-parallel-work-register.md` | Additive H-56 row |

### Files deliberately not changed

* `apps/api/src/costing/sheet.ts`, `apps/api/src/proposal/proposal.ts`, `apps/api/src/programme/programme.ts`
* `apps/api/src/analytics/commercial.ts`
* `apps/api/src/commercial-facts/kpis.ts`, routes (existing programme GET reused)
* Persistence, schema, migrations, Gate B, `CostSheetVersion.snapshot`

---

## Tests and exact results

Automated tests are **not** UAT.

```text
npx vitest run --maxWorkers=1 src/f2-i11.c5-costing-proposal-trace-preview.test.ts
```

**1 file, 5 tests passed.** Duration 6.42s.

```text
npx vitest run --maxWorkers=1 src/f2-i10.c5-programme-identity-preview.test.ts src/f2-i2.commercial-facts.test.ts src/f2-i4.in-memory-generation-path-b.test.ts src/f2-i6.c4-supplier-rate-identity-preview.test.ts src/f2-i9.c3-first-response-preview.test.ts
```

**5 files, 34 tests passed.** Duration 17.89s.

---

## Status declarations

| Topic | Status |
| --- | --- |
| UAT | **NOT PERFORMED** |
| Persistence / schema / migration | **NOT MODIFIED** |
| Gate B | **NOT TOUCHED** |
| Production | **NOT AUTHORIZED** |
| Commit / push | **NOT PERFORMED** |
| Full C5 / C6 / C7 / C8 claimed | **NO** |

---

## Remaining C5/C6/C7/C8 limitations

* Office remains itinerary document SoR.
* Programme-item vs costing consistency is not validated.
* OR-08 is not written into `CostSheetVersion.snapshot`.
* Path B / mixed 250k gate unchanged (C7).
* Proposal send/content workflow not redesigned (C8).
* C9 booking win-dimension copies remain deferred.
* Identifiers are trace facts only; not revenue, profit, margin, or FX.

---

## Next increment

**F2-I12 — C9 booking win-dimension observation.** Not executed in this record.

---

## Governance status

```text
GPTA-H-56 STATUS = F2-I11 COSTING AND PROPOSAL TRACE PREVIEW COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
F2-I5 = COMPLETED
F2-I6 = COMPLETED
F2-I7 = COMPLETED
F2-I8 = COMPLETED
F2-I9 = COMPLETED
F2-I10 = COMPLETED
F2-I11 = COMPLETED
SCOPE = C5 TRACE IDENTIFIERS / IN-MEMORY PREVIEW / DEV-TEST ONLY

FULL C5 = NOT CLAIMED
FULL C6 = NOT CLAIMED
FULL C7 = NOT CLAIMED
FULL C8 = NOT CLAIMED
COST SHEET VERSION SNAPSHOT = NOT MODIFIED
SELL PRICE / COST TOTALS = NOT REVENUE

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
GATE B = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
