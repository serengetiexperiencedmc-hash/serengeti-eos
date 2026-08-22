# Commercial Domain Roadmap — C1 to C9

**Status:** Authorized for Development/Test planning  
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
| **C9** | Booking & Handover | C8 | Confirmation, operational handover (no live banking) |

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

Do not implement all domains simultaneously. Follow C1→C9.

## Control plane reuse (mandatory)

All commercial modules consume:

- I0 — tenancy, RBAC/ABAC, SoD, audit hash chain
- I1 — org shell, principals, config
- I2 — workflow + rules (no second workflow engine in CRM/MICE)
- I4 — transactional outbox + governed event catalogue

## AI boundary (blocked)

Structured data is built now for future **advisory** AI. No autonomous agents. No direct database access for AI.

## Next document

[C1 CRM Foundation Preview](./c1-crm-preview.md) — required before C1 code.
