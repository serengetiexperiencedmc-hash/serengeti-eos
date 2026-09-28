# H-165 — POA Decision: Production EOS RTO/RPO Acceptance-Criteria Gate

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA requirement that Production EOS disaster recovery must be evaluated against explicit Recovery Time Objective (RTO) and Recovery Point Objective (RPO) requirements, and that **no RTO or RPO value** shall be invented, inferred from provider capabilities, inferred from UAT, or selected merely for technical convenience.  
> **NOT** selection of numerical RTO/RPO values. **NOT** selection of a secondary region, DR country, Cloud SQL edition, cross-region replica, automatic failover, or residency exception. **NOT** authorization to deploy or configure GCP. **NOT** a DR implementation or DR test.  
> H-154 through H-164, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 659  
**Porcelain after this increment:** 660 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / HA / replica / backup / PITR / logging / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-166:** **NOT CREATED**

```text
H-165 STATUS = COMPLETE — RTO/RPO ACCEPTANCE-CRITERIA GATE RECORDED, NO NUMERICAL VALUES APPROVED, DR ARCHITECTURE NOT SELECTED
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
| Porcelain at start | 659 (matches H-164 after-count) |
| Prior increment | H-164 created only `docs/governance/h-164-production-disaster-recovery-policy-owner-decision.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |

Records read and **not rewritten:** H-154, H-157, H-158, H-159, H-160, H-161, H-162, H-163, H-164; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

H-154 item 24 remains **OPEN**. H-164 defined DR **policy** and acceptance criteria without selecting architecture. This increment adds RTO/RPO as a **mandatory prerequisite** before architecture selection.

---

## 2. POA authority

The Owner/Principal is exercising POA. This increment captures a **governance gate only**. It does **not** approve numerical RTO or RPO values, does **not** select a technical DR architecture, does **not** authorize a residency exception, and does **not** configure any recovery resource.

---

## 3. Owner RTO/RPO decision

> Production EOS disaster recovery must be evaluated against explicit Recovery Time Objective (RTO) and Recovery Point Objective (RPO) requirements. No RTO or RPO value shall be invented, inferred from provider capabilities, inferred from UAT, or selected merely for technical convenience.

H-165 therefore establishes RTO/RPO as a **mandatory prerequisite** to selecting:

- the secondary DR region;
- cross-region replication;
- backup/restore DR;
- Advanced DR;
- Cloud SQL edition;
- automatic/manual failover;
- other Production DR architecture.

No numerical RTO or RPO value is selected by H-165.

---

## 4. RTO policy

Recovery Time Objective is a required Production DR acceptance criterion.

RTO answers:

> How long can SEDMC tolerate EOS being unavailable after a qualifying regional disaster before meaningful commercial operations must resume?

This is a **business/operational acceptance requirement**, not merely a Cloud SQL configuration value. H-165 does **not** answer the question numerically.

---

## 5. RTO value status

```text
RTO VALUE: NOT YET OWNER-APPROVED
```

No number is recorded.

This increment does **not** infer an RTO from:

- UAT;
- current application performance;
- Cloud SQL documentation;
- GCP SLA;
- historical commercial operations;
- generic industry practice;
- personal judgement;
- assumed client expectations.

---

## 6. RPO policy

Recovery Point Objective is a required Production DR acceptance criterion.

RPO answers:

> How much committed EOS commercial data loss, measured in time, can SEDMC tolerate following a qualifying regional disaster?

This is a **business/operational acceptance requirement**, not merely a Cloud SQL configuration value. H-165 does **not** answer the question numerically.

---

## 7. RPO value status

```text
RPO VALUE: NOT YET OWNER-APPROVED
```

No number is recorded.

This increment does **not** infer an RPO from:

- PITR capability;
- backup frequency;
- replication lag;
- Cloud SQL documentation;
- UAT;
- application behaviour;
- generic industry practice;
- assumed client expectations.

Provider capabilities and company requirements are **different things**. Technical capabilities are evidence **against** a later requirement; they do **not** establish the requirement.

---

## 8. RTO measurement requirements

Future RTO approval must define:

### RTO measurement point

What event starts the recovery clock?

Examples may be documented as possibilities only; **none is selected** by H-165:

- declared regional outage;
- Production service unavailable;
- Owner declares disaster.

### RTO completion point

What constitutes “recovered”?

Examples; **none is selected** by H-165:

- EOS accessible;
- authentication operational;
- core commercial records accessible;
- new commercial transaction can be performed.

Do **not** invent the answers now.

---

## 9. RPO measurement requirements

Future RPO approval must define:

- what data state is considered recoverable;
- what timestamp establishes the recovery point;
- what commercial transactions are considered committed;
- how recovered data integrity is validated.

Do **not** invent the answers now.

---

## 10. EOS commercial continuity scope

The future RTO/RPO decision must cover at least the EOS Production functions that matter to commercial continuity. These are **assessment domains**, **not** numerical targets, and **not** a priority ranking. Additional business-critical functions are **not** invented here.

### Commercial pipeline

- opportunities;
- RFPs;
- accounts;
- programmes;
- commercial activities/tasks.

### Proposal operations

- proposal generation;
- costing;
- supplier/rate information;
- Rate Identity/commercial controls.

### Operational continuity

- active programmes;
- operational commercial records;
- field/operational information that EOS legitimately retains.

### Authentication/access

- operator access;
- roles;
- tenant isolation;
- required identity dependencies.

### Supporting infrastructure

- database;
- application runtime;
- required object/document storage;
- notifications where Production architecture retains them.

---

## 11. Dependency of RTO/RPO on DR architecture

```text
RTO/RPO approval
  → DR architecture selection
  → secondary-region decision
  → Cloud SQL edition decision
  → implementation
  → DR test
  → Production readiness
```

This order **must not** be reversed.

> The company must not select Enterprise Plus, a cross-region replica, a secondary region, or an automatic failover mechanism merely because those capabilities exist.

Technical capabilities are evidence against the requirement; they do **not** establish the requirement.

---

## 12. Residency-exception continuity (H-164 preserved)

H-164 remains authoritative:

> Any DR architecture requiring Production data, replication, backup, recovery, or related persistent storage outside `africa-south1` requires explicit Owner approval as a residency exception.

H-165 does **not** approve that exception. No destination region is selected.

```text
CROSS-REGION RESIDENCY EXCEPTION: OPEN
```

---

## 13. DR architecture status

```text
DR architecture: NOT SELECTED
```

Candidate mechanisms remain unselected, including:

- cross-region read replica;
- backup/restore-based DR;
- Advanced DR;
- other supported recovery mechanisms.

None is ranked. None is selected. None is called superior.

Automatic cross-region failover remains **not authorized** (H-164).

---

## 14. Cloud SQL edition status

```text
Cloud SQL edition: NOT SELECTED
```

The edition decision must follow:

1. approved RTO;
2. approved RPO;
3. approved residency policy;
4. selected DR architecture;
5. provider capability evidence;
6. cost/operational review.

H-165 does **not** select Enterprise, Enterprise Plus, or any other edition. Advanced DR is **not** assumed. This increment is **not** a pricing decision.

---

## 15. Current primary architecture (unchanged)

H-165 does **not** modify these decisions.

| Component | Current Owner direction |
| --- | --- |
| Cloud Run | `africa-south1` (H-158) |
| Cloud SQL PostgreSQL | `africa-south1` (H-158) |
| Regional HA | regional HA within `africa-south1` (H-163) |
| Standard backups | custom `africa-south1` (H-160) |
| PITR | intended `africa-south1`, provider evidence required (H-162) |
| Cloud Logging storage | `africa-south1` (H-161) |
| Cross-region DR | **OPEN** (H-164 policy; architecture not selected) |

None of these is implementation-complete.

---

## 16. H-160 continuity

H-160 is **preserved unchanged** and remains authoritative for backup residency.

H-160: Production Cloud SQL **standard backups** must use custom `africa-south1`. Default nearest-multi-region backup storage is **not accepted**. Implementation/evidence remains **OPEN**. Not configured.

---

## 17. H-161 continuity

H-161 is **preserved unchanged** and remains authoritative for Cloud Logging storage.

H-161: Production EOS Cloud Logging **storage** → `africa-south1`. Implementation/evidence remains **OPEN**. Broader logging / Monitoring / control-plane / query / export residency questions remain **OPEN**. Not configured.

H-157 PDPC boundary remains: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim.

---

## 18. H-162 continuity

H-162 is **preserved unchanged** and remains authoritative for PITR direction.

H-162: Production PITR transaction-log storage is **intended** to remain in `africa-south1`, where supported, subject to provider/implementation confirmation. Actual PITR storage remains **unestablished**. Implementation/evidence remains **OPEN**. Not configured.

PITR capability is **not** an Owner-approved RPO.

---

## 19. H-163 continuity

H-163 is **preserved unchanged** and remains authoritative for regional HA.

H-163: Production Cloud SQL PostgreSQL shall use **regional HA** within `africa-south1`. Implementation/evidence remains **OPEN**. Not configured.

H-163 does **not** satisfy the complete regional DR requirement. HA is not DR. Regional HA is not an RTO.

---

## 20. H-164 continuity

H-164 is **preserved unchanged** and remains authoritative for regional-disaster **policy**.

H-164: EOS Production must have an explicitly documented recovery strategy for a complete `africa-south1` regional outage before Production readiness can be considered complete. Technical recovery architecture is **not** selected. Automatic cross-region failover is **not authorized**. DR testing policy remains: DR cannot be treated as implemented merely because a secondary resource exists.

H-165 **adds** the RTO/RPO acceptance-criteria gate as a **prerequisite** to architecture selection. It does **not** replace H-164.

---

## 21. Production blocker reconciliation

H-154’s 28-blocker inventory remains authoritative. **No new blocker number is created.** H-165 changes only the **governance interpretation** of item 24. Item 24 remains **OPEN**.

### Item 24 — Rollback / DR

**OPEN — RTO/RPO acceptance criteria are now a mandatory prerequisite; no numerical RTO/RPO values are approved and no DR architecture is selected.**

| # | Gate | After H-165 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; **not fully closed**. H-163 regional HA direction remains; **implementation/evidence OPEN**. |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160 custom `africa-south1` direction; **implementation/evidence OPEN** |
| 15 | Restore / PITR evidence | **OPEN**. H-162 intended PITR `africa-south1`; provider evidence and configuration OPEN. Restore drill still absent. |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN** |
| 22 | Observability / logging | H-161 `africa-south1` log-storage direction; **implementation/evidence OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN — RTO/RPO acceptance criteria are now a mandatory prerequisite; no numerical RTO/RPO values are approved and no DR architecture is selected.** H-164 policy remains. Residency exception OPEN. Automatic cross-region failover not authorized. |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

Production is **not** marked READY. Item 24 is **not** closed: a gate is not an approved value, an approved value is not an architecture, and an architecture is not tested recovery.

---

## 22. ADR-0006 reconciliation

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
RTO/RPO acceptance criteria:       mandatory prerequisite (H-165); values NOT OWNER-APPROVED
Cross-region DR architecture:      NOT YET SELECTED
Cross-region residency exception:  OPEN
```

No Production implementation is authorized.

---

## 23. DP-0006 reconciliation

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Provider implementation has **not** occurred. H-165 adds the RTO/RPO **acceptance-criteria gate**; it is **not** an approved RTO, **not** an approved RPO, **not** a selected DR architecture, and **not** completed DR evidence.

ADR-0012 and ADR-0013 remain OPEN as previously recorded.

---

## 24. No-implementation / no-GCP-resource / Production status statements

```text
No GCP resources were created.
No RTO value was recorded or inferred.
No RPO value was recorded or inferred.
DR is not implemented.
No secondary region was selected.
No Cloud SQL edition was selected.
No cross-region replica was created.
No HA, backup, PITR, logging, networking, IAM, or KMS configuration was applied.
Automatic cross-region failover is not authorized.
Production remains NOT AUTHORIZED / NOT READY.
```

Application code unchanged. Database schema unchanged. Migration 126 not created. Live migration not run. No credentials used. No DNS change. No Production deployment. No DR test performed.

---

## 25. Future decision requirements (not executed)

Do **not** begin H-166 in this increment. Later Owner/implementation work (without preference implied as authorization) must still establish:

- Owner-approved RTO value, including measurement start and completion definitions;
- Owner-approved RPO value, including recoverable state, timestamp, committed-transaction definition, and integrity validation;
- selected technical DR architecture (only after RTO/RPO);
- whether a cross-region residency exception is approved;
- secondary region / country **only if** a cross-region design is later selected and authorized;
- Cloud SQL edition required by that architecture (only after RTO/RPO, residency policy, and architecture);
- recovery procedure, execution evidence, data validation, application reconnection;
- operational ownership, measured recovery time/point, failback/re-establishment, evidence retention;
- Artifact Registry location;
- Secret Manager / Cloud KMS location (ADR-0012 still OPEN);
- DPA / subprocessors / Legal review;
- Production authorization grant (only after evidence, not now).

None of these is performed here.

---

## 26. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 659 → 660 |
| Files changed this increment | `docs/governance/h-165-eos-rto-rpo-acceptance-criteria-owner-decision.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-165
H-166 NOT CREATED
```
