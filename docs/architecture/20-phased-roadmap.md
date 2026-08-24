# 20. Phased Implementation Roadmap

> **CURRENT STATE (2026-08-24 ITR1 Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST**  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=IT_RELEASE_REGISTER** · **CAPABILITY_ID=ITR1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)  
> Phase 0 “approval before expanding beyond Increment 0” is **historical**. Expansion already occurred in Development/Test and is **frozen**.  
> Remaining Phase 2–7 bullets that are not already shipped are **deferred / architecture inventory**, not a live implementation queue. Do not infer PO, CAL, Asset, UEM, EMCOMMS, EXER, I21–I23, or C11 from this roadmap. **ITR1** Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test ([`itr1-it-release-register-preview.md`](itr1-it-release-register-preview.md)) — not inferred from this roadmap; UAT/Production not authorized.

Human approval of Phase 0 was required before expanding beyond the Increment 0 kernel. The kernel was **Development-only**. *(Historical.)* The current frozen Dev/Test product is far beyond I0; Production remains unauthorized.

## Phase 0 — Architecture (this delivery)

Blueprint, domain map, security, AI, integration, events, DR, threat model, ADRs, backlog.

**Exit:** Named approvers sign ADR-0001…0014 (or record dissent). *(Historical Phase 0 exit. ADR-0006 / 0012 / 0013 remain **OPEN** Production/UAT blockers — they are not a reason to rebuild I0 or to start deferred streams.)*

## Phase 1 — Platform foundation

IAM, RBAC/ABAC, audit, org structure, workflow kernel, business rules kernel, notifications, API gateway patterns, event bus, configuration, administration shell.

**Exit:** Authorisation tests pass; audit hash-chain verified; no standing global admin in Test. *(Delivered in Dev/Test; frozen.)*

## Phase 2 — Core business

CRM, Sales, MICE, Operations, Supplier, Finance, HR: **delivered in Development/Test and CLOSED.**  
**Procurement (PO) and Calendar (CAL) remain DEFERRED** — they are **not** pending Phase 2 exit work. Offline field for assigned tasks: bounded I9 delivered.

**Exit:** RFP → programme → costing → approval path with SoD; field sync conflict tests. *(Commercial/ops path delivered without a PO or CAL product.)*

## Phase 3 — IT and security (defensive)

ITSM, CMDB, assets, monitoring, SOC integration, vulnerability, patch, UEM, PAM, secrets, ZTNA.

**Exit:** Unified incident model live; privileged paths PAM-gated.

> **Inventory, not authorized:** remaining Phase 3 bullets (assets, UEM, etc.) and later-phase items are **not** an execution queue. I11, ITC1, ITP1, ITR1, I12–I14 bounded slices already shipped. Asset / License remain deferred/inventory.

## Phase 4 — Governance

ERM, Compliance, Internal Audit, Privacy, DLP, Data Governance, BCM, Crisis, Emergency comms, Exercises.

**Exit:** Regulation→control mapping configurable; crisis declaration human-only.

> Bounded GRC/privacy/BCM/crisis **registers** shipped in Dev/Test. **EMCOMMS** and **EXER** remain **DEFERRED**.

## Phase 5 — Data and AI

Lakehouse, knowledge graph engine, enterprise search, AI orchestration, agents, decision intelligence.

**Exit:** Permission-aware search tests; AI eval gates in CI; no Highly Restricted AI egress.

> Bounded I19 search and I20 L0–L1 shipped. Lakehouse, graph engine, L3+, and I21 remain inventory/deferred.

## Phase 6 — Integration

API platform, event platform at scale, developer portal, partner IAM, external APIs, provider failover.

**Exit:** Partner tenant isolation tests; no internal data leakage.

> **I22 / EXT deferred.** Not a live queue.

## Phase 7 — Optimisation

Process mining, AIOps, predictive operations, advanced analytics.

**Exit:** Correlation reduces alert noise with measured precision; humans still approve consequential actions.

> **I23 deferred.** Not a live queue.

## Sequencing rule

Do not start Phase N+2 while Phase N exit criteria are red, except for spikes documented as time-boxed ADRs.

> **Freeze:** this sequencing rule must not be read as “keep building Phase 2 leftovers” (PO/CAL) or as authorization to enter Phase 3+ deferred inventory. **EXECUTION_QUEUE=EMPTY.**

