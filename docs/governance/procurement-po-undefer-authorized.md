# Undefer — Procurement (PO) stream (name only)

> **CURRENT STATE (2026-08-27 successor: PR1 selected / ID assigned — this file remains the 2026-08-27 name-only undefer)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`27066dadb35bdec643b41caa998bbab1c72aeae6`** (`origin/master`; post-DG1 documentation catch-up). **DG1** Dataset Register remains **COMPLETE**.  
> The historical body below is the **name-only undefer**. It is **not** rewritten.  
> **Successor:** selection and **CAPABILITY_ID=PR1** assignment are recorded in [`pr1-procurement-authorized.md`](pr1-procurement-authorized.md). Approved Stage 1 contract: [`../architecture/pr1-procurement-preview.md`](../architecture/pr1-procurement-preview.md) (`STAGE_1_STATUS=APPROVED` · `STAGE_1_APPROVED=YES`). Implementation, Preview, commit, and push remain **NOT_AUTHORIZED**.  
> **PROCUREMENT=SELECTED** · **CAPABILITY_NAME=PROCUREMENT (PO)** · **CAPABILITY_ID=PR1** · **SELECTION_STATUS=SELECTED**  
> Historical banner (2026-08-27 Operator PROCUREMENT (PO) — EXPLICIT UNDEFER RECORDING — name only) is superseded for *current* selection/ID flags only. The historical “does not select / does not assign” paragraphs below remain an accurate description of **this** undefer record.

**Date:** 2026-08-27  
**Authority (undefer, name only):** Operator **PROCUREMENT (PO) — EXPLICIT UNDEFER RECORDING** (2026-08-27) **PROCUREMENT=UNDEFERRED** / **CAPABILITY_NAME=PROCUREMENT (PO)** / **CAPABILITY_ID=NOT_ASSIGNED**.  
**Capability ID assigned by this record:** **NOT_ASSIGNED**

This record lifts the explicit **DEFER** on the **Procurement (PO)** stream recorded in [`../backlog/increments.md`](../backlog/increments.md), [`../architecture/20-phased-roadmap.md`](../architecture/20-phased-roadmap.md), and [`../architecture/commercial-roadmap.md`](../architecture/commercial-roadmap.md). The stream becomes a **future capability-selection candidate** only.

It does **not** select Procurement for Stage 1 or implementation. **HOLD** remains **IN FORCE** for implementation. **NEW_CAPABILITY_AUTHORIZED=NONE.**

Precedent: name-only Path B records such as [`endpoint-register-authorized.md`](endpoint-register-authorized.md) (`CAPABILITY_ID=NOT_ASSIGNED`). Unlike [`consent-register-authorized.md`](consent-register-authorized.md), this undefer is **not** bundled with ID assignment or Stage 1.

**Planning note (not a Stage 1 contract):** a possible later human-managed purchase-request / purchase-order **catalogue** that a procurement transaction exists. That note does **not** authorize fields, APIs, stores, migrations, UI, permissions, workflows, or acceptance criteria.

| Field | Value |
| --- | --- |
| Stream | **PO** (Procurement) |
| **PROCUREMENT** | **UNDEFERRED** |
| **CAPABILITY_NAME** | **PROCUREMENT (PO)** |
| **CAPABILITY** | Not selected by this record |
| **SELECTION_STATUS** | **NOT_SELECTED** |
| **CAPABILITY_ID** | **NOT_ASSIGNED** |
| **ID_ASSIGNMENT** | **NOT_EXECUTED** — do **not** use **C11**, **C10.x**, or any other invented ID |
| Family | `procure` (domain map 2.2: Request, PO, SourcingEvent) — **not** C4 `supplier`; **not** C1–C10 reopen |
| Environment | Not authorized by this record |
| **STATUS** | **UNDEFERRED; NAME ONLY; NOT SELECTED; ID NOT ASSIGNED** |
| **STAGE_1_CREATED** | **NO** |
| **STAGE_1_STATUS** | **NOT_STARTED** |
| **STAGE_1_APPROVED** | **NO** |
| **STAGE_1** | **NOT_AUTHORIZED** |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
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
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |
| **PATH_B_GENERAL_AUTO_SELECTION** | **PAUSED** |
| **HOLD** | **IN FORCE** — not implementation authorization |
| C1–C10 commercial chain | CLOSED — not reopened (not C10.x; not C11) |
| C4 Supplier master | CLOSED — not replaced; not a PO product (C4 “Procurement” is a **role**, not this stream) |
| C6 costing / rates | CLOSED — not a rate or costing engine |
| C9 / C10 booking | CLOSED — no C10 mutation |
| I8 Finance | CLOSED — not AP / invoices / bank / GL |
| DG1 Dataset Register | COMPLETE / CLOSED — not modified by this record |
| P1 / P2 / P3 | CLOSED — not reopened |
| ITA1 / ITL1 / ITE1 / E1 / E2 | CLOSED — not reopened |
| I11 / ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| I15 / G1–G5 / H1 | CLOSED — not reopened |
| SAMPLE | **DEFER** — not undeferred |
| CAL | **DEFER** — not undeferred |
| UEM / EMCOMMS / EXER / I21 / I22 / I23 / I20X / EXT / payroll | **D** — deferred / untouched |
| C11 / C10.x / G6 / H2 / K3 / I24 / DG2 / O7 | Not created / not used |
| SourcingEvent / RFQ / tender / scoring / inventory / 3-way match / AP / payments | **Not** authorized |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not resolved by this record |
| ADR-0017 | Not reopened |

## Governance sequence

```text
UNDEFER                                          ← AUTHORIZED (this record; name only)
-> CAPABILITY SELECTION                          ← NOT_SELECTED
-> CAPABILITY ID ASSIGNMENT                      ← NOT_ASSIGNED
-> STAGE 1 CONTRACT AUTHORING                    ← NOT_AUTHORIZED
-> STAGE 1 REVIEW/APPROVAL                       ← NOT_AUTHORIZED
-> DEV/TEST IMPLEMENTATION AUTHORIZATION         ← NOT_AUTHORIZED
-> PREVIEW AUTHORIZATION                         ← NOT_AUTHORIZED
-> COMMIT AUTHORIZATION                          ← NOT_AUTHORIZED
-> PUSH AUTHORIZATION                            ← NOT_AUTHORIZED
-> UAT authorization, if separately granted      ← NOT_AUTHORIZED
-> Production authorization, if separately granted ← NOT_AUTHORIZED
```

**Undefer ≠ capability selection.**  
**Undefer ≠ ID assignment.**  
**Undefer ≠ Stage 1.**  
**Undefer ≠ implementation.**  
**HOLD ≠ implementation authorization.**

## What this record does

- **Does** record **PROCUREMENT=UNDEFERRED** for the **PO** stream.
- **Does** record **CAPABILITY_NAME=PROCUREMENT (PO)**.
- **Does** record **CAPABILITY_ID=NOT_ASSIGNED**.
- **Does** keep **EXECUTION_QUEUE=EMPTY** and **NEW_CAPABILITY_AUTHORIZED=NONE**.
- **Does** keep **HOLD=IN FORCE** for implementation.

## What this record does not do

- Does **not** select Procurement as the next implemented capability (`SELECTION_STATUS=NOT_SELECTED`).
- Does **not** assign **C11**, **C10.x**, or any other increment ID.
- Does **not** authorize Stage 1 authoring or approval.
- Does **not** authorize implementation, Preview, commit, push, UAT, or Production.
- Does **not** place an item on **EXECUTION_QUEUE**.
- Does **not** reopen C1–C10, C4, C6, C9, C10, I8, DG1, or any other closed increment.
- Does **not** authorize a sourcing/tender/rate/AP/GL/inventory/purchasing engine or external procurement providers.
- Does **not** encode implementation fields, APIs, stores, migrations, UI, permissions, workflows, or acceptance criteria.
- Does **not** close or advance ADR-0006, ADR-0012, or ADR-0013.
- Does **not** undefer CAL, SAMPLE, UEM, or any other deferred stream.
- Does **not** authorize O7, PQL, DP-0006, or other dirty-tree work.

## Next gate

**Fresh Procurement capability-selection / ID-assignment decision — separate authorization required.**

Do not author Stage 1, assign an ID, or implement unless separately authorized.
