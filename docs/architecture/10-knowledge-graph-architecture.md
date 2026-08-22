# 10. Knowledge Graph Architecture

## 10.1 Purpose

A governed graph of enterprise entities used for **dependency and impact analysis**, not as the transactional store.

Example question: *What would be affected if this supplier became unavailable?*

Returns: programmes, clients, bookings, financial exposure, alternative suppliers, operational dependencies, risks, continuity plans, affected workflows — **filtered by the caller’s authorisation**.

## 10.2 Canonical node types

`Person · Company · Client · Supplier · Programme · Hotel · Venue · Vehicle · Contract · Risk · Control · Incident · Change · Service · Dataset · AiAgent · Location · Employee · Device`

## 10.3 Canonical relationships (examples)

| Edge | Meaning |
| --- | --- |
| `EMPLOYS` | Org → Person |
| `HAS_ROLE` | Person → Role |
| `OWNS_ACCOUNT` | Client org → Account |
| `ISSUES_RFP` | Client → Rfp |
| `AWARDS` | Opportunity → Programme |
| `USES_SUPPLIER` | Programme → Supplier |
| `BOOKS` | Programme → Hotel/Venue/Vehicle |
| `GOVERNED_BY` | Process → Control |
| `MITIGATES` | Control → Risk |
| `IMPACTS` | Incident → CI / Programme |
| `DEPENDS_ON` | Service → Service / Supplier |
| `EVIDENCES` | Evidence → Control / Audit |
| `ASSISTED_BY` | Work item → AiAgent |

## 10.4 Projection

Graph is a **projection** from OLTP + CMDB + lakehouse. Rebuildable. Not the system of record.

Phase 1: recursive SQL CTEs over relationship tables for impact queries.  
Phase 5: dedicated graph engine if query complexity/SLO requires (ADR).

## 10.5 Security

Graph queries execute as the requesting principal. Traversal cannot hop into unauthorised tenants or Highly Restricted nodes without policy + audit.
