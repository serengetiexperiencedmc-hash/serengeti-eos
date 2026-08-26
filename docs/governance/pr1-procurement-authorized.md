# Selection — Procurement (PO) / PR1

> **CURRENT STATE (2026-08-27 Operator PR1 PROCUREMENT — IMPLEMENTATION AUTHORIZATION — Dev/Test implementation complete; Preview not authorized)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`27066dadb35bdec643b41caa998bbab1c72aeae6`** (`origin/master`; post-DG1 documentation catch-up). **DG1** Dataset Register remains **COMPLETE**.  
> Predecessor undefer (name only; not rewritten): [`procurement-po-undefer-authorized.md`](procurement-po-undefer-authorized.md).  
> This record **selects** **PROCUREMENT (PO)**, **assigns** **CAPABILITY_ID=PR1**, records **STAGE_1_APPROVED=YES**, and records **IMPLEMENTATION=COMPLETED** for Development/Test only. It does **not** authorize Preview, commit, push, UAT, or Production.  
> Approved Stage 1 contract: [`../architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md).  
> **PROCUREMENT=SELECTED** · **CAPABILITY_NAME=PROCUREMENT (PO)** · **CAPABILITY_ID=PR1** · **ID_ASSIGNMENT=EXECUTED**  
> **SELECTION_STATUS=SELECTED** · **NEXT_INCREMENT=PR1** (selected identity only) · **NEW_CAPABILITY_AUTHORIZED=NONE**  
> **STAGE_1_AUTHORING=AUTHORIZED** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES**  
> **IMPLEMENTATION_AUTHORIZED=YES** · **IMPLEMENTATION=COMPLETED** · **PREVIEW=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **EXECUTION_QUEUE=EMPTY** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **HOLD=IN FORCE** (Preview / commit / push / UAT / Production not authorized)  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **ADR-0012=OPEN** · **ADR-0013=OPEN**

**Date:** 2026-08-27  
**Authority (undefer, predecessor):** Operator **PROCUREMENT (PO) — EXPLICIT UNDEFER RECORDING** (2026-08-27) — [`procurement-po-undefer-authorized.md`](procurement-po-undefer-authorized.md).  
**Authority (selection + ID assignment):** Operator **PROCUREMENT (PO) — PRODUCT OWNER SELECTION + ID ASSIGNMENT ONLY** (2026-08-27) **CAPABILITY_NAME=PROCUREMENT (PO)** / **CAPABILITY_ID=PR1** / **SELECTION_STATUS=SELECTED**.  
**Authority (Stage 1 authoring):** Operator **PR1 STAGE 1 CONTRACT AUTHORING — GOVERNANCE-BOUNDED** (2026-08-27). Contract: [`../architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md).  
**Authority (Stage 1 approval):** Operator **PR1 PROCUREMENT — STAGE 1 APPROVAL** (2026-08-27) **STAGE_1_APPROVED=YES**. Approval covers the Stage 1 contract exactly as authored in [`../architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md).  
**Authority (implementation):** Operator **PR1 PROCUREMENT — IMPLEMENTATION AUTHORIZATION** (2026-08-27) — Development/Test only. **IMPLEMENTATION=COMPLETED**. Preview, commit, push, UAT, and Production remain **NOT_AUTHORIZED**.  
**Capability ID assigned by this record:** **PR1**

This record selects the capability **name** `PROCUREMENT (PO)` and assigns **PR1**. **PR1** is a new **procure-family** identifier for domain-map context `procure`. It is **not** C11, **not** C10.x, **not** PO (stream label), **not** PO1, **not** P4 (privacy family), **not** I24, and **not** a reopen of C1–C10, C4, C6, C9, C10, or I8.

**PR1** is the selected next increment **identity**. Stage 1 is **APPROVED**. Development/Test implementation is **COMPLETED**. Preview is **not** authorized. **EXECUTION_QUEUE** remains **EMPTY**. **PATH_B_GENERAL_AUTO_SELECTION** remains **PAUSED**.

Approved Stage 1 boundary: a human-managed **procurement catalogue** — that a purchase request and/or purchase order exists — with minimal lifecycle/status, ownership, timestamps, and an optional read-only reference to an existing C4 supplier. **SourcingEvent** is **not** selected. The approved contract is [`../architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md). Stage 1 approval is **not** implementation authorization.

| Field | Value |
| --- | --- |
| Stream | **PO** (Procurement) — stream label only; **not** the increment ID |
| **PROCUREMENT** | **SELECTED** |
| **CAPABILITY_NAME** | **PROCUREMENT (PO)** |
| **CAPABILITY** | **PROCUREMENT (PO)** |
| **SELECTION_STATUS** | **SELECTED** |
| **CAPABILITY_ID** | **PR1** |
| **ID_ASSIGNMENT** | **EXECUTED** |
| Family | `procure` — **PR1** first family increment; leftover nouns Request / PO only; **not** SourcingEvent; **not** C4 `supplier`; **not** C1–C10 reopen |
| Environment | Development/Test implementation **COMPLETED** (this record now records that later authorization; Preview remains unauthorized) |
| **STATUS** | **SELECTED; ID ASSIGNED (PR1); STAGE 1 APPROVED; IMPLEMENTATION COMPLETED (Dev/Test); PREVIEW NOT AUTHORIZED** |
| **NEXT_INCREMENT** | **PR1** (selected identity; Stage 1 **approved**; Dev/Test implementation **completed**; Preview **not** authorized) |
| **STAGE_1_AUTHORING** | **AUTHORIZED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **STAGE_1** | **APPROVED; IMPLEMENTATION COMPLETED (Dev/Test)** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Development/Test only) |
| **IMPLEMENTATION** | **COMPLETED** |
| **PREVIEW** | **NOT_AUTHORIZED** |
| **COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **ADR-0006** | **OPEN** |
| **ADR-0012** | **OPEN** |
| **ADR-0013** | **OPEN** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEW_CAPABILITY_AUTHORIZED** | **NONE** |
| **PATH_B_GENERAL_AUTO_SELECTION** | **PAUSED** |
| **HOLD** | **IN FORCE** — not implementation authorization |
| C1–C10 commercial chain | CLOSED — not reopened (not C10.x; not C11) |
| C4 Supplier master | CLOSED — not replaced; optional later read-only reference only; C4 “Procurement” is a **role**, not this capability |
| C6 costing / rates | CLOSED — not a rate or costing engine |
| C9 / C10 booking | CLOSED — no C10 mutation |
| I8 Finance | CLOSED — not AP / invoices / bank / GL |
| DG1 Dataset Register | COMPLETE / CLOSED — not modified by this record |
| P1 / P2 / P3 | CLOSED — not reopened (**P4** not used; privacy family is not this capability) |
| ITA1 / ITL1 / ITE1 / E1 / E2 | CLOSED — not reopened |
| I11 / ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| I15 / G1–G5 / H1 | CLOSED — not reopened |
| SAMPLE | **DEFER** — not undeferred |
| CAL | **DEFER** — not undeferred |
| UEM / EMCOMMS / EXER / I21 / I22 / I23 / I20X / EXT / payroll | **D** — deferred / untouched |
| C11 / C10.x / PO1 / P4 / I24 / G6 / H2 / K3 / DG2 / O7 | Not created / not used |
| SourcingEvent / RFQ / tender / scoring / inventory / 3-way match / AP / payments | **Not** authorized |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not resolved by this record |
| ADR-0017 | Not reopened |

## Governance sequence

```text
UNDEFER                                          ← AUTHORIZED (predecessor; name only)
-> CAPABILITY SELECTION                          ← SELECTED (this record)
-> CAPABILITY ID ASSIGNMENT                      ← PR1 (this record)
-> STAGE 1 CONTRACT AUTHORING                    ← AUTHORIZED (complete)
-> STAGE 1 REVIEW/APPROVAL                       ← YES / APPROVED (this gate)
-> DEV/TEST IMPLEMENTATION AUTHORIZATION         ← YES / COMPLETED (this gate; Dev/Test only)
-> PREVIEW AUTHORIZATION                         ← NOT_AUTHORIZED
-> COMMIT AUTHORIZATION                          ← NOT_AUTHORIZED
-> PUSH AUTHORIZATION                            ← NOT_AUTHORIZED
-> UAT authorization, if separately granted      ← NOT_AUTHORIZED
-> Production authorization, if separately granted ← NOT_AUTHORIZED
```

**Selection ≠ Stage 1.**  
**Stage 1 authoring ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation.**  
**ID assignment ≠ implementation.**  
**NEXT_INCREMENT=PR1 ≠ EXECUTION_QUEUE item.**  
**HOLD ≠ implementation authorization.**

## What this record does

- **Does** confirm the predecessor **PROCUREMENT=UNDEFERRED**.
- **Does** record **CAPABILITY_NAME=PROCUREMENT (PO)**.
- **Does** record **SELECTION_STATUS=SELECTED**.
- **Does** assign **CAPABILITY_ID=PR1**.
- **Does** record **NEXT_INCREMENT=PR1** as the selected identity.
- **Does** record Stage 1 authoring (`STAGE_1_CREATED=YES`) against [`../architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md).
- **Does** approve Stage 1 (`STAGE_1_APPROVED=YES` · `STAGE_1_STATUS=APPROVED`) as granted by Operator **PR1 PROCUREMENT — STAGE 1 APPROVAL**.
- **Does** keep **EXECUTION_QUEUE=EMPTY** and **NEW_CAPABILITY_AUTHORIZED=NONE**.
- **Does** keep **HOLD=IN FORCE** for Preview, commit, push, UAT, and Production.
- **Does** record Dev/Test implementation completion (`IMPLEMENTATION=COMPLETED`) under Operator **PR1 PROCUREMENT — IMPLEMENTATION AUTHORIZATION**. This is **not** Preview PASS.

## Stage 1 contract

**STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES.** Approved Stage 1 contract: [`docs/architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md). **IMPLEMENTATION=COMPLETED** in Development/Test. Preview remains **NOT_AUTHORIZED**.

## What this record does not do

- Does **not** authorize Preview, commit, push, UAT, or Production.
- Does **not** mark Preview PASS. Implementation completion is not Preview.
- Does **not** place an implementation item on **EXECUTION_QUEUE**.
- Does **not** create **C11**, **C10.x**, **PO1**, **P4**, **I24**, or any other placeholder ID.
- Does **not** use the stream label **PO** as the increment ID.
- Does **not** reopen C1–C10, C4, C6, C9, C10, I8, DG1, or any other closed increment.
- Does **not** authorize a sourcing/tender/rate/AP/GL/inventory/purchasing engine or external procurement providers.
- Does **not** select **SourcingEvent**.
- Does **not** treat Stage 1 approval as Preview, commit, or push authorization.
- Does **not** close or advance ADR-0006, ADR-0012, or ADR-0013.
- Does **not** undefer CAL, SAMPLE, UEM, or any other deferred stream.
- Does **not** authorize O7, PQL, DP-0006, or other dirty-tree work.

## Next gate

**PR1 DEV/TEST PREVIEW AUTHORIZATION — SEPARATE GATE**

Do not Preview, commit, or push unless separately authorized. Implementation completion is not Preview.
