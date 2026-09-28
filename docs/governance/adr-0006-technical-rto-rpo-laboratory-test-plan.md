# ADR-0006 Technical RTO/RPO Laboratory Test Plan

> **`DRAFT — TECHNICAL RTO/RPO LABORATORY TEST PLAN — NOT PRODUCTION EVIDENCE`**  
> **STAGE: 4B — GATE E2**  
> **STATUS: `LABORATORY EVIDENCE COLLECTED (DEV/TEST) — NOT PRODUCTION PROOF`**  
> **CANONICAL RUN:** `20260915-183034` (2026-09-15 15:30:34Z–15:35:15Z)  
> **EVIDENCE:** [`evidence/e2-lab/runs/20260915-183034/`](evidence/e2-lab/runs/20260915-183034/)  
> **RESULTS REGISTER:** [`adr-0006-technical-rto-rpo-laboratory-results.md`](adr-0006-technical-rto-rpo-laboratory-results.md)

This document defines a **controlled, non-Production laboratory test plan** to determine what technical recovery characteristics can actually be **demonstrated** for EOS. It is **not** laboratory execution, Production evidence, an RPO/RTO achievement claim, ADR-0006 approval, DP-0006 approval, topology selection, provider selection, region selection, or authorization to run tests.

**Gate source:** [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) § Gate E2  
**Business targets:** [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) (Stage 1)  
**IT questions this plan will later inform:** [`adr-0006-legal-it-finance-validation-pack.md`](adr-0006-legal-it-finance-validation-pack.md) B7–B9, B13–B14, B38  
**Architecture class comparison (not ranked here):** [`adr-0006-architecture-decision-package.md`](adr-0006-architecture-decision-package.md)  
**Legal placement (E1 remains open):** [`adr-0006-legal-data-placement-evidence.md`](adr-0006-legal-data-placement-evidence.md)

This document does **not** change Stage 1 / 2 / 3 / 4A decisions, ADR-0006, or DP-0006.

Owner authorization for **isolated Dev/Test laboratory execution** was granted in Stage 4B Execution. That authorization does **not** cover Production, provider/region/topology selection, or ADR-0006 / DP-0006 approval.

**Dev/Test laboratory evidence only. These results do not constitute Production readiness, Production authorization, or Production proof.**

---

# 3. Business targets (carried forward — not converted)

Recorded exactly from Stage 1 Owner-authorized **business** positions. These are **not** proven technical capabilities.

| Item | Authorized business position |
| --- | --- |
| Critical MTD | **<= 3 hours** |
| Critical RTO target | **<= 3 hours** |
| Overall RTO target | **<= 4 hours** |
| Recovery action | **Begins immediately** (commencement of recovery, not instantaneous restoration) |
| Business data-loss tolerance | **Zero tolerated loss of critical business data** |

**Do not convert the business requirement automatically into `RPO = 0`.**

The technical RPO must be established through architecture design, failure-model analysis and controlled testing.

Historical **3-hour RPO** is **superseded**.

Fact pack Section 6 stakeholder-approved RTO/RPO remains **blank**. Architecture 12.3 RTO/RPO remains **PROPOSED / NOT APPROVED**. `<=1h` RTO / `<=15m` RPO remain **NOT PROVEN**.

Critical functions for recovery sequencing (Stage 1; jointly critical): **Commercial/RFP intake** then **Programme Building**. Recovery order remains: 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers.

---

# 4. Current system limitation (Dev/Test inspection)

**The current in-memory Store is not acceptable as the Production system of record.**

Durable **PostgreSQL** is the intended Production SoR unless a later **approved** architecture changes this (**ADR-0003**, accepted for **Development**; **ADR-0017** phased persistence).

This stage does **not** modify the persistence layer.

## What exists today (inspection, not a lab result)

| Layer | Observed Dev/Test state | Production implication |
| --- | --- | --- |
| API read SoR | In-memory `Store` (`apps/api/src/store.ts`) remains authoritative for API reads in Dev/Test (**ADR-0017**) | Process restart **loses** data that was not dual-written to PostgreSQL. **Not** a Production SoR. |
| PostgreSQL | Optional local instance via `infra/compose/dev.yaml` (`postgres:16-alpine`, **dev credentials only**: `eos` / `eos-dev-only`). Schema applied by `npm run migrate -w @sedmc/db` | **Not** Production. **Not** HA. **Not** a selected topology. |
| Dual-write / hydrate | When `EOS_DATABASE_URL` is set, selected modules dual-write and hydrate on startup (I3, I4 outbox, C1 CRM subsets, later dual-write increments). Integration tests gated by `EOS_RUN_PG_TESTS=1` | Dual-write is **not** full Production SoR cutover. Many commercial/ops modules remain in-memory / schema-only. |
| Backup product | **ADR-0011** accepted for Dev/Test as a **BCM evidence register** (job + restore-probe **records**). No `pg_dump`, WAL archive, `pg_basebackup`, replica, or restore toolchain is present in the repository | **No** real copy of PostgreSQL, object storage, or the event store is taken. Production backup **product remains TBD**. |
| Event transport | Default `in-memory-dev` stand-in (**ADR-0004**). I4 operational recovery notes: in-memory store is **not durable**; unpublished outbox must survive restore on the PostgreSQL path | Transport restart behaviour is **not** Production RTO. |
| Identity / secrets | ADR-0013 IdP **OPEN**; ADR-0012 secrets **OPEN** | Dependency-failure tests must use **stand-ins**, not Production IdP/KMS. |
| Compose volumes | Named volumes `eos_pg` and `eos_nats` on a **single** local stack | Single host/volume. No configured replica, WAL archive destination, PITR, or second site. |

## What this means for laboratory design

1. Tests that treat the **in-memory Store** as the durable SoR **cannot** produce Production-class RPO/RTO evidence. They may only document current Dev/Test limitation.
2. Tests that require **backup, WAL/PITR, replication, warm standby, or HA failover** are **`NOT TESTABLE`** on the current compose stack until a **separately authorized** non-Production lab is built. This document does **not** authorize that build.
3. Even after a lab exists, results remain **laboratory results**, not Production-proven results (Gate E2 classification).
4. Synthetic fixtures only. **No live Production PII.**

---

# 5. Failure-mode model

Do **not** claim that every failure mode must achieve zero data loss. The business requirement (zero tolerated loss of **critical business data**) must be **qualified per failure model**. Uncommitted client work, in-flight requests not acknowledged as durable, and logical/operator destruction of the only remaining copy are **not** the same as loss of a committed PostgreSQL transaction.

**Expected RTO / expected RPO** below are **design expectations**, not measurements. Measured values: **`UNKNOWN`** (no test executed).

| ID | What fails | What remains available | Expected recovery mechanism (candidate) | Expected data-loss behavior (design) | Expected RTO (design) | Expected RPO (design) | Evidence required | Zero-loss of committed txn realistic? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | Application **process** failure (crash/kill of API process) | Host, disk, PostgreSQL (if used) remain | Process restart; reconnect to SoR | In-memory-only state is lost. Dual-written / PG-committed data should survive **if** PG is the SoR | Minutes-class **if** SoR is durable and app start is healthy; **UNKNOWN** until measured | **0 for PG-committed** data **if** PG survived; **unbounded** for in-memory-only writes | Restart log; marker survival | **Yes, only for durable committed SoR data.** **No** for in-memory Store. |
| F2 | Application **host** failure | Database host may remain (if separate) | Redeploy/start app on remaining or replacement host; re-point connection | Same as F1 if DB survived; if app+DB co-located, see F4 | Depends on host replacement + app recovery; **UNKNOWN** | Same as F1 if DB survived; otherwise F4/F5 | Host rebuild timeline; app health | Same as F1 **if** DB independent and surviving |
| F3 | Database **process** failure (PostgreSQL crash on surviving storage) | Storage with intact data directory; app host | DB process restart; crash recovery / WAL replay on **same** data directory | Committed txn in PG WAL/data files typically survive crash recovery; uncommitted abort | Minutes-class **if** crash recovery succeeds; **UNKNOWN** | Design: **0 for committed** on surviving storage; **not** 0 if data directory destroyed | PG logs; marker survival after restart | **Yes, if data directory intact.** **No** if storage is also lost. |
| F4 | Database **host** failure | App may remain; local DB storage on that host is gone unless replicated/backed up | Failover to replica **or** restore from backup/PITR | Loss = data not on surviving replica/backup | Replica failover: potentially minutes; backup restore: may be hours — **may miss <=3h** — **REQUIRES TEST** | Sync replica: design near-0 **if** sync set survives. Async: **lag > 0**. Backup-only: **since last backup/WAL** | Failover or restore logs; lag at failure | **Only** if a surviving **synchronous** copy exists. **Not** backup-only. **Not** async lag. |
| F5 | **Storage** failure (volume/disk corruption or loss) | Compute may remain | Restore from backup/PITR and/or promote replica on **other** storage | Same class as F4; also risk of backup media on same storage | Same as F4; shared-storage designs can fail both | Same as F4; **cannot** be 0 without independent copy | Independent backup/replica location proof | **No** without independent copy. Same-volume snapshots do **not** count. |
| F6 | Availability-zone / **failure-domain** loss | Other AZ/domain **if** designed | HA failover across domains | Sync vs async across AZ determines loss | Design: should be inside <=3h **if** HA is real; **UNKNOWN** | Sync: design near-0 committed; async: lag | Multi-domain lab; not single compose host | **Only** with sync replica in surviving domain |
| F7 | **Backup corruption / unavailability** | Primary may still be up; recovery path broken | Alternate backup copy, replica, or rebuild | If primary then fails, recovery may be impossible or older | RTO may become **unbounded** | RPO may become **last known good copy** or **total loss** | Dual backup; restore-probe (ADR-0011 intent) | **No** — this mode **destroys** the recovery guarantee |
| F8 | **Accidental data deletion** (DROP/TRUNCATE/DELETE of business rows) | Infrastructure up; **wrong** data | PITR to time before deletion **or** restore + selective repair | PITR **chooses** a point; writes after that point are discarded by design | Hours possible; **UNKNOWN** | **Not 0** — recovery point is **before** the deletion; later valid writes may also be undone | PITR to marker-before-delete; integrity | **No** as a “zero loss of all later writes.” Goal is **controlled rollback**, not RPO 0 |
| F9 | **Logical data corruption** (bad write, ransomware-style encryption of logical rows, application bug) | Infrastructure may look healthy | PITR / backup restore to last known good; **replicas often replicate the corruption** | Sync/async replicas **do not** protect against logical corruption | May exceed <=3h if investigation is long | Last known-good backup/PITR; **not** 0 from replication | Integrity checks; delayed replica **candidate** (not selected) | **No** via HA replication. Backup/PITR/delay are the candidate protections |
| F10 | **Network partition** (app cannot reach DB; or primary cannot reach replica) | Split components | Fail-closed writes; avoid split-brain; restore quorum | Risk of **acknowledged writes on isolated primary** vs replica promotion | Detection + decision time dominates | Can be **> 0** if isolated primary accepted commits that the surviving copy lacks | Fencing; connection errors; no dual-primary | **No** unqualified. Fail-closed can protect; split-brain can **duplicate or lose** |
| F11 | **Primary database failure** (process+role; storage may or may not survive) | Standby/backup **if** present | Controlled or automated failover **or** restore | See T3–T6 vs T1–T2 | See topologies T1–T6 | See topologies T1–T6 | LAB-03 / LAB-04 / LAB-05 | Depends on topology — **not** universal 0 |
| F12 | **Regional / site** failure | Other region/site **only if** designed and legally placeable | DR promote / warm standby / restore in second site | Async geo typically **RPO > 0**; geo-sync costly/latency; Legal E1 **OPEN** | Often worse than AZ failover; **UNKNOWN**; must still be judged vs <=3h/<=4h | Geo lag or last replicated/WAL shipped byte | LAB-10; Legal LE-09/LE-10 still open | **Generally no** for async geo. Sync geo **not assumed** |
| F13 | **Dependency** failure (IdP, DNS, object storage, email, secrets, NATS stand-in) | App/DB may be up but function unusable | Restore or fail over that dependency; manual workaround **does not** count as technical RTO success unless pre-agreed | Data in SoR may be intact while **function** is down — RTO clock **continues** | Must include dependency recovery in RTO (Section 10) | Data RPO may be 0 while **business function** is down | LAB-11 with stand-ins | Data durability ≠ function recovery |
| F14 | **Operator / configuration** error (wrong restore target, bad failover, dropped replica, bad `archive_command`) | Varies | Runbook, rollback, break-glass | Can **cause** F7/F8/F10 | Human time; may miss RTO | Can be total if operator destroys remaining copy | Change control; LAB-12 failback | **No** — this is a leading cause of recovery failure |

**Summary — which models can realistically provide zero loss of committed PostgreSQL transactions:**

- **Can (under stated assumptions):** F1 (PG survived), F3 (data directory survived), F4/F6/F11 **only** with a surviving **synchronous** copy and no split-brain.
- **Cannot as an unqualified property:** F5 (no independent copy), F7, F8, F9, F10 (unfenced), F12 (typical async geo), F13 (function vs data), F14, in-memory Store, backup-only interval after last copy.

---

# 6. Recovery topologies to evaluate (laboratory candidates — **not selected**)

None of T1–T6 is a Production topology. Restore-from-backup remains a desired **capability**, not an approved architecture (Stage 1). Warm standby remains **not selected**.

| ID | Architecture (lab sketch) | Dependencies | Expected RPO (design) | Expected RTO (design) | Complexity | Cost implications (qualitative) | Failure limitations | Test method | Evidence produced |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | **Backup + restore** (periodic full/incremental backup; restore to empty or replacement instance) | Backup job, encryption, isolated restore host, runbook | **Time since last successful backup** (and any unsaved WAL). Daily 19:00 EAT **alone cannot** bound loss to zero between backups | Restore + verify + app re-point; **may miss <=3h** | Lower than HA | Backup storage + restore compute; lower than always-on replica | F7, F8/F9 only to last backup; F4/F12 slow; F1/F3 better served by restart than restore | LAB-01 | Restore log; marker delta; duration |
| T2 | **Backup + WAL / PITR** | WAL archive independent of primary disk; `restore_command`; PITR lab | Last **archived** WAL record; still **not automatically 0** (archive lag, unarchived WAL) | Restore base + replay WAL; may be faster or slower than T1 depending on volume | Medium | Archive storage + operational skill | F9/F8: PITR to before event; F7 if archive corrupt; F12 if archive in same site | LAB-02 | WAL manifests; recovery target; marker |
| T3 | **PostgreSQL synchronous replication** | Sync standby in **independent** failure domain; fencing | Design: **0 for committed** txn in the sync set **if** standby survived | Failover + app re-point; should be designed inside <=3h | High (latency, stall on replica loss) | Extra instance + network; sync penalty | F9 replicated; F10 split-brain risk; geo-sync may be impractical; Legal placement of replica **OPEN** | LAB-04 | Sync commit proof; failover time; no lost marker |
| T4 | **PostgreSQL asynchronous geographic replication** | Second site/region replica; lag monitoring | **> 0** under primary loss = **replay lag at failure** | Promotion can be fast; **RPO is the tradeoff** | High (lag, conflict, Legal transfer) | Second site; egress; Legal | Conflicts with **unqualified** zero business loss unless lag proven ~0 **and** Owner qualifies the failure model | LAB-05 / LAB-10 | Lag histogram; lost markers |
| T5 | **Warm standby** (running replica + app/config ready to promote) | Replica (sync or async) + standby app/config + DNS/connection string change | Same as underlying replica class (T3 or T4) | Often better RTO than cold restore; **not selected** for Production | High | Near-duplicate runtime cost | Same replica limits; idle standby can **drift** if untested | LAB-06 | Promotion time; config correctness |
| T6 | **HA primary/standby** with automated or **controlled** failover | Patroni/managed HA **or** equivalent **candidate** tooling — **no product selected**; fencing; health checks | Per sync vs async setting | Automated can be faster; **wrong automation can worsen** RPO/RTO (F14) | Highest | HA control plane + extra nodes | Split-brain; flapping; does **not** replace backup for F8/F9 | LAB-03 + LAB-04/05 + LAB-12 | Failover log; failback; integrity |

**Current compose stack default:** none of T1–T6 is implemented. Status for Production: **`NOT SELECTED`**. Lab status: **`NOT TESTABLE`** until a separately authorized lab is provisioned.

---

# 7. Test-case structure (mandatory fields)

Every LAB case uses this structure. **Actual result**, **Pass/Fail**, and measured RTO/RPO must remain **`UNKNOWN` / `NOT EXECUTED`** until a separately authorized run exists. Do **not** invent results.

| Field | Purpose |
| --- | --- |
| Test ID | Stable identifier (LAB-nn) |
| Failure scenario | Maps to F-class |
| Starting state | What is running; SoR; topology candidate |
| Data fixture | Synthetic dataset only |
| Pre-failure transaction marker | Explicit committed marker IDs (Section 9) |
| Failure injection | How failure is created in lab |
| Detection method | How operators/system notice |
| Recovery procedure | Stepwise; includes decision time |
| Recovery completion criterion | Critical function **usable**, not merely process up |
| RTO measurement method | Section 10 clock |
| RPO measurement method | Section 9 markers |
| Data-integrity validation | Section 11 |
| Expected result | Design expectation only |
| Actual result | `UNKNOWN — NOT EXECUTED` |
| Evidence artifact | Path/id once a run exists |
| Pass/Fail | `NOT EXECUTED` (see Section 12 vocabulary for later runs) |
| Limitations | Why this is not Production evidence |

---

# 8. Critical tests

**Shared fixture rules (all LAB cases, when executed later):**

- Environment label: `LAB` / `DEVTEST` — never Production.
- Synthetic tenant and **non-PII** markers (e.g. `MARKER-PRE-BACKUP`, `MARKER-POST-BACKUP`, `MARKER-PRE-FAIL`, `MARKER-INFLIGHT`).
- Prefer a **PostgreSQL-backed lab SoR** for Production-relevant tests. In-memory-only runs may be recorded only as **limitation tests**, not as Production-class evidence.
- Critical-function probe after recovery: **read and write** a Commercial/RFP-class synthetic record **and** a Programme Building-class synthetic record (or the nearest **authorized** synthetic stand-in if those modules are not yet PG-persisted). If the lab SoR cannot hold those modules, the test is **`NOT TESTABLE`** for jointly critical functions — do not substitute an unrelated table and call it PASS against Stage 1.
- **Actual result:** `UNKNOWN — NOT EXECUTED` for every case below.

Workplan mapping: LAB-01↔E2.1/E2.7; LAB-02↔E2.2; LAB-03↔E2.6/E2.1; LAB-04↔E2.3; LAB-05↔E2.4; LAB-06↔E2.5; LAB-07↔E2.8/E2.9; LAB-12↔E2.10.

---

## LAB-01 — Backup restoration

| Field | Content |
| --- | --- |
| Test ID | LAB-01 |
| Failure scenario | F4/F5/F11 with **only** T1 available (primary gone; restore from last backup) |
| Starting state | Lab PostgreSQL with known backup taken **after** `MARKER-PRE-BACKUP`; additional commits `MARKER-POST-BACKUP` **not** in that backup |
| Data fixture | Synthetic business rows + markers |
| Pre-failure transaction marker | `MARKER-PRE-BACKUP` (in backup); `MARKER-POST-BACKUP` (after backup, before failure) |
| Failure injection | Stop primary; destroy or isolate data directory (**lab disk only**) |
| Detection method | Health check / connection failure / operator declare failure **T0** |
| Recovery procedure | Restore backup to new instance; start app; integrity checks; **do not** use Production backups |
| Recovery completion criterion | Critical synthetic functions accept read/write; `MARKER-PRE-BACKUP` present |
| RTO measurement method | T0 → completion criterion (include detection, restore, app, validation) |
| RPO measurement method | Presence/absence of `MARKER-POST-BACKUP` |
| Data-integrity validation | Section 11 |
| Expected result | `MARKER-PRE-BACKUP` restored; `MARKER-POST-BACKUP` **lost** (demonstrates backup-interval RPO); RTO **UNKNOWN** vs <=3h |
| Actual result | pre=True post_present=False probe=True. Measured RTO **8.414 s**. `MARKER-POST-BACKUP` absent. Integrity referential_ok=true. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-01.json` + `backups/lab01.dump` (8332 bytes) |
| Pass/Fail | `PASS` (synthetic PG stand-in criterion). **Not** Stage 1 jointly-critical EOS module recovery. |
| Limitations | Synthetic tables, not EOS Commercial/Programme runtime SoR. One host. Scripted detection. Dev/Test only. ADR-0011 remains a BCM register, not a Production backup product. |

---

## LAB-02 — WAL / PITR restoration

| Field | Content |
| --- | --- |
| Test ID | LAB-02 |
| Failure scenario | F8 or F9 (logical deletion/corruption) **or** F4 with WAL archive surviving |
| Starting state | T2: base backup + continuous WAL archive on **independent** lab storage |
| Data fixture | Markers at t1 (good), t2 (bad write/delete), t3 (after) |
| Pre-failure transaction marker | `MARKER-GOOD`; `MARKER-AFTER-CORRUPT` |
| Failure injection | Delete/corrupt logical rows after `MARKER-GOOD`; WAL continues |
| Detection method | Integrity probe / operator |
| Recovery procedure | PITR to timestamp **after** `MARKER-GOOD` and **before** corruption |
| Recovery completion criterion | `MARKER-GOOD` present; corruption absent; app read/write |
| RTO measurement method | Section 10 |
| RPO measurement method | Last recovered marker vs last committed before PITR target |
| Data-integrity validation | Section 11; **no silent truncation** of WAL replay |
| Expected result | Recovery to chosen time; writes after target **intentionally absent**; technical RPO **not** 0 for post-target commits |
| Actual result | good=True after=False title=`Synthetic RFP MARKER-GOOD`. Measured RTO **7.363 s**. Post-target marker discarded. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-02.json` |
| Pass/Fail | `PASS` (PITR criterion) |
| Limitations | Isolated lab WAL archive (not `infra/compose/dev.yaml`). Single-host. Not a Production WAL product. Dev/Test only. |

---

## LAB-03 — Database primary failure

| Field | Content |
| --- | --- |
| Test ID | LAB-03 |
| Failure scenario | F11 / F3 (primary process or host; specify which in the run record) |
| Starting state | Declare topology used (T1 or T6). **Do not mix** unstated topologies |
| Data fixture | Markers committed on primary |
| Pre-failure transaction marker | `MARKER-PRE-FAIL`; optional in-flight uncommitted |
| Failure injection | `pg_ctl stop` / kill / isolate primary **in lab** |
| Detection method | Health check; error logs; operator T0 |
| Recovery procedure | Per declared topology: restart (F3), restore (T1), or failover (T6) |
| Recovery completion criterion | Writes succeed on recovered primary role; markers per topology |
| RTO / RPO measurement | Sections 9–10 |
| Data-integrity validation | Section 11 |
| Expected result | F3 restart: committed markers survive. T1: post-backup markers lost. T6: per sync/async |
| Actual result | Topology used: F3 process kill. pre=True inflight=False probe=True. Measured RTO **5.310 s**. Measured zero loss of **committed** txns for this F3 model only. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-03.json` |
| Pass/Fail | `PASS` (F3) |
| Limitations | F3 only — not F4 host/storage loss, not HA. Uncommitted MARKER-INFLIGHT absent as expected. Dev/Test only. |

---

## LAB-04 — Synchronous replica failover

| Field | Content |
| --- | --- |
| Test ID | LAB-04 |
| Failure scenario | F4/F6/F11 with T3 (sync standby **survives**) |
| Starting state | Primary + sync standby; independent storage |
| Data fixture | Sync-committed markers |
| Pre-failure transaction marker | `MARKER-SYNC-COMMITTED`; attempt `MARKER-DURING-FAIL` |
| Failure injection | Kill/isolate primary; **do not** kill standby |
| Detection method | Replication lag/role monitor; operator |
| Recovery procedure | Promote standby (controlled); fence old primary; re-point app |
| Recovery completion criterion | App writes on new primary; old primary cannot accept writes |
| RTO / RPO measurement | Confirm `MARKER-SYNC-COMMITTED` present; record any lost acknowledged write |
| Data-integrity validation | No duplicate primary; referential integrity |
| Expected result | Design: **0 loss of sync-committed** txn **if** fencing works. **Not** claimed until measured |
| Actual result | survived=True probe=True. Measured RTO **2.308 s**. Measured zero transaction loss for this sync-promote configuration and failure model. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-04.json` |
| Pass/Fail | `PASS` (lab T3 / F11 process kill) |
| Limitations | Both containers on one Docker Desktop host — not independent AZ/region. No STONITH beyond kill. Legal E1 replica geography still OPEN. No provider selected. Dev/Test only. |

---

## LAB-05 — Asynchronous replica failover

| Field | Content |
| --- | --- |
| Test ID | LAB-05 |
| Failure scenario | F4/F12 with T4; **induce known lag** before failure |
| Starting state | Primary + async replica; measured lag > 0 |
| Data fixture | Burst of commits during lag window |
| Pre-failure transaction marker | `MARKER-REPLICATED`; `MARKER-UNREPLICATED` (committed on primary, not yet on replica) |
| Failure injection | Primary isolated/killed while `MARKER-UNREPLICATED` not on replica |
| Detection method | Lag metric freeze; primary unreachable |
| Recovery procedure | Promote replica; **do not** invent catch-up from dead primary |
| Recovery completion criterion | App usable on promoted replica |
| RTO / RPO measurement | Lost markers = technical RPO for this run |
| Data-integrity validation | Section 11 |
| Expected result | **`MARKER-UNREPLICATED` lost**. Demonstrates async **RPO > 0**. Must **not** be labelled PASS against unqualified zero business loss |
| Actual result | replicated_after=True unreplicated=False probe=True. Measured RTO **6.882 s**. `MARKER-UNREPLICATED` lost. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-05.json` |
| Pass/Fail | `PASS` (demonstrates async RPO > 0; **not** a zero-loss claim) |
| Limitations | Lag induced by stopping replica, not geographic distance. Does not approve geo-DR. Legal E1 still OPEN. Dev/Test only. |

---

## LAB-06 — Warm standby activation

| Field | Content |
| --- | --- |
| Test ID | LAB-06 |
| Failure scenario | F11/F12 with T5 |
| Starting state | Primary serving; warm standby app+DB **running** but not serving clients |
| Data fixture | Same as LAB-04 or LAB-05 depending on replica class **declared in the run** |
| Pre-failure transaction marker | Per replica class |
| Failure injection | Declare primary site down |
| Detection method | Operator decision + health |
| Recovery procedure | Promote DB; switch app/traffic to standby; validate |
| Recovery completion criterion | Critical synthetic functions on standby path |
| RTO / RPO measurement | Include DNS/config/decision; replica lag |
| Data-integrity validation | Section 11 |
| Expected result | RTO better than cold T1 **if** standby is truly warm; RPO = replica class |
| Actual result | marker=True probe=True. Measured RTO **2.280 s**. DB warm standby promoted. EOS application standby process was **not** present. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-06.json` |
| Pass/Fail | `PARTIAL` |
| Limitations | Database warm standby demonstrated. EOS application warm standby **not** present. Warm standby **not selected** for Production. Dev/Test only. |

---

## LAB-07 — Application + database combined recovery

| Field | Content |
| --- | --- |
| Test ID | LAB-07 |
| Failure scenario | F1+F11 or F2+F4 (app **and** DB down together) |
| Starting state | Full lab stack: API, PG (lab SoR), declared topology, **stand-in** IdP/secrets/object as required |
| Data fixture | Markers + outbox rows (I4: unpublished outbox must survive if on PG) |
| Pre-failure transaction marker | Business marker + outbox marker |
| Failure injection | Stop API **and** database together |
| Detection method | Combined health |
| Recovery procedure | Recover DB first (topology), then API hydrate/start, then dependency stand-ins, then probe |
| Recovery completion criterion | Critical function usable; outbox drain behaviour documented (at-least-once / idempotency — **not** silent loss of committed outbox) |
| RTO / RPO measurement | Full stack clock (Section 10) — **not** container restart only |
| Data-integrity validation | App read/write; outbox consistency (I4 operational recovery intent) |
| Expected result | In-memory-only API: data loss. PG SoR: committed data per topology |
| Actual result | pg=True probe=True api_started=True crm_after=`UNEXPECTEDLY_PRESENT`. PG MARKER-COMBO survived F3 (RTO **4.529 s** to PG probe). CRM org remained retrievable — in-memory loss **not** demonstrated (likely npm child process not killed). |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-07.json` + `logs/api-lab07.log` |
| Pass/Fail | `PARTIAL` |
| Limitations | Jointly critical EOS modules are not PG-persisted. CRM witness did not prove memory loss. Not Production RTO. Dev/Test only. |

---

## LAB-08 — Logical corruption recovery

| Field | Content |
| --- | --- |
| Test ID | LAB-08 |
| Failure scenario | F9 |
| Starting state | T2 and/or delayed-backup; **replicas expected to contain the same corruption** if they were streaming |
| Data fixture | Known-good then corrupted rows |
| Pre-failure transaction marker | `MARKER-GOOD` |
| Failure injection | Application or SQL that corrupts committed rows **without** dropping the instance |
| Detection method | Integrity checksum / business probe |
| Recovery procedure | PITR/backup to last known good; **not** failover to sync replica as the primary fix |
| Recovery completion criterion | Good markers; corruption absent |
| RTO / RPO measurement | Investigation time **included** |
| Data-integrity validation | No unexpected duplication from replay |
| Expected result | HA failover **does not** heal logical corruption. PASS only if known-good restore works |
| Actual result | title=`Synthetic RFP MARKER-GOOD` (not LOGICAL-CORRUPT) probe=True. Measured RTO **7.409 s**. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-08.json` |
| Pass/Fail | `PASS` |
| Limitations | Synthetic rows. Demonstrates backup/PITR needed even if T3 exists. Dev/Test only. |

---

## LAB-09 — Accidental deletion recovery

| Field | Content |
| --- | --- |
| Test ID | LAB-09 |
| Failure scenario | F8 |
| Starting state | T2 preferred; T1 fallback |
| Data fixture | Rows then `DELETE`/`TRUNCATE` of synthetic critical table |
| Pre-failure transaction marker | `MARKER-BEFORE-DELETE` |
| Failure injection | Destructive SQL in lab |
| Detection method | Count mismatch / user report simulation |
| Recovery procedure | PITR or restore; document whether later valid writes are sacrificed |
| Recovery completion criterion | Deleted synthetic data restored to chosen point |
| RTO / RPO measurement | Section 9–10 |
| Data-integrity validation | FK integrity after restore |
| Expected result | Recovery **to a point**, not zero loss of all subsequent commits |
| Actual result | present=True rfp restored probe=True. Measured RTO **7.326 s**. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-09.json` |
| Pass/Fail | `PASS` |
| Limitations | Synthetic tables. PITR discards commits after the restore point. Dev/Test only. |

---

## LAB-10 — Regional / site failure simulation

| Field | Content |
| --- | --- |
| Test ID | LAB-10 |
| Failure scenario | F12 |
| Starting state | Two **lab** failure domains (can be two compose projects / two VMs). **Not** a Production region. **Not** a jurisdiction approval |
| Data fixture | Async or sync replica **as declared** |
| Pre-failure transaction marker | Per T4/T5 |
| Failure injection | Isolate entire “site A” network/compute |
| Detection method | Operator declare regional failure T0 |
| Recovery procedure | Activate site B (LAB-05/LAB-06 class) |
| Recovery completion criterion | Critical functions on site B |
| RTO / RPO measurement | Full regional clock |
| Data-integrity validation | Section 11 |
| Expected result | Typically **RPO > 0** if async. Legal E1 still **OPEN** — this test does **not** approve DR geography |
| Actual result | a=True only=False probe=True. Measured RTO **6.986 s**. `MARKER-SITE-A-ONLY` lost. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-10.json` |
| Pass/Fail | `PASS` (F12 simulation on one laptop) |
| Limitations | Two containers on one laptop are not an independent region/facility. Legal E1 DR geography still OPEN. No cloud region selected. Dev/Test only. |

---

## LAB-11 — Dependency failure

| Field | Content |
| --- | --- |
| Test ID | LAB-11 |
| Failure scenario | F13 |
| Starting state | API + lab PG healthy; **one** dependency down (IdP stand-in **or** DNS **or** object storage stub **or** secrets stand-in). ADR-0012/0013 remain OPEN — use **stand-ins only** |
| Data fixture | Markers already in SoR |
| Pre-failure transaction marker | `MARKER-DATA-INTACT` |
| Failure injection | Stop/block that dependency |
| Detection method | Auth failures / upload failures / health |
| Recovery procedure | Restore dependency **or** documented degraded mode; then re-validate critical path |
| Recovery completion criterion | Critical function usable **including** identity/object path that the function needs |
| RTO / RPO measurement | RTO includes dependency; RPO should show data intact if SoR survived |
| Data-integrity validation | No write acknowledged without required SoR durability |
| Expected result | Data RPO may be 0 while **function RTO fails** until dependency returns. Do not report “RTO met” if only the DB is up |
| Actual result | down=True intact=True probe=True. Function unusable while PG stopped (**582 ms** observed until stop confirmed). Measured RTO **3.488 s** after restart. Production IdP/CDN/WAF **NOT TESTABLE**. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-11.json` |
| Pass/Fail | `PARTIAL` |
| Limitations | Only PostgreSQL dependency was present. ADR-0013 IdP OPEN; ADR-0012 secrets OPEN; no CDN/WAF/email/object-store lab. |

---

## LAB-12 — Failback

| Field | Content |
| --- | --- |
| Test ID | LAB-12 |
| Failure scenario | F14 + post-LAB-04/05/06 return to original primary |
| Starting state | After a successful **lab** failover (prerequisite run id `___` when executed) |
| Data fixture | New markers committed **on the promoted** system |
| Pre-failure transaction marker | `MARKER-ON-STANDBY` |
| Failure injection | Planned failback (not a new disaster) |
| Detection method | Operator change window |
| Recovery procedure | Resync original; switch traffic back; fence temporary primary |
| Recovery completion criterion | Original (or designated) primary serving; `MARKER-ON-STANDBY` not lost; no split-brain |
| RTO / RPO measurement | Failback duration is **operational**; must not lose standby-era commits |
| Data-integrity validation | No duplicate keys; counts match |
| Expected result | Failback can **fail** even when failover passed. Record complexity |
| Actual result | before=True standby=True probe=True. Measured RTO **10.104 s**. MARKER-ON-STANDBY survived failback. Replica fenced by stop. |
| Evidence artifact | `docs/governance/evidence/e2-lab/runs/20260915-183034/LAB-12.json` |
| Pass/Fail | `PASS` (scripted failback sequence) |
| Limitations | Manual/scripted failback, not an automated HA product. One host. Dev/Test only. |

---

# 9. RPO measurement

**Definition used in this plan:**

Technical RPO is the maximum amount of accepted **committed** business data that is lost between the last recoverable transaction state and the failure event.

Do **not** report RPO merely as “backup frequency.”

## Marker method

| Step | Record |
| --- | --- |
| 1 | Insert marker row(s) in a **durable** lab SoR table with unique ids and commit timestamps |
| 2 | Confirm durability: transaction **committed** and **acknowledged** to the test client (`COMMIT` success) |
| 3 | Record `last confirmed durable transaction` id + timestamp |
| 4 | Inject failure at `failure timestamp` T_fail |
| 5 | After recovery, query `last recoverable transaction` |
| 6 | `data-loss interval` = T_fail − timestamp of last recoverable committed marker (and/or count of committed markers missing) |
| 7 | Record whether any **acknowledged** (client-visible success) transactions are missing |
| 8 | Record whether **unacknowledged** in-flight work is missing (expected; **not** counted as RPO unless the test previously treated it as durable) |

## What to measure (per run)

| Measurement | Value until executed |
| --- | --- |
| Last confirmed durable transaction | `UNKNOWN` |
| Failure timestamp | `UNKNOWN` |
| Last recoverable transaction | `UNKNOWN` |
| Data-loss interval | `UNKNOWN` |
| Transactions acknowledged before failure that did not survive | `UNKNOWN` |
| Transactions that survive recovery | `UNKNOWN` |
| Replica lag at T_fail (if applicable) | `UNKNOWN` |
| Last successful backup/WAL archive time (if applicable) | `UNKNOWN` |

**In-memory Store:** a successful HTTP 200 that only mutated memory is **not** a durable committed transaction for Production-class RPO.

**Business overlay:** zero tolerated **business** loss remains the Stage 1 requirement. A measured technical RPO > 0 under a stated failure model is a **qualification input** for Owner/IT (workplan Q3). It is **not** automatic acceptance and **not** `RPO = 0`.

---

# 10. RTO measurement

**Definition used in this plan:**

RTO is measured from the **declared failure event (T0)** to the moment the **critical business function is demonstrably usable again** (read **and** write probe success on jointly critical synthetic paths).

Do **not** measure only container/process restart time.

## Clock components (record each; sum is the lab RTO)

| Component | Include? |
| --- | --- |
| Detection | Yes — how T0 is known |
| Decision | Yes — operator choose restore vs failover |
| Failover | Yes — if topology uses it |
| Database recovery | Yes — crash recovery, restore, promote, WAL replay |
| Application recovery | Yes — start, hydrate, config, connection pool |
| Dependency recovery | Yes — IdP/secrets/object/DNS stand-ins required by the function |
| Validation | Yes — integrity + business probe |
| Operator intervention | Yes — human time is in the clock |

**Recovery action begins immediately** (Stage 1) means the **start** of this clock’s response, not that RTO is zero.

Compare lab RTO to **<= 3 hours** (critical) and **<= 4 hours** (overall) only as **laboratory** comparison. Do **not** declare Production RTO achieved.

Until executed: measured RTO = **`UNKNOWN`**.

---

# 11. Data integrity

Each **successful** recovery (when tests are later authorized) must validate:

| Check | Method (lab) |
| --- | --- |
| Transaction markers | All expected markers present; unexpected markers absent |
| Record counts | Pre-failure counts vs post-recovery (adjusted for intended PITR point) |
| Referential integrity | FK checks / application-level parent-child |
| Expected business records | Synthetic Commercial + Programme Building stand-ins (or `NOT TESTABLE`) |
| No unexpected duplication | Unique keys; outbox event ids |
| No silent truncation | WAL replay completes; restore size/checksum vs manifest |
| Application read/write behavior | GET + mutating probe after recovery |
| Audit/log consistency where applicable | Outbox/audit rows not silently dropped if they were in the SoR |

Failure of integrity = **FAIL** even if the process is “up.”

---

# 12. Success criteria (result classification)

Never convert theoretical capability into **PASS**.

| Label | Meaning |
| --- | --- |
| **PASS** | Measured result satisfies the **test’s predefined** criterion (not “vendor docs say so”) |
| **PARTIAL** | Recovery works but one or more requirements are not satisfied (e.g. restored but RTO > 3h; or RTO met but markers lost) |
| **FAIL** | Recovery cannot restore the required function/data |
| **NOT TESTABLE** | Environment lacks the required capability (current default for T2–T6 and for jointly critical PG SoR) |
| **UNKNOWN** | Evidence is insufficient |
| **NOT EXECUTED** | Planning only — **current status of all LAB-01–LAB-12** |

Gate E2 workplan classes remain in force when a run exists:

| Workplan class | Use |
| --- | --- |
| Theoretical capability | Literature/vendor — **not** PASS |
| Design expectation | Intended behaviour of T1–T6 — **not** PASS |
| Laboratory result | Timed, repeatable **non-Production** measurement |
| Production-proven result | **Out of scope** for this gate |

---

# 13. Production evidence boundary

**Laboratory results do not constitute Production evidence.**

A successful Dev/Test experiment does **not** authorize:

- Production implementation
- Production migration
- Production deployment
- Production failover
- Production backup configuration

Before Production, the **selected** architecture (none is selected now) must be implemented and tested in the **authorized Production environment** under the applicable governance gates.

ADR-0011 Production backup product remains **TBD**. Architecture 12.3 remains **PROPOSED / NOT APPROVED**.

---

# 14. RPO/RTO decision table

Measured RPO/RTO below are **laboratory observations** from run `20260915-183034`. Production suitability remains **`NOT SELECTED`**.

| Topology | Failure model | Expected RPO (design) | Measured RPO | Expected RTO (design) | Measured RTO | Data integrity | Operational complexity | Production suitability | Evidence status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 backup + restore | F4/F5/F11 data-dir destroy | Since last backup | `MARKER-POST-BACKUP` lost (LAB-01) | Restore window; may miss <=3h | **8.414 s** lab | referential_ok | Lower | NOT SELECTED | DEMONSTRATED (lab) |
| T1 | F8/F9 | Last backup only | Not separately run as T1-only; T2 used | Same | — | — | Lower | NOT SELECTED | NOT TESTED as T1-only for F8/F9 |
| T2 backup + WAL/PITR | F8/F9/F4 | PITR target | Post-target commits discarded (LAB-02/08/09) | Base + replay | **7.363–7.409 s** lab | referential_ok | Medium | NOT SELECTED | DEMONSTRATED (lab) |
| T3 sync replication | F11 process kill, standby survives | Near-0 committed in sync set | Measured zero loss of sync-committed marker (LAB-04) | Failover + re-point | **2.308 s** lab | referential_ok | High | NOT SELECTED | DEMONSTRATED (lab, one host) |
| T3 | F9 logical corruption | Does not protect | N/A (PITR used instead, LAB-08) | N/A as primary fix | **7.409 s** PITR | title restored | High | NOT SELECTED | DEMONSTRATED that replica is not the fix |
| T4 async | F12/F4 induced lag | Lag at failure (> 0) | `MARKER-UNREPLICATED` / `MARKER-SITE-A-ONLY` lost | Promotion | **6.882–6.986 s** lab | referential_ok | High | NOT SELECTED | DEMONSTRATED RPO > 0 |
| T5 warm standby | F11 | Per replica class | Zero loss of MARKER-WARM (sync warm) | Better than cold if warm | **2.280 s** lab DB | referential_ok | High | NOT SELECTED | PARTIALLY DEMONSTRATED (DB only) |
| T6 HA failover | F11 scripted promote | Per sync/async | Per LAB-04/12 | Automated/controlled | **2.308 s** fail-over; **10.104 s** failback | referential_ok | Highest | NOT SELECTED | PARTIALLY DEMONSTRATED (scripted, not a HA product) |
| In-memory Store | F1 | Unbounded | CRM org UNEXPECTEDLY_PRESENT (LAB-07) — loss **not** proven this run | Process restart | API restart inconclusive | — | Low | **NOT ACCEPTABLE as Production SoR** | PARTIAL / inconclusive for memory loss |
| T1–T6 | F7 backup unavailable | Unbounded | UNKNOWN | Unbounded | UNKNOWN | UNKNOWN | — | NOT SELECTED | NOT TESTED |
| T1–T6 | F10 partition | Split-brain dependent | UNKNOWN | Detection + fence | UNKNOWN | UNKNOWN | High | NOT SELECTED | NOT TESTED (LAB-10 used disconnect+kill, not split-brain dual-primary) |
| T1–T6 | F13 dependency | Data may survive | MARKER-DATA-INTACT survived (LAB-11) | Includes dependency | **3.488 s** lab | referential_ok | Medium | NOT SELECTED | PARTIALLY DEMONSTRATED (PG only) |
| T1–T6 | F14 operator error | Can be total | MARKER-ON-STANDBY survived planned failback (LAB-12) | Human | **10.104 s** lab | no duplicate markers | High | NOT SELECTED | PARTIALLY DEMONSTRATED (planned failback only) |

---

# 15. Architecture impact (Options A–D — **not ranked**)

After run `20260915-183034` (still **not ranked**, still **not selected**):

- A hosting class can only receive a **favorable technical assessment** if it can provide, as a service, the **demonstrated** lab capabilities: backup+restore, WAL/PITR, and (if zero committed-loss is required for F4/F11) synchronous replica promote — plus backup/PITR for F8/F9. Async geo was shown to lose committed work under lag.
- Options A–D remain open. Provider evidence (Gate E3) is still required to show the **same** capabilities in a candidate offering.
- Hybrid (D) remains the most mapping-heavy; this lab did not demonstrate split-stack hybrid.

A hosting class should receive a **favorable technical assessment** only if the required recovery behaviour can be **demonstrated or credibly evidenced**. No class is eliminated here. No class is selected here.

| Option | How later lab results would affect assessment |
| --- | --- |
| **A — African managed cloud** | Favorable **technical** note only if a **candidate** (still `CANDIDATE — NOT SELECTED`) can show, in lab or equivalent provider-lab evidence, recovery vs F1–F14 relevant subset: especially T1/T2 restore times vs <=3h/<=4h, and a **qualified** technical RPO (sync vs async). Region still **NOT SELECTED**. Legal E1 still required. |
| **B — EU/EEA managed cloud** | Same technical bar as A. Additionally, geo-distance may worsen T3 latency and T4 lag; LAB-04/LAB-05/LAB-10 become more important. Legal transfer mechanism still required where applicable (Stage 4A). **Not** ranked against A here. |
| **C — Tanzania-controlled hosting** | Same RPO/RTO tests apply. Facility may lack managed HA/PITR; LAB-01–LAB-06 would show whether **self-operated** T1–T6 can meet clocks. Unproven facility ≠ automatic fail; **untested** ≠ pass. |
| **D — Hybrid** | Requires the **most** component-level tests (LAB-07, LAB-11, LAB-10): split SoR vs app vs identity vs backups. Hybrid remains **not the default** (Stage 3). Lab complexity is higher; do not assume hybrid improves RTO. |

Workplan evidence sequence (A then B, C/D kept) is **unchanged** and is **not** an approval.

---

# 16. Evidence artifacts (required when a run is later authorized)

Do **not** generate fake evidence. Until runs exist, each artifact status is **`UNKNOWN` / not obtained**.

| Artifact | Purpose |
| --- | --- |
| Test logs | Command/output of injection and recovery |
| Timestamps | T0, detection, decision, recovered, probe success (clock source stated) |
| Transaction markers | IDs and commit times |
| Backup manifests | What was in the backup (LAB-01) |
| WAL/PITR records | Archive list; recovery target (LAB-02/08/09) |
| Recovery logs | PostgreSQL `recovery` / restore output |
| Failover logs | Promote/fence (LAB-04/05/06/12) |
| Integrity-check output | Counts, FK, probes |
| Screenshots where useful | Optional; not a substitute for logs |
| Measured RTO/RPO | Computed from timestamps + markers |
| Incident/recovery timeline | Ordered events |
| Remediation register | Gaps found; **not** an implementation authorization |

Evidence path used: `docs/governance/evidence/e2-lab/runs/20260915-183034/`.

---

# 17. Lab environment safety

| Control | Requirement |
| --- | --- |
| Scope | **Dev/Test / isolated lab only** |
| Data | **Synthetic / non-Production data only** |
| PII | **No live Production PII** |
| Credentials | Isolated lab credentials; **not** Production |
| Secrets | Non-Production secrets; ADR-0012 Production secrets **OPEN** and unused |
| Identification | Explicit environment name (`LAB`, `DEVTEST`); banners on runbooks |
| Databases | **No connection to Production databases** |
| Backups | **No Production backups**; do not restore Production media into lab or vice versa |
| Failover endpoints | **No Production failover endpoints** |
| Compose | Current `postgres:16-alpine` / `eos-dev-only` is Dev only; do not reuse those passwords in any Production design |
| Network | Lab networks must not be routed to Production |

---

# 18. Test authorization gate

The **plan** in this document is not standing authorization for further runs.

Stage 4B Execution granted Owner authorization for **one isolated Dev/Test laboratory** using synthetic data. That run is `20260915-183034`.

That authorization does **not** cover:

- Production implementation, deployment, migration, failover, backups, or cloud provisioning
- provider / region / Production topology selection
- ADR-0006 or DP-0006 approval
- further laboratory execution unless separately granted

**THIS RUN:** `EXECUTED — 20260915-183034`  
**PRODUCTION / FURTHER LAB:** `NOT AUTHORIZED`

---

# 19. Exit criteria

## Stage 4B **planning** (this document)

Stage 4B **planning** is complete when all of the following are documented (they are):

1. Failure models defined (F1–F14)
2. Topology candidates defined (T1–T6) — **not selected**
3. Test cases defined (LAB-01–LAB-12)
4. RPO methodology defined
5. RTO methodology defined
6. Integrity validation defined
7. Evidence requirements defined
8. Laboratory safety boundaries defined
9. Production evidence boundary defined
10. Separate execution authorization requirement documented

## Gate E2 **closure** (not claimed as Production)

Lab run `20260915-183034` produced measurements for T1–T6 **synthetic PostgreSQL** recovery on one Docker Desktop host. <=3h / <=4h was **demonstrable in that lab** for the tested failure models (measured RTOs were 2.3–10.1 seconds). Technical RPO was **qualified per failure model** (backup-interval loss, PITR point, sync near-zero committed, async > 0).

This does **not** close E2 as Production proof: jointly critical EOS modules remain in-memory; F7/F10 not tested; IdP/CDN/WAF not tested; geography/Legal E1 still OPEN; detection was scripted.

**Current Gate E2 status:** `LABORATORY EVIDENCE COLLECTED (DEV/TEST) — NOT PRODUCTION PROOF`  
**Technical RPO:** **not** declared Production `0`; **not** approved

---

# 20. Governance status

E2:  
`LABORATORY EVIDENCE COLLECTED (DEV/TEST) — NOT PRODUCTION PROOF`

E1:  
`OPEN — REQUIRES LEGAL/DPO VALIDATION` (unchanged)

ADR-0006:  
`PROPOSED — NOT APPROVED`

DP-0006:  
`OPEN — NOT APPROVED`

Provider:  
`NOT SELECTED`

Region:  
`NOT SELECTED`

Topology:  
`NOT SELECTED`

Production:  
`NOT AUTHORIZED`

Deployment:  
`NOT AUTHORIZED`

Migrations:  
`NOT AUTHORIZED`

Implementation:  
`NOT AUTHORIZED`

LAB EXECUTION (this isolated Dev/Test run):  
`EXECUTED — RUN 20260915-183034`

FURTHER LAB / PRODUCTION LAB EXECUTION:  
`NOT AUTHORIZED` unless separately granted

---

## Validation (this test plan after execution)

- Tests LAB-01–LAB-12 were executed in isolated Docker lab `127.0.0.1:55432/55433` using synthetic markers.  
- Reported RPO/RTO values are taken from `runs/20260915-183034/*.json`.  
- No Production data, endpoint, backup, or failover was used.  
- ADR-0006 remains **proposed — blocked for Production**; DP-0006 remains **OPEN**.  
- Application persistence layer, schema migrations, and `infra/compose/dev.yaml` were **not** modified.
