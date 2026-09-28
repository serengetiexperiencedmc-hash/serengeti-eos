# ADR-0006 Technical RTO/RPO Laboratory Results

> **`LABORATORY EVIDENCE — DEV/TEST ONLY — NOT PRODUCTION EVIDENCE`**  
> **RUN ID:** `20260915-183034`  
> **WINDOW:** 2026-09-15 15:30:34Z – 15:35:15Z  
> **OPERATOR/PROCESS:** Stage 4B Execution runner `docs/governance/evidence/e2-lab/run-e2-lab.ps1` (scripted)

**Dev/Test laboratory evidence only. This result does not constitute Production readiness, Production authorization, or Production proof.**

---

# Distinctions (do not collapse)

| Layer | Statement |
| --- | --- |
| **A. Business requirement** | Critical MTD <= 3 h; critical RTO <= 3 h; overall RTO <= 4 h; recovery action begins immediately; **zero tolerated loss of critical business data**. Historical 3-hour RPO remains superseded. |
| **B. Technical target** | **Not approved.** Technical RPO is **not** declared `0`. |
| **C. Laboratory observation** | Measurements in this register from run `20260915-183034`. |
| **D. Architecture implication** | Capabilities a Production class would need to evidence; **not** a selected topology. |
| **E. Production requirement** | Unchanged: ADR-0006 **PROPOSED — NOT APPROVED**; Production **NOT AUTHORIZED**. |

---

# Environment

| Item | Value |
| --- | --- |
| Label | `LAB` / `DEVTEST` |
| Host | Local Docker Desktop (`postgres:16-alpine`), ports **`127.0.0.1:55432`** (primary) and **`127.0.0.1:55433`** (replica) |
| Isolation | **Not** `infra/compose/dev.yaml` volumes (`eos_pg` unused) |
| Data | Synthetic `lab_markers` / `lab_rfp` / `lab_programme` / `lab_outbox` only |
| Production data | None |
| Production credentials / DB / backups / failover | None in process env; none referenced |
| EOS jointly-critical runtime SoR | Still in-memory `Store` (ADR-0017). Synthetic tables are **stand-ins**, not Commercial/Programme Building persistence. |
| Git HEAD at run | `75ee4c3` `master` |
| Cleanup | Lab containers, volumes, and network **removed** after the run |

Safety record: [`evidence/e2-lab/SAFETY.md`](evidence/e2-lab/SAFETY.md)

---

# Result register

Integrity after each recovery (unless noted): referential_ok=true, no duplicate marker_ids, synthetic RFP+Programme probe write succeeded.

| Test | Topology | Failure model | Result | Measured RPO | Measured RTO | Integrity | Evidence | Limitations | Repeatability | Remediation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAB-01 | T1 | F4/F5/F11 data-dir destroy | **PASS** | `MARKER-POST-BACKUP` lost (not zero) | **8.414 s** | OK | `runs/20260915-183034/LAB-01.json`, `backups/lab01.dump` (8332 B) | Synthetic PG; scripted detection; one host | single run | RM-01 SoR |
| LAB-02 | T2 | F9 + PITR to `lab02_good` | **PASS** | Post-target `MARKER-AFTER-CORRUPT` discarded | **7.363 s** | OK | `LAB-02.json` | Not Production WAL product | single run | RM-03 PITR product |
| LAB-03 | F3 crash recovery | SIGKILL, data dir survived | **PASS** | Measured **zero loss of committed** txns for **this F3 model** (`MARKER-PRE-FAIL` survived; uncommitted inflight absent) | **5.310 s** | OK | `LAB-03.json` | Not F4/HA | single run | — |
| LAB-04 | T3 | F11 primary kill; sync replica survived | **PASS** | Measured **zero transaction loss for this sync-promote configuration and failure model** | **2.308 s** | OK | `LAB-04.json` | One host; no STONITH | single run | RM-04 multi-AZ |
| LAB-05 | T4 | Primary kill while replica stopped | **PASS** | `MARKER-UNREPLICATED` lost (**RPO > 0**) | **6.882 s** | OK | `LAB-05.json` | Induced lag ≠ geography | single run | RM-05 qualify async |
| LAB-06 | T5 | Primary stop; running replica promote | **PARTIAL** | Zero loss of `MARKER-WARM` on **DB** path (sync) | **2.280 s** | OK | `LAB-06.json` | No EOS application standby process | single run | RM-06 app standby |
| LAB-07 | F1+F3 | API + PG kill | **PARTIAL** | PG `MARKER-COMBO` survived. CRM org **UNEXPECTEDLY_PRESENT** after attempted API restart — in-memory loss **not** demonstrated | **4.529 s** to PG probe | PG OK | `LAB-07.json`, `logs/api-lab07.log` | npm kill may not have terminated Node child | single run | RM-01, RM-07 process tree |
| LAB-08 | T2 | F9 logical UPDATE | **PASS** | PITR discarded subsequent UPDATE | **7.409 s** | title restored | `LAB-08.json` | HA replica would copy corruption | single run | RM-03 |
| LAB-09 | T2 | F8 DELETE | **PASS** | Rollback to restore point; not RPO 0 for later commits | **7.326 s** | OK | `LAB-09.json` | Synthetic | single run | RM-03 |
| LAB-10 | T4 site sim | F12 disconnect+kill site A | **PASS** | `MARKER-SITE-A-ONLY` lost (**RPO > 0**) | **6.986 s** | OK | `LAB-10.json` | Laptop ≠ region; Legal E1 OPEN | single run | RM-04, RM-08 legal DR |
| LAB-11 | F13 | PG dependency stopped | **PARTIAL** | PG data intact | **3.488 s** (function down **582 ms** until stop) | OK | `LAB-11.json` | IdP/CDN/WAF/email/KMS **NOT TESTABLE** | single run | RM-09 deps |
| LAB-12 | T3/T6 failback | Planned failback | **PASS** | `MARKER-ON-STANDBY` survived | **10.104 s** | no dup markers | `LAB-12.json` | Scripted, not HA product | single run | RM-10 HA product |

**Not tested:** F7 (backup corruption/unavailability); F10 as dual-primary split-brain; independent AZ; Production IdP/CDN/WAF.

**None of LAB-01–12 is `NOT TESTABLE` for the isolated Docker lab.** EOS jointly-critical **module** recovery remains **not testable as Production-class SoR** because those modules are not PostgreSQL-persisted at runtime.

---

# Topology comparison (evidence vocabulary)

| Topology | Status | Basis |
| --- | --- | --- |
| T1 Backup + restore | **DEMONSTRATED** | LAB-01 |
| T2 Backup + WAL/PITR | **DEMONSTRATED** | LAB-02, LAB-08, LAB-09 |
| T3 Synchronous replication | **DEMONSTRATED** | LAB-04 (one-host lab) |
| T4 Asynchronous replication | **DEMONSTRATED** | LAB-05, LAB-10 (RPO > 0 under lag) |
| T5 Warm standby | **PARTIALLY DEMONSTRATED** | LAB-06 DB only |
| T6 HA failover | **PARTIALLY DEMONSTRATED** | Scripted promote/failback (LAB-04/12); no HA control-plane product |

Do **not** treat DEMONSTRATED as Production topology selection.

---

# Architecture impact (Options A–D — **not selected**)

| Option | Laboratory implication |
| --- | --- |
| **A — African managed cloud** | A candidate offering would need evidenced backup+restore, WAL/PITR, and a stated replica class (sync vs async) matching the failure models the Owner will accept. **Not selected.** |
| **B — EU/EEA managed cloud** | Same technical bar. Async/geo lag was shown to lose committed work (LAB-05/10). Transfer/Legal E1 still required. **Not selected.** |
| **C — Tanzania-controlled hosting** | Same capabilities must be operable without a managed control plane, or provided by the facility. **Not selected.** |
| **D — Hybrid** | Not demonstrated. Split components would need LAB-07/11-class mapping per component. **Not selected.** |

**Required capabilities (architecture implication, not a selection):** durable PostgreSQL SoR; backup restore; WAL/PITR for F8/F9; if F4/F11 zero committed-loss is required, synchronous replica in an independent failure domain plus fencing; async replica **cannot** be claimed as zero-loss.

**Minimum technical architecture (implication only):** in-memory Store is **not** acceptable as Production SoR. Backup-only **cannot** meet unqualified zero business loss between backups (LAB-01). PITR is required for logical damage (LAB-08/09) even if sync HA exists.

**Unresolved risks:** EOS module persistence; F7; split-brain; multi-AZ; foreign support/IdP/CDN/WAF; Legal placement (E1 OPEN); Production detection/ops (lab detection was scripted).

**Capabilities requiring provider evidence (E3):** managed PG HA, PITR, backup isolation, independent AZ/region, support access, SLA — all still `UNKNOWN` / `CANDIDATE — NOT SELECTED`.

---

# Is E2 sufficiently evidenced?

**Partially.** Workplan E2 asked whether <=3h/<=4h is **demonstrable in lab** and what **qualified technical RPO** is under a **stated failure model**. For a **synthetic PostgreSQL SoR on one host**, yes: lab RTOs were 2.3–10.1 s; RPO depends on T1/T2/T3/T4 as above.

E2 is **not** Production-closed: jointly critical EOS functions are not on that SoR; many Production dependencies were not present; Legal E1 remains OPEN.

**E2:** `LABORATORY EVIDENCE COLLECTED (DEV/TEST) — NOT PRODUCTION PROOF`

---

# Governance status

ADR-0006: `PROPOSED — NOT APPROVED`  
DP-0006: `OPEN — NOT APPROVED`  
Provider / Region / Production topology: `NOT SELECTED`  
Production / Deployment / Production migrations: `NOT AUTHORIZED`
