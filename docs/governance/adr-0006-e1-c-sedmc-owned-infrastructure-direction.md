# E1-C — SEDMC-Owned Infrastructure Direction

> **`PREFERRED ARCHITECTURAL DIRECTION — NOT PRODUCTION APPROVAL`**  
> **`SEDMC-OWNED SERVERS = INTENDED FUTURE PRIMARY TARGET`**  
> **`TANZANIAN FACILITY = PREFERRED FUTURE LOCATION — NOT SELECTED`**  
> **`HARDWARE = NOT SELECTED`** · **`PROCUREMENT = NOT AUTHORIZED`**  
> **`NO SERVERS OWNED / COMMISSIONED UNDER THIS RECORD`**  
> **`NO FACILITY CONTRACTED`** · **`NO COLOCATION SELECTED`**  
> **`CLOUD = OPTIONAL FUTURE CONTINGENCY — NOT SELECTED — NOT REQUIRED NOW`**  
> **`E1-B PROVIDER TRANSMISSION = PAUSED / SUPERSEDED AS CURRENT NEXT ACTION`**  
> **`0 TRANSMISSIONS`** · **`0 RESPONSES`** · **`0 RECEIPTS`**  
> **`NO PROVIDER SELECTED`** · **`NO RANKING`** · **`NO EVALUATION PERFORMED`**  
> **`E1 = NOT APPROVED / BLOCKED`** · **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Gate C = OPEN`** · **`Production architecture = NOT APPROVED`**  
> **`Production deployment = NOT AUTHORIZED`** · **`Production migration = NOT AUTHORIZED`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Local machine = CURRENT DEV/TEST ENVIRONMENT ONLY`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Working tree:** DIRTY (pre-existing Class A/B and E1-C diffs preserved).  
**Decision authority for this direction recording:** owner architectural direction supplied in this governance session. Named wet-ink signature image **not fabricated**.

This file does **not** purchase servers, select a facility, select a cloud, send RFI, provision Production, or close E1 / ADR-0006 / DP-0006.

Companions:

| Artefact | Path |
| --- | --- |
| Requirements framework | [`adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md`](adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md) |
| Deployment-readiness plan | [`adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md`](adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md) |
| Capacity and facility assessment specification | [`adr-0006-e1-c-capacity-and-facility-assessment-specification.md`](adr-0006-e1-c-capacity-and-facility-assessment-specification.md) |
| Assessment execution package | [`adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md`](adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md) |
| HUM-CAP-01 authorization | [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md) |
| Assessment results | [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md) |
| Portability / deployment abstraction | [`adr-0006-e1-c-infrastructure-portability-and-deployment-abstraction.md`](adr-0006-e1-c-infrastructure-portability-and-deployment-abstraction.md) |
| Historical E1-B issuance authorization (preserved) | [`adr-0006-e1-b-external-issuance-authorization.md`](adr-0006-e1-b-external-issuance-authorization.md) |
| Live E1-B execution sheet (now paused for current execution) | [`adr-0006-e1-b-final-transmission-execution-sheet.md`](adr-0006-e1-b-final-transmission-execution-sheet.md) |
| Owner formal decision (BCM, DPO designation, historical SEND) | [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md) |

---

## A. Direction

SEDMC intends to **build and operate its own server infrastructure** for EOS, **preferably in a suitable Tanzanian facility**, subject to future facility, hardware, security, legal, operational, financial, and recovery due diligence.

SEDMC-owned infrastructure is the **current preferred architectural direction** for EOS.

This is **direction**, not:

- Production architecture approval;
- a selected facility;
- a selected hardware bill of materials;
- a completed legal/privacy assessment;
- demonstrated technical RTO/RPO;
- authorization to procure, deploy, or migrate Production.

DP-0006 remains **OPEN**. Architecture classes A–D remain **unselected as Production architecture**. Class C (Tanzania-controlled colo/local) is the **preferred future location class for this direction only**; it is **not** an approved Production architecture.

---

## B. Current limitation

| Item | Status |
| --- | --- |
| SEDMC-owned Production servers | **NOT IN PLACE** — not selected, not purchased, not commissioned |
| Tanzanian facility | **PREFERRED FUTURE LOCATION** — **not selected**, not contracted, not approved |
| Hardware | **NOT SELECTED** |
| Procurement | **NOT AUTHORIZED** |
| Colocation contract | **NOT SELECTED / NOT AUTHORIZED** |
| Isolated Production environment | **DOES NOT EXIST** |
| Production data processing | **NOT AUTHORIZED** |

Do **not** state that SEDMC already owns Production servers or has selected a Tanzanian facility.

---

## C. Development approach

Until SEDMC-owned infrastructure is available:

| Environment | Role | Label |
| --- | --- | --- |
| Local development machine | Current development environment | **DEV/TEST ONLY** |
| Local filesystem | Document bytes | **DEV/TEST ONLY** — not Production durability |
| Local / authorized disposable PostgreSQL | Durable Dev/Test SoR where already authorized | **DEV/TEST ONLY** |
| `local-password-dev`, `env-dev`, `in-memory-dev`, `dev-outbox` / smtp-stub | Identity, secrets, events, email | **DEV/TEST ONLY** |

EOS development and authorized Dev/Test **continue locally**. They do **not** wait for Production infrastructure. Local disk is **not** Production, Production backup, Production DR, approved data-residency architecture, or technical RTO/RPO evidence.

---

## D. Future deployment targets

The existing provider-neutral infrastructure boundary must continue to support:

1. **Primary intended target:** SEDMC-owned servers in a suitable Tanzanian facility (facility **not selected**).  
2. **Optional future contingency:** a qualified third-party / cloud provider **if subsequently approved**.

Cloud provider selection is **not required** for the current primary direction. No cloud provider is selected or approved. No cloud contract, account, or infrastructure may be created under this record.

Cloud providers are **not permanently excluded**. They are **not currently required**.

---

## E. Portability requirement

The application must **not** require a business-logic rewrite when moving among:

1. Local Dev/Test  
2. SEDMC-owned infrastructure  
3. Qualified third-party / cloud infrastructure (if later approved)

Ports already established (PostgreSQL URL/TLS/pool; `DocumentStorage`; `IdentityProvider`; secrets configuration; email adapter; event transport; structured logs / health / ready) remain the boundary. Future adapters are **FUTURE PROVIDER IMPLEMENTATION**. This direction does **not** add provider-specific Production IaC.

---

## F. Explicit non-authorizations

This direction **DOES NOT** authorize:

- server procurement;
- facility selection;
- colocation contract;
- cloud provider selection;
- Production architecture approval;
- Production deployment;
- Production migration;
- Production data processing;
- Production backup or DR activation;
- UAT as Production-like customer use;
- purchase of hardware brands/models;
- DNS cutover;
- Production secrets, IdP, KMS, WAF, or CDN;
- closing E1, ADR-0006, or DP-0006.

---

## G. Evidence limitations (unresolved)

None of the following is completed by this record. Do **not** invent evidence.

| Topic | Status |
| --- | --- |
| Legal entity evidence (E-01) | **NOT VERIFIED** — company-provided name only |
| PDPC status (E-02 / HUM-02) | **NOT ESTABLISHED / NOT VERIFIED** |
| Formal DPO appointment evidence | Owner-designated **Wensley Shirima**; **formal appointment REQUIRED** |
| Facility due diligence | **NOT PERFORMED** |
| Data residency and legal assessment for a chosen facility | **NOT COMPLETE** — architecture-dependent |
| Hardware sizing | **REQUIRES TECHNICAL CAPACITY ASSESSMENT** |
| Redundancy design | **NOT DESIGNED / NOT APPROVED** |
| Network and security design | **NOT DESIGNED / NOT APPROVED** |
| Identity provider | **UNSELECTED** |
| Secrets management | ADR-0012 **OPEN** |
| Backup / PITR design | **NOT DEMONSTRATED** |
| Disaster recovery and failover design | **NOT DEMONSTRATED** |
| Technical RTO | **NOT DEMONSTRATED** |
| Technical RPO | **NOT DEMONSTRATED** |
| Operating model / named operators | **NOT ESTABLISHED** except existing owner/DPO designation facts |
| Total cost of ownership | HUM-09 **TCO-FIRST / BUDGET NOT YET FIXED** |
| Procurement and maintenance arrangements | **NOT AUTHORIZED** |

Business continuity **priority** remains owner-confirmed **S2**: Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers. Business targets remain critical function **≤ 3 hours**, overall **≤ 4 hours**, and zero tolerated loss of **critical business data**. Those are **business requirements**, not demonstrated technical RTO/RPO.

---

## H. E1-B RFI reconciliation (authorization preserved; current execution paused)

### Historical (do not erase)

| Fact | Record |
| --- | --- |
| External issuance authorization | **DID EXIST** — information-gathering / market-evidence only ([`adr-0006-e1-b-external-issuance-authorization.md`](adr-0006-e1-b-external-issuance-authorization.md)) |
| Frozen package | Questionnaire / PE-01–PE-48 / standard template **unchanged**; hashes frozen |
| Routing | **9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD** |
| Owner SEND decision (2026-09-17) | **DID EXIST** — Patrick Makundi / `rfp@serengetiexperiencedmc.com` / PDM |
| Execution sheet | Prepared as READY TO SEND — **never executed** |

Do **not** claim the earlier authorization never existed.

### Current operational status

| Item | Status |
| --- | --- |
| Transmissions | **0** |
| Responses | **0** |
| Receipts | **0** |
| Provider selected / ranked / evaluated | **NO** |
| Provider RFI transmission as current next action | **PAUSED / SUPERSEDED** by this SEDMC-owned infrastructure direction |
| Frozen pack | **Historical / reusable contingency material** unless the owner later **reauthorizes** use |
| External provider communication under the previous E1-B authorization | **MUST NOT OCCUR** without a **new explicit owner decision** |
| Cloud as architecture | Optional future contingency only — **not required now**, **not selected** |

Cursor does **not** send emails or submit provider forms.

---

## I. What remains OPEN

Gate C; E1; ADR-0006; DP-0006; Production architecture; Production deployment; Production migration; facility; hardware; procurement; cloud; technical RTO/RPO.

**Exact next action:** develop the SEDMC-owned infrastructure requirements and deployment-readiness plan while continuing EOS Dev/Test locally. External provider RFI transmission remains paused unless separately reauthorized.

**SEDMC is NOT Production Ready.**

---

## J. Additive — 2026-09-17 deployment-readiness plan prepared

Companion: [`adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md`](adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md).

The planning document now exists. It does **not** complete Stage 1 approval, procurement, or Production. **Current next action:** continue local Dev/Test while completing capacity assessment, facility requirements, and technical design prerequisites. **No procurement. No Production deployment.** E1-B remains **PAUSED**.

---

## K. Additive — 2026-09-17 capacity and facility assessment specification

Companion: [`adr-0006-e1-c-capacity-and-facility-assessment-specification.md`](adr-0006-e1-c-capacity-and-facility-assessment-specification.md).

The **specification** of what must be measured now exists. It does **not** collect measurements, select a facility, or authorize surveys/supplier contact. **Actual assessment = HUMAN DECISION REQUIRED.** Stage 1 remains **NOT APPROVED / NOT COMPLETE**.
