# G4 Authorization — Control-Test Campaign Register (TEST=A)

**Date:** 2026-08-24  
**Authority:** Operator reply **TEST=A** (post-G3 governance packet).  
**Capability ID assigned by this record:** **G4**

This record assigns the ID. It does not invent I15.x, does not reopen I15, and does not treat G4 as an I15 continuation. G1 Compliance, P1 Privacy, G2 Control Catalogue, and G3 Findings remain closed.

| Field | Value |
| --- | --- |
| Capability ID | **G4** |
| Name | Control-test campaign register |
| Environment | Development/Test only |
| I15 ERM risk register | CLOSED — not reopened |
| G1 Compliance obligations | CLOSED — not reopened |
| P1 Privacy RoPA + DSR | CLOSED — not reopened |
| G2 GRC Control Catalogue | CLOSED — not reopened |
| G3 Findings register | CLOSED — not reopened |
| I15.x | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope

Tenant-scoped control-test campaign register. Campaign code, title, optional description, optional owner label, status. Lifecycle `planned` → `in_progress` → `closed` (close also allowed from `planned`). Human-only mutation. Optional simple reference to an existing G2 control identifier (same tenant). Role `grc.campaign`. Permissions `grc:read:campaign` / `grc:write:campaign`. API `/v1/control-tests`. UI **Compliance → Control tests**.

## Explicitly excluded

Regulation-to-control mapping engine, automated evidence collection, sampled test execution engine, legal interpretation, regulatory advice, live regulatory feeds, AI-generated legal/compliance conclusions, production compliance workflows, UAT, Production, live PostgreSQL authorization, autonomous AI/remediation. Do not modify G1, P1, G2, or G3 implementation.

## Contract

[`docs/architecture/g4-control-test-campaigns-preview.md`](../architecture/g4-control-test-campaigns-preview.md)
