# H-169 — POA Selection of Production DR Secondary Region and DR Architecture

> **GOVERNANCE / ARCHITECTURE SELECTION ONLY**  
> Selects the Production EOS **secondary DR region** and **DR architecture** under POA, after current Google Cloud documentation review, H-167 candidate assessment, and the H-168 in-principle residency exception.  
> **NOT** implementation. **NOT** GCP provisioning. **NOT** replica creation. **NOT** Enterprise Plus purchase. **NOT** Production data movement. **NOT** a DR test. **NOT** a Production grant.  
> H-158 through H-168, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 663  
**Porcelain after this increment:** 664 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / replica / Advanced DR / backup / PITR / HA / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract / DPA / purchase:** **NONE**  
**Commit / push:** **NONE**  
**H-170:** **NOT CREATED**

```text
H-169 STATUS = COMPLETE — SECONDARY REGION AND DR ARCHITECTURE SELECTED; IMPLEMENTATION NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 663 (matches H-168 after-count) |
| Prior increment | H-168 created only `docs/governance/h-168-poa-cross-region-dr-residency-exception.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |
| Primary region | `africa-south1` |
| RTO | ≤ 4 hours (H-166) |
| RPO | ≤ 1 hour (H-166) |
| Cross-region DR exception before this increment | APPROVED IN PRINCIPLE (H-168) |
| Secondary region before this increment | **NOT SELECTED** |
| DR architecture before this increment | **NOT SELECTED** |
| Cloud SQL edition before this increment | **OPEN** |

Records read and **not rewritten:** H-158, H-159, H-160, H-161, H-162, H-163, H-164, H-165, H-166, H-167, H-168; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

---

## 2. H-167 assessment reconciliation

H-167 remains authoritative for the **candidate assessment**. It did not select a winner. Carried-forward findings used here:

| Candidate | H-167 classification (not a score) |
| --- | --- |
| A — Backup/restore in `africa-south1` | Does not presently demonstrate recovery from a **complete regional outage while the region is down** |
| A — Backup/restore to another region | Potentially compatible subject to evidence; Google: possible but “takes longer”; daily backups do not demonstrate RPO ≤ 1 hour without PITR; **residency exception required** |
| B — Cross-region read replica | Potentially compatible subject to evidence; async RPO likely non-zero; manual promotion; **residency exception required** |
| C — Advanced DR | Potentially compatible subject to evidence; replica failover documented as immediate for the DB; disaster failover may lose lag; switchover zero-loss is the **planned** path; **Enterprise Plus provider requirement**; **residency exception required** |

H-167: database DR ≠ EOS DR. Application runtime, secrets, identity, networking, DNS, observability, and fallback remain required.

---

## 3. H-168 residency-exception reconciliation

H-168 remains authoritative for the **in-principle** exception. It permitted future assessment and, after subsequent gates, possible use of a secondary Cloud SQL region, cross-region replication, a designated DR replica, or other provider-supported mechanisms demonstrated against RTO/RPO.

H-168 did **not** select a secondary region, edition, or architecture, and did **not** authorize implementation. H-169 **refines** that exception to the selected architecture (§18). It does **not** convert the exception into a blanket residency approval or move the **primary** environment out of Johannesburg.

H-168’s eighteen Production-approval conditions remain **unsatisfied** by architecture selection alone.

---

## 4. Current provider evidence

Evidence date: **2026-09-22** (Africa/Nairobi), using Google Cloud pages last updated **2026-09-18 UTC** or **2026-09-22 UTC** as published.

| Source | URL | Published update |
| --- | --- | --- |
| Cloud SQL PostgreSQL instance locations | https://docs.cloud.google.com/sql/docs/postgres/locations | 2026-09-18 UTC |
| Region availability by edition / machine series | https://docs.cloud.google.com/sql/docs/postgres/region-availability-overview | 2026-09-22 UTC |
| About disaster recovery (DR) | https://docs.cloud.google.com/sql/docs/postgres/intro-to-cloud-sql-disaster-recovery | 2026-09-18 UTC |
| Promote replicas / cross-region DR | https://docs.cloud.google.com/sql/docs/postgres/replication/cross-region-replicas | 2026-09-18 UTC |
| Choose a Cloud SQL edition | https://docs.cloud.google.com/sql/docs/postgres/choose-edition | consulted 2026-09-22 |
| Choose a machine series | https://docs.cloud.google.com/sql/docs/postgres/machine-series-overview | consulted 2026-09-22 |
| About replication / replica pricing notes | https://cloud.google.com/sql/docs/postgres/replication | consulted 2026-09-22 |
| Cloud SQL pricing | https://cloud.google.com/sql/pricing | consulted 2026-09-22 |
| Backup options / restore | https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backup-options | consulted 2026-09-22 (H-167) |

Vocabulary:

- **Documented provider capability** — stated in the pages above.
- **Architecture inference** — reasonable consequence, not an explicit Google guarantee.
- **EOS-specific evidence still required** — configuration, measurement, or testing.

Provider documentation is **not** an EOS performance guarantee.

---

## 5. Regional availability assessment

### Africa

**Documented provider capability** ([locations](https://docs.cloud.google.com/sql/docs/postgres/locations), 2026-09-18 UTC): the **only** Cloud SQL PostgreSQL region listed under Africa is:

```text
africa-south1 — Johannesburg
```

No other African Cloud SQL PostgreSQL region is listed. Cape Town, Nairobi, Lagos, or any other African region is **not** assumed and **not** documented on that page.

**Documented provider capability** ([region availability](https://docs.cloud.google.com/sql/docs/postgres/region-availability-overview), 2026-09-22 UTC):

- Enterprise edition: `africa-south1` supported (with documented high-vCPU limitations).
- Enterprise Plus: `africa-south1` supports **N2** and **C4**; **C4A is not listed** for Johannesburg.

```text
There is no second African Cloud SQL PostgreSQL region capable of hosting
the required cross-region DR architecture.
A viable African secondary region does not presently exist in the
documented Cloud SQL PostgreSQL location list.
```

Therefore a Production DR copy for a complete `africa-south1` outage **must** use a **non-African** secondary region, under the H-168 exception.

### Multi-regional backup locations (not secondary compute regions)

Documented backup multi-regions remain `asia`, `eu`, and `us` only. They are **not** candidate DR compute regions.

---

## 6. Candidate secondary regions

Candidates are taken from the current location list. None is manufactured. African alternatives: **none**. Non-African alternatives investigated (minimum two):

| Candidate | Region | Country | Location | Cloud SQL PG | Enterprise | Enterprise Plus | Advanced DR (Plus + replica) | Cross-region replica | Separation from Johannesburg | Residency implication | Known provider constraints | Operational / network / cost notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ME-W1 | `me-west1` | Israel | Tel Aviv | Yes | Yes (footnote-1 vCPU limits) | **N2 only** | Provider-capable if Plus + designated replica | Yes | Different continent/region from `africa-south1`; geographically nearer southern/eastern Africa than Western Europe (**inference**, no km claimed) | Leaves South Africa; Middle East legal/DPA later | Plus: no C4A/C4 listed | Replica must match primary **machine series**; N2 is the overlap with Johannesburg Plus |
| EU-W1 | `europe-west1` | Belgium | St. Ghislain area (region description: Belgium) | Yes | Yes (no footnote-1) | **N2 and C4A** | Provider-capable if Plus + designated replica | Yes | Different continent; independent GCP region from Johannesburg | Leaves South Africa; EU legal/DPA later | Locations page flags Low CO₂ | Mature documented Cloud SQL footprint; N2 overlap with Johannesburg Plus |
| EU-W4 (investigated, not a third manufactured option) | `europe-west4` | Netherlands | Netherlands | Yes | Yes | **N2, C4A, and C4** | Same family as EU-W1 | Yes | Similar European separation | Leaves South Africa; EU | Broader Plus machine series than EU-W1 | Same residency class as Belgium |

**Machine-series pairing (documented):** replicas must use the **same machine series** as the primary ([machine series](https://docs.cloud.google.com/sql/docs/postgres/machine-series-overview)). Johannesburg Plus lists **N2 and C4**. Tel Aviv Plus lists **N2 only**. Belgium Plus lists **N2 and C4A**.

**Architecture inference:** the **compatible Enterprise Plus series for a Johannesburg primary paired with either Tel Aviv or Belgium is N2**.

US regions were **not** added as practical DR candidates: documented capability exists, but they increase geographic and latency distance from East Africa / Johannesburg without improving African residency. No latency numbers are invented.

Cost: later confirmation required. Documented structure: replicas billed as standalone instances; cross-region replicas incur **replication-log data-transfer** charges ([About replication](https://cloud.google.com/sql/docs/postgres/replication)). No totals.

---

## 7. Candidate DR mechanisms

Evaluated against RTO ≤ 4 hours and RPO ≤ 1 hour. **No generic score.**

| Question | Option 1 — Regular cross-region replica DR | Option 2 — Enterprise Plus Advanced DR | Option 3 — Backup/restore regional DR |
| --- | --- | --- | --- |
| Plausibly RTO ≤ 4h? | **Potentially compatible subject to evidence.** Promotion is manual; Google: replica failover faster than recreating a DB. Full EOS stack still unknown. | **Potentially compatible subject to evidence.** Replica failover documented as **immediate** for the designated DR replica. Write endpoint can retarget DB DNS. Full EOS stack still unknown. | **Does not presently demonstrate** in-region during outage. Cross-region restore: Google “takes longer, especially for large databases.” Duration **unknown**. Daily backups + restore path is weaker against a 4-hour **full-stack** clock without measurement. |
| Plausibly RPO ≤ 1h? | **Potentially compatible subject to evidence.** Async; RPO **likely non-zero**; lag not guaranteed ≤ 1 hour. | **Potentially compatible subject to evidence.** Disaster **replica failover can lose lag**. Switchover zero-loss is **planned**, both regions healthy — **not** the disaster case. | Daily standard backups **do not presently demonstrate** 1 hour. PITR may, **if** logs are reachable during the disaster. H-160/H-162 keep backups/PITR **in** `africa-south1`, which may be unreachable in a complete regional outage. |
| Requires cross-region data? | Yes | Yes | Yes, for regional-outage restore-elsewhere; in-region restore does not solve complete regional outage |
| Requires Enterprise Plus? | No (provider) | **Yes (provider requirement)** | No for standard backups |
| Requires PITR? | Not the replica promotion mechanism; PITR still relevant for other recovery | PITR auto-enabled on new primary after first backup post-switchover; not the disaster RPO mechanism | Effectively required to approach RPO ≤ 1 hour |
| Application endpoint changes? | Yes, unless separately designed | Reduced **for DB** if write endpoint used; Cloud Run still required | Yes |
| DNS / write endpoint? | Manual / app config | Write endpoint documented for Plus Advanced DR (private IP) | Manual |
| Manual operational action? | Yes (declare, promote, reconnect, HA, split-brain) | Yes (declare, replica failover); fewer reconnect steps if write endpoint | Yes (restore, new instance, reconnect) |
| Additional app/runtime architecture? | **Yes** — Cloud Run in an available region | **Yes** — Cloud Run in an available region | **Yes** |
| Controlled DR test required? | **Yes** | **Yes** | **Yes** |

Option 3 is **not** selected. Evidence does **not** demonstrate that backup/restore satisfies approved RTO/RPO for actual EOS **regional-outage** scope.

---

## 8. RTO analysis

Hard requirement: **≤ 4 hours** (H-166). Elapsed time includes:

1. disaster declaration;
2. detection;
3. decision;
4. failover/promotion;
5. application recovery;
6. endpoint/DNS transition;
7. authentication/access;
8. validation;
9. operator readiness.

| Class | Option 1 | Option 2 | Option 3 |
| --- | --- | --- | --- |
| Documented provider behaviour | Manual promote; faster than recreate | Replica failover **immediate** for designated DR replica; write endpoint can follow new primary | Restore to new instance in another region possible; “takes longer” |
| Architecture inference | Operator + app + secrets + Cloud Run dominate remaining clock | Same EOS-wide clock; DB/DNS portion shorter if write endpoint works | Restore duration + new instance + full stack likely consume more of the 4-hour budget |
| EOS-specific unknown | All durations | All durations | All durations |

**Measured Production RTO: not available.** Must be produced in a controlled DR test.

---

## 9. RPO analysis

Hard requirement: **≤ 1 hour** (H-166).

| Factor | Option 1 | Option 2 | Option 3 |
| --- | --- | --- | --- |
| Asynchronous replication | Yes | Yes (disaster path) | N/A (backup/PITR) |
| Replication lag | Monitorable; **not** a guaranteed ≤ 1 hour | Same for **replica failover** | N/A |
| Last recoverable point | Replica apply position at promotion | Same at disaster failover | Latest backup, or PITR timestamp if logs exist |
| PITR | Separate | Separate; new primary PITR after first backup | Central to 1-hour target |
| Backup frequency | Daily standard (documented) does not demonstrate 1 hour | Same for standard backups on primary | Same |
| Zero data loss? | **Not claimed.** Docs: recent committed tx may be lost | Disaster failover: **not claimed** (lag possible). Switchover: documented **zero data loss** when both healthy | **Not claimed** |

No replication-lag figures are invented. **Measured Production RPO: not available.**

---

## 10. Residency analysis

Primary remains `africa-south1`. Any selected cross-region replica stores Production database data **outside** Johannesburg continuously.

| Class | What |
| --- | --- |
| **Required cross-region Production data** (selected architecture) | Cloud SQL designated DR replica contents (asynchronously replicated EOS transactional/commercial database state); replica disk / WAL as stored on that instance; during failover, the promoted instance in the secondary region; Cloud Run **recovery** runtime, configuration, and secrets **needed to operate EOS** while `africa-south1` is unavailable |
| **Provider control-plane / global services** | Not asserted as keepable or not keepable in a particular region without specific provider evidence (same discipline as H-159/H-161) |
| **Optional supporting services** | Recovery-environment logs/metrics in the secondary region during an event; not a change to H-161 primary log-storage direction |

H-160 / H-161 / H-162 / H-163 **primary-region** controls are unchanged (§14). This increment does **not** relocate primary backups, primary PITR intent, primary logging, or primary HA.

---

## 11. EOS-wide dependency analysis

| Layer | Selected-architecture intent (not implemented) | Still OPEN / not selected |
| --- | --- | --- |
| Database | Plus primary in `africa-south1` with H-163 regional HA; designated DR replica in selected secondary region; Advanced DR replica failover; PITR/backups remain primary-region directions | Actual instance, replica, HA, PITR, backups **not created** |
| Application | Primary Cloud Run remains `africa-south1` (H-158). **DR runtime:** Cloud Run **must be deployable** in the selected secondary region so EOS can resume if Johannesburg compute is unavailable. This is **DR runtime**, not a move of primary. | No Cloud Run service created |
| Access | Operator access and service identity must work in the recovery environment | ADR-0013 IdP **OPEN**; IAM not configured |
| Secrets | Recovery environment needs secrets/config | ADR-0012 **OPEN** |
| Networking | Private connectivity + write endpoint (Plus) for DB; Cloud Run ingress in recovery region | Not designed/configured |
| Observability | Primary log storage remains `africa-south1` (H-161). Recovery-environment observability required during an event | Not configured |
| Commercial continuity | Pipeline, proposals, costing, programmes, operator tasks resume only if **app + DB + access** recover together (H-165 domains). SoR remains Office/Excel/Outlook-Gmail/WhatsApp/phone until a separate cutover. | Not tested |

---

## 12. Cost categories (no totals)

Later confirmation required ([Cloud SQL pricing](https://cloud.google.com/sql/pricing); [About replication](https://cloud.google.com/sql/docs/postgres/replication)):

- primary Cloud SQL (Enterprise Plus vs Enterprise **rate difference** is documented as existing; **no figure recorded**);
- DR Cloud SQL replica (billed as a standalone instance);
- Enterprise Plus premium if used;
- replica compute and storage;
- network egress / cross-region **replication-log transfer**;
- backups; PITR; Cloud Run (primary and DR runtime);
- DNS; logging; monitoring; DR testing.

Relative structure only: a continuously running replica costs **in addition to** the primary; Plus is a different tier from Enterprise; cross-region transfer is an extra category. **No unsupported total-cost estimate.**

---

## 13. POA architecture decision

The Owner/Principal has granted POA to act in the best interests of Serengeti Experience DMC.

**Justification (not a score):**

1. **RTO ≤ 4 hours:** replica-based DR is documented as faster than recreating a database; Advanced DR replica failover is documented as immediate for the DB; write endpoint reduces application-DB reconnect work. Backup/restore is documented as slower and does not demonstrate full-stack RTO.
2. **RPO ≤ 1 hour:** async replica lag is the only documented path that can **plausibly** stay within 1 hour **if later measured**; daily backups do not demonstrate it. Disaster failover is **not** claimed as zero-loss.
3. **Residency:** no second African Cloud SQL region exists; H-168 already approved a controlled exception **in principle**.
4. **Provider support:** Johannesburg and Belgium both list Cloud SQL PostgreSQL **and** Enterprise Plus **N2**; Advanced DR is a documented Plus feature.
5. **Operational recoverability:** Advanced DR documents replica failover, write endpoint, and **switchover failback** to the original topology with zero data loss when both regions are healthy — matching the H-169 fallback objective better than regular replica promotion plus manual rebuild.
6. **EOS-wide:** DB-only failover is insufficient; the selected architecture includes a **DR Cloud Run runtime** in the same secondary region.
7. **Commercial practicality:** a continuously running designated replica plus Plus is accepted as the **architectural** cost of meeting regional-outage RTO/RPO; purchase is **not** made here.

Not selected merely because it is technically possible. Option 3 is rejected for the regional-outage clock. Option 1 remains technically viable but is **not** selected because it lacks documented write-endpoint / switchover failback of Advanced DR.

### A. Secondary region

**SELECTED: `europe-west1` (Belgium).**

### B. DR architecture

**SELECTED: Cloud SQL Enterprise Plus Advanced DR with a designated DR replica.**

`me-west1` remains a **documented alternative not selected**. It supports Plus N2 and is geographically nearer (**inference**), but Belgium provides a fully documented Enterprise footprint without the footnote-1 Enterprise vCPU limits, Plus N2+C4A on the DR side, and clear continental separation from Johannesburg. `europe-west4` is the same residency class and is **not** selected.

---

## 14. Selected secondary region

```text
PRIMARY REGION   = africa-south1 — Johannesburg, South Africa
SECONDARY REGION = europe-west1 — Belgium
```

Purpose: **regional-outage DR only**. Not a second primary. Not a general workload shift.

---

## 15. Selected DR mechanism

```text
DR ARCHITECTURE = Cloud SQL Enterprise Plus Advanced DR
                  with designated cross-region DR replica in europe-west1
```

Future implementation shape (**not configured now**):

- Primary Cloud SQL PostgreSQL, Enterprise Plus, **N2** series, regional HA (H-163), in `africa-south1`.
- Designated DR replica, same machine series, in `europe-west1`.
- Replica failover for a declared complete `africa-south1` outage.
- Write endpoint for DB connection retargeting where the documented private-IP/write-endpoint conditions are met.
- Switchover failback to `africa-south1` when Johannesburg is available.
- Primary Cloud Run remains `africa-south1`; **DR Cloud Run runtime** in `europe-west1`.
- Automatic cross-region failover remains **not** a blanket authorization: Advanced DR replica failover is an **invoked** operation per provider docs; H-164’s “automatic cross-region failover not authorized” is refined to: **no untested automatic production cutover**; the selected mechanism is **documented replica failover / switchover**, implemented only after later grants and tests.

---

## 16. Selected Cloud SQL edition

```text
Cloud SQL edition = Enterprise Plus — POA SELECTED FOR FUTURE PRODUCTION ARCHITECTURE
```

This is **architectural only**. It is **not** instance creation, **not** a purchase, **not** licensing/contract completion, **not** an SLA claim for EOS.

**Implementation constraint (documented):** pair primary and DR replica on **N2**, because that series is listed for Enterprise Plus in **both** `africa-south1` and `europe-west1`.

---

## 17. Refined residency exception

H-168 in-principle exception is **refined**, not widened into a blanket approval:

| Element | Refined value |
| --- | --- |
| Primary | `africa-south1` |
| Secondary | `europe-west1` |
| Purpose | Regional-outage DR only |
| Data categories | Asynchronously replicated Cloud SQL database state on the designated DR replica; replica storage/WAL on that instance; during failover, promoted DB in `europe-west1`; DR Cloud Run runtime, configuration, and secrets required to operate EOS while Johannesburg is unavailable; recovery-environment logs/metrics generated in the secondary region during an event |
| Duration | Only as required for DR operation and failover; not a standing relocation of primary |
| Fallback | Return to Johannesburg (`africa-south1`) remains the intended post-recovery objective unless a later Owner decision changes it |

The exception does **not** relocate H-160 primary backups, H-161 primary log storage, H-162 intended primary PITR storage, or H-163 primary HA. It does **not** approve arbitrary EU processing, a DPA, or legal compliance.

---

## 18. Preserve primary-region controls

Unchanged:

| Record | Direction | Implementation |
| --- | --- | --- |
| H-160 | Custom backup location `africa-south1` | OPEN |
| H-161 | Cloud Logging storage `africa-south1` | OPEN |
| H-162 | Intended PITR `africa-south1`, provider evidence required | OPEN |
| H-163 | Regional HA `africa-south1` | OPEN |

---

## 19. DR fallback

When Johannesburg becomes available again, EOS should be capable of returning to the primary deployment state in `africa-south1` in a **controlled** manner.

**Documented provider behaviour** for the selected architecture: Advanced DR **switchover** can restore original roles with **zero data loss** when both instances are online and lag reaches zero.

**Not claimed:** zero-data-loss for **disaster replica failover**. Fallback is **not implemented**.

---

## 20. Implementation prerequisites (not executed)

H-166 sequence is **not** collapsed. Still required before Production approval:

- provider/configuration evidence for the actual Plus + N2 + replica + write-endpoint design;
- documented data categories (already listed; must be confirmed on the real system);
- DPA/contract/legal review for `europe-west1` (H-168 condition 11);
- secrets/KMS (ADR-0012), IdP (ADR-0013), networking, IAM;
- DR Cloud Run design in `europe-west1`;
- operational ownership and runbook;
- **named Production implementation grant**;
- controlled DR test;
- **measured** RTO ≤ 4 hours and RPO ≤ 1 hour;
- fallback/return-to-normal test;
- subsequent Production authorization.

None of these is performed here.

---

## 21. Production blocker update

No blocker is closed by architecture selection.

### Item 24 — Rollback / DR

**OPEN.** Secondary region **selected** (`europe-west1`). DR architecture **selected** (Enterprise Plus Advanced DR). Implementation **not authorized**. Provider/configuration evidence **outstanding**. Controlled DR testing **outstanding**. Measured RTO/RPO **outstanding**.

| # | Gate | After H-169 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected including DR topology; implementation/evidence **OPEN** |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160; **OPEN** |
| 15 | Restore / PITR evidence | **OPEN** until actual recovery evidence exists |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN** (includes later `europe-west1` DPA/contract review) |
| 22 | Observability / logging | H-161; **OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN** — region and architecture selected; not implemented; not tested; not measured |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

Production is **not** READY.

---

## 22. ADR-0006 additive status

Historical `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION

Primary region:              africa-south1
Secondary region (H-169):    europe-west1
DR mechanism (H-169):        Cloud SQL Enterprise Plus Advanced DR
                             with designated DR replica
Cloud SQL edition (H-169):   Enterprise Plus
                             (architectural selection only; not purchased)
Residency exception:         refined to the selected DR architecture
Implementation:              NOT AUTHORIZED
Production readiness:        NOT READY
RTO / RPO:                   ≤ 4 hours / ≤ 1 hour
```

---

## 23. DP-0006 additive status

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Selected architecture/provider direction is recorded. Contract, DPA, procurement, and implementation are **not** complete.

---

## 24. Explicit non-authorizations

Even after selecting the architecture, H-169 does **NOT** authorize:

- GCP project creation;
- GCP resource creation;
- Cloud SQL instance creation;
- Cloud SQL replica creation;
- Cloud SQL edition provisioning;
- Enterprise Plus purchase;
- Production data replication;
- backup configuration;
- PITR configuration;
- HA configuration;
- Cloud Run deployment;
- DNS changes;
- IAM changes;
- KMS changes;
- Secret Manager changes;
- network changes;
- Production credentials;
- Production deployment;
- DR testing;
- Production cutover.

```text
No GCP resources were created.
No Production data was moved or replicated.
Application code unchanged.
Database schema unchanged.
Migration 126 not created.
Live migration not run.
Controlled DR test not performed.
Measured RTO not available.
Measured RPO not available.
Production remains NOT AUTHORIZED / NOT READY.
```

---

## 25. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 663 → 664 |
| Files changed this increment | `docs/governance/h-169-production-dr-architecture-selection.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-169
H-170 NOT CREATED
```
