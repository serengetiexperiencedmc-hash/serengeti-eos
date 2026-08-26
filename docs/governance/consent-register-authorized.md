# Selection — Consent Register

> **CURRENT STATE (2026-08-26 Operator P3 CONSENT REGISTER PREVIEW AUTHORIZED — Dev/Test Preview PASS)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`8fa8ddcb5c1c40715e5ba3fa3c7765c8bb08a4e9`** (ITE1 Development/Test governance closure; ITE1 and E2 remain **CLOSED / ACCEPTED**).  
> This record records **CONSENT_UNDEFER=AUTHORIZED**, **CAPABILITY_ID=P3**, **STAGE_1_APPROVED=YES**, **CONSENT_IMPLEMENTATION=COMPLETE**, and **CONSENT_PREVIEW=PASS**.  
> **CONSENT_STAGE1=APPROVED** · **CONSENT_STAGE1_APPROVAL=YES** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED**  
> **CONSENT_IMPLEMENTATION=COMPLETE** · **CONSENT_PREVIEW=PASS** · **CONSENT_COMMIT=NOT_AUTHORIZED** · **CONSENT_PUSH=NOT_AUTHORIZED**  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN**  
> Approved Stage 1 contract: [`../architecture/consent-register-preview.md`](../architecture/consent-register-preview.md).

**Date:** 2026-08-26  
**Authority (undefer):** Operator **PRODUCT OWNER DECISION — UNDEFER CONSENT REGISTER + AUTHORIZE STAGE 1** (2026-08-26) **CAPABILITY=CONSENT_REGISTER** / **CONSENT_UNDEFER=AUTHORIZED**.  
**Authority (Stage 1 authoring):** Same 2026-08-26 undefer instruction **CONSENT_STAGE1=AUTHORIZED_FOR_AUTHORING**.  
**Authority (capability ID assignment):** Operator **GOVERNANCE ACTION — ASSIGN P3 TO CONSENT REGISTER AND PREPARE STAGE 1 APPROVAL RECORD** (2026-08-26) **CAPABILITY_ID=P3**. Committed `master` uniqueness re-check found **no** existing `P3` capability, architecture file, migration, or health increment. **P3** is the privacy-family identifier after **P1** and **P2**. It is **not** P1, **not** P1.x, **not** P2, **not** P2.x, **not** C2, **not** C11, and **not** I24.  
**Authority (Stage 1 approval):** Same 2026-08-26 instruction **STAGE_1_APPROVED=YES**. Approval covers the Stage 1 contract in [`consent-register-preview.md`](../architecture/consent-register-preview.md) with ID **P3**.  
**Authority (implementation):** Operator **P3 IMPLEMENTATION AUTHORIZATION — CONSENT REGISTER** (2026-08-26) **CONSENT_IMPLEMENTATION=AUTHORIZED** (Dev/Test only; Preview/commit/push not authorized at that gate).  
**Authority (Preview):** Operator **P3 PREVIEW AUTHORIZATION — CONSENT REGISTER** (2026-08-26) **CONSENT_PREVIEW=AUTHORIZED** (Dev/Test Preview only). Preview result: **PASS**. Commit/push remain **NOT_AUTHORIZED**.

This record **undefer**s the capability **name** `CONSENT_REGISTER`, assigns **P3**, **approves Stage 1**, records that Dev/Test **implementation is complete**, and records Dev/Test Preview **PASS**. It does **not** authorize commit, push, UAT, or Production. P1 remains **CLOSED**. P2 remains **CLOSED**. ITE1 remains **CLOSED / ACCEPTED**. E2 remains **CLOSED / ACCEPTED**. ITA1, ITL1, I11, ITC1, ITP1, ITR1, E1, I15, I10, H1, I18, K1, K2, O1–O6, C9, C10, G1–G5, and I17 remain closed. SAMPLE remains deferred. Dataset / Data Governance is **not** selected. O7 and PQL remain **not created** on `master` and are not authorized by this record.

The undefer and Stage 1 approval are **narrow**. They do **not** authorize a consent-management platform, consent collection, preference centre, notices, signatures, cookie/device tracking, marketing preferences, automated grant/withdraw/enforcement, legal-validity or lawful-basis conclusions, DLP, live erasure, automated privacy-rights workflow, external CMP/provider integration, subject-facing collection, evidence/proof storage, or P1/P2 linkage.

| Field | Value |
| --- | --- |
| Capability ID | **P3** |
| Name | Consent Register |
| **CAPABILITY** | **CONSENT_REGISTER** |
| **SELECTION_STATUS** | **SELECTED** |
| Family | privacy (named 2.2 aggregate **Consent** after P1 RoPA/DSR and P2 DPIA; not a P1 or P2 reopen) |
| Environment | Development/Test only (**ENVIRONMENT=DEVTEST**) — implementation **complete**; Preview **PASS**; commit **not** authorized |
| **STATUS** | **SELECTED; STAGE 1 APPROVED; IMPLEMENTATION COMPLETE; PREVIEW PASS; COMMIT NOT AUTHORIZED** |
| **CONSENT_UNDEFER** | **AUTHORIZED** |
| **CONSENT_STAGE1** | **APPROVED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **CONSENT_STAGE1_APPROVAL** | **YES** |
| **CONSENT_CAPABILITY_ID** | **P3** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test) |
| **CONSENT_IMPLEMENTATION** | **COMPLETE** |
| **PREVIEW** | **PASS** (Development/Test; executed) |
| **CONSENT_PREVIEW** | **PASS** |
| **COMMIT** | **NOT_AUTHORIZED** |
| **CONSENT_COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **CONSENT_PUSH** | **NOT_AUTHORIZED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **ADR-0006** | **OPEN** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEW_CAPABILITY_AUTHORIZED** | **NONE** |
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |
| P1 Privacy RoPA + DSR | CLOSED — not reopened (not P1.x; no `privacyConsent` restore) |
| P2 DPIA Register | CLOSED — not reopened (no DPIA `consent` subroutes) |
| ITE1 Endpoint Register | CLOSED / ACCEPTED — not reopened |
| E2 Treatment Register | CLOSED / ACCEPTED — not reopened |
| ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| E1 / I15 | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| Dataset / Data Governance | Not selected |
| Consent-management platform / CMP / cookie / marketing engines | **Not** authorized |
| P1.x / P2.x / C2 (Opportunity) / C11 / I24 / O7 / K3 / G6 | Not created as this capability / not reused |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll | **D** — deferred / untouched |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Stage 1 approval; not resolved |
| ADR-0017 | Not reopened |

## Governance sequence

```text
UNDEFER                                          ← AUTHORIZED
-> STAGE 1 CONTRACT AUTHORING                    ← AUTHORIZED (complete)
-> STAGE 1 REVIEW/APPROVAL                       ← YES / APPROVED
-> DEV/TEST IMPLEMENTATION AUTHORIZATION         ← AUTHORIZED (complete)
-> PREVIEW AUTHORIZATION                         ← AUTHORIZED (PASS)
-> COMMIT AUTHORIZATION                          ← NOT_AUTHORIZED
-> PUSH AUTHORIZATION                            ← NOT_AUTHORIZED
-> UAT authorization, if separately granted      ← NOT_AUTHORIZED
-> Production authorization, if separately granted ← NOT_AUTHORIZED
```

**Undefer ≠ Stage 1 approval.**  
**Stage 1 authoring ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ Preview authorization.**  
**Preview ≠ UAT.**  
**UAT ≠ Production.**

## What this record does

- **Does** record **CONSENT_UNDEFER=AUTHORIZED** for a bounded Consent **Register** only.
- **Does** record **CAPABILITY=CONSENT_REGISTER** / **SELECTION_STATUS=SELECTED**.
- **Does** assign **CAPABILITY_ID=P3**.
- **Does** approve Stage 1 (`CONSENT_STAGE1=APPROVED` / `STAGE_1_APPROVED=YES` / `STAGE_1_STATUS=APPROVED`).
- **Does** record Dev/Test implementation **complete** (`CONSENT_IMPLEMENTATION=COMPLETE`).
- **Does** record Dev/Test Preview **PASS** (`CONSENT_PREVIEW=PASS`).
- **Does** point at the approved contract [`docs/architecture/consent-register-preview.md`](../architecture/consent-register-preview.md).

## What this record does not do

- Does **not** authorize commit, push, UAT, or Production.
- Does **not** claim commit or push executed.
- Does **not** place a further implementation item on **EXECUTION_QUEUE**.
- Does **not** close ADR-0006.
- Does **not** reopen P1, P2, ITE1, E2, or any other closed increment.
- Does **not** undefer a consent-management platform or any engine listed above.
- Does **not** authorize O7, PQL, DP-0006, or other dirty-tree work.
- Does **not** modify P1/P2 files.

## Contract

**CONSENT_UNDEFER=AUTHORIZED** · **CONSENT_STAGE1=APPROVED** · **CONSENT_STAGE1_APPROVAL=YES** · **CAPABILITY_ID=P3** · **CONSENT_IMPLEMENTATION=COMPLETE** · **CONSENT_PREVIEW=PASS** · **CONSENT_COMMIT=NOT_AUTHORIZED** · **CONSENT_PUSH=NOT_AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **NEXT_INCREMENT=NONE_AUTHORIZED** — [`docs/architecture/consent-register-preview.md`](../architecture/consent-register-preview.md).

## Next gate

**PREVIEW PASS — COMMIT AUTHORIZATION STILL REQUIRED**

Do not commit or push unless separately authorized. Preview PASS does not authorize commit.
