# G2 Authorization — GRC Control Catalogue (GRC=A)

**Date:** 2026-08-24  
**Authority:** Operator reply **GRC=A** (post-P1 governance packet).  
**Capability ID assigned by this record:** **G2**

This record assigns the ID. It does not invent I15.x, does not reopen I15, and does not treat G2 as an I15 continuation. G1 Compliance and P1 Privacy remain closed.

| Field | Value |
| --- | --- |
| Capability ID | **G2** |
| Name | GRC Control Catalogue |
| Environment | Development/Test only |
| I15 ERM risk register | CLOSED — not reopened |
| G1 Compliance obligations | CLOSED — not reopened |
| P1 Privacy RoPA + DSR | CLOSED — not reopened |
| I15.x | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope

Tenant-scoped control catalogue. Control code, title, description, status, optional owner label. Lifecycle `draft` → `active` → `retired`. Human-only mutation. Optional simple reference to an existing G1 obligation identifier (same tenant). Role `grc.control`. Permissions `grc:read:control` / `grc:write:control`. API `/v1/grc`. UI **Compliance → Controls**.

## Explicitly excluded

Findings management, control testing/campaigns, risk scoring, regulation-to-control mapping engine, automated evidence collection, legal interpretation, regulatory advice, live regulatory feeds, AI-generated legal/compliance conclusions, production compliance workflows, UAT, Production, live PostgreSQL authorization, autonomous AI/remediation. Do not modify G1 or P1 implementation.

## Contract

[`docs/architecture/g2-grc-control-catalogue-preview.md`](../architecture/g2-grc-control-catalogue-preview.md)
