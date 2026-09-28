# E1-C — Capacity and Facility Assessment Results (HUM-CAP-01 session)

> **`ASSESSMENT ONLY`** · **`HUM-CAP-01 = APPROVED — ASSESSMENT ONLY (2026-09-17)`**  
> **`ADDITIVE 2026-09-17: EVIDENCE GAP CLOSURE SPRINT 1 — SEE FOLLOW-UP SECTION`**  
> **`ADDITIVE 2026-09-17: SPRINT 4 OWNER PLANNING BASELINE & PATH B RESTORE — SEE END`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`STAGE 1 = NOT APPROVED`**  
> **`ALL MEASUREMENTS = DEV/TEST ONLY UNLESS STATED EVIDENCE NOT AVAILABLE`**  
> **`NO PRODUCTION EVIDENCE`** · **`NO FACILITY SELECTED`** · **`NO HARDWARE BOM`**  
> **`NO LOAD TEST EXECUTED`** (uncontrolled load testing **not authorized**)  
> **`NO POSTGRESQL INSTANCE REACHABLE THIS SESSION`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Assessment authorization does not constitute Production authorization.`**  
> **`SEDMC is NOT Production Ready.`**

**Assessment date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Authorization:** [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md).  
**Assessor:** repository documentation executor (this session).  
**Reviewer:** **NOT ESTABLISHED** (no independent reviewer named).  
**Independent validation:** **NOT PERFORMED**.

Common fields unless a row overrides: environment **DEV/TEST ONLY** or **N/A**; reviewer **NOT ESTABLISHED**; validation status **COLLECTED — NOT INDEPENDENTLY VALIDATED** or **EVIDENCE NOT AVAILABLE**; exception as stated; decision required as stated.

**Not done this session:** docker/compose start; `psql`; load generation; supplier/facility contact; migrate(); dump/restore drill (PostgreSQL port **not listening**); application-code changes.

---

## Family status (CAP-GATE-01 inputs)

| Family | Status |
| --- | --- |
| CAP-01–CAP-16 | **PARTIALLY COMPLETE** |
| PG-01–PG-13 | **BLOCKED** (Dev/Test PostgreSQL not reachable) / **EVIDENCE REQUIRED** |
| DOC-01–DOC-08 | **PARTIALLY COMPLETE** |
| NET-01–NET-09 | **PARTIALLY COMPLETE** / **EVIDENCE REQUIRED** |
| BKP-01–BKP-08 | **BLOCKED** / **EVIDENCE REQUIRED** |
| OPS-01–OPS-07 | **PARTIALLY COMPLETE** / **HUMAN DECISION REQUIRED** |
| FAC-01–FAC-24 | **EVIDENCE REQUIRED** (`FACILITY ACCESS / THIRD-PARTY INPUT REQUIRED`) |
| RV-01–RV-14 | **NOT ASSESSED** (no authorized reachable test database) |
| Legal/privacy identification | **PARTIALLY COMPLETE** (gaps identified; **LEGAL REVIEW REQUIRED**) |
| TCO inputs | **PARTIALLY COMPLETE** (categories listed; **PRICE INPUT REQUIRED — FUTURE STAGE**) |
| **CAP-GATE-01** | **NOT COMPLETE** |

---

## CAP-01–CAP-16

| ID | Requirement | Env | Source | Method | Raw result | Interpretation | Limitations | Artifact | Status | Exception | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-01 | Concurrent users | N/A | No business census | Inspection of governance | **EVIDENCE NOT AVAILABLE** | Cannot size Production users | 4 Dev bootstrap identities exist in `.env.example` — **not** a user population | — | **EVIDENCE NOT AVAILABLE** | — | **BUSINESS INPUT REQUIRED** |
| CAP-02 | Authenticated sessions | DEV/TEST ONLY | `apps/api/src/app.ts`, `.env.example` | Code/config inspection | TTL **3600 s** (`expiresIn` / `EOS_TOKEN_TTL_SECONDS`) | Session length known; concurrent session **count** unknown | Not live session telemetry | app.ts; .env.example | **COLLECTED — NOT INDEPENDENTLY VALIDATED** | Concurrent count **EVIDENCE NOT AVAILABLE** | Live session count **MEASUREMENT REQUIRED** later |
| CAP-03 | Peak request rate | DEV/TEST ONLY | No load run | Not executed | **EVIDENCE NOT AVAILABLE** | Uncontrolled load testing **not authorized**; no scoped intensity was executed | — | — | **EVIDENCE NOT AVAILABLE** | No scoped load test | HUM-CAP-01 does not authorize uncontrolled load |
| CAP-04 | Sustained request rate | DEV/TEST ONLY | No load run | Not executed | **EVIDENCE NOT AVAILABLE** | Same as CAP-03 | — | — | **EVIDENCE NOT AVAILABLE** | — | Scoped test later |
| CAP-05 | Background jobs | DEV/TEST ONLY | API source | Catalogue | Outbox `publishPendingOutbox`; DLQ SLA digest dispatch (external cron I4.18); allowlist dual-control digest; AI drafts module present | Job **types** identified; frequencies **not** measured in production-like traffic | No live scheduler observed this session | outbox.ts; .env.example comments | **COLLECTED — NOT INDEPENDENTLY VALIDATED** | Cadence **EVIDENCE NOT AVAILABLE** | Ops cadence **HUMAN DECISION REQUIRED** |
| CAP-06 | Document operations | DEV/TEST ONLY | LocalFs inventory | Count files in default temp root | **21** files, **420** bytes total | Residual Dev/Test objects only | Not operational MICE volume | OS temp `serengeti-eos-documents` | **COLLECTED — NOT INDEPENDENTLY VALIDATED** | — | Business volume **REQUIRED** |
| CAP-07 | Growth | N/A | — | — | **EVIDENCE NOT AVAILABLE** | — | — | — | **EVIDENCE NOT AVAILABLE** | — | **BUSINESS INPUT REQUIRED** |
| CAP-08 | Peak periods | N/A | — | — | **EVIDENCE NOT AVAILABLE** | MICE seasonality not recorded as numbers | — | — | **EVIDENCE NOT AVAILABLE** | — | **BUSINESS INPUT REQUIRED** |
| CAP-09 | Headroom | N/A | — | — | **EVIDENCE NOT AVAILABLE** | — | — | — | **HUMAN DECISION REQUIRED** | — | **HUM-CAP-16** |
| CAP-10 | CPU utilization | DEV/TEST ONLY | No load run | Not executed | **EVIDENCE NOT AVAILABLE** | — | Node **v24.19.0** observed on this machine — **not** a CPU sizing result | `node -v` | **EVIDENCE NOT AVAILABLE** | — | Scoped test later |
| CAP-11 | Memory | DEV/TEST ONLY | No load run | Not executed | **EVIDENCE NOT AVAILABLE** | — | — | — | **EVIDENCE NOT AVAILABLE** | — | Scoped test later |
| CAP-12 | Process/thread limits | DEV/TEST ONLY | `createPool` default | Code inspection | Pool default **max=10** | Connection pool cap is a **config default**, not saturation | Not a thread-limit measurement | packages/db/src/index.ts | **COLLECTED — NOT INDEPENDENTLY VALIDATED** | Saturation **EVIDENCE NOT AVAILABLE** | — |
| CAP-13 | Response time | DEV/TEST ONLY | `docs/architecture/c1/performance-baseline.md` | Existing labelled baseline | C1 in-memory CRM: p50 ~0.9–2.6 ms, p95 ~1.3–6.7 ms; n=20; **2026-09-17T00:01:09Z** | **Not** a Production SLA; **not** PG-backed API | Runtime: in-memory CRM store; “PostgreSQL schema-only; CRM API not persisted to PG” | performance-baseline.md | **COLLECTED — NOT INDEPENDENTLY VALIDATED** | Not representative of Production | — |
| CAP-14 | Peak vs sustained | DEV/TEST ONLY | — | — | **EVIDENCE NOT AVAILABLE** | CAP-03/04 missing | — | — | **EVIDENCE NOT AVAILABLE** | — | — |
| CAP-15 | H/V scaling options | N/A | Portability docs | Inspection | Options remain **not selected** | Multiple processes possible later — **not** a design approval | — | portability record | **COLLECTED** as unknown | — | **HUM-CAP-09** |
| CAP-16 | Compute redundancy | N/A | — | — | **EVIDENCE NOT AVAILABLE** as a selected design | N+1 **not** implemented | — | — | **HUMAN DECISION REQUIRED** | — | **HUM-CAP-09** |

---

## PG-01–PG-13

PostgreSQL **16-class** is specified in compose (`postgres:16-alpine`) as **DEV/TEST ONLY**. This session: `127.0.0.1:5432` **TcpTestSucceeded=False**. Configured example URL `postgres://eos:eos-dev-only@127.0.0.1:5432/eos` was **not queried** (unreachable). Compose was **not started** (would be additional environment bring-up beyond recording reachability).

| ID | Requirement | Env | Raw result | Status | Dependency |
| --- | --- | --- | --- | --- | --- |
| PG-01 | Database size | DEV/TEST ONLY | **EVIDENCE NOT AVAILABLE** — instance not listening | **BLOCKED** | Start authorized disposable PG **separately** if owner wants a labelled size |
| PG-02 | Growth rate | N/A | **EVIDENCE NOT AVAILABLE** | **EVIDENCE REQUIRED** | CAP-07 |
| PG-03 | Connections | DEV/TEST ONLY | **EVIDENCE NOT AVAILABLE** live; default pool **max=10** (config) | **PARTIALLY COMPLETE** (config only) | — |
| PG-04 | Pool requirements | DEV/TEST ONLY | Default 10; `EOS_DATABASE_POOL_SIZE` optional | **PARTIALLY COMPLETE** | CAP-09 |
| PG-05 | DB CPU | — | **EVIDENCE NOT AVAILABLE** | **BLOCKED** | PG up |
| PG-06 | DB RAM | — | **EVIDENCE NOT AVAILABLE** | **BLOCKED** | PG up |
| PG-07 | IOPS/latency | — | **EVIDENCE NOT AVAILABLE** | **BLOCKED** | PG up |
| PG-08 | TPS | — | **EVIDENCE NOT AVAILABLE** | **BLOCKED** | PG up |
| PG-09 | Backup volume | — | **EVIDENCE NOT AVAILABLE** | **BLOCKED** | RV-01 |
| PG-10 | WAL volume | — | **EVIDENCE NOT AVAILABLE**; PITR not adopted | **HUMAN DECISION REQUIRED** | HUM-CAP-08 |
| PG-11 | Retention | N/A | E-13 **NOT CLOSED** | **HUMAN DECISION REQUIRED** | Legal |
| PG-12 | Restore duration | — | **EVIDENCE NOT AVAILABLE** this session | **BLOCKED** | RV-03 |
| PG-13 | Replication/HA options | N/A | **NOT IMPLEMENTED**; **NOT SELECTED** | **HUMAN DECISION REQUIRED** | HUM-CAP-09 |

**A local/dev PostgreSQL instance does not establish Production PostgreSQL capacity.** None was reachable.

---

## DOC-01–DOC-08

Environment: **DEV/TEST ONLY**. Kind: `local-fs`. Root this session: OS temp `serengeti-eos-documents` (default when `EOS_DOCUMENT_ROOT` unset). LocalFs **must not** be treated as Production durability.

| ID | Requirement | Raw result | Interpretation | Status |
| --- | --- | --- | --- | --- |
| DOC-01 | Current volume | **21** objects, **420** bytes | Residual test artifacts | **COLLECTED — NOT INDEPENDENTLY VALIDATED** |
| DOC-02 | Annual growth | **EVIDENCE NOT AVAILABLE** | Needs CAP-07 | **EVIDENCE REQUIRED** |
| DOC-03 | Avg/max size | Total 420 / 21 ≈ **20 bytes** average; max **not separately measured** (files not opened to avoid assuming content) | Not MICE document sizes | **PARTIALLY COMPLETE** |
| DOC-04 | Upload/download volume | **EVIDENCE NOT AVAILABLE** (no traffic capture) | — | **EVIDENCE REQUIRED** |
| DOC-05 | SHA-256 | Port `stat` implements checksum; **no restore verification this session** | Requirement defined; Production restore **NOT DEMONSTRATED** | **PARTIALLY COMPLETE** |
| DOC-06 | Retention | E-13 open | — | **HUMAN DECISION REQUIRED** |
| DOC-07 | Backup implications | 420 bytes **DEV/TEST ONLY** | Not Production backup volume | **PARTIALLY COMPLETE** |
| DOC-08 | Recovery | **EVIDENCE NOT AVAILABLE** (no restore) | RV-04 not run | **BLOCKED** |

---

## NET-01–NET-09

No IPs/VLANs/ISPs invented. Dev listen default **127.0.0.1:8080** from `.env.example`.

| ID | Requirement | Raw result | Status |
| --- | --- | --- | --- |
| NET-01 | Internet bandwidth | **EVIDENCE NOT AVAILABLE** | **FACILITY ACCESS / THIRD-PARTY INPUT REQUIRED** |
| NET-02 | Latency | **EVIDENCE NOT AVAILABLE** (no path test to a candidate site — none selected) | **EVIDENCE REQUIRED** |
| NET-03 | Throughput | **EVIDENCE NOT AVAILABLE** | **EVIDENCE REQUIRED** |
| NET-04 | Redundancy | **NOT SELECTED** | **EVIDENCE REQUIRED** |
| NET-05 | Internal capacity | **NOT DESIGNED** | **EVIDENCE REQUIRED** |
| NET-06 | Admin access | Dev isolated localhost; Production admin path **NOT ESTABLISHED** | **HUMAN DECISION REQUIRED** |
| NET-07 | VPN | Product **UNSELECTED** | **HUMAN DECISION REQUIRED** |
| NET-08 | TLS / reverse proxy | Dev DB TLS default **disable**; Production-like requires **require**; certs **UNSELECTED** | **PARTIALLY COMPLETE** (config rule only) |
| NET-09 | Segmentation | **NOT DESIGNED** | **EVIDENCE REQUIRED** |

---

## BKP-01–BKP-08

| ID | Requirement | Raw result | Status |
| --- | --- | --- | --- |
| BKP-01 | Backup volume | **EVIDENCE NOT AVAILABLE** (PG down; docs 420 B Dev/Test only) | **BLOCKED** / **EVIDENCE REQUIRED** |
| BKP-02 | Frequency | **EVIDENCE NOT AVAILABLE** as a chosen design | **HUMAN DECISION REQUIRED** |
| BKP-03 | Retention | E-13 open | **HUMAN DECISION REQUIRED** |
| BKP-04 | Off-site | **NOT SELECTED** | **FACILITY ACCESS / THIRD-PARTY INPUT REQUIRED** |
| BKP-05 | Restore throughput | **EVIDENCE NOT AVAILABLE** | **BLOCKED** |
| BKP-06 | Restore time | **EVIDENCE NOT AVAILABLE** | **BLOCKED** |
| BKP-07 | Restore validation | **EVIDENCE NOT AVAILABLE** | **BLOCKED** |
| BKP-08 | Dependencies | IdP/email/events/secrets/DNS **UNSELECTED** | **COLLECTED** as unknowns |

Harness existence (not executed): `runDisposablePgDumpRestoreDrill` refuses `eos_gateb`; labels **DEV/TEST ONLY**; `productionRtoClaimed=false`. Code inspection **≠** a restore test.

---

## OPS-01–OPS-07

| ID | Requirement | Raw result | Status |
| --- | --- | --- | --- |
| OPS-01 | Metrics | Structured logs + `/health` `/ready`; product **UNSELECTED** | **PARTIALLY COMPLETE** |
| OPS-02 | Logs | JSON logger present; **volume EVIDENCE NOT AVAILABLE** | **PARTIALLY COMPLETE** |
| OPS-03 | Alerting | Dev webhook **DEV/TEST ONLY** | **HUMAN DECISION REQUIRED** |
| OPS-04 | Telemetry storage | **EVIDENCE NOT AVAILABLE** | **EVIDENCE REQUIRED** |
| OPS-05 | Retention | E-13 open | **HUMAN DECISION REQUIRED** |
| OPS-06 | Operational access | **NOT ESTABLISHED** | **HUMAN DECISION REQUIRED** |
| OPS-07 | On-call | **NOT ESTABLISHED** | **HUMAN DECISION REQUIRED** |

---

## FAC-01–FAC-24

**NO SITE SELECTED.** No legitimate physical site access this session. **No supplier contact.** Common fields: env **N/A**; source **none**; method **not executed**; raw result **EVIDENCE NOT AVAILABLE**; interpretation **cannot assess without a candidate site**; limitations **HUM-CAP-01 does not grant access or selection**; artifact **none**; reviewer **NOT ESTABLISHED**; validation **EVIDENCE REQUIRED**; exception **FACILITY ACCESS / THIRD-PARTY INPUT REQUIRED**; decision **HUM-CAP-02 later — not this session**.

| ID | Requirement | Dependency | Status |
| --- | --- | --- | --- |
| FAC-01 | Physical security | Candidate site **NOT SELECTED** | **EVIDENCE REQUIRED** |
| FAC-02 | Access control | Operators **NOT ESTABLISHED** | **EVIDENCE REQUIRED** |
| FAC-03 | Environmental controls | Site | **EVIDENCE REQUIRED** |
| FAC-04 | Cooling | CAP-10 / PG-05 first | **EVIDENCE REQUIRED** |
| FAC-05 | Power quality | Site | **EVIDENCE REQUIRED** |
| FAC-06 | UPS | Sizing | **EVIDENCE REQUIRED** |
| FAC-07 | Generator / backup power | Business ≤3h/≤4h as **design input only** — not demonstrated RTO | **EVIDENCE REQUIRED** |
| FAC-08 | Fire detection / suppression | Site | **EVIDENCE REQUIRED** |
| FAC-09 | Water / environmental risk | Site | **EVIDENCE REQUIRED** |
| FAC-10 | Connectivity | NET-01 | **EVIDENCE REQUIRED** |
| FAC-11 | Internet redundancy | NET-04 | **EVIDENCE REQUIRED** |
| FAC-12 | Rack / space | BOM **NOT INVENTED** | **EVIDENCE REQUIRED** |
| FAC-13 | Equipment protection | Site | **EVIDENCE REQUIRED** |
| FAC-14 | Maintenance access | Windows **NOT DEFINED** | **EVIDENCE REQUIRED** |
| FAC-15 | Facility monitoring | Product **UNSELECTED** | **EVIDENCE REQUIRED** |
| FAC-16 | Physical asset security | Inventory **NOT ESTABLISHED** | **EVIDENCE REQUIRED** |
| FAC-17 | Occupancy rights | Counsel after a candidate exists | **EVIDENCE REQUIRED** / **LEGAL REVIEW REQUIRED** |
| FAC-18 | Ownership / lease documentation | Site | **EVIDENCE REQUIRED** |
| FAC-19 | Legal / privacy | PDPC **NOT ESTABLISHED**; Combined Legal/DPO **INCOMPLETE** | **EVIDENCE REQUIRED** / **LEGAL REVIEW REQUIRED** |
| FAC-20 | Geographic considerations | Tanzania preferred **direction** only; DP-0006 **OPEN** | **EVIDENCE REQUIRED** (location class not a selected architecture) |
| FAC-21 | Secondary backup / DR location | BKP-04; **NOT SELECTED** | **EVIDENCE REQUIRED** |
| FAC-22 | Business continuity | BCM S2 as business constraint; technical RTO **NOT DEMONSTRATED** | **EVIDENCE REQUIRED** |
| FAC-23 | Insurance | Procurement **NOT AUTHORIZED** | **EVIDENCE REQUIRED** |
| FAC-24 | Service / maintenance availability | Do not contact suppliers from this assessment | **EVIDENCE REQUIRED** |

---

## RV-01–RV-14

Authorized disposable PostgreSQL **not reachable** (`127.0.0.1:5432` not listening). **No restore executed.** Common fields: env **N/A**; test date **2026-09-17 (attempted; not run)**; restore duration **EVIDENCE NOT AVAILABLE**; data-integrity validation **NOT PERFORMED**; reviewer **NOT ESTABLISHED**; exception **authorized test environment not present**; technical RTO/RPO **NOT DEMONSTRATED**. Business targets remain ≤3h / ≤4h / zero tolerated loss of **critical business data** — **not** claimed as demonstrated technical RTO/RPO.

| ID | Requirement | Raw result | Status | Dependency |
| --- | --- | --- | --- | --- |
| RV-01 | Dated labelled portable PG backup + manifest | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | Reachable labelled disposable PG |
| RV-02 | WAL archive independent of primary (if PITR adopted) | **EVIDENCE NOT AVAILABLE** — PITR **not adopted** | **NOT ASSESSED** | HUM-CAP-08 |
| RV-03 | Clocked restore to clean instance | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-01 |
| RV-04 | DocumentStorage metadata + SHA-256 round-trip | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-03 |
| RV-05 | Audit/outbox vs commits after restore | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-03 |
| RV-06 | Serve Commercial-first API from restored SoR | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-03–RV-05 |
| RV-07 | Recovery dependency checklist | Products **UNSELECTED** (IdP/DNS/store/email/secrets) | **PARTIALLY COMPLETE** as unknown list | Product selections |
| RV-08 | Clocked labelled restore+bring-up (not Production RTO) | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-06 |
| RV-09 | Data-loss lag vs backup/PITR (not technical RPO=0) | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-01 / RV-02 |
| RV-10 | Failover (only if DR topology selected) | Topology **UNSELECTED** | **NOT ASSESSED** | HUM-CAP-09 |
| RV-11 | Failback | Topology **UNSELECTED** | **NOT ASSESSED** | RV-10 |
| RV-12 | Backup integrity probe (job success insufficient) | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-01 |
| RV-13 | Application-level restore integrity | **EVIDENCE NOT AVAILABLE** | **NOT ASSESSED** | RV-03 |
| RV-14 | Evidence packet (timestamp, role, env label, hashes) | **EVIDENCE NOT AVAILABLE** — no RV run to packetize | **NOT ASSESSED** | Any RV run |

---

## G. Capacity findings (summary)

1. **Observed Dev/Test:** Node v24.19.0; session TTL 3600s; pool default 10; listen 127.0.0.1:8080; local-fs 21 files / 420 bytes; C1 in-memory CRM micro-benchmarks; PG not listening.  
2. **Workload assumptions:** **EVIDENCE NOT AVAILABLE** (users, growth, peaks, headroom).  
3. **Production unknowns:** all Production sizing, HA, PITR, network, facility.  
4. **Measured constraints:** none that bind Production; Dev/Test PG unreachable is a **session** constraint.  
5. **Unmeasured:** CAP-03/04/10/11/14; all live PG stats; bandwidth.  
6. **Growth:** **BUSINESS INPUT REQUIRED**.  
7. **Headroom:** **HUM-CAP-16**.  
8. **Scaling/redundancy:** **HUM-CAP-09**.  
9–12. **PG / docs / net / backup sizing inputs:** see families above — **not** a BOM.

---

## H. Facility findings

Requirements **defined**. Evidence **unavailable**. Exceptions: access/third-party input. No ranking. No recommendation.

---

## I. TCO inputs

No vendor prices, quotations, procurement recommendations, or approved budget. HUM-09 remains **TCO-FIRST / BUDGET NOT YET FIXED**.

| Category | Status |
| --- | --- |
| Facility | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Power | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Cooling | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| UPS | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Generator | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Connectivity | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Hardware | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Storage | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Spare parts | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Maintenance | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Licenses | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Security | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Backup | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| DR | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Monitoring | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Personnel | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Insurance | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Physical security | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Lifecycle replacement | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Disaster recovery | **PRICE INPUT REQUIRED — FUTURE STAGE** |
| Contingency | **PRICE INPUT REQUIRED — FUTURE STAGE** |

---

## L. Legal / privacy (identification only)

| Item | Status |
| --- | --- |
| Entity | **NOT VERIFIED** — **LEGAL REVIEW REQUIRED** |
| PDPC | **NOT ESTABLISHED** — **LEGAL REVIEW REQUIRED** |
| DPO appointment | Designated; formal appointment **REQUIRED** — **LEGAL REVIEW REQUIRED** |
| PDPA / residency / occupancy | No site — **LEGAL REVIEW REQUIRED** |
| Retention / IR / insurance | Open / draft / not assessed — **LEGAL REVIEW REQUIRED** |

No new legal conclusions.

---

## CAP-GATE-01

**NOT COMPLETE.** Conditions 1–6 not fully satisfied; 7 identified; 8 not identified as named ops; 9 categories listed without prices; 10 exceptions recorded; 11 RTO/RPO distinguished; 12 remaining human decisions listed.

**Stage 1:** **NOT APPROVED / NOT COMPLETE.** This file is **ASSESSMENT RESULT**, not **DESIGN DECISION**, not **APPROVAL**.

---

## Safety check (this session)

| Check | Result |
| --- | --- |
| Procurement | **Not performed** |
| Supplier procurement contact | **Not performed** |
| Facility / hardware / cloud selection | **Not performed** |
| Production deployment / migration | **Not performed** |
| Application-code changes for measurement | **Not performed** |
| Migrations executed | **Not performed** |
| Financial commitment | **Not performed** |
| Invented measurements | **Not performed** — gaps recorded **EVIDENCE NOT AVAILABLE** |
| Invented legal conclusions | **Not performed** |
| Unsupported RTO/RPO claims | **Not performed** — technical RTO/RPO **NOT DEMONSTRATED** |
| Dev/Test labelled as Production | **Not performed** |
| Frozen E1-B hashes | **Unchanged** (see verification at recording) |

**Assessment authorization does not constitute Production authorization.**  
**SEDMC remains NOT Production Ready unless a separate Production-readiness gate has been formally approved.**

---

## Additive — 2026-09-17 Evidence Gap Closure Sprint 1

Companion: [`adr-0006-e1-c-evidence-gap-closure-sprint-1.md`](adr-0006-e1-c-evidence-gap-closure-sprint-1.md).  
Historical rows **above are not rewritten**. Original session facts (PG not listening; restore not run; no docker start) remain the HUM-CAP-01 baseline.

**Follow-up timestamp:** 2026-09-17T18:05:11+03:00.  
**Environment for new PG rows:** **DEV/TEST ONLY** (`compose-postgres-1`, `postgres:16-alpine`, database `eos`, fresh volume `compose_eos_pg`).  
**Reviewer / validation:** **NOT ESTABLISHED** / **COLLECTED — NOT INDEPENDENTLY VALIDATED**.  
**Application migrate:** **not executed**. **Restore harness:** **not executed**.

### Family status follow-up (does not replace the original table)

| Family | Original status (preserved) | Follow-up |
| --- | --- | --- |
| CAP-01–CAP-16 | **PARTIALLY COMPLETE** | Planning 500/200/30% cited as **non-authoritative**; CAP-01/07/08 remain **BUSINESS INPUT REQUIRED**; CAP-09 **HUMAN DECISION REQUIRED — HEADROOM** |
| PG-01–PG-13 | **BLOCKED** (not reachable) | Reachability **closed**; idle observations **partial**; restore still **BLOCKED** |
| DOC-01–DOC-08 | **PARTIALLY COMPLETE** | Unchanged this sprint |
| NET-01–NET-09 | **PARTIALLY COMPLETE** / **EVIDENCE REQUIRED** | Unchanged |
| BKP-01–BKP-08 | **BLOCKED** / **EVIDENCE REQUIRED** | Unchanged as executed restore — still **BLOCKED** |
| OPS-01–OPS-07 | **PARTIALLY COMPLETE** / **HUMAN DECISION REQUIRED** | Roster search: **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| FAC-01–FAC-24 | **EVIDENCE REQUIRED** | Unchanged. **FACILITY EVIDENCE CANNOT BE CLOSED WITHOUT A LEGITIMATELY ACCESSIBLE CANDIDATE SITE.** |
| RV-01–RV-14 | **NOT ASSESSED** | Reconciled: **BLOCKED** / **EVIDENCE REQUIRED** / **NOT APPLICABLE — JUSTIFICATION REQUIRED** / **PARTIALLY EVIDENCED** — **no PASS** |
| **CAP-GATE-01** | **NOT COMPLETE** | **NOT COMPLETE** (recalculated; not forced complete) |

### CAP follow-up

| ID | Original | Follow-up result | Source | Limitations |
| --- | --- | --- | --- | --- |
| CAP-01 | **EVIDENCE NOT AVAILABLE** | Planning target **up to 200 concurrent / 500 users** exists as **planning assumption only** | BCM pack Priority 10; E1-B questionnaire | **NOT** approved capacity input. Status remains **BUSINESS INPUT REQUIRED** |
| CAP-07 | **EVIDENCE NOT AVAILABLE** | **~30% annual** modelling assumption only | Same | **BUSINESS INPUT REQUIRED** |
| CAP-08 | **EVIDENCE NOT AVAILABLE** | BCM pack: major seasonal peaks **not specified** | Same | **BUSINESS INPUT REQUIRED** |
| CAP-09 | **HUMAN DECISION REQUIRED** | No approved headroom policy located | Repository search | **HUMAN DECISION REQUIRED — HEADROOM** |

### PG follow-up (DEV/TEST ONLY)

| ID | Original | Follow-up raw result | Status after sprint |
| --- | --- | --- | --- |
| PG-01 | **BLOCKED** not listening | `eos` **7,699,479 bytes** (7519 kB); **0** user relations | **PARTIALLY COMPLETE** — empty Dev/Test catalog size **≠** Production |
| PG-02 | **EVIDENCE REQUIRED** | Unchanged — needs CAP-07 | **EVIDENCE REQUIRED** |
| PG-03 | Config pool 10 only | Live backends **6**; **1** active; `max_connections=100` default | **PARTIALLY COMPLETE** — idle |
| PG-04 | Default pool 10 | Unchanged app default; cluster max 100 observed | **PARTIALLY COMPLETE** |
| PG-05 | **BLOCKED** | No load | **EVIDENCE NOT AVAILABLE** |
| PG-06 | **BLOCKED** | `shared_buffers=128MB`, `work_mem=4MB` (image defaults) | **PARTIALLY COMPLETE** as observation — **not** approved GUCs |
| PG-07 | **BLOCKED** | No IOPS test | **EVIDENCE NOT AVAILABLE** |
| PG-08 | **BLOCKED** | `xact_commit=32` idle | **PARTIALLY EVIDENCED** — not meaningful TPS |
| PG-09 | **BLOCKED** | No dump | **BLOCKED** |
| PG-10 | **HUMAN DECISION REQUIRED** | `wal_level=replica`; `archive_mode=off`; `pg_wal` **16.0M** idle | Observation only; PITR still **HUMAN DECISION REQUIRED** |
| PG-11 | **HUMAN DECISION REQUIRED** | Unchanged E-13 | **HUMAN DECISION REQUIRED** |
| PG-12 | **BLOCKED** | Restore not run | **BLOCKED** |
| PG-13 | **HUMAN DECISION REQUIRED** | Unchanged | **HUMAN DECISION REQUIRED** |

Idle `EXPLAIN ANALYZE SELECT 1`: planning **0.092 ms**, execution **0.050 ms**. **Not** a Production SLA.

### RV follow-up

**RESTORE DRILL BLOCKED — IMPLEMENTATION CHANGE REQUIRED** (`migrate()` inside `runDisposablePgDumpRestoreDrill`).

| ID | Follow-up status |
| --- | --- |
| RV-01 | **EVIDENCE REQUIRED** |
| RV-02 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** (PITR not adopted; `archive_mode=off`) |
| RV-03, RV-04, RV-05, RV-06, RV-08, RV-09, RV-12, RV-13, RV-14 | **BLOCKED** |
| RV-07 | **PARTIALLY EVIDENCED** (unknowns list) |
| RV-10, RV-11 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** (topology **UNSELECTED**) |

### OPS / FAC / legal / validation follow-up

- OPS-06/OPS-07: **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** (HUM-08 other personnel **NOT ESTABLISHED**).
- FAC-01–FAC-24: **EVIDENCE REQUIRED**. No site selected.
- Legal: identification only; **LEGAL REVIEW REQUIRED** / **HUMAN DECISION REQUIRED** as in the sprint file. Combined Legal/DPO **INCOMPLETE**.
- Independent validator: **HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR**.

### CAP-GATE-01 / Stage 1 (recalculated)

**CAP-GATE-01 = NOT COMPLETE.**  
**Stage 1 = NOT APPROVED / NOT COMPLETE.**

No hardware BOM, network topology, facility recommendation, vendor recommendation, or procurement plan.

**Assessment authorization does not constitute Production authorization.**  
**SEDMC remains NOT Production Ready unless a separate Production-readiness gate has been formally approved.**

---

## Additive — 2026-09-17 Sprint 4 owner planning baseline & Path B restore

Companion: [`adr-0006-e1-c-owner-planning-baseline-and-restore-authorization.md`](adr-0006-e1-c-owner-planning-baseline-and-restore-authorization.md).  
Historical rows **above are not rewritten**. Sprint 1 idle-PG and Sprint 2 open-decision text remain the prior baseline.

### Owner planning inputs (not Production evidence)

| Topic | Prior (preserved) | Sprint 4 |
| --- | --- | --- |
| Users | 500 = planning assumption | **100** = **APPROVED PLANNING BASELINE — NOT A MEASURED CURRENT USER CENSUS**. 500 = **PREVIOUS PLANNING ASSUMPTION — SUPERSEDED FOR CURRENT PLANNING BASELINE** |
| Concurrency | 200 = planning assumption | **50** = **OWNER-APPROVED PLANNING INPUT — NOT A TECHNICAL MEASUREMENT** |
| Growth | ~30% modelling | **10%** / **3 years** = **OWNER-APPROVED PLANNING INPUT** |
| Peaks | Not specified | **March–May** (program/proposal); **June–October** (operational delivery) — windows only; rates not invented |
| Accounts | EVIDENCE NOT AVAILABLE | **20** + **15%** / 3y — derived Y3 **30.42** = **DERIVED PLANNING FIGURE** |
| Documents | Dev/Test 21/420 B | Envelope **5,000/year** = **PROVISIONAL INFRASTRUCTURE-PLANNING ENVELOPE**; current census **UNKNOWN** |
| Headroom | HUM-CAP-16 open | **30%** = **OWNER-APPROVED PLANNING POLICY** — **not** demonstrated capacity |
| Ops roster | Names not invented | **Director of Operations** (primary); **Managing Director** (oversight); individual technical seats **OPEN** |
| Validator | NOT ESTABLISHED | **REQUIRED — NOT YET APPOINTED** |
| Restore auth | Path B not granted | **HUM-CAP-RV-01 Path B GRANTED** — disposable Dev/Test `migrate()` only |

### Restore follow-up (DEV/TEST ONLY)

Executed **2026-09-17T18:55:01+03:00**–**18:55:10+03:00** on `compose-postgres-1`. Harness unchanged. Disposable DB `eos_e1d_b5_mu5pnm3r`. Method **sql-logical**. `elapsedMs` **7653**. `ok/dumped/restored/verified=true`. `productionRtoClaimed=false`. Marker tenant `e1d-b5-disp` verified. `eos` left without user relations. Technical Production RTO/RPO **NOT DEMONSTRATED**.

RV follow-up: RV-03 / RV-14 **EVIDENCE COLLECTED** (labelled); RV-01/08/09/12/13 **PARTIALLY EVIDENCED**; RV-04/05/06 **EVIDENCE REQUIRED**; RV-02/10/11 **NOT APPLICABLE — JUSTIFICATION REQUIRED**. **No Production PASS.**

### CAP-GATE-01 / Stage 1 (recalculated after Sprint 4)

**CAP-GATE-01 = NOT COMPLETE** (facility, validator, legal/privacy evidence, Production capacity, Production RTO/RPO, site-dependent network remain open).  
**Stage 1 = NOT APPROVED / NOT COMPLETE.**

**Assessment authorization does not constitute Production authorization.**  
**SEDMC remains NOT Production Ready unless a separate Production-readiness gate has been formally approved.**

---

## Additive — 2026-09-17 Sprint 4 owner-acceptance vocabulary reconciliation

Does **not** rewrite the Sprint 4 execution. Restore **not re-run**. Allowed RV vocabulary applied: RV-01, RV-03, RV-07–09, RV-12–14 **PARTIALLY CLOSED**; RV-04–06 **EVIDENCE REQUIRED**; RV-02/10/11 **NOT APPLICABLE — JUSTIFICATION REQUIRED**. No RV **CLOSED** as Production. Independent validator: **OPEN — HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR**. Facility: **FAC-01–FAC-24 — EVIDENCE REQUIRED** · **FACILITY EVIDENCE BLOCKED — NO AUTHORIZED CANDIDATE SITE**. Users **100** = **OWNER-APPROVED PLANNING BASELINE — NOT A MEASURED CURRENT USER CENSUS**. Headroom **30%** = policy, not demonstrated capacity. **`TECHNICAL PRODUCTION RTO/RPO — NOT DEMONSTRATED`**.

**CAP-GATE-01 — NOT COMPLETE.** **STAGE 1 — NOT APPROVED / NOT COMPLETE.**
