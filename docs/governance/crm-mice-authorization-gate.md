# CRM/MICE Authorization Gate — 2026-08-22

## Gate decision

| Gate | Status |
| --- | --- |
| I4 Outbox/Event Foundation | **ACCEPTED** for Development/Testing |
| CRM Foundation (C1) | **AUTHORIZED** — architecture preview first, then implementation |
| Supplier Management (C4) | **AUTHORIZED** (after dependencies) |
| MICE RFP & Costing (C3–C9) | **AUTHORIZED** (in dependency order) |
| CRM/MICE Production readiness | **NOT APPROVED** |
| AI Agents | **REMAIN BLOCKED** |
| UAT | **REMAIN BLOCKED** |
| Production | **REMAIN BLOCKED** |
| ADR-0006 / 0012 / 0013 | **REMAIN OPEN** |
| ADR-0010 Event Transport | **Dev/Test only** |

**CRM/MICE development dependency gate: PASSED.**

## What this permits

Development of the integrated commercial-domain architecture and controlled increments (C1→C9) inside **Development/Test** only.

## What remains prohibited

- Production deployment, production customer data, production financial/payment processing
- Production supplier contracts as legally binding system-of-record without formal readiness
- Autonomous AI actions, direct AI database mutation
- External production integrations (ERP, CRS, GDS, banking, SMS, email as live Prod)
- UAT infrastructure, production NATS, production identity infrastructure
- Closing ADR-0006 / 0012 / 0013 by assumption

## Immediate next step

Review [`c1-crm-preview.md`](../architecture/c1-crm-preview.md) and [`c1/`](../architecture/c1/) deliverables.

**C1 implementation: NOT YET AUTHORIZED.** After approval → implement C1.1–C1.10 → return for **C1 gate** before C2.

## Official platform statement

> Serengeti EOS is an actively developed enterprise platform foundation with the Core Control Plane and generic Event Infrastructure established for Development/Test. CRM, Supplier Management and MICE commercial-domain development are now authorized in controlled increments. AI agents, UAT and Production remain blocked.

Test results remain development evidence only — not security, compliance, or production certification.
