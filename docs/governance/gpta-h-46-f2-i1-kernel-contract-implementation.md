# GPTA-H-46 — F2-I1 Kernel Contract Implementation

> **`F2-I1 IMPLEMENTATION EVIDENCE — KERNEL / DOMAIN CONTRACT`**  
> **`NOT UAT`** · **`NOT C1–C10 COMPLETION`** · **`NOT PRODUCTION READINESS`**  
> **`NO SCHEMA / MIGRATION / PERSISTENCE / GATE B CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T16:06:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-45 historical bodies are **not rewritten**.

This record is **implementation evidence** for the kernel contract. It is **not** planning-only, **not** UAT, and **not** F2 completion.

---

## 1. H-44 authorization reference

```text
GPTA-H-44 STATUS = F2 IMPLEMENTATION AUTHORIZED
F2 = AUTHORIZED
IMPLEMENTATION = AUTHORIZED — C1–C10 DEV/TEST ONLY
OWNER F2 DECISION = AUTHORIZE F2
```

---

## 2. H-45 baseline reference

GPTA-H-45 established the execution baseline: kernel-first additive types; mixed API/persistence additive-only later; no `eos_gateb` migrate(); Path B; M0 no ingest.

Recommended next increment was **F2-I1**. This record executes that increment.

**Capability numbering:** H-29 / H-34 / H-45 remain controlling (C1 CRM, C2 Opportunity, C3 RFP, C4 Supplier rates, C5 Programme, C6 Costing, C7 Approval, C8 Proposal, C9 Booking, C10 KPI). The I1 commissioning prompt restated the shifted C2–C9 mapping; that mapping is **not** adopted. Conflict recorded; types do not encode C-numbers.

---

## 3. Exact I1 scope

Additive kernel/domain contract only:

* OR-03 account types including distinct PCO
* OR-03-M market catalogue (15 values), separate from account type
* OR-01 qualification status + OR-01-B conditions, independent of `new_qualified` stage
* OR-02 LR-01–LR-12 with primary vs contributing
* OR-07 SOURCE and CHANNEL as separate catalogues (max two secondaries)
* OR-06 Path B qualitative exceptional-approval categories
* OR-08 rate identity catalogues (source class, type, currency, season, validity, dates, version/snapshot)
* Type-level OR-04-FU follow-up default and OR-05 send-as-owner gate
* F1 clarification status catalogue (no persistence)

**Not in I1:** schema, migrations, persistence, API, UI, seed-key change, mailbox ingest, FX, DR-008, C11+, numerical CPR, mixed-file rewrite.

---

## 4. Files changed

| Path | Change |
| --- | --- |
| `packages/kernel/src/commercial-contract.ts` | **Created** — F2 catalogues and validators |
| `packages/kernel/src/commercial-contract.test.ts` | **Created** — I1 contract tests |
| `packages/kernel/src/index.ts` | Export `commercial-contract.js` |
| `packages/kernel/src/crm.ts` | Comments: seed types unchanged; market free-text ≠ OR-03-M |
| `packages/kernel/src/opportunity.ts` | Comment: `new_qualified` is a stage, not OR-01 |
| `packages/kernel/src/rfp.ts` | Comment: `RfpRecord.source` is not OR-07 SOURCE |
| `packages/kernel/src/supplier.ts` | Comment: OR-08 identity lives on `SupplierRateIdentityFacts` |
| `packages/kernel/src/commercial-approval.ts` | Path B wrapper `evaluatePathBCommercialApproval`; legacy 250k documented as mixed-caller compatibility |
| `packages/kernel/src/commercial-approval.test.ts` | Legacy numerical-gate tests labelled as mixed-caller behaviour, not Path B |

Existing persisted types (`OppOpportunity`, `RfpRecord`, `CrmAccount`, `ComApprovalRequest`, `SupRate`) were **not** widened, so mixed persist serializers are not forced to emit new columns/fields.

---

## 5. Business rules implemented (kernel contract)

| Rule | I1 representation |
| --- | --- |
| OR-01 | `QualificationStatus` `not_yet_assessed` / `qualified` / `not_qualified`; budget not a mandatory condition key |
| OR-01-B | Nine `QUALIFICATION_CONDITION_KEYS` |
| OR-01-C / OR-04-FU | `defaultFollowUpOwnerPrincipalId` = opportunity owner |
| OR-02 | `LOSS_REASON_CODES` LR-01–LR-12 exactly; `validateClosedLostReasons` |
| OR-03 | `COMMERCIAL_ACCOUNT_TYPE_KEYS` including `pco` |
| OR-03-M | `COMMERCIAL_MARKET_KEYS` (15); disjoint from account types |
| OR-05 | `canSendProposalAsOwner` |
| OR-06 Path B | `PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES` (8 qualitative) |
| OR-07 | `COMMERCIAL_SOURCE_KEYS` / `COMMERCIAL_CHANNEL_KEYS`; `MAX_SECONDARY_COMMERCIAL_SOURCES = 2` |
| OR-08 | `SupplierRateIdentityFacts` + source-class and rate-type catalogues |

`DEFAULT_CRM_ORGANIZATION_TYPE_KEYS` **unchanged** (mixed CRM seed). PCO is represented on the commercial contract, not injected into the CRM seed list.

---

## 6. 250k / 20% remediation status

| Location | Classification | I1 action |
| --- | --- | --- |
| `packages/kernel/src/commercial-contract.ts` | New F2 contract | **No 250k / 20%** (test-enforced) |
| `packages/kernel/src/commercial-approval.ts` `DEFAULT_SELL_THRESHOLD_USD` / `evaluateCommercialApprovalGate` | Legacy mixed-caller API | **Retained** with explicit “not Path B” comment; not used by the new contract |
| `packages/kernel/src/commercial-approval.test.ts` | Legacy tests | Relabelled; behaviour unchanged so mixed callers still compile |
| `apps/api/src/commercial-approval/approval.ts` | **B. Mixed** | **Not modified** — I2/I3 dependency |
| `apps/api/src/costing/sheet.ts` default 20 | **B. Mixed** | **Not modified** |
| `apps/api/src/dev/seed-demo-data.ts` 250000 / 20 | Demo seed | **Not modified** |

**I1 did not authorize or reintroduce numerical CPR.** Residual numerical gates remain in mixed files until a later increment that is allowed to patch those callers.

---

## 7. Tests / validation actually executed

Command (packages/kernel):

```text
npm test -- src/commercial-contract.test.ts src/commercial-approval.test.ts src/opportunity.test.ts
```

Result: **3 files, 24 tests passed** (vitest 3.2.7). Duration ~1.45s.

* `commercial-contract.test.ts` — 9 passed (PCO, market≠type, qualification≠stage, LR-01–12, SOURCE≠CHANNEL, Path B no CPR, no 250k/20% in contract source, rate identity, follow-up/send)
* `commercial-approval.test.ts` — 5 passed (legacy gates + SoD still green)
* `opportunity.test.ts` — 10 passed (stage machine unchanged)

**Not executed:** API suite, Gate B, `eos_gateb`, migrations, UAT, browser.

This is **implementation evidence** for the kernel contract only.

---

## 8. Files deliberately not changed

Persistence (`durable.ts`, repositories), Gate B / E1-D tests, `deployment-config.ts`, `devtest-*`, `packages/db` migrations, schema, compose, CI, web UI, mixed `apps/api/src/crm/*`, `pipeline/*`, `rfp/*`, `costing/*`, `commercial-approval/approval.ts`, preview login, I4 outbox, `packages/kernel/src/commercial-document.ts`, `ports.ts` (pre-existing dirty, untouched).

---

## 9. Protected / mixed-file findings

Confirmed H-45: C1–C10 API modules remain mixed with Class A/B persistence. I1 did **not** modify them.

`evaluateCommercialApprovalGate` remains the mixed API import. Replacing it in I1 would silently change mixed-file behaviour. Path B is additive (`evaluatePathBCommercialApproval` / `evaluatePathBApprovalRequirement`).

---

## 10. Residual gaps

* Qualification / SOURCE / CHANNEL / PCO / LR / Path B **not persisted**
* Mixed API still evaluates 250k/20%
* CRM seed still has no `pco` key
* `RfpRecord.source` still exists as legacy free-text
* Rate `preferredInConflict` still present (F1-C-03 unresolved in software)
* C10 KPI pack not started
* No UAT

---

## 11. Proposed next increment

**F2-I2 — C2/C3 structured facts on in-memory/preview path (additive fields only).**

Wire qualification status, loss catalogue, SOURCE/CHANNEL split, and F1-C-01 owner-at-intake onto mixed API **additively**, without rewriting dual-path persistence and without `eos_gateb` migrate().

If I2 cannot add fields without touching protected persist INSERT shapes, stop and record that blocker rather than migrating.

---

## Governance status

```text
GPTA-H-46 STATUS = F2-I1 KERNEL CONTRACT IMPLEMENTATION COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
SCOPE = C1–C10 / DEV-TEST ONLY

KERNEL CONTRACT = IMPLEMENTED
QUALIFICATION ≠ WORKFLOW STAGE = ENFORCED
SOURCE ≠ CHANNEL = ENFORCED
PCO ACCOUNT TYPE = REPRESENTED
LR-01–LR-12 = REPRESENTED
PATH B = QUALITATIVE APPROVAL CATEGORIES
250K / 20% = NOT AUTHORIZED / NOT IMPLEMENTED IN I1

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
PERSISTENCE = NOT MODIFIED
GATE B = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
DR-008 = DEFERRED
FX PROVIDER = OUT OF SCOPE
M0 = NO INGEST

UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED

NEXT IMPLEMENTATION INCREMENT = F2-I2 C2/C3 STRUCTURED FACTS (IN-MEMORY/PREVIEW, ADDITIVE ONLY)
```

---

## Validation

| Check | Result |
| --- | --- |
| HEAD / branch / empty index | `75ee4c3` / `master` / empty |
| Dirty Class A/B tree preserved | **Yes** |
| Only intended kernel files changed | **Yes** |
| No persistence / Gate B / migration / schema / deploy | **Yes** |
| Kernel I1 tests passed | **Yes — 24/24** |
| Broader C1–C10 / UAT / production | **Not claimed** |

**Files created or updated (this step):**

* Created: `packages/kernel/src/commercial-contract.ts`, `packages/kernel/src/commercial-contract.test.ts`, `docs/governance/gpta-h-46-f2-i1-kernel-contract-implementation.md`
* Updated: kernel `index.ts`, `crm.ts`, `opportunity.ts`, `rfp.ts`, `supplier.ts`, `commercial-approval.ts`, `commercial-approval.test.ts`
* Additive pointers: H-19; next-action register §85; parallel-work H-46 row
