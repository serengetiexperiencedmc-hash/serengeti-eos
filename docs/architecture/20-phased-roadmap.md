# 20. Phased Implementation Roadmap

> **CURRENT STATE (2026-08-29 Owner PR2 DEV/TEST PREVIEW — authorized for this PR2 in-memory API run only; EXECUTED)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`01d62322453af837026827018caf278f7b8f8071`** (`origin/master`; `feat(pr1): implement procurement catalogue`)  
> **NEW_CAPABILITY_AUTHORIZED=NONE** · **NEXT_INCREMENT=NONE_AUTHORIZED** · **PATH_B_GENERAL_AUTO_SELECTION=PAUSED** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN**  
> Latest completed capability = **PR1 Procurement Catalogue** (**IMPLEMENTATION=COMPLETED**; Preview **PASS**; commit **COMPLETED**; push **COMPLETED**). **DG1** Dataset Register remains **COMPLETE**. **HOLD** remains **IN FORCE** for UAT / Production.  
> **PR2** **SourcingEvent** is **SELECTED**; **CAPABILITY_ID=PR2** Owner-assigned ([`../governance/pr2-sourcing-event-authorized.md`](../governance/pr2-sourcing-event-authorized.md)). Approved Stage 1: [`pr2-sourcing-event-preview.md`](pr2-sourcing-event-preview.md). **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES**. **TEST EXECUTION=COMPLETED / PASS**. **PREVIEW=AUTHORIZED FOR THIS PR2 DEV/TEST RUN ONLY (EXECUTED)**. **EXECUTION_QUEUE=PR2 — SourcingEvent** (this in-memory API preview EXECUTED; commit / push not authorized).  
> **PR1** remains **IMPLEMENTED / CLOSED** ([`../governance/pr1-procurement-authorized.md`](../governance/pr1-procurement-authorized.md)). **CAL** remains **DEFERRED**.  
> Phase 0 “approval before expanding beyond Increment 0” is **historical**. Expansion already occurred in Development/Test and is **frozen**.  
> Remaining Phase 2–7 bullets that are not already shipped are **deferred / architecture inventory**, not a live implementation queue. Do not infer CAL, UEM, EMCOMMS, EXER, I21–I23, or C11 from this roadmap. **ITA1** Asset Register and **ITL1** License Register are **IMPLEMENTED / CLOSED** for Development/Test. **E1**, **E2**, **ITE1**, **P3**, **DG1**, and **PR1** are **IMPLEMENTED / CLOSED** for Development/Test. This does **not** undefer UEM or authorize UAT or Production.

Human approval of Phase 0 was required before expanding beyond the Increment 0 kernel. The kernel was **Development-only**. *(Historical.)* The current frozen Dev/Test product is far beyond I0; Production remains unauthorized.

## Phase 0 — Architecture (this delivery)

Blueprint, domain map, security, AI, integration, events, DR, threat model, ADRs, backlog.

**Exit:** Named approvers sign ADR-0001…0014 (or record dissent). *(Historical Phase 0 exit. ADR-0006 / 0012 / 0013 remain **OPEN** Production/UAT blockers — they are not a reason to rebuild I0 or to start deferred streams.)*

## Phase 1 — Platform foundation

IAM, RBAC/ABAC, audit, org structure, workflow kernel, business rules kernel, notifications, API gateway patterns, event bus, configuration, administration shell.

**Exit:** Authorisation tests pass; audit hash-chain verified; no standing global admin in Test. *(Delivered in Dev/Test; frozen.)*

## Phase 2 — Core business

CRM, Sales, MICE, Operations, Supplier, Finance, HR: **delivered in Development/Test and CLOSED.**  
**Procurement (PO)** is **SELECTED** as **PR1**. Stage 1 is **APPROVED**. Development/Test implementation is **COMPLETED**. Preview **PASS**. Commit **COMPLETED**. Push **COMPLETED**. **Calendar (CAL) remains DEFERRED.** Neither is pending Phase 2 exit work. Offline field for assigned tasks: bounded I9 delivered.

**Exit:** RFP → programme → costing → approval path with SoD; field sync conflict tests. *(Commercial/ops path delivered without a PO or CAL product.)*

## Phase 3 — IT and security (defensive)

ITSM, CMDB, assets, monitoring, SOC integration, vulnerability, patch, UEM, PAM, secrets, ZTNA.

**Exit:** Unified incident model live; privileged paths PAM-gated.

> **Inventory, not authorized:** remaining Phase 3 bullets (UEM, etc.) and later-phase items are **not** an execution queue. I11, ITC1, ITP1, ITR1, I12–I14 bounded slices already shipped. **ITA1** Asset Register and **ITL1** License Register have already shipped and are **CLOSED** for Development/Test. This does **not** undefer UEM or any other deferred Asset capability, and does **not** authorize any new Asset capability.

## Phase 4 — Governance

ERM, Compliance, Internal Audit, Privacy, DLP, Data Governance, BCM, Crisis, Emergency comms, Exercises.

**Exit:** Regulation→control mapping configurable; crisis declaration human-only.

> Bounded GRC/privacy/BCM/crisis **registers** shipped in Dev/Test. **P2** DPIA Register is **IMPLEMENTED / CLOSED**. **P3** Consent Register is **COMPLETE**. **DG1** Dataset Register is **COMPLETE**. Classification, Lineage, and QualityRule remain **unselected** and are **not** a queue. **EMCOMMS** and **EXER** remain **DEFERRED**.

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

