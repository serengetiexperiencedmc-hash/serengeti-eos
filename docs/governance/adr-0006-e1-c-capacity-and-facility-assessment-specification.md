# E1-C — Capacity and Facility Assessment Specification

> **`GOVERNANCE / PLANNING ONLY`**  
> **`NO PROCUREMENT AUTHORIZATION`**  
> **`NO FACILITY SELECTION`**  
> **`NO HARDWARE SELECTION`**  
> **`NO PRODUCTION AUTHORIZATION`**  
> **`THIS SPECIFICATION ≠ CONDUCT OF THE ASSESSMENT`**  
> **`ACTUAL SITE SURVEY / SUPPLIER CONTACT = HUMAN DECISION REQUIRED`**  
> **`NO CPU / RAM / DISK / SERVER QUANTITIES INVENTED`**  
> **`NO PRICES`** · **`NO BUDGET APPROVED`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Business zero-loss ≠ technical RPO=0`**  
> **`Stage 0 = CURRENT (Local Dev/Test)`**  
> **`Stage 1 = NOT APPROVED / NOT COMPLETE`**  
> **`Stage 2 procurement = NOT AUTHORIZED`**  
> **`E1-B transmission = PAUSED / SUPERSEDED AS THE CURRENT NEXT ACTION`**  
> **`0 TRANSMISSIONS`** · **`0 RESPONSES`** · **`0 RECEIPTS`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`** · **`Gate C = OPEN`**  
> **`E1 = NOT APPROVED / BLOCKED`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Purpose:** define **what must be measured** and **what evidence must be obtained** before Stage 1 infrastructure design can be approved.  
**This file does not** procure, contact suppliers, send RFI, select a facility/cloud/hardware/IdP/email/event/monitoring/backup product, purchase equipment, deploy Production, migrate data, or close E1 / ADR-0006 / DP-0006.

### Authoritative inputs (not rewritten)

| Input | Path |
| --- | --- |
| Direction | [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md) |
| Requirements framework | [`adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md`](adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md) |
| Deployment-readiness plan | [`adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md`](adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md) |
| Recovery validation | [`adr-0006-e1-c-recovery-validation-plan.md`](adr-0006-e1-c-recovery-validation-plan.md) (RV-01–RV-14) |
| Operations framework | [`adr-0006-e1-c-production-operations-readiness-plan.md`](adr-0006-e1-c-production-operations-readiness-plan.md) |
| Frozen E1-B pack | Questionnaire / PE / template hashes **unchanged** — **not modified by this file** |
| Execution package | [`adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md`](adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md) |

### Four states (do not collapse)

| State | Meaning |
| --- | --- |
| **1. Requirement defined** | This specification records what must be known |
| **2. Evidence collected** | Artefacts exist (measurements, site documents) |
| **3. Evidence validated** | Independent review that the artefact answers the requirement |
| **4. Design decision approved** | Owner/authorized human approves Stage 1 design |

Today: state **1** for the items below. States **2–4** are **NOT ASSESSED / EVIDENCE REQUIRED** unless a later dated record proves otherwise. **Do not mark PASS because a requirement is written here.**

Local Dev/Test measurements, if later taken, remain **DEV/TEST ONLY** and are **not** Production sizing evidence unless explicitly labelled and re-validated on the intended topology.

---

## 1. Assessment methodology

| Rule | Application |
| --- | --- |
| Provider-neutral | Measure capabilities, not brands |
| No invented numbers | Empty numeric cells stay **MEASUREMENT REQUIRED** or **BUSINESS INPUT REQUIRED** |
| Environment label | Every measurement states Dev/Test vs candidate facility vs Production (none of the last two exist) |
| No supplier contact from this file | Actual facility walkthrough, quotes, or carrier tests require a **separate human authorization** |
| No hardware BOM | Outputs of a completed assessment feed Stage 1 design; they do **not** authorize Stage 2 |
| Fail-closed products | Production-like still refuses `local-password-dev`, `env-dev` placeholders, `local-fs`, TLS disable, in-memory events, email stubs |

**Conduct of the assessment is not authorized by this specification.** Next activity after this document: complete the specification (this file) and, **only after appropriate human authorization**, conduct the actual assessment.

---

## 2. Capacity assessment — what must be measured

Do **not** convert the following into invented CPU, RAM, disk, or server quantities.

### 2.1 Application / API workload

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| CAP-01 | Expected concurrent users | Owner/commercial headcount + partner/portal users; peak-season MICE calendar | Written user-population assumption | **BUSINESS INPUT REQUIRED** |
| CAP-02 | Authenticated sessions | Session TTL × concurrent users; login rate | Session model from current API behaviour **labelled Dev/Test** plus business peak | **MEASUREMENT REQUIRED** |
| CAP-03 | Peak request rate | Instrument `/` API in a labelled test; peak-period scenario | Request-rate log with method, path class, timestamp | **MEASUREMENT REQUIRED** |
| CAP-04 | Sustained request rate | Same as CAP-03 over a defined window | Windowed rate | **MEASUREMENT REQUIRED** |
| CAP-05 | Background jobs | Inventory outbox consumers, digest, AI draft, import, SLA jobs | Job catalogue + frequency | **EVIDENCE REQUIRED** |
| CAP-06 | File/document operations | Count put/get per commercial cycle | Document op rate | **MEASUREMENT REQUIRED** |
| CAP-07 | MICE/commercial growth | Multi-year booking/RFP growth assumption | Owner-signed growth assumption | **BUSINESS INPUT REQUIRED** |
| CAP-08 | Peak-period assumptions | High season, RFP deadlines, costing peaks | Calendar of peaks | **BUSINESS INPUT REQUIRED** |
| CAP-09 | Acceptable headroom | % above peak before degradation | Owner headroom decision | **HUMAN DECISION REQUIRED** |

### 2.2 Web / application compute

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| CAP-10 | CPU utilization | Load test of API+web against a labelled fixture (not Production data) | CPU% vs RPS chart | **MEASUREMENT REQUIRED** |
| CAP-11 | Memory utilization | Same test; heap/RSS | Memory vs RPS | **MEASUREMENT REQUIRED** |
| CAP-12 | Process/thread limits | Node/libuv/pool behaviour under CAP-03 | Observed saturation point | **MEASUREMENT REQUIRED** |
| CAP-13 | Application response time | p50/p95/p99 for Commercial-first routes | Latency table | **MEASUREMENT REQUIRED** |
| CAP-14 | Peak vs sustained load | Compare CAP-03 and CAP-04 | Dual-load report | **MEASUREMENT REQUIRED** |
| CAP-15 | Horizontal / vertical scaling | Whether multiple API processes are required | Scaling options paper — **not** a product selection | **EVIDENCE REQUIRED** |
| CAP-16 | Compute redundancy | N+1 **as a design option**, not implemented | Redundancy options | **HUMAN DECISION REQUIRED** |

### 2.3 PostgreSQL

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| PG-01 | Database size | `pg_database_size` on **labelled** Dev/Test; Production SoR **does not exist** | Size snapshot + label | **MEASUREMENT REQUIRED** (Dev/Test only until Production exists) |
| PG-02 | Growth rate | Size over time + CAP-07 | Growth series | **MEASUREMENT REQUIRED** |
| PG-03 | Connection count | Peak `numbackends` vs `EOS_DATABASE_POOL_SIZE` | Connection trace | **MEASUREMENT REQUIRED** |
| PG-04 | Connection-pool requirements | Pool sizing from PG-03 + headroom CAP-09 | Pool recommendation **not** a BOM | **MEASUREMENT REQUIRED** |
| PG-05 | DB CPU | Load-test PG process | CPU% | **MEASUREMENT REQUIRED** |
| PG-06 | DB RAM | Shared buffers / work_mem **as observations**, not Production GUCs invented as approved | Memory observations | **MEASUREMENT REQUIRED** |
| PG-07 | Storage IOPS / latency | `iostat` / PG wait events under backup+peak | IOPS/latency | **MEASUREMENT REQUIRED** |
| PG-08 | Transaction volume | Commits/s Commercial-first | TPS | **MEASUREMENT REQUIRED** |
| PG-09 | Backup volume | Size of portable dump/basebackup | Backup bytes | **MEASUREMENT REQUIRED** |
| PG-10 | WAL volume | WAL generation rate **if** PITR is later adopted | WAL GB/day | **MEASUREMENT REQUIRED**; PITR adoption **HUMAN DECISION REQUIRED** |
| PG-11 | Expected retention | Backup/PITR/log retention | Retention decision | **HUMAN DECISION REQUIRED** (E-13 open) |
| PG-12 | Restore duration | Clocked restore of labelled backup to clean instance (RV-03) | Restore minutes **labelled** | **NOT DEMONSTRATED** for Production |
| PG-13 | Replication requirements/options | Whether streaming standby is needed | Options paper | **HUMAN DECISION REQUIRED** — **NOT IMPLEMENTED** |

### 2.4 Document storage

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| DOC-01 | Current document volume | Count/size under Dev/Test `EOS_DOCUMENT_ROOT` **labelled** | Bytes + object count | **MEASUREMENT REQUIRED** |
| DOC-02 | Annual growth | DOC-01 × CAP-07 | Growth model | **BUSINESS INPUT REQUIRED** |
| DOC-03 | Average / max file size | Distribution from SoR metadata | Size percentiles | **MEASUREMENT REQUIRED** |
| DOC-04 | Upload/download volume | CAP-06 × sizes | Throughput | **MEASUREMENT REQUIRED** |
| DOC-05 | Checksum requirements | SHA-256 on `stat` already required by port | Confirm verification in restore (RV-04) | Requirement defined; Production restore **NOT DEMONSTRATED** |
| DOC-06 | Retention implications | E-13 | Retention | **HUMAN DECISION REQUIRED** |
| DOC-07 | Backup implications | Bytes to back up with metadata | Backup size | **MEASUREMENT REQUIRED** |
| DOC-08 | Recovery implications | Time to restore bytes + SoR (RV-04) | Restore test | **NOT DEMONSTRATED** Production |

### 2.5 Network

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| NET-01 | Internet bandwidth | Candidate-site or office circuit capacity — **no IPs invented** | Circuit evidence | **FACILITY ASSESSMENT REQUIRED** |
| NET-02 | Latency | User→app, app→PG paths | Latency samples | **MEASUREMENT REQUIRED** |
| NET-03 | Upload/download throughput | Document + backup traffic | Throughput test | **MEASUREMENT REQUIRED** |
| NET-04 | Connectivity redundancy | Diverse paths as a **design goal** | Path options | **EVIDENCE REQUIRED** / **NOT SELECTED** |
| NET-05 | Internal network capacity | App–DB–backup east-west | Design, not a VLAN inventory | **NOT DESIGNED** |
| NET-06 | Administrative access | How admins reach hosts | Access method options | **NOT ESTABLISHED** |
| NET-07 | VPN or equivalent | Secure remote admin | Product **UNSELECTED** | **HUMAN DECISION REQUIRED** |
| NET-08 | TLS / reverse proxy | Terminator + certs; no hard-coded Production certs | Proxy options | **UNSELECTED** |
| NET-09 | Segmentation | Admin / app / data / backup | Segmentation design | **NOT DESIGNED** |

Do **not** invent IP addresses, VLANs, or equipment.

### 2.6 Backup / DR (capacity inputs)

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| BKP-01 | Backup data volume | PG-09 + DOC-07 | Combined bytes | **MEASUREMENT REQUIRED** |
| BKP-02 | Backup frequency | RPO **methodology** (not a claimed RPO) | Frequency options | **HUMAN DECISION REQUIRED** |
| BKP-03 | Backup retention | Align PG-11 / E-13 | Retention | **HUMAN DECISION REQUIRED** |
| BKP-04 | Off-site / secondary location | Independent failure domain | Location **NOT SELECTED** | **FACILITY ASSESSMENT REQUIRED** |
| BKP-05 | Restore throughput | Bytes/hour during RV-03/RV-04 | Throughput | **MEASUREMENT REQUIRED** |
| BKP-06 | Restore time | Clock start-to-serve Commercial-first (RV-06, RV-08) | Minutes **labelled** | **NOT DEMONSTRATED** Production |
| BKP-07 | Restore validation | Application-level checks (RV-13) | Pass/fail labelled | **NOT DEMONSTRATED** Production |
| BKP-08 | Recovery dependencies | IdP, DNS, storage, email, secrets (RV-07) | Dependency list | **UNSELECTED** products |

### 2.7 Monitoring / operations

| ID | What must be known | Measurement / method | Evidence required | Status |
| --- | --- | --- | --- | --- |
| OPS-01 | Metrics | Host/app/DB metric set | Metric catalogue | **EVIDENCE REQUIRED**; product **UNSELECTED** |
| OPS-02 | Logs | Structured JSON + correlation IDs | Log volume estimate | **MEASUREMENT REQUIRED** |
| OPS-03 | Alerting | Alert list vs S2 window (EAT) | Alert catalogue | **NOT ESTABLISHED** |
| OPS-04 | Telemetry storage | Metrics+logs bytes | Retention × volume | **MEASUREMENT REQUIRED** |
| OPS-05 | Telemetry retention | E-13 | Retention | **HUMAN DECISION REQUIRED** |
| OPS-06 | Operational access | Named roles | Roster | **NOT ESTABLISHED** |
| OPS-07 | On-call | Coverage overlapping Commercial recovery window | Roster | **NOT ESTABLISHED** |

---

## 3. Facility assessment checklist

Preferred geography: **Tanzania**. **No facility is selected or recommended.** Every row: **NOT ASSESSED**. Assessor/owner of the **site survey**: **NOT ESTABLISHED** (Owner **Patrick Makundi** remains the authorization authority, not an invented site engineer).

| ID | Topic | Requirement | Assessment method | Evidence required | Pass/exception | Responsible | Unresolved dependency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FAC-01 | Physical security | Controlled perimeter appropriate to classification | Site survey after human authorization | Survey + photos/report | **NOT ASSESSED** | **NOT ESTABLISHED** | Candidate site **NOT SELECTED** |
| FAC-02 | Access control | Logged least-privilege physical access | Review access procedure | Access policy | **NOT ASSESSED** | **NOT ESTABLISHED** | Operators **NOT ESTABLISHED** |
| FAC-03 | Environmental controls | Temperature/humidity in IT range | Logged readings | Env log sample | **NOT ASSESSED** | **NOT ESTABLISHED** | Site |
| FAC-04 | Cooling | HVAC for later heat load | Design review vs CAP-10/PG-05 **after** those exist | HVAC evidence | **NOT ASSESSED** | **NOT ESTABLISHED** | Capacity first |
| FAC-05 | Power quality | Utility suitable for IT | Power history / measurement | Utility evidence | **NOT ASSESSED** | **NOT ESTABLISHED** | Site |
| FAC-06 | UPS | Bridging for orderly shutdown / intended runtime | Spec vs load | UPS evidence | **NOT ASSESSED** | **NOT ESTABLISHED** | Sizing |
| FAC-07 | Generator / backup power | Runtime vs **business** ≤3h/≤4h as **design input only** | Fuel/runtime evidence | Generator evidence | **NOT ASSESSED** | **NOT ESTABLISHED** | Not a demonstrated RTO |
| FAC-08 | Fire detection / suppression | IT-compatible | Certificate / design | Fire evidence | **NOT ASSESSED** | **NOT ESTABLISHED** | Site |
| FAC-09 | Water / environmental risk | Flood, dust, leak | Risk screen | Risk report | **NOT ASSESSED** | **NOT ESTABLISHED** | Site |
| FAC-10 | Connectivity | Reachable app and admin paths | Carrier options — **no invented IPs** | Circuit options | **NOT ASSESSED** | **NOT ESTABLISHED** | NET-01 |
| FAC-11 | Internet redundancy | Diverse paths preferred | Path diversity review | Path options | **NOT ASSESSED** | **NOT ESTABLISHED** | NET-04 |
| FAC-12 | Rack / space | Space for later BOM | Floor/rack survey | Space drawing | **NOT ASSESSED** | **NOT ESTABLISHED** | BOM **NOT INVENTED** |
| FAC-13 | Equipment protection | Physical protection of racks | Survey | Protection notes | **NOT ASSESSED** | **NOT ESTABLISHED** | Site |
| FAC-14 | Maintenance access | Hands for hardware | Access hours vs windows | Access terms | **NOT ASSESSED** | **NOT ESTABLISHED** | Windows **NOT DEFINED** |
| FAC-15 | Facility monitoring | Environmental/security telemetry | What the site can provide | Monitoring list | **NOT ASSESSED** | **NOT ESTABLISHED** | Product **UNSELECTED** |
| FAC-16 | Physical asset security | Asset control | Inventory process | Process | **NOT ASSESSED** | **NOT ESTABLISHED** | Inventory **NOT ESTABLISHED** |
| FAC-17 | Occupancy rights | Lawful occupation | Legal review of title/lease/colo **draft** | Document — **not signed under this spec** | **NOT ASSESSED** | Legal Counsel review **after** a candidate exists | Counsel; site |
| FAC-18 | Ownership / lease documentation | Evidence of rights | Document inspection | Title/lease/colo | **NOT ASSESSED** | **NOT ESTABLISHED** | Site |
| FAC-19 | Legal / privacy | PDPA/residency for **that** site | Counsel analysis | Legal memo | **NOT ASSESSED** | THOMAS NGULUMA = Legal Counsel only; DPO appointment **REQUIRED** | PDPC **NOT ESTABLISHED**; Combined Legal/DPO **INCOMPLETE** |
| FAC-20 | Geographic considerations | Tanzania preferred **direction** | Record location class; do not treat as approved architecture | Location note | **NOT ASSESSED** | Owner | DP-0006 **OPEN** |
| FAC-21 | Secondary backup / DR location | Independent failure domain | Options — **not selected** | DR options | **NOT ASSESSED** | **HUMAN DECISION REQUIRED** | BKP-04 |
| FAC-22 | Business continuity | Supports S2 as business constraint | BC implications memo | BC note | **NOT ASSESSED** | Owner / BCM | Technical RTO **NOT DEMONSTRATED** |
| FAC-23 | Insurance | Cover for occupancy/equipment | Broker/policy **later** | Policy evidence | **NOT ASSESSED** | **NOT ESTABLISHED** | Procurement **NOT AUTHORIZED** |
| FAC-24 | Service / maintenance availability | Support overlapping recovery windows | SLA **QUOTE REQUIRED** later | Support terms | **NOT ASSESSED** | **NOT ESTABLISHED** | Do not contact suppliers from this file |

---

## 4. Evidence register (master)

Status vocabulary: **NOT ASSESSED** · **EVIDENCE REQUIRED** · **MEASUREMENT REQUIRED** · **BUSINESS INPUT REQUIRED** · **HUMAN DECISION REQUIRED** · **NOT SELECTED** · **NOT AUTHORIZED** · **NOT DEMONSTRATED** · **OPEN**.  
**PASS is not used.** Date assessed: **N/A**. Exception: **none recorded**. Approval required: **Owner / authorized human** before Stage 1 complete.

Source for capacity rows: business records + labelled Dev/Test instrumentation. Source for facility rows: site artefacts **after** human authorization to assess. Owner of collection: **NOT ESTABLISHED** except authorization by **Patrick Makundi**.

The ID tables in §§2–3 **are** the register. Additional recovery objects remain RV-01–RV-14 (**none Production-closed**).

| ID family | Count of items | Aggregate status |
| --- | --- | --- |
| CAP-01–CAP-16 | 16 | **NOT ASSESSED / EVIDENCE OR MEASUREMENT OR BUSINESS INPUT OR HUMAN DECISION REQUIRED** |
| PG-01–PG-13 | 13 | **NOT DEMONSTRATED** for Production; Dev/Test measurement **optional and labelled** |
| DOC-01–DOC-08 | 8 | Same |
| NET-01–NET-09 | 9 | **NOT DESIGNED** / **UNSELECTED** / **FACILITY ASSESSMENT REQUIRED** |
| BKP-01–BKP-08 | 8 | **NOT DEMONSTRATED** Production |
| OPS-01–OPS-07 | 7 | **NOT ESTABLISHED** / **UNSELECTED** |
| FAC-01–FAC-24 | 24 | **NOT ASSESSED** |

---

## 5. Acceptance criteria (assessment complete ≠ Stage 1 approved)

The **assessment** may be called **complete** only when **all** of the following have evidence in states 2–3 (collected and validated), with exceptions **written**:

| Criterion | State today |
| --- | --- |
| Workload assumptions documented (CAP-01, CAP-07, CAP-08, CAP-09) | **BUSINESS INPUT REQUIRED** |
| Capacity measurements available (CAP-02–CAP-06, CAP-10–CAP-14) | **MEASUREMENT REQUIRED** |
| Facility evidence available (FAC-01–FAC-24 for a **named candidate** — none named) | **NOT ASSESSED** |
| PostgreSQL sizing inputs measured (PG-01–PG-12) | **MEASUREMENT REQUIRED** / **NOT DEMONSTRATED** |
| Document-storage growth measured/estimated from evidence (DOC-01–DOC-08) | **MEASUREMENT REQUIRED** |
| Network requirements measured/validated (NET-01–NET-09) | **NOT DESIGNED** |
| Backup/restore requirements quantified (BKP-01–BKP-08) | **MEASUREMENT REQUIRED** |
| DR dependencies identified (BKP-08, RV-07, FAC-21) | Products **UNSELECTED** |
| Technical RTO/RPO **methodology** defined (§6) | **Defined**; measurements **NOT DEMONSTRATED** |
| Operational ownership identified (OPS-06, OPS-07, HUM-08) | **NOT ESTABLISHED** |
| Legal/privacy/site dependencies identified (FAC-17–FAC-20) | Identified; evidence **NOT ASSESSED** |
| Unresolved exceptions documented | None yet — because nothing assessed |

**Stage 1 infrastructure design remains NOT APPROVED / NOT COMPLETE** until state **4** (design decision approved) after the assessment is complete. Completing measurements **does not** authorize Stage 2 procurement.

---

## 6. Technical RTO / RPO — methodology only

| Item | Position |
| --- | --- |
| Business critical recovery | Up to **3 hours** (S2) |
| Business overall recovery | Up to **4 hours** |
| Business data-loss tolerance | **Zero** tolerated loss of **critical business data** |
| Technical RTO | **NOT DEMONSTRATED** |
| Technical RPO | **NOT DEMONSTRATED** |
| Equivalence | Business zero-loss **is not** technical RPO=0 |

**Measurements/tests required later** (do not claim done):

| Area | Test | Related IDs |
| --- | --- | --- |
| Backup integrity | Restore probe; job success insufficient | BKP-07, RV-12 |
| Database recovery | Portable restore to clean instance | PG-12, RV-01, RV-03 |
| Document recovery | Bytes + metadata + SHA-256 | DOC-05, DOC-08, RV-04 |
| Application recovery | Commercial-first serve from restored SoR | RV-06 |
| Dependency recovery | IdP, DNS, storage, email, secrets | BKP-08, RV-07 |
| Technical RTO | Clock restore+bring-up | RV-08 |
| Technical RPO | Data lost vs last backup/PITR | RV-09 |
| Failover / failback | Only if DR topology later selected | RV-10, RV-11 |

Lab/Dev/Test timings are **not** Production RTO/RPO evidence.

---

## 7. Stage 0 → Stage 1 transition

| Current | Target |
| --- | --- |
| **Stage 0 — Local Dev/Test** | **Stage 1 — Infrastructure design** |

Stage 1 may be considered **complete** only when:

- this specification’s acceptance criteria are met (states 2–3);
- human decisions in §8 that are **Stage-1-blocking** are recorded;
- owner (or authorized delegate) records Stage 1 **design decision approved** (state 4);
- Gate C, E1, ADR-0006, DP-0006 remain independently **OPEN** unless separately closed;
- **no** Production architecture approval is inferred.

**Stage 1 = NOT APPROVED / NOT COMPLETE.**  
**Stage 2 procurement = NOT AUTHORIZED** by Stage 1 work or by this file.

---

## 8. Human decisions register

Each item: **HUMAN DECISION REQUIRED**. This document does not decide them.

| ID | Decision | Stage-1 blocking? |
| --- | --- | --- |
| HUM-CAP-01 | Authorize **conduct** of actual capacity tests / facility surveys (this spec does **not** authorize contact) | Yes, before states 2–3 for FAC-* |
| HUM-CAP-02 | Facility selection | After assessment; **not** this file |
| HUM-CAP-03 | Procurement authorization | Stage 2 only |
| HUM-CAP-04 | Budget | TCO-first; **not fixed** |
| HUM-CAP-05 | TCO acceptance | After costing inputs exist |
| HUM-CAP-06 | Operational roster (HUM-08) | Yes for Stage 1 complete |
| HUM-CAP-07 | Backup/DR strategy (offsite, frequency) | Yes for Stage 1 complete |
| HUM-CAP-08 | PITR adoption | Yes if WAL/PITR is in the design |
| HUM-CAP-09 | HA / replication approach | Yes for Stage 1 complete |
| HUM-CAP-10 | Production identity provider | Product **UNSELECTED**; fail-closed until configured |
| HUM-CAP-11 | Production secrets management | ADR-0012 **OPEN** |
| HUM-CAP-12 | Production email | Adapter **UNSELECTED** |
| HUM-CAP-13 | Production event infrastructure | Transport **UNSELECTED**; not NATS-as-selected |
| HUM-CAP-14 | Monitoring / observability products | **UNSELECTED** |
| HUM-CAP-15 | Legal/privacy/site determination | After a candidate site exists |
| HUM-CAP-16 | Headroom CAP-09 | Yes for sizing |
| HUM-CAP-17 | Renewed E1-B RFI authorization | **Not** required for Stage 1; RFI remains **PAUSED** |

---

## 9. TCO inputs — no pricing

**NO BUDGET OR PRICE IS APPROVED BY THIS DOCUMENT.** HUM-09 remains **TCO-FIRST / BUDGET NOT YET FIXED**.

Cost categories that will eventually need figures (all **NOT PRICED**):

facility; power; cooling; UPS; generator; connectivity; hardware; storage; spare parts; maintenance; licenses; security; backup; DR; monitoring; personnel; insurance; physical security; lifecycle replacement; disaster recovery; contingency.

---

## 10. Governance boundaries (unchanged)

| Item | Status |
| --- | --- |
| SEDMC-owned infrastructure | Preferred direction — **not in place** |
| Tanzanian facility | Preferred future location — **NOT SELECTED** |
| Hardware / cloud / IdP / email / events / monitoring / backup products | **NOT SELECTED** |
| Procurement / Production deploy / migrate | **NOT AUTHORIZED** |
| Production architecture | **NOT APPROVED** |
| Gate C / E1 / ADR-0006 / DP-0006 | **OPEN** / **NOT APPROVED / BLOCKED** / **OPEN** / **OPEN** |
| Technical RTO/RPO | **NOT DEMONSTRATED** |
| E1-B | **PAUSED**; **0 / 0 / 0** |

Frozen E1-B hashes are **not** modified by this file.

---

## 11. What this specification does not do

- Conduct the assessment.  
- Contact facilities or suppliers.  
- Select or rank a site, hardware, or cloud.  
- Invent measurements, prices, or legal conclusions.  
- Authorize Stage 2 or Production.  
- Claim technical RTO/RPO.  
- Change application code or migrations.

**Exact next governed action:** Complete this evidence-based capacity and facility assessment specification (this file) and, **only after appropriate human authorization**, conduct the actual assessment. Continue local EOS Dev/Test. No procurement. No Production deployment. E1-B remains paused.

**SEDMC is NOT Production Ready.**

---

## Additive — 2026-09-17 HUM-CAP-01 (does not rewrite §8)

Live authorization: [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md).  
Results: [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md).

**HUM-CAP-01** historical row above remains **HUMAN DECISION REQUIRED** as originally specified. Live status as of **2026-09-17**: **APPROVED — ASSESSMENT ONLY**. **CAP-GATE-01 = NOT COMPLETE.** **Stage 1 = NOT APPROVED.** E1-B remains **PAUSED**.
