# GPTA-H-49 — F2-I4 In-Memory Proposal Generation Path B

> **`F2-I4 IMPLEMENTATION EVIDENCE — PREVIEW GENERATE PATH B`**  
> **`NOT UAT`** · **`NOT FULL C7/C8 COMPLETION`** · **`NOT PRODUCTION READINESS`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / PERSISTENCE REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T16:48:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-48 historical bodies are **not rewritten**.

---

## Authorization

F2 remains authorized (H-44). F2-I1, I2, I3 remain completed.

Closes the H-48 residual: in-memory `generateProposal` no longer depends on the mixed numerical gate.

---

## Preview generation branch changed

`generateProposal` in `apps/api/src/proposal/proposal.ts`:

* **`!isDurableSoR` (preview):** Path B via existing `evaluatePreviewPathBSend`. `not_required` or `approved` → generate if programme + costing exist. Outstanding Path B → `conflict` / `path_b_approval_required`. Legacy `ComApprovalRequest` is **not** required.
* **`isDurableSoR`:** unchanged — still `canGenerateProposal` with approved `ComApprovalRequest` (`commercial_approval_required` if missing).

Send remains `transitionProposalStatus` → `sent` (I3). Generation and send stay distinct.

`approvalRequestId` is optional on `PropProposal` so preview generate can omit a legacy request id.

---

## Behavior

| Case | Result |
| --- | --- |
| Path B `not_required` | Preview generate succeeds |
| Path B required and `approved` (all declared categories) | Preview generate succeeds |
| Path B required and not approved | Preview generate blocked (`path_b_approval_required`) |
| Multiple categories | All preserved; approval is for the declared set |

Categories remain **declared, not inferred**. `285000` does not create a Path B requirement.

---

## Legacy 250k / 20%

**Retained.** `evaluateCommercialApprovalGate`, `DEFAULT_SELL_THRESHOLD_USD`, mixed `requestCommercialApproval` **not modified**. Durable generate still requires `ComApprovalRequest`.

---

## Durable / mixed

Unchanged. Test 6: after setting `store.dbPool`, generate without `ComApprovalRequest` returns `commercial_approval_required` while Path B remains `not_required`.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/proposal/proposal.ts` | Preview vs durable generate branch (additive) |
| `packages/kernel/src/proposal.ts` | `approvalRequestId` optional |
| `apps/api/src/commercial-facts/path-b.ts` | Comment only — reuse I3 eligibility |
| `apps/api/src/f2-i4.in-memory-generation-path-b.test.ts` | **Created** |
| `apps/api/src/c8.proposal.test.ts` | Preview generate without legacy request now 201 |
| `apps/api/src/f2-i3.path-b-c7-preview.test.ts` | Test B: generate before declaring Path B so send-gate remains the I3 assertion |

**Not changed:** mixed `commercial-approval/approval.ts`, persist, schema, migrations, Gate B, `server.ts`.

---

## Tests executed

```text
npx vitest run src/f2-i4.in-memory-generation-path-b.test.ts src/f2-i3.path-b-c7-preview.test.ts src/c8.proposal.test.ts src/f2-i2.commercial-facts.test.ts
```

**4 files, 19 tests passed.**

---

## Remaining residuals

* Mixed `requestCommercialApproval` still uses `evaluateCommercialApprovalGate` (250k/20%).
* Durable generate still requires `ComApprovalRequest`.
* Path B still in-memory only; categories still declared.
* C1 PCO/market still not on CRM seed; I2 facts still sidecar-only.

---

## Next increment (from I4 evidence)

**F2-I5 — in-memory C1 OR-03 / OR-03-M** (distinct PCO account type + 15-value market) on the preview CRM path, additive, no persist/schema.

Rationale: preview C7 generate+send Path B is bridged. The mixed numerical **request** endpoint was out of I4 scope. Next unused in-scope facts are C1 taxonomy on preview.

---

## Governance status

```text
GPTA-H-49 STATUS = F2-I4 IN-MEMORY PROPOSAL GENERATION PATH B COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
F2-I4 = COMPLETED
SCOPE = C7 / IN-MEMORY PROPOSAL GENERATION / DEV-TEST ONLY

PREVIEW GENERATE = PATH B not_required OR Path B approved
OUTSTANDING PATH B = BLOCKS GENERATE
LEGACY 250K / 20% GATE = RETAINED ON MIXED REQUEST / DURABLE GENERATE
DURABLE GENERATE = STILL REQUIRES ComApprovalRequest

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
