# K1 Authorization — Crisis Decision Log

**Date:** 2026-08-24  
**Authority:** Operator grant of governance authority to assign a literal ID for **CANDIDATE=CRISIS_DECISION_LOG / DECISION=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED**.  
**Capability ID assigned by this record:** **K1**

This record assigns **K1**. It is a **crisis-command family** identifier after I18. It is **not** O7 (operations family; O6 is closed). It is **not** I18.x (I18 is closed and must not be reopened). It is **not** G6 (GRC family; G1–G5 are closed). I17, I18, O1–O6, C9, C10, G1–G5, P1, and I15 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **K1** |
| Name | Crisis Decision Log |
| Environment | Development/Test only |
| **IMPLEMENTATION_AUTHORIZED** | **YES** |
| I18 Crisis overlay | CLOSED — not reopened (read-only parent `crisis_cases` only) |
| I17 BCM backup evidence | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| I15 ERM risk register | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I18.x / O7 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope (preview/contract only)

Tenant-scoped, human-maintained **decision log** against an existing same-tenant **open** I18 crisis case. Required `title`; required `crisisId`; optional `options`, `chosenAction`, `rationale`, and `authorityLabel` (text, not a principal id); status. Lifecycle `recorded` → `superseded` (`superseded` terminal). Human-only mutation. Dedicated decision read/write permissions (do not broaden I18 `crisis.commander` / case / timeline permissions). API `/v1/crisis/decisions`. UI on the Crisis workspace (declaration remains I18). Store key `crisisDecisions`. Aggregate `crisis_decisions`. Runtime in-memory. Additive SQL `098_k1_crisis_decisions.sql`.

## Explicitly excluded

Emergency communications (SMS / voice / Teams / email blasts); exercise engine / AI injects; action tracker with owners-as-principals or due times; communications log; resource allocation; financial-impact estimates; linking FKs to I11 tickets or programmes; I18 reopen or mutation of `crisis_cases` / timeline behaviour; SAMPLE; I21–I23; UAT; Production; live PostgreSQL; external vendor selection; autonomous AI declaration or decision recording. I18 `/v1/crisis/health` increment remains **I18**.

## Implementation

**IMPLEMENTATION_AUTHORIZED=YES**

This record plus the architecture preview and a separate explicit execution instruction authorize kernel, API, RBAC, UI, tests, runtime store, and additive SQL for Development/Test.

## Contract

[`docs/architecture/k1-crisis-decision-log-preview.md`](../architecture/k1-crisis-decision-log-preview.md)
