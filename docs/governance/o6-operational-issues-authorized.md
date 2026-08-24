# O6 Authorization — Operational Issues Register

**Date:** 2026-08-24  
**Authority:** Operator reply **CANDIDATE=OPERATIONAL_ISSUES / DECISION=APPROVE / CAPABILITY_ID=O6** (post-G5 governance packet).  
**Capability ID assigned by this record:** **O6**

This record assigns **O6**. It is an operations-family identifier after O5. It is not G6, not I15.x, and not a successor to I15 or G1–G5. O1–O5, C9, and C10 remain closed and are not reopened. G1, P1, G2, G3, G4, and G5 remain closed. I15 remains closed. SAMPLE remains deferred.

| Field | Value |
| --- | --- |
| Capability ID | **O6** |
| Name | Operational Issues Register |
| Environment | Development/Test only |
| **IMPLEMENTATION_AUTHORIZED** | **YES** |
| I15 ERM risk register | CLOSED — not reopened |
| G1 / P1 / G2 / G3 / G4 / G5 | CLOSED — not reopened |
| SAMPLE | **DEFER** — not reopened |
| O1–O5 / C9 / C10 | CLOSED — not reopened (read-only booking reference only) |
| I15.x / G6 / I3.38 / I4.35 / I20.23 / PG.30 / C11 | Not created |

## Authorized scope

Tenant-scoped, human-maintained operational issue register against an existing same-tenant booking. Required `title`; optional `description` and `ownerLabel`; required booking reference; status. Lifecycle `open` → `in_progress` → `closed` (close also from `open`). Human-only mutation. Dedicated operational-issue read/write permissions (do not broaden existing Operations permissions or grant GRC permissions). API `/v1/ops/issues`. UI **Operations → Issues** at `/commercial/operations/issues`. Store key `operationalIssues`. Aggregate `operational_issues`. Runtime in-memory. Additive SQL `097_o6_operational_issues.sql`.

## Explicitly excluded

Automatic issue creation from O5 signals or sync conflicts; autonomous remediation; AI operational decisions; assignment boards; drag-and-drop workflows; SLA/escalation engines; documents; file/object storage; operational communications; SMS/email/Teams/WhatsApp; supplier-performance scoring; compliance conclusions; GRC integration; G1–G5 mutation; I15 reopen; SAMPLE; UAT; Production; live PostgreSQL; external vendor selection. O5 workbench is not redesigned. C9/C10 behaviour is not modified. Bookings remain read-only references.

## Implementation

**IMPLEMENTATION_AUTHORIZED=YES**

This record plus the architecture preview and a separate explicit execution instruction authorize kernel, API, RBAC, UI, tests, runtime store, and additive SQL for Development/Test.

## Contract

[`docs/architecture/o6-operational-issues-preview.md`](../architecture/o6-operational-issues-preview.md)
