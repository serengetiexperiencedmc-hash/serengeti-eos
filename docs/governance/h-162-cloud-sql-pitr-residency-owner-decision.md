# H-162 — POA Decision: Cloud SQL PITR Transaction-Log Residency

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA requirement that Production EOS Cloud SQL Point-in-Time Recovery (PITR) transaction-log storage should remain within `africa-south1` (Johannesburg) **where the selected Cloud SQL configuration supports that storage location**. An unverified cross-region PITR transaction-log arrangement is **not accepted** as the intended Production residency direction.  
> **NOT** authorization to deploy or configure GCP. **NOT** a Cloud SQL instance. **NOT** PITR enablement, transaction-log storage, or backup-vault configuration.  
> H-154 through H-161, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 656  
**Porcelain after this increment:** 657 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / PITR / Cloud Storage / backup vault / logging / Cloud Run configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-163:** **NOT CREATED**

```text
H-162 STATUS = COMPLETE — PITR RESIDENCY DIRECTION RECORDED, NOT CONFIGURED
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
| Porcelain at start | 656 (matches H-161 after-count) |
| Prior increment | H-161 created only `docs/governance/h-161-cloud-logging-residency-owner-decision.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |

Records read and **not rewritten:** H-154, H-157, H-158, H-159, H-160, H-161; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

---

## 2. POA authority

The Owner/Principal is exercising POA. This increment captures a **design decision only**. It does **not** prove that Google Cloud supports the requested PITR configuration, and it does **not** configure PITR.

---

## 3. Owner PITR decision

> Production EOS Cloud SQL Point-in-Time Recovery (PITR) transaction-log storage should remain within `africa-south1` (Johannesburg), where the selected Cloud SQL configuration supports that storage location. An unverified cross-region PITR transaction-log storage arrangement is NOT accepted as the intended Production residency direction.

```text
PITR TRANSACTION-LOG STORAGE (POA):
Intended location = africa-south1
where the selected Cloud SQL configuration supports that storage location.

Unverified cross-region PITR transaction-log storage is not the
intended Production residency direction.
```

> The Owner has selected africa-south1 as the intended PITR transaction-log storage location, subject to provider and implementation evidence establishing that the selected Cloud SQL configuration supports and actually provides that residency.

This increment does **not** state that the Owner decision proves GCP supports the requested configuration.

---

## 4. Intended Production architecture

| Component | Direction | Implementation |
| --- | --- | --- |
| Cloud Run | `africa-south1` (H-158) | OPEN |
| Cloud SQL PostgreSQL instance | `africa-south1` (H-158) | OPEN |
| Standard Production backups | custom `africa-south1` (H-160) | OPEN |
| Cloud Logging storage | `africa-south1` (H-161) | OPEN |
| PITR transaction-log storage | intended `africa-south1`, subject to provider evidence (this increment) | OPEN |

None of these is implementation-complete.

---

## 5. H-160 continuity

H-160 is **preserved unchanged** and is **not replaced**.

H-160: Production Cloud SQL **standard backups** must use custom `africa-south1`. Default nearest-multi-region backup storage is **not accepted**. H-160 implementation/evidence remains **OPEN**.

---

## 6. H-161 continuity

H-161 is **preserved unchanged**.

H-161: Production EOS Cloud Logging **storage** → `africa-south1`. Default/global storage is not accepted. Implementation and evidence remain **OPEN**. Broader logging / Monitoring / control-plane / query / export residency questions remain **OPEN**. H-162 does **not** imply those questions are resolved.

H-157 PDPC boundary remains: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim.

---

## 7. Standard backup vs PITR residency

> Standard backup residency and PITR transaction-log residency are related but are not automatically identical configuration questions.

This increment does **not** say:

- “Because backups are in africa-south1, PITR is automatically in africa-south1.”
- “PITR is already regionalized.”
- “All transaction logs remain in Johannesburg.”
- “All Cloud SQL recovery data remains in Johannesburg.”

H-159 recorded that PostgreSQL PITR uses transaction logs on instance disk and/or Cloud Storage; PostgreSQL-specific Cloud Storage geography was **not** treated as verified from other engines’ documentation. That evidence gap remains.

---

## 8. Provider evidence requirements

Still required. Do **not** invent answers. The implementation team must later establish:

- whether the selected Cloud SQL **edition** supports the required PITR configuration;
- where transaction logs are **actually** stored;
- whether the storage location can be **explicitly controlled**;
- whether the location can be constrained to `africa-south1`;
- whether any Cloud Storage-based PITR mechanism introduces **another** location;
- whether backup-vault / **enhanced-backup** behaviour changes the residency model;
- whether organization location policies affect the configuration;
- what happens during **regional outage**;
- whether **cross-region recovery** is technically possible and under what conditions.

```text
Owner direction ≠ provider evidence
Owner direction ≠ configured PITR
Owner direction ≠ established actual storage location
```

---

## 9. Unresolved PITR technical questions

Remain **OPEN** (no invented answers):

- disk vs Cloud Storage `transactionalLogStorageState` for the eventual instance;
- transaction-log retention days vs backup retention coupling;
- PITR after instance deletion;
- interaction with H-160 custom backup location;
- enhanced backups / Backup and DR (not selected in H-159; still not selected);
- CMEK implications if used later;
- restore-to-new-instance region constraints.

---

## 10. DR separation

H-162 does **not** decide Disaster Recovery.

```text
DR = OPEN — separate Owner decision required
```

A Johannesburg regional outage does **not** automatically authorize restoration of SEDMC Production data into another geographic region. Do not infer a cross-region DR strategy from the PITR decision. No DR region is selected. Cross-region restoration is **not** authorized. Regional disaster recovery has **not** been designed or tested.

---

## 11. Production blocker reconciliation

H-154’s 28-blocker inventory remains authoritative. H-162 adds an **Owner direction** for PITR transaction-log residency. It does **not** close implementation/evidence gates.

| # | Gate | After H-162 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; **not fully closed** |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160 custom `africa-south1` direction; **implementation/evidence OPEN** |
| **15** | Restore evidence | **OPEN**. Additive: PITR transaction-log **direction** intended `africa-south1`; **provider evidence and configuration OPEN**. Restore drill still absent. |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN** |
| 22 | Observability / logging | H-161 `africa-south1` log-storage direction; **implementation/evidence OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN** — not designed; not authorized by PITR direction |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

Production is **not** marked READY.

---

## 12. ADR-0006 reconciliation

Historical `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION

Cloud Run:                         africa-south1
Cloud SQL PostgreSQL:              africa-south1
Standard backups:                  custom africa-south1
Cloud Logging storage:             africa-south1
PITR transaction-log storage:      intended africa-south1, subject to provider evidence
```

---

## 13. DP-0006 reconciliation

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Provider implementation has **not** occurred. PITR direction is additive; it is **not** completed residency evidence.

ADR-0012 and ADR-0013 remain OPEN as previously recorded.

---

## 14. No-implementation / no-GCP-resource statements

```text
No GCP resources were created.
PITR is not configured.
No Cloud SQL instance was created.
No Cloud Storage bucket was created.
No backup-vault configuration was applied.
No transaction-log storage or retention was configured.
Production remains NOT AUTHORIZED / NOT READY.
```

Application code unchanged. Database schema unchanged. Migration 126 not created. Live migration not run. No credentials used. No DNS change. No Production deployment.

---

## 15. Next-action candidates (not executed)

Do **not** begin H-163 in this increment. Candidates for a later Owner/POA decision, without preference implied as authorization:

- Artifact Registry location (`africa-south1` vs other);
- Secret Manager / Cloud KMS location (ADR-0012 still OPEN);
- DR / restore-to-another-region Owner decision (item 24);
- PITR provider-evidence review against official PostgreSQL docs at implementation time (does not itself configure PITR);
- DPA / subprocessors / Legal review;
- Production authorization grant (only after evidence, not now).

None of these is performed here.

---

## 16. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 656 → 657 |
| Files changed this increment | `docs/governance/h-162-cloud-sql-pitr-residency-owner-decision.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-162
H-163 NOT CREATED
```
