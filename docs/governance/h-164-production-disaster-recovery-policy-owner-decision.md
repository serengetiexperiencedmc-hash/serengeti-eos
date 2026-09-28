# H-164 — POA Decision: Production Disaster-Recovery Policy and Acceptance Criteria

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA **policy** that Production EOS must have a defined disaster-recovery strategy for a complete `africa-south1` regional outage, and the **acceptance criteria** for later DR readiness.  
> **NOT** selection of a secondary region, DR country, Cloud SQL edition, cross-region replica, automatic cross-region failover, or residency exception. **NOT** authorization to deploy or configure GCP. **NOT** a DR implementation or DR test.  
> H-154 through H-163, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 658  
**Porcelain after this increment:** 659 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / HA / replica / backup / PITR / logging / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-165:** **NOT CREATED**

```text
H-164 STATUS = COMPLETE — DR POLICY AND ACCEPTANCE CRITERIA RECORDED, ARCHITECTURE NOT SELECTED, NOT IMPLEMENTED
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
| Porcelain at start | 658 (matches H-163 after-count) |
| Prior increment | H-163 created only `docs/governance/h-163-cloud-sql-regional-ha-owner-decision.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |

Records read and **not rewritten:** H-154, H-157, H-158, H-159, H-160, H-161, H-162, H-163; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

H-154 item 24 remains **OPEN** (Rollback/DR procedure on Production topology). H-163 selected regional HA and explicitly did **not** close item 24.

---

## 2. POA authority

The Owner/Principal is exercising POA. This increment captures a **governance policy and acceptance-criteria decision only**. It does **not** select a technical DR architecture, does **not** authorize a residency exception, and does **not** configure any recovery resource.

---

## 3. Owner DR policy decision

> Production EOS must have a defined disaster-recovery strategy for a complete `africa-south1` regional outage. However, no secondary DR region, cross-region replica, Cloud SQL edition, automatic cross-region failover mechanism, or cross-region data-residency exception is selected or authorized by H-164.

```text
REGIONAL-DISASTER POLICY (POA):
A complete outage or prolonged unavailability of africa-south1 is a
separate disaster-recovery scenario from a zonal outage.

EOS Production must have an explicitly documented recovery strategy
for a complete regional outage before Production readiness can be
considered complete.

H-164 does NOT select the technical recovery architecture.
```

H-163 already establishes regional Cloud SQL HA for zonal/infrastructure failures **within** `africa-south1`. H-163 does **not** satisfy the complete regional DR requirement.

---

## 4. Intended primary-region architecture (unchanged)

| Component | Owner direction | Implementation |
| --- | --- | --- |
| Cloud Run | `africa-south1` (H-158) | OPEN |
| Cloud SQL PostgreSQL | `africa-south1` (H-158) | OPEN |
| Cloud SQL HA | regional HA within `africa-south1` (H-163) | OPEN |
| Standard backups | custom `africa-south1` (H-160) | OPEN |
| PITR transaction-log storage | intended `africa-south1`, subject to evidence (H-162) | OPEN |
| Cloud Logging storage | `africa-south1` (H-161) | OPEN |
| Cross-region DR | **REQUIRED FOR ARCHITECTURAL ASSESSMENT, NOT YET SELECTED** (this increment) | OPEN |

None of these is implementation-complete.

---

## 5. Cross-region DR status

```text
CROSS-REGION DR: REQUIRED FOR ARCHITECTURAL ASSESSMENT, NOT YET SELECTED
```

The following remain **OPEN**. None is selected by H-164:

- secondary region;
- secondary country;
- cross-region read replica;
- backup/restore-based DR;
- advanced DR;
- automatic versus manual failover;
- failback architecture;
- application endpoint/connection failover;
- DNS failover;
- DR networking;
- DR IAM;
- DR secrets;
- DR KMS;
- DR observability;
- DR testing;
- DR operational ownership.

This increment does **not** claim DR exists, that DR has been tested, or that a secondary region has been selected.

---

## 6. RTO / RPO policy

> Production RTO and RPO have not been Owner-approved and therefore must not be inferred from Cloud SQL capabilities, historical UAT behaviour, or generic industry practice.

Do **not** invent values. This increment provides **no** number.

Provider capabilities and company requirements are **different things**. Google-documented technical RPO characteristics are **not** SEDMC’s business requirement.

The future Owner decision must establish at minimum:

### RTO

How quickly EOS must resume meaningful Production operation after a regional outage.

### RPO

How much committed commercial data loss, measured in time, is acceptable after a regional outage.

No RTO or RPO is claimed here. None is inferred from application characteristics.

---

## 7. Data-residency policy

The existing architecture deliberately selects `africa-south1` for Cloud Run, Cloud SQL, standard backups, intended PITR storage, and Cloud Logging storage.

> Any Production DR design that requires storage, replication, backup, recovery, logging, or operational processing outside `africa-south1` requires explicit Owner approval as a residency exception before implementation.

```text
CROSS-REGION RESIDENCY EXCEPTION: OPEN
```

This increment does **not** conclude that cross-region DR is prohibited.  
This increment does **not** conclude that cross-region DR is approved.

The existing H-160 / H-161 / H-162 / H-163 position remains:

> A Johannesburg regional outage does not automatically authorize restore into another region.

---

## 8. HA versus DR (H-163 preserved)

H-163 remains authoritative for regional HA. H-164 does **not** change H-163.

### HA (H-163)

Cloud SQL regional HA: `africa-south1`

Purpose:

- zonal failure;
- certain infrastructure failures;
- automatic regional-instance failover (within `africa-south1`, when later configured).

### DR (this increment — policy only)

Purpose:

- complete regional failure;
- prolonged regional unavailability;
- recovery outside the primary region **if** that is the later-selected strategy.

```text
H-163 does NOT satisfy the complete regional DR requirement.
H-164 keeps DR architecture OPEN.
```

HA and DR remain separate controls.

---

## 9. Continuity of H-160 / H-161 / H-162 / H-163

| Record | Preserved |
| --- | --- |
| H-160 | Production Cloud SQL standard backups → custom `africa-south1`. Implementation/evidence **OPEN**. Not configured. |
| H-161 | Production EOS Cloud Logging storage → `africa-south1`. Implementation/evidence **OPEN**. Broader Monitoring/control-plane/query/export residency **OPEN**. Not configured. |
| H-162 | Intended PITR transaction-log storage `africa-south1`, subject to provider/implementation confirmation. Actual location unestablished. Not configured. |
| H-163 | Regional Cloud SQL HA within `africa-south1`. Implementation/evidence **OPEN**. Not configured. Edition still **OPEN**. |

H-157 PDPC boundary remains: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim.

---

## 10. Cloud SQL edition

```text
Cloud SQL edition: OPEN
```

H-164 does **not** select Enterprise, Enterprise Plus, or any other edition. Advanced DR is **not** assumed. The DR discussion is **not** a pricing decision. The eventual edition decision must follow the approved DR policy and technical requirements.

---

## 11. Possible DR architectures — information only

These are **candidate** architectures. **None is selected. None is ranked. None is called the best.**

### Option A — Cross-region read replica

Potentially provides faster regional recovery but introduces:

- another region;
- cross-region replication;
- potential non-zero RPO;
- additional infrastructure;
- residency implications.

### Option B — Backup/restore DR

Potentially simpler but recovery may take longer and requires:

- recovery environment;
- backup accessibility;
- restore procedure;
- validation;
- operational runbook.

### Option C — Advanced DR

Potentially provides additional Cloud SQL DR capabilities, but edition and feature requirements must first be established.

### Option D — Another supported architecture

May be considered if later evidence identifies a better fit.

Listing these options is **not** authorization to implement any of them.

---

## 12. DR failover policy

```text
Automatic cross-region failover: NOT AUTHORIZED BY H-164
```

Any future automatic cross-region failover would require:

- explicit Owner approval;
- selected secondary region;
- approved RTO/RPO;
- approved residency exception;
- tested application connectivity;
- tested secrets/IAM;
- tested DNS/routing;
- tested data integrity;
- operational ownership;
- rollback/failback procedure.

No implementation now.

---

## 13. DR testing policy and acceptance criteria

> Production DR cannot be treated as implemented merely because a secondary resource exists.

Future DR readiness requires evidence of:

- recovery procedure;
- recovery execution;
- data validation;
- application reconnection;
- operational ownership;
- measured recovery time;
- measured recovery point;
- failback or re-establishment procedure;
- evidence retention.

No DR test is performed in this increment. No RTO or RPO measurement is claimed.

---

## 14. Production blocker reconciliation

H-154’s 28-blocker inventory remains authoritative. **No new blocker number is created.** H-164 changes the **governance interpretation** of item 24 only. Item 24 remains **OPEN**.

### Item 24 — Rollback / DR

**OPEN — DR policy defined by H-164, technical DR architecture not selected or implemented.**

| # | Gate | After H-164 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; **not fully closed**. H-163 regional HA direction remains; **implementation/evidence OPEN**. |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160 custom `africa-south1` direction; **implementation/evidence OPEN** |
| 15 | Restore / PITR evidence | **OPEN**. H-162 intended PITR `africa-south1`; provider evidence and configuration OPEN. Restore drill still absent. |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN**. DR policy does **not** close operational ownership. |
| 22 | Observability / logging | H-161 `africa-south1` log-storage direction; **implementation/evidence OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN — DR policy defined by H-164, technical DR architecture not selected or implemented.** RTO/RPO not Owner-approved. Residency exception OPEN. Automatic cross-region failover not authorized. |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

Production is **not** marked READY. Item 24 is **not** closed: policy is not architecture, architecture is not implementation, and implementation is not tested recovery.

---

## 15. ADR-0006 reconciliation

Historical `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION

Cloud Run:                         africa-south1
Cloud SQL PostgreSQL:              africa-south1
Cloud SQL HA:                      regional HA within africa-south1
Standard backups:                  custom africa-south1
PITR transaction-log storage:      intended africa-south1, subject to provider evidence
Cloud Logging storage:             africa-south1
Regional-outage DR policy:         required before Production readiness (H-164)
Cross-region DR architecture:      NOT YET SELECTED
Cross-region residency exception:  OPEN
```

---

## 16. DP-0006 reconciliation

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Provider implementation has **not** occurred. H-164 adds DR **policy and acceptance criteria**; it is **not** a selected DR architecture and **not** completed DR evidence.

ADR-0012 and ADR-0013 remain OPEN as previously recorded.

---

## 17. No-implementation / no-GCP-resource / Production status statements

```text
No GCP resources were created.
DR is not implemented.
No secondary region was selected.
No cross-region replica was created.
No Cloud SQL instance, HA, backup, PITR, logging, networking, IAM, or KMS configuration was applied.
Automatic cross-region failover is not authorized.
Production remains NOT AUTHORIZED / NOT READY.
```

Application code unchanged. Database schema unchanged. Migration 126 not created. Live migration not run. No credentials used. No DNS change. No Production deployment. No DR test performed.

---

## 18. Future evidence / decision requirements (not executed)

Do **not** begin H-165 in this increment. Later Owner/implementation work (without preference implied as authorization) must still establish:

- Owner-approved RTO;
- Owner-approved RPO;
- selected technical DR architecture (or an explicit Owner decision that a listed option is accepted);
- Cloud SQL edition required by that architecture;
- whether a cross-region residency exception is approved;
- secondary region / country **only if** a cross-region design is later selected and authorized;
- recovery procedure, execution evidence, data validation, application reconnection;
- operational ownership, measured recovery time/point, failback/re-establishment, evidence retention;
- Artifact Registry location;
- Secret Manager / Cloud KMS location (ADR-0012 still OPEN);
- DPA / subprocessors / Legal review;
- Production authorization grant (only after evidence, not now).

None of these is performed here.

---

## 19. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 658 → 659 |
| Files changed this increment | `docs/governance/h-164-production-disaster-recovery-policy-owner-decision.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-164
H-165 NOT CREATED
```
