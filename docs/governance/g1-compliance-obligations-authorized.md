# G1 Authorization — Compliance Obligations (COMP=A)

**Date:** 2026-08-24  
**Authority:** Operator reply **COMP=A** (post-I18 governance packet).  
**Capability ID assigned by this record:** **G1**

This record assigns the ID. It does not invent I15.x and does not reopen I15.

| Field | Value |
| --- | --- |
| Capability ID | **G1** |
| Name | Compliance obligations register |
| Environment | Development/Test only |
| I15 ERM risk register | CLOSED — not reopened |
| I15.x | Not created |
| PRIV / I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope

Obligation register: code, title, status, optional owner label. Tenant isolation. Human-only mutation. Role `compliance.member`. API `/v1/compliance`. UI **Compliance → Obligations**.

## Explicitly excluded

Control library, test campaigns, findings, regulation-mapping product, legal-opinion automation, automated legal interpretation, live regulatory integrations, production data processing, UAT, Production, AI/autonomous behaviour.

## Contract

[`docs/architecture/g1-compliance-obligations-preview.md`](../architecture/g1-compliance-obligations-preview.md)
