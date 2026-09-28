# GPTA-H-47 — F2-I2 C2/C3 Commercial Facts (In-Memory / Preview)

> **`F2-I2 IMPLEMENTATION EVIDENCE — IN-MEMORY / PREVIEW PATH`**  
> **`NOT UAT`** · **`NOT FULL C2/C3 COMPLETION`** · **`NOT PRODUCTION READINESS`**  
> **`NO SCHEMA / MIGRATION / EOS_GATEB / PERSISTENCE REWRITE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T16:18:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-46 historical bodies are **not rewritten**.

This record is **implementation evidence** for the in-memory/preview C2/C3 facts path. It is **not** planning-only, **not** UAT, and **not** F2 completion.

---

## 1. H-44 authorization reference

```text
GPTA-H-44 STATUS = F2 IMPLEMENTATION AUTHORIZED
IMPLEMENTATION = AUTHORIZED — C1–C10 DEV/TEST ONLY
```

---

## 2. H-45 baseline reference

Kernel-first, then mixed API additive-only; in-memory/preview first; no `eos_gateb` migrate(); Class A/B dirty tree protected.

---

## 3. H-46 I1 reference

Kernel contract in `packages/kernel/src/commercial-contract.ts` is **authoritative**. I2 reused those types. No competing catalogues.

Legacy `evaluateCommercialApprovalGate` / `DEFAULT_SELL_THRESHOLD_USD` remain mixed-caller residuals. **I2 did not replace them.**

---

## 4. Exact I2 scope

Connect I1 C2/C3 facts to the Dev/Test **in-memory/preview** path via a sidecar module and dedicated routes.

**Capability numbering:** H-29 / H-34 / H-45 / H-46 remain controlling (C1 CRM, C2 Opportunity, C3 RFP, C4 Supplier rates, C5 Programme, C6 Costing, C7 Approval, C8 Proposal, C9 Booking, C10 KPI). The I2 commissioning prompt restated C2 = Qualification / C4 = Programme. That mapping is **not** adopted. Qualification facts attach to **opportunity** (H-29 C2). SOURCE/CHANNEL/clarification attach to **RFP** (H-29 C3).

Durable PostgreSQL path: writes return `conflict` / `f2_i2_in_memory_preview_only`. No schema, no migrate(), no persist rewrite.

---

## 5. Files changed

| Path | Change |
| --- | --- |
| `apps/api/src/commercial-facts/memory.ts` | **Created** — process-local WeakMap sidecar (not Store persist) |
| `apps/api/src/commercial-facts/service.ts` | **Created** — qualification, loss, follow-up, SOURCE/CHANNEL |
| `apps/api/src/commercial-facts/routes.ts` | **Created** — GET/PUT opportunity facts; transfer; GET/PUT RFP facts |
| `apps/api/src/f2-i2.commercial-facts.test.ts` | **Created** — focused in-memory API tests |
| `apps/api/src/server.ts` | **B. Mixed** — additive `registerCommercialFactsRoutes` only; pre-existing Class A/B login/health diffs **not rewritten** |

**Not changed:** `pipeline/opportunity.ts`, `rfp/rfp.ts` (except consumption of existing in-memory arrays), persist repositories, `durable.ts`, `commercial-approval/approval.ts`, kernel Path B residual, migrations, schema, Gate B, CRM seed.

---

## 6. C2 implementation evidence

New endpoints (in-memory/preview only):

* `GET/PUT /v1/pipeline/opportunities/:id/commercial-facts`
* `POST /v1/pipeline/opportunities/:id/commercial-facts/transfers`

Observed:

* Create still defaults workflow stage `new_qualified`.
* Commercial facts default `qualificationStatus = not_yet_assessed`.
* `newQualifiedStageIsNotQualification = true` until OR-01 status is `qualified`.
* Qualify requires all nine OR-01-B conditions **and** a next action. Budget is not a condition.
* Owner is present at create (`ownerPrincipalId`); facts record `intakeOwnerPrincipalId` and `ownerExistsBeforeQualification`.

Existing `GET /v1/pipeline/opportunities/:id` still does **not** embed these facts (sanitize unchanged). Residual for a later increment.

---

## 7. C3 implementation evidence

New endpoints:

* `GET/PUT /v1/rfps/:id/commercial-facts`

Observed:

* Primary SOURCE, 0–2 secondaries, CHANNEL, clarification status.
* Max-three secondaries rejected.
* `legacyCollapsedSource` echoes `RfpRecord.source` with `legacyCollapsedSourceAuthoritativeForF2 = false`.
* PUT does **not** write the F2 SOURCE catalogue onto `RfpRecord.source`.

---

## 8. Qualification / OR-01 traceability

| Rule | I2 |
| --- | --- |
| OR-01 status ≠ stage | Enforced on sidecar |
| OR-01-B nine conditions | Required to qualify |
| Budget not mandatory | Not a condition key |
| OR-01-C owner at intake | Create already sets owner; facts refuse qualify without owner |
| OR-01-D timing vs costing | **Represented only** (clarification stamp exists on RFP facts). No hard block on costing in I2 — residual |
| OR-01-E evidence refs | Optional array |
| Numerical qualification thresholds | Not introduced |

---

## 9. SOURCE / CHANNEL traceability

I1 catalogues used. One primary, max two secondaries, independent CHANNEL. Legacy `RfpRecord.source` retained and marked non-authoritative.

---

## 10. Loss-reason traceability

LR-01–LR-12 via I1 `validateClosedLostReasons`. Primary vs contributing. LR-12 explanation required. Recording allowed only when opportunity stage/status is `lost`. Closed-lost transition itself still does not require loss reasons (existing mixed transition unchanged). Residual: enforcing loss-on-transition would edit mixed `opportunity.ts`.

---

## 11. Ownership / follow-up traceability

OR-04-FU: follow-up owner defaults to opportunity owner. Transfer records previous owner, new owner, next action, who, when. Intake owner retained. In-memory `OppOpportunity.ownerPrincipalId` updated on transfer so existing GET shows current owner; history is on the sidecar. No task subsystem. No email/WhatsApp binding.

OR-04 numerical targets remain `NO NUMERICAL TARGET AUTHORIZED`.

---

## 12. Legacy `RfpRecord.source` residual

**Retained.** New F2 code reads it only as `legacyCollapsedSource` and never treats it as AC-S SOURCE. Mixed `sanitizeRfp` still exposes `source`. Callers of GET `/v1/rfps/:id` can still see the collapsed field — documented as non-authoritative for F2.

---

## 13. Legacy 250k / 20% approval residual

**Unchanged in I2.** `apps/api/src/commercial-approval/approval.ts` still calls `evaluateCommercialApprovalGate`. `DEFAULT_SELL_THRESHOLD_USD` remains. Not introduced into C2/C3 facts.

---

## 14. Tests actually executed

```text
npx vitest run src/f2-i2.commercial-facts.test.ts
```

**1 file, 4 tests passed** (vitest 3.2.7).

Not executed: full API suite, Gate B, `eos_gateb`, UAT, kernel re-run (I1 already evidenced).

---

## 15. Remaining gaps

* Facts not on existing opportunity/RFP GET/list payloads
* Durable path unsupported (intentional)
* Loss not required at mixed `lost` transition
* OR-01-D not enforced against costing/proposal
* CRM PCO seed still absent
* Path B not wired through mixed C7
* No persistence / no UAT / no C10 KPI pack

---

## 16. Proposed next increment

**F2-I3 — Path B approval on the in-memory/preview mixed C7 caller**, replacing `evaluateCommercialApprovalGate` **use** in `commercial-approval/approval.ts` with `evaluatePathBCommercialApproval`, without deleting the legacy kernel function, without numerical CPR, and without persist/schema changes.

Rationale from I2 evidence: C2/C3 facts now have an observable Dev/Test path; the largest remaining **in-scope governance conflict** is still the mixed 250k/20% gate that I1/I2 were forbidden to rewrite.

If I3 cannot patch that mixed file additively without disturbing Class A/B persist/outbox, stop and record the blocker.

---

## Governance status

```text
GPTA-H-47 STATUS = F2-I2 C2/C3 COMMERCIAL FACTS IMPLEMENTATION COMPLETED

F2 = AUTHORIZED
F2-I1 = COMPLETED
F2-I2 = COMPLETED
SCOPE = C2/C3 / DEV-TEST ONLY

QUALIFICATION ≠ WORKFLOW STAGE = ENFORCED
OR-01 FACTS = REPRESENTED
SOURCE ≠ CHANNEL = ENFORCED
LOSS LR-01–LR-12 = REPRESENTED
PRIMARY VS CONTRIBUTING LOSS = REPRESENTED
FOLLOW-UP OWNERSHIP = REPRESENTED

LEGACY RfpRecord.source = RETAINED / NON-AUTHORITATIVE FOR F2 CONTRACT
LEGACY 250K / 20% APPROVAL GATE = RETAINED / I2 RESIDUAL
NO NUMERICAL CPR = ENFORCED

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

NEXT IMPLEMENTATION INCREMENT = F2-I3 PATH B ON IN-MEMORY/PREVIEW C7 CALLER
```
