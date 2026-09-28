# H-200 — Production Infrastructure Requirements and Architecture Specification

> **PROVIDER-NEUTRAL PRODUCTION INFRASTRUCTURE SPECIFICATION.**  
> Converts H-199’s assessment into the **minimum Production environment** EOS requires, regardless of hosting model.  
> **H-200 does not select GCP, self-managed infrastructure, a data centre, a country, or a hosting provider.**  
> It does **not** authorize Production implementation. It does **not** claim Production infrastructure exists.  
> H-154 through H-199 were inspected and **not rewritten**. H-198 remains **unsent**. H-169 remains **historical governance** until formally reconsidered.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 719 (H-199 start 717; H-199 final 719)

```text
H-200 STATUS = COMPLETE — REQUIREMENTS SPECIFICATION ONLY; NO PATH SELECTED
P01 = NOT GRANTED
PRODUCTION = NOT READY
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
productionReady = false
H-81 = NOT STARTED
H-198 SUBMISSION = UNSENT
GOOGLE CLOUD FORM SUBMITTED = NO
DR TEST = NOT PERFORMED
SEDMC PRODUCTION SERVERS = NOT IN PLACE
GCP PRODUCTION RESOURCES = NONE
RTO ≤ 4 hours
RPO ≤ 1 hour
```

---

## 1. Purpose and requirement classes

H-200 defines what **either** hosting route must satisfy before Production authorization. It is **not** a hosting selection and **not** an implementation grant.

| Class | Meaning in this document |
| --- | --- |
| **Business requirement** | Owner-accepted outcome (e.g. RTO ≤ 4 hours, RPO ≤ 1 hour) |
| **Technical requirement** | Capability the platform must provide (e.g. PITR, TLS) |
| **Architecture requirement** | How capabilities must be arranged (e.g. geo-separated DR) |
| **Implementation requirement** | Work that may occur only after P01 (not authorized here) |
| **Evidence requirement** | What must be proven before P01 |
| **Production authorization** | P01 / H-81 — **NOT GRANTED / NOT STARTED** |

---

## 2. Baseline (H-199 carried forward)

| Fact | State |
| --- | --- |
| SEDMC Production infrastructure | **NOT IN PLACE** |
| GCP | Historical **direction** (H-158/H-169/D194-02); **not implemented** |
| EOS | Provider-portable at the adapter boundary |
| H-198 | **UNSENT** |
| Belgium / `europe-west1` | H-169 **historical**; **not** treated as mandatory by H-200 |
| Local filesystem DocumentStorage | **Not** a Production document-storage solution |

---

## 3. Compute (application runtime)

**Business:** EOS must serve the Production HTTPS origin after authorization.  
**Technical / architecture:** a supervised Production application runtime, not a developer laptop.

| Topic | Requirement | Class | Evidence |
| --- | --- | --- | --- |
| Runtime | Container or equivalent process running the Production API/web contract (H-191: listen bind, `/health`, `/ready`, graceful shutdown) | Technical | Inventory + start evidence — **NOT DEMONSTRATED** |
| Redundancy | Minimum: survive **single instance** failure without declaring a site disaster (restart or second instance in the **primary** environment). Site loss is **DR**, not this row | Architecture | HA design + test — **EVIDENCE REQUIRED** |
| Process supervision | Automatic restart on crash; no unattended “manual start only” Production | Technical | Supervisor/platform evidence — **EVIDENCE REQUIRED** |
| Deployment / restart | Repeatable deploy and rollback; SIGTERM graceful shutdown (H-191) | Technical | Runbook + rehearsal — **EVIDENCE REQUIRED** |
| Health | Liveness `/health` (process up) | Technical | Contract exists in code; Production hosting **NOT DEMONSTRATED** |
| Readiness | `/ready` reflects durable store health (memory-ok is **Dev/Test only**) | Technical | Same |
| Graceful shutdown | Drain in-flight work per H-188/H-191; no silent listen-bind | Technical | Same |
| Capacity / scaling | Headroom for peak load | Technical | **SIZING EVIDENCE REQUIRED** — no CPU/RAM invented |

Do **not** invent vCPU, memory, or instance counts.

---

## 4. PostgreSQL

**Version (governed rule, not a selected number):**

```text
NEWEST APPLICATION-COMPATIBLE PROVIDER-SUPPORTED VERSION AT IMPLEMENTATION TIME
```

Subject to migration compatibility validation (D194-09). Dev/Test PostgreSQL 16 is **not** the Production selection. H-200 does **not** hard-code a version and does **not** select Cloud SQL.

| Topic | Requirement | Evidence |
| --- | --- | --- |
| Compatibility | EOS migrations/runtime tested against the candidate version | Compatibility pack — **EVIDENCE REQUIRED** |
| Durable storage | Database files on durable media, not ephemeral-only disk | Inventory — **NOT DEMONSTRATED** |
| TLS | Encrypted client connections in Production | Config evidence — **EVIDENCE REQUIRED** |
| Authentication | No production passwords in source; managed credentials | Secrets platform — **EVIDENCE REQUIRED** |
| Backup | Scheduled, attributable backups | Backup job evidence — **NOT DEMONSTRATED** |
| PITR | Restore to a point within the RPO window | PITR evidence — **NOT DEMONSTRATED** |
| Restore | Reconstruct a **functioning** database (see §5) | Restore drill — **NOT DEMONSTRATED** |
| Retention | Retention period Owner-approved; not invented here | Policy + proof — **EVIDENCE REQUIRED** |
| Monitoring | Connectivity, replication lag (if any), disk, connections | Monitoring evidence — **EVIDENCE REQUIRED** |
| HA | Tolerate instance/zone failure **inside** the primary environment without a DR declaration | HA design/test — **EVIDENCE REQUIRED** |
| DR / replication | Survive **loss of the primary environment** within RTO/RPO (§5–§6) | DR test — **NOT DEMONSTRATED** |

---

## 5. Backup vs restore vs HA vs DR

Do **not** treat backup as DR.

| Concept | Definition | Minimum evidence |
| --- | --- | --- |
| **Backup** | A recoverable copy of data exists | Dated backup artefacts; location; encryption; identity of job |
| **Restore** | A functioning database (and required config) can be reconstructed from backup | Timed restore drill; application can reconnect; **not** merely a file copy |
| **High availability** | Survive failure **without** a full disaster-recovery event (instance/process/zone within the primary environment) | Failover/restart test **inside** the primary environment |
| **Disaster recovery** | Recover from **loss of the primary Production environment / site / region** | Geo-separated capacity + end-to-end DR test (§6–§7) |

A backup stored **only** in the same failure domain as the primary is **NOT SUITABLE** as site DR.

---

## 6. RTO / RPO (business requirements preserved)

```text
RTO ≤ 4 hours
RPO ≤ 1 hour
```

These are **business acceptance requirements** (H-166). They are **not** measured Production facts. No measurements are invented.

### What must be measured

| Metric | Measurement definition |
| --- | --- |
| **RTO** | Elapsed time from **failure declaration** to **service restored** (application + database + required network/DNS serving the Production origin) |
| **RPO** | Amount of durable committed data **lost**, measured from last known good transaction / WAL position / application watermark to the restored state — must be ≤ 1 hour of data |

### Minimum DR test evidence (blank until a real test)

| Field | Value at H-200 |
| --- | --- |
| Failure scenario | **NOT PERFORMED** |
| Failure declaration time | **NOT INVENTED** |
| Recovery start | **NOT INVENTED** |
| Database recovery | **NOT INVENTED** |
| Application recovery | **NOT INVENTED** |
| DNS/network recovery | **NOT INVENTED** |
| Service restored | **NOT INVENTED** |
| Data-loss measurement | **NOT INVENTED** |
| Final recovery timestamp | **NOT INVENTED** |
| Calculated RTO | **NOT INVENTED** |
| Calculated RPO | **NOT INVENTED** |
| Evidence / artefacts | **NONE** |
| Test owner | **HUM-08 APPOINTMENT REQUIRED** (DR Coordinator not appointed) |
| Date/time | **NOT INVENTED** |

H-81 / P19 remain **NOT STARTED / NOT PERFORMED**.

---

## 7. Geographic DR (architecture requirement)

H-199: a self-managed/SEDMC-controlled architecture would require geographically separated DR to satisfy the **existing** DR objective. The same **architecture requirement** applies to a cloud path: the secondary must not share the primary’s site/region failure domain.

H-200 does **not** prescribe a country or provider. **H-169 Belgium / `europe-west1` remains historical** until formally reconsidered. Cross-border DR remains subject to **legal review** (not approved here).

| Element | Requirement |
| --- | --- |
| Primary environment | Identified Production site/region — **NOT SELECTED BY H-200** |
| Geographically separated secondary | Independent **failure domain** (not the same building, metro-only shared fate, or same cloud region) |
| Database recovery | Secondary can take the write path within RTO/RPO |
| Application recovery | Runtime can start in the secondary environment |
| Object/document recovery | Durable objects available in the DR path (LocalFs **not** acceptable) |
| Secrets / configuration recovery | Secrets and config available without the primary site |
| DNS / network recovery | Production origin can be pointed at the recovered environment |
| Operational runbook | Written procedure |
| Human escalation | Named DR Coordinator / deputies — **HUM-08 APPOINTMENT REQUIRED** |

---

## 8. Storage

Local filesystem storage **must not** be treated as a Production document-storage solution (D194-06).

| Store | Durability | Encryption | Access control | Lifecycle | Backup / restore | Geographic resilience |
| --- | --- | --- | --- | --- | --- | --- |
| **Database storage** | Durable volumes; not sole copy on one unsynchronized disk | At rest + TLS in transit | Least privilege | Retention Owner-set | Backup + **restore** + PITR | DR copy **off** primary failure domain |
| **Object / document storage** | Durable managed or equivalent object store | At rest + in transit | IAM; no public-by-default Production buckets | Lifecycle **EVIDENCE REQUIRED** | Independent backup/restore | Replicated or restorable in DR environment |
| **Backup storage** | Distinct from primary active volumes | Encrypted | Restricted restore identities | Retention policy | Restore drill | Reachable if primary site is down |
| **DR storage** | Capacity to run recovered DB + objects | Same controls | Same | Same | Proven by DR test | Independent failure domain |

---

## 9. Identity and security

Do **not** select an IdP or secrets product (Identity Platform remains **candidate** in H-194; H-200 does not confirm it).

| Control | Production requirement | Evidence |
| --- | --- | --- |
| Federated identity | Federated IdP; local-password Production identity **REJECTED** (D194-03) | IdP facts — **EVIDENCE REQUIRED** |
| MFA | Mandatory MFA | **EVIDENCE REQUIRED** |
| Service identity | Workload identity; no shared human passwords for services | **EVIDENCE REQUIRED** |
| Least privilege | Role-based access; no standing global admin for daily ops | **EVIDENCE REQUIRED** |
| Administrative / privileged access | Break-glass designed and logged | **EVIDENCE REQUIRED** |
| Secret management | Managed secret platform **required**; raw env values Dev/Test only (D194-04) | Product **OPEN** |
| Credential rotation | Rotation design; no immortal Production secrets | **EVIDENCE REQUIRED** |
| Encryption | Data at rest and in transit; CMEK optional later | **EVIDENCE REQUIRED** |
| TLS | Public HTTPS; DB and messaging TLS | **EVIDENCE REQUIRED** |
| Network controls | Restrict administrative and database exposure | **EVIDENCE REQUIRED** |
| Audit logs | Attributable admin and data-access logs | **EVIDENCE REQUIRED** |
| Security monitoring | Alert on auth/privilege anomalies | **EVIDENCE REQUIRED** |

---

## 10. Networking

Do **not** invent hostname or topology. Production hostname remains **OPEN** (D194-12).

| Topic | Requirement |
| --- | --- |
| Public HTTPS endpoint | Dedicated SEDMC-controlled HTTPS origin |
| DNS | Owner-controlled DNS; failover behaviour in DR runbook |
| TLS certificates | Valid public certificates; renewal process |
| Database private connectivity | Production DB not exposed as an unauthenticated public service |
| Outbound connectivity | Controlled egress for email, IdP, updates as needed |
| Firewall / security controls | Default deny where applicable |
| CORS | Bound to `EOS_PUBLIC_ORIGIN`; not `*` in Production-like (H-191) |
| Administrative access | Bastion/IdP; no standing public admin |
| Monitoring | Endpoint and TLS expiry monitoring |
| Failure handling | Documented path when origin or DB path fails |

---

## 11. Events / messaging

Do **not** select a NATS vendor.

| Topic | Requirement |
| --- | --- |
| Transport | NATS JetStream **or equivalent** durable event service (D194-07) |
| Durable delivery | At-least-once durable streams; no in-memory Production outbox-only |
| TLS | Encrypted transport |
| Credentials | Managed secrets; no committed credentials |
| Health | Transport health before outbox drain (H-188) |
| Failure handling | DLQ / retry already in EOS; Production hosting must not drop durability |
| Recovery | Reconstruct consumers after DR |
| Monitoring | Lag, disconnects, auth failures |

---

## 12. Email

Integration **direction** remains SMTP (D194-08). H-200 does **not** select SES, an SMTP vendor, or any provider.

| Topic | Requirement |
| --- | --- |
| Transport | Authenticated Production sending over TLS |
| Sender identity | Authorized SEDMC identity; not invented mailboxes at implementation |
| Bounce / error handling | Observable failures; no silent drop |
| Auditability | Send records without leaking secrets |
| Secrets | SMTP credentials in managed secrets |
| DPA / legal | Provider DPA **legal review** before use — **not concluded here** |

---

## 13. Observability

Do **not** select an observability vendor.

| Topic | Requirement |
| --- | --- |
| Structured logs | JSON logs; secret redaction; `productionReady=false` until P01 honestly remains |
| Correlation IDs | Request/correlation identifiers (H-191) |
| Health / readiness | `/health`, `/ready` |
| Application errors | Error rate visible to operators |
| Infrastructure / database / event monitoring | Host or platform metrics + DB + NATS-equivalent |
| Alerting | Routed to on-call — **HUM-08 APPOINTMENT REQUIRED** |
| Incident records | Retained tickets/logs |
| Retention | Owner-set; **EVIDENCE REQUIRED** |

---

## 14. Operations (HUM-08)

Do **not** invent personnel. Specialists remain **NOT YET APPOINTED** (D194-13–16). **NO DEDICATED NOC AT INITIAL LAUNCH**; on-call still required if EOS is business-critical (D194-17).

| Responsibility | Role (governed title) | Status |
| --- | --- | --- |
| Application ownership | Application / service owner | **HUM-08 APPOINTMENT REQUIRED** |
| Database administration | Database Owner | **NOT YET APPOINTED** |
| Infrastructure administration | Infrastructure owner | **HUM-08 APPOINTMENT REQUIRED** |
| Security / access | Security/Access Owner (≠ DPO) | **NOT YET APPOINTED** |
| DR coordination | DR Coordinator | **NOT YET APPOINTED** |
| Backup / restore | Backup owner | **UNASSIGNED** |
| Incident response | On-call + escalation | **HUM-08 APPOINTMENT REQUIRED** |
| Deployment / rollback | Deployment authority | **HUM-08 APPOINTMENT REQUIRED** |
| Monitoring | Ops owner | **HUM-08 APPOINTMENT REQUIRED** |
| Vendor escalation | Named channel after provider choice | Channel **UNKNOWN** until path selected |

---

## 15. Capacity and sizing

No quantities invented. D194-11: **EVIDENCE-BASED DECISION REQUIRED**.

| Measurement needed | Label |
| --- | --- |
| Application compute | **SIZING EVIDENCE REQUIRED** |
| PostgreSQL CPU / memory | **SIZING EVIDENCE REQUIRED** |
| Storage / IOPS | **SIZING EVIDENCE REQUIRED** |
| Network | **SIZING EVIDENCE REQUIRED** |
| Event throughput | **SIZING EVIDENCE REQUIRED** |
| Object storage / backup storage / DR capacity | **SIZING EVIDENCE REQUIRED** |

| Existing governed input | Class |
| --- | --- |
| RTO ≤ 4 hours / RPO ≤ 1 hour | **PLANNING ASSUMPTION** (business requirement; **not** measured) |
| N2 machine-series pairing (H-169) | **PLANNING ASSUMPTION** for the **historical GCP direction only** — not a H-200 size and not a self-managed BOM |
| CAP-GATE-01 / H177-D04 workload pack | **NOT** measured Production facts |
| Concurrent users, DB size, peak RPS | **SIZING EVIDENCE REQUIRED** — **not** a **MEASURED PRODUCTION FACT** |

Distinguish: `PLANNING ASSUMPTION` ≠ `MEASURED PRODUCTION FACT`.

---

## 16. Security / privacy / legal

Do **not** conclude that any geography is legally approved. Belgium DR remains **DEFERRED — LEGAL REVIEW** in H-194. H-200 does not reopen unrelated EOS privacy governance beyond Production-hosting implications.

| Topic | Requirement |
| --- | --- |
| Data residency | Stated primary and DR geographies **after Owner selection**; legal review **before** Production data |
| Encryption / access / auditability | §9 |
| DPA / subprocessors | Required before a provider processes Production data — **not accepted here** |
| Cross-border DR | Legal review **required** if DR leaves the primary country |
| Retention / deletion | Align with existing privacy/DSR governance; hosting must support deletion |
| Privacy obligations | Unchanged: EOS Production hosting must not precede legal clearance for the chosen geography |

---

## 17. Cost model (no prices)

Every unknown: **PRICE / QUOTE REQUIRED**.

### CAPEX (where applicable)

Servers; storage; network; backup hardware; DR hardware.

### OPEX

Hosting/colocation; bandwidth; electricity; support; managed services; backups; monitoring; certificates; DNS; software; DR; personnel; vendor support.

No quotes exist. D194-19: **no procurement commitment**.

---

## 18. Minimum viable SEDMC-controlled Production architecture

**Requirements specification only.** These resources **do not exist**. This is **not** a declaration that SEDMC has them.

Minimum components that would have to exist:

* Production application environment (supervised, redundant at instance level);
* Production PostgreSQL (durable, TLS, authenticated);
* Production durable object/document storage (not LocalFs);
* Backup environment **reachable if the primary site is down**;
* Geographically separate DR environment (independent failure domain);
* DR database capability (replication and/or restorable PITR copies off-site);
* DR application capability;
* Monitoring, security, network, DNS, TLS;
* Appointed operational ownership (HUM-08);
* **Tested** recovery procedure with measured RTO/RPO.

Hardware brands/models: **not selected**.

---

## 19. Cloud architecture minimum requirements (provider-neutral)

Do **not** name a provider as the H-200 selected solution. Managed capabilities required of **any** cloud path:

| Capability | Requirement |
| --- | --- |
| Compute | Supervised Production runtime (container platform or equivalent) |
| Database | Managed PostgreSQL **or** equivalent with durability, TLS, backup, PITR |
| Backup / PITR / DR | Off-primary-region recovery meeting RTO/RPO |
| Object storage | Durable managed object store |
| Secrets / identity / MFA | Managed secrets; federated IdP + MFA |
| Messaging | NATS JetStream or equivalent |
| Email | SMTP (or later-approved equivalent) with TLS and DPA |
| Networking / observability | HTTPS origin, private DB path, logs/metrics/alerts |

H-158/H-169 GCP topology remains **historical direction**, not H-200’s selection.

---

## 20. Comparison framework

Implementation columns are **not** claims of current capability.

| Requirement | Required capability | Evidence required | Self-managed implementation | Cloud implementation |
| --- | --- | --- | --- | --- |
| Compute | Supervised Production runtime | Inventory, health/ready | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** (direction only) |
| PostgreSQL | Compatible durable PG | Version + migrate test | **CAPABILITY EXISTS IN PRINCIPLE** — **EVIDENCE REQUIRED** | **CAPABILITY EXISTS IN PRINCIPLE** — **EVIDENCE REQUIRED** |
| Backup | Recoverable copies | Backup artefacts | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| Restore | Functioning DB from backup | Restore drill | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| HA | Instance/zone survival | HA test | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| DR | Primary-environment loss | Geo-separated DR test | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| RTO ≤ 4h | Measured restore time | DR test log | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| RPO ≤ 1h | Measured data loss | WAL/app watermark | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| Object storage | Durable non-LocalFs | Product + restore | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** (product **OPEN**) |
| Secrets / IdP / MFA | Managed + federated | Design + evidence | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** (candidate only) |
| NATS-equivalent | Durable TLS messaging | Health + recovery | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** (vendor **OPEN**) |
| Email | SMTP TLS authenticated | DPA + send path | **UNKNOWN** | **UNKNOWN** (provider **OPEN**) |
| Network / DNS / TLS | HTTPS origin | Hostname + certs | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** (FQDN **OPEN**) |
| Observability | Logs/metrics/alerts | Retention + routing | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| HUM-08 | Named RACI + on-call | Appointments | **NOT DEMONSTRATED** | **NOT DEMONSTRATED** |
| Legal | Residency/DPA | Review artefact | **UNKNOWN** | **UNKNOWN** (Belgium deferred historically) |
| Cost | Approved TCO | Quotes | **PRICE / QUOTE REQUIRED** | **PRICE / QUOTE REQUIRED** |

---

## 21. Minimum Production acceptance gate

No item may be marked complete without evidence. **All are currently incomplete.**

1. Infrastructure inventory  
2. Architecture diagram  
3. PostgreSQL compatibility  
4. Capacity evidence (**SIZING EVIDENCE REQUIRED**)  
5. Security/access evidence  
6. Backup evidence  
7. Restore evidence  
8. DR architecture (geo-separated)  
9. DR test  
10. Measured RTO  
11. Measured RPO  
12. Object-storage recovery  
13. Event-system recovery  
14. Monitoring  
15. Operational RACI  
16. On-call / escalation  
17. Legal/privacy review  
18. Cost approval  
19. Rollback procedure  
20. Production implementation authorization (P01)

H-200 marks **none** of these complete.

---

## 22. Open Owner/POA decisions (not made here)

* Hosting model: cloud vs SEDMC-controlled vs hybrid  
* Primary geography  
* DR geography (H-169 **not** reconfirmed by H-200)  
* IdP, secrets, object-store, NATS, SMTP **products**  
* Hostname  
* HUM-08 appointments  
* Whether to keep or change RTO/RPO  
* Whether to submit H-198  
* P01 grant  

---

## 23. Governance consequence

H-200 does **not** select GCP, self-managed infrastructure, a data centre, a country, or a hosting provider. It only defines what **either** route must satisfy.

```text
H-198 remains unsent
Production remains unauthorized
productionReady = false
H-81 remains not started
P01 = NOT GRANTED
No Production infrastructure is represented as existing
```

---

## 24. Final status

```text
H-200 STATUS = COMPLETE — REQUIREMENTS SPECIFICATION ONLY; NO PATH SELECTED
P01 = NOT GRANTED
PRODUCTION = NOT READY
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
productionReady = false
H-81 = NOT STARTED
H-198 SUBMISSION = UNSENT
RTO ≤ 4 hours
RPO ≤ 1 hour
```
