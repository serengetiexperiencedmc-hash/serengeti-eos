# E1-C — Capacity and Facility Assessment Execution Package

> **`ADDITIVE 2026-09-17: HUM-CAP-01 = APPROVED — ASSESSMENT ONLY — SEE AUTHORIZATION RECORD`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`GOVERNANCE / PLANNING ONLY`**  
> **`ASSESSMENT NOT YET AUTHORIZED`** *(original package state; superseded for HUM-CAP-01 by additive authorization 2026-09-17)*  
> **`NO PROCUREMENT`**  
> **`NO SUPPLIER CONTACT`**  
> **`NO FACILITY SELECTION`**  
> **`NO PRODUCTION DEPLOYMENT`**  
> **`HUM-CAP-01 = REQUIRED / NOT GRANTED`** *(original; superseded by additive APPROVED — ASSESSMENT ONLY)*  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`DO NOT CONDUCT THE ASSESSMENT FROM THIS FILE`**  
> **`DO NOT COLLECT NEW INFRASTRUCTURE MEASUREMENTS FROM THIS FILE`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Business zero-loss ≠ technical RPO=0`**  
> **`Stage 0 = CURRENT`** · **`Stage 1 = NOT APPROVED / NOT COMPLETE`** · **`Stage 2 = NOT AUTHORIZED`**  
> **`E1-B = PAUSED`** · **`0 / 0 / 0`**  
> **`E1 = NOT APPROVED / BLOCKED`** · **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`** · **`Gate C = OPEN`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Specification (what to measure):** [`adr-0006-e1-c-capacity-and-facility-assessment-specification.md`](adr-0006-e1-c-capacity-and-facility-assessment-specification.md).  
**This package (how to perform and record, once authorized):** executable protocol only.

IDs below **reuse** CAP-01–CAP-16, PG-01–PG-13, DOC-01–DOC-08, NET-01–NET-09, BKP-01–BKP-08, OPS-01–OPS-07, FAC-01–FAC-24, RV-01–RV-14, HUM-CAP-01–HUM-CAP-17. No new requirement IDs invented except gates **HUM-CAP-01** (already specified) and **CAP-GATE-01** (completion gate). Workstream codes **WS-A–WS-I** are execution grouping only.

**Sequence (do not collapse):**  
Assessment specification → **HUM-CAP-01** → assessment execution → evidence validation → Stage 1 infrastructure design → human approval → Stage 2 procurement/preparation.

---

## N. Authorization gate — HUM-CAP-01

| Field | Record |
| --- | --- |
| Gate | **HUM-CAP-01 — Authorization to Conduct Capacity & Facility Assessment** |
| Status | **REQUIRED / NOT GRANTED** |
| Decision owner | **Patrick Makundi**, Owner (PDM). Wet-ink image **not fabricated** |
| Scope if later granted | Labelled Dev/Test capacity tests; **separately listed** candidate-site surveys; collection of occupancy/legal documents already in company custody; recording results in this package’s registers |
| Permitted (only after grant + written scope) | Measurements in an **explicitly authorized environment**; internal document review; filling evidence rows with real artefacts |
| Prohibited (now and unless a later grant says otherwise) | Supplier/facility contact; RFI send; procurement; facility/hardware/cloud/IdP/email/event/monitoring/backup **selection**; Production deploy/migrate; Production data; unscoped load tests; inventing numbers |
| Evidence required to grant | Dated owner decision stating scope, environment label, duration, and named assessor (**NOT ESTABLISHED** until recorded) |
| Approval date | **N/A — NOT GRANTED** |
| Expiry / review date | **N/A** |
| Exceptions | **None** |

**Actual assessment execution cannot begin until an authorized human decision changes this status.** This file does **not** mark HUM-CAP-01 approved.

---

## O. Completion gate — CAP-GATE-01

| Field | Record |
| --- | --- |
| Gate | **CAP-GATE-01 — Assessment Complete** |
| Status | **NOT COMPLETE** |
| Requires | (1) applicable CAP items assessed (2) PG evidence (3) document-storage evidence (4) network evidence (5) backup/restore evidence (6) facility evidence (7) legal/privacy dependencies identified (8) operational ownership identified (9) TCO inputs identified (10) exceptions documented (11) technical RTO/RPO distinguished from business objectives (12) human decisions recorded |

Completing CAP-GATE-01 **does not** approve Stage 1. Stage 1 still needs a separate human design approval.

---

## C. Assessment workstreams

Default responsible role / reviewer: **NOT ESTABLISHED** until HUM-CAP-01 names them. Owner remains authorization authority. Authorization required for **all** streams: **HUM-CAP-01**.

### WORKSTREAM A — Application Capacity

| Field | Record |
| --- | --- |
| Objective | Establish labelled workload and compute evidence for CAP-01–CAP-16 |
| Scope | Concurrent users, sessions, peak/sustained RPS, jobs, document ops, growth, peaks, headroom, CPU/memory, latency, scaling **options** |
| Prerequisites | HUM-CAP-01; written test scope; **no Production** unless separately authorized |
| Evidence required | CAP-01–CAP-16 artefacts per specification |
| Measurement method | Business input worksheets + instrumented API/web tests in authorized env |
| Output | Workload model **labelled**; not a BOM |
| Acceptance | Every CAP row has evidence or a written exception; none marked PASS from this package |
| Dependencies | CAP-07/08 business calendar; CAP-09 human headroom |
| Prohibited assumptions | Invented user counts; treating Dev/Test RPS as Production capacity; selecting hardware |

### WORKSTREAM B — PostgreSQL Capacity

| Field | Record |
| --- | --- |
| Objective | Establish PG sizing **inputs** PG-01–PG-13 |
| Scope | Size, growth, connections/pool, CPU/RAM observations, IOPS, TPS, backup/WAL volume, restore duration, replication **options** |
| Prerequisites | HUM-CAP-01; labelled PostgreSQL instance (**not** Production SoR — none exists) |
| Evidence required | PG-01–PG-13; restore tests cross-ref RV-01, RV-03, RV-12 |
| Measurement method | `pg_*` catalogues, wait events, clocked restore to a **clean labelled** instance |
| Output | Sizing inputs; **not** server SKUs |
| Acceptance | Production vs Dev/Test labels honest |
| Dependencies | PITR adoption HUM-CAP-08; HA HUM-CAP-09 |
| Prohibited assumptions | Local/dev PG **does not** establish Production PostgreSQL capacity; no prescribed specs |

### WORKSTREAM C — Document Storage

| Field | Record |
| --- | --- |
| Objective | Establish DOC-01–DOC-08 |
| Scope | Count, volume, growth, sizes, throughput, checksum, retention, backup/recovery volume/time |
| Prerequisites | HUM-CAP-01; `DocumentStorage` port unchanged |
| Evidence required | DOC-* ; RV-04 |
| Measurement method | SoR metadata + labelled store inventory; SHA-256 on restore |
| Output | Volume/growth model |
| Acceptance | LocalFs labelled **DEV/TEST ONLY** |
| Dependencies | E-13 retention HUM-CAP / legal |
| Prohibited assumptions | Selecting Production object store; treating LocalFs as Production durability |

### WORKSTREAM D — Network Capacity

| Field | Record |
| --- | --- |
| Objective | NET-01–NET-09 |
| Scope | Bandwidth, latency, packet loss where relevant, throughput, redundancy, internal capacity, admin/VPN, TLS, reverse proxy, segmentation |
| Prerequisites | HUM-CAP-01; candidate path **if** site survey later authorized — **no site selected now** |
| Evidence required | NET-* |
| Measurement method | Circuit evidence / labelled iperf-class tests **after** authorization; no invented IPs/VLANs/providers |
| Output | Connectivity requirements paper |
| Acceptance | No invented topology |
| Dependencies | FAC-10, FAC-11 |
| Prohibited assumptions | Invented IPs, VLANs, ISPs, or Production public exposure of Dev |

### WORKSTREAM E — Backup / Restore / DR

| Field | Record |
| --- | --- |
| Objective | BKP-01–BKP-08 and RV-01–RV-14 sequence |
| Scope | Volumes, frequency, retention, off-site, restore throughput/time/validation, dependencies, failover **only if topology later selected** |
| Prerequisites | HUM-CAP-01; labelled backup target |
| Evidence required | BKP-* + RV-* |
| Measurement method | §J sequence |
| Output | Recovery evidence pack **labelled** |
| Acceptance | No claim of achieved technical RTO/RPO, HA, PITR, or zero-loss architecture |
| Dependencies | FAC-21; HUM-CAP-07/08/09 |
| Prohibited assumptions | Lab timings as Production RTO/RPO; business zero-loss = RPO=0 |

### WORKSTREAM F — Operations / Observability

| Field | Record |
| --- | --- |
| Objective | OPS-01–OPS-07 |
| Scope | Metrics, logs, alerting, telemetry storage/retention, operational access, on-call |
| Prerequisites | HUM-CAP-01; HUM-08 roster still **NOT ESTABLISHED** |
| Evidence required | OPS-* |
| Measurement method | Catalogue + volume estimate from labelled logs; no product selection |
| Output | Ops evidence catalogue |
| Acceptance | Products remain **UNSELECTED** |
| Dependencies | HUM-CAP-06, HUM-CAP-14 |
| Prohibited assumptions | Invented on-call names; CloudWatch/Azure Monitor/GCP as selected |

### WORKSTREAM G — Facility / Physical Infrastructure

| Field | Record |
| --- | --- |
| Objective | FAC-01–FAC-24 worksheet |
| Scope | Physical/environmental/power/connectivity/occupancy — **NO SITE SELECTED** |
| Prerequisites | HUM-CAP-01 **and** written permission to attend a **named** candidate **if** later decided; this package names **none** |
| Evidence required | FAC-* |
| Measurement method | §K worksheet |
| Output | Site file(s) if a candidate is later authorized — empty now |
| Acceptance | No recommendation/ranking |
| Dependencies | HUM-CAP-01, HUM-CAP-02, legal WS-H |
| Prohibited assumptions | Selecting/recommending a facility; contacting sites from Cursor |

### WORKSTREAM H — Legal / Privacy / Site Dependencies

| Field | Record |
| --- | --- |
| Objective | Identify unresolved legal/privacy/site items — **no new legal conclusions** |
| Scope | §L checklist |
| Prerequisites | Existing Legal Counsel facts only (THOMAS NGULUMA = Legal Counsel only) |
| Evidence required | Entity, PDPC, DPO appointment, PDPA/residency, occupancy, retention, IR, insurance |
| Measurement method | Document presence check; gaps labelled **LEGAL REVIEW REQUIRED** |
| Output | Dependency checklist |
| Acceptance | No fabricated compliance |
| Dependencies | FAC-17–FAC-20; HUM-CAP-15 |
| Prohibited assumptions | Statutory compliance; Combined Legal/DPO complete |

### WORKSTREAM I — TCO Inputs

| Field | Record |
| --- | --- |
| Objective | Category list for later costing — **no prices** |
| Scope | §M |
| Prerequisites | None for listing; quotes **forbidden** until procurement authorized |
| Evidence required | PRICE / INPUT REQUIRED rows |
| Measurement method | Category completeness only |
| Output | Empty TCO input register |
| Acceptance | HUM-09 TCO-first / budget not fixed |
| Dependencies | Sizing from WS-A–G **after** assessment |
| Prohibited assumptions | Vendor quotes, approved budget, invented TZS/USD |

---

## D. Controlled assessment register

Common columns for every row: **status = NOT AUTHORIZED / NOT ASSESSED**; evidence location **N/A**; assessor **NOT ESTABLISHED**; reviewer **NOT ESTABLISHED**; assessment date **N/A**; validation date **N/A**; exception **none**; decision required as noted. **Do not mark PASS.**

Prerequisite for all execution: **HUM-CAP-01**.

### CAP-01–CAP-16 (WS-A)

| ID | Family | Requirement (short) | Method | Decision required |
| --- | --- | --- | --- | --- |
| CAP-01 | CAP | Concurrent users | Business worksheet | HUM-CAP-16 related |
| CAP-02 | CAP | Authenticated sessions | Labelled session model | — |
| CAP-03 | CAP | Peak request rate | Labelled load test | Test safety §F |
| CAP-04 | CAP | Sustained request rate | Windowed test | §F |
| CAP-05 | CAP | Background jobs | Job catalogue | — |
| CAP-06 | CAP | Document operations | Op rate | WS-C |
| CAP-07 | CAP | MICE/commercial growth | Owner assumption | Business |
| CAP-08 | CAP | Peak-period assumptions | Calendar | Business |
| CAP-09 | CAP | Headroom | Owner decision | **HUM-CAP-16** |
| CAP-10 | CAP | CPU utilization | Load test | §F |
| CAP-11 | CAP | Memory utilization | Load test | §F |
| CAP-12 | CAP | Process/thread limits | Saturation | §F |
| CAP-13 | CAP | Response time | p50/p95/p99 Commercial-first | §F |
| CAP-14 | CAP | Peak vs sustained | CAP-03 vs CAP-04 | §F |
| CAP-15 | CAP | H/V scaling options | Options paper — not product selection | HUM-CAP-09 related |
| CAP-16 | CAP | Compute redundancy options | Options paper | **HUM-CAP-09** |

### PG-01–PG-13 (WS-B)

| ID | Family | Requirement (short) | Method | Cross-ref |
| --- | --- | --- | --- | --- |
| PG-01 | PG | Database size | Labelled `pg_database_size` | — |
| PG-02 | PG | Growth rate | Series + CAP-07 | CAP-07 |
| PG-03 | PG | Connection count | `numbackends` | — |
| PG-04 | PG | Pool requirements | From PG-03 + CAP-09 | CAP-09 |
| PG-05 | PG | DB CPU | Load test | §F |
| PG-06 | PG | DB RAM observations | Not approved Production GUCs | — |
| PG-07 | PG | Storage IOPS/latency | iostat / waits | — |
| PG-08 | PG | Transaction volume | TPS | — |
| PG-09 | PG | Backup volume | Dump/basebackup size | **RV-01**, BKP-01 |
| PG-10 | PG | WAL volume | If PITR adopted | **HUM-CAP-08**, RV-02 |
| PG-11 | PG | Retention | E-13 | Legal |
| PG-12 | PG | Restore duration | Clocked restore | **RV-03**, RV-08, BKP-06 |
| PG-13 | PG | Replication/HA options | Options paper | **HUM-CAP-09** |

### DOC-01–DOC-08 (WS-C)

| ID | Family | Requirement (short) | Method | Cross-ref |
| --- | --- | --- | --- | --- |
| DOC-01 | DOC | Current volume | Labelled inventory | LocalFs **DEV/TEST ONLY** |
| DOC-02 | DOC | Annual growth | DOC-01 × CAP-07 | CAP-07 |
| DOC-03 | DOC | Avg/max file size | SoR metadata | — |
| DOC-04 | DOC | Upload/download volume | CAP-06 × sizes | CAP-06 |
| DOC-05 | DOC | Checksum (SHA-256) | `stat` + restore verify | **RV-04** |
| DOC-06 | DOC | Retention | E-13 | Legal |
| DOC-07 | DOC | Backup implications | Bytes with metadata | BKP-01 |
| DOC-08 | DOC | Recovery implications | Restore time | **RV-04**, BKP-06 |

### NET-01–NET-09 (WS-D)

| ID | Family | Requirement (short) | Method | Cross-ref |
| --- | --- | --- | --- | --- |
| NET-01 | NET | Internet bandwidth | Circuit evidence after auth | FAC-10 |
| NET-02 | NET | Latency | Labelled samples | — |
| NET-03 | NET | Upload/download throughput | Throughput test | DOC-04, BKP-05 |
| NET-04 | NET | Redundancy | Path options — **NOT SELECTED** | FAC-11 |
| NET-05 | NET | Internal capacity | Design, no VLAN inventory | — |
| NET-06 | NET | Administrative access | Method options | OPS-06 |
| NET-07 | NET | VPN or equivalent | Product **UNSELECTED** | HUM-CAP-10 related |
| NET-08 | NET | TLS / reverse proxy | Options — **UNSELECTED** | — |
| NET-09 | NET | Segmentation | Design | — |

### BKP-01–BKP-08 (WS-E)

| ID | Family | Requirement (short) | Method | Cross-ref |
| --- | --- | --- | --- | --- |
| BKP-01 | BKP | Backup data volume | PG-09 + DOC-07 | RV-01 |
| BKP-02 | BKP | Backup frequency | RPO **methodology** only | HUM-CAP-07 |
| BKP-03 | BKP | Backup retention | Align PG-11 | Legal |
| BKP-04 | BKP | Off-site / secondary | Location **NOT SELECTED** | FAC-21 |
| BKP-05 | BKP | Restore throughput | Bytes/hour | RV-03 |
| BKP-06 | BKP | Restore time | Clock Commercial-first | **RV-06**, **RV-08** |
| BKP-07 | BKP | Restore validation | App-level checks | **RV-13**, RV-12 |
| BKP-08 | BKP | Recovery dependencies | IdP/DNS/storage/email/secrets | **RV-07** |

### OPS-01–OPS-07 (WS-F)

| ID | Family | Requirement (short) | Method | Decision |
| --- | --- | --- | --- | --- |
| OPS-01 | OPS | Metrics catalogue | List — product **UNSELECTED** | HUM-CAP-14 |
| OPS-02 | OPS | Logs | Volume estimate | — |
| OPS-03 | OPS | Alerting | Catalogue vs S2/EAT | HUM-CAP-06 |
| OPS-04 | OPS | Telemetry storage | Retention × volume | — |
| OPS-05 | OPS | Telemetry retention | E-13 | Legal |
| OPS-06 | OPS | Operational access | Named roles | **HUM-CAP-06** |
| OPS-07 | OPS | On-call | Roster | **HUM-CAP-06** |

### FAC-01–FAC-24 (WS-G) — worksheet columns

Requirement | observation | measurement | evidence | exception | assessor | reviewer | date | follow-up  
All **blank / NOT AUTHORIZED / NOT ASSESSED**. **NO SITE SELECTED.** Do not name candidates.

| ID | Topic (from specification) |
| --- | --- |
| FAC-01 | Physical security |
| FAC-02 | Access control |
| FAC-03 | Environmental controls |
| FAC-04 | Cooling |
| FAC-05 | Power quality |
| FAC-06 | UPS |
| FAC-07 | Generator / backup power |
| FAC-08 | Fire detection / suppression |
| FAC-09 | Water / environmental risk |
| FAC-10 | Connectivity |
| FAC-11 | Internet redundancy |
| FAC-12 | Rack / space |
| FAC-13 | Equipment protection |
| FAC-14 | Maintenance access |
| FAC-15 | Facility monitoring |
| FAC-16 | Physical asset security |
| FAC-17 | Occupancy rights |
| FAC-18 | Ownership / lease documentation |
| FAC-19 | Legal / privacy |
| FAC-20 | Geographic considerations |
| FAC-21 | Secondary backup / DR location |
| FAC-22 | Business continuity |
| FAC-23 | Insurance |
| FAC-24 | Service / maintenance availability |

### RV-01–RV-14 (WS-E sequence)

| ID | Prerequisite | Evidence required | Test method | Expected result | Actual result | Reviewer | Closure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RV-01 | HUM-CAP-01; labelled env | Dated backup + manifest | Portable PG backup | Artefact exists **labelled** | **N/A** | **NOT ESTABLISHED** | **NOT AUTHORIZED / NOT ASSESSED** |
| RV-02 | HUM-CAP-08 if adopting PITR | WAL independent of primary disk | WAL archive proof | Only if adopted | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-03 | RV-01 | Restore to clean instance | Clocked restore | Checksum/row proof | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-04 | RV-03; DocumentStorage | Metadata + bytes round-trip | SHA-256 verify | Match | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-05 | RV-03 | Audit/outbox vs commits | Query after restore | Consistent | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-06 | RV-03–RV-05 | API Commercial-first from SoR | Serve labelled restore | Not process-memory | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-07 | Product choices | IdP/DNS/store/email/secrets | Dependency checklist | Documented | **N/A** | **NOT ESTABLISHED** | Products **UNSELECTED** |
| RV-08 | RV-06 | Clocked RTO | Timed restore+bring-up | Number **labelled**; **not** claimed as Production RTO | **N/A** | **NOT ESTABLISHED** | Technical RTO **NOT DEMONSTRATED** |
| RV-09 | RV-01/RV-02 | Data lost vs backup/PITR | Compute lag | Number **labelled**; **not** RPO=0 from business zero-loss | **N/A** | **NOT ESTABLISHED** | Technical RPO **NOT DEMONSTRATED** |
| RV-10 | DR topology **if selected** | Failover test | Only if topology exists | N/A until selected | **N/A** | **NOT ESTABLISHED** | Topology **UNSELECTED** |
| RV-11 | RV-10 | Failback | Only if RV-10 applies | N/A | **N/A** | **NOT ESTABLISHED** | **UNSELECTED** |
| RV-12 | RV-01 | Backup integrity | Restore probe (job success insufficient) | Probe pass **labelled** | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-13 | RV-03 | Restore integrity | Commercial/docs/audit checks | App-level pass **labelled** | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |
| RV-14 | Any RV run | Evidence capture | Timestamp, role (not invented), env label, hashes | Complete packet | **N/A** | **NOT ESTABLISHED** | **NOT ASSESSED** |

**Do not claim** RTO/RPO achieved, zero-data-loss architecture, HA, PITR, or successful restore unless future independently validated evidence exists.

Coverage count: CAP 16 + PG 13 + DOC 8 + NET 9 + BKP 8 + OPS 7 + FAC 24 + RV 14 = **99** requirement rows, all **NOT AUTHORIZED / NOT ASSESSED**.

---

## E. Evidence collection protocol

When HUM-CAP-01 is later granted, each artefact **must** record:

| Field | Rule |
| --- | --- |
| Evidence ID | Parent ID (e.g. CAP-03) + suffix `-E01` when an artefact exists — **do not mint now** |
| Source | System, file, or person role — not invented names |
| Timestamp/date | Actual capture time + timezone |
| Environment | **DEV/TEST** or **CANDIDATE-SITE** or **PRODUCTION** — Production **does not exist** |
| Measurement method | As specification |
| Raw result | Unedited numbers/logs |
| Interpretation | Separate from raw result |
| Reviewer | Named only if recorded |
| Validation status | COLLECTED / VALIDATED / REJECTED — not PASS for Production |
| Limitations | Representativeness |
| Supporting artifact | Path/hash |
| Retention location | Company custody — **not** invented |

**DEV/TEST evidence** may establish methodology or baseline. It **must not** be represented as Production evidence.

---

## F. Capacity testing safety (future tests only)

| Rule | Requirement |
| --- | --- |
| Authorization | HUM-CAP-01 + written test scope |
| Environment | Explicitly authorized; **avoid Production** unless separately authorized (Production **does not exist**) |
| Scope before execution | Routes, duration, datasets |
| Maximum intensity | Pre-declared cap (RPS/concurrency) |
| Stop conditions | Error-rate, latency, host saturation, data-risk |
| Monitoring | CAP-10–CAP-14 / PG waits during test |
| Rollback / cleanup | Drop test data; no leftover Production-like secrets |
| Test data | Synthetic or authorized anonymized Dev/Test — **no live customer Production data** |
| Results | Protocol §E |
| Representativeness | State whether results **are** or **are not** representative of Production |

**Do not execute any test now.**

---

## G–K. Stream-specific execution notes

**PostgreSQL:** A local/dev PostgreSQL instance **does not** establish Production PostgreSQL capacity. Do not prescribe server specifications.

**Document storage:** LocalFs is **DEV/TEST ONLY**. Do not select a Production document-storage implementation.

**Network:** No IP addresses, VLANs, topology, or network provider may be invented.

**Facility worksheet:** Supports **NO SITE SELECTED** until assessment **and** subsequent human decision (HUM-CAP-02) are complete. Do not name or recommend candidate facilities.

---

## L. Legal / privacy gate (WS-H)

Unresolved items: **LEGAL REVIEW REQUIRED**. **No new legal conclusions.**

| Item | Status |
| --- | --- |
| Entity documentation | E-01 **NOT VERIFIED** — **LEGAL REVIEW REQUIRED** |
| PDPC requirements | HUM-02 **NOT ESTABLISHED** — **LEGAL REVIEW REQUIRED** |
| Formal DPO appointment | Designated Wensley Shirima; appointment evidence **REQUIRED** — **LEGAL REVIEW REQUIRED** |
| Applicable PDPA analysis | Architecture-dependent; no site chosen — **LEGAL REVIEW REQUIRED** |
| Data residency analysis | Preferred TZ **direction** ≠ approved residency — **LEGAL REVIEW REQUIRED** |
| Site/occupancy documentation | **NOT ASSESSED** — **LEGAL REVIEW REQUIRED** |
| Retention policy | E-13 **NOT CLOSED** — **LEGAL REVIEW REQUIRED** |
| Incident-response requirements | E-15 **DRAFT ≠ READY** — **LEGAL REVIEW REQUIRED** |
| Insurance / legal dependencies | FAC-23 **NOT ASSESSED** — **LEGAL REVIEW REQUIRED** |

THOMAS NGULUMA = **LEGAL COUNSEL ONLY**. Combined Legal/DPO = **INCOMPLETE**.

---

## M. TCO input register (WS-I)

**NO BUDGET OR PRICE IS APPROVED.** No vendor quotes. No procurement assumptions. HUM-09 **TCO-FIRST / BUDGET NOT YET FIXED**.

| Category | Status |
| --- | --- |
| Facility | **PRICE / INPUT REQUIRED** |
| Power | **PRICE / INPUT REQUIRED** |
| Cooling | **PRICE / INPUT REQUIRED** |
| Connectivity | **PRICE / INPUT REQUIRED** |
| Hardware | **PRICE / INPUT REQUIRED** |
| Storage | **PRICE / INPUT REQUIRED** |
| Backup | **PRICE / INPUT REQUIRED** |
| DR | **PRICE / INPUT REQUIRED** |
| Security | **PRICE / INPUT REQUIRED** |
| Software / licensing | **PRICE / INPUT REQUIRED** |
| Monitoring | **PRICE / INPUT REQUIRED** |
| Maintenance | **PRICE / INPUT REQUIRED** |
| Personnel | **PRICE / INPUT REQUIRED** |
| Insurance | **PRICE / INPUT REQUIRED** |
| Lifecycle replacement | **PRICE / INPUT REQUIRED** |
| Contingency | **PRICE / INPUT REQUIRED** |

---

## P. Stage 1 transition (unchanged)

Assessment specification → human authorization (**HUM-CAP-01**) → assessment execution → evidence validation → Stage 1 infrastructure design → human approval → Stage 2 procurement/preparation.

Successful assessment **does not** automatically approve Stage 1. Stage 2 remains **NOT AUTHORIZED**.

---

## What this package does not do

Conduct assessment; collect new measurements; contact suppliers/facilities; send RFI; procure; select facility/hardware/cloud; modify application code or migrations; deploy Production; claim technical RTO/RPO; grant HUM-CAP-01; close CAP-GATE-01; commit or push.

**SEDMC is NOT Production Ready.**

---

## Additive — 2026-09-17 HUM-CAP-01 granted (assessment only) and first results

Authorization: [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md).  
Results: [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md).

| Gate | Live status |
| --- | --- |
| HUM-CAP-01 | **APPROVED — ASSESSMENT ONLY** (2026-09-17, Patrick Makundi) |
| CAP-GATE-01 | **NOT COMPLETE** |
| Stage 1 | **NOT APPROVED** |

Historical HUM-CAP-01 **REQUIRED / NOT GRANTED** rows **above are retained**. They are not the live authorization status.

This additive does **not** authorize Stage 1, Stage 2, procurement, facility selection, or Production.
