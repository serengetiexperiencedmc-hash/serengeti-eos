# H-167 — Production DR Architecture Assessment Against POA-Approved RTO/RPO

> **GOVERNANCE / ARCHITECTURE ASSESSMENT ONLY**  
> Assesses which technically viable Production DR approaches could satisfy Owner-approved **RTO ≤ 4 hours** and **RPO ≤ 1 hour**, while preserving the current `africa-south1` residency direction unless a separate Owner decision authorizes an exception.  
> **NOT** architecture selection. **NOT** a ranking or winner. **NOT** a claim that any architecture currently meets the targets. **NOT** a secondary-region, Cloud SQL edition, residency-exception, or implementation decision. **NOT** GCP provisioning.  
> H-154 through H-166, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 661  
**Porcelain after this increment:** 662 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / HA / replica / backup / PITR / logging / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-168:** **NOT CREATED**

```text
H-167 STATUS = COMPLETE — CANDIDATE DR APPROACHES ASSESSED; ARCHITECTURE NOT SELECTED; TARGETS NOT DEMONSTRATED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
DR architecture: NOT SELECTED
```

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 661 (matches H-166 after-count) |
| Prior increment | H-166 created only `docs/governance/h-166-eos-rto-rpo-owner-approval-and-dr-architecture-gate.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |
| RTO ≤ 4 hours | Owner-approved (H-166) |
| RPO ≤ 1 hour | Owner-approved (H-166) |
| DR architecture | **NOT SELECTED** |
| Secondary region | **NOT SELECTED** |
| Cloud SQL edition | **NOT SELECTED** |
| Cross-region residency exception | **NOT APPROVED** |

Records read and **not rewritten:** H-154, H-155, H-157, H-158, H-159, H-160, H-161, H-162, H-163, H-164, H-165, H-166; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

---

## 2. Source governance records

| Record | Carried-forward state |
| --- | --- |
| H-154 | 28-blocker inventory; item 24 OPEN |
| H-155 | EI-01 CLOSED BY OWNER ACCEPTANCE; PDPC OPEN |
| H-157 | EOS non-personal commercial boundary; EOS-specific PDPC not pursued; no exemption/compliance claim |
| H-158 | GCP + Cloud Run + Cloud SQL PostgreSQL + `africa-south1` **direction** |
| H-159 | Johannesburg architecture/evidence assessment; default backups nearest multi-region; HA vs DR distinguished |
| H-160 | Standard backups custom `africa-south1`; implementation/evidence OPEN |
| H-161 | Cloud Logging storage `africa-south1`; implementation/evidence OPEN |
| H-162 | Intended PITR transaction-log storage `africa-south1`; provider evidence OPEN |
| H-163 | Regional HA within `africa-south1`; implementation/evidence OPEN; HA is not DR |
| H-164 | Complete `africa-south1` regional outage requires a DR strategy; architecture not selected |
| H-165 | RTO/RPO are mandatory acceptance criteria; values were not yet approved |
| H-166 | RTO = 4 hours; RPO = 1 hour; DR architecture gate; architecture not selected |

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION
DP-0006  = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Historical ADR-0006 and DP-0006 files are **not overwritten**.

---

## 3. Owner-approved RTO/RPO (hard acceptance criteria)

These values are **not** weakened, reinterpreted, or replaced.

| Criterion | Owner-approved value (H-166) |
| --- | --- |
| RTO | **≤ 4 hours** — from the formally defined incident/recovery start point to required EOS Production functions operational and usable |
| RPO | **≤ 1 hour** — maximum acceptable EOS transactional/commercial data loss, measured against the formally defined recovery point |

This assessment distinguishes:

1. **Theoretical capability** — a mechanism exists in principle.
2. **Documented provider capability** — directly supported by current Google Cloud documentation.
3. **Expected architecture behaviour** — a reasonable consequence of documented capability, **not** an explicit Google guarantee.
4. **Measured test evidence** — the only class that can eventually demonstrate that the EOS implementation actually meets the requirement.

**Only item 4 can close the RTO/RPO demonstration.** No candidate currently has item-4 evidence. This increment does **not** claim that any architecture currently meets the targets. No recovery times, replication-lag values, restore durations, prices, or SLA commitments are invented.

---

## 4. Current Production architecture (unchanged)

H-167 does **not** modify these directions.

| Component | Owner direction | Implementation |
| --- | --- | --- |
| Hosting | GCP (H-158) | OPEN |
| Primary region | `africa-south1` Johannesburg (H-158) | OPEN |
| Runtime | Cloud Run `africa-south1` (H-158) | OPEN |
| Database | Cloud SQL PostgreSQL `africa-south1` (H-158) | OPEN |
| Regional HA | regional HA within `africa-south1` (H-163) | OPEN |
| Standard backups | custom `africa-south1` (H-160) | OPEN |
| PITR | intended `africa-south1`, provider evidence required (H-162) | OPEN |
| Cloud Logging storage | `africa-south1` (H-161) | OPEN |
| Regional-outage DR policy | required (H-164) | architecture not selected |
| RTO / RPO | ≤ 4 hours / ≤ 1 hour (H-166) | not measured |

H-163 regional HA addresses **zonal / in-region infrastructure failure**. Google Cloud documentation states that promoting a replica is **not** the same as high availability, where a standby instance automatically becomes the primary in a zonal outage ([Promote replicas](https://docs.cloud.google.com/sql/docs/postgres/replication/cross-region-replicas), last updated 2026-09-18 UTC). Regional HA is **not** regional DR.

---

## 5. Provider-evidence sources

Authoritative Google Cloud documentation consulted for this increment (PostgreSQL unless noted). Documentation is **not** converted into an EOS performance guarantee.

| Source | URL | Last updated (as published) |
| --- | --- | --- |
| About disaster recovery (DR) in Cloud SQL | https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery | 2026-09-18 UTC |
| Promote replicas for regional migration or disaster recovery | https://docs.cloud.google.com/sql/docs/postgres/replication/cross-region-replicas | 2026-09-18 UTC |
| Cloud SQL backups overview | https://cloud.google.com/sql/docs/postgres/backup-recovery/backups | consulted 2026-09-22 |
| Restore an instance overview | https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/restore | consulted 2026-09-22 |
| Restore an instance using a backup | https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/restoring | consulted 2026-09-22 |
| Choose your backup option | https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backup-options | consulted 2026-09-22 |
| Point-in-time recovery | https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/pitr | consulted 2026-09-22 |
| Replication lag | https://docs.cloud.google.com/sql/docs/postgres/replication/replication-lag | consulted 2026-09-22 |
| Choose a Cloud SQL edition | https://docs.cloud.google.com/sql/docs/postgres/choose-edition | consulted 2026-09-22 |

Evidence-class vocabulary used below:

- **Confirmed provider capability** — directly supported by the documentation above.
- **Architecture inference** — reasonable consequence, not an explicit Google guarantee.
- **EOS-specific unknown** — requires actual configuration, measurement, or testing.

---

## 6. Candidate DR approaches

No candidate is selected. No candidate is ranked. No candidate is called best or superior.

Google’s DR overview states that Cloud SQL is a **regional** service when configured for HA; if the hosting region becomes unavailable, the Cloud SQL database also becomes unavailable. To continue processing, the database must be made available in a **secondary region**. The documented DR plan uses a **cross-region read replica**. A failover based on export/import or backup/restore is also possible, “but that approach takes longer, especially for large databases.” Google also states that if required RTO and RPO are **in minutes rather than in hours**, failing over to another region is faster than recreating a database ([About disaster recovery](https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery)).

EOS RTO is **4 hours** (hours, not minutes). That fact does **not** prove backup/restore meets 4 hours, and it does **not** prove replica promotion meets 4 hours for the **full EOS stack**.

---

### Candidate A — Backup/restore based DR

#### Likely recovery mechanism

**Confirmed provider capability:** Cloud SQL backups can restore an instance to a previous state, and can be used to “set up Disaster Recovery (DR) by creating a new instance using a backup in a different region or zone” ([Backups overview](https://cloud.google.com/sql/docs/postgres/backup-recovery/backups)). Restore may target a new or existing instance, including another project or region ([Restore overview](https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/restore)). PITR restores to a specific time and **always creates a new instance**.

Standard automated backup schedule is documented as **daily** for standard backups; enhanced backups support hourly (and other) schedules ([Backup options](https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backup-options)). Enhanced backups **cannot** be combined with a DR replica.

#### Restore sequence (database)

Typical documented path: identify available backup (and, if used, PITR timestamp) → restore to a new instance in an **available** region → verify instance → reconnect clients. **EOS-specific unknown:** actual duration, operator ownership, and whether africa-south1 backups remain reachable during a complete regional outage.

#### Database recovery

Covered **in principle** by restore/PITR. Not demonstrated.

#### Application / configuration / secrets / DNS / network

**Not covered** by backup/restore of Cloud SQL. Cloud Run revision, container image, secrets, identity, networking, and DNS must be recovered separately. Database restore ≠ EOS DR.

#### Expected recovery duration

**Not invented.** Google states backup/restore failover “takes longer, especially for large databases,” compared with replica-based DR. No EOS database size, restore duration, or Cloud Run redeploy duration exists. **EOS-specific unknown.**

#### Recoverable data point

Without PITR, the recoverable point is the **latest available backup**. Daily standard backups **do not presently demonstrate** RPO ≤ 1 hour. With PITR, the recoverable point can be a chosen timestamp within the PITR window **if** logs are accessible. PostgreSQL PITR Cloud Storage geography remains an H-162 evidence gap. **EOS-specific unknown.**

#### Operational complexity

Requires runbooks for backup identification, restore-to-new-instance, size/edition matching, application reconnection, secrets, identity, DNS, validation, and fallback. **Not implemented.**

#### Likely RTO suitability

**Potentially compatible subject to evidence** for the database restore **plus** the rest of the EOS stack — **only if** the restore target is available. For a **complete `africa-south1` outage**, restoring **into** `africa-south1` **does not presently demonstrate** recovery while that region remains unavailable (**architecture inference** from Cloud SQL being a regional service). Restoring into another region is a documented pattern and **requires a residency exception**.

#### Likely RPO suitability

**Does not presently demonstrate compliance** from standard daily backups alone. **Potentially compatible subject to evidence** if PITR is configured, logs are accessible during the disaster, and recovered state is measured at ≤ 1 hour. PITR capability is **not** an Owner-approved RPO demonstration (H-162 / H-166).

#### Residency implications

| Mode | Classification |
| --- | --- |
| Restore remaining entirely in `africa-south1` | **A. Can remain entirely within `africa-south1`** for the **data location**, but **does not presently demonstrate** recovery from a **complete regional outage** while the region is down. **Requires additional architecture** for that scenario, or wait until the region returns (which may miss RTO). |
| Restore to another region | **B. Requires Production data to exist in another region** at recovery time. **Residency exception required.** Cross-region DR is technically possible only subject to a separate Owner approval for the resulting residency exception. |

H-160 custom `africa-south1` backup location, if implemented as directed, keeps **standard backups in the primary region**. Whether those backups remain usable during a complete `africa-south1` outage is **C. unresolved residency / availability implication requiring provider/configuration evidence**.

---

### Candidate B — Cross-region Cloud SQL read replica

#### Secondary-region requirement

**Confirmed provider capability:** a cross-region read replica is created in a **different region** from the primary. Google’s minimal DR architecture for an HA Cloud SQL instance includes a cross-region read replica in a secondary region ([About disaster recovery](https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery)).

A secondary region is **required**. None is selected here.

#### Asynchronous replication / RPO implications

**Confirmed provider capability:** the replica synchronizes using **asynchronous** replication. “Because this setup uses asynchronous replication, it's possible that the cross-region read replica lags behind the primary instance. As a result, when a failover occurs, the cross-region read replica RPO is likely non-zero.” Promotion may lose recent committed transactions not yet replicated ([Promote replicas](https://docs.cloud.google.com/sql/docs/postgres/replication/cross-region-replicas)). Replication lag is monitorable (`replica_lag`, `network_lag`, Lag Bytes). **No documented lag number is treated as EOS RPO.** Whether lag remains ≤ 1 hour is **EOS-specific unknown**.

#### Promotion / failover process

**Confirmed provider capability:** promotion is **manual and intentional**. It is **not** in-region HA. After promotion, clients must be reconfigured unless a later Advanced DR write endpoint is used (Candidate C). Google describes additional steps for a complete DR architecture after failover (HA on the new primary; new cross-region replica; split-brain avoidance; immediate backup of the new primary).

#### Application reconnection / DNS / write endpoint

Candidate B **without** Advanced DR does **not** automatically retarget application connections. **Architecture inference:** EOS would need application configuration, Cloud Run env/connection string, and/or DNS changes. **EOS-specific unknown.**

#### HA requirements

Google **recommends** configuring the replica to promote as an HA replica, or enabling HA after promotion. H-163 HA direction is **in-region** on the primary; it does **not** create this replica.

#### Recovery sequence / fallback

Documented sequence: declare disaster → promote replica in secondary region → reconfigure clients → enable HA if needed → recreate other replicas → later fallback by promoting a replica in the original region. Fallback is a separate maintenance activity. **Not implemented.**

#### Operational ownership

Requires named ownership for promotion decision, lag verification, client cutover, split-brain prevention, and fallback. **Not assigned here.**

#### Likely RTO suitability

**Potentially compatible subject to evidence.** Google states replica failover is faster than recreating a database, and that minute-scale RTO/RPO favours regional failover over recreate. EOS RTO is 4 hours, but **full-stack** recovery (Cloud Run, secrets, identity, DNS, validation) is **not** the database promotion time. **No duration is claimed.**

#### Likely RPO suitability

**Potentially compatible subject to evidence.** Documented RPO is **likely non-zero** and equal to effective replication lag. **Does not presently demonstrate** RPO ≤ 1 hour. Lag must be observed under EOS load.

#### Residency implications

**B. Requires Production data to exist in another region** continuously (the replica). **Residency exception required.**

> Cross-region DR is technically possible only subject to a separate Owner approval for the resulting residency exception.

Whether that other region remains in South Africa depends on a later, unselected destination. No destination is recommended here.

Candidate B is **not** regional HA. Regional HA remains in `africa-south1` (H-163).

---

### Candidate C — Cloud SQL Advanced DR

#### Documented capability (PostgreSQL)

**Confirmed provider capability** ([About disaster recovery](https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery); [Choose a Cloud SQL edition](https://docs.cloud.google.com/sql/docs/postgres/choose-edition)):

- **Edition requirement:** Advanced DR is documented for **Cloud SQL Enterprise Plus edition**. Enterprise edition: Advanced DR = No. This is a **provider requirement**, **not** an Owner edition selection.
- **Designated DR replica:** a directly connected **cross-region** read replica designated as the DR replica.
- **Cross-region requirement:** yes.
- **Replica failover:** promote the designated DR replica; promotion of the DR replica is described as **immediate**; old primary later becomes a replica of the new primary and retains its IP address.
- **Switchover:** planned role reversal with **zero data loss** after replication lag reaches zero; used for failback and drills. Switchover requires both instances online.
- **Replica failover data-loss note:** “While switchover results in zero data loss, replica failover can result in data loss if the DR replica experiences replication lag when you start the replica failover operation.”
- **Write endpoint:** global DNS name that can redirect to the current primary on failover/switchover for Enterprise Plus with private IP; if not using a write endpoint, applications must be reconfigured.
- **PITR dependency:** PITR is enabled automatically for the new primary after switchover; PITR is only possible after the first automated backup on that new primary.
- **Enhanced backups:** cannot create a DR replica for an instance using enhanced backups, and cannot enable enhanced backups if a DR replica exists.

#### Expected RPO implications

Disaster (replica failover): **non-zero RPO possible** (lag). Planned switchover: documented **zero data loss**. EOS RPO ≤ 1 hour applies to a **qualifying regional disaster**, not to a planned drill. **Does not presently demonstrate** disaster RPO ≤ 1 hour.

#### Recovery sequence / fallback

Documented: assign DR replica → (optional switchover drill) → replica failover on outage → write endpoint update (if used) → original primary becomes replica when it returns → switchover failback. **Not implemented.**

#### Operational requirements

Edition Plus; designated replica; recommended matching size and HA on the DR replica; Cloud DNS API if write endpoint is used; private IP considerations; monitoring of lag; operational decision to invoke failover. **Not configured.**

#### Likely RTO suitability

**Potentially compatible subject to evidence** for **database** promotion (documented as immediate for replica failover) **plus** remaining EOS stack. Immediate database promotion is **not** measured EOS RTO.

#### Likely RPO suitability

**Potentially compatible subject to evidence** (lag under EOS load). **Does not presently demonstrate compliance.**

#### Residency implications

**B. Requires Production data to exist in another region** continuously. **Residency exception required.** Same H-164 rule as Candidate B.

#### Cost / licensing implications

Enterprise Plus is a different edition with different pricing, SLA, and feature set ([Choose a Cloud SQL edition](https://docs.cloud.google.com/sql/docs/postgres/choose-edition)). **No prices are recorded.** Cost/contract confirmation is **later commercial work**. Availability SLA figures in that page (99.99% vs 99.95%) are **provider SLA statements**, **not** EOS RTO and **not** selected here.

#### Owner selection status

```text
Enterprise Plus: NOT SELECTED
Advanced DR: NOT SELECTED
Cloud SQL edition: OPEN
```

Advanced DR does **not** automatically satisfy EOS RTO/RPO.

---

## 7. RTO analysis

| Fact class | Statement |
| --- | --- |
| Hard requirement | EOS Production RTO ≤ **4 hours** (H-166). |
| Confirmed provider capability | Replica-based regional failover is documented as faster than recreating a database; backup/restore failover is documented as possible but longer, especially for large databases. |
| Architecture inference | Database recovery time is only part of EOS RTO. Cloud Run, secrets, identity, networking, DNS, and validation add elapsed time. |
| EOS-specific unknown | Restore duration, promotion duration under EOS size/load, operator decision latency, and application recovery duration. |
| Measured evidence | **None.** |

No candidate **presently demonstrates** RTO ≤ 4 hours.

---

## 8. RPO analysis

| Fact class | Statement |
| --- | --- |
| Hard requirement | EOS Production RPO ≤ **1 hour** (H-166). |
| Confirmed provider capability | Standard backups: daily automated schedule. PITR: restore to a timestamp in the PITR window. Cross-region replicas: asynchronous; failover RPO likely non-zero. Advanced DR replica failover: data loss possible if lag exists. Switchover: zero data loss when both regions are healthy. |
| Architecture inference | Daily backups alone are not a 1-hour recovery point. Meeting RPO ≤ 1 hour via Candidate A depends on PITR (or a more frequent backup product, which is a separate later choice). Meeting RPO ≤ 1 hour via B or C depends on observed replication lag remaining within 1 hour at failover. |
| EOS-specific unknown | Actual backup age at disaster; PITR log accessibility and geography; replica lag under EOS write load. |
| Measured evidence | **None.** |

No candidate **presently demonstrates** RPO ≤ 1 hour. Provider capabilities are evidence **against** a later architecture choice; they do **not** establish that EOS meets the requirement.

---

## 9. Residency analysis

Current Owner direction: Production primary data and intended backup / PITR / log storage remain in `africa-south1`. The Owner has **not** approved a cross-region residency exception.

```text
Cross-region residency exception: NOT APPROVED
Rule (H-164, preserved): No cross-region Production DR architecture may be
selected or implemented until the Owner separately approves the corresponding
residency exception.
```

| Candidate | Remain entirely in `africa-south1`? | Production data in another region? | Unresolved residency |
| --- | --- | --- | --- |
| A — restore in `africa-south1` | **A. Yes** for data location | No, unless the restore target is changed | Whether in-region backups/PITR remain usable during a complete regional outage; PITR Cloud Storage geography (H-162) |
| A — restore to another region | No | **B. Yes**, at recovery time | Destination region/country unselected; whether it remains in South Africa is unknown until a later Owner decision |
| B — cross-region read replica | No | **B. Yes**, continuously | Destination unselected; replica is Production data outside `africa-south1` |
| C — Advanced DR | No | **B. Yes**, continuously | Same as B; Plus edition and write-endpoint DNS implications |

For B, C, and A-restore-elsewhere:

> Cross-region DR is technically possible only subject to a separate Owner approval for the resulting residency exception.

H-167 does **not** grant that exception. H-167 does **not** select a destination region.

**In-region HA (H-163) is not an in-region substitute for complete regional DR.** Google documents regional Cloud SQL unavailability as requiring the database to be made available in a **secondary region** to continue processing.

---

## 10. Assessment matrix

Classifications only. **No scores. No ranking. No winner.**

| Candidate | RTO ≤4h plausibility | RPO ≤1h plausibility | Primary-region residency | Cross-region data required | Main dependencies | Evidence still required |
| --- | --- | --- | --- | --- | --- | --- |
| A — Backup/restore (target `africa-south1`) | **Does not presently demonstrate compliance** for a **complete regional outage while the region is down**; **potentially compatible subject to evidence** after the region returns, or for non-regional failures already in HA/PITR scope | **Does not presently demonstrate compliance** from daily backups alone; **potentially compatible subject to evidence** if PITR is available and measured | Can remain in `africa-south1` | No (this mode) | Backups, PITR, restore runbook, Cloud Run, secrets, identity, DNS, ops ownership | Restore duration; PITR geography/accessibility; full-stack recovery test; measured RTO/RPO |
| A — Backup/restore (target another region) | **Potentially compatible subject to evidence** (Google: possible, “takes longer”) | Same as row above | Leaves `africa-south1` at restore | **Yes** — **residency exception required** | Same + selected secondary region + exception | Same + destination residency evidence + restore-to-other-region test |
| B — Cross-region read replica | **Potentially compatible subject to evidence** (Google: replica failover faster than recreate; full EOS stack still unknown) | **Potentially compatible subject to evidence**; documented RPO likely non-zero; **does not presently demonstrate** ≤ 1 hour | Leaves `africa-south1` continuously | **Yes** — **residency exception required** | Replica, lag monitoring, promotion runbook, HA on promoted instance, client reconnection, Cloud Run, secrets, identity, DNS | Observed lag; promotion test; full-stack RTO; residency exception; destination region |
| C — Advanced DR | **Potentially compatible subject to evidence** (DB promotion documented as immediate; EOS stack still unknown) | **Potentially compatible subject to evidence**; disaster failover may lose lag; switchover zero-loss is **not** the disaster case | Leaves `africa-south1` continuously | **Yes** — **residency exception required** | **Enterprise Plus** (provider requirement, not Owner selection), designated DR replica, write endpoint/DNS, HA sizing, lag monitoring, Cloud Run, secrets, identity | Same as B + Plus capability/cost confirmation + write-endpoint behaviour + measured failover lag |

---

## 11. Cloud SQL edition dependencies

```text
Cloud SQL edition = OPEN
```

No edition is selected. Enterprise Plus is **not** assumed and **not** approved.

| Candidate | Edition dependency |
| --- | --- |
| A — Backup/restore | Standard backups and PITR exist on documented editions; exact edition still **OPEN**. Enhanced (hourly) backups are a **separate product** with DR-replica incompatibility. |
| B — Cross-region read replica | Cross-region replicas are documented independently of Advanced DR. Edition still **OPEN**. |
| C — Advanced DR | **Provider requirement: Enterprise Plus.** Recorded as a provider requirement, **not** an Owner selection. Write endpoint is documented as an Enterprise Plus Advanced DR feature. |

---

## 12. EOS-wide DR dependencies (database DR ≠ EOS DR)

A database failover or restore does **not** mean EOS has achieved DR.

The eventual EOS Production DR architecture must cover:

1. application runtime (Cloud Run);
2. database (Cloud SQL);
3. configuration;
4. secrets;
5. identity/access;
6. networking;
7. DNS/connectivity where applicable;
8. observability;
9. operational procedures;
10. data recovery;
11. commercial workflow continuity;
12. return-to-normal/fallback.

| EOS stack element | Candidate A coverage | Candidate B coverage | Candidate C coverage |
| --- | --- | --- | --- |
| Application runtime | **Not covered** by SQL restore | **Not covered** by replica promotion | **Not covered** (write endpoint is DB DNS, not Cloud Run) |
| Database | Restore/PITR **in principle** | Promote replica **in principle** | Replica failover / switchover **in principle** |
| Configuration | **Not covered** | **Not covered** | **Not covered** |
| Secrets | **Not covered** (ADR-0012 OPEN) | **Not covered** | **Not covered** |
| Identity/access | **Not covered** (ADR-0013 OPEN) | **Not covered** | **Not covered** |
| Networking | **Not covered** | **Not covered** | Partial **if** private IP write endpoint is later used — **DB only** |
| DNS/connectivity | **Not covered** | Manual reconnection expected | Write endpoint may auto-update **DB** DNS |
| Observability | **Not covered** (H-161 logging direction only) | **Not covered** | Lag metrics exist for replicas; not EOS observability |
| Operational procedures | Required; **absent** | Required; **absent** | Required; **absent** |
| Data recovery | Backup/PITR | Replica state at promotion | Replica state at failover |
| Commercial workflow continuity | **Not covered** until app + data + access work | Same | Same |
| Fallback | Restore-back / re-create in `africa-south1` — **undesigned** | Second promotion — documented pattern, **not implemented** | Switchover — documented, **not implemented** |

Dependencies identified and **not implemented** (where applicable per candidate): Cloud SQL edition; database version; HA configuration; PITR; backup configuration; replica configuration; replication lag monitoring; application connectivity; Cloud Run deployment; secrets/configuration; DNS/write endpoint; IAM; TLS; networking; observability; operational ownership; recovery runbook; backup/restore validation; DR testing; rollback/fallback.

---

## 13. Required future evidence (identified, not created)

For **any** candidate eventually considered for selection:

- provider documentation (continuing);
- selected Cloud SQL edition;
- selected region (including any secondary region **only after** residency exception);
- actual configured backup location;
- actual PITR behaviour/location;
- replication configuration (if replica-based);
- replication lag observation (if replica-based);
- recovery runbook;
- restore/failover test;
- **measured RTO**;
- **measured RPO**;
- application recovery test;
- authentication/access recovery test;
- DNS/network recovery test where applicable;
- rollback/fallback test;
- residency evidence;
- operational ownership;
- cost/contract approval.

None of this evidence is created by H-167.

H-166 sequence remains mandatory and is **not** collapsed:

```text
POA RTO/RPO approval
  → DR architecture assessment          (this increment)
  → candidate architecture selection    (NOT DONE)
  → provider capability / evidence validation
  → Production implementation
  → controlled DR test
  → RTO/RPO measurement
  → remediation if target is missed
  → Production readiness reassessment
```

---

## 14. Production blocker update

H-154’s 28-blocker inventory remains authoritative. **No new blocker number.** No blocker is closed because an assessment completed.

### Item 24 — Rollback / DR

**OPEN.**

- RTO ≤ 4 hours approved (H-166);
- RPO ≤ 1 hour approved (H-166);
- candidate architecture assessment performed (this increment);
- architecture **not selected**;
- implementation **not authorized**;
- provider evidence **outstanding**;
- controlled DR testing **outstanding**.

| # | Gate | After H-167 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; implementation/evidence **OPEN** |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160; implementation/evidence **OPEN** |
| 15 | Restore / PITR evidence | **OPEN** |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN** |
| 22 | Observability / logging | H-161; implementation/evidence **OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN** — assessment recorded; architecture not selected; implementation not authorized; evidence and DR testing outstanding; residency exception **NOT APPROVED** |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

---

## 15. Explicit non-authorizations

H-167 does **NOT** authorize:

- GCP project creation;
- GCP resource creation;
- Cloud SQL creation;
- Cloud Run deployment;
- Cloud SQL edition selection;
- cross-region replica creation;
- secondary region selection;
- cross-region replication;
- backup configuration;
- PITR configuration;
- HA configuration;
- DNS changes;
- network changes;
- IAM changes;
- secrets/KMS changes;
- Production data;
- Production credentials;
- DR testing;
- Production deployment.

```text
No GCP resources were created.
Application code unchanged.
Database schema unchanged.
Migration 126 not created.
Live migration not run.
No credentials used.
No DNS change.
No Production deployment.
No DR test performed.
Production remains NOT AUTHORIZED / NOT READY.
```

ADR-0006 remains **SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION**.  
DP-0006 remains **SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE**.  
Additive: candidate DR approaches assessed; **none selected**. Historical ADR/DP files not rewritten.

---

## 16. Conclusion

```text
DR architecture: NOT SELECTED
```

H-167 establishes a factual and technical **decision basis** for a later Owner/POA architecture decision. It does **not**:

- choose a “best” candidate;
- rank or score candidates;
- recommend a secondary region;
- approve a residency exception;
- approve a Cloud SQL edition;
- begin implementation;
- claim that any candidate currently meets RTO ≤ 4 hours or RPO ≤ 1 hour.

---

## 17. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 661 → 662 |
| Files changed this increment | `docs/governance/h-167-production-dr-architecture-rto-rpo-assessment.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-167
H-168 NOT CREATED
```
