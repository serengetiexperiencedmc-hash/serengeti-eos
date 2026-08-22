# 20. Phased Implementation Roadmap

Human approval of Phase 0 is required before expanding beyond the Increment 0 kernel. The kernel is **Development-only**.

## Phase 0 — Architecture (this delivery)

Blueprint, domain map, security, AI, integration, events, DR, threat model, ADRs, backlog.

**Exit:** Named approvers sign ADR-0001…0014 (or record dissent).

## Phase 1 — Platform foundation

IAM, RBAC/ABAC, audit, org structure, workflow kernel, business rules kernel, notifications, API gateway patterns, event bus, configuration, administration shell.

**Exit:** Authorisation tests pass; audit hash-chain verified; no standing global admin in Test.

## Phase 2 — Core business

CRM, Sales, MICE, Operations, Supplier, Finance, Procurement, HR, Calendar. Offline field for assigned tasks.

**Exit:** RFP → programme → costing → approval path with SoD; field sync conflict tests.

## Phase 3 — IT and security (defensive)

ITSM, CMDB, assets, monitoring, SOC integration, vulnerability, patch, UEM, PAM, secrets, ZTNA.

**Exit:** Unified incident model live; privileged paths PAM-gated.

## Phase 4 — Governance

ERM, Compliance, Internal Audit, Privacy, DLP, Data Governance, BCM, Crisis, Emergency comms, Exercises.

**Exit:** Regulation→control mapping configurable; crisis declaration human-only.

## Phase 5 — Data and AI

Lakehouse, knowledge graph engine, enterprise search, AI orchestration, agents, decision intelligence.

**Exit:** Permission-aware search tests; AI eval gates in CI; no Highly Restricted AI egress.

## Phase 6 — Integration

API platform, event platform at scale, developer portal, partner IAM, external APIs, provider failover.

**Exit:** Partner tenant isolation tests; no internal data leakage.

## Phase 7 — Optimisation

Process mining, AIOps, predictive operations, advanced analytics.

**Exit:** Correlation reduces alert noise with measured precision; humans still approve consequential actions.

## Sequencing rule

Do not start Phase N+2 while Phase N exit criteria are red, except for spikes documented as time-boxed ADRs.
