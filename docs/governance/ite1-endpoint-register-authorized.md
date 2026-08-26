# ITE1 — Endpoint Register Stage 1 approval + Dev/Test implementation authorization

> **CURRENT STATE (2026-08-26 Operator ITE1 DEV/TEST COMMIT — authorized)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · last committed HEAD=`a24888523cd82242b341c77e2db7d076374fa8e2` (E2 governance closure).  
> E2 Treatment Register remains **CLOSED / ACCEPTED** on `master`. ITA1, ITL1, E1, I11, ITC1, ITP1, ITR1, P1, and P2 remain **CLOSED**.  
> This record records **ITE1_SELECTION=SELECTED**, **ITE1_STAGE1_APPROVAL=YES**, **ITE1_IMPLEMENTATION=AUTHORIZED**, **ITE1_PREVIEW=AUTHORIZED** with **ITE1_PREVIEW_RESULT=PASS**, **HUMAN_ACCEPTANCE=PASS**, and **COMMIT=AUTHORIZED** for Development/Test only against the approved Stage 1 contract.  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **ADR-0006=OPEN**  
> **CAPABILITY=ENDPOINT_REGISTER** · **CAPABILITY_ID=ITE1** · **ENVIRONMENT=DEVTEST** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** · **PREVIEW_RESULT=PASS**

**Date:** 2026-08-26  
**Authority (selection for Stage 1 review):** Operator **PRODUCT OWNER DECISION — SELECT PATH B LEFTOVER REGISTER** (2026-08-26) **CAPABILITY=ENDPOINT_REGISTER** / **CAPABILITY_ID=ITE1**.  
**Authority (Stage 1 approval):** Operator **PRODUCT OWNER STAGE 1 APPROVAL — ITE1 ENDPOINT REGISTER** (2026-08-26) **STAGE_1_APPROVED=YES**. Approval covers the human Endpoint Register contract (catalogue that an IT endpoint exists or was cancelled).  
**Authority (implementation authorization):** Operator **ITE1 Endpoint Register implementation in Development/Test** (2026-08-26) **ENVIRONMENT=DEVTEST**. Implementation must follow the approved Stage 1 contract.  
**Authority (Preview authorization):** Operator **ITE1 — PREVIEW AUTHORIZATION AND DEV/TEST PREVIEW EXECUTION** (2026-08-26) **ITE1_PREVIEW_AUTHORIZATION=YES**. Preview executed in Development/Test. **ITE1_PREVIEW_RESULT=PASS**. Human signed-in UI verification **PASS**.  
**Authority (commit authorization):** Operator **PRODUCT OWNER AUTHORIZATION — ITE1 DEV/TEST COMMIT** (2026-08-26) **COMMIT=AUTHORIZED**. Push, UAT, and Production remain **NOT_AUTHORIZED**. **ADR-0006** remains **OPEN**.  
**Capability ID assigned:** **ITE1**

ITE1 follows the asset-family sequential pattern after **ITA1** (Asset) and **ITL1** (License): `IT` + noun initial + `1`. It is **not** ITA2, **not** ITL1.x, **not** I11.x, **not** E3. I11 CI class `endpoint` remains I11 and is not this ID.

| Field | Value |
| --- | --- |
| Capability ID | **ITE1** |
| Name | Endpoint Register |
| **CAPABILITY** | **ENDPOINT_REGISTER** |
| **SELECTION_STATUS** | **SELECTED** |
| Family | asset (leftover after ITA1 Asset and ITL1 License; not an ITA1, ITL1, or I11 reopen) |
| Environment | Development/Test only (**ENVIRONMENT=DEVTEST**) |
| **STATUS** | **SELECTED; STAGE 1 APPROVED; IMPLEMENTATION AUTHORIZED (DEVTEST); PREVIEW PASS; HUMAN ACCEPTANCE PASS; COMMIT AUTHORIZED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **ITE1_STAGE1_APPROVAL** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** |
| **ITE1_IMPLEMENTATION** | **AUTHORIZED** (Dev/Test only; working-tree Stage 2 against this contract) |
| **PREVIEW** | **AUTHORIZED** (Dev/Test executed) |
| **ITE1_PREVIEW** | **AUTHORIZED** |
| **ITE1_PREVIEW_RESULT** | **PASS** |
| **BROWSER_E2E** | **EXECUTED** |
| **HUMAN_ACCEPTANCE** | **PASS** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **COMMIT** | **AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **ADR-0006** | **OPEN** |
| **EXECUTION_QUEUE** | **ITE1 — Endpoint Register** — [`ite1-endpoint-register-preview.md`](../architecture/ite1-endpoint-register-preview.md) |
| Additive SQL | `109_ite1_it_endpoints.sql` (next unused after committed `108_e2_erm_treatments.sql`; local draft `116` must not be used) |
| Runtime store | `itEndpoints` (in-memory Dev/Test SoR) |
| ITA1 / ITL1 | CLOSED — not reopened (no `assetId` / `licenseId`) |
| I11 | CLOSED — CI class `endpoint` is not ITE1 (no `ciId`) |
| E1 / E2 | CLOSED — not reopened |
| O7 / PQL | Not this capability; unrelated dirty-tree work is not authorized by this record |
| SAMPLE | **DEFER** |
| ADR-0006 / ADR-0012 / ADR-0013 | Remain **OPEN** — not required for this Dev/Test implementation; not resolved |
| ADR-0017 | Not reopened |

## Product intent

A tenant-scoped, human-maintained **Endpoint Register**.

An endpoint record is a human **label** that an IT endpoint exists (or was cancelled). It is not UEM, MDM, EDR, discovery, fleet management, last-seen monitoring, wipe/lock, compliance monitoring, serial/hostname/IP/MAC identity, an Asset Register, a License Register, or a CMDB.

**ITA1 Asset** = a human asset-register row.  
**ITL1 License** = a human license-register row.  
**ITE1 Endpoint** = a human endpoint-register row.  
**I11 CI class `endpoint`** = a configuration-item class, not this register.

## Approved Stage 1 contract (implementation must match)

- Lifecycle: create → `open`; `open` → `done` or `cancelled`; `done` / `cancelled` are final.
- Tenant-unique codes `END-`.
- Required `title`; optional `notes`.
- API `/v1/endpoints` and `/v1/endpoints/health` (`increment=ITE1`, module `it-endpoints`).
- UI `/commercial/endpoints`; nav **IT → Endpoints** after Licenses.
- Permissions `endpoint:read:register` / `endpoint:write:register`; role `it.endpoint`.
- Human-only mutation.

Approved contract artifact: [`docs/architecture/ite1-endpoint-register-preview.md`](../architecture/ite1-endpoint-register-preview.md).

## Explicitly not this capability

UEM; MDM; EDR; device discovery; endpoint agents; fleet management; last-seen/heartbeat monitoring; wipe or lock; compliance monitoring; serial-number identity; hostname/IP/MAC identity; Asset Register functionality; License Register functionality; CMDB functionality; `ciId`; `assetId`; `licenseId`; nested `/v1/assets/:id/endpoint` or `/v1/licenses/:id/endpoint`; modification of I11 CMDB endpoint semantics; UAT; Production; live PostgreSQL as a newly established system of record; ADR-0006 closure; push; AI mutation.

## What this record does

- **Does** record **CAPABILITY=ENDPOINT_REGISTER** / **CAPABILITY_ID=ITE1**.
- **Does** record **STAGE_1_APPROVED=YES**.
- **Does** authorize Development/Test implementation (`IMPLEMENTATION_AUTHORIZED=YES` / **ENVIRONMENT=DEVTEST**).
- **Does** set **EXECUTION_QUEUE=ITE1 — Endpoint Register**.
- **Does** record **ITE1_PREVIEW_AUTHORIZATION=YES** / **ITE1_PREVIEW_RESULT=PASS** / **HUMAN_ACCEPTANCE=PASS**.
- **Does** authorize the ITE1 Development/Test commit (`COMMIT=AUTHORIZED`). Push remains **NOT_AUTHORIZED**.

## What this record does not do

- Does **not** authorize UAT or Production.
- Does **not** authorize push.
- Does **not** reopen ITA1, ITL1, I11, E1, or E2.
- Does **not** close or resolve ADR-0006, ADR-0012, or ADR-0013.
- Does **not** authorize unrelated O7 / PQL / DP-0006 working-tree work.

**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ Preview authorization.**  
**Preview PASS ≠ commit authorization.**  
**Commit authorization ≠ push / UAT / Production.**

## Contract

**CAPABILITY=ENDPOINT_REGISTER** · **CAPABILITY_ID=ITE1** · **ENVIRONMENT=DEVTEST** · **STAGE_1_CREATED=YES** · **STAGE_1_STATUS=APPROVED** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** · **ITE1_PREVIEW=AUTHORIZED** · **ITE1_PREVIEW_RESULT=PASS** · **HUMAN_ACCEPTANCE=PASS** · **COMMIT=AUTHORIZED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **EXECUTION_QUEUE=ITE1 — Endpoint Register** — [`docs/architecture/ite1-endpoint-register-preview.md`](../architecture/ite1-endpoint-register-preview.md).
