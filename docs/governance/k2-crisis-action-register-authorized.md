# K2 Authorization — Crisis Action Register

**Date:** 2026-08-24  
**Authority:** Operator / product-owner decision **CANDIDATE=CRISIS_ACTION_REGISTER / DECISION=APPROVE / CAPABILITY_ID=K2 / FAMILY=CRISIS_COMMAND / CONTRACT=APPROVE / EXCLUSIONS=APPROVE / PREVIEW=AUTHORIZE / IMPLEMENTATION=NOT_YET_AUTHORIZED**.  
**Capability ID assigned by this record:** **K2**

This record assigns **K2**. It is a **crisis-command family** identifier after I18 and K1. It is **not** O7 (operations family; O6 is closed). It is **not** I18.x (I18 is closed and must not be reopened). It is **not** G6 (GRC family; G1–G5 are closed). It is **not** a reopen or mutation of K1. I17, I18, K1, O1–O6, C9, C10, G1–G5, P1, and I15 remain closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **K2** |
| Name | Crisis Action Register |
| Family | crisis-command |
| Environment | Development/Test only |
| **IMPLEMENTATION_AUTHORIZED** | **YES** |
| I18 Crisis overlay | CLOSED — not reopened (read-only parent `crisis_cases` only) |
| K1 Crisis Decision Log | CLOSED — not reopened |
| I17 BCM backup evidence | CLOSED — not reopened |
| O1–O6 / C9 / C10 | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| I15 ERM risk register | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| I18.x / O7 / G6 / I15.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope (preview/contract only)

Tenant-scoped, human-maintained **action register** against an existing same-tenant **open** I18 crisis case. Required `title`; required `crisisId`; optional `ownerLabel` (text, not a principal id) and `notes`; status. Lifecycle `open` → `done`, `open` → `cancelled` (`done` and `cancelled` terminal). `crisisId` immutable after create. Human-only mutation. Dedicated action read/write permissions (do not broaden I18 `crisis.commander` / case / timeline permissions or K1 decision permissions). API `/v1/crisis/actions`. UI **Crisis → Actions** at `/commercial/crisis/actions` (declaration remains I18; decisions remain K1). Store key `crisisActions`. Aggregate `crisis_actions`. Runtime in-memory. Additive SQL `099_k2_crisis_actions.sql`.

K2 is **not** the full Architecture 13.2 action tracker: no principal assignment, due times, SLA, reminders, escalation, or scheduling engine.

## Explicitly excluded

Emergency communications (SMS / voice / Teams / email blasts); exercise engine / AI injects; full action tracker with owners-as-principals or due times; communications log; resource allocation; financial-impact estimates; recovery review; linking FKs to I11 tickets or programmes; I18 reopen or mutation of `crisis_cases` / timeline behaviour; K1 mutation; O6 mutation; G1–G5 mutation; SAMPLE; I21–I23; CAL; PO; SUCC; I20X; EXT; UAT; Production; live PostgreSQL; external vendor selection; IdP/vault/SIEM changes; autonomous AI action creation or execution. I18 `/v1/crisis/health` increment remains **I18**. K1 `/v1/crisis/decisions/health` increment remains **K1**.

## Implementation

**IMPLEMENTATION_AUTHORIZED=YES**

This record plus the architecture preview and a separate explicit execution instruction authorize kernel, API, RBAC, UI, tests, runtime store, and additive SQL for Development/Test.

## Contract

[`docs/architecture/k2-crisis-action-register-preview.md`](../architecture/k2-crisis-action-register-preview.md)
