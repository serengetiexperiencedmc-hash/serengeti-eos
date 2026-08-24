# G5 Authorization — Regulation-to-Control Mapping Register (MAP=A)

**Date:** 2026-08-24  
**Authority:** Operator reply **MAP=A** (post-G4 governance packet).  
**Capability ID assigned by this record:** **G5**

This record assigns the ID. It does not invent I15.x, does not reopen I15, and does not treat G5 as an I15 continuation. G1 Compliance, P1 Privacy, G2 Control Catalogue, G3 Findings, and G4 Control-test campaigns remain closed.

| Field | Value |
| --- | --- |
| Capability ID | **G5** |
| Name | Regulation-to-control mapping register |
| Environment | Development/Test only |
| I15 ERM risk register | CLOSED — not reopened |
| G1 Compliance obligations | CLOSED — not reopened |
| P1 Privacy RoPA + DSR | CLOSED — not reopened |
| G2 GRC Control Catalogue | CLOSED — not reopened |
| G3 Findings register | CLOSED — not reopened |
| G4 Control-test campaigns | CLOSED — not reopened |
| I15.x | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope

Tenant-scoped regulation-to-control mapping register. Mapping code, title, optional description, optional owner label, status. Lifecycle `draft` → `active` → `retired`. Human-only mutation. Optional simple references to an existing G1 obligation identifier and an existing G2 control identifier (same tenant). Role `grc.mapping`. Permissions `grc:read:mapping` / `grc:write:mapping`. API `/v1/mappings`. UI **Compliance → Mappings**.

## Explicitly excluded

Sampled test execution engine, automated evidence collection, live regulatory feeds, legal interpretation, regulatory advice, AI-generated legal/compliance conclusions, production compliance workflows, UAT, Production, live PostgreSQL authorization, autonomous AI/remediation. Do not modify G1, P1, G2, G3, or G4 implementation.

## Contract

[`docs/architecture/g5-regulation-control-mapping-preview.md`](../architecture/g5-regulation-control-mapping-preview.md)
