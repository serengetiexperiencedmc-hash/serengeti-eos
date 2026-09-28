# H-166 — POA Approval of EOS Production RTO/RPO Values and DR Architecture Decision Gate

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA approval of Production EOS **RTO = 4 hours** and **RPO = 1 hour** as business acceptance requirements, and converts those values into a **DR architecture decision gate**.  
> **NOT** a claim that GCP, Cloud SQL, Cloud Run, backups, PITR, or any candidate architecture currently meets these targets. **NOT** selection of a secondary region, DR country, Cloud SQL edition, cross-region replica, automatic failover, or residency exception. **NOT** authorization to deploy or configure GCP. **NOT** a DR implementation or DR test.  
> H-154 through H-165, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 660  
**Porcelain after this increment:** 661 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / HA / replica / backup / PITR / logging / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-167:** **NOT CREATED**

```text
H-166 STATUS = COMPLETE — RTO/RPO VALUES OWNER-APPROVED; DR ARCHITECTURE GATE ESTABLISHED; ARCHITECTURE NOT SELECTED; NOT IMPLEMENTED
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
| Porcelain at start | 660 (matches H-165 after-count) |
| Prior increment | H-165 created only `docs/governance/h-165-eos-rto-rpo-acceptance-criteria-owner-decision.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |
| H-160 | custom `africa-south1` backups; implementation/evidence OPEN |
| H-161 | `africa-south1` Cloud Logging storage; implementation/evidence OPEN |
| H-162 | intended `africa-south1` PITR logs; provider/implementation evidence OPEN |
| H-163 | regional HA within `africa-south1`; implementation/evidence OPEN |
| H-164 | regional-outage DR policy; architecture not selected |
| H-165 | RTO/RPO mandatory gate; values not yet Owner-approved |
| ADR-0006 | SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION (historical file not overwritten) |
| DP-0006 | SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE (historical file not overwritten) |

Records read and **not rewritten:** H-154, H-157, H-158, H-159, H-160, H-161, H-162, H-163, H-164, H-165; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

---

## 2. POA authority

The Owner/Principal is exercising POA to act in the best interests of Serengeti Experience DMC. This increment captures **Owner-approved business acceptance values** and the resulting **architecture gate**. It does **not** prove provider capability, does **not** select a technical DR architecture, does **not** authorize a residency exception, and does **not** configure any recovery resource.

---

## 3. H-165 reconciliation

H-165 is **preserved unchanged**. It established that:

- RTO and RPO are mandatory Production DR acceptance criteria;
- no numerical values would be invented, inferred from provider capabilities, inferred from UAT, or selected merely for technical convenience;
- RTO/RPO approval must precede DR architecture selection.

H-166 **satisfies the H-165 numerical-approval gap** by recording Owner-approved values. It does **not** reverse the H-165 order. Architecture selection, implementation, and DR testing remain **outstanding**.

H-165 commercial-continuity assessment domains remain in force (pipeline, proposal operations, operational continuity, authentication/access, supporting infrastructure). They are **not** re-ranked here.

---

## 4. Approved RTO = 4 hours

```text
PRODUCTION EOS RTO = 4 hours
RTO VALUE: OWNER-APPROVED
```

For a complete Production service disruption requiring DR/recovery, EOS Production should be restored to an operational state within **4 hours**, measured from the formally defined incident/recovery start point to the point at which the required EOS Production functions are operational and usable.

This is a **business acceptance requirement**, not a provider capability statement.

This increment does **not** claim that GCP, Cloud SQL, Cloud Run, or any candidate DR architecture can currently meet this target.

---

## 5. Approved RPO = 1 hour

```text
PRODUCTION EOS RPO = 1 hour
RPO VALUE: OWNER-APPROVED
```

For a Production failure requiring recovery, the maximum acceptable amount of EOS transactional/commercial data loss is **1 hour of elapsed data**, measured against the formally defined recovery point.

This is a **business acceptance requirement**, not a provider capability statement.

This increment does **not** claim that current backups, PITR, replication, or any GCP configuration currently achieves this. No backup, PITR, or replication mechanism is selected by recording this value.

---

## 6. Business rationale

POA rationale, in business terms only:

- EOS supports important commercial and operational workflows.
- EOS is **not** currently the sole enterprise System of Record for all SEDMC operations.
- Existing operational SoR remains Office / Excel, Outlook / Gmail, WhatsApp, and phone.
- Nevertheless, a prolonged EOS outage would materially disrupt commercial continuity.
- A **4-hour RTO** provides a defined continuity requirement for restoration.
- A **1-hour RPO** limits acceptable EOS data loss while avoiding an unsupported zero-loss requirement.
- These values are Owner-approved business requirements and are **not** derived from current GCP capabilities.
- The values must be validated through future architecture assessment and DR testing.

This increment does **not** invent financial-loss calculations, customer SLAs, regulatory requirements, or contractual obligations to justify the values. No PDPC, PDPA, or other legal-compliance claim is made.

---

## 7. RTO measurement definition

Future DR testing must establish the following. The methodology is **defined as a future requirement**; it is **not** implemented here.

**Start:**  
The formally declared Production disaster/recovery event at the agreed incident start point.

**End:**  
The point at which the required EOS Production functions are operational, accessible, and usable by authorized operators.

This increment does **not** choose the incident-management platform, monitoring system, alerting mechanism, or specific timestamp source.

---

## 8. RPO measurement definition

Future DR testing must establish the following. The methodology is **defined as a future requirement**; it is **not** implemented here.

**Reference point:**  
The latest successfully recoverable EOS transactional/commercial state available before the disaster event.

**Acceptance:**  
Recovered state must demonstrate no more than **1 hour** of acceptable data loss.

This increment does **not** select the backup, PITR, replication, or transaction-log mechanism. It does **not** invent the committed-transaction timestamp source or the integrity-validation procedure.

---

## 9. DR architecture gate

The following sequence is **mandatory**. Stages **must not** be collapsed.

```text
POA RTO/RPO approval                          (this increment)
  → DR architecture assessment
  → candidate architecture selection
  → provider capability / evidence validation
  → Production implementation
  → controlled DR test
  → RTO/RPO measurement
  → remediation if target is missed
  → Production readiness reassessment
```

In particular:

- selecting an architecture is **not** implementation;
- implementation is **not** DR evidence;
- DR evidence is **not** Production readiness;
- a theoretical provider capability is **not** measured EOS RTO/RPO performance.

```text
DR architecture: NOT SELECTED
```

Candidate mechanisms (cross-region read replica; backup/restore-based DR; Advanced DR; other supported recovery mechanisms) remain **unselected**. None is ranked. None is called superior. Automatic cross-region failover remains **not authorized** (H-164).

The future DR architecture must be capable of being evaluated against **both**:

- RTO ≤ 4 hours;
- RPO ≤ 1 hour.

The later architecture assessment must eventually establish, with evidence (none chosen here):

- recovery mechanism;
- recovery sequence;
- dependency recovery;
- database recovery;
- application recovery;
- authentication/access recovery;
- required secrets/configuration recovery;
- DNS/network recovery where applicable;
- backup/PITR/replication dependencies;
- expected recovery duration;
- expected recoverability point;
- operational ownership;
- recovery runbook;
- rollback/return-to-normal process;
- evidence that the actual test met the requirements.

---

## 10. Current architecture directions (unchanged)

H-166 does **not** modify these decisions.

| Component | Current Owner direction | Implementation |
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
| RTO/RPO values | RTO = 4 hours; RPO = 1 hour (this increment) | not measured; not demonstrated |
| Cross-region DR | **OPEN** | not selected |

None of these is implementation-complete.

---

## 11. Residency rule (H-164 preserved)

H-164 remains authoritative:

> Any Production DR architecture that stores, replicates, or restores Production data outside `africa-south1` requires a separate explicit Owner approval.

Therefore:

- RTO/RPO approval does **NOT** constitute cross-region residency approval;
- RTO/RPO approval does **NOT** authorize a secondary region;
- RTO/RPO approval does **NOT** authorize cross-region replication;
- RTO/RPO approval does **NOT** authorize a cross-region DR exception.

```text
CROSS-REGION RESIDENCY EXCEPTION: OPEN
SECONDARY REGION: NOT SELECTED
```

---

## 12. Cloud SQL edition remains OPEN

```text
Cloud SQL edition: NOT SELECTED
```

H-166 does **not** select Enterprise, Enterprise Plus, or any other edition. No edition is approved merely because it appears capable.

The future architecture assessment must evaluate whether the selected edition and configuration can satisfy:

- RTO ≤ 4 hours;
- RPO ≤ 1 hour;
- regional HA;
- backup requirements;
- PITR requirements;
- DR requirements;
- residency requirements;
- operational requirements.

---

## 13. Production blocker update

H-154’s 28-blocker inventory remains authoritative. **No new blocker number is created.** H-166 changes only the **governance interpretation** of item 24. No blocker is closed merely because an Owner direction has been recorded.

### Item 24 — Rollback / DR

**OPEN.** DR architecture remains unselected. POA-approved Production acceptance criteria are RTO ≤ 4 hours and RPO ≤ 1 hour. Architecture selection, implementation, provider evidence, and controlled DR testing remain outstanding.

| # | Gate | After H-166 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; **not fully closed**. Implementation/evidence **OPEN**. |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160 custom `africa-south1` direction; **implementation/evidence OPEN** |
| 15 | Restore / PITR evidence | **OPEN**. H-162 intended PITR `africa-south1`; provider evidence and configuration OPEN. Restore drill still absent. |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN** |
| 22 | Observability / logging | H-161 `africa-south1` log-storage direction; **implementation/evidence OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN.** DR architecture remains unselected. POA-approved Production acceptance criteria are **RTO ≤ 4 hours** and **RPO ≤ 1 hour**. Architecture selection, implementation, provider evidence, and controlled DR testing remain outstanding. Residency exception OPEN. Automatic cross-region failover not authorized. |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

Production is **not** marked READY. Approved values are **not** architecture; architecture is **not** implementation; implementation is **not** measured DR evidence.

---

## 14. ADR-0006 / DP-0006 additive status

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
Production EOS RTO requirement:    ≤ 4 hours (H-166)
Production EOS RPO requirement:    ≤ 1 hour (H-166)
DR architecture:                   NOT SELECTED
Cross-region residency exception:  OPEN
```

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

No Production implementation is authorized. ADR-0012 and ADR-0013 remain OPEN as previously recorded.

---

## 15. Explicit non-authorizations

This decision does **NOT** authorize:

- Production deployment;
- Production infrastructure;
- GCP project creation;
- GCP resource creation;
- Cloud Run deployment;
- Cloud SQL creation;
- database migration;
- backup configuration;
- PITR configuration;
- replication;
- secondary region;
- cross-region DR;
- Cloud SQL edition selection;
- automatic failover;
- manual failover implementation;
- DNS changes;
- secrets/KMS configuration;
- logging configuration;
- Production credentials;
- Production data;
- Production testing;
- DR testing.

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

## 16. Scope boundaries / future requirements (not executed)

Do **not** begin H-167 in this increment. Do **not** start DR architecture implementation, Cloud SQL configuration, GCP provisioning, Production deployment, cross-region evaluation, Cloud SQL edition selection, or Production authorization.

Later work (without preference implied as authorization) must still establish:

- DR architecture assessment against RTO ≤ 4 hours and RPO ≤ 1 hour;
- candidate architecture selection (only after assessment);
- provider capability / evidence validation;
- whether a cross-region residency exception is approved;
- secondary region / country **only if** a cross-region design is later selected and authorized;
- Cloud SQL edition (only after RTO/RPO, residency policy, and architecture);
- Production implementation (only after a named Production grant);
- controlled DR test with measured RTO/RPO;
- remediation if the target is missed;
- Production readiness reassessment.

None of these is performed here.

---

## 17. Repository safety and STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 660 → 661 |
| Files changed this increment | `docs/governance/h-166-eos-rto-rpo-owner-approval-and-dr-architecture-gate.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-166
H-167 NOT CREATED
H-166 is only the formal recording of the POA-approved RTO/RPO
acceptance criteria and the resulting DR architecture gate.
```
