# Commercial Domain Roadmap — C1 to C10

> **CURRENT STATE (2026-08-24 documentation hygiene)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`c55b608001e6af764fc80bd41ce9844b24da60d8`**  
> C1–C10 are **IMPLEMENTED / CLOSED** for Development/Test. This document is no longer an open commercial programme.  
> **C11+ is not created and not authorized.** Procurement (**PO**) and Calendar (**CAL**) remain **DEFERRED**.  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Status:** **IMPLEMENTED / CLOSED (Dev/Test) through C10.** Planning language below is historical; it applies only to any future C11+ (none authorized).  
**Principle:** One integrated commercial platform — not three disconnected applications.

```
Relationship → Opportunity → RFP → Programme → Supplier → Cost → Approval → Proposal → Booking → Operations → Reconciliation → Intelligence
```

## Increment sequence

| ID | Increment | Depends on | Delivers |
| --- | --- | --- | --- |
| **C1** | CRM Foundation | I0–I4 | Organizations, contacts, relationships, accounts, interactions, tasks |
| **C2** | Opportunity / Pipeline | C1 | Opportunities, stages, forecasting hooks |
| **C3** | RFP Management | C2 | RFP intake, immutable versions, SLA |
| **C4** | Supplier Management | I1, C1 (refs) | Supplier master, onboarding, compliance, rates metadata |
| **C5** | Programme Builder | C3 | Structured itinerary/programme model |
| **C6** | Costing Engine | C4, C5 | Costs, currencies, markup, margin, versions |
| **C7** | Commercial Approval | C6, I2 | Workflow + rules for margin/thresholds |
| **C8** | Proposal Engine | C6, C7 | Structured proposals from programme + costing |
| **C9** | Booking & Handover | C8 | Confirmation, operational handover (no live banking) — **IMPLEMENTED / CLOSED** (Dev/Test) |
| **C10** | Booking Command Center | C9 | Command-center rollup — **IMPLEMENTED / CLOSED** (Dev/Test), [`c10-booking-command-center-preview.md`](./c10-booking-command-center-preview.md) |

## Domain map (target architecture)

| Domain | Scope |
| --- | --- |
| A — CRM | Organizations, contacts, relationships |
| B — Opportunity & Pipeline | Accounts, opportunities, stages |
| C — RFP Management | RFP, versions, requirements |
| D — Supplier Management | Master, compliance, rates |
| E — Programme / Itinerary | Structured operational programme |
| F — Costing & Commercials | Cost vs sell, versions |
| G — Proposal Management | Generated from structured data |
| H — Booking / Confirmation | Accepted proposal → booking |
| I — Operational Handover | Sell once → operate from same truth |
| J — Commercial Analytics | Post-programme intelligence (later) |

Do not implement all domains simultaneously. Follow C1→C10 (historical sequence — **already executed** in Dev/Test). C11+ is not authorized.

## Control plane reuse (mandatory)

All commercial modules consume:

- I0 — tenancy, RBAC/ABAC, SoD, audit hash chain
- I1 — org shell, principals, config
- I2 — workflow + rules (no second workflow engine in CRM/MICE)
- I4 — transactional outbox + governed event catalogue

## AI boundary (blocked)

Structured data is built now for future **advisory** AI. No autonomous agents. No direct database access for AI.

## Next document

[C1 CRM Foundation Preview](./c1-crm-preview.md) — historical contract (C1 already implemented; not a cue to write C1 code).
