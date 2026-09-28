# E1-C — SEDMC-Owned Infrastructure Requirements and Deployment-Readiness Plan

> **`PLANNING ONLY — NOT PROCUREMENT`**  
> **`NOT FACILITY SELECTION`** · **`NOT HARDWARE SELECTION`** · **`NOT PRODUCTION APPROVAL`**  
> **`SEDMC-OWNED INFRASTRUCTURE = PREFERRED CURRENT DIRECTION`**  
> **`TANZANIAN FACILITY = PREFERRED FUTURE LOCATION — NOT SELECTED`**  
> **`HARDWARE = NOT SELECTED`** · **`PROCUREMENT = NOT AUTHORIZED`**  
> **`Production architecture = NOT APPROVED`**  
> **`Production deployment = NOT AUTHORIZED`** · **`Production migration = NOT AUTHORIZED`**  
> **`Gate C = OPEN`** · **`E1 = NOT APPROVED / BLOCKED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Business zero-loss ≠ technical RPO=0`**  
> **`E1-B transmission = PAUSED / SUPERSEDED AS THE CURRENT NEXT ACTION`**  
> **`0 TRANSMISSIONS`** · **`0 RESPONSES`** · **`0 RECEIPTS`**  
> **`Cloud = OPTIONAL FUTURE CONTINGENCY — NOT SELECTED`**  
> **`Local machine = CURRENT DEV/TEST ONLY`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Working tree:** DIRTY (pre-existing work preserved).  
**This file does not** select a facility, select hardware, authorize procurement, send RFI, provision Production, or close E1 / ADR-0006 / DP-0006.

### Authoritative inputs (not rewritten)

| Input | Path | What is treated as authoritative |
| --- | --- | --- |
| Owner direction | [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md) | SEDMC-owned servers preferred; TZ facility preferred future location; not selected |
| Requirements framework | [`adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md`](adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md) | Provider-neutral categories; sizing not invented |
| Portability | [`adr-0006-e1-c-infrastructure-portability-and-deployment-abstraction.md`](adr-0006-e1-c-infrastructure-portability-and-deployment-abstraction.md) | Application/data/infrastructure-contract/implementation split |
| Recovery evidence objects | [`adr-0006-e1-c-recovery-validation-plan.md`](adr-0006-e1-c-recovery-validation-plan.md) | RV-01–RV-14 required; none Production-closed |
| Operations framework | [`adr-0006-e1-c-production-operations-readiness-plan.md`](adr-0006-e1-c-production-operations-readiness-plan.md) | Named ops **NOT READY** / **NOT ESTABLISHED** |
| BCM sequence | Owner decision + BCM record | **S2 FORMALLY CONFIRMED**; technical RTO/RPO **NOT DEMONSTRATED** |
| Hosting matrix | [`adr-0006-e1-hosting-decision-matrix.md`](adr-0006-e1-hosting-decision-matrix.md) | Classes A–D unselected as Production architecture |
| ADR-0006 / DP-0006 | Architecture decision package; `docs/decisions/DP-0006-hosting-data-residency.md` | **OPEN / NOT APPROVED** |

Column vocabulary used below:

| Term | Meaning |
| --- | --- |
| Desired capability | What EOS Production hosting should be able to do |
| Architectural requirement | Provider-neutral constraint on the future SEDMC-owned target |
| Implementation status | What exists **now** |
| Evidence required | What must exist before the related stage can close |

---

## 0. Current vs future (do not collapse)

| Item | Now | Future primary | Future contingency |
| --- | --- | --- | --- |
| Compute | Local development machine | SEDMC-owned servers | Qualified third-party/cloud **if later approved** |
| PostgreSQL | Authorized disposable / local PG | SEDMC-owned PostgreSQL 16-class | Managed PG **URL only** from the app |
| Documents | `LocalFsDocumentStorage` | SEDMC-owned filesystem or later object store | Object-store adapter **FUTURE PROVIDER IMPLEMENTATION** |
| Identity / secrets / email / events | Dev/Test adapters | SEDMC-controlled services (products **UNSELECTED**) | Cloud IdP/KMS/SMTP **FUTURE** if approved |
| Production data | **None authorized** | After Stage 4 authorization | Same gate |

Local filesystem, `local-password-dev`, `env-dev` secrets, `in-memory-dev` events, and `dev-outbox` / smtp-stub remain **DEV/TEST ONLY**. Production-like environments **fail closed** until suitable Production identity, secrets, TLS, document storage, and event/email adapters exist.

---

## A. Facility requirements

Preferred geography: **Tanzania**. **No facility is selected, assessed, contracted, or approved.**

All rows: **EVIDENCE REQUIRED / FACILITY ASSESSMENT REQUIRED**.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| Physical security | Controlled perimeter, visitor control, monitoring appropriate to data classification | Site must support least-privilege physical access with logs | **NOT ASSESSED** | Site survey; security description |
| Power reliability | Utility capacity for IT + cooling + growth | Documented power class and outage history | **NOT ASSESSED** | Utility/facility evidence |
| UPS | Bridging power for orderly shutdown / intended runtime | UPS sized to later capacity assessment | **NOT DESIGNED** | UPS spec after sizing |
| Generator | Backup power for intended continuity window | Generator fuel/runtime vs business ≤3h/≤4h **as a design input, not a demonstrated RTO** | **NOT DESIGNED** | Generator evidence |
| Cooling | HVAC for heat load with maintenance access | Cooling independent of a single point of failure **as a design goal** | **NOT DESIGNED** | HVAC evidence |
| Fire protection | Detection/suppression compatible with IT occupancy | Fire strategy recorded | **NOT ASSESSED** | Fire certificate / design |
| Connectivity | Reachable application and admin paths; diverse paths preferred | No Production IPs in application code | **NOT SELECTED** | Carrier options |
| Physical access | Logged, least-privilege, named operators | Named operators **NOT ESTABLISHED** | **NOT DESIGNED** | Access policy + roster |
| Maintenance support | Facility/IT support overlapping recovery windows | SLA **QUOTE REQUIRED** later | **NOT AUTHORIZED** | Support terms |
| Environmental risks | Flood, dust, temperature, seismic, site-risk screening | Residual risk accepted by owner | **NOT PERFORMED** | Risk screen |
| Ownership / contractual rights | Lawful occupation (owned, leased, or colo) | Rights sufficient for EOS Processing | **NOT SELECTED** | Title/lease/colo draft — **not signed under this plan** |
| Legal and privacy | PDPA-compatible processing location; subprocessors known | Legal review of the **chosen** site (none chosen) | **NOT COMPLETE** | Counsel review **after** a candidate site exists |
| Backup / DR location | Offsite or independent failure domain for backups | Backup location **not** the same single disk as primary | **NOT SELECTED** | DR/backup site options |
| Business continuity | Facility supports S2 recovery order as a **business** constraint | Facility outage handling documented | **NOT DESIGNED** | BC arrangements |

Do **not** treat “preferred Tanzanian facility” as an approved Production location.

---

## B. Compute and hardware

Do **not** produce a bill of materials. Do **not** invent CPU, RAM, disk, or server quantities.

Runtimes to host: EOS API (Node.js 20+ class), EOS web application, PostgreSQL 16-class as an **external durable service**.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| API runtime | Run current EOS API | Portable process/container; DB external | **DEV/TEST ONLY** on local machine | Stage 1 design |
| Web runtime | Run current EOS web | Same | **DEV/TEST ONLY** | Stage 1 design |
| PostgreSQL runtime | Host or attach PG 16-class | Not embedded in the application container as SoR | Disposable/local PG **DEV/TEST ONLY** | Capacity + durability design |
| CPU and RAM | Serve expected load + recovery workload | **REQUIRES TECHNICAL CAPACITY ASSESSMENT** | **NOT INVENTED** | Measurement + business input |
| Storage capacity | OS + PG + documents + backups | **REQUIRES TECHNICAL CAPACITY ASSESSMENT** | **NOT INVENTED** | Growth model |
| Storage redundancy | Survive single-disk failure as a **design goal** | RAID/equivalent or storage-layer redundancy | **NOT DESIGNED** | Storage design |
| Hardware redundancy | N+1 or equivalent **design later** | No single silent server as Production | **NOT DESIGNED** | Redundancy design |
| Expansion capacity | Headroom for growth | Documented expansion path | **NOT DESIGNED** | Capacity plan |
| Spare components | Disks/PSU/NIC as later BOM requires | Spares policy | **NOT PROCURED** | Lifecycle plan |
| Hardware lifecycle | Refresh, warranty, replacement | Lifecycle **not** a brand selection | **NOT SELECTED** | Refresh policy |
| Monitoring | Host CPU/RAM/disk/health | Feeds provider-neutral app logs/metrics | Product **UNSELECTED** | Monitoring design |
| Physical maintenance | On-site or contracted hands | Named ownership **NOT ESTABLISHED** | **NOT READY** | Operating model |
| Operating system support | Supported OS with patch channel | OS **UNSELECTED** | **NOT SELECTED** | OS standard |

---

## C. PostgreSQL and durable storage

PostgreSQL remains the durable System of Record. The application uses a PostgreSQL-compatible URL, pool size, and TLS mode. No cloud DBaaS management APIs in business logic.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| PG 16-class | Compatible SoR | `EOS_DATABASE_URL` | Dev/Test may use 16-class; Production **not provisioned** | Production instance **does not exist** |
| Durable SoR | Survive process restart | External to app process | Dual-path Dev/Test **DEV/TEST ONLY** | Isolated Production SoR |
| Storage redundancy | Disk/array resilience | Design later | **NOT DESIGNED** | Storage design |
| Encryption in transit | TLS `require` Production-like | Fail-closed if not `require` | Config rule exists; Production TLS **not commissioned** | Certificates |
| Encryption at rest | Protect SoR at rest | Design later; product **UNSELECTED** | **NOT DEMONSTRATED** | At-rest design |
| Access controls | Least-privilege DB roles | No Dev bootstrap passwords in Production-like | Fail-closed Dev secrets | Production roles |
| Database backups | Regular portable PG backups | Independent of application rewrite | Disposable dump harness **DEV/TEST ONLY**; refuses `eos_gateb` migrate-to-green | RV-01 |
| PITR / WAL | Restore to a point in time **if adopted** | Portable PG mechanisms; **not** a provider backup API in domain code | **NOT DEMONSTRATED** | RV-02; **HUMAN DECISION** whether to adopt PITR |
| Restore validation | Restore to a clean instance + integrity | RV-03 / RV-13 | Lab/synthetic **not** Production SoR | RV-03, RV-13 |
| Replication options | Streaming / standby **as options** | Not selected | **NOT IMPLEMENTED** | Replication design |
| Upgrade procedures | Minor/major PG upgrades without app rewrite | Documented | **NOT APPROVED** | Upgrade runbook |
| Monitoring | Connections, lag, disk, checkpoints | Product **UNSELECTED** | App `/health` `/ready` only | DB monitoring |
| Maintenance | Vacuum, stats, patch windows | Operating model | **NOT ESTABLISHED** | Maintenance plan |
| Data integrity | Constraints, audit, outbox same-tx where required | Existing kernel/SoR design | Dev/Test Class B **DEV/TEST ONLY** | RV-05 |
| Recovery dependencies | IdP, DNS, storage, secrets available after restore | RV-07 | Products **UNSELECTED** | RV-07 |

**Do not claim** that PITR, replication, high availability, or recovery objectives have been implemented or demonstrated. Technical RTO **NOT DEMONSTRATED**. Technical RPO **NOT DEMONSTRATED**.

---

## D. Document storage

Preserve `DocumentStorage` (`put` / `get` / `delete` / `exists` / `stat` with size and SHA-256). Content-type remains on SoR metadata.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| Metadata in PostgreSQL | Document records, versions, hashes in SoR | Business logic does not take raw FS paths | Dev/Test SoR path exists | Production SoR |
| Local filesystem Dev/Test | Bytes on configurable `EOS_DOCUMENT_ROOT` | **DEV/TEST ONLY**; Production-like refuses `local-fs` | **IMPLEMENTED** Dev/Test | Must not be treated as Production durability |
| Future SEDMC-owned storage | Same port on owned filesystem or later object store | Relocatable paths; portable path handling | **FUTURE** | Facility path **EVIDENCE REQUIRED** |
| Optional future object storage | S3-compatible or other approved store | Adapter **FUTURE PROVIDER IMPLEMENTATION** — not written; not selected | **NOT IMPLEMENTED** | Only if later authorized |
| Integrity / SHA-256 | Verify bytes against recorded hash | `stat` checksum | Dev/Test port exists | RV-04 |
| Backup and restoration | Bytes + metadata restored together | Independent backup of object store/FS | **NOT DEMONSTRATED** Production | RV-04 |
| Access control | App RBAC + storage ACLs | Least privilege | Production ACLs **NOT DESIGNED** | ACL design |
| Retention and deletion | Align to legal retention | E-13 when complete | Legal retention **not closed** | Retention decision |
| Capacity and expansion | Growth without rewrite | **REQUIRES TECHNICAL CAPACITY ASSESSMENT** | **NOT INVENTED** | Volume model |

Business modules must not import S3 / Azure Blob / GCS SDKs.

---

## E. Networking

Do **not** invent IP addresses, VLANs, equipment, or facility topology.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| Internal segmentation | Separate admin, app, data, backup paths as later design requires | Configurable endpoints | **NOT DESIGNED** | Network design |
| Firewalling | Default deny | Host/network filters | **NOT DESIGNED** | Firewall policy |
| Reverse proxy | TLS terminator; app bind configurable | Product **UNSELECTED** | Dev listen default `127.0.0.1` | Proxy design |
| TLS | Production certificates not hard-coded | Production-like requires DB TLS `require` | Dev may disable DB TLS | Cert issuance |
| Administrative access | Least privilege, logged | Named admins **NOT ESTABLISHED** | **NOT ESTABLISHED** | Admin path |
| VPN or equivalent | Secure remote admin | Product **UNSELECTED** | **NOT ESTABLISHED** | Remote-access design |
| DNS | Names not hard-coded Production IPs | Environment configuration | **NOT SELECTED** | DNS plan |
| Public/private boundaries | Only intended services public | No accidental Production exposure of Dev | Dev isolated | Boundary design |
| Database isolation | PG not on the public internet | Private reachability | **NOT DESIGNED** | PG network design |
| Monitoring and logging | Network/security telemetry | Feeds investigation | Product **UNSELECTED** | Logging design |
| Network redundancy | Diverse paths preferred | Design goal | **NOT DESIGNED** | Connectivity options |
| Connectivity failure handling | Detect, alert, degrade safely | Health/ready honesty | `/health` `/ready` exist; Production alerting **UNSELECTED** | Failure runbook |

---

## F. Identity and secrets

`local-password-dev` and development secrets are **DEV/TEST ONLY**. Production-like environments **fail closed** until suitable Production identity and secrets exist.

Do **not** select an IdP, KMS, or secrets vendor. Do **not** implement MFA as though already approved/available.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| Production identity provider | Non-local IdP implementing `IdentityProvider` | Product **UNSELECTED**; federated hook is **FUTURE** | `local-password-dev` Dev/Test | ADR-0013; IdP choice |
| MFA | MFA for Production admin (LA-16 direction) | Not claimed implemented | **NOT IMPLEMENTED** as approved Production MFA | MFA design after IdP |
| RBAC | Existing kernel authorize / SoD | Bind to Production identities | **IMPLEMENTED** in Dev/Test | IdP group mapping |
| Least privilege | OS, DB, app, backup roles | No standing excess admin | **NOT DESIGNED** Production | Role matrix |
| Administrative access | Named, logged, reviewed | Operators **NOT ESTABLISHED** | **NOT ESTABLISHED** | HUM-08 |
| Secrets management | Non-`env-dev` `SecretsProvider` | ADR-0012 **OPEN** | `env-dev` **DEV/TEST ONLY**; Production-like rejects known placeholders | Secrets product |
| Credential rotation | Rotate token/DB/admin secrets | Documented procedure | **NOT ESTABLISHED** Production | Rotation runbook |
| Service identities | App-to-DB, app-to-storage | No shared human passwords | **NOT DESIGNED** | Service accounts |
| Audit logging | AuthN/authZ and admin actions | Durable audit in SoR | Dev/Test audit path | Production durability |
| Emergency access | Break-glass with logging | Procedure **NOT ESTABLISHED** | **NOT ESTABLISHED** | Emergency procedure |

---

## G. Email, events, and observability

Do **not** select a Production email vendor or event product. Do **not** introduce NATS, cloud messaging, or a provider-specific bus as a **selected** solution. Current NATS Dev/Test transport remains isolated. Production event transport remains **OPEN**.

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| Production email | Deliver operational/commercial mail | `EmailNotificationAdapter`; SES SDK is adapter-only **C-class**, **not selected** | `dev-outbox` / smtp-stub **DEV/TEST ONLY**; Production-like refuses stubs | SMTP/API product **UNSELECTED** |
| Event transport | Reliable domain events | `EventTransport` + outbox; domain must not import NATS/SNS/SQS/Service Bus/Pub/Sub | `in-memory-dev` **DEV/TEST ONLY**; Production-like refuses in-memory/stub | Event product **UNSELECTED** |
| Outbox durability | Same-transaction with SoR where required | Portable PG outbox | Dev/Test Class B **DEV/TEST ONLY** | Production SoR |
| Retry handling | Controlled retry / DLQ operations | Existing I4 operations remain app-level | Dev/Test | Production ops ownership |
| Monitoring | Health, ready, host/DB/app | Provider-neutral structured telemetry | `/health` `/ready`; `productionReady: false` | Production exporters **FUTURE** |
| Structured logs | JSON logs with redaction | Not CloudWatch/Azure Monitor/GCP Ops hard-coded | **IMPLEMENTED** Dev/Test | Log sink **UNSELECTED** |
| Correlation IDs | Request/correlation on requests | Existing observability | **IMPLEMENTED** Dev/Test | Retention of IDs in Production logs |
| Audit events | Business audit trail | SoR audit | Dev/Test | RV-05 |
| Alerting | Actionable alerts in EAT coverage | Roster **NOT ESTABLISHED** | Dev webhook **DEV/TEST ONLY** | Alerting product + roster |
| Operational dashboards | Ops visibility | Product **UNSELECTED** | **NOT ESTABLISHED** | Dashboard design |
| Log retention | Align to E-13 when complete | Retention **not closed** | **NOT ESTABLISHED** | Retention decision |
| Incident investigation | Reconstruct by correlation/audit | IR **DRAFT ≠ READY** | E-15 draft | Production IR |

---

## H. Backup and disaster recovery

Business requirements (owner-confirmed **S2**; **not** technical measurements):

| Business item | Value |
| --- | --- |
| Recovery priority | Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers |
| Critical business recovery target | Up to **3 hours** |
| Overall recovery target | Up to **4 hours** |
| Data-loss tolerance | **Zero** tolerated loss of **critical business data** |

| Technical item | Value |
| --- | --- |
| Technical RTO | **NOT DEMONSTRATED** |
| Technical RPO | **NOT DEMONSTRATED** |
| Business zero-loss | **Not equivalent** to technical RPO=0 |

| Topic | Desired capability | Architectural requirement | Implementation status | Evidence required |
| --- | --- | --- | --- | --- |
| Database backups | Portable PG backups | Independent of a particular provider backup product | Disposable/lab **DEV/TEST ONLY** | RV-01 |
| WAL / PITR or equivalent | Point-in-time restore **if adopted** | Portable PG; adoption **HUMAN DECISION** | **NOT DEMONSTRATED** | RV-02 |
| Document backup | Bytes + metadata | `DocumentStorage` round-trip | LocalFs Dev only | RV-04 |
| Configuration backup | Env/config references, not secret values in git | Secrets via secrets port | `.env.example` placeholders only | Config restore procedure |
| Secrets recovery | Restore secrets without leaking them into the app repo | Secrets product **UNSELECTED** | **NOT ESTABLISHED** | Secrets recovery procedure |
| Backup integrity checks | Restore probe; job success **insufficient** (ADR-0011) | RV-12 | Dev BCM register is **not** PG backup | RV-12 |
| Restore testing | Clocked restore to clean instance | RV-03, RV-08 | Lab timings **not** Production RTO | RV-03, RV-08 |
| Recovery dependencies | IdP, DNS, storage, email, secrets | RV-07 | **UNSELECTED** | RV-07 |
| Offsite backup location | Independent failure domain | **NOT SELECTED** | **NOT SELECTED** | Facility/DR options |
| Disaster recovery location | Assessed DR site **if** topology includes DR | Restricted+ / legal rules apply when a site exists | **UNSELECTED** | RV-10 |
| Failover and failback | Tested only if DR topology selected | RV-10 / RV-11 | **UNSELECTED** | RV-10, RV-11 |
| Recovery exercise frequency | Cadence after Production exists | **NOT DEFINED** | **NOT ESTABLISHED** | Ops calendar |
| Recovery evidence | Timestamp, operator role (not invented), environment label, hashes, pass/fail | RV-14 | Lab run IDs **lab only** | RV-14 |

Local disk and disposable PostgreSQL dump/restore timings are **not** Production RTO/RPO evidence. **Do not claim recovery compliance.**

---

## I. Operations

Do **not** invent personnel. Existing recorded facts only: Owner **Patrick Makundi**; DPO **owner-designated Wensley Shirima** with **formal appointment REQUIRED**. E1-B sender is **not** Production operations.

| Topic | Desired capability | Architectural requirement | Implementation status |
| --- | --- | --- | --- |
| Named operational ownership | Roles for restore, backup, app, identity, network | HUM-08 | **NOT ESTABLISHED** |
| Monitoring and alert response | Coverage overlapping Commercial recovery window (EAT) | Roster | **NOT ESTABLISHED** |
| Patch management | OS, PG, runtime, dependencies | Cadence | **NOT ESTABLISHED** for Production |
| Backup monitoring | Job + restore-probe | ADR-0011 | **NOT READY** |
| Incident response | Detect, contain, notify, learn | E-15; DPO when appointed | **DRAFT ≠ READY** |
| Change management | Controlled Production change | Gate C / authorization | **NOT READY** |
| Asset inventory | Hardware/software register | After procurement | **NOT ESTABLISHED** |
| Maintenance windows | Agreed with business owners | S2-aware | **NOT DEFINED** |
| Access reviews | Periodic privileged access | IdP + owner | **NOT READY** |
| Capacity reviews | Recurring vs growth | After baseline measurement | **NOT ESTABLISHED** |
| Recovery exercises | Scheduled technical restores | RV plan | **NOT DEMONSTRATED** Production |
| Vendor/facility support | Where a facility/colo exists | After contract | **NOT AUTHORIZED** |

**Operational readiness is not claimed.**

---

## 4. Deployment-readiness stages

**No stage is complete** as Production readiness. Stage 0 is the **current Dev/Test environment only**.

### Stage 0 — Local Dev/Test

| Item | Status |
| --- | --- |
| Local development machine | **CURRENT** development environment |
| Disposable / local PostgreSQL | Authorized Dev/Test where already permitted |
| Local document storage | **DEV/TEST ONLY** |
| Development identity and secrets | **DEV/TEST ONLY** |
| Production data | **None** |
| Production readiness claim | **Forbidden** |

**Prerequisites to remain here:** Gate B isolation; no `eos_gateb` migrate-to-green; fail-closed Production-like config.

### Stage 1 — Infrastructure design

Approved requirements; capacity assessment; facility due diligence; network and security design; backup and recovery design; operating model; cost and TCO assessment.

**Prerequisites:** this plan + framework + direction; **BUSINESS INPUT REQUIRED** and **MEASUREMENT REQUIRED** items in §5; Legal review scoped to **candidate** sites (none selected); HUM-08 ownership model drafted (names still **NOT ESTABLISHED** until recorded).

**Status:** **NOT COMPLETE**. This document is Stage 1 **preparation**, not Stage 1 approval.

### Stage 2 — Procurement and preparation

Explicit procurement authorization; hardware/facility decisions; asset inventory; installation plan; security baseline; backup and recovery implementation plan.

**Prerequisites:** Stage 1 approved by owner; budget still TCO-first / **not fixed** until sizing exists; **procurement currently NOT AUTHORIZED**.

**Status:** **NOT AUTHORIZED**.

### Stage 3 — Infrastructure validation

Security validation; database durability; backup and restore testing; document recovery; monitoring; identity and access; failover/failback **where applicable**.

**Prerequisites:** Stage 2 implemented on **non-Production or newly built** infrastructure labelled honestly; RV-01–RV-14 executed with environment labels; **do not** treat lab as Production.

**Status:** **NOT STARTED** for SEDMC-owned Production-class infrastructure (it does not exist).

### Stage 4 — Production authorization

Required human decisions completed; governance gates closed or formally approved; Production deployment authorization; migration authorization; UAT completion; demonstrated recovery evidence; operational ownership confirmed.

**Prerequisites:** Gate C addressed; E1 / ADR-0006 / DP-0006 not assumed closed by this plan; technical RTO/RPO **demonstrated** on the intended topology; DPO appointment evidence; PDPC/entity evidence as required for Production processing; **no Production data** before authorization.

**Status:** **NOT AUTHORIZED**.

---

## 5. Capacity and sizing framework

Do **not** treat empty cells as approved numbers. Do **not** fabricate estimates as requirements.

| Item | Current record | Status |
| --- | --- | --- |
| Expected user population | Not recorded as a Production figure | **BUSINESS INPUT REQUIRED** |
| Concurrent users | Not measured for Production | **BUSINESS INPUT REQUIRED** / **MEASUREMENT REQUIRED** |
| API request volume | No Production baseline | **MEASUREMENT REQUIRED** |
| Database size | Dev/Test only; Production SoR does not exist | **MEASUREMENT REQUIRED** |
| Document volume | Dev/Test LocalFs only | **MEASUREMENT REQUIRED** |
| Storage growth | No Production growth model | **BUSINESS INPUT REQUIRED** |
| Backup volume | Function of DB + documents + retention | **MEASUREMENT REQUIRED** |
| Retention periods | E-13 not closed | **HUMAN DECISION REQUIRED** / legal |
| Peak workload | Costing/RFP/document peaks unquantified | **BUSINESS INPUT REQUIRED** |
| Recovery workload | Restore + Commercial-first bring-up | **MEASUREMENT REQUIRED** (RV-08) |
| Growth assumptions | None approved | **BUSINESS INPUT REQUIRED** |
| Performance testing requirements | C1 baseline is Dev/Test documentation | **MEASUREMENT REQUIRED** on the future target |

**REQUIRES TECHNICAL CAPACITY ASSESSMENT** before any hardware BOM. CPU, RAM, disk, and server counts remain **NOT INVENTED**.

---

## 6. Security and legal dependencies

Do **not** make a final legal conclusion. Do **not** claim statutory compliance.

| Dependency | Bearing on this plan | Status |
| --- | --- | --- |
| Tanzania PDPA | Primary baseline in existing Legal Counsel record | Architecture-dependent application to a **chosen** facility |
| Data residency | Preferred TZ location is **direction**, not approved residency architecture | **NOT APPROVED** |
| Facility legal arrangements | Title/lease/colo, subprocessors | **EVIDENCE REQUIRED / FACILITY ASSESSMENT REQUIRED** |
| Data processing responsibilities | Controller/processor split once a facility/operator exists | **NOT ESTABLISHED** for a site |
| DPO appointment evidence | Owner-designated **Wensley Shirima**; formal appointment **REQUIRED** | **NOT COMPLETE** |
| PDPC status | HUM-02 | **NOT ESTABLISHED / NOT VERIFIED** |
| Access control | Production IdP + RBAC | IdP **UNSELECTED** |
| Encryption | In transit required Production-like; at rest **design later** | **NOT DEMONSTRATED** at rest |
| Backup and DR location | Additional processing/transfer if offsite/cross-border | **NOT SELECTED**; legal analysis **after** a location exists |
| Incident response | E-15; notify paths | **DRAFT ≠ READY** |
| Retention and deletion | E-13 | **NOT CLOSED** |
| Cross-border contingency | Cloud remains optional future contingency | **NOT SELECTED**; not excluded permanently |

THOMAS NGULUMA remains **LEGAL COUNSEL ONLY**. Combined Legal/DPO remains **INCOMPLETE**.

---

## 7. Cost and TCO framework

HUM-09: **TCO-FIRST / BUDGET NOT YET FIXED**. No dollar amount is recorded. Final cost requires technical sizing and facility evidence. Do **not** invent prices or approve a budget.

| Cost category | Notes | Status |
| --- | --- | --- |
| Server hardware | After capacity assessment | **NOT SELECTED** |
| Storage | PG + documents + backups | **REQUIRES TECHNICAL CAPACITY ASSESSMENT** |
| Networking | Links, firewall, proxy | **NOT DESIGNED** |
| Power | Utility + UPS + generator | **FACILITY ASSESSMENT REQUIRED** |
| Cooling | HVAC | **FACILITY ASSESSMENT REQUIRED** |
| Facility | Owned / leased / colo | **NOT SELECTED** |
| Connectivity | Carriers | **NOT SELECTED** |
| Maintenance | Hardware + OS + PG | **NOT AUTHORIZED** |
| Replacement parts | Spares | **NOT PROCURED** |
| Backup | Media/target/offsite | **NOT SELECTED** |
| DR | If topology includes DR | **UNSELECTED** |
| Security | IdP, MFA, monitoring | Products **UNSELECTED** |
| Monitoring | Host/app/DB | **UNSELECTED** |
| Software licensing | OS, PG (as applicable), runtimes | **NOT SELECTED** |
| Support | Facility/vendor | **NOT AUTHORIZED** |
| Implementation | Install, migration planning | **NOT AUTHORIZED** |
| Recovery testing | Recurring exercises | **NOT ESTABLISHED** |
| Personnel | Ops roster | **NOT ESTABLISHED** |
| Taxes | Jurisdiction of facility | **EVIDENCE REQUIRED** after a site exists |
| Lifecycle replacement | Hardware refresh | **NOT SELECTED** |

Quotes, if later obtained, are **indicative / non-binding** until a separate procurement authorization.

---

## 8. Cloud portability preservation

The application must **not** depend on:

- specific cloud APIs in business logic;
- cloud-specific business logic;
- fixed provider IPs;
- fixed regions;
- cloud-only database management APIs;
- provider-specific document paths.

Ports remain: PostgreSQL URL/TLS/pool; `DocumentStorage`; `IdentityProvider`; secrets configuration; email adapter; event transport; structured logs / health / ready.

Cloud remains an **optional future contingency**. **Not selected. Not ranked. Not recommended. Not required now. Not permanently excluded.**

A future container, if later authorized, must treat PostgreSQL as an **external** durable service and must not assume a cloud, physical server, IP, or filesystem layout. No Dockerfile / Kubernetes / Terraform is introduced by this plan (GAP-DEP-02 remains: do not lock IaC prematurely).

---

## 9. Governance and authorization boundaries

| Item | Status |
| --- | --- |
| SEDMC-owned infrastructure | **Preferred current direction** — **not in place** |
| Tanzanian facility | **Preferred future location direction** — **not selected** |
| Hardware | **Not selected** |
| Procurement | **Not authorized** |
| Production architecture | **Not approved** |
| Production deployment | **Not authorized** |
| Production migration | **Not authorized** |
| Gate C | **OPEN** |
| E1 | **NOT APPROVED / BLOCKED** |
| ADR-0006 | **OPEN** |
| DP-0006 | **OPEN** |
| Technical RTO/RPO | **NOT DEMONSTRATED** |
| E1-B external RFI transmission | **PAUSED / SUPERSEDED AS THE CURRENT NEXT ACTION** |
| E1-B transmissions / responses / receipts | **0 / 0 / 0** |

Do **not** reactivate the RFI without a **new explicit owner decision**. Historical issuance authorization is **preserved** and is **not** current execution authority.

This plan **does not** authorize server purchase, facility selection, colocation contract, cloud selection, Production data processing, or Production backup/DR activation.

---

## 10. What this plan does not do

- Select or rank a facility, hardware vendor, cloud, or colo.  
- Invent CPU/RAM/disk/server quantities or prices.  
- Invent operational personnel.  
- Claim Stage 1–4 complete.  
- Claim technical RTO/RPO achievement.  
- Send provider RFIs.  
- Modify frozen E1-B hashes.  
- Change application code.  
- Commit or push.

**Exact next action:** Continue local EOS Dev/Test while completing the SEDMC-owned infrastructure capacity assessment, facility requirements, and technical design prerequisites. No procurement or Production deployment is authorized.

**SEDMC is NOT Production Ready.**

---

## 11. Additive — 2026-09-17 capacity and facility assessment specification

Companion: [`adr-0006-e1-c-capacity-and-facility-assessment-specification.md`](adr-0006-e1-c-capacity-and-facility-assessment-specification.md).

Section 10 next-action line remains valid as **direction**. The **methodology** for capacity/facility evidence is now specified. Conduct of surveys and supplier contact remains **HUMAN DECISION REQUIRED**. Stage 1 **NOT APPROVED / NOT COMPLETE**. Stage 2 **NOT AUTHORIZED**.
