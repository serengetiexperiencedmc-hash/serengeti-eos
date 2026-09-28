# E1-C — SEDMC-Owned Infrastructure Requirements Framework

> **`PLANNING FRAMEWORK ONLY — NOT PROCUREMENT`**  
> **`NOT FACILITY SELECTION`** · **`NOT HARDWARE SELECTION`** · **`NOT PRODUCTION APPROVAL`**  
> **`PREFERRED TARGET = SEDMC-OWNED SERVERS IN A SUITABLE TANZANIAN FACILITY`**  
> **`FACILITY = NOT SELECTED`** · **`HARDWARE = NOT SELECTED`**  
> **`SIZING = REQUIRES TECHNICAL CAPACITY ASSESSMENT`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Cloud = OPTIONAL FUTURE CONTINGENCY — NOT SELECTED`**  
> **`E1-B transmission = PAUSED as current next action`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`** · **`E1 = NOT APPROVED / BLOCKED`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Parent direction:** [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md).  
**Deployment-readiness plan:** [`adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md`](adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md).  
**Portability contract:** [`adr-0006-e1-c-infrastructure-portability-and-deployment-abstraction.md`](adr-0006-e1-c-infrastructure-portability-and-deployment-abstraction.md).

This framework lists **provider-neutral requirements** a future SEDMC-owned environment must satisfy. It does **not** select a site, brand, model, vendor, or cloud. It does **not** authorize purchase.

Application/business logic remains on existing ports. Future facility and hardware become a **deployment target**, not an application rewrite.

---

## 0. Current vs future

| Layer | Now | Future primary | Future contingency |
| --- | --- | --- | --- |
| Compute | Local Node.js on the development machine | SEDMC-owned servers | Qualified third-party/cloud if later approved |
| Database | Authorized disposable / local PostgreSQL | SEDMC-owned PostgreSQL 16-class | Managed PostgreSQL **URL only** from the app |
| Documents | `LocalFsDocumentStorage` | SEDMC-owned filesystem or later object store | S3-compatible / cloud object store adapter **FUTURE** |
| Identity / secrets / email / events | Dev/Test adapters | SEDMC-controlled services (products UNSELECTED) | Cloud IdP/KMS/SMTP **FUTURE** if approved |

Local implementations remain **DEV/TEST ONLY**.

---

## A. Facility

Preferred geography: **Tanzania**, as a **preferred future location direction**. **No facility is selected or contracted.**

Planning categories (all **DUE DILIGENCE REQUIRED**):

| Topic | Requirement (interface, not a named site) | Status |
| --- | --- | --- |
| Tanzanian location options | Identify candidate facilities (owned premises, suitable colo, or other lawful Tanzanian hosting) | **NOT SELECTED** |
| Physical security | Controlled perimeter, visitor logging, CCTV/guards as appropriate to classification | **NOT ASSESSED** |
| Power availability | Utility capacity for compute + cooling + growth | **NOT ASSESSED** |
| UPS and generator | Bridging and backup power sufficient for orderly shutdown and intended runtime | **NOT DESIGNED** |
| Cooling | HVAC sized to heat load with maintenance access | **NOT DESIGNED** |
| Fire protection | Detection/suppression compatible with IT occupancy | **NOT ASSESSED** |
| Connectivity providers | Diverse paths preferred; no Production IPs hard-coded in the application | **NOT SELECTED** |
| Physical access controls | Least-privilege, logged, MFA for remote admin; named operators **NOT ESTABLISHED** | **NOT DESIGNED** |
| Facility support and maintenance | SLAs, spare parts, on-call — **QUOTE / CONTRACT REQUIRED** later | **NOT AUTHORIZED** |
| Environmental resilience | Flood, dust, temperature, and site-risk screening | **NOT PERFORMED** |
| Legal and contractual due diligence | Premises title/lease, colo terms, PDPA/residency, subprocessors | **NOT COMPLETE** |

Do **not** treat “preferred Tanzanian facility” as an approved Production location.

---

## B. Compute

EOS runtimes to host (external to any future container): API (Node.js) and web application.

| Topic | Requirement | Status |
| --- | --- | --- |
| Node.js / API runtime | Node 20+ class as used by current EOS API | Current Dev/Test only |
| Web application runtime | Current EOS web build | Current Dev/Test only |
| CPU and RAM sizing | **REQUIRES TECHNICAL CAPACITY ASSESSMENT** | **NOT INVENTED** |
| Capacity planning | Peak concurrent users, document I/O, report jobs, backup windows | **NOT PERFORMED** |
| Redundancy | N+1 or equivalent **design later**; not claimed implemented | **NOT DESIGNED** |
| Hardware lifecycle | Refresh, warranty, spare components | **NOT SELECTED** |
| Spare components | Disks, PSU, NIC as later BOM requires | **NOT PROCURED** |
| Monitoring | Host metrics feeding provider-neutral application logs/metrics | Product **UNSELECTED** |

Do **not** invent final SKUs, core counts, or RAM figures.

---

## C. PostgreSQL

PostgreSQL remains the durable System of Record. The application uses a **PostgreSQL-compatible URL** (`EOS_DATABASE_URL`), pool size, and TLS mode. No RDS / Azure Database / Cloud SQL management APIs in business logic.

| Topic | Requirement | Status |
| --- | --- | --- |
| Compatibility | PostgreSQL **16-class** | Dev/Test may already use 16-class; Production **not provisioned** |
| Durable SoR | External to the application process/container | Dual-path Dev/Test exists; Production SoR **does not exist** |
| Storage redundancy | RAID/equivalent and/or storage-layer redundancy | **NOT DESIGNED** |
| Encryption | In transit TLS `require` for Production-like; at rest **design later** | Production TLS **not commissioned** |
| Access control | Least privilege roles; no Dev bootstrap passwords | Fail-closed rules exist in Dev/Test config; Production IdP **UNSELECTED** |
| Backup and PITR | Portable PostgreSQL backup; PITR **design later** | **NOT DEMONSTRATED** |
| Restore testing | Documented restore onto non-Production targets | Lab/disposable only; **not** Production evidence |
| Upgrade strategy | Minor/major PG upgrades without rewriting the app | **NOT APPROVED** |
| Monitoring | Connections, replication lag, disk, checkpoints | Product **UNSELECTED** |
| Replication options | Streaming / failover **options** to be designed | **NOT IMPLEMENTED** |

Do **not** claim high availability, PITR, or recovery targets have been implemented or demonstrated.

---

## D. Document storage

| Topic | Requirement | Status |
| --- | --- | --- |
| Dev/Test | `local-fs` under configurable `EOS_DOCUMENT_ROOT` | **DEV/TEST ONLY** |
| Future SEDMC-owned storage | `DocumentStorage` on owned filesystem or later object store | **FUTURE** |
| Future object-storage option | S3-compatible or other approved store behind the same port | **FUTURE PROVIDER IMPLEMENTATION** — not written |
| Integrity | SHA-256 on `stat`; SoR metadata holds content type | Dev/Test port exists |
| Backup and restoration | Bytes + metadata restored together | **NOT DEMONSTRATED** for Production |
| Access controls | Application RBAC + storage ACLs | Production ACLs **NOT DESIGNED** |
| Retention and deletion | Align to legal retention (E-13) when that evidence exists | Legal retention **not closed** |

Business modules must not take filesystem paths or cloud SDKs.

---

## E. Network and security

| Topic | Requirement | Status |
| --- | --- | --- |
| Firewall | Host/network filtering; default deny | **NOT DESIGNED** |
| Segmentation | Separate admin, app, data, backup paths as later design requires | **NOT DESIGNED** |
| Reverse proxy | TLS terminator; application bind remains configurable | Product **UNSELECTED** |
| TLS certificates | Production certs **not** hard-coded; Dev may use development settings | Production certs **NOT ISSUED** |
| VPN / administrative access | Least privilege; logged | **NOT ESTABLISHED** |
| Least privilege | OS, DB, app, backup roles | **NOT DESIGNED** for Production |
| MFA | Required for Production admin (LA-16 direction) | **NOT IMPLEMENTED** as approved Production MFA; do not fabricate IdP MFA |
| Monitoring | Structured app logs + host/security telemetry | App logs exist; security product **UNSELECTED** |
| Intrusion detection and response | Detect/respond process + tooling | **NOT ESTABLISHED** |
| Secrets management | `SecretsProvider` suitable for owned vault or later cloud KMS | `env-dev` **DEV/TEST ONLY**; Production KMS **UNSELECTED** |

No Production IP addresses, VPC IDs, or cloud regions in application business logic.

---

## F. Operations

Named operational personnel remain **NOT ESTABLISHED** except facts already on record (Owner **Patrick Makundi**; DPO **owner-designated Wensley Shirima** with **formal appointment REQUIRED**). Do **not** invent operators.

| Topic | Requirement | Status |
| --- | --- | --- |
| Named operational ownership | RACI for compute, DB, backup, network | **NOT ESTABLISHED** |
| Maintenance windows | Defined later with business owners | **NOT DEFINED** |
| Incident response | Align to personal-data incident work (E-15) when complete | **NOT COMPLETE** |
| Monitoring and alerting | Health/ready plus host/DB alerts | App `/health` `/ready` exist; Production alerting **UNSELECTED** |
| Backup monitoring | Job success/failure, age, restore-test calendar | **NOT ESTABLISHED** |
| Recovery exercises | Scheduled technical restore tests | **NOT DEMONSTRATED** |
| Patch management | OS, PG, runtime, dependencies | **NOT ESTABLISHED** for Production |
| Asset inventory | Hardware/software register | **NOT ESTABLISHED** |
| Change management | Production changes gated; Dev/Test remains Gate B isolated | Production CAB **NOT ESTABLISHED** |

---

## G. Business continuity and recovery

Owner-confirmed **business** recovery direction (**S2**, HUM-07 / CD-01 **CLOSED**):

`Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers`

| Kind | Statement | Status |
| --- | --- | --- |
| Business priority | S2 sequence above | **FORMALLY CONFIRMED** |
| Critical business recovery target | Up to **3 hours** | **Business requirement** |
| Overall recovery target | Up to **4 hours** | **Business requirement** |
| Data-loss tolerance | **Zero** tolerated loss of **critical business data** | **Business requirement** — not a demonstrated technical RPO |
| Technical RTO | Time to restore service under a tested procedure | **NOT DEMONSTRATED** |
| Technical RPO | Proven maximum data-loss window | **NOT DEMONSTRATED** |
| Recovery evidence | Restore tests, timings, artefacts on the intended Production design | **NOT PRODUCED** |

Local disk and disposable PostgreSQL dump/restore timings are **not** Production RTO/RPO evidence.

Portable PostgreSQL backup/restore must remain usable on SEDMC-owned backup infrastructure **or** later cloud backup infrastructure **without changing business logic**.

---

## H. Mapping to application configuration (no secrets)

Future SEDMC-owned deployment is expected to supply the same provider-neutral settings already documented (database URL / TLS / pool; document storage kind/root; identity; secrets; email; events; listen/TLS). Production-like environments continue to **fail closed** on Dev/Test substitutes.

No real secrets are recorded here.

---

## I. What this framework does not do

- Select or rank a facility, hardware vendor, cloud, or colo.  
- Authorize procurement or Production.  
- Demonstrate technical RTO/RPO.  
- Send E1-B RFI.  
- Rewrite DP-0006 into an approved hosting selection.  
- Modify frozen E1-B hashes.

**SEDMC is NOT Production Ready.**
