# G3 Authorization — Findings Register (FIND=A)

**Date:** 2026-08-24  
**Authority:** Operator reply **FIND=A** (post-G2 governance packet).  
**Capability ID assigned by this record:** **G3**

This record assigns the ID. It does not invent I15.x, does not reopen I15, and does not treat G3 as an I15 continuation. G1 Compliance, P1 Privacy, and G2 Control Catalogue remain closed.

| Field | Value |
| --- | --- |
| Capability ID | **G3** |
| Name | Findings register |
| Environment | Development/Test only |
| I15 ERM risk register | CLOSED — not reopened |
| G1 Compliance obligations | CLOSED — not reopened |
| P1 Privacy RoPA + DSR | CLOSED — not reopened |
| G2 GRC Control Catalogue | CLOSED — not reopened |
| I15.x | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope

Tenant-scoped findings register. Finding code, title, optional description, optional owner label, status. Lifecycle `open` → `in_progress` → `closed` (close also allowed from `open`). Human-only mutation. Optional simple reference to an existing G2 control identifier (same tenant). Role `grc.finding`. Permissions `grc:read:finding` / `grc:write:finding`. API `/v1/findings`. UI **Compliance → Findings**.

## Explicitly excluded

Control-test campaigns, regulation-to-control mapping engine, automated evidence collection, legal interpretation, regulatory advice, live regulatory feeds, AI-generated legal/compliance conclusions, production compliance workflows, UAT, Production, live PostgreSQL authorization, autonomous AI/remediation. Do not modify G1, P1, or G2 implementation.

## Contract

[`docs/architecture/g3-findings-register-preview.md`](../architecture/g3-findings-register-preview.md)
