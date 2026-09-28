# GPTA-H-55 — F2-I10 C5/C9 Residual Assessment and Narrow Implementation

> **`F2-I10 IMPLEMENTATION EVIDENCE — PREVIEW C5 PROGRAMME IDENTITY / TRACE`**  
> **`NOT UAT`** · **`NOT FULL C5 COMPLETION`** · **`NOT FULL C9 COMPLETION`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / MIXED PROGRAMME REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T21:26:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-54 historical bodies are **not rewritten**.

---

## Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | Pre-existing Class A/B and F2-I1–I9 uncommitted work **preserved** |
| Mixed `programme/programme.ts`, `costing/sheet.ts`, `crm/account.ts` | **DIRTY** (not rewritten) |
| Mixed J3 analytics | **not modified** |

After this increment: HEAD, branch, and empty index **unchanged**. No staging, commit, or push.

---

## Authorization

F2 remains authorized only under GPTA-H-44 (C1–C10 Dev/Test). This record executes **F2-I10 only**.

---

## Numbering conflict (recorded, not resolved by rewrite)

| Family | C5 | C9 |
| --- | --- | --- |
| **H-29 / H-34 / H-54 controlling** | Programme | Booking |
| **This commissioning prompt’s candidate list** | Costing / supplier rates | Commercial / account relationship |

H-29/H-34 numbering remains controlling. The prompt’s C5/C9 labels map to H-29 **C4+C6** and **C1**. Both families were inventoried. One residual was selected.

---

## C5/C9 residual inventory

| Residual | Numbering | Status before I10 | Gap vs intentional boundary | Safe additive preview? |
| --- | --- | --- | --- | --- |
| OR-08 rate identity | H-29 C4 / prompt C5 | I6 **done** | Remaining: `CostSheetVersion.snapshot`, F1-C-03 winner, FX | Snapshot/winner/FX **no** |
| Costing consumption observation | H-29 C6 / prompt C5 | I6 `GET .../rate-identities` **done** | Writing OR-08 into mixed snapshot needs persist rewrite | **no** (mixed/persist) |
| Programme ↔ RFP identity and costing/proposal trace | H-29 C5 / H-54 next | Mixed programme exists; **no F2 sidecar** | Office remains document SoR; EOS identity trace is approved AC-C5-01 | **yes** |
| Programme item vs costing consistency engine | H-29 C5 | Absent | Would need new consistency rules | **no** (unapproved rule) |
| Account type / market | H-29 C1 / prompt C9 | I5 **done** | Legacy CRM types remain non-authoritative | already previewed |
| Repeat-business from prior booking | H-29 C1 / prompt C9 | I7 uses explicit SOURCE only | Approved to identify via prior booking, but is a second residual | **deferred** (second residual) |
| Strategic-account taxonomy | DR-008 | Deferred | Unapproved flag engine | **no** |
| Booking origin trace + win-time Market/Type/SOURCE copies | H-29 C9 | Mixed FKs exist; no sidecar copies | Immutable-at-win copies are approved but a separate capability | **deferred** |

---

## Residual selected

**H-29 C5 — in-memory programme identity and RFP→Programme→Costing→Proposal trace observation.**

### Reason for selection

* Approved by H-29 AC-C5-01 and H-34 §4.5 (programme identity linked to the RFP being costed/proposed).
* Named by H-54 as the outstanding C-spine residual.
* Additive on the commercial-facts sidecar; mixed `programme.ts` not rewritten.
* In-memory/preview-only; durable returns `f2_i10_in_memory_preview_only`.
* No persistence, schema, J3, FX, numerical targets, or new workflow rules.
* Does not implement costing amount, revenue, profit, or automatic rate selection.

### Residuals deliberately deferred

* H-29 C9 booking win-dimension snapshot (next recommended increment).
* Repeat-business evidence from prior booking (would be a second residual).
* `CostSheetVersion.snapshot` OR-08 write-through.
* F1-C-03 overlap winner selection.
* DR-008 strategic/repeat/direct/agency flags.
* Programme-item vs costing consistency validation.
* FX / mailbox / finance.

---

## Business-rule basis

| Rule | Source | Application in I10 |
| --- | --- | --- |
| Programme identity is that of the RFP being costed/proposed | H-29 AC-C5-01 | Observed mixed `programme.rfpId` plus existing RFP row |
| Costing and proposal reference that programme identity | H-29 D5 | Observed `costSheets.programmeId` / `propProposals.programmeId` |
| Programme version when client-facing content changes | H-29 D5 / H-34 §4.5 | Explicit sidecar observation of a **recorded** `PrgProgrammeVersion` only |
| Office is presentation, not identity | H-29 D5 | `officeDocumentIsNotIdentity: true` |
| Do not invent consistency of dates/items vs costing | stop condition | `itemCostingConsistencyValidated: false` |

No new commercial taxonomy was added.

---

## API and data-model behavior

Routes (additive on existing commercial-facts registration):

* `GET /v1/programmes/:id/commercial-facts`
* `PUT /v1/programmes/:id/commercial-facts`

GET observes, and does not invent:

* RFP / opportunity / organization identity links
* Whether costing sheets and proposals reference the programme
* Recorded mixed client-facing version numbers
* Explicit sidecar version observation, if present

PUT accepts:

* optional `note`
* optional `observedClientFacingVersionNumber` only if that version already exists on the mixed programme version list
* provenance `explicit_business_fact`
* same version resubmitted → idempotent
* different version → `409 programme_version_already_observed`
* unrecorded / non-integer version → `400`

Durable SoR: **409 `f2_i10_in_memory_preview_only`**.

Distinctions preserved: programme identity ≠ costing amount ≠ rate identity ≠ revenue ≠ profit ≠ FX.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/memory.ts` | Additive `programmes` map |
| `apps/api/src/commercial-facts/programme.ts` | **Created** |
| `apps/api/src/commercial-facts/routes.ts` | Additive GET/PUT programme commercial-facts |
| `apps/api/src/f2-i10.c5-programme-identity-preview.test.ts` | **Created** |
| `docs/governance/gpta-h-55-f2-i10-c5-c9-residual-assessment.md` | This record |
| `docs/governance/gpta-h-19-owner-business-rules-resolution.md` | Additive H-55 pointer |
| `docs/governance/adr-0006-e1-next-action-dependency-register.md` | Additive §94 |
| `docs/governance/adr-0006-e1-c-parallel-work-register.md` | Additive H-55 row |

### Files deliberately not changed

* `apps/api/src/programme/programme.ts` (mixed / dirty)
* `apps/api/src/costing/sheet.ts`, `apps/api/src/crm/account.ts`, booking modules
* `apps/api/src/analytics/commercial.ts`
* Persistence, schema, migrations, Gate B, `server.ts`

---

## Tests and exact results

Automated tests are **not** UAT.

```text
npx vitest run --maxWorkers=1 src/f2-i10.c5-programme-identity-preview.test.ts
```

**1 file, 6 tests passed.** Duration 6.17s.

```text
npx vitest run --maxWorkers=1 src/c5.programme.test.ts src/f2-i2.commercial-facts.test.ts src/f2-i5.c1-account-market-preview.test.ts src/f2-i6.c4-supplier-rate-identity-preview.test.ts src/f2-i9.c3-first-response-preview.test.ts
```

**5 files, 35 tests passed.** Duration 17.89s.

---

## Status declarations

| Topic | Status |
| --- | --- |
| UAT | **NOT PERFORMED** |
| Persistence / schema / migration | **NOT MODIFIED** / **NOT CREATED OR EXECUTED** |
| Gate B | **NOT TOUCHED** |
| Production | **NOT AUTHORIZED** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Full C5 completion claimed | **NO** |
| Full C9 completion claimed | **NO** |

---

## Remaining C5/C9 limitations

* Office remains the operational itinerary document SoR.
* Programme-item / costing consistency is not validated.
* C9 booking win-time Market / account type / SOURCE copies are not implemented.
* Repeat-business from prior booking is not implemented (I7 still uses explicit SOURCE).
* Mixed costing snapshot still does not store OR-08.

---

## Next increment

**F2-I11 — C9 booking win-dimension observation** (immutable-at-win copies of Market / account type / SOURCE when those sidecar facts already exist; missing facts remain unavailable). Not executed in this record.

---

## Governance status

```text
GPTA-H-55 STATUS = F2-I10 C5/C9 NARROW RESIDUAL COMPLETED

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
SCOPE = C5 PROGRAMME IDENTITY/TRACE / IN-MEMORY PREVIEW / DEV-TEST ONLY

FULL C5 = NOT CLAIMED
FULL C9 = NOT CLAIMED
C9 BOOKING WIN DIMENSIONS = DEFERRED
COST SHEET VERSION SNAPSHOT = NOT MODIFIED
DR-008 = STILL DEFERRED

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
