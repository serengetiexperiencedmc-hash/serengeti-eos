# H-202 — SEDMC-Owned Production Infrastructure Direction and Implementation Specification

> **OWNER/POA HOSTING-DIRECTION DECISION AND IMPLEMENTATION SPECIFICATION.**  
> Records that **SEDMC-owned/controlled infrastructure** is the selected EOS Production hosting direction, and specifies the implementation requirements for local hosting on SEDMC-controlled servers.  
> **Does not** authorize Production implementation. **Does not** provision. **Does not** claim Production plant exists.  
> H-154 through H-201 were inspected and **not rewritten**.

**Date / time:** 2026-09-25 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 723 (H-201 start 721; H-201 final 723)

```text
H-202 STATUS = COMPLETE — HOSTING DIRECTION SELECTED; IMPLEMENTATION NOT AUTHORIZED
Hosting direction: SEDMC-owned/controlled infrastructure — SELECTED
EOS locally hosted on SEDMC-controlled servers/infrastructure — SELECTED
Google-managed public-cloud hosting — NOT THE EOS HOSTING MODEL
External hosting-provider comparison — NOT REQUIRED UNLESS OWNER/POA REOPENS
P01 = NOT GRANTED
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
productionReady = false
H-81 = NOT STARTED
SEDMC PRODUCTION SERVERS = NOT IN PLACE
No Production infrastructure is represented as existing
RTO ≤ 4 hours — UNMEASURED REQUIREMENT
RPO ≤ 1 hour — UNMEASURED REQUIREMENT
```

This increment does **not** invent hardware, server specifications, bandwidth, IP addresses, rack locations, Internet links, backup capacity, UPS/generator capacity, staffing, SLAs, or costs.

---

## 1. Authoritative hosting decision

The Owner/POA has decided:

> SEDMC will own/control the GCP infrastructure environment in-house. EOS Production infrastructure will be locally hosted on SEDMC-controlled servers/infrastructure. Do not continue evaluating external cloud-hosting providers or alternative hosting models.

Recorded **without reinterpretation**:

| Decision | H-202 record |
| --- | --- |
| Production hosting direction | **SEDMC-owned/controlled infrastructure — SELECTED** |
| Placement | EOS will be **locally hosted** on **SEDMC-controlled servers/infrastructure** |
| Google-managed public-cloud hosting (Cloud Run / Cloud SQL as the hosted Production model) | **Not** the EOS hosting model |
| GCP as a technology/environment | May be used **only** as infrastructure technology **under SEDMC control** if SEDMC later implements internal infrastructure that way. That is **not** selected here as public-cloud hosting, and **no** GCP resources are claimed to exist |
| External hosting-provider comparison (H-201 Options B/C as active path) | **Not required** unless the Owner/POA **explicitly reopens** the decision |
| Production implementation | **NOT AUTHORIZED** |

H-202 is an **infrastructure-direction** decision only. It is **not** a Production grant.

---

## 2. Production logical architecture (minimum)

H-200 remains the generic requirements baseline. The following is the SEDMC-owned **logical** architecture. **None of it is implemented.**

### A. Application tier

| Element | Requirement |
| --- | --- |
| Runtime | EOS API/application process on SEDMC-controlled hosts |
| Supervision | Automatic restart on crash; not “manual start only” |
| Health | `/health` liveness |
| Readiness | `/ready` reflects durable store (memory-ok is Dev/Test only) |
| Graceful shutdown | SIGTERM drain per H-191 |
| Restart / recovery | Repeatable deploy and rollback |
| Production configuration | Provider-neutral env/contracts; `productionReady=false` until P01 |

### B. Database tier

| Element | Requirement |
| --- | --- |
| Engine | PostgreSQL |
| Version | Newest application-compatible supported version **at implementation time** (D194-09 rule). Dev/Test 16 is **not** the Production selection. Exact version **TO BE ESTABLISHED** after compatibility review |
| Storage | Durable persistent storage (not ephemeral-only) |
| TLS | Encrypted client connections |
| Authentication | Managed credentials; nothing committed to the repository |
| Backup | Scheduled, attributable copies |
| PITR | Where supported/required to meet RPO ≤ 1 hour |
| Restore | Documented procedure; **restore ≠ backup** |
| Monitoring | Connectivity, disk, connections, lag if replicated |
| Capacity | **SIZING EVIDENCE REQUIRED** |

### C. Object / document storage

Durable Production object storage. **Local filesystem is not the Production document store.** Backup and recovery independent of a single host’s disk.

### D. Event / messaging

NATS JetStream **or equivalent** durable Production transport; TLS; credentials in managed secrets; persistence; health monitoring (H-188 drain only after healthy transport).

### E. Identity

Federated identity; **mandatory MFA**; Production IdP to be selected. **No local-password Production authentication** (D194-03). Product **not selected** by H-202.

### F. Secrets

Managed/controlled secret storage on SEDMC-controlled infrastructure. No raw Production credentials in the repository. Rotation/revocation procedure required. Product **OPEN**.

### G. Email

SMTP **direction** already selected (H-194 D194-08). **Provider and sender identity remain to be selected/confirmed.** Not invented here.

### H. Network

Internal/private segmentation where appropriate; firewall policy; controlled database access; controlled administrative access; HTTPS; DNS; TLS certificates; **no public wildcard CORS** (`EOS_PUBLIC_ORIGIN` bound; not `*`). Hostname **OPEN**.

### I. Observability

Structured logs; health/readiness; system, PostgreSQL, storage, and backup monitoring; alerting; auditability. On-call routing requires **HUM-08 APPOINTMENT REQUIRED**.

---

## 3. Physical / infrastructure evidence fields

Do **not** invent quantities. For every row:

```text
VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE
```

| Item | Value |
| --- | --- |
| Production application server(s) | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| PostgreSQL server/storage | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Object storage | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| NATS server(s) | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Backup server/storage | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Network / firewall | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Switches | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Internet / WAN connectivity | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| DNS | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| TLS certificate management | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| UPS | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Generator / power redundancy | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Cooling | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Physical security | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Rack / room | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Environmental monitoring | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |
| Monitoring / management network | `VALUE = TO BE ESTABLISHED BY SEDMC INFRASTRUCTURE INVENTORY / SIZING EVIDENCE` |

Repository evidence (E1-C / H-199): SEDMC-owned Production servers remain **NOT IN PLACE**. H-202 does **not** change that fact.

---

## 4. Production site requirements

The **primary** Production site must provide: reliable power; environmental controls; physical security; network connectivity; controlled administrative access; backup capability; monitoring; operational ownership.

**H-202 does not claim that SEDMC’s current premises satisfy these requirements.** Site fitness is **TO BE ESTABLISHED** by inventory and evidence. Location is an open Owner/POA decision (§9).

---

## 5. DR architecture

Business acceptance requirements (H-166), **unmeasured**:

```text
RTO ≤ 4 hours
RPO ≤ 1 hour
```

A **geographically separate** DR environment is required, capable of restoring/running the EOS Production workload if the primary site is unavailable (H-199/H-200). **DR location is not selected** — no explicit Owner/POA DR-geography decision and no evidenced SEDMC secondary plant.

| DR coverage | Requirement | Status |
| --- | --- | --- |
| Application recovery | Runtime can start in DR environment | **NOT STARTED** |
| PostgreSQL recovery | Replication and/or PITR copies **off** primary site | **NOT STARTED** |
| Object/document recovery | Durable objects available in DR path | **NOT STARTED** |
| NATS/event recovery | Durable transport recoverable where required | **NOT STARTED** |
| Secrets/configuration recovery | Without depending on the failed primary | **NOT STARTED** |
| DNS/endpoint recovery | Production origin can be pointed at recovered environment | **NOT STARTED** |
| TLS certificate recovery | Certs usable in DR | **NOT STARTED** |
| Operational access | Named operators can act | **HUM-08 APPOINTMENT REQUIRED** |
| Monitoring | Visibility during and after failover | **NOT STARTED** |
| Backup availability | Copies reachable while primary is down | **NOT STARTED** |
| Runbook | Written failover/failback | **NOT STARTED** |
| Failover / failback procedure | Tested | **NOT STARTED** |

---

## 6. Backup vs restore vs HA vs DR

| Term | Meaning | Must not be confused with |
| --- | --- | --- |
| **Backup** | A retained copy exists | Restore, HA, or DR |
| **Restore** | Ability to recover a functioning system **from backup** | Mere existence of a backup file |
| **HA** | Resilience **within** the Production environment (instance/process failure) | Site disaster |
| **DR** | Recovery after **loss/unavailability of the Production site/environment** | Same-site backup |

**Backup evidence must not be counted as DR evidence.**

---

## 7. Production acceptance evidence matrix

Statuses allowed: `NOT STARTED` / `IN PROGRESS` / `EVIDENCED` / `ACCEPTED`.  
**Nothing is ACCEPTED** — no independently evidenced Production artefacts exist for these rows.

| # | Item | Status |
| --- | --- | --- |
| 1 | Hardware / infrastructure inventory | **NOT STARTED** |
| 2 | Capacity / sizing | **NOT STARTED** |
| 3 | PostgreSQL compatibility | **NOT STARTED** |
| 4 | Persistent storage | **NOT STARTED** |
| 5 | Application deployment | **NOT STARTED** |
| 6 | Secrets | **NOT STARTED** |
| 7 | Identity / MFA | **NOT STARTED** |
| 8 | Object storage | **NOT STARTED** |
| 9 | NATS | **NOT STARTED** |
| 10 | SMTP | **NOT STARTED** |
| 11 | DNS | **NOT STARTED** |
| 12 | TLS | **NOT STARTED** |
| 13 | Firewall / network | **NOT STARTED** |
| 14 | Monitoring | **NOT STARTED** |
| 15 | Backup | **NOT STARTED** |
| 16 | Restore | **NOT STARTED** |
| 17 | HA | **NOT STARTED** |
| 18 | DR | **NOT STARTED** |
| 19 | Measured RTO | **NOT STARTED** |
| 20 | Measured RPO | **NOT STARTED** |
| 21 | Operational ownership | **NOT STARTED** |
| 22 | On-call / escalation | **NOT STARTED** |
| 23 | Security controls | **NOT STARTED** |
| 24 | Production smoke test | **NOT STARTED** |
| 25 | Rollback / recovery procedure | **NOT STARTED** |

---

## 8. Implementation sequence (not executed)

Controlled future sequence. **H-202 does not execute any phase.**

| Phase | Name |
| --- | --- |
| 1 | Infrastructure inventory and sizing |
| 2 | Primary-site readiness |
| 3 | Network / security foundation |
| 4 | PostgreSQL Production environment |
| 5 | Application runtime |
| 6 | Secrets and identity / MFA |
| 7 | Object storage |
| 8 | NATS |
| 9 | SMTP |
| 10 | DNS / TLS |
| 11 | Monitoring / alerting |
| 12 | Backup |
| 13 | Restore test |
| 14 | DR environment |
| 15 | DR test |
| 16 | Measured RTO / RPO |
| 17 | Production readiness gate |
| 18 | Owner/POA Production implementation authorization |
| 19 | Controlled Production deployment |

Phase 19 remains **forbidden** until Phase 18 (P01) is separately granted.

---

## 9. Remaining Owner/POA decisions (open)

| ID | Decision | Status |
| --- | --- | --- |
| D202-01 | Exact SEDMC Production infrastructure location | **OPEN** |
| D202-02 | Actual server inventory | **OPEN** — **NOT IN PLACE** |
| D202-03 | Sizing | **OPEN** — **SIZING EVIDENCE REQUIRED** |
| D202-04 | PostgreSQL version after compatibility review | **OPEN** |
| D202-05 | Primary geography | **OPEN** |
| D202-06 | DR geography | **OPEN** — not selected |
| D202-07 | DR infrastructure ownership (same entity vs contracted site still under SEDMC control) | **OPEN** |
| D202-08 | Backup retention | **OPEN** |
| D202-09 | Operational coverage (on-call hours) | **OPEN** |
| D202-10 | Database Owner | **HUM-08 APPOINTMENT REQUIRED** |
| D202-11 | Security/Access Owner | **HUM-08 APPOINTMENT REQUIRED** |
| D202-12 | DR Coordinator | **HUM-08 APPOINTMENT REQUIRED** |
| D202-13 | Deputies | **HUM-08 APPOINTMENT REQUIRED** |
| D202-14 | Production implementation grant (P01) | **NOT GRANTED** |
| D202-15 | SMTP provider and confirmed sender identity | **OPEN** |
| D202-16 | IdP / secrets / object-store / NATS **products** (SEDMC-controlled) | **OPEN** |

---

## 10. Reconciliation with previous governance (historical records not rewritten)

| Prior record | H-202 effect |
| --- | --- |
| H-158 through H-169 GCP **public-cloud** hosting/DR direction | **Superseded as a hosting-model direction** by this Owner/POA decision. Files **not deleted or rewritten**. They remain historical. |
| H-160–H-163 GCP-specific backup/PITR/HA/logging **product** directions | Historical for the public-cloud path. Capability **requirements** remain via H-200; implementation is now SEDMC-owned infrastructure. |
| H-194 D194-02 Cloud Run / Cloud SQL as architecture direction | **Superseded as the active hosting model.** SMTP, federated+MFA, managed secrets, durable object storage, NATS-or-equivalent **requirements** still apply on SEDMC-owned plant. |
| H-200 | **Remains** the generic Production requirements baseline. |
| H-201 Options A/B/C comparison | **No longer required as the active decision path.** Option A is aligned with this selection; B/C are not active alternatives unless the Owner/POA reopens. H-201 file **not rewritten**. |
| H-181 through H-198 external GCP evidence-collection / Contact Sales submission | **Superseded / not required** for the selected SEDMC-owned infrastructure direction. H-198 remains **unsent**. Historical files **not rewritten**. |
| GCP Production resources | **NONE** — none provisioned; none claimed. |
| SEDMC Production infrastructure | **NOT IN PLACE** unless later inventory proves otherwise. H-202 does **not** demonstrate existence. |

External hosting-provider evaluation is **stopped** unless explicitly reopened.

---

## 11. Governance status

```text
Hosting direction: SEDMC-owned/controlled infrastructure — SELECTED
EOS locally hosted on SEDMC-controlled servers — SELECTED
Google-managed public-cloud hosting: NOT THE EOS HOSTING MODEL
Production infrastructure implemented: NO
Production resources provisioned: NO EVIDENCE
Production data: NONE
Production deployment: NOT AUTHORIZED
Production readiness: FALSE
productionReady = false
H-81: NOT STARTED
DR implementation: NOT STARTED
DR validation: NOT STARTED
measured RTO: NONE
measured RPO: NONE
external GCP evidence collection: NOT REQUIRED FOR SELECTED HOSTING DIRECTION
Owner/POA Production implementation grant: NOT GRANTED
P01 = NOT GRANTED
```

H-202 provisions **nothing**. STOP after this specification.
