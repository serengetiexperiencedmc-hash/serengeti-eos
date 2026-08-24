# P1 Authorization — Privacy RoPA + DSR (PRIV=A)

**Date:** 2026-08-24  
**Authority:** Operator reply **PRIV=A** (post-G1 governance packet).  
**Capability ID assigned by this record:** **P1**

This record assigns the ID. It does not invent I15.x, does not reopen I15, and does not treat P1 as an I15 continuation. G1 Compliance remains closed.

| Field | Value |
| --- | --- |
| Capability ID | **P1** |
| Name | Privacy RoPA + DSR register |
| Environment | Development/Test only |
| I15 ERM risk register | CLOSED — not reopened |
| G1 Compliance obligations | CLOSED — not reopened |
| I15.x | Not created |
| I21 / I22 / I23 / EMCOMMS / EXER / CAL / PO / SUCC / I20X / EXT | **D** — deferred / untouched |

## Authorized scope

Tenant-scoped processing-activity (RoPA) records and DSR cases. Human-only mutation. DSR lifecycle `open` → `in_progress` → `closed`. Creator cannot close their own DSR. Role `dpo`. API `/v1/privacy`. UI **Privacy → RoPA** and **Privacy → DSR**.

## Explicitly excluded

Live data erasure, PostgreSQL production deletion, consent-management platform, DPIA product, DLP, legal-opinion automation, automated PDPA/GDPR interpretation, live regulatory integrations, UAT, Production, AI/autonomous privacy decisions.

## Contract

[`docs/architecture/p1-privacy-ropa-dsr-preview.md`](../architecture/p1-privacy-ropa-dsr-preview.md)
