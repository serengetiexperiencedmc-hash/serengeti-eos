# H-168 — POA Decision: Controlled Cross-Region Production DR Residency Exception

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA **controlled architectural exception**, **approved in principle and subject to future architecture and evidence gates**, that Production EOS may be architected with a potential DR copy of required Production data in a region outside `africa-south1` **if and only if** that cross-region placement is necessary to satisfy the approved Production DR requirement for a complete `africa-south1` regional outage.  
> **NOT** a blanket Production data-residency approval. **NOT** secondary-region selection. **NOT** Cloud SQL edition selection. **NOT** architecture selection. **NOT** implementation. **NOT** GCP provisioning. **NOT** Production authorization.  
> H-158 through H-167, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 662  
**Porcelain after this increment:** 663 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / HA / replica / backup / PITR / logging / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-169:** **NOT CREATED**

```text
H-168 STATUS = COMPLETE — CONTROLLED CROSS-REGION DR RESIDENCY EXCEPTION APPROVED IN PRINCIPLE; IMPLEMENTATION NOT AUTHORIZED
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
| Porcelain at start | 662 (matches H-167 after-count) |
| Prior increment | H-167 created only `docs/governance/h-167-production-dr-architecture-rto-rpo-assessment.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |
| RTO ≤ 4 hours | Owner-approved (H-166) |
| RPO ≤ 1 hour | Owner-approved (H-166) |
| DR architecture | **NOT SELECTED** |
| Secondary region | **NOT SELECTED** |
| Cloud SQL edition | **OPEN** / **NOT SELECTED** |
| Cross-region residency exception **before this increment** | **NOT APPROVED** (H-167) |

Records read and **not rewritten:** H-158, H-159, H-160, H-161, H-162, H-163, H-164, H-165, H-166, H-167; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

---

## 2. H-167 reconciliation

H-167 is **preserved unchanged**. It assessed candidates A (backup/restore), B (cross-region read replica), and C (Cloud SQL Advanced DR) against RTO ≤ 4 hours and RPO ≤ 1 hour. It did **not** select an architecture, a secondary region, or an edition.

H-167 established, as the factual basis for this exception:

- in-region recovery cannot presently demonstrate recovery from a complete regional outage while `africa-south1` is unavailable;
- cross-region read-replica DR requires a separate region;
- Cloud SQL Advanced DR requires a cross-region DR replica;
- the Owner has already approved RTO ≤ 4 hours and RPO ≤ 1 hour (H-166).

H-167 ended with **DR architecture: NOT SELECTED** and **cross-region residency exception: NOT APPROVED**. This increment answers **only** the residency-exception gate, **in principle**, and does **not** collapse the remaining H-166 sequence.

---

## 3. POA authority

The Owner/Principal has expressly granted POA to act in the best interests of Serengeti Experience DMC. This increment captures a **controlled architectural exception** only. It does **not** move Production data, does **not** select a secondary region, does **not** select a Cloud SQL edition, and does **not** authorize implementation.

---

## 4. Approved controlled cross-region residency exception

```text
CONTROLLED CROSS-REGION DR RESIDENCY EXCEPTION:
APPROVED IN PRINCIPLE — SUBJECT TO FUTURE ARCHITECTURE AND EVIDENCE GATES
```

The Owner authorizes Production EOS to be **architected** with a potential DR copy of **required** Production data in a region outside `africa-south1` **if and only if** that cross-region placement is necessary to satisfy the approved Production DR requirement for a complete `africa-south1` regional outage.

This is a **controlled architectural exception**, **not** a blanket Production data-residency approval.

---

## 5. Scope of exception — what it permits

The exception permits **future assessment** and, **only after subsequent approval gates**, possible use of:

- a secondary Cloud SQL region;
- cross-region database replication;
- a designated Cloud SQL DR replica;
- other provider-supported cross-region DR mechanisms that are demonstrated to satisfy the approved RTO/RPO.

H-168 itself does **not** perform any of those uses.

---

## 6. Explicit non-authorizations

The exception does **NOT** itself authorize:

- Production data movement;
- Production replication;
- Production backup relocation;
- Production deployment;
- Production infrastructure;
- GCP resource creation;
- secondary-region selection;
- Cloud SQL edition selection;
- Enterprise Plus selection;
- Advanced DR configuration;
- automatic failover;
- manual failover configuration;
- DNS changes;
- cross-region Cloud Run deployment;
- cross-region logging;
- cross-region secrets;
- cross-region KMS;
- any vendor contract;
- any DPA;
- any Production test.

H-168 also does **NOT** authorize:

- Production deployment;
- GCP project creation;
- GCP resource creation;
- Cloud SQL creation;
- Cloud SQL edition selection;
- Enterprise Plus selection;
- secondary-region selection;
- cross-region replica creation;
- cross-region replication;
- Advanced DR;
- cross-region backup configuration;
- cross-region PITR;
- Cloud Run deployment outside `africa-south1`;
- Production data transfer;
- Production credentials;
- DNS changes;
- network changes;
- IAM changes;
- KMS changes;
- Secret Manager changes;
- Production testing;
- DR testing;
- Production authorization.

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

---

## 7. Primary-region preservation

```text
PRIMARY PRODUCTION REGION = africa-south1 — Johannesburg
```

The primary Production region is **unchanged**. The cross-region exception is a **DR secondary-region exception only**. It must **not** be interpreted as permission to move the primary EOS Production environment outside Johannesburg.

### Governance interpretation

| Concept | Meaning |
| --- | --- |
| **Primary residency rule** | Production primary environment remains in `africa-south1`. |
| **DR exception** | A separately controlled secondary region may be used for Production DR if necessary to satisfy the approved regional-outage DR requirements. |
| **Approval boundary** | H-168 permits architecture assessment and future evidence collection. It does **NOT** approve implementation. |
| **Final Production gate** | No cross-region DR configuration becomes Production-authorized until the complete architecture, provider evidence, residency implications, operational controls, and measured RTO/RPO have been reviewed and approved. |

---

## 8. H-160 / H-161 / H-162 / H-163 reconciliation

These remain the **primary-region controls**. They are **not** altered.

| Record | Preserved direction | Implementation |
| --- | --- | --- |
| H-160 | Production Cloud SQL **standard backups** → custom `africa-south1` | OPEN |
| H-161 | Production Cloud Logging **storage** → `africa-south1` | OPEN |
| H-162 | Intended PITR transaction-log storage → `africa-south1`, subject to provider/implementation evidence | OPEN |
| H-163 | Regional HA within `africa-south1` | OPEN |

H-163 HA remains **zonal / in-region**. It is **not** regional DR and is **not** replaced by this exception.

H-157 PDPC boundary remains: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim.

---

## 9. RTO / RPO requirements

The exception does **not** change the H-166 values. No relaxation is permitted without a new Owner/POA decision.

| Criterion | Status |
| --- | --- |
| RTO | ≤ **4 hours** — mandatory |
| RPO | ≤ **1 hour** — mandatory |

These remain mandatory Production acceptance criteria. The exception is **not** a demonstration that any architecture meets them.

---

## 10. Secondary-region gate

```text
Secondary region = NOT SELECTED
```

The next architecture stage must compare candidate regions against:

- geographic separation from Johannesburg;
- Cloud SQL PostgreSQL availability;
- required Cloud SQL edition availability;
- DR mechanism availability;
- data-residency implications;
- network/connectivity;
- operational support;
- provider documentation;
- cost;
- latency;
- recovery requirements;
- contractual/DPA implications.

That comparison is **not** performed here. No destination country or region is recommended.

---

## 11. Cloud SQL edition gate

```text
Cloud SQL edition = OPEN
Enterprise Plus = NOT SELECTED
Advanced DR = NOT SELECTED
```

H-167 established that Advanced DR is a documented **Enterprise Plus** provider requirement. That is a **provider capability dependency only**. It is **NOT** an Owner selection. H-168 does **not** select Enterprise, Enterprise Plus, or any other edition.

---

## 12. Provider evidence gate — conditions before Production approval

Any eventual cross-region DR architecture must satisfy **ALL** of the following before Production approval. **No one of these conditions is satisfied merely by H-168.**

1. RTO ≤ 4 hours.
2. RPO ≤ 1 hour.
3. Explicitly documented data categories replicated/stored outside `africa-south1`.
4. Exact secondary region identified.
5. Provider residency documentation obtained.
6. Data-location implications understood.
7. Backup/PITR implications understood.
8. Logging/monitoring implications assessed.
9. Secrets/KMS implications assessed.
10. Networking/connectivity implications assessed.
11. Contract/DPA/legal implications assessed where applicable.
12. Operational ownership assigned.
13. Recovery runbook completed.
14. Controlled DR test performed.
15. Actual measured RTO ≤ 4 hours.
16. Actual measured RPO ≤ 1 hour.
17. Fallback/return-to-normal procedure tested.
18. Owner/Production authorization subsequently granted.

H-166 sequence remains mandatory and is **not** collapsed:

```text
POA RTO/RPO approval
  → DR architecture assessment                    (H-167)
  → controlled residency exception in principle   (this increment)
  → candidate architecture selection              (NOT DONE)
  → secondary-region selection                    (NOT DONE)
  → provider capability / evidence validation
  → Production implementation                     (NOT AUTHORIZED)
  → controlled DR test
  → RTO/RPO measurement
  → remediation if target is missed
  → Production readiness reassessment
```

---

## 13. Production blocker update

H-154’s 28-blocker inventory remains authoritative. **No new blocker number.** No blocker is closed merely because the residency exception has been approved **in principle**.

### Item 24 — Rollback / DR

**OPEN.** POA has approved a controlled cross-region residency exception in principle solely for evaluation and potential implementation of regional-outage DR. Secondary region and architecture remain unselected. Implementation, provider evidence, residency assessment, controlled DR testing, and measured RTO/RPO remain outstanding.

| # | Gate | After H-168 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; implementation/evidence **OPEN**. Additive: controlled DR residency exception **in principle**; primary remains `africa-south1`. |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160 custom `africa-south1`; implementation/evidence **OPEN** |
| 15 | Restore / PITR evidence | **OPEN**. H-162 intended PITR `africa-south1`; provider evidence OPEN. |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN**. Contract/DPA implications of any later secondary region remain outstanding. |
| 22 | Observability / logging | H-161 `africa-south1` log-storage; implementation/evidence **OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN.** Controlled cross-region residency exception approved **in principle**. Secondary region and architecture **unselected**. Implementation, provider evidence, residency assessment, controlled DR testing, and measured RTO/RPO **outstanding**. |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

---

## 14. ADR-0006 additive status

Historical `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION

Primary Production region:                         africa-south1
Controlled cross-region DR residency exception:    APPROVED IN PRINCIPLE
Secondary region:                                  NOT SELECTED
DR architecture:                                   NOT SELECTED
Production implementation:                         NOT AUTHORIZED
RTO:                                               ≤ 4 hours
RPO:                                               ≤ 1 hour
```

---

## 15. DP-0006 additive status

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

The cross-region exception does **not** close DP-0006. Provider-specific implementation and contract/DPA evidence remain outstanding. ADR-0012 and ADR-0013 remain OPEN as previously recorded.

---

## 16. Final Production status

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
Production implementation = NOT AUTHORIZED
GCP resources created = NO
```

An in-principle exception is **not** architecture selection. Architecture selection is **not** implementation. Implementation is **not** measured DR evidence. Measured evidence is **not** a Production grant.

---

## 17. Scope boundaries / future work (not executed)

Do **not** begin H-169 in this increment. Do **not** start secondary-region selection, Cloud SQL edition selection, replica creation, Advanced DR, GCP provisioning, Production deployment, DR testing, or Production authorization.

Later work (without preference implied as authorization) must still establish the eighteen conditions in §12 and complete the remaining H-166 sequence.

None of these is performed here.

---

## 18. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 662 → 663 |
| Files changed this increment | `docs/governance/h-168-poa-cross-region-dr-residency-exception.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-168
H-169 NOT CREATED
```
