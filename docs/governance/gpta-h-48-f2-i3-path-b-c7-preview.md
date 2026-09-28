# GPTA-H-48 — F2-I3 Path B on In-Memory / Preview Proposal Send

> **`F2-I3 IMPLEMENTATION EVIDENCE — PATH B PREVIEW SEND GATE`**  
> **`NOT UAT`** · **`NOT FULL C7/C8 COMPLETION`** · **`NOT PRODUCTION READINESS`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / PERSISTENCE REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T16:28:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-47 historical bodies are **not rewritten**.

---

## Authorization

F2 remains authorized (H-44). F2-I1 and F2-I2 remain completed.

**Numbering:** H-29 / H-34 / H-45 / H-46 remain controlling. **C7 = Approval**, **C8 = Proposal**. This I3 commissioning prompt labelled the proposal send path “C7”. Implementation is Path B (C7 semantics) consumed at **proposal send** (`transitionProposalStatus` → `sent`, H-29 C8). Conflict recorded; no scope expansion.

---

## Exact preview path changed

Inspected call path:

1. `POST /v1/proposals` → `generateProposal` (still requires a **legacy** `ComApprovalRequest` with `status === "approved"`).
2. `POST /v1/proposals/:id/transitions` `{ toStatus: "sent" }` → `transitionProposalStatus` — **this is the preview send decision**.
3. Mixed `requestCommercialApproval` still calls `evaluateCommercialApprovalGate` (250k/20%). **Not modified in I3.**

I3 additive Path B:

* Declare categories: `PUT /v1/rfps/:id/path-b-approval`
* Inspect: `GET /v1/rfps/:id/path-b-approval`
* Decide: `POST /v1/rfps/:id/path-b-approval/decision` (SoD via `commercial:decide:approval`)
* Send gate in clean `proposal.ts`: if Path B `required` and not `approved`, send returns `conflict` / `path_b_approval_required`
* `GET /v1/proposals/:id` includes additive `pathBApproval`

No exceptional categories ⇒ `not_required` ⇒ send proceeds (Test A).

---

## Path B categories consumed

I1 `PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES` (all eight). Multiple categories preserved. No ranking. No numerical CPR.

---

## Files changed

| Path | Notes |
| --- | --- |
| `apps/api/src/commercial-facts/path-b.ts` | **Created** |
| `apps/api/src/commercial-facts/memory.ts` | Additive `pathB` map |
| `apps/api/src/commercial-facts/routes.ts` | Additive Path B routes |
| `apps/api/src/proposal/proposal.ts` | **Clean vs HEAD** — +15 lines send gate + `pathBApproval` on detail |
| `apps/api/src/f2-i3.path-b-c7-preview.test.ts` | **Created** |

**Not changed:** `commercial-approval/approval.ts` (mixed legacy gate preserved), persist, schema, migrations, Gate B, `server.ts`.

---

## Tests executed

```text
npx vitest run src/f2-i3.path-b-c7-preview.test.ts src/c8.proposal.test.ts src/f2-i2.commercial-facts.test.ts
```

**3 files, 13 tests passed** (5 I3 + 4 C8 + 4 I2).

* Test A: no category → send allowed  
* Test B: one category → send blocked until Path B approved (SoD)  
* Test C: three categories preserved  
* Test D: 285000 sell price does **not** require Path B; `evaluatePathBApprovalRequirement` has no numerical threshold  
* Test E: `POST /v1/commercial-approvals/request` still `gateType: sell_threshold`; kernel `evaluateCommercialApprovalGate` unchanged after Path B PUT  

UAT **not** performed.

---

## Residuals

* Mixed `evaluateCommercialApprovalGate` / `DEFAULT_SELL_THRESHOLD_USD` **retained**. `generateProposal` still requires a legacy approved `ComApprovalRequest`.
* Durable path skips Path B (`f2_i3_in_memory_preview_only` on Path B routes).
* Path B categories are **declared**, not inferred from costing.

---

## Next increment (from I3 evidence only)

**F2-I4 — in-memory generate independent of the legacy numerical gate when Path B is `not_required` or Path B-approved**, without deleting or globally replacing `evaluateCommercialApprovalGate` in mixed `commercial-approval/approval.ts`.

If that generate change cannot be isolated from C8/mixed persist, stop and keep generate as a documented residual.

---

## Governance status

```text
GPTA-H-48 STATUS = F2-I3 PATH B C7 PREVIEW IMPLEMENTATION COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
F2-I3 = COMPLETED
SCOPE = C7 / IN-MEMORY PREVIEW / DEV-TEST ONLY

PATH B = QUALITATIVE CATEGORIES CONSUMED AT PREVIEW SEND
LEGACY 250K / 20% GATE = RETAINED / NOT GLOBALLY REPLACED
GENERATE STILL REQUIRES LEGACY ComApprovalRequest = I3 RESIDUAL

SCHEMA = NOT MODIFIED
MIGRATIONS = NOT CREATED OR EXECUTED
EOS_GATEB = NOT TOUCHED
PRODUCTION = NOT AUTHORIZED
C11+ = NOT AUTHORIZED
DR-008 = DEFERRED
FX PROVIDER = OUT OF SCOPE
M0 = NO INGEST

UAT = NOT PERFORMED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
