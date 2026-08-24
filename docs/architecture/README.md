# Phase 0 — Enterprise Architecture Index

**System:** Serengeti Experience DMC Enterprise Operating System (EOS)  
**Classification:** Internal  
**Status:** Phase 0 architecture remains **normative**. The Development/Test **product is frozen** including ITR1 — not limited to Increment 0. **UAT=NOT_AUTHORIZED. PRODUCTION=NOT_AUTHORIZED.**  
**Version:** 0.1.0  
**Date:** 2026-08-21 (index); current-state annotation 2026-08-24  

> **CURRENT STATE (2026-08-24 ITR1 Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=IT_RELEASE_REGISTER** · **CAPABILITY_ID=ITR1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)  
> Increment 0 through the closed commercial, ops, GRC, HR, ITSM-register, and bounded I20 surfaces already shipped in Development/Test. ITR1 Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test ([`itr1-it-release-register-preview.md`](itr1-it-release-register-preview.md)). This index must not be read as “stop at I0”, as UAT/Production authorization, or as a licence to start deferred streams (PO, CAL, etc.).  
> Open Production blockers remain **ADR-0006, ADR-0012, ADR-0013**.

This index maps the 30 required Phase 0 deliverables. Architecture is **normative**. Where code and architecture diverge, architecture wins until an ADR is approved.

## Existing-estate findings (mandatory pre-code inspection)

| Finding | Implication |
| --- | --- |
| Parent workspace is MICE branding HTML/PDF only | No application runtime to reuse |
| No IAM, database, APIs, CI, or observability | Greenfield platform, isolated under `serengeti-eos/` |
| Risk-management HTML is collateral, not a GRC system | Do not treat it as an operational control library |
| No existing credentials, vendor contracts, or live integrations in repo | Do not fabricate APIs, licenses, or regulatory certifications |
| Daily 19:00 EAT backup was previously specified | Binding DR requirement (see ADR-0011) |

## Deliverable map

| # | Deliverable | Document |
| --- | --- | --- |
| 1 | Enterprise Architecture Blueprint | [01-enterprise-architecture-blueprint.md](01-enterprise-architecture-blueprint.md) |
| 2 | Complete module/domain map | [02-module-domain-map.md](02-module-domain-map.md) |
| 3 | System context diagram | [03-system-context.md](03-system-context.md) |
| 4 | Logical architecture diagram | [04-logical-architecture.md](04-logical-architecture.md) |
| 5 | Data architecture | [05-data-architecture.md](05-data-architecture.md) |
| 6 | Identity/security architecture | [06-identity-security-architecture.md](06-identity-security-architecture.md) |
| 7 | AI architecture | [07-ai-architecture.md](07-ai-architecture.md) |
| 8 | Integration architecture | [08-integration-architecture.md](08-integration-architecture.md) |
| 9 | Event architecture | [09-event-architecture.md](09-event-architecture.md) |
| 10 | Knowledge Graph architecture | [10-knowledge-graph-architecture.md](10-knowledge-graph-architecture.md) |
| 11 | CMDB architecture | [11-cmdb-architecture.md](11-cmdb-architecture.md) |
| 12 | BCM/DR architecture | [12-bcm-dr-architecture.md](12-bcm-dr-architecture.md) |
| 13 | Crisis Command Center architecture | [13-crisis-command-center.md](13-crisis-command-center.md) |
| 14 | Threat model | [14-threat-model.md](14-threat-model.md) |
| 15 | Trust boundaries | [15-trust-boundaries.md](15-trust-boundaries.md) |
| 16 | Human approval matrix | [16-human-approval-matrix.md](16-human-approval-matrix.md) |
| 17 | AI autonomy matrix | [17-ai-autonomy-matrix.md](17-ai-autonomy-matrix.md) |
| 18 | Primary/backup provider architecture | [18-primary-backup-providers.md](18-primary-backup-providers.md) |
| 19 | Technology-stack recommendation | [19-technology-stack.md](19-technology-stack.md) |
| 20 | Phased implementation roadmap | [20-phased-roadmap.md](20-phased-roadmap.md) |
| 21 | Initial database schema | [21-initial-database-schema.md](21-initial-database-schema.md) |
| 22 | Initial API specification | [openapi/eos-v0.yaml](openapi/eos-v0.yaml) |
| 23 | Initial event catalogue | [23-initial-event-catalogue.md](23-initial-event-catalogue.md) |
| 24 | Initial RBAC/ABAC model | [24-rbac-abac-model.md](24-rbac-abac-model.md) |
| 25 | Initial CI/CD architecture | [25-cicd-architecture.md](25-cicd-architecture.md) |
| 26 | Initial testing strategy | [26-testing-strategy.md](26-testing-strategy.md) |
| 27 | Initial deployment architecture | [27-deployment-architecture.md](27-deployment-architecture.md) |
| 28 | Architecture Decision Register | [../adr/README.md](../adr/README.md) |
| 29 | Platform risk register | [29-platform-risk-register.md](29-platform-risk-register.md) |
| 30 | Development backlog | [../backlog/increments.md](../backlog/increments.md) |

## Human approval required before Phase 1 expansion

Do not treat the following as decided:

1. Cloud vs on-prem vs hybrid and data-residency region (ADR-0006)
2. Corporate IdP (Entra ID / Google Workspace / Keycloak / other) (ADR-0013)
3. Secrets platform (Vault vs cloud KMS) (ADR-0012)
4. Existing finance/ERP, PMS/CRS, GDS, SMS, and email providers (unknown)
5. Lawful bases and records of processing (legal review)
6. Whether cardholder data will ever enter this platform (PCI scope)

Increment 0 proceeded on **local Development** using replaceable abstractions for identity, secrets, and providers. *(Historical Phase 0 instruction.)* Expansion beyond I0 in Development/Test already occurred and is **closed/frozen**. That history does **not** authorize UAT, Production, or deferred streams.

## Commercial domain (authorized 2026-08-22; **CLOSED** in Dev/Test as of freeze)

| Document | Purpose |
| --- | --- |
| [commercial-roadmap.md](commercial-roadmap.md) | C1–C10 increment sequence — **IMPLEMENTED / CLOSED** (Dev/Test). C11+ not created. |
| [c1-crm-preview.md](c1-crm-preview.md) | **C1 historical contract** — **IMPLEMENTED / CLOSED** (Dev/Test); Gate **PASS** |
| [c1/](c1/) | C1 pre-implementation deliverables (16 artifacts) — historical |
| [../governance/crm-mice-authorization-gate.md](../governance/crm-mice-authorization-gate.md) | Gate decision record (C1 implementation status superseded by later C1 Gate **PASS**) |
