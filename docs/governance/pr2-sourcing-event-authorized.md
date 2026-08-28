# Selection — PR2 SourcingEvent (name + Owner-assigned ID)

> **CURRENT STATE (2026-08-29 Owner PR2 DEV/TEST PREVIEW — authorized for this PR2 in-memory API run only; EXECUTED)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`01d62322453af837026827018caf278f7b8f8071`** (`origin/master`; `feat(pr1): implement procurement catalogue`). **PR1** Procurement Catalogue remains **IMPLEMENTED / CLOSED** (Dev/Test).  
> This record **selects** **SourcingEvent**, records Owner-assigned **CAPABILITY_ID=PR2**, records **STAGE_1_APPROVED=YES**, **IMPLEMENTATION_AUTHORIZED=YES**, **TEST EXECUTION=COMPLETED / PASS**, and **PREVIEW=AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY**. That preview **EXECUTED** on local Fastify `127.0.0.1:18082` with in-memory `Store` (migration `118` **not** applied). UAT, Production, commit, and push remain **not** authorized.  
> **PR2** is an **explicit Owner assignment**. It is **not** an automatically inferred sequential ID.  
> **Approved Stage 1 contract:** [`../architecture/pr2-sourcing-event-preview.md`](../architecture/pr2-sourcing-event-preview.md)  
> **CAPABILITY=SOURCING_EVENT** · **CAPABILITY_NAME=SourcingEvent** · **CAPABILITY_ID=PR2** · **SELECTION_STATUS=SELECTED** · **ID_ASSIGNMENT=EXECUTED**  
> **STAGE_1_CREATED=YES** · **STAGE_1=APPROVED** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES**  
> **EXECUTION_QUEUE=PR2 — SourcingEvent (SELECTED; Stage 1 APPROVED; implementation WRITTEN; tests PASS; this Dev/Test API preview EXECUTED)** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**  
> **PREVIEW=AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY (EXECUTED)** · **TEST EXECUTION=COMPLETED / PASS** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **COMMIT=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **DP-0006=NOT APPROVED** · **ADR-0006=OPEN** · **ADR-0012=OPEN** · **ADR-0013=OPEN**

**Date:** 2026-08-28 (selection / Stage 1); 2026-08-29 (implementation authorization; test execution; Dev/Test API preview)  
**Authority (capability ID assignment):** Product Owner **PR2 — SOURCINGEVENT CAPABILITY ID ASSIGNMENT** (2026-08-28) **CAPABILITY ID=PR2** / **CAPABILITY NAME=SourcingEvent**. Explicit Owner assignment. Not inferred by Cursor.  
**Authority (Path-B selection):** Product Owner **PATH B — SOURCINGEVENT CAPABILITY SELECTION** (2026-08-28).  
**Authority (Stage 1 contract authoring):** **PR2 STAGE 1 CONTRACT AUTHORING ONLY** (2026-08-28).  
**Authority (Stage 1 Owner decisions recorded):** **PR2 STAGE 1 OWNER DECISIONS** (2026-08-28).  
**Authority (Stage 1 approval):** Product Owner **PR2 STAGE 1 OWNER APPROVAL** (2026-08-28) **STAGE_1_APPROVED=YES**.  
**Authority (implementation authorization):** Product Owner **PR2 IMPLEMENTATION AUTHORIZATION** (2026-08-29) **IMPLEMENTATION_AUTHORIZED=YES** / **ENVIRONMENT=DEVTEST**.  
**Authority (test execution):** Product Owner **PR2 TEST EXECUTION AUTHORIZATION** (2026-08-29) **TEST EXECUTION=AUTHORIZED FOR THIS PR2 TEST RUN ONLY**. Kernel + API tests **EXECUTED**. Result **PASS** (5 passed / 0 failed / 0 skipped). In-process Fastify `inject` only. Migration `118` **not** applied.  
**Authority (preview):** Product Owner **PR2 DEV/TEST PREVIEW AUTHORIZATION** (2026-08-29) **PREVIEW=AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY**. Local Fastify `127.0.0.1:18082`, in-memory `Store`, no `EOS_DATABASE_URL`. Migration `118` **not** executed. Migrations `109`–`115` **not** executed. Runtime **stopped** after the preview. UAT, Production, commit, and push remain **NOT_AUTHORIZED**.  
**Capability ID assigned by this record:** **PR2** (Owner-assigned)

This record selects the capability **name** `SourcingEvent` and records Owner-assigned identity **PR2**. **PR2** is a **procure-family** identifier after **PR1**. It is **not** PR1, **not** PR1.x, **not** C11, **not** C10.x, **not** PO, **not** PO1, **not** P4, **not** I24, **not** an RFQ/tender/scoring/auction engine, and **not** a reopen of PR1, C4, C6, or I8.

**PR1** remains **IMPLEMENTED / CLOSED** for Development/Test. This selection does **not** reopen PR1.

```text
OWNER SELECTION            ≠ STAGE 1 DRAFT
STAGE 1 DRAFT              ≠ STAGE 1 APPROVAL
STAGE 1 APPROVAL           ≠ IMPLEMENTATION AUTHORIZATION
IMPLEMENTATION AUTHORIZATION ≠ TEST AUTHORIZATION
TEST AUTHORIZATION         ≠ PREVIEW AUTHORIZATION
PREVIEW AUTHORIZATION      ≠ COMMIT AUTHORIZATION
TEST AUTHORIZATION         ≠ UAT AUTHORIZATION
UAT AUTHORIZATION          ≠ PRODUCTION AUTHORIZATION
```

| Field | Value |
| --- | --- |
| Capability ID | **PR2** (Owner-assigned; not inferred) |
| **CAPABILITY_NAME** | **SourcingEvent** |
| Name | SourcingEvent |
| **CAPABILITY** | **SOURCING_EVENT** |
| **SELECTION_STATUS** | **SELECTED** |
| **ID_ASSIGNMENT** | **EXECUTED** |
| Family | `procure` — Path-B leftover after completed **PR1** Request/PO catalogue; **not** a PR1 reopen |
| Selection basis | Path-B procure leftover after completed PR1 Procurement |
| **SCOPE** | **BOUNDED DEV/TEST CATALOGUE ONLY** |
| Environment | Development/Test only (**ENVIRONMENT=DEVTEST**) |
| **STATUS** | **SELECTED; ID ASSIGNED (PR2); STAGE 1 APPROVED; IMPLEMENTATION WRITTEN; TESTS PASS; THIS DEV/TEST API PREVIEW EXECUTED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1** | **APPROVED** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| Approved Stage 1 contract | [`../architecture/pr2-sourcing-event-preview.md`](../architecture/pr2-sourcing-event-preview.md) |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Development/Test only) |
| **IMPLEMENTATION** | **WRITTEN** (working tree) |
| **PREVIEW** | **AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY** — **EXECUTED** (in-memory API; not database-backed) |
| **TEST EXECUTION** | **COMPLETED / PASS** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **EXECUTION_QUEUE** | **PR2 — SourcingEvent** (this Dev/Test API preview EXECUTED; commit / push not authorized) |
| **NEW_CAPABILITY_AUTHORIZED** | **NONE** |
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |
| **PATH_B_GENERAL_AUTO_SELECTION** | **PAUSED** |
| **HOLD** | **IN FORCE** for UAT, Production, commit, push |
| PR1 Procurement Catalogue | CLOSED — not reopened (not PR1.x; Request/PO catalogue unchanged) |
| C1–C10 commercial chain | CLOSED — not reopened |
| C4 Supplier master | CLOSED — not replaced; not a sourcing engine |
| C6 costing / rates | CLOSED — not a rate or costing engine |
| C9 / C10 booking | CLOSED — no booking mutation |
| I8 Finance | CLOSED — not AP / invoices / bank / GL |
| DG1 / P1 / P2 / P3 | CLOSED — not reopened |
| ITA1 / ITL1 / ITE1 / E1 / E2 | CLOSED — not reopened |
| I11 / ITC1 / ITP1 / ITR1 | CLOSED — not reopened |
| SAMPLE | **DEFER** — not undeferred |
| CAL | **DEFER** — not undeferred |
| UEM / EMCOMMS / EXER / I21 / I22 / I23 / I20X / EXT / payroll | **D** — deferred / untouched |
| C11 / C10.x / PO1 / P4 / I24 / G6 / H2 / K3 / DG2 / O7 | Not created / not used |
| RFQ / tender / bidding / scoring / auction / automated sourcing / supplier discovery | **Not** authorized |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test test run; not resolved by this record |
| ADR-0017 | Not reopened |
| DP-0006 | **NOT APPROVED** |

## Product intent (governance boundary — approved Stage 1 is elsewhere)

A tenant-scoped, human-maintained **SourcingEvent catalogue**: a human record that a sourcing event **exists**, in Development/Test only. Exact fields, codes, lifecycle, routes, permissions, and UI exclusion are in the **approved** Stage 1 contract ([`../architecture/pr2-sourcing-event-preview.md`](../architecture/pr2-sourcing-event-preview.md)), including Owner-recorded `SE-`, `open`→`retired`, and U1 API-only. This in-memory API preview does **not** authorize UAT, Production, commit, or push. It is **not** database-backed validation.

## Explicitly not this capability

RFQ functionality; tender management; supplier bidding; supplier scoring; auction functionality; automated sourcing; supplier discovery; procurement workflow automation; replacement of PR1 Request or PO; C4 / C6 / I8 expansion; production procurement; UAT; Production; Azure provisioning; Microsoft / Legal / DP-0006 approval.

## What this record does

- **Does** record **CAPABILITY=SOURCING_EVENT** / **CAPABILITY_NAME=SourcingEvent**.
- **Does** record Owner-assigned **CAPABILITY_ID=PR2**.
- **Does** approve Stage 1 and authorize Dev/Test implementation as previously recorded.
- **Does** record **TEST EXECUTION=COMPLETED / PASS**.
- **Does** record **PREVIEW=AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY**, **EXECUTED** (in-memory Fastify; migration `118` not applied).
- **Does** keep **COMMIT=NOT_AUTHORIZED**, **PUSH=NOT_AUTHORIZED**.
- **Does** keep **NEW_CAPABILITY_AUTHORIZED=NONE** and **NEXT_INCREMENT=NONE_AUTHORIZED**.
- **Does** keep **PATH_B_GENERAL_AUTO_SELECTION=PAUSED**.

## What this record does not do

- Does **not** authorize UAT, Production, commit, or push. A completed Dev/Test API preview is **not** commit or UAT authorization.
- Does **not** authorize an RFQ, tender, bidding, scoring, auction, discovery, or purchasing engine.
- Does **not** authorize UI (`/commercial/sourcing-events` remains out of scope).
- Does **not** reopen or replace PR1, C4, C6, or I8.
- Does **not** approve DP-0006; close ADR-0006 / 0012 / 0013; reopen ADR-0017; provision Azure; contact Microsoft; or send the RFI.

## Next gate

```text
NEXT GOVERNANCE GATE = SEPARATE PR2 COMMIT AUTHORIZATION
```

U1 remains API-only. This record does **not** take commit, push, UAT, or Production. This preview is **not** live PostgreSQL validation.
