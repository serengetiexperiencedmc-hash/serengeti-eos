# H1 Authorization — HR Certification Register

> **CURRENT STATE (2026-08-24 documentation hygiene — supersession banner, not a rewrite of Stage 1)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`c55b608001e6af764fc80bd41ce9844b24da60d8`**  
> H1 Stage 2 is **COMPLETE / CLOSED** for Development/Test. The Stage 1 fields below (`IMPLEMENTATION_AUTHORIZED=NO`) remain the **historical authorization**. They must not be read as a pending execution queue.  
> No H1.x. No payroll/LMS. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Date:** 2026-08-24  
**Authority:** Operator / product-owner decision **CANDIDATE=HR_CERTIFICATION_REGISTER / DECISION=APPROVE / CAPABILITY_ID=H1 / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED**.  
**Capability ID assigned by this record:** **H1**

This record assigns **H1**. It is an **HR-family** identifier after I10. It is **not** I10.x (I10 is closed and must not be reopened). It is **not** I21, **not** O7, **not** K3, **not** G6, and **not** payroll. I10, I11, I18, K1, K2, O1–O6, C9, C10, G1–G5, P1, I15, and I17 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **H1** |
| Name | HR Certification Register |
| Family | hr |
| Environment | Development/Test only |
| **IMPLEMENTATION_AUTHORIZED** | **NO** |
| I10 HR Core | CLOSED — not reopened (read-only parent employees only) |
| I11 ITSM / CMDB | CLOSED — not reopened |
| I18 / K1 / K2 | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| I15 ERM / I17 BCM | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I10.x / I21 / O7 / K3 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT / payroll | **D** — deferred / untouched |

## Authorized scope (preview/contract only)

Tenant-scoped, human-maintained **certification register** against an existing same-tenant I10 employee. Required `name`; required `employeeId`; optional `issuerLabel` (text, not a principal id), `issuedOn`, `expiresOn` (date labels only), and `notes`; status. Lifecycle `held` → `revoked` (`revoked` terminal). `employeeId` immutable after create. Human-only mutation. Dedicated certification read/write permissions (do not broaden I10 `hr.member` / `hr.approver` / employee / leave / skill permissions). API `/v1/hr/certifications`. UI **People → Certifications** at `/commercial/hr/certifications` (I10 HR remains I10). Store key `hrCertifications`. Aggregate `hr_certifications`. Runtime in-memory. Additive SQL only if implementation is later authorized.

Date fields are operator-entered labels. They are not an expiry engine, reminder, SLA, or renewal workflow.

## Explicitly excluded

Payroll, salary, tax, benefits, employment contracts; LMS, training management, competency engine; certification expiry automation, reminders, SLA, renewal workflows; external credential verification; IdP integration; document/object storage; legal/compliance conclusions; regulatory certification interpretation; I10 reopen or mutation of employees / leave / skills; I11, I18, K1, K2, O6, G1–G5, P1, I15, I17, C9/C10 mutation; SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT; UAT; Production; live PostgreSQL; external vendor selection; autonomous AI certification creation, renewal, expiry, or verification. I10 `/v1/hr/health` increment remains **I10**.

## Implementation

**IMPLEMENTATION_AUTHORIZED=NO** *(historical Stage 1)*

This record plus the architecture preview authorize **preview/authorization artifacts only**. Implementation (kernel, API, RBAC, UI, tests, runtime store, migration) requires a **separate explicit execution instruction** after these records are committed. *(Historical Stage 1 sentence. That execution later completed; H1 is CLOSED. This paragraph is not a new authorization.)*

## Contract

[`docs/architecture/h1-hr-certification-register-preview.md`](../architecture/h1-hr-certification-register-preview.md)
